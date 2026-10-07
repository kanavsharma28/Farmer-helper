import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROLE_LABELS } from '../../data/navigationConfig';

export default function DashboardMobileNav({ activeNav, setActiveNav, lang = 'en' }) {
  const isEn = lang === 'en';
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const role = user?.role || 'farmer';
  const roleLabel = ROLE_LABELS[role] || ROLE_LABELS.farmer;

  const handleLogout = () => {
    setIsProfileModalOpen(false);
    logout();
    navigate('/login', { replace: true });
  };

  const getMobileItems = () => {
    if (role === 'student') {
      return [
        { id: 'dashboard', icon: 'home', labelEn: 'Home', labelHi: 'होम', path: '/dashboard' },
        { id: 'internships', icon: 'school', labelEn: 'Internships', labelHi: 'इंटर्नशिप', path: '/internships' },
        { id: 'messages', icon: 'chat', labelEn: 'Chat', labelHi: 'चैट', path: '/chat' },
        { id: 'applications', icon: 'folder_shared', labelEn: 'Applied', labelHi: 'आवेदन', path: '/internships?tab=applications' },
        { id: 'profile', icon: 'person', labelEn: 'Profile', labelHi: 'प्रोफाइल', isAction: true },
      ];
    }
    if (role === 'buyer') {
      return [
        { id: 'dashboard', icon: 'home', labelEn: 'Home', labelHi: 'होम', path: '/dashboard' },
        { id: 'produce', icon: 'agriculture', labelEn: 'Produce', labelHi: 'उपज', path: '/dashboard?tab=produce' },
        { id: 'requirements', icon: 'assignment', labelEn: 'Demands', labelHi: 'मांग', path: '/dashboard?tab=requirements' },
        { id: 'messages', icon: 'chat', labelEn: 'Chat', labelHi: 'चैट', path: '/chat' },
        { id: 'profile', icon: 'business', labelEn: 'Profile', labelHi: 'प्रोफाइल', isAction: true },
      ];
    }
    if (role === 'provider') {
      return [
        { id: 'dashboard', icon: 'home', labelEn: 'Home', labelHi: 'होम', path: '/dashboard' },
        { id: 'resources', icon: 'handshake', labelEn: 'Resources', labelHi: 'साधन', path: '/resources' },
        { id: 'messages', icon: 'chat', labelEn: 'Messages', labelHi: 'संदेश', path: '/chat' },
        { id: 'my-listings', icon: 'inventory_2', labelEn: 'Listings', labelHi: 'सूचियां', path: '/resources?tab=my-listings' },
        { id: 'profile', icon: 'badge', labelEn: 'Profile', labelHi: 'प्रोफाइल', isAction: true },
      ];
    }
    // Farmer
    return [
      { id: 'dashboard', icon: 'home', labelEn: 'Home', labelHi: 'होम', path: '/dashboard' },
      { id: 'buyers', icon: 'storefront', labelEn: 'Buyers', labelHi: 'खरीदार', path: '/buyers' },
      { id: 'resources', icon: 'handshake', labelEn: 'Resources', labelHi: 'साधन', path: '/resources' },
      { id: 'messages', icon: 'chat', labelEn: 'Chat', labelHi: 'चैट', path: '/chat' },
      { id: 'profile', icon: 'person', labelEn: 'Profile', labelHi: 'प्रोफाइल', isAction: true },
    ];
  };

  const mobileNavItems = getMobileItems();

  return (
    <>
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 py-2.5 shadow-lg bg-surface-container rounded-t-2xl lg:hidden border-t border-outline-variant/50 pb-safe backdrop-blur-md">
        {mobileNavItems.map((item) => {
          const isActive = activeNav === item.id;

          const buttonContent = (
            <div className={`flex flex-col items-center justify-center transition-all duration-200 ${
              isActive
                ? 'bg-secondary-container text-on-secondary-container rounded-2xl px-3.5 py-1 font-bold shadow-xs'
                : 'text-on-surface-variant p-1.5 rounded-lg hover:text-primary'
            }`}>
              <span className={`material-symbols-outlined text-[22px] ${isActive ? 'material-fill' : ''}`}>
                {item.icon}
              </span>
              <span className="font-label-md text-[10px] leading-none mt-1">
                {isEn ? item.labelEn : item.labelHi}
              </span>
            </div>
          );

          if (item.isAction) {
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setIsProfileModalOpen(true)}
                className="focus:outline-none"
              >
                {buttonContent}
              </button>
            );
          }

          if (item.path) {
            return (
              <Link
                key={item.id}
                to={item.path}
                onClick={() => setActiveNav && setActiveNav(item.id)}
                className="focus:outline-none"
              >
                {buttonContent}
              </Link>
            );
          }

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveNav && setActiveNav(item.id)}
              className="focus:outline-none"
            >
              {buttonContent}
            </button>
          );
        })}
      </nav>

      {/* Mobile Profile & Logout Sheet */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-surface-container-lowest rounded-t-3xl p-6 border-t border-outline-variant/40 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
              <h3 className="font-bold text-base text-on-surface">
                {isEn ? 'Account & Session' : 'खाता एवं सत्र'}
              </h3>
              <button
                onClick={() => setIsProfileModalOpen(false)}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            {/* User Info */}
            <div className="flex items-center gap-3 p-3 bg-surface-container-low rounded-2xl">
              <div className="w-12 h-12 rounded-full bg-primary-container text-white flex items-center justify-center font-bold text-base shadow-sm">
                {user?.initials || 'FH'}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-sm text-on-surface truncate">{user?.name || 'User'}</p>
                <p className="text-xs text-on-surface-variant truncate">{user?.phone || user?.email}</p>
                <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${roleLabel.badgeBg} ${roleLabel.badgeText}`}>
                  {isEn ? roleLabel.en : roleLabel.hi}
                </span>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-bold text-white bg-error hover:bg-error/90 active:scale-[0.99] transition-all shadow-sm"
            >
              <span className="material-symbols-outlined text-lg">logout</span>
              <span>{isEn ? 'Logout from Farmer Helper' : 'लॉगआउट करें'}</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
