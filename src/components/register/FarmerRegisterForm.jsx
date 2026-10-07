import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/* ─── Shared Helpers ─── */
const getPasswordStrength = (pw) => {
  if (!pw) return null;
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 1) return { label: 'Weak', labelHi: 'कमज़ोर', color: 'bg-error', width: 'w-1/3', textColor: 'text-error' };
  if (score <= 2) return { label: 'Medium', labelHi: 'मध्यम', color: 'bg-tertiary-fixed-dim', width: 'w-2/3', textColor: 'text-tertiary' };
  return { label: 'Strong', labelHi: 'मज़बूत', color: 'bg-secondary', width: 'w-full', textColor: 'text-secondary' };
};

const INDIAN_STATES = [
  'Andhra Pradesh', 'Bihar', 'Gujarat', 'Haryana', 'Himachal Pradesh',
  'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra',
  'Odisha', 'Punjab', 'Rajasthan', 'Tamil Nadu', 'Telangana',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Other',
];

const CROPS = [
  'Wheat (गेहूं)', 'Rice (धान)', 'Corn (मक्का)', 'Soybean (सोयाबीन)',
  'Sugarcane (गन्ना)', 'Cotton (कपास)', 'Vegetables (सब्जियां)',
  'Fruits (फल)', 'Pulses (दाल)', 'Other',
];

const inputCls = (hasError) =>
  `w-full h-12 px-4 rounded-xl border ${
    hasError
      ? 'border-error focus:ring-error/30 focus:border-error'
      : 'border-outline-variant focus:border-primary focus:ring-primary/20'
  } focus:ring-2 bg-surface text-on-surface text-sm focus:outline-none transition-all placeholder:text-on-surface-variant/50`;

const selectCls = (hasError) =>
  `w-full h-12 px-4 rounded-xl border appearance-none ${
    hasError
      ? 'border-error focus:ring-error/30 focus:border-error'
      : 'border-outline-variant focus:border-primary focus:ring-primary/20'
  } focus:ring-2 bg-surface text-on-surface text-sm focus:outline-none transition-all`;

