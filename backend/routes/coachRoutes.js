import express from 'express';
import { 
  createCoach, 
  getCoaches, 
  getCoachById, 
  updateCoach, 
  deleteCoach,
  getMyClubs,
  getAssignedPlayers,
  getTrainingSchedules,
  createTrainingSchedule,
  updateTrainingSchedule,
  deleteTrainingSchedule,
  getPerformanceData,
  updatePlayerPerformance,
  assignPlayerToClub,
  debugPlayerData
} from '../controllers/coachController.js';
import { removePlayerFromClub } from '../controllers/clubController.js';

const router = express.Router();

// Coach-specific management routes (MUST come before generic :id routes)
router.get('/my-clubs', getMyClubs);
router.get('/assigned-players', getAssignedPlayers);
router.get('/training-schedules', getTrainingSchedules);
router.post('/training-schedules', createTrainingSchedule);
router.put('/training-schedules/:id', updateTrainingSchedule);
router.delete('/training-schedules/:id', deleteTrainingSchedule);
router.get('/performance-data', getPerformanceData);
router.put('/players/:playerId/performance', updatePlayerPerformance);
router.post('/players/:playerId/assign-club', assignPlayerToClub);
router.get('/debug-player-data', debugPlayerData);

// Player management - remove player from club
router.delete('/clubs/:clubId/players/:playerId', removePlayerFromClub);

// Basic coach CRUD (MUST come after specific routes)
router.post('/', createCoach);
router.get('/', getCoaches);
router.get('/:id', getCoachById);
router.put('/:id', updateCoach);
router.delete('/:id', deleteCoach);

export default router;
