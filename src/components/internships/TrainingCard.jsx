import React from 'react';

export default function TrainingCard({ program, onEnroll }) {
  const {
    title,
    badge,
    badgeColor,
    fee,
    isFree,
    description,
    location,
    dates,
    seatsLeft,
    accreditation
  } = program;

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4 relative overflow-hidden border border-outline-variant/30">
      <div className="space-y-3">
        
        {/* Top Badge & Fee Row */}
        <div className="flex items-center justify-between gap-2">
          <span className={`px-3 py-1 rounded-full font-label-md text-xs font-semibold ${badgeColor || 'bg-secondary-container/40 text-on-secondary-container'}`}>
            {badge}
          </span>
          <span className={`font-headline-md text-lg sm:text-xl font-bold ${isFree ? 'text-secondary' : 'text-primary'}`}>
            {fee}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-headline-md text-base sm:text-lg font-bold text-on-surface leading-snug">
          {title}
        </h3>

        {/* Description */}
        <p className="font-body-md text-xs sm:text-sm text-on-surface-variant leading-relaxed">
          {description}
        </p>

      </div>

      <div className="space-y-4 pt-2 border-t border-outline-variant/20">
        {/* Metadata items */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-on-surface-variant font-label-md text-xs sm:text-sm">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-primary text-[18px]">pin_drop</span>
            <span className="truncate">{location}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-primary text-[18px]">calendar_month</span>
            <span>{dates}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-primary text-[18px]">group</span>
            <span className="font-medium text-error">Seats: {seatsLeft} left</span>
          </div>
        </div>

        {/* Bottom CTA Row */}
        <div className="flex items-center justify-between gap-3 pt-1">
          <span className="font-caption text-xs text-outline truncate max-w-[180px] sm:max-w-none">
            {accreditation}
          </span>
          <button
            type="button"
            onClick={() => onEnroll(program)}
            className={`px-4 sm:px-5 py-2.5 rounded-xl font-label-md text-xs sm:text-sm font-semibold transition-colors shrink-0 shadow-xs ${
              isFree
                ? 'bg-secondary text-on-secondary hover:bg-primary'
                : 'bg-primary text-on-primary hover:bg-primary-container'
            }`}
          >
            {isFree ? 'Register Free (निःशुल्क आवेदन)' : 'Enroll Now (सीट बुक करें)'}
          </button>
        </div>
      </div>

    </div>
  );
}
