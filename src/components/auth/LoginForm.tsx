import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../hooks/useAuth';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useNavigate } from 'react-router-dom';
import { useUIStore } from '../../store/uiStore';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const showToast = useUIStore(state => state.showToast);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const { error } = await signIn(data.email, data.password);
      if (error) {
        showToast('error', error.message || 'Failed to sign in');
        return;
      }
      navigate('/dashboard');
    } catch (error) {
      showToast('error', 'An unexpected error occurred');
      console.error('Login error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Input
          label="Email"
          type="email"
          error={errors.email?.message}
          {...register('email')}
        />
      </div>
      
      <div>
        <Input
          label="Password"
          type="password"
          error={errors.password?.message}
          {...register('password')}
        />
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full"
      >
        {isSubmitting ? 'Signing in...' : 'Sign in'}
      </Button>
    </form>
  );
}