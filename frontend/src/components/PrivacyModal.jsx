import React, { useState } from 'react';
import { X, ShieldCheck, Mail, MapPin, DollarSign, Calendar, AlertTriangle, Lock, UserCheck } from 'lucide-react';
import ReportModal from './ReportModal';

export default function PrivacyModal({ profile, isOpen, onClose, onConnect, isConnected }) {
  const [showReport, setShowReport] = useState(false);

  if (!isOpen || !profile) return null;

  const user = profile.userId || {};
  const lifestyle = profile.lifestyle || {};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-8">
        {/* Modal Header Banner */}
        <div className="h-32 bg-gradient-to-r from-brand-600 via-indigo-600 to-accent-500 relative p-6 flex items-end">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-950/40 text-slate-300 hover:text-white hover:bg-slate-950/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Avatar & Info Header */}
        <div className="px-6 pb-6 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-12 mb-6">
            <div className="flex items-end space-x-4">
              <img
                src={user.profilePhotoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400'}
                alt={user.name}
                className="w-24 h-24 rounded-2xl object-cover border-4 border-slate-900 shadow-xl"
              />
              <div className="mt-4 sm:mt-0">
                <h2 className="text-2xl font-bold text-white">{user.name || 'Anonymous Roommate'}</h2>
                <p className="text-sm font-medium text-brand-400">
                  {profile.occupationType} • {profile.collegeOrCompany}
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowReport(true)}
              className="mt-4 sm:mt-0 text-xs text-rose-400 hover:text-rose-300 flex items-center space-x-1 self-start sm:self-auto"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Report Profile</span>
            </button>
          </div>

          {/* Privacy Contact Reveal Box */}
          <div className={`p-4 rounded-2xl mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 border ${
            isConnected
              ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
              : 'bg-slate-950/60 border-slate-800 text-slate-300'
          }`}>
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                isConnected ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'
              }`}>
                {isConnected ? <ShieldCheck className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {isConnected ? 'Contact Status: Connected' : 'Privacy Protection Active'}
                </p>
                <p className="text-sm font-bold text-white">
                  {isConnected ? user.email : 'Email redacted until mutual connect'}
                </p>
              </div>
            </div>

            {!isConnected && onConnect && (
              <button
                onClick={onConnect}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-accent-500 text-xs font-bold text-white shadow-lg shadow-brand-500/25 hover:opacity-95 transition-all"
              >
                Reveal Contact Info
              </button>
            )}

            {isConnected && (
              <a
                href={`mailto:${user.email}`}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white flex items-center justify-center space-x-2 transition-all"
              >
                <Mail className="w-4 h-4" />
                <span>Send Email</span>
              </a>
            )}
          </div>

          {/* Bio */}
          {profile.bio && (
            <div className="mb-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">About Me</h4>
              <p className="text-sm text-slate-300 bg-slate-950/40 p-4 rounded-xl border border-slate-850 leading-relaxed">
                "{profile.bio}"
              </p>
            </div>
          )}

          {/* Key Overview Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-850">
              <span className="text-[10px] text-slate-500 uppercase font-semibold">City</span>
              <p className="text-xs font-bold text-white mt-1 flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-brand-400" />
                <span>{profile.destinationCity}</span>
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-850">
              <span className="text-[10px] text-slate-500 uppercase font-semibold">Monthly Budget</span>
              <p className="text-xs font-bold text-white mt-1 flex items-center space-x-1">
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                <span>${profile.budgetMin} - ${profile.budgetMax}</span>
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-850">
              <span className="text-[10px] text-slate-500 uppercase font-semibold">Move-In</span>
              <p className="text-xs font-bold text-white mt-1 flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                <span>{new Date(profile.moveInDate).toLocaleDateString()}</span>
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-850">
              <span className="text-[10px] text-slate-500 uppercase font-semibold">Role</span>
              <p className="text-xs font-bold text-white mt-1 flex items-center space-x-1">
                <UserCheck className="w-3.5 h-3.5 text-accent-500" />
                <span className="capitalize">{profile.role || 'Roommate'}</span>
              </p>
            </div>
          </div>

          {/* Full Lifestyle Grid */}
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Lifestyle & Habits Breakdown</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            {Object.entries(lifestyle).map(([key, val]) => (
              <div key={key} className="p-3 rounded-xl bg-slate-950/40 border border-slate-850">
                <span className="text-[10px] text-slate-500 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                <p className="font-semibold text-slate-200 mt-0.5">{val}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showReport && (
        <ReportModal
          profileId={profile._id}
          profileName={user.name}
          onClose={() => setShowReport(false)}
        />
      )}
    </div>
  );
}
