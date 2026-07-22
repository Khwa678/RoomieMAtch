import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { chatAPI } from '../services/api';
import { MessageSquare, Send, Sparkles, User, ShieldCheck, ArrowLeft, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ChatPage() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeMatchId, setActiveMatchId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loadingConvs, setLoadingConvs] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (activeMatchId) {
      fetchMessages(activeMatchId);
    }
  }, [activeMatchId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchConversations = async () => {
    setLoadingConvs(true);
    try {
      const data = await chatAPI.getConversations();
      setConversations(data || []);
      if (data && data.length > 0 && !activeMatchId) {
        setActiveMatchId(data[0].matchId);
      }
    } catch (err) {
      console.warn('[Chat] Failed to fetch conversations:', err.message);
    } finally {
      setLoadingConvs(false);
    }
  };

  const fetchMessages = async (matchId) => {
    setLoadingMsgs(true);
    try {
      const data = await chatAPI.getMessages(matchId);
      setMessages(data || []);
    } catch (err) {
      console.warn('[Chat] Failed to fetch messages:', err.message);
    } finally {
      setLoadingMsgs(false);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeMatchId) return;

    const content = newMessage.trim();
    setNewMessage('');

    try {
      const sentMsg = await chatAPI.sendMessage(activeMatchId, content);
      setMessages(prev => [...prev, sentMsg]);
      
      // Update last message in conversations list
      setConversations(prev =>
        prev.map(c =>
          c.matchId === activeMatchId
            ? { ...c, lastMessage: content, lastMessageTime: new Date() }
            : c
        )
      );
    } catch (err) {
      alert(err.message || 'Failed to send message');
    }
  };

  const activeConv = conversations.find(c => c.matchId === activeMatchId);
  const activeMatchedUser = activeConv?.matchedProfile?.userId || {};

  return (
    <div className="min-h-[85vh] py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between glass-panel p-5 rounded-2xl border border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center space-x-2">
            <MessageSquare className="w-6 h-6 text-brand-400" />
            <span>Roomie Messages</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">Chat directly with your connected, compatible roommates.</p>
        </div>

        <Link
          to="/dashboard"
          className="text-xs text-brand-400 font-semibold hover:underline flex items-center space-x-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Dashboard</span>
        </Link>
      </div>

      {/* Main Chat Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        {/* Conversations Sidebar */}
        <div className="glass-panel rounded-2xl border border-slate-800 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-800 font-bold text-sm text-slate-200 flex items-center justify-between">
            <span>Connected Roommates</span>
            <button onClick={fetchConversations} className="text-slate-400 hover:text-white">
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-850">
            {loadingConvs ? (
              <div className="p-6 text-center text-xs text-slate-500">Loading chats...</div>
            ) : conversations.length === 0 ? (
              <div className="p-6 text-center space-y-2">
                <p className="text-xs text-slate-400">No connected chats yet.</p>
                <p className="text-[11px] text-slate-500">Connect with matches from your search results to start messaging!</p>
              </div>
            ) : (
              conversations.map((conv) => {
                const u = conv.matchedProfile?.userId || {};
                const isActive = conv.matchId === activeMatchId;

                return (
                  <button
                    key={conv.matchId}
                    onClick={() => setActiveMatchId(conv.matchId)}
                    className={`w-full p-4 text-left flex items-start space-x-3 transition-colors ${
                      isActive ? 'bg-brand-500/15 border-l-4 border-brand-500' : 'hover:bg-slate-900/60'
                    }`}
                  >
                    <img
                      src={u.profilePhotoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400'}
                      alt={u.name}
                      className="w-11 h-11 rounded-xl object-cover border border-slate-700"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white truncate">{u.name || 'Roommate'}</span>
                        <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-brand-500/20 text-brand-400">
                          {conv.compatibilityScore}% Match
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 truncate mt-1">{conv.lastMessage}</p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Chat Window */}
        <div className="lg:col-span-2 glass-panel rounded-2xl border border-slate-800 flex flex-col overflow-hidden">
          {activeConv ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img
                    src={activeMatchedUser.profilePhotoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400'}
                    alt={activeMatchedUser.name}
                    className="w-10 h-10 rounded-xl object-cover border border-brand-500/30"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center space-x-1.5">
                      <span>{activeMatchedUser.name}</span>
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      {activeConv.matchedProfile?.occupationType} • {activeConv.matchedProfile?.destinationCity}
                    </p>
                  </div>
                </div>

                <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Verified Contact
                </span>
              </div>

              {/* Message Bubbles Body */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-950/40">
                {loadingMsgs ? (
                  <div className="text-center text-xs text-slate-500 py-8">Loading message history...</div>
                ) : messages.length === 0 ? (
                  <div className="text-center py-12 space-y-3">
                    <div className="w-12 h-12 rounded-full bg-brand-500/20 text-brand-400 flex items-center justify-center mx-auto">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <p className="text-xs font-semibold text-slate-300">You matched with {activeMatchedUser.name}!</p>
                    <p className="text-[11px] text-slate-400">Break the ice and introduce yourself to coordinate lease details.</p>
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isMe = msg.senderId?._id === user?._id || msg.senderId === user?._id;

                    return (
                      <div
                        key={msg._id}
                        className={`flex items-end space-x-2 ${isMe ? 'justify-end' : 'justify-start'}`}
                      >
                        {!isMe && (
                          <img
                            src={msg.senderId?.profilePhotoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400'}
                            alt="Sender"
                            className="w-7 h-7 rounded-lg object-cover mb-1"
                          />
                        )}
                        <div
                          className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-xs leading-relaxed ${
                            isMe
                              ? 'bg-gradient-to-r from-brand-600 to-accent-500 text-white rounded-br-none shadow-md'
                              : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none'
                          }`}
                        >
                          <p>{msg.content}</p>
                          <span className={`block text-[9px] mt-1 text-right ${isMe ? 'text-brand-200' : 'text-slate-500'}`}>
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input Form */}
              <form onSubmit={handleSend} className="p-3 border-t border-slate-800 bg-slate-900/60 flex items-center space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={`Message ${activeMatchedUser.name || 'roommate'}...`}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="p-2.5 rounded-xl bg-brand-600 text-white hover:bg-brand-500 disabled:opacity-40 transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-xs text-slate-500">
              Select a connected roommate to start chatting
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
