import express from 'express';
import { createRequirement, getRequirementsMe } from '../controllers/requirementController.js';
import { runMatchForRequirement, getMatchesForRequirement } from '../controllers/matchController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, createRequirement);

router.route('/me')
  .get(protect, getRequirementsMe);

router.route('/:id/match')
  .post(protect, runMatchForRequirement);

router.route('/:id/matches')
  .get(protect, getMatchesForRequirement);

export default router;
