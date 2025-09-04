// controllers/performanceController.js
import Performance from "../models/Performance.js";
import Match from "../models/Match.js";
import Player from "../models/Player.js";
import User from "../models/User.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

// Get current user's performance
export const getMyPerformance = asyncHandler(async (req, res) => {
  const { season, period } = req.query;
  
  // Find the player record for the current user
  const player = await Player.findOne({ user: req.user._id });
  if (!player) {
    return res.status(404).json({
      success: false,
      message: "Player profile not found"
    });
  }

  const query = { player: player._id };
  if (season) query.season = season;
  if (period) query.period = period;

  const performances = await Performance.find(query)
    .populate('player', 'name avatarUrl position')
    .populate('club', 'name logo')
    .sort({ startDate: -1 });

  if (performances.length === 0) {
    return res.status(404).json({
      success: false,
      message: "No performance data found for this player"
    });
  }

  // Calculate career totals
  const careerTotals = await Performance.aggregate([
    { $match: { player: player._id } },
    {
      $group: {
        _id: null,
        totalMatches: { $sum: "$matches.total" },
        totalGoals: { $sum: "$offensive.goals" },
        totalAssists: { $sum: "$offensive.assists" },
        totalMinutes: { $sum: "$minutes.total" },
        totalTackles: { $sum: "$defensive.tackles" },
        totalSaves: { $sum: "$defensive.saves" },
        totalPasses: { $sum: "$passing.passes" },
        totalDistance: { $sum: "$physical.distance" },
        averageRating: { $avg: "$ratings.average" }
      }
    }
  ]);

  res.json({
    success: true,
    performances,
    careerTotals: careerTotals[0] || {},
    currentSeason: performances.find(p => p.season === getCurrentSeason())
  });
});

// Get current user's performance trends
export const getMyPerformanceTrends = asyncHandler(async (req, res) => {
  const { metric, season } = req.query;
  
  // Find the player record for the current user
  const player = await Player.findOne({ user: req.user._id });
  if (!player) {
    return res.status(404).json({
      success: false,
      message: "Player profile not found"
    });
  }

  const query = { player: player._id };
  if (season) query.season = season;

  const performances = await Performance.find(query)
    .populate('player', 'name avatarUrl position')
    .populate('club', 'name logo')
    .sort({ startDate: 1 });

  if (performances.length === 0) {
    return res.status(404).json({
      success: false,
      message: "No performance data found for this player"
    });
  }

  // Generate trends data based on the specified metric
  const trends = performances.map(perf => ({
    date: perf.startDate,
    value: getMetricValue(perf, metric),
    period: perf.period
  }));

  res.json({
    success: true,
    trends,
    metric
  });
});

// Get current user's performance insights
export const getMyPerformanceInsights = asyncHandler(async (req, res) => {
  const { season } = req.query;
  
  // Find the player record for the current user
  const player = await Player.findOne({ user: req.user._id });
  if (!player) {
    return res.status(404).json({
      success: false,
      message: "Player profile not found"
    });
  }

  const query = { player: player._id };
  if (season) query.season = season;

  const performances = await Performance.find(query)
    .populate('player', 'name avatarUrl position')
    .populate('club', 'name logo')
    .sort({ startDate: -1 });

  if (performances.length === 0) {
    return res.status(404).json({
      success: false,
      message: "No performance data found for this player"
    });
  }

  // Generate insights
  const insights = generateInsights(performances);

  res.json({
    success: true,
    insights
  });
});

// Helper function to get metric value
const getMetricValue = (performance, metric) => {
  switch (metric) {
    case 'goals':
      return performance.offensive.goals;
    case 'assists':
      return performance.offensive.assists;
    case 'tackles':
      return performance.defensive.tackles;
    case 'saves':
      return performance.defensive.saves;
    case 'passes':
      return performance.passing.passes;
    case 'distance':
      return performance.physical.distance;
    case 'rating':
      return performance.ratings.average;
    default:
      return performance.offensive.goals;
  }
};

