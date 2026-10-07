import React, { useState, useEffect, useCallback } from 'react';
import DashboardSidebar from '../components/dashboard/DashboardSidebar';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import DashboardMobileNav from '../components/dashboard/DashboardMobileNav';

import {
  DEFAULT_CALCULATION,
  INITIAL_CALCULATIONS_HISTORY,
  CROPS_CATALOG,
  calculateCropProfit,
} from '../data/cropProfitData';

import ProfitCalculatorHeader from '../components/profitCalculator/ProfitCalculatorHeader';
import CalculatorStepper from '../components/profitCalculator/CalculatorStepper';
import Step1CropDetails from '../components/profitCalculator/Step1CropDetails';
import Step2CultivationCosts from '../components/profitCalculator/Step2CultivationCosts';
import Step3YieldAndPrice from '../components/profitCalculator/Step3YieldAndPrice';
import LiveProfitSidebar from '../components/profitCalculator/LiveProfitSidebar';
import CalculatingState from '../components/profitCalculator/CalculatingState';
import Step4ProfitResults from '../components/profitCalculator/Step4ProfitResults';
import CalculationHistoryView from '../components/profitCalculator/CalculationHistoryView';
import CropComparisonView from '../components/profitCalculator/CropComparisonView';
import MandiPricesModal from '../components/profitCalculator/MandiPricesModal';
import HowItWorksAccordion from '../components/profitCalculator/HowItWorksAccordion';

