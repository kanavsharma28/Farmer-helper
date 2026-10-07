import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getStoredAdminReports } from '../../services/adminService';
import logoImg from '../../assets/logo.png';

export default function AdminHeader({
  title = 'Admin Dashboard',
  subtitle,
  onToggleMobile,
  lang = 'en',
  setLang,
  searchQuery = '',
  onSearchChange,
  searchPlaceholder,
}) {
  const { user } = useAuth();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const isEn = lang === 'en';

  useEffect(() => {
    try {
      const reports = getStoredAdminReports();
      const pending = reports.filter((r) => r.status === 'Pending' || r.status === 'Under Review');
      setNotifications(pending);
    } catch {
      setNotifications([]);
    }
  }, []);

  return (
    <header className="w-full h-16 flex justify-between items-center px-4 lg:px-10 bg-surface-bright border-b border-outline-variant sticky top-0 z-40">
      {/* Left: Mobile Branding & Toggle & Title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onToggleMobile}
          className="lg:hidden p-2 text-on-surface-variant hover:bg-surface-container rounded-full transition-colors cursor-pointer"
          title="Open Menu"
        >
          <span className="material-symbols-outlined text-2xl">menu</span>
        </button>

        <div className="flex items-center gap-2 lg:hidden">
          <Link to="/" className="flex items-center gap-1.5 shrink-0">
            <img src={logoImg} alt="Logo" className="h-6 w-auto rounded-md object-contain" />
          </Link>
        </div>

        <div className="min-w-0">
          <h1 className="font-display font-bold text-sm sm:text-base lg:text-lg text-on-surface leading-tight truncate">
            {title}
          </h1>
          {subtitle && (
            <p className="font-caption text-xs text-on-surface-variant truncate hidden sm:block">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Center Search Input (Desktop) */}
      {onSearchChange ? (
        <div className="hidden md:flex flex-1 max-w-md mx-6">
          <div className="relative w-full">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={searchPlaceholder || (isEn ? "Search platform records..." : "रिकॉर्ड खोजें...")}
              className="w-full pl-10 pr-4 py-2 bg-surface-container-low border border-outline-variant rounded-full focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-body-md text-sm text-on-surface transition-all placeholder:text-on-surface-variant/60"
            />
          </div>
        </div>
      ) : (
        <div className="flex-1" />
      )}

      {/* Right Control Buttons matching DashboardHeader */}
      <div className="flex items-center gap-1 sm:gap-2.5 shrink-0">
        {/* Role Pill on Desktop */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border border-outline-variant/50 bg-surface-container-low">
          <span className="material-symbols-outlined text-[15px] text-primary">shield_person</span>
          <span className="text-on-surface">Admin Portal</span>
        </div>

        {/* View Public Live Site */}
        <Link
          to="/"
          target="_blank"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-outline-variant/40 text-xs font-semibold text-on-surface-variant hover:bg-surface-container hover:text-primary transition-colors"
          title="Open Farmer Helper in new tab"
        >
          <span className="material-symbols-outlined text-[16px]">visibility</span>
          <span>Live Site</span>
          <span className="material-symbols-outlined text-[13px] opacity-60">open_in_new</span>
        </Link>

        {/* Language Switch matching DashboardHeader */}
        {setLang && (
          <button
            onClick={() => setLang((prev) => (prev === 'en' ? 'hi' : 'en'))}
            className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-full scale-95 transition-all flex items-center gap-1 text-xs font-semibold cursor-pointer"
            title={isEn ? "Switch Language" : "भाषा बदलें"}
          >
            <span className="material-symbols-outlined text-xl">language</span>
            <span className="hidden sm:inline">{isEn ? 'EN' : 'हिं'}</span>
          </button>
        )}

        {/* Notifications Dropdown matching DashboardHeader */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-full scale-95 transition-all relative cursor-pointer"
            title={isEn ? "Moderation Alerts" : "सूचनाएं"}
          >
            <span className="material-symbols-outlined text-xl">notifications</span>
            {notifications.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full animate-pulse"></span>
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-surface-variant p-4 z-50 text-xs space-y-2 animate-fadeIn">
              <div className="font-bold text-on-surface border-b border-surface-variant pb-2 flex justify-between items-center">
                <span>{isEn ? 'Platform Alerts & Reports' : 'मंच अलर्ट एवं शिकायतें'}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                  {notifications.length} {isEn ? 'Pending' : 'लंबित'}
                </span>
              </div>
              <div className="max-h-64 overflow-y-auto space-y-2 py-1">
                {notifications.length === 0 ? (
                  <p className="text-on-surface-variant text-center py-4">
                    {isEn ? 'No pending moderation reports.' : 'कोई लंबित रिपोर्ट नहीं है।'}
                  </p>
                ) : (
                  notifications.slice(0, 5).map((r) => (
                    <Link
                      key={r.id}
                      to="/admin/reports"
                      onClick={() => setIsNotifOpen(false)}
                      className="block p-2.5 bg-surface-container-low hover:bg-surface-container rounded-xl transition-colors space-y-1"
                    >
                      <div className="flex items-center justify-between font-bold text-on-surface">
                        <span className="truncate">{r.reason}</span>
                        <span className="text-[10px] text-on-surface-variant font-normal">
                          {r.reportType}
                        </span>
                      </div>
                      <p className="text-on-surface-variant text-[11px] truncate">
                        {r.targetTitle || r.description}
                      </p>
                    </Link>
                  ))
                )}
              </div>
              <Link
                to="/admin/reports"
                onClick={() => setIsNotifOpen(false)}
                className="block text-center pt-2 text-primary hover:underline font-bold text-[11px] border-t border-outline-variant/20"
              >
                {isEn ? 'View All Grievances in Reports Center →' : 'शिकायत केंद्र में सभी देखें →'}
              </Link>
            </div>
          )}
        </div>

        {/* Admin Profile Pill */}
        <div className="flex items-center gap-2 pl-1">
          <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs shadow-xs border border-white">
            {user?.initials || 'AD'}
          </div>
        </div>
      </div>
    </header>
  );
}