// Helper function to generate insights
const generateInsights = (performances) => {
  const insights = [];
  
  // Find best performance
  const bestPerformance = performances.reduce((best, current) => {
    return current.ratings.average > best.ratings.average ? current : best;
  });
  
  if (bestPerformance) {
    insights.push({
      type: 'best_performance',
      message: `Your best performance was on ${bestPerformance.startDate.toLocaleDateString()} with a rating of ${bestPerformance.ratings.average.toFixed(1)}`,
      data: bestPerformance
    });
  }
  
  // Find improvement areas
  const recentPerformances = performances.slice(0, 3);
  if (recentPerformances.length > 1) {
    const avgGoals = recentPerformances.reduce((sum, p) => sum + p.offensive.goals, 0) / recentPerformances.length;
    if (avgGoals < 1) {
      insights.push({
        type: 'improvement_area',
        message: 'Consider focusing on goal-scoring opportunities in upcoming matches',
        area: 'goal_scoring'
      });
    }
  }
  
  return insights;
};

// Get player performance by ID
export const getPlayerPerformance = asyncHandler(async (req, res) => {
  const { playerId } = req.params;
  const { season, period } = req.query;

  const query = { player: playerId };
  if (season) query.season = season;
  if (period) query.period = period;

  const performances = await Performance.find(query)
    .populate('player', 'name avatarUrl position')
    .populate('club', 'name logo')
    .sort({ startDate: -1 });

  if (performances.length === 0) {
    return res.status(404).json({
      success: false,
      message: "No performance data found for this player"
    });
  }

  // Calculate career totals
  const careerTotals = await Performance.aggregate([
    { $match: { player: playerId } },
    {
      $group: {
        _id: null,
        totalMatches: { $sum: "$matches.total" },
        totalGoals: { $sum: "$offensive.goals" },
        totalAssists: { $sum: "$offensive.assists" },
        totalMinutes: { $sum: "$minutes.total" },
        totalTackles: { $sum: "$defensive.tackles" },
        totalSaves: { $sum: "$defensive.saves" },
        totalPasses: { $sum: "$passing.passes" },
        totalDistance: { $sum: "$physical.distance" },
        averageRating: { $avg: "$ratings.average" }
      }
    }
  ]);

  res.json({
    success: true,
    performances,
    careerTotals: careerTotals[0] || {},
    currentSeason: performances.find(p => p.season === getCurrentSeason())
  });
});

// Get performance comparison between players
export const comparePlayers = asyncHandler(async (req, res) => {
  const { playerIds, season, period, metrics } = req.body;

  if (!playerIds || playerIds.length < 2) {
    return res.status(400).json({
      success: false,
      message: "At least 2 player IDs are required for comparison"
    });
  }

  const query = {
    player: { $in: playerIds },
    season: season || getCurrentSeason(),
    period: period || 'seasonal'
  };

  const performances = await Performance.find(query)
    .populate('player', 'name avatarUrl position')
    .populate('club', 'name logo');

  if (performances.length === 0) {
    return res.status(404).json({
      success: false,
      message: "No performance data found for the specified players"
    });
  }

  // Group by player and calculate comparison metrics
  const comparison = playerIds.map(playerId => {
    const performance = performances.find(p => p.player._id.toString() === playerId);
    if (!performance) return null;

    return {
      player: performance.player,
      club: performance.club,
      stats: {
        matches: performance.matches.total,
        goals: performance.offensive.goals,
        assists: performance.offensive.assists,
        goalsPerMatch: performance.offensive.goalsPerMatch,
        assistsPerMatch: performance.offensive.assistsPerMatch,
        tackles: performance.defensive.tackles,
        saves: performance.defensive.saves,
        passes: performance.passing.passes,
        passAccuracy: performance.passing.passAccuracy,
        rating: performance.ratings.average,
        minutes: performance.minutes.total,
        distance: performance.physical.distance
      }
    };
  }).filter(Boolean);

  res.json({
    success: true,
    comparison,
    season: season || getCurrentSeason(),
    period: period || 'seasonal'
  });
});

