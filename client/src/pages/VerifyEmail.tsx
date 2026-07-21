import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '../hooks/useAuth';
import { AuthService } from '../services/auth.service';
import type { VerifyEmailRequest } from '../types/auth';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import OTPInput from '../components/auth/OTPInput';
import { KeyRound } from 'lucide-react';
import toast from 'react-hot-toast';

export const VerifyEmail: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();

  // Get email from router state if available
  const stateEmail = (location.state as { email?: string })?.email || '';
  const [email, setEmail] = useState<string>(stateEmail);
  const [otp, setOtp] = useState<string>('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: (data: VerifyEmailRequest) => AuthService.verifyEmail(data),
    onSuccess: (data) => {
      toast.success(data.message || 'Email verified successfully!');
      login(data); // Stores user, accessToken, refreshToken in context
      navigate('/profile');
    },
    onError: () => {
      // Axios interceptor handles toast notification automatically
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Validate email
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setValidationError('Please enter a valid email address.');
      return;
    }

    // Validate OTP
    if (otp.length !== 6) {
      setValidationError('Please enter the complete 6-digit verification code.');
      return;
    }

    mutation.mutate({ email, otp });
  };

  return (
    <div className="flex items-center justify-center py-4">
      <Card className="w-full max-w-md">
        <div className="flex flex-col items-center space-y-4 mb-6">
          <div className="p-3 bg-blue-50 rounded-full text-primary">
            <KeyRound className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 text-center">Verify Your Email</h2>
          <p className="text-sm text-slate-500 text-center">
            {stateEmail ? (
              <>
                We sent a 6-digit code to <span className="font-semibold text-slate-700">{stateEmail}</span>
              </>
            ) : (
              'Enter your email and the 6-digit OTP code sent to you.'
            )}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email input (only if it wasn't passed in state) */}
          {!stateEmail && (
            <Input
              label="Email Address"
              type="email"
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={mutation.isPending}
            />
          )}

          {/* OTP Digit Inputs */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700 text-center mb-2">
              Verification Code
            </label>
            <OTPInput length={6} onChange={(val) => setOtp(val)} />
          </div>

          {validationError && (
            <p className="text-sm text-red-600 font-medium text-center" role="alert">
              {validationError}
            </p>
          )}

          <Button
            type="submit"
            fullWidth
            isLoading={mutation.isPending}
            className="mt-6"
          >
            Verify Email
          </Button>
        </form>

        <div className="mt-6 flex flex-col items-center space-y-2 text-sm text-slate-500">
          <p>
            Didn't receive a code?{' '}
            <Link to="/register" className="font-semibold text-primary hover:text-primary-hover">
              Register again
            </Link>
          </p>
          <Link to="/login" className="font-medium text-slate-600 hover:text-slate-800">
            Back to Login
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default VerifyEmail;
