import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { requirementAPI } from '../services/api';
import { Search, Sparkles, MapPin, DollarSign, Calendar, Users, Sliders } from 'lucide-react';

export default function RequirementFormPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    city: 'New York',
    locality: 'Manhattan / Brooklyn',
    budgetMin: 1200,
    budgetMax: 2000,
    moveInTimeframe: '2026-08-15',
    numberOfRoommatesNeeded: 1,
    additionalNotes: 'Looking for a clean, respectful roommate for fall semester.',
    desiredTraits: {
      sleepSchedule: 'Night Owl',
      cleanliness: 'Very Tidy',
      foodPreference: 'No Preference',
      smoking: 'No',
      drinking: 'Any',
      guests: 'Rarely',
      noiseTolerance: 'Quiet',
      wfh: 'Hybrid',
      petFriendly: 'Yes',
      socialPreference: 'Balanced',
      sharingHabits: 'Shared Chores/Groceries',
    },
  });

  const updateTrait = (field, val) => {
    setFormData(prev => ({
      ...prev,
      desiredTraits: { ...prev.desiredTraits, [field]: val },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1. Create search requirement doc
      const reqDoc = await requirementAPI.createRequirement(formData);
      
      // 2. Trigger AI matching engine
      await requirementAPI.runMatch(reqDoc._id);

      // 3. Redirect to match results gallery
      navigate(`/matches/${reqDoc._id}`);
    } catch (err) {
      setError(err.message || 'Failed to trigger AI matching. Please verify your entries.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="text-center mb-10 space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-xs font-semibold text-brand-300">
          <Sparkles className="w-4 h-4 text-accent-500" />
          <span>Find Your Compatible Roommate</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">Submit Search Criteria</h1>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Specify your destination city, budget range, and non-negotiable living traits to launch the AI engine.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="glass-panel p-6 sm:p-10 rounded-3xl border border-slate-800 space-y-8">
        {/* Core Search Criteria */}
        <div className="space-y-6">
          <h2 className="text-base font-bold text-white flex items-center space-x-2 border-b border-slate-800 pb-3">
            <Search className="w-5 h-5 text-brand-400" />
            <span>Target Location & Move-In Timeline</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Target City</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="e.g. New York, San Francisco, Boston"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:border-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Preferred Locality / Neighborhood</label>
              <input
                type="text"
                value={formData.locality}
                onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
                placeholder="e.g. SoHo, Downtown, Cambridge"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Target Move-in Date</label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="date"
                  required
                  value={formData.moveInTimeframe}
                  onChange={(e) => setFormData({ ...formData, moveInTimeframe: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:border-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Roommates Needed</label>
              <div className="relative">
                <Users className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <select
                  value={formData.numberOfRoommatesNeeded}
                  onChange={(e) => setFormData({ ...formData, numberOfRoommatesNeeded: Number(e.target.value) })}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:border-brand-500"
                >
                  <option value={1}>1 Roommate</option>
                  <option value={2}>2 Roommates</option>
                  <option value={3}>3 Roommates</option>
                </select>
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Monthly Budget Range: <span className="text-emerald-400 font-bold">${formData.budgetMin} - ${formData.budgetMax} / mo</span>
              </label>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  min="100"
                  max="10000"
                  value={formData.budgetMin}
                  onChange={(e) => setFormData({ ...formData, budgetMin: Number(e.target.value) })}
                  placeholder="Min $"
                  className="px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100"
                />
                <input
                  type="number"
                  min="100"
                  max="10000"
                  value={formData.budgetMax}
                  onChange={(e) => setFormData({ ...formData, budgetMax: Number(e.target.value) })}
                  placeholder="Max $"
                  className="px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Desired Lifestyle Traits */}
        <div className="space-y-6">
          <h2 className="text-base font-bold text-white flex items-center space-x-2 border-b border-slate-800 pb-3">
            <Sliders className="w-5 h-5 text-accent-500" />
            <span>Desired Lifestyle Traits in Ideal Roommate</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Cleanliness</label>
              <select
                value={formData.desiredTraits.cleanliness}
                onChange={(e) => updateTrait('cleanliness', e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200"
              >
                <option value="Very Tidy">Very Tidy</option>
                <option value="Average">Average</option>
                <option value="Any">Any</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Sleep Schedule</label>
              <select
                value={formData.desiredTraits.sleepSchedule}
                onChange={(e) => updateTrait('sleepSchedule', e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200"
              >
                <option value="Night Owl">Night Owl</option>
                <option value="Early Bird">Early Bird</option>
                <option value="Flexible">Flexible</option>
                <option value="Any">Any</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Smoking Policy</label>
              <select
                value={formData.desiredTraits.smoking}
                onChange={(e) => updateTrait('smoking', e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200"
              >
                <option value="No">No Smoking (Non-negotiable)</option>
                <option value="Occasionally">Occasionally OK</option>
                <option value="Any">Any</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Noise Preference</label>
              <select
                value={formData.desiredTraits.noiseTolerance}
                onChange={(e) => updateTrait('noiseTolerance', e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200"
              >
                <option value="Quiet">Quiet</option>
                <option value="Moderate">Moderate</option>
                <option value="Loud/Social">Social/Loud</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Food Habit</label>
              <select
                value={formData.desiredTraits.foodPreference}
                onChange={(e) => updateTrait('foodPreference', e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200"
              >
                <option value="No Preference">No Preference</option>
                <option value="Vegetarian">Vegetarian</option>
                <option value="Non-Vegetarian">Non-Vegetarian</option>
                <option value="Vegan">Vegan</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Guests</label>
              <select
                value={formData.desiredTraits.guests}
                onChange={(e) => updateTrait('guests', e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200"
              >
                <option value="Rarely">Rarely</option>
                <option value="Frequently">Frequently</option>
                <option value="Never">Never</option>
                <option value="Any">Any</option>
              </select>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-brand-600 to-accent-500 text-base font-bold text-white shadow-xl shadow-brand-500/25 hover:scale-[1.01] transition-all flex items-center justify-center space-x-2"
        >
          {loading ? (
            <div className="flex items-center space-x-3">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>AI Engine Processing Matches...</span>
            </div>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>Run AI Matching Engine & View Top 3 Results</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
