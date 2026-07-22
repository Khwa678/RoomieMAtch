import Match from '../models/Match.js';
import RequirementForm from '../models/RequirementForm.js';
import { findTopMatches } from '../services/matchingEngine.js';

// @desc    Trigger AI matching engine for a requirement form
// @route   POST /api/requirements/:id/match
export const runMatchForRequirement = async (req, res) => {
  try {
    const requirementForm = await RequirementForm.findById(req.params.id);
    if (!requirementForm) {
      return res.status(404).json({ message: 'Requirement form not found' });
    }

    if (requirementForm.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to run match for this requirement' });
    }

    // Run AI Matching Engine
    const topMatches = await findTopMatches(requirementForm);

    if (topMatches.length === 0) {
      return res.json({
        message: 'No matches found yet',
        matches: [],
      });
    }

    // Save or update match records in DB
    const savedMatches = await Promise.all(
      topMatches.map(async (item) => {
        let matchDoc = await Match.findOne({
          requirementFormId: requirementForm._id,
          matchedProfileId: item.matchedProfile._id,
        });

        if (!matchDoc) {
          matchDoc = await Match.create({
            requirementFormId: requirementForm._id,
            seekerUserId: req.user._id,
            matchedProfileId: item.matchedProfile._id,
            compatibilityScore: item.compatibilityScore,
            matchingFactors: item.matchingFactors,
            aiExplanation: item.aiExplanation,
            status: 'pending',
          });
        } else {
          matchDoc.compatibilityScore = item.compatibilityScore;
          matchDoc.matchingFactors = item.matchingFactors;
          matchDoc.aiExplanation = item.aiExplanation;
          await matchDoc.save();
        }

        const matchObj = matchDoc.toObject();
        matchObj.matchedProfile = item.matchedProfile;
        return matchObj;
      })
    );

    res.json({
      requirementForm,
      matches: savedMatches,
    });
  } catch (error) {
    console.error('[Match Controller Error]:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get matches for a requirement form
// @route   GET /api/requirements/:id/matches
export const getMatchesForRequirement = async (req, res) => {
  try {
    const matches = await Match.find({ requirementFormId: req.params.id })
      .populate({
        path: 'matchedProfileId',
        populate: { path: 'userId', select: 'name email profilePhotoUrl' },
      })
      .sort({ compatibilityScore: -1 });

    res.json(matches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Request connection / reveal contact info
// @route   POST /api/matches/:id/connect
export const connectMatch = async (req, res) => {
  try {
    const match = await Match.findById(req.params.id)
      .populate({
        path: 'matchedProfileId',
        populate: { path: 'userId', select: 'name email profilePhotoUrl' },
      });

    if (!match) {
      return res.status(404).json({ message: 'Match record not found' });
    }

    if (match.seekerUserId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to connect with this match' });
    }

    match.status = 'connected';
    await match.save();

    res.json({
      message: 'Connection successful! Contact information revealed.',
      match,
      contactEmail: match.matchedProfileId.userId.email,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
