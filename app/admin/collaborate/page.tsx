'use client';

import React, { useEffect, useState, useRef } from 'react';
import { ProtectedRoute } from '@/app/components/ProtectedRoute';
import AdminLayout from '@/app/components/AdminLayout';
import { useAuth } from '@/contexts/AuthContext';
import * as signalR from '@microsoft/signalr';

const API = "http://localhost:5090";
import { Search, Send, MapPin, CheckCircle2, MessageSquare, Users } from 'lucide-react';

interface Professional {
  userId: number;
  name: string;
  email: string;
  role: string;
  serviceType: string;
  profilePicture: string | null;
}

interface CollabContact {
  prof: Professional;
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

export default function CollaboratePage() {
  const { user, isAuthenticated } = useAuth();
  
  const [contacts, setContacts] = useState<CollabContact[]>([]);
  const [selectedContact, setSelectedContact] = useState<CollabContact | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [search, setSearch] = useState('');
  const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
  const [isLoadingContacts, setIsLoadingContacts] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load Contacts
  useEffect(() => {
    if (!isAuthenticated) return;
    fetch(`${API}/api/message/collaborators`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setContacts(data);
        } else {
          setContacts([]);
        }
        setIsLoadingContacts(false);
      })
      .catch(err => {
        console.error("Failed to fetch collaborators:", err);
        setContacts([]);
        setIsLoadingContacts(false);
      });
  }, [isAuthenticated]);

  // Connect to SignalR
  useEffect(() => {
    if (!isAuthenticated) return;
    
    const token = localStorage.getItem('token') || '';
    const newConn = new signalR.HubConnectionBuilder()
      .withUrl(`${API}/chathub`, { accessTokenFactory: () => token })
      .withAutomaticReconnect()
      .build();

    newConn.start().then(() => setConnection(newConn)).catch(console.error);

    return () => { newConn.stop(); };
  }, [isAuthenticated]);

  // Handle Incoming Messages
  useEffect(() => {
    if (!connection) return;

    connection.off('ReceiveMessage');
    connection.on('ReceiveMessage', (message: Message) => {
      // Update contacts list
      setContacts(prevContacts => {
        const myId = Number(user?.id);
        const newContacts = [...prevContacts];
        const otherId = message.senderId === myId ? message.receiverId : message.senderId;
        const idx = newContacts.findIndex(c => c.prof.userId === otherId);
        
        if (idx !== -1) {
          newContacts[idx] = {
            ...newContacts[idx],
            lastMessage: {
              content: message.content,
              sentAt: message.sentAt,
              isMine: message.senderId === myId
            },
            unreadCount: (message.senderId !== myId && selectedContact?.prof.userId !== otherId) 
                         ? newContacts[idx].unreadCount + 1 
                         : 0
          };
          const [moved] = newContacts.splice(idx, 1);
          newContacts.unshift(moved);
        } else if (message.senderId !== myId) {
          // If we receive a message from a client (not an admin), they won't be in the contacts list initially
          // (Our endpoint currently fetches admins. To support client chat, we'd need a broader endpoint).
          // For now, if we don't find them, we skip or could fetch them.
        }
        return newContacts;
      });

      // Update messages array if this message belongs to the active chat
      if (selectedContact) {
        const myId = Number(user?.id);
        if ((message.senderId === myId && message.receiverId === selectedContact.prof.userId) ||
            (message.senderId === selectedContact.prof.userId && message.receiverId === myId)) {
          
          setMessages(prev => {
            if (prev.find(m => m.messageId === message.messageId)) return prev;
            return [...prev, message];
          });
        }
      }
    });
  }, [connection, selectedContact, user?.id]);

  // Fetch History when selecting a contact
  useEffect(() => {
    if (!selectedContact) return;
    
    fetch(`${API}/api/message/history/${selectedContact.prof.userId}`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) setMessages(data);
      })
      .catch(console.error);
      
    // Clear unread count locally
    setContacts(prev => prev.map(c => c.prof.userId === selectedContact.prof.userId ? { ...c, unreadCount: 0 } : c));
  }, [selectedContact]);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !connection || !selectedContact) return;

    const currentMsg = inputMessage;
    setInputMessage('');

    try {
      await connection.invoke('SendMessage', selectedContact.prof.userId, currentMsg);
    } catch (e) {
      console.error(e);
      setInputMessage(currentMsg);
    }
  };

  const filteredContacts = contacts.filter(c => c.prof.name.toLowerCase().includes(search.toLowerCase()) || c.prof.serviceType?.toLowerCase().includes(search.toLowerCase()));

  return (
    <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
      <AdminLayout>
        <div className="p-8 flex h-[calc(100vh-64px)] overflow-hidden flex-col">
            <div className="flex items-center justify-between mb-6 flex-shrink-0">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Collaborate & Messages</h1>
                    <p className="text-gray-500 mt-1">Chat directly with clients and other professionals.</p>
                </div>
            </div>

            <div className="flex-1 bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden flex">
                
                {/* Left Sidebar: Contacts */}
                <div className="w-1/3 border-r border-gray-100 flex flex-col hidden md:flex">
                    <div className="p-4 border-b border-gray-100 bg-gray-50">
                        <div className="relative">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input 
                                type="text" 
                                placeholder="Search conversations..." 
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-4 py-2 text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                            />
                        </div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto">
                        {isLoadingContacts ? (
                            <div className="p-5 text-center text-gray-400 text-sm">Loading...</div>
                        ) : filteredContacts.length === 0 ? (
                            <div className="p-5 text-center text-gray-400 text-sm">No conversations found.</div>
                        ) : (
                            filteredContacts.map(contact => (
                                <button
                                    key={contact.prof.userId}
                                    onClick={() => setSelectedContact(contact)}
                                    className={`w-full p-4 flex items-start gap-3 border-b border-gray-50 transition text-left hover:bg-gray-50 ${selectedContact?.prof.userId === contact.prof.userId ? 'bg-amber-50/50' : ''}`}
                                >
                                    <div className="relative">
                                        {contact.prof.profilePicture ? (
                                            <img src={contact.prof.profilePicture} className="w-10 h-10 rounded-full object-cover bg-gray-100" />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600">
                                                {contact.prof.name.charAt(0)}
                                            </div>
                                        )}
                                        {contact.unreadCount > 0 && (
                                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white">
                                                {contact.unreadCount}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start mb-0.5">
                                            <h3 className="font-semibold text-gray-900 text-sm truncate pr-2">{contact.prof.name}</h3>
                                            {contact.lastMessage && (
                                                <span className="text-[10px] text-gray-400 whitespace-nowrap">
                                                    {new Date(contact.lastMessage.sentAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs text-amber-600 font-medium mb-1">{contact.prof.serviceType || 'Professional'}</p>
                                        <p className="text-xs text-gray-500 truncate">
                                            {contact.lastMessage ? (
                                                <>
                                                    {contact.lastMessage.isMine && <span className="text-gray-400">You: </span>}
                                                    {contact.lastMessage.content}
                                                </>
                                            ) : (
                                                <span className="italic text-gray-400">No messages yet</span>
                                            )}
                                        </p>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                </div>

                {/* Right Area: Chat Window */}
                {selectedContact ? (
                    <div className="flex-1 flex flex-col relative bg-gray-50/30">
                        {/* Chat Header */}
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white z-10">
                            <div className="flex items-center gap-3">
                                {selectedContact.prof.profilePicture ? (
                                    <img src={selectedContact.prof.profilePicture} className="w-10 h-10 rounded-full object-cover" />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600">
                                        {selectedContact.prof.name.charAt(0)}
                                    </div>
                                )}
                                <div>
                                    <h2 className="font-bold text-gray-900">{selectedContact.prof.name}</h2>
                                    <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                                        <span className="text-amber-600">{selectedContact.prof.serviceType || 'User'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
                            {messages.length === 0 && (
                                <div className="m-auto text-center text-gray-400">
                                    <MessageSquare className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                                    <p className="font-medium text-gray-500 mb-1">No previous conversation</p>
                                    <p className="text-sm">Send a message to start chatting with {selectedContact.prof.name}.</p>
                                </div>
                            )}
                            
                            {messages.map((msg, idx) => {
                                const myId = Number(user?.id);
                                const isMine = msg.senderId === myId;
                                return (
                                    <div key={msg.messageId} className={`flex ${isMine ? 'justify-end' : 'justify-start'} w-full`}>
                                        <div className={`max-w-[70%] px-4 py-2.5 rounded-2xl shadow-sm text-sm ${
                                            isMine ? 'bg-amber-500 text-white rounded-tr-sm' : 'bg-white text-gray-800 border border-gray-200 rounded-tl-sm'
                                        }`}>
                                            <p className="leading-relaxed">{msg.content}</p>
                                            <div className={`flex items-center justify-end gap-1.5 mt-1 text-[9px] ${isMine ? 'text-amber-100' : 'text-gray-400'}`}>
                                                {new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                {isMine && <CheckCircle2 className={`w-3 h-3 ${msg.isRead ? 'text-white' : 'opacity-50'}`} />}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Chat Input */}
                        <div className="p-4 bg-white border-t border-gray-100">
                            <form onSubmit={handleSendMessage} className="flex gap-2 relative">
                                <input
                                    type="text"
                                    value={inputMessage}
                                    onChange={e => setInputMessage(e.target.value)}
                                    placeholder="Type a message..."
                                    className="flex-1 bg-gray-50 border border-gray-200 rounded-full pl-5 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-sm"
                                />
                                <button
                                    type="submit"
                                    disabled={!inputMessage.trim()}
                                    className="absolute right-1.5 top-1.5 bottom-1.5 aspect-square bg-amber-500 text-white rounded-full flex items-center justify-center hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </form>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-12 bg-gray-50/50">
                        <MessageSquare className="w-16 h-16 text-amber-200 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">Select a Conversation</h2>
                        <p className="text-gray-500 max-w-sm">When clients or professionals message you, their real-time messages will appear here.</p>
                    </div>
                )}

            </div>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}
