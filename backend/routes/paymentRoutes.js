import express from "express";
import { protect } from "../middleware/auth.js";
import {
  createPaymentOrder,
  verifyPayment,
  getPaymentHistory,
  getPaymentStatus
} from "../controllers/paymentController.js";

const router = express.Router();

// Test route to check environment variables
router.get("/test-env", (req, res) => {
  res.json({
    razorpayKeyId: process.env.RAZORPAY_KEY_ID ? 'Set' : 'Not Set',
    razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET ? 'Set' : 'Not Set',
    environment: process.env.NODE_ENV || 'development',
    message: 'Environment variables check'
  });
});

// Simple test route to verify backend is working
router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Payment routes are working",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Payment routes
router.post("/create-order", protect, createPaymentOrder);
router.post("/verify", protect, verifyPayment);
router.get("/history", protect, getPaymentHistory);
router.get("/status/:paymentId", protect, getPaymentStatus);

export default router;
