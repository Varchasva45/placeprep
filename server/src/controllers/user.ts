import { Request, Response } from "express";
import User from "../models/User";
import Submission from "../models/Submission";
import Otp from "../models/Otp";

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
      return res
        .status(409)
        .json({
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

    await User.updateOne(
      { _id: user },
      { $set: { email } },
    );
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

