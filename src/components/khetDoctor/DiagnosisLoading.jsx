import React, { useEffect, useState } from 'react';

const STEPS = [
  { id: 'photo',     en: 'Photo received',              hi: 'फोटो प्राप्त हुई' },
  { id: 'info',      en: 'Crop information received',   hi: 'फसल जानकारी प्राप्त हुई' },
  { id: 'detecting', en: 'Detecting possible disease',  hi: 'संभावित बीमारी पहचानी जा रही है' },
  { id: 'treatment', en: 'Preparing treatment guidance', hi: 'उपचार मार्गदर्शन तैयार हो रहा है' },
];

export default function DiagnosisLoading({ lang, imageData, onComplete }) {
  const isEn = lang === 'en';
  const [currentStep, setCurrentStep] = useState(0); // 0-indexed, auto increments

  useEffect(() => {
    // Advance steps at realistic intervals, then call onComplete
    const timings = [800, 1600, 2600, 3600];
    const timers = timings.map((delay, idx) =>
      setTimeout(() => setCurrentStep(idx + 1), delay)
    );
    const doneTimer = setTimeout(() => onComplete?.(), 4400);
    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(doneTimer);
    };
  }, [onComplete]);

  // Step status: 'done' | 'active' | 'pending'
  const getStatus = (idx) => {
    if (currentStep > idx + 1) return 'done';
    if (currentStep === idx + 1) return 'active';
    return 'pending';
  };

  return (
    <div className="flex flex-col gap-8">

      {/* ── Title ── */}
      <div>
        <span className="text-xs font-label-md text-primary uppercase tracking-widest font-semibold">
          {isEn ? 'Mera Khet Ka Doctor • Analyzing' : 'मेरा खेत का डॉक्टर • जांच हो रही है'}
        </span>
        <h1 className="font-headline-lg text-2xl sm:text-3xl font-bold text-on-surface mt-1">
          {isEn ? 'Analyzing Your Crop…' : 'आपकी फसल की जांच हो रही है…'}
        </h1>
        <p className="font-body-md text-on-surface-variant mt-1.5 text-sm sm:text-base">
          {isEn
            ? 'Please wait while our system processes the image and prepares your diagnosis.'
            : 'कृपया प्रतीक्षा करें, हमारा सिस्टम फोटो का विश्लेषण कर रहा है।'}
        </p>
      </div>

      {/* ── Main Card ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* ─── Left: Animated Crop Image (5 cols) ─── */}
        <div className="lg:col-span-5 bg-surface rounded-[24px] p-6 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.06)] flex flex-col items-center justify-center gap-6">
          {/* Scan ring animation */}
          <div className="relative">
            {/* Outer pulsing ring */}
            <div className="absolute inset-0 rounded-full border-4 border-primary/30 animate-ping scale-110" />
            <div className="absolute inset-0 rounded-full border-2 border-secondary/40 animate-pulse" />
            {/* Image */}
            {imageData?.url ? (
              <img
                src={imageData.url}
                alt="Crop being analyzed"
                className="w-48 h-48 sm:w-56 sm:h-56 rounded-full object-cover border-4 border-primary/30 shadow-xl relative z-10"
              />
            ) : (
              <div className="w-48 h-48 rounded-full bg-primary-container/20 flex items-center justify-center border-4 border-primary/30 relative z-10">
                <span className="material-symbols-outlined text-primary text-[64px]">grass</span>
              </div>
            )}
            {/* Scanning line overlay */}
            <div className="absolute inset-0 rounded-full overflow-hidden z-20 pointer-events-none">
              <div
                className="h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent w-full"
                style={{ animation: 'scanLine 2s ease-in-out infinite' }}
              />
            </div>
          </div>

          {/* AI badge */}
          <div className="flex items-center gap-2 bg-primary-container/20 border border-primary/20 px-4 py-2 rounded-full">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <span className="font-label-md text-sm font-semibold text-primary">
              {isEn ? 'AI Processing…' : 'AI प्रोसेसिंग…'}
            </span>
          </div>
        </div>

        {/* ─── Right: Progress Steps (7 cols) ─── */}
        <div className="lg:col-span-7 bg-surface rounded-[24px] p-6 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.06)] flex flex-col justify-center gap-6">
          <h2 className="font-headline-md text-lg font-bold text-on-surface">
            {isEn ? 'Analysis Progress' : 'जांच की प्रगति'}
          </h2>

          <div className="space-y-4">
            {STEPS.map((step, idx) => {
              const status = getStatus(idx);
              return (
                <div
                  key={step.id}
                  className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-500
                    ${status === 'active'  ? 'bg-primary/8 border border-primary/20 shadow-sm' : ''}
                    ${status === 'done'    ? 'bg-secondary/8'  : ''}
                    ${status === 'pending' ? 'opacity-40'      : ''}
                  `}
                >
                  {/* Step icon */}
                  <div className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center">
                    {status === 'done' && (
                      <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                        <span className="material-symbols-outlined text-on-secondary text-[20px] material-fill">check</span>
                      </div>
                    )}
                    {status === 'active' && (
                      <div className="w-10 h-10 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
                    )}
                    {status === 'pending' && (
                      <div className="w-10 h-10 rounded-full border-2 border-outline-variant/60 flex items-center justify-center">
                        <span className="w-2.5 h-2.5 rounded-full bg-outline-variant/60" />
                      </div>
                    )}
                  </div>

                  {/* Step label */}
                  <div className="flex-1 min-w-0">
                    <p className={`font-label-md text-sm font-semibold leading-tight
                      ${status === 'done'    ? 'text-secondary'       : ''}
                      ${status === 'active'  ? 'text-primary'          : ''}
                      ${status === 'pending' ? 'text-on-surface-variant' : ''}
                    `}>
                      {isEn ? step.en : step.hi}
                    </p>
                    {status === 'active' && (
                      <p className="text-xs text-primary/70 font-label-md mt-0.5 animate-pulse">
                        {isEn ? 'Processing…' : 'प्रोसेसिंग…'}
                      </p>
                    )}
                    {status === 'done' && (
                      <p className="text-xs text-secondary font-label-md mt-0.5">
                        {isEn ? '✓ Complete' : '✓ पूर्ण'}
                      </p>
                    )}
                  </div>

                  {/* Step number badge */}
                  <span className={`shrink-0 text-xs font-bold font-label-md px-2 py-0.5 rounded-full
                    ${status === 'done'    ? 'bg-secondary/15 text-secondary'       : ''}
                    ${status === 'active'  ? 'bg-primary/10 text-primary'            : ''}
                    ${status === 'pending' ? 'bg-surface-container text-on-surface-variant' : ''}
                  `}>
                    0{idx + 1}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Progress bar */}
          <div>
            <div className="flex justify-between text-xs font-label-md text-on-surface-variant mb-1.5">
              <span>{isEn ? 'Overall Progress' : 'कुल प्रगति'}</span>
              <span>{Math.round((currentStep / STEPS.length) * 100)}%</span>
            </div>
            <div className="h-2 bg-surface-container-high rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-700 ease-out"
                style={{ width: `${(currentStep / STEPS.length) * 100}%` }}
              />
            </div>
          </div>

          <p className="font-caption text-xs text-on-surface-variant text-center">
            {isEn
              ? '⚠️ Results are informational only. Always consult a certified agronomist.'
              : '⚠️ परिणाम केवल सूचनात्मक हैं। हमेशा कृषि विशेषज्ञ से परामर्श लें।'}
          </p>
        </div>
      </div>

      {/* Scan animation keyframe injected via a style tag */}
      <style>{`
        @keyframes scanLine {
          0%   { transform: translateY(0); opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { transform: translateY(192px); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
