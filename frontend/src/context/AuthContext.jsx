/**
 * Auth session state. Deliberately plain React Context + useState, not
 * React Query - this is "who is logged in right now", client-only session
 * state, not data fetched from and cached against the server.
 *
 * Token + user are persisted to localStorage so a page refresh doesn't
 * log the user out; axiosClient's interceptor reads the token from the
 * same storage key.
 */

import { createContext, useContext, useState, useCallback } from 'react';
import { authApi } from '../api/authApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  const persistSession = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const login = useCallback(async (credentials) => {
    setIsAuthLoading(true);
    try {
      const { data } = await authApi.login(credentials);
      persistSession(data.user, data.token);
      return data.user;
    } finally {
      setIsAuthLoading(false);
    }
  }, []);

  const register = useCallback(async (payload) => {
    setIsAuthLoading(true);
    try {
      const { data } = await authApi.register(payload);
      persistSession(data.user, data.token);
      return data.user;
    } finally {
      setIsAuthLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  }, []);

  const value = {
    user,
    isAuthenticated: !!user,
    isAuthLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return ctx;
}
