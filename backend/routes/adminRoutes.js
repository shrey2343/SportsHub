import express from 'express';
import { 
  createAdmin, 
  getAdmins, 
  getAdminById, 
  updateAdmin, 
  deleteAdmin,
  listCoaches,
  listPlayers,
  listClubs,
  removeCoach,
  removePlayer,
  toggleUserStatus,
  getPayments,
  getReports,
  getPendingApprovals,
  approveClub,
  rejectClub
} from '../controllers/adminController.js';

const router = express.Router();

// Admin management routes (MUST come before generic :id routes)
router.get('/coaches', listCoaches);
router.get('/players', listPlayers);
router.get('/clubs', listClubs);
router.delete('/coaches/:id', removeCoach);
router.delete('/players/:id', removePlayer);
router.put('/:userType/:userId/status', toggleUserStatus);

// Additional admin features (MUST come before generic :id routes)
router.get('/payments', getPayments);
router.get('/reports', getReports);
router.get('/approvals', getPendingApprovals);
router.put('/clubs/:clubId/approve', approveClub);
router.put('/clubs/:clubId/reject', rejectClub);

// Basic admin CRUD (MUST come after specific routes)
router.post('/', createAdmin);
router.get('/', getAdmins);
router.get('/:id', getAdminById);
router.put('/:id', updateAdmin);
router.delete('/:id', deleteAdmin);

export default router;
