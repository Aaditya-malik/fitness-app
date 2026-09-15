import express from 'express';
import {
  getWorkouts,
  createWorkout,
  toggleWorkout,
  deleteWorkout,
  loadPresetGoalWorkouts
} from '../controllers/workoutController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.get('/', getWorkouts);
router.post('/', createWorkout);
router.post('/presets', loadPresetGoalWorkouts);
router.patch('/:id/toggle', toggleWorkout);
router.delete('/:id', deleteWorkout);

export default router;
