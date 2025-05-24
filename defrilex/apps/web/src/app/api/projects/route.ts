import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const createProjectSchema = z.object({
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

const updateProjectSchema = createProjectSchema.partial();

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = createProjectSchema.parse(body);

    // Create the project
    const project = await prisma.project.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        categoryId: validatedData.categoryId,
        subcategory: validatedData.subcategory,
        clientId: session.user.id,
        budgetType: validatedData.budgetType,
        budgetAmount: validatedData.budgetAmount,
        hourlyRate: validatedData.hourlyRate,
        estimatedHours: validatedData.estimatedHours,
        estimatedDuration: validatedData.estimatedDuration,
        startDate: validatedData.startDate ? new Date(validatedData.startDate) : null,
        endDate: validatedData.endDate ? new Date(validatedData.endDate) : null,
        requirements: validatedData.requirements,
        status: 'DRAFT',
      },
      include: {
        category: true,
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            avatar: true,
          },
        },
      },
    });

    // Create milestones if provided
    if (validatedData.milestones.length > 0) {
      await prisma.milestone.createMany({
        data: validatedData.milestones.map((milestone, index) => ({
          projectId: project.id,
          title: milestone.title,
          description: milestone.description,
          amount: milestone.amount,
          dueDate: new Date(Date.now() + milestone.estimatedDays * 24 * 60 * 60 * 1000),
          deliverables: milestone.deliverables,
          status: 'PENDING',
        })),
      });
    }

    // Fetch the complete project with milestones
    const completeProject = await prisma.project.findUnique({
      where: { id: project.id },
      include: {
        category: true,
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            avatar: true,
          },
        },
        milestones: {
          orderBy: { createdAt: 'asc' },
        },
        attachments: true,
        _count: {
          select: {
            proposals: true,
          },
        },
      },
    });

    return NextResponse.json({
      message: 'Project created successfully',
      project: completeProject,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Project creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const category = searchParams.get('category');

    const skip = (page - 1) * limit;

    // Build where clause
    const whereClause: any = {
      OR: [
        { clientId: session.user.id },
        { serviceProviderId: session.user.id },
      ],
    };

    if (status) {
      whereClause.status = status;
    }

    if (category) {
      whereClause.categoryId = category;
    }

    // Fetch projects
    const [projects, totalCount] = await Promise.all([
      prisma.project.findMany({
        where: whereClause,
        include: {
          category: true,
          client: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              avatar: true,
            },
          },
          serviceProvider: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              avatar: true,
            },
          },
          milestones: {
            orderBy: { createdAt: 'asc' },
          },
          _count: {
            select: {
              proposals: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.project.count({ where: whereClause }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);
    const hasMore = page < totalPages;

    return NextResponse.json({
      projects,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasMore,
      },
    });
  } catch (error) {
    console.error('Projects fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
