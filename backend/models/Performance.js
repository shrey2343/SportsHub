import mongoose from "mongoose";

const performanceSchema = new mongoose.Schema(
  {
    // Player reference
    player: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Player",
      required: true,
    },
    
    // Season and period tracking
    season: {
      type: String,
      required: [true, "Season is required"],
      default: () => {
        const year = new Date().getFullYear();
        return `${year}-${year + 1}`;
      },
    },
    period: {
      type: String,
      enum: ["weekly", "monthly", "seasonal", "career"],
      default: "seasonal",
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    
    // Match statistics
    matches: {
      total: { type: Number, default: 0 },
      started: { type: Number, default: 0 },
      substituted: { type: Number, default: 0 },
      completed: { type: Number, default: 0 },
    },
    
    // Playing time
    minutes: {
      total: { type: Number, default: 0 },
      average: { type: Number, default: 0 },
      max: { type: Number, default: 0 },
      min: { type: Number, default: 0 },
    },
    
    // Offensive statistics
    offensive: {
      goals: { type: Number, default: 0 },
      assists: { type: Number, default: 0 },
      shots: { type: Number, default: 0 },
      shotsOnTarget: { type: Number, default: 0 },
      shotAccuracy: { type: Number, default: 0 }, // percentage
      goalsPerMatch: { type: Number, default: 0 },
      assistsPerMatch: { type: Number, default: 0 },
      shotsPerMatch: { type: Number, default: 0 },
    },
    
    // Defensive statistics
    defensive: {
      tackles: { type: Number, default: 0 },
      interceptions: { type: Number, default: 0 },
      clearances: { type: Number, default: 0 },
      blocks: { type: Number, default: 0 },
      saves: { type: Number, default: 0 }, // for goalkeepers
      cleanSheets: { type: Number, default: 0 }, // for goalkeepers and defenders
      tacklesPerMatch: { type: Number, default: 0 },
      interceptionsPerMatch: { type: Number, default: 0 },
    },
    
    // Passing statistics
    passing: {
      passes: { type: Number, default: 0 },
      passesCompleted: { type: Number, default: 0 },
      passAccuracy: { type: Number, default: 0 }, // percentage
      keyPasses: { type: Number, default: 0 },
      crosses: { type: Number, default: 0 },
      crossesCompleted: { type: Number, default: 0 },
      longBalls: { type: Number, default: 0 },
      longBallsCompleted: { type: Number, default: 0 },
      passesPerMatch: { type: Number, default: 0 },
    },
    
    // Physical statistics
    physical: {
      distance: { type: Number, default: 0 }, // in meters
      distancePerMatch: { type: Number, default: 0 },
      sprints: { type: Number, default: 0 },
      sprintDistance: { type: Number, default: 0 },
      topSpeed: { type: Number, default: 0 }, // km/h
      averageSpeed: { type: Number, default: 0 }, // km/h
      highIntensityRuns: { type: Number, default: 0 },
    },
    
    // Discipline
    discipline: {
      yellowCards: { type: Number, default: 0 },
      redCards: { type: Number, default: 0 },
      fouls: { type: Number, default: 0 },
      foulsSuffered: { type: Number, default: 0 },
      offsides: { type: Number, default: 0 },
    },
    
    // Goalkeeper specific (if applicable)
    goalkeeping: {
      saves: { type: Number, default: 0 },
      savesPerMatch: { type: Number, default: 0 },
      cleanSheets: { type: Number, default: 0 },
      goalsConceded: { type: Number, default: 0 },
      goalsConcededPerMatch: { type: Number, default: 0 },
      savePercentage: { type: Number, default: 0 },
      penaltySaves: { type: Number, default: 0 },
      penaltyFaced: { type: Number, default: 0 },
    },
    
    // Ratings and evaluations
    ratings: {
      average: { type: Number, default: 0, min: 0, max: 10 },
      highest: { type: Number, default: 0, min: 0, max: 10 },
      lowest: { type: Number, default: 10, min: 0, max: 10 },
      total: { type: Number, default: 0 },
      count: { type: Number, default: 0 },
    },
    
    // Advanced metrics
    advanced: {
      expectedGoals: { type: Number, default: 0 }, // xG
      expectedAssists: { type: Number, default: 0 }, // xA
      goalContribution: { type: Number, default: 0 }, // goals + assists
      goalContributionPerMatch: { type: Number, default: 0 },
      performanceIndex: { type: Number, default: 0 }, // custom performance score
      consistency: { type: Number, default: 0 }, // rating consistency
      improvement: { type: Number, default: 0 }, // improvement over previous period
    },
    
    // Position-specific metrics
    positionMetrics: {
      // Forward metrics
      forward: {
        conversionRate: { type: Number, default: 0 }, // goals per shot
        bigChances: { type: Number, default: 0 },
        bigChancesMissed: { type: Number, default: 0 },
        dribbles: { type: Number, default: 0 },
        dribblesCompleted: { type: Number, default: 0 },
        dribbleSuccess: { type: Number, default: 0 }, // percentage
      },
      // Midfielder metrics
      midfielder: {
        duels: { type: Number, default: 0 },
        duelsWon: { type: Number, default: 0 },
        duelSuccess: { type: Number, default: 0 }, // percentage
        recoveries: { type: Number, default: 0 },
        possessionWon: { type: Number, default: 0 },
      },
      // Defender metrics
      defender: {
        aerialDuels: { type: Number, default: 0 },
        aerialDuelsWon: { type: Number, default: 0 },
        aerialSuccess: { type: Number, default: 0 }, // percentage
        headedClearances: { type: Number, default: 0 },
        lastManTackles: { type: Number, default: 0 },
      },
    },
    
    // Club and competition context
    club: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Club",
    },
    competition: {
      type: String,
      enum: ["league", "cup", "tournament", "friendly", "training"],
      default: "league",
    },
    
    // Coach evaluation
    coachEvaluation: {
      technical: { type: Number, default: 0, min: 0, max: 10 },
      tactical: { type: Number, default: 0, min: 0, max: 10 },
      physical: { type: Number, default: 0, min: 0, max: 10 },
      mental: { type: Number, default: 0, min: 0, max: 10 },
      overall: { type: Number, default: 0, min: 0, max: 10 },
      comments: String,
      evaluatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      evaluationDate: Date,
    },
    
    // Goals and targets
    targets: {
      goals: { type: Number, default: 0 },
      assists: { type: Number, default: 0 },
      cleanSheets: { type: Number, default: 0 },
      rating: { type: Number, default: 0 },
      minutes: { type: Number, default: 0 },
      achieved: { type: Boolean, default: false },
    },
    
    // Historical data for trends
    trends: {
      goalsTrend: { type: String, enum: ["increasing", "decreasing", "stable"] },
      assistsTrend: { type: String, enum: ["increasing", "decreasing", "stable"] },
      ratingTrend: { type: String, enum: ["increasing", "decreasing", "stable"] },
      form: { type: String, enum: ["excellent", "good", "average", "poor", "very_poor"] },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
performanceSchema.index({ player: 1, season: 1, period: 1 });
performanceSchema.index({ club: 1, season: 1 });
performanceSchema.index({ startDate: 1, endDate: 1 });

// Virtual for performance score calculation
performanceSchema.virtual('performanceScore').get(function() {
  let score = 0;
  
  // Base score from ratings
  score += this.ratings.average * 10;
  
  // Bonus for consistency
  if (this.ratings.count > 5) {
    score += this.advanced.consistency * 5;
  }
  
  // Bonus for improvement
  score += this.advanced.improvement * 3;
  
  // Bonus for achieving targets
  if (this.targets.achieved) {
    score += 20;
  }
  
  return Math.min(Math.max(score, 0), 100);
});

// Method to update performance from match
performanceSchema.methods.updateFromMatch = function(matchStats) {
  // Update basic stats
  this.matches.total += 1;
  this.minutes.total += matchStats.minutesPlayed || 0;
  
  // Update offensive stats
  if (matchStats.goals) {
    this.offensive.goals += matchStats.goals;
  }
  if (matchStats.assists) {
    this.offensive.assists += matchStats.assists;
  }
  
  // Update defensive stats
  if (matchStats.tackles) {
    this.defensive.tackles += matchStats.tackles;
  }
  if (matchStats.saves) {
    this.defensive.saves += matchStats.saves;
  }
  
  // Update passing stats
  if (matchStats.passes) {
    this.passing.passes += matchStats.passes;
  }
  
  // Update ratings
  if (matchStats.rating) {
    this.ratings.total += matchStats.rating;
    this.ratings.count += 1;
    this.ratings.average = this.ratings.total / this.ratings.count;
    this.ratings.highest = Math.max(this.ratings.highest, matchStats.rating);
    this.ratings.lowest = Math.min(this.ratings.lowest, matchStats.rating);
  }
  
  // Recalculate averages
  this.recalculateAverages();
  
  return this.save();
};

// Method to recalculate averages
performanceSchema.methods.recalculateAverages = function() {
  if (this.matches.total > 0) {
    this.minutes.average = this.minutes.total / this.matches.total;
    this.offensive.goalsPerMatch = this.offensive.goals / this.matches.total;
    this.offensive.assistsPerMatch = this.offensive.assists / this.matches.total;
    this.offensive.shotsPerMatch = this.offensive.shots / this.matches.total;
    this.defensive.tacklesPerMatch = this.defensive.tackles / this.matches.total;
    this.defensive.interceptionsPerMatch = this.defensive.interceptions / this.matches.total;
    this.passing.passesPerMatch = this.passing.passes / this.matches.total;
    this.physical.distancePerMatch = this.physical.distance / this.matches.total;
  }
  
  // Calculate percentages
  if (this.offensive.shots > 0) {
    this.offensive.shotAccuracy = (this.offensive.shotsOnTarget / this.offensive.shots) * 100;
  }
  
  if (this.passing.passes > 0) {
    this.passing.passAccuracy = (this.passing.passesCompleted / this.passing.passes) * 100;
  }
  
  if (this.defensive.saves > 0 && this.goalkeeping.goalsConceded > 0) {
    this.goalkeeping.savePercentage = (this.defensive.saves / (this.defensive.saves + this.goalkeeping.goalsConceded)) * 100;
  }
};

// Method to calculate trends
performanceSchema.methods.calculateTrends = function(previousPerformance) {
  if (!previousPerformance) return;
  
  // Calculate improvement percentage
  const goalsImprovement = ((this.offensive.goals - previousPerformance.offensive.goals) / previousPerformance.offensive.goals) * 100;
  const assistsImprovement = ((this.offensive.assists - previousPerformance.offensive.assists) / previousPerformance.offensive.assists) * 100;
  const ratingImprovement = ((this.ratings.average - previousPerformance.ratings.average) / previousPerformance.ratings.average) * 100;
  
  this.advanced.improvement = (goalsImprovement + assistsImprovement + ratingImprovement) / 3;
  
  // Determine trends
  this.trends.goalsTrend = goalsImprovement > 5 ? "increasing" : goalsImprovement < -5 ? "decreasing" : "stable";
  this.trends.assistsTrend = assistsImprovement > 5 ? "increasing" : assistsImprovement < -5 ? "decreasing" : "stable";
  this.trends.ratingTrend = ratingImprovement > 5 ? "increasing" : ratingImprovement < -5 ? "decreasing" : "stable";
  
  // Determine form based on recent performance
  if (this.ratings.average >= 8) this.trends.form = "excellent";
  else if (this.ratings.average >= 7) this.trends.form = "good";
  else if (this.ratings.average >= 6) this.trends.form = "average";
  else if (this.ratings.average >= 4) this.trends.form = "poor";
  else this.trends.form = "very_poor";
};

export default mongoose.model("Performance", performanceSchema);
