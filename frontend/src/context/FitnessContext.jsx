import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext.jsx';
import { userService } from '../services/api.js';

const FitnessContext = createContext(null);

export const FitnessProvider = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dashboardData, setDashboardData] = useState(null);
  const [loadingDashboard, setLoadingDashboard] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const fetchDashboard = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoadingDashboard(true);
    try {
      const data = await userService.getDashboardSummary();
      setDashboardData(data);
    } catch (err) {
      console.error('Failed to fetch dashboard summary:', err);
    } finally {
      setLoadingDashboard(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboard();
    } else {
      setDashboardData(null);
    }
  }, [isAuthenticated, fetchDashboard]);

  return (
    <FitnessContext.Provider
      value={{
        activeTab,
        setActiveTab,
        dashboardData,
        loadingDashboard,
        refreshDashboard: fetchDashboard,
        showToast,
        toast,
      }}
    >
      {children}
    </FitnessContext.Provider>
  );
};

export const useFitness = () => {
  const context = useContext(FitnessContext);
  if (!context) {
    throw new Error('useFitness must be used within a FitnessProvider');
  }
  return context;
};
