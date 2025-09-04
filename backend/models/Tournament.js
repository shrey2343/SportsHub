import mongoose from "mongoose";

const tournamentSchema = new mongoose.Schema(
  {
    // Basic tournament info
    name: {
      type: String,
      required: [true, "Tournament name is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    
    // Tournament details
    sport: {
      type: String,
      required: [true, "Sport is required"],
    },
    format: {
      type: String,
      enum: ["knockout", "league", "group_knockout", "round_robin", "swiss"],
      default: "knockout",
    },
    status: {
      type: String,
      enum: ["upcoming", "registration", "in_progress", "completed", "cancelled"],
      default: "upcoming",
    },
    
    // Dates
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
    },
    endDate: {
      type: Date,
      required: [true, "End date is required"],
    },
    registrationDeadline: {
      type: Date,
      required: [true, "Registration deadline is required"],
    },
    
    // Teams and participants
    maxTeams: {
      type: Number,
      required: [true, "Maximum teams is required"],
    },
    minTeams: {
      type: Number,
      default: 2,
    },
    teams: [{
      team: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Club",
        required: true,
      },
      registrationDate: {
        type: Date,
        default: Date.now,
      },
      status: {
        type: String,
        enum: ["registered", "confirmed", "withdrawn"],
        default: "registered",
      },
      seed: Number, // for seeding in brackets
    }],
    
    // Tournament structure
    groups: [{
      name: String,
      teams: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Club",
      }],
      matches: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Match",
      }],
      standings: [{
        team: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Club",
        },
        played: { type: Number, default: 0 },
        won: { type: Number, default: 0 },
        drawn: { type: Number, default: 0 },
        lost: { type: Number, default: 0 },
        goalsFor: { type: Number, default: 0 },
        goalsAgainst: { type: Number, default: 0 },
        points: { type: Number, default: 0 },
      }],
    }],
    
    // Knockout rounds
    knockoutRounds: [{
      round: String, // "round_of_16", "quarter_final", "semi_final", "final"
      matches: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Match",
      }],
      teams: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Club",
      }],
    }],
    
    // Prizes and entry fees
    entryFee: {
      type: Number,
      default: 0,
    },
    prizePool: {
      first: { type: Number, default: 0 },
      second: { type: Number, default: 0 },
      third: { type: Number, default: 0 },
    },
    
    // Rules and regulations
    rules: [String],
    ageGroups: [String], // "U12", "U16", "U18", "Senior"
    genderCategories: [String], // "Men", "Women", "Mixed"
    
    // Venue and facilities
    venues: [{
      name: String,
      address: String,
      capacity: Number,
    }],
    
    // Officials
    referees: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      role: {
        type: String,
        enum: ["referee", "linesman", "fourth_official"],
      },
    }],
    
    // Sponsors
    sponsors: [{
      name: String,
      logo: String,
      contribution: Number,
      website: String,
    }],
    
    // Media and coverage
    liveStreaming: {
      enabled: { type: Boolean, default: false },
      platform: String,
      url: String,
    },
    highlights: [String], // URLs to highlight videos
    photos: [String], // URLs to tournament photos
    
    // Statistics
    totalMatches: { type: Number, default: 0 },
    totalGoals: { type: Number, default: 0 },
    totalAttendance: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 },
    
    // Created by
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    
    // Club that owns this tournament
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
tournamentSchema.index({ sport: 1, status: 1 });
tournamentSchema.index({ startDate: 1, endDate: 1 });
tournamentSchema.index({ club: 1, status: 1 });

// Virtual for tournament progress
tournamentSchema.virtual('progress').get(function() {
  if (this.status === 'completed') return 100;
  if (this.status === 'upcoming') return 0;
  
  const totalDays = (this.endDate - this.startDate) / (1000 * 60 * 60 * 24);
  const daysElapsed = (Date.now() - this.startDate) / (1000 * 60 * 60 * 24);
  
  return Math.min(Math.max((daysElapsed / totalDays) * 100, 0), 100);
});

// Virtual for registration status
tournamentSchema.virtual('registrationStatus').get(function() {
  if (this.teams.length >= this.maxTeams) return 'full';
  if (Date.now() > this.registrationDeadline) return 'closed';
  return 'open';
});

// Method to register a team
tournamentSchema.methods.registerTeam = function(teamId) {
  if (this.status !== 'upcoming' && this.status !== 'registration') {
    throw new Error('Tournament registration is not open');
  }
  
  if (this.teams.length >= this.maxTeams) {
    throw new Error('Tournament is full');
  }
  
  if (Date.now() > this.registrationDeadline) {
    throw new Error('Registration deadline has passed');
  }
  
  const existingTeam = this.teams.find(t => t.team.toString() === teamId.toString());
  if (existingTeam) {
    throw new Error('Team is already registered');
  }
  
  this.teams.push({
    team: teamId,
    registrationDate: Date.now(),
    status: 'registered',
  });
  
  return this.save();
};

// Method to withdraw a team
tournamentSchema.methods.withdrawTeam = function(teamId) {
  const teamEntry = this.teams.find(t => t.team.toString() === teamId.toString());
  if (!teamEntry) {
    throw new Error('Team is not registered');
  }
  
  teamEntry.status = 'withdrawn';
  return this.save();
};

// Method to generate brackets
tournamentSchema.methods.generateBrackets = function() {
  if (this.format === 'knockout') {
    this.generateKnockoutBrackets();
  } else if (this.format === 'group_knockout') {
    this.generateGroupKnockoutBrackets();
  }
  
  return this.save();
};

// Method to generate knockout brackets
tournamentSchema.methods.generateKnockoutBrackets = function() {
  const confirmedTeams = this.teams
    .filter(t => t.status === 'confirmed')
    .map(t => t.team);
  
  if (confirmedTeams.length < 2) {
    throw new Error('Need at least 2 confirmed teams');
  }
  
  // Simple bracket generation (can be enhanced with seeding)
  this.knockoutRounds = [];
  let currentRound = confirmedTeams;
  
  while (currentRound.length > 1) {
    const roundName = this.getRoundName(currentRound.length);
    const roundMatches = [];
    
    for (let i = 0; i < currentRound.length; i += 2) {
      if (i + 1 < currentRound.length) {
        roundMatches.push({
          homeTeam: currentRound[i],
          awayTeam: currentRound[i + 1],
        });
      }
    }
    
    this.knockoutRounds.push({
      round: roundName,
      matches: roundMatches,
      teams: currentRound,
    });
    
    currentRound = roundMatches.map(match => match.homeTeam); // Placeholder for winners
  }
};

// Helper method to get round name
tournamentSchema.methods.getRoundName = function(teamCount) {
  switch (teamCount) {
    case 2: return 'final';
    case 4: return 'semi_final';
    case 8: return 'quarter_final';
    case 16: return 'round_of_16';
    case 32: return 'round_of_32';
    default: return `round_of_${teamCount}`;
  }
};

export default mongoose.model("Tournament", tournamentSchema);
