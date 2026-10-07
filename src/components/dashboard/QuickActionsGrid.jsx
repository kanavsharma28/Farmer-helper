import React from 'react';
import { dashboardData } from '../../data/dashboardContent';

export default function QuickActionsGrid({ lang = 'en', onActionClick }) {
  const isEn = lang === 'en';
  const { quickActions } = dashboardData;

  return (
    <div className="lg:col-span-7 flex flex-col gap-4">
      <h2 className="font-headline-md text-xl font-bold text-on-surface mb-1">
        {isEn ? 'Quick Actions' : 'त्वरित कार्य'}
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {quickActions.map((action) => (
          <button
            key={action.id}
            onClick={() => onActionClick && onActionClick(action.id)}
            className="bg-surface-container-lowest border border-outline-variant/50 rounded-[16px] p-4 flex flex-col items-center justify-center text-center gap-3 hover:bg-surface-container-low transition-all shadow-xs hover:shadow-md aspect-square group active:scale-95 cursor-pointer"
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 ${
              action.color === 'secondary'
                ? 'bg-secondary/10 text-secondary'
                : action.color === 'tertiary'
                ? 'bg-tertiary/10 text-tertiary'
                : action.color === 'error'
                ? 'bg-error/10 text-error'
                : 'bg-primary/10 text-primary'
            }`}>
              <span className="material-symbols-outlined material-fill text-2xl">
                {action.icon}
              </span>
            </div>

            <span className="font-label-md text-xs sm:text-sm font-semibold text-on-surface leading-tight">
              {isEn ? action.titleEn : action.titleHi}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
