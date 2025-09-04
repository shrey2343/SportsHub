import mongoose from "mongoose";

const userAchievementSchema = new mongoose.Schema(
  {
    // User reference
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    
    // Achievement reference
    achievement: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Achievement",
      required: true,
    },
    
    // Achievement status
    status: {
      type: String,
      enum: ["locked", "in_progress", "unlocked", "completed"],
      default: "locked",
    },
    
    // Progress tracking
    progress: {
      current: { type: Number, default: 0 },
      required: { type: Number, default: 1 },
      percentage: { type: Number, default: 0 },
    },
    
    // Unlock details
    unlockedAt: Date,
    unlockedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // usually the same as user, but could be admin-granted
    },
    
    // Progress history
    progressHistory: [{
      date: { type: Date, default: Date.now },
      value: Number,
      source: String, // "match", "training", "admin", etc.
      description: String,
    }],
    
    // Rewards claimed
    rewardsClaimed: {
      experiencePoints: { type: Boolean, default: false },
      virtualCurrency: { type: Boolean, default: false },
      unlockables: [String],
    },
    
    // Achievement metadata
    timesUnlocked: {
      type: Number,
      default: 1,
    },
    lastUnlocked: {
      type: Date,
      default: Date.now,
    },
    
    // Club context
    club: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Club",
    },
    
    // Season context
    season: String,
    
    // Performance context when unlocked
    performanceContext: {
      match: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Match",
      },
      tournament: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tournament",
      },
      stats: {
        goals: Number,
        assists: Number,
        rating: Number,
        minutes: Number,
        // Add more stats as needed
      },
    },
    
    // Social sharing
    shared: {
      type: Boolean,
      default: false,
    },
    sharedAt: Date,
    sharePlatform: String, // "facebook", "twitter", "instagram", etc.
    
    // Notes and comments
    notes: String,
    tags: [String],
    
    // Achievement verification
    verified: {
      type: Boolean,
      default: false,
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    verifiedAt: Date,
    verificationNotes: String,
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
userAchievementSchema.index({ user: 1, achievement: 1 }, { unique: true });
userAchievementSchema.index({ user: 1, status: 1 });
userAchievementSchema.index({ achievement: 1, status: 1 });
userAchievementSchema.index({ club: 1, season: 1 });
userAchievementSchema.index({ unlockedAt: 1 });

// Virtual for achievement age
userAchievementSchema.virtual('age').get(function() {
  if (!this.unlockedAt) return null;
  const now = new Date();
  const unlocked = new Date(this.unlockedAt);
  const diffTime = Math.abs(now - unlocked);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Virtual for achievement rarity
userAchievementSchema.virtual('rarity').get(function() {
  // This would need to be populated from the achievement reference
  // For now, return a default value
  return 'common';
});

// Method to update progress
userAchievementSchema.methods.updateProgress = function(value, source = "match", description = "") {
  // Add to progress history
  this.progressHistory.push({
    date: new Date(),
    value,
    source,
    description,
  });
  
  // Update current progress
  this.progress.current += value;
  
  // Calculate percentage
  this.progress.percentage = Math.min((this.progress.current / this.progress.max) * 100, 100);
  
  // Check if achievement should be unlocked
  if (this.progress.current >= this.progress.required && this.status !== "unlocked") {
    this.unlock();
  }
  
  return this.save();
};

// Method to unlock achievement
userAchievementSchema.methods.unlock = function() {
  this.status = "unlocked";
  this.unlockedAt = new Date();
  this.timesUnlocked += 1;
  this.lastUnlocked = new Date();
  
  // Set progress to 100%
  this.progress.current = this.progress.required;
  this.progress.percentage = 100;
  
  return this.save();
};

// Method to claim rewards
userAchievementSchema.methods.claimRewards = function(rewardType) {
  if (this.status !== "unlocked") {
    throw new Error("Achievement must be unlocked to claim rewards");
  }
  
  switch (rewardType) {
    case "experiencePoints":
      if (!this.rewardsClaimed.experiencePoints) {
        this.rewardsClaimed.experiencePoints = true;
      }
      break;
    case "virtualCurrency":
      if (!this.rewardsClaimed.virtualCurrency) {
        this.rewardsClaimed.virtualCurrency = true;
      }
      break;
    case "unlockables":
      // Handle unlockable items
      break;
    default:
      throw new Error(`Unknown reward type: ${rewardType}`);
  }
  
  return this.save();
};

// Method to share achievement
userAchievementSchema.methods.share = function(platform) {
  this.shared = true;
  this.sharedAt = new Date();
  this.sharePlatform = platform;
  
  return this.save();
};

// Method to verify achievement
userAchievementSchema.methods.verify = function(verifiedBy, notes = "") {
  this.verified = true;
  this.verifiedBy = verifiedBy;
  this.verifiedAt = new Date();
  this.verificationNotes = notes;
  
  return this.save();
};

// Static method to get user achievements
userAchievementSchema.statics.getUserAchievements = function(userId, options = {}) {
  const query = { user: userId };
  
  if (options.status) {
    query.status = options.status;
  }
  
  if (options.club) {
    query.club = options.club;
  }
  
  if (options.season) {
    query.season = options.season;
  }
  
  return this.find(query)
    .populate('achievement')
    .populate('club')
    .sort({ unlockedAt: -1 });
};

// Static method to get achievement statistics
userAchievementSchema.statics.getAchievementStats = function(userId) {
  return this.aggregate([
    { $match: { user: mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
        achievements: { $push: "$achievement" }
      }
    }
  ]);
};

// Static method to get leaderboard
userAchievementSchema.statics.getLeaderboard = function(options = {}) {
  const matchStage = {};
  
  if (options.club) {
    matchStage.club = mongoose.Types.ObjectId(options.club);
  }
  
  if (options.season) {
    matchStage.season = options.season;
  }
  
  return this.aggregate([
    { $match: { ...matchStage, status: "unlocked" } },
    {
      $group: {
        _id: "$user",
        totalAchievements: { $sum: 1 },
        achievements: { $push: "$achievement" },
        lastUnlocked: { $max: "$unlockedAt" }
      }
    },
    { $sort: { totalAchievements: -1, lastUnlocked: -1 } },
    { $limit: options.limit || 10 }
  ]);
};

// Static method to check if user can unlock achievement
userAchievementSchema.statics.canUnlock = function(userId, achievementId) {
  return this.findOne({
    user: userId,
    achievement: achievementId,
    status: { $in: ["locked", "in_progress"] }
  });
};

// Pre-save middleware to update progress percentage
userAchievementSchema.pre('save', function(next) {
  if (this.progress.required > 0) {
    this.progress.percentage = Math.min((this.progress.current / this.progress.required) * 100, 100);
  }
  next();
});

export default mongoose.model("UserAchievement", userAchievementSchema);
