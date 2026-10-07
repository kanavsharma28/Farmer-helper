import React from 'react';
import { translations } from '../data/content';

export default function StatsBar({ lang }) {
  const t = translations[lang] || translations.en;

  const stats = [
    { num: t.stat1Number, label: t.stat1Label, icon: 'grid_view' },
    { num: t.stat2Number, label: t.stat2Label, icon: 'near_me' },
    { num: t.stat3Number, label: t.stat3Label, icon: 'translate' },
    { num: t.stat4Number, label: t.stat4Label, icon: 'schedule' },
  ];

  return (
    <section className="bg-surface-container-low py-12 border-y border-surface-variant/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((stat, idx) => (
          <div 
            key={idx} 
            className="text-center p-4 rounded-2xl bg-white/50 border border-surface-variant/40 hover:bg-white transition-all shadow-sm hover:shadow-md"
          >
            <div className="flex justify-center mb-2">
              <span className="material-symbols-outlined text-secondary text-2xl">
                {stat.icon}
              </span>
            </div>
            <div className="font-headline-lg text-3xl sm:text-4xl font-extrabold text-primary-container mb-1 tracking-tight">
              {stat.num}
            </div>
            <div className="font-label-md text-sm text-on-surface-variant font-medium">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
