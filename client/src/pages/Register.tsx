import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { AuthService } from '../services/auth.service';
import type { RegisterRequest } from '../types/auth';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import { UserPlus } from 'lucide-react';

const registerSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export const Register: React.FC = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const mutation = useMutation({
    mutationFn: (data: RegisterRequest) => AuthService.register(data),
    onSuccess: (data, variables) => {
      toast.success(data.message || 'Registration successful! Verification code sent.');
      navigate('/verify-email', { state: { email: variables.email } });
    },
    onError: () => {
      // The Axios interceptor already fires toast.error for non-2xx codes,
      // but in case we want specific error actions we handle here.
    },
  });

  const onSubmit = (data: RegisterFormValues) => {
    mutation.mutate(data);
  };

  return (
    <div className="flex items-center justify-center py-4">
      <Card className="w-full max-w-md">
        <div className="flex flex-col items-center space-y-4 mb-6">
          <div className="p-3 bg-blue-50 rounded-full text-primary">
            <UserPlus className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 text-center">Create an Account</h2>
          <p className="text-sm text-slate-500 text-center">
            Register to test the user registration and OTP email verification flow.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Name"
            type="text"
            placeholder="John Doe"
            error={errors.name?.message}
            disabled={mutation.isPending}
            {...register('name')}
          />

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
            Create Account
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-primary hover:text-primary-hover">
            Login here
          </Link>
        </p>
      </Card>
    </div>
  );
};

export default Register;
