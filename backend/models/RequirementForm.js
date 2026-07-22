import mongoose from 'mongoose';

const desiredTraitsSchema = new mongoose.Schema({
  sleepSchedule: { type: String, enum: ['Early Bird', 'Night Owl', 'Flexible', 'Any'], default: 'Any' },
  cleanliness: { type: String, enum: ['Very Tidy', 'Average', 'Relaxed', 'Any'], default: 'Any' },
  foodPreference: { type: String, enum: ['Vegetarian', 'Non-Vegetarian', 'Vegan', 'No Preference'], default: 'No Preference' },
  smoking: { type: String, enum: ['Yes', 'No', 'Occasionally', 'Any'], default: 'No' },
  drinking: { type: String, enum: ['Yes', 'No', 'Occasionally', 'Any'], default: 'Any' },
  guests: { type: String, enum: ['Frequently', 'Rarely', 'Never', 'Any'], default: 'Any' },
  noiseTolerance: { type: String, enum: ['Quiet', 'Moderate', 'Loud/Social', 'Any'], default: 'Any' },
  wfh: { type: String, enum: ['Yes', 'No', 'Hybrid', 'Any'], default: 'Any' },
  petFriendly: { type: String, enum: ['Yes', 'No', 'Any'], default: 'Any' },
  socialPreference: { type: String, enum: ['Introvert', 'Extrovert', 'Balanced', 'Any'], default: 'Any' },
  sharingHabits: { type: String, enum: ['Shared Chores/Groceries', 'Independent', 'Flexible', 'Any'], default: 'Any' },
}, { _id: false });

const requirementFormSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  city: { type: String, required: true, trim: true },
  locality: { type: String, default: '', trim: true },
  budgetMin: { type: Number, required: true, min: 0 },
  budgetMax: { type: Number, required: true, min: 0 },
  moveInTimeframe: { type: Date, required: true },
  numberOfRoommatesNeeded: { type: Number, default: 1, min: 1, max: 5 },
  desiredTraits: { type: desiredTraitsSchema, required: true },
  additionalNotes: { type: String, default: '' },
}, { timestamps: true });

export default mongoose.model('RequirementForm', requirementFormSchema);
