import mongoose from "mongoose";

const achievementSchema = new mongoose.Schema(
  {
    // Basic achievement info
    name: {
      type: String,
      required: [true, "Achievement name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Achievement description is required"],
      trim: true,
    },
    
    // Achievement type and category
    type: {
      type: String,
      enum: ["milestone", "skill", "participation", "social", "special", "seasonal"],
      default: "milestone",
    },
    category: {
      type: String,
      enum: ["scoring", "defending", "passing", "fitness", "teamwork", "leadership", "attendance", "improvement"],
      default: "scoring",
    },
    
    // Achievement levels
    level: {
      type: String,
      enum: ["bronze", "silver", "gold", "platinum", "diamond"],
      default: "bronze",
    },
    tier: {
      type: Number,
      default: 1,
      min: 1,
      max: 10,
    },
    
    // Requirements to unlock
    requirements: {
      // Numeric requirements
      goals: { type: Number, default: 0 },
      assists: { type: Number, default: 0 },
      matches: { type: Number, default: 0 },
      minutes: { type: Number, default: 0 },
      cleanSheets: { type: Number, default: 0 },
      saves: { type: Number, default: 0 },
      tackles: { type: Number, default: 0 },
      passes: { type: Number, default: 0 },
      distance: { type: Number, default: 0 }, // in meters
      rating: { type: Number, default: 0 },
      
      // Time-based requirements
      consecutiveDays: { type: Number, default: 0 },
      consecutiveWeeks: { type: Number, default: 0 },
      consecutiveMonths: { type: Number, default: 0 },
      
      // Social requirements
      friends: { type: Number, default: 0 },
      teamWins: { type: Number, default: 0 },
      tournamentWins: { type: Number, default: 0 },
      
      // Special requirements
      specialConditions: [String], // custom conditions like "score in final minute"
      sport: String, // specific sport requirement
      position: String, // specific position requirement
      ageGroup: String, // specific age group
    },
    
    // Rewards
    rewards: {
      experiencePoints: { type: Number, default: 0 },
      virtualCurrency: { type: Number, default: 0 },
      unlockables: [String], // special items, titles, etc.
      bonusMultiplier: { type: Number, default: 1.0 }, // multiplier for other rewards
    },
    
    // Visual elements
    icon: {
      type: String,
      required: [true, "Achievement icon is required"],
    },
    badge: {
      type: String,
      required: [true, "Achievement badge is required"],
    },
    color: {
      type: String,
      default: "#FFD700", // gold color
    },
    
    // Achievement metadata
    rarity: {
      type: String,
      enum: ["common", "uncommon", "rare", "epic", "legendary"],
      default: "common",
    },
    difficulty: {
      type: Number,
      min: 1,
      max: 10,
      default: 1,
    },
    
    // Time constraints
    availableFrom: Date,
    availableUntil: Date,
    isSeasonal: {
      type: Boolean,
      default: false,
    },
    season: String, // if seasonal
    
    // Progress tracking
    progressType: {
      type: String,
      enum: ["cumulative", "consecutive", "best", "average"],
      default: "cumulative",
    },
    maxProgress: {
      type: Number,
      default: 1,
    },
    
    // Achievement status
    isActive: {
      type: Boolean,
      default: true,
    },
    isHidden: {
      type: Boolean,
      default: false,
    },
    
    // Statistics
    totalUnlocked: {
      type: Number,
      default: 0,
    },
    unlockRate: {
      type: Number,
      default: 0, // percentage of eligible users who unlocked it
    },
    
    // Created by
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    
    // Club-specific achievements
    club: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Club",
    },
    
    // Global vs personal
    scope: {
      type: String,
      enum: ["global", "club", "personal"],
      default: "global",
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
achievementSchema.index({ type: 1, category: 1 });
achievementSchema.index({ level: 1, tier: 1 });
achievementSchema.index({ rarity: 1, difficulty: 1 });
achievementSchema.index({ club: 1, scope: 1 });

// Virtual for achievement value
achievementSchema.virtual('value').get(function() {
  let value = 0;
  
  // Base value from level
  const levelValues = { bronze: 10, silver: 25, gold: 50, platinum: 100, diamond: 250 };
  value += levelValues[this.level] || 0;
  
  // Value from tier
  value += this.tier * 5;
  
  // Value from rarity
  const rarityValues = { common: 1, uncommon: 2, rare: 3, epic: 5, legendary: 10 };
  value += rarityValues[this.rarity] || 1;
  
  // Value from difficulty
  value += this.difficulty * 2;
  
  return value;
});

// Virtual for achievement status
achievementSchema.virtual('isAvailable').get(function() {
  const now = Date.now();
  
  if (this.availableFrom && now < this.availableFrom) return false;
  if (this.availableUntil && now > this.availableUntil) return false;
  
  return this.isActive;
});

// Method to check if user meets requirements
achievementSchema.methods.checkRequirements = function(userStats) {
  const requirements = this.requirements;
  
  // Check numeric requirements
  if (requirements.goals && userStats.goals < requirements.goals) return false;
  if (requirements.assists && userStats.assists < requirements.assists) return false;
  if (requirements.matches && userStats.matches < requirements.matches) return false;
  if (requirements.minutes && userStats.minutes < requirements.minutes) return false;
  if (requirements.cleanSheets && userStats.cleanSheets < requirements.cleanSheets) return false;
  if (requirements.saves && userStats.saves < requirements.saves) return false;
  if (requirements.tackles && userStats.tackles < requirements.tackles) return false;
  if (requirements.passes && userStats.passes < requirements.passes) return false;
  if (requirements.distance && userStats.distance < requirements.distance) return false;
  if (requirements.rating && userStats.rating < requirements.rating) return false;
  
  // Check time-based requirements
  if (requirements.consecutiveDays && userStats.consecutiveDays < requirements.consecutiveDays) return false;
  if (requirements.consecutiveWeeks && userStats.consecutiveWeeks < requirements.consecutiveWeeks) return false;
  if (requirements.consecutiveMonths && userStats.consecutiveMonths < requirements.consecutiveMonths) return false;
  
  // Check social requirements
  if (requirements.friends && userStats.friends < requirements.friends) return false;
  if (requirements.teamWins && userStats.teamWins < requirements.teamWins) return false;
  if (requirements.tournamentWins && userStats.tournamentWins < requirements.tournamentWins) return false;
  
  // Check special conditions
  if (requirements.specialConditions && requirements.specialConditions.length > 0) {
    // This would need custom logic based on the specific conditions
    // For now, we'll assume they're met if other requirements are met
  }
  
  // Check sport requirement
  if (requirements.sport && userStats.sport !== requirements.sport) return false;
  
  // Check position requirement
  if (requirements.position && userStats.position !== requirements.position) return false;
  
  // Check age group requirement
  if (requirements.ageGroup && userStats.ageGroup !== requirements.ageGroup) return false;
  
  return true;
};

// Method to calculate progress percentage
achievementSchema.methods.calculateProgress = function(userStats) {
  let progress = 0;
  let total = 0;
  
  // Calculate progress based on progress type
  if (this.progressType === 'cumulative') {
    // For cumulative achievements, sum up all progress
    if (this.requirements.goals) {
      progress += Math.min(userStats.goals || 0, this.requirements.goals);
      total += this.requirements.goals;
    }
    if (this.requirements.assists) {
      progress += Math.min(userStats.assists || 0, this.requirements.assists);
      total += this.requirements.assists;
    }
    if (this.requirements.matches) {
      progress += Math.min(userStats.matches || 0, this.requirements.matches);
      total += this.requirements.matches;
    }
    // Add more requirements as needed
  } else if (this.progressType === 'consecutive') {
    // For consecutive achievements, use the longest streak
    progress = Math.max(
      userStats.consecutiveDays || 0,
      userStats.consecutiveWeeks || 0,
      userStats.consecutiveMonths || 0
    );
    total = Math.max(
      this.requirements.consecutiveDays || 0,
      this.requirements.consecutiveWeeks || 0,
      this.requirements.consecutiveMonths || 0
    );
  } else if (this.progressType === 'best') {
    // For best achievements, use the highest value
    progress = Math.max(
      userStats.goals || 0,
      userStats.assists || 0,
      userStats.rating || 0
    );
    total = Math.max(
      this.requirements.goals || 0,
      this.requirements.assists || 0,
      this.requirements.rating || 0
    );
  }
  
  return total > 0 ? Math.min((progress / total) * 100, 100) : 0;
};

// Static method to get achievements by category
achievementSchema.statics.getByCategory = function(category, options = {}) {
  const query = { category, isActive: true };
  
  if (options.club) {
    query.$or = [
      { scope: 'global' },
      { scope: 'club', club: options.club },
      { scope: 'personal' }
    ];
  }
  
  if (options.level) {
    query.level = options.level;
  }
  
  if (options.rarity) {
    query.rarity = options.rarity;
  }
  
  return this.find(query).sort({ difficulty: 1, tier: 1 });
};

// Static method to get seasonal achievements
achievementSchema.statics.getSeasonal = function(season) {
  return this.find({
    isSeasonal: true,
    season: season,
    isActive: true
  }).sort({ level: 1, tier: 1 });
};

export default mongoose.model("Achievement", achievementSchema);
