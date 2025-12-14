import React, { createContext, useState, useEffect, useContext } from 'react';
import { authAPI } from '../api/api';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [subscriptions, setSubscriptions] = useState([]);

  useEffect(() => {
    // Check if user is logged in on mount
    const token = localStorage.getItem('token');
    if (token) {
      loadUser();
    } else {
      setLoading(false);
    }

    // Listen for storage changes in other tabs
    const handleStorageChange = (e) => {
      if (e.key === 'token') {
        if (e.newValue) {
          // Token changed in another tab - reload user
          loadUser();
        } else {
          // Token removed in another tab - logout
          setUser(null);
          setSubscriptions([]);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const loadUser = async () => {
    try {
      const response = await authAPI.getCurrentUser();
      setUser(response.data.user);
      setSubscriptions(response.data.user.subscriptions || []);
    } catch (error) {
      console.error('Failed to load user:', error);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await authAPI.login(email, password);
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
      setSubscriptions(response.data.user.subscriptions || []);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const signup = async (email, password) => {
    try {
      const response = await authAPI.signup(email, password);
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
      setSubscriptions(response.data.user.subscriptions || []);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Signup failed' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setSubscriptions([]);
  };

  const updateSubscriptions = (newSubscriptions) => {
    setSubscriptions(newSubscriptions);
  };

  const value = {
    user,
    loading,
    subscriptions,
    login,
    signup,
    logout,
    updateSubscriptions,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
