'use client';

import React, { useEffect, useState, useRef } from 'react';
import * as signalR from '@microsoft/signalr';
import { MessageCircle, X, Send } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const API = "http://localhost:5090";

interface Message {
  messageId: number;
  senderId: number;
  receiverId: number;
  content: string;
  sentAt: string;
  isRead: boolean;
}

interface ChatWidgetProps {
  receiverId: number;
  receiverName: string;
  receiverAvatar?: string;
}

export function ChatWidget({ receiverId, receiverName, receiverAvatar }: ChatWidgetProps) {
  const { user, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  // Connect to SignalR and fetch history
  useEffect(() => {
    if (!isAuthenticated || !isOpen) return;

    // Fetch History
    fetch(`${API}/api/message/history/${receiverId}`, {
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

    // Setup SignalR
    const token = localStorage.getItem('token') || '';
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${API}/chathub`, {
        accessTokenFactory: () => token
      })
      .withAutomaticReconnect()
      .build();

    newConnection.start()
      .then(() => {
        console.log('SignalR Connected');
        newConnection.on('ReceiveMessage', (message: Message) => {
          const myId = Number(user?.id);
          // Only add to this conversation if it belongs here
          if ((message.senderId === myId && message.receiverId === receiverId) ||
              (message.senderId === receiverId && message.receiverId === myId)) {
            setMessages(prev => {
              if (prev.find(m => m.messageId === message.messageId)) return prev;
              return [...prev, message];
            });
          }
        });
      })
      .catch(e => console.log('Connection failed: ', e));

    setConnection(newConnection);

    return () => {
      newConnection.stop();
    };
  }, [isOpen, isAuthenticated, receiverId, user?.id]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !connection) return;

    const currentMsg = inputMessage;
    setInputMessage(''); // clear early for UX

    try {
      await connection.invoke('SendMessage', receiverId, currentMsg);
    } catch (e) {
      console.error(e);
      // rollback if failed
      setInputMessage(currentMsg);
    }
  };

  if (!isAuthenticated) return null; // Only logged in users can chat

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-5 py-3.5 bg-gray-900 text-white rounded-full shadow-xl hover:bg-gray-800 hover:scale-105 transition-all font-semibold animate-in fade-in slide-in-from-bottom-5"
        >
          <MessageCircle className="w-5 h-5" />
          Chat with {receiverName.split(' ')[0]}
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-80 h-[400px] bg-white rounded-2xl shadow-2xl flex flex-col border border-gray-100 overflow-hidden animate-in zoom-in-95 duration-200 origin-bottom-right">
          {/* Header */}
          <div className="bg-gray-900 px-4 py-3 flex items-center justify-between shadow-sm z-10">
            <div className="flex items-center gap-2">
              {receiverAvatar ? (
                <img src={receiverAvatar} alt={receiverName} className="w-8 h-8 rounded-full object-cover bg-gray-800" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-white text-xs font-bold">
                  {receiverName.charAt(0)}
                </div>
              )}
              <div>
                <h3 className="text-white font-semibold text-sm">{receiverName}</h3>
                <p className="text-gray-400 text-[10px]">Professional</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white transition p-1">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 bg-gray-50/50 p-4 overflow-y-auto flex flex-col gap-3">
            {messages.length === 0 && (
              <div className="m-auto text-center text-gray-400">
                <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-20" />
                <p className="text-sm">Say hello to {receiverName}!</p>
              </div>
            )}
            
            {messages.map((msg, idx) => {
              const myId = Number(user?.id);
              const isMine = msg.senderId === myId;
              const showAvatar = !isMine && (idx === 0 || messages[idx - 1].senderId !== msg.senderId);

              return (
                <div key={msg.messageId} className={`flex ${isMine ? 'justify-end' : 'justify-start'} gap-2 max-w-full`}>
                  {!isMine && (
                    <div className="w-6 flex-shrink-0">
                      {showAvatar && (
                        receiverAvatar ? (
                          <img src={receiverAvatar} className="w-6 h-6 rounded-full object-cover" />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-600">
                            {receiverName.charAt(0)}
                          </div>
                        )
                      )}
                    </div>
                  )}
                  <div className={`max-w-[75%] rounded-2xl px-3.5 py-2 text-sm shadow-sm ${
                    isMine ? 'bg-amber-500 text-white rounded-tr-sm' : 'bg-white text-gray-800 border border-gray-100 rounded-tl-sm'
                  }`}>
                    <p className="break-words leading-relaxed">{msg.content}</p>
                    <p className={`text-[9px] mt-1 text-right ${isMine ? 'text-amber-100' : 'text-gray-400'}`}>
                      {new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={sendMessage} className="p-3 bg-white border-t border-gray-100 flex items-center gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={e => setInputMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim()}
              className="p-2 bg-amber-500 text-white rounded-full hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
