import Profile from '../models/Profile.js';
import Match from '../models/Match.js';

// @desc    Create user profile
// @route   POST /api/profiles
export const createProfile = async (req, res) => {
  try {
    const existingProfile = await Profile.findOne({ userId: req.user._id });
    if (existingProfile) {
      return res.status(400).json({ message: 'Profile already exists for this user. Use PUT to update.' });
    }

    const profile = await Profile.create({
      ...req.body,
      userId: req.user._id,
    });

    res.status(201).json(profile);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get logged in user's profile
// @route   GET /api/profiles/me
export const getProfileMe = async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.user._id }).populate('userId', 'name email profilePhotoUrl');
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update logged in user's profile
// @route   PUT /api/profiles/me
export const updateProfileMe = async (req, res) => {
  try {
    let profile = await Profile.findOne({ userId: req.user._id });

    if (!profile) {
      // Create if doesn't exist
      profile = await Profile.create({
        ...req.body,
        userId: req.user._id,
      });
      return res.status(201).json(profile);
    }

    Object.assign(profile, req.body);
    await profile.save();

    res.json(profile);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get public profile detail by profile ID (with privacy sanitization)
// @route   GET /api/profiles/:id
export const getProfileById = async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id).populate('userId', 'name email profilePhotoUrl');
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    // Check if req.user is connected to this profile via any match
    const isOwner = req.user && profile.userId && profile.userId._id.toString() === req.user._id.toString();

    let isConnected = false;
    if (req.user && !isOwner) {
      const matchDoc = await Match.findOne({
        seekerUserId: req.user._id,
        matchedProfileId: profile._id,
        status: 'connected',
      });
      if (matchDoc) {
        isConnected = true;
      }
    }

    // Sanitize user email unless connected or owner
    const sanitizedProfile = profile.toObject();
    if (!isConnected && !isOwner) {
      sanitizedProfile.userId.email = '[Contact Info Redacted — Click Connect to Reveal]';
    }

    sanitizedProfile.isConnected = isConnected;
    sanitizedProfile.isOwner = isOwner;

    res.json(sanitizedProfile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
