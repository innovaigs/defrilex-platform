'use client';

import React from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface SearchFiltersProps {
  filters: {
    query: string;
    category: string;
    minRate: string;
    maxRate: string;
    availability: string;
    minRating: string;
    skills: string;
    timezone: string;
  };
  onFilterChange: (key: string, value: string) => void;
  onClearFilters: () => void;
  onApplyFilters: () => void;
  isLoading?: boolean;
}

const categories = [
  { value: '', label: 'All Categories' },
  { value: 'Web Development', label: 'Web Development' },
  { value: 'Mobile Development', label: 'Mobile Development' },
  { value: 'Digital Marketing', label: 'Digital Marketing' },
  { value: 'Content Writing', label: 'Content Writing' },
  { value: 'Graphic Design', label: 'Graphic Design' },
  { value: 'Data Science', label: 'Data Science' },
  { value: 'Virtual Assistant', label: 'Virtual Assistant' },
  { value: 'Translation', label: 'Translation' },
];

const availabilityOptions = [
  { value: '', label: 'Any Availability' },
  { value: 'AVAILABLE', label: 'Available' },
  { value: 'BUSY', label: 'Busy' },
  { value: 'UNAVAILABLE', label: 'Unavailable' },
];

const ratingOptions = [
  { value: '', label: 'Any Rating' },
  { value: '4', label: '4+ Stars' },
  { value: '3', label: '3+ Stars' },
  { value: '2', label: '2+ Stars' },
  { value: '1', label: '1+ Stars' },
];

export function SearchFilters({
  filters,
  onFilterChange,
  onClearFilters,
  onApplyFilters,
  isLoading = false,
}: SearchFiltersProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Filters</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearFilters}
          disabled={isLoading}
        >
          Clear All
        </Button>
      </div>

      {/* Search Query */}
      <div>
        <Input
          label="Search"
          placeholder="Search by name, title, or skills..."
          value={filters.query}
          onChange={(e) => onFilterChange('query', e.target.value)}
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Category
        </label>
        <select
          value={filters.category}
          onChange={(e) => onFilterChange('category', e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
        >
          {categories.map((category) => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
      </div>

      {/* Hourly Rate Range */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Hourly Rate (USD)
        </label>
        <div className="grid grid-cols-2 gap-3">
          <Input
            placeholder="Min"
            type="number"
            min="0"
            value={filters.minRate}
            onChange={(e) => onFilterChange('minRate', e.target.value)}
          />
          <Input
            placeholder="Max"
            type="number"
            min="0"
            value={filters.maxRate}
            onChange={(e) => onFilterChange('maxRate', e.target.value)}
          />
        </div>
      </div>

      {/* Availability */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Availability
        </label>
        <select
          value={filters.availability}
          onChange={(e) => onFilterChange('availability', e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
        >
          {availabilityOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Minimum Rating */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Minimum Rating
        </label>
        <select
          value={filters.minRating}
          onChange={(e) => onFilterChange('minRating', e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
        >
          {ratingOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Skills */}
      <div>
        <Input
          label="Skills"
          placeholder="e.g., React, Node.js, Python (comma-separated)"
          value={filters.skills}
          onChange={(e) => onFilterChange('skills', e.target.value)}
          helperText="Enter skills separated by commas"
        />
      </div>

      {/* Timezone */}
      <div>
        <Input
          label="Timezone"
          placeholder="e.g., UTC, EST, PST"
          value={filters.timezone}
          onChange={(e) => onFilterChange('timezone', e.target.value)}
        />
      </div>

      {/* Apply Filters Button */}
      <Button
        onClick={onApplyFilters}
        isLoading={isLoading}
        className="w-full"
      >
        Apply Filters
      </Button>
    </div>
  );
}
