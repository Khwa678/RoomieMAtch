import express from 'express';
import { getConversations, getMessages, sendMessage } from '../controllers/chatController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/conversations', protect, getConversations);
router.route('/:matchId/messages')
  .get(protect, getMessages)
  .post(protect, sendMessage);

export default router;
