import mongoose from 'mongoose';

const lifestyleSchema = new mongoose.Schema({
  sleepSchedule: { type: String, enum: ['Early Bird', 'Night Owl', 'Flexible'], default: 'Flexible' },
  cleanliness: { type: String, enum: ['Very Tidy', 'Average', 'Relaxed'], default: 'Average' },
  foodPreference: { type: String, enum: ['Vegetarian', 'Non-Vegetarian', 'Vegan', 'No Preference'], default: 'No Preference' },
  smoking: { type: String, enum: ['Yes', 'No', 'Occasionally'], default: 'No' },
  drinking: { type: String, enum: ['Yes', 'No', 'Occasionally'], default: 'No' },
  guests: { type: String, enum: ['Frequently', 'Rarely', 'Never'], default: 'Rarely' },
  noiseTolerance: { type: String, enum: ['Quiet', 'Moderate', 'Loud/Social'], default: 'Moderate' },
  wfh: { type: String, enum: ['Yes', 'No', 'Hybrid'], default: 'Hybrid' },
  petFriendly: { type: String, enum: ['Yes', 'No'], default: 'Yes' },
  socialPreference: { type: String, enum: ['Introvert', 'Extrovert', 'Balanced'], default: 'Balanced' },
  sharingHabits: { type: String, enum: ['Shared Chores/Groceries', 'Independent', 'Flexible'], default: 'Flexible' },
}, { _id: false });

const profileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  role: {
    type: String,
    enum: ['seeker', 'host', 'both'],
    default: 'seeker',
  },
  age: { type: Number, required: true, min: 17, max: 80 },
  gender: { type: String, required: true },
  occupationType: { type: String, enum: ['Student', 'Working Professional', 'Intern'], required: true },
  collegeOrCompany: { type: String, required: true, trim: true },
  currentCity: { type: String, required: true, trim: true },
  destinationCity: { type: String, required: true, trim: true },
  moveInDate: { type: Date, required: true },
  budgetMin: { type: Number, required: true, min: 0 },
  budgetMax: { type: Number, required: true, min: 0 },
  bio: { type: String, default: '' },
  lifestyle: { type: lifestyleSchema, required: true },
  preferences: { type: lifestyleSchema, required: true },
}, { timestamps: true });

export default mongoose.model('Profile', profileSchema);
