import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { connectDB } from './config/db.js';
import User from './models/User.js';
import Profile from './models/Profile.js';
import Listing from './models/Listing.js';

dotenv.config();

const sampleUsers = [
  {
    name: 'Sarah Chen',
    email: 'sarah.chen@columbia.edu',
    password: 'password123',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400',
    profile: {
      role: 'seeker',
      age: 22,
      gender: 'Female',
      occupationType: 'Student',
      collegeOrCompany: 'Columbia University',
      currentCity: 'Boston',
      destinationCity: 'New York',
      moveInDate: new Date('2026-08-15'),
      budgetMin: 1200,
      budgetMax: 1800,
      bio: 'Incoming Master’s student at Columbia. I am organized, quiet, and love baking on weekends!',
      lifestyle: {
        sleepSchedule: 'Night Owl',
        cleanliness: 'Very Tidy',
        foodPreference: 'Vegetarian',
        smoking: 'No',
        drinking: 'Occasionally',
        guests: 'Rarely',
        noiseTolerance: 'Quiet',
        wfh: 'Hybrid',
        petFriendly: 'Yes',
        socialPreference: 'Balanced',
        sharingHabits: 'Shared Chores/Groceries',
      },
      preferences: {
        sleepSchedule: 'Flexible',
        cleanliness: 'Very Tidy',
        foodPreference: 'No Preference',
        smoking: 'No',
        drinking: 'Occasionally',
        guests: 'Rarely',
        noiseTolerance: 'Quiet',
        wfh: 'Hybrid',
        petFriendly: 'Yes',
        socialPreference: 'Balanced',
        sharingHabits: 'Shared Chores/Groceries',
      },
    },
  },
  {
    name: 'Alex Rivera',
    email: 'alex.rivera@meta.com',
    password: 'password123',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
    profile: {
      role: 'host',
      age: 24,
      gender: 'Male',
      occupationType: 'Working Professional',
      collegeOrCompany: 'Meta (Software Engineer)',
      currentCity: 'San Francisco',
      destinationCity: 'San Francisco',
      moveInDate: new Date('2026-08-01'),
      budgetMin: 1500,
      budgetMax: 2200,
      bio: 'Software engineer at Meta. Have a 2B2B flat in SoMa, looking for a chill roommate to take the 2nd bedroom.',
      lifestyle: {
        sleepSchedule: 'Early Bird',
        cleanliness: 'Average',
        foodPreference: 'Non-Vegetarian',
        smoking: 'No',
        drinking: 'Yes',
        guests: 'Frequently',
        noiseTolerance: 'Moderate',
        wfh: 'Yes',
        petFriendly: 'Yes',
        socialPreference: 'Extrovert',
        sharingHabits: 'Flexible',
      },
      preferences: {
        sleepSchedule: 'Early Bird',
        cleanliness: 'Average',
        foodPreference: 'No Preference',
        smoking: 'No',
        drinking: 'Occasionally',
        guests: 'Rarely',
        noiseTolerance: 'Moderate',
        wfh: 'Yes',
        petFriendly: 'Yes',
        socialPreference: 'Extrovert',
        sharingHabits: 'Flexible',
      },
    },
  },
  {
    name: 'Priya Sharma',
    email: 'priya.sharma@nyu.edu',
    password: 'password123',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
    profile: {
      role: 'seeker',
      age: 21,
      gender: 'Female',
      occupationType: 'Intern',
      collegeOrCompany: 'NYU Stern',
      currentCity: 'Chicago',
      destinationCity: 'New York',
      moveInDate: new Date('2026-08-20'),
      budgetMin: 1300,
      budgetMax: 1900,
      bio: 'Finance intern moving to NYC for the fall semester. Love exploring coffee shops and museum runs!',
      lifestyle: {
        sleepSchedule: 'Early Bird',
        cleanliness: 'Very Tidy',
        foodPreference: 'Vegetarian',
        smoking: 'No',
        drinking: 'No',
        guests: 'Rarely',
        noiseTolerance: 'Quiet',
        wfh: 'No',
        petFriendly: 'Yes',
        socialPreference: 'Balanced',
        sharingHabits: 'Shared Chores/Groceries',
      },
      preferences: {
        sleepSchedule: 'Early Bird',
        cleanliness: 'Very Tidy',
        foodPreference: 'Vegetarian',
        smoking: 'No',
        drinking: 'No',
        guests: 'Rarely',
        noiseTolerance: 'Quiet',
        wfh: 'No',
        petFriendly: 'Yes',
        socialPreference: 'Balanced',
        sharingHabits: 'Shared Chores/Groceries',
      },
    },
  },
  {
    name: 'Marcus Vance',
    email: 'marcus.vance@mit.edu',
    password: 'password123',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
    profile: {
      role: 'both',
      age: 23,
      gender: 'Male',
      occupationType: 'Student',
      collegeOrCompany: 'MIT Lab',
      currentCity: 'Boston',
      destinationCity: 'Boston',
      moveInDate: new Date('2026-09-01'),
      budgetMin: 1100,
      budgetMax: 1600,
      bio: 'CS grad student working on robotics. Super respectful, quiet, and reliable with bills.',
      lifestyle: {
        sleepSchedule: 'Night Owl',
        cleanliness: 'Average',
        foodPreference: 'No Preference',
        smoking: 'No',
        drinking: 'Occasionally',
        guests: 'Rarely',
        noiseTolerance: 'Moderate',
        wfh: 'Hybrid',
        petFriendly: 'Yes',
        socialPreference: 'Introvert',
        sharingHabits: 'Independent',
      },
      preferences: {
        sleepSchedule: 'Night Owl',
        cleanliness: 'Average',
        foodPreference: 'No Preference',
        smoking: 'No',
        drinking: 'Occasionally',
        guests: 'Rarely',
        noiseTolerance: 'Moderate',
        wfh: 'Hybrid',
        petFriendly: 'Yes',
        socialPreference: 'Introvert',
        sharingHabits: 'Independent',
      },
    },
  },
  {
    name: 'Elena Rostova',
    email: 'elena.rostova@google.com',
    password: 'password123',
    photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=400',
    profile: {
      role: 'seeker',
      age: 25,
      gender: 'Female',
      occupationType: 'Working Professional',
      collegeOrCompany: 'Google NYC',
      currentCity: 'Seattle',
      destinationCity: 'New York',
      moveInDate: new Date('2026-08-10'),
      budgetMin: 1400,
      budgetMax: 2100,
      bio: 'Product Designer at Google. I keep my space clean, enjoy weekend yoga, and respect quiet hours.',
      lifestyle: {
        sleepSchedule: 'Flexible',
        cleanliness: 'Very Tidy',
        foodPreference: 'Vegan',
        smoking: 'No',
        drinking: 'No',
        guests: 'Never',
        noiseTolerance: 'Quiet',
        wfh: 'Hybrid',
        petFriendly: 'No',
        socialPreference: 'Balanced',
        sharingHabits: 'Shared Chores/Groceries',
      },
      preferences: {
        sleepSchedule: 'Flexible',
        cleanliness: 'Very Tidy',
        foodPreference: 'No Preference',
        smoking: 'No',
        drinking: 'No',
        guests: 'Rarely',
        noiseTolerance: 'Quiet',
        wfh: 'Hybrid',
        petFriendly: 'No',
        socialPreference: 'Balanced',
        sharingHabits: 'Shared Chores/Groceries',
      },
    },
  },
];

