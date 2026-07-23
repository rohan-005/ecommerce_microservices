import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { AuthService } from '../services/auth.service';
import type { ForgotPasswordRequest } from '../types/auth';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import { KeyRound } from 'lucide-react';

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const mutation = useMutation({
    mutationFn: (data: ForgotPasswordRequest) => AuthService.forgotPassword(data),
    onSuccess: (data, variables) => {
      toast.success(data.message || 'OTP sent to your email!');
      navigate('/verify-reset-otp', { state: { email: variables.email } });
    },
  });

  const onSubmit = (data: ForgotPasswordFormValues) => {
    mutation.mutate(data);
  };

  return (
    <div className="flex items-center justify-center py-4">
      <Card className="w-full max-w-md">
        <div className="flex flex-col items-center space-y-4 mb-6">
          <div className="p-3 bg-blue-50 rounded-full text-primary">
            <KeyRound className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 text-center">Forgot Password</h2>
          <p className="text-sm text-slate-500 text-center">
            Enter your email address and we'll send you an OTP to reset your password.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="john@example.com"
            error={errors.email?.message}
            disabled={mutation.isPending}
            {...register('email')}
          />

          <Button
            type="submit"
            fullWidth
            isLoading={mutation.isPending}
            className="mt-6"
          >
            Send OTP
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

export default ForgotPassword;
