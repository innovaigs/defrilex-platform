import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const searchSchema = z.object({
  query: z.string().optional(),
  category: z.string().optional(),
  minRate: z.number().min(0).optional(),
  maxRate: z.number().min(0).optional(),
  availability: z.enum(['AVAILABLE', 'BUSY', 'UNAVAILABLE']).optional(),
  minRating: z.number().min(0).max(5).optional(),
  skills: z.array(z.string()).optional(),
  timezone: z.string().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(50).default(12),
  sortBy: z.enum(['rating', 'hourlyRate', 'completedProjects', 'createdAt']).default('rating'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const params = {
      query: searchParams.get('query') || undefined,
      category: searchParams.get('category') || undefined,
      minRate: searchParams.get('minRate') ? Number(searchParams.get('minRate')) : undefined,
      maxRate: searchParams.get('maxRate') ? Number(searchParams.get('maxRate')) : undefined,
      availability: searchParams.get('availability') || undefined,
      minRating: searchParams.get('minRating') ? Number(searchParams.get('minRating')) : undefined,
      skills: searchParams.get('skills') ? searchParams.get('skills')!.split(',') : undefined,
      timezone: searchParams.get('timezone') || undefined,
      page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
      limit: searchParams.get('limit') ? Number(searchParams.get('limit')) : 12,
      sortBy: searchParams.get('sortBy') || 'rating',
      sortOrder: searchParams.get('sortOrder') || 'desc',
    };

    const validatedParams = searchSchema.parse(params);

    // Build where clause for filtering
    const whereClause: any = {
      user: {
        role: 'SERVICE_PROVIDER',
      },
    };

    // Text search across title and bio
    if (validatedParams.query) {
      whereClause.OR = [
        {
          title: {
            contains: validatedParams.query,
            mode: 'insensitive',
          },
        },
        {
          bio: {
            contains: validatedParams.query,
            mode: 'insensitive',
          },
        },
        {
          user: {
            OR: [
              {
                firstName: {
                  contains: validatedParams.query,
                  mode: 'insensitive',
                },
              },
              {
                lastName: {
                  contains: validatedParams.query,
                  mode: 'insensitive',
                },
              },
            ],
          },
        },
      ];
    }

    // Category filter
    if (validatedParams.category) {
      whereClause.categories = {
        some: {
          category: {
            name: validatedParams.category,
          },
        },
      };
    }

    // Rate range filter
    if (validatedParams.minRate !== undefined || validatedParams.maxRate !== undefined) {
      whereClause.hourlyRate = {};
      if (validatedParams.minRate !== undefined) {
        whereClause.hourlyRate.gte = validatedParams.minRate;
      }
      if (validatedParams.maxRate !== undefined) {
        whereClause.hourlyRate.lte = validatedParams.maxRate;
      }
    }

    // Availability filter
    if (validatedParams.availability) {
      whereClause.availability = validatedParams.availability;
    }

    // Rating filter
    if (validatedParams.minRating !== undefined) {
      whereClause.rating = {
        gte: validatedParams.minRating,
      };
    }

    // Skills filter
    if (validatedParams.skills && validatedParams.skills.length > 0) {
      whereClause.skills = {
        some: {
          skill: {
            name: {
              in: validatedParams.skills,
            },
          },
        },
      };
    }

    // Timezone filter
    if (validatedParams.timezone) {
      whereClause.timezone = {
        contains: validatedParams.timezone,
        mode: 'insensitive',
      };
    }

    // Build order by clause
    const orderBy: any = {};
    orderBy[validatedParams.sortBy] = validatedParams.sortOrder;

    // Calculate pagination
    const skip = (validatedParams.page - 1) * validatedParams.limit;

    // Execute search query
    const [serviceProviders, totalCount] = await Promise.all([
      prisma.serviceProvider.findMany({
        where: whereClause,
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatar: true,
              isVerified: true,
            },
          },
          categories: {
            include: {
              category: true,
            },
          },
          skills: {
            include: {
              skill: true,
            },
            take: 5, // Limit skills shown in search results
          },
          verificationBadges: {
            where: {
              OR: [
                { expiresAt: null },
                { expiresAt: { gt: new Date() } },
              ],
            },
          },
        },
        orderBy,
        skip,
        take: validatedParams.limit,
      }),
      prisma.serviceProvider.count({
        where: whereClause,
      }),
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / validatedParams.limit);
    const hasMore = validatedParams.page < totalPages;

    // Format response
    const formattedResults = serviceProviders.map((provider) => ({
      id: provider.id,
      user: provider.user,
      title: provider.title,
      bio: provider.bio,
      hourlyRate: provider.hourlyRate,
      availability: provider.availability,
      timezone: provider.timezone,
      responseTime: provider.responseTime,
      completedProjects: provider.completedProjects,
      rating: provider.rating,
      reviewCount: provider.reviewCount,
      isVerified: provider.isVerified,
      categories: provider.categories.map((cat) => cat.category),
      skills: provider.skills.map((skill) => ({
        name: skill.skill.name,
        level: skill.level,
        isVerified: skill.isVerified,
      })),
      verificationBadges: provider.verificationBadges.map((badge) => ({
        type: badge.type,
        issuedAt: badge.issuedAt,
      })),
      createdAt: provider.createdAt,
      updatedAt: provider.updatedAt,
    }));

    return NextResponse.json({
      results: formattedResults,
      pagination: {
        page: validatedParams.page,
        limit: validatedParams.limit,
        totalCount,
        totalPages,
        hasMore,
      },
      filters: {
        query: validatedParams.query,
        category: validatedParams.category,
        minRate: validatedParams.minRate,
        maxRate: validatedParams.maxRate,
        availability: validatedParams.availability,
        minRating: validatedParams.minRating,
        skills: validatedParams.skills,
        timezone: validatedParams.timezone,
      },
      sorting: {
        sortBy: validatedParams.sortBy,
        sortOrder: validatedParams.sortOrder,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid search parameters', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
