import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logoImg from '../../assets/logo.png';
import { useAuth } from '../../context/AuthContext';
import { ROLE_NAVIGATION, ROLE_LABELS } from '../../data/navigationConfig';

export default function DashboardSidebar({ activeNav, setActiveNav, lang = 'en' }) {
  const isEn = lang === 'en';
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const role = user?.role || 'farmer';
  const navItems = ROLE_NAVIGATION[role] || ROLE_NAVIGATION.farmer;
  const roleLabel = ROLE_LABELS[role] || ROLE_LABELS.farmer;

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const handleItemClick = (item) => {
    if (setActiveNav) {
      setActiveNav(item.id);
    }
  };

  return (
    <aside className="h-screen w-72 hidden lg:flex flex-col border-r border-outline-variant/40 bg-surface-container-lowest shadow-xs sticky top-0 shrink-0 select-none z-30">
      
      {/* Brand Header with Logo */}
      <div className="h-20 px-6 flex items-center gap-3 shrink-0 border-b border-outline-variant/20">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-white shadow-xs border border-outline-variant/30 p-1 flex items-center justify-center transition-transform group-hover:scale-105">
            <img
              src={logoImg}
              alt="Farmer Helper Logo"
              className="h-8 w-auto object-contain rounded-lg"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-headline-md text-lg font-bold text-primary leading-tight">
              Farmer Helper
            </span>
            <span className="font-caption text-[11px] text-outline font-medium tracking-wide uppercase">
              AgriTech Platform
            </span>
          </div>
        </Link>
      </div>

      {/* Role Indicator Banner */}
      <div className="px-5 py-2.5 bg-surface-container-low/60 border-b border-outline-variant/20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
          <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
            {isEn ? 'Portal Role' : 'पोर्टल रोल'}:
          </span>
        </div>
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${roleLabel.badgeBg} ${roleLabel.badgeText} flex items-center gap-1`}>
          <span className="material-symbols-outlined text-[14px]">{roleLabel.icon}</span>
          <span>{isEn ? roleLabel.en : roleLabel.hi}</span>
        </span>
      </div>

      {/* Dynamic Navigation Menu List based on Role */}
      <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto hide-scrollbar font-body-md text-sm">
        {navItems.map((item) => {
          // Check if item is active by ID or current pathname
          const isActive =
            activeNav === item.id ||
            (location.pathname === item.path.split('?')[0] && item.id === 'dashboard' && location.pathname === '/dashboard' && !location.search);

          const content = (
            <>
              <span
                className={`material-symbols-outlined text-[20px] shrink-0 transition-colors ${
                  isActive ? 'text-white' : 'text-outline group-hover:text-primary'
                }`}
              >
                {item.icon}
              </span>
              <span className="truncate">{isEn ? item.labelEn : item.labelHi}</span>
            </>
          );

          const className = `group flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-150 text-left font-label-md text-xs sm:text-sm font-medium ${
            isActive
              ? 'bg-primary-container text-white font-bold shadow-xs'
              : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
          }`;

          if (item.path) {
            return (
              <Link
                key={item.id}
                to={item.path}
                onClick={() => handleItemClick(item)}
                className={className}
              >
                {content}
              </Link>
            );
          }

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleItemClick(item)}
              className={className}
            >
              {content}
            </button>
          );
        })}
      </nav>

      {/* Bottom Footer Section: Helpline & User Profile with prominent Logout */}
      <div className="p-4 shrink-0 space-y-3 border-t border-outline-variant/20 bg-surface-container-lowest">
        
        {/* Toll-free Kisan Helpline / Support */}
        <div className="bg-surface-container-low rounded-xl p-2.5 flex items-center gap-3 border border-outline-variant/20">
          <div className="w-8 h-8 rounded-lg bg-secondary-container flex items-center justify-center text-on-secondary-container shrink-0">
            <span className="material-symbols-outlined text-[18px]">phone_in_talk</span>
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-caption text-[10px] text-on-surface-variant leading-tight">
              {role === 'student'
                ? (isEn ? 'Student Career Helpline' : 'छात्र करियर हेल्पलाइन')
                : (isEn ? 'Kisan Helpline (Toll-free)' : 'किसान हेल्पलाइन (टोल-फ्री)')}
            </div>
            <a
              href="tel:18001801551"
              className="font-label-md text-xs font-bold text-primary hover:underline truncate block"
            >
              1800-180-1551
            </a>
          </div>
        </div>

        {/* User Profile Card & Direct Logout */}
        <div className="bg-surface-container-low/70 rounded-2xl p-3 border border-outline-variant/30 space-y-2.5">
          <div className="flex items-center gap-2.5 min-w-0">
            {/* Avatar with initials & online status badge */}
            <div className="relative shrink-0">
              <div className="w-9 h-9 rounded-full bg-primary-container text-white flex items-center justify-center font-bold text-xs shadow-xs border-2 border-white">
                {user?.initials || 'FH'}
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></span>
            </div>

            {/* User name & role label */}
            <div className="min-w-0 flex-1">
              <p className="font-label-md text-xs font-bold text-on-surface truncate">
                {isEn ? (user?.name || 'User') : (user?.nameHi || user?.name || 'उपयोगकर्ता')}
              </p>
              <p className="text-[11px] text-on-surface-variant truncate flex items-center gap-1 font-medium">
                <span className="capitalize">{roleLabel ? (isEn ? roleLabel.en : roleLabel.hi) : role}</span>
              </p>
            </div>
          </div>

          {/* Clearly Available Logout Button */}
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold text-error bg-error/8 hover:bg-error/18 active:scale-[0.98] border border-error/25 transition-all cursor-pointer shadow-2xs"
            title={isEn ? 'Sign Out of Farmer Helper' : 'लॉगआउट करें'}
          >
            <span className="material-symbols-outlined text-[17px]">logout</span>
            <span>{isEn ? 'Logout' : 'लॉगआउट'}</span>
          </button>
        </div>

      </div>

    </aside>
  );
}
