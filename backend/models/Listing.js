import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema({
  hostUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  hostProfileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
    required: true,
  },
  title: {
    type: String,
    required: [true, 'Listing title is required'],
    trim: true,
  },
  city: { type: String, required: true, trim: true },
  locality: { type: String, required: true, trim: true },
  rent: { type: Number, required: true, min: 0 },
  deposit: { type: Number, default: 0 },
  roomType: {
    type: String,
    enum: ['Private Room', 'Shared Room', 'Entire Flat/Apartment'],
    default: 'Private Room',
  },
  bedrooms: { type: Number, default: 2 },
  bathrooms: { type: Number, default: 1 },
  availableFrom: { type: Date, required: true },
  images: [{ type: String }],
  amenities: [{ type: String }], // e.g. ['High-Speed WiFi', 'Air Conditioning', 'In-unit Laundry', 'Furnished', 'Gym']
  description: { type: String, default: '' },
  isAvailable: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model('Listing', listingSchema);
