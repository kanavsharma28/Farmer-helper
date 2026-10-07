import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { getAdminDashboardStats, getPlatformAnalytics } from '../../services/adminService';

export default function AdminDashboardPage() {
  const [lang, setLang] = useState('en');
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const isEn = lang === 'en';

  useEffect(() => {
    try {
      const dashboardStats = getAdminDashboardStats();
      const analyticsData = getPlatformAnalytics('30d');
      setStats(dashboardStats);
      setAnalytics(analyticsData);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  if (isLoading || !stats) {
    return (
      <AdminLayout
        title="Admin Dashboard"
        subtitle="Manage and monitor the Farmer Helper platform."
        lang={lang}
        setLang={setLang}
      >
        <div className="py-24 text-center space-y-3">
          <span className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin inline-block" />
          <p className="text-xs font-semibold text-on-surface-variant">Loading platform metrics...</p>
        </div>
      </AdminLayout>
    );
  }

  // 1. Primary User Demographic Statistics Cards (matching FarmStatsRow style)
  const primaryStats = [
    {
      id: 'total-users',
      label: isEn ? 'Total Users' : 'कुल उपयोगकर्ता',
      value: stats.totalUsers,
      icon: 'people',
      link: '/admin/users',
    },
    {
      id: 'farmers',
      label: isEn ? 'Farmers' : 'किसान',
      value: stats.farmers,
      icon: 'agriculture',
      link: '/admin/users?role=farmer',
    },
    {
      id: 'students',
      label: isEn ? 'Students' : 'विद्यार्थी',
      value: stats.students,
      icon: 'school',
      link: '/admin/users?role=student',
    },
    {
      id: 'buyers',
      label: isEn ? 'Buyers & Traders' : 'खरीदार एवं व्यापारी',
      value: stats.buyers,
      icon: 'storefront',
      link: '/admin/users?role=buyer',
    },
    {
      id: 'providers',
      label: isEn ? 'Resource Providers' : 'साधन प्रदाता',
      value: stats.resourceProviders,
      icon: 'handshake',
      link: '/admin/users?role=provider',
    },
  ];

  // 2. Secondary Operational Cards
  const operationalStats = [
    {
      id: 'active-resources',
      label: isEn ? 'Active Resources' : 'सक्रिय साधन',
      value: stats.activeResources,
      icon: 'engineering',
      link: '/admin/resources',
    },
    {
      id: 'active-internships',
      label: isEn ? 'Active Internships' : 'सक्रिय इंटर्नशिप',
      value: stats.activeInternships,
      icon: 'work',
      link: '/admin/internships',
    },
    {
      id: 'training',
      label: isEn ? 'Training & Workshops' : 'प्रशिक्षण व कार्यशाला',
      value: stats.trainingWorkshops,
      icon: 'psychology',
      link: '/admin/training',
    },
    {
      id: 'community',
      label: isEn ? 'Community Posts' : 'समुदाय चर्चाएं',
      value: stats.communityPosts,
      icon: 'forum',
      link: '/admin/community',
    },
    {
      id: 'chats',
      label: isEn ? 'Conversations' : 'सक्रिय संवाद',
      value: stats.totalConversations,
      icon: 'chat',
      link: '/admin/messages',
    },
    {
      id: 'pending-reports',
      label: isEn ? 'Pending Reports' : 'लंबित शिकायतें',
      value: stats.pendingReports,
      icon: 'flag',
      link: '/admin/reports',
      badge: stats.pendingReports > 0,
    },
  ];

  return (
    <AdminLayout
      title="Admin Dashboard"
      subtitle="Manage, monitor, and moderate the Farmer Helper platform."
      lang={lang}
      setLang={setLang}
      pendingReportsCount={stats.pendingReports}
    >
      {/* Welcome Banner matching WelcomeWeatherHeader */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-2">
        <div>
          <h1 className="font-display-lg-mobile md:font-display-lg text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mb-1 tracking-tight">
            {isEn ? 'Namaste, Admin 👋' : 'नमस्ते, व्यवस्थापक 👋'}
          </h1>
          <p className="font-body-lg text-on-surface-variant text-sm sm:text-base">
            {isEn
              ? "Here's what's happening across Farmer Helper today."
              : 'आज किसान सहायक मंच की ताज़ा स्थिति एवं गतिविधियां।'}
          </p>
        </div>

        {/* Live Status Chip */}
        <div className="flex items-center gap-3 bg-surface-container-low border border-outline-variant/60 rounded-full px-4 py-2 shadow-2xs">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <div className="flex flex-col text-left">
            <span className="font-label-md text-xs font-bold text-on-surface">
              {isEn ? 'Platform Status: Healthy' : 'मंच स्थिति: सामान्य'}
            </span>
            <span className="font-caption text-[11px] text-on-surface-variant font-medium">
              {stats.totalUsers} {isEn ? 'Users' : 'उपयोगकर्ता'} · {stats.pendingReports} {isEn ? 'Grievances' : 'शिकायतें'}
            </span>
          </div>
        </div>
      </div>

      {/* Primary Statistics Row matching FarmStatsRow */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {primaryStats.map((stat) => (
          <Link
            key={stat.id}
            to={stat.link}
            className="bg-surface-container-lowest rounded-2xl p-4 border border-outline-variant/40 shadow-xs hover:shadow-md hover:border-primary/40 transition-all flex items-center gap-3.5 group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20 group-hover:bg-primary group-hover:text-white transition-colors">
              <span className="material-symbols-outlined text-xl">{stat.icon}</span>
            </div>
            <div className="min-w-0">
              <p className="font-caption text-xs text-on-surface-variant font-medium truncate">
                {stat.label}
              </p>
              <p className="font-headline-md text-base sm:text-xl font-bold text-on-surface">
                {stat.value}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Operational Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {operationalStats.map((stat) => (
          <Link
            key={stat.id}
            to={stat.link}
            className={`bg-surface-container-lowest rounded-xl p-3.5 border shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between group ${
              stat.badge
                ? 'border-amber-300 bg-amber-50/20'
                : 'border-outline-variant/30 hover:border-primary/30'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="material-symbols-outlined text-lg text-primary">
                {stat.icon}
              </span>
              {stat.badge && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                  Alert
                </span>
              )}
            </div>
            <div>
              <p className="font-headline-md text-lg font-bold text-on-surface">
                {stat.value}
              </p>
              <p className="font-caption text-[11px] text-on-surface-variant font-medium truncate">
                {stat.label}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Charts & Breakdown Section in clean Farmer Helper cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Breakdown by Role */}
        <div className="bg-surface-container-lowest rounded-2xl p-5 sm:p-6 border border-outline-variant/40 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-lg">pie_chart</span>
              </div>
              <h3 className="font-display font-bold text-sm sm:text-base text-on-surface">
                {isEn ? 'Users by Role' : 'रोल अनुसार उपयोगकर्ता'}
              </h3>
            </div>
            <Link to="/admin/users" className="text-xs font-semibold text-primary hover:underline">
              {isEn ? 'Manage All' : 'सभी देखें'}
            </Link>
          </div>

          <div className="space-y-3 pt-1">
            {[
              { label: isEn ? 'Farmers' : 'किसान', count: stats.farmers, total: stats.totalUsers },
              { label: isEn ? 'Students' : 'विद्यार्थी', count: stats.students, total: stats.totalUsers },
              { label: isEn ? 'Buyers' : 'खरीदार', count: stats.buyers, total: stats.totalUsers },
              { label: isEn ? 'Resource Providers' : 'साधन प्रदाता', count: stats.resourceProviders, total: stats.totalUsers },
            ].map((r) => {
              const pct = stats.totalUsers > 0 ? Math.round((r.count / stats.totalUsers) * 100) : 0;
              return (
                <div key={r.label} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-medium text-on-surface">
                    <span>{r.label}</span>
                    <span className="text-on-surface-variant">
                      {r.count} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-surface-container overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Resources Distribution */}
        <div className="bg-surface-container-lowest rounded-2xl p-5 sm:p-6 border border-outline-variant/40 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-lg">category</span>
              </div>
              <h3 className="font-display font-bold text-sm sm:text-base text-on-surface">
                {isEn ? 'Resource Categories' : 'साधन श्रेणियां'}
              </h3>
            </div>
            <Link to="/admin/resources" className="text-xs font-semibold text-primary hover:underline">
              {isEn ? 'View All' : 'सभी देखें'}
            </Link>
          </div>

          <div className="space-y-3 pt-1">
            {analytics?.resourceCategories && Object.entries(analytics.resourceCategories).map(([cat, count]) => {
              const totalRes = stats.activeResources || 1;
              const pct = Math.min(100, Math.round((count / totalRes) * 100));
              return (
                <div key={cat} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-medium text-on-surface">
                    <span className="capitalize">{cat}</span>
                    <span className="text-on-surface-variant">
                      {count} items ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-surface-container overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Platform Actions matching QuickActionsGrid */}
        <div className="bg-surface-container-lowest rounded-2xl p-5 sm:p-6 border border-outline-variant/40 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-lg">bolt</span>
              </div>
              <h3 className="font-display font-bold text-sm sm:text-base text-on-surface">
                {isEn ? 'Quick Admin Actions' : 'त्वरित व्यवस्थापक कार्य'}
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <Link
              to="/admin/users"
              className="p-3 bg-surface-container-low hover:bg-surface-container rounded-xl text-left transition-colors space-y-1 block border border-outline-variant/20"
            >
              <span className="material-symbols-outlined text-primary text-xl block">
                person_add
              </span>
              <span className="text-xs font-bold text-on-surface block">
                {isEn ? 'User Hub' : 'उपयोगकर्ता केंद्र'}
              </span>
              <span className="text-[10px] text-on-surface-variant block">Manage accounts</span>
            </Link>

            <Link
              to="/admin/reports"
              className="p-3 bg-surface-container-low hover:bg-surface-container rounded-xl text-left transition-colors space-y-1 block border border-outline-variant/20"
            >
              <span className="material-symbols-outlined text-primary text-xl block">
                flag
              </span>
              <span className="text-xs font-bold text-on-surface block">
                {isEn ? 'Reports' : 'शिकायतें'}
              </span>
              <span className="text-[10px] text-on-surface-variant block">Moderate cases</span>
            </Link>

            <Link
              to="/admin/government-schemes"
              className="p-3 bg-surface-container-low hover:bg-surface-container rounded-xl text-left transition-colors space-y-1 block border border-outline-variant/20"
            >
              <span className="material-symbols-outlined text-primary text-xl block">
                gavel
              </span>
              <span className="text-xs font-bold text-on-surface block">
                {isEn ? 'Schemes' : 'सरकारी योजना'}
              </span>
              <span className="text-[10px] text-on-surface-variant block">Add or edit</span>
            </Link>

            <Link
              to="/admin/audit-logs"
              className="p-3 bg-surface-container-low hover:bg-surface-container rounded-xl text-left transition-colors space-y-1 block border border-outline-variant/20"
            >
              <span className="material-symbols-outlined text-primary text-xl block">
                history_edu
              </span>
              <span className="text-xs font-bold text-on-surface block">
                {isEn ? 'Audit Logs' : 'ऑडिट लॉग'}
              </span>
              <span className="text-[10px] text-on-surface-variant block">View trail</span>
            </Link>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
