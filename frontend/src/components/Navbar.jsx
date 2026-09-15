import React from 'react';
import { Menu, Activity, Sparkles, User } from 'lucide-react';
import { useFitness } from '../context/FitnessContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar({ onOpenSidebar }) {
  const { activeTab, setActiveTab } = useFitness();
  const { user } = useAuth();

  const tabTitles = {
    dashboard: 'Fitness Overview',
    workout: 'Workout & Training',
    nutrition: 'Nutrition & Calories',
    water: 'Hydration Tracker',
    progress: 'Progress & Analytics',
    'ai-tips': 'AI Health Recommendations',
    profile: 'User Profile & Goals',
  };

  const todayFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <header className="h-16 bg-neutral-900/60 backdrop-blur-md border-b border-neutral-800/80 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        {/* Mobile menu button */}
        <button
          id="mobile-menu-btn"
          onClick={onOpenSidebar}
          className="p-2 rounded-lg bg-neutral-800/60 border border-neutral-700 text-neutral-300 lg:hidden hover:text-white"
          aria-label="Open sidebar navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse hidden sm:inline-block" />
          <h1 className="text-base sm:text-lg font-bold text-white">
            {tabTitles[activeTab] || 'FitTrack AI'}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Date pill */}
        <div className="text-xs text-neutral-400 bg-neutral-800/40 border border-neutral-700/60 px-3 py-1.5 rounded-full hidden md:block">
          {todayFormatted}
        </div>

        {/* Quick Goal Tag */}
        {user?.goal && (
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Sparkles className="w-3 h-3" />
            {user.goal}
          </span>
        )}

        {/* Profile Avatar Button */}
        <button
          id="nav-profile-btn"
          onClick={() => setActiveTab('profile')}
          className="w-8 h-8 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-neutral-300 hover:border-emerald-500 transition"
          title="Go to Profile"
        >
          <User className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
