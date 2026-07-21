import api from './axios';
import type { RegisterRequest, LoginRequest, VerifyEmailRequest, AuthResponse } from '../types/auth';

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
