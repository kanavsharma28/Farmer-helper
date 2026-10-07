import React, { useState } from 'react';
import { damageCategories, areaUnits, getDamageSeverity } from '../../data/cropLossData';

const inputBase = 'w-full px-4 py-3 bg-surface-container-low border border-outline-variant/60 rounded-xl font-body-md text-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all';

function FieldError({ msg }) {
  if (!msg) return null;
  return (
    <p className="mt-1 text-xs text-error font-label-md flex items-center gap-1">
      <span className="material-symbols-outlined text-[14px]">error</span>
      {msg}
    </p>
  );
}

// SVG ring indicator for damage %
function DamageRing({ pct }) {
  const severity = getDamageSeverity(pct);
  const colorMap = { secondary: '#006e1c', tertiary: '#4c3700', error: '#ba1a1a' };
  const stroke = colorMap[severity.ring] || '#ba1a1a';
  return (
    <div className="relative w-20 h-20 flex items-center justify-center">
      <svg className="w-20 h-20 -rotate-90" viewBox="0 0 36 36">
        <path className="text-surface-container-high" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none" stroke="currentColor" strokeWidth="3.5" />
        <path fill="none" stroke={stroke} strokeWidth="3.5" strokeLinecap="round"
          strokeDasharray={`${pct}, 100`}
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-base font-bold font-headline-md leading-none ${severity.color}`}>{pct}%</span>
      </div>
    </div>
  );
}

export default function DamageDetailsForm({ lang, data, onNext, onBack }) {
  const isEn = lang === 'en';
  const [form, setForm] = useState({
    cause: '', damageDate: '', damageArea: '', damageAreaUnit: 'acre', damagePercent: 50,
    ...data,
  });
  const [errors, setErrors] = useState({});

  const set = (field, value) => {
    setForm(p => ({ ...p, [field]: value }));
    if (errors[field]) setErrors(p => ({ ...p, [field]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.cause)      e.cause      = isEn ? 'Please select damage cause' : 'नुकसान का कारण चुनें';
    if (!form.damageDate) e.damageDate = isEn ? 'Damage date is required'    : 'नुकसान की तारीख दर्ज करें';
    if (!form.damageArea) e.damageArea = isEn ? 'Damage area is required'    : 'नुकसान का क्षेत्र दर्ज करें';
    return e;
  };

  const handleNext = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onNext(form);
  };

  const severity = getDamageSeverity(form.damagePercent);

  const sliderColor = { secondary: 'accent-secondary', tertiary: 'accent-tertiary', error: 'accent-error' };

  return (
    <form onSubmit={handleNext} noValidate className="flex flex-col gap-6">
      <div>
        <span className="text-xs font-label-md font-semibold text-primary uppercase tracking-widest">
          {isEn ? 'Step 3 of 6' : 'चरण 3 / 6'}
        </span>
        <h2 className="font-headline-lg text-xl sm:text-2xl font-bold text-on-surface mt-1">
          {isEn ? 'How much damage occurred?' : 'फसल को कितना नुकसान हुआ?'}
        </h2>
        <p className="text-xs text-on-surface-variant font-label-md mt-1">
          {isEn ? 'Select the damage cause and provide details.' : 'नुकसान का कारण और विवरण दें।'}
        </p>
      </div>

      <div className="bg-surface rounded-[24px] p-5 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.06)] flex flex-col gap-6">

        {/* Damage cause cards */}
        <div>
          <label className="block font-label-md text-sm font-semibold text-on-surface mb-3">
            {isEn ? 'Damage Cause *' : 'नुकसान का कारण *'}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {damageCategories.map(cat => {
              const active = form.cause === cat.value;
              return (
                <button key={cat.value} type="button" onClick={() => set('cause', cat.value)}
                  className={`flex flex-col items-center justify-center p-4 rounded-2xl text-center transition-all gap-2 border-2
                    ${active
                      ? 'bg-primary-container/20 border-primary shadow-sm'
                      : 'bg-surface-container-low border-transparent hover:border-outline-variant hover:bg-surface-container'}`}
                  aria-pressed={active}>
                  <span className="text-2xl">{cat.emoji}</span>
                  <div className="flex flex-col gap-0.5">
                    <span className={`text-xs font-label-md font-bold leading-tight ${active ? 'text-primary' : 'text-on-surface'}`}>{cat.en}</span>
                    <span className={`text-[10px] font-caption leading-tight ${active ? 'text-primary/70' : 'text-on-surface-variant'}`}>{cat.hi}</span>
                  </div>
                </button>
              );
            })}
          </div>
          <FieldError msg={errors.cause} />
        </div>

        {/* Date + Area */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block font-label-md text-sm font-semibold text-on-surface mb-1.5" htmlFor="damageDate">
              {isEn ? 'Damage Date *' : 'नुकसान की तारीख *'}
            </label>
            <input id="damageDate" type="date" value={form.damageDate} onChange={e => set('damageDate', e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              className={`${inputBase} ${errors.damageDate ? 'border-error bg-error/5' : ''}`} />
            <FieldError msg={errors.damageDate} />
          </div>
          <div>
            <label className="block font-label-md text-sm font-semibold text-on-surface mb-1.5">
              {isEn ? 'Affected Area *' : 'नुकसान का क्षेत्र *'}
            </label>
            <div className="flex gap-2">
              <input type="number" min="0.01" step="0.01" value={form.damageArea} onChange={e => set('damageArea', e.target.value)}
                placeholder="0.00"
                className={`flex-1 px-4 py-3 bg-surface-container-low border rounded-xl font-body-md text-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all ${errors.damageArea ? 'border-error bg-error/5' : 'border-outline-variant/60'}`} />
              <div className="flex bg-surface-container-low border border-outline-variant/60 rounded-xl overflow-hidden">
                {areaUnits.slice(0, 2).map(u => (
                  <button key={u.value} type="button" onClick={() => set('damageAreaUnit', u.value)}
                    className={`px-3 py-3 font-label-md text-xs font-semibold transition-all
                      ${form.damageAreaUnit === u.value ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:text-on-surface'}`}>
                    {isEn ? u.en : u.hi}
                  </button>
                ))}
              </div>
            </div>
            <FieldError msg={errors.damageArea} />
          </div>
        </div>

        {/* Damage % slider */}
        <div className="bg-surface-container-low rounded-2xl p-5 flex flex-col sm:flex-row items-center gap-6">
          <DamageRing pct={form.damagePercent} />
          <div className="flex-1 w-full">
            <div className="flex items-center justify-between mb-2">
              <label className="font-label-md text-sm font-semibold text-on-surface">
                {isEn ? 'Estimated Damage %' : 'अनुमानित नुकसान %'}
              </label>
              <span className={`font-bold text-lg font-headline-md ${severity.color}`}>
                {form.damagePercent}%
              </span>
            </div>
            <input
              type="range" min="1" max="100" step="1"
              value={form.damagePercent}
              onChange={e => set('damagePercent', Number(e.target.value))}
              className={`w-full h-2 rounded-full appearance-none cursor-pointer bg-surface-container-high ${sliderColor[severity.ring] || 'accent-error'}`}
              style={{ background: `linear-gradient(to right, var(--tw-${severity.ring === 'secondary' ? 'text-secondary' : severity.ring === 'tertiary' ? 'text-tertiary' : 'text-error'}) 0%, var(--tw-) ${form.damagePercent}%, #e0e0e0 ${form.damagePercent}%, #e0e0e0 100%)` }}
            />
            <div className="flex justify-between text-[10px] font-caption text-on-surface-variant mt-1">
              <span>1%</span><span>25%</span><span>50%</span><span>75%</span><span>100%</span>
            </div>
            <p className={`text-xs font-label-md font-semibold mt-2 ${severity.color}`}>
              {isEn ? severity.en : severity.hi}
            </p>
          </div>
        </div>
      </div>

      {/* CTAs */}
      <div className="flex flex-col-reverse sm:flex-row gap-3 justify-between">
        <button type="button" onClick={onBack}
          className="px-5 py-3 bg-surface-container text-on-surface rounded-xl font-label-md text-sm font-semibold hover:bg-surface-container-high transition-all flex items-center justify-center gap-2 active:scale-95">
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          {isEn ? 'Back' : 'वापस'}
        </button>
        <button type="submit"
          className="flex-1 sm:flex-none sm:px-8 py-3 bg-primary text-on-primary rounded-xl font-label-md text-sm font-bold hover:bg-primary-container hover:text-on-primary-container transition-all flex items-center justify-center gap-2 shadow-md active:scale-95">
          {isEn ? 'Continue →' : 'आगे बढ़ें →'}
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </button>
      </div>
    </form>
  );
}
