'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils';

interface ServiceProviderCardProps {
  provider: {
    id: string;
    user: {
      id: string;
      firstName: string;
      lastName: string;
      avatar?: string;
      isVerified: boolean;
    };
    title: string;
    bio: string;
    hourlyRate: number;
    availability: string;
    timezone: string;
    responseTime: string;
    completedProjects: number;
    rating: number;
    reviewCount: number;
    isVerified: boolean;
    categories: Array<{
      id: string;
      name: string;
      description: string;
      icon: string;
    }>;
    skills: Array<{
      name: string;
      level: string;
      isVerified: boolean;
    }>;
    verificationBadges: Array<{
      type: string;
      issuedAt: string;
    }>;
  };
  onViewProfile: (providerId: string) => void;
  onContactProvider: (providerId: string) => void;
}

const availabilityColors = {
  AVAILABLE: 'bg-green-100 text-green-800',
  BUSY: 'bg-yellow-100 text-yellow-800',
  UNAVAILABLE: 'bg-red-100 text-red-800',
};

const skillLevelColors = {
  BEGINNER: 'bg-gray-100 text-gray-800',
  INTERMEDIATE: 'bg-blue-100 text-blue-800',
  ADVANCED: 'bg-purple-100 text-purple-800',
  EXPERT: 'bg-orange-100 text-orange-800',
};

export function ServiceProviderCard({
  provider,
  onViewProfile,
  onContactProvider,
}: ServiceProviderCardProps) {
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <svg
          key={i}
          className="w-4 h-4 text-yellow-400 fill-current"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <svg
          key="half"
          className="w-4 h-4 text-yellow-400 fill-current"
          viewBox="0 0 20 20"
        >
          <defs>
            <linearGradient id="half">
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="transparent" />
            </linearGradient>
          </defs>
          <path
            fill="url(#half)"
            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
          />
        </svg>
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <svg
          key={`empty-${i}`}
          className="w-4 h-4 text-gray-300 fill-current"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }

    return stars;
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          {provider.user.avatar ? (
            <img
              src={provider.user.avatar}
              alt={`${provider.user.firstName} ${provider.user.lastName}`}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-lg font-medium text-gray-700">
                {provider.user.firstName[0]}{provider.user.lastName[0]}
              </span>
            </div>
          )}
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {provider.user.firstName} {provider.user.lastName}
              {provider.user.isVerified && (
                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  ✓ Verified
                </span>
              )}
            </h3>
            <p className="text-sm text-gray-600">{provider.title}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">
            {formatCurrency(provider.hourlyRate)}/hr
          </div>
          <span
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              availabilityColors[provider.availability as keyof typeof availabilityColors]
            }`}
          >
            {provider.availability.toLowerCase()}
          </span>
        </div>
      </div>

      {/* Bio */}
      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
        {provider.bio}
      </p>

      {/* Stats */}
      <div className="flex items-center space-x-6 mb-4">
        <div className="flex items-center space-x-1">
          {renderStars(provider.rating)}
          <span className="text-sm text-gray-600 ml-1">
            {provider.rating.toFixed(1)} ({provider.reviewCount} reviews)
          </span>
        </div>
        <div className="text-sm text-gray-600">
          {provider.completedProjects} projects completed
        </div>
      </div>

      {/* Categories */}
      {provider.categories.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {provider.categories.slice(0, 3).map((category) => (
              <span
                key={category.id}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
              >
                {category.name}
              </span>
            ))}
            {provider.categories.length > 3 && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                +{provider.categories.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Skills */}
      {provider.skills.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {provider.skills.slice(0, 4).map((skill, index) => (
              <span
                key={index}
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  skillLevelColors[skill.level as keyof typeof skillLevelColors]
                }`}
              >
                {skill.name}
                {skill.isVerified && (
                  <svg className="ml-1 w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </span>
            ))}
            {provider.skills.length > 4 && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                +{provider.skills.length - 4} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="text-sm text-gray-500">
          <div>Responds in {provider.responseTime}</div>
          <div>{provider.timezone}</div>
        </div>
        <div className="flex space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewProfile(provider.id)}
          >
            View Profile
          </Button>
          <Button
            size="sm"
            onClick={() => onContactProvider(provider.id)}
          >
            Contact
          </Button>
        </div>
      </div>
    </div>
  );
}
