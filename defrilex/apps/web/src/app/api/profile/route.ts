import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const updateProfileSchema = z.object({
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

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        serviceProvider: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      serviceProvider: user.serviceProvider,
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = updateProfileSchema.parse(body);

    // Update user basic information
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        email: validatedData.email,
        avatar: validatedData.avatar,
      },
    });

    // Update service provider information if user is a service provider
    if (updatedUser.role === 'SERVICE_PROVIDER') {
      const serviceProviderData = {
        title: validatedData.title || '',
        bio: validatedData.bio || '',
        hourlyRate: validatedData.hourlyRate || 0,
        timezone: validatedData.timezone || '',
        responseTime: validatedData.responseTime || '',
      };

      await prisma.serviceProvider.upsert({
        where: { userId: session.user.id },
        update: serviceProviderData,
        create: {
          userId: session.user.id,
          ...serviceProviderData,
        },
      });
    }

    // Fetch updated user with service provider data
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        serviceProvider: true,
      },
    });

    return NextResponse.json({
      message: 'Profile updated successfully',
      user: {
        id: user!.id,
        firstName: user!.firstName,
        lastName: user!.lastName,
        email: user!.email,
        avatar: user!.avatar,
        role: user!.role,
        isVerified: user!.isVerified,
        createdAt: user!.createdAt,
        updatedAt: user!.updatedAt,
      },
      serviceProvider: user!.serviceProvider,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
