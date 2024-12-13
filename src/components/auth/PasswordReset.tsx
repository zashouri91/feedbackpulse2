import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { useUIStore } from '../../store/uiStore';

const resetSchema = z.object({
  email: z.string().email('Please enter a valid email address')
});

type ResetFormData = z.infer<typeof resetSchema>;

export function PasswordReset() {
  const { resetPassword } = useAuth();
  const showToast = useUIStore(state => state.showToast);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ResetFormData>({
    resolver: zodResolver(resetSchema)
  });

  const onSubmit = async (data: ResetFormData) => {
    try {
      await resetPassword(data.email);
      showToast('success', 'Password reset instructions have been sent to your email');
    } catch (error) {
      showToast('error', 'Failed to send reset instructions. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Email Address"
        type="email"
        {...register('email')}
        error={errors.email?.message}
      />

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Sending Instructions...' : 'Reset Password'}
      </Button>
    </form>
  );
}