'use client';

import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import toast from 'react-hot-toast';

const projectSchema = z.object({
  title: z.string().min(1, 'Project title is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  categoryId: z.string().min(1, 'Category is required'),
  subcategory: z.string().optional(),
  budgetType: z.enum(['FIXED', 'HOURLY']),
  budgetAmount: z.number().min(1, 'Budget amount must be greater than 0'),
  hourlyRate: z.number().optional(),
  estimatedHours: z.number().optional(),
  estimatedDuration: z.number().min(1, 'Estimated duration is required'),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  requirements: z.array(z.string()).default([]),
  milestones: z.array(z.object({
    title: z.string().min(1, 'Milestone title is required'),
    description: z.string().min(1, 'Milestone description is required'),
    amount: z.number().min(0, 'Milestone amount must be non-negative'),
    estimatedDays: z.number().min(1, 'Estimated days must be at least 1'),
    deliverables: z.array(z.string()).default([]),
  })).default([]),
});

type ProjectFormData = z.infer<typeof projectSchema>;

interface ProjectFormProps {
  onSubmit: (data: ProjectFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const categories = [
  { id: '1', name: 'Web Development', description: 'Frontend and backend development' },
  { id: '2', name: 'Mobile Development', description: 'iOS and Android apps' },
  { id: '3', name: 'Digital Marketing', description: 'SEO, social media, advertising' },
  { id: '4', name: 'Content Writing', description: 'Blog posts, copywriting, technical writing' },
  { id: '5', name: 'Graphic Design', description: 'Logos, branding, illustrations' },
  { id: '6', name: 'Data Science', description: 'Analytics, machine learning, data visualization' },
  { id: '7', name: 'Virtual Assistant', description: 'Administrative support, customer service' },
  { id: '8', name: 'Translation', description: 'Document translation, localization' },
];

export function ProjectForm({ onSubmit, onCancel, isLoading = false }: ProjectFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [requirementInput, setRequirementInput] = useState('');

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      budgetType: 'FIXED',
      requirements: [],
      milestones: [],
    },
  });

  const { fields: milestoneFields, append: appendMilestone, remove: removeMilestone } = useFieldArray({
    control,
    name: 'milestones',
  });

  const budgetType = watch('budgetType');
  const requirements = watch('requirements');

  const handleFormSubmit = async (data: ProjectFormData) => {
    try {
      await onSubmit(data);
      toast.success('Project created successfully!');
    } catch (error) {
      toast.error('Failed to create project. Please try again.');
      console.error('Project creation error:', error);
    }
  };

  const addRequirement = () => {
    if (requirementInput.trim()) {
      const currentRequirements = requirements || [];
      setValue('requirements', [...currentRequirements, requirementInput.trim()]);
      setRequirementInput('');
    }
  };

  const removeRequirement = (index: number) => {
    const currentRequirements = requirements || [];
    setValue('requirements', currentRequirements.filter((_, i) => i !== index));
  };

  const addMilestone = () => {
    appendMilestone({
      title: '',
      description: '',
      amount: 0,
      estimatedDays: 1,
      deliverables: [],
    });
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3].map((step) => (
        <div key={step} className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step <= currentStep
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-600'
            }`}
          >
            {step}
          </div>
          {step < 3 && (
            <div
              className={`w-16 h-1 mx-2 ${
                step < currentStep ? 'bg-primary-600' : 'bg-gray-200'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Project Details</h3>
      
      <Input
        label="Project Title"
        {...register('title')}
        error={errors.title?.message}
        placeholder="e.g., Build a responsive e-commerce website"
      />

      <Textarea
        label="Project Description"
        {...register('description')}
        error={errors.description?.message}
        placeholder="Describe your project in detail, including goals, features, and any specific requirements..."
        rows={4}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Category
        </label>
        <select
          {...register('categoryId')}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        {errors.categoryId && (
          <p className="text-sm text-red-600 mt-1">{errors.categoryId.message}</p>
        )}
      </div>

      <Input
        label="Subcategory (Optional)"
        {...register('subcategory')}
        error={errors.subcategory?.message}
        placeholder="e.g., React Development, WordPress"
      />
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Budget & Timeline</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Budget Type
        </label>
        <div className="grid grid-cols-2 gap-4">
          <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              {...register('budgetType')}
              value="FIXED"
              className="mr-3"
            />
            <div>
              <div className="font-medium">Fixed Price</div>
              <div className="text-sm text-gray-600">One-time payment for the entire project</div>
            </div>
          </label>
          <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              {...register('budgetType')}
              value="HOURLY"
              className="mr-3"
            />
            <div>
              <div className="font-medium">Hourly Rate</div>
              <div className="text-sm text-gray-600">Pay based on time worked</div>
            </div>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label={budgetType === 'FIXED' ? 'Total Budget (USD)' : 'Maximum Budget (USD)'}
          type="number"
          step="0.01"
          min="1"
          {...register('budgetAmount', { valueAsNumber: true })}
          error={errors.budgetAmount?.message}
          placeholder="1000.00"
        />

        {budgetType === 'HOURLY' && (
          <>
            <Input
              label="Maximum Hourly Rate (USD)"
              type="number"
              step="0.01"
              min="1"
              {...register('hourlyRate', { valueAsNumber: true })}
              error={errors.hourlyRate?.message}
              placeholder="50.00"
            />
            <Input
              label="Estimated Hours"
              type="number"
              min="1"
              {...register('estimatedHours', { valueAsNumber: true })}
              error={errors.estimatedHours?.message}
              placeholder="40"
              className="md:col-span-2"
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Input
          label="Estimated Duration (Days)"
          type="number"
          min="1"
          {...register('estimatedDuration', { valueAsNumber: true })}
          error={errors.estimatedDuration?.message}
          placeholder="30"
        />

        <Input
          label="Start Date (Optional)"
          type="date"
          {...register('startDate')}
          error={errors.startDate?.message}
        />

        <Input
          label="End Date (Optional)"
          type="date"
          {...register('endDate')}
          error={errors.endDate?.message}
        />
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Requirements & Milestones</h3>
      
      {/* Requirements */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Project Requirements
        </label>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={requirementInput}
            onChange={(e) => setRequirementInput(e.target.value)}
            placeholder="Add a requirement..."
            className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRequirement())}
          />
          <Button type="button" onClick={addRequirement} size="sm">
            Add
          </Button>
        </div>
        {requirements && requirements.length > 0 && (
          <div className="space-y-2">
            {requirements.map((requirement, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span className="text-sm">{requirement}</span>
                <button
                  type="button"
                  onClick={() => removeRequirement(index)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Milestones */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Project Milestones (Optional)
          </label>
          <Button type="button" onClick={addMilestone} size="sm" variant="outline">
            Add Milestone
          </Button>
        </div>
        
        {milestoneFields.map((field, index) => (
          <div key={field.id} className="p-4 border rounded-lg space-y-4 mb-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Milestone {index + 1}</h4>
              <button
                type="button"
                onClick={() => removeMilestone(index)}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                Remove
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Milestone Title"
                {...register(`milestones.${index}.title`)}
                error={errors.milestones?.[index]?.title?.message}
                placeholder="e.g., Design Phase Complete"
              />
              
              <Input
                label="Amount (USD)"
                type="number"
                step="0.01"
                min="0"
                {...register(`milestones.${index}.amount`, { valueAsNumber: true })}
                error={errors.milestones?.[index]?.amount?.message}
                placeholder="500.00"
              />
            </div>
            
            <Textarea
              label="Description"
              {...register(`milestones.${index}.description`)}
              error={errors.milestones?.[index]?.description?.message}
              placeholder="Describe what will be delivered in this milestone..."
              rows={2}
            />
            
            <Input
              label="Estimated Days"
              type="number"
              min="1"
              {...register(`milestones.${index}.estimatedDays`, { valueAsNumber: true })}
              error={errors.milestones?.[index]?.estimatedDays?.message}
              placeholder="7"
            />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto">
      {renderStepIndicator()}
      
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
        <div className="bg-white shadow rounded-lg p-6">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
        </div>

        <div className="flex justify-between">
          <div>
            {currentStep > 1 && (
              <Button type="button" onClick={prevStep} variant="outline">
                Previous
              </Button>
            )}
          </div>
          
          <div className="flex space-x-3">
            <Button type="button" onClick={onCancel} variant="outline">
              Cancel
            </Button>
            
            {currentStep < 3 ? (
              <Button type="button" onClick={nextStep}>
                Next
              </Button>
            ) : (
              <Button type="submit" isLoading={isLoading}>
                Create Project
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