// Get performance leaderboard
export const getPerformanceLeaderboard = asyncHandler(async (req, res) => {
  const { 
    season, 
    period, 
    metric, 
    position, 
    club, 
    limit = 20,
    page = 1
  } = req.query;

  const query = {};
  if (season) query.season = season;
  if (period) query.period = period;
  if (club) query.club = club;

  const skip = (page - 1) * limit;

  // Build aggregation pipeline
  const pipeline = [
    { $match: query },
    {
      $lookup: {
        from: 'players',
        localField: 'player',
        foreignField: '_id',
        as: 'playerData'
      }
    },
    { $unwind: '$playerData' },
    {
      $lookup: {
        from: 'users',
        localField: 'playerData.user',
        foreignField: '_id',
        as: 'userData'
      }
    },
    { $unwind: '$userData' }
  ];

  // Add position filter if specified
  if (position) {
    pipeline.push({
      $match: { 'playerData.position': position }
    });
  }

  // Add sorting based on metric
  let sortField = 'ratings.average';
  switch (metric) {
    case 'goals':
      sortField = 'offensive.goals';
      break;
    case 'assists':
      sortField = 'offensive.assists';
      break;
    case 'tackles':
      sortField = 'defensive.tackles';
      break;
    case 'saves':
      sortField = 'defensive.saves';
      break;
    case 'passes':
      sortField = 'passing.passes';
      break;
    case 'rating':
      sortField = 'ratings.average';
      break;
    case 'minutes':
      sortField = 'minutes.total';
      break;
    case 'distance':
      sortField = 'physical.distance';
      break;
    default:
      sortField = 'ratings.average';
  }

  pipeline.push(
    { $sort: { [sortField]: -1 } },
    { $skip: skip },
    { $limit: parseInt(limit) },
    {
      $project: {
        player: {
          _id: '$playerData._id',
          name: '$userData.name',
          avatarUrl: '$userData.avatar',
          position: '$playerData.position'
        },
        club: '$club',
        stats: {
          matches: '$matches.total',
          goals: '$offensive.goals',
          assists: '$offensive.assists',
          goalsPerMatch: '$offensive.goalsPerMatch',
          assistsPerMatch: '$offensive.assistsPerMatch',
          tackles: '$defensive.tackles',
          saves: '$defensive.saves',
          passes: '$passing.passes',
          passAccuracy: '$passing.passAccuracy',
          rating: '$ratings.average',
          minutes: '$minutes.total',
          distance: '$physical.distance'
        }
      }
    }
  );

  const leaderboard = await Performance.aggregate(pipeline);

  // Get total count for pagination
  const countPipeline = [
    { $match: query },
    {
      $lookup: {
        from: 'players',
        localField: 'player',
        foreignField: '_id',
        as: 'playerData'
      }
    },
    { $unwind: '$playerData' }
  ];

  if (position) {
    countPipeline.push({
      $match: { 'playerData.position': position }
    });
  }

  countPipeline.push({ $count: 'total' });

  const countResult = await Performance.aggregate(countPipeline);
  const total = countResult[0]?.total || 0;

  res.json({
    success: true,
    leaderboard,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit)
    },
    metric: metric || 'rating',
    season: season || getCurrentSeason(),
    period: period || 'seasonal'
  });
});

// Get performance trends over time
export const getPerformanceTrends = asyncHandler(async (req, res) => {
  const { playerId, season, metric, period = 'monthly' } = req.query;

  if (!playerId) {
    return res.status(400).json({
      success: false,
      message: "Player ID is required"
    });
  }

  const query = { player: playerId };
  if (season) query.season = season;

  const performances = await Performance.find(query)
    .sort({ startDate: 1 });

  if (performances.length === 0) {
    return res.status(404).json({
      success: false,
      message: "No performance data found for this player"
    });
  }

  // Map metric to performance field
  const metricMap = {
    'goals': 'offensive.goals',
    'assists': 'offensive.assists',
    'tackles': 'defensive.tackles',
    'saves': 'defensive.saves',
    'passes': 'passing.passes',
    'rating': 'ratings.average',
    'minutes': 'minutes.total',
    'distance': 'physical.distance'
  };

  const metricField = metricMap[metric] || 'ratings.average';

  // Generate trend data
  const trends = performances.map(perf => {
    const value = getNestedValue(perf, metricField);
    return {
      date: perf.startDate,
      period: perf.period,
      value: value || 0,
      label: formatPeriodLabel(perf.startDate, perf.period)
    };
  });

  // Calculate moving average
  const movingAverage = calculateMovingAverage(trends, 3);

  res.json({
    success: true,
    trends,
    movingAverage,
    metric: metric || 'rating',
    season: season || getCurrentSeason()
  });
});

