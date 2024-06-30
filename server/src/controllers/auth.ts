import e, { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User";
import { generateUsername } from "unique-username-generator";
import { image } from "d3";
import Otp from "../models/Otp";

type payload = {
  id: string;
  email: string;
};

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || "samplejwtsecret";

export const signup = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user) {
      return res.status(409).json({ message: "User already exists" });
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    const username = generateUsername();

    const newUser = await User.create({
      email,
      password: hash,
      username,
    });

    const payload = {
      id: newUser._id,
      email: newUser.email,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });

    res.status(201).json({
      success: true,
      message: "User signed up successfully",
      token,
      user: {
        id: newUser._id,
        username,
        email: newUser.email,
        isSubscribed: newUser.isSubscribed,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error while signing up user, please try again.",
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const isValid = bcrypt.compareSync(password, user.password);

    if (!isValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    console.log(isValid);

    const payload = {
      id: user._id,
      email: user.email,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });

    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        isSubscribed: user.isSubscribed,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error while logging in user, please try again.",
    });
  }
};

export const googleLogin = async (req: Request, res: Response) => {
  try {
    const user: any = req.user;
    if (!user || !user.emails || !user.emails[0].value) {
      return res.status(401).json({ message: "Login failed" });
    }

    const email = user.emails[0].value;
    const name = user.displayName;
    const userExists = await User.findOne({ email });

    if (userExists) {
      const payload = {
        id: userExists._id,
        email: userExists.email,
      };

      const userDetails = {
        id: userExists._id,
        username: userExists.username,
        email: userExists.email,
        isSubscribed: userExists.isSubscribed,
        imageUrl: userExists.imageUrl,
      };

      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
      res.cookie("token", token);
      res.cookie("user", JSON.stringify(userDetails));
      res.redirect(`http://localhost:5173/u/${userExists.username}`);
    } else {
      const username = generateUsername();
      console.log("username", username);

      const newUser = await User.create({
        email,
        name,
        username,
        imageUrl: user.photos[0].value ?? null,
      });

      const payload = {
        id: newUser._id,
        email: newUser.email,
      };

      const userDetails = {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        isSubscribed: newUser.isSubscribed,
        imageUrl: newUser.imageUrl,
      };

      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
      res.cookie("token", token);
      res.cookie("user", JSON.stringify(userDetails));
      res.redirect(`http://localhost:5173/u/${newUser.username}`);
    }
  } catch (error) {
    console.log("Error while logging in with Google", error);
    res.status(500).redirect("http://localhost:5173/login");
  }
};

export const githubLogin = async (req: Request, res: Response) => {
  try {
    const user: any = req.user;

    if (!user) {
      return res.status(401).json({ message: "Login failed" });
    }

    const githubAccount = user.profileUrl;
    const userName = user.username;

    const userExists = await User.findOne({ githubAccount });

    if (userExists) {
      const payload = {
        id: userExists._id,
        githubAccount: userExists.githubAccount,
      };

      const userDetails = {
        id: userExists._id,
        username: userExists.username,
        githubAccount: userExists.githubAccount,
        isSubscribed: userExists.isSubscribed,
        imageUrl: userExists.imageUrl,
      };

      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
      res.cookie("token", token);
      res.cookie("user", JSON.stringify(userDetails));
      res.redirect(`http://localhost:5173/u/${userExists.username}`);
    } else {
      const username = generateUsername();

      const newUser = await User.create({
        githubAccount,
        name: userName,
        username,
        imageUrl: user.photos[0].value ?? null,
      });

      const payload = {
        id: newUser._id,
        githubAccount: newUser.githubAccount,
      };

      const userDetails = {
        id: newUser._id,
        username: newUser.username,
        githubAccount: newUser.githubAccount,
        isSubscribed: newUser.isSubscribed,
        imageUrl: newUser.imageUrl,
      };

      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
      res.cookie("token", token);
      res.cookie("user", JSON.stringify(userDetails));
      res.redirect(`http://localhost:5173/u/${newUser.username}`);
    }
  } catch (error) {
    console.log("Error while logging in with Github", error);
    res.redirect("http://localhost:5173/login");
  }
};

export const handleSendOtp = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    console.log("otp", otp);
    // Logic to send otp to this email
    await Otp.create({ userId, otp });
    res.status(200).json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.log("Error while sending OTP", error);
    res
      .status(500)
      .json({ success: false, message: "Error while sending OTP" });
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

export const handleUpdatePassword = async (req: Request, res: Response) => {
  try {
    const username = req.params.username;
    const { currentPassword, newPassword } = req.body;

    const user:any = await User.findOne({username});

    if(!user) {
      return res.status(404).json({ success: false, message: "User not found" })
    } 

    if(user.password) {
      const isValid = bcrypt.compareSync(currentPassword, user.password);
      if(!isValid) {
        return res.status(400).json({ success: false, message: "Invalid password" })
      }
    }
    
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(newPassword, salt);
    await User.updateOne({ _id: user._id }, { $set: { password: hashedPassword } });
    return res.status(200).json({ success: true, message: "Password updated successfully" })
  } catch (error) {
    console.log("Error while updating password", error);
    res.status(500).json({ success: false, message: "Error while updating password" })
  }
}
