import React, { useState } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import logoImg from '../../assets/logo.png';
import AdminConfirmModal from './AdminConfirmModal';

export default function AdminSidebar({ isMobileOpen, setIsMobileOpen, pendingReportsCount = 0 }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isUsersMenuOpen, setIsUsersMenuOpen] = useState(
    location.pathname.startsWith('/admin/users')
  );
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const isUsersActive = location.pathname.startsWith('/admin/users');

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const navLinks = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: 'dashboard',
      path: '/admin/dashboard',
    },
    // Users item is handled separately with collapsible sub-items
    {
      id: 'resources',
      label: 'Resources',
      icon: 'agriculture',
      path: '/admin/resources',
    },
    {
      id: 'internships',
      label: 'Internships',
      icon: 'school',
      path: '/admin/internships',
    },
    {
      id: 'training',
      label: 'Training & Workshops',
      icon: 'psychology',
      path: '/admin/training',
    },
    {
      id: 'community',
      label: 'Community',
      icon: 'groups',
      path: '/admin/community',
    },
    {
      id: 'messages',
      label: 'Messages & Chat',
      icon: 'chat',
      path: '/admin/messages',
    },
    {
      id: 'schemes',
      label: 'Government Schemes',
      icon: 'gavel',
      path: '/admin/government-schemes',
    },
    {
      id: 'khet-doctor',
      label: 'Mera Khet Ka Doctor',
      icon: 'medical_services',
      path: '/admin/khet-ka-doctor',
    },
    {
      id: 'crop-loss',
      label: 'Crop Loss Reports',
      icon: 'report_problem',
      path: '/admin/crop-loss-reports',
    },
    {
      id: 'storage',
      label: 'Storage & Cold Storage',
      icon: 'warehouse',
      path: '/admin/storage',
    },
    {
      id: 'marketplace',
      label: 'Best Buyers / Marketplace',
      icon: 'storefront',
      path: '/admin/marketplace',
    },
    {
      id: 'reports',
      label: 'Reports & Complaints',
      icon: 'flag',
      path: '/admin/reports',
      badge: pendingReportsCount > 0 ? pendingReportsCount : null,
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: 'analytics',
      path: '/admin/analytics',
    },
    {
      id: 'audit-logs',
      label: 'Audit Logs',
      icon: 'history_edu',
      path: '/admin/audit-logs',
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: 'settings',
      path: '/admin/settings',
    },
  ];

  const userSubLinks = [
    { label: 'All Users', path: '/admin/users' },
    { label: 'Farmers', path: '/admin/users?role=farmer' },
    { label: 'Students', path: '/admin/users?role=student' },
    { label: 'Buyers', path: '/admin/users?role=buyer' },
    { label: 'Resource Providers', path: '/admin/users?role=provider' },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-surface-container-lowest text-on-surface select-none">
      {/* Brand Header matching DashboardSidebar */}
      <div className="h-20 px-6 flex items-center justify-between shrink-0 border-b border-outline-variant/20">
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
              AGRICULTURE PLATFORM
            </span>
          </div>
        </Link>

        {/* Mobile close button */}
        {setIsMobileOpen && (
          <button
            type="button"
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        )}
      </div>

      {/* Role Indicator Banner matching DashboardSidebar */}
      <div className="px-5 py-2.5 bg-surface-container-low/60 border-b border-outline-variant/20 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
          <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
            PORTAL ROLE:
          </span>
        </div>
        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20 flex items-center gap-1">
          <span className="material-symbols-outlined text-[14px]">shield_person</span>
          <span>Admin</span>
        </span>
      </div>

      {/* Navigation Links Scroll Area */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1 hide-scrollbar font-body-md text-sm">
        {/* Dashboard Link */}
        <NavLink
          to="/admin/dashboard"
          onClick={() => setIsMobileOpen && setIsMobileOpen(false)}
          className={({ isActive }) =>
            `group flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-150 text-left font-label-md text-xs sm:text-sm ${
              isActive
                ? 'bg-primary text-white font-bold shadow-xs'
                : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface font-medium'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <span
                className={`material-symbols-outlined text-[20px] shrink-0 transition-colors ${
                  isActive ? 'text-white' : 'text-outline group-hover:text-primary'
                }`}
              >
                dashboard
              </span>
              <span className="truncate">Dashboard</span>
            </>
          )}
        </NavLink>

        {/* Users Collapsible Menu */}
        <div className="space-y-0.5">
          <button
            type="button"
            onClick={() => setIsUsersMenuOpen(!isUsersMenuOpen)}
            className={`w-full group flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all duration-150 text-left font-label-md text-xs sm:text-sm cursor-pointer ${
              isUsersActive
                ? 'bg-primary/10 text-primary font-bold border border-primary/20'
                : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface font-medium'
            }`}
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <span
                className={`material-symbols-outlined text-[20px] shrink-0 transition-colors ${
                  isUsersActive ? 'text-primary' : 'text-outline group-hover:text-primary'
                }`}
              >
                group
              </span>
              <span className="truncate">Users</span>
            </div>
            <span
              className={`material-symbols-outlined text-base transition-transform ${
                isUsersMenuOpen ? 'rotate-180' : ''
              }`}
            >
              expand_more
            </span>
          </button>

          {isUsersMenuOpen && (
            <div className="pl-9 pr-2 py-1 space-y-0.5 border-l-2 border-primary/20 ml-5 my-1 animate-fadeIn">
              {userSubLinks.map((sub) => {
                const isSubActive =
                  location.pathname + location.search === sub.path ||
                  (sub.path === '/admin/users' && location.pathname === '/admin/users' && !location.search);
                return (
                  <Link
                    key={sub.label}
                    to={sub.path}
                    onClick={() => setIsMobileOpen && setIsMobileOpen(false)}
                    className={`block py-1.5 px-3 rounded-lg text-xs font-semibold transition-colors ${
                      isSubActive
                        ? 'bg-primary text-white font-bold shadow-2xs'
                        : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                    }`}
                  >
                    {sub.label}
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* All Remaining Navigation Links */}
        {navLinks.slice(1).map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            onClick={() => setIsMobileOpen && setIsMobileOpen(false)}
            className={({ isActive }) =>
              `group flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all duration-150 text-left font-label-md text-xs sm:text-sm ${
                isActive
                  ? 'bg-primary text-white font-bold shadow-xs'
                  : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface font-medium'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className="flex items-center gap-3 overflow-hidden">
                  <span
                    className={`material-symbols-outlined text-[20px] shrink-0 transition-colors ${
                      isActive ? 'text-white' : 'text-outline group-hover:text-primary'
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive
                        ? 'bg-white text-primary'
                        : 'bg-primary/10 text-primary'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Profile & Logout Footer matching DashboardSidebar */}
      <div className="p-4 shrink-0 space-y-3 border-t border-outline-variant/20 bg-surface-container-lowest">
        <div className="bg-surface-container-low/70 rounded-2xl p-3 border border-outline-variant/30 space-y-2.5">
          <div className="flex items-center gap-2.5 min-w-0">
            {/* Avatar with initials & online status badge */}
            <div className="relative shrink-0">
              <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs shadow-xs border-2 border-white">
                {user?.initials || 'AD'}
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></span>
            </div>

            {/* User name & role label */}
            <div className="min-w-0 flex-1">
              <p className="font-label-md text-xs font-bold text-on-surface truncate">
                {user?.name || 'Administrator'}
              </p>
              <p className="text-[11px] text-on-surface-variant truncate font-medium">
                Super Administrator
              </p>
            </div>
          </div>

          {/* Clearly Available Logout Button */}
          <button
            type="button"
            onClick={() => setIsLogoutModalOpen(true)}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold text-error bg-error/8 hover:bg-error/18 active:scale-[0.98] border border-error/25 transition-all cursor-pointer shadow-2xs"
            title="Sign Out of Admin Portal"
          >
            <span className="material-symbols-outlined text-[17px]">logout</span>
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar matching DashboardSidebar */}
      <aside className="h-screen w-72 hidden lg:flex flex-col border-r border-outline-variant/40 bg-surface-container-lowest shadow-xs sticky top-0 shrink-0 select-none z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Navigation with backdrop overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileOpen(false)}
          />
          <div className="relative w-72 max-w-[85vw] h-full shadow-2xl z-10 animate-slideRight">
            {sidebarContent}
          </div>
        </div>
      )}

      {/* Confirm Logout Modal */}
      <AdminConfirmModal
        isOpen={isLogoutModalOpen}
        title="Sign Out of Admin Portal"
        message="Are you sure you want to log out of the Farmer Helper Administrator portal?"
        confirmText="Log Out"
        cancelText="Cancel"
        isDestructive={false}
        onConfirm={handleLogout}
        onCancel={() => setIsLogoutModalOpen(false)}
      />
    </>
  );
}
