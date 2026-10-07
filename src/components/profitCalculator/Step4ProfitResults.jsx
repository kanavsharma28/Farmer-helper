import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CROPS_CATALOG,
  calculateCropProfit,
} from '../../data/cropProfitData';

export default function Step4ProfitResults({
  calcData,
  onRecalculate,
  onSaveCalculation,
  lang = 'en',
}) {
  const isEn = lang === 'en';
  const [isSaved, setIsSaved] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);

  const selectedCrop = CROPS_CATALOG.find((c) => c.id === calcData.cropId) || CROPS_CATALOG[0];
  const metrics = calculateCropProfit(calcData);

  const handleSave = () => {
    onSaveCalculation(calcData, metrics);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3500);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `Crop Profit Report: ${selectedCrop.nameEn}`,
          text: `Farmer Helper estimated profit for ${calcData.area} Acres of ${selectedCrop.nameEn}: ₹${metrics.netProfit.toLocaleString('en-IN')}`,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(
        `Farmer Helper Profit Estimation: ${selectedCrop.nameHi} (${calcData.area} एकड़) - शुद्ध संभावित लाभ ₹${metrics.netProfit.toLocaleString('en-IN')}`
      );
      setShowShareToast(true);
      setTimeout(() => setShowShareToast(false), 3000);
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full print:p-0">
      {/* Toast Alert */}
      {showShareToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-primary text-white px-4 py-2.5 rounded-xl shadow-lg font-label-md text-xs sm:text-sm flex items-center gap-2 animate-bounce">
          <span className="material-symbols-outlined text-[18px]">check_circle</span>
          <span>{isEn ? 'Calculation summary copied to clipboard!' : 'गणना सारांश क्लिपबोर्ड पर कॉपी हो गया!'}</span>
        </div>
      )}

      {/* Top Context Header & Actions Bar */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 pb-6 border-b border-outline-variant/30">
        <div className="flex flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/10 text-secondary font-label-md text-xs uppercase tracking-wider font-bold">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
              {isEn ? `${calcData.season.toUpperCase()} ${calcData.seasonYear}` : `${calcData.season === 'rabi' ? 'रबी' : calcData.season === 'kharif' ? 'खरीफ' : 'जायद'} सीजन ${calcData.seasonYear}`}
            </span>
            <span className="inline-flex items-center gap-1 text-on-surface-variant font-label-md text-xs font-semibold">
              <span className="material-symbols-outlined text-[16px] text-primary">verified</span>
              {isEn ? 'Verified Agri Engine' : 'सत्यापित गणना (Verified Model)'}
            </span>
          </div>

          <h1 className="font-headline-lg text-2xl sm:text-3xl text-primary font-bold tracking-tight flex items-center gap-2 mt-1">
            <span>{selectedCrop.emoji}</span>
            <span>
              {isEn ? selectedCrop.nameEn : selectedCrop.nameHi} • {calcData.area} {calcData.areaUnit === 'acre' ? (isEn ? 'Acres' : 'एकड़') : (isEn ? 'Hectares' : 'हेक्टेयर')}
            </span>
          </h1>

          <p className="font-body-md text-xs text-on-surface-variant flex items-center gap-2 flex-wrap">
            <span>{isEn ? 'Calculation Completed' : 'गणना पूर्ण हुई'}</span>
            <span>•</span>
            <span className="font-mono font-semibold text-outline">{calcData.id || 'CPC-2026-9941'}</span>
            <span>•</span>
            <span className="text-secondary font-medium">
              {calcData.district}, {calcData.state}
            </span>
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap print:hidden">
          <button
            type="button"
            onClick={handleSave}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl border shadow-xs font-label-md text-xs sm:text-sm font-semibold transition-all ${
              isSaved
                ? 'bg-secondary text-white border-secondary'
                : 'bg-surface-container-lowest border-outline-variant/40 hover:bg-surface-container text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">
              {isSaved ? 'bookmark_added' : 'bookmark'}
            </span>
            <span>{isSaved ? (isEn ? 'Saved!' : 'सुरक्षित!') : (isEn ? 'Save' : 'गणना सुरक्षित करें')}</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/40 shadow-xs hover:bg-surface-container text-on-surface font-label-md text-xs sm:text-sm font-semibold transition-all"
          >
            <span className="material-symbols-outlined text-[18px] text-primary">download</span>
            <span>{isEn ? 'Print / PDF' : 'PDF रिपोर्ट'}</span>
          </button>

          <button
            type="button"
            onClick={handleShare}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/40 shadow-xs hover:bg-surface-container text-on-surface font-label-md text-xs sm:text-sm font-semibold transition-all"
          >
            <span className="material-symbols-outlined text-[18px] text-on-surface-variant">share</span>
            <span>{isEn ? 'Share' : 'शेयर'}</span>
          </button>

          <button
            type="button"
            onClick={onRecalculate}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary text-on-primary shadow-sm hover:bg-primary-container font-label-md text-xs sm:text-sm font-bold transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">replay</span>
            <span>{isEn ? 'Recalculate' : 'पुनर्गणना (Recalculate)'}</span>
          </button>
        </div>
      </div>

      {/* 1. TOP HERO KPI CARDS (Bento Style with Visual Accents) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {/* Card 1: Estimated Net Profit */}
        <div className="relative overflow-hidden rounded-2xl bg-primary text-on-primary p-6 shadow-md flex flex-col justify-between group">
          <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-secondary/20 blur-2xl pointer-events-none" />
          <div className="flex items-start justify-between gap-2 z-10">
            <div className="flex flex-col">
              <span className="font-label-md text-[11px] uppercase tracking-wider text-on-primary/80 font-semibold">
                {isEn ? 'Estimated Net Profit' : 'शुद्ध संभावित लाभ'}
              </span>
              <span className="font-headline-md text-sm font-medium text-secondary-container">
                Net Farmer In-Hand
              </span>
            </div>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-secondary text-on-primary font-caption text-xs font-bold shadow-xs">
              <span className="material-symbols-outlined text-[14px]">trending_up</span>
              {metrics.netProfit >= 0 ? (isEn ? 'Excellent' : 'उत्कृष्ट') : (isEn ? 'Loss' : 'घाटा')}
            </span>
          </div>

          <div className="my-3 z-10">
            <span className="font-headline-lg text-3xl sm:text-4xl leading-tight font-bold tracking-tight text-white block">
              ₹{metrics.netProfit.toLocaleString('en-IN')}
            </span>
            <div className="flex items-center gap-2 mt-2 pt-2 border-t border-on-primary/15 text-xs text-on-primary/90 flex-wrap">
              <span>
                {isEn ? 'Per Acre: ' : 'प्रति एकड़: '}
                <strong className="font-bold text-white">
                  ₹{metrics.profitPerAcre.toLocaleString('en-IN')}
                </strong>
              </span>
              <span>•</span>
              <span className="font-bold text-secondary-fixed">
                ROI: {metrics.roi}%
              </span>
            </div>
          </div>

          <div className="z-10 bg-primary-container/60 rounded-xl p-2.5 flex items-center justify-between text-xs text-on-primary/90">
            <span>
              {metrics.roi > 100
                ? `${(metrics.roi / 100).toFixed(1)}x ${isEn ? 'Return on Investment' : 'गुना रिटर्न'}`
                : isEn ? 'Profitable Yield' : 'सकारात्मक रिटर्न'}
            </span>
            <span className="material-symbols-outlined text-[16px] text-secondary-fixed">workspace_premium</span>
          </div>
        </div>

        {/* Card 2: Gross Revenue */}
        <div className="rounded-2xl bg-surface-container-lowest p-6 shadow-sm border border-outline-variant/30 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <span className="font-label-md text-[11px] uppercase tracking-wider text-on-surface-variant font-semibold">
                {isEn ? 'Gross Revenue' : 'अनुमानित कुल कमाई'}
              </span>
              <p className="font-headline-md text-sm font-semibold text-on-surface">
                Total Production Value
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[22px]">payments</span>
            </div>
          </div>

          <div className="my-3">
            <span className="font-display-lg text-2xl sm:text-3xl font-bold text-on-surface block">
              ₹{metrics.grossRevenue.toLocaleString('en-IN')}
            </span>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="material-symbols-outlined text-[16px] text-secondary">check_circle</span>
              <span className="font-caption text-xs text-on-surface-variant font-medium">
                {metrics.normalizedYieldQtl} {isEn ? 'Qtl' : 'क्विंटल'} @ ₹{calcData.sellingPrice || 0} / {isEn ? 'Qtl' : 'क्विंटल'}
              </span>
            </div>
          </div>

          <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
            <div className="bg-secondary h-full rounded-full" style={{ width: '85%' }} />
          </div>
        </div>

        {/* Card 3: Total Expenses */}
        <div className="rounded-2xl bg-surface-container-lowest p-6 shadow-sm border border-outline-variant/30 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <span className="font-label-md text-[11px] uppercase tracking-wider text-on-surface-variant font-semibold">
                {isEn ? 'Total Expenses' : 'कुल खेती लागत'}
              </span>
              <p className="font-headline-md text-sm font-semibold text-on-surface">
                7 Input Categories
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-error/10 flex items-center justify-center text-error">
              <span className="material-symbols-outlined text-[22px]">receipt_long</span>
            </div>
          </div>

          <div className="my-3">
            <span className="font-display-lg text-2xl sm:text-3xl font-bold text-on-surface block">
              ₹{metrics.totalCost.toLocaleString('en-IN')}
            </span>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="font-caption text-xs text-on-surface-variant">
                ₹{metrics.costPerAcre.toLocaleString('en-IN')} {isEn ? 'per acre average' : 'प्रति एकड़ औसत'}
              </span>
            </div>
          </div>

          <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
            <div
              className="bg-error h-full rounded-full"
              style={{
                width: `${metrics.grossRevenue > 0 ? Math.min(100, (metrics.totalCost / metrics.grossRevenue) * 100) : 20}%`,
              }}
            />
          </div>
        </div>

        {/* Card 4: Break-even Price */}
        <div className="rounded-2xl bg-surface-container-lowest p-6 shadow-sm border border-outline-variant/30 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <span className="font-label-md text-[11px] uppercase tracking-wider text-on-surface-variant font-semibold">
                {isEn ? 'Break-even Price' : 'ब्रेक-इवन सुरक्षित भाव'}
              </span>
              <p className="font-headline-md text-sm font-semibold text-on-surface">
                Zero-Loss Floor Rate
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-tertiary-fixed/30 flex items-center justify-center text-tertiary">
              <span className="material-symbols-outlined text-[22px]">shield</span>
            </div>
          </div>

          <div className="my-3">
            <div className="flex items-baseline gap-1">
              <span className="font-display-lg text-2xl sm:text-3xl font-bold text-secondary">
                ₹{metrics.breakEvenPrice}
              </span>
              <span className="font-body-md text-xs text-on-surface-variant">
                / {isEn ? 'Quintal' : 'क्विंटल'}
              </span>
            </div>
            <p className="font-caption text-xs text-secondary font-semibold mt-1 truncate">
              {isEn
                ? `Safe down to ₹${metrics.safePriceDrop} below market`
                : `बाजार भाव से ₹${metrics.safePriceDrop} नीचे भी नो-लॉस`}
            </p>
          </div>

          <div className="flex items-center justify-between text-xs text-on-surface-variant pt-2 border-t border-surface-container">
            <span>{isEn ? 'Safety Buffer' : 'सुरक्षा मार्जिन (Buffer)'}</span>
            <span className="font-bold text-secondary">{metrics.safetyMarginPercent}% {isEn ? 'Protected' : 'सुरक्षित'}</span>
          </div>
        </div>
      </div>

      {/* 2. TWO-COLUMN DETAILED ANALYTICS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN (7 Cols): Cultivation Cost Breakdown & Revenue Equation */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Revenue Math Equation Block */}
          <div className="rounded-2xl bg-surface-container-lowest p-6 shadow-sm border border-outline-variant/30">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[22px]">balance</span>
                <h2 className="font-headline-md text-base sm:text-lg font-bold text-on-surface">
                  {isEn ? 'Revenue Equation (Revenue − Cost = Profit)' : 'कमाई व लाभ समीकरण (Revenue Math)'}
                </h2>
              </div>
              <span className="font-caption text-xs px-2.5 py-1 rounded-lg bg-surface-container font-semibold text-on-surface-variant">
                {isEn ? 'Formula' : 'पारदर्शी सूत्र'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
              {/* Box 1: Revenue */}
              <div className="rounded-xl bg-surface-container-low p-4 flex flex-col items-center text-center border border-outline-variant/20">
                <span className="font-caption text-xs text-on-surface-variant">
                  {isEn ? 'Gross Revenue' : 'कुल अनुमानित कमाई'}
                </span>
                <span className="font-headline-md text-lg sm:text-xl font-bold text-on-surface mt-1">
                  ₹{metrics.grossRevenue.toLocaleString('en-IN')}
                </span>
                <span className="font-caption text-[11px] text-secondary font-medium mt-0.5">
                  {metrics.normalizedYieldQtl} Qtl × ₹{calcData.sellingPrice || 0}
                </span>
              </div>

              {/* Minus sign */}
              <div className="hidden sm:flex justify-center">
                <span className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center font-bold text-lg text-on-surface-variant shadow-xs">
                  −
                </span>
              </div>

              {/* Box 2: Total Cost */}
              <div className="rounded-xl bg-surface-container-low p-4 flex flex-col items-center text-center border border-outline-variant/20">
                <span className="font-caption text-xs text-on-surface-variant">
                  {isEn ? 'Direct Cultivation Cost' : 'कुल प्रत्यक्ष लागत'}
                </span>
                <span className="font-headline-md text-lg sm:text-xl font-bold text-error mt-1">
                  ₹{metrics.totalCost.toLocaleString('en-IN')}
                </span>
                <span className="font-caption text-[11px] text-on-surface-variant mt-0.5">
                  {isEn ? 'Across 7 categories' : '7 अलग-अलग मदों में'}
                </span>
              </div>
            </div>

            {/* Equals Result Banner */}
            <div className="mt-4 rounded-xl bg-secondary/10 p-4 flex items-center justify-between flex-wrap gap-3 border border-secondary/20">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-secondary text-on-primary flex items-center justify-center font-bold text-base shadow-xs shrink-0">
                  =
                </div>
                <div>
                  <span className="font-label-md text-sm text-primary font-bold block">
                    {isEn ? 'Net In-Hand Farmer Profit' : 'कुल शुद्ध किसान मुनाफा (Net In-Hand Profit)'}
                  </span>
                  <p className="font-caption text-xs text-on-surface-variant">
                    {isEn ? 'After all input, machinery and labour costs' : 'सभी कटौतियों व मजदूरी भुगतान के बाद'}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="font-headline-md text-xl sm:text-2xl font-bold text-secondary block">
                  ₹{metrics.netProfit.toLocaleString('en-IN')}
                </span>
                <span className="font-caption text-xs text-secondary font-semibold">
                  {isEn ? `Margin: ${(100 - (metrics.totalCost / (metrics.grossRevenue || 1)) * 100).toFixed(1)}%` : `मार्जिन ${(100 - (metrics.totalCost / (metrics.grossRevenue || 1)) * 100).toFixed(1)}%`}
                </span>
              </div>
            </div>
          </div>

          {/* Cost Breakdown Section */}
          <div className="rounded-2xl bg-surface-container-lowest p-6 shadow-sm border border-outline-variant/30 flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="font-headline-md text-base sm:text-lg font-bold text-on-surface">
                  {isEn ? 'Cultivation Cost Breakdown' : 'खेती लागत का मदवार विश्लेषण'}
                </h2>
                <p className="font-body-md text-xs text-on-surface-variant">
                  {calcData.area} {calcData.areaUnit === 'acre' ? 'एकड़' : 'हेक्टेयर'} {isEn ? 'Total: ' : 'कुल: '} ₹{metrics.totalCost.toLocaleString('en-IN')}
                </p>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container text-xs font-label-md text-on-surface font-semibold shrink-0">
                <span className="material-symbols-outlined text-[16px] text-primary">pie_chart</span>
                <span>
                  {isEn ? 'Cost per Qtl: ' : 'लागत दर: '}
                  ₹{metrics.breakEvenPrice}/Qtl
                </span>
              </div>
            </div>

            {/* Stacked Composite Visual Bar */}
            <div className="flex flex-col gap-1.5">
              <div className="h-4 w-full rounded-full overflow-hidden flex shadow-inner bg-surface-container">
                {metrics.costBreakdown.map((item) => {
                  if (item.percent <= 0) return null;
                  return (
                    <div
                      key={item.id}
                      className={`${item.barColor} h-full hover:opacity-90 transition-opacity`}
                      style={{ width: `${item.percent}%` }}
                      title={`${item.labelHi}: ${item.percent}%`}
                    />
                  );
                })}
              </div>

              <div className="flex justify-between text-caption text-[11px] text-on-surface-variant px-1">
                <span>0%</span>
                <span>25%</span>
                <span>50%</span>
                <span>75%</span>
                <span>100% (₹{metrics.totalCost.toLocaleString('en-IN')})</span>
              </div>
            </div>

            {/* Detailed Items Progress Rows */}
            <div className="flex flex-col gap-3">
              {metrics.costBreakdown.map((item) => (
                <div key={item.id} className="flex flex-col gap-1">
                  <div className="flex items-center justify-between text-xs font-label-md">
                    <div className="flex items-center gap-2">
                      <span className={`w-3 h-3 rounded-full ${item.barColor} shrink-0`} />
                      <span className="text-on-surface font-medium">
                        {isEn ? item.labelEn : item.labelHi}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-on-surface font-bold">
                        ₹{item.amount.toLocaleString('en-IN')}
                      </span>
                      <span className="text-on-surface-variant font-caption text-xs w-12 text-right">
                        {item.percent}%
                      </span>
                    </div>
                  </div>

                  <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`${item.barColor} h-full rounded-full transition-all duration-500`}
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Actionable Cost Optimization Tip */}
            <div className="rounded-xl bg-primary/5 p-4 flex items-start gap-3 border border-primary/20">
              <span className="material-symbols-outlined text-primary text-[22px] shrink-0 mt-0.5">
                lightbulb
              </span>
              <div className="text-xs text-on-surface leading-relaxed">
                <span className="font-bold text-primary block sm:inline mr-1">
                  {isEn ? 'Cost Optimization Advisory: ' : 'लागत अनुकूलन सुझाव (Cost Advisory): '}
                </span>
                {isEn
                  ? 'Labour and fertilizer constitute the largest expenses. Utilizing custom hiring rotavators and nano-urea could potentially save up to ₹4,000 across 2 acres.'
                  : 'मजदूरी और रासायनिक खाद मिलकर कुल लागत का मुख्य हिस्सा हैं। कस्टम हायरिंग रोटावेटर और नैनो-यूरिया के प्रयोग से लगभग ₹4,000 तक की बचत संभव है।'}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (5 Cols): Scenarios, Sensitivity & Break-even Meter */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Sensitivity Scenarios Card */}
          <div className="rounded-2xl bg-surface-container-lowest p-6 shadow-sm border border-outline-variant/30 flex flex-col gap-4">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-headline-md text-base sm:text-lg font-bold text-on-surface">
                  {isEn ? 'Market Price Sensitivity' : 'बाजार भाव संवेदनशीलता'}
                </h2>
                <p className="font-body-md text-xs text-on-surface-variant">
                  {isEn ? 'What-If Price Fluctuations' : 'अगर बाजार भाव बदले तो?'}
                </p>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant text-[20px]">
                query_stats
              </span>
            </div>

            <p className="font-body-md text-xs text-on-surface-variant -mt-1">
              {isEn
                ? 'Check your profit variation if harvest market rates fluctuate:'
                : 'यदि कटाई के समय मंडी भाव में उतार-चढ़ाव आता है, तो आपका कुल लाभ कैसे प्रभावित होगा:'}
            </p>

            {/* 3 Scenario Cards */}
            <div className="flex flex-col gap-3">
              {metrics.scenarios.map((sc) => (
                <div
                  key={sc.id}
                  className={`p-3.5 rounded-xl border transition-all flex flex-col gap-2 ${
                    sc.isCurrent
                      ? 'bg-secondary/10 border-secondary/40 shadow-xs'
                      : 'bg-surface-container-low hover:bg-surface-container border-outline-variant/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${sc.dotColor}`} />
                      <span className={`font-label-md text-xs sm:text-sm font-bold ${sc.isCurrent ? 'text-primary' : 'text-on-surface'}`}>
                        {isEn ? sc.titleEn : sc.titleHi}
                      </span>
                    </div>
                    <span
                      className={`font-caption text-[11px] px-2 py-0.5 rounded font-semibold ${
                        sc.isCurrent
                          ? 'bg-secondary text-white'
                          : 'bg-surface-container-highest text-on-surface-variant'
                      }`}
                    >
                      {sc.tagHi}
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between text-xs">
                    <span className="text-on-surface-variant">
                      {isEn ? 'Price: ' : 'भाव: '}
                      <strong className="text-on-surface">₹{sc.price}</strong> / {isEn ? 'Qtl' : 'क्विंटल'}
                    </span>
                    <span className="text-on-surface-variant">
                      {isEn ? 'Revenue: ' : 'कुल कमाई: '}
                      ₹{sc.revenue.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-outline-variant/20 text-xs">
                    <span className="text-on-surface-variant font-medium">
                      {isEn ? 'Estimated Net Profit:' : 'संभावित शुद्ध लाभ:'}
                    </span>
                    <span className={`font-label-md font-bold ${sc.isCurrent ? 'text-secondary text-sm' : 'text-on-surface'}`}>
                      ₹{sc.profit.toLocaleString('en-IN')}{' '}
                      <span className="text-[11px] font-normal text-secondary">
                        ({sc.safeStatusHi})
                      </span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Break-even & Risk Margin Visual Card */}
          <div className="rounded-2xl bg-surface-container-lowest p-6 shadow-sm border border-outline-variant/30 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="font-headline-md text-base sm:text-lg font-bold text-on-surface">
                {isEn ? 'Production & Risk Safety Buffer' : 'उत्पादन व जोखिम सुरक्षा मार्जिन'}
              </h2>
              <span className="material-symbols-outlined text-secondary text-[22px]">health_and_safety</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 flex flex-col">
                <span className="font-caption text-xs text-on-surface-variant">
                  {isEn ? 'Yield to Recover Cost' : 'लागत वसूली हेतु उत्पादन'}
                </span>
                <span className="font-headline-md text-sm sm:text-base font-bold text-on-surface mt-1">
                  {metrics.breakEvenYield} {isEn ? 'Quintal' : 'क्विंटल'}
                </span>
                <span className="font-caption text-[11px] text-secondary font-medium">
                  {isEn
                    ? `Only ${metrics.breakEvenYieldPercent}% of total ${metrics.normalizedYieldQtl} Qtl`
                    : `कुल में से मात्र ${metrics.breakEvenYieldPercent}%`}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 flex flex-col">
                <span className="font-caption text-xs text-on-surface-variant">
                  {isEn ? 'Minimum Safe Price' : 'न्यूनतम आवश्यक भाव'}
                </span>
                <span className="font-headline-md text-sm sm:text-base font-bold text-on-surface mt-1">
                  ₹{metrics.breakEvenPrice} / {isEn ? 'Qtl' : 'क्विंटल'}
                </span>
                <span className="font-caption text-[11px] text-secondary font-medium">
                  ₹{metrics.safePriceDrop} {isEn ? 'below target' : 'नीचे तक सुरक्षित'}
                </span>
              </div>
            </div>

            {/* Visual Safety Meter Gauge (Circular SVG) */}
            <div className="rounded-xl bg-surface-container-low p-4 flex items-center gap-4 border border-outline-variant/20">
              <div className="relative w-16 h-16 shrink-0">
                <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-surface-container-high stroke-current"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    strokeWidth="3.5"
                  />
                  <path
                    className="text-secondary stroke-current"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    strokeDasharray={`${metrics.safetyMarginPercent}, 100`}
                    strokeLinecap="round"
                    strokeWidth="3.5"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center font-bold text-xs font-label-md text-primary">
                  {Math.round(metrics.safetyMarginPercent)}%
                </div>
              </div>

              <div className="flex flex-col">
                <span className="font-label-md text-xs sm:text-sm font-bold text-on-surface">
                  {isEn ? 'High Safety Investment Grade' : 'अत्यंत सुरक्षित निवेश श्रेणी'}
                </span>
                <p className="font-body-md text-xs text-on-surface-variant leading-relaxed mt-0.5">
                  {isEn
                    ? `Even if you suffer a ${Math.round(metrics.safetyMarginPercent)}% harvest loss due to weather, your base cost of ₹${metrics.totalCost.toLocaleString('en-IN')} remains recovered.`
                    : `मौसम या कीटों से यदि फसल का ${Math.round(metrics.safetyMarginPercent)}% नुकसान भी हो जाए, तब भी आपकी ₹${metrics.totalCost.toLocaleString('en-IN')} की मूल लागत सुरक्षित निकल आएगी।`}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. BOTTOM SECTION - ALTERNATIVE CROP COMPARISON & STRATEGIC NEXT STEPS */}
      <div className="rounded-2xl bg-surface-container-lowest p-6 shadow-sm border border-outline-variant/30 flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
          <div>
            <h2 className="font-headline-md text-base sm:text-lg font-bold text-on-surface">
              {isEn ? 'Alternative Crop Comparison (Same Plot Size)' : 'वैकल्पिक फसल तुलना (समान भूखंड हेतु)'}
            </h2>
            <p className="font-body-md text-xs text-on-surface-variant">
              {isEn
                ? 'Compare your selected crop against other seasonal possibilities'
                : 'रबी सीजन वैकल्पिक फसल तुलना (2 एकड़ भूखंड)'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-caption text-xs text-on-surface-variant">{isEn ? 'Soil Zone: ' : 'स्थानीय मृदा: '}</span>
            <span className="px-2.5 py-1 rounded-lg bg-secondary/10 text-secondary text-xs font-semibold">
              दोमट मिट्टी (Loamy Soil)
            </span>
          </div>
        </div>

        {/* Comparison Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Crop 1: Current Selected */}
          <div className="rounded-xl p-4 bg-secondary/5 border-2 border-secondary/30 flex flex-col justify-between shadow-xs">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{selectedCrop.emoji}</span>
                  <span className="font-headline-md text-sm font-bold text-primary">
                    {isEn ? selectedCrop.nameEn : selectedCrop.nameHi} ({isEn ? 'Selected' : 'वर्तमान'})
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-secondary text-white text-[11px] font-bold">
                  {isEn ? 'Active' : 'चयनित'}
                </span>
              </div>
              <p className="font-caption text-xs text-on-surface-variant mb-3">
                {selectedCrop.notesHi}
              </p>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">{isEn ? 'Total Cost:' : 'कुल लागत:'}</span>
                  <span className="font-medium text-on-surface">₹{metrics.totalCost.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">{isEn ? 'Est. Revenue:' : 'अनुमानित कमाई:'}</span>
                  <span className="font-medium text-on-surface">₹{metrics.grossRevenue.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-secondary/20">
                  <span className="font-bold text-primary">{isEn ? 'Net Profit:' : 'शुद्ध लाभ (Net):'}</span>
                  <span className="font-bold text-secondary text-sm">₹{metrics.netProfit.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-2 border-t border-secondary/20 flex items-center justify-between text-xs">
              <span className="text-on-surface-variant">{isEn ? 'Risk Rating:' : 'जोखिम स्तर:'}</span>
              <span className="font-bold text-secondary flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-secondary" />
                {selectedCrop.riskLevelHi}
              </span>
            </div>
          </div>

          {/* Alternative 1: Mustard */}
          {(() => {
            const mustard = CROPS_CATALOG.find((c) => c.id === 'mustard') || CROPS_CATALOG[1];
            const mFactor = metrics.normalizedAcres;
            const mCost = Math.round(18000 * mFactor);
            const mYield = Math.round(mustard.defaultYieldPerAcre * mFactor);
            const mRev = Math.round(mYield * mustard.defaultPricePerQtl);
            const mProfit = mRev - mCost;

            return (
              <div className="rounded-xl p-4 bg-surface-container-low hover:bg-surface-container transition-colors border border-outline-variant/20 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{mustard.emoji}</span>
                      <span className="font-headline-md text-sm font-bold text-on-surface">
                        {isEn ? mustard.nameEn : mustard.nameHi}
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface-variant text-[11px] font-medium">
                      {isEn ? 'Alternative' : 'वैकल्पिक'}
                    </span>
                  </div>
                  <p className="font-caption text-xs text-on-surface-variant mb-3">
                    {mustard.notesHi}
                  </p>

                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-on-surface-variant">{isEn ? 'Total Cost:' : 'कुल लागत:'}</span>
                      <span className="font-medium text-on-surface">₹{mCost.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-on-surface-variant">{isEn ? 'Est. Revenue:' : 'अनुमानित कमाई:'}</span>
                      <span className="font-medium text-on-surface">₹{mRev.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-outline-variant/20">
                      <span className="font-bold text-on-surface">{isEn ? 'Net Profit:' : 'शुद्ध लाभ (Net):'}</span>
                      <span className="font-bold text-on-surface text-sm">₹{mProfit.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-2 border-t border-surface-container flex items-center justify-between text-xs">
                  <span className="text-on-surface-variant">{isEn ? 'Risk Rating:' : 'जोखिम स्तर:'}</span>
                  <span className="font-semibold text-tertiary flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-tertiary" />
                    {mustard.riskLevelHi}
                  </span>
                </div>
              </div>
            );
          })()}

          {/* Alternative 2: Gram / Chana */}
          {(() => {
            const gram = CROPS_CATALOG.find((c) => c.id === 'gram') || CROPS_CATALOG[2];
            const gFactor = metrics.normalizedAcres;
            const gCost = Math.round(17500 * gFactor);
            const gYield = Math.round(gram.defaultYieldPerAcre * gFactor);
            const gRev = Math.round(gYield * gram.defaultPricePerQtl);
            const gProfit = gRev - gCost;

            return (
              <div className="rounded-xl p-4 bg-surface-container-low hover:bg-surface-container transition-colors border border-outline-variant/20 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{gram.emoji}</span>
                      <span className="font-headline-md text-sm font-bold text-on-surface">
                        {isEn ? gram.nameEn : gram.nameHi}
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface-variant text-[11px] font-medium">
                      {isEn ? 'Alternative' : 'वैकल्पिक'}
                    </span>
                  </div>
                  <p className="font-caption text-xs text-on-surface-variant mb-3">
                    {gram.notesHi}
                  </p>

                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-on-surface-variant">{isEn ? 'Total Cost:' : 'कुल लागत:'}</span>
                      <span className="font-medium text-on-surface">₹{gCost.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-on-surface-variant">{isEn ? 'Est. Revenue:' : 'अनुमानित कमाई:'}</span>
                      <span className="font-medium text-on-surface">₹{gRev.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-outline-variant/20">
                      <span className="font-bold text-on-surface">{isEn ? 'Net Profit:' : 'शुद्ध लाभ (Net):'}</span>
                      <span className="font-bold text-on-surface text-sm">₹{gProfit.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-2 border-t border-surface-container flex items-center justify-between text-xs">
                  <span className="text-on-surface-variant">{isEn ? 'Risk Rating:' : 'जोखिम स्तर:'}</span>
                  <span className="font-semibold text-secondary flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-secondary" />
                    {gram.riskLevelHi}
                  </span>
                </div>
              </div>
            );
          })()}
        </div>

        {/* Strategic Next Steps Action Bar */}
        <div className="rounded-xl bg-surface-container-high/60 p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4 border border-outline-variant/30 print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center shrink-0 shadow-xs">
              <span className="material-symbols-outlined text-[20px]">rocket_launch</span>
            </div>
            <div>
              <h3 className="font-label-md text-sm font-bold text-on-surface">
                {isEn ? 'Recommended Next Steps for this Estimate' : 'इस गणना के आधार पर अगला कदम उठाएं (Recommended Actions)'}
              </h3>
              <p className="font-body-md text-xs text-on-surface-variant">
                {isEn
                  ? 'Identify verified buyers, book local cold storage, or protect your crop with PMFBY.'
                  : 'अधिकतम मुनाफा अर्जित करने के लिए पूर्व-बुकिंग व सर्वोत्तम खरीदार अभी से चिन्हित करें।'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full md:w-auto justify-end flex-wrap">
            <Link
              to="/storage"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface-container-lowest text-on-surface hover:bg-surface-container shadow-xs font-label-md text-xs font-bold transition-all border border-outline-variant/30"
            >
              <span className="material-symbols-outlined text-[18px] text-secondary">warehouse</span>
              <span>{isEn ? 'Find Storage' : 'नजदीकी गोदाम बुक करें'}</span>
            </Link>

            <Link
              to="/crop-loss"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface-container-lowest text-on-surface hover:bg-surface-container shadow-xs font-label-md text-xs font-bold transition-all border border-outline-variant/30"
            >
              <span className="material-symbols-outlined text-[18px] text-primary">verified_user</span>
              <span>{isEn ? 'PMFBY Loss Shield' : 'फसल नुकसान रिपोर्ट'}</span>
            </Link>

            <Link
              to="/resources"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-secondary text-on-primary hover:bg-secondary/90 shadow-xs font-label-md text-xs font-bold transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">handshake</span>
              <span>{isEn ? 'Machinery Hire' : 'मशीनरी किराया'}</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