export default function FarmerRegisterForm({ lang = 'en' }) {
  const isEn = lang === 'en';
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: '', mobile: '', email: '',
    password: '', confirmPassword: '',
    state: '', district: '', village: '',
    landSize: '', landUnit: 'acre',
    primaryCrop: '', irrigationType: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const set = useCallback((field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }, []);

  const strength = getPasswordStrength(form.password);

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = isEn ? 'Please enter your full name.' : 'कृपया पूरा नाम दर्ज करें।';
    if (!form.mobile.trim()) e.mobile = isEn ? 'Please enter your mobile number.' : 'मोबाइल नंबर दर्ज करें।';
    else if (form.mobile.replace(/\D/g, '').length < 10) e.mobile = isEn ? 'Enter a valid 10-digit mobile number.' : 'वैध 10-अंकीय नंबर दर्ज करें।';
    if (!form.password) e.password = isEn ? 'Please enter a password.' : 'पासवर्ड दर्ज करें।';
    else if (form.password.length < 8) e.password = isEn ? 'Password must be at least 8 characters.' : 'पासवर्ड कम से कम 8 अक्षरों का होना चाहिए।';
    if (form.password !== form.confirmPassword) e.confirmPassword = isEn ? 'Passwords do not match.' : 'पासवर्ड मेल नहीं खाते।';
    if (!form.state) e.state = isEn ? 'Please select your state.' : 'राज्य चुनें।';
    return e;
  };

  const { register } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setIsLoading(true);
    setTimeout(() => {
      register(form, 'farmer');
      setIsLoading(false);
      setIsSuccess(true);
      setTimeout(() => navigate('/onboarding/farm'), 1400);
    }, 1300);
  };

  if (isSuccess) {
    return (
      <div className="py-12 text-center space-y-4">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
          <span className="material-symbols-outlined text-primary text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>
            check_circle
          </span>
        </div>
        <h3 className="font-display text-2xl font-bold text-primary">
          {isEn ? 'Account Created Successfully!' : 'खाता सफलतापूर्वक बनाया गया!'}
        </h3>
        <p className="text-sm text-on-surface-variant">
          {isEn ? 'Redirecting to your farm setup…' : 'खेत सेटअप पर भेजा जा रहा है…'}
        </p>
        <div className="flex justify-center">
          <span className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin block" />
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">

      {/* ── Section 1: Account Information ── */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center flex-shrink-0">1</div>
          <h3 className="font-semibold text-sm text-on-surface uppercase tracking-wide">
            {isEn ? 'Account Information' : 'खाता जानकारी'}
          </h3>
        </div>

        <div className="space-y-4">
          {/* Full Name + Mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-on-surface mb-1.5" htmlFor="f-fullName">
                {isEn ? 'Full Name' : 'पूरा नाम'} <span className="text-error">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-lg">person</span>
                <input id="f-fullName" type="text" value={form.fullName} onChange={set('fullName')}
                  placeholder={isEn ? 'Ramesh Kumar' : 'रमेश कुमार'}
                  className={inputCls(errors.fullName) + ' pl-10'} />
              </div>
              {errors.fullName && <p className="text-xs text-error mt-1">{errors.fullName}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-on-surface mb-1.5" htmlFor="f-mobile">
                {isEn ? 'Mobile Number' : 'मोबाइल नंबर'} <span className="text-error">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-lg">call</span>
                <input id="f-mobile" type="tel" value={form.mobile} onChange={set('mobile')}
                  placeholder="+91 98765 43210"
                  className={inputCls(errors.mobile) + ' pl-10'} />
              </div>
              {errors.mobile && <p className="text-xs text-error mt-1">{errors.mobile}</p>}
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-on-surface mb-1.5" htmlFor="f-email">
              {isEn ? 'Email Address' : 'ईमेल पता'}{' '}
              <span className="text-on-surface-variant font-normal text-xs">({isEn ? 'Optional' : 'वैकल्पिक'})</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-lg">mail</span>
              <input id="f-email" type="email" value={form.email} onChange={set('email')}
                placeholder="ramesh@example.com"
                className={inputCls(false) + ' pl-10'} />
            </div>
          </div>

          {/* Password + Confirm */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-on-surface mb-1.5" htmlFor="f-password">
                {isEn ? 'Password' : 'पासवर्ड'} <span className="text-error">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-lg">lock</span>
                <input id="f-password" type={showPassword ? 'text' : 'password'}
                  value={form.password} onChange={set('password')}
                  placeholder="••••••••"
                  className={inputCls(errors.password) + ' pl-10 pr-10'} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors" aria-label="Toggle password">
                  <span className="material-symbols-outlined text-lg">{showPassword ? 'visibility' : 'visibility_off'}</span>
                </button>
              </div>
              {/* Strength indicator */}
              {form.password && strength && (
                <div className="mt-2 space-y-1">
                  <div className="h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-500 ${strength.color} ${strength.width}`} />
                  </div>
                  <p className={`text-[11px] font-medium ${strength.textColor}`}>
                    {isEn ? strength.label : strength.labelHi}
                  </p>
                </div>
              )}
              {errors.password && <p className="text-xs text-error mt-1">{errors.password}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-on-surface mb-1.5" htmlFor="f-confirm">
                {isEn ? 'Confirm Password' : 'पासवर्ड पुष्टि'} <span className="text-error">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-lg">lock_reset</span>
                <input id="f-confirm" type={showConfirm ? 'text' : 'password'}
                  value={form.confirmPassword} onChange={set('confirmPassword')}
                  placeholder="••••••••"
                  className={inputCls(errors.confirmPassword) + ' pl-10 pr-10'} />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors" aria-label="Toggle confirm password">
                  <span className="material-symbols-outlined text-lg">{showConfirm ? 'visibility' : 'visibility_off'}</span>
                </button>
              </div>
              {errors.confirmPassword && <p className="text-xs text-error mt-1">{errors.confirmPassword}</p>}
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-outline-variant/40" />

      {/* ── Section 2: Farm Information ── */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center flex-shrink-0">2</div>
          <h3 className="font-semibold text-sm text-on-surface uppercase tracking-wide">
            {isEn ? 'Farm Information' : 'खेत की जानकारी'}
          </h3>
        </div>

        <div className="space-y-4">
          {/* State + District */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-on-surface mb-1.5" htmlFor="f-state">
                {isEn ? 'State' : 'राज्य'} <span className="text-error">*</span>
              </label>
              <div className="relative">
                <select id="f-state" value={form.state} onChange={set('state')} className={selectCls(errors.state)}>
                  <option value="" disabled>{isEn ? 'Select State' : 'राज्य चुनें'}</option>
                  {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-lg">expand_more</span>
              </div>
              {errors.state && <p className="text-xs text-error mt-1">{errors.state}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-on-surface mb-1.5" htmlFor="f-district">
                {isEn ? 'District' : 'जिला'}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-lg">location_city</span>
                <input id="f-district" type="text" value={form.district} onChange={set('district')}
                  placeholder={isEn ? 'e.g. Meerut' : 'जैसे मेरठ'}
                  className={inputCls(false) + ' pl-10'} />
              </div>
            </div>
          </div>

          {/* Village + Land Size */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-on-surface mb-1.5" htmlFor="f-village">
                {isEn ? 'Village / Town' : 'गांव / कस्बा'}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-lg">location_on</span>
                <input id="f-village" type="text" value={form.village} onChange={set('village')}
                  placeholder={isEn ? 'Village name' : 'गांव का नाम'}
                  className={inputCls(false) + ' pl-10'} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-on-surface mb-1.5" htmlFor="f-landSize">
                {isEn ? 'Land Size' : 'भूमि का आकार'}
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-lg">crop_square</span>
                  <input id="f-landSize" type="number" min="0" value={form.landSize} onChange={set('landSize')}
                    placeholder="0.0"
                    className={inputCls(false) + ' pl-10'} />
                </div>
                <div className="relative w-28">
                  <select value={form.landUnit} onChange={set('landUnit')}
                    className="w-full h-12 px-3 rounded-xl border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 bg-surface text-on-surface text-sm focus:outline-none appearance-none">
                    <option value="acre">{isEn ? 'Acre' : 'एकड़'}</option>
                    <option value="hectare">{isEn ? 'Hectare' : 'हेक्टेयर'}</option>
                    <option value="bigha">{isEn ? 'Bigha' : 'बीघा'}</option>
                  </select>
                  <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-base">expand_more</span>
                </div>
              </div>
            </div>
          </div>

          {/* Primary Crop + Irrigation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-on-surface mb-1.5" htmlFor="f-crop">
                {isEn ? 'Primary Crop' : 'मुख्य फसल'}
              </label>
              <div className="relative">
                <select id="f-crop" value={form.primaryCrop} onChange={set('primaryCrop')} className={selectCls(false)}>
                  <option value="" disabled>{isEn ? 'Select Crop' : 'फसल चुनें'}</option>
                  {CROPS.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-lg">expand_more</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-on-surface mb-1.5" htmlFor="f-irrigation">
                {isEn ? 'Irrigation Type' : 'सिंचाई प्रकार'}
              </label>
              <div className="relative">
                <select id="f-irrigation" value={form.irrigationType} onChange={set('irrigationType')} className={selectCls(false)}>
                  <option value="" disabled>{isEn ? 'Select Type' : 'प्रकार चुनें'}</option>
                  <option value="rainfed">{isEn ? 'Rainfed (वर्षा पर निर्भर)' : 'वर्षा पर निर्भर'}</option>
                  <option value="tubewell">{isEn ? 'Tube Well (नलकूप)' : 'नलकूप'}</option>
                  <option value="canal">{isEn ? 'Canal (नहर)' : 'नहर'}</option>
                  <option value="drip">{isEn ? 'Drip Irrigation (टपक सिंचाई)' : 'टपक सिंचाई'}</option>
                  <option value="other">{isEn ? 'Other' : 'अन्य'}</option>
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-lg">expand_more</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full h-14 bg-primary text-white font-bold text-base rounded-2xl hover:bg-primary-container hover:text-on-primary-container transition-all shadow-sm flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <span className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin" />
            <span>{isEn ? 'Creating Account…' : 'खाता बनाया जा रहा है…'}</span>
          </>
        ) : (
          <>
            <span>{isEn ? 'Create Farmer Account' : 'किसान खाता बनाएं'}</span>
            <span className="material-symbols-outlined text-xl">arrow_forward</span>
          </>
        )}
      </button>
    </form>
  );
}
