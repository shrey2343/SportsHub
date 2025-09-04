// routes/performanceRoutes.js
import express from "express";
import {
  getPlayerPerformance,
  getMyPerformance,
  getMyPerformanceTrends,
  getMyPerformanceInsights,
  comparePlayers,
  getPerformanceLeaderboard,
  getPerformanceTrends,
  getTeamPerformance,
  getPerformanceInsights
} from "../controllers/performanceController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// All performance routes require authentication
router.use(protect);

// Current user performance routes
router.get("/player/me", getMyPerformance);
router.get("/player/me/trends", getMyPerformanceTrends);
router.get("/player/me/insights", getMyPerformanceInsights);

// Player performance by ID
router.get("/player/:playerId", getPlayerPerformance);
router.get("/player/:playerId/trends", getPerformanceTrends);
router.get("/player/:playerId/insights", getPerformanceInsights);

// Performance comparison and leaderboards
router.post("/compare", comparePlayers);
router.get("/leaderboard", getPerformanceLeaderboard);

// Team performance
router.get("/team", getTeamPerformance);

export default router;
