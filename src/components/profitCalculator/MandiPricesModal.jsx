import React, { useState } from 'react';
import { MANDI_BENCHMARKS } from '../../data/cropProfitData';

export default function MandiPricesModal({ isOpen, onClose, onApplyPrice, lang = 'en' }) {
  const isEn = lang === 'en';
  const [filterQuery, setFilterQuery] = useState('');

  if (!isOpen) return null;

  const filteredMandis = MANDI_BENCHMARKS.filter(
    (m) =>
      !filterQuery ||
      m.mandiName.toLowerCase().includes(filterQuery.toLowerCase()) ||
      m.cropHi.toLowerCase().includes(filterQuery.toLowerCase()) ||
      m.state.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
      <div className="bg-surface-container-lowest w-full max-w-2xl rounded-3xl shadow-xl border border-outline-variant/30 flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-outline-variant/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">store</span>
            </div>
            <div>
              <h3 className="font-headline-md text-base sm:text-lg font-bold text-on-surface">
                {isEn ? 'Live Mandi Benchmark Rates' : 'मंडी मॉडल भाव संदर्भ (APMC Benchmarks)'}
              </h3>
              <p className="font-body-md text-xs text-on-surface-variant">
                {isEn
                  ? 'Real-time representative rates from major agricultural markets'
                  : 'प्रमुख कृषि मंडियों से संकलित औसत व मॉडल थोक भाव'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Search */}
        <div className="px-6 pt-4 pb-2">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">
              search
            </span>
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder={isEn ? 'Filter mandi or crop...' : 'मंडी या फसल खोजें...'}
              className="w-full bg-surface-container-low pl-9 pr-4 py-2 rounded-xl text-xs sm:text-sm text-on-surface placeholder:text-on-surface-variant border border-outline-variant/30 focus:border-primary focus:bg-surface-container-lowest outline-none"
            />
          </div>
        </div>

        {/* Mandi Cards List */}
        <div className="p-6 overflow-y-auto space-y-3 flex-1">
          {filteredMandis.map((mandi) => (
            <div
              key={mandi.id}
              className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/20 hover:border-primary/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-headline-md text-sm font-bold text-on-surface">
                    {mandi.cropHi}
                  </span>
                  <span className="font-caption text-[11px] px-2 py-0.5 rounded bg-surface-container text-on-surface-variant">
                    {mandi.state}
                  </span>
                </div>
                <p className="font-caption text-xs text-on-surface-variant mt-0.5">
                  {mandi.mandiName} • {isEn ? 'Arrival: ' : 'आवक: '}{mandi.arrivalTons} {isEn ? 'Tons' : 'टन'}
                </p>

                <div className="flex items-center gap-2 mt-2 text-xs">
                  <span className="text-on-surface-variant">
                    {isEn ? 'Range: ' : 'सीमा: '}
                    <strong>₹{mandi.minPrice} - ₹{mandi.maxPrice}</strong>
                  </span>
                  {mandi.msp > 0 && (
                    <span className="text-secondary font-semibold">
                      (MSP: ₹{mandi.msp})
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-center">
                <div className="text-right">
                  <span className="font-headline-md text-base sm:text-lg font-bold text-primary block">
                    ₹{mandi.modalPrice.toLocaleString('en-IN')}
                  </span>
                  <span className="font-caption text-[10px] text-on-surface-variant block">
                    {isEn ? 'per Quintal' : 'प्रति क्विंटल'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onApplyPrice(mandi.modalPrice);
                    onClose();
                  }}
                  className="px-3.5 py-2 rounded-xl bg-primary text-on-primary hover:bg-primary-container font-label-md text-xs font-bold transition-all shadow-xs"
                >
                  {isEn ? 'Use Rate' : 'यह भाव चुनें'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-surface-container-low border-t border-outline-variant/20 text-center text-xs text-on-surface-variant">
          {isEn
            ? 'Rates are indicative market aggregates for financial planning purposes.'
            : 'प्रदर्शित भाव वित्तीय अनुमान हेतु सांकेतिक औसत मॉडल भाव हैं।'}
        </div>
      </div>
    </div>
  );
}
