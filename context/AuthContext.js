'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import * as api from '@/lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
      setLoading(false);
      return;
    }
    api
      .getMe()
      .then((currentUser) => setUser(currentUser))
      .catch(() => localStorage.removeItem('token'))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const { user: loggedInUser, token } = await api.login(email, password);
    localStorage.setItem('token', token);
    setUser(loggedInUser);
  };

  const register = async (name, email, password) => {
    const { user: newUser, token } = await api.register(name, email, password);
    localStorage.setItem('token', token);
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}