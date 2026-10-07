import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminConfirmModal from '../../components/admin/AdminConfirmModal';
import {
  getAdminConversations,
  getConversationMessages,
  moderateMessage,
} from '../../services/adminService';

export default function AdminMessagesPage() {
  const [lang, setLang] = useState('en');
  const [conversations, setConversations] = useState([]);
  const [total, setTotal] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Active inspected conversation
  const [activeChat, setActiveChat] = useState(null);
  const [activeMessages, setActiveMessages] = useState([]);
  const [moderateModal, setModerateModal] = useState({ isOpen: false, message: null, reason: '' });
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null,
    isDestructive: false,
  });

  const isEn = lang === 'en';

  const loadConversations = useCallback(() => {
    setIsLoading(true);
    setError(null);
    try {
      const res = getAdminConversations({
        search: searchQuery,
        role: selectedRole,
        page: 1,
        limit: 50,
      });
      setConversations(res.data);
      setTotal(res.total);
      if (res.data.length > 0 && !activeChat) {
        handleInspectConversation(res.data[0]);
      }
    } catch (err) {
      console.error('Error fetching chat conversations:', err);
      setError(err.message || 'Unable to load conversations.');
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, selectedRole]);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  const handleInspectConversation = (conv) => {
    try {
      // Accessing conversation automatically generates Audit Log entry!
      const data = getConversationMessages(conv.id);
      setActiveChat(data.conversation);
      setActiveMessages(data.messages);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleOpenModerate = (msg) => {
    setModerateModal({
      isOpen: true,
      message: msg,
      reason: 'Inappropriate or abusive language in accordance with moderation policy.',
    });
  };

  const handleConfirmModerate = (e) => {
    e.preventDefault();
    if (!moderateModal.message || !activeChat) return;

    try {
      moderateMessage({
        conversationId: activeChat.id,
        messageId: moderateModal.message.id,
        reason: moderateModal.reason,
      });

      // Update local view
      setActiveMessages((prev) =>
        prev.map((m) =>
          m.id === moderateModal.message.id
            ? {
                ...m,
                moderated: true,
                moderationReason: moderateModal.reason,
              }
            : m
        )
      );

      setModerateModal({ isOpen: false, message: null, reason: '' });
      loadConversations();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <AdminLayout
      title="Messages & Chat Moderation"
      subtitle="Supervise platform conversations for trust, safety, and compliance with strict audit trails."
      lang={lang}
      setLang={setLang}
    >
      {/* Notice Banner */}
      <div className="p-3.5 bg-primary/5 border border-primary/20 rounded-2xl flex items-center justify-between text-xs">
        <div className="flex items-center gap-2.5">
          <span className="material-symbols-outlined text-primary text-lg">shield</span>
          <span className="text-on-surface">
            <strong>Audited Moderation Mode:</strong> All administrator views and moderation actions are logged in the immutable Audit Trail.
          </span>
        </div>
      </div>

      {/* Main Split Chat View matching ChatPage */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 shadow-xs overflow-hidden flex flex-col md:flex-row h-[700px]">
        {/* Left Panel: Conversation List */}
        <div className="w-full md:w-80 lg:w-96 border-r border-outline-variant/30 flex flex-col shrink-0 bg-surface-container-lowest">
          {/* Search & Filter Header */}
          <div className="p-3.5 border-b border-outline-variant/20 bg-surface-container-low/40 space-y-2.5">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search conversations..."
                className="w-full pl-9 pr-3 py-1.5 bg-white rounded-full border border-outline-variant/60 text-xs text-on-surface focus:outline-none focus:border-primary shadow-2xs placeholder:text-on-surface-variant/60"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto hide-scrollbar">
              {['all', 'farmer', 'student', 'buyer', 'provider'].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setSelectedRole(r)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-bold capitalize transition-all shrink-0 cursor-pointer ${
                    selectedRole === r
                      ? 'bg-primary text-white shadow-2xs'
                      : 'bg-white border border-outline-variant/50 text-on-surface-variant hover:bg-surface-container'
                  }`}
                >
                  {r === 'all' ? 'All Roles' : r}
                </button>
              ))}
            </div>
          </div>

          {/* Conversations Scroll List */}
          <div className="flex-1 overflow-y-auto divide-y divide-outline-variant/15">
            {isLoading ? (
              <div className="py-16 text-center space-y-2">
                <span className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin inline-block" />
                <p className="text-xs text-on-surface-variant">Loading chats...</p>
              </div>
            ) : conversations.length === 0 ? (
              <div className="p-8 text-center space-y-2">
                <span className="material-symbols-outlined text-3xl text-outline/40">chat</span>
                <p className="text-xs text-on-surface-variant font-medium">No conversations found.</p>
              </div>
            ) : (
              conversations.map((c) => {
                const isSelected = activeChat?.id === c.id;
                const p1 = c.farmerName || c.initiatorName || 'User 1';
                const p2 = c.studentName || c.participantName || 'User 2';
                const topic = c.topic || c.contextTitle || c.internshipTitle || 'Direct Consultation';

                return (
                  <div
                    key={c.id}
                    onClick={() => handleInspectConversation(c)}
                    className={`p-3.5 flex items-start gap-3 cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-primary/10 border-l-4 border-primary'
                        : 'hover:bg-surface-container-low/50'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0 border border-primary/20">
                      {p1.slice(0, 1)}
                      {p2.slice(0, 1)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-xs text-on-surface truncate">
                          {p1} ↔ {p2}
                        </h4>
                        <span className="text-[10px] text-outline font-mono">
                          {c.lastMessageTime || 'Recent'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-surface-container text-on-surface-variant">
                          {c.contextType || 'Chat'}
                        </span>
                        <span className="text-[11px] text-primary font-medium truncate">
                          {topic}
                        </span>
                      </div>
                      <p className="text-xs text-on-surface-variant truncate mt-0.5">
                        {c.lastMessage || 'Click to inspect conversation messages'}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Panel: Messages Viewport */}
        <div className="flex-1 flex flex-col min-w-0 bg-surface-container-lowest overflow-hidden">
          {activeChat ? (
            <>
              {/* Active Header */}
              <div className="p-3.5 sm:p-4 bg-surface-container-low/60 border-b border-outline-variant/30 flex items-center justify-between gap-3 shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs shadow-xs">
                    {(activeChat.farmerName || 'U1')[0]}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-display font-bold text-sm text-on-surface truncate">
                      {activeChat.farmerName || 'Participant 1'} ↔ {activeChat.studentName || activeChat.participantName || 'Participant 2'}
                    </h3>
                    <p className="text-xs text-on-surface-variant flex items-center gap-1.5">
                      <span className="text-primary font-semibold">
                        Context: {activeChat.contextTitle || activeChat.topic || 'Agricultural Exchange'}
                      </span>
                      <span>•</span>
                      <span className="font-mono text-[11px] text-outline">ID: {activeChat.id}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
                    {activeMessages.length} Messages
                  </span>
                </div>
              </div>

              {/* Messages Feed */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3.5 bg-surface-container-low/20">
                {activeMessages.length === 0 ? (
                  <div className="py-20 text-center space-y-2">
                    <span className="material-symbols-outlined text-4xl text-outline/40">forum</span>
                    <p className="text-xs text-on-surface-variant">No message history in this conversation thread.</p>
                  </div>
                ) : (
                  activeMessages.map((msg, idx) => {
                    const isModerated = msg.moderated === true;
                    const senderName = msg.senderName || msg.sender || (msg.isFarmer ? activeChat.farmerName : activeChat.studentName) || 'Participant';

                    return (
                      <div
                        key={msg.id || idx}
                        className={`flex flex-col max-w-[85%] group ${
                          msg.isFarmer ? 'mr-auto items-start' : 'ml-auto items-end'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 mb-1 text-[11px] text-on-surface-variant font-medium">
                          <span>{senderName}</span>
                          <span>•</span>
                          <span className="font-mono text-[10px] text-outline">{msg.timestamp || '—'}</span>
                        </div>

                        {isModerated ? (
                          <div className="p-3 bg-amber-50 text-amber-900 border border-amber-200/80 rounded-2xl text-xs italic flex items-center gap-2">
                            <span className="material-symbols-outlined text-base text-amber-700">warning</span>
                            <span>This message was removed by an administrator. ({msg.moderationReason})</span>
                          </div>
                        ) : (
                          <div className="relative group/bubble">
                            <div
                              className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-2xs ${
                                msg.isFarmer
                                  ? 'bg-surface-container-low text-on-surface border border-outline-variant/30 rounded-tl-xs'
                                  : 'bg-primary text-white rounded-tr-xs'
                              }`}
                            >
                              {msg.message || msg.text}
                            </div>

                            {/* Moderation Button */}
                            <button
                              type="button"
                              onClick={() => handleOpenModerate(msg)}
                              className="absolute top-1/2 -translate-y-1/2 opacity-0 group-hover/bubble:opacity-100 transition-opacity p-1 rounded-full bg-white text-error shadow-sm hover:bg-error/10 border border-outline-variant/30 -right-8 cursor-pointer"
                              title="Moderate / Remove Message"
                            >
                              <span className="material-symbols-outlined text-[15px]">security</span>
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8 text-center space-y-2">
              <div>
                <span className="material-symbols-outlined text-4xl text-outline/30">forum</span>
                <p className="text-sm font-semibold text-on-surface-variant">Select a conversation to inspect</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ─── Modal: Message Moderation ────────────────────────────────────────── */}
      {moderateModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <form
            onSubmit={handleConfirmModerate}
            className="bg-surface-container-lowest rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-outline-variant/40 space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-800 border border-amber-200 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-2xl">security</span>
              </div>
              <div>
                <h3 className="font-display font-bold text-base sm:text-lg text-on-surface">Moderate Message</h3>
                <p className="text-xs text-on-surface-variant">
                  This action will replace the message content and log an audit record.
                </p>
              </div>
            </div>

            <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/30 text-xs text-on-surface italic">
              "{moderateModal.message?.message || moderateModal.message?.text}"
            </div>

            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                Moderation Reason / Violation
              </label>
              <textarea
                rows={3}
                value={moderateModal.reason}
                onChange={(e) => setModerateModal({ ...moderateModal, reason: e.target.value })}
                className="w-full p-2.5 bg-white rounded-xl border border-outline-variant/60 text-xs text-on-surface focus:outline-none focus:border-primary"
                required
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-outline-variant/20">
              <button
                type="button"
                onClick={() => setModerateModal({ isOpen: false, message: null, reason: '' })}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-on-surface bg-white border border-outline-variant/50 hover:bg-surface-container transition-colors shadow-2xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-error hover:bg-error/90 shadow-xs transition-colors cursor-pointer"
              >
                Remove Message
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Confirmation Modal */}
      <AdminConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        isDestructive={confirmModal.isDestructive}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal({ isOpen: false })}
      />
    </AdminLayout>
  );
}
