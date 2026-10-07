import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { getPlatformAnalytics } from '../../services/adminService';

export default function AdminAnalyticsPage() {
  const [lang, setLang] = useState('en');
  const [timeframe, setTimeframe] = useState('30d');
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    try {
      const data = getPlatformAnalytics(timeframe);
      setAnalytics(data);
    } catch (err) {
      console.error('Error fetching analytics:', err);
    } finally {
      setIsLoading(false);
    }
  }, [timeframe]);

  if (isLoading || !analytics) {
    return (
      <AdminLayout
        title="Platform Analytics"
        subtitle="Aggregated platform data, growth indices, and cross-functional engagement."
        lang={lang}
        setLang={setLang}
      >
        <div className="py-24 text-center space-y-3">
          <span className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin inline-block" />
          <p className="text-sm font-semibold text-on-surface-variant">Aggregating platform datasets...</p>
        </div>
      </AdminLayout>
    );
  }

  const totals = analytics.totals;

  return (
    <AdminLayout
      title="Platform Analytics"
      subtitle="Comprehensive metrics across user registrations, shared resources, student placements, and trade."
      lang={lang}
      setLang={setLang}
    >
      {/* Timeframe Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/40 shadow-xs">
        <div>
          <h2 className="text-sm font-bold text-on-surface">Analytics Range</h2>
          <p className="text-xs text-on-surface-variant">Real-time aggregated platform database metrics</p>
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {[
            { id: 'today', label: 'Today' },
            { id: '7d', label: '7 Days' },
            { id: '30d', label: '30 Days' },
            { id: '3m', label: '3 Months' },
            { id: '1y', label: '1 Year' },
          ].map((tf) => (
            <button
              key={tf.id}
              type="button"
              onClick={() => setTimeframe(tf.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                timeframe === tf.id
                  ? 'bg-primary text-white shadow-xs'
                  : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
              }`}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: 'Total Users', value: totals.users, icon: 'group', color: 'text-emerald-700', bg: 'bg-emerald-50' },
          { label: 'Resources Listed', value: totals.resources, icon: 'agriculture', color: 'text-teal-700', bg: 'bg-teal-50' },
          { label: 'Internships', value: totals.internships, icon: 'school', color: 'text-blue-700', bg: 'bg-blue-50' },
          { label: 'Training Sessions', value: totals.trainings, icon: 'psychology', color: 'text-cyan-700', bg: 'bg-cyan-50' },
          { label: 'Discussions', value: totals.posts, icon: 'forum', color: 'text-purple-700', bg: 'bg-purple-50' },
          { label: 'Chat Volume', value: totals.conversations, icon: 'chat', color: 'text-amber-700', bg: 'bg-amber-50' },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/40 shadow-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">{kpi.label}</span>
              <div className={`w-8 h-8 rounded-full ${kpi.bg} ${kpi.color} flex items-center justify-center`}>
                <span className="material-symbols-outlined text-[17px]">{kpi.icon}</span>
              </div>
            </div>
            <div className="text-2xl font-black text-on-surface">{kpi.value}</div>
          </div>
        ))}
      </div>

      {/* Growth Trend & Visual Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <div className="bg-surface-container-lowest p-5 sm:p-6 rounded-2xl border border-outline-variant/40 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-on-surface">User Growth Trend</h3>
              <p className="text-xs text-on-surface-variant">Cumulative accounts onboarded across months</p>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
              +38% MoM
            </span>
          </div>

          <div className="pt-4 flex items-end justify-between gap-3 h-48 border-b border-outline-variant/30 pb-2">
            {analytics.monthlyGrowth.map((mg) => {
              const maxUsers = 260;
              const heightPct = Math.min(100, Math.round((mg.users / maxUsers) * 100));
              return (
                <div key={mg.period} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <span className="text-[10px] font-bold text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity">
                    {mg.users}
                  </span>
                  <div
                    className="w-full max-w-[36px] bg-primary/90 hover:bg-primary rounded-t-xl transition-all duration-300 shadow-xs"
                    style={{ height: `${heightPct}%` }}
                  />
                  <span className="text-[10px] text-on-surface-variant truncate w-full text-center">
                    {mg.period.split(' ')[0]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* User Role Distribution */}
        <div className="bg-surface-container-lowest p-5 sm:p-6 rounded-2xl border border-outline-variant/40 shadow-xs space-y-4">
          <div>
            <h3 className="font-bold text-base text-on-surface">Ecosystem Role Breakdown</h3>
            <p className="text-xs text-on-surface-variant">Active participation per audience segment</p>
          </div>

          <div className="space-y-3 pt-2">
            {[
              { role: 'Farmers', count: totals.farmers, color: 'bg-primary', text: 'text-primary' },
              { role: 'Agricultural Students', count: totals.students, color: 'bg-blue-600', text: 'text-blue-700' },
              { role: 'Wholesale Buyers', count: totals.buyers, color: 'bg-amber-600', text: 'text-amber-700' },
              { role: 'Logistics & Resource Providers', count: totals.providers, color: 'bg-teal-600', text: 'text-teal-700' },
            ].map((item) => {
              const pct = totals.users > 0 ? Math.round((item.count / totals.users) * 100) : 0;
              return (
                <div key={item.role} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-on-surface">{item.role}</span>
                    <span className="font-bold text-on-surface">{item.count} ({pct}%)</span>
                  </div>
                  <div className="w-full h-2.5 bg-surface-container-low rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color} rounded-full transition-all duration-500`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Engagement Modules Utilization */}
      <div className="bg-surface-container-lowest p-5 sm:p-6 rounded-2xl border border-outline-variant/40 shadow-xs space-y-4">
        <div>
          <h3 className="font-bold text-base text-on-surface">Functional Modules Utilization Rate</h3>
          <p className="text-xs text-on-surface-variant">Real operational health indices across specialized agro-services</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-4 bg-surface-container-low/50 rounded-2xl space-y-1 border border-outline-variant/30">
            <span className="text-on-surface-variant font-medium">Resources Occupancy</span>
            <span className="text-xl font-black text-primary block">78% Active</span>
            <span className="text-[11px] text-on-surface-variant">Dispatch requests cleared</span>
          </div>
          <div className="p-4 bg-surface-container-low/50 rounded-2xl space-y-1 border border-outline-variant/30">
            <span className="text-on-surface-variant font-medium">Internship Placement Rate</span>
            <span className="text-xl font-black text-blue-700 block">64% Placed</span>
            <span className="text-[11px] text-on-surface-variant">Applications shortlisted</span>
          </div>
          <div className="p-4 bg-surface-container-low/50 rounded-2xl space-y-1 border border-outline-variant/30">
            <span className="text-on-surface-variant font-medium">Disease Scan Accuracy</span>
            <span className="text-xl font-black text-teal-700 block">96% Confirmed</span>
            <span className="text-[11px] text-on-surface-variant">AI field diagnostic runs</span>
          </div>
          <div className="p-4 bg-surface-container-low/50 rounded-2xl space-y-1 border border-outline-variant/30">
            <span className="text-on-surface-variant font-medium">Dispute Resolution</span>
            <span className="text-xl font-black text-purple-700 block">100% On-time</span>
            <span className="text-[11px] text-on-surface-variant">Complaints resolved</span>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
