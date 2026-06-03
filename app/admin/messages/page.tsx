'use client';

import React, { useEffect, useState, useRef } from 'react';
import { ProtectedRoute } from '@/app/components/ProtectedRoute';
import AdminLayout from '@/app/components/AdminLayout';
import { useAuth } from '@/contexts/AuthContext';
import * as signalR from '@microsoft/signalr';
import { Search, Send, CheckCircle2, MessageSquare, Mail, UserCircle2, Clock, Inbox } from 'lucide-react';

const API = 'http://localhost:5090';

interface Client {
  userId: number;
  name: string;
  email: string;
  role: string;
  serviceType: string | null;
  profilePicture: string | null;
}

interface Conversation {
  prof: Client;
  lastMessage: { content: string; sentAt: string; isMine: boolean } | null;
  unreadCount: number;
}

interface Message {
  messageId: number;
  senderId: number;
  receiverId: number;
  content: string;
  sentAt: string;
  isRead: boolean;
}

function timeAgo(dateStr: string) {
  const now = new Date();
  const date = new Date(dateStr);
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

export default function MessagesPage() {
  const { user, isAuthenticated } = useAuth();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [search, setSearch] = useState('');
  const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load client conversations
  const loadConversations = () => {
    fetch(`${API}/api/message/clients`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        if (Array.isArray(data)) setConversations(data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    loadConversations();
    const interval = setInterval(loadConversations, 15000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  // Connect to SignalR
  useEffect(() => {
    if (!isAuthenticated) return;
    const token = localStorage.getItem('token') || '';
    const conn = new signalR.HubConnectionBuilder()
      .withUrl(`${API}/chathub`, { accessTokenFactory: () => token })
      .withAutomaticReconnect()
      .build();

    conn.start().then(() => setConnection(conn)).catch(console.error);
    return () => { conn.stop(); };
  }, [isAuthenticated]);

  // Handle incoming messages
  useEffect(() => {
    if (!connection) return;
    connection.off('ReceiveMessage');
    connection.on('ReceiveMessage', (message: Message) => {
      const myId = Number(user?.id);
      const otherId = message.senderId === myId ? message.receiverId : message.senderId;

      // Update conversations list
      setConversations(prev => {
        const idx = prev.findIndex(c => c.prof.userId === otherId);
        if (idx !== -1) {
          const updated = [...prev];
          updated[idx] = {
            ...updated[idx],
            lastMessage: { content: message.content, sentAt: message.sentAt, isMine: message.senderId === myId },
            unreadCount: (message.senderId !== myId && selectedConv?.prof.userId !== otherId)
              ? updated[idx].unreadCount + 1 : 0
          };
          // move to top
          const [item] = updated.splice(idx, 1);
          return [item, ...updated];
        }
        // New conversation — reload
        loadConversations();
        return prev;
      });

      // If in active chat, append message
      if (selectedConv?.prof.userId === otherId) {
        setMessages(prev => {
          if (prev.find(m => m.messageId === message.messageId)) return prev;
          return [...prev, message];
        });
      }
    });
  }, [connection, selectedConv, user?.id]);

  // Fetch message history when conversation selected
  useEffect(() => {
    if (!selectedConv) return;
    fetch(`${API}/api/message/history/${selectedConv.prof.userId}`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => res.ok ? res.json() : [])
      .then(data => { if (Array.isArray(data)) setMessages(data); })
      .catch(console.error);

    // Mark as read in local state
    setConversations(prev => prev.map(c =>
      c.prof.userId === selectedConv.prof.userId ? { ...c, unreadCount: 0 } : c
    ));
  }, [selectedConv]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !connection || !selectedConv) return;
    const msg = inputMessage;
    setInputMessage('');
    try {
      await connection.invoke('SendMessage', selectedConv.prof.userId, msg);
    } catch {
      setInputMessage(msg);
    }
  };

  const totalUnread = conversations.reduce((s, c) => s + c.unreadCount, 0);
  const filtered = conversations.filter(c =>
    c.prof.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.prof.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
      <AdminLayout>
        <div className="p-6 flex h-[calc(100vh-0px)] overflow-hidden flex-col">

          {/* Page Header */}
          <div className="flex items-center justify-between mb-5 flex-shrink-0">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Inbox className="w-6 h-6 text-amber-600" />
                Client Messages
                {totalUnread > 0 && (
                  <span className="ml-1 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {totalUnread} new
                  </span>
                )}
              </h1>
              <p className="text-gray-500 mt-0.5 text-sm">Respond to enquiries from clients about your services.</p>
            </div>
          </div>

          {/* Main chat layout */}
          <div className="flex-1 bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden flex min-h-0">

            {/* Left: Conversations List */}
            <div className="w-[320px] border-r border-gray-100 flex flex-col flex-shrink-0">
              {/* Search */}
              <div className="p-4 border-b border-gray-100">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search clients..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-4 py-2 text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                {isLoading ? (
                  <div className="p-6 text-center text-gray-400 text-sm">Loading conversations...</div>
                ) : filtered.length === 0 ? (
                  <div className="p-8 flex flex-col items-center text-center text-gray-400">
                    <Mail className="w-10 h-10 text-gray-200 mb-3" />
                    <p className="font-medium text-gray-500 text-sm">No messages yet</p>
                    <p className="text-xs mt-1">When clients message you, they'll appear here.</p>
                  </div>
                ) : (
                  filtered.map(conv => (
                    <button
                      key={conv.prof.userId}
                      onClick={() => setSelectedConv(conv)}
                      className={`w-full p-4 flex items-start gap-3 border-b border-gray-50 text-left transition hover:bg-gray-50 ${selectedConv?.prof.userId === conv.prof.userId ? 'bg-amber-50/60 border-l-2 border-l-amber-500' : ''}`}
                    >
                      <div className="relative flex-shrink-0">
                        {conv.prof.profilePicture ? (
                          <img src={conv.prof.profilePicture} className="w-10 h-10 rounded-full object-cover" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold text-sm">
                            {(conv.prof.name || conv.prof.email || '?').charAt(0).toUpperCase()}
                          </div>
                        )}
                        {conv.unreadCount > 0 && (
                          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                            {conv.unreadCount > 9 ? '9+' : conv.unreadCount}
                          </span>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className={`text-sm truncate pr-1 ${conv.unreadCount > 0 ? 'font-bold text-gray-900' : 'font-semibold text-gray-800'}`}>
                            {conv.prof.name || conv.prof.email}
                          </span>
                          {conv.lastMessage && (
                            <span className="text-[10px] text-gray-400 whitespace-nowrap flex-shrink-0">
                              {timeAgo(conv.lastMessage.sentAt)}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-400 capitalize mb-1">{conv.prof.role === 'user' ? 'Client' : conv.prof.role}</p>
                        <p className={`text-xs truncate ${conv.unreadCount > 0 ? 'text-gray-700 font-medium' : 'text-gray-400'}`}>
                          {conv.lastMessage ? (
                            <>
                              {conv.lastMessage.isMine && <span className="text-gray-400 font-normal">You: </span>}
                              {conv.lastMessage.content}
                            </>
                          ) : (
                            <span className="italic">No messages yet</span>
                          )}
                        </p>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Right: Active Chat */}
            {selectedConv ? (
              <div className="flex-1 flex flex-col min-w-0">
                {/* Chat Header */}
                <div className="px-6 py-4 border-b border-gray-100 bg-white flex items-center gap-4 flex-shrink-0">
                  {selectedConv.prof.profilePicture ? (
                    <img src={selectedConv.prof.profilePicture} className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold">
                      {(selectedConv.prof.name || selectedConv.prof.email || '?').charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <h2 className="font-bold text-gray-900">{selectedConv.prof.name || selectedConv.prof.email}</h2>
                    <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
                      <UserCircle2 className="w-3 h-3" />
                      <span className="capitalize">{selectedConv.prof.role === 'user' ? 'Client' : selectedConv.prof.role}</span>
                      <span>·</span>
                      <span>{selectedConv.prof.email}</span>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-3 bg-gray-50/40">
                  {messages.length === 0 && (
                    <div className="m-auto text-center text-gray-400">
                      <MessageSquare className="w-10 h-10 text-gray-200 mx-auto mb-2" />
                      <p className="text-sm">No messages in this conversation yet.</p>
                    </div>
                  )}
                  {messages.map(msg => {
                    const myId = Number(user?.id);
                    const isMine = msg.senderId === myId;
                    return (
                      <div key={msg.messageId} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm shadow-sm ${
                          isMine
                            ? 'bg-amber-500 text-white rounded-tr-sm'
                            : 'bg-white text-gray-800 border border-gray-200 rounded-tl-sm'
                        }`}>
                          <p className="leading-relaxed">{msg.content}</p>
                          <div className={`flex items-center justify-end gap-1.5 mt-1 text-[9px] ${isMine ? 'text-amber-100' : 'text-gray-400'}`}>
                            <Clock className="w-2.5 h-2.5" />
                            {new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            {isMine && <CheckCircle2 className={`w-3 h-3 ${msg.isRead ? 'text-white' : 'opacity-40'}`} />}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 bg-white border-t border-gray-100 flex-shrink-0">
                  <form onSubmit={handleSend} className="flex gap-2 relative">
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={e => setInputMessage(e.target.value)}
                      placeholder={`Reply to ${selectedConv.prof.name || 'client'}...`}
                      className="flex-1 bg-gray-50 border border-gray-200 rounded-full pl-5 pr-14 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                    />
                    <button
                      type="submit"
                      disabled={!inputMessage.trim()}
                      className="absolute right-1.5 top-1.5 bottom-1.5 aspect-square bg-amber-500 text-white rounded-full flex items-center justify-center hover:bg-amber-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-12 bg-gray-50/30">
                <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mb-4">
                  <Inbox className="w-10 h-10 text-amber-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Client Inbox</h3>
                <p className="text-gray-500 text-sm max-w-xs">
                  Select a conversation on the left to read and reply to messages from your clients.
                </p>
              </div>
            )}
          </div>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}
