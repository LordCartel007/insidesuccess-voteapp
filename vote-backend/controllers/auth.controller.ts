// @ts-nocheck
import { User } from "../models/user.model.js";
import express, { Request, Response } from "express";

import crypto from "crypto"; // for generating random tokens

// for password hashing
import bcryptjs from "bcryptjs";

import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendResetSuccessEmail,
} from "../mailtrap/emails.js";

// Types for responses
interface AuthRequest extends Request {
  userId?: string;
}

export const signup = async (req: Request, res: Response) => {
  const email = (req.body.email as string).toLowerCase(); // 👈 making email lower case
  const { password, name } = req.body as { password: string; name: string };
  try {
    if (!email || !password || !name) {
      throw new Error("All fields are required");
    }

    const userAlreadyExists = await User.findOne({ email });
    // checking if users exist
    if (userAlreadyExists) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Generate a random 6-digit verification token
    const verificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const user = new User({
      email,
      password: hashedPassword,
      name,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
      provider: "credentials",
    });

    // Save the user to the database

    await user.save();

    //jwt
    generateTokenAndSetCookie(res, user._id);

    await sendVerificationEmail(user.email, verificationToken);

    const userObj = user.toObject();
    userObj.password = undefined;
    res.status(201).json({
      success: true,
      message: "User created successfully",
      // spreading the user object to get all the user data then making the password null
      // user: {
      //   ...user._doc,
      //   password: undefined,
      // },
      user: userObj,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// controllers/authController.js
export const resendVerificationEmail = async (req: Request, res: Response) => {
  const { email } = req.body as { email: string };

  try {
    // Find existing user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "User is already verified",
      });
    }

    // Generate new 6-digit token
    const verificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    user.verificationToken = verificationToken;
    user.verificationTokenExpiresAt = new Date(
      Date.now() + 24 * 60 * 60 * 1000
    ); // 24 hours
    await user.save();

    // Send email
    await sendVerificationEmail(user.email, verificationToken);

    res.status(200).json({
      success: true,
      message: "Verification email resent successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to resend verification email",
    });
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  // 1 2 3 4 5 6
  const { code } = req.body as { code: string };
  try {
    const user = await User.findOne({
      verificationToken: code,
      // checking if the token is not expired
      verificationTokenExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification code",
      });
    }
    //  turning is verified in the database to true
    user.isVerified = true;

    // changing the verification token and expires at in database to null
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    // saving the user to the database
    await user.save();

    await sendWelcomeEmail(user.email, user.name);

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    console.error("Error in verify email:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const login = async (req: Request, res: Response) => {
  const email = (req.body.email as string).toLowerCase();
  const { password } = req.body as { password: string };
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }
    // checking if the password is correct
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // ⛔️ If user exists but not verified
    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Email not verified",
        redirectToVerify: true, // 👈 frontend can check this
        userId: user._id, // optional: if you want to auto-send the email or prefill email
      });
    }

    generateTokenAndSetCookie(res, user._id);
    user.lastLogin = new Date();
    await user.save();

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error: any) {
    console.log("Error in login:", error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
    });
    return res
      .status(200)
      .json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Logout failed" });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body as { email: string };
  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    //CHECKING IF THE USER EXISTS
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }
    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetTokenExpiresAt;

    await user.save();

    //send email for password reset
    // reset url using the token
    await sendPasswordResetEmail(
      user.email,
      `${process.env.CLIENT_URL}/reset-password/${resetToken}`
    ); // replace with your frontend URL

    res.status(200).json({
      success: true,
      message: "Password reset link sent to your email",
    });
  } catch (error: any) {
    console.log("Error in forgot password:", error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

//reset password
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token } = req.params as { token: string };
    const { password } = req.body as { password: string };

    // find the user and change token
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token",
      });
    }
    //update password
    const hashedPassword = await bcryptjs.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;
    await user.save();

    await sendResetSuccessEmail(user.email);

    res
      .status(200)
      .json({ sucess: true, message: "Password reset successfully" });
  } catch (error: any) {
    console.log("Error in reset password:", error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

//checking if user is authenticated
export const checkAuth = async (req: AuthRequest, res: Response) => {
  try {
    // removing password from the user object by using select -password
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }
    res.status(200).json({ sucess: true, user });
  } catch (error: any) {
    console.log("Error in checkAuth:", error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

//GOOGLE LOGIN

export const googleLogin = async (req: Request, res: Response) => {
  const { email, name, picture } = req.body;

  if (!email || !name) {
    return res.status(400).json({
      success: false,
      message: "Missing required Google user info",
    });
  }

  try {
    // Check if user exists
    let user = await User.findOne({ email });

    if (user) {
      // Update last login time
      user.lastLogin = new Date();
      await user.save();

      // ✅ Set token as cookie
      generateTokenAndSetCookie(res, user._id);

      return res.status(200).json({
        success: true,
        message: "Google login successful",
        user: {
          ...user._doc,
          password: undefined,
        },
      });
    }

    // Create new user if not found
    user = new User({
      email: email.toLowerCase(),
      name,
      picture,
      isVerified: true,
      provider: "google", // To differentiate google sign in from normal and make password not required as in the model schema
      lastLogin: new Date(),
    });

    await user.save();
    await sendWelcomeEmail(user.email, user.name);

    // ✅ Set token as cookie
    generateTokenAndSetCookie(res, user._id);

    res.status(201).json({
      success: true,
      message: "New Google user created and logged in",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error: any) {
    console.error("Google login error:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error during Google login",
    });
  }
};

// GET /api/users - fetch all users (excluding password)
// Named function for fetching users
export const userFetcher = async (req: Request, res: Response) => {
  try {
    const users = await User.find().select(
      "-password -verificationToken -verificationTokenExpiresAt -resetPasswordToken -resetPasswordExpiresAt"
    );
    res.status(200).json({
      success: true,
      users,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch users",
    });
  }
};

export const createDecisionRoom = async (req: Request, res: Response) => {
  try {
    const {
      name,
      description,
      votingOptions,
      expiry,
      email,
    }: {
      name: string;
      description: string;
      votingOptions: string[];
      expiry: string;
      email: string;
    } = req.body;

    // Validate required fields

    if (!email || !name || !description || !votingOptions || !expiry) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    // Ensure votingOptions has 2 to 5 items
    if (votingOptions.length < 2 || votingOptions.length > 5) {
      return res
        .status(400)
        .json({ success: false, message: "Options must be between 2 and 5" });
    }

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Add the new decision to user's decisions array
    const newDecision = {
      decisionname: name,
      decisiondescription: description,
      decisionoptions: votingOptions,
      decisionexpiryTime: expiry,
      decisionvoteCount: 0,
    };

    user.decisions.push(newDecision);
    await user.save();

    return res.status(201).json({
      success: true,
      message: "Decision room created successfully",
      decision: newDecision,
    });
  } catch (error) {
    console.error("Error creating decision room:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
