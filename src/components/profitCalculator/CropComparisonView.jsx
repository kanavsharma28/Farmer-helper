import React, { useState } from 'react';
import { CROPS_CATALOG, calculateCropProfit } from '../../data/cropProfitData';

export default function CropComparisonView({ onSelectCropForCalculator, lang = 'en' }) {
  const isEn = lang === 'en';
  const [selectedCropIds, setSelectedCropIds] = useState(['wheat', 'mustard', 'gram']);
  const [comparisonArea, setComparisonArea] = useState(2);

  const toggleCrop = (id) => {
    if (selectedCropIds.includes(id)) {
      if (selectedCropIds.length > 1) {
        setSelectedCropIds(selectedCropIds.filter((item) => item !== id));
      }
    } else {
      if (selectedCropIds.length < 3) {
        setSelectedCropIds([...selectedCropIds, id]);
      } else {
        // replace the last one
        setSelectedCropIds([selectedCropIds[0], selectedCropIds[1], id]);
      }
    }
  };

  const comparedData = selectedCropIds.map((cropId) => {
    const crop = CROPS_CATALOG.find((c) => c.id === cropId) || CROPS_CATALOG[0];
    const typicalCosts = crop.typicalCostsPerAcre;
    const factor = comparisonArea;

    const costs = {
      seeds: Math.round(typicalCosts.seeds * factor),
      fertilizer: Math.round(typicalCosts.fertilizer * factor),
      protection: Math.round(typicalCosts.protection * factor),
      labour: Math.round(typicalCosts.labour * factor),
      irrigation: Math.round(typicalCosts.irrigation * factor),
      machinery: Math.round(typicalCosts.machinery * factor),
      other: Math.round(typicalCosts.other * factor),
    };

    const yieldAmount = Math.round(crop.defaultYieldPerAcre * factor);
    const metrics = calculateCropProfit({
      area: comparisonArea,
      areaUnit: 'acre',
      costs,
      expectedYield: yieldAmount,
      yieldUnit: 'quintal',
      sellingPrice: crop.defaultPricePerQtl,
    });

    return {
      crop,
      metrics,
    };
  });

  return (
    <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col gap-6 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-headline-md text-xl sm:text-2xl font-bold text-on-surface">
              {isEn ? 'Compare Seasonal Crops' : 'अलग-अलग फसलों की तुलना करें (Crop Comparison)'}
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-secondary/10 text-secondary font-label-md text-xs font-bold">
              {isEn ? 'Up to 3 Crops' : 'अधिकतम 3 फसलें'}
            </span>
          </div>
          <p className="font-body-md text-xs sm:text-sm text-on-surface-variant mt-1">
            {isEn
              ? 'Compare expected cultivation expenses, revenue, and net profit per acre side-by-side.'
              : 'समान भूखंड पर विभिन्न फसलों की संभावित लागत, आमदनी और मुनाफे की सीधी तुलना करें।'}
          </p>
        </div>

        {/* Plot Area Controller */}
        <div className="flex items-center gap-2 bg-surface-container p-1.5 rounded-xl self-start sm:self-auto text-xs">
          <span className="font-label-md font-semibold text-on-surface-variant px-2">
            {isEn ? 'Plot Area: ' : 'खेत का रकबा: '}
          </span>
          {[1, 2, 5, 10].map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => setComparisonArea(a)}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                comparisonArea === a
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {a} {isEn ? 'Acre' : 'एकड़'}
            </button>
          ))}
        </div>
      </div>

      {/* Crop Selector Chips */}
      <div className="flex flex-col gap-2">
        <span className="font-label-md text-xs text-on-surface-variant font-semibold">
          {isEn ? 'Select crops to compare (click to add/remove):' : 'तुलना हेतु फसलें चुनें (क्लिक करके जोड़ें/हटाएं):'}
        </span>
        <div className="flex flex-wrap gap-2">
          {CROPS_CATALOG.filter((c) => c.id !== 'other').map((crop) => {
            const isSelected = selectedCropIds.includes(crop.id);
            return (
              <button
                key={crop.id}
                type="button"
                onClick={() => toggleCrop(crop.id)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all ${
                  isSelected
                    ? 'border-primary bg-primary text-on-primary shadow-xs'
                    : 'border-outline-variant/40 bg-surface-container-low text-on-surface hover:bg-surface-container'
                }`}
              >
                <span>{crop.emoji}</span>
                <span>{isEn ? crop.nameEn : crop.nameHi}</span>
                {isSelected && (
                  <span className="material-symbols-outlined text-[14px]">check</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Side-by-Side Comparison Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
        {comparedData.map(({ crop, metrics }, idx) => (
          <div
            key={crop.id}
            className={`p-6 rounded-2xl border flex flex-col justify-between gap-6 transition-all ${
              idx === 0
                ? 'bg-secondary/5 border-secondary/40 shadow-xs'
                : 'bg-surface-container-low border-outline-variant/30 hover:border-primary/40'
            }`}
          >
            {/* Header */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-3xl">{crop.emoji}</span>
                  <div>
                    <h3 className="font-headline-md text-base sm:text-lg font-bold text-on-surface">
                      {isEn ? crop.nameEn : crop.nameHi}
                    </h3>
                    <p className="font-caption text-xs text-on-surface-variant">
                      {crop.variety}
                    </p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant text-[11px] font-semibold uppercase">
                  {crop.season}
                </span>
              </div>

              {/* Profit Hero Pill */}
              <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/20 shadow-xs mb-4">
                <span className="font-caption text-[11px] text-on-surface-variant block uppercase font-semibold">
                  {isEn ? 'Net Estimated Profit' : 'शुद्ध संभावित लाभ'}
                </span>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="font-headline-lg text-2xl font-bold text-secondary">
                    ₹{metrics.netProfit.toLocaleString('en-IN')}
                  </span>
                  <span className="font-label-md text-xs text-secondary font-bold">
                    +{metrics.roi}% ROI
                  </span>
                </div>
                <span className="font-caption text-xs text-on-surface-variant mt-1 block">
                  ₹{metrics.profitPerAcre.toLocaleString('en-IN')} / {isEn ? 'Acre' : 'एकड़'}
                </span>
              </div>

              {/* Comparison Metrics List */}
              <div className="space-y-2.5 text-xs font-body-md">
                <div className="flex justify-between py-1 border-b border-outline-variant/15">
                  <span className="text-on-surface-variant">{isEn ? 'Total Cost:' : 'खेती लागत:'}</span>
                  <span className="font-bold text-error">₹{metrics.totalCost.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex justify-between py-1 border-b border-outline-variant/15">
                  <span className="text-on-surface-variant">{isEn ? 'Expected Production:' : 'अनुमानित उपज:'}</span>
                  <span className="font-bold text-on-surface">{metrics.normalizedYieldQtl} {isEn ? 'Quintals' : 'क्विंटल'}</span>
                </div>

                <div className="flex justify-between py-1 border-b border-outline-variant/15">
                  <span className="text-on-surface-variant">{isEn ? 'Selling Price:' : 'अपेक्षित भाव:'}</span>
                  <span className="font-bold text-on-surface">₹{crop.defaultPricePerQtl} / {isEn ? 'Qtl' : 'क्विंटल'}</span>
                </div>

                <div className="flex justify-between py-1 border-b border-outline-variant/15">
                  <span className="text-on-surface-variant">{isEn ? 'Break-even Price:' : 'ब्रेक-ईवन भाव:'}</span>
                  <span className="font-bold text-secondary">₹{metrics.breakEvenPrice} / {isEn ? 'Qtl' : 'क्विंटल'}</span>
                </div>

                <div className="flex justify-between py-1">
                  <span className="text-on-surface-variant">{isEn ? 'Risk Level:' : 'जोखिम स्तर:'}</span>
                  <span className="font-bold text-on-surface">{crop.riskLevelHi}</span>
                </div>
              </div>
            </div>

            {/* Launch in Calculator Button */}
            <button
              type="button"
              onClick={() => onSelectCropForCalculator(crop.id, comparisonArea)}
              className="w-full py-2.5 rounded-xl bg-surface-container-lowest hover:bg-primary hover:text-white border border-primary/30 text-primary font-label-md text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs"
            >
              <span className="material-symbols-outlined text-[16px]">calculate</span>
              <span>{isEn ? 'Open in Calculator' : 'इस फसल की विस्तृत गणना करें'}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
