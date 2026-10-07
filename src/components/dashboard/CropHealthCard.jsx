import React from 'react';
import { dashboardData } from '../../data/dashboardContent';

export default function CropHealthCard({ lang = 'en' }) {
  const isEn = lang === 'en';
  const { cropHealth } = dashboardData;

  return (
    <div className="glass-card rounded-[24px] p-6 md:col-span-4 flex flex-col items-center justify-center relative overflow-hidden border border-outline-variant/50 shadow-md">
      <h3 className="font-headline-md text-base font-bold text-on-surface mb-6 self-start w-full text-center">
        {isEn ? 'Your Crop Health' : 'आपकी फसल का स्वास्थ्य'}
      </h3>

      {/* SVG Circular Progress Gauge */}
      <div className="relative w-40 h-40 flex items-center justify-center mb-4">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#e5e2e1"
            strokeWidth="10"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#006e1c"
            strokeWidth="10"
            strokeDasharray="283"
            strokeDashoffset="36.79"
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        <div className="absolute flex flex-col items-center">
          <span className="font-display-lg text-3xl font-bold text-primary">
            {cropHealth.score}%
          </span>
          <span className="font-caption text-xs text-on-surface-variant font-medium">
            {isEn ? 'Health Score' : 'स्वास्थ्य स्कोर'}
          </span>
        </div>
      </div>

      {/* Status Pill */}
      <div className="flex items-center gap-2 bg-secondary-fixed/30 border border-secondary/20 px-4 py-1.5 rounded-full mt-2 shadow-2xs">
        <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse"></span>
        <span className="font-label-md text-xs font-bold text-on-secondary-fixed-variant">
          {isEn ? cropHealth.statusEn : cropHealth.statusHi}
        </span>
      </div>
    </div>
  );
}
