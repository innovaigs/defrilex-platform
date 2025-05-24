'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ProfileForm } from '@/components/profile/ProfileForm';
import { UserRole } from '@defrilex/types';
import toast from 'react-hot-toast';

interface ProfileData {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string;
    role: UserRole;
    isVerified: boolean;
    createdAt: string;
    updatedAt: string;
  };
  serviceProvider?: {
    id: string;
    title: string;
    bio: string;
    hourlyRate: number;
    timezone: string;
    responseTime: string;
    availability: string;
    completedProjects: number;
    rating: number;
    reviewCount: number;
    isVerified: boolean;
  };
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    fetchProfile();
  }, [session, status, router]);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/profile');
      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }
      const data = await response.json();
      setProfileData(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileUpdate = async (formData: any) => {
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update profile');
      }

      const updatedData = await response.json();
      setProfileData(updatedData);
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!session || !profileData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
              <p className="text-gray-600">Manage your account information and preferences</p>
            </div>
            <button
              onClick={() => router.push('/dashboard')}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Profile Overview */}
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <div className="flex items-center space-x-6">
            <div className="flex-shrink-0">
              {profileData.user.avatar ? (
                <img
                  className="h-20 w-20 rounded-full object-cover"
                  src={profileData.user.avatar}
                  alt={`${profileData.user.firstName} ${profileData.user.lastName}`}
                />
              ) : (
                <div className="h-20 w-20 rounded-full bg-gray-300 flex items-center justify-center">
                  <span className="text-2xl font-medium text-gray-700">
                    {profileData.user.firstName[0]}{profileData.user.lastName[0]}
                  </span>
                </div>
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900">
                {profileData.user.firstName} {profileData.user.lastName}
              </h2>
              <p className="text-gray-600">{profileData.user.email}</p>
              <div className="flex items-center space-x-4 mt-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                  {profileData.user.role === UserRole.CLIENT ? 'Client' : 
                   profileData.user.role === UserRole.SERVICE_PROVIDER ? 'Service Provider' : 'Admin'}
                </span>
                {profileData.user.isVerified && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    ✓ Verified
                  </span>
                )}
              </div>
            </div>
          </div>

          {profileData.serviceProvider && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {profileData.serviceProvider.completedProjects}
                  </div>
                  <div className="text-sm text-gray-600">Projects Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {profileData.serviceProvider.rating.toFixed(1)}
                  </div>
                  <div className="text-sm text-gray-600">Average Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    ${profileData.serviceProvider.hourlyRate}
                  </div>
                  <div className="text-sm text-gray-600">Hourly Rate</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Profile Form */}
        <ProfileForm
          user={profileData.user}
          serviceProvider={profileData.serviceProvider}
          onSubmit={handleProfileUpdate}
        />
      </div>
    </div>
  );
}
