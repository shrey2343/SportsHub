// controllers/matchController.js
import Match from "../models/Match.js";
import Tournament from "../models/Tournament.js";
import Performance from "../models/Performance.js";
import UserAchievement from "../models/UserAchievement.js";
import Achievement from "../models/Achievement.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

// Create a new match
export const createMatch = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    matchType,
    homeTeam,
    awayTeam,
    homePlayer,
    awayPlayer,
    sport,
    venue,
    date,
    duration,
    tournament,
    round,
    referee,
    linesmen,
    weather,
    ticketPrice,
    club
  } = req.body;

  // Validate required fields
  if (!title || !sport || !venue || !date || !club) {
    return res.status(400).json({
      success: false,
      message: "Title, sport, venue, date, and club are required"
    });
  }

  // Check if user has permission to create matches for this club
  if (req.user.role !== 'admin' && req.user.role !== 'coach') {
    return res.status(403).json({
      success: false,
      message: "Only coaches and admins can create matches"
    });
  }

  const match = await Match.create({
    title,
    description,
    matchType: matchType || 'friendly',
    homeTeam,
    awayTeam,
    homePlayer,
    awayPlayer,
    sport,
    venue,
    date: new Date(date),
    duration: duration || 90,
    tournament,
    round: round || 'group_stage',
    referee,
    linesmen,
    weather,
    ticketPrice: ticketPrice || 0,
    createdBy: req.user._id,
    club
  });

  // Populate references
  await match.populate([
    { path: 'homeTeam', select: 'name logo' },
    { path: 'awayTeam', select: 'name logo' },
    { path: 'homePlayer', select: 'name avatarUrl' },
    { path: 'awayPlayer', select: 'name avatarUrl' },
    { path: 'tournament', select: 'name' },
    { path: 'referee', select: 'name' },
    { path: 'linesmen', select: 'name' }
  ]);

  res.status(201).json({
    success: true,
    message: "Match created successfully",
    match
  });
});

// Get all matches with filtering
export const getMatches = asyncHandler(async (req, res) => {
  const {
    status,
    sport,
    club,
    tournament,
    dateFrom,
    dateTo,
    page = 1,
    limit = 10
  } = req.query;

  const query = {};

  // Apply filters
  if (status) query.status = status;
  if (sport) query.sport = sport;
  if (club) query.club = club;
  if (tournament) query.tournament = tournament;
  if (dateFrom || dateTo) {
    query.date = {};
    if (dateFrom) query.date.$gte = new Date(dateFrom);
    if (dateTo) query.date.$lte = new Date(dateTo);
  }

  const skip = (page - 1) * limit;

  const matches = await Match.find(query)
    .populate([
      { path: 'homeTeam', select: 'name logo' },
      { path: 'awayTeam', select: 'name logo' },
      { path: 'homePlayer', select: 'name avatarUrl' },
      { path: 'awayPlayer', select: 'name avatarUrl' },
      { path: 'tournament', select: 'name' },
      { path: 'club', select: 'name' }
    ])
    .sort({ date: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Match.countDocuments(query);

  res.json({
    success: true,
    matches,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit)
    }
  });
});

// Get match by ID
export const getMatchById = asyncHandler(async (req, res) => {
  const match = await Match.findById(req.params.id)
    .populate([
      { path: 'homeTeam', select: 'name logo players' },
      { path: 'awayTeam', select: 'name logo players' },
      { path: 'homePlayer', select: 'name avatarUrl position' },
      { path: 'awayPlayer', select: 'name avatarUrl position' },
      { path: 'tournament', select: 'name format' },
      { path: 'club', select: 'name' },
      { path: 'referee', select: 'name' },
      { path: 'linesmen', select: 'name' },
      { path: 'playerStats.player', select: 'name avatarUrl position' }
    ]);

  if (!match) {
    return res.status(404).json({
      success: false,
      message: "Match not found"
    });
  }

  res.json({
    success: true,
    match
  });
});

