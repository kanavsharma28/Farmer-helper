import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSearchParams } from 'react-router-dom';
import DashboardSidebar from '../components/dashboard/DashboardSidebar';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import DashboardMobileNav from '../components/dashboard/DashboardMobileNav';

import ResourceCard from '../components/resources/ResourceCard';
import ResourceHeader from '../components/resources/ResourceHeader';
import ResourceCategories from '../components/resources/ResourceCategories';
import BookingModal from '../components/resources/BookingModal';
import AddResourceModal from '../components/resources/AddResourceModal';
import EditResourceModal from '../components/resources/EditResourceModal';

import {
  getStoredResources,
  saveStoredResources,
} from '../data/resourceContent';

import {
  getStoredConversations,
  saveStoredConversations,
  getOrCreateConversation,
  sendMessageToConversation,
  CHAT_UPDATE_EVENT
} from '../data/chatData';
import ChatModal from '../components/chat/ChatModal';
import ConversationListModal from '../components/chat/ConversationListModal';

// ─────────────────────────────────────────────────────────────────────────────
export default function ResourcesPage() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();

  // Resolved current user (with safe fallbacks)
  const currentUser = useMemo(() => ({
    id:       user?.id       || 'user_farmer_01',
    name:     user?.name     || 'Rajesh Kumar',
    role:     user?.role     || 'farmer',
    phone:    user?.phone    || '9876543210',
    initials: user?.initials || 'RK',
    location: user?.location || '',
  }), [user]);

  const isProvider = currentUser.role === 'provider';

  // ── Language & Nav ──────────────────────────────────────────────────────────
  const [lang, setLang] = useState('en');
  const isEn = lang === 'en';
  const [activeNav, setActiveNav] = useState('resourceSharing');

  // ── Active Tab: 'marketplace' | 'my-listings' ──────────────────────────────
  const [activeTab, setActiveTab] = useState(isProvider ? 'my-listings' : 'marketplace');

  // ── Handle URL ?tab= param (for sidebar nav links like ?tab=messages) ───────
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'messages' || tab === 'chat') {
      setIsConversationListOpen(true);
    } else if (tab === 'my-listings') {
      setActiveTab('my-listings');
    } else if (tab === 'marketplace') {
      setActiveTab('marketplace');
    }
  }, [searchParams]);


  // ── All Resources — localStorage-backed (same pattern as InternshipsPage) ──
  const [resources, setResources] = useState(() => getStoredResources());

  useEffect(() => {
    saveStoredResources(resources);
  }, [resources]);

  // ── Filter & Search State ───────────────────────────────────────────────────
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // ── Booking Modal ───────────────────────────────────────────────────────────
  const [selectedResourceForBooking, setSelectedResourceForBooking] = useState(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  // ── Add / Edit Modals ───────────────────────────────────────────────────────
  const [isAddResourceModalOpen, setIsAddResourceModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState(null);

  // ── Delete confirmation state ───────────────────────────────────────────────
  const [deletingResource, setDeletingResource] = useState(null);

  // ── In-App Chat (reuses the shared Farmer Helper chat system) ──────────────
  const [conversations, setConversations] = useState(() => getStoredConversations());
  const [activeChatConversation, setActiveChatConversation] = useState(null);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [isConversationListOpen, setIsConversationListOpen] = useState(false);
  const [openedChatFromList, setOpenedChatFromList] = useState(false);

  useEffect(() => {
    saveStoredConversations(conversations);
  }, [conversations]);

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

  // ── Derived data ────────────────────────────────────────────────────────────

  // Resources owned by the current user
  const myListings = useMemo(() =>
    resources.filter((r) => r.ownerId === currentUser.id),
    [resources, currentUser.id]
  );

  // Resources NOT owned by the current user — the marketplace
  // (also includes seed resources that have a different ownerId)
  const marketplaceResources = useMemo(() =>
    resources.filter((r) => r.ownerId !== currentUser.id),
    [resources, currentUser.id]
  );

  // Apply search + category filter to whichever list is active
  const filterResources = (list) => {
    return list.filter((res) => {
      const matchesCat = selectedCategory === 'all' || res.category === selectedCategory;
      const nameStr = [res.titleEn, res.ownerEn, res.locationEn,
                       res.titleHi, res.ownerHi, res.locationHi].join(' ');
      const matchesSearch = nameStr.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    });
  };

  const filteredMarketplace = filterResources(marketplaceResources);
  const filteredMyListings  = filterResources(myListings);

  // ── Handlers ────────────────────────────────────────────────────────────────

  // Add new resource (from form)
  const handleAddResource = (newResource) => {
    setResources((prev) => [newResource, ...prev]);
    // Auto-switch to My Listings so the user sees their new resource
    setActiveTab('my-listings');
  };

  // Edit resource (ownership enforced)
  const handleEditResource = (resource) => {
    if (resource.ownerId !== currentUser.id) return; // ownership check
    setEditingResource(resource);
  };

  // Save edited resource
  const handleSaveEditedResource = (updatedResource) => {
    if (updatedResource.ownerId !== currentUser.id) return; // ownership check
    setResources((prev) =>
      prev.map((r) => (r.id === updatedResource.id ? updatedResource : r))
    );
    setEditingResource(null);
  };

  // Delete resource (ownership enforced)
  const handleDeleteResource = (resource) => {
    if (resource.ownerId !== currentUser.id) return; // ownership check
    setDeletingResource(resource);
  };

  const confirmDelete = () => {
    if (!deletingResource || deletingResource.ownerId !== currentUser.id) return;
    setResources((prev) => prev.filter((r) => r.id !== deletingResource.id));
    setDeletingResource(null);
  };

  // Toggle availability (ownership enforced)
  const handleToggleAvailability = (resource) => {
    if (resource.ownerId !== currentUser.id) return;
    setResources((prev) =>
      prev.map((r) =>
        r.id === resource.id ? { ...r, available: !r.available } : r
      )
    );
  };

  // Contact owner (call)
  const handleContactOwner = (resource) => {
    const phone = resource.ownerPhone || '9876543210';
    window.location.href = `tel:${phone}`;
  };

  // Open booking
  const handleOpenBooking = (resource) => {
    setSelectedResourceForBooking(resource);
    setIsBookingModalOpen(true);
  };

  const handleOpenChat = (resource) => {
    setOpenedChatFromList(false);

    const resourceTitle = isEn ? resource.titleEn : resource.titleHi;
    const ownerName     = resource.ownerName || (isEn ? resource.ownerEn : resource.ownerHi);
    const priceStr      = `₹${resource.price?.toLocaleString()}${isEn ? resource.unitEn : resource.unitHi}`;
    const ownerId       = resource.ownerId || 'user_provider_01';

    const conv = getOrCreateConversation({
      currentUser,
      targetUser: {
        id: ownerId,
        name: ownerName,
        role: 'provider',
        phone: resource.ownerPhone || '9788665544',
        farmName: `${ownerName} — Resource Provider`
      },
      context: {
        type: 'resource',
        id: resource.id,
        title: resourceTitle,
        subtitle: `${ownerName} • ${priceStr}`
      },
      initialText: `Namaste! I am interested in "${resourceTitle}" (${priceStr}). Could you confirm availability and timing?`
    });

    setConversations(getStoredConversations());
    setActiveChatConversation(conv);
    setIsChatModalOpen(true);
  };

  const handleSendMessage = (conversationId, messageText) => {
    const updated = sendMessageToConversation({
      conversations,
      conversationId,
      senderUser: currentUser,
      text: messageText
    });
    setConversations(updated);
    const updatedConv = updated.find((c) => c.id === conversationId);
    if (updatedConv) {
      setActiveChatConversation(updatedConv);
    }
  };


  // ─────────────────────────────────────────────────────────────────────────────

  const EmptyState = ({ message, sub, actionLabel, onAction }) => (
    <div className="py-16 text-center bg-white rounded-3xl border border-outline-variant/50 p-8 space-y-4">
      <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center mx-auto text-3xl">
        🌱
      </div>
      <h3 className="font-bold text-lg text-on-surface">{message}</h3>
      <p className="text-sm text-on-surface-variant max-w-sm mx-auto">{sub}</p>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-on-primary font-semibold text-sm hover:bg-primary-container transition-all"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          {actionLabel}
        </button>
      )}
    </div>
  );

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col lg:flex-row font-sans selection:bg-primary-container selection:text-white">

      <DashboardSidebar activeNav={activeNav} setActiveNav={setActiveNav} lang={lang} />

      <div className="flex-1 flex flex-col min-w-0 pb-24 lg:pb-8">
        <DashboardHeader lang={lang} setLang={setLang} />

        <main className="flex-1 p-4 sm:p-6 lg:p-10 overflow-y-auto space-y-6">

          {/* ── Page Header ── */}
          <ResourceHeader
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            lang={lang}
            setLang={setLang}
            onOpenAddResource={() => setIsAddResourceModalOpen(true)}
          />

          {/* ── Tab Navigation (like InternshipsPage farmer tabs) ── */}
          <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-2xl border border-outline-variant/30 w-fit">
            <button
              type="button"
              onClick={() => setActiveTab('marketplace')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'marketplace'
                  ? 'bg-white text-primary shadow-sm border border-outline-variant/20'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">storefront</span>
                {isEn ? 'Browse Marketplace' : 'बाजार देखें'}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('my-listings')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'my-listings'
                  ? 'bg-white text-primary shadow-sm border border-outline-variant/20'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px]">inventory_2</span>
                {isEn ? 'My Resources' : 'मेरे साधन'}
                {myListings.length > 0 && (
                  <span className="bg-primary text-on-primary text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {myListings.length}
                  </span>
                )}
              </span>
            </button>
          </div>

          {/* ── Category Filter ── */}
          <ResourceCategories
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            lang={lang}
          />

          {/* ══════════════════════════════════════════════════
              MARKETPLACE TAB — other users' resources
             ══════════════════════════════════════════════════ */}
          {activeTab === 'marketplace' && (
            <>
              {/* Results header */}
              <div className="flex items-center justify-between">
                <p className="text-sm text-on-surface-variant font-medium">
                  {isEn
                    ? `${filteredMarketplace.length} resource${filteredMarketplace.length !== 1 ? 's' : ''} available`
                    : `${filteredMarketplace.length} साधन उपलब्ध`}
                </p>
              </div>

              {filteredMarketplace.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredMarketplace.map((res) => (
                    <ResourceCard
                      key={res.id}
                      resource={res}
                      lang={lang}
                      isOwner={false}
                      onBook={handleOpenBooking}
                      onContact={handleContactOwner}
                      onChat={handleOpenChat}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState
                  message={isEn ? 'No resources found' : 'कोई साधन नहीं मिला'}
                  sub={isEn
                    ? 'Try adjusting your search or category filter.'
                    : 'अपनी खोज या श्रेणी बदलें।'}
                />
              )}
            </>
          )}

          {/* ══════════════════════════════════════════════════
              MY LISTINGS TAB — current user's own resources
             ══════════════════════════════════════════════════ */}
          {activeTab === 'my-listings' && (
            <>
              {/* Section header */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-on-surface">
                    {isEn ? 'My Resource Listings' : 'मेरी साधन लिस्टिंग'}
                  </h2>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    {isEn
                      ? 'Manage resources you have listed in the marketplace.'
                      : 'बाजार में आपके द्वारा सूचीबद्ध साधन प्रबंधित करें।'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddResourceModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-on-primary font-semibold text-xs hover:bg-primary-container transition-all shadow-sm"
                >
                  <span className="material-symbols-outlined text-sm">add</span>
                  {isEn ? 'Add Resource' : 'साधन जोड़ें'}
                </button>
              </div>

              {filteredMyListings.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredMyListings.map((res) => (
                    <ResourceCard
                      key={res.id}
                      resource={res}
                      lang={lang}
                      isOwner={true}
                      onEdit={handleEditResource}
                      onDelete={handleDeleteResource}
                      onToggleAvailability={handleToggleAvailability}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState
                  message={isEn ? 'You have not listed any resources yet' : 'आपने अभी तक कोई साधन सूचीबद्ध नहीं किया'}
                  sub={isEn
                    ? 'Add your first resource — tractor, machinery, labour, seeds or fertilizer.'
                    : 'पहला साधन जोड़ें — ट्रैक्टर, मशीनरी, मजदूर, बीज या उर्वरक।'}
                  actionLabel={isEn ? 'Add Your First Resource' : 'पहला साधन जोड़ें'}
                  onAction={() => setIsAddResourceModalOpen(true)}
                />
              )}
            </>
          )}

        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <DashboardMobileNav activeNav="services" setActiveNav={() => {}} lang={lang} />

      {/* ══════════════════════════════════════════════════════════════════════
          MODALS
         ══════════════════════════════════════════════════════════════════════ */}

      {/* Booking Modal */}
      <BookingModal
        resource={selectedResourceForBooking}
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        lang={lang}
      />

      {/* Add Resource Modal */}
      <AddResourceModal
        isOpen={isAddResourceModalOpen}
        onClose={() => setIsAddResourceModalOpen(false)}
        onAddSuccess={handleAddResource}
        lang={lang}
        currentUser={currentUser}
      />

      {/* Edit Resource Modal */}
      <EditResourceModal
        isOpen={Boolean(editingResource)}
        onClose={() => setEditingResource(null)}
        resource={editingResource}
        onSave={handleSaveEditedResource}
        lang={lang}
      />

      {/* ── Delete Confirmation Dialog ── */}
      {deletingResource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-surface-variant space-y-5">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 bg-error/10 rounded-full flex items-center justify-center mx-auto">
                <span className="material-symbols-outlined text-error text-2xl">delete_forever</span>
              </div>
              <h3 className="font-bold text-lg text-on-surface">
                {isEn ? 'Delete Listing?' : 'लिस्टिंग हटाएं?'}
              </h3>
              <p className="text-xs text-on-surface-variant">
                {isEn
                  ? `"${deletingResource.titleEn}" will be permanently removed from the marketplace.`
                  : `"${deletingResource.titleHi}" बाजार से स्थायी रूप से हटा दिया जाएगा।`}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setDeletingResource(null)}
                className="flex-1 py-2.5 rounded-xl border border-outline-variant text-on-surface font-semibold text-sm hover:bg-surface-container transition-all"
              >
                {isEn ? 'Cancel' : 'रद्द करें'}
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="flex-1 py-2.5 rounded-xl bg-error text-white font-semibold text-sm hover:bg-error/90 transition-all active:scale-95"
              >
                {isEn ? 'Yes, Delete' : 'हां, हटाएं'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── In-App Chat (shared Farmer Helper system) ── */}
      <ChatModal
        isOpen={isChatModalOpen}
        onClose={() => setIsChatModalOpen(false)}
        onBack={() => {
          setIsChatModalOpen(false);
          if (openedChatFromList) setIsConversationListOpen(true);
        }}
        conversation={activeChatConversation}
        onSendMessage={handleSendMessage}
        currentUser={currentUser}
        lang={lang}
      />

      <ConversationListModal
        isOpen={isConversationListOpen}
        onClose={() => setIsConversationListOpen(false)}
        conversations={conversations}
        currentUser={currentUser}
        lang={lang}
        onSelectConversation={(conv) => {
          setOpenedChatFromList(true);
          setIsConversationListOpen(false);
          setActiveChatConversation(conv);
          setIsChatModalOpen(true);
        }}
      />

    </div>
  );
}
