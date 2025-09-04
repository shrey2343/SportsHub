import express from 'express';
import { 
  createPlayer, getPlayers, getPlayerById, updatePlayer, deletePlayer, getMyClub, joinClub, getMe, updateMe, uploadAvatar, uploadAvatarMulter
} from '../controllers/playerController.js';
import { protect, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Player self routes (must be before param routes)
router.get('/my-club', protect, requireRole('player', 'coach', 'admin'), getMyClub);
router.post('/join-club/:clubId', protect, requireRole('player', 'coach', 'admin'), joinClub);
router.get('/me', protect, requireRole('player', 'coach', 'admin'), getMe);
router.put('/me', protect, requireRole('player', 'coach', 'admin'), updateMe);
router.post('/me/avatar', protect, requireRole('player', 'coach', 'admin'), uploadAvatarMulter, uploadAvatar);

// Test route for debugging
router.get('/test', protect, (req, res) => {
  res.json({ 
    message: 'Player routes working',
    user: req.user._id,
    userEmail: req.user.email,
    userRole: req.user.role
  });
});

// CRUD
router.post('/', createPlayer);
router.get('/', getPlayers);
router.get('/:id', getPlayerById);
router.put('/:id', updatePlayer);
router.delete('/:id', deletePlayer);

export default router;
