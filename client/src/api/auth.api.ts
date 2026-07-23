import api from './axios';
import type { 
  RegisterRequest, 
  LoginRequest, 
  VerifyEmailRequest, 
  AuthResponse,
  ForgotPasswordRequest,
  VerifyResetOTPRequest,
  ResetPasswordRequest,
  RefreshTokenRequest
} from '../types/auth';

export const registerUser = async (data: RegisterRequest): Promise<{ success: boolean; message: string }> => {
  const response = await api.post('/auth/register', data);
  return response.data;
};

export const verifyEmailOTP = async (data: VerifyEmailRequest): Promise<AuthResponse> => {
  const response = await api.post('/auth/verify-email', data);
  return response.data;
};

export const loginUser = async (data: LoginRequest): Promise<AuthResponse> => {
  const response = await api.post('/auth/login', data);
  return response.data;
};

export const forgotPassword = async (data: ForgotPasswordRequest): Promise<{ success: boolean; message: string }> => {
  const response = await api.post('/auth/forgot-password', data);
  return response.data;
};

export const verifyResetOTP = async (data: VerifyResetOTPRequest): Promise<{ success: boolean; message: string }> => {
  const response = await api.post('/auth/verify-reset-otp', data);
  return response.data;
};

export const resetPassword = async (data: ResetPasswordRequest): Promise<{ success: boolean; message: string }> => {
  const response = await api.post('/auth/reset-password', data);
  return response.data;
};

export const refreshToken = async (data: RefreshTokenRequest): Promise<{ accessToken: string; refreshToken: string }> => {
  const response = await api.post('/auth/refresh-token', data);
  return response.data;
};
