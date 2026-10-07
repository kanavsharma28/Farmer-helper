import React from 'react';
import { STEP_LABELS } from '../../data/cropLossData';

export default function ReportStepper({ currentStep, totalSteps = 6, lang = 'en' }) {
  const isEn = lang === 'en';
  const steps = STEP_LABELS.slice(0, totalSteps);

  return (
    <>
      {/* ── Desktop Stepper (lg+) ───────────────────────────── */}
      <div className="hidden lg:flex items-center w-full">
        {steps.map((step, idx) => {
          const stepNum = idx + 1;
          const isDone   = currentStep > stepNum;
          const isActive = currentStep === stepNum;
          const isPending = currentStep < stepNum;

          return (
            <React.Fragment key={stepNum}>
              {/* Step node */}
              <div className="flex flex-col items-center shrink-0">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-label-md text-sm font-bold transition-all duration-300
                    ${isDone    ? 'bg-secondary text-on-secondary shadow-sm'            : ''}
                    ${isActive  ? 'bg-primary text-on-primary shadow-md scale-110'       : ''}
                    ${isPending ? 'bg-surface-container text-on-surface-variant'         : ''}
                  `}
                >
                  {isDone
                    ? <span className="material-symbols-outlined text-[18px] material-fill">check</span>
                    : <span className="text-xs">{stepNum}</span>
                  }
                </div>
                <span className={`mt-1.5 text-[10px] font-label-md font-semibold leading-tight text-center max-w-[64px]
                  ${isDone    ? 'text-secondary'         : ''}
                  ${isActive  ? 'text-primary'            : ''}
                  ${isPending ? 'text-on-surface-variant' : ''}
                `}>
                  {isEn ? step.en : step.hi}
                </span>
              </div>

              {/* Connector line (not after last step) */}
              {idx < steps.length - 1 && (
                <div className="flex-1 mx-2 h-0.5 rounded-full overflow-hidden bg-surface-container-high">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${isDone ? 'bg-secondary w-full' : 'bg-transparent w-0'}`}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* ── Mobile Compact Stepper (< lg) ──────────────────── */}
      <div className="flex lg:hidden items-center justify-between">
        <div className="flex flex-col">
          <span className="text-xs font-label-md text-on-surface-variant font-semibold uppercase tracking-wider">
            {isEn ? `Step ${currentStep} of ${totalSteps}` : `चरण ${currentStep} / ${totalSteps}`}
          </span>
          <span className="font-headline-md text-base font-bold text-primary leading-tight mt-0.5">
            {isEn ? steps[currentStep - 1]?.en : steps[currentStep - 1]?.hi}
          </span>
        </div>
        {/* Pill progress */}
        <div className="flex items-center gap-1.5">
          {steps.map((_, idx) => {
            const n = idx + 1;
            return (
              <div
                key={n}
                className={`h-1.5 rounded-full transition-all duration-300
                  ${n < currentStep  ? 'w-4 bg-secondary'                : ''}
                  ${n === currentStep ? 'w-6 bg-primary'                  : ''}
                  ${n > currentStep  ? 'w-2 bg-surface-container-high'  : ''}
                `}
              />
            );
          })}
        </div>
      </div>
    </>
  );
}
