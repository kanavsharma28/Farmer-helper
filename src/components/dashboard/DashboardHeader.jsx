import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logoImg from '../../assets/logo.png';
import { useAuth } from '../../context/AuthContext';
import { ROLE_LABELS } from '../../data/navigationConfig';

export default function DashboardHeader({ lang, setLang }) {
  const isEn = lang === 'en';
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const role = user?.role || 'farmer';
  const roleLabel = ROLE_LABELS[role] || ROLE_LABELS.farmer;

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const getSearchPlaceholder = () => {
    if (role === 'student') {
      return isEn ? 'Search internships, workshops, skills...' : 'इंटर्नशिप, कार्यशालाएं खोजें...';
    }
    if (role === 'buyer') {
      return isEn ? 'Search crops, mandis, farmers...' : 'फसल, मंडी, किसान खोजें...';
    }
    if (role === 'provider') {
      return isEn ? 'Search equipment, requests, bookings...' : 'साधन, बुकिंग, मांग खोजें...';
    }
    return isEn ? 'Search resources, buyers, schemes...' : 'साधन, खरीदार, योजनाएं खोजें...';
  };

  return (
    <header className="w-full h-16 flex justify-between items-center px-4 lg:px-10 bg-surface-bright border-b border-outline-variant sticky top-0 z-40">
      
      {/* Mobile Branding & Avatar */}
      <div className="flex items-center gap-2.5 lg:hidden">
        <button
          onClick={() => setShowProfileMenu(!showProfileMenu)}
          className="w-8 h-8 rounded-full bg-primary-container text-white flex items-center justify-center font-bold text-xs shadow-xs border border-white"
          title="Account Menu"
        >
          {user?.initials || 'FH'}
        </button>
        <Link to="/" className="flex items-center gap-1.5">
          <img src={logoImg} alt="Logo" className="h-6 w-auto rounded-md object-contain" />
          <span className="font-display-lg text-lg font-bold text-primary">
            Farmer Helper
          </span>
        </Link>
      </div>

      {/* Search Input (Desktop) */}
      <div className="hidden lg:flex flex-1 max-w-md mx-4">
        <div className="relative w-full">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={getSearchPlaceholder()}
            className="w-full pl-10 pr-4 py-2 bg-surface-container-low border border-outline-variant rounded-full focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-body-md text-sm text-on-surface transition-all placeholder:text-on-surface-variant/60"
          />
        </div>
      </div>

      {/* Right Control Buttons */}
      <div className="flex items-center gap-1 sm:gap-2">
        {/* Role Pill on Desktop */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border border-outline-variant/50 bg-surface-container-low">
          <span className="material-symbols-outlined text-[15px] text-primary">{roleLabel.icon}</span>
          <span className="text-on-surface">{isEn ? roleLabel.en : roleLabel.hi}</span>
        </div>

        {/* Language Switch */}
        <button
          onClick={() => setLang((prev) => (prev === 'en' ? 'hi' : 'en'))}
          className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-full scale-95 transition-all flex items-center gap-1 text-xs font-semibold"
          title={isEn ? "Switch Language" : "भाषा बदलें"}
        >
          <span className="material-symbols-outlined text-xl">language</span>
          <span className="hidden sm:inline">{isEn ? 'EN' : 'हिं'}</span>
        </button>

        {/* Location Trigger */}
        <button
          onClick={() => alert(isEn ? `Location: ${user?.location || 'Meerut, UP'}` : `स्थान: ${user?.location || 'मेरठ, उ.प्र.'}`)}
          className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-full scale-95 transition-all"
          title={isEn ? "Current Location" : "वर्तमान स्थान"}
        >
          <span className="material-symbols-outlined text-xl">location_on</span>
        </button>

        {/* Notifications Dropdown Trigger */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-full scale-95 transition-all relative"
            title={isEn ? "Notifications" : "सूचनाएं"}
          >
            <span className="material-symbols-outlined text-xl">notifications</span>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full animate-pulse"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-surface-variant p-4 z-50 text-xs space-y-2 animate-fadeIn">
              <div className="font-bold text-on-surface border-b border-surface-variant pb-2 flex justify-between">
                <span>{isEn ? 'Recent Notifications' : 'नवीनतम सूचनाएं'}</span>
                <span className="text-primary cursor-pointer">{isEn ? 'Mark all' : 'सभी पढ़ें'}</span>
              </div>
              {role === 'student' ? (
                <>
                  <div className="p-2 bg-surface-container-low rounded-xl">
                    <p className="font-semibold text-primary">🎓 New Internship Match</p>
                    <p className="text-on-surface-variant">Drone Scouting Trainee posted in Lucknow.</p>
                  </div>
                  <div className="p-2 bg-surface-container-low rounded-xl">
                    <p className="font-semibold text-secondary">📜 Workshop Alert</p>
                    <p className="text-on-surface-variant">Hydroponics training batch starts next week.</p>
                  </div>
                </>
              ) : role === 'buyer' ? (
                <>
                  <div className="p-2 bg-surface-container-low rounded-xl">
                    <p className="font-semibold text-primary">🌾 Mandi Price Update</p>
                    <p className="text-on-surface-variant">Wheat arrival increased by 20% in Khanna Mandi.</p>
                  </div>
                  <div className="p-2 bg-surface-container-low rounded-xl">
                    <p className="font-semibold text-secondary">📦 Cold Storage Slot</p>
                    <p className="text-on-surface-variant">300 MT slot available in Meerut Cold Storage.</p>
                  </div>
                </>
              ) : role === 'provider' ? (
                <>
                  <div className="p-2 bg-surface-container-low rounded-xl">
                    <p className="font-semibold text-primary">🚜 Booking Request</p>
                    <p className="text-on-surface-variant">Farmer in Modinagar requested Mahindra Tractor for 3 days.</p>
                  </div>
                  <div className="p-2 bg-surface-container-low rounded-xl">
                    <p className="font-semibold text-secondary">💰 Payout Processed</p>
                    <p className="text-on-surface-variant">₹4,800 received for Harvester service.</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="p-2 bg-surface-container-low rounded-xl">
                    <p className="font-semibold text-primary">🌾 Wheat Price Alert</p>
                    <p className="text-on-surface-variant">Khanna Mandi price increased to ₹2,450/Qtl.</p>
                  </div>
                  <div className="p-2 bg-surface-container-low rounded-xl">
                    <p className="font-semibold text-secondary">🚜 Mahindra Tractor Available</p>
                    <p className="text-on-surface-variant">Available for rental near Meerut at ₹1,200/day.</p>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Profile / Logout Menu Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 p-1 pl-2 rounded-full hover:bg-surface-container border border-outline-variant/40 transition-colors"
          >
            <span className="hidden sm:inline text-xs font-semibold text-on-surface max-w-[120px] truncate">
              {user?.name || 'User'}
            </span>
            <div className="w-8 h-8 rounded-full bg-primary-container text-white flex items-center justify-center font-bold text-xs shadow-xs">
              {user?.initials || 'FH'}
            </div>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-surface-variant p-4 z-50 text-xs space-y-3 animate-fadeIn">
              <div className="flex items-center gap-3 pb-3 border-b border-surface-variant">
                <div className="w-10 h-10 rounded-full bg-primary-container text-white flex items-center justify-center font-bold text-sm shadow-xs">
                  {user?.initials || 'FH'}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-on-surface text-sm truncate">{user?.name || 'User'}</p>
                  <p className="text-on-surface-variant text-[11px] truncate">{user?.phone || user?.email}</p>
                  <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${roleLabel.badgeBg} ${roleLabel.badgeText}`}>
                    {isEn ? roleLabel.en : roleLabel.hi}
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <Link
                  to="/dashboard"
                  onClick={() => setShowProfileMenu(false)}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-on-surface hover:bg-surface-container font-medium transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">dashboard</span>
                  <span>{isEn ? 'Dashboard' : 'डैशबोर्ड'}</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-error bg-error/5 hover:bg-error/15 font-semibold transition-colors mt-2"
                >
                  <span className="material-symbols-outlined text-[18px]">logout</span>
                  <span>{isEn ? 'Logout' : 'लॉगआउट'}</span>
                </button>
              </div>
            </div>
          )}
        </div>

      </div>

    </header>
  );
}
