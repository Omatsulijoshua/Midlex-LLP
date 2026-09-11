"use client";
import React, { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '@/context/AuthContext';
import { Paperclip, Send, FileText, Image as ImageIcon, X, Shield } from 'lucide-react';
import { apiFetch, getApiBaseUrl } from '@/lib/api';

interface Message {
  id: string;
  content: string;
  fileUrl?: string;
  senderId: string;
  sender: {
    id: string;
    name: string;
    role: string;
    litigationTeam?: string;
  };
  createdAt: string;
}

export default function TeamChatWidget({ teamName }: { teamName: string }) {
  const { user, token } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
  const socketRef = useRef<Socket | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!token || !teamName) return;

    socketRef.current = io(getApiBaseUrl(), {
      auth: { token },
      transports: ['polling'],
      reconnection: true,
      reconnectionAttempts: 10,
      timeout: 8000,
    });

    const socket = socketRef.current;
    setConnectionStatus('connecting');

    socket.on('connect', () => {
      setConnectionStatus('connected');
      socket.emit('joinTeamRoom', { teamName });
    });

    socket.on('disconnect', () => {
      setConnectionStatus('disconnected');
    });

    socket.on('teamMessage', (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.disconnect();
    };
  }, [teamName, token]);

  useEffect(() => {
    const fetchTeamHistory = async () => {
      if (!teamName) return;
      try {
        const history = await apiFetch<Message[]>(`/users/team-messages/${encodeURIComponent(teamName)}`);
        setMessages(Array.isArray(history) ? history : []);
      } catch (error) {
        console.error('Error fetching team chat history:', error);
      }
    };

    fetchTeamHistory();
  }, [teamName]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleFileUpload = async (file: File): Promise<string | null> => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch(`${getApiBaseUrl()}/documents/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      return data.url;
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload file to team chat');
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!newMessage.trim() && !selectedFile) || !socketRef.current || !user) return;

    let fileUrl: string | undefined = undefined;
    if (selectedFile) {
      const uploaded = await handleFileUpload(selectedFile);
      if (uploaded) {
        fileUrl = uploaded;
      }
      setSelectedFile(null);
    }

    if (!newMessage.trim() && !fileUrl) return;

    const payload = {
      teamName,
      senderId: user.id,
      content: newMessage.trim(),
      fileUrl,
    };

    socketRef.current.emit('sendTeamMessage', payload);
    setNewMessage('');
  };

  const isImage = (url: string) => /\.(jpg|jpeg|png|webp|gif)$/i.test(url);

  return (
    <div className="flex flex-col h-[650px] bg-white rounded-[40px] border border-gray-100 shadow-xl overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-100 bg-primary text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-secondary/20 border border-secondary/40 flex items-center justify-center text-secondary">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-lg">{teamName} Internal Group Chat</h3>
              <span className="px-2 py-0.5 bg-secondary/20 border border-secondary text-secondary rounded-full text-[10px] font-bold uppercase tracking-wider">
                LAWYERS & ADMINS
              </span>
            </div>
            <p className="text-xs text-white/70">Secure internal advocacy & litigation team room</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className={`w-2.5 h-2.5 rounded-full ${connectionStatus === 'connected' ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
          <span className="font-bold text-white/80 capitalize">{connectionStatus}</span>
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/50">
        {messages.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Shield className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="font-bold text-gray-600">Welcome to {teamName} Group Chat!</p>
            <p className="text-xs mt-1">Start collaborating with counsel in your litigation team.</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderId === user?.id;
            return (
              <div
                key={msg.id || Math.random().toString()}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-center gap-2 mb-1 px-1">
                  <span className="text-xs font-bold text-gray-700">
                    {msg.sender?.name || 'Legal Counsel'}
                  </span>
                  <span className="text-[10px] text-gray-400">
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <div
                  className={`max-w-[75%] p-4 rounded-3xl text-sm ${
                    isMe
                      ? 'bg-primary text-white rounded-tr-none shadow-md'
                      : 'bg-white text-gray-800 rounded-tl-none border border-gray-100 shadow-sm'
                  }`}
                >
                  {msg.content && <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>}

                  {msg.fileUrl && (
                    <div className="mt-3">
                      {isImage(msg.fileUrl) ? (
                        <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer">
                          <img
                            src={msg.fileUrl}
                            alt="Attachment"
                            className="max-h-48 rounded-xl object-cover border border-black/10 hover:opacity-95 transition-opacity"
                          />
                        </a>
                      ) : (
                        <a
                          href={msg.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex items-center gap-2 p-3 rounded-xl border text-xs font-bold ${
                            isMe ? 'bg-white/10 border-white/20 text-white' : 'bg-gray-50 border-gray-200 text-primary'
                          }`}
                        >
                          <FileText className="w-4 h-4" />
                          <span className="truncate">View File Attachment</span>
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
        <div ref={scrollRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSend} className="p-4 bg-white border-t border-gray-100 space-y-3">
        {selectedFile && (
          <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs font-bold text-amber-900">
            <Paperclip className="w-4 h-4 text-amber-600" />
            <span className="truncate flex-1">{selectedFile.name}</span>
            <button type="button" onClick={() => setSelectedFile(null)} className="text-amber-700 hover:text-red-500">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="flex items-center gap-3">
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => e.target.files?.[0] && setSelectedFile(e.target.files[0])}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-3 text-gray-400 hover:text-primary hover:bg-gray-100 rounded-2xl transition-all"
            title="Attach file"
          >
            <Paperclip className="w-5 h-5" />
          </button>

          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={`Message ${teamName} counsel...`}
            className="flex-1 px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/20"
          />

          <button
            type="submit"
            disabled={isUploading || (!newMessage.trim() && !selectedFile)}
            className="p-3.5 bg-secondary text-white rounded-2xl hover:bg-secondary/90 transition-all disabled:opacity-50 shadow-lg shadow-secondary/20"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
}
