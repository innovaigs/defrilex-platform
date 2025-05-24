import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const createPaymentSchema = z.object({
  projectId: z.string().min(1, 'Project ID is required'),
  milestoneId: z.string().optional(),
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  currency: z.string().default('USD'),
  description: z.string().min(1, 'Description is required'),
  paymentType: z.enum(['PROJECT_PAYMENT', 'MILESTONE_PAYMENT', 'ESCROW_RELEASE']),
});

const updatePaymentSchema = z.object({
  status: z.enum(['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'REFUNDED']),
  stripePaymentIntentId: z.string().optional(),
  failureReason: z.string().optional(),
});

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
    const validatedData = createPaymentSchema.parse(body);

    // Verify project exists and user has permission
    const project = await prisma.project.findFirst({
      where: {
        id: validatedData.projectId,
        OR: [
          { clientId: session.user.id },
          { serviceProviderId: session.user.id },
        ],
      },
      include: {
        client: true,
        serviceProvider: true,
      },
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found or access denied' },
        { status: 404 }
      );
    }

    // Verify milestone if provided
    let milestone = null;
    if (validatedData.milestoneId) {
      milestone = await prisma.milestone.findFirst({
        where: {
          id: validatedData.milestoneId,
          projectId: validatedData.projectId,
        },
      });

      if (!milestone) {
        return NextResponse.json(
          { error: 'Milestone not found' },
          { status: 404 }
        );
      }
    }

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        projectId: validatedData.projectId,
        milestoneId: validatedData.milestoneId,
        payerId: session.user.id,
        payeeId: project.serviceProviderId || project.clientId,
        amount: validatedData.amount,
        currency: validatedData.currency,
        description: validatedData.description,
        paymentType: validatedData.paymentType,
        status: 'PENDING',
      },
      include: {
        project: {
          include: {
            client: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
            serviceProvider: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
        milestone: true,
        payer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        payee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    // Here you would integrate with Stripe to create a PaymentIntent
    // For now, we'll simulate the Stripe integration
    const mockStripePaymentIntent = {
      id: `pi_mock_${Date.now()}`,
      client_secret: `pi_mock_${Date.now()}_secret_${Math.random().toString(36).substring(7)}`,
      amount: Math.round(validatedData.amount * 100), // Stripe uses cents
      currency: validatedData.currency.toLowerCase(),
      status: 'requires_payment_method',
    };

    // Update payment with Stripe PaymentIntent ID
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        stripePaymentIntentId: mockStripePaymentIntent.id,
        status: 'PROCESSING',
      },
    });

    return NextResponse.json({
      message: 'Payment created successfully',
      payment: {
        ...payment,
        stripePaymentIntentId: mockStripePaymentIntent.id,
        status: 'PROCESSING',
      },
      clientSecret: mockStripePaymentIntent.client_secret,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Payment creation error:', error);
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
    const projectId = searchParams.get('projectId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const skip = (page - 1) * limit;

    // Build where clause
    const whereClause: any = {
      OR: [
        { payerId: session.user.id },
        { payeeId: session.user.id },
      ],
    };

    if (projectId) {
      whereClause.projectId = projectId;
    }

    // Fetch payments
    const [payments, totalCount] = await Promise.all([
      prisma.payment.findMany({
        where: whereClause,
        include: {
          project: {
            include: {
              client: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true,
                },
              },
              serviceProvider: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true,
                },
              },
            },
          },
          milestone: true,
          payer: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          payee: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.payment.count({ where: whereClause }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);
    const hasMore = page < totalPages;

    return NextResponse.json({
      payments,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasMore,
      },
    });
  } catch (error) {
    console.error('Payments fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
