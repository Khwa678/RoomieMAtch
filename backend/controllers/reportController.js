import Report from '../models/Report.js';

// @desc    Report a profile
// @route   POST /api/reports
export const createReport = async (req, res) => {
  try {
    const { reportedProfileId, reason, details } = req.body;

    if (!reportedProfileId || !reason) {
      return res.status(400).json({ message: 'Please provide reportedProfileId and reason' });
    }

    const report = await Report.create({
      reporterUserId: req.user._id,
      reportedProfileId,
      reason,
      details,
    });

    res.status(201).json({
      message: 'Report submitted successfully. Our safety team will review it shortly.',
      report,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
