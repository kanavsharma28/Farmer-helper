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

const AVAILABLE_CROPS = [
  { id: 'wheat', en: 'Wheat', hi: 'गेहूं' },
  { id: 'rice', en: 'Rice', hi: 'धान' },
  { id: 'corn', en: 'Corn', hi: 'मक्का' },
  { id: 'soybean', en: 'Soybean', hi: 'सोयाबीन' },
  { id: 'sugarcane', en: 'Sugarcane', hi: 'गन्ना' },
  { id: 'vegetables', en: 'Vegetables', hi: 'सब्जियां' },
  { id: 'fruits', en: 'Fruits', hi: 'फल' },
  { id: 'pulses', en: 'Pulses', hi: 'दालें' },
  { id: 'other', en: 'Other', hi: 'अन्य' },
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

export default function BuyerRegisterForm({ lang = 'en' }) {
  const isEn = lang === 'en';
  const navigate = useNavigate();

  const [form, setForm] = useState({
    businessName: '', contactPerson: '', mobile: '', email: '',
    password: '', confirmPassword: '',
    businessType: '', location: '',
    cropsPurchased: [],
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

  const toggleCrop = (cropId) => {
    setForm((prev) => {
      const exists = prev.cropsPurchased.includes(cropId);
      return {
        ...prev,
        cropsPurchased: exists
          ? prev.cropsPurchased.filter((c) => c !== cropId)
          : [...prev.cropsPurchased, cropId],
      };
    });
    setErrors((prev) => ({ ...prev, cropsPurchased: undefined }));
  };

  const strength = getPasswordStrength(form.password);

  const validate = () => {
    const e = {};
    if (!form.businessName.trim()) e.businessName = 'Please enter business or company name.';
    if (!form.contactPerson.trim()) e.contactPerson = 'Please enter contact person name.';
    if (!form.mobile.trim()) e.mobile = 'Please enter your mobile number.';
    else if (form.mobile.replace(/\D/g, '').length < 10) e.mobile = 'Enter a valid 10-digit mobile number.';
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Please enter a valid email address.';
    if (!form.password) e.password = 'Please enter a password.';
    else if (form.password.length < 8) e.password = 'Password must be at least 8 characters.';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match.';
    if (!form.businessType) e.businessType = 'Please select your business type.';
    if (form.cropsPurchased.length === 0) e.cropsPurchased = 'Please select at least one crop.';
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
      register(form, 'buyer');
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
        <h3 className="font-display text-2xl font-bold text-primary">Buyer Profile Created!</h3>
        <p className="text-sm text-on-surface-variant">Redirecting to your dashboard…</p>
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
          <div>
            <label className="block text-sm font-medium text-on-surface mb-1.5" htmlFor="b-businessName">
              {isEn ? 'Business / Company Name' : 'व्यापार / कंपनी का नाम'} <span className="text-error">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-lg">business</span>
              <input id="b-businessName" type="text" value={form.businessName} onChange={set('businessName')}
                placeholder={isEn ? 'Sharma Grain Traders' : 'शर्मा गल्ला मंडी'}
                className={inputCls(errors.businessName) + ' pl-10'} />
            </div>
            {errors.businessName && <p className="text-xs text-error mt-1">{errors.businessName}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-on-surface mb-1.5" htmlFor="b-contact">
                {isEn ? 'Contact Person' : 'संपर्क व्यक्ति'} <span className="text-error">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-lg">person</span>
                <input id="b-contact" type="text" value={form.contactPerson} onChange={set('contactPerson')}
                  placeholder={isEn ? 'Ramesh Sharma' : 'रमेश शर्मा'}
                  className={inputCls(errors.contactPerson) + ' pl-10'} />
              </div>
              {errors.contactPerson && <p className="text-xs text-error mt-1">{errors.contactPerson}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-on-surface mb-1.5" htmlFor="b-mobile">
                {isEn ? 'Mobile Number' : 'मोबाइल नंबर'} <span className="text-error">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-lg">call</span>
                <input id="b-mobile" type="tel" value={form.mobile} onChange={set('mobile')}
                  placeholder="+91 98765 43210"
                  className={inputCls(errors.mobile) + ' pl-10'} />
              </div>
              {errors.mobile && <p className="text-xs text-error mt-1">{errors.mobile}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-on-surface mb-1.5" htmlFor="b-email">
              {isEn ? 'Email Address' : 'ईमेल पता'}{' '}
              <span className="text-on-surface-variant font-normal text-xs">({isEn ? 'Optional' : 'वैकल्पिक'})</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-lg">mail</span>
              <input id="b-email" type="email" value={form.email} onChange={set('email')}
                placeholder="trade@company.com"
                className={inputCls(errors.email) + ' pl-10'} />
            </div>
            {errors.email && <p className="text-xs text-error mt-1">{errors.email}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-on-surface mb-1.5" htmlFor="b-password">
                {isEn ? 'Password' : 'पासवर्ड'} <span className="text-error">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-lg">lock</span>
                <input id="b-password" type={showPassword ? 'text' : 'password'}
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
              <label className="block text-sm font-medium text-on-surface mb-1.5" htmlFor="b-confirm">
                {isEn ? 'Confirm Password' : 'पासवर्ड पुष्टि'} <span className="text-error">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-lg">lock_reset</span>
                <input id="b-confirm" type={showConfirm ? 'text' : 'password'}
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

      {/* ── Section 2: Business Information ── */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center flex-shrink-0">2</div>
          <h3 className="font-semibold text-sm text-on-surface uppercase tracking-wide">
            {isEn ? 'Business Information' : 'व्यापार जानकारी'}
          </h3>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-on-surface mb-1.5" htmlFor="b-bizType">
                {isEn ? 'Business Type' : 'व्यवसाय का प्रकार'} <span className="text-error">*</span>
              </label>
              <div className="relative">
                <select id="b-bizType" value={form.businessType} onChange={set('businessType')} className={selectCls(errors.businessType)}>
                  <option value="" disabled>{isEn ? 'Select Type' : 'प्रकार चुनें'}</option>
                  <option value="wholesaler">Wholesaler (थोक विक्रेता)</option>
                  <option value="retailer">Retailer (खुदरा विक्रेता)</option>
                  <option value="processor">Processor (प्रसंस्करणकर्ता)</option>
                  <option value="exporter">Exporter (निर्यातक)</option>
                  <option value="graintrader">Grain Trader (गल्ला व्यापारी)</option>
                  <option value="restaurant">Restaurant / Hotel</option>
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-lg">expand_more</span>
              </div>
              {errors.businessType && <p className="text-xs text-error mt-1">{errors.businessType}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-on-surface mb-1.5" htmlFor="b-location">
                {isEn ? 'Location' : 'स्थान / मंडी'}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-lg">location_on</span>
                <input id="b-location" type="text" value={form.location} onChange={set('location')}
                  placeholder={isEn ? 'City, Region' : 'शहर, मंडी'}
                  className={inputCls(false) + ' pl-10'} />
              </div>
            </div>
          </div>

          {/* Crops Multi-Select */}
          <div>
            <label className="block text-sm font-medium text-on-surface mb-2">
              {isEn ? 'Crops Purchased' : 'खरीदी जाने वाली फसलें'} <span className="text-error">*</span>
              <span className="text-on-surface-variant font-normal text-xs ml-1">({isEn ? 'Select multiple' : 'बहु-चयन'})</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_CROPS.map((crop) => {
                const isSel = form.cropsPurchased.includes(crop.id);
                return (
                  <button
                    key={crop.id}
                    type="button"
                    onClick={() => toggleCrop(crop.id)}
                    className={`px-3.5 py-1.5 rounded-full border text-xs font-semibold transition-all ${
                      isSel
                        ? 'bg-primary text-white border-primary shadow-sm'
                        : 'bg-surface border-outline-variant text-on-surface-variant hover:border-primary/50 hover:text-primary'
                    }`}
                  >
                    {isEn ? crop.en : crop.hi}
                  </button>
                );
              })}
            </div>
            {errors.cropsPurchased && <p className="text-xs text-error mt-1.5">{errors.cropsPurchased}</p>}
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
            <span>{isEn ? 'Create Buyer Profile' : 'खरीदार प्रोफाइल बनाएं'}</span>
            <span className="material-symbols-outlined text-xl">arrow_forward</span>
          </>
        )}
      </button>
    </form>
  );
}
