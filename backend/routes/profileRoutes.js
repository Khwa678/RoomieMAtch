import express from 'express';
import { createProfile, getProfileMe, updateProfileMe, getProfileById } from '../controllers/profileController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, createProfile);

router.route('/me')
  .get(protect, getProfileMe)
  .put(protect, updateProfileMe);

router.route('/:id')
  .get(protect, getProfileById);

export default router;
