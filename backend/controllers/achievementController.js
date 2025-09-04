// controllers/achievementController.js
import Achievement from "../models/Achievement.js";
import UserAchievement from "../models/UserAchievement.js";
import Performance from "../models/Performance.js";
import Player from "../models/Player.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

// Create a new achievement
export const createAchievement = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    type,
    category,
    level,
    tier,
    requirements,
    rewards,
    icon,
    badge,
    color,
    rarity,
    difficulty,
    availableFrom,
    availableUntil,
    isSeasonal,
    season,
    progressType,
    maxProgress,
    scope,
    club
  } = req.body;

  // Validate required fields
  if (!name || !description || !icon || !badge) {
    return res.status(400).json({
      success: false,
      message: "Name, description, icon, and badge are required"
    });
  }

  // Check if user has permission to create achievements
  if (req.user.role !== 'admin' && req.user.role !== 'coach') {
    return res.status(403).json({
      success: false,
      message: "Only coaches and admins can create achievements"
    });
  }

  const achievement = await Achievement.create({
    name,
    description,
    type: type || 'milestone',
    category: category || 'scoring',
    level: level || 'bronze',
    tier: tier || 1,
    requirements: requirements || {},
    rewards: rewards || {},
    icon,
    badge,
    color: color || '#FFD700',
    rarity: rarity || 'common',
    difficulty: difficulty || 1,
    availableFrom: availableFrom ? new Date(availableFrom) : undefined,
    availableUntil: availableUntil ? new Date(availableUntil) : undefined,
    isSeasonal: isSeasonal || false,
    season,
    progressType: progressType || 'cumulative',
    maxProgress: maxProgress || 1,
    scope: scope || 'global',
    createdBy: req.user._id,
    club
  });

  res.status(201).json({
    success: true,
    message: "Achievement created successfully",
    achievement
  });
});

// Get all achievements with filtering
export const getAchievements = asyncHandler(async (req, res) => {
  const {
    type,
    category,
    level,
    rarity,
    scope,
    club,
    isActive,
    page = 1,
    limit = 20
  } = req.query;

  const query = {};

  // Apply filters
  if (type) query.type = type;
  if (category) query.category = category;
  if (level) query.level = level;
  if (rarity) query.rarity = rarity;
  if (scope) query.scope = scope;
  if (club) query.club = club;
  if (isActive !== undefined) query.isActive = isActive === 'true';

  const skip = (page - 1) * limit;

  const achievements = await Achievement.find(query)
    .populate('club', 'name logo')
    .sort({ difficulty: 1, tier: 1, level: 1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Achievement.countDocuments(query);

  res.json({
    success: true,
    achievements,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit)
    }
  });
});

// Get achievement by ID
export const getAchievementById = asyncHandler(async (req, res) => {
  const achievement = await Achievement.findById(req.params.id)
    .populate('club', 'name logo')
    .populate('createdBy', 'name');

  if (!achievement) {
    return res.status(404).json({
      success: false,
      message: "Achievement not found"
    });
  }

  res.json({
    success: true,
    achievement
  });
});

// Get achievements by category
export const getAchievementsByCategory = asyncHandler(async (req, res) => {
  const { category } = req.query;
  
  if (!category) {
    return res.status(400).json({
      success: false,
      message: "Category parameter is required"
    });
  }

  const achievements = await Achievement.find({ 
    category,
    isActive: true 
  }).sort({ difficulty: 1, name: 1 });

  res.json({
    success: true,
    achievements
  });
});

// Get current user's achievements
export const getMyAchievements = asyncHandler(async (req, res) => {
  try {
    // Find the player record for the current user
    const player = await Player.findOne({ user: req.user._id });
    if (!player) {
      return res.status(404).json({
        success: false,
        message: "Player profile not found"
      });
    }

    // Get user's achievements
    const userAchievements = await UserAchievement.find({ 
      user: req.user._id 
    }).populate('achievement');

    // Get all available achievements
    const allAchievements = await Achievement.find({ isActive: true });

    // Calculate progress for each achievement
    const achievementsWithProgress = allAchievements.map(achievement => {
      const userAchievement = userAchievements.find(ua => 
        ua.achievement._id.toString() === achievement._id.toString()
      );

      return {
        ...achievement.toObject(),
        unlocked: !!userAchievement,
        unlockedAt: userAchievement?.unlockedAt,
        progress: userAchievement?.progress || 0,
        maxProgress: achievement.maxProgress || 1,
        progressPercentage: Math.min(
          ((userAchievement?.progress || 0) / (achievement.maxProgress || 1)) * 100, 
          100
        )
      };
    });

    res.json({
      success: true,
      userAchievements: achievementsWithProgress,
      totalUnlocked: userAchievements.length,
      totalAvailable: allAchievements.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching achievements",
      error: error.message
    });
  }
});

