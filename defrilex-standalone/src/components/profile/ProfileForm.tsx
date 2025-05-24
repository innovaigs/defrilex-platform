'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { UserRole } from '@defrilex/types';
import toast from 'react-hot-toast';

const profileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  avatar: z.string().optional(),
  title: z.string().optional(),
  bio: z.string().optional(),
  hourlyRate: z.number().min(0).optional(),
  timezone: z.string().optional(),
  responseTime: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface ProfileFormProps {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string;
    role: UserRole;
  };
  serviceProvider?: {
    title: string;
    bio: string;
    hourlyRate: number;
    timezone: string;
    responseTime: string;
  };
  onSubmit: (data: ProfileFormData) => Promise<void>;
}

export function ProfileForm({ user, serviceProvider, onSubmit }: ProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      avatar: user.avatar || '',
      title: serviceProvider?.title || '',
      bio: serviceProvider?.bio || '',
      hourlyRate: serviceProvider?.hourlyRate || 0,
      timezone: serviceProvider?.timezone || '',
      responseTime: serviceProvider?.responseTime || '',
    },
  });

  const handleFormSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);
    try {
      await onSubmit(data);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile. Please try again.');
      console.error('Profile update error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">Basic Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="First Name"
            {...register('firstName')}
            error={errors.firstName?.message}
          />
          
          <Input
            label="Last Name"
            {...register('lastName')}
            error={errors.lastName?.message}
          />
          
          <Input
            label="Email"
            type="email"
            {...register('email')}
            error={errors.email?.message}
            className="md:col-span-2"
          />
          
          <Input
            label="Avatar URL"
            {...register('avatar')}
            error={errors.avatar?.message}
            helperText="URL to your profile picture"
            className="md:col-span-2"
          />
        </div>
      </div>

      {user.role === UserRole.SERVICE_PROVIDER && (
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Service Provider Information</h3>
          
          <div className="space-y-6">
            <Input
              label="Professional Title"
              {...register('title')}
              error={errors.title?.message}
              placeholder="e.g., Full Stack Developer, Digital Marketing Expert"
            />
            
            <Textarea
              label="Bio"
              {...register('bio')}
              error={errors.bio?.message}
              placeholder="Tell clients about your experience, skills, and what makes you unique..."
              rows={4}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Hourly Rate (USD)"
                type="number"
                step="0.01"
                min="0"
                {...register('hourlyRate', { valueAsNumber: true })}
                error={errors.hourlyRate?.message}
                placeholder="50.00"
              />
              
              <Input
                label="Timezone"
                {...register('timezone')}
                error={errors.timezone?.message}
                placeholder="e.g., UTC-5, EST, PST"
              />
            </div>
            
            <Input
              label="Typical Response Time"
              {...register('responseTime')}
              error={errors.responseTime?.message}
              placeholder="e.g., Within 2 hours, Same day, 24 hours"
            />
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <Button
          type="submit"
          isLoading={isLoading}
          className="px-8"
        >
          Save Changes
        </Button>
      </div>
    </form>
  );
}
