import React from 'react';
import { dashboardData } from '../../data/dashboardContent';

export default function FarmStatsRow({ lang = 'en' }) {
  const isEn = lang === 'en';
  const { stats } = dashboardData;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {stats.map((stat) => (
        <div
          key={stat.id}
          className="bg-surface-container-lowest rounded-xl p-4 border border-outline-variant/50 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4"
        >
          <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
            stat.color === 'secondary'
              ? 'bg-secondary-container/20 text-on-secondary-container'
              : stat.color === 'tertiary'
              ? 'bg-tertiary-container/10 text-tertiary-container'
              : 'bg-primary-container/10 text-primary-container'
          }`}>
            <span className="material-symbols-outlined text-xl">
              {stat.icon}
            </span>
          </div>

          <div>
            <p className="font-caption text-xs text-on-surface-variant font-medium">
              {isEn ? stat.labelEn : stat.labelHi}
            </p>
            <p className="font-headline-md text-base sm:text-lg font-bold text-on-surface">
              {stat.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