// Get seasonal achievements
export const getSeasonalAchievements = asyncHandler(async (req, res) => {
  const { season } = req.query;

  if (!season) {
    return res.status(400).json({
      success: false,
      message: "Season is required"
    });
  }

  const achievements = await Achievement.getSeasonal(season);

  res.json({
    success: true,
    achievements
  });
});

// Update achievement
export const updateAchievement = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  const achievement = await Achievement.findById(id);
  if (!achievement) {
    return res.status(404).json({
      success: false,
      message: "Achievement not found"
    });
  }

  // Check if user has permission to update achievement
  if (req.user.role !== 'admin' && req.user.role !== 'coach') {
    return res.status(403).json({
      success: false,
      message: "Only coaches and admins can update achievements"
    });
  }

  const updatedAchievement = await Achievement.findByIdAndUpdate(
    id,
    updateData,
    { new: true, runValidators: true }
  ).populate('club', 'name logo');

  res.json({
    success: true,
    message: "Achievement updated successfully",
    achievement: updatedAchievement
  });
});

// Delete achievement
export const deleteAchievement = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const achievement = await Achievement.findById(id);
  if (!achievement) {
    return res.status(404).json({
      success: false,
      message: "Achievement not found"
    });
  }

  // Check if user has permission to delete achievement
  if (req.user.role !== 'admin' && req.user.role !== 'coach') {
    return res.status(403).json({
      success: false,
      message: "Only coaches and admins can delete achievements"
    });
  }

  // Check if achievement has been unlocked by any users
  const userAchievements = await UserAchievement.find({ achievement: id });
  if (userAchievements.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Cannot delete achievement that has been unlocked by users"
    });
  }

  await Achievement.findByIdAndDelete(id);

  res.json({
    success: true,
    message: "Achievement deleted successfully"
  });
});

// Get user achievements
export const getUserAchievements = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { status, club, season } = req.query;

  const userAchievements = await UserAchievement.getUserAchievements(userId, {
    status,
    club,
    season
  });

  res.json({
    success: true,
    userAchievements
  });
});

// Get achievement statistics for a user
export const getUserAchievementStats = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const stats = await UserAchievement.getAchievementStats(userId);

  res.json({
    success: true,
    stats
  });
});

// Get achievement leaderboard
export const getAchievementLeaderboard = asyncHandler(async (req, res) => {
  const { club, season, limit = 10 } = req.query;

  const leaderboard = await UserAchievement.getLeaderboard({
    club,
    season,
    limit: parseInt(limit)
  });

  // Populate user information
  const populatedLeaderboard = await UserAchievement.populate(leaderboard, [
    { path: '_id', select: 'name avatar' },
    { path: 'achievements', select: 'name icon level rarity' }
  ]);

  res.json({
    success: true,
    leaderboard: populatedLeaderboard
  });
});

// Check if user can unlock achievement
export const checkAchievementUnlock = asyncHandler(async (req, res) => {
  const { userId, achievementId } = req.params;

  const canUnlock = await UserAchievement.canUnlock(userId, achievementId);

  res.json({
    success: true,
    canUnlock: !!canUnlock,
    userAchievement: canUnlock
  });
});

// Manually unlock achievement for user
export const unlockAchievement = asyncHandler(async (req, res) => {
  const { userId, achievementId } = req.params;
  const { unlockedBy, notes } = req.body;

  // Check if user has permission to manually unlock achievements
  if (req.user.role !== 'admin' && req.user.role !== 'coach') {
    return res.status(403).json({
      success: false,
      message: "Only coaches and admins can manually unlock achievements"
    });
  }

  const achievement = await Achievement.findById(achievementId);
  if (!achievement) {
    return res.status(404).json({
      success: false,
      message: "Achievement not found"
    });
  }

  // Create or update user achievement
  const userAchievement = await UserAchievement.findOneAndUpdate(
    {
      user: userId,
      achievement: achievementId
    },
    {
      status: 'unlocked',
      unlockedAt: new Date(),
      unlockedBy: unlockedBy || req.user._id,
      notes: notes || 'Manually unlocked by admin/coach'
    },
    {
      upsert: true,
      new: true
    }
  ).populate([
    { path: 'user', select: 'name avatar' },
    { path: 'achievement', select: 'name description icon level rarity' }
  ]);

  res.json({
    success: true,
    message: "Achievement unlocked successfully",
    userAchievement
  });
});

