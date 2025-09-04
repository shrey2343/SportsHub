// controllers/coachController.js
import Coach from "../models/Coach.js";
import Club from "../models/Club.js";
import Player from "../models/Player.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

export const createCoach = async (req, res) => {
  try {
    const coach = await Coach.create(req.body);
    res.status(201).json(coach);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getCoaches = async (req, res) => {
  try {
    const coaches = await Coach.find();
    res.json(coaches);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getCoachById = async (req, res) => {
  try {
    const coach = await Coach.findById(req.params.id);
    if (!coach) return res.status(404).json({ message: "Coach not found" });
    res.json(coach);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateCoach = async (req, res) => {
  try {
    const coach = await Coach.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!coach) return res.status(404).json({ message: "Coach not found" });
    res.json(coach);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteCoach = async (req, res) => {
  try {
    const coach = await Coach.findByIdAndDelete(req.params.id);
    if (!coach) return res.status(404).json({ message: "Coach deleted" });
    res.json({ message: "Coach deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get clubs owned by the authenticated coach
export const getMyClubs = asyncHandler(async (req, res) => {
  try {
    console.log('🔍 getMyClubs called with user:', req.user);
    
    // Check if user exists and has proper structure
    if (!req.user || !req.user._id) {
      console.log('❌ No user or user._id found');
      return res.status(401).json({ 
        success: false, 
        message: 'User not authenticated properly' 
      });
    }
    
    const coachId = req.user._id; // Use _id instead of id
    console.log('🔍 Fetching clubs for coach:', coachId);
    
    // First check if this user has a coach profile
    const coachProfile = await Coach.findOne({ user: coachId });
    if (!coachProfile) {
      console.log('❌ No coach profile found for user:', coachId);
      return res.status(404).json({ 
        success: false, 
        message: 'Coach profile not found' 
      });
    }
    
    console.log('✅ Coach profile found:', coachProfile._id);
    
    const clubs = await Club.find({ coach: coachProfile._id })
      .populate('players', 'name position')
      .sort({ createdAt: -1 }); // Most recent first
    
    console.log('✅ Found clubs:', clubs.length);
    
    res.status(200).json({ 
      success: true, 
      clubs: clubs.map(club => ({
        _id: club._id,
        name: club.name,
        sport: club.sport,
        location: club.location,
        registrationFee: club.registrationFee,
        status: club.status || 'pending',
        description: club.description,
        maxPlayers: club.maxPlayers,
        facilities: club.facilities,
        players: club.players,
        createdAt: club.createdAt,
        updatedAt: club.updatedAt
      }))
    });
  } catch (error) {
    console.error('❌ Error fetching coach clubs:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch clubs',
      error: error.message 
    });
  }
});

// Get players assigned to the authenticated coach
export const getAssignedPlayers = asyncHandler(async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ 
        success: false, 
        message: 'User not authenticated properly' 
      });
    }
    
    const coachId = req.user._id;
    const coachProfile = await Coach.findOne({ user: coachId });
    if (!coachProfile) {
      return res.status(404).json({ 
        success: false, 
        message: 'Coach profile not found' 
      });
    }
    
    // Find all clubs owned by this coach
    const coachClubs = await Club.find({ coach: coachProfile._id }).select('_id name');
    
    // Find players in two ways:
    // 1. Players directly assigned to this coach
    // 2. Players in clubs owned by this coach
    const players = await Player.find({
      $or: [
        { coach: coachProfile._id },
        { club: { $in: coachClubs.map(c => c._id) } }
      ]
    })
    .populate('user', 'name email status')
    .populate('club', 'name sport location')
    .populate('coach', 'user')
    .lean();
    
    // Format the response to include club information
    const formattedPlayers = players.map(player => ({
      _id: player._id,
      name: player.user?.name || 'Unknown Player',
      email: player.user?.email || 'No email',
      position: player.position || 'Forward',
      status: player.user?.status || 'active',
      club: player.club ? {
        _id: player.club._id,
        name: player.club.name,
        sport: player.club.sport,
        location: player.club.location
      } : null,
      coach: player.coach ? {
        _id: player.coach._id,
        name: player.coach.user?.name || 'Unknown Coach'
      } : null,
      avatarUrl: player.avatarUrl || '',
      createdAt: player.createdAt,
      updatedAt: player.updatedAt
    }));
    
    res.status(200).json({ 
      success: true, 
      players: formattedPlayers,
      totalPlayers: formattedPlayers.length,
      coachClubs: coachClubs.length
    });
  } catch (error) {
    console.error('❌ Error fetching assigned players:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch players',
      error: error.message 
    });
  }
});

// Get training schedules for the authenticated coach
export const getTrainingSchedules = asyncHandler(async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ 
        success: false, 
        message: 'User not authenticated properly' 
      });
    }
    
    const coachId = req.user._id;
    const coachProfile = await Coach.findOne({ user: coachId });
    if (!coachProfile) {
      return res.status(404).json({ 
        success: false, 
        message: 'Coach profile not found' 
      });
    }
    
    // For now, return mock training schedules
    // In a real app, you'd have a TrainingSchedule model
    const mockSchedules = [
      {
        _id: '1',
        title: 'Morning Training',
        date: '2024-01-15',
        time: '06:00',
        venue: 'Main Ground',
        status: 'active',
        players: []
      }
    ];
    
    res.status(200).json({ success: true, schedules: mockSchedules });
  } catch (error) {
    console.error('❌ Error fetching training schedules:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch training schedules',
      error: error.message 
    });
  }
});

