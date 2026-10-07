import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { initialResources } from '../../data/resourceContent';

export default function ProviderDashboardView({ lang = 'en' }) {
  const isEn = lang === 'en';
  const navigate = useNavigate();
  const { user } = useAuth();

  const providerName = isEn
    ? (user?.businessName || user?.name || 'Sardar Gurpreet Singh')
    : (user?.nameHi || user?.businessName || user?.name || 'सरदार गुरप्रीत सिंह');

  // Provider's own managed equipment listings
  const [myListings, setMyListings] = useState([
    {
      id: 'PL-01',
      titleEn: 'Mahindra 575 DI Tractor (45 HP)',
      titleHi: 'महिंद्रा 575 डीआई ट्रैक्टर (45 एचपी)',
      category: 'Tractor',
      price: '₹1,200/day',
      available: true,
      totalBookings: 24,
      condition: 'Excellent',
    },
    {
      id: 'PL-02',
      titleEn: 'John Deere Multicrop Harvester',
      titleHi: 'जॉन डीयर मल्टीक्रॉप हार्वेस्टर',
      category: 'Harvester',
      price: '₹2,500/hr',
      available: true,
      totalBookings: 18,
      condition: 'Field Ready',
    },
    {
      id: 'PL-03',
      titleEn: '12-Member Farm Labour Squad',
      titleHi: '12 सदस्यीय कृषि मजदूर टीम',
      category: 'Farm Labour',
      price: '₹450/worker/day',
      available: false,
      totalBookings: 42,
      condition: 'Booked till 28 Sep',
    },
  ]);

  // Recent farmer rental requests
  const [requests, setRequests] = useState([
    {
      id: 'REQ-101',
      farmerEn: 'Rajesh Kumar (Khanna Village)',
      farmerHi: 'राजेश कुमार (खन्ना गांव)',
      equipment: 'Mahindra 575 DI Tractor',
      days: '3 Days (Plowing)',
      dates: '26 Sep - 28 Sep',
      amount: '₹3,600',
      status: 'pending',
    },
    {
      id: 'REQ-102',
      farmerEn: 'Kuldeep Verma (Meerut Rural)',
      farmerHi: 'कुलदीप वर्मा (मेरठ ग्रामीण)',
      equipment: 'John Deere Harvester',
      days: '4 Hours (Paddy Field)',
      dates: '27 Sep',
      amount: '₹10,000',
      status: 'pending',
    },
  ]);

  const toggleAvailability = (id) => {
    setMyListings((prev) =>
      prev.map((item) => (item.id === id ? { ...item, available: !item.available } : item))
    );
  };

  const handleRequestAction = (id, newStatus) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
  };

  return (
    <div className="space-y-8">
      {/* ── Welcome Banner ── */}
      <div className="bg-gradient-to-r from-emerald-900 via-primary-container to-emerald-800 text-white rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 flex items-center justify-center pointer-events-none select-none">
          <span className="material-symbols-outlined text-[180px]">handshake</span>
        </div>

        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-semibold text-white/90">
            <span className="material-symbols-outlined text-[16px]">agriculture</span>
            <span>{isEn ? 'Equipment & Resource Provider Portal' : 'संसाधन व मशीनरी प्रदाता पोर्टल'}</span>
          </div>

          <h1 className="font-headline-lg text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
            {isEn ? `Welcome, ${providerName} 🚜` : `स्वागत है, ${providerName} 🚜`}
          </h1>

          <p className="text-white/90 text-sm sm:text-base leading-relaxed">
            {isEn
              ? 'Manage your agricultural resources and connect with farmers.'
              : 'अपने कृषि संसाधनों का प्रबंधन करें और स्थानीय किसानों से जुड़ें।'}
          </p>

          {/* Quick buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              to="/resources"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-primary font-bold text-xs sm:text-sm hover:bg-white/90 active:scale-95 transition-all shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px]">add_circle</span>
              <span>{isEn ? 'List New Equipment' : 'नया साधन जोड़ें'}</span>
            </Link>

            <Link
              to="/resources"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/20 hover:bg-white/30 text-white font-bold text-xs sm:text-sm active:scale-95 transition-all backdrop-blur-xs border border-white/20"
            >
              <span className="material-symbols-outlined text-[18px]">inventory</span>
              <span>{isEn ? 'Browse All Resources' : 'सभी साधन देखें'}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Key Metrics Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            titleEn: 'Active Listings',
            titleHi: 'सक्रिय साधन',
            val: myListings.length,
            icon: 'inventory_2',
            color: 'text-primary',
            bg: 'bg-primary/10',
          },
          {
            titleEn: 'Pending Requests',
            titleHi: 'लंबित अनुरोध',
            val: requests.filter((r) => r.status === 'pending').length,
            icon: 'pending_actions',
            color: 'text-amber-700',
            bg: 'bg-amber-500/10',
          },
          {
            titleEn: 'Monthly Revenue',
            titleHi: 'मासिक आय',
            val: '₹42,500',
            icon: 'payments',
            color: 'text-emerald-700',
            bg: 'bg-emerald-500/10',
          },
          {
            titleEn: 'Service Rating',
            titleHi: 'सेवा रेटिंग',
            val: '4.9 ★',
            icon: 'star',
            color: 'text-yellow-600',
            bg: 'bg-yellow-500/10',
          },
        ].map((m, idx) => (
          <div
            key={idx}
            className="bg-surface-container-lowest p-4 sm:p-5 rounded-2xl border border-outline-variant/30 shadow-2xs flex items-center gap-3.5"
          >
            <div className={`w-11 h-11 rounded-xl ${m.bg} ${m.color} flex items-center justify-center shrink-0`}>
              <span className="material-symbols-outlined text-2xl">{m.icon}</span>
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold text-on-surface leading-tight">{m.val}</p>
              <p className="text-xs text-on-surface-variant font-medium mt-0.5">
                {isEn ? m.titleEn : m.titleHi}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Main Bento Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* My Listed Resources & Availability Manager (8 cols) */}
        <div className="lg:col-span-8 bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/30 shadow-2xs space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-on-surface">
                {isEn ? 'My Listed Farm Resources 🚜' : 'मेरे सूचीबद्ध कृषि संसाधन 🚜'}
              </h2>
              <p className="text-xs text-on-surface-variant mt-0.5">
                {isEn ? 'Toggle availability and manage rental pricing for farmers' : 'उपलब्धता और दैनिक किराया प्रबंधित करें'}
              </p>
            </div>
            <Link
              to="/resources"
              className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
            >
              <span>{isEn ? 'Add Resource' : 'साधन जोड़ें'}</span>
              <span className="material-symbols-outlined text-sm">add</span>
            </Link>
          </div>

          <div className="space-y-3.5">
            {myListings.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl border border-outline-variant/30 bg-surface-container-low/40 hover:bg-surface-container-low transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary">
                      {item.category}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        item.available
                          ? 'bg-emerald-500/10 text-emerald-700'
                          : 'bg-error/10 text-error'
                      }`}
                    >
                      {item.available ? (isEn ? 'Available' : 'उपलब्ध') : (isEn ? 'Booked' : 'व्यस्त')}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-on-surface truncate">
                    {isEn ? item.titleEn : item.titleHi}
                  </h3>

                  <div className="flex items-center gap-3 text-xs text-on-surface-variant pt-1">
                    <span className="font-bold text-primary text-sm">{item.price}</span>
                    <span>•</span>
                    <span>{item.totalBookings} Completed Bookings</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => toggleAvailability(item.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      item.available
                        ? 'bg-surface-container border border-outline-variant/50 text-on-surface hover:bg-error/10 hover:text-error'
                        : 'bg-emerald-600 text-white hover:bg-emerald-700'
                    }`}
                  >
                    {item.available
                      ? (isEn ? 'Mark Booked' : 'व्यस्त मार्क करें')
                      : (isEn ? 'Mark Available' : 'उपलब्ध मार्क करें')}
                  </button>

                  <Link
                    to="/resources"
                    className="px-3 py-1.5 rounded-xl border border-outline-variant/50 text-xs font-semibold text-on-surface hover:bg-surface-container"
                  >
                    {isEn ? 'Manage' : 'संपादित करें'}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Provider Profile & Status (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/30 shadow-2xs space-y-4">
            <div className="flex items-center gap-3 border-b border-outline-variant/20 pb-4">
              <div className="w-12 h-12 rounded-full bg-emerald-800 flex items-center justify-center text-white font-bold text-base shadow-xs">
                {user?.initials || 'GS'}
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-sm text-on-surface truncate">{providerName}</h3>
                <p className="text-xs text-primary font-semibold truncate">
                  {user?.details?.resourceCategory || 'Tractors, Harvesters & Labour'}
                </p>
                <p className="text-[11px] text-on-surface-variant truncate">
                  {user?.location || 'Meerut Rural, UP'}
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-outline-variant/15">
                <span className="text-on-surface-variant">{isEn ? 'Verification' : 'सत्यापन'}:</span>
                <span className="font-semibold text-emerald-600 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">verified</span>
                  {isEn ? 'Kisan Kendra Verified' : 'सत्यापित केंद्र'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-outline-variant/15">
                <span className="text-on-surface-variant">{isEn ? 'Dispatch Radius' : 'सेवा दायरा'}:</span>
                <span className="font-semibold text-on-surface">Within 25 km</span>
              </div>
              <div className="flex justify-between py-1 border-b border-outline-variant/15">
                <span className="text-on-surface-variant">{isEn ? 'Payout Speed' : 'भुगतान निपटान'}:</span>
                <span className="font-semibold text-on-surface">Daily Direct UPI</span>
              </div>
            </div>

            <Link
              to="/resources"
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-primary/30 text-primary font-bold text-xs hover:bg-primary/5 transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">edit_calendar</span>
              <span>{isEn ? 'Manage Availability Calendar' : 'कैलेंडर उपलब्धता'}</span>
            </Link>
          </div>

          {/* Quick Support Badge */}
          <div className="bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200/50 p-5 rounded-3xl space-y-2">
            <span className="material-symbols-outlined text-emerald-800 text-2xl">security</span>
            <h4 className="font-bold text-sm text-emerald-950">
              {isEn ? 'Equipment Insurance Protected' : 'मशीनरी बीमा सुरक्षा'}
            </h4>
            <p className="text-xs text-emerald-900/80 leading-relaxed">
              {isEn
                ? 'All field rentals booked via Farmer Helper are backed by ₹5,00,000 accidental damage protection.'
                : 'Farmer Helper के माध्यम से दी गई मशीनरी को ₹5,00,000 तक दुर्घटना सुरक्षा मिलती है।'}
            </p>
          </div>
        </div>

      </div>

      {/* ── Recent Booking Requests ── */}
      <div className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/30 shadow-2xs space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-on-surface">
              {isEn ? 'Recent Rental Requests from Farmers 🌾' : 'किसानों से हालिया किराये के अनुरोध 🌾'}
            </h2>
            <p className="text-xs text-on-surface-variant mt-0.5">
              {isEn ? 'Farmers waiting for equipment confirmation' : 'पुष्टि की प्रतीक्षा कर रहे किसान'}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {requests.map((r) => (
            <div
              key={r.id}
              className="p-4 rounded-2xl border border-outline-variant/30 bg-surface-container-low/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-on-surface">
                    {isEn ? r.farmerEn : r.farmerHi}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      r.status === 'accepted'
                        ? 'bg-emerald-500/10 text-emerald-700'
                        : r.status === 'declined'
                        ? 'bg-error/10 text-error'
                        : 'bg-amber-500/10 text-amber-800'
                    }`}
                  >
                    {r.status.toUpperCase()}
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant font-medium">
                  {r.equipment} • {r.days} • <span className="font-semibold text-primary">{r.dates}</span>
                </p>
                <p className="text-xs font-bold text-emerald-700">Estimated Total: {r.amount}</p>
              </div>

              {r.status === 'pending' ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleRequestAction(r.id, 'accepted')}
                    className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-container active:scale-95 transition-all"
                  >
                    {isEn ? 'Accept' : 'स्वीकार करें'}
                  </button>
                  <button
                    onClick={() => handleRequestAction(r.id, 'declined')}
                    className="px-4 py-2 rounded-xl border border-outline-variant/60 text-xs font-semibold text-error hover:bg-error/10 transition-all"
                  >
                    {isEn ? 'Decline' : 'अस्वीकार करें'}
                  </button>
                </div>
              ) : (
                <span className="text-xs font-semibold text-on-surface-variant">
                  {r.status === 'accepted' ? (isEn ? 'Confirmed ✓' : 'पुष्टित ✓') : (isEn ? 'Declined' : 'अस्वीकृत')}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