// Get team performance statistics
export const getTeamPerformance = asyncHandler(async (req, res) => {
  const { clubId, season, period } = req.query;

  if (!clubId) {
    return res.status(400).json({
      success: false,
      message: "Club ID is required"
    });
  }

  const query = { club: clubId };
  if (season) query.season = season;
  if (period) query.period = period;

  const performances = await Performance.find(query)
    .populate('player', 'name avatarUrl position')
    .populate('club', 'name logo');

  if (performances.length === 0) {
    return res.status(404).json({
      success: false,
      message: "No performance data found for this club"
    });
  }

  // Calculate team totals
  const teamTotals = performances.reduce((totals, perf) => {
    totals.matches += perf.matches.total;
    totals.goals += perf.offensive.goals;
    totals.assists += perf.offensive.assists;
    totals.tackles += perf.defensive.tackles;
    totals.saves += perf.defensive.saves;
    totals.passes += perf.passing.passes;
    totals.minutes += perf.minutes.total;
    totals.distance += perf.physical.distance;
    totals.ratings.push(perf.ratings.average);
    return totals;
  }, {
    matches: 0,
    goals: 0,
    assists: 0,
    tackles: 0,
    saves: 0,
    passes: 0,
    minutes: 0,
    distance: 0,
    ratings: []
  });

  // Calculate averages
  teamTotals.averageRating = teamTotals.ratings.length > 0 
    ? teamTotals.ratings.reduce((a, b) => a + b, 0) / teamTotals.ratings.length 
    : 0;

  // Get top performers
  const topPerformers = {
    goals: performances.sort((a, b) => b.offensive.goals - a.offensive.goals).slice(0, 5),
    assists: performances.sort((a, b) => b.offensive.assists - a.offensive.assists).slice(0, 5),
    rating: performances.sort((a, b) => b.ratings.average - a.ratings.average).slice(0, 5),
    tackles: performances.sort((a, b) => b.defensive.tackles - a.defensive.tackles).slice(0, 5)
  };

  res.json({
    success: true,
    teamTotals,
    topPerformers,
    playerCount: performances.length,
    season: season || getCurrentSeason(),
    period: period || 'seasonal'
  });
});

