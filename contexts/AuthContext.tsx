'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';


interface User {
  id?: string;          
  name?: string;
  email: string;        
  phone?: string;
  location?: string;
  role: string;         
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  logout: () => void;
  isAuthenticated: boolean;
  updateUser: (userData: Partial<User>) => void;
  setUserData: (user: User, token: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Check if user is logged in on page load
  useEffect(() => {
    // අපි මුලින්ම බලනවා browser එකේ කලින් save වෙලාද කියලා
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');

      if (token && savedUser) {
        try {
          setUser(JSON.parse(savedUser));
          setToken(token);
        } catch (error) {
          console.error('Failed to parse user data', error);
          // Data අවුල් නම් ඒවා මකලා දානවා
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    }
  }, []);

  const setUserData = (userData: User, jwtToken: string) => {
    setUser(userData);
    setToken(jwtToken);
    localStorage.setItem('token', jwtToken);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('searchHistory');
    setUser(null);
    setToken(null);
    router.push('/');
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        logout,
        isAuthenticated: !!user,
        updateUser,
        setUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};