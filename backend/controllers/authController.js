import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/User.js';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'roomiematch_super_secret_jwt_key_2026', {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/signup
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email, and password' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'An account with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
      authProvider: 'local',
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profilePhotoUrl: user.profilePhotoUrl,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (user.authProvider === 'google' && !user.passwordHash) {
      return res.status(400).json({ message: 'This account was registered via Google Sign-In. Please sign in with Google or reset password.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profilePhotoUrl: user.profilePhotoUrl,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Google OAuth Login/Signup & Account Merging
// @route   POST /api/auth/google
export const googleAuth = async (req, res) => {
  try {
    const { idToken, googleUser } = req.body;
    let email, name, picture, googleId;

    if (idToken) {
      try {
        const ticket = await client.verifyIdToken({
          idToken,
          audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        email = payload.email;
        name = payload.name;
        picture = payload.picture;
        googleId = payload.sub;
      } catch (tokenErr) {
        console.warn('[Google Token Verification Error]:', tokenErr.message);
        // Fallback for dev / unverified tokens if payload passed directly
        if (googleUser && googleUser.email) {
          email = googleUser.email;
          name = googleUser.name || 'Google User';
          picture = googleUser.picture;
          googleId = googleUser.sub;
        } else {
          return res.status(400).json({ message: 'Google Token verification failed: ' + tokenErr.message });
        }
      }
    } else if (googleUser && googleUser.email) {
      email = googleUser.email;
      name = googleUser.name || 'Google User';
      picture = googleUser.picture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400';
      googleId = googleUser.sub || `google_${Date.now()}`;
    } else {
      return res.status(400).json({ message: 'Invalid Google authentication payload' });
    }

    // Account Merging Logic: Find existing user by email
    let user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      // Create new user
      user = await User.create({
        name,
        email: email.toLowerCase(),
        authProvider: 'google',
        googleId,
        profilePhotoUrl: picture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
      });
    } else {
      // Merge account: Link googleId and update photo if not set
      let updated = false;
      if (!user.googleId) {
        user.googleId = googleId;
        updated = true;
      }
      if (picture && (!user.profilePhotoUrl || user.profilePhotoUrl.includes('unsplash'))) {
        user.profilePhotoUrl = picture;
        updated = true;
      }
      if (updated) {
        await user.save();
      }
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profilePhotoUrl: user.profilePhotoUrl,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error('[Google Auth Controller Error]:', error);
    res.status(500).json({ message: 'Google authentication failed: ' + error.message });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-passwordHash');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
