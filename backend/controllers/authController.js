// controllers/authController.js

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/User.js";
import Coach from "../models/Coach.js";
import Player from "../models/Player.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import sendEmail from "../utils/sendEmail.js";

/* ===================== HELPERS ===================== */
const signToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

const setAuthCookie = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

/* ===================== GOOGLE OAUTH ===================== */
export const googleLogin = asyncHandler(async (req, res) => {
  const { googleId, email, name, picture } = req.body;
  
  if (!googleId || !email || !name) {
    return res.status(400).json({ 
      success: false, 
      message: "Google ID, email, and name are required" 
    });
  }

  // Check if user already exists
  let user = await User.findOne({ email });
  
  if (!user) {
    // Create new user with Google OAuth data
    user = await User.create({
      name,
      email,
      googleId,
      avatar: picture,
      role: "player", // Default role, can be changed later
      isGoogleUser: true
    });

    // Create player profile
    await Player.create({ 
      user: user._id, 
      position: "Midfielder" 
    });
  } else {
    // Update existing user with Google ID if not already set
    if (!user.googleId) {
      user.googleId = googleId;
      user.avatar = picture;
      user.isGoogleUser = true;
      await user.save();
    }
  }

  const token = signToken(user);
  setAuthCookie(res, token);

  // role-based redirect path
  let redirectTo = "/dashboard"; 
  if (user.role === "player") redirectTo = "/player";
  if (user.role === "coach") redirectTo = "/coach";
  if (user.role === "admin") redirectTo = "/admin";

  res.json({
    success: true,
    message: "Google login successful",
    user: { 
      id: user._id, 
      name: user.name, 
      email: user.email, 
      role: user.role,
      avatar: user.avatar 
    },
    token,
    redirectTo,
  });
});

/* ===================== REGISTER ===================== */
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role, expertise, position } = req.body;
  
  // Enhanced validation with detailed error messages
  if (!name || !email || !password) {
    const missing = [];
    if (!name) missing.push("name");
    if (!email) missing.push("email");
    if (!password) missing.push("password");
    return res.status(400).json({ 
      success: false, 
      message: `Missing required fields: ${missing.join(", ")}` 
    });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ 
      success: false, 
      message: "Invalid email format" 
    });
  }

  // Validate password length
  if (password.length < 6) {
    return res.status(400).json({ 
      success: false, 
      message: "Password must be at least 6 characters long" 
    });
  }

  if (role === "admin")
    return res.status(403).json({ success: false, message: "Cannot self-register as admin" });

  const exists = await User.findOne({ email });
  if (exists)
    return res.status(400).json({ success: false, message: "User already exists" });

  try {
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, role: role || "player" });

    if (user.role === "coach") {
      await Coach.create({ user: user._id, expertise: expertise || ["General"] });
    }
    if (user.role === "player") {
      await Player.create({ user: user._id, position: position || "Midfielder" });
    }

    const token = signToken(user);
    setAuthCookie(res, token);

    res.status(201).json({
      success: true,
      message: "Registered successfully",
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      token,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Registration failed. Please try again." 
    });
  }
});

/* ===================== LOGIN ===================== */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ success: false, message: "Invalid credentials" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ success: false, message: "Invalid credentials" });

  const token = signToken(user);
  setAuthCookie(res, token);

  // role-based redirect path
  let redirectTo = "/dashboard"; 
  if (user.role === "player") redirectTo = "/player";
  if (user.role === "coach") redirectTo = "/coach";
  if (user.role === "admin") redirectTo = "/admin";

  res.json({
    success: true,
    message: "Login successful",
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
    token,
    redirectTo, // 👈 frontend uses this to navigate
  });
});



/* ===================== LOGOUT ===================== */
export const logout = asyncHandler(async (req, res) => {
  res.clearCookie("token");
  res.json({ success: true, message: "Logged out successfully" });
});

/* ===================== PROFILE ===================== */
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  if (!user) return res.status(404).json({ success: false, message: "User not found" });
  res.json(user);
});

export const profile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  if (!user) return res.status(404).json({ success: false, message: "User not found" });

  let profile = null;
  if (user.role === "coach") profile = await Coach.findOne({ user: user._id });
  if (user.role === "player")
    profile = await Player.findOne({ user: user._id }).populate({ path: "coach", select: "user" });

  res.json({ success: true, user, profile });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { name, email } = req.body;
  console.log("Updating user profile for user:", req.user.id);
  console.log("Update data:", { name, email });
  
  const updates = {};
  if (name) updates.name = name;
  if (email) updates.email = email;

  const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select("-password");
  if (!user) return res.status(404).json({ success: false, message: "User not found" });

  console.log("User profile updated:", user);
  res.json(user);
});

/* ===================== REFRESH TOKEN ===================== */
export const refresh = asyncHandler(async (req, res) => {
  const token = signToken(req.user);
  setAuthCookie(res, token);
  res.json({ success: true, message: "Token refreshed", token });
});

/* ===================== FORGOT PASSWORD ===================== */
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ success: false, message: "User not found" });

  const resetToken = crypto.randomBytes(32).toString("hex");
  const resetTokenHash = crypto.createHash("sha256").update(resetToken).digest("hex");

  user.resetPasswordToken = resetTokenHash;
  user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 mins
  await user.save({ validateBeforeSave: false });

  const clientUrl =
    process.env.NODE_ENV === "production" ? process.env.CLIENT_URL : "http://localhost:5173";
  const resetUrl = `${clientUrl}/reset-password/${resetToken}`;

  const message = `
    <h3>Password Reset Request</h3>
    <p>Click the link below to reset your password:</p>
    <a href="${resetUrl}" target="_blank">${resetUrl}</a>
    <p>This link will expire in 15 minutes.</p>
  `;

  try {
    await sendEmail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Password Reset",
      html: message,
      text: `Copy and paste this link in your browser to reset your password: ${resetUrl}`,
    });

    res.json({ success: true, message: "Reset link sent to your email" });
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });

    res.status(500).json({ success: false, message: "Email could not be sent", error: err.message });
  }
});

/* ===================== RESET PASSWORD ===================== */
export const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  if (!password) return res.status(400).json({ success: false, message: "Password is required" });

  const resetTokenHash = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    resetPasswordToken: resetTokenHash,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) return res.status(400).json({ success: false, message: "Invalid or expired token" });

  user.password = await bcrypt.hash(password, 10);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  res.json({ success: true, message: "Password reset successful. You can now log in." });
});


