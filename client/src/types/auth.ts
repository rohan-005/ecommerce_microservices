export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isVerified?: boolean;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password?: string;
}

export interface VerifyEmailRequest {
  email: string;
  otp: string;
}

export interface LoginRequest {
  email: string;
  password?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: AuthResponse) => void;
  logout: () => void;
  updateUser: (user: User) => void;
}
