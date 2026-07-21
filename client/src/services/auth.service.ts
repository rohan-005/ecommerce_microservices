import { registerUser, verifyEmailOTP, loginUser } from '../api/auth.api';
import type { RegisterRequest, VerifyEmailRequest, LoginRequest } from '../types/auth';

export const AuthService = {
  register: async (data: RegisterRequest) => {
    return await registerUser(data);
  },

  verifyEmail: async (data: VerifyEmailRequest) => {
    return await verifyEmailOTP(data);
  },

  login: async (data: LoginRequest) => {
    return await loginUser(data);
  },
};
