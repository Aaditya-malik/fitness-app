import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, userService } from '../services/api.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('fittrack_token'));
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Initialize auth from token
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('fittrack_token');
      if (storedToken) {
        try {
          const profile = await authService.getMe();
          setUser(profile);
        } catch (err) {
          console.warn('Failed to restore session:', err);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    setAuthError(null);
    try {
      const data = await authService.login({ email, password });
      localStorage.setItem('fittrack_token', data.token);
      setToken(data.token);
      setUser(data.user);
      return data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please check credentials.';
      setAuthError(msg);
      throw new Error(msg);
    }
  };

  const register = async (userData) => {
    setAuthError(null);
    try {
      const data = await authService.register(userData);
      localStorage.setItem('fittrack_token', data.token);
      setToken(data.token);
      setUser(data.user);
      return data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed.';
      setAuthError(msg);
      throw new Error(msg);
    }
  };

  const demoLogin = async () => {
    setAuthError(null);
    try {
      const data = await authService.demoLogin();
      localStorage.setItem('fittrack_token', data.token);
      setToken(data.token);
      setUser(data.user);
      return data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Demo login failed.';
      setAuthError(msg);
      throw new Error(msg);
    }
  };

  const logout = () => {
    localStorage.removeItem('fittrack_token');
    setToken(null);
    setUser(null);
    setAuthError(null);
  };

  const updateUserProfile = async (updates) => {
    try {
      const updated = await userService.updateProfile(updates);
      setUser(updated);
      return updated;
    } catch (err) {
      console.error('Error updating user profile:', err);
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        loading,
        authError,
        setAuthError,
        login,
        register,
        demoLogin,
        logout,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
