'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ProjectForm } from '@/components/projects/ProjectForm';
import { Button } from '@/components/ui/Button';
import { formatCurrency, formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';

interface Project {
  id: string;
  title: string;
  description: string;
  status: string;
  budgetType: string;
  budgetAmount: number;
  hourlyRate?: number;
  estimatedDuration: number;
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
  category: {
    id: string;
    name: string;
    description: string;
  };
  client: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string;
  };
  serviceProvider?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string;
  };
  milestones: Array<{
    id: string;
    title: string;
    description: string;
    amount: number;
    status: string;
    dueDate: string;
  }>;
  _count: {
    proposals: number;
  };
}

interface ProjectsResponse {
  projects: Project[];
  pagination: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
    hasMore: boolean;
  };
}

const statusColors = {
  DRAFT: 'bg-gray-100 text-gray-800',
  OPEN: 'bg-blue-100 text-blue-800',
  IN_PROGRESS: 'bg-yellow-100 text-yellow-800',
  COMPLETED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
};

const statusLabels = {
  DRAFT: 'Draft',
  OPEN: 'Open for Proposals',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
};

export default function ProjectsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalCount: 0,
    totalPages: 0,
    hasMore: false,
  });

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    fetchProjects();
  }, [session, status, router]);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects');
      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }
      const data: ProjectsResponse = await response.json();
      setProjects(data.projects);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast.error('Failed to load projects');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateProject = async (projectData: any) => {
    setIsCreating(true);
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create project');
      }

      const data = await response.json();
      setProjects(prev => [data.project, ...prev]);
      setShowCreateForm(false);
      toast.success('Project created successfully!');
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  const handleViewProject = (projectId: string) => {
    router.push(`/projects/${projectId}`);
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  if (showCreateForm) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Create New Project</h1>
                <p className="text-gray-600">Post a project to find the perfect service provider</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ProjectForm
            onSubmit={handleCreateProject}
            onCancel={() => setShowCreateForm(false)}
            isLoading={isCreating}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Projects</h1>
              <p className="text-gray-600">
                {pagination.totalCount > 0 
                  ? `${pagination.totalCount} projects found`
                  : 'No projects yet'
                }
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => router.push('/dashboard')}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                ← Back to Dashboard
              </button>
              <Button onClick={() => setShowCreateForm(true)}>
                Create Project
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Empty State */}
        {projects.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
            <p className="text-gray-600 mb-4">Get started by creating your first project.</p>
            <Button onClick={() => setShowCreateForm(true)}>
              Create Your First Project
            </Button>
          </div>
        )}

        {/* Projects Grid */}
        {projects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleViewProject(project.id)}
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
                        {project.title}
                      </h3>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {project.category.name}
                      </span>
                    </div>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        statusColors[project.status as keyof typeof statusColors]
                      }`}
                    >
                      {statusLabels[project.status as keyof typeof statusLabels]}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {project.description}
                  </p>

                  {/* Budget */}
                  <div className="mb-4">
                    <div className="text-lg font-bold text-gray-900">
                      {project.budgetType === 'FIXED' 
                        ? formatCurrency(project.budgetAmount)
                        : `Up to ${formatCurrency(project.budgetAmount)}`
                      }
                    </div>
                    <div className="text-sm text-gray-600">
                      {project.budgetType === 'FIXED' ? 'Fixed Price' : 'Hourly Budget'}
                      {project.hourlyRate && ` • Max ${formatCurrency(project.hourlyRate)}/hr`}
                    </div>
                  </div>

                  {/* Milestones */}
                  {project.milestones.length > 0 && (
                    <div className="mb-4">
                      <div className="text-sm text-gray-600">
                        {project.milestones.length} milestone{project.milestones.length !== 1 ? 's' : ''}
                      </div>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="text-sm text-gray-500">
                      <div>Created {formatDate(project.createdAt)}</div>
                      <div>{project.estimatedDuration} days estimated</div>
                    </div>
                    <div className="text-sm text-gray-600">
                      {project._count.proposals} proposal{project._count.proposals !== 1 ? 's' : ''}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Load More */}
        {pagination.hasMore && (
          <div className="text-center mt-8">
            <Button variant="outline" onClick={fetchProjects}>
              Load More Projects
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
