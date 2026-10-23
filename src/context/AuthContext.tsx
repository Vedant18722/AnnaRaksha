/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface UserProfile {
  name: string;
  email: string;
  role: 'Kitchen Manager' | 'Food Safety Officer' | 'Hostel Mess Supervisor';
  facility: string;
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  fillDemoUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('annaraksha_auth_user');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    // Default logged-in demo user for frictionless evaluation
    return {
      name: 'Chef Rajesh Sharma',
      email: 'manager@campusmess.edu.in',
      role: 'Kitchen Manager',
      facility: 'Campus Central Canteen & Hostel Mess',
    };
  });

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('annaraksha_auth_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('annaraksha_auth_user');
      }
    } catch (e) {}
  }, [user]);

  const login = async (email: string, password: string, customRole?: string) => {
    // Validate inputs
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return { success: false, error: 'Please enter a valid email address.' };
    }
    if (!password || password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters long.' };
    }

    // Simulate authenticated session
    const loggedUser: UserProfile = {
      name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
      email,
      role: (customRole as any) || 'Kitchen Manager',
      facility: 'University Hostel Dining System',
    };

    setUser(loggedUser);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
  };

  const fillDemoUser = () => {
    const demo: UserProfile = {
      name: 'Chef Rajesh Sharma',
      email: 'manager@campusmess.edu.in',
      role: 'Kitchen Manager',
      facility: 'Campus Central Canteen & Hostel Mess',
    };
    setUser(demo);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        login,
        logout,
        fillDemoUser,
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
