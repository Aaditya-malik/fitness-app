import express from 'express';
import { getFoods, addFood, deleteFood } from '../controllers/foodController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.get('/', getFoods);
router.post('/', addFood);
router.delete('/:id', deleteFood);

export default router;
