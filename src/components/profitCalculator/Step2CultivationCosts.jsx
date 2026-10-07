import React from 'react';
import { COST_CATEGORIES, CROPS_CATALOG } from '../../data/cropProfitData';

export default function Step2CultivationCosts({
  calcData,
  updateCalcData,
  onNext,
  onBack,
  onEditCrop,
  lang = 'en',
}) {
  const isEn = lang === 'en';
  const selectedCrop = CROPS_CATALOG.find((c) => c.id === calcData.cropId) || CROPS_CATALOG[0];

  const handleCostChange = (categoryId, value) => {
    const numeric = value === '' ? '' : Math.max(0, parseInt(value, 10) || 0);
    updateCalcData({
      costs: {
        ...calcData.costs,
        [categoryId]: numeric,
      },
    });
  };

  // Calculate live total cost
  const totalCost = Object.values(calcData.costs || {}).reduce(
    (acc, curr) => acc + (Number(curr) || 0),
    0
  );

  const numericArea = Number(calcData.area) || 1;
  const normalizedAcres = calcData.areaUnit === 'hectare' ? numericArea * 2.471 : numericArea;
  const costPerAcre = normalizedAcres > 0 ? Math.round(totalCost / normalizedAcres) : totalCost;

  return (
    <div className="flex flex-col gap-6">
      {/* Step 1 Summary Banner (Editable Pill) */}
      <div className="bg-primary/5 p-4 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 border border-primary/20 shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-surface-container-lowest flex items-center justify-center text-primary shadow-xs shrink-0 text-2xl">
            {selectedCrop.emoji}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-surface-container-lowest text-on-surface font-label-md text-sm font-semibold shadow-xs border border-outline-variant/30">
              {selectedCrop.emoji} {isEn ? selectedCrop.nameEn : selectedCrop.nameHi}
              {calcData.customCropName ? ` (${calcData.customCropName})` : ` (${selectedCrop.variety.split('/')[0]})`}
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-surface-container-lowest text-on-surface-variant font-label-md text-xs border border-outline-variant/30">
              {isEn ? 'Area: ' : 'रकबा: '}
              <strong className="text-on-surface">
                {calcData.area} {calcData.areaUnit === 'acre' ? (isEn ? 'Acres' : 'एकड़') : (isEn ? 'Hectares' : 'हेक्टेयर')}
              </strong>
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-surface-container-lowest text-on-surface-variant font-label-md text-xs border border-outline-variant/30">
              {isEn ? 'Season: ' : 'सत्र: '}
              <strong className="text-on-surface capitalize">{calcData.season} {calcData.seasonYear}</strong>
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-surface-container-lowest text-on-surface-variant font-label-md text-xs border border-outline-variant/30">
              {isEn ? 'District: ' : 'मंडी: '}
              <strong className="text-on-surface">{calcData.district}</strong>
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onEditCrop}
          className="self-end md:self-auto px-3.5 py-1.5 rounded-xl bg-surface-container-lowest text-primary hover:bg-surface-container-high font-label-md text-xs font-semibold transition-colors flex items-center gap-1 shrink-0 shadow-xs border border-primary/20"
        >
          <span className="material-symbols-outlined text-[16px]">edit</span>
          <span>{isEn ? 'Change' : 'बदलें (Change)'}</span>
        </button>
      </div>

      {/* Main Expenses Input Card */}
      <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-headline-md text-xl sm:text-2xl font-bold text-on-surface">
                {isEn ? 'Step 2: Cultivation Expenses' : 'चरण 2: खेती की लागत (Cultivation Expenses)'}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-label-md text-xs font-semibold">
                {calcData.area} {calcData.areaUnit === 'acre' ? 'एकड़' : 'हेक्टेयर'} हेतु
              </span>
            </div>
            <p className="font-body-md text-xs sm:text-sm text-on-surface-variant mt-1">
              {isEn
                ? 'Enter estimated expenses across key categories. Blank optional fields will count as ₹0.'
                : 'विभिन्न मदों में अनुमानित खर्च दर्ज करें। (वैकल्पिक मद खाली छोड़ने पर ₹0 माना जाएगा)'}
            </p>
          </div>
          <span className="text-right font-caption text-xs text-secondary font-medium hidden sm:block">
            {isEn ? 'Auto-calculates Live' : 'ऑटो-कैलकुलेटेड डेटा'}
          </span>
        </div>

        {/* Cost Input Grid (7 Categories) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {COST_CATEGORIES.map((cat, idx) => {
            const isFullWidth = idx === COST_CATEGORIES.length - 1;
            const value = calcData.costs?.[cat.id] ?? '';

            return (
              <div
                key={cat.id}
                className={`p-4 rounded-xl bg-surface-container-low hover:bg-surface-container transition-all flex flex-col justify-between gap-3 border border-outline-variant/20 ${
                  isFullWidth ? 'md:col-span-2 sm:flex-row sm:items-center' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl ${cat.badgeColor} flex items-center justify-center shrink-0`}>
                    <span className="material-symbols-outlined text-[22px]">{cat.icon}</span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <h3 className="font-label-md text-sm font-bold text-on-surface">
                      {isEn ? cat.labelEn : cat.labelHi}
                    </h3>
                    <p className="font-caption text-xs text-on-surface-variant">
                      {isEn ? cat.descEn : cat.descHi}
                    </p>
                  </div>
                </div>

                <div className={`relative flex items-center ${isFullWidth ? 'w-full sm:w-64 shrink-0' : 'w-full'}`}>
                  <span className="absolute left-3.5 text-on-surface-variant font-label-md font-bold text-sm">
                    ₹
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="100"
                    value={value}
                    onChange={(e) => handleCostChange(cat.id, e.target.value)}
                    placeholder="0"
                    className="w-full bg-surface-container-lowest pl-8 pr-4 py-2.5 rounded-xl font-label-md text-sm font-bold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-xs border border-outline-variant/30 text-right"
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Prominent Bottom Cost Tally Banner */}
        <div className="p-5 rounded-2xl bg-surface-container-high flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs border border-outline-variant/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center shrink-0 shadow-xs">
              <span className="material-symbols-outlined text-[22px]">receipt_long</span>
            </div>
            <div>
              <p className="font-label-md text-sm sm:text-base text-on-surface font-bold">
                {isEn ? 'Total Estimated Cultivation Cost' : 'कुल अनुमानित खेती लागत (Total Cultivation Cost)'}
              </p>
              <p className="font-caption text-xs text-on-surface-variant">
                {isEn ? 'Average Cost per Acre: ' : 'औसत प्रति एकड़ लागत: '}
                <span className="font-bold text-on-surface">
                  ₹{costPerAcre.toLocaleString('en-IN')}
                </span>
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="font-headline-md text-2xl sm:text-3xl text-primary font-bold block">
              ₹{totalCost.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Actions */}
      <div className="flex items-center justify-between gap-4 pt-2">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-3.5 rounded-xl bg-surface-container-lowest hover:bg-surface-container-high text-on-surface font-label-md text-sm font-semibold transition-colors flex items-center gap-2 shadow-xs border border-outline-variant/30"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>{isEn ? 'Back' : 'पिछला चरण (Back)'}</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          className="px-8 py-3.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-label-md text-sm font-bold shadow-md transition-all flex items-center gap-2 group"
        >
          <span>{isEn ? 'Proceed to Yield & Price' : 'उत्पादन व भाव दर्ज करें'}</span>
          <span className="material-symbols-outlined text-[18px] transition-transform group-hover:translate-x-1">
            arrow_forward
          </span>
        </button>
      </div>
    </div>
  );
}
