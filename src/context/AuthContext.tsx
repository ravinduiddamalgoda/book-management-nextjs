// src/context/AuthContext.tsx

'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
// import { useApolloClient } from '@apollo/client';
import {jwtDecode} from 'jwt-decode';
import { LOGIN_USER_MUTATION, REGISTER_USER_MUTATION } from '../graphql/schema';
import { User } from '@/app/types/user';
import gqlClientConnect from '../config/apollo-client';

interface AuthContextType {
  user: User | null;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
//   const apolloClient = useApolloClient();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedUser: User = jwtDecode(token);
      setUser(decodedUser);
    }
  }, []);


  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
