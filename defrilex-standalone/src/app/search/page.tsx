'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SearchFilters } from '@/components/search/SearchFilters';
import { ServiceProviderCard } from '@/components/search/ServiceProviderCard';
import { Button } from '@/components/ui/Button';
import { debounce } from '@/lib/utils';
import toast from 'react-hot-toast';

interface SearchResult {
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
  createdAt: string;
  updatedAt: string;
}

interface SearchResponse {
  results: SearchResult[];
  pagination: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
    hasMore: boolean;
  };
  filters: {
    query?: string;
    category?: string;
    minRate?: number;
    maxRate?: number;
    availability?: string;
    minRating?: number;
    skills?: string[];
    timezone?: string;
  };
  sorting: {
    sortBy: string;
    sortOrder: string;
  };
}

const sortOptions = [
  { value: 'rating', label: 'Highest Rated' },
  { value: 'completedProjects', label: 'Most Experienced' },
  { value: 'hourlyRate', label: 'Price: Low to High' },
  { value: 'createdAt', label: 'Newest First' },
];

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [results, setResults] = useState<SearchResult[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    totalCount: 0,
    totalPages: 0,
    hasMore: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [sortBy, setSortBy] = useState('rating');
  const [sortOrder, setSortOrder] = useState('desc');
  
  const [filters, setFilters] = useState({
    query: searchParams.get('q') || '',
    category: searchParams.get('category') || '',
    minRate: searchParams.get('minRate') || '',
    maxRate: searchParams.get('maxRate') || '',
    availability: searchParams.get('availability') || '',
    minRating: searchParams.get('minRating') || '',
    skills: searchParams.get('skills') || '',
    timezone: searchParams.get('timezone') || '',
  });

  const buildSearchUrl = useCallback((params: any, page = 1) => {
    const searchParams = new URLSearchParams();
    
    if (params.query) searchParams.set('query', params.query);
    if (params.category) searchParams.set('category', params.category);
    if (params.minRate) searchParams.set('minRate', params.minRate);
    if (params.maxRate) searchParams.set('maxRate', params.maxRate);
    if (params.availability) searchParams.set('availability', params.availability);
    if (params.minRating) searchParams.set('minRating', params.minRating);
    if (params.skills) searchParams.set('skills', params.skills);
    if (params.timezone) searchParams.set('timezone', params.timezone);
    
    searchParams.set('page', page.toString());
    searchParams.set('limit', pagination.limit.toString());
    searchParams.set('sortBy', sortBy);
    searchParams.set('sortOrder', sortOrder);

    return `/api/search?${searchParams.toString()}`;
  }, [pagination.limit, sortBy, sortOrder]);

  const performSearch = useCallback(async (page = 1, append = false) => {
    if (page === 1) {
      setIsLoading(true);
    } else {
      setIsLoadingMore(true);
    }

    try {
      const url = buildSearchUrl(filters, page);
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Search failed');
      }

      const data: SearchResponse = await response.json();
      
      if (append) {
        setResults(prev => [...prev, ...data.results]);
      } else {
        setResults(data.results);
      }
      
      setPagination(data.pagination);
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Failed to search service providers. Please try again.');
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, [filters, buildSearchUrl]);

  const debouncedSearch = useCallback(
    debounce(() => performSearch(1, false), 500),
    [performSearch]
  );

  useEffect(() => {
    performSearch(1, false);
  }, [sortBy, sortOrder]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = () => {
    performSearch(1, false);
    
    // Update URL with search parameters
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    router.push(`/search?${params.toString()}`);
  };

  const handleClearFilters = () => {
    setFilters({
      query: '',
      category: '',
      minRate: '',
      maxRate: '',
      availability: '',
      minRating: '',
      skills: '',
      timezone: '',
    });
    router.push('/search');
  };

  const handleLoadMore = () => {
    if (pagination.hasMore && !isLoadingMore) {
      performSearch(pagination.page + 1, true);
    }
  };

  const handleSortChange = (newSortBy: string) => {
    if (newSortBy === sortBy) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder(newSortBy === 'hourlyRate' ? 'asc' : 'desc');
    }
  };

  const handleViewProfile = (providerId: string) => {
    router.push(`/providers/${providerId}`);
  };

  const handleContactProvider = (providerId: string) => {
    router.push(`/contact/${providerId}`);
  };

  // Trigger search when query changes
  useEffect(() => {
    if (filters.query !== (searchParams.get('q') || '')) {
      debouncedSearch();
    }
  }, [filters.query, debouncedSearch, searchParams]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Find Service Providers</h1>
              <p className="text-gray-600">
                {pagination.totalCount > 0 
                  ? `${pagination.totalCount} service providers found`
                  : 'Search for professional service providers'
                }
              </p>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <SearchFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
              onApplyFilters={handleApplyFilters}
              isLoading={isLoading}
            />
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            {/* Sort Controls */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">Sort by:</span>
                <div className="flex space-x-2">
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleSortChange(option.value)}
                      className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                        sortBy === option.value
                          ? 'bg-primary-100 text-primary-700'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {option.label}
                      {sortBy === option.value && (
                        <span className="ml-1">
                          {sortOrder === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              </div>
            )}

            {/* No Results */}
            {!isLoading && results.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No service providers found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your search criteria or filters.</p>
                <Button onClick={handleClearFilters} variant="outline">
                  Clear Filters
                </Button>
              </div>
            )}

            {/* Results Grid */}
            {!isLoading && results.length > 0 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {results.map((provider) => (
                    <ServiceProviderCard
                      key={provider.id}
                      provider={provider}
                      onViewProfile={handleViewProfile}
                      onContactProvider={handleContactProvider}
                    />
                  ))}
                </div>

                {/* Load More */}
                {pagination.hasMore && (
                  <div className="text-center">
                    <Button
                      onClick={handleLoadMore}
                      isLoading={isLoadingMore}
                      variant="outline"
                      size="lg"
                    >
                      Load More Results
                    </Button>
                  </div>
                )}

                {/* Pagination Info */}
                <div className="text-center text-sm text-gray-600 mt-4">
                  Showing {results.length} of {pagination.totalCount} results
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
