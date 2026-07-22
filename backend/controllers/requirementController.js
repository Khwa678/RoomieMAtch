import RequirementForm from '../models/RequirementForm.js';

// @desc    Create a new search requirement form
// @route   POST /api/requirements
export const createRequirement = async (req, res) => {
  try {
    const requirement = await RequirementForm.create({
      ...req.body,
      userId: req.user._id,
    });

    res.status(201).json(requirement);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get user's requirement forms
// @route   GET /api/requirements/me
export const getRequirementsMe = async (req, res) => {
  try {
    const requirements = await RequirementForm.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(requirements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
