import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSearchParams, useNavigate } from 'react-router-dom';
import DashboardSidebar from '../components/dashboard/DashboardSidebar';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import DashboardMobileNav from '../components/dashboard/DashboardMobileNav';

import {
  getStoredBuyers,
  saveStoredBuyers,
  CROP_FILTER_OPTIONS,
  BUYER_CATEGORY_OPTIONS,
  CROP_EMOJIS,
} from '../data/buyersData';

import { getStoredRequirements } from '../data/produceData';
import {
  getStoredConversations,
  saveStoredConversations,
  getOrCreateConversation,
  sendMessageToConversation,
  CHAT_UPDATE_EVENT
} from '../data/chatData';
import ChatModal from '../components/chat/ChatModal';
import ConversationListModal from '../components/chat/ConversationListModal';

// ─── Crop badge chip ──────────────────────────────────────────────────────────
function CropChip({ crop }) {
  const emoji = CROP_EMOJIS[crop] || '🌱';
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary/8 text-primary text-[11px] font-semibold border border-primary/20">
      <span>{emoji}</span>
      <span>{crop}</span>
    </span>
  );
}

// ─── Buyer card (Farmer view: Who will buy my crops?) ─────────────────────────
function BuyerCard({ buyer, isEn, onChat, onViewDetails, onContact, onSave, isSaved }) {
  const name    = isEn ? buyer.businessName    : (buyer.businessNameHi || buyer.businessName);
  const contact = isEn ? buyer.contactPerson   : (buyer.contactPersonHi || buyer.contactPerson);
  const type    = isEn ? buyer.buyerType       : (buyer.buyerTypeHi || buyer.buyerType);
  const loc     = isEn ? buyer.locationEn      : (buyer.locationHi || buyer.locationEn);
  const dist    = isEn ? buyer.distanceEn      : (buyer.distanceHi || buyer.distanceEn);
  const req     = isEn ? buyer.currentRequirement : (buyer.currentRequirementHi || buyer.currentRequirement);
  const crops   = isEn ? buyer.cropsPurchased  : (buyer.cropsPurchasedHi || buyer.cropsPurchased);
  const minQty  = isEn ? buyer.minQuantity     : (buyer.minQuantityHi || buyer.minQuantity);
  const terms   = isEn ? buyer.paymentTerms    : (buyer.paymentTermsHi || buyer.paymentTerms);

  const initials = name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="bg-white rounded-3xl border border-outline-variant/30 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden group">
      {/* Accent top bar */}
      <div className="h-1.5 bg-gradient-to-r from-primary via-emerald-600 to-amber-500 w-full" />

      <div className="p-5 flex flex-col gap-3.5 flex-1">
        {/* Header row */}
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold text-base shrink-0 border border-primary/20 shadow-2xs">
            {initials}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3 className="font-bold text-sm sm:text-base text-on-surface leading-tight truncate">
                {name}
              </h3>
              {buyer.verified && (
                <span className="flex items-center gap-0.5 px-1.5 py-0.2 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200 shrink-0">
                  <span className="material-symbols-outlined text-[12px]">verified</span>
                  <span>{isEn ? 'Verified Buyer' : 'सत्यापित खरीदार'}</span>
                </span>
              )}
            </div>
            <p className="text-xs text-on-surface-variant font-medium mt-0.5">{type}</p>
            {buyer.rating && (
              <div className="flex items-center gap-1 text-xs font-semibold text-amber-600 mt-1">
                <span className="material-symbols-outlined text-[13px] fill-amber-400">star</span>
                <span>{buyer.rating}</span>
                <span className="text-[10px] text-on-surface-variant font-normal">({buyer.reviewsCount})</span>
              </div>
            )}
          </div>

          {/* Bookmark Button */}
          <button
            type="button"
            onClick={() => onSave(buyer.id)}
            title={isSaved ? (isEn ? 'Saved' : 'सहेजा') : (isEn ? 'Save Buyer' : 'सहेजें')}
            className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all shrink-0 ${
              isSaved
                ? 'bg-red-50 border-red-300 text-red-500'
                : 'bg-surface-container border-outline-variant/40 text-outline hover:text-red-500 hover:border-red-200'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">
              {isSaved ? 'favorite' : 'favorite_border'}
            </span>
          </button>
        </div>

        {/* Location row */}
        <div className="flex items-center gap-1.5 text-xs text-on-surface-variant">
          <span className="material-symbols-outlined text-[15px] text-outline shrink-0">location_on</span>
          <span className="truncate">{loc}</span>
          {dist && (
            <span className="ml-auto shrink-0 text-primary font-bold text-[11px] bg-primary/5 px-2 py-0.5 rounded-md">
              {dist}
            </span>
          )}
        </div>

        {/* Crops purchased */}
        <div className="space-y-1">
          <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">
            {isEn ? 'Buys' : 'खरीदता है'}:
          </p>
          <div className="flex flex-wrap gap-1">
            {(crops || []).slice(0, 4).map((c, i) => (
              <CropChip key={i} crop={isEn ? c : (buyer.cropsPurchased?.[i] || c)} />
            ))}
            {crops?.length > 4 && (
              <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant text-[11px] font-medium border border-outline-variant/30">
                +{crops.length - 4} {isEn ? 'more' : 'और'}
              </span>
            )}
          </div>
        </div>

        {/* Current Requirement Banner */}
        {req && (
          <div className="px-3.5 py-2.5 bg-amber-50/80 border border-amber-200/80 rounded-2xl flex items-start gap-2">
            <span className="material-symbols-outlined text-[16px] text-amber-700 shrink-0 mt-0.5">campaign</span>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold text-amber-800 uppercase tracking-wide">
                {isEn ? 'Requirement' : 'मांग'}:
              </p>
              <p className="text-xs text-amber-950 font-bold truncate">{req}</p>
            </div>
          </div>
        )}

        {/* Minimum Quantity & Payment Terms */}
        <div className="grid grid-cols-2 gap-2 text-xs bg-surface-container-low/60 p-2.5 rounded-xl border border-outline-variant/20">
          <div>
            <span className="text-[10px] font-bold text-on-surface-variant uppercase block">
              {isEn ? 'Min Qty' : 'न्यूनतम'}
            </span>
            <span className="font-semibold text-on-surface text-[11px] truncate block">{minQty}</span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-on-surface-variant uppercase block">
              {isEn ? 'Payment Terms' : 'भुगतान'}
            </span>
            <span className="font-semibold text-primary text-[11px] truncate block">{terms}</span>
          </div>
        </div>

        {/* Action Buttons: [ Contact ] [ 💬 Chat ] [ View Details ] */}
        <div className="pt-2 mt-auto grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => onContact(buyer)}
            className="py-2.5 rounded-xl border border-outline-variant/50 text-xs font-bold text-on-surface hover:bg-surface-container flex items-center justify-center gap-1 transition-colors"
          >
            <span className="material-symbols-outlined text-[15px] text-primary">call</span>
            <span>{isEn ? 'Contact' : 'संपर्क'}</span>
          </button>

          <button
            type="button"
            onClick={() => onChat(buyer)}
            className="py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-container active:scale-95 transition-all shadow-2xs flex items-center justify-center gap-1"
          >
            <span className="material-symbols-outlined text-[15px]">chat</span>
            <span>{isEn ? 'Chat' : 'चैट'}</span>
          </button>

          <button
            type="button"
            onClick={() => onViewDetails(buyer)}
            className="py-2.5 rounded-xl bg-surface-container text-xs font-bold text-on-surface hover:bg-surface-container-high transition-colors flex items-center justify-center gap-1"
          >
            <span>{isEn ? 'Details' : 'विवरण'}</span>
            <span className="material-symbols-outlined text-xs">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Active Demand Card (Live Buying Requirements posted by Buyers) ───────────
function DemandCard({ demand, isEn, onChat, onContact }) {
  const emoji = CROP_EMOJIS[demand.crop] || '🌾';

  return (
    <div className="bg-white rounded-3xl border border-outline-variant/30 p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between gap-4">
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-2xl flex items-center justify-center border border-amber-200 shrink-0">
              {emoji}
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                  {isEn ? 'Looking to Buy' : 'खरीद मांग'}
                </span>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  {demand.quantity}
                </span>
              </div>
              <h3 className="font-bold text-base text-on-surface mt-1">
                {demand.crop} ({demand.cropVariety || 'Standard Grade'})
              </h3>
            </div>
          </div>
        </div>

        {/* Buyer Info */}
        <div className="p-3 bg-surface-container-low rounded-2xl border border-outline-variant/20 flex items-center justify-between text-xs">
          <div>
            <p className="font-bold text-on-surface flex items-center gap-1">
              <span className="material-symbols-outlined text-sm text-primary">storefront</span>
              <span>{demand.buyerName}</span>
            </p>
            <p className="text-[11px] text-on-surface-variant flex items-center gap-1 mt-0.5">
              <span className="material-symbols-outlined text-[13px] text-outline">location_on</span>
              <span>{demand.location}</span>
            </p>
          </div>
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-on-surface-variant block">
              {isEn ? 'Offering Rate' : 'अपेक्षित भाव'}
            </span>
            <span className="font-extrabold text-primary text-xs">{demand.expectedPriceRange}</span>
          </div>
        </div>

        {/* Specs & Deadline */}
        <div className="space-y-1 text-xs text-on-surface-variant">
          {demand.qualityRequirements && (
            <p className="truncate">
              <span className="font-semibold text-on-surface">{isEn ? 'Specs: ' : 'शर्त: '}</span>
              {demand.qualityRequirements}
            </p>
          )}
          {demand.purchaseDeadline && (
            <p className="flex items-center gap-1 text-amber-800 font-medium text-[11px]">
              <span className="material-symbols-outlined text-[13px]">schedule</span>
              <span>{demand.purchaseDeadline}</span>
            </p>
          )}
        </div>
      </div>

      {/* Action Buttons: [ Contact Buyer ] [ 💬 Chat ] */}
      <div className="pt-2 border-t border-outline-variant/20 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => onContact(demand)}
          className="py-2.5 rounded-xl border border-outline-variant/50 text-xs font-bold text-on-surface hover:bg-surface-container flex items-center justify-center gap-1 transition-colors"
        >
          <span className="material-symbols-outlined text-[15px] text-primary">call</span>
          <span>{isEn ? 'Contact Buyer' : 'कॉल करें'}</span>
        </button>

        <button
          type="button"
          onClick={() => onChat(demand)}
          className="py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-container active:scale-95 transition-all shadow-2xs flex items-center justify-center gap-1"
        >
          <span className="material-symbols-outlined text-[15px]">chat</span>
          <span>{isEn ? 'Chat Buyer' : 'चैट करें'}</span>
        </button>
      </div>
    </div>
  );
}

// ─── Buyer Details Modal ──────────────────────────────────────────────────────
function BuyerDetailsModal({ buyer, isOpen, onClose, isEn, onChat, onContact }) {
  if (!isOpen || !buyer) return null;

  const name    = isEn ? buyer.businessName   : (buyer.businessNameHi || buyer.businessName);
  const contact = isEn ? buyer.contactPerson  : (buyer.contactPersonHi || buyer.contactPerson);
  const type    = isEn ? buyer.buyerType      : (buyer.buyerTypeHi || buyer.buyerType);
  const loc     = isEn ? buyer.locationEn     : (buyer.locationHi || buyer.locationEn);
  const req     = isEn ? buyer.currentRequirement : (buyer.currentRequirementHi || buyer.currentRequirement);
  const minQty  = isEn ? buyer.minQuantity    : (buyer.minQuantityHi || buyer.minQuantity);
  const terms   = isEn ? buyer.paymentTerms   : (buyer.paymentTermsHi || buyer.paymentTerms);
  const freq    = isEn ? buyer.buyingFrequency: (buyer.buyingFrequencyHi || buyer.buyingFrequency);
  const desc    = isEn ? buyer.descEn         : (buyer.descHi || buyer.descEn);
  const crops   = buyer.cropsPurchased || [];
  const initials = name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs" onClick={onClose}>
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden border border-outline-variant/30"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 pt-5 pb-4 border-b border-outline-variant/20 flex items-start gap-3">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold text-lg border border-primary/20 shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-bold text-base text-on-surface leading-tight">{name}</h2>
              {buyer.verified && (
                <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                  <span className="material-symbols-outlined text-[12px]">verified</span>
                  <span>{isEn ? 'Verified Buyer' : 'सत्यापित खरीदार'}</span>
                </span>
              )}
            </div>
            <p className="text-xs text-on-surface-variant mt-0.5">{type}</p>
            <p className="text-xs text-primary font-medium mt-0.5 flex items-center gap-1">
              <span className="material-symbols-outlined text-[13px]">person</span>{contact}
            </p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-outline hover:text-on-surface">
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        <div className="overflow-y-auto p-5 space-y-4">
          <div className="flex items-start gap-2 text-sm text-on-surface-variant">
            <span className="material-symbols-outlined text-[16px] text-outline mt-0.5">location_on</span>
            <span>{loc}</span>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
              {isEn ? 'Crops Purchased' : 'खरीदी जाने वाली फसलें'}
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {crops.map((c, i) => <CropChip key={i} crop={c} />)}
            </div>
          </div>

          {req && (
            <div className="px-4 py-3 bg-amber-50 border border-amber-200 rounded-2xl">
              <p className="text-[10px] font-bold text-amber-700 uppercase tracking-wide mb-1">
                {isEn ? 'Current Need & Requirement' : 'वर्तमान मांग'}
              </p>
              <p className="text-sm text-amber-800 font-bold">{req}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-surface-container-low rounded-xl p-3 border border-outline-variant/20">
              <span className="text-[10px] font-bold text-on-surface-variant uppercase block">
                {isEn ? 'Min Quantity' : 'न्यूनतम मात्रा'}
              </span>
              <span className="font-semibold text-on-surface">{minQty}</span>
            </div>
            <div className="bg-surface-container-low rounded-xl p-3 border border-outline-variant/20">
              <span className="text-[10px] font-bold text-on-surface-variant uppercase block">
                {isEn ? 'Payment Terms' : 'भुगतान अवधि'}
              </span>
              <span className="font-semibold text-primary">{terms}</span>
            </div>
            {freq && (
              <div className="bg-surface-container-low rounded-xl p-3 border border-outline-variant/20">
                <span className="text-[10px] font-bold text-on-surface-variant uppercase block">
                  {isEn ? 'Procurement Cycle' : 'खरीद चक्र'}
                </span>
                <span className="font-semibold text-on-surface">{freq}</span>
              </div>
            )}
            {buyer.gstNumber && (
              <div className="bg-surface-container-low rounded-xl p-3 border border-outline-variant/20">
                <span className="text-[10px] font-bold text-on-surface-variant uppercase block">
                  {isEn ? 'GST Verification' : 'GST नंबर'}
                </span>
                <span className="font-semibold text-emerald-700 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px]">verified</span>
                  <span>{buyer.gstNumber}</span>
                </span>
              </div>
            )}
          </div>

          {desc && (
            <div className="p-3.5 bg-surface-container-low rounded-2xl text-xs text-on-surface-variant leading-relaxed">
              <p className="font-bold text-on-surface mb-1">{isEn ? 'About the Buyer' : 'खरीदार के बारे में'}:</p>
              <p>{desc}</p>
            </div>
          )}
        </div>

        <div className="p-4 bg-surface-container-low border-t border-outline-variant/30 flex items-center justify-end gap-3">
          <button
            onClick={() => onContact(buyer)}
            className="px-4 py-2.5 rounded-xl border border-outline-variant/60 text-xs font-bold text-on-surface hover:bg-surface-container flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-sm text-primary">call</span>
            <span>{isEn ? 'Call Buyer' : 'कॉल करें'}</span>
          </button>
          <button
            onClick={() => {
              onClose();
              onChat(buyer);
            }}
            className="px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-container shadow-xs flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-sm">chat</span>
            <span>{isEn ? 'Chat with Buyer' : 'खरीदार से चैट करें'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// EXPORT: BestBuyersPage (FARMER SIDE)
// ─────────────────────────────────────────────────────────────────────────────
export default function BestBuyersPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // If a Buyer role accesses /buyers, immediately route them to their dedicated Buyer Dashboard!
  useEffect(() => {
    if (user?.role === 'buyer') {
      navigate('/buyer-dashboard', { replace: true });
    }
  }, [user, navigate]);

  const currentUser = useMemo(() => ({
    id:       user?.id       || 'user_farmer_01',
    name:     user?.name     || 'Rajesh Kumar',
    role:     'farmer',
    phone:    user?.phone    || '9876543210',
    initials: user?.initials || 'RK',
    location: user?.location || 'Meerut, UP',
  }), [user]);

  const [lang, setLang] = useState('en');
  const isEn = lang === 'en';
  const [activeNav, setActiveNav] = useState('bestBuyers');

  // ── Buyers Data ────────────────────────────────────────────────────────────
  const [buyers, setBuyers] = useState(() => getStoredBuyers());

  useEffect(() => {
    saveStoredBuyers(buyers);
  }, [buyers]);

  // ── Live Buying Requirements (posted by Buyers) ────────────────────────────
  const [liveRequirements] = useState(() => getStoredRequirements());

  // ── Active Tab ─────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState('marketplace'); // 'marketplace' | 'demands' | 'saved'

  // ── Filters ────────────────────────────────────────────────────────────────
  const [searchQuery, setSearchQuery]       = useState('');
  const [selectedCrop, setSelectedCrop]     = useState('all');
  const [selectedType, setSelectedType]     = useState('all');
  const [selectedPayment, setSelectedPayment] = useState('all');
  const [verifiedOnly, setVerifiedOnly]     = useState(false);
  const [savedIds, setSavedIds] = useState(() => {
    try { return JSON.parse(localStorage.getItem('farmer_helper_saved_buyers') || '[]'); }
    catch { return []; }
  });

  const handleToggleSave = (id) => {
    setSavedIds((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      localStorage.setItem('farmer_helper_saved_buyers', JSON.stringify(next));
      return next;
    });
  };

  // ── Chat State ─────────────────────────────────────────────────────────────
  const [conversations, setConversations] = useState(() => getStoredConversations());
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [activeChatConversation, setActiveChatConversation] = useState(null);
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
  const [selectedBuyer, setSelectedBuyer] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // ── Filtered Buyers List ───────────────────────────────────────────────────
  const filteredBuyers = useMemo(() => {
    return buyers.filter((b) => {
      const qLower = searchQuery.toLowerCase();
      const matchSearch = !searchQuery ||
        b.businessName?.toLowerCase().includes(qLower) ||
        b.contactPerson?.toLowerCase().includes(qLower) ||
        b.locationEn?.toLowerCase().includes(qLower) ||
        b.buyerType?.toLowerCase().includes(qLower) ||
        (b.cropsPurchased || []).some((c) => c.toLowerCase().includes(qLower));

      const matchCrop = selectedCrop === 'all' ||
        (b.cropsPurchased || []).some((c) => c.toLowerCase().includes(selectedCrop.toLowerCase()));

      const matchType = selectedType === 'all' || b.buyerCategory === selectedType;
      const matchVerified = !verifiedOnly || b.verified;

      const matchPayment = selectedPayment === 'all' ||
        (selectedPayment === 'immediate' && (b.paymentTerms?.toLowerCase().includes('same-day') || b.paymentTerms?.toLowerCase().includes('immediate') || b.paymentTerms?.toLowerCase().includes('next-day'))) ||
        (selectedPayment === 'auction' && b.paymentTerms?.toLowerCase().includes('mandi'));

      return matchSearch && matchCrop && matchType && matchVerified && matchPayment;
    });
  }, [buyers, searchQuery, selectedCrop, selectedType, verifiedOnly, selectedPayment]);

  // ── Filtered Live Demands List ─────────────────────────────────────────────
  const filteredDemands = useMemo(() => {
    return liveRequirements.filter((r) => {
      const qLower = searchQuery.toLowerCase();
      const matchSearch = !searchQuery ||
        r.crop?.toLowerCase().includes(qLower) ||
        r.buyerName?.toLowerCase().includes(qLower) ||
        r.location?.toLowerCase().includes(qLower);

      const matchCrop = selectedCrop === 'all' || r.crop?.toLowerCase() === selectedCrop.toLowerCase();
      const matchVerified = !verifiedOnly || r.verifiedBuyer;

      return matchSearch && matchCrop && matchVerified;
    });
  }, [liveRequirements, searchQuery, selectedCrop, verifiedOnly]);

  const savedBuyers = useMemo(
    () => buyers.filter((b) => savedIds.includes(b.id)),
    [buyers, savedIds]
  );

  // ── Chat Trigger Handler: Farmer initiates Chat with Buyer ─────────────────
  const handleOpenChat = (buyerOrDemand) => {
    const isDemand = Boolean(demandId(buyerOrDemand));
    const buyerId = isDemand ? (buyerOrDemand.buyerId || 'buyer_seed_01') : buyerOrDemand.id;
    const buyerOwnerId = isDemand ? (buyerOrDemand.buyerOwnerId || 'user_buyer_01') : (buyerOrDemand.ownerId || 'user_buyer_01');
    const buyerName = isDemand ? buyerOrDemand.buyerName : (isEn ? buyerOrDemand.businessName : (buyerOrDemand.businessNameHi || buyerOrDemand.businessName));
    const phone = isDemand ? buyerOrDemand.buyerPhone : buyerOrDemand.phone;

    const defaultMsg = isDemand
      ? `Namaste! I saw your requirement for ${buyerOrDemand.crop} (${buyerOrDemand.quantity}). I have quality produce ready for sale from my farm in ${currentUser.location}. Could you share your purchase terms?`
      : `Namaste! I am interested in selling my agricultural produce to ${buyerName}. Could you share your current buying requirements and prices?`;

    const conv = getOrCreateConversation({
      currentUser,
      targetUser: {
        id: buyerOwnerId,
        name: buyerName,
        businessName: buyerName,
        role: 'buyer',
        phone: phone || '9988776655',
        location: isDemand ? buyerOrDemand.location : buyerOrDemand.locationEn
      },
      context: {
        type: 'produce',
        id: buyerId,
        title: buyerName,
        subtitle: isDemand ? buyerOrDemand.crop : 'Direct Agricultural Sale'
      },
      initialText: defaultMsg
    });

    setConversations(getStoredConversations());
    setActiveChatConversation(conv);
    setIsChatModalOpen(true);
  };

  function demandId(item) {
    return item?.expectedPriceRange || item?.buyerOwnerId;
  }

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

  const handleContactBuyer = (buyerOrDemand) => {
    const phone = buyerOrDemand.buyerPhone || buyerOrDemand.phone || '9988776655';
    window.open(`tel:${phone}`);
  };

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col lg:flex-row font-sans selection:bg-primary-container selection:text-white">
      {/* Sidebar */}
      <DashboardSidebar activeNav={activeNav} setActiveNav={setActiveNav} lang={lang} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <DashboardHeader lang={lang} setLang={setLang} />

        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 pb-24 lg:pb-8 space-y-6 overflow-x-hidden">
          
          {/* ── Page Hero: Best Buyers / Marketplace for Farmers ── */}
          <div className="relative bg-gradient-to-br from-primary/10 via-surface to-emerald-50 rounded-3xl p-5 sm:p-7 border border-outline-variant/30 overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full -mr-16 -mt-16 pointer-events-none" />
            <div className="relative z-10 flex items-start justify-between flex-wrap gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-10 h-10 rounded-2xl bg-primary/15 text-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-[22px]">storefront</span>
                  </div>
                  <h1 className="font-bold text-xl sm:text-2xl text-on-surface">
                    {isEn ? 'Best Buyers / Marketplace' : 'सर्वश्रेष्ठ खरीदार / मार्केटप्लेस'}
                  </h1>
                </div>

                <p className="text-sm text-on-surface-variant max-w-xl leading-relaxed">
                  {isEn
                    ? 'Find buyers for your crops. Discover verified mandi traders, wholesale buyers, food processors, and direct exporters offering the best procurement prices.'
                    : 'अपनी फसलों के लिए खरीदार खोजें। सर्वोत्तम खरीद भाव देने वाले सत्यापित मंडी व्यापारियों, थोक खरीदारों, खाद्य प्रोसेसर्स और निर्यातकों से सीधे जुड़ें।'}
                </p>

                <div className="flex items-center gap-2 mt-2 text-xs text-primary font-semibold">
                  <span className="material-symbols-outlined text-[15px]">location_on</span>
                  <span>{isEn ? `Showing buyers near ${currentUser.location}` : `${currentUser.location} के पास के खरीदार`}</span>
                </div>
              </div>

              {/* Messages button */}
              <button
                onClick={() => setIsConversationListOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white border border-outline-variant/40 text-xs sm:text-sm font-bold text-on-surface hover:bg-surface-container transition-all shadow-2xs"
              >
                <span className="material-symbols-outlined text-[18px] text-primary">chat</span>
                <span>{isEn ? 'My Inquiries & Chats' : 'मेरी बातचीत व चैट'}</span>
              </button>
            </div>

            {/* Quick Stats Ticker */}
            <div className="flex items-center gap-5 mt-4 pt-3 border-t border-outline-variant/20 flex-wrap text-xs">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-primary">storefront</span>
                <span className="font-bold text-on-surface">{buyers.length}</span>
                <span className="text-on-surface-variant">{isEn ? 'Registered Buyers' : 'पंजीकृत खरीदार'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-emerald-700">verified</span>
                <span className="font-bold text-on-surface">{buyers.filter((b) => b.verified).length}</span>
                <span className="text-on-surface-variant">{isEn ? 'Verified Mandis & Traders' : 'सत्यापित व्यापारी'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-amber-700">campaign</span>
                <span className="font-bold text-on-surface">{liveRequirements.length}</span>
                <span className="text-on-surface-variant">{isEn ? 'Active Buying Demands' : 'सक्रिय खरीद मांग'}</span>
              </div>
            </div>
          </div>

          {/* ── Tabs: [All Buyers] [Active Buyer Demands 📢] [Saved Buyers ❤️] ── */}
          <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
            {[
              { id: 'marketplace', icon: 'storefront', labelEn: 'All Buyers', labelHi: 'सभी खरीदार', count: buyers.length },
              { id: 'demands',     icon: 'campaign',   labelEn: 'Active Buyer Demands', labelHi: 'सक्रिय खरीद मांग', count: liveRequirements.length },
              { id: 'saved',       icon: 'favorite',   labelEn: 'Saved Buyers', labelHi: 'सहेजे खरीदार', count: savedIds.length },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all shrink-0 ${
                  activeTab === tab.id
                    ? 'bg-primary text-white shadow-xs'
                    : 'bg-white border border-outline-variant/40 text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">{tab.icon}</span>
                <span>{isEn ? tab.labelEn : tab.labelHi}</span>
                {tab.count !== undefined && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-surface-container-high text-on-surface-variant'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* ── Search & Filter Controls (Farmer-Centric) ── */}
          <div className="bg-white rounded-3xl border border-outline-variant/30 p-4 sm:p-5 space-y-3.5 shadow-2xs">
            {/* Search Box */}
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[18px] text-outline pointer-events-none">search</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isEn ? 'Search crops, buyers, mandis...' : 'फसल, खरीदार, मंडी खोजें...'}
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-surface-container-low border border-outline-variant/30 text-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface">
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              )}
            </div>

            {/* Filter Dropdowns */}
            <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1 flex-wrap">
              {/* Crop Filter */}
              <select
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
                className="px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs font-semibold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                {CROP_FILTER_OPTIONS.map((o) => (
                  <option key={o.id} value={o.id}>{o.icon} {isEn ? o.labelEn : o.labelHi}</option>
                ))}
              </select>

              {/* Buyer Type Filter */}
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs font-semibold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                {BUYER_CATEGORY_OPTIONS.map((o) => (
                  <option key={o.id} value={o.id}>{isEn ? o.labelEn : o.labelHi}</option>
                ))}
              </select>

              {/* Payment Terms Filter */}
              <select
                value={selectedPayment}
                onChange={(e) => setSelectedPayment(e.target.value)}
                className="px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs font-semibold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="all">{isEn ? 'All Payment Terms' : 'सभी भुगतान शर्तें'}</option>
                <option value="immediate">{isEn ? 'Same-day / Immediate' : 'उसी दिन भुगतान'}</option>
                <option value="auction">{isEn ? 'Mandi APMC Standard' : 'मंडी नीलामी भुगतान'}</option>
              </select>

              {/* Verified Toggle */}
              <button
                type="button"
                onClick={() => setVerifiedOnly((p) => !p)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition-all ${
                  verifiedOnly
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                    : 'bg-surface-container-low border-outline-variant/30 text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                <span className="material-symbols-outlined text-[14px]">verified</span>
                <span>{isEn ? 'Verified Buyers' : 'सत्यापित खरीदार'}</span>
              </button>

              {/* Reset */}
              {(searchQuery || selectedCrop !== 'all' || selectedType !== 'all' || selectedPayment !== 'all' || verifiedOnly) && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCrop('all');
                    setSelectedType('all');
                    setSelectedPayment('all');
                    setVerifiedOnly(false);
                  }}
                  className="flex items-center gap-1 px-3 py-2 rounded-xl bg-error/8 border border-error/25 text-error text-xs font-semibold hover:bg-error/15 transition-all"
                >
                  <span className="material-symbols-outlined text-[14px]">filter_alt_off</span>
                  <span>{isEn ? 'Clear' : 'हटाएं'}</span>
                </button>
              )}
            </div>
          </div>

          {/* ── TAB 1: ALL BUYERS ── */}
          {activeTab === 'marketplace' && (
            <div className="space-y-4">
              {filteredBuyers.length === 0 ? (
                <div className="py-16 text-center bg-white rounded-3xl border border-outline-variant/40 p-8 space-y-4">
                  <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center mx-auto text-3xl">🛒</div>
                  <h3 className="font-bold text-base text-on-surface">
                    {isEn ? 'No buyers found for this crop or criteria' : 'इस फसल के लिए कोई खरीदार नहीं मिला'}
                  </h3>
                  <p className="text-xs text-on-surface-variant max-w-sm mx-auto">
                    {isEn ? 'Try adjusting your crop or buyer category filters.' : 'अपनी फसल या खरीदार श्रेणी फ़िल्टर बदलकर पुनः देखें।'}
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCrop('all');
                      setSelectedType('all');
                      setSelectedPayment('all');
                      setVerifiedOnly(false);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-container transition-all"
                  >
                    {isEn ? 'Show All Buyers' : 'सभी खरीदार दिखाएं'}
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {filteredBuyers.map((buyer) => (
                    <BuyerCard
                      key={buyer.id}
                      buyer={buyer}
                      isEn={isEn}
                      onChat={handleOpenChat}
                      onContact={handleContactBuyer}
                      onViewDetails={(b) => { setSelectedBuyer(b); setIsDetailsOpen(true); }}
                      onSave={handleToggleSave}
                      isSaved={savedIds.includes(buyer.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── TAB 2: ACTIVE BUYER DEMANDS ── */}
          {activeTab === 'demands' && (
            <div className="space-y-4">
              <div className="p-4 bg-amber-50/70 border border-amber-200/60 rounded-2xl flex items-center gap-3">
                <span className="material-symbols-outlined text-amber-700 text-2xl">campaign</span>
                <p className="text-xs text-amber-950 font-medium leading-relaxed">
                  {isEn
                    ? 'These are urgent live purchasing demands posted directly by verified agricultural buyers. Contact or chat with them to confirm farm gate pickup.'
                    : 'ये सत्यापित कृषि खरीदारों द्वारा सीधे पोस्ट की गई तत्काल खरीद मांगें हैं। खेत से उठान तय करने के लिए इनसे सीधे संपर्क करें।'}
                </p>
              </div>

              {filteredDemands.length === 0 ? (
                <div className="py-16 text-center bg-white rounded-3xl border border-outline-variant/40 p-8 space-y-4">
                  <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center mx-auto text-3xl">📋</div>
                  <h3 className="font-bold text-base text-on-surface">
                    {isEn ? 'No active requirements matching criteria' : 'कोई सक्रिय मांग नहीं मिली'}
                  </h3>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {filteredDemands.map((demand) => (
                    <DemandCard
                      key={demand.id}
                      demand={demand}
                      isEn={isEn}
                      onChat={handleOpenChat}
                      onContact={handleContactBuyer}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── TAB 3: SAVED BUYERS ── */}
          {activeTab === 'saved' && (
            <div className="space-y-4">
              {savedBuyers.length === 0 ? (
                <div className="py-16 text-center bg-white rounded-3xl border border-outline-variant/40 p-8 space-y-4">
                  <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto text-3xl">❤️</div>
                  <h3 className="font-bold text-base text-on-surface">
                    {isEn ? 'No saved buyers yet' : 'कोई सहेजा गया खरीदार नहीं'}
                  </h3>
                  <p className="text-xs text-on-surface-variant max-w-sm mx-auto">
                    {isEn ? 'Save buyers by clicking the heart icon on any buyer card for quick future access.' : 'भविष्य में त्वरित पहुंच के लिए किसी भी खरीदार कार्ड पर दिल के आइकन पर क्लिक करें।'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {savedBuyers.map((buyer) => (
                    <BuyerCard
                      key={buyer.id}
                      buyer={buyer}
                      isEn={isEn}
                      onChat={handleOpenChat}
                      onContact={handleContactBuyer}
                      onViewDetails={(b) => { setSelectedBuyer(b); setIsDetailsOpen(true); }}
                      onSave={handleToggleSave}
                      isSaved={true}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

        </main>
      </div>

      {/* Mobile Nav */}
      <DashboardMobileNav activeNav={activeNav} setActiveNav={setActiveNav} lang={lang} />

      {/* ── Modals ── */}
      <BuyerDetailsModal
        buyer={selectedBuyer}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        isEn={isEn}
        onChat={handleOpenChat}
        onContact={handleContactBuyer}
      />

      <ChatModal
        isOpen={isChatModalOpen}
        onClose={() => setIsChatModalOpen(false)}
        conversation={activeChatConversation}
        currentUser={currentUser}
        onSendMessage={handleSendMessage}
        lang={lang}
      />

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
