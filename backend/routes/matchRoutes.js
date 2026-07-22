import express from 'express';
import { connectMatch } from '../controllers/matchController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/:id/connect', protect, connectMatch);

export default router;
