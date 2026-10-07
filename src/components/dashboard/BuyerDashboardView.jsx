import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { STORAGE_FACILITIES } from '../../data/storageData';
import {
  getStoredProduce,
  getStoredRequirements,
  saveStoredRequirements,
  PRODUCE_CROP_OPTIONS,
  QUANTITY_FILTER_OPTIONS,
  AVAILABILITY_OPTIONS,
} from '../../data/produceData';
import {
  getStoredConversations,
  saveStoredConversations,
  getOrCreateConversation,
  sendMessageToConversation,
  CHAT_UPDATE_EVENT
} from '../../data/chatData';
import ChatModal from '../chat/ChatModal';
import ConversationListModal from '../chat/ConversationListModal';

// ── Crop Emoji Map ───────────────────────────────────────────────────────────
const CROP_ICONS = {
  Wheat: '🌾',
  Potato: '🥔',
  Rice: '🍚',
  Soybean: '🫘',
  Mustard: '🌱',
  Onion: '🧅',
  Pulses: '🫘',
  Sugarcane: '🎋',
  Maize: '🌽',
  Tomato: '🍅',
  Vegetables: '🥦',
};

// ── Produce Lot Details Modal ────────────────────────────────────────────────
function ProduceDetailsModal({ lot, isOpen, onClose, isEn, onChat, onContact }) {
  if (!isOpen || !lot) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-outline-variant/30 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header accent */}
        <div className="h-2 bg-gradient-to-r from-primary via-emerald-600 to-amber-500 w-full" />

        <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
          {/* Top row */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 text-3xl flex items-center justify-center border border-primary/20 shrink-0">
                {CROP_ICONS[lot.crop] || '🌾'}
              </div>
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary border border-primary/20">
                  {lot.crop} • {lot.qualityGrade}
                </span>
                <h2 className="text-xl font-bold text-on-surface mt-1 leading-snug">
                  {isEn ? lot.variety : (lot.varietyHi || lot.variety)}
                </h2>
                <p className="text-xs text-on-surface-variant flex items-center gap-1 mt-0.5">
                  <span className="material-symbols-outlined text-[15px] text-outline">location_on</span>
                  <span>{isEn ? lot.location : (lot.locationHi || lot.location)}</span>
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-outline hover:text-on-surface hover:bg-surface-container-high transition-colors shrink-0"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>

          {/* Pricing & Quantity Box */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-surface-container-low rounded-2xl border border-outline-variant/30">
            <div>
              <p className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">
                {isEn ? 'Available Lot' : 'उपलब्ध मात्रा'}
              </p>
              <p className="text-base font-bold text-on-surface mt-0.5">{lot.quantity}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">
                {isEn ? 'Expected Rate' : 'अपेक्षित मूल्य'}
              </p>
              <p className="text-base font-bold text-primary mt-0.5">{lot.priceFormatted}</p>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <p className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">
                {isEn ? 'Availability' : 'स्थिति'}
              </p>
              <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                {isEn ? lot.availabilityStatus : (lot.availabilityStatusHi || lot.availabilityStatus)}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5 text-xs text-on-surface-variant leading-relaxed bg-amber-50/70 p-3.5 rounded-2xl border border-amber-200/60">
            <p className="font-bold text-amber-900 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
              <span className="material-symbols-outlined text-sm">info</span>
              <span>{isEn ? 'Crop Quality & Harvest Specs' : 'फसल गुणवत्ता व विवरण'}</span>
            </p>
            <p className="text-amber-950 font-medium">
              {isEn ? lot.description : (lot.descriptionHi || lot.description)}
            </p>
          </div>

          {/* Farmer Info Card */}
          <div className="p-4 rounded-2xl bg-white border border-outline-variant/40 space-y-3 shadow-2xs">
            <p className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
              {isEn ? 'Farmer / Producer' : 'उत्पादक किसान'}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm shadow-xs">
                  {lot.farmerName?.slice(0, 2).toUpperCase() || 'RK'}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-bold text-sm text-on-surface">{lot.farmerName}</h4>
                    {lot.verifiedFarmer && (
                      <span className="flex items-center text-emerald-600 text-[11px]" title="Verified Farmer">
                        <span className="material-symbols-outlined text-[15px]">verified</span>
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-on-surface-variant">{lot.distance}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs font-bold text-amber-600">
                <span className="material-symbols-outlined text-sm fill-amber-400">star</span>
                <span>{lot.rating || '4.8'}</span>
                <span className="text-[10px] text-outline font-normal">({lot.reviewsCount || 20})</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal footer actions */}
        <div className="p-4 bg-surface-container-low border-t border-outline-variant/30 flex items-center justify-end gap-3 shrink-0">
          <a
            href={`tel:${lot.farmerPhone || '9876543210'}`}
            className="px-4 py-2.5 rounded-xl border border-outline-variant/60 text-xs font-bold text-on-surface hover:bg-surface-container flex items-center gap-1.5 transition-colors"
          >
            <span className="material-symbols-outlined text-sm text-primary">call</span>
            <span>{isEn ? 'Call Farmer' : 'कॉल करें'}</span>
          </a>
          <button
            onClick={() => {
              onClose();
              onChat(lot);
            }}
            className="px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-container active:scale-95 transition-all shadow-sm flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-sm">chat</span>
            <span>{isEn ? 'Chat with Farmer' : 'किसान से चैट करें'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Post Buying Requirement Modal ────────────────────────────────────────────
function PostRequirementModal({ isOpen, onClose, onSave, isEn, initialData = null }) {
  const [formData, setFormData] = useState({
    crop: 'Wheat',
    cropVariety: '',
    quantityNum: 100,
    location: 'Meerut, Uttar Pradesh',
    expectedPriceRange: '₹2,400 – ₹2,550 / Quintal',
    qualityRequirements: 'Moisture < 12%, Cleaned lot, no weevil',
    purchaseDeadline: 'Within 7 Days',
    paymentTerms: 'Same-day bank transfer',
    description: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        crop: 'Wheat',
        cropVariety: '',
        quantityNum: 100,
        location: 'Meerut, Uttar Pradesh',
        expectedPriceRange: '₹2,400 – ₹2,550 / Quintal',
        qualityRequirements: 'Moisture < 12%, Cleaned lot, no weevil',
        purchaseDeadline: 'Within 7 Days',
        paymentTerms: 'Same-day bank transfer',
        description: '',
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-outline-variant/30 overflow-hidden flex flex-col max-h-[92vh]">
        <div className="p-5 sm:p-6 border-b border-outline-variant/30 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">assignment_add</span>
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg text-on-surface">
                {initialData
                  ? (isEn ? 'Edit Buying Requirement' : 'खरीद आवश्यकता संपादित करें')
                  : (isEn ? 'Post New Buying Requirement' : 'नई खरीद मांग पोस्ट करें')}
              </h3>
              <p className="text-xs text-on-surface-variant">
                {isEn
                  ? 'Farmers will discover this requirement in Best Buyers marketplace.'
                  : 'यह मांग किसानों को सर्वश्रेष्ठ खरीदार मार्केटप्लेस में दिखाई देगी।'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-outline hover:text-on-surface"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">
                {isEn ? 'Target Crop *' : 'फसल *'}
              </label>
              <select
                value={formData.crop}
                onChange={(e) => setFormData({ ...formData, crop: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-xs font-semibold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                required
              >
                {PRODUCE_CROP_OPTIONS.filter((c) => c.id !== 'all').map((c) => (
                  <option key={c.id} value={c.id}>{c.icon} {c.labelEn}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">
                {isEn ? 'Variety / Grade' : 'किस्म / ग्रेड'}
              </label>
              <input
                type="text"
                placeholder={isEn ? 'e.g. Sharbati or Mill Grade' : 'उदा. शरबती या मिल ग्रेड'}
                value={formData.cropVariety}
                onChange={(e) => setFormData({ ...formData, cropVariety: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">
                {isEn ? 'Quantity Required (Quintals) *' : 'आवश्यक मात्रा (क्विंटल) *'}
              </label>
              <input
                type="number"
                min="10"
                step="10"
                value={formData.quantityNum}
                onChange={(e) => setFormData({ ...formData, quantityNum: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">
                {isEn ? 'Delivery / Procurement Location *' : 'खरीद स्थान / मंडी *'}
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Khanna Mandi, Meerut, UP"
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">
                {isEn ? 'Expected Price / Price Range *' : 'अपेक्षित मूल्य सीमा *'}
              </label>
              <input
                type="text"
                placeholder="₹2,400 – ₹2,550 / Quintal"
                value={formData.expectedPriceRange}
                onChange={(e) => setFormData({ ...formData, expectedPriceRange: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">
                {isEn ? 'Purchase Deadline' : 'खरीद समय-सीमा'}
              </label>
              <select
                value={formData.purchaseDeadline}
                onChange={(e) => setFormData({ ...formData, purchaseDeadline: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-xs font-semibold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="Immediate (Within 3 Days)">Immediate (Within 3 Days)</option>
                <option value="Within 7 Days">Within 7 Days</option>
                <option value="Within 14 Days">Within 14 Days</option>
                <option value="Ongoing Seasonal Procurement">Ongoing Seasonal Procurement</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-on-surface mb-1">
              {isEn ? 'Quality Requirements' : 'गुणवत्ता आवश्यकताएं'}
            </label>
            <input
              type="text"
              placeholder="e.g. Moisture < 12%, No weevil damage, Cleaned"
              value={formData.qualityRequirements}
              onChange={(e) => setFormData({ ...formData, qualityRequirements: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-on-surface mb-1">
              {isEn ? 'Procurement Notes & Payment Terms' : 'खरीद टिप्पणी व भुगतान शर्तें'}
            </label>
            <textarea
              rows={2}
              placeholder={isEn ? 'Add details like farm gate pickup, truckload terms, payment schedule...' : 'खेत से उठान, वाहन व्यवस्था या भुगतान विवरण जोड़ें...'}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
            />
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-outline-variant/40 text-xs font-semibold text-on-surface hover:bg-surface-container"
            >
              {isEn ? 'Cancel' : 'रद्द करें'}
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-container shadow-xs active:scale-95 transition-all"
            >
              {initialData ? (isEn ? 'Save Changes' : 'सहेजें') : (isEn ? 'Publish Requirement' : 'मांग प्रकाशित करें')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Main Buyer Dashboard View ────────────────────────────────────────────────
export default function BuyerDashboardView({ lang = 'en', urlTab = 'produce', onTabChange }) {
  const isEn = lang === 'en';
  const navigate = useNavigate();
  const { user } = useAuth();

  // Resolved Current User Details
  const currentUser = useMemo(() => ({
    id: user?.id || 'user_buyer_01',
    name: user?.businessName || user?.name || 'Kisan Mandi Agro Traders',
    role: 'buyer',
    phone: user?.phone || '9988776655',
    location: user?.location || 'Khanna Mandi, Meerut, UP',
    initials: user?.initials || 'KM',
    businessName: user?.businessName || 'Kisan Mandi Agro Traders',
  }), [user]);

  const buyerName = isEn ? currentUser.businessName : (user?.businessNameHi || currentUser.businessName);

  // ── Active Tab Management ──────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState(urlTab || 'produce');

  useEffect(() => {
    if (urlTab) {
      if (urlTab === 'produce' || urlTab === 'requirements' || urlTab === 'storage' || urlTab === 'profile') {
        setActiveTab(urlTab);
      } else if (urlTab === 'messages') {
        setIsConversationListOpen(true);
      }
    }
  }, [urlTab]);

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    if (onTabChange) {
      onTabChange(tabId);
    }
  };

  // ── Data: Farm Produce Lots (Sold by Farmers) ──────────────────────────────
  const [produceLots, setProduceLots] = useState(() => getStoredProduce());

  // ── Data: Buying Requirements (Posted by Buyers) ───────────────────────────
  const [requirements, setRequirements] = useState(() => getStoredRequirements());

  useEffect(() => {
    saveStoredRequirements(requirements);
  }, [requirements]);

  // ── Data: Chat Conversations (Shared Chat System) ─────────────────────────
  const [conversations, setConversations] = useState(() => getStoredConversations());
  const [activeChatConversation, setActiveChatConversation] = useState(null);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [isConversationListOpen, setIsConversationListOpen] = useState(false);

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

  // ── Modals State ───────────────────────────────────────────────────────────
  const [selectedLot, setSelectedLot] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isReqModalOpen, setIsReqModalOpen] = useState(false);
  const [editingReq, setEditingReq] = useState(null);

  // ── Search & Filter State for Farm Produce ─────────────────────────────────
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedQty, setSelectedQty] = useState('all');
  const [selectedAvailability, setSelectedAvailability] = useState('all');
  const [verifiedFarmerOnly, setVerifiedFarmerOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState('all');

  // Filtered Produce Lots
  const filteredProduce = useMemo(() => {
    return produceLots.filter((lot) => {
      const qLower = searchQuery.toLowerCase();
      const matchSearch = !searchQuery ||
        lot.crop?.toLowerCase().includes(qLower) ||
        lot.variety?.toLowerCase().includes(qLower) ||
        lot.farmerName?.toLowerCase().includes(qLower) ||
        lot.location?.toLowerCase().includes(qLower) ||
        lot.district?.toLowerCase().includes(qLower);

      const matchCrop = selectedCrop === 'all' || lot.crop?.toLowerCase() === selectedCrop.toLowerCase();
      const matchLocation = selectedLocation === 'all' || lot.location?.toLowerCase().includes(selectedLocation.toLowerCase());
      
      const matchQty = selectedQty === 'all' || (lot.quantityNum || 0) >= Number(selectedQty);
      
      const matchStatus = selectedAvailability === 'all' ||
        (selectedAvailability === 'ready' && lot.availabilityStatus?.toLowerCase().includes('ready for dispatch')) ||
        (selectedAvailability === 'mandi' && lot.availabilityStatus?.toLowerCase().includes('mandi ready')) ||
        (selectedAvailability === 'soon' && lot.availabilityStatus?.toLowerCase().includes('harvesting'));

      const matchVerified = !verifiedFarmerOnly || lot.verifiedFarmer;

      const matchPrice = maxPrice === 'all' ||
        (maxPrice === '2000' && lot.pricePerQuintal <= 2000) ||
        (maxPrice === '3500' && lot.pricePerQuintal <= 3500) ||
        (maxPrice === 'high' && lot.pricePerQuintal > 3500);

      return matchSearch && matchCrop && matchLocation && matchQty && matchStatus && matchVerified && matchPrice;
    });
  }, [produceLots, searchQuery, selectedCrop, selectedLocation, selectedQty, selectedAvailability, verifiedFarmerOnly, maxPrice]);

  // Buyer's Own Posted Requirements
  const myRequirements = useMemo(() => {
    return requirements.filter(
      (r) => r.buyerOwnerId === currentUser.id || r.buyerId === 'buyer_seed_01'
    );
  }, [requirements, currentUser.id]);

  // ── Chat Trigger Handler: Buyer initiates Chat with Farmer ─────────────────
  const handleOpenChatWithFarmer = (lot) => {
    const cropName = lot.variety || lot.crop;
    const initialText = `Namaste ${lot.farmerName} ji! I am interested in purchasing your ${cropName} (${lot.quantity}). Is this lot available for immediate dispatch at ${lot.priceFormatted}?`;

    const conv = getOrCreateConversation({
      currentUser,
      targetUser: {
        id: lot.farmerId || 'user_farmer_01',
        name: lot.farmerName,
        role: 'farmer',
        phone: lot.farmerPhone || '9876543210',
        farmName: `${lot.farmerName} (${lot.location})`
      },
      context: {
        type: 'produce',
        id: lot.id,
        title: `${lot.crop} — ${lot.quantity}`,
        subtitle: `${lot.farmerName} • ${lot.priceFormatted}`
      },
      initialText
    });

    setConversations(getStoredConversations());
    setActiveChatConversation(conv);
    setIsChatModalOpen(true);
  };

  // ── Send Message in Chat ───────────────────────────────────────────────────
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

  // ── Requirement Handlers ───────────────────────────────────────────────────
  const handleSaveRequirement = (formData) => {
    if (editingReq) {
      setRequirements((prev) =>
        prev.map((r) =>
          r.id === editingReq.id
            ? {
                ...r,
                ...formData,
                quantity: `${formData.quantityNum} Quintals`,
                updatedAt: new Date().toISOString(),
              }
            : r
        )
      );
      setEditingReq(null);
    } else {
      const newReq = {
        id: `req_${Date.now()}`,
        buyerId: 'buyer_seed_01',
        buyerOwnerId: currentUser.id,
        buyerName: currentUser.businessName,
        contactPerson: currentUser.name,
        buyerPhone: currentUser.phone,
        buyerType: 'Wholesale Buyer & Trader',
        verifiedBuyer: true,
        crop: formData.crop,
        cropVariety: formData.cropVariety || `${formData.crop} (Good Grade)`,
        quantity: `${formData.quantityNum} Quintals`,
        quantityNum: formData.quantityNum,
        location: formData.location,
        expectedPriceRange: formData.expectedPriceRange,
        qualityRequirements: formData.qualityRequirements,
        purchaseDeadline: formData.purchaseDeadline,
        paymentTerms: formData.paymentTerms,
        status: 'Active',
        description: formData.description || `Required ${formData.quantityNum} quintals of ${formData.crop} for processing/trading.`,
        createdAt: new Date().toISOString(),
      };
      setRequirements((prev) => [newReq, ...prev]);
    }
  };

  const handleToggleRequirementStatus = (reqId) => {
    setRequirements((prev) =>
      prev.map((r) => (r.id === reqId ? { ...r, status: r.status === 'Active' ? 'Closed' : 'Active' } : r))
    );
  };

  const handleDeleteRequirement = (reqId) => {
    if (window.confirm(isEn ? 'Are you sure you want to remove this requirement?' : 'क्या आप यह खरीद मांग हटाना चाहते हैं?')) {
      setRequirements((prev) => prev.filter((r) => r.id !== reqId));
    }
  };

  return (
    <div className="space-y-6">
      
      {/* ── Welcome Banner ── */}
      <div className="bg-gradient-to-r from-[#1b4332] via-[#2d6a4f] to-[#1e5128] text-white rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 flex items-center justify-center pointer-events-none select-none">
          <span className="material-symbols-outlined text-[190px]">agriculture</span>
        </div>

        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-xs px-3.5 py-1 rounded-full text-xs font-semibold text-white/95 border border-white/20">
            <span className="material-symbols-outlined text-[16px]">verified</span>
            <span>{isEn ? 'Verified Agri-Buyer Portal' : 'प्रमाणित कृषि खरीदार केंद्र'}</span>
          </div>

          <h1 className="font-headline-lg text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
            {isEn ? `Welcome, ${buyerName} 🛒` : `स्वागत है, ${buyerName} 🛒`}
          </h1>

          <p className="text-white/90 text-sm sm:text-base leading-relaxed max-w-xl">
            {isEn
              ? 'Find farmers, agricultural products, and local suppliers.'
              : 'किसानों, कृषि उत्पादों और स्थानीय आपूर्तिकर्ताओं से सीधे जुड़ें।'}
          </p>

          {/* Quick Action Navigation Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => handleTabClick('produce')}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-xs sm:text-sm active:scale-95 transition-all shadow-sm ${
                activeTab === 'produce'
                  ? 'bg-white text-primary'
                  : 'bg-white/20 hover:bg-white/30 text-white backdrop-blur-xs border border-white/20'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">agriculture</span>
              <span>{isEn ? 'Browse Farm Produce' : 'खेत उपज देखें'}</span>
            </button>

            <button
              onClick={() => {
                setEditingReq(null);
                setIsReqModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-bold text-xs sm:text-sm active:scale-95 transition-all shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px]">add_circle</span>
              <span>{isEn ? '+ Post Requirement' : '+ खरीद मांग जोड़ें'}</span>
            </button>

            <button
              onClick={() => setIsConversationListOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/15 hover:bg-white/25 text-white font-bold text-xs sm:text-sm backdrop-blur-xs border border-white/20"
            >
              <span className="material-symbols-outlined text-[18px]">chat</span>
              <span>{isEn ? 'Farmer Chats' : 'किसान संदेश'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Key Metrics Overview Stats (Accurate Structured Data) ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            titleEn: 'Connected Farmers',
            titleHi: 'जुड़े किसान',
            val: '148',
            subEn: 'In UP & NCR Belt',
            icon: 'groups',
            color: 'text-emerald-700',
            bg: 'bg-emerald-500/10',
          },
          {
            titleEn: 'Active Produce Listings',
            titleHi: 'सक्रिय फसल लॉट',
            val: produceLots.length,
            subEn: 'Ready for Purchase',
            icon: 'inventory_2',
            color: 'text-primary',
            bg: 'bg-primary/10',
          },
          {
            titleEn: 'Pending Inquiries',
            titleHi: 'बातचीत / चैट',
            val: conversations.length,
            subEn: 'Direct Inquiries',
            icon: 'chat',
            color: 'text-blue-700',
            bg: 'bg-blue-500/10',
          },
          {
            titleEn: 'Active Requirements',
            titleHi: 'सक्रिय खरीद मांग',
            val: myRequirements.filter((r) => r.status === 'Active').length,
            subEn: 'Visible to Farmers',
            icon: 'assignment',
            color: 'text-amber-700',
            bg: 'bg-amber-500/10',
          },
        ].map((m, idx) => (
          <div
            key={idx}
            className="bg-surface-container-lowest p-4 sm:p-5 rounded-2xl border border-outline-variant/30 shadow-2xs flex items-center gap-3.5"
          >
            <div className={`w-12 h-12 rounded-xl ${m.bg} ${m.color} flex items-center justify-center shrink-0`}>
              <span className="material-symbols-outlined text-2xl">{m.icon}</span>
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold text-on-surface leading-tight">{m.val}</p>
              <p className="text-xs text-on-surface-variant font-medium mt-0.5">
                {isEn ? m.titleEn : m.titleHi}
              </p>
              <p className="text-[10px] text-outline font-normal">{m.subEn}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Sub Navigation Tabs ── */}
      <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
        {[
          { id: 'produce', icon: 'agriculture', labelEn: 'Direct Farm Produce', labelHi: 'सीधे खेत की उपज', count: produceLots.length },
          { id: 'requirements', icon: 'assignment', labelEn: 'My Buying Requirements', labelHi: 'मेरी खरीद मांग', count: myRequirements.length },
          { id: 'storage', icon: 'warehouse', labelEn: 'Cold Storage & Warehouses', labelHi: 'कोल्ड स्टोरेज व गोदाम' },
          { id: 'profile', icon: 'business', labelEn: 'Buyer Profile & Specs', labelHi: 'खरीदार प्रोफाइल' },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => handleTabClick(t.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 ${
              activeTab === t.id
                ? 'bg-primary text-white shadow-xs'
                : 'bg-white border border-outline-variant/40 text-on-surface-variant hover:bg-surface-container'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">{t.icon}</span>
            <span>{isEn ? t.labelEn : t.labelHi}</span>
            {t.count !== undefined && (
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                activeTab === t.id ? 'bg-white/20 text-white' : 'bg-surface-container-high text-on-surface-variant'
              }`}>
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ═════════════════════════════════════════════════════════════════════════
          TAB 1: DIRECT FARM PRODUCE MARKETPLACE (FARMER + PRODUCE CARDS)
         ═════════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'produce' && (
        <div className="space-y-5">
          
          {/* Produce Search & Filters Card */}
          <div className="bg-white rounded-3xl border border-outline-variant/30 p-4 sm:p-5 space-y-4 shadow-2xs">
            {/* Search Input */}
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[18px] text-outline pointer-events-none">search</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isEn ? 'Search crops, farmers, produce, locations...' : 'फसल, किसान, उपज या स्थान खोजें...'}
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-surface-container-low border border-outline-variant/30 text-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              )}
            </div>

            {/* Quick Filter Controls */}
            <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1 flex-wrap">
              {/* Crop Filter */}
              <select
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
                className="px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs font-semibold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                {PRODUCE_CROP_OPTIONS.map((c) => (
                  <option key={c.id} value={c.id}>{c.icon} {isEn ? c.labelEn : c.labelHi}</option>
                ))}
              </select>

              {/* Quantity Filter */}
              <select
                value={selectedQty}
                onChange={(e) => setSelectedQty(e.target.value)}
                className="px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs font-semibold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                {QUANTITY_FILTER_OPTIONS.map((q) => (
                  <option key={q.id} value={q.id}>{isEn ? q.labelEn : q.labelHi}</option>
                ))}
              </select>

              {/* Status / Availability */}
              <select
                value={selectedAvailability}
                onChange={(e) => setSelectedAvailability(e.target.value)}
                className="px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs font-semibold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                {AVAILABILITY_OPTIONS.map((a) => (
                  <option key={a.id} value={a.id}>{isEn ? a.labelEn : a.labelHi}</option>
                ))}
              </select>

              {/* Verified Farmer Toggle */}
              <button
                type="button"
                onClick={() => setVerifiedFarmerOnly((p) => !p)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition-all ${
                  verifiedFarmerOnly
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-700 shadow-2xs'
                    : 'bg-surface-container-low border-outline-variant/30 text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                <span className="material-symbols-outlined text-[14px]">verified</span>
                <span>{isEn ? 'Verified Farmers' : 'सत्यापित किसान'}</span>
              </button>

              {/* Clear All Filters */}
              {(searchQuery || selectedCrop !== 'all' || selectedQty !== 'all' || selectedAvailability !== 'all' || verifiedFarmerOnly) && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCrop('all');
                    setSelectedQty('all');
                    setSelectedAvailability('all');
                    setVerifiedFarmerOnly(false);
                    setMaxPrice('all');
                  }}
                  className="flex items-center gap-1 px-3 py-2 rounded-xl bg-error/8 border border-error/25 text-error text-xs font-semibold hover:bg-error/15 transition-all"
                >
                  <span className="material-symbols-outlined text-[14px]">filter_alt_off</span>
                  <span>{isEn ? 'Reset' : 'रीसेट'}</span>
                </button>
              )}
            </div>

            <div className="flex items-center justify-between text-xs text-on-surface-variant pt-1 border-t border-outline-variant/20">
              <p>
                {isEn
                  ? `Showing ${filteredProduce.length} available produce lot${filteredProduce.length !== 1 ? 's' : ''}`
                  : `${filteredProduce.length} उपलब्ध फसल लॉट दिखाए जा रहे हैं`}
              </p>
              <span className="text-[11px] text-primary font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>{isEn ? 'Direct Farm Gate Sourcing' : 'सीधी खेत खरीद'}</span>
              </span>
            </div>
          </div>

          {/* Farm Produce Lots Grid (FARMER + PRODUCE CARDS) */}
          {filteredProduce.length === 0 ? (
            <div className="py-16 text-center bg-white rounded-3xl border border-outline-variant/40 p-8 space-y-4 shadow-2xs">
              <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center mx-auto text-3xl">🌾</div>
              <h3 className="font-bold text-base text-on-surface">
                {isEn ? 'No farm produce found' : 'कोई फसल लॉट नहीं मिला'}
              </h3>
              <p className="text-xs text-on-surface-variant max-w-sm mx-auto">
                {isEn ? 'Try adjusting your crop, quantity, or location filters.' : 'अपनी फसल, मात्रा या स्थान फ़िल्टर बदलकर पुनः प्रयास करें।'}
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCrop('all');
                  setSelectedQty('all');
                  setSelectedAvailability('all');
                  setVerifiedFarmerOnly(false);
                }}
                className="px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-container transition-all"
              >
                {isEn ? 'Show All Produce' : 'सभी फसलें दिखाएं'}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredProduce.map((lot) => (
                <div
                  key={lot.id}
                  className="bg-white rounded-3xl border border-outline-variant/30 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden group"
                >
                  {/* Top Color Accent */}
                  <div className="h-1.5 bg-gradient-to-r from-primary to-emerald-600 w-full" />

                  <div className="p-5 flex flex-col flex-1 gap-3.5">
                    {/* Header: Farmer Info */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0 border border-primary/20">
                          {lot.farmerName?.slice(0, 2).toUpperCase() || 'RK'}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="font-bold text-sm text-on-surface leading-tight">
                              {isEn ? lot.farmerName : (lot.farmerNameHi || lot.farmerName)}
                            </h4>
                            {lot.verifiedFarmer && (
                              <span className="flex items-center gap-0.5 px-1.5 py-0.2 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                                <span className="material-symbols-outlined text-[12px]">verified</span>
                                <span>{isEn ? 'Verified' : 'सत्यापित'}</span>
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-on-surface-variant flex items-center gap-1 mt-0.5">
                            <span className="material-symbols-outlined text-[13px] text-outline">location_on</span>
                            <span className="truncate">{lot.district || 'Meerut'}, {lot.state || 'UP'}</span>
                            <span className="text-outline">•</span>
                            <span className="text-primary font-semibold">{lot.distance}</span>
                          </p>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0">
                        {lot.availabilityStatus}
                      </span>
                    </div>

                    {/* Produce Highlight Box */}
                    <div className="p-3.5 rounded-2xl bg-surface-container-low/70 border border-outline-variant/30 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{CROP_ICONS[lot.crop] || '🌾'}</span>
                        <h3 className="font-bold text-sm text-on-surface truncate">
                          {isEn ? lot.variety : (lot.varietyHi || lot.variety)}
                        </h3>
                      </div>
                      <p className="text-xs text-on-surface-variant font-medium">
                        {isEn ? lot.qualityGrade : (lot.qualityGradeHi || lot.qualityGrade)}
                      </p>
                    </div>

                    {/* Quantity & Price Metric Row */}
                    <div className="grid grid-cols-2 gap-2 p-3 bg-primary/5 rounded-2xl border border-primary/10">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant block">
                          {isEn ? 'Available Lot' : 'उपलब्ध मात्रा'}
                        </span>
                        <span className="text-sm font-extrabold text-on-surface">
                          {lot.quantity}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant block">
                          {isEn ? 'Expected Price' : 'अपेक्षित भाव'}
                        </span>
                        <span className="text-sm font-extrabold text-primary">
                          {lot.priceFormatted}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons: [ Contact Farmer ] [ 💬 Chat ] [ View Produce ] */}
                    <div className="pt-2 mt-auto grid grid-cols-3 gap-2">
                      <a
                        href={`tel:${lot.farmerPhone || '9876543210'}`}
                        className="py-2.5 rounded-xl border border-outline-variant/50 text-xs font-bold text-on-surface hover:bg-surface-container flex items-center justify-center gap-1 transition-colors"
                        title={isEn ? 'Call Farmer' : 'कॉल करें'}
                      >
                        <span className="material-symbols-outlined text-[15px] text-primary">call</span>
                        <span className="truncate">{isEn ? 'Contact' : 'कॉल'}</span>
                      </a>

                      <button
                        type="button"
                        onClick={() => handleOpenChatWithFarmer(lot)}
                        className="py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-container active:scale-95 transition-all shadow-2xs flex items-center justify-center gap-1"
                        title={isEn ? 'Chat with Farmer' : 'चैट करें'}
                      >
                        <span className="material-symbols-outlined text-[15px]">chat</span>
                        <span>{isEn ? 'Chat' : 'चैट'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedLot(lot);
                          setIsDetailsOpen(true);
                        }}
                        className="py-2.5 rounded-xl bg-surface-container text-xs font-bold text-on-surface hover:bg-surface-container-high transition-colors flex items-center justify-center gap-1"
                      >
                        <span>{isEn ? 'Details' : 'विवरण'}</span>
                        <span className="material-symbols-outlined text-xs">arrow_forward</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════════════
          TAB 2: MY BUYING REQUIREMENTS (POST & MANAGE DEMANDS)
         ═════════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'requirements' && (
        <div className="space-y-5">
          <div className="flex items-center justify-between flex-wrap gap-3 p-5 bg-white rounded-3xl border border-outline-variant/30 shadow-2xs">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">assignment</span>
                <span>{isEn ? 'My Buying Requirements' : 'मेरी खरीद मांग'}</span>
              </h2>
              <p className="text-xs text-on-surface-variant mt-0.5">
                {isEn
                  ? 'Manage your active crop purchase requirements. Farmers discover these demands on their Best Buyers marketplace.'
                  : 'अपनी सक्रिय फसल खरीद मांग प्रबंधित करें। किसान इन्हें अपनी सर्वश्रेष्ठ खरीदार सूची में देखते हैं।'}
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setEditingReq(null);
                setIsReqModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-container shadow-xs active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              <span>{isEn ? 'Post Buying Requirement' : '+ नई मांग पोस्ट करें'}</span>
            </button>
          </div>

          {myRequirements.length === 0 ? (
            <div className="py-16 text-center bg-white rounded-3xl border border-outline-variant/40 p-8 space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-3xl">📋</div>
              <h3 className="font-bold text-base text-on-surface">
                {isEn ? 'No buying requirements posted yet' : 'कोई खरीद मांग पोस्ट नहीं की गई'}
              </h3>
              <p className="text-xs text-on-surface-variant max-w-sm mx-auto">
                {isEn
                  ? 'Post what crops and quantities you want to purchase. Farmers in your region will reach out directly.'
                  : 'बताएं कि आप कौन सी फसल और कितनी मात्रा में खरीदना चाहते हैं। किसान आपसे सीधे संपर्क करेंगे।'}
              </p>
              <button
                onClick={() => {
                  setEditingReq(null);
                  setIsReqModalOpen(true);
                }}
                className="px-6 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-container shadow-xs transition-all"
              >
                {isEn ? '+ Post Requirement Now' : '+ अभी मांग पोस्ट करें'}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myRequirements.map((req) => (
                <div
                  key={req.id}
                  className="bg-white rounded-3xl border border-outline-variant/30 p-5 shadow-2xs hover:shadow-sm transition-all space-y-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-amber-50 text-2xl flex items-center justify-center border border-amber-200 shrink-0">
                        {CROP_ICONS[req.crop] || '🌾'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-base text-on-surface leading-snug">
                            {req.crop}
                          </h3>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            req.status === 'Active'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-surface-container text-on-surface-variant border border-outline-variant/30'
                          }`}>
                            {req.status}
                          </span>
                        </div>
                        <p className="text-xs text-on-surface-variant font-medium mt-0.5">
                          {req.cropVariety}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setEditingReq(req);
                          setIsReqModalOpen(true);
                        }}
                        className="w-8 h-8 rounded-xl bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-outline hover:text-on-surface transition-colors"
                        title={isEn ? 'Edit' : 'संपादित करें'}
                      >
                        <span className="material-symbols-outlined text-sm">edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteRequirement(req.id)}
                        className="w-8 h-8 rounded-xl bg-error/10 hover:bg-error/20 flex items-center justify-center text-error transition-colors"
                        title={isEn ? 'Delete' : 'हटाएं'}
                      >
                        <span className="material-symbols-outlined text-sm">delete</span>
                      </button>
                    </div>
                  </div>

                  {/* Requirement Details Grid */}
                  <div className="grid grid-cols-2 gap-3 text-xs bg-surface-container-low/70 p-3.5 rounded-2xl border border-outline-variant/20">
                    <div>
                      <span className="text-on-surface-variant text-[10px] uppercase font-bold block">
                        {isEn ? 'Required Quantity' : 'आवश्यक मात्रा'}
                      </span>
                      <span className="font-bold text-on-surface text-sm">{req.quantity}</span>
                    </div>
                    <div>
                      <span className="text-on-surface-variant text-[10px] uppercase font-bold block">
                        {isEn ? 'Expected Price' : 'अपेक्षित मूल्य'}
                      </span>
                      <span className="font-bold text-primary text-sm">{req.expectedPriceRange}</span>
                    </div>
                    <div>
                      <span className="text-on-surface-variant text-[10px] uppercase font-bold block">
                        {isEn ? 'Location' : 'स्थान'}
                      </span>
                      <span className="font-medium text-on-surface truncate block">{req.location}</span>
                    </div>
                    <div>
                      <span className="text-on-surface-variant text-[10px] uppercase font-bold block">
                        {isEn ? 'Deadline' : 'समय सीमा'}
                      </span>
                      <span className="font-medium text-amber-800 truncate block">{req.purchaseDeadline}</span>
                    </div>
                  </div>

                  {req.qualityRequirements && (
                    <p className="text-xs text-on-surface-variant leading-relaxed">
                      <span className="font-bold text-on-surface">{isEn ? 'Quality Specs: ' : 'गुणवत्ता: '}</span>
                      {req.qualityRequirements}
                    </p>
                  )}

                  {/* Toggle Active / Close */}
                  <div className="pt-2 border-t border-outline-variant/20 flex items-center justify-between">
                    <span className="text-[11px] text-outline">
                      {isEn ? 'Live on Farmer Best Buyers page' : 'किसान सर्वश्रेष्ठ खरीदार पृष्ठ पर लाइव'}
                    </span>
                    <button
                      onClick={() => handleToggleRequirementStatus(req.id)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-colors ${
                        req.status === 'Active'
                          ? 'border-outline-variant/40 text-on-surface-variant hover:bg-surface-container'
                          : 'bg-emerald-50 border-emerald-300 text-emerald-800'
                      }`}
                    >
                      {req.status === 'Active'
                        ? (isEn ? 'Close Requirement' : 'मांग बंद करें')
                        : (isEn ? 'Reopen' : 'पुनः खोलें')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════════════
          TAB 3: COLD STORAGE & LOGISTICS
         ═════════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'storage' && (
        <div className="space-y-5">
          <div className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/30 shadow-2xs space-y-5">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h2 className="text-lg font-bold text-on-surface">
                  {isEn ? 'Cold Storage & Warehouses Near You 🏬' : 'निकटतम उपलब्ध भंडारण व गोदाम 🏬'}
                </h2>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  {isEn ? 'Store your purchased agricultural lots safely at certified local facilities' : 'अपनी खरीदी गई कृषि उपज को प्रमाणित कोल्ड स्टोरेज में सुरक्षित रखें'}
                </p>
              </div>
              <Link
                to="/storage"
                className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
              >
                <span>{isEn ? 'Open Full Storage Finder' : 'पूरा विवरण देखें'}</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {STORAGE_FACILITIES.slice(0, 6).map((f) => (
                <div
                  key={f.id}
                  className="p-4 rounded-2xl border border-outline-variant/30 bg-surface-container-low/30 hover:border-primary/40 transition-all flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-1.5">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary">
                      {f.type}
                    </span>
                    <h4 className="font-bold text-sm text-on-surface line-clamp-1">{f.name}</h4>
                    <p className="text-xs text-on-surface-variant flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">location_on</span>
                      {f.location} ({f.distance} km)
                    </p>
                    <p className="text-xs text-emerald-700 font-semibold">{f.availableCapacity} MT Available</p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-outline-variant/20">
                    <span className="text-xs font-bold text-primary">₹{f.pricePerQuintalPerMonth}/Qtl/mo</span>
                    <Link
                      to="/storage"
                      className="text-xs font-bold text-primary hover:underline"
                    >
                      {isEn ? 'Book Slot' : 'बुक करें'}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════════════
          TAB 4: BUYER PROFILE & SOURCING SPECS
         ═════════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/30 shadow-2xs space-y-5">
            <h3 className="font-bold text-base text-on-surface">
              {isEn ? 'Buyer Profile & Commercial Credentials' : 'खरीदार प्रोफाइल एवं व्यावसायिक विवरण'}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-surface-container-low border border-outline-variant/20">
                <span className="text-on-surface-variant block">{isEn ? 'Business Name' : 'व्यापारिक नाम'}</span>
                <span className="font-bold text-on-surface text-sm mt-0.5 block">{buyerName}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-surface-container-low border border-outline-variant/20">
                <span className="text-on-surface-variant block">{isEn ? 'Procurement Role' : 'खरीद भूमिका'}</span>
                <span className="font-bold text-primary text-sm mt-0.5 block">Wholesale Trader & Processor</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-surface-container-low border border-outline-variant/20">
                <span className="text-on-surface-variant block">{isEn ? 'Primary Hub / Mandi' : 'मुख्य मंडी'}</span>
                <span className="font-bold text-on-surface text-sm mt-0.5 block">{currentUser.location}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-surface-container-low border border-outline-variant/20">
                <span className="text-on-surface-variant block">{isEn ? 'Contact Mobile' : 'संपर्क नंबर'}</span>
                <span className="font-bold text-on-surface text-sm mt-0.5 block">+91 {currentUser.phone}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-surface-container-low border border-outline-variant/20">
                <span className="text-on-surface-variant block">{isEn ? 'GST Verification' : 'जीएसटी सत्यापन'}</span>
                <span className="font-bold text-emerald-700 text-sm mt-0.5 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[15px]">verified</span>
                  <span>09AAACK1234M1Z5 (Verified)</span>
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-surface-container-low border border-outline-variant/20">
                <span className="text-on-surface-variant block">{isEn ? 'Payment Settlement' : 'भुगतान अवधि'}</span>
                <span className="font-bold text-on-surface text-sm mt-0.5 block">Same-day / T+1 Direct Bank Transfer</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/50 p-6 rounded-3xl space-y-4">
            <span className="material-symbols-outlined text-amber-800 text-3xl">local_shipping</span>
            <h4 className="font-bold text-base text-amber-950">
              {isEn ? 'Resource Logistics & Transport' : 'परिवहन व लॉजिस्टिक्स'}
            </h4>
            <p className="text-xs text-amber-900/80 leading-relaxed">
              {isEn
                ? 'Need combine harvesters, trucks, or tractor trolleys to pick up produce from farm gates? Connect with nearby equipment providers.'
                : 'खेत से उपज लाने के लिए ट्रैक्टर-ट्रॉली या ट्रक की आवश्यकता है? निकटतम उपकरण प्रदाताओं से जुड़ें।'}
            </p>
            <Link
              to="/resources"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-900 text-white font-bold text-xs hover:bg-amber-950 transition-colors shadow-xs"
            >
              <span>{isEn ? 'Explore Resource Logistics' : 'लॉजिस्टिक्स देखें'}</span>
              <span className="material-symbols-outlined text-xs">arrow_forward</span>
            </Link>
          </div>
        </div>
      )}

      {/* ── Produce Lot Details Modal ── */}
      <ProduceDetailsModal
        lot={selectedLot}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        isEn={isEn}
        onChat={handleOpenChatWithFarmer}
        onContact={(lot) => window.open(`tel:${lot.farmerPhone || '9876543210'}`)}
      />

      {/* ── Post / Edit Requirement Modal ── */}
      <PostRequirementModal
        isOpen={isReqModalOpen}
        onClose={() => {
          setIsReqModalOpen(false);
          setEditingReq(null);
        }}
        onSave={handleSaveRequirement}
        isEn={isEn}
        initialData={editingReq}
      />

      {/* ── Shared Chat Modal (Chat Directly with Farmer) ── */}
      <ChatModal
        isOpen={isChatModalOpen}
        onClose={() => setIsChatModalOpen(false)}
        conversation={activeChatConversation}
        currentUser={currentUser}
        onSendMessage={handleSendMessage}
        lang={lang}
      />

      {/* ── Conversation List Modal ── */}
      <ConversationListModal
        isOpen={isConversationListOpen}
        onClose={() => setIsConversationListOpen(false)}
        conversations={conversations}
        onSelectConversation={(conv) => {
          setActiveChatConversation(conv);
          setIsConversationListOpen(false);
          setIsChatModalOpen(true);
        }}
        currentUser={currentUser}
        lang={lang}
      />

    </div>
  );
}
