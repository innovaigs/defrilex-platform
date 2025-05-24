import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

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
    const limit = parseInt(searchParams.get('limit') || '20');

    const skip = (page - 1) * limit;

    // Fetch conversations where user is a participant
    const [conversations, totalCount] = await Promise.all([
      prisma.conversation.findMany({
        where: {
          participants: {
            some: { userId: session.user.id },
          },
        },
        include: {
          participants: {
            include: {
              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  avatar: true,
                },
              },
            },
          },
          messages: {
            orderBy: { createdAt: 'desc' },
            take: 1,
            include: {
              sender: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  avatar: true,
                },
              },
            },
          },
          _count: {
            select: {
              messages: {
                where: {
                  senderId: { not: session.user.id },
                  readAt: null,
                },
              },
            },
          },
        },
        orderBy: { lastMessageAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.conversation.count({
        where: {
          participants: {
            some: { userId: session.user.id },
          },
        },
      }),
    ]);

    // Format conversations for frontend
    const formattedConversations = conversations.map((conversation) => {
      const otherParticipant = conversation.participants.find(
        (p) => p.userId !== session.user.id
      );

      return {
        id: conversation.id,
        lastMessage: conversation.lastMessage,
        lastMessageAt: conversation.lastMessageAt,
        unreadCount: conversation._count.messages,
        participant: otherParticipant?.user || null,
        lastMessageSender: conversation.messages[0]?.sender || null,
        createdAt: conversation.createdAt,
        updatedAt: conversation.updatedAt,
      };
    });

    const totalPages = Math.ceil(totalCount / limit);
    const hasMore = page < totalPages;

    return NextResponse.json({
      conversations: formattedConversations,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasMore,
      },
    });
  } catch (error) {
    console.error('Conversations fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
