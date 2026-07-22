import express from 'express';
import { getListings, createListing, getListingById } from '../controllers/listingController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getListings)
  .post(protect, createListing);

router.get('/:id', getListingById);

export default router;
