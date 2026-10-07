import React from 'react';
import { Link } from 'react-router-dom';
import { dashboardData } from '../../data/dashboardContent';

export default function ProfitAndBuyersRow({ lang = 'en' }) {
  const isEn = lang === 'en';
  const { profitMetrics, bestBuyers } = dashboardData;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      
      {/* Profit Chart Card */}
      <div className="glass-card rounded-[24px] p-6 border border-outline-variant/50 shadow-md flex flex-col justify-between">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-headline-md text-lg font-bold text-on-surface">
            {isEn ? 'Estimated Crop Profit' : 'अनुमानित फसल लाभ'}
          </h3>
          <Link
            to="/profit-calculator"
            className="text-xs text-primary font-bold hover:underline flex items-center gap-1"
          >
            <span>{isEn ? 'Open Calculator' : 'लाभ कैलकुलेटर'}</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>

        <div className="flex flex-col gap-4">
          {/* Bar 1: Investment */}
          <div>
            <div className="flex justify-between text-xs mb-1 font-semibold">
              <span className="text-on-surface-variant">{isEn ? 'Investment' : 'लागत'}</span>
              <span className="text-error font-bold">{profitMetrics.investmentEn}</span>
            </div>
            <div className="w-full bg-surface-variant rounded-full h-3">
              <div className="bg-error h-3 rounded-full transition-all duration-1000" style={{ width: '15%' }}></div>
            </div>
          </div>

          {/* Bar 2: Revenue */}
          <div>
            <div className="flex justify-between text-xs mb-1 font-semibold">
              <span className="text-on-surface-variant">{isEn ? 'Est. Revenue' : 'अनुमानित राजस्व'}</span>
              <span className="text-secondary font-bold">{profitMetrics.revenueEn}</span>
            </div>
            <div className="w-full bg-surface-variant rounded-full h-3">
              <div className="bg-secondary h-3 rounded-full transition-all duration-1000" style={{ width: '100%' }}></div>
            </div>
          </div>

          {/* Profit Summary */}
          <div className="mt-4 pt-4 border-t border-outline-variant/30 flex justify-between items-center">
            <span className="font-body-lg text-base font-bold text-on-surface">
              {isEn ? 'Net Profit Margin' : 'शुद्ध लाभ'}
            </span>
            <span className="font-display-lg text-2xl font-extrabold text-primary">
              {profitMetrics.netProfitEn}
            </span>
          </div>
        </div>
      </div>

      {/* Best Buyers Card */}
      <div className="glass-card rounded-[24px] p-6 border border-outline-variant/50 shadow-md flex flex-col justify-between">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-headline-md text-lg font-bold text-on-surface">
            {isEn ? 'Best Buyers' : 'सर्वश्रेष्ठ खरीदार'}
          </h3>
          <Link
            to="/buyers"
            className="font-label-md text-xs text-primary hover:underline font-bold bg-primary-container/10 px-3 py-1.5 rounded-full hover:bg-primary-container hover:text-white transition-all shadow-2xs"
          >
            {isEn ? 'View All Buyers →' : 'सभी खरीदार देखें →'}
          </Link>
        </div>

        <div className="flex flex-col gap-4">
          {bestBuyers.map((buyer) => (
            <div
              key={buyer.id}
              className="bg-surface-container-low rounded-xl p-4 border border-outline-variant/30 flex justify-between items-center hover:border-primary/40 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-tertiary-fixed flex items-center justify-center text-on-tertiary-fixed shrink-0">
                  <span className="material-symbols-outlined text-xl">storefront</span>
                </div>
                <div>
                  <h4 className="font-body-md text-sm font-bold text-on-surface">
                    {isEn ? buyer.nameEn : buyer.nameHi}
                  </h4>
                  <p className="font-caption text-xs text-on-surface-variant flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">location_on</span>
                    {isEn ? buyer.distanceEn : buyer.distanceHi}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="font-headline-md text-base font-bold text-primary block">
                  {isEn ? buyer.priceEn : buyer.priceHi}
                </span>
                <span className="font-caption text-xs text-on-surface-variant font-medium">
                  {isEn ? buyer.unitEn : buyer.unitHi}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
