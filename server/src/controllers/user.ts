import { Request, Response } from "express";
import User from "../models/User";
import Submission from "../models/Submission";
import Otp from "../models/Otp";
import Post from "../models/Posts";
import Comment from "../models/Comments";
import mongoose from "mongoose";

export const getUserDetails = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ success: true, userDetails: user });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Error while fetching user details" });
  }
};

export const getSubmissionDetails = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const result = req.query.result;
    const submissions = await Submission.find({ userId, result: "Accepted" })
      .limit(10)
      .sort({ createdAt: -1 })
      .select("problemId.title createdAt");
    res.status(200).json({ success: true, submissions });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error while fetching submission details",
    });
  }
};

export const updateUserDetails = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const { updatedData } = req.body;
    await User.updateOne({ _id: userId }, { $set: updatedData });
    const user = await User.findById(userId);

    if (user) {
      res.status(200).json({ success: true, userDetails: user });
    } else {
      res.status(404).json({ success: false, message: "User not found" });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Error while updating user details" });
  }
};

export const updateUsername = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const { username } = req.body;

    const user = await User.findOne({ username });

    if (user) {
      res
        .status(400)
        .json({ success: false, message: "Username already exists" });
    } else {
      await User.updateOne({ _id: userId }, { $set: { username } });
      res.status(200).json({ success: true, username });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Error while updating user details" });
  }
};

export const handleUpdateEmail = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const { email, otp } = req.body;

    console.log(email, otp, typeof otp);

    const user = await User.findById({ _id: userId });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const userWithSameEmail = await User.findOne({ email });

    if (userWithSameEmail) {
      return res.status(409).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    const otpData = await Otp.findOne({ userId })
      .limit(1)
      .sort({ createdAt: -1 });

    console.log("otpData", otpData, typeof otpData!.otp);

    if (!otpData || otpData.otp != otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    const otpExpiry = new Date(otpData.createdAt).getTime() + 60000;

    if (otpExpiry < new Date().getTime()) {
      return res.status(400).json({ success: false, message: "OTP expired" });
    }

    await User.updateOne({ _id: user }, { $set: { email } });
    res
      .status(200)
      .json({ success: true, message: "Email updated successfully", email });
  } catch (error) {
    console.log("Error while updating email", error);
    res
      .status(500)
      .json({ success: false, message: "Error while updating email" });
  }
};

export const postController = async (req: Request, res: Response) => {
  try {
    const { title, content, tag, createdBy, updatedBy, username } = req.body;
    const post = new Post({
      title,
      content,
      tag,
      createdBy,
      updatedBy,
      username,
    });
    await post.save();
    res.status(201).json({ success: true, post });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Error while posting submission" });
  }
};

export const getPosts = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;
    const sortedBy = (req.query.sortedBy as string) || "createdAt";
    const skip = (page - 1) * pageSize;
    const posts = await Post.find({ isDeleted: false })
      .sort({ [sortedBy]: -1 })
      .skip(skip)
      .limit(pageSize);

    const totalPosts = await Post.countDocuments();
    const totalPages = Math.ceil(totalPosts / pageSize);

    res
      .status(200)
      .json({ success: true, posts, totalPages, currentPage: page });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Error while fetching posts" });
  }
};

export const getPost = async (req: Request, res: Response) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId)
      .populate({
        path: "comments",
        match: { isDeleted: false },
        options: { sort: { createdAt: -1 } },
      })
      .exec();

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json({ success: true, post });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Error while fetching post" });
  }
};

export const updatePostController = async (req: Request, res: Response) => {
  try {
    const postId = req.params.id;
    const { updatedData, userId } = req.body;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (updatedData == "like") {
      const likedPosts = user.likedPosts;
      if (likedPosts.includes(postId)) {
        const index = likedPosts.indexOf(postId);
        likedPosts.splice(index, 1);
        await user.save();
        post.likes -= 1;
      } else {
        likedPosts.push(postId);
        await user.save();
        post.likes += 1;
      }
    } else if (updatedData == "dislike") {
      const dislikedPosts = user.dislikedPosts;
      if (dislikedPosts.includes(postId)) {
        const index = dislikedPosts.indexOf(postId);
        dislikedPosts.splice(index, 1);
        await user.save();
        post.dislikes -= 1;
      } else {
        dislikedPosts.push(postId);
        await user.save();
        post.dislikes += 1;
      }
    } else {
      post.views += 1;
    }
    await post.save();
    res.status(200).json({ success: true, post });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Error while updating post" });
  }
};

export const postCommentController = async (req: Request, res: Response) => {
  try {
    const postId = req.params.id;
    const { content, createdBy, updatedBy, username } = req.body;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    const comment = new Comment({
      content,
      postId,
      createdBy,
      updatedBy,
      username,
    });
    await comment.save();
    post.comments.push(comment._id as mongoose.Types.ObjectId);
    await post.save();
    res.status(200).json({ success: true, comment });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Error while posting comment" });
  }
};

export const deletePostController = async (req: Request, res: Response) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post || post.isDeleted === true) {
      return res.status(404).json({ message: "Post not found" });
    }
    post.isDeleted = true;
    await post.save();
    res.status(200).json({ success: true, post });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Error while deleting post" });
  }
};

export const deleteCommentController = async (req: Request, res: Response) => {
  try {
    const commentId = req.params.id;
    const comment = await Comment.findById(commentId);
    if (!comment || comment.isDeleted === true) {
      return res.status(404).json({ message: "Comment not found" });
    }
    comment.isDeleted = true;
    await comment.save();
    res.status(200).json({ success: true, comment });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Error while deleting comment" });
  }
};

export const editPostController = async (req: Request, res: Response) => {
  try {
    const postId = req.params.id;
    const { title, tag, content } = req.body;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    post.title = title;
    post.tag = tag;
    post.content = content;
    await post.save();
    res.status(200).json({ success: true, post });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Error while updating post" });
  }
};

export const editCommentController = async (req: Request, res: Response) => {
  try {
    const commentId = req.params.id;
    const { content } = req.body;
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    comment.content = content;
    await comment.save();
    res.status(200).json({ success: true, comment });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Error while updating comment" });
  }
};
