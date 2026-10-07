import React, { useState } from 'react';
import { cropOptions, growthStages, stateOptions } from '../../data/khetDoctorData';

const DISTRICTS = {
  'Uttar Pradesh': ['Meerut', 'Lucknow', 'Agra', 'Varanasi', 'Kanpur', 'Mathura', 'Aligarh'],
  Punjab: ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda'],
  Haryana: ['Rohtak', 'Hisar', 'Karnal', 'Panipat', 'Ambala'],
  'Madhya Pradesh': ['Bhopal', 'Indore', 'Jabalpur', 'Gwalior'],
  Rajasthan: ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Bikaner'],
  Maharashtra: ['Nashik', 'Pune', 'Mumbai', 'Nagpur', 'Aurangabad'],
  default: ['Please select state first'],
};

export default function CropInfoForm({ lang, imageData, onAnalyze, onBack }) {
  const isEn = lang === 'en';

  const [form, setForm] = useState({
    crop: '',
    stage: '',
    state: '',
    district: '',
    duration: '',
  });
  const [errors, setErrors] = useState({});

  const districts = form.state
    ? DISTRICTS[form.state] || DISTRICTS.default
    : DISTRICTS.default;

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
      ...(field === 'state' ? { district: '' } : {}),
    }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.crop)     newErrors.crop  = isEn ? 'Please select a crop' : 'कृपया फसल चुनें';
    if (!form.stage)    newErrors.stage = isEn ? 'Please select growth stage' : 'कृपया अवस्था चुनें';
    if (!form.state)    newErrors.state = isEn ? 'Please select state' : 'कृपया राज्य चुनें';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    onAnalyze?.(form);
  };

  const inputBase = 'w-full px-4 py-3 bg-surface-container-low border rounded-xl font-body-md text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all';
  const inputOk   = 'border-outline-variant/60';
  const inputErr  = 'border-error bg-error/5 focus:ring-error/30 focus:border-error';

  return (
    <div className="flex flex-col gap-8">

      {/* ── Header ── */}
      <div className="flex items-start gap-4">
        <button
          onClick={onBack}
          className="mt-0.5 p-2 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface-variant hover:text-primary transition-colors shrink-0"
          aria-label={isEn ? 'Go back' : 'वापस जाएं'}
        >
          <span className="material-symbols-outlined text-xl">arrow_back</span>
        </button>
        <div>
          <span className="text-xs font-label-md text-primary uppercase tracking-widest font-semibold">
            {isEn ? 'Step 2 of 2' : 'चरण 2 / 2'}
          </span>
          <h1 className="font-headline-lg text-2xl sm:text-3xl font-bold text-on-surface mt-1">
            {isEn ? 'Crop Information' : 'फसल की जानकारी'}
          </h1>
          <p className="font-body-md text-on-surface-variant mt-1 text-sm sm:text-base">
            {isEn
              ? 'Provide crop details for a more accurate diagnosis.'
              : 'सटीक जांच के लिए अपनी फसल की जानकारी दें।'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* ─── LEFT: Image Preview (4 cols) ─── */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="bg-surface rounded-[24px] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.06)] flex flex-col gap-4">
            <h3 className="font-headline-md text-base font-semibold text-on-surface">
              {isEn ? 'Your Selected Image' : 'आपकी चुनी गई फोटो'}
            </h3>
            {imageData?.url ? (
              <div className="relative rounded-2xl overflow-hidden">
                <img
                  src={imageData.url}
                  alt="Crop to diagnose"
                  className="w-full h-52 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent flex items-end p-3">
                  <p className="text-white text-xs font-label-md truncate">{imageData.name}</p>
                </div>
              </div>
            ) : (
              <div className="w-full h-52 rounded-2xl bg-surface-container-low flex items-center justify-center">
                <span className="material-symbols-outlined text-on-surface-variant text-[48px]">image</span>
              </div>
            )}
            <div className="flex items-center gap-2 bg-secondary-container/30 border border-secondary/20 px-3 py-2 rounded-xl">
              <span className="material-symbols-outlined text-secondary text-[18px]">check_circle</span>
              <span className="text-xs font-label-md font-semibold text-on-secondary-container">
                {isEn ? 'Image ready for analysis' : 'फोटो जांच के लिए तैयार है'}
              </span>
            </div>
          </div>

          {/* Tip box */}
          <div className="bg-primary/5 border border-primary/15 rounded-2xl p-4">
            <div className="flex items-start gap-2">
              <span className="material-symbols-outlined text-primary text-[20px] mt-0.5 shrink-0">info</span>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                {isEn
                  ? 'Providing accurate crop and location details significantly improves diagnosis accuracy.'
                  : 'सटीक फसल और स्थान की जानकारी देने से जांच की सटीकता बढ़ती है।'}
              </p>
            </div>
          </div>
        </div>

        {/* ─── RIGHT: Form (8 cols) ─── */}
        <div className="lg:col-span-8">
          <form
            onSubmit={handleSubmit}
            className="bg-surface rounded-[24px] p-6 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.06)] flex flex-col gap-5"
            noValidate
          >

            {/* Crop + Stage row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Crop */}
              <div>
                <label htmlFor="crop-select" className="block font-label-md text-sm font-semibold text-on-surface mb-1.5">
                  {isEn ? 'Crop *' : 'फसल *'}
                </label>
                <div className="relative">
                  <select
                    id="crop-select"
                    value={form.crop}
                    onChange={(e) => handleChange('crop', e.target.value)}
                    className={`${inputBase} ${errors.crop ? inputErr : inputOk} appearance-none pr-10`}
                    aria-invalid={!!errors.crop}
                    aria-describedby={errors.crop ? 'crop-error' : undefined}
                  >
                    <option value="">{isEn ? '— Select Crop —' : '— फसल चुनें —'}</option>
                    {cropOptions.map((c) => (
                      <option key={c.value} value={c.value}>
                        {isEn ? c.labelEn : c.labelHi}
                      </option>
                    ))}
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px] pointer-events-none">
                    expand_more
                  </span>
                </div>
                {errors.crop && (
                  <p id="crop-error" className="mt-1 text-xs text-error font-label-md flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">error</span>
                    {errors.crop}
                  </p>
                )}
              </div>

              {/* Growth Stage */}
              <div>
                <label htmlFor="stage-select" className="block font-label-md text-sm font-semibold text-on-surface mb-1.5">
                  {isEn ? 'Growth Stage *' : 'फसल अवस्था *'}
                </label>
                <div className="relative">
                  <select
                    id="stage-select"
                    value={form.stage}
                    onChange={(e) => handleChange('stage', e.target.value)}
                    className={`${inputBase} ${errors.stage ? inputErr : inputOk} appearance-none pr-10`}
                    aria-invalid={!!errors.stage}
                    aria-describedby={errors.stage ? 'stage-error' : undefined}
                  >
                    <option value="">{isEn ? '— Select Stage —' : '— अवस्था चुनें —'}</option>
                    {growthStages.map((s) => (
                      <option key={s.value} value={s.value}>
                        {isEn ? s.labelEn : s.labelHi}
                      </option>
                    ))}
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px] pointer-events-none">
                    expand_more
                  </span>
                </div>
                {errors.stage && (
                  <p id="stage-error" className="mt-1 text-xs text-error font-label-md flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">error</span>
                    {errors.stage}
                  </p>
                )}
              </div>
            </div>

            {/* State + District row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* State */}
              <div>
                <label htmlFor="state-select" className="block font-label-md text-sm font-semibold text-on-surface mb-1.5">
                  {isEn ? 'State *' : 'राज्य *'}
                </label>
                <div className="relative">
                  <select
                    id="state-select"
                    value={form.state}
                    onChange={(e) => handleChange('state', e.target.value)}
                    className={`${inputBase} ${errors.state ? inputErr : inputOk} appearance-none pr-10`}
                    aria-invalid={!!errors.state}
                    aria-describedby={errors.state ? 'state-error' : undefined}
                  >
                    <option value="">{isEn ? '— Select State —' : '— राज्य चुनें —'}</option>
                    {stateOptions.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px] pointer-events-none">
                    expand_more
                  </span>
                </div>
                {errors.state && (
                  <p id="state-error" className="mt-1 text-xs text-error font-label-md flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">error</span>
                    {errors.state}
                  </p>
                )}
              </div>

              {/* District */}
              <div>
                <label htmlFor="district-select" className="block font-label-md text-sm font-semibold text-on-surface mb-1.5">
                  {isEn ? 'District' : 'जिला'}
                  <span className="text-on-surface-variant font-normal ml-1">{isEn ? '(optional)' : '(वैकल्पिक)'}</span>
                </label>
                <div className="relative">
                  <select
                    id="district-select"
                    value={form.district}
                    onChange={(e) => handleChange('district', e.target.value)}
                    className={`${inputBase} ${inputOk} appearance-none pr-10`}
                    disabled={!form.state}
                  >
                    <option value="">{isEn ? '— Select District —' : '— जिला चुनें —'}</option>
                    {districts.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px] pointer-events-none">
                    expand_more
                  </span>
                </div>
              </div>
            </div>

            {/* Problem Duration */}
            <div>
              <label htmlFor="duration-input" className="block font-label-md text-sm font-semibold text-on-surface mb-1.5">
                {isEn ? 'Since when is the problem visible?' : 'समस्या कितने दिनों से है?'}
                <span className="text-on-surface-variant font-normal ml-1">{isEn ? '(optional)' : '(वैकल्पिक)'}</span>
              </label>
              <input
                id="duration-input"
                type="text"
                value={form.duration}
                onChange={(e) => handleChange('duration', e.target.value)}
                placeholder={isEn ? 'e.g. 3 days, 1 week...' : 'जैसे 3 दिन, 1 हफ्ता...'}
                className={`${inputBase} ${inputOk}`}
              />
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                id="analyze-btn"
                className="w-full py-4 bg-primary text-on-primary rounded-xl font-label-md text-base font-bold flex items-center justify-center gap-2 shadow-md hover:bg-primary-container hover:text-on-primary-container transition-all active:scale-[0.99]"
              >
                <span className="material-symbols-outlined material-fill">search</span>
                {isEn ? '🔍 Diagnose My Crop' : '🔍 बीमारी की जांच करें'}
              </button>
              <p className="text-center text-xs text-on-surface-variant mt-3 font-label-md">
                {isEn
                  ? '⚠️ This is an informational tool. Always consult a certified agriculture expert for final treatment decisions.'
                  : '⚠️ यह एक सूचनात्मक उपकरण है। अंतिम उपचार के लिए हमेशा कृषि विशेषज्ञ से परामर्श लें।'}
              </p>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
