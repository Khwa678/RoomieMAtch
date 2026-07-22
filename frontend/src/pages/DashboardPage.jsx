import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { requirementAPI } from '../services/api';
import { Users, Search, Edit3, ShieldCheck, PlusCircle, ArrowRight, Sparkles, MapPin, Calendar, CheckCircle2 } from 'lucide-react';

export default function DashboardPage() {
  const { user, userProfile } = useAuth();
  const [requirements, setRequirements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserRequirements();
  }, []);

  const fetchUserRequirements = async () => {
    try {
      const data = await requirementAPI.getRequirementsMe();
      setRequirements(data || []);
    } catch (err) {
      console.warn('[Dashboard] Failed to fetch requirements:', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Welcome Banner */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center space-x-5">
          <img
            src={user?.profilePhotoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400'}
            alt={user?.name}
            className="w-20 h-20 rounded-2xl object-cover border-2 border-brand-500/40 shadow-xl"
          />
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Welcome back, {user?.name?.split(' ')[0]}!
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              {userProfile
                ? `${userProfile.occupationType} at ${userProfile.collegeOrCompany} • Target: ${userProfile.destinationCity}`
                : 'Setup your profile to unlock personalized AI roommate recommendations.'}
            </p>
            <div className="mt-3 flex items-center space-x-2">
              {userProfile ? (
                <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Lifestyle Profile Active</span>
                </span>
              ) : (
                <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Profile Incomplete</span>
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          <Link
            to="/profile"
            className="px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-200 hover:text-white flex items-center space-x-2 transition-colors"
          >
            <Edit3 className="w-4 h-4 text-brand-400" />
            <span>{userProfile ? 'Edit Profile' : 'Setup Profile'}</span>
          </Link>

          <Link
            to="/search"
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-accent-500 text-xs font-bold text-white shadow-lg shadow-brand-500/20 hover:opacity-95 flex items-center space-x-2 transition-all"
          >
            <Search className="w-4 h-4" />
            <span>New Roommate Search</span>
          </Link>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Recent Searches & AI Matches */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-brand-400" />
              <span>Your Search Requests & AI Matches</span>
            </h2>

            <Link to="/search" className="text-xs text-brand-400 font-semibold hover:underline flex items-center space-x-1">
              <span>+ New Search</span>
            </Link>
          </div>

          {loading ? (
            <div className="p-8 text-center text-xs text-slate-400">Loading searches...</div>
          ) : requirements.length === 0 ? (
            <div className="glass-panel p-8 rounded-2xl text-center space-y-3">
              <p className="text-xs text-slate-400">You haven't submitted any roommate search criteria yet.</p>
              <Link
                to="/search"
                className="inline-block px-5 py-2 rounded-xl bg-brand-600 text-xs font-bold text-white shadow-md"
              >
                Submit Search Request
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {requirements.map((req) => (
                <div
                  key={req._id}
                  className="glass-card p-5 rounded-2xl border border-slate-800 flex items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-base font-bold text-white">{req.city}</span>
                      <span className="text-xs text-slate-400">({req.locality || 'Any locality'})</span>
                    </div>
                    <div className="flex items-center space-x-4 text-xs text-slate-400">
                      <span className="flex items-center space-x-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-500" />
                        <span>Budget: ${req.budgetMin} - ${req.budgetMax}/mo</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        <span>Move-in: {new Date(req.moveInTimeframe).toLocaleDateString()}</span>
                      </span>
                    </div>
                  </div>

                  <Link
                    to={`/matches/${req._id}`}
                    className="px-4 py-2 rounded-xl bg-brand-600/20 text-brand-400 border border-brand-500/30 hover:bg-brand-600 hover:text-white text-xs font-bold transition-all flex items-center space-x-1.5 shrink-0"
                  >
                    <span>View Top 3 Matches</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Profile Overview Card */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white">Profile Overview</h2>

          {userProfile ? (
            <div className="glass-panel p-6 rounded-2xl space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-slate-400">Destination City</span>
                <span className="font-bold text-white">{userProfile.destinationCity}</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-slate-400">Budget Range</span>
                <span className="font-bold text-emerald-400">${userProfile.budgetMin} - ${userProfile.budgetMax}</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-slate-400">Cleanliness</span>
                <span className="font-bold text-slate-200">{userProfile.lifestyle.cleanliness}</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-slate-400">Sleep Schedule</span>
                <span className="font-bold text-slate-200">{userProfile.lifestyle.sleepSchedule}</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-slate-400">Smoking</span>
                <span className="font-bold text-slate-200">{userProfile.lifestyle.smoking}</span>
              </div>

              <Link
                to="/profile"
                className="block text-center w-full py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-brand-400 hover:text-brand-300"
              >
                Update Profile Settings
              </Link>
            </div>
          ) : (
            <div className="glass-panel p-6 rounded-2xl text-center space-y-3">
              <p className="text-xs text-slate-400">Completing your lifestyle profile increases match accuracy by 95%.</p>
              <Link
                to="/profile"
                className="inline-block px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-accent-500 text-xs font-bold text-white"
              >
                Create Lifestyle Profile
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
