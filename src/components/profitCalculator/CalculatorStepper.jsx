import React from 'react';

export default function CalculatorStepper({ currentStep, setStep, lang = 'en' }) {
  const isEn = lang === 'en';

  const STEPS = [
    {
      step: 1,
      titleEn: 'Crop & Acreage',
      titleHi: 'फसल व रकबा',
      subEn: 'Area & Season',
      subHi: 'रकबा व सत्र',
      icon: 'agriculture',
    },
    {
      step: 2,
      titleEn: 'Cultivation Cost',
      titleHi: 'खेती लागत',
      subEn: 'Expenses',
      subHi: '7 मुख्य मदें',
      icon: 'receipt_long',
    },
    {
      step: 3,
      titleEn: 'Yield & Price',
      titleHi: 'उत्पादन व भाव',
      subEn: 'Mandi Rate',
      subHi: 'उपज व बिक्री दर',
      icon: 'payments',
    },
    {
      step: 4,
      titleEn: 'Profit & Analytics',
      titleHi: 'परिणाम व मुनाफा',
      subEn: 'Net In-hand',
      subHi: 'शुद्ध बचत व ROI',
      icon: 'trending_up',
    },
  ];

  const progressPercent = ((currentStep - 1) / (STEPS.length - 1)) * 100;

  return (
    <div className="bg-surface-container-lowest p-4 sm:p-6 rounded-2xl shadow-sm border border-outline-variant/30 mb-6">
      {/* Mobile Compact Progress (< 640px) */}
      <div className="sm:hidden flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-primary text-on-primary font-bold flex items-center justify-center text-[11px]">
              {currentStep}
            </span>
            <span className="font-headline-md font-bold text-primary">
              {isEn ? `Step ${currentStep} of 4: ` : `चरण ${currentStep} / 4: `}
              <span className="text-on-surface">
                {isEn ? STEPS[currentStep - 1]?.titleEn : STEPS[currentStep - 1]?.titleHi}
              </span>
            </span>
          </div>
          <span className="font-caption text-on-surface-variant font-semibold">
            {Math.round(progressPercent)}% {isEn ? 'Done' : 'पूर्ण'}
          </span>
        </div>

        <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
          <div
            className="bg-primary h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${Math.max(15, progressPercent)}%` }}
          />
        </div>
      </div>

      {/* Desktop & Tablet Progress (>= 640px) */}
      <div className="hidden sm:block">
        <div className="grid grid-cols-4 gap-2 relative">
          {STEPS.map((item) => {
            const isCompleted = currentStep > item.step;
            const isCurrent = currentStep === item.step;
            const isPending = currentStep < item.step;

            return (
              <button
                key={item.step}
                type="button"
                onClick={() => {
                  if (item.step < currentStep || isCompleted) {
                    setStep(item.step);
                  }
                }}
                disabled={isPending}
                className={`flex flex-col items-center text-center transition-all group ${
                  isPending ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
                }`}
              >
                {/* Circle Badge */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-label-md text-sm mb-1.5 transition-all shadow-xs ${
                    isCompleted
                      ? 'bg-secondary text-on-primary font-bold'
                      : isCurrent
                      ? 'bg-primary text-on-primary font-bold shadow-md ring-4 ring-primary/15 scale-105'
                      : 'bg-surface-container-high text-on-surface-variant'
                  }`}
                >
                  {isCompleted ? (
                    <span className="material-symbols-outlined text-[20px]">check</span>
                  ) : (
                    <span>{item.step}</span>
                  )}
                </div>

                {/* Step Title */}
                <span
                  className={`font-label-md text-xs sm:text-sm font-semibold truncate ${
                    isCurrent
                      ? 'text-primary font-bold'
                      : isCompleted
                      ? 'text-secondary'
                      : 'text-on-surface'
                  }`}
                >
                  {isEn ? item.titleEn : item.titleHi}
                </span>

                {/* Subtitle */}
                <span className="font-caption text-[11px] text-on-surface-variant truncate">
                  {isEn ? item.subEn : item.subHi}
                </span>
              </button>
            );
          })}
        </div>

        {/* Continuous Linear Progress Bar */}
        <div className="w-full bg-surface-container-high h-1.5 rounded-full mt-4 overflow-hidden">
          <div
            className="bg-primary h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${Math.max(10, progressPercent)}%` }}
          />
        </div>
      </div>
    </div>
  );
}
