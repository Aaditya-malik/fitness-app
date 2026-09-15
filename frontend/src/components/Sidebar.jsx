import React from 'react';
import {
  LayoutDashboard,
  Dumbbell,
  Utensils,
  Droplets,
  TrendingUp,
  Sparkles,
  User,
  LogOut,
  Activity,
} from 'lucide-react';
import { useFitness } from '../context/FitnessContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function Sidebar({ isOpen, onClose }) {
  const { activeTab, setActiveTab } = useFitness();
  const { user, logout } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'workout', label: 'Workout', icon: Dumbbell },
    { id: 'nutrition', label: 'Nutrition', icon: Utensils },
    { id: 'water', label: 'Water', icon: Droplets },
    { id: 'progress', label: 'Progress', icon: TrendingUp },
    { id: 'ai-tips', label: 'AI Tips', icon: Sparkles, badge: 'Smart' },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const handleNavClick = (id) => {
    setActiveTab(id);
    if (onClose) onClose();
  };

  return (
    <>
      {/* Mobile overlay backdrop */}
      {isOpen && (
        <div
          id="mobile-sidebar-overlay"
          onClick={onClose}
          className="fixed inset-0 bg-black/70 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      <aside
        id="app-sidebar"
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 w-64 bg-neutral-900/95 border-r border-neutral-800 flex flex-col justify-between transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div>
          <div className="h-16 px-6 flex items-center gap-3 border-b border-neutral-800">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-sm shadow-emerald-500/20">
              <Activity className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-extrabold tracking-tight text-white flex items-center gap-1.5">
                FitTrack <span className="text-emerald-400">AI</span>
              </span>
              <span className="text-[10px] text-neutral-400 font-medium tracking-wide uppercase">
                Smart Fitness OS
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-btn-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-emerald-500 text-neutral-950 font-semibold shadow-md shadow-emerald-500/20'
                      : 'text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-neutral-950 stroke-[2.2]' : 'text-neutral-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold tracking-wider uppercase ${
                        isActive
                          ? 'bg-neutral-950/20 text-neutral-950'
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User profile & Logout Footer */}
        <div className="p-4 border-t border-neutral-800 space-y-2">
          {user && (
            <div
              id="sidebar-user-card"
              onClick={() => handleNavClick('profile')}
              className="p-2.5 rounded-xl bg-neutral-950/60 border border-neutral-800/80 flex items-center gap-3 cursor-pointer hover:border-neutral-700 transition"
            >
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center font-bold text-xs">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-neutral-200 truncate">{user.name}</p>
                <p className="text-[11px] text-neutral-400 truncate">{user.goal || 'Fitness Tracker'}</p>
              </div>
            </div>
          )}

          <button
            id="sidebar-logout-btn"
            onClick={logout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-rose-400 hover:bg-rose-500/10 transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
