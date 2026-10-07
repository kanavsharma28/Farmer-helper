import React from 'react';
import { calculateCropProfit } from '../../data/cropProfitData';

export default function LiveProfitSidebar({ calcData, lang = 'en' }) {
  const isEn = lang === 'en';

  const metrics = calculateCropProfit(calcData);

  const costRatio = metrics.grossRevenue > 0
    ? Math.min(100, Math.max(1, (metrics.totalCost / metrics.grossRevenue) * 100))
    : 0;

  return (
    <div className="flex flex-col gap-6 sticky top-20">
      {/* Primary Live Summary Card */}
      <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col gap-5 relative overflow-hidden">
        {/* Ambient decorative highlight glow */}
        <div className="absolute -top-12 -right-12 w-36 h-36 rounded-full bg-secondary-fixed-dim/20 blur-2xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between relative">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary-container text-on-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">equalizer</span>
            </div>
            <h2 className="font-headline-md text-base sm:text-lg font-bold text-on-surface">
              {isEn ? 'Live Profit Summary' : 'लाइव मुनाफा सारांश'}
            </h2>
          </div>

          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-secondary/10 text-secondary font-label-md text-[11px] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
            <span>{isEn ? 'Real-time' : 'रीयल-टाइम अपडेट'}</span>
          </span>
        </div>

        {/* Math Breakdown */}
        <div className="flex flex-col gap-3 font-body-md text-sm relative">
          {/* Revenue Row */}
          <div className="flex items-center justify-between text-on-surface-variant">
            <span>{isEn ? 'Est. Gross Revenue' : 'अनुमानित कुल कमाई (Revenue)'}</span>
            <span className="font-bold text-on-surface">
              ₹{metrics.grossRevenue.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="font-caption text-[11px] text-on-surface-variant text-right -mt-2">
            ({metrics.normalizedYieldQtl} {isEn ? 'Qtl' : 'क्विंटल'} × ₹{calcData.sellingPrice || 0})
          </div>

          {/* Expenses Row */}
          <div className="flex items-center justify-between text-on-surface-variant">
            <span>{isEn ? 'Total Expenses (Cost)' : 'कुल खेती लागत (Expenses)'}</span>
            <span className="font-bold text-error">
              -₹{metrics.totalCost.toLocaleString('en-IN')}
            </span>
          </div>

          {/* Divider */}
          <div className="h-px bg-surface-container-high my-1 rounded-full" />

          {/* Net Profit Hero Display */}
          <div className="p-4 rounded-2xl bg-primary text-on-primary flex flex-col gap-1 shadow-sm">
            <span className="font-caption text-[11px] text-on-primary/80 font-medium uppercase tracking-wider">
              {isEn ? 'Net Potential Profit' : 'संभावित शुद्ध मुनाफा (Net Profit)'}
            </span>

            <div className="flex items-baseline justify-between mt-1 gap-2 flex-wrap">
              <span className="font-headline-lg text-2xl sm:text-3xl font-bold tracking-tight text-white">
                ₹{metrics.netProfit.toLocaleString('en-IN')}
              </span>
              <span className="font-label-md text-xs px-2 py-0.5 rounded-md bg-secondary text-white font-bold shrink-0">
                {metrics.roi > 0 ? `+${metrics.roi}% ROI` : `${metrics.roi}% ROI`}
              </span>
            </div>

            <div className="font-label-md text-xs text-on-primary/80 mt-1 pt-2 border-t border-white/10 flex items-center justify-between">
              <span>{isEn ? 'Per Acre Profit:' : 'प्रति एकड़ मुनाफा:'}</span>
              <span className="font-bold text-white">
                ₹{metrics.profitPerAcre.toLocaleString('en-IN')} / {isEn ? 'Acre' : 'एकड़'}
              </span>
            </div>
          </div>
        </div>

        {/* Break-even & Risk Metrics Card */}
        <div className="p-4 rounded-xl bg-surface-container-low flex flex-col gap-2.5 border border-outline-variant/20">
          <div className="flex items-center gap-2 text-on-surface">
            <span className="material-symbols-outlined text-primary text-[18px]">verified_user</span>
            <span className="font-label-md text-xs sm:text-sm font-bold">
              {isEn ? 'Break-even & Safety Margin' : 'ब्रेक-ईवन व सुरक्षा मार्जिन'}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs font-label-md">
            <span className="text-on-surface-variant">
              {isEn ? 'Min. Price to Recover Cost:' : 'लागत निकालने हेतु न्यूनतम भाव:'}
            </span>
            <span className="font-bold text-on-surface">
              ₹{metrics.breakEvenPrice} / {isEn ? 'Qtl' : 'क्विंटल'}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs font-label-md">
            <span className="text-on-surface-variant">
              {isEn ? 'Safety Margin (Buffer):' : 'सुरक्षा मार्जिन (Safety Buffer):'}
            </span>
            <span className="font-bold text-secondary">
              {metrics.safetyMarginPercent}% {isEn ? 'Safe' : 'सुरक्षित'}
            </span>
          </div>

          {/* Mini Visual Buffer Bar */}
          <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden mt-0.5">
            <div
              className="bg-secondary h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(0, metrics.safetyMarginPercent))}%` }}
            />
          </div>

          <span className="font-caption text-[11px] text-on-surface-variant leading-tight">
            {isEn
              ? `Market price can fall up to ₹${metrics.safePriceDrop.toLocaleString('en-IN')}/Qtl without incurring net loss.`
              : `बाजार भाव में ₹${metrics.safePriceDrop.toLocaleString('en-IN')}/क्विंटल तक की गिरावट आने पर भी लागत सुरक्षित रहेगी।`}
          </span>
        </div>

        {/* Mini Cost Ratio Strip */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/20 shadow-2xs">
          <div className="flex items-center gap-3">
            {/* Inline Mini SVG Donut */}
            <svg className="w-10 h-10 -rotate-90 shrink-0" viewBox="0 0 36 36">
              <circle
                className="text-surface-container-high stroke-current"
                cx="18"
                cy="18"
                fill="none"
                r="14"
                strokeWidth="4"
              />
              <circle
                className="text-primary stroke-current"
                cx="18"
                cy="18"
                fill="none"
                r="14"
                strokeDasharray={`${costRatio} 100`}
                strokeLinecap="round"
                strokeWidth="4"
              />
            </svg>
            <div>
              <p className="font-label-md text-xs font-bold text-on-surface">
                {costRatio <= 25
                  ? (isEn ? 'Grade A: High Profitability' : 'उत्कृष्ट लाभ अनुपात (Grade A)')
                  : costRatio <= 50
                  ? (isEn ? 'Grade B: Moderate Profit' : 'मध्यम लाभ अनुपात (Grade B)')
                  : (isEn ? 'Grade C: High Cost Ratio' : 'अधिक लागत अनुपात')}
              </p>
              <p className="font-caption text-[11px] text-on-surface-variant">
                {isEn
                  ? `Cost is ${costRatio.toFixed(1)}% of total revenue`
                  : `लागत कुल आय का सिर्फ ${costRatio.toFixed(1)}% है`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
