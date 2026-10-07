import React, { useState } from 'react';
import { cropOptions, areaUnits } from '../../data/cropLossData';

const inputBase = 'w-full px-4 py-3 bg-surface-container-low border rounded-xl font-body-md text-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all border-outline-variant/60';

function FieldError({ msg }) {
  if (!msg) return null;
  return (
    <p className="mt-1 text-xs text-error font-label-md flex items-center gap-1">
      <span className="material-symbols-outlined text-[14px]">error</span>
      {msg}
    </p>
  );
}

export default function CropDetailsForm({ lang, data, onNext, onBack }) {
  const isEn = lang === 'en';
  const [form, setForm] = useState({
    crop: '', variety: '', sowingDate: '', harvestDate: '', area: '', areaUnit: 'acre',
    ...data,
  });
  const [errors, setErrors] = useState({});

  const set = (field, value) => {
    setForm(p => ({ ...p, [field]: value }));
    if (errors[field]) setErrors(p => ({ ...p, [field]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.crop)          e.crop = isEn ? 'Please select a crop' : 'फसल चुनें';
    if (!form.sowingDate)    e.sowingDate = isEn ? 'Sowing date is required' : 'बुवाई की तारीख दर्ज करें';
    if (!form.area)          e.area = isEn ? 'Total crop area is required' : 'कुल फसल क्षेत्र दर्ज करें';
    else if (isNaN(form.area) || Number(form.area) <= 0) e.area = isEn ? 'Enter valid area' : 'सही क्षेत्र दर्ज करें';
    return e;
  };

  const handleNext = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onNext(form);
  };

  return (
    <form onSubmit={handleNext} noValidate className="flex flex-col gap-6">
      <div>
        <span className="text-xs font-label-md font-semibold text-primary uppercase tracking-widest">
          {isEn ? 'Step 2 of 6' : 'चरण 2 / 6'}
        </span>
        <h2 className="font-headline-lg text-xl sm:text-2xl font-bold text-on-surface mt-1">
          {isEn ? 'Crop Information' : 'फसल की जानकारी'}
        </h2>
        <p className="text-xs text-on-surface-variant font-label-md mt-1">
          {isEn ? 'Tell us about the affected crop.' : 'प्रभावित फसल के बारे में जानकारी दें।'}
        </p>
      </div>

      <div className="bg-surface rounded-[24px] p-5 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.06)] flex flex-col gap-5">

        {/* Crop selector cards */}
        <div>
          <label className="block font-label-md text-sm font-semibold text-on-surface mb-3">
            {isEn ? 'Select Crop *' : 'फसल चुनें *'}
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-2">
            {cropOptions.map(c => {
              const active = form.crop === c.value;
              return (
                <button key={c.value} type="button" onClick={() => set('crop', c.value)}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl text-center transition-all gap-1.5 border
                    ${active
                      ? 'bg-primary-container/30 border-primary text-primary shadow-sm'
                      : 'bg-surface-container-low border-outline-variant/40 text-on-surface-variant hover:border-primary/40 hover:text-on-surface'}`}
                  aria-pressed={active}>
                  <span className={`material-symbols-outlined text-[22px] ${active ? 'text-primary material-fill' : ''}`}>{c.icon}</span>
                  <span className="text-[11px] font-label-md font-semibold leading-tight">{isEn ? c.en : c.hi}</span>
                </button>
              );
            })}
          </div>
          <FieldError msg={errors.crop} />
        </div>

        {/* Variety */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block font-label-md text-sm font-semibold text-on-surface mb-1.5" htmlFor="variety">
              {isEn ? 'Crop Variety' : 'फसल की किस्म'}
              <span className="ml-1 font-normal text-on-surface-variant">{isEn ? '(optional)' : '(वैकल्पिक)'}</span>
            </label>
            <input id="variety" type="text" value={form.variety} onChange={e => set('variety', e.target.value)}
              placeholder={isEn ? 'e.g. PBW-502, HD-2967' : 'जैसे PBW-502, HD-2967'}
              className={inputBase} />
          </div>

          {/* Area with unit toggle */}
          <div>
            <label className="block font-label-md text-sm font-semibold text-on-surface mb-1.5">
              {isEn ? 'Total Crop Area *' : 'कुल फसल क्षेत्र *'}
            </label>
            <div className="flex gap-2">
              <input type="number" min="0.01" step="0.01" value={form.area} onChange={e => set('area', e.target.value)}
                placeholder="0.00"
                className={`flex-1 px-4 py-3 bg-surface-container-low border rounded-xl font-body-md text-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all ${errors.area ? 'border-error bg-error/5' : 'border-outline-variant/60'}`} />
              <div className="flex bg-surface-container-low border border-outline-variant/60 rounded-xl overflow-hidden">
                {areaUnits.map(u => (
                  <button key={u.value} type="button" onClick={() => set('areaUnit', u.value)}
                    className={`px-3 py-3 font-label-md text-xs font-semibold transition-all
                      ${form.areaUnit === u.value ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:text-on-surface'}`}>
                    {isEn ? u.en : u.hi}
                  </button>
                ))}
              </div>
            </div>
            <FieldError msg={errors.area} />
          </div>
        </div>

        {/* Sowing + Harvest dates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block font-label-md text-sm font-semibold text-on-surface mb-1.5" htmlFor="sowingDate">
              {isEn ? 'Sowing Date *' : 'बुवाई की तारीख *'}
            </label>
            <input id="sowingDate" type="date" value={form.sowingDate} onChange={e => set('sowingDate', e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              className={`${inputBase} ${errors.sowingDate ? 'border-error bg-error/5' : ''}`} />
            <FieldError msg={errors.sowingDate} />
          </div>
          <div>
            <label className="block font-label-md text-sm font-semibold text-on-surface mb-1.5" htmlFor="harvestDate">
              {isEn ? 'Expected Harvest Date' : 'अपेक्षित कटाई की तारीख'}
              <span className="ml-1 font-normal text-on-surface-variant">{isEn ? '(optional)' : '(वैकल्पिक)'}</span>
            </label>
            <input id="harvestDate" type="date" value={form.harvestDate} onChange={e => set('harvestDate', e.target.value)}
              className={inputBase} />
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
