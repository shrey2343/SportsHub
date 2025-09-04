// routes/achievementRoutes.js
import express from "express";
import {
  createAchievement,
  getAchievements,
  getAchievementById,
  getAchievementsByCategory,
  getSeasonalAchievements,
  updateAchievement,
  deleteAchievement,
  getUserAchievements,
  getMyAchievements,
  getUserAchievementStats,
  getAchievementLeaderboard,
  checkAchievementUnlock,
  unlockAchievement,
  updateAchievementProgress,
  claimRewards,
  shareAchievement,
  verifyAchievement,
  getAchievementProgress,
  bulkUnlockAchievements
} from "../controllers/achievementController.js";
import { protect, requireRole } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.get("/", getAchievements);
router.get("/category", getAchievementsByCategory);
router.get("/seasonal", getSeasonalAchievements);
router.get("/:id", getAchievementById);
router.get("/leaderboard", getAchievementLeaderboard);

// Protected routes
router.use(protect);

// Current user achievement routes
router.get("/user/me", getMyAchievements);
router.post("/user/me/share/:achievementId", shareAchievement);

// User achievement routes
router.get("/user/:userId", getUserAchievements);
router.get("/user/:userId/stats", getUserAchievementStats);
router.get("/user/:userId/progress", getAchievementProgress);
router.get("/user/:userId/check/:achievementId", checkAchievementUnlock);
router.post("/user/:userId/unlock/:achievementId", unlockAchievement);
router.put("/user/:userId/progress/:achievementId", updateAchievementProgress);
router.post("/user/:userId/claim/:achievementId", claimRewards);
router.post("/user/:userId/share/:achievementId", shareAchievement);

// Achievement management (coaches and admins only)
router.post("/", requireRole('coach', 'admin'), createAchievement);
router.put("/:id", requireRole('coach', 'admin'), updateAchievement);
router.delete("/:id", requireRole('coach', 'admin'), deleteAchievement);
router.post("/user/:userId/bulk-unlock", requireRole('coach', 'admin'), bulkUnlockAchievements);
router.post("/user/:userId/verify/:achievementId", requireRole('coach', 'admin'), verifyAchievement);

export default router;
