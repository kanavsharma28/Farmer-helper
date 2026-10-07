import React, { useState, useMemo } from 'react';
import {
  isUserInConversation,
  isConversationVisibleForUser,
  getConversationPartner
} from '../../data/chatData';

export default function ConversationListModal({
  isOpen,
  onClose,
  conversations = [],
  onSelectConversation,
  currentUser,
  lang = 'en'
}) {
  const isEn = lang === 'en';
  const [searchQuery, setSearchQuery] = useState('');

  const myId = currentUser?.id;

  // Universal filtering: current user must be in conversation and not removed
  const userConversations = useMemo(() => {
    if (!myId) return [];
    return conversations.filter((c) => isConversationVisibleForUser(c, myId));
  }, [conversations, myId]);

  const filtered = useMemo(() => {
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative w-full max-w-xl bg-surface-container-lowest rounded-3xl shadow-2xl border border-outline-variant/40 overflow-hidden flex flex-col max-h-[88vh] z-10 animate-fadeIn">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-surface-container-low border-b border-outline-variant/30 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
              <span className="material-symbols-outlined text-2xl">chat</span>
            </div>
            <div>
              <h2 className="font-headline-md text-lg sm:text-xl font-bold text-on-surface">
                {isEn ? 'Messages & Conversations' : 'संदेश एवं बातचीत'}
              </h2>
              <p className="text-xs text-on-surface-variant">
                {isEn
                  ? 'Two-way in-app chat across Farmers, Students, Buyers & Providers'
                  : 'किसान, छात्र, खरीदार और साधन प्रदाताओं के बीच सुरक्षित बातचीत'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-outline hover:text-on-surface transition-colors cursor-pointer"
            title={isEn ? "Close" : "बंद करें"}
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-outline-variant/20 bg-surface-container-lowest">
          <div className="relative flex items-center">
            <span className="material-symbols-outlined absolute left-3.5 text-outline text-[18px]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isEn ? "Search conversations by name, role or title..." : "नाम, रोल या शीर्षक द्वारा खोजें..."}
              className="w-full pl-10 pr-4 py-2 bg-surface-container-low rounded-xl text-xs sm:text-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/20 border border-outline-variant/30 transition-all"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="overflow-y-auto p-4 sm:p-5 space-y-2.5 flex-1 divide-y divide-outline-variant/10">
          {filtered.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-surface-container-low text-outline flex items-center justify-center mx-auto text-2xl">
                💬
              </div>
              <h3 className="font-bold text-sm sm:text-base text-on-surface">
                {isEn ? 'No conversations found' : 'कोई बातचीत नहीं मिली'}
              </h3>
              <p className="text-xs text-on-surface-variant max-w-xs mx-auto">
                {isEn
                  ? 'Start a chat from any internship, resource card, or buyer listing.'
                  : 'किसी भी इंटर्नशिप, साधन कार्ड या खरीदार मांग से चैट शुरू करें।'}
              </p>
            </div>
          ) : (
            filtered.map((conv) => {
              const partner = getConversationPartner(conv, myId);
              const unreadCount = conv.unreadCounts?.[myId] || 0;
              const hasUnread = unreadCount > 0;
              const contextTitle = conv.contextTitle || conv.internshipTitle || conv.resourceTitle || '';
              const contextIcon = conv.contextType === 'resource'
                ? 'handshake'
                : conv.contextType === 'produce'
                ? 'agriculture'
                : conv.contextType === 'internship'
                ? 'school'
                : 'chat';

              return (
                <div
                  key={conv.id}
                  onClick={() => onSelectConversation(conv)}
                  className={`p-3.5 sm:p-4 rounded-2xl transition-all cursor-pointer flex items-center justify-between gap-3 group border ${
                    hasUnread
                      ? 'bg-primary/5 hover:bg-primary/10 border-primary/30'
                      : 'bg-surface-container-low hover:bg-surface-container hover:border-primary/40 border-outline-variant/30'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="relative shrink-0">
                      <div className="w-11 h-11 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white flex items-center justify-center font-bold text-sm transition-colors shadow-2xs">
                        {partner.initials}
                      </div>
                      {hasUnread && (
                        <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-primary ring-2 ring-surface"></span>
                      )}
                    </div>

                    <div className="min-w-0 space-y-0.5">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-on-surface truncate group-hover:text-primary transition-colors">
                          {partner.name}
                        </h4>
                        <span className="px-2 py-0.2 rounded-full text-[10px] font-semibold bg-surface-container text-on-surface-variant">
                          {partner.roleLabel}
                        </span>
                      </div>

                      {contextTitle && (
                        <p className="text-xs text-primary font-medium truncate flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">{contextIcon}</span>
                          <span className="truncate">{contextTitle}</span>
                        </p>
                      )}

                      <p className={`text-xs truncate ${hasUnread ? 'text-on-surface font-semibold' : 'text-on-surface-variant'}`}>
                        {conv.lastMessage || (isEn ? 'Click to view conversation...' : 'बातचीत देखने के लिए क्लिक करें...')}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1.5 shrink-0 text-right">
                    <span className="text-[11px] text-outline font-medium">
                      {conv.lastMessageTime || conv.updatedAt || 'Recent'}
                    </span>
                    <span className="w-8 h-8 rounded-xl bg-surface-container-high group-hover:bg-primary group-hover:text-white text-on-surface-variant flex items-center justify-center transition-colors">
                      <span className="material-symbols-outlined text-base">chat</span>
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-surface-container-low border-t border-outline-variant/30 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-surface-container text-on-surface text-xs font-semibold hover:bg-surface-container-high transition-colors cursor-pointer"
          >
            {isEn ? 'Close' : 'बंद करें'}
          </button>
        </div>

      </div>
    </div>
  );
}