// Get performance insights and recommendations
export const getPerformanceInsights = asyncHandler(async (req, res) => {
  const { playerId, season } = req.query;

  if (!playerId) {
    return res.status(400).json({
      success: false,
      message: "Player ID is required"
    });
  }

  const query = { player: playerId };
  if (season) query.season = season;

  const performances = await Performance.find(query)
    .populate('player', 'name avatarUrl position')
    .sort({ startDate: -1 });

  if (performances.length === 0) {
    return res.status(404).json({
      success: false,
      message: "No performance data found for this player"
    });
  }

  const currentPerformance = performances[0];
  const previousPerformance = performances[1];

  // Generate insights
  const insights = [];

  // Rating trend
  if (previousPerformance) {
    const ratingChange = currentPerformance.ratings.average - previousPerformance.ratings.average;
    if (ratingChange > 0.5) {
      insights.push({
        type: 'positive',
        category: 'rating',
        message: `Your rating has improved by ${ratingChange.toFixed(1)} points!`,
        suggestion: 'Keep up the great work and maintain this level of performance.'
      });
    } else if (ratingChange < -0.5) {
      insights.push({
        type: 'warning',
        category: 'rating',
        message: `Your rating has decreased by ${Math.abs(ratingChange).toFixed(1)} points.`,
        suggestion: 'Focus on improving your technical skills and match preparation.'
      });
    }
  }

  // Goals and assists
  if (currentPerformance.offensive.goals > 0) {
    insights.push({
      type: 'positive',
      category: 'scoring',
      message: `You've scored ${currentPerformance.offensive.goals} goals this season!`,
      suggestion: 'Continue working on your finishing and positioning.'
    });
  }

  if (currentPerformance.offensive.assists > 0) {
    insights.push({
      type: 'positive',
      category: 'playmaking',
      message: `You've provided ${currentPerformance.offensive.assists} assists this season!`,
      suggestion: 'Great vision! Keep looking for opportunities to create chances.'
    });
  }

  // Defensive performance
  if (currentPerformance.defensive.tackles > 0) {
    insights.push({
      type: 'positive',
      category: 'defense',
      message: `You've made ${currentPerformance.defensive.tackles} tackles this season!`,
      suggestion: 'Excellent defensive work. Maintain your positioning and timing.'
    });
  }

  // Areas for improvement
  if (currentPerformance.ratings.average < 7) {
    insights.push({
      type: 'improvement',
      category: 'overall',
      message: 'Your overall performance could be improved.',
      suggestion: 'Focus on consistency, fitness, and technical skills. Consider extra training sessions.'
    });
  }

  // Generate recommendations
  const recommendations = generateRecommendations(currentPerformance, insights);

  res.json({
    success: true,
    insights,
    recommendations,
    currentPerformance,
    season: season || getCurrentSeason()
  });
});

// Helper function to get nested object value
function getNestedValue(obj, path) {
  return path.split('.').reduce((current, key) => current && current[key], obj);
}

// Helper function to format period label
function formatPeriodLabel(date, period) {
  const d = new Date(date);
  switch (period) {
    case 'weekly':
      return `Week ${Math.ceil(d.getDate() / 7)}`;
    case 'monthly':
      return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    case 'seasonal':
      return d.getFullYear().toString();
    default:
      return d.toLocaleDateString();
  }
}

// Helper function to calculate moving average
function calculateMovingAverage(data, window) {
  const result = [];
  for (let i = 0; i < data.length; i++) {
    const start = Math.max(0, i - window + 1);
    const values = data.slice(start, i + 1).map(d => d.value);
    const average = values.reduce((a, b) => a + b, 0) / values.length;
    result.push({
      date: data[i].date,
      value: average,
      label: data[i].label
    });
  }
  return result;
}

// Helper function to generate recommendations
function generateRecommendations(performance, insights) {
  const recommendations = [];

  // Based on position
  if (performance.player?.position === 'Forward') {
    if (performance.offensive.goals < 5) {
      recommendations.push({
        priority: 'high',
        category: 'training',
        title: 'Improve Finishing',
        description: 'Focus on shooting drills and finishing exercises',
        exercises: ['Target practice', 'One-on-one with goalkeeper', 'Volley training']
      });
    }
  }

  if (performance.player?.position === 'Midfielder') {
    if (performance.passing.passAccuracy < 80) {
      recommendations.push({
        priority: 'medium',
        category: 'training',
        title: 'Enhance Passing Accuracy',
        description: 'Work on passing precision and vision',
        exercises: ['Passing drills', 'Vision training', 'First touch exercises']
      });
    }
  }

  if (performance.player?.position === 'Defender') {
    if (performance.defensive.tackles < 3) {
      recommendations.push({
        priority: 'medium',
        category: 'training',
        title: 'Improve Tackling',
        description: 'Focus on defensive positioning and tackling technique',
        exercises: ['Tackling practice', 'Positioning drills', '1v1 defending']
      });
    }
  }

  // General fitness recommendations
  if (performance.physical.distance < 8000) {
    recommendations.push({
      priority: 'medium',
      category: 'fitness',
      title: 'Increase Stamina',
      description: 'Build endurance for better match performance',
      exercises: ['Interval running', 'Long distance training', 'High-intensity workouts']
    });
  }

  return recommendations;
}

// Helper function to get current season
function getCurrentSeason() {
  const year = new Date().getFullYear();
  return `${year}-${year + 1}`;
}
