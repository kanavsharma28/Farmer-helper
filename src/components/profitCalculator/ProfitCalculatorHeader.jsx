import React from 'react';
import { Link } from 'react-router-dom';

export default function ProfitCalculatorHeader({
  activeTab,
  setActiveTab,
  historyCount = 0,
  onReset,
  lang = 'en',
}) {
  const isEn = lang === 'en';

  return (
    <div className="flex flex-col w-full mb-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 mb-4 font-caption text-xs text-on-surface-variant flex-wrap">
        <Link to="/dashboard" className="hover:text-primary transition-colors">
          {isEn ? 'Dashboard' : 'डैशबोर्ड'}
        </Link>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <span className="hover:text-primary transition-colors">
          {isEn ? 'Agri Services' : 'कृषि सेवाएं'}
        </span>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <span className="text-on-surface font-semibold">
          {isEn ? 'Crop Profit Calculator' : 'फसल लाभ कैलकुलेटर'}
        </span>
      </nav>

      {/* Page Header & Mode Tabs */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-2">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-container/40 text-on-secondary-container font-label-md text-xs font-semibold mb-2">
            <span className="material-symbols-outlined text-[16px]">analytics</span>
            <span>
              {isEn
                ? 'Smart Agri Financial Decision Engine'
                : 'सटीक वित्तीय विश्लेषण • Smart Agri Decision Engine'}
            </span>
          </div>

          <h1 className="font-headline-lg text-2xl sm:text-3xl lg:text-4xl text-primary font-bold tracking-tight">
            {isEn ? (
              <>
                Crop Profit Calculator{' '}
                <span className="font-normal text-on-surface text-xl sm:text-2xl block sm:inline">
                  (फसल लाभ कैलकुलेटर)
                </span>
              </>
            ) : (
              <>
                फसल लाभ कैलकुलेटर{' '}
                <span className="font-normal text-on-surface text-xl sm:text-2xl block sm:inline">
                  (Crop Profit Calculator)
                </span>
              </>
            )}
          </h1>

          <p className="font-body-md text-sm sm:text-base text-on-surface-variant mt-1.5 max-w-2xl">
            {isEn
              ? 'Know your total cultivation cost, expected yield, and net profit before sowing.'
              : 'फसल लगाने से पहले अपनी कुल खेती लागत, उत्पादन और संभावित मुनाफा (Profit) जानें।'}
          </p>
        </div>

        {/* Action Controls: Mode Tabs & Reset Button */}
        <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
          {/* Segmented Mode Tabs */}
          <div className="flex items-center gap-1 p-1 bg-surface-container rounded-2xl shadow-xs">
            <button
              onClick={() => setActiveTab('calculator')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-label-md text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'calculator'
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">calculate</span>
              <span>{isEn ? 'Calculator' : 'नया कैलकुलेटर'}</span>
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-label-md text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'history'
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">history</span>
              <span>{isEn ? 'History' : 'मेरी पिछली गणनाएं'}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[11px] font-bold ${
                  activeTab === 'history'
                    ? 'bg-white/25 text-white'
                    : 'bg-surface-container-highest text-on-surface'
                }`}
              >
                {historyCount}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('comparison')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-label-md text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'comparison'
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">balance</span>
              <span>{isEn ? 'Compare Crops' : 'फसलों की तुलना'}</span>
            </button>
          </div>

          {/* Reset Button */}
          {activeTab === 'calculator' && (
            <button
              onClick={onReset}
              title={isEn ? 'Reset Calculator to Default' : 'कैलकुलेटर रीसेट करें'}
              className="flex items-center gap-1 px-3 py-2 rounded-xl bg-surface-container text-on-surface-variant hover:text-primary hover:bg-surface-container-high text-xs font-semibold transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">restart_alt</span>
              <span className="hidden sm:inline">{isEn ? 'Reset' : 'रीसेट'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
