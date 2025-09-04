import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Protect middleware: verifies JWT and attaches user
export const protect = async (req, res, next) => {
  try {
    let token = null;

    if (req.cookies?.token) token = req.cookies.token;
    if (!token && req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      console.log("No token found in request");
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Token decoded successfully for user:", decoded.id);
    } catch (err) {
      console.log("Token verification failed:", err.message);
      return res.status(401).json({ message: "Token is invalid or expired" });
    }

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      console.log("User not found for ID:", decoded.id);
      return res.status(401).json({ message: "User not found" });
    }

    console.log("User authenticated:", user._id, user.email);
    req.user = user;
    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Role-based authorization
export const requireRole = (...roles) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: "Not authenticated" });

  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: "Forbidden: insufficient role" });
  }

  next();
};

// Optional token verification (for reset password links)
export const verifyResetToken = async (req, res, next) => {
  const { token } = req.params;
  if (!token) return res.status(400).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    req.user = user; // attach user to request for reset
    next();
  } catch (err) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }
};
