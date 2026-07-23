import React, { createContext, useState, useEffect, type ReactNode } from 'react';
import type { User, AuthResponse, AuthContextType } from '../types/auth';
import { setTokens, saveUser, getUser as getStoredUser, clearAuth, getRefreshToken } from '../utils/token';
import { AuthService } from '../services/auth.service';

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
    const initializeAuth = async () => {
      try {
        const storedRefreshToken = getRefreshToken();
        const storedUser = getStoredUser();

        if (storedRefreshToken && storedUser) {
          const response = await AuthService.refreshToken({ refreshToken: storedRefreshToken });
          
          setTokens(response.accessToken, response.refreshToken);
          setAccessTokenState(response.accessToken);
          setRefreshTokenState(response.refreshToken);
          
          setUser(storedUser);
        } else {
          clearAuth();
        }
      } catch (error) {
        console.error("Failed to restore session:", error);
        clearAuth();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = (data: AuthResponse) => {
    setTokens(data.accessToken, data.refreshToken);
    saveUser(data.user);
    setAccessTokenState(data.accessToken);
    setRefreshTokenState(data.refreshToken);
    setUser(data.user);
  };

  const logout = () => {
    clearAuth();
    setAccessTokenState(null);
    setRefreshTokenState(null);
    setUser(null);
  };

  const updateUser = (newUser: User) => {
    saveUser(newUser);
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