const sampleListings = [
  {
    hostEmail: 'alex.rivera@meta.com',
    title: 'Sunny Private Master Bedroom in Modern 2B2B SoMa Flat',
    city: 'San Francisco',
    locality: 'SoMa / Financial District',
    rent: 1750,
    deposit: 1000,
    roomType: 'Private Room',
    bedrooms: 2,
    bathrooms: 2,
    availableFrom: new Date('2026-08-01'),
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=800',
    ],
    amenities: ['High-Speed WiFi', 'Air Conditioning', 'In-unit Laundry', 'Furnished Desk', 'Rooftop Gym', 'Dishwasher'],
    description: 'Fully furnished private bedroom with en-suite bathroom in a high-rise luxury apartment block. 10 min walk to Meta & BART station.',
  },
  {
    hostEmail: 'marcus.vance@mit.edu',
    title: 'Cozy Private Room in Historic Cambridge Apartment near MIT',
    city: 'Boston',
    locality: 'Cambridge / Harvard Sq',
    rent: 1350,
    deposit: 800,
    roomType: 'Private Room',
    bedrooms: 3,
    bathrooms: 1,
    availableFrom: new Date('2026-09-01'),
    images: [
      'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&q=80&w=800',
    ],
    amenities: ['High-Speed Fiber WiFi', 'Heating Included', 'On-site Laundry', 'Bike Storage'],
    description: 'Spacious room with large windows overlooking trees. Quiet, academic vibe, perfect for MIT / Harvard grad students.',
  },
];

async function seed() {
  await connectDB();
  console.log('Clearing old sample seed data...');
  
  const emails = sampleUsers.map(u => u.email);
  const users = await User.find({ email: { $in: emails } });
  const userIds = users.map(u => u._id);

  await Listing.deleteMany({});
  await Profile.deleteMany({ userId: { $in: userIds } });
  await User.deleteMany({ email: { $in: emails } });

  console.log('Seeding sample users and profiles...');

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('password123', salt);

  const userMap = {};
  const profileMap = {};

  for (const item of sampleUsers) {
    const user = await User.create({
      name: item.name,
      email: item.email,
      passwordHash,
      authProvider: 'local',
      profilePhotoUrl: item.photo,
    });

    const profile = await Profile.create({
      ...item.profile,
      userId: user._id,
    });

    userMap[item.email] = user;
    profileMap[item.email] = profile;

    console.log(`Seeded user profile: ${user.name} (${item.profile.destinationCity})`);
  }

  // Seed Listings
  for (const listData of sampleListings) {
    const hostUser = userMap[listData.hostEmail];
    const hostProf = profileMap[listData.hostEmail];
    if (hostUser && hostProf) {
      await Listing.create({
        ...listData,
        hostUserId: hostUser._id,
        hostProfileId: hostProf._id,
      });
      console.log(`Seeded listing: "${listData.title}" in ${listData.city}`);
    }
  }

  console.log('Seed completed successfully!');
  process.exit(0);
}

seed().catch(err => {
  console.error('Seed error:', err);
  process.exit(1);
});
