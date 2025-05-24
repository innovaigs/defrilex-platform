'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/Button';
import { formatDate, formatTime } from '@/lib/utils';
import toast from 'react-hot-toast';

interface Message {
  id: string;
  content: string;
  senderId: string;
  createdAt: string;
  readAt?: string;
  attachments: Array<{
    url: string;
    name: string;
    type: string;
    size: number;
  }>;
  sender: {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
}

interface ChatInterfaceProps {
  conversationId: string;
  participant: {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  onClose: () => void;
}

export function ChatInterface({ conversationId, participant, onClose }: ChatInterfaceProps) {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMessages();
  }, [conversationId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async () => {
    try {
      const response = await fetch(`/api/messages?conversationId=${conversationId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }
      const data = await response.json();
      setMessages(data.messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load messages');
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || isSending) return;

    setIsSending(true);
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversationId,
          recipientId: participant.id,
          content: newMessage.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();
      setMessages(prev => [...prev, data.data]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const renderMessage = (message: Message) => {
    const isOwnMessage = message.senderId === session?.user?.id;
    
    return (
      <div
        key={message.id}
        className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4`}
      >
        <div className={`flex max-w-xs lg:max-w-md ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}>
          {!isOwnMessage && (
            <div className="flex-shrink-0 mr-3">
              {message.sender.avatar ? (
                <img
                  src={message.sender.avatar}
                  alt={`${message.sender.firstName} ${message.sender.lastName}`}
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                  <span className="text-xs font-medium text-gray-700">
                    {message.sender.firstName[0]}{message.sender.lastName[0]}
                  </span>
                </div>
              )}
            </div>
          )}
          
          <div className={`px-4 py-2 rounded-lg ${
            isOwnMessage 
              ? 'bg-primary-600 text-white' 
              : 'bg-gray-100 text-gray-900'
          }`}>
            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
            <p className={`text-xs mt-1 ${
              isOwnMessage ? 'text-primary-100' : 'text-gray-500'
            }`}>
              {formatTime(message.createdAt)}
              {isOwnMessage && message.readAt && (
                <span className="ml-1">✓✓</span>
              )}
            </p>
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          {participant.avatar ? (
            <img
              src={participant.avatar}
              alt={`${participant.firstName} ${participant.lastName}`}
              className="w-10 h-10 rounded-full"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-sm font-medium text-gray-700">
                {participant.firstName[0]}{participant.lastName[0]}
              </span>
            </div>
          )}
          <div>
            <h3 className="font-medium text-gray-900">
              {participant.firstName} {participant.lastName}
            </h3>
            <p className="text-sm text-gray-500">Online</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map(renderMessage)
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex space-x-3">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 resize-none rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            rows={1}
            style={{ minHeight: '40px', maxHeight: '120px' }}
          />
          <Button
            onClick={sendMessage}
            disabled={!newMessage.trim() || isSending}
            isLoading={isSending}
            size="sm"
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}
