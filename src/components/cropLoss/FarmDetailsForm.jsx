import React, { useState } from 'react';
import { stateOptions, districtMap, ownershipTypes } from '../../data/cropLossData';

const inputBase = 'w-full px-4 py-3 bg-surface-container-low border rounded-xl font-body-md text-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all';
const inputOk   = 'border-outline-variant/60';
const inputErr  = 'border-error bg-error/5 focus:ring-error/30 focus:border-error';

function FieldError({ msg }) {
  if (!msg) return null;
  return (
    <p className="mt-1 text-xs text-error font-label-md flex items-center gap-1">
      <span className="material-symbols-outlined text-[14px]">error</span>
      {msg}
    </p>
  );
}

export default function FarmDetailsForm({ lang, data, onNext, onCancel }) {
  const isEn = lang === 'en';
  const [form, setForm] = useState({
    farmerName:   data?.farmerName   || '',
    mobile:       data?.mobile       || '',
    state:        data?.state        || '',
    district:     data?.district     || '',
    village:      data?.village      || '',
    address:      data?.address      || '',
    khasraNo:     data?.khasraNo     || '',
    ownership:    data?.ownership    || '',
    ...data,
  });
  const [errors, setErrors] = useState({});

  const districts = form.state ? (districtMap[form.state] || districtMap.default) : districtMap.default;

  const set = (field, value) => {
    setForm(p => ({ ...p, [field]: value, ...(field === 'state' ? { district: '' } : {}) }));
    if (errors[field]) setErrors(p => ({ ...p, [field]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.farmerName.trim()) e.farmerName = isEn ? 'Farmer name is required' : 'किसान का नाम दर्ज करें';
    if (!form.mobile.trim())     e.mobile     = isEn ? 'Mobile number is required' : 'मोबाइल नंबर दर्ज करें';
    else if (!/^\d{10}$/.test(form.mobile.trim())) e.mobile = isEn ? 'Enter valid 10-digit mobile' : 'सही 10 अंक का नंबर दर्ज करें';
    if (!form.state)             e.state      = isEn ? 'Please select state' : 'राज्य चुनें';
    if (!form.village.trim())    e.village    = isEn ? 'Village / town is required' : 'गाँव / शहर का नाम दर्ज करें';
    return e;
  };

  const handleNext = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    onNext(form);
  };

  return (
    <form onSubmit={handleNext} noValidate className="flex flex-col gap-6">

      {/* ── Section heading ── */}
      <div>
        <span className="text-xs font-label-md font-semibold text-primary uppercase tracking-widest">
          {isEn ? 'Step 1 of 6' : 'चरण 1 / 6'}
        </span>
        <h2 className="font-headline-lg text-xl sm:text-2xl font-bold text-on-surface mt-1">
          {isEn ? 'Your Farm Information' : 'अपने खेत की जानकारी दें'}
        </h2>
        <p className="text-xs text-on-surface-variant font-label-md mt-1">
          {isEn
            ? 'This information will be included in your Crop Loss Report.'
            : 'यह जानकारी आपकी Crop Loss Report में शामिल की जाएगी।'}
        </p>
      </div>

      {/* ── Form card ── */}
      <div className="bg-surface rounded-[24px] p-5 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.06)] flex flex-col gap-5">

        {/* Row 1: Name + Mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block font-label-md text-sm font-semibold text-on-surface mb-1.5" htmlFor="farmerName">
              {isEn ? 'Farmer Name *' : 'किसान का नाम *'}
            </label>
            <input id="farmerName" type="text" value={form.farmerName} onChange={e => set('farmerName', e.target.value)}
              placeholder={isEn ? 'e.g. Rajesh Kumar' : 'जैसे राजेश कुमार'}
              className={`${inputBase} ${errors.farmerName ? inputErr : inputOk}`} />
            <FieldError msg={errors.farmerName} />
          </div>
          <div>
            <label className="block font-label-md text-sm font-semibold text-on-surface mb-1.5" htmlFor="mobile">
              {isEn ? 'Mobile Number *' : 'मोबाइल नंबर *'}
            </label>
            <input id="mobile" type="tel" maxLength={10} value={form.mobile} onChange={e => set('mobile', e.target.value.replace(/\D/g, ''))}
              placeholder="10-digit number"
              className={`${inputBase} ${errors.mobile ? inputErr : inputOk}`} />
            <FieldError msg={errors.mobile} />
          </div>
        </div>

        {/* Row 2: State + District */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block font-label-md text-sm font-semibold text-on-surface mb-1.5" htmlFor="state">
              {isEn ? 'State *' : 'राज्य *'}
            </label>
            <div className="relative">
              <select id="state" value={form.state} onChange={e => set('state', e.target.value)}
                className={`${inputBase} ${errors.state ? inputErr : inputOk} appearance-none pr-10`}>
                <option value="">{isEn ? '— Select State —' : '— राज्य चुनें —'}</option>
                {stateOptions.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px] pointer-events-none">expand_more</span>
            </div>
            <FieldError msg={errors.state} />
          </div>
          <div>
            <label className="block font-label-md text-sm font-semibold text-on-surface mb-1.5" htmlFor="district">
              {isEn ? 'District' : 'जिला'}
              <span className="ml-1 font-normal text-on-surface-variant">{isEn ? '(optional)' : '(वैकल्पिक)'}</span>
            </label>
            <div className="relative">
              <select id="district" value={form.district} onChange={e => set('district', e.target.value)} disabled={!form.state}
                className={`${inputBase} ${inputOk} appearance-none pr-10 disabled:opacity-50`}>
                <option value="">{isEn ? '— Select District —' : '— जिला चुनें —'}</option>
                {districts.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px] pointer-events-none">expand_more</span>
            </div>
          </div>
        </div>

        {/* Row 3: Village + Address */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block font-label-md text-sm font-semibold text-on-surface mb-1.5" htmlFor="village">
              {isEn ? 'Village / Town *' : 'गाँव / शहर *'}
            </label>
            <input id="village" type="text" value={form.village} onChange={e => set('village', e.target.value)}
              placeholder={isEn ? 'e.g. Kharkhauda' : 'जैसे खरखौदा'}
              className={`${inputBase} ${errors.village ? inputErr : inputOk}`} />
            <FieldError msg={errors.village} />
          </div>
          <div>
            <label className="block font-label-md text-sm font-semibold text-on-surface mb-1.5" htmlFor="address">
              {isEn ? 'Farm Address' : 'खेत का पता'}
              <span className="ml-1 font-normal text-on-surface-variant">{isEn ? '(optional)' : '(वैकल्पिक)'}</span>
            </label>
            <input id="address" type="text" value={form.address} onChange={e => set('address', e.target.value)}
              placeholder={isEn ? 'Nearby landmark, road, etc.' : 'नजदीकी पहचान, सड़क आदि'}
              className={`${inputBase} ${inputOk}`} />
          </div>
        </div>

        {/* Row 4: Khasra + Ownership */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block font-label-md text-sm font-semibold text-on-surface mb-1.5" htmlFor="khasraNo">
              {isEn ? 'Survey / Khasra Number' : 'सर्वे / खसरा नंबर'}
              <span className="ml-1 font-normal text-on-surface-variant">{isEn ? '(optional)' : '(वैकल्पिक)'}</span>
            </label>
            <input id="khasraNo" type="text" value={form.khasraNo} onChange={e => set('khasraNo', e.target.value)}
              placeholder={isEn ? 'e.g. 412/9' : 'जैसे 412/9'}
              className={`${inputBase} ${inputOk}`} />
          </div>
          <div>
            <label className="block font-label-md text-sm font-semibold text-on-surface mb-1.5" htmlFor="ownership">
              {isEn ? 'Land Ownership Type' : 'भूमि स्वामित्व'}
              <span className="ml-1 font-normal text-on-surface-variant">{isEn ? '(optional)' : '(वैकल्पिक)'}</span>
            </label>
            <div className="relative">
              <select id="ownership" value={form.ownership} onChange={e => set('ownership', e.target.value)}
                className={`${inputBase} ${inputOk} appearance-none pr-10`}>
                <option value="">{isEn ? '— Select —' : '— चुनें —'}</option>
                {ownershipTypes.map(o => <option key={o.value} value={o.value}>{isEn ? o.en : o.hi}</option>)}
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px] pointer-events-none">expand_more</span>
            </div>
          </div>
        </div>

        {/* Info note */}
        <div className="flex items-start gap-2 bg-primary/5 border border-primary/15 rounded-xl p-3">
          <span className="material-symbols-outlined text-primary text-[18px] mt-0.5 shrink-0">info</span>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            {isEn
              ? 'This information will be included in your official Crop Loss Report for insurance and government relief purposes.'
              : 'यह जानकारी बीमा क्लेम और सरकारी सहायता के लिए आपकी official Crop Loss Report में शामिल की जाएगी।'}
          </p>
        </div>
      </div>

      {/* ── CTAs ── */}
      <div className="flex flex-col-reverse sm:flex-row gap-3 justify-between">
        <button type="button" onClick={onCancel}
          className="px-5 py-3 bg-surface-container text-on-surface rounded-xl font-label-md text-sm font-semibold hover:bg-surface-container-high transition-all flex items-center justify-center gap-2 active:scale-95">
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          {isEn ? 'Cancel' : 'रद्द करें'}
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