// Update match score and status
export const updateMatchScore = asyncHandler(async (req, res) => {
  const { homeScore, awayScore, status } = req.body;
  const matchId = req.params.id;

  const match = await Match.findById(matchId);
  if (!match) {
    return res.status(404).json({
      success: false,
      message: "Match not found"
    });
  }

  // Check permissions
  if (req.user.role !== 'admin' && req.user.role !== 'coach') {
    return res.status(403).json({
      success: false,
      message: "Only coaches and admins can update match scores"
    });
  }

  // Update score
  if (homeScore !== undefined) match.homeScore = homeScore;
  if (awayScore !== undefined) match.awayScore = awayScore;
  if (status) match.status = status;

  // If match is completed, update performance stats
  if (status === 'completed' && match.status !== 'completed') {
    await updatePlayerPerformance(match);
    await checkAchievements(match);
  }

  await match.save();

  // Populate references for response
  await match.populate([
    { path: 'homeTeam', select: 'name logo' },
    { path: 'awayTeam', select: 'name logo' },
    { path: 'tournament', select: 'name' }
  ]);

  res.json({
    success: true,
    message: "Match score updated successfully",
    match
  });
});

// Update match statistics
export const updateMatchStats = asyncHandler(async (req, res) => {
  const { stats, playerStats, highlights } = req.body;
  const matchId = req.params.id;

  const match = await Match.findById(matchId);
  if (!match) {
    return res.status(404).json({
      success: false,
      message: "Match not found"
    });
  }

  // Check permissions
  if (req.user.role !== 'admin' && req.user.role !== 'coach') {
    return res.status(403).json({
      success: false,
      message: "Only coaches and admins can update match statistics"
    });
  }

  // Update team statistics
  if (stats) {
    if (stats.homeTeam) Object.assign(match.stats.homeTeam, stats.homeTeam);
    if (stats.awayTeam) Object.assign(match.stats.awayTeam, stats.awayTeam);
  }

  // Update player statistics
  if (playerStats) {
    for (const playerStat of playerStats) {
      await match.addPlayerStat(
        playerStat.player,
        playerStat.team,
        playerStat
      );
    }
  }

  // Add highlights
  if (highlights) {
    match.highlights.push(...highlights);
  }

  await match.save();

  res.json({
    success: true,
    message: "Match statistics updated successfully",
    match
  });
});

// Live match updates
export const liveUpdate = asyncHandler(async (req, res) => {
  const { action, data } = req.body;
  const matchId = req.params.id;

  const match = await Match.findById(matchId);
  if (!match) {
    return res.status(404).json({
      success: false,
      message: "Match not found"
    });
  }

  // Check if match is in progress
  if (match.status !== 'in_progress') {
    return res.status(400).json({
      success: false,
      message: "Match is not in progress"
    });
  }

  switch (action) {
    case 'goal':
      await handleGoal(match, data);
      break;
    case 'card':
      await handleCard(match, data);
      break;
    case 'substitution':
      await handleSubstitution(match, data);
      break;
    case 'foul':
      await handleFoul(match, data);
      break;
    default:
      return res.status(400).json({
        success: false,
        message: "Invalid action"
      });
  }

  await match.save();

  res.json({
    success: true,
    message: "Live update applied successfully",
    match
  });
});

// Get upcoming matches
export const getUpcomingMatches = asyncHandler(async (req, res) => {
  const { club, sport, limit = 10 } = req.query;

  const query = {
    status: 'scheduled',
    date: { $gte: new Date() }
  };

  if (club) query.club = club;
  if (sport) query.sport = sport;

  const matches = await Match.find(query)
    .populate([
      { path: 'homeTeam', select: 'name logo' },
      { path: 'awayTeam', select: 'name logo' },
      { path: 'tournament', select: 'name' },
      { path: 'club', select: 'name' }
    ])
    .sort({ date: 1 })
    .limit(parseInt(limit));

  res.json({
    success: true,
    matches
  });
});

// Get match highlights
export const getMatchHighlights = asyncHandler(async (req, res) => {
  const match = await Match.findById(req.params.id).select('highlights');
  
  if (!match) {
    return res.status(404).json({
      success: false,
      message: "Match not found"
    });
  }

  res.json({
    success: true,
    highlights: match.highlights
  });
});

