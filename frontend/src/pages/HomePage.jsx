import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Users, Shield, ArrowRight, CheckCircle2, Zap, Lock, Search, Building2, Smile } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Glow Ambient background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-brand-600/20 via-accent-500/10 to-transparent blur-3xl pointer-events-none rounded-full" />

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-slate-900/90 border border-brand-500/30 text-xs font-semibold text-brand-300 mb-8 shadow-lg shadow-brand-500/10">
          <Sparkles className="w-4 h-4 text-accent-500 animate-pulse" />
          <span>Next-Gen AI Roommate Matching Algorithm</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-none">
          Stop guessing on random posts.{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-indigo-300 to-accent-500">
            Find your perfect roommate with AI.
          </span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-normal">
          Moving to a new city for college or work? Skip chaotic WhatsApp & Facebook groups. RoomieMatch analyzes lifestyle habits, budgets, and clean schedules to return your top 3 verified matches.
        </p>

        {/* Dual Primary CTAs */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
          <Link
            to={user ? '/search' : '/signup'}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-600 to-accent-500 text-base font-bold text-white shadow-xl shadow-brand-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-2"
          >
            <Search className="w-5 h-5" />
            <span>I'm Looking for a Roommate</span>
          </Link>

          <Link
            to={user ? '/profile' : '/signup'}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-base font-semibold text-slate-200 hover:text-white transition-all flex items-center justify-center space-x-2"
          >
            <Building2 className="w-5 h-5 text-accent-500" />
            <span>I Have a Spot Available</span>
          </Link>
        </div>

        {/* Key Stats Bar */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 p-6 rounded-3xl glass-panel max-w-4xl mx-auto text-left">
          <div>
            <span className="text-3xl font-black text-white">Top 3</span>
            <p className="text-xs text-slate-400 mt-1 font-medium">Verified Compatible Matches</p>
          </div>
          <div>
            <span className="text-3xl font-black text-emerald-400">&lt; 3 mins</span>
            <p className="text-xs text-slate-400 mt-1 font-medium">Average Time to Match</p>
          </div>
          <div>
            <span className="text-3xl font-black text-brand-400">100%</span>
            <p className="text-xs text-slate-400 mt-1 font-medium">Privacy-First Contact Shield</p>
          </div>
          <div>
            <span className="text-3xl font-black text-accent-500">7-Trait</span>
            <p className="text-xs text-slate-400 mt-1 font-medium">Weighted Lifestyle Score</p>
          </div>
        </div>
      </section>

      {/* How it Works Step Flow */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-850">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">How RoomieMatch Works</h2>
          <p className="text-slate-400 mt-3 text-sm sm:text-base">Four easy steps from searching to moving in with peace of mind.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="p-6 rounded-2xl glass-card relative border border-slate-800">
            <div className="w-12 h-12 rounded-xl bg-brand-500/20 text-brand-400 flex items-center justify-center font-black text-lg mb-4">
              01
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Build Profile</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Fill in your basic details, budget, sleep schedule, cleanliness, and guest habits in 3 simple steps.
            </p>
          </div>

          <div className="p-6 rounded-2xl glass-card relative border border-slate-800">
            <div className="w-12 h-12 rounded-xl bg-accent-500/20 text-accent-400 flex items-center justify-center font-black text-lg mb-4">
              02
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Submit Search</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Specify your move-in timeframe, target city, max budget, and preferred roommate traits.
            </p>
          </div>

          <div className="p-6 rounded-2xl glass-card relative border border-slate-800">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-black text-lg mb-4">
              03
            </div>
            <h3 className="text-lg font-bold text-white mb-2">AI Matching Engine</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Our 7-category algorithm filters non-negotiables & calculates compatibility scores with Anthropic Claude rationale.
            </p>
          </div>

          <div className="p-6 rounded-2xl glass-card relative border border-slate-800">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-lg mb-4">
              04
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Connect Safely</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Review match highlights & click connect to reveal email contact info once both sides show mutual interest.
            </p>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl glass-panel space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-600/20 text-brand-400 flex items-center justify-center">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Weighted Trait Scoring</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Unlike generic questionnaires, RoomieMatch weights non-negotiables like smoking, noise tolerance, and cleanliness higher to prevent real-world roommate conflicts.
            </p>
          </div>

          <div className="p-8 rounded-3xl glass-panel space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-accent-500/20 text-accent-400 flex items-center justify-center">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Privacy-First Shield</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Your phone and email are never displayed publicly. Contact information is strictly protected until you choose to connect.
            </p>
          </div>

          <div className="p-8 rounded-3xl glass-panel space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Anthropic AI Explanations</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Understand *why* you matched with plain English insights generated by Claude AI analyzing lifestyle nuances.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