export default function CropProfitCalculatorPage() {
  const [lang, setLang] = useState('en');
  const [activeNav, setActiveNav] = useState('profitCalc');

  // Top Tabs: 'calculator' | 'history' | 'comparison'
  const [activeTab, setActiveTab] = useState('calculator');

  // Wizard Step: 1 | 2 | 3 | 4
  const [currentStep, setCurrentStep] = useState(1);
  const [isCalculating, setIsCalculating] = useState(false);

  // Active Calculation Data
  const [calcData, setCalcData] = useState(() => {
    try {
      const saved = localStorage.getItem('farmer_helper_active_calc');
      return saved ? JSON.parse(saved) : DEFAULT_CALCULATION;
    } catch {
      return DEFAULT_CALCULATION;
    }
  });

  // History List
  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('farmer_helper_profit_history');
      return saved ? JSON.parse(saved) : INITIAL_CALCULATIONS_HISTORY;
    } catch {
      return INITIAL_CALCULATIONS_HISTORY;
    }
  });

  // Modals
  const [isMandiModalOpen, setIsMandiModalOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('farmer_helper_active_calc', JSON.stringify(calcData));
    } catch {
      // ignore
    }
  }, [calcData]);

  useEffect(() => {
    try {
      localStorage.setItem('farmer_helper_profit_history', JSON.stringify(history));
    } catch {
      // ignore
    }
  }, [history]);

  // Update calculation fields
  const updateCalcData = useCallback((updates) => {
    setCalcData((prev) => ({
      ...prev,
      ...updates,
    }));
  }, []);

  // Reset calculator
  const handleReset = useCallback(() => {
    setCalcData({
      ...DEFAULT_CALCULATION,
      id: `CPC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    });
    setCurrentStep(1);
    setIsCalculating(false);
  }, []);

  // Save calculation to history
  const handleSaveCalculation = useCallback((data, metrics) => {
    const crop = CROPS_CATALOG.find((c) => c.id === data.cropId) || CROPS_CATALOG[0];
    const newRecord = {
      id: data.id || `CPC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      cropId: data.cropId,
      cropNameEn: data.customCropName || crop.nameEn,
      cropNameHi: data.customCropName || crop.nameHi,
      emoji: crop.emoji || '🌾',
      area: Number(data.area) || 1,
      areaUnit: data.areaUnit,
      state: data.state,
      district: data.district,
      season: data.season,
      seasonYear: data.seasonYear || '2026-27',
      costs: { ...data.costs },
      totalCost: metrics.totalCost,
      expectedYield: Number(data.expectedYield) || 0,
      yieldUnit: data.yieldUnit,
      sellingPrice: Number(data.sellingPrice) || 0,
      grossRevenue: metrics.grossRevenue,
      netProfit: metrics.netProfit,
      profitPerAcre: metrics.profitPerAcre,
      roi: metrics.roi,
      breakEvenPrice: metrics.breakEvenPrice,
      date: new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
    };

    setHistory((prev) => {
      const exists = prev.some((item) => item.id === newRecord.id);
      if (exists) {
        return prev.map((item) => (item.id === newRecord.id ? newRecord : item));
      }
      return [newRecord, ...prev];
    });
  }, []);

  // Load a historical calculation into active calculator
  const handleLoadCalculation = useCallback((item) => {
    setCalcData({
      id: item.id,
      cropId: item.cropId,
      customCropName: item.cropNameEn,
      area: item.area,
      areaUnit: item.areaUnit,
      state: item.state,
      district: item.district,
      season: item.season,
      seasonYear: item.seasonYear,
      costs: { ...item.costs },
      expectedYield: item.expectedYield,
      yieldUnit: item.yieldUnit,
      sellingPrice: item.sellingPrice,
    });
    setActiveTab('calculator');
    setCurrentStep(4);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Duplicate an item
  const handleDuplicateCalculation = useCallback((item) => {
    const cloned = {
      ...item,
      id: `CPC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      title: `${item.cropNameHi} (कॉपी)`,
    };
    setCalcData(cloned);
    setActiveTab('calculator');
    setCurrentStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Delete from history
  const handleDeleteCalculation = useCallback((id) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  }, []);

  // Launch crop comparison selection into calculator
  const handleSelectCropForCalculator = useCallback((cropId, area) => {
    const crop = CROPS_CATALOG.find((c) => c.id === cropId) || CROPS_CATALOG[0];
    const typicalCosts = crop.typicalCostsPerAcre;
    const factor = area;

    setCalcData({
      id: `CPC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      cropId: crop.id,
      customCropName: '',
      area: area,
      areaUnit: 'acre',
      state: 'Uttar Pradesh',
      district: 'Meerut',
      season: crop.season,
      seasonYear: '2026-27',
      costs: {
        seeds: Math.round(typicalCosts.seeds * factor),
        fertilizer: Math.round(typicalCosts.fertilizer * factor),
        protection: Math.round(typicalCosts.protection * factor),
        labour: Math.round(typicalCosts.labour * factor),
        irrigation: Math.round(typicalCosts.irrigation * factor),
        machinery: Math.round(typicalCosts.machinery * factor),
        other: Math.round(typicalCosts.other * factor),
      },
      expectedYield: Math.round(crop.defaultYieldPerAcre * factor),
      yieldUnit: 'quintal',
      sellingPrice: crop.defaultPricePerQtl,
    });
    setActiveTab('calculator');
    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Calculate button handler
  const handleTriggerCalculation = useCallback(() => {
    setIsCalculating(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleCalculationComplete = useCallback(() => {
    setIsCalculating(false);
    setCurrentStep(4);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Compute live metrics for mobile header bar
  const liveMetrics = calculateCropProfit(calcData);

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col lg:flex-row font-sans selection:bg-primary-container selection:text-white">
      {/* Desktop Sticky Sidebar Navigation */}
      <DashboardSidebar
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        lang={lang}
      />

      {/* Main Right Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-24 lg:pb-12">
        {/* Top Header Bar */}
        <DashboardHeader lang={lang} setLang={setLang} />

        {/* Mobile Sticky Live Bar (visible only on mobile steps 2 & 3) */}
        {activeTab === 'calculator' && (currentStep === 2 || currentStep === 3) && !isCalculating && (
          <div className="lg:hidden sticky top-16 z-30 w-full px-4 py-2.5 bg-surface-container-lowest border-b border-outline-variant/30 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-primary shrink-0">
                <span className="material-symbols-outlined text-[18px]">account_balance_wallet</span>
              </div>
              <div className="flex flex-col">
                <span className="font-caption text-[11px] text-on-surface-variant leading-tight">
                  {lang === 'en' ? 'Expenses' : 'कुल खर्च'}
                </span>
                <span className="font-label-md text-xs font-bold text-on-surface">
                  ₹{liveMetrics.totalCost.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="h-6 w-px bg-surface-container-highest" />

            <div className="flex items-center gap-2 text-right">
              <div className="flex flex-col items-end">
                <span className="font-caption text-[11px] text-secondary font-semibold leading-tight">
                  {lang === 'en' ? 'Est. Net Profit' : 'संभावित लाभ'}
                </span>
                <span className="font-headline-md text-xs sm:text-sm font-bold text-secondary">
                  ₹{liveMetrics.netProfit.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[18px]">trending_up</span>
              </div>
            </div>
          </div>
        )}

        {/* Main Canvas */}
        <main className="flex-1 p-4 sm:p-6 lg:p-10 max-w-7xl w-full mx-auto">
          {/* Header & Tabs */}
          <ProfitCalculatorHeader
            activeTab={activeTab}
            setActiveTab={(tab) => {
              setActiveTab(tab);
              setIsCalculating(false);
            }}
            historyCount={history.length}
            onReset={handleReset}
            lang={lang}
          />

          {/* TAB 1: CALCULATOR WIZARD */}
          {activeTab === 'calculator' && (
            <div className="flex flex-col gap-6">
              {/* Stepper (Steps 1 to 4) */}
              {!isCalculating && (
                <CalculatorStepper
                  currentStep={currentStep}
                  setStep={(s) => {
                    setCurrentStep(s);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  lang={lang}
                />
              )}

              {/* Calculating State Loading Screen */}
              {isCalculating ? (
                <CalculatingState
                  onComplete={handleCalculationComplete}
                  lang={lang}
                />
              ) : (
                <>
                  {/* Step 1: Crop & Acreage */}
                  {currentStep === 1 && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                      <div className="lg:col-span-8 flex flex-col gap-6">
                        <Step1CropDetails
                          calcData={calcData}
                          updateCalcData={updateCalcData}
                          onNext={() => {
                            setCurrentStep(2);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          lang={lang}
                        />
                        <HowItWorksAccordion lang={lang} />
                      </div>

                      <div className="lg:col-span-4">
                        <LiveProfitSidebar calcData={calcData} lang={lang} />
                      </div>
                    </div>
                  )}

                  {/* Step 2: Cultivation Costs */}
                  {currentStep === 2 && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                      <div className="lg:col-span-8 flex flex-col gap-6">
                        <Step2CultivationCosts
                          calcData={calcData}
                          updateCalcData={updateCalcData}
                          onNext={() => {
                            setCurrentStep(3);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          onBack={() => {
                            setCurrentStep(1);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          onEditCrop={() => {
                            setCurrentStep(1);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          lang={lang}
                        />
                        <HowItWorksAccordion lang={lang} />
                      </div>

                      <div className="lg:col-span-4">
                        <LiveProfitSidebar calcData={calcData} lang={lang} />
                      </div>
                    </div>
                  )}

                  {/* Step 3: Yield & Selling Price */}
                  {currentStep === 3 && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                      <div className="lg:col-span-8 flex flex-col gap-6">
                        <Step3YieldAndPrice
                          calcData={calcData}
                          updateCalcData={updateCalcData}
                          onCalculate={handleTriggerCalculation}
                          onBack={() => {
                            setCurrentStep(2);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          onOpenMandiModal={() => setIsMandiModalOpen(true)}
                          lang={lang}
                        />
                        <HowItWorksAccordion lang={lang} />
                      </div>

                      <div className="lg:col-span-4">
                        <LiveProfitSidebar calcData={calcData} lang={lang} />
                      </div>
                    </div>
                  )}

                  {/* Step 4: Full Results & Analytics */}
                  {currentStep === 4 && (
                    <div className="flex flex-col gap-6">
                      <Step4ProfitResults
                        calcData={calcData}
                        onRecalculate={() => {
                          setCurrentStep(1);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        onSaveCalculation={handleSaveCalculation}
                        lang={lang}
                      />
                      <HowItWorksAccordion lang={lang} />
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* TAB 2: MY CALCULATIONS (HISTORY) */}
          {activeTab === 'history' && (
            <div className="flex flex-col gap-6">
              <CalculationHistoryView
                history={history}
                onLoadCalculation={handleLoadCalculation}
                onDuplicateCalculation={handleDuplicateCalculation}
                onDeleteCalculation={handleDeleteCalculation}
                onStartNew={() => {
                  handleReset();
                  setActiveTab('calculator');
                }}
                lang={lang}
              />
              <HowItWorksAccordion lang={lang} />
            </div>
          )}

          {/* TAB 3: CROP COMPARISON */}
          {activeTab === 'comparison' && (
            <div className="flex flex-col gap-6">
              <CropComparisonView
                onSelectCropForCalculator={handleSelectCropForCalculator}
                lang={lang}
              />
              <HowItWorksAccordion lang={lang} />
            </div>
          )}
        </main>
      </div>

      {/* Mandi Benchmark Price Modal */}
      <MandiPricesModal
        isOpen={isMandiModalOpen}
        onClose={() => setIsMandiModalOpen(false)}
        onApplyPrice={(price) => updateCalcData({ sellingPrice: price })}
        lang={lang}
      />

      {/* Mobile Bottom Navigation */}
      <DashboardMobileNav
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        lang={lang}
      />
    </div>
  );
}
