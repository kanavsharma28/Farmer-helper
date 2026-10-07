import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  getConversationPartner,
  formatRoleName,
  deleteMessageForMe,
  deleteMessageForEveryone,
  clearConversationForUser,
  QUICK_CHAT_SUGGESTIONS
} from '../../data/chatData';

export default function ChatModal({
  isOpen,
  onClose,
  onBack,
  conversation,
  onSendMessage,
  currentUser,
  lang = 'en'
}) {
  const isEn = lang === 'en';
  const [inputText, setInputText] = useState('');
  const [activeMessageMenuId, setActiveMessageMenuId] = useState(null);
  const [isHeaderMenuOpen, setIsHeaderMenuOpen] = useState(false);
  const messagesEndRef = useRef(null);

  const myId = currentUser?.id;

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [isOpen, conversation?.messages?.length]);

  useEffect(() => {
    setActiveMessageMenuId(null);
    setIsHeaderMenuOpen(false);
  }, [conversation?.id, isOpen]);

  const handleDeleteForMe = (messageId) => {
    if (!conversation?.id || !messageId || !myId) return;
    deleteMessageForMe({
      conversationId: conversation.id,
      messageId,
      userId: myId
    });
    setActiveMessageMenuId(null);
  };

  const handleDeleteForEveryone = (messageId) => {
    if (!conversation?.id || !messageId || !myId) return;
    deleteMessageForEveryone({
      conversationId: conversation.id,
      messageId,
      userId: myId
    });
    setActiveMessageMenuId(null);
  };

  const handleClearChatForMe = () => {
    if (!conversation?.id || !myId) return;
    if (!window.confirm(isEn ? 'Clear all messages in this conversation for you?' : 'क्या आप अपने लिए सभी संदेश हटाना चाहते हैं?')) return;
    clearConversationForUser({
      conversationId: conversation.id,
      userId: myId
    });
    setIsHeaderMenuOpen(false);
  };

  const partner = useMemo(() => {
    return getConversationPartner(conversation, myId);
  }, [conversation, myId]);

  const suggestions = useMemo(() => {
    const roleKey = currentUser?.role || 'farmer';
    const list = QUICK_CHAT_SUGGESTIONS[roleKey];
    return Array.isArray(list) ? list : QUICK_CHAT_SUGGESTIONS.farmer;
  }, [currentUser?.role]);

  if (!isOpen) return null;

  // Safe Loading / Missing Conversation State
  if (!conversation) {
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity" onClick={onClose} />
        <div className="relative w-full max-w-md bg-surface-container-lowest rounded-3xl p-6 shadow-2xl border border-outline-variant/40 text-center space-y-4 z-10 animate-fadeIn">
          <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
            <span className="material-symbols-outlined text-2xl animate-spin">progress_activity</span>
          </div>
          <div>
            <h3 className="font-bold text-base text-on-surface">
              {isEn ? 'Loading conversation...' : 'बातचीत लोड हो रही है...'}
            </h3>
            <p className="text-xs text-on-surface-variant mt-1">
              {isEn ? 'Please wait while we connect your chat.' : 'कृपया प्रतीक्षा करें...'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-surface-container text-xs font-semibold text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer"
          >
            {isEn ? 'Close' : 'बंद करें'}
          </button>
        </div>
      </div>
    );
  }

  const handleSend = () => {
    if (!inputText.trim()) return;
    onSendMessage(conversation.id, inputText.trim());
    setInputText('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickSuggestion = (text) => {
    onSendMessage(conversation.id, text);
  };

  const handleBackClick = () => {
    if (onBack) {
      onBack();
    } else {
      onClose();
    }
  };

  const contextTitle = conversation.contextTitle || conversation.internshipTitle || conversation.resourceTitle || 'Direct In-App Chat';

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-0 sm:p-4 md:p-6 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Main Chatbox Window - Fullscreen on mobile, modal on desktop */}
      <div className="relative w-full h-full sm:h-[88vh] sm:max-w-2xl bg-surface-container-lowest sm:rounded-3xl shadow-2xl border border-outline-variant/40 overflow-hidden flex flex-col z-10 animate-fadeIn">
        
        {/* ── Top Header ── */}
        <div className="p-3.5 sm:p-5 bg-surface-container-low border-b border-outline-variant/30 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            {/* Back Button */}
            <button
              type="button"
              onClick={handleBackClick}
              className="w-9 h-9 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors shrink-0 cursor-pointer"
              title={isEn ? 'Back' : 'वापस'}
            >
              <span className="material-symbols-outlined text-xl">arrow_back</span>
            </button>

            {/* Avatar & Online Dot */}
            <div className="relative shrink-0">
              <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm shadow-xs">
                {partner.initials}
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-600 ring-2 ring-surface-container-low"></span>
            </div>

            {/* Name, Role & Status */}
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
                    <span className="truncate text-[11px] text-outline">{partner.farmName}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right Actions: Phone Call, Clear/Options, & Close */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {partner.phone && (
              <a
                href={`tel:${partner.phone}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-container hover:bg-surface-container-high border border-outline-variant/40 text-on-surface font-semibold text-xs transition-colors shadow-2xs"
                title={`Call ${partner.name}`}
              >
                <span className="material-symbols-outlined text-primary text-[16px]">call</span>
                <span className="hidden md:inline">+91 {partner.phone}</span>
              </a>
            )}

            {/* Conversation Options Menu */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsHeaderMenuOpen(!isHeaderMenuOpen)}
                className="w-9 h-9 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-outline hover:text-on-surface transition-colors cursor-pointer"
                title={isEn ? "Conversation options" : "बातचीत विकल्प"}
              >
                <span className="material-symbols-outlined text-xl">more_vert</span>
              </button>

              {isHeaderMenuOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-44 bg-surface-container-lowest rounded-2xl shadow-xl border border-outline-variant/40 py-1.5 text-xs z-30 animate-fadeIn">
                  <button
                    type="button"
                    onClick={handleClearChatForMe}
                    className="w-full px-3.5 py-2 text-left hover:bg-surface-container flex items-center gap-2.5 text-on-surface transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px] text-outline">cleaning_services</span>
                    <span>{isEn ? 'Clear messages' : 'संदेश साफ़ करें'}</span>
                  </button>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-outline hover:text-on-surface transition-colors cursor-pointer"
              title={isEn ? 'Close chat' : 'चैट बंद करें'}
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>
        </div>

        {/* ── Context Banner ── */}
        <div className="px-4 py-2.5 bg-primary/8 border-b border-outline-variant/20 flex items-center justify-between gap-3 text-xs text-on-surface-variant shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <span className="material-symbols-outlined text-primary text-[19px] shrink-0">
              {conversation.contextType === 'resource'
                ? 'handshake'
                : conversation.contextType === 'produce'
                ? 'agriculture'
                : conversation.contextType === 'internship'
                ? 'school'
                : 'chat'}
            </span>
            <div className="min-w-0">
              <span className="font-bold text-on-surface text-xs truncate block">
                {contextTitle}
              </span>
              <span className="text-[11px] text-primary font-medium truncate block">
                {isEn
                  ? `Direct chat with ${partner.name} (${partner.roleLabel})`
                  : `${partner.name} (${partner.roleLabel}) के साथ सीधी बातचीत`}
              </span>
            </div>
          </div>
          <span className="px-2.5 py-0.5 rounded-md bg-surface-container text-[10px] font-bold text-primary shrink-0 hidden sm:inline">
            Two-Way Chat
          </span>
        </div>

        {/* ── Chat Messages Scroll Area ── */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-surface-container-lowest">
          
          {/* Welcome Intro Notice */}
          <div className="p-3.5 rounded-2xl bg-surface-container-low border border-outline-variant/30 text-center space-y-1 my-1">
            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto text-sm font-bold">
              💬
            </div>
            <p className="text-xs font-bold text-on-surface">
              {isEn ? 'Direct In-App Conversation' : 'प्रत्यक्ष इन-ऐप बातचीत'}
            </p>
            <p className="text-[11px] text-on-surface-variant max-w-md mx-auto leading-relaxed">
              {isEn
                ? `You are connected with ${partner.name}. Messages are exchanged in real-time across roles.`
                : `आप ${partner.name} से जुड़े हैं। सभी संदेश तुरंत दोनों पक्षों को दिखाई देते हैं।`}
            </p>
          </div>

          {/* Messages list */}
          {(conversation.messages || [])
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
                  {/* Sender Role / Name Header */}
                  <div className={`flex items-center gap-1.5 text-[10px] font-semibold px-1 text-on-surface-variant ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <span className={isMe ? 'text-primary font-bold' : 'text-on-surface font-bold'}>
                      {senderDisplayName}
                    </span>
                    <span>({roleLabel})</span>
                  </div>

                  {/* Message Bubble + Options Menu */}
                  <div className={`flex items-center gap-1.5 max-w-[85%] sm:max-w-[75%] ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
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

                  {/* Timestamp & read status */}
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

        {/* ── Quick Suggestion Chips ── */}
        {suggestions.length > 0 && (
          <div className="px-4 py-2 bg-surface-container-low/70 border-t border-outline-variant/20 flex items-center gap-1.5 overflow-x-auto shrink-0 scrollbar-none">
            <span className="text-[10px] font-bold text-outline uppercase tracking-wider shrink-0 mr-1">
              {isEn ? 'Quick replies:' : 'त्वरित सुझाव:'}
            </span>
            {suggestions.slice(0, 3).map((sug, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleQuickSuggestion(sug)}
                className="px-2.5 py-1 rounded-full bg-surface-container hover:bg-primary/10 hover:text-primary text-[11px] text-on-surface-variant whitespace-nowrap border border-outline-variant/30 transition-colors cursor-pointer shrink-0"
              >
                {sug}
              </button>
            ))}
          </div>
        )}

        {/* ── Message Input Bar ── */}
        <div className="p-3 sm:p-4 bg-surface-container-low border-t border-outline-variant/30 shrink-0 pb-safe">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isEn ? "Type a message... (Press Enter to send)" : "संदेश लिखें... (भेजने के लिए Enter दबाएं)"}
              className="flex-1 px-4 py-2.5 sm:py-3 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 text-xs sm:text-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-2xs transition-all"
            />

            <button
              type="submit"
              disabled={!inputText.trim()}
              className="w-11 h-11 rounded-2xl bg-primary text-white flex items-center justify-center hover:bg-primary-container disabled:opacity-40 disabled:hover:bg-primary active:scale-95 transition-all shadow-xs cursor-pointer shrink-0"
              title={isEn ? 'Send message' : 'संदेश भेजें'}
            >
              <span className="material-symbols-outlined text-xl">send</span>
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
