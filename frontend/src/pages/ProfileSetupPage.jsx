import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { profileAPI } from '../services/api';
import { UserCheck, Sparkles, ArrowRight, ArrowLeft, CheckCircle2, ShieldCheck, MapPin, DollarSign } from 'lucide-react';

export default function ProfileSetupPage() {
  const { userProfile, fetchUserProfile } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    role: 'seeker',
    age: 22,
    gender: 'Female',
    occupationType: 'Student',
    collegeOrCompany: 'Columbia University',
    currentCity: 'Boston',
    destinationCity: 'New York',
    moveInDate: '2026-08-15',
    budgetMin: 1000,
    budgetMax: 1800,
    bio: '',
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
  });

  useEffect(() => {
    if (userProfile) {
      setFormData({
        role: userProfile.role || 'seeker',
        age: userProfile.age || 22,
        gender: userProfile.gender || 'Female',
        occupationType: userProfile.occupationType || 'Student',
        collegeOrCompany: userProfile.collegeOrCompany || '',
        currentCity: userProfile.currentCity || '',
        destinationCity: userProfile.destinationCity || '',
        moveInDate: userProfile.moveInDate ? new Date(userProfile.moveInDate).toISOString().split('T')[0] : '2026-08-15',
        budgetMin: userProfile.budgetMin || 1000,
        budgetMax: userProfile.budgetMax || 1800,
        bio: userProfile.bio || '',
        lifestyle: { ...formData.lifestyle, ...(userProfile.lifestyle || {}) },
        preferences: { ...formData.preferences, ...(userProfile.preferences || {}) },
      });
    }
  }, [userProfile]);

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateLifestyle = (field, value) => {
    setFormData(prev => ({
      ...prev,
      lifestyle: { ...prev.lifestyle, [field]: value },
    }));
  };

  const updatePreference = (field, value) => {
    setFormData(prev => ({
      ...prev,
      preferences: { ...prev.preferences, [field]: value },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (userProfile) {
        await profileAPI.updateMeProfile(formData);
      } else {
        await profileAPI.createProfile(formData);
      }
      await fetchUserProfile();
      setSuccessMsg('Profile saved successfully!');
      setTimeout(() => {
        navigate('/search');
      }, 1200);
    } catch (err) {
      setError(err.message || 'Failed to save profile. Please check all required fields.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      {/* Wizard Step Progress Header */}
      <div className="mb-10 text-center space-y-3">
        <h1 className="text-3xl font-extrabold text-white">
          {userProfile ? 'Edit Your Lifestyle Profile' : 'Setup Your Lifestyle Profile'}
        </h1>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Step {step} of 3 — Our AI matching engine uses these traits to compute your compatibility percentage.
        </p>

        {/* Progress Bar */}
        <div className="max-w-md mx-auto bg-slate-900 rounded-full h-2.5 p-0.5 border border-slate-800">
          <div
            className="bg-gradient-to-r from-brand-500 to-accent-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 text-center">
          {error}
        </div>
      )}

      {successMsg && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 text-center font-bold flex items-center justify-center space-x-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="glass-panel p-6 sm:p-10 rounded-3xl border border-slate-800 space-y-8">
        {/* STEP 1: Basic Info & Budget */}
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2 border-b border-slate-800 pb-3">
              <UserCheck className="w-5 h-5 text-brand-400" />
              <span>Step 1: Basic Info & Target Cities</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">I am a...</label>
                <select
                  value={formData.role}
                  onChange={(e) => updateField('role', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 focus:border-brand-500"
                >
                  <option value="seeker">Seeker (Looking for a room/roommate)</option>
                  <option value="host">Host (Have an available room/flat)</option>
                  <option value="both">Both</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Occupation Type</label>
                <select
                  value={formData.occupationType}
                  onChange={(e) => updateField('occupationType', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 focus:border-brand-500"
                >
                  <option value="Student">Student</option>
                  <option value="Working Professional">Working Professional</option>
                  <option value="Intern">Intern</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">College or Company Name</label>
                <input
                  type="text"
                  required
                  value={formData.collegeOrCompany}
                  onChange={(e) => updateField('collegeOrCompany', e.target.value)}
                  placeholder="e.g. Columbia University, Meta, Google"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 focus:border-brand-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Age</label>
                  <input
                    type="number"
                    min="17"
                    max="80"
                    required
                    value={formData.age}
                    onChange={(e) => updateField('age', Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 focus:border-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => updateField('gender', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 focus:border-brand-500"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Non-binary">Non-binary</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Current City</label>
                <input
                  type="text"
                  required
                  value={formData.currentCity}
                  onChange={(e) => updateField('currentCity', e.target.value)}
                  placeholder="e.g. Boston, Chicago, San Francisco"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Destination City (Where you need roommate)</label>
                <input
                  type="text"
                  required
                  value={formData.destinationCity}
                  onChange={(e) => updateField('destinationCity', e.target.value)}
                  placeholder="e.g. New York, San Francisco, London"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Expected Move-in Date</label>
                <input
                  type="date"
                  required
                  value={formData.moveInDate}
                  onChange={(e) => updateField('moveInDate', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Monthly Rent Budget Range: <span className="text-brand-400 font-bold">${formData.budgetMin} - ${formData.budgetMax}</span>
                </label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <input
                    type="number"
                    min="100"
                    max="10000"
                    value={formData.budgetMin}
                    onChange={(e) => updateField('budgetMin', Number(e.target.value))}
                    placeholder="Min $"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200"
                  />
                  <input
                    type="number"
                    min="100"
                    max="10000"
                    value={formData.budgetMax}
                    onChange={(e) => updateField('budgetMax', Number(e.target.value))}
                    placeholder="Max $"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Short Bio / About Yourself</label>
              <textarea
                rows={3}
                value={formData.bio}
                onChange={(e) => updateField('bio', e.target.value)}
                placeholder="Share a little bit about your hobbies, routine, or preferred house vibes..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 focus:border-brand-500"
              />
            </div>
          </div>
        )}

        {/* STEP 2: Lifestyle & Habits */}
        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2 border-b border-slate-800 pb-3">
              <Sparkles className="w-5 h-5 text-accent-500" />
              <span>Step 2: Your Lifestyle & Living Habits</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Sleep Schedule</label>
                <select
                  value={formData.lifestyle.sleepSchedule}
                  onChange={(e) => updateLifestyle('sleepSchedule', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200"
                >
                  <option value="Early Bird">Early Bird</option>
                  <option value="Night Owl">Night Owl</option>
                  <option value="Flexible">Flexible</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Cleanliness Standard</label>
                <select
                  value={formData.lifestyle.cleanliness}
                  onChange={(e) => updateLifestyle('cleanliness', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200"
                >
                  <option value="Very Tidy">Very Tidy</option>
                  <option value="Average">Average</option>
                  <option value="Relaxed">Relaxed</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Food Preference</label>
                <select
                  value={formData.lifestyle.foodPreference}
                  onChange={(e) => updateLifestyle('foodPreference', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200"
                >
                  <option value="Vegetarian">Vegetarian</option>
                  <option value="Non-Vegetarian">Non-Vegetarian</option>
                  <option value="Vegan">Vegan</option>
                  <option value="No Preference">No Preference</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Smoking</label>
                <select
                  value={formData.lifestyle.smoking}
                  onChange={(e) => updateLifestyle('smoking', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200"
                >
                  <option value="No">No</option>
                  <option value="Occasionally">Occasionally</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Drinking</label>
                <select
                  value={formData.lifestyle.drinking}
                  onChange={(e) => updateLifestyle('drinking', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200"
                >
                  <option value="No">No</option>
                  <option value="Occasionally">Occasionally</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Guest Policy</label>
                <select
                  value={formData.lifestyle.guests}
                  onChange={(e) => updateLifestyle('guests', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200"
                >
                  <option value="Rarely">Rarely</option>
                  <option value="Frequently">Frequently</option>
                  <option value="Never">Never</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Noise Tolerance</label>
                <select
                  value={formData.lifestyle.noiseTolerance}
                  onChange={(e) => updateLifestyle('noiseTolerance', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200"
                >
                  <option value="Quiet">Quiet</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Loud/Social">Loud/Social</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Work From Home (WFH)</label>
                <select
                  value={formData.lifestyle.wfh}
                  onChange={(e) => updateLifestyle('wfh', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200"
                >
                  <option value="Hybrid">Hybrid</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Pet Friendly</label>
                <select
                  value={formData.lifestyle.petFriendly}
                  onChange={(e) => updateLifestyle('petFriendly', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200"
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Preferred Roommate Traits */}
        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2 border-b border-slate-800 pb-3">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>Step 3: What Are You Looking For in a Roommate?</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Preferred Sleep Schedule</label>
                <select
                  value={formData.preferences.sleepSchedule}
                  onChange={(e) => updatePreference('sleepSchedule', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200"
                >
                  <option value="Flexible">Flexible</option>
                  <option value="Early Bird">Early Bird</option>
                  <option value="Night Owl">Night Owl</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Preferred Cleanliness</label>
                <select
                  value={formData.preferences.cleanliness}
                  onChange={(e) => updatePreference('cleanliness', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200"
                >
                  <option value="Very Tidy">Very Tidy</option>
                  <option value="Average">Average</option>
                  <option value="Relaxed">Relaxed</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Preferred Smoking Habit</label>
                <select
                  value={formData.preferences.smoking}
                  onChange={(e) => updatePreference('smoking', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200"
                >
                  <option value="No">No Smoking</option>
                  <option value="Occasionally">Occasionally OK</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Preferred Noise Tolerance</label>
                <select
                  value={formData.preferences.noiseTolerance}
                  onChange={(e) => updatePreference('noiseTolerance', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200"
                >
                  <option value="Quiet">Quiet</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Loud/Social">Loud/Social</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Sharing Chores/Groceries</label>
                <select
                  value={formData.preferences.sharingHabits}
                  onChange={(e) => updatePreference('sharingHabits', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200"
                >
                  <option value="Shared Chores/Groceries">Shared Chores/Groceries</option>
                  <option value="Independent">Independent</option>
                  <option value="Flexible">Flexible</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Wizard Controls Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-800">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(s => s - 1)}
              className="px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white flex items-center space-x-1.5 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={() => setStep(s => s + 1)}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-accent-500 text-xs font-bold text-white shadow-lg shadow-brand-500/20 hover:opacity-95 flex items-center space-x-1.5 transition-all"
            >
              <span>Next Step</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-accent-500 text-sm font-bold text-white shadow-xl shadow-brand-500/25 hover:scale-[1.02] transition-all flex items-center space-x-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Save Profile & Complete Setup</span>
                </>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
