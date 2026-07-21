import React, { createContext, useState, useEffect, type ReactNode } from 'react';
import type { User, AuthResponse, AuthContextType } from '../types/auth';
import { setTokens } from '../utils/token';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessTokenState] = useState<string | null>(null);
  const [refreshToken, setRefreshTokenState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Initial load check: Since everything is in-memory, we start as unauthenticated.
    setIsLoading(false);
  }, []);

  const login = (data: AuthResponse) => {
    setTokens(data.accessToken, data.refreshToken);
    setAccessTokenState(data.accessToken);
    setRefreshTokenState(data.refreshToken);
    setUser(data.user);
  };

  const logout = () => {
    setTokens(null, null);
    setAccessTokenState(null);
    setRefreshTokenState(null);
    setUser(null);
  };

  const updateUser = (newUser: User) => {
    setUser(newUser);
  };

  const isAuthenticated = !!accessToken && !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        refreshToken,
        isAuthenticated,
        isLoading,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
