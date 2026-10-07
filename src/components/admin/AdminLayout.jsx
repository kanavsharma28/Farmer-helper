import React, { useState } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';

export default function AdminLayout({
  children,
  title,
  subtitle,
  lang = 'en',
  setLang,
  pendingReportsCount = 0,
  searchQuery = '',
  onSearchChange,
  searchPlaceholder,
}) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col lg:flex-row font-sans selection:bg-primary-container selection:text-white antialiased">
      {/* Desktop Sticky Sidebar Navigation */}
      <AdminSidebar
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
        pendingReportsCount={pendingReportsCount}
      />

      {/* Main Right Content Area matching DashboardPage */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 lg:pb-8">
        <AdminHeader
          title={title}
          subtitle={subtitle}
          onToggleMobile={() => setIsMobileOpen(true)}
          lang={lang}
          setLang={setLang}
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          searchPlaceholder={searchPlaceholder}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-10 overflow-y-auto max-w-7xl w-full mx-auto space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
}
