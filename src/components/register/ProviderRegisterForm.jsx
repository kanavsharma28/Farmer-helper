import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

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

const RESOURCE_TYPES = [
  { id: 'tractor', en: 'Tractor', hi: 'ट्रैक्टर', icon: 'agriculture' },
  { id: 'spray', en: 'Spray Machine', hi: 'स्प्रे मशीन', icon: 'water_drop' },
  { id: 'labour', en: 'Labour', hi: 'मजदूर', icon: 'group' },
  { id: 'seeds', en: 'Seeds', hi: 'बीज', icon: 'grass' },
  { id: 'fertilizer', en: 'Fertilizer', hi: 'खाद / उर्वरक', icon: 'science' },
  { id: 'harvester', en: 'Harvester', hi: 'हार्वेस्टर', icon: 'settings' },
  { id: 'storage', en: 'Storage', hi: 'भंडारण', icon: 'warehouse' },
  { id: 'other', en: 'Other', hi: 'अन्य', icon: 'more_horiz' },
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

export default function ProviderRegisterForm({ lang = 'en' }) {
  const isEn = lang === 'en';
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: '', mobile: '', email: '',
    password: '', confirmPassword: '',
    location: '', resourceTypes: [],
    description: '', availability: '', price: '',
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

  const toggleResource = (id) => {
    setForm((prev) => {
      const exists = prev.resourceTypes.includes(id);
      return {
        ...prev,
        resourceTypes: exists
          ? prev.resourceTypes.filter((r) => r !== id)
          : [...prev.resourceTypes, id],
      };
    });
    setErrors((prev) => ({ ...prev, resourceTypes: undefined }));
  };

  const strength = getPasswordStrength(form.password);

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = 'Please enter your full name or business name.';
    if (!form.mobile.trim()) e.mobile = 'Please enter your mobile number.';
    else if (form.mobile.replace(/\D/g, '').length < 10) e.mobile = 'Enter a valid 10-digit mobile number.';
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Please enter a valid email address.';
    if (!form.password) e.password = 'Please enter a password.';
    else if (form.password.length < 8) e.password = 'Password must be at least 8 characters.';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match.';
    if (!form.location.trim()) e.location = 'Please enter your location.';
    if (form.resourceTypes.length === 0) e.resourceTypes = 'Please select at least one resource type.';
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
      register(form, 'provider');
      setIsLoading(false);
      setIsSuccess(true);
      setTimeout(() => navigate('/dashboard'), 1400);
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
        <h3 className="font-display text-2xl font-bold text-primary">Provider Profile Created!</h3>
        <p className="text-sm text-on-surface-variant">Redirecting to your provider dashboard…</p>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-on-surface mb-1.5" htmlFor="p-fullName">
                {isEn ? 'Full Name / Business Name' : 'पूरा नाम / व्यापार नाम'} <span className="text-error">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-lg">person</span>
                <input id="p-fullName" type="text" value={form.fullName} onChange={set('fullName')}
                  placeholder={isEn ? 'Suresh Tractor Works' : 'सुरेश ट्रैक्टर सेवाएं'}
                  className={inputCls(errors.fullName) + ' pl-10'} />
              </div>
              {errors.fullName && <p className="text-xs text-error mt-1">{errors.fullName}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-on-surface mb-1.5" htmlFor="p-mobile">
                {isEn ? 'Mobile Number' : 'मोबाइल नंबर'} <span className="text-error">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-lg">call</span>
                <input id="p-mobile" type="tel" value={form.mobile} onChange={set('mobile')}
                  placeholder="+91 98765 43210"
                  className={inputCls(errors.mobile) + ' pl-10'} />
              </div>
              {errors.mobile && <p className="text-xs text-error mt-1">{errors.mobile}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-on-surface mb-1.5" htmlFor="p-email">
              {isEn ? 'Email Address' : 'ईमेल पता'}{' '}
              <span className="text-on-surface-variant font-normal text-xs">({isEn ? 'Optional' : 'वैकल्पिक'})</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-lg">mail</span>
              <input id="p-email" type="email" value={form.email} onChange={set('email')}
                placeholder="suresh@tractors.com"
                className={inputCls(errors.email) + ' pl-10'} />
            </div>
            {errors.email && <p className="text-xs text-error mt-1">{errors.email}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-on-surface mb-1.5" htmlFor="p-password">
                {isEn ? 'Password' : 'पासवर्ड'} <span className="text-error">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-lg">lock</span>
                <input id="p-password" type={showPassword ? 'text' : 'password'}
                  value={form.password} onChange={set('password')}
                  placeholder="••••••••"
                  className={inputCls(errors.password) + ' pl-10 pr-10'} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors">
                  <span className="material-symbols-outlined text-lg">{showPassword ? 'visibility' : 'visibility_off'}</span>
                </button>
              </div>
              {form.password && strength && (
                <div className="mt-2 space-y-1">
                  <div className="h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-500 ${strength.color} ${strength.width}`} />
                  </div>
                  <p className={`text-[11px] font-medium ${strength.textColor}`}>{isEn ? strength.label : strength.labelHi}</p>
                </div>
              )}
              {errors.password && <p className="text-xs text-error mt-1">{errors.password}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-on-surface mb-1.5" htmlFor="p-confirm">
                {isEn ? 'Confirm Password' : 'पासवर्ड पुष्टि'} <span className="text-error">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-lg">lock_reset</span>
                <input id="p-confirm" type={showConfirm ? 'text' : 'password'}
                  value={form.confirmPassword} onChange={set('confirmPassword')}
                  placeholder="••••••••"
                  className={inputCls(errors.confirmPassword) + ' pl-10 pr-10'} />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors">
                  <span className="material-symbols-outlined text-lg">{showConfirm ? 'visibility' : 'visibility_off'}</span>
                </button>
              </div>
              {errors.confirmPassword && <p className="text-xs text-error mt-1">{errors.confirmPassword}</p>}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-outline-variant/40" />

      {/* ── Section 2: Resource Information ── */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center flex-shrink-0">2</div>
          <h3 className="font-semibold text-sm text-on-surface uppercase tracking-wide">
            {isEn ? 'Resource Information' : 'संसाधन जानकारी'}
          </h3>
        </div>

        <div className="space-y-4">
          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-on-surface mb-1.5" htmlFor="p-location">
              {isEn ? 'Location' : 'स्थान'} <span className="text-error">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-lg">location_on</span>
              <input id="p-location" type="text" value={form.location} onChange={set('location')}
                placeholder={isEn ? 'Village / City, State' : 'गांव / शहर, राज्य'}
                className={inputCls(errors.location) + ' pl-10'} />
            </div>
            {errors.location && <p className="text-xs text-error mt-1">{errors.location}</p>}
          </div>

          {/* Resource Types */}
          <div>
            <label className="block text-sm font-medium text-on-surface mb-2">
              {isEn ? 'Resource Type' : 'संसाधन प्रकार'} <span className="text-error">*</span>
              <span className="text-on-surface-variant font-normal text-xs ml-1">({isEn ? 'Select all that apply' : 'सभी लागू चुनें'})</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {RESOURCE_TYPES.map((r) => {
                const isSel = form.resourceTypes.includes(r.id);
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => toggleResource(r.id)}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 text-xs font-semibold transition-all ${
                      isSel
                        ? 'border-primary bg-primary/8 text-primary'
                        : 'border-outline-variant/60 bg-surface text-on-surface-variant hover:border-primary/40 hover:text-primary'
                    }`}
                  >
                    <span
                      className="material-symbols-outlined text-xl"
                      style={{ fontVariationSettings: isSel ? "'FILL' 1" : "'FILL' 0" }}
                    >{r.icon}</span>
                    {isEn ? r.en : r.hi}
                  </button>
                );
              })}
            </div>
            {errors.resourceTypes && <p className="text-xs text-error mt-1.5">{errors.resourceTypes}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-on-surface mb-1.5" htmlFor="p-desc">
              {isEn ? 'Resource Description' : 'संसाधन विवरण'}
            </label>
            <textarea
              id="p-desc"
              rows={3}
              value={form.description}
              onChange={set('description')}
              placeholder={isEn ? 'Describe your resources, condition, and service area…' : 'अपने संसाधनों, स्थिति और सेवा क्षेत्र का विवरण दें…'}
              className="w-full px-4 py-3 rounded-xl border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 bg-surface text-on-surface text-sm focus:outline-none transition-all resize-none placeholder:text-on-surface-variant/50"
            />
          </div>

          {/* Availability + Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-on-surface mb-1.5" htmlFor="p-availability">
                {isEn ? 'Availability' : 'उपलब्धता'}
              </label>
              <div className="relative">
                <select id="p-availability" value={form.availability} onChange={set('availability')} className={selectCls(false)}>
                  <option value="" disabled>{isEn ? 'Select Availability' : 'उपलब्धता चुनें'}</option>
                  <option value="daily">{isEn ? 'Daily' : 'प्रतिदिन'}</option>
                  <option value="weekly">{isEn ? 'Weekly' : 'साप्ताहिक'}</option>
                  <option value="seasonal">{isEn ? 'Seasonal' : 'मौसमी'}</option>
                  <option value="ondemand">{isEn ? 'On Demand' : 'मांग पर'}</option>
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-lg">expand_more</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-on-surface mb-1.5" htmlFor="p-price">
                {isEn ? 'Price / Rate' : 'मूल्य / दर'}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm font-bold">₹</span>
                <input id="p-price" type="text" value={form.price} onChange={set('price')}
                  placeholder={isEn ? 'e.g. 500/hour or 2000/day' : 'जैसे ₹500/घंटा या ₹2000/दिन'}
                  className={inputCls(false) + ' pl-8'} />
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
            <span>{isEn ? 'Creating Profile…' : 'प्रोफाइल बनाई जा रही है…'}</span>
          </>
        ) : (
          <>
            <span>{isEn ? 'Create Provider Profile' : 'प्रदाता प्रोफाइल बनाएं'}</span>
            <span className="material-symbols-outlined text-xl">arrow_forward</span>
          </>
        )}
      </button>
    </form>
  );
}
