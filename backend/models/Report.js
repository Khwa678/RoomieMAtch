import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  reporterUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  reportedProfileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
    required: true,
  },
  reason: {
    type: String,
    required: true,
    enum: ['Inappropriate content', 'Fake profile', 'Harassment', 'Spam', 'Other'],
  },
  details: { type: String, default: '' },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'dismissed'],
    default: 'pending',
  },
}, { timestamps: true });

export default mongoose.model('Report', reportSchema);
