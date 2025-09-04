// controllers/tournamentController.js
import Tournament from "../models/Tournament.js";
import Match from "../models/Match.js";
import Club from "../models/Club.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

// Create a new tournament
export const createTournament = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    sport,
    format,
    startDate,
    endDate,
    registrationDeadline,
    maxTeams,
    minTeams,
    entryFee,
    prizePool,
    rules,
    ageGroups,
    genderCategories,
    venues,
    referees,
    sponsors,
    liveStreaming,
    club
  } = req.body;

  // Validate required fields
  if (!name || !sport || !startDate || !endDate || !registrationDeadline || !maxTeams || !club) {
    return res.status(400).json({
      success: false,
      message: "Name, sport, dates, max teams, and club are required"
    });
  }

  // Check if user has permission to create tournaments for this club
  if (req.user.role !== 'admin' && req.user.role !== 'coach') {
    return res.status(403).json({
      success: false,
      message: "Only coaches and admins can create tournaments"
    });
  }

  // Validate dates
  const start = new Date(startDate);
  const end = new Date(endDate);
  const deadline = new Date(registrationDeadline);

  if (start >= end) {
    return res.status(400).json({
      success: false,
      message: "Start date must be before end date"
    });
  }

  if (deadline >= start) {
    return res.status(400).json({
      success: false,
      message: "Registration deadline must be before start date"
    });
  }

  const tournament = await Tournament.create({
    name,
    description,
    sport,
    format: format || 'knockout',
    startDate: start,
    endDate: end,
    registrationDeadline: deadline,
    maxTeams,
    minTeams: minTeams || 2,
    entryFee: entryFee || 0,
    prizePool: prizePool || { first: 0, second: 0, third: 0 },
    rules: rules || [],
    ageGroups: ageGroups || [],
    genderCategories: genderCategories || [],
    venues: venues || [],
    referees: referees || [],
    sponsors: sponsors || [],
    liveStreaming: liveStreaming || { enabled: false },
    createdBy: req.user._id,
    club
  });

  // Populate references
  await tournament.populate([
    { path: 'club', select: 'name logo' },
    { path: 'referees.user', select: 'name' }
  ]);

  res.status(201).json({
    success: true,
    message: "Tournament created successfully",
    tournament
  });
});

// Get all tournaments with filtering
export const getTournaments = asyncHandler(async (req, res) => {
  const {
    status,
    sport,
    club,
    format,
    page = 1,
    limit = 10
  } = req.query;

  const query = {};

  // Apply filters
  if (status) query.status = status;
  if (sport) query.sport = sport;
  if (club) query.club = club;
  if (format) query.format = format;

  const skip = (page - 1) * limit;

  const tournaments = await Tournament.find(query)
    .populate([
      { path: 'club', select: 'name logo' },
      { path: 'teams.team', select: 'name logo' },
      { path: 'referees.user', select: 'name' }
    ])
    .sort({ startDate: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Tournament.countDocuments(query);

  res.json({
    success: true,
    tournaments,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit)
    }
  });
});

// Get tournament by ID
export const getTournamentById = asyncHandler(async (req, res) => {
  const tournament = await Tournament.findById(req.params.id)
    .populate([
      { path: 'club', select: 'name logo' },
      { path: 'teams.team', select: 'name logo players' },
      { path: 'referees.user', select: 'name' },
      { path: 'groups.teams', select: 'name logo' },
      { path: 'groups.matches', select: 'title homeScore awayScore status' },
      { path: 'knockoutRounds.matches', select: 'title homeScore awayScore status' },
      { path: 'knockoutRounds.teams', select: 'name logo' }
    ]);

  if (!tournament) {
    return res.status(404).json({
      success: false,
      message: "Tournament not found"
    });
  }

  res.json({
    success: true,
    tournament
  });
});

