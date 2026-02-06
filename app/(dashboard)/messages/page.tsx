'use client';


import { useState, useEffect, useRef, Suspense } from 'react';
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

function MessagesPageContent() {
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
    if (!user) return;
    
    const fetchConversations = async () => {
      try {
        const response = await api.get('/conversations');
        setConversations(response.data || []);
        
        if (selectedUserId && selectedNeedId) {
          const conv = response.data?.find((c: any) => 
            (c.participant_1_id === selectedUserId || c.participant_2_id === selectedUserId) &&
            c.need_id === selectedNeedId
          );
          if (conv) {
            setSelectedConversation(conv);
          }
        }
      } catch (error) {
        console.error('Error fetching conversations:', error);
        toast.error('Failed to load conversations');
      } finally {
        setLoading(false);
      }
    };
    
    fetchConversations();
  }, [selectedUserId, selectedNeedId, user]);

  const fetchMessages = async (conversationId: string) => {
    try {
      const response = await api.get(`/conversations/${conversationId}/messages`);
      setMessages(response.data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load messages');
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !selectedConversation) return;

    try {
      setSendingMessage(true);
      await api.post(`/conversations/${selectedConversation.id}/messages`, {
        message: messageInput.trim(),
      });
      setMessageInput('');
      fetchMessages(selectedConversation.id);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setSendingMessage(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading conversations...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="grid grid-cols-1 lg:grid-cols-3 h-screen">
        {/* Conversations List */}
        <div className="lg:col-span-1 border-r bg-white overflow-y-auto">
          <div className="p-4 border-b">
            <h2 className="text-xl font-bold">Messages</h2>
          </div>
          <div className="divide-y">
            {conversations.length === 0 ? (
              <p className="p-4 text-gray-600">No conversations yet</p>
            ) : (
              conversations.map(conv => (
                <button
                  key={conv.id}
                  onClick={() => {
                    setSelectedConversation(conv);
                    fetchMessages(conv.id);
                  }}
                  className={`w-full p-4 text-left hover:bg-gray-50 transition ${
                    selectedConversation?.id === conv.id ? 'bg-blue-50' : ''
                  }`}
                >
                  <p className="font-semibold text-gray-900">{conv.need_title}</p>
                  <p className="text-sm text-gray-600 truncate">{conv.last_message}</p>
                  <p className="text-xs text-gray-400">{formatDate(conv.last_message_at)}</p>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-2 bg-white flex flex-col">
          {selectedConversation ? (
            <>
              <div className="p-4 border-b flex items-center gap-2">
                <FiArrowLeft 
                  className="cursor-pointer"
                  onClick={() => setSelectedConversation(null)}
                />
                <h3 className="font-semibold">{selectedConversation.need_title}</h3>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map(msg => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg ${
                        msg.sender_id === user?.id
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-900'
                      }`}
                    >
                      <p>{msg.message}</p>
                      <p className="text-xs mt-1 opacity-70">
                        {formatDate(msg.created_at)}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              <form onSubmit={handleSendMessage} className="p-4 border-t flex gap-2">
                <input
                  type="text"
                  value={messageInput}
                  onChange={e => setMessageInput(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 border rounded-lg"
                  disabled={sendingMessage}
                />
                <button
                  type="submit"
                  disabled={sendingMessage || !messageInput.trim()}
                  className="p-2 bg-blue-500 text-white rounded-lg"
                >
                  <FiSend />
                </button>
              </form>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-600">
              Select a conversation to start messaging
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MessagesPage() {
  return (
    <Suspense fallback={<div className="text-center py-12">Loading...</div>}>
      <MessagesPageContent />
    </Suspense>
  );
}
