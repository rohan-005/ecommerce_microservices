import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import { AuthService } from '../services/auth.service';
import type { LoginRequest } from '../types/auth';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import { LogIn } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(1, { message: 'Password is required' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const mutation = useMutation({
    mutationFn: (data: LoginRequest) => AuthService.login(data),
    onSuccess: (data) => {
      toast.success(data.message || 'Login successful!');
      login(data); // Stores user, accessToken, refreshToken in context
      navigate('/profile');
    },
    onError: () => {
      // Axios interceptor handles toast notifications automatically
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    mutation.mutate(data);
  };

  return (
    <div className="flex items-center justify-center py-4">
      <Card className="w-full max-w-md">
        <div className="flex flex-col items-center space-y-4 mb-6">
          <div className="p-3 bg-blue-50 rounded-full text-primary">
            <LogIn className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 text-center">Login to Account</h2>
          <p className="text-sm text-slate-500 text-center">
            Sign in to test authenticated endpoints and profile access.
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

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            disabled={mutation.isPending}
            {...register('password')}
          />

          <Button
            type="submit"
            fullWidth
            isLoading={mutation.isPending}
            className="mt-6"
          >
            Sign In
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-primary hover:text-primary-hover">
            Register here
          </Link>
        </p>
      </Card>
    </div>
  );
};

export default Login;
