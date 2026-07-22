import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Users, Search, LogOut, Sparkles, ShieldCheck, PlusCircle, MessageSquare, Building2 } from 'lucide-react';

export default function Navbar() {
  const { user, userProfile, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-accent-500 flex items-center justify-center shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white font-sans">
                Roomie<span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-accent-500">Match</span>
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] uppercase tracking-widest font-semibold px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20">
                AI Powered
              </span>
            </div>
          </Link>

          {/* Nav Items */}
          <div className="flex items-center space-x-3 sm:space-x-5">
            {user ? (
              <>
                <Link
                  to="/search"
                  className="flex items-center space-x-1.5 text-xs font-semibold text-slate-300 hover:text-brand-400 transition-colors"
                >
                  <Search className="w-4 h-4 text-brand-400" />
                  <span className="hidden md:inline">Find Roommate</span>
                </Link>

                <Link
                  to="/listings"
                  className="flex items-center space-x-1.5 text-xs font-semibold text-slate-300 hover:text-brand-400 transition-colors"
                >
                  <Building2 className="w-4 h-4 text-accent-500" />
                  <span className="hidden md:inline">Flat Spots</span>
                </Link>

                <Link
                  to="/chat"
                  className="flex items-center space-x-1.5 text-xs font-semibold text-slate-300 hover:text-brand-400 transition-colors relative"
                >
                  <MessageSquare className="w-4 h-4 text-indigo-400" />
                  <span className="hidden md:inline">Messages</span>
                </Link>

                <Link
                  to="/profile"
                  className="flex items-center space-x-1.5 text-xs font-semibold text-slate-300 hover:text-brand-400 transition-colors"
                >
                  {userProfile ? (
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <PlusCircle className="w-4 h-4 text-amber-400" />
                  )}
                  <span className="hidden md:inline">
                    {userProfile ? 'My Profile' : 'Create Profile'}
                  </span>
                </Link>

                <Link
                  to="/dashboard"
                  className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-medium text-white hover:border-slate-700 transition-all"
                >
                  <img
                    src={user.profilePhotoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400'}
                    alt={user.name}
                    className="w-6 h-6 rounded-full object-cover border border-slate-700"
                  />
                  <span className="hidden sm:inline font-semibold">{user.name?.split(' ')[0]}</span>
                </Link>

                <button
                  onClick={handleLogout}
                  title="Sign out"
                  className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                >
                  <LogOut className="w-4.5 h-4.5" />
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/listings"
                  className="text-xs font-semibold text-slate-300 hover:text-white transition-colors"
                >
                  Flat Spots
                </Link>

                <Link
                  to="/login"
                  className="text-xs font-semibold text-slate-300 hover:text-white transition-colors"
                >
                  Log in
                </Link>

                <Link
                  to="/signup"
                  className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-accent-500 text-xs font-semibold text-white shadow-lg shadow-brand-500/25 hover:opacity-95 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Get Started</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
