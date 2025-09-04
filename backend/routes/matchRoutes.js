// routes/matchRoutes.js
import express from "express";
import {
  createMatch,
  getMatches,
  getMatchById,
  updateMatchScore,
  updateMatchStats,
  liveUpdate,
  getUpcomingMatches,
  getMatchHighlights,
  deleteMatch
} from "../controllers/matchController.js";
import { protect, requireRole } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.get("/", getMatches);
router.get("/upcoming", getUpcomingMatches);
router.get("/:id", getMatchById);
router.get("/:id/highlights", getMatchHighlights);

// Protected routes
router.use(protect);

// Match management (coaches and admins only)
router.post("/", requireRole('coach', 'admin'), createMatch);
router.put("/:id/score", requireRole('coach', 'admin'), updateMatchScore);
router.put("/:id/stats", requireRole('coach', 'admin'), updateMatchStats);
router.post("/:id/live", requireRole('coach', 'admin'), liveUpdate);
router.delete("/:id", requireRole('coach', 'admin'), deleteMatch);

export default router;
