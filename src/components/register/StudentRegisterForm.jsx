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

export default function StudentRegisterForm({ lang = 'en' }) {
  const isEn = lang === 'en';
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: '', mobile: '', email: '',
    password: '', confirmPassword: '',
    college: '', course: '', yearOfStudy: '',
    location: '', areaOfInterest: '',
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
    if (!form.fullName.trim()) e.fullName = 'Please enter your full name.';
    if (!form.mobile.trim()) e.mobile = 'Please enter your mobile number.';
    else if (form.mobile.replace(/\D/g, '').length < 10) e.mobile = 'Enter a valid 10-digit mobile number.';
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Please enter a valid email address.';
    if (!form.password) e.password = 'Please enter a password.';
    else if (form.password.length < 8) e.password = 'Password must be at least 8 characters.';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match.';
    if (!form.college.trim()) e.college = 'Please enter your college or university.';
    if (!form.course.trim()) e.course = 'Please enter your course.';
    if (!form.yearOfStudy) e.yearOfStudy = 'Please select your year of study.';
    if (!form.areaOfInterest) e.areaOfInterest = 'Please select your area of interest.';
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
      register(form, 'student');
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
        <h3 className="font-display text-2xl font-bold text-primary">Student Profile Created!</h3>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-on-surface mb-1.5" htmlFor="s-fullName">
                {isEn ? 'Full Name' : 'पूरा नाम'} <span className="text-error">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-lg">person</span>
                <input id="s-fullName" type="text" value={form.fullName} onChange={set('fullName')}
                  placeholder="Priya Sharma"
                  className={inputCls(errors.fullName) + ' pl-10'} />
              </div>
              {errors.fullName && <p className="text-xs text-error mt-1">{errors.fullName}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-on-surface mb-1.5" htmlFor="s-mobile">
                {isEn ? 'Mobile Number' : 'मोबाइल नंबर'} <span className="text-error">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-lg">call</span>
                <input id="s-mobile" type="tel" value={form.mobile} onChange={set('mobile')}
                  placeholder="+91 98765 43210"
                  className={inputCls(errors.mobile) + ' pl-10'} />
              </div>
              {errors.mobile && <p className="text-xs text-error mt-1">{errors.mobile}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-on-surface mb-1.5" htmlFor="s-email">
              {isEn ? 'Email Address' : 'ईमेल पता'} <span className="text-error">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-lg">mail</span>
              <input id="s-email" type="email" value={form.email} onChange={set('email')}
                placeholder="priya@university.ac.in"
                className={inputCls(errors.email) + ' pl-10'} />
            </div>
            {errors.email && <p className="text-xs text-error mt-1">{errors.email}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-on-surface mb-1.5" htmlFor="s-password">
                {isEn ? 'Password' : 'पासवर्ड'} <span className="text-error">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-lg">lock</span>
                <input id="s-password" type={showPassword ? 'text' : 'password'}
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
              <label className="block text-sm font-medium text-on-surface mb-1.5" htmlFor="s-confirm">
                {isEn ? 'Confirm Password' : 'पासवर्ड पुष्टि'} <span className="text-error">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-lg">lock_reset</span>
                <input id="s-confirm" type={showConfirm ? 'text' : 'password'}
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

      {/* ── Section 2: Education Information ── */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center flex-shrink-0">2</div>
          <h3 className="font-semibold text-sm text-on-surface uppercase tracking-wide">
            {isEn ? 'Education Information' : 'शिक्षा जानकारी'}
          </h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-on-surface mb-1.5" htmlFor="s-college">
              {isEn ? 'College / University' : 'कॉलेज / विश्वविद्यालय'} <span className="text-error">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-lg">account_balance</span>
              <input id="s-college" type="text" value={form.college} onChange={set('college')}
                placeholder={isEn ? 'Agricultural State University' : 'कृषि विश्वविद्यालय'}
                className={inputCls(errors.college) + ' pl-10'} />
            </div>
            {errors.college && <p className="text-xs text-error mt-1">{errors.college}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-on-surface mb-1.5" htmlFor="s-course">
                {isEn ? 'Course' : 'कोर्स'} <span className="text-error">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-lg">book</span>
                <input id="s-course" type="text" value={form.course} onChange={set('course')}
                  placeholder="BSc Agriculture"
                  className={inputCls(errors.course) + ' pl-10'} />
              </div>
              {errors.course && <p className="text-xs text-error mt-1">{errors.course}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-on-surface mb-1.5" htmlFor="s-year">
                {isEn ? 'Year of Study' : 'अध्ययन वर्ष'} <span className="text-error">*</span>
              </label>
              <div className="relative">
                <select id="s-year" value={form.yearOfStudy} onChange={set('yearOfStudy')} className={selectCls(errors.yearOfStudy)}>
                  <option value="" disabled>{isEn ? 'Select Year' : 'वर्ष चुनें'}</option>
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                  <option value="postgrad">Postgraduate</option>
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-lg">expand_more</span>
              </div>
              {errors.yearOfStudy && <p className="text-xs text-error mt-1">{errors.yearOfStudy}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-on-surface mb-1.5" htmlFor="s-location">
                {isEn ? 'Location' : 'स्थान'}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-lg">location_on</span>
                <input id="s-location" type="text" value={form.location} onChange={set('location')}
                  placeholder={isEn ? 'City, State' : 'शहर, राज्य'}
                  className={inputCls(false) + ' pl-10'} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-on-surface mb-1.5" htmlFor="s-interest">
                {isEn ? 'Area of Interest' : 'रुचि क्षेत्र'} <span className="text-error">*</span>
              </label>
              <div className="relative">
                <select id="s-interest" value={form.areaOfInterest} onChange={set('areaOfInterest')} className={selectCls(errors.areaOfInterest)}>
                  <option value="" disabled>{isEn ? 'Select Interest' : 'रुचि चुनें'}</option>
                  <option value="crop">Crop Science</option>
                  <option value="soil">Soil Management</option>
                  <option value="tech">AgriTech &amp; Data</option>
                  <option value="livestock">Livestock Management</option>
                  <option value="business">Agribusiness</option>
                  <option value="organic">Organic Farming</option>
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-lg">expand_more</span>
              </div>
              {errors.areaOfInterest && <p className="text-xs text-error mt-1">{errors.areaOfInterest}</p>}
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
            <span>{isEn ? 'Create Student Profile' : 'छात्र प्रोफाइल बनाएं'}</span>
            <span className="material-symbols-outlined text-xl">arrow_forward</span>
          </>
        )}
      </button>
    </form>
  );
}
