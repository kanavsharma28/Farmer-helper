import React, { useState } from 'react';
import { CROPS_CATALOG } from '../../data/cropProfitData';

export default function Step3YieldAndPrice({
  calcData,
  updateCalcData,
  onCalculate,
  onBack,
  onOpenMandiModal,
  lang = 'en',
}) {
  const isEn = lang === 'en';
  const [errors, setErrors] = useState({});

  const selectedCrop = CROPS_CATALOG.find((c) => c.id === calcData.cropId) || CROPS_CATALOG[0];

  const handleYieldChange = (val) => {
    updateCalcData({ expectedYield: val });
    if (parseFloat(val) > 0 && errors.yield) {
      setErrors((prev) => ({ ...prev, yield: null }));
    }
  };

  const handlePriceChange = (val) => {
    updateCalcData({ sellingPrice: val });
    if (parseFloat(val) > 0 && errors.price) {
      setErrors((prev) => ({ ...prev, price: null }));
    }
  };

  const handleYieldUnitChange = (unit) => {
    updateCalcData({ yieldUnit: unit });
  };

  const rawYield = parseFloat(calcData.expectedYield) || 0;
  let qtlYield = rawYield;
  if (calcData.yieldUnit === 'ton') qtlYield = rawYield * 10;
  if (calcData.yieldUnit === 'kg') qtlYield = rawYield / 100;

  const numericArea = Number(calcData.area) || 1;
  const normalizedAcres = calcData.areaUnit === 'hectare' ? numericArea * 2.471 : numericArea;
  const yieldPerAcre = normalizedAcres > 0 ? (qtlYield / normalizedAcres).toFixed(1) : qtlYield;

  const price = parseFloat(calcData.sellingPrice) || 0;
  const estimatedRevenue = Math.round(qtlYield * price);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!rawYield || rawYield <= 0) {
      newErrors.yield = isEn ? 'Please enter expected yield.' : 'कृपया अनुमानित उत्पादन दर्ज करें।';
    }
    if (!price || price <= 0) {
      newErrors.price = isEn ? 'Please enter expected selling price.' : 'कृपया अनुमानित बिक्री भाव दर्ज करें।';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onCalculate();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col gap-6">
        {/* Section Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-headline-md text-xl sm:text-2xl font-bold text-on-surface">
                {isEn ? 'Step 3: Yield & Selling Price' : 'चरण 3: उत्पादन व मंडी भाव (Yield & Price)'}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-label-md text-xs font-semibold">
                {calcData.district} {isEn ? 'Zone' : 'जोन'}
              </span>
            </div>
            <p className="font-body-md text-xs sm:text-sm text-on-surface-variant mt-1">
              {isEn
                ? 'Enter expected harvest volume and prevailing mandi selling price.'
                : 'अपेक्षित फसल उपज और मौजूदा मंडी दरें दर्ज करें।'}
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenMandiModal}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-secondary-container/40 text-on-secondary-container hover:bg-secondary-container font-label-md text-xs font-bold transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">trending_up</span>
            <span>{isEn ? 'Live Mandi Benchmark' : 'मंडी मॉडल भाव'}</span>
          </button>
        </div>

        {/* 2 Main Input Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card A: Expected Yield */}
          <div className="p-5 rounded-2xl bg-surface-container-low flex flex-col justify-between gap-4 border border-outline-variant/30 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-primary text-[22px]">scale</span>
                <span className="font-label-md text-sm font-bold text-on-surface">
                  {isEn ? 'Expected Production (Yield)' : 'अनुमानित उत्पादन (Expected Yield)'}
                </span>
              </div>

              {/* Unit Selector */}
              <div className="flex items-center bg-surface-container-lowest p-0.5 rounded-lg shadow-xs text-xs font-label-md border border-outline-variant/20">
                {[
                  { id: 'quintal', label: isEn ? 'Quintal' : 'क्विंटल' },
                  { id: 'ton', label: isEn ? 'Ton' : 'टन' },
                  { id: 'kg', label: isEn ? 'Kg' : 'किग्रा' },
                ].map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => handleYieldUnitChange(u.id)}
                    className={`px-2.5 py-1 rounded-md transition-all font-semibold ${
                      calcData.yieldUnit === u.id
                        ? 'bg-primary text-on-primary shadow-xs'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    {u.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Row */}
            <div className="relative flex items-center">
              <input
                type="number"
                step="any"
                min="0"
                value={calcData.expectedYield}
                onChange={(e) => handleYieldChange(e.target.value)}
                placeholder="120"
                className={`w-full bg-surface-container-lowest px-4 py-3 rounded-xl font-headline-md text-xl sm:text-2xl font-bold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-xs border ${
                  errors.yield ? 'border-error' : 'border-outline-variant/30'
                }`}
              />
              <span className="absolute right-4 text-on-surface-variant font-label-md text-xs sm:text-sm font-medium">
                {calcData.yieldUnit === 'quintal'
                  ? (isEn ? 'Quintals' : 'क्विंटल')
                  : calcData.yieldUnit === 'ton'
                  ? (isEn ? 'Tons' : 'टन')
                  : (isEn ? 'Kg' : 'किग्रा')} ({calcData.area} {calcData.areaUnit === 'acre' ? 'एकड़' : 'हेक्टेयर'})
              </span>
            </div>

            {errors.yield && (
              <p className="font-caption text-xs text-error font-medium flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">error</span>
                {errors.yield}
              </p>
            )}

            {/* Yield per Acre Badge */}
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-container-lowest shadow-xs border border-outline-variant/20">
              <span className="material-symbols-outlined text-secondary text-[18px]">trending_up</span>
              <span className="font-label-md text-xs text-on-surface">
                <strong>{yieldPerAcre} {isEn ? 'Quintal / Acre' : 'क्विंटल / एकड़'}</strong>{' '}
                <span className="text-secondary font-medium">
                  {isEn
                    ? `(Benchmark: ~${selectedCrop.defaultYieldPerAcre} Qtl/Acre)`
                    : `(मानक औसत: ~${selectedCrop.defaultYieldPerAcre} क्विंटल)`}
                </span>
              </span>
            </div>
          </div>

          {/* Card B: Expected Selling Price */}
          <div className="p-5 rounded-2xl bg-surface-container-low flex flex-col justify-between gap-4 border border-outline-variant/30 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-primary text-[22px]">payments</span>
                <span className="font-label-md text-sm font-bold text-on-surface">
                  {isEn ? 'Expected Selling Price' : 'अनुमानित बिक्री भाव (Selling Price)'}
                </span>
              </div>

              <button
                type="button"
                onClick={onOpenMandiModal}
                className="text-primary hover:underline font-label-md text-xs font-bold flex items-center gap-0.5"
              >
                <span>{isEn ? 'Check Mandi' : 'मंडी भाव'}</span>
                <span className="material-symbols-outlined text-[14px]">open_in_new</span>
              </button>
            </div>

            {/* Price Input Row */}
            <div className="relative flex items-center">
              <span className="absolute left-4 font-headline-md text-xl sm:text-2xl text-on-surface font-bold">
                ₹
              </span>
              <input
                type="number"
                min="0"
                step="10"
                value={calcData.sellingPrice}
                onChange={(e) => handlePriceChange(e.target.value)}
                placeholder="2400"
                className={`w-full bg-surface-container-lowest pl-10 pr-28 py-3 rounded-xl font-headline-md text-xl sm:text-2xl font-bold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-xs border ${
                  errors.price ? 'border-error' : 'border-outline-variant/30'
                }`}
              />
              <span className="absolute right-4 text-on-surface-variant font-label-md text-xs sm:text-sm font-medium">
                {isEn ? 'per Quintal' : 'प्रति क्विंटल'}
              </span>
            </div>

            {errors.price && (
              <p className="font-caption text-xs text-error font-medium flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">error</span>
                {errors.price}
              </p>
            )}

            {/* Mandi Benchmark Strip */}
            <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-surface-container-lowest shadow-xs border border-outline-variant/20">
              <div className="flex items-center gap-1.5 truncate">
                <span className="material-symbols-outlined text-tertiary text-[18px] shrink-0">store</span>
                <span className="font-label-md text-xs text-on-surface truncate">
                  {calcData.district} {isEn ? 'Benchmark: ' : 'मॉडल भाव: '}
                  <strong>{selectedCrop.benchmarkRange}</strong>{' '}
                  {selectedCrop.mspPrice > 0 && (
                    <span className="text-on-surface-variant">(MSP: ₹{selectedCrop.mspPrice})</span>
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Calculation Preview Strip */}
        <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-primary text-[22px]">currency_rupee</span>
            <div>
              <span className="font-label-md text-sm font-bold text-primary block">
                {isEn ? 'Gross Revenue Formula: ' : 'अनुमानित कुल कमाई सूत्र: '}
                <span className="text-on-surface font-semibold">
                  {qtlYield} क्विंटल × ₹{price.toLocaleString('en-IN')}/क्विंटल
                </span>
              </span>
              <span className="font-caption text-xs text-on-surface-variant">
                {isEn ? 'Total Expected Revenue: ' : 'कुल अनुमानित राजस्व: '}
                <strong className="text-on-surface">₹{estimatedRevenue.toLocaleString('en-IN')}</strong>
              </span>
            </div>
          </div>

          <div className="text-right sm:self-center">
            <span className="font-headline-md text-xl font-bold text-secondary">
              ₹{estimatedRevenue.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <button
          type="button"
          onClick={onBack}
          className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-surface-container-lowest hover:bg-surface-container-high text-on-surface font-label-md text-sm font-semibold transition-colors flex items-center justify-center gap-2 shadow-xs border border-outline-variant/30"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>{isEn ? 'Back' : 'पिछला चरण (Back)'}</span>
        </button>

        <button
          type="submit"
          className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-primary hover:bg-primary-container text-on-primary font-label-md text-base font-bold transition-all shadow-md flex items-center justify-center gap-3 group"
        >
          <span>{isEn ? 'Calculate Estimated Profit' : 'अनुमानित लाभ की गणना करें (Calculate Profit)'}</span>
          <span className="material-symbols-outlined text-[20px] transition-transform group-hover:translate-x-1">
            arrow_forward
          </span>
        </button>
      </div>
    </form>
  );
}
