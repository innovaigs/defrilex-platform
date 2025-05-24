'use client';

import React, { useState, useEffect } from 'react';
import { formatRelativeTime } from '@/lib/utils';

interface Conversation {
  id: string;
  lastMessage?: string;
  lastMessageAt?: string;
  unreadCount: number;
  participant: {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  } | null;
  lastMessageSender: {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}

interface ConversationsListProps {
  onSelectConversation: (conversation: Conversation) => void;
  selectedConversationId?: string;
}

export function ConversationsList({ onSelectConversation, selectedConversationId }: ConversationsListProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const response = await fetch('/api/conversations');
      if (!response.ok) {
        throw new Error('Failed to fetch conversations');
      }
      const data = await response.json();
      setConversations(data.conversations);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No conversations yet</h3>
        <p className="text-gray-600">Start a conversation by contacting a service provider.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {conversations.map((conversation) => {
        if (!conversation.participant) return null;
        
        const isSelected = conversation.id === selectedConversationId;
        
        return (
          <div
            key={conversation.id}
            onClick={() => onSelectConversation(conversation)}
            className={`p-4 rounded-lg cursor-pointer transition-colors ${
              isSelected 
                ? 'bg-primary-50 border-primary-200' 
                : 'bg-white hover:bg-gray-50 border-gray-200'
            } border`}
          >
            <div className="flex items-center space-x-3">
              {/* Avatar */}
              <div className="flex-shrink-0">
                {conversation.participant.avatar ? (
                  <img
                    src={conversation.participant.avatar}
                    alt={`${conversation.participant.firstName} ${conversation.participant.lastName}`}
                    className="w-12 h-12 rounded-full"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-700">
                      {conversation.participant.firstName[0]}{conversation.participant.lastName[0]}
                    </span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-900 truncate">
                    {conversation.participant.firstName} {conversation.participant.lastName}
                  </h3>
                  <div className="flex items-center space-x-2">
                    {conversation.unreadCount > 0 && (
                      <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-primary-600 rounded-full">
                        {conversation.unreadCount}
                      </span>
                    )}
                    {conversation.lastMessageAt && (
                      <span className="text-xs text-gray-500">
                        {formatRelativeTime(conversation.lastMessageAt)}
                      </span>
                    )}
                  </div>
                </div>
                
                {conversation.lastMessage && (
                  <p className="text-sm text-gray-600 truncate mt-1">
                    {conversation.lastMessage}
                  </p>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
