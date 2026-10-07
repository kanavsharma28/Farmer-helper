import React, { useEffect, useState } from 'react';

const STEPS_EN = [
  'Farm details added',
  'Crop details added',
  'Damage information added',
  'Photos attached',
  'Location verified',
  'Generating report…',
];
const STEPS_HI = [
  'खेत की जानकारी जोड़ी गई',
  'फसल की जानकारी जोड़ी गई',
  'नुकसान की जानकारी जोड़ी गई',
  'फोटो संलग्न की गई',
  'Location सत्यापित',
  'रिपोर्ट बनाई जा रही है…',
];

export default function GeneratingReport({ lang, onComplete }) {
  const isEn = lang === 'en';
  const steps = isEn ? STEPS_EN : STEPS_HI;
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const delays = [400, 800, 1200, 1600, 2000, 2600];
    const timers = delays.map((d, i) =>
      setTimeout(() => setActiveStep(i + 1), d)
    );
    // Call onComplete after all steps done
    const finalTimer = setTimeout(() => onComplete(), 3400);
    return () => { timers.forEach(clearTimeout); clearTimeout(finalTimer); };
  }, [onComplete]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8 py-12 px-4">

      {/* Document animation */}
      <div className="relative">
        {/* Outer pulse rings */}
        <div className="absolute inset-0 rounded-[32px] bg-primary/10 animate-ping" style={{ animationDuration: '2s' }} />
        <div className="absolute inset-0 scale-110 rounded-[36px] bg-primary/5 animate-ping" style={{ animationDuration: '2.5s' }} />
        {/* Document icon */}
        <div className="relative w-28 h-28 bg-primary rounded-[32px] flex items-center justify-center shadow-[0_12px_40px_rgba(0,69,13,0.35)]">
          <span className="material-symbols-outlined text-on-primary text-[56px] material-fill" style={{ fontSize: '52px' }}>description</span>
          {/* Checkmark overlay when done */}
          {activeStep >= steps.length && (
            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-secondary rounded-full flex items-center justify-center shadow-lg animate-bounce">
              <span className="material-symbols-outlined text-on-secondary text-[22px] material-fill">check_circle</span>
            </div>
          )}
        </div>
      </div>

      {/* Heading */}
      <div className="text-center">
        <h2 className="font-headline-lg text-xl sm:text-2xl font-bold text-on-surface">
          {isEn ? 'Preparing your Crop Loss Report…' : 'आपकी Crop Loss Report तैयार हो रही है…'}
        </h2>
        <p className="text-sm text-on-surface-variant font-label-md mt-2 max-w-sm">
          {isEn
            ? 'Please wait while we compile all your information into an official report.'
            : 'कृपया प्रतीक्षा करें, आपकी सभी जानकारी official report में compile की जा रही है।'}
        </p>
      </div>

      {/* Step checklist */}
      <div className="w-full max-w-sm flex flex-col gap-2.5">
        {steps.map((step, idx) => {
          const done    = activeStep > idx;
          const active  = activeStep === idx;
          const pending = activeStep < idx;
          const isLast  = idx === steps.length - 1;

          return (
            <div key={idx} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-500
              ${done    ? 'bg-secondary-fixed/20'                        : ''}
              ${active  ? 'bg-primary/8 border border-primary/20'        : ''}
              ${pending ? 'opacity-40'                                    : ''}
            `}>
              {/* Icon */}
              <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all
                ${done ? 'bg-secondary text-on-secondary' : ''}
                ${active && !isLast ? 'bg-primary text-on-primary' : ''}
                ${active && isLast  ? 'border-2 border-primary bg-transparent' : ''}
                ${pending ? 'border-2 border-outline-variant bg-transparent' : ''}
              `}>
                {done && <span className="material-symbols-outlined text-[14px] material-fill">check</span>}
                {active && isLast && (
                  <div className="w-3 h-3 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                )}
                {active && !isLast && <span className="material-symbols-outlined text-[14px] material-fill">check</span>}
              </div>
              <span className={`font-label-md text-sm font-medium
                ${done    ? 'text-secondary line-through decoration-secondary/40' : ''}
                ${active  ? 'text-primary font-semibold'                          : ''}
                ${pending ? 'text-on-surface-variant'                             : ''}
              `}>
                {step}
              </span>
            </div>
          );
        })}
      </div>

      {/* Note */}
      <p className="text-xs text-on-surface-variant font-caption text-center max-w-xs">
        {isEn
          ? 'This may take a few seconds. Do not close this window.'
          : 'इसमें कुछ सेकंड लग सकते हैं। कृपया यह window बंद न करें।'}
      </p>
    </div>
  );
}
