import express from 'express';
import { 
  createPerformance, getPerformances, getPerformanceById, updatePerformance, deletePerformance 
} from '../controllers/performanceStatsController.js';

const router = express.Router();

router.post('/', createPerformance);
router.get('/', getPerformances);
router.get('/:id', getPerformanceById);
router.put('/:id', updatePerformance);
router.delete('/:id', deletePerformance);

export default router;
