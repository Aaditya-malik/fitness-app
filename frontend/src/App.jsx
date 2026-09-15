import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { FitnessProvider, useFitness } from './context/FitnessContext.jsx';
import Sidebar from './components/Sidebar.jsx';
import Navbar from './components/Navbar.jsx';

// Pages
import AuthPage from './pages/AuthPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import WorkoutPage from './pages/WorkoutPage.jsx';
import NutritionPage from './pages/NutritionPage.jsx';
import WaterPage from './pages/WaterPage.jsx';
import ProgressPage from './pages/ProgressPage.jsx';
import AiTipsPage from './pages/AiTipsPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';

import {
  LayoutDashboard,
  Dumbbell,
  Utensils,
  Droplets,
  TrendingUp,
  Sparkles,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

function AppContent() {
  const { isAuthenticated, loading } = useAuth();
  const { activeTab, setActiveTab, toast } = useFitness();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center space-y-3">
        <div className="w-10 h-10 border-3 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
        <p className="text-xs font-semibold text-neutral-400">Loading FitTrack AI...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  const renderActivePage = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardPage />;
      case 'workout':
        return <WorkoutPage />;
      case 'nutrition':
        return <NutritionPage />;
      case 'water':
        return <WaterPage />;
      case 'progress':
        return <ProgressPage />;
      case 'ai-tips':
        return <AiTipsPage />;
      case 'profile':
        return <ProfilePage />;
      default:
        return <DashboardPage />;
    }
  };

  const mobileNav = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'workout', label: 'Workout', icon: Dumbbell },
    { id: 'nutrition', label: 'Food', icon: Utensils },
    { id: 'water', label: 'Water', icon: Droplets },
    { id: 'progress', label: 'Stats', icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col lg:flex-row antialiased">
      {/* Sidebar for Desktop */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 lg:pb-6">
        <Navbar onOpenSidebar={() => setSidebarOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full">
          {renderActivePage()}
        </main>
      </div>

      {/* Mobile Bottom Quick Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-neutral-900/95 backdrop-blur-md border-t border-neutral-800 flex items-center justify-around px-2 z-40">
        {mobileNav.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`mobile-nav-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center w-14 py-1 rounded-xl transition ${
                isActive ? 'text-emerald-400 font-bold' : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : ''}`} />
              <span className="text-[10px] mt-0.5">{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Global Toast Notification */}
      {toast && (
        <div
          id="global-toast"
          className="fixed bottom-20 lg:bottom-6 right-6 z-50 px-4 py-3 rounded-2xl bg-neutral-900 border border-neutral-800 shadow-2xl flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-2 duration-200"
        >
          {toast.type === 'error' ? (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          )}
          <span className="text-xs font-semibold text-white">{toast.message}</span>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <FitnessProvider>
        <AppContent />
      </FitnessProvider>
    </AuthProvider>
  );
}
