import React from 'react';
import { Users, Shield, Heart, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-400 py-12 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-accent-500 flex items-center justify-center">
              <Users className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-white">RoomieMatch</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            AI-powered roommate matching platform for students and young professionals. Find compatible, trustworthy roommates in minutes instead of weeks.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-slate-200 mb-3 uppercase tracking-wider">Features</h4>
          <ul className="space-y-2 text-xs">
            <li className="hover:text-brand-400 transition-colors">AI Compatibility Engine</li>
            <li className="hover:text-brand-400 transition-colors">Privacy Contact Reveal</li>
            <li className="hover:text-brand-400 transition-colors">Structured Lifestyle Profiles</li>
            <li className="hover:text-brand-400 transition-colors">Campus & City Matching</li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-slate-200 mb-3 uppercase tracking-wider">Safety & Privacy</h4>
          <ul className="space-y-2 text-xs">
            <li className="flex items-center space-x-1.5 text-emerald-400">
              <Shield className="w-3.5 h-3.5" />
              <span>Contact Redacted by Default</span>
            </li>
            <li className="hover:text-brand-400 transition-colors">Mutual Opt-In Connect</li>
            <li className="hover:text-brand-400 transition-colors">Community Reporting</li>
            <li className="hover:text-brand-400 transition-colors">Encrypted User Accounts</li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-slate-200 mb-3 uppercase tracking-wider">Tech Stack</h4>
          <div className="flex flex-wrap gap-2 text-[11px]">
            <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">React + Vite</span>
            <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">Node / Express</span>
            <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">MongoDB Mongoose</span>
            <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">Anthropic Claude AI</span>
            <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">Tailwind CSS</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-slate-850 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
        <p>© 2026 RoomieMatch. All rights reserved.</p>
        <p className="flex items-center space-x-1 mt-2 sm:mt-0">
          <span>Crafted with</span>
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          <span>for safe campus housing</span>
        </p>
      </div>
    </footer>
  );
}