// Update achievement progress
export const updateAchievementProgress = asyncHandler(async (req, res) => {
  const { userId, achievementId } = req.params;
  const { value, source, description } = req.body;

  if (!value) {
    return res.status(400).json({
      success: false,
      message: "Progress value is required"
    });
  }

  const userAchievement = await UserAchievement.findOne({
    user: userId,
    achievement: achievementId
  });

  if (!userAchievement) {
    return res.status(404).json({
      success: false,
      message: "User achievement not found"
    });
  }

  await userAchievement.updateProgress(value, source, description);

  res.json({
    success: true,
    message: "Achievement progress updated successfully",
    userAchievement
  });
});

// Claim achievement rewards
export const claimRewards = asyncHandler(async (req, res) => {
  const { userId, achievementId } = req.params;
  const { rewardType } = req.body;

  if (!rewardType) {
    return res.status(400).json({
      success: false,
      message: "Reward type is required"
    });
  }

  const userAchievement = await UserAchievement.findOne({
    user: userId,
    achievement: achievementId
  });

  if (!userAchievement) {
    return res.status(404).json({
      success: false,
      message: "User achievement not found"
    });
  }

  await userAchievement.claimRewards(rewardType);

  res.json({
    success: true,
    message: "Rewards claimed successfully",
    userAchievement
  });
});

// Share achievement
export const shareAchievement = asyncHandler(async (req, res) => {
  const { userId, achievementId } = req.params;
  const { platform } = req.body;

  if (!platform) {
    return res.status(400).json({
      success: false,
      message: "Platform is required"
    });
  }

  const userAchievement = await UserAchievement.findOne({
    user: userId,
    achievement: achievementId
  });

  if (!userAchievement) {
    return res.status(404).json({
      success: false,
      message: "User achievement not found"
    });
  }

  await userAchievement.share(platform);

  res.json({
    success: true,
    message: "Achievement shared successfully",
    userAchievement
  });
});

// Verify achievement
export const verifyAchievement = asyncHandler(async (req, res) => {
  const { userId, achievementId } = req.params;
  const { notes } = req.body;

  // Check if user has permission to verify achievements
  if (req.user.role !== 'admin' && req.user.role !== 'coach') {
    return res.status(403).json({
      success: false,
      message: "Only coaches and admins can verify achievements"
    });
  }

  const userAchievement = await UserAchievement.findOne({
    user: userId,
    achievement: achievementId
  });

  if (!userAchievement) {
    return res.status(404).json({
      success: false,
      message: "User achievement not found"
    });
  }

  await userAchievement.verify(req.user._id, notes);

  res.json({
    success: true,
    message: "Achievement verified successfully",
    userAchievement
  });
});

// Get achievement progress for a user
export const getAchievementProgress = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { category, level } = req.query;

  const query = { user: userId };
  if (category) query.category = category;
  if (level) query.level = level;

  // Get all achievements
  const achievements = await Achievement.find({
    isActive: true,
    $or: [
      { scope: 'global' },
      { scope: 'personal' }
    ]
  });

  // Get user achievements
  const userAchievements = await UserAchievement.find({ user: userId });

  // Calculate progress for each achievement
  const progress = achievements.map(achievement => {
    const userAchievement = userAchievements.find(
      ua => ua.achievement.toString() === achievement._id.toString()
    );

    if (userAchievement) {
      return {
        achievement,
        status: userAchievement.status,
        progress: userAchievement.progress,
        unlockedAt: userAchievement.unlockedAt
      };
    } else {
      // Calculate progress based on user performance
      const progressPercentage = achievement.calculateProgress({}); // You'd need to pass actual user stats here
      return {
        achievement,
        status: 'locked',
        progress: { current: 0, required: 1, percentage: progressPercentage },
        unlockedAt: null
      };
    }
  });

  res.json({
    success: true,
    progress
  });
});

// Bulk unlock achievements for a user
export const bulkUnlockAchievements = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { achievementIds, reason } = req.body;

  if (!achievementIds || !Array.isArray(achievementIds)) {
    return res.status(400).json({
      success: false,
      message: "Achievement IDs array is required"
    });
  }

  // Check if user has permission to bulk unlock achievements
  if (req.user.role !== 'admin' && req.user.role !== 'coach') {
    return res.status(403).json({
      success: false,
      message: "Only coaches and admins can bulk unlock achievements"
    });
  }

  const unlockedAchievements = [];

  for (const achievementId of achievementIds) {
    const achievement = await Achievement.findById(achievementId);
    if (!achievement) continue;

    const userAchievement = await UserAchievement.findOneAndUpdate(
      {
        user: userId,
        achievement: achievementId
      },
      {
        status: 'unlocked',
        unlockedAt: new Date(),
        unlockedBy: req.user._id,
        notes: reason || 'Bulk unlocked by admin/coach'
      },
      {
        upsert: true,
        new: true
      }
    );

    unlockedAchievements.push(userAchievement);
  }

  res.json({
    success: true,
    message: `${unlockedAchievements.length} achievements unlocked successfully`,
    unlockedAchievements
  });
});
