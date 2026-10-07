import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { getAdminKhetDoctorStats } from '../../services/adminService';

export default function AdminKhetDoctorPage() {
  const [lang, setLang] = useState('en');
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const isEn = lang === 'en';

  useEffect(() => {
    try {
      const res = getAdminKhetDoctorStats();
      setData(res);
    } catch (err) {
      console.error('Failed to load Khet Doctor stats:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  if (isLoading || !data) {
    return (
      <AdminLayout
        title="Mera Khet Ka Doctor"
        subtitle="AI Crop Disease Diagnostics & Agronomy Health Center."
        lang={lang}
        setLang={setLang}
      >
        <div className="py-24 text-center space-y-3">
          <span className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin inline-block" />
          <p className="text-xs font-semibold text-on-surface-variant">Loading diagnostic intelligence...</p>
        </div>
      </AdminLayout>
    );
  }

  const statCards = [
    {
      id: 'total-scans',
      label: isEn ? 'Total Diagnoses' : 'कुल फसल जांच',
      value: data.totalDiagnoses,
      icon: 'medical_services',
    },
    {
      id: 'accuracy',
      label: isEn ? 'Diagnostic Accuracy' : 'जांच सटीकता',
      value: `${data.accuracyRate}%`,
      icon: 'verified',
    },
    {
      id: 'successful',
      label: isEn ? 'Successful Analyses' : 'सफल विश्लेषण',
      value: data.successfulAnalyses,
      icon: 'task_alt',
    },
    {
      id: 'failed',
      label: isEn ? 'Failed / Retries' : 'पुनर्प्रयास / विफल',
      value: data.failedAnalyses,
      icon: 'running_with_errors',
    },
  ];

  return (
    <AdminLayout
      title="Mera Khet Ka Doctor"
      subtitle="AI-driven crop disease diagnostics, plant pathology reports, and health metrics."
      lang={lang}
      setLang={setLang}
    >
      {/* Top Stats Cards matching FarmStatsRow */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4">
        {statCards.map((stat) => (
          <div
            key={stat.id}
            className="bg-surface-container-lowest rounded-2xl p-4 border border-outline-variant/40 shadow-xs flex items-center gap-3.5"
          >
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20">
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
          </div>
        ))}
      </div>

      {/* Breakdown Row: Most Analyzed Crops & Common Diseases */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Most Analyzed Crops */}
        <div className="bg-surface-container-lowest rounded-2xl p-5 sm:p-6 border border-outline-variant/40 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 border-b border-outline-variant/20 pb-3">
            <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-lg">spa</span>
            </div>
            <h3 className="font-display font-bold text-sm sm:text-base text-on-surface">
              {isEn ? 'Most Analyzed Crops' : 'सर्वाधिक जांची गई फसलें'}
            </h3>
          </div>

          <div className="space-y-3">
            {data.topCrops.map((c) => {
              const maxCount = data.topCrops[0]?.count || 1;
              const pct = Math.round((c.count / maxCount) * 100);
              return (
                <div key={c.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-medium text-on-surface">
                    <span>{c.name}</span>
                    <span className="text-on-surface-variant">{c.count} scans</span>
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

        {/* Common Disease Results */}
        <div className="bg-surface-container-lowest rounded-2xl p-5 sm:p-6 border border-outline-variant/40 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 border-b border-outline-variant/20 pb-3">
            <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-lg">pest_control</span>
            </div>
            <h3 className="font-display font-bold text-sm sm:text-base text-on-surface">
              {isEn ? 'Common Diagnosed Pathologies' : 'प्रमुख पाए गए रोग एवं कीट'}
            </h3>
          </div>

          <div className="space-y-3">
            {data.topDiseases.map((d) => {
              const maxCount = data.topDiseases[0]?.count || 1;
              const pct = Math.round((d.count / maxCount) * 100);
              return (
                <div key={d.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-medium text-on-surface">
                    <span className="truncate max-w-[240px]">{d.name}</span>
                    <span className="text-on-surface-variant shrink-0">{d.count} times</span>
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
      </div>

      {/* Recent Diagnostic Scans List */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-outline-variant/20 bg-surface-container-low/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-xl">biotech</span>
            <h3 className="font-display font-bold text-sm sm:text-base text-on-surface">
              Recent AI Diagnostic Scans
            </h3>
          </div>
          <span className="text-xs text-on-surface-variant font-medium">Platform Aggregate Telemetry</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="bg-surface-container-low/60 border-b border-outline-variant/30 text-on-surface-variant font-bold uppercase tracking-wider text-[11px]">
                <th className="p-3.5 sm:p-4">Crop</th>
                <th className="p-3.5 sm:p-4">Diagnosis Result</th>
                <th className="p-3.5 sm:p-4">Confidence</th>
                <th className="p-3.5 sm:p-4">Recommended Treatment</th>
                <th className="p-3.5 sm:p-4">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/15">
              {data.recentDiagnoses.map((d, idx) => (
                <tr key={idx} className="hover:bg-surface-container-low/40 transition-colors text-on-surface">
                  <td className="p-3.5 sm:p-4 font-bold">{d.crop || 'Wheat'}</td>
                  <td className="p-3.5 sm:p-4 font-semibold text-primary">{d.disease || 'Yellow Rust'}</td>
                  <td className="p-3.5 sm:p-4 font-mono font-bold text-emerald-800">{d.confidence || '96%'}</td>
                  <td className="p-3.5 sm:p-4 text-on-surface-variant text-xs truncate max-w-[250px]">
                    {d.treatment || 'Apply systemic fungicide'}
                  </td>
                  <td className="p-3.5 sm:p-4 font-mono text-[11px] text-outline">
                    {d.timestamp ? new Date(d.timestamp).toLocaleDateString() : 'Today'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
