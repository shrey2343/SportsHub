import express from "express";
import {
  register,
  login,
  logout,
  profile,
  getMe,
  updateProfile,
  refresh,
  forgotPassword,
  resetPassword,
  googleLogin,
} from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/google-login", googleLogin); // Google OAuth login

// Forgot / Reset password routes (public)
router.post("/forgot-password", forgotPassword); // Send reset link
router.post("/reset-password/:token", resetPassword); // Reset with token

// Protected routes
router.get("/me", protect, getMe);
router.get("/profile", protect, profile);
router.put("/profile", protect, updateProfile);
router.get("/refresh", refresh);

// Role-based dashboards
router.get("/player-dashboard", protect, (req, res) => {
  if (req.user.role !== "player") {
    return res.status(403).json({ message: "Access denied: Players only" });
  }
  res.json({ message: "Welcome to the Player Dashboard" });
});

router.get("/coach-dashboard", protect, (req, res) => {
  if (req.user.role !== "coach") {
    return res.status(403).json({ message: "Access denied: Coaches only" });
  }
  res.json({ message: "Welcome to the Coach Dashboard" });
});

router.get("/admin-dashboard", protect, (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied: Admins only" });
  }
  res.json({ message: "Welcome to the Admin Dashboard" });
});

export default router;
