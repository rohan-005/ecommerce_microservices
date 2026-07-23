import React, { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { AuthService } from '../services/auth.service';
import type { ResetPasswordRequest } from '../types/auth';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import { LockKeyhole } from 'lucide-react';

const resetPasswordSchema = z.object({
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
  confirmPassword: z.string().min(1, { message: 'Confirm password is required' }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export const ResetPassword: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const stateEmail = (location.state as { email?: string })?.email || '';
  const stateOtp = (location.state as { otp?: string })?.otp || '';

  // Redirect if missing email or OTP
  useEffect(() => {
    if (!stateEmail || !stateOtp) {
      toast.error('Missing reset credentials. Please start over.');
      navigate('/forgot-password');
    }
  }, [stateEmail, stateOtp, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const mutation = useMutation({
    mutationFn: (data: ResetPasswordRequest) => AuthService.resetPassword(data),
    onSuccess: (data) => {
      toast.success(data.message || 'Password reset successful!');
      navigate('/login');
    },
  });

  const onSubmit = (data: ResetPasswordFormValues) => {
    mutation.mutate({
      email: stateEmail,
      otp: stateOtp,
      password: data.password,
    });
  };

  return (
    <div className="flex items-center justify-center py-4">
      <Card className="w-full max-w-md">
        <div className="flex flex-col items-center space-y-4 mb-6">
          <div className="p-3 bg-blue-50 rounded-full text-primary">
            <LockKeyhole className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 text-center">Reset Password</h2>
          <p className="text-sm text-slate-500 text-center">
            Enter your new password below.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="New Password"
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            disabled={mutation.isPending}
            {...register('password')}
          />

          <Input
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            error={errors.confirmPassword?.message}
            disabled={mutation.isPending}
            {...register('confirmPassword')}
          />

          <Button
            type="submit"
            fullWidth
            isLoading={mutation.isPending}
            className="mt-6"
          >
            Reset Password
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Remember your password?{' '}
          <Link to="/login" className="font-semibold text-primary hover:text-primary-hover">
            Back to Login
          </Link>
        </p>
      </Card>
    </div>
  );
};

export default ResetPassword;
