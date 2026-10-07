import React, { useState } from 'react';
import { CROPS_CATALOG, STATE_DISTRICTS } from '../../data/cropProfitData';

export default function Step1CropDetails({
  calcData,
  updateCalcData,
  onNext,
  lang = 'en',
}) {
  const isEn = lang === 'en';
  const [errors, setErrors] = useState({});

  const selectedCrop = CROPS_CATALOG.find((c) => c.id === calcData.cropId) || CROPS_CATALOG[0];

  const handleCropSelect = (crop) => {
    // When switching crop, prefill typical costs & yield based on selected area
    const currentArea = Number(calcData.area) || 1;
    const factor = calcData.areaUnit === 'hectare' ? currentArea * 2.471 : currentArea;

    const newCosts = {
      seeds: Math.round(crop.typicalCostsPerAcre.seeds * factor),
      fertilizer: Math.round(crop.typicalCostsPerAcre.fertilizer * factor),
      protection: Math.round(crop.typicalCostsPerAcre.protection * factor),
      labour: Math.round(crop.typicalCostsPerAcre.labour * factor),
      irrigation: Math.round(crop.typicalCostsPerAcre.irrigation * factor),
      machinery: Math.round(crop.typicalCostsPerAcre.machinery * factor),
      other: Math.round(crop.typicalCostsPerAcre.other * factor),
    };

    updateCalcData({
      cropId: crop.id,
      season: crop.season,
      expectedYield: Math.round(crop.defaultYieldPerAcre * factor),
      sellingPrice: crop.defaultPricePerQtl,
      costs: newCosts,
    });

    if (errors.cropId) {
      setErrors((prev) => ({ ...prev, cropId: null }));
    }
  };

  const handleAreaChange = (val) => {
    const numeric = parseFloat(val);
    updateCalcData({ area: val });
    if (numeric > 0 && errors.area) {
      setErrors((prev) => ({ ...prev, area: null }));
    }
  };

  const handleAreaUnitToggle = (unit) => {
    if (unit === calcData.areaUnit) return;
    updateCalcData({ areaUnit: unit });
  };

  const handleStateChange = (stateName) => {
    const districts = STATE_DISTRICTS[stateName] || [];
    updateCalcData({
      state: stateName,
      district: districts[0] || '',
    });
  };

  const handleValidateAndProceed = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!calcData.cropId) {
      newErrors.cropId = isEn ? 'Please select a crop.' : 'कृपया अपनी फसल चुनें।';
    }

    const numArea = parseFloat(calcData.area);
    if (!numArea || numArea <= 0 || isNaN(numArea)) {
      newErrors.area = isEn ? 'Please enter a valid farm area.' : 'कृपया खेत का सही रकबा दर्ज करें।';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onNext();
  };

  const districtsList = STATE_DISTRICTS[calcData.state] || [];

  return (
    <form onSubmit={handleValidateAndProceed} className="bg-surface-container-lowest p-6 sm:p-8 rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col gap-6">
      {/* Section Header */}
      <div>
        <div className="flex items-center gap-2">
          <h2 className="font-headline-md text-xl sm:text-2xl font-bold text-on-surface">
            {isEn ? 'Step 1: Crop & Farm Details' : 'चरण 1: अपनी फसल व खेत की जानकारी दें'}
          </h2>
          <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-label-md text-xs font-semibold">
            {isEn ? 'Basic Parameters' : 'मूल पैरामीटर'}
          </span>
        </div>
        <p className="font-body-md text-xs sm:text-sm text-on-surface-variant mt-1">
          {isEn
            ? 'Select your target crop, land area, and local region for accurate agricultural presets.'
            : 'सटीक मानक अनुमान के लिए अपनी लक्षित फसल, खेत का आकार और क्षेत्र चुनें।'}
        </p>
      </div>

      {/* 1. Crop Selection Grid */}
      <div className="flex flex-col gap-2.5">
        <label className="font-label-md text-sm font-semibold text-on-surface flex items-center justify-between">
          <span>
            {isEn ? 'Select Crop' : 'फसल चुनें'}{' '}
            <span className="text-error">*</span>
          </span>
          <span className="font-caption text-xs text-on-surface-variant font-normal">
            {isEn ? '10+ Major Crops' : 'प्रमुख फसलें उपलब्ध'}
          </span>
        </label>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {CROPS_CATALOG.map((crop) => {
            const isSelected = calcData.cropId === crop.id;
            return (
              <button
                key={crop.id}
                type="button"
                onClick={() => handleCropSelect(crop)}
                className={`p-3 rounded-xl border text-left flex items-start gap-3 transition-all ${
                  isSelected
                    ? 'border-primary bg-primary/5 shadow-xs ring-2 ring-primary/20'
                    : 'border-outline-variant/40 bg-surface-container-lowest hover:border-primary/50 hover:bg-surface-container-low'
                }`}
              >
                <span className="text-2xl shrink-0 mt-0.5">{crop.emoji}</span>
                <div className="flex flex-col min-w-0">
                  <span className={`font-label-md text-sm font-bold truncate ${isSelected ? 'text-primary' : 'text-on-surface'}`}>
                    {isEn ? crop.nameEn : crop.nameHi}
                  </span>
                  <span className="font-caption text-[11px] text-on-surface-variant truncate">
                    {crop.variety.split('/')[0]}
                  </span>
                  <span className="font-caption text-[10px] text-secondary font-semibold mt-1">
                    MSP: ₹{crop.mspPrice > 0 ? crop.mspPrice : 'N/A'}/Q
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {calcData.cropId === 'other' && (
          <div className="mt-2">
            <input
              type="text"
              value={calcData.customCropName || ''}
              onChange={(e) => updateCalcData({ customCropName: e.target.value })}
              placeholder={isEn ? 'Enter custom crop name (e.g. Barley, Garlic)...' : 'फसल का नाम दर्ज करें (जैसे जौ, लहसुन)...'}
              className="w-full bg-surface-container-low px-4 py-2.5 rounded-xl text-sm border border-outline-variant/50 focus:border-primary focus:bg-surface-container-lowest outline-none"
            />
          </div>
        )}

        {errors.cropId && (
          <p className="font-caption text-xs text-error font-medium flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">error</span>
            {errors.cropId}
          </p>
        )}
      </div>

      {/* 2. Farm Area & Unit Toggle */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="font-label-md text-sm font-semibold text-on-surface flex items-center justify-between">
            <span>
              {isEn ? 'Farm Area' : 'खेत का रकबा (Area)'}{' '}
              <span className="text-error">*</span>
            </span>
            <span className="font-caption text-xs text-on-surface-variant">
              {calcData.areaUnit === 'acre' ? 'Acres' : 'Hectares'}
            </span>
          </label>

          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="number"
                step="0.1"
                min="0.1"
                value={calcData.area}
                onChange={(e) => handleAreaChange(e.target.value)}
                placeholder="2.0"
                className={`w-full bg-surface-container-low px-4 py-3 rounded-xl font-headline-md text-base sm:text-lg font-bold text-on-surface border focus:bg-surface-container-lowest outline-none transition-colors ${
                  errors.area ? 'border-error' : 'border-outline-variant/40 focus:border-primary'
                }`}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant font-label-md text-sm font-medium">
                {calcData.areaUnit === 'acre' ? (isEn ? 'Acres' : 'एकड़') : (isEn ? 'Hectares' : 'हेक्टेयर')}
              </span>
            </div>

            {/* Acre / Hectare Toggle */}
            <div className="flex items-center bg-surface-container p-1 rounded-xl shadow-xs text-xs font-label-md shrink-0">
              <button
                type="button"
                onClick={() => handleAreaUnitToggle('acre')}
                className={`px-3 py-2 rounded-lg font-bold transition-all ${
                  calcData.areaUnit === 'acre'
                    ? 'bg-primary text-on-primary shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {isEn ? 'Acre' : 'एकड़'}
              </button>
              <button
                type="button"
                onClick={() => handleAreaUnitToggle('hectare')}
                className={`px-3 py-2 rounded-lg font-bold transition-all ${
                  calcData.areaUnit === 'hectare'
                    ? 'bg-primary text-on-primary shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {isEn ? 'Hectare' : 'हेक्टेयर'}
              </button>
            </div>
          </div>

          {errors.area && (
            <p className="font-caption text-xs text-error font-medium flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">error</span>
              {errors.area}
            </p>
          )}
        </div>

        {/* Season Selector */}
        <div className="flex flex-col gap-1.5">
          <label className="font-label-md text-sm font-semibold text-on-surface">
            {isEn ? 'Cropping Season' : 'फसल चक्र / सत्र (Season)'}
          </label>
          <div className="grid grid-cols-3 gap-2 h-[48px]">
            {[
              { id: 'rabi', labelEn: 'Rabi (Winter)', labelHi: 'रबी (सर्दी)', icon: 'ac_unit' },
              { id: 'kharif', labelEn: 'Kharif (Monsoon)', labelHi: 'खरीफ (मानसून)', icon: 'rainy' },
              { id: 'zaid', labelEn: 'Zaid (Summer)', labelHi: 'जायद (गर्मी)', icon: 'wb_sunny' },
            ].map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => updateCalcData({ season: s.id })}
                className={`flex items-center justify-center gap-1.5 px-2 py-2 rounded-xl border text-xs font-bold transition-all ${
                  calcData.season === s.id
                    ? 'border-primary bg-primary text-on-primary shadow-xs'
                    : 'border-outline-variant/40 bg-surface-container-low text-on-surface hover:bg-surface-container'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">{s.icon}</span>
                <span>{isEn ? s.labelEn.split(' ')[0] : s.labelHi.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. State & District Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
        <div className="flex flex-col gap-1.5">
          <label className="font-label-md text-sm font-semibold text-on-surface">
            {isEn ? 'State' : 'राज्य (State)'}
          </label>
          <select
            value={calcData.state}
            onChange={(e) => handleStateChange(e.target.value)}
            className="w-full bg-surface-container-low px-4 py-2.5 rounded-xl font-body-md text-sm text-on-surface border border-outline-variant/40 focus:border-primary focus:bg-surface-container-lowest outline-none transition-colors"
          >
            {Object.keys(STATE_DISTRICTS).map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="font-label-md text-sm font-semibold text-on-surface">
            {isEn ? 'District / APMC Zone' : 'जिला / नजदीकी मंडी क्षेत्र'}
          </label>
          <select
            value={calcData.district}
            onChange={(e) => updateCalcData({ district: e.target.value })}
            className="w-full bg-surface-container-low px-4 py-2.5 rounded-xl font-body-md text-sm text-on-surface border border-outline-variant/40 focus:border-primary focus:bg-surface-container-lowest outline-none transition-colors"
          >
            {districtsList.map((dst) => (
              <option key={dst} value={dst}>
                {dst}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Selected Crop Insight Strip */}
      <div className="rounded-xl bg-primary/5 p-4 flex items-start gap-3 border border-primary/15">
        <span className="material-symbols-outlined text-primary text-[22px] shrink-0 mt-0.5">info</span>
        <div className="text-xs text-on-surface leading-relaxed">
          <strong className="text-primary font-bold">
            {isEn ? selectedCrop.nameEn : selectedCrop.nameHi} {isEn ? 'Insight: ' : 'का विवरण: '}
          </strong>
          {selectedCrop.notesHi}
        </div>
      </div>

      {/* CTA Button */}
      <div className="flex justify-end pt-2">
        <button
          type="submit"
          className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-label-md text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 group"
        >
          <span>{isEn ? 'Proceed to Cultivation Costs' : 'खेती की लागत दर्ज करें'}</span>
          <span className="material-symbols-outlined text-[18px] transition-transform group-hover:translate-x-1">
            arrow_forward
          </span>
        </button>
      </div>
    </form>
  );
}