// Register team for tournament
export const registerTeam = asyncHandler(async (req, res) => {
  const { tournamentId } = req.params;
  const { teamId } = req.body;

  const tournament = await Tournament.findById(tournamentId);
  if (!tournament) {
    return res.status(404).json({
      success: false,
      message: "Tournament not found"
    });
  }

  // Check if user has permission to register teams
  if (req.user.role !== 'admin' && req.user.role !== 'coach') {
    return res.status(403).json({
      success: false,
      message: "Only coaches and admins can register teams"
    });
  }

  try {
    await tournament.registerTeam(teamId);
    
    // Populate references for response
    await tournament.populate([
      { path: 'teams.team', select: 'name logo' },
      { path: 'club', select: 'name' }
    ]);

    res.json({
      success: true,
      message: "Team registered successfully",
      tournament
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Withdraw team from tournament
export const withdrawTeam = asyncHandler(async (req, res) => {
  const { tournamentId } = req.params;
  const { teamId } = req.body;

  const tournament = await Tournament.findById(tournamentId);
  if (!tournament) {
    return res.status(404).json({
      success: false,
      message: "Tournament not found"
    });
  }

  // Check if user has permission to withdraw teams
  if (req.user.role !== 'admin' && req.user.role !== 'coach') {
    return res.status(403).json({
      success: false,
      message: "Only coaches and admins can withdraw teams"
    });
  }

  try {
    await tournament.withdrawTeam(teamId);
    
    // Populate references for response
    await tournament.populate([
      { path: 'teams.team', select: 'name logo' },
      { path: 'club', select: 'name' }
    ]);

    res.json({
      success: true,
      message: "Team withdrawn successfully",
      tournament
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Generate tournament brackets
export const generateBrackets = asyncHandler(async (req, res) => {
  const { tournamentId } = req.params;

  const tournament = await Tournament.findById(tournamentId);
  if (!tournament) {
    return res.status(404).json({
      success: false,
      message: "Tournament not found"
    });
  }

  // Check if user has permission to generate brackets
  if (req.user.role !== 'admin' && req.user.role !== 'coach') {
    return res.status(403).json({
      success: false,
      message: "Only coaches and admins can generate brackets"
    });
  }

  // Check if tournament has enough teams
  const confirmedTeams = tournament.teams.filter(t => t.status === 'confirmed');
  if (confirmedTeams.length < tournament.minTeams) {
    return res.status(400).json({
      success: false,
      message: `Need at least ${tournament.minTeams} confirmed teams to generate brackets`
    });
  }

  try {
    await tournament.generateBrackets();
    
    // Populate references for response
    await tournament.populate([
      { path: 'teams.team', select: 'name logo' },
      { path: 'knockoutRounds.teams', select: 'name logo' }
    ]);

    res.json({
      success: true,
      message: "Tournament brackets generated successfully",
      tournament
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Update tournament status
export const updateTournamentStatus = asyncHandler(async (req, res) => {
  const { tournamentId } = req.params;
  const { status } = req.body;

  const tournament = await Tournament.findById(tournamentId);
  if (!tournament) {
    return res.status(404).json({
      success: false,
      message: "Tournament not found"
    });
  }

  // Check if user has permission to update tournament status
  if (req.user.role !== 'admin' && req.user.role !== 'coach') {
    return res.status(403).json({
      success: false,
      message: "Only coaches and admins can update tournament status"
    });
  }

  // Validate status transition
  const validTransitions = {
    'upcoming': ['registration', 'in_progress', 'cancelled'],
    'registration': ['in_progress', 'cancelled'],
    'in_progress': ['completed', 'cancelled'],
    'completed': [],
    'cancelled': []
  };

  if (!validTransitions[tournament.status].includes(status)) {
    return res.status(400).json({
      success: false,
      message: `Cannot transition from ${tournament.status} to ${status}`
    });
  }

  tournament.status = status;
  await tournament.save();

  // Populate references for response
  await tournament.populate([
    { path: 'club', select: 'name logo' },
    { path: 'teams.team', select: 'name logo' }
  ]);

  res.json({
    success: true,
    message: "Tournament status updated successfully",
    tournament
  });
});

// Get tournament standings
export const getTournamentStandings = asyncHandler(async (req, res) => {
  const { tournamentId } = req.params;

  const tournament = await Tournament.findById(tournamentId)
    .populate([
      { path: 'groups.standings.team', select: 'name logo' },
      { path: 'teams.team', select: 'name logo' }
    ]);

  if (!tournament) {
    return res.status(404).json({
      success: false,
      message: "Tournament not found"
    });
  }

  // Calculate overall standings if it's a group tournament
  let overallStandings = [];
  if (tournament.format === 'group_knockout' || tournament.format === 'league') {
    const teamStats = new Map();

    // Aggregate stats from all groups
    tournament.groups.forEach(group => {
      group.standings.forEach(standing => {
        const teamId = standing.team._id.toString();
        if (!teamStats.has(teamId)) {
          teamStats.set(teamId, {
            team: standing.team,
            played: 0,
            won: 0,
            drawn: 0,
            lost: 0,
            goalsFor: 0,
            goalsAgainst: 0,
            points: 0
          });
        }

        const stats = teamStats.get(teamId);
        stats.played += standing.played;
        stats.won += standing.won;
        stats.drawn += standing.drawn;
        stats.lost += standing.lost;
        stats.goalsFor += standing.goalsFor;
        stats.goalsAgainst += standing.goalsAgainst;
        stats.points += standing.points;
      });
    });

    overallStandings = Array.from(teamStats.values())
      .sort((a, b) => {
        // Sort by points, then goal difference, then goals scored
        if (b.points !== a.points) return b.points - a.points;
        const aGD = a.goalsFor - a.goalsAgainst;
        const bGD = b.goalsFor - b.goalsAgainst;
        if (bGD !== aGD) return bGD - aGD;
        return b.goalsFor - a.goalsFor;
      });
  }

  res.json({
    success: true,
    tournament: {
      _id: tournament._id,
      name: tournament.name,
      format: tournament.format,
      status: tournament.status,
      groups: tournament.groups,
      knockoutRounds: tournament.knockoutRounds,
      overallStandings
    }
  });
});

// Get upcoming tournaments
export const getUpcomingTournaments = asyncHandler(async (req, res) => {
  const { club, sport, limit = 10 } = req.query;

  const query = {
    status: { $in: ['upcoming', 'registration'] },
    startDate: { $gte: new Date() }
  };

  if (club) query.club = club;
  if (sport) query.sport = sport;

  const tournaments = await Tournament.find(query)
    .populate([
      { path: 'club', select: 'name logo' },
      { path: 'teams.team', select: 'name logo' }
    ])
    .sort({ startDate: 1 })
    .limit(parseInt(limit));

  res.json({
    success: true,
    tournaments
  });
});

// Update tournament details
export const updateTournament = asyncHandler(async (req, res) => {
  const { tournamentId } = req.params;
  const updateData = req.body;

  const tournament = await Tournament.findById(tournamentId);
  if (!tournament) {
    return res.status(404).json({
      success: false,
      message: "Tournament not found"
    });
  }

  // Check if user has permission to update tournament
  if (req.user.role !== 'admin' && req.user.role !== 'coach') {
    return res.status(403).json({
      success: false,
      message: "Only coaches and admins can update tournaments"
    });
  }

  // Prevent updating certain fields if tournament has started
  if (tournament.status !== 'upcoming') {
    delete updateData.startDate;
    delete updateData.endDate;
    delete updateData.maxTeams;
    delete updateData.format;
  }

  const updatedTournament = await Tournament.findByIdAndUpdate(
    tournamentId,
    updateData,
    { new: true, runValidators: true }
  ).populate([
    { path: 'club', select: 'name logo' },
    { path: 'teams.team', select: 'name logo' }
  ]);

  res.json({
    success: true,
    message: "Tournament updated successfully",
    tournament: updatedTournament
  });
});

// Delete tournament
export const deleteTournament = asyncHandler(async (req, res) => {
  const { tournamentId } = req.params;

  const tournament = await Tournament.findById(tournamentId);
  if (!tournament) {
    return res.status(404).json({
      success: false,
      message: "Tournament not found"
    });
  }

  // Check if user has permission to delete tournament
  if (req.user.role !== 'admin' && req.user.role !== 'coach') {
    return res.status(403).json({
      success: false,
      message: "Only coaches and admins can delete tournaments"
    });
  }

  // Prevent deletion if tournament has started
  if (tournament.status !== 'upcoming') {
    return res.status(400).json({
      success: false,
      message: "Cannot delete tournament that has already started"
    });
  }

  await Tournament.findByIdAndDelete(tournamentId);

  res.json({
    success: true,
    message: "Tournament deleted successfully"
  });
});
