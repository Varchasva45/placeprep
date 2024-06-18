import { Request, Response } from "express";
import User from "../models/User";
import Submission from "../models/Submission";

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
    res
      .status(500)
      .json({
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

    console.log(user);

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
