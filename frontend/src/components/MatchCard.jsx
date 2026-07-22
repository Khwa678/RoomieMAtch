import React from 'react';
import { Sparkles, MapPin, DollarSign, Calendar, CheckCircle2, Lock, Mail, ExternalLink, ShieldCheck } from 'lucide-react';

export default function MatchCard({ match, rank, onViewDetails, onConnect }) {
  const profile = match.matchedProfile || match.matchedProfileId || {};
  const user = profile.userId || {};
  const score = match.compatibilityScore || 85;
  const isConnected = match.status === 'connected';

  // Gradient based on score
  const getScoreBadgeColor = (s) => {
    if (s >= 90) return 'from-emerald-500 to-teal-400 text-white shadow-emerald-500/20';
    if (s >= 80) return 'from-brand-600 to-indigo-500 text-white shadow-brand-500/20';
    return 'from-purple-600 to-pink-500 text-white shadow-purple-500/20';
  };

  return (
    <div className="glass-card rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between border border-slate-800 hover:border-brand-500/40 transition-all duration-300">
      {/* Top Banner & Rank */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-500/10 text-brand-400 border border-brand-500/20">
            #{rank} Top Match
          </span>
          {isConnected && (
            <span className="flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Connected</span>
            </span>
          )}
        </div>

        {/* Compatibility Score */}
        <div className={`px-4 py-1.5 rounded-full font-black text-sm tracking-tight bg-gradient-to-r shadow-lg ${getScoreBadgeColor(score)} flex items-center space-x-1`}>
          <Sparkles className="w-4 h-4 fill-current" />
          <span>{score}% Match</span>
        </div>
      </div>

      {/* Main Profile Details */}
      <div className="flex items-start space-x-4 mb-5">
        <img
          src={user.profilePhotoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400'}
          alt={user.name || 'Roommate'}
          className="w-16 h-16 rounded-2xl object-cover border-2 border-brand-500/30 shadow-md"
        />
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-white truncate flex items-center space-x-2">
            <span>{user.name || 'Anonymous User'}</span>
            <span className="text-xs font-normal text-slate-400">({profile.age || 22}, {profile.gender})</span>
          </h3>
          <p className="text-xs text-brand-300 font-medium truncate mt-0.5">
            {profile.occupationType} • {profile.collegeOrCompany}
          </p>

          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-2">
            <span className="flex items-center space-x-1">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              <span>{profile.destinationCity || profile.currentCity}</span>
            </span>
            <span className="flex items-center space-x-1">
              <DollarSign className="w-3.5 h-3.5 text-slate-500" />
              <span>${profile.budgetMin} - ${profile.budgetMax}/mo</span>
            </span>
            <span className="flex items-center space-x-1">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>Move-in: {new Date(profile.moveInDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
            </span>
          </div>
        </div>
      </div>

      {/* AI Explanation Box */}
      {match.aiExplanation && (
        <div className="mb-4 p-3.5 rounded-xl bg-slate-900/90 border border-brand-500/20 text-xs text-slate-300 leading-relaxed relative">
          <div className="flex items-center space-x-1.5 font-semibold text-brand-400 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Compatibility Rationale</span>
          </div>
          <p className="italic text-slate-300">"{match.aiExplanation}"</p>
        </div>
      )}

      {/* Key Factors Chips */}
      <div className="space-y-1.5 mb-6">
        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Strongest Compatibility Highlights</p>
        <div className="flex flex-wrap gap-1.5">
          {(match.matchingFactors || ['Quiet & Tidy', 'Budget Overlap']).map((factor, idx) => (
            <span
              key={idx}
              className="inline-flex items-center space-x-1 text-[11px] font-medium px-2.5 py-1 rounded-lg bg-slate-900 text-slate-300 border border-slate-800"
            >
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span>{factor}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center space-x-3 pt-3 border-t border-slate-850">
        <button
          onClick={() => onViewDetails(profile)}
          className="flex-1 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-white flex items-center justify-center space-x-1.5 transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          <span>View Profile</span>
        </button>

        {isConnected ? (
          <a
            href={`mailto:${user.email}`}
            className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white flex items-center justify-center space-x-1.5 transition-colors shadow-lg shadow-emerald-600/20"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Email {user.name ? user.name.split(' ')[0] : 'Roommate'}</span>
          </a>
        ) : (
          <button
            onClick={() => onConnect(match._id)}
            className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-brand-600 to-accent-500 hover:opacity-95 text-xs font-semibold text-white flex items-center justify-center space-x-1.5 transition-all shadow-lg shadow-brand-500/20"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Connect & Reveal Contact</span>
          </button>
        )}
      </div>
    </div>
  );
}
