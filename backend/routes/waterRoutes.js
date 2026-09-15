import express from 'express';
import { getWater, updateWater, resetWater } from '../controllers/waterController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.get('/', getWater);
router.post('/', updateWater);
router.post('/reset', resetWater);

export default router;
