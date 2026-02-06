'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useAuthStore } from '@/lib/auth';
import toast from 'react-hot-toast';
import { FiSearch, FiSend, FiArrowLeft } from 'react-icons/fi';
import { formatDate } from '@/lib/utils';

interface Conversation {
  id: string;
  need_id: string;
  need_title: string;
  participant_1_id: string;
  participant_1_name: string;
  participant_2_id: string;
  participant_2_name: string;
  last_message: string;
  last_message_at: string;
  unread_count: number;
}

interface ChatMessage {
  id: string;
  sender_id: string;
  sender_name: string;
  message: string;
  created_at: string;
}

export default function MessagesPage() {
  const searchParams = useSearchParams();
  const { user } = useAuthStore();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const selectedUserId = searchParams.get('user');
  const selectedNeedId = searchParams.get('need');

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages();
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // If coming from a need page, find or create conversation
  useEffect(() => {
    if (selectedUserId && selectedNeedId && conversations.length > 0) {
      const conv = conversations.find(c => c.need_id === selectedNeedId);
      if (conv) {
        setSelectedConversation(conv);
      }
    }
  }, [selectedUserId, selectedNeedId, conversations]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const response = await api.get('/chat/conversations');
      setConversations(response.data || []);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      toast.error('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    if (!selectedConversation) return;
    
    try {
      const response = await api.get(
        `/chat/messages/${selectedConversation.need_id}/${
          selectedConversation.participant_1_id === user?.id
            ? selectedConversation.participant_2_id
            : selectedConversation.participant_1_id
        }`
      );
      setMessages(response.data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!messageInput.trim() || !selectedConversation) return;

    try {
      setSendingMessage(true);
      
      const receiverId =
        selectedConversation.participant_1_id === user?.id
          ? selectedConversation.participant_2_id
          : selectedConversation.participant_1_id;

      await api.post('/chat/messages', {
        need_id: selectedConversation.need_id,
        receiver_id: receiverId,
        message: messageInput
      });

      setMessageInput('');
      fetchMessages();
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setSendingMessage(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container-padding py-6">
          <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
        </div>
      </div>

      <div className="container-padding py-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 h-96">
          {/* Conversations List */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl shadow-md h-full flex flex-col">
              {/* Search */}
              <div className="p-4 border-b border-gray-200">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    className="input-base pl-10"
                  />
                </div>
              </div>

              {/* Conversations */}
              {loading ? (
                <div className="p-4 text-gray-600">Loading conversations...</div>
              ) : conversations.length === 0 ? (
                <div className="p-4 text-gray-600">No conversations yet</div>
              ) : (
                <div className="flex-1 overflow-y-auto">
                  {conversations.map((conv) => {
                    const otherName =
                      conv.participant_1_id === user?.id
                        ? conv.participant_2_name
                        : conv.participant_1_name;

                    return (
                      <button
                        key={conv.id}
                        onClick={() => setSelectedConversation(conv)}
                        className={`w-full text-left p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                          selectedConversation?.id === conv.id ? 'bg-primary-light' : ''
                        }`}
                      >
                        <h4 className="font-semibold text-gray-900 mb-1">{otherName}</h4>
                        <p className="text-sm text-gray-600 truncate">{conv.last_message}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDate(conv.last_message_at)}
                        </p>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Chat Area */}
          {selectedConversation ? (
            <div className="md:col-span-2">
              <div className="bg-white rounded-xl shadow-md h-full flex flex-col">
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setSelectedConversation(null)}
                      className="md:hidden"
                    >
                      <FiArrowLeft />
                    </button>
                    <div>
                      <h3 className="font-bold text-gray-900">
                        {selectedConversation.participant_1_id === user?.id
                          ? selectedConversation.participant_2_name
                          : selectedConversation.participant_1_name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {selectedConversation.need_title}
                      </p>
                    </div>
                  </div>
                  <Link
                    href={`/need/${selectedConversation.need_id}`}
                    className="btn-secondary text-sm px-3 py-2"
                  >
                    View Need
                  </Link>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${
                        msg.sender_id === user?.id ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-xs px-4 py-2 rounded-lg ${
                          msg.sender_id === user?.id
                            ? 'bg-primary text-white'
                            : 'bg-gray-200 text-gray-900'
                        }`}
                      >
                        <p className="break-words">{msg.message}</p>
                        <p className="text-xs mt-1 opacity-75">
                          {formatDate(msg.created_at)}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <form
                  onSubmit={handleSendMessage}
                  className="p-4 border-t border-gray-200 flex gap-2"
                >
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="Type a message..."
                    className="input-base flex-1"
                    disabled={sendingMessage}
                  />
                  <button
                    type="submit"
                    disabled={sendingMessage || !messageInput.trim()}
                    className="btn-primary px-4 py-3 disabled:opacity-50"
                  >
                    <FiSend />
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="md:col-span-2">
              <div className="bg-white rounded-xl shadow-md h-full flex items-center justify-center">
                <p className="text-gray-600 text-center">
                  Select a conversation to start messaging
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
