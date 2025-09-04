import express from 'express';
import { 
  createClub, getClubs, getClubById, updateClub, deleteClub, removePlayerFromClub, getMyClubs, leaveClub
} from '../controllers/clubController.js';
import { protect, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, requireRole('coach', 'admin'), createClub);
router.get('/', getClubs);
router.get('/mine', protect, requireRole('coach', 'admin'), getMyClubs);
router.get('/:id', getClubById);
router.put('/:id', updateClub);
router.delete('/:id', protect, requireRole('coach', 'admin'), deleteClub);

// Remove player from a specific club (coach/admin only)
router.delete('/:clubId/players/:playerId', protect, requireRole('coach', 'admin'), removePlayerFromClub);

// Leave a club (player self-service)
router.delete('/:clubId/leave', protect, requireRole('player', 'coach', 'admin'), leaveClub);

// Join a club (player self-service)
router.post('/:clubId/join', protect, requireRole('player'), async (req, res) => {
  try {
    const { clubId } = req.params;
    const userId = req.user._id || req.user.id;
    
    // Check if user is already a player
    const Player = await import('../models/Player.js');
    let player = await Player.default.findOne({ user: userId });
    
    if (!player) {
      // Create player profile if it doesn't exist
      player = await Player.default.create({
        user: userId,
        position: 'Forward',
        status: 'active'
      });
    }
    
    // Load club and validate
    
    const Club = await import('../models/Club.js');
    const club = await Club.default.findById(clubId);
    if (!club) {
      return res.status(404).json({ success: false, message: 'Club not found' });
    }
    
    if (club.status !== 'approved') {
      return res.status(400).json({ 
        success: false, 
        message: 'This club is not yet approved for new members' 
      });
    }
    
    // New rule: allow multiple clubs as long as sports differ
    const currentClubIds = player.clubs || [];
    if (currentClubIds.length > 0) {
      // Load current clubs to compare sports
      const existingClubs = await Club.default.find({ _id: { $in: currentClubIds } }).select('sport');
      const playsSameSport = existingClubs.some((c) => c.sport === club.sport);
      if (playsSameSport) {
        return res.status(400).json({
          success: false,
          message: `You are already enrolled in a ${club.sport} club. You can only join clubs of different sports.`
        });
      }
    }

    // Add club to player's clubs[] and keep legacy field consistent
    if (!player.clubs) player.clubs = [];
    if (!player.clubs.find((c) => String(c) === String(clubId))) {
      player.clubs.push(clubId);
    }
    // For backward compatibility, set legacy club pointer to the most recent
    player.club = clubId;
    await player.save();
    
    res.json({ success: true, message: 'Successfully joined the club' });
  } catch (error) {
    console.error('Error joining club:', error);
    res.status(500).json({ success: false, message: 'Failed to join club' });
  }
});

export default router;
