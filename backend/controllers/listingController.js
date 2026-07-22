import Listing from '../models/Listing.js';
import Profile from '../models/Profile.js';

// @desc    Get all flat/room listings (with optional city filter)
// @route   GET /api/listings
export const getListings = async (req, res) => {
  try {
    const { city, maxRent, roomType } = req.query;
    const filter = { isAvailable: true };

    if (city) {
      filter.city = new RegExp(city, 'i');
    }
    if (maxRent) {
      filter.rent = { $lte: Number(maxRent) };
    }
    if (roomType) {
      filter.roomType = roomType;
    }

    const listings = await Listing.find(filter)
      .populate('hostUserId', 'name email profilePhotoUrl')
      .populate('hostProfileId')
      .sort({ createdAt: -1 });

    res.json(listings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new room listing
// @route   POST /api/listings
export const createListing = async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.user._id });
    if (!profile) {
      return res.status(400).json({ message: 'Please create a profile before listing a spot.' });
    }

    const listing = await Listing.create({
      ...req.body,
      hostUserId: req.user._id,
      hostProfileId: profile._id,
    });

    res.status(201).json(listing);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get single listing details by ID
// @route   GET /api/listings/:id
export const getListingById = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id)
      .populate('hostUserId', 'name email profilePhotoUrl')
      .populate('hostProfileId');

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    res.json(listing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
