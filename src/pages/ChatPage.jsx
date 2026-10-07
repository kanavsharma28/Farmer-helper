import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DashboardSidebar from '../components/dashboard/DashboardSidebar';
import DashboardMobileNav from '../components/dashboard/DashboardMobileNav';
import {
  getStoredConversations,
  saveStoredConversations,
  isUserInConversation,
  isConversationVisibleForUser,
  getConversationPartner,
  sendMessageToConversation,
  deleteMessageForMe,
  deleteMessageForEveryone,
  clearConversationForUser,
  removeConversationForUser,
  markConversationAsRead,
  getOrCreateConversation,
  getAllAvailableContacts,
  formatRoleName,
  QUICK_CHAT_SUGGESTIONS,
  CHAT_UPDATE_EVENT
} from '../data/chatData';
import logoImg from '../assets/logo.png';

export default function ChatPage() {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [lang, setLang] = useState('en');
  const isEn = lang === 'en';

  const [conversations, setConversations] = useState(() => getStoredConversations());
  const [searchQuery, setSearchQuery] = useState('');
  const [inputText, setInputText] = useState('');
  const [mobileView, setMobileView] = useState(conversationId ? 'chat' : 'list');
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  const [activeMessageMenuId, setActiveMessageMenuId] = useState(null);
  const [isHeaderMenuOpen, setIsHeaderMenuOpen] = useState(false);
  const messagesEndRef = useRef(null);

  const myId = user?.id;

  // Real-time synchronization with localStorage & other tabs/modals
  useEffect(() => {
    const handleSync = () => {
      setConversations(getStoredConversations());
    };
    window.addEventListener(CHAT_UPDATE_EVENT, handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener(CHAT_UPDATE_EVENT, handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  // Filter conversations where current user is a participant and not deleted for current user
  const userConversations = useMemo(() => {
    if (!myId) return [];
    return conversations.filter((c) => isConversationVisibleForUser(c, myId));
  }, [conversations, myId]);

  // Determine active conversation based on route parameter or default to first
  const activeConversation = useMemo(() => {
    if (!myId) return null;
    if (conversationId) {
      const match = conversations.find(
        (c) =>
          c.id === conversationId ||
          c.contextId === conversationId ||
          c.internshipId === conversationId ||
          c.resourceId === conversationId
      );
      if (match && isUserInConversation(match, myId)) {
        return match;
      }
    }
    return userConversations.length > 0 ? userConversations[0] : null;
  }, [conversationId, conversations, userConversations, myId]);

  // Mark conversation as read whenever active conversation changes
  useEffect(() => {
    if (activeConversation?.id && myId) {
      markConversationAsRead(activeConversation.id, myId);
    }
  }, [activeConversation?.id, myId, activeConversation?.messages?.length]);

  // Scroll messages to bottom on change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversation?.id, activeConversation?.messages?.length]);

  // Adjust mobile view when route param changes
  useEffect(() => {
    if (conversationId) {
      setMobileView('chat');
    }
  }, [conversationId]);

  // Partner info calculation (Universal, never throws)
  const partner = useMemo(() => {
    return getConversationPartner(activeConversation, myId);
  }, [activeConversation, myId]);

  // Role-specific suggestions
  const suggestions = useMemo(() => {
    const roleKey = user?.role || 'farmer';
    const list = QUICK_CHAT_SUGGESTIONS[roleKey];
    return Array.isArray(list) ? list : QUICK_CHAT_SUGGESTIONS.farmer;
  }, [user?.role]);

  // Filter conversation list by search query
  const filteredList = useMemo(() => {
    return userConversations.filter((c) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const p = getConversationPartner(c, myId);
      const title = c.contextTitle || c.internshipTitle || c.resourceTitle || '';
      return (
        p.name?.toLowerCase().includes(q) ||
        p.roleLabel?.toLowerCase().includes(q) ||
        title.toLowerCase().includes(q) ||
        c.lastMessage?.toLowerCase().includes(q)
      );
    });
  }, [userConversations, searchQuery, myId]);

  // Send message
  const handleSendMessage = (textToSend) => {
    const raw = typeof textToSend === 'string' ? textToSend : inputText;
    const text = (raw || '').trim();
    if (!text || !activeConversation || !user) return;

    const updated = sendMessageToConversation({
      conversations,
      conversationId: activeConversation.id,
      senderUser: user,
      text
    });

    setConversations(updated);
    setInputText('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSelectConv = (conv) => {
    navigate(`/chat/${conv.id}`);
    setMobileView('chat');
  };

  // Close open message and header popups on conversation change
  useEffect(() => {
    setActiveMessageMenuId(null);
    setIsHeaderMenuOpen(false);
  }, [activeConversation?.id]);

  const handleDeleteForMe = (messageId) => {
    if (!activeConversation?.id || !messageId || !myId) return;
    const updated = deleteMessageForMe({
      conversations,
      conversationId: activeConversation.id,
      messageId,
      userId: myId
    });
    setConversations(updated);
    setActiveMessageMenuId(null);
  };

  const handleDeleteForEveryone = (messageId) => {
    if (!activeConversation?.id || !messageId || !myId) return;
    const updated = deleteMessageForEveryone({
      conversations,
      conversationId: activeConversation.id,
      messageId,
      userId: myId
    });
    setConversations(updated);
    setActiveMessageMenuId(null);
  };

  const handleClearChatForMe = () => {
    if (!activeConversation?.id || !myId) return;
    if (!window.confirm(isEn ? 'Clear all messages in this conversation for you?' : 'क्या आप अपने लिए सभी संदेश हटाना चाहते हैं?')) return;
    const updated = clearConversationForUser({
      conversations,
      conversationId: activeConversation.id,
      userId: myId
    });
    setConversations(updated);
    setIsHeaderMenuOpen(false);
  };

  const handleRemoveConversationForMe = () => {
    if (!activeConversation?.id || !myId) return;
    if (!window.confirm(isEn ? 'Remove this conversation from your list?' : 'क्या आप इस बातचीत को अपनी सूची से हटाना चाहते हैं?')) return;
    const updated = removeConversationForUser({
      conversations,
      conversationId: activeConversation.id,
      userId: myId
    });
    setConversations(updated);
    setIsHeaderMenuOpen(false);
    navigate('/chat');
  };

  // Start new direct chat with contact
  const handleStartNewChatWithContact = (contact) => {
    setIsNewChatModalOpen(false);
    if (!user) return;

    const conv = getOrCreateConversation({
      currentUser: user,
      targetUser: contact,
      context: {
        type: 'direct',
        id: null,
        title: `Direct Chat: ${user.name} & ${contact.name}`
      },
      initialText: `Hello ${contact.name}! I would like to connect with you.`
    });

    if (conv) {
      setConversations(getStoredConversations());
      navigate(`/chat/${conv.id}`);
      setMobileView('chat');
    }
  };

  // Available contacts for "+ New Chat"
  const availableContacts = useMemo(() => {
    return getAllAvailableContacts(myId);
  }, [myId]);

  return (
    <div className="flex h-screen bg-background text-on-surface overflow-hidden">
      {/* Sidebar for Desktop */}
      <DashboardSidebar activeNav="messages" lang={lang} />

      {/* Main View Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
        
        {/* Top Header */}
        <header className="h-16 px-4 sm:px-6 bg-surface-container-lowest border-b border-outline-variant/30 flex items-center justify-between shrink-0 z-20">
          <div className="flex items-center gap-3">
            <Link to="/dashboard" className="lg:hidden flex items-center gap-2">
              <img src={logoImg} alt="Farmer Helper" className="h-8 w-auto object-contain rounded-md" />
            </Link>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-2xl">chat</span>
              <h1 className="font-headline-md text-base sm:text-lg font-bold text-on-surface">
                {isEn ? 'Messages & In-App Chat' : 'संदेश एवं इन-ऐप चैट'}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
              className="px-2.5 py-1 rounded-lg border border-outline-variant/60 text-xs font-semibold hover:bg-surface-container transition-colors cursor-pointer"
            >
              {lang === 'en' ? 'हिन्दी' : 'English'}
            </button>
            <button
              type="button"
              onClick={() => setIsNewChatModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-primary text-white hover:bg-primary-container text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">edit_square</span>
              <span>{isEn ? 'New Chat' : 'नई चैट'}</span>
            </button>
          </div>
        </header>

        {/* Content Pane: Split List and Chat Area */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Left Panel: Conversation List */}
          <div
            className={`w-full md:w-80 lg:w-96 bg-surface-container-lowest border-r border-outline-variant/30 flex flex-col shrink-0 ${
              mobileView === 'chat' ? 'hidden md:flex' : 'flex'
            }`}
          >
            {/* Search Box & New Chat Action */}
            <div className="p-3.5 border-b border-outline-variant/20 bg-surface-container-low/40 flex items-center gap-2">
              <div className="relative flex-1 flex items-center">
                <span className="material-symbols-outlined absolute left-3 text-outline text-[18px]">search</span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={isEn ? "Search messages & users..." : "संदेश व उपयोगकर्ता खोजें..."}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant/40 text-xs text-on-surface placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-primary shadow-2xs"
                />
              </div>
              <button
                type="button"
                onClick={() => setIsNewChatModalOpen(true)}
                title={isEn ? 'Start a direct chat' : 'सीधी चैट शुरू करें'}
                className="w-9 h-9 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
              >
                <span className="material-symbols-outlined text-[19px]">add</span>
              </button>
            </div>

            {/* Conversation Items List */}
            <div className="flex-1 overflow-y-auto divide-y divide-outline-variant/15">
              {filteredList.length === 0 ? (
                <div className="p-8 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center mx-auto text-outline">
                    <span className="material-symbols-outlined text-2xl">chat_bubble_outline</span>
                  </div>
                  <p className="text-xs text-on-surface-variant font-medium">
                    {isEn ? 'No conversations found.' : 'कोई बातचीत नहीं मिली।'}
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsNewChatModalOpen(true)}
                    className="inline-flex items-center gap-1 text-xs text-primary font-bold hover:underline cursor-pointer"
                  >
                    <span>{isEn ? '+ Start a conversation' : '+ नई बातचीत शुरू करें'}</span>
                  </button>
                </div>
              ) : (
                filteredList.map((conv) => {
                  const isSelected = activeConversation?.id === conv.id;
                  const p = getConversationPartner(conv, myId);
                  const unreadCount = conv.unreadCounts?.[myId] || 0;
                  const contextTitle = conv.contextTitle || conv.internshipTitle || conv.resourceTitle || p.roleLabel;

                  return (
                    <div
                      key={conv.id}
                      onClick={() => handleSelectConv(conv)}
                      className={`p-3.5 sm:p-4 flex items-center gap-3 cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-primary/10 border-l-4 border-primary'
                          : 'hover:bg-surface-container-low'
                      }`}
                    >
                      <div className="relative shrink-0">
                        <div className="w-11 h-11 rounded-full bg-primary/15 text-primary font-bold text-xs flex items-center justify-center shadow-2xs">
                          {p.initials}
                        </div>
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-600 ring-2 ring-white"></span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <h4 className="font-bold text-xs sm:text-sm text-on-surface truncate">{p.name}</h4>
                          <span className="text-[10px] text-outline shrink-0">{conv.lastMessageTime || conv.updatedAt}</span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="px-1.5 py-0.2 rounded-md text-[10px] font-semibold bg-surface-container text-on-surface-variant shrink-0">
                            {p.roleLabel}
                          </span>
                          <span className="text-[11px] text-primary font-medium truncate">
                            {contextTitle}
                          </span>
                        </div>
                        <p className="text-xs text-on-surface-variant line-clamp-1 mt-0.5">
                          {conv.lastMessage || (isEn ? 'Click to open conversation' : 'बातचीत देखने के लिए क्लिक करें')}
                        </p>
                      </div>

                      {unreadCount > 0 && (
                        <span className="w-5 h-5 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                          {unreadCount}
                        </span>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Panel: Active Chat Messages Area */}
          <div
            className={`flex-1 bg-surface-container-lowest flex flex-col min-w-0 overflow-hidden ${
              mobileView === 'list' ? 'hidden md:flex' : 'flex'
            }`}
          >
            {activeConversation ? (
              <>
                {/* Active Chat Top Header */}
                <div className="p-3 sm:p-4 bg-surface-container-low border-b border-outline-variant/30 flex items-center justify-between gap-3 shrink-0">
                  <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                    <button
                      type="button"
                      onClick={() => setMobileView('list')}
                      className="md:hidden w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant shrink-0 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-lg">arrow_back</span>
                    </button>

                    <div className="relative shrink-0">
                      <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs shadow-xs">
                        {partner.initials}
                      </div>
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-600 ring-2 ring-surface-container-low"></span>
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-sm sm:text-base text-on-surface truncate">
                          {partner.name}
                        </h3>
                        <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-primary/10 text-primary shrink-0">
                          {partner.roleLabel}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-on-surface-variant">
                        <span className="flex items-center gap-1 text-emerald-800 font-semibold text-[11px]">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-700 animate-pulse"></span>
                          <span>{isEn ? 'Online' : 'सक्रिय'}</span>
                        </span>
                        {partner.farmName && (
                          <>
                            <span>•</span>
                            <span className="truncate text-[11px] text-outline">
                              {partner.farmName}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {partner.phone && (
                      <a
                        href={`tel:${partner.phone}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-container hover:bg-surface-container-high border border-outline-variant/40 text-on-surface font-semibold text-xs transition-colors shrink-0 shadow-2xs"
                        title={`Call ${partner.name}`}
                      >
                        <span className="material-symbols-outlined text-primary text-[16px]">call</span>
                        <span className="hidden sm:inline">+91 {partner.phone}</span>
                      </a>
                    )}

                    {/* Conversation Options Menu (Clear / Delete) */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setIsHeaderMenuOpen(!isHeaderMenuOpen)}
                        className="w-9 h-9 rounded-xl bg-surface-container hover:bg-surface-container-high border border-outline-variant/40 flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer shadow-2xs"
                        title={isEn ? "Conversation options" : "बातचीत विकल्प"}
                      >
                        <span className="material-symbols-outlined text-[19px]">more_vert</span>
                      </button>

                      {isHeaderMenuOpen && (
                        <div className="absolute right-0 top-full mt-1.5 w-48 bg-surface-container-lowest rounded-2xl shadow-xl border border-outline-variant/40 py-1.5 text-xs z-30 animate-fadeIn">
                          <button
                            type="button"
                            onClick={handleClearChatForMe}
                            className="w-full px-3.5 py-2 text-left hover:bg-surface-container flex items-center gap-2.5 text-on-surface transition-colors cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[18px] text-outline">cleaning_services</span>
                            <span>{isEn ? 'Clear messages' : 'संदेश साफ़ करें'}</span>
                          </button>
                          <button
                            type="button"
                            onClick={handleRemoveConversationForMe}
                            className="w-full px-3.5 py-2 text-left hover:bg-error/10 flex items-center gap-2.5 text-error font-medium transition-colors cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                            <span>{isEn ? 'Delete conversation' : 'बातचीत हटाएं'}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Context Sub-banner */}
                <div className="px-4 py-2 bg-primary/8 border-b border-outline-variant/20 flex items-center justify-between gap-3 text-xs text-on-surface-variant shrink-0">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="material-symbols-outlined text-primary text-[18px] shrink-0">
                      {activeConversation.contextType === 'resource'
                        ? 'handshake'
                        : activeConversation.contextType === 'produce'
                        ? 'agriculture'
                        : activeConversation.contextType === 'internship'
                        ? 'school'
                        : 'chat'}
                    </span>
                    <div className="min-w-0">
                      <span className="font-bold text-on-surface text-xs truncate block">
                        {activeConversation.contextTitle || activeConversation.internshipTitle || activeConversation.resourceTitle || (isEn ? 'Direct Conversation' : 'प्रत्यक्ष बातचीत')}
                      </span>
                      <span className="text-[11px] text-primary font-medium truncate block">
                        {isEn
                          ? `Chatting with ${partner.name} (${partner.roleLabel})`
                          : `${partner.name} (${partner.roleLabel}) के साथ बातचीत`}
                      </span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-surface-container text-[10px] font-bold text-primary shrink-0 hidden sm:inline">
                    Two-Way Secure Chat
                  </span>
                </div>

                {/* Messages Scroll Area */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 bg-surface-container-lowest">
                  {(activeConversation.messages || [])
                    .filter((msg) => !(msg.deletedFor || []).includes(myId))
                    .map((msg) => {
                      const isMe = msg.senderId === myId;
                      const isDeleted = msg.isDeletedForEveryone;
                      const messageText = msg.message || msg.text || '';
                      const senderDisplayName = isMe ? (isEn ? 'You' : 'आप') : (msg.senderName || partner.name);
                      const roleLabel = formatRoleName(msg.senderRole, isEn);

                      return (
                        <div
                          key={msg.id}
                          className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} space-y-1 relative group`}
                        >
                          <div className={`flex items-center gap-1.5 text-[10px] font-semibold px-1 text-on-surface-variant ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <span className={isMe ? 'text-primary font-bold' : 'text-on-surface font-bold'}>
                              {senderDisplayName}
                            </span>
                            <span>({roleLabel})</span>
                          </div>

                          <div className={`flex items-center gap-1.5 max-w-[85%] sm:max-w-[75%] ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                            {/* Message Bubble */}
                            <div
                              className={`rounded-2xl p-3 sm:p-3.5 text-xs sm:text-sm leading-relaxed shadow-2xs ${
                                isDeleted
                                  ? 'bg-surface-container-low text-on-surface-variant border border-outline-variant/30 rounded-bl-xs'
                                  : isMe
                                  ? 'bg-primary text-white rounded-br-xs'
                                  : 'bg-surface-container-low text-on-surface border border-outline-variant/30 rounded-bl-xs'
                              }`}
                            >
                              {msg.moderated ? (
                                <div className="flex items-center gap-1.5 opacity-90 not-italic text-amber-700">
                                  <span className="material-symbols-outlined text-[16px]">gavel</span>
                                  <span className="italic font-medium">
                                    {isEn ? 'This message was removed by an administrator.' : 'यह संदेश व्यवस्थापक द्वारा हटा दिया गया था।'}
                                  </span>
                                </div>
                              ) : isDeleted ? (
                                <div className="flex items-center gap-1.5 opacity-80 not-italic">
                                  <span className="material-symbols-outlined text-[16px] text-outline">block</span>
                                  <span className="italic text-on-surface-variant">
                                    {isEn ? 'This message was deleted' : 'यह संदेश हटा दिया गया था'}
                                  </span>
                                </div>
                              ) : (
                                <p className="whitespace-pre-wrap">{messageText}</p>
                              )}
                            </div>

                            {/* WhatsApp-Style Options Menu Button (⋮) */}
                            <div className="relative shrink-0">
                              <button
                                type="button"
                                onClick={() => setActiveMessageMenuId(activeMessageMenuId === msg.id ? null : msg.id)}
                                className="w-7 h-7 rounded-full bg-surface-container/60 hover:bg-surface-container text-outline hover:text-on-surface flex items-center justify-center transition-colors cursor-pointer shadow-2xs opacity-80 hover:opacity-100"
                                title={isEn ? "Message options" : "संदेश विकल्प"}
                              >
                                <span className="material-symbols-outlined text-[16px]">more_vert</span>
                              </button>

                              {activeMessageMenuId === msg.id && (
                                <div
                                  className={`absolute z-30 bottom-full ${isMe ? 'right-0' : 'left-0'} mb-1.5 w-44 bg-surface-container-lowest rounded-xl shadow-xl border border-outline-variant/40 py-1 text-xs animate-fadeIn`}
                                >
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteForMe(msg.id)}
                                    className="w-full px-3 py-2 text-left hover:bg-surface-container flex items-center gap-2 text-on-surface transition-colors cursor-pointer"
                                  >
                                    <span className="material-symbols-outlined text-sm text-outline">delete</span>
                                    <span>{isEn ? 'Delete for me' : 'मेरे लिए हटाएं'}</span>
                                  </button>

                                  {isMe && !isDeleted && (
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteForEveryone(msg.id)}
                                      className="w-full px-3 py-2 text-left hover:bg-error/10 flex items-center gap-2 text-error font-medium transition-colors cursor-pointer"
                                    >
                                      <span className="material-symbols-outlined text-sm">delete_forever</span>
                                      <span>{isEn ? 'Delete for everyone' : 'सभी के लिए हटाएं'}</span>
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className={`flex items-center gap-1.5 text-[10px] px-1 text-outline ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <span>{msg.timestamp || 'Just now'}</span>
                            {isMe && !isDeleted && (
                              <span className="material-symbols-outlined text-[13px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                                done_all
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Quick suggestions */}
                {suggestions.length > 0 && (
                  <div className="px-4 py-2 bg-surface-container-low/70 border-t border-outline-variant/20 flex items-center gap-1.5 overflow-x-auto shrink-0 scrollbar-none">
                    <span className="text-[10px] font-bold text-outline uppercase tracking-wider shrink-0 mr-1">
                      {isEn ? 'Quick replies:' : 'त्वरित सुझाव:'}
                    </span>
                    {suggestions.slice(0, 3).map((sug, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleSendMessage(sug)}
                        className="px-2.5 py-1 rounded-full bg-surface-container hover:bg-primary/10 hover:text-primary text-[11px] text-on-surface-variant whitespace-nowrap border border-outline-variant/30 transition-colors cursor-pointer shrink-0"
                      >
                        {sug}
                      </button>
                    ))}
                  </div>
                )}

                {/* Input Bar */}
                <div className="p-3 sm:p-4 bg-surface-container-low border-t border-outline-variant/30 shrink-0">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSendMessage();
                    }}
                    className="flex items-center gap-2"
                  >
                    <input
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder={isEn ? "Type a message... (Press Enter to send)" : "संदेश लिखें... (Enter दबाएं)"}
                      className="flex-1 px-4 py-2.5 sm:py-3 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 text-xs sm:text-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-2xs transition-all"
                    />
                    <button
                      type="submit"
                      disabled={!inputText.trim()}
                      className="w-11 h-11 rounded-2xl bg-primary text-white flex items-center justify-center hover:bg-primary-container disabled:opacity-40 disabled:hover:bg-primary active:scale-95 transition-all shadow-xs cursor-pointer shrink-0"
                      title={isEn ? "Send message" : "संदेश भेजें"}
                    >
                      <span className="material-symbols-outlined text-xl">send</span>
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center p-8 text-center bg-surface-container-lowest">
                <div className="max-w-sm space-y-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
                    <span className="material-symbols-outlined text-3xl">chat</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-on-surface">
                      {isEn ? 'Start or Select a Conversation' : 'बातचीत शुरू करें या चुनें'}
                    </h3>
                    <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                      {isEn
                        ? 'Select an existing conversation from the list or start a new direct chat with Farmers, Students, Buyers, or Resource Providers.'
                        : 'सूची से बातचीत चुनें या किसान, छात्र, खरीदार या साधन प्रदाता से नई सीधी चैट शुरू करें।'}
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsNewChatModalOpen(true)}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-semibold text-xs sm:text-sm hover:bg-primary-container transition-all shadow-xs cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-base">add_comment</span>
                      <span>{isEn ? 'Start New Chat' : 'नई चैट शुरू करें'}</span>
                    </button>
                    <Link
                      to="/dashboard"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-semibold text-xs sm:text-sm transition-colors"
                    >
                      <span>{isEn ? 'Go to Dashboard' : 'डैशबोर्ड जाएं'}</span>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Bottom Navigation */}
        <DashboardMobileNav lang={lang} />
      </div>

      {/* ── Start New Chat Modal ── */}
      {isNewChatModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="relative w-full max-w-md bg-surface-container-lowest rounded-3xl shadow-2xl border border-outline-variant/40 overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-4 sm:p-5 border-b border-outline-variant/30 flex items-center justify-between bg-surface-container-low">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-xl">person_add</span>
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-on-surface">
                    {isEn ? 'Start a New Chat' : 'नई चैट शुरू करें'}
                  </h3>
                  <p className="text-[11px] text-on-surface-variant">
                    {isEn ? 'Select a user to begin direct messaging' : 'सीधी बातचीत के लिए उपयोगकर्ता चुनें'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsNewChatModalOpen(false)}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-outline hover:text-on-surface transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <div className="p-3 divide-y divide-outline-variant/10 overflow-y-auto flex-1">
              {availableContacts.map((contact) => (
                <div
                  key={contact.id}
                  onClick={() => handleStartNewChatWithContact(contact)}
                  className="p-3 rounded-2xl hover:bg-surface-container-low flex items-center justify-between gap-3 cursor-pointer transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-primary/15 text-primary flex items-center justify-center font-bold text-xs shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                      {getInitials(contact.name)}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-xs sm:text-sm text-on-surface truncate group-hover:text-primary transition-colors">
                        {contact.name}
                      </h4>
                      <p className="text-[11px] text-outline truncate">
                        {contact.farmName || contact.location || contact.phone}
                      </p>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-primary/10 text-primary shrink-0">
                    {formatRoleName(contact.role, isEn)}
                  </span>
                </div>
              ))}
            </div>

            <div className="p-3 bg-surface-container-low border-t border-outline-variant/30 flex justify-end">
              <button
                type="button"
                onClick={() => setIsNewChatModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-xs font-semibold text-on-surface transition-colors cursor-pointer"
              >
                {isEn ? 'Cancel' : 'रद्द करें'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
