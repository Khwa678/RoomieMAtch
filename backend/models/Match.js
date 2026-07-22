import mongoose from 'mongoose';

const matchSchema = new mongoose.Schema({
  requirementFormId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RequirementForm',
    required: true,
  },
  seekerUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  matchedProfileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
    required: true,
  },
  compatibilityScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  matchingFactors: [{ type: String }],
  aiExplanation: { type: String, default: '' },
  status: {
    type: String,
    enum: ['pending', 'connected', 'rejected'],
    default: 'pending',
  },
}, { timestamps: true });

export default mongoose.model('Match', matchSchema);
