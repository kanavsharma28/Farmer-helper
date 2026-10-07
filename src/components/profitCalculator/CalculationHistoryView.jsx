import React, { useState, useMemo } from 'react';

export default function CalculationHistoryView({
  history,
  onLoadCalculation,
  onDuplicateCalculation,
  onDeleteCalculation,
  onStartNew,
  lang = 'en',
}) {
  const isEn = lang === 'en';
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeason, setSelectedSeason] = useState('all');

  const filteredHistory = useMemo(() => {
    return history.filter((item) => {
      const matchesSeason =
        selectedSeason === 'all' || item.season === selectedSeason;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        (item.cropNameEn && item.cropNameEn.toLowerCase().includes(q)) ||
        (item.cropNameHi && item.cropNameHi.includes(q)) ||
        (item.district && item.district.toLowerCase().includes(q)) ||
        (item.id && item.id.toLowerCase().includes(q));

      return matchesSeason && matchesSearch;
    });
  }, [history, selectedSeason, searchQuery]);

  return (
    <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col gap-6 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-headline-md text-xl sm:text-2xl font-bold text-on-surface">
              {isEn ? 'My Saved Calculations' : 'मेरी पिछली गणनाएं (Calculation History)'}
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-label-md text-xs font-bold">
              {filteredHistory.length} {isEn ? 'Records' : 'गणनाएं'}
            </span>
          </div>
          <p className="font-body-md text-xs sm:text-sm text-on-surface-variant mt-1">
            {isEn
              ? 'Review, compare, or re-run your previous crop cost and profit estimates.'
              : 'अपने पुराने लाभ अनुमानों की समीक्षा करें, संपादित करें या पुनः गणना करें।'}
          </p>
        </div>

        <button
          type="button"
          onClick={onStartNew}
          className="self-start sm:self-auto px-4 py-2.5 rounded-xl bg-primary text-on-primary hover:bg-primary-container shadow-xs font-label-md text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5"
        >
          <span className="material-symbols-outlined text-[18px]">add_circle</span>
          <span>{isEn ? 'New Estimate' : 'नई गणना शुरू करें'}</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isEn ? 'Search crop or ID (e.g. Wheat)...' : 'फसल या गणना खोजें...'}
            className="w-full bg-surface-container-low pl-9 pr-4 py-2 rounded-xl text-xs sm:text-sm text-on-surface placeholder:text-on-surface-variant border border-outline-variant/30 focus:border-primary focus:bg-surface-container-lowest outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface text-xs"
            >
              ✕
            </button>
          )}
        </div>

        {/* Season Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-surface-container rounded-xl w-full sm:w-auto overflow-x-auto">
          {[
            { id: 'all', labelEn: 'All Seasons', labelHi: 'सभी सत्र' },
            { id: 'rabi', labelEn: 'Rabi', labelHi: 'रबी' },
            { id: 'kharif', labelEn: 'Kharif', labelHi: 'खरीफ' },
            { id: 'zaid', labelEn: 'Zaid', labelHi: 'जायद' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSelectedSeason(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedSeason === tab.id
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {isEn ? tab.labelEn : tab.labelHi}
            </button>
          ))}
        </div>
      </div>

      {/* History Grid */}
      {filteredHistory.length === 0 ? (
        <div className="p-12 text-center flex flex-col items-center justify-center rounded-2xl bg-surface-container-low border border-dashed border-outline-variant/40 my-4">
          <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-2">
            history_toggle_off
          </span>
          <h3 className="font-headline-md text-base font-bold text-on-surface">
            {isEn ? 'No Saved Calculations Found' : 'कोई सहेजी गई गणना नहीं मिली'}
          </h3>
          <p className="font-body-md text-xs text-on-surface-variant mt-1 max-w-sm">
            {isEn
              ? 'Try adjusting your search criteria or calculate a new crop estimate.'
              : 'कृपया अपनी खोज बदलें या एक नया फसल लाभ अनुमान तैयार करें।'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredHistory.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-surface-container-low hover:bg-surface-container border border-outline-variant/30 hover:border-primary/40 shadow-xs transition-all flex flex-col justify-between gap-4 group"
            >
              {/* Card Top Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-surface-container-lowest flex items-center justify-center text-2xl shadow-xs shrink-0 border border-outline-variant/20">
                    {item.emoji || '🌾'}
                  </div>
                  <div>
                    <h3 className="font-headline-md text-sm sm:text-base font-bold text-on-surface group-hover:text-primary transition-colors">
                      {isEn ? item.cropNameEn : item.cropNameHi}
                    </h3>
                    <p className="font-caption text-xs text-on-surface-variant">
                      {item.area} {item.areaUnit === 'acre' ? (isEn ? 'Acres' : 'एकड़') : (isEn ? 'Hectares' : 'हेक्टेयर')} • {item.district}, {item.state}
                    </p>
                  </div>
                </div>

                <span className="font-mono text-[11px] font-semibold text-outline px-2 py-0.5 rounded bg-surface-container-lowest border border-outline-variant/30">
                  {item.id}
                </span>
              </div>

              {/* Financial Metrics Strip */}
              <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/20 text-center">
                <div className="flex flex-col">
                  <span className="font-caption text-[11px] text-on-surface-variant">
                    {isEn ? 'Total Cost' : 'कुल लागत'}
                  </span>
                  <span className="font-label-md text-xs sm:text-sm font-bold text-error mt-0.5">
                    ₹{item.totalCost.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="flex flex-col border-x border-outline-variant/20">
                  <span className="font-caption text-[11px] text-on-surface-variant">
                    {isEn ? 'Net Profit' : 'शुद्ध लाभ'}
                  </span>
                  <span className="font-label-md text-xs sm:text-sm font-bold text-secondary mt-0.5">
                    ₹{item.netProfit.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="flex flex-col">
                  <span className="font-caption text-[11px] text-on-surface-variant">
                    {isEn ? 'Profit / Acre' : 'लाभ / एकड़'}
                  </span>
                  <span className="font-label-md text-xs sm:text-sm font-bold text-primary mt-0.5">
                    ₹{item.profitPerAcre.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Footer with Date & Actions */}
              <div className="flex items-center justify-between pt-1 border-t border-outline-variant/20 text-xs">
                <span className="font-caption text-[11px] text-on-surface-variant">
                  {isEn ? 'Calculated on ' : 'दिनांक: '}{item.date}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => onLoadCalculation(item)}
                    className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white font-label-md font-bold transition-colors flex items-center gap-1"
                    title={isEn ? 'View or edit this calculation' : 'यह गणना खोलें'}
                  >
                    <span className="material-symbols-outlined text-[14px]">visibility</span>
                    <span>{isEn ? 'View' : 'देखें'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onDuplicateCalculation(item)}
                    className="p-1.5 rounded-lg hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-colors"
                    title={isEn ? 'Duplicate as new template' : 'कॉपी करें'}
                  >
                    <span className="material-symbols-outlined text-[16px]">content_copy</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onDeleteCalculation(item.id)}
                    className="p-1.5 rounded-lg hover:bg-error/10 text-on-surface-variant hover:text-error transition-colors"
                    title={isEn ? 'Delete record' : 'हटाएं'}
                  >
                    <span className="material-symbols-outlined text-[16px]">delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