// Delete match
export const deleteMatch = asyncHandler(async (req, res) => {
  const match = await Match.findById(req.params.id);
  
  if (!match) {
    return res.status(404).json({
      success: false,
      message: "Match not found"
    });
  }

  // Check permissions
  if (req.user.role !== 'admin' && req.user.role !== 'coach') {
    return res.status(403).json({
      success: false,
      message: "Only coaches and admins can delete matches"
    });
  }

  await Match.findByIdAndDelete(req.params.id);

  res.json({
    success: true,
    message: "Match deleted successfully"
  });
});

// Helper function to update player performance
async function updatePlayerPerformance(match) {
  for (const playerStat of match.playerStats) {
    const performance = await Performance.findOneAndUpdate(
      {
        player: playerStat.player,
        season: getCurrentSeason(),
        period: 'seasonal'
      },
      {
        $inc: {
          'matches.total': 1,
          'offensive.goals': playerStat.goals || 0,
          'offensive.assists': playerStat.assists || 0,
          'defensive.tackles': playerStat.tackles || 0,
          'defensive.saves': playerStat.saves || 0,
          'passing.passes': playerStat.passes || 0,
          'minutes.total': playerStat.minutesPlayed || 0
        }
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true
      }
    );

    // Update averages and recalculate stats
    await performance.recalculateAverages();
  }
}

// Helper function to check achievements
async function checkAchievements(match) {
  for (const playerStat of match.playerStats) {
    const player = playerStat.player;
    
    // Get all achievements for this player
    const achievements = await Achievement.find({
      isActive: true,
      $or: [
        { scope: 'global' },
        { scope: 'club', club: match.club },
        { scope: 'personal' }
      ]
    });

    for (const achievement of achievements) {
      // Check if player meets requirements
      if (achievement.checkRequirements(playerStat)) {
        // Create or update user achievement
        await UserAchievement.findOneAndUpdate(
          {
            user: player,
            achievement: achievement._id
          },
          {
            status: 'unlocked',
            unlockedAt: new Date(),
            performanceContext: {
              match: match._id,
              stats: playerStat
            }
          },
          {
            upsert: true,
            new: true
          }
        );
      }
    }
  }
}

// Helper function to get current season
function getCurrentSeason() {
  const year = new Date().getFullYear();
  return `${year}-${year + 1}`;
}

// Helper function to handle goal
async function handleGoal(match, data) {
  const { team, player, minute, type } = data;
  
  // Update score
  if (team === 'home') {
    match.homeScore += 1;
  } else {
    match.awayScore += 1;
  }

  // Add highlight
  match.highlights.push({
    minute,
    type: 'goal',
    description: `Goal scored by ${player}`,
    player: data.playerId
  });

  // Update player stats
  const playerStat = match.playerStats.find(
    ps => ps.player.toString() === data.playerId && ps.team === team
  );
  
  if (playerStat) {
    playerStat.goals = (playerStat.goals || 0) + 1;
  }
}

// Helper function to handle card
async function handleCard(match, data) {
  const { team, player, minute, cardType } = data;
  
  // Add highlight
  match.highlights.push({
    minute,
    type: 'card',
    description: `${cardType} card for ${player}`,
    player: data.playerId
  });

  // Update player stats
  const playerStat = match.playerStats.find(
    ps => ps.player.toString() === data.playerId && ps.team === team
  );
  
  if (playerStat) {
    if (cardType === 'yellow') {
      playerStat.yellowCards = (playerStat.yellowCards || 0) + 1;
    } else if (cardType === 'red') {
      playerStat.redCards = (playerStat.redCards || 0) + 1;
    }
  }
}

// Helper function to handle substitution
async function handleSubstitution(match, data) {
  const { minute, playerOut, playerIn, team } = data;
  
  // Add highlight
  match.highlights.push({
    minute,
    type: 'substitution',
    description: `${playerOut} replaced by ${playerIn}`,
    player: data.playerInId
  });
}

// Helper function to handle foul
async function handleFoul(match, data) {
  const { minute, player, team, foulType } = data;
  
  // Add highlight
  match.highlights.push({
    minute,
    type: 'foul',
    description: `${foulType} foul by ${player}`,
    player: data.playerId
  });

  // Update player stats
  const playerStat = match.playerStats.find(
    ps => ps.player.toString() === data.playerId && ps.team === team
  );
  
  if (playerStat) {
    playerStat.fouls = (playerStat.fouls || 0) + 1;
  }
}