// Create training schedule
export const createTrainingSchedule = asyncHandler(async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ 
        success: false, 
        message: 'User not authenticated properly' 
      });
    }
    
    const { title, date, time, venue, clubId } = req.body;
    const coachId = req.user._id;
    
    // Verify coach owns the club
    const club = await Club.findOne({ _id: clubId, coach: coachId });
    if (!club) {
      return res.status(403).json({ success: false, message: 'Club not found or access denied' });
    }
    
    // In a real app, save to TrainingSchedule model
    const schedule = {
      _id: Date.now().toString(),
      title,
      date,
      time,
      venue,
      clubId,
      coachId,
      status: 'active',
      createdAt: new Date()
    };
    
    res.status(201).json({ success: true, schedule });
  } catch (error) {
    console.error('❌ Error creating training schedule:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create training schedule',
      error: error.message 
    });
  }
});

// Update training schedule
export const updateTrainingSchedule = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  
  // In a real app, update in TrainingSchedule model
  const schedule = {
    _id: id,
    ...updateData,
    updatedAt: new Date()
  };
  
  res.json({ success: true, schedule });
});

// Delete training schedule
export const deleteTrainingSchedule = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  // In a real app, delete from TrainingSchedule model
  
  res.json({ success: true, message: 'Training schedule deleted successfully' });
});

// Get performance data for players
export const getPerformanceData = asyncHandler(async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ 
        success: false, 
        message: 'User not authenticated properly' 
      });
    }
    
    const coachId = req.user._id;
    const coachProfile = await Coach.findOne({ user: coachId });
    if (!coachProfile) {
      return res.status(404).json({ 
        success: false, 
        message: 'Coach profile not found' 
      });
    }
    
    // In a real app, fetch from Performance model
    const performance = [
      {
        _id: '1',
        playerId: 'player1',
        playerName: 'John Doe',
        score: 85,
        date: new Date(),
        metrics: { speed: 8, accuracy: 9, strength: 7 }
      }
    ];
    
    res.status(200).json({ success: true, performance });
  } catch (error) {
    console.error('❌ Error fetching performance data:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch performance data',
      error: error.message 
    });
  }
});

// Update player performance
export const updatePlayerPerformance = asyncHandler(async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ 
        success: false, 
        message: 'User not authenticated properly' 
      });
    }
    
    const { playerId } = req.params;
    const { score, metrics, notes } = req.body;
    const coachId = req.user._id;
    
    // Verify coach has access to this player
    const player = await Player.findOne({ _id: playerId, coach: coachId });
    if (!player) {
      return res.status(403).json({ success: false, message: 'Player not found or access denied' });
    }
    
    // In a real app, save to Performance model
    
    res.json({ success: true, message: 'Performance updated successfully' });
  } catch (error) {
    console.error('❌ Error updating player performance:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update performance',
      error: error.message 
    });
  }
});

// Assign player to club
export const assignPlayerToClub = asyncHandler(async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ 
        success: false, 
        message: 'User not authenticated properly' 
      });
    }
    
    const { playerId } = req.params;
    const { clubId } = req.body;
    const coachId = req.user._id;
    
    // Verify coach owns the club
    const club = await Club.findOne({ _id: clubId, coach: coachId });
    if (!club) {
      return res.status(403).json({ success: false, message: 'Club not found or access denied' });
    }
    
    // Verify coach has access to the player
    const player = await Player.findOne({ _id: playerId, coach: coachId });
    if (!player) {
      return res.status(403).json({ success: false, message: 'Player not found or access denied' });
    }
    
    // Update player's club assignment
    await Player.findByIdAndUpdate(playerId, { club: clubId });
    
    res.json({ success: true, message: 'Player assigned to club successfully' });
  } catch (error) {
    console.error('❌ Error assigning player to club:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to assign player to club',
      error: error.message 
    });
  }
});

// Debug function to check player data
export const debugPlayerData = asyncHandler(async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ 
        success: false, 
        message: 'User not authenticated properly' 
      });
    }
    
    const coachId = req.user._id;
    const coachProfile = await Coach.findOne({ user: coachId });
    
    // Get all players in the system
    const allPlayers = await Player.find().populate('user', 'name email').populate('club', 'name').populate('coach', 'user');
    
    // Get coach's clubs
    const coachClubs = await Club.find({ coach: coachProfile?._id });
    
    res.json({
      success: true,
      debug: {
        coachId,
        coachProfile: coachProfile ? { _id: coachProfile._id, user: coachProfile.user } : null,
        totalPlayersInSystem: allPlayers.length,
        playersWithCoach: allPlayers.filter(p => p.coach).length,
        playersInCoachClubs: allPlayers.filter(p => p.club && coachClubs.some(c => String(c._id) === String(p.club._id))).length,
        coachClubs: coachClubs.length,
        allPlayers: allPlayers.map(p => ({
          _id: p._id,
          name: p.user?.name,
          email: p.user?.email,
          club: p.club?.name,
          coach: p.coach?.user?.name
        }))
      }
    });
  } catch (error) {
    console.error('❌ Debug error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Debug failed',
      error: error.message 
    });
  }
});
