import mongoose from "mongoose";

const matchSchema = new mongoose.Schema(
  {
    // Basic match info
    title: {
      type: String,
      required: [true, "Match title is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    
    // Match type and status
    matchType: {
      type: String,
      enum: ["friendly", "league", "tournament", "training", "exhibition"],
      default: "friendly",
    },
    status: {
      type: String,
      enum: ["scheduled", "in_progress", "completed", "cancelled", "postponed"],
      default: "scheduled",
    },
    
    // Teams and participants
    homeTeam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Club",
      required: true,
    },
    awayTeam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Club",
      required: true,
    },
    
    // Individual players (for individual sports)
    homePlayer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Player",
    },
    awayPlayer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Player",
    },
    
    // Match details
    sport: {
      type: String,
      required: [true, "Sport is required"],
    },
    venue: {
      type: String,
      required: [true, "Venue is required"],
    },
    date: {
      type: Date,
      required: [true, "Match date is required"],
    },
    duration: {
      type: Number, // in minutes
      default: 90,
    },
    
    // Scoring
    homeScore: {
      type: Number,
      default: 0,
    },
    awayScore: {
      type: Number,
      default: 0,
    },
    
    // Period scores (for sports with multiple periods)
    periodScores: [{
      period: Number,
      homeScore: Number,
      awayScore: Number,
    }],
    
    // Match statistics
    stats: {
      homeTeam: {
        possession: { type: Number, default: 0 }, // percentage
        shots: { type: Number, default: 0 },
        shotsOnTarget: { type: Number, default: 0 },
        corners: { type: Number, default: 0 },
        fouls: { type: Number, default: 0 },
        yellowCards: { type: Number, default: 0 },
        redCards: { type: Number, default: 0 },
      },
      awayTeam: {
        possession: { type: Number, default: 0 },
        shots: { type: Number, default: 0 },
        shotsOnTarget: { type: Number, default: 0 },
        corners: { type: Number, default: 0 },
        fouls: { type: Number, default: 0 },
        yellowCards: { type: Number, default: 0 },
        redCards: { type: Number, default: 0 },
      },
    },
    
    // Player performances
    playerStats: [{
      player: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Player",
        required: true,
      },
      team: {
        type: String,
        enum: ["home", "away"],
        required: true,
      },
      goals: { type: Number, default: 0 },
      assists: { type: Number, default: 0 },
      saves: { type: Number, default: 0 },
      tackles: { type: Number, default: 0 },
      passes: { type: Number, default: 0 },
      passAccuracy: { type: Number, default: 0 }, // percentage
      yellowCards: { type: Number, default: 0 },
      redCards: { type: Number, default: 0 },
      minutesPlayed: { type: Number, default: 0 },
      rating: { type: Number, default: 0, min: 0, max: 10 },
    }],
    
    // Tournament info
    tournament: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tournament",
    },
    round: {
      type: String,
      default: "group_stage",
    },
    
    // Officials
    referee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    linesmen: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }],
    
    // Weather and conditions
    weather: {
      temperature: Number,
      conditions: String, // sunny, rainy, cloudy, etc.
      windSpeed: Number,
    },
    
    // Match highlights and notes
    highlights: [{
      minute: Number,
      type: {
        type: String,
        enum: ["goal", "assist", "save", "foul", "card", "substitution", "other"],
      },
      description: String,
      player: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Player",
      },
    }],
    
    // Media
    photos: [String], // URLs to match photos
    videos: [String], // URLs to match videos
    
    // Financial
    ticketPrice: {
      type: Number,
      default: 0,
    },
    revenue: {
      type: Number,
      default: 0,
    },
    
    // Created by
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    
    // Club that owns this match
    club: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Club",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
matchSchema.index({ date: 1, status: 1 });
matchSchema.index({ homeTeam: 1, awayTeam: 1 });
matchSchema.index({ tournament: 1, round: 1 });
matchSchema.index({ club: 1, date: 1 });

// Virtual for match result
matchSchema.virtual('result').get(function() {
  if (this.status !== 'completed') return 'pending';
  if (this.homeScore > this.awayScore) return 'home_win';
  if (this.awayScore > this.homeScore) return 'away_win';
  return 'draw';
});

// Virtual for match duration in hours
matchSchema.virtual('durationHours').get(function() {
  return this.duration / 60;
});

// Method to update match score
matchSchema.methods.updateScore = function(homeScore, awayScore) {
  this.homeScore = homeScore;
  this.awayScore = awayScore;
  this.status = 'completed';
  return this.save();
};

// Method to add player stat
matchSchema.methods.addPlayerStat = function(playerId, team, stats) {
  const existingStat = this.playerStats.find(stat => 
    stat.player.toString() === playerId.toString() && stat.team === team
  );
  
  if (existingStat) {
    Object.assign(existingStat, stats);
  } else {
    this.playerStats.push({
      player: playerId,
      team,
      ...stats
    });
  }
  
  return this.save();
};

export default mongoose.model("Match", matchSchema);
