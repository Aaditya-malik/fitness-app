import express from 'express';
import { updateProfile, getDashboardSummary } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.get('/dashboard-summary', getDashboardSummary);
router.put('/profile', updateProfile);

export default router;
