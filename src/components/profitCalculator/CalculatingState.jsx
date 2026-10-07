import React, { useEffect, useState } from 'react';

export default function CalculatingState({ onComplete, lang = 'en' }) {
  const isEn = lang === 'en';
  const [completedSteps, setCompletedSteps] = useState(0);

  const CHECKLIST = [
    { en: 'Crop & land parameters verified', hi: 'फसल व रकबा विवरण सत्यापित' },
    { en: '7 cultivation cost heads computed', hi: '7 मुख्य खेती लागत मदों की गणना' },
    { en: 'Yield & gross revenue projected', hi: 'उत्पादन व संभावित राजस्व प्रक्षेपण' },
    { en: 'Market sensitivity & break-even analyzed', hi: 'मंडी संवेदनशीलता व ब्रेक-ईवन विश्लेषण' },
    { en: 'Finalizing net farmer in-hand profit...', hi: 'शुद्ध किसान मुनाफे का अंतिम परिणाम...' },
  ];

  useEffect(() => {
    const timer1 = setTimeout(() => setCompletedSteps(1), 250);
    const timer2 = setTimeout(() => setCompletedSteps(2), 500);
    const timer3 = setTimeout(() => setCompletedSteps(3), 750);
    const timer4 = setTimeout(() => setCompletedSteps(4), 1000);
    const timerFinal = setTimeout(() => {
      onComplete();
    }, 1250);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timerFinal);
    };
  }, [onComplete]);

  return (
    <div className="bg-surface-container-lowest p-8 sm:p-12 rounded-3xl shadow-sm border border-outline-variant/30 flex flex-col items-center justify-center text-center max-w-xl mx-auto my-8">
      {/* Animated Circular Icon */}
      <div className="relative w-20 h-20 mb-6 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-spin border-t-primary" />
        <span className="material-symbols-outlined text-3xl text-primary animate-pulse">
          calculate
        </span>
      </div>

      <h2 className="font-headline-md text-xl sm:text-2xl font-bold text-on-surface mb-2">
        {isEn ? 'Calculating Estimated Profit...' : 'आपका मुनाफा अनुमान तैयार हो रहा है…'}
      </h2>
      <p className="font-body-md text-xs sm:text-sm text-on-surface-variant mb-6">
        {isEn
          ? 'Analyzing direct costs, yield projections, and market benchmark scenarios.'
          : 'खेती की लागत, अनुमानित उपज और मंडी भाव संवेदनशीलता का विश्लेषण किया जा रहा है।'}
      </p>

      {/* Animated Checklist Box */}
      <div className="w-full bg-surface-container-low p-5 rounded-2xl flex flex-col gap-3 text-left">
        {CHECKLIST.map((item, index) => {
          const isDone = index < completedSteps;
          const isCurrent = index === completedSteps;

          return (
            <div key={index} className="flex items-center gap-3 text-xs sm:text-sm">
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all ${
                  isDone
                    ? 'bg-secondary text-on-primary'
                    : isCurrent
                    ? 'bg-primary/20 text-primary animate-pulse'
                    : 'bg-surface-container-high text-on-surface-variant'
                }`}
              >
                {isDone ? (
                  <span className="material-symbols-outlined text-[14px]">check</span>
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                )}
              </div>

              <span
                className={`transition-colors font-medium ${
                  isDone
                    ? 'text-on-surface'
                    : isCurrent
                    ? 'text-primary font-bold'
                    : 'text-on-surface-variant/60'
                }`}
              >
                {isEn ? item.en : item.hi}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
