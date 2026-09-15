import express from 'express';
import { getProgress, addProgress, deleteProgress } from '../controllers/progressController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.get('/', getProgress);
router.post('/', addProgress);
router.delete('/:id', deleteProgress);

export default router;
