import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { requirementAPI, matchAPI } from '../services/api';
import MatchCard from '../components/MatchCard';
import PrivacyModal from '../components/PrivacyModal';
import { Sparkles, MapPin, DollarSign, Calendar, RefreshCw, AlertCircle, ArrowLeft } from 'lucide-react';

export default function MatchResultsPage() {
  const { requirementId } = useParams();
  const [matches, setMatches] = useState([]);
  const [requirementForm, setRequirementForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Selected profile for modal
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [selectedMatchId, setSelectedMatchId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchMatches();
  }, [requirementId]);

  const fetchMatches = async () => {
    setLoading(true);
    setError('');
    try {
      // 1. Fetch saved matches or run engine
      let res = await requirementAPI.getMatches(requirementId);

      if (!res || res.length === 0) {
        // Trigger run match if empty
        const matchRes = await requirementAPI.runMatch(requirementId);
        res = matchRes.matches || [];
        setRequirementForm(matchRes.requirementForm);
      }

      setMatches(res || []);
    } catch (err) {
      setError(err.message || 'Failed to load match results');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenProfile = (profile, matchId) => {
    setSelectedProfile(profile);
    setSelectedMatchId(matchId);
    setModalOpen(true);
  };

  const handleConnect = async (matchId) => {
    try {
      const res = await matchAPI.connect(matchId);
      
      // Update local match status
      setMatches(prev =>
        prev.map(m => (m._id === matchId ? { ...m, status: 'connected' } : m))
      );

      if (selectedProfile && selectedMatchId === matchId) {
        setSelectedProfile(prev => ({
          ...prev,
          isConnected: true,
          userId: { ...prev.userId, email: res.contactEmail || res.match?.matchedProfileId?.userId?.email },
        }));
      }
    } catch (err) {
      alert(err.message || 'Failed to request connection');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-16 h-16 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
        <div className="text-center space-y-1">
          <h3 className="text-lg font-bold text-white flex items-center justify-center space-x-2">
            <Sparkles className="w-5 h-5 text-accent-500 animate-pulse" />
            <span>AI Matching Engine Processing...</span>
          </h3>
          <p className="text-xs text-slate-400">Analyzing lifestyle compatibility scores & generating Claude AI explanations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[85vh] py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-slate-800">
        <div>
          <Link to="/dashboard" className="text-xs text-brand-400 font-semibold hover:underline flex items-center space-x-1 mb-2">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center space-x-3">
            <span>Top 3 Compatible Roommates</span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-500/20 text-brand-400 border border-brand-500/30">
              AI Ranked
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Based on multi-variable lifestyle weighting, cleanliness preferences, and budget overlap.
          </p>
        </div>

        <button
          onClick={fetchMatches}
          className="self-start md:self-auto px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white flex items-center space-x-2 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Re-Run AI Matching</span>
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Empty State */}
      {matches.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl text-center max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white">No Direct Matches Found</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            No active profiles currently match your exact budget and city window. Try broadening your budget range or target city.
          </p>
          <Link
            to="/search"
            className="inline-block px-6 py-2.5 rounded-xl bg-brand-600 text-xs font-bold text-white shadow-lg"
          >
            Adjust Search Criteria
          </Link>
        </div>
      ) : (
        /* Matches Grid */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {matches.map((matchItem, index) => (
            <MatchCard
              key={matchItem._id || index}
              match={matchItem}
              rank={index + 1}
              onViewDetails={(prof) => handleOpenProfile(prof, matchItem._id)}
              onConnect={(mId) => handleConnect(mId)}
            />
          ))}
        </div>
      )}

      {/* Privacy Detail Modal */}
      <PrivacyModal
        profile={selectedProfile}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConnect={() => handleConnect(selectedMatchId)}
        isConnected={selectedProfile?.isConnected}
      />
    </div>
  );
}
