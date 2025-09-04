// app.js
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

// Routes
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import coachRoutes from "./routes/coachRoutes.js";
import playerRoutes from "./routes/playerRoutes.js";
import clubRoutes from "./routes/clubRoutes.js";
import sportRoutes from "./routes/sportRoutes.js";
import matchRoutes from "./routes/matchRoutes.js";
import tournamentRoutes from "./routes/tournamentRoutes.js";
import performanceRoutes from "./routes/performanceRoutes.js";
import achievementRoutes from "./routes/achievementRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import performanceStatsRoutes from "./routes/performanceStatsRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";

// Middleware
import { notFound, errorHandler } from "./middleware/error.js";
import { protect, requireRole } from "./middleware/auth.js";

// Load environment variables
dotenv.config();

// CORS config MUST be defined before using
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://sportshub-frontend.onrender.com"
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    // Allow localhost with any port for development
    if (origin.includes('localhost')) return callback(null, true);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  optionsSuccessStatus: 200, // For legacy browser support
};

// Initialize express app
const app = express();

// Middlewares (CORS first so headers are present even on body parse errors)
app.use(cors(corsOptions));
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));
app.use(cookieParser());
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
  crossOriginEmbedderPolicy: false,
}));
app.use(morgan("dev"));

// Health check route
app.get("/", (req, res) => res.send("Sports App Backend Running 🚀"));

// Test route for club approval system
app.get("/test-club-approval", (req, res) => {
  res.json({ 
    message: "Club approval system is working!",
    endpoints: {
      createClub: "POST /api/clubs (coach only)",
      getPendingApprovals: "GET /api/admins/approvals (admin only)",
      approveClub: "PUT /api/admins/clubs/:clubId/approve (admin only)",
      rejectClub: "PUT /api/admins/clubs/:clubId/reject (admin only)",
      removePlayer: "DELETE /api/coaches/clubs/:clubId/players/:playerId (coach only)"
    }
  });
});

// API Routes
app.use("/api/auth", authRoutes);

// Role-protected routes
app.use("/api/admins", protect, requireRole("admin"), adminRoutes);
app.use("/api/users", protect, requireRole("admin"), userRoutes);
app.use("/api/coaches", protect, requireRole("coach", "admin"), coachRoutes);
app.use("/api/players", protect, requireRole("player", "coach", "admin"), playerRoutes);

// Open access routes
app.use("/api/clubs", clubRoutes);
app.use("/api/sports", sportRoutes);
app.use("/api/matches", matchRoutes);
app.use("/api/tournaments", tournamentRoutes);
app.use("/api/performance", performanceRoutes);
app.use("/api/achievements", achievementRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/performance-stats", performanceStatsRoutes);
app.use("/api/notifications", notificationRoutes);

// Serve static uploads (avatars)
app.use("/uploads", express.static(path.resolve("uploads")));

// Error handlers
app.use(notFound);
app.use(errorHandler);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('🚨 Unhandled Promise Rejection:', err);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('🚨 Uncaught Exception:', err);
  process.exit(1);
});

// Start server
const startServer = async () => {
  try {
    await connectDB();
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Server failed to start:", error.message);
    process.exit(1);
  }
};

startServer();
