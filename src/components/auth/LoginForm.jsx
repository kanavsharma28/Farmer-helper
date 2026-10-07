import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import InputField from './InputField';
import PasswordInput from './PasswordInput';
import SocialLogin from './SocialLogin';
import { useAuth } from '../../context/AuthContext';

export default function LoginForm({ lang }) {
  const isEn = lang === 'en';
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loginAsPreset } = useAuth();

  const [selectedRole, setSelectedRole] = useState('farmer');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [successRole, setSuccessRole] = useState('farmer');

  const redirectAfterLogin = (roleToRedirect) => {
    const role = roleToRedirect || selectedRole;
    if (role === 'admin') {
      navigate('/admin/dashboard', { replace: true });
      return;
    }
    const from = location.state?.from?.pathname;
    if (from && !from.startsWith('/admin')) {
      navigate(from, { replace: true });
    } else {
      navigate('/dashboard', { replace: true });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!identifier.trim()) {
      newErrors.identifier = isEn ? 'Please enter mobile number or email' : 'कृपया मोबाइल नंबर या ईमेल दर्ज करें';
    }
    if (!password) {
      newErrors.password = isEn ? 'Please enter your password' : 'कृपया अपना पासवर्ड दर्ज करें';
    } else if (password.length < 6) {
      newErrors.password = isEn ? 'Password must be at least 6 characters' : 'पासवर्ड कम से कम 6 अक्षरों का होना चाहिए';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    setTimeout(() => {
      const loggedIn = login({ identifier, password, role: selectedRole });
      setSuccessRole(loggedIn.role);
      setIsLoading(false);
      setLoginSuccess(true);
      setTimeout(() => {
        redirectAfterLogin(loggedIn.role);
      }, 1000);
    }, 800);
  };

  // Quick 1-click test login for any role
  const handleQuickRoleLogin = (roleKey) => {
    setIsLoading(true);
    setTimeout(() => {
      const loggedIn = loginAsPreset(roleKey);
      setSuccessRole(loggedIn.role);
      setIsLoading(false);
      setLoginSuccess(true);
      setTimeout(() => {
        redirectAfterLogin(loggedIn.role);
      }, 900);
    }, 600);
  };

  const handleGoogleLogin = () => {
    handleQuickRoleLogin(selectedRole);
  };

  const rolePills = [
    { id: 'farmer', emoji: '🌾', labelEn: 'Farmer', labelHi: 'किसान' },
    { id: 'student', emoji: '🎓', labelEn: 'Student', labelHi: 'छात्र' },
    { id: 'buyer', emoji: '🛒', labelEn: 'Buyer', labelHi: 'खरीदार' },
    { id: 'provider', emoji: '🚜', labelEn: 'Provider', labelHi: 'प्रदाता' },
    { id: 'admin', emoji: '🛡️', labelEn: 'Admin', labelHi: 'एडमिन' },
  ];

  const roleButtonConfig = {
    farmer: {
      labelEn: 'Login as Farmer',
      labelHi: 'किसान के रूप में लॉगिन करें',
      icon: 'eco',
    },
    student: {
      labelEn: 'Login as Student',
      labelHi: 'छात्र के रूप में लॉगिन करें',
      icon: 'school',
    },
    buyer: {
      labelEn: 'Login as Buyer',
      labelHi: 'खरीदार के रूप में लॉगिन करें',
      icon: 'shopping_cart',
    },
    provider: {
      labelEn: 'Login as Provider',
      labelHi: 'प्रदाता के रूप में लॉगिन करें',
      icon: 'agriculture',
    },
    admin: {
      labelEn: 'Login to Admin Portal',
      labelHi: 'एडमिन पोर्टल में लॉगिन करें',
      icon: 'admin_panel_settings',
    },
  };

  const currentRole = roleButtonConfig[selectedRole] || {
    labelEn: `Login as ${selectedRole ? selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1) : 'Farmer'}`,
    labelHi: 'लॉगिन करें',
    icon: 'eco',
  };

  const isFormIncomplete = !identifier.trim() || !password;

  return (
    <div className="w-full max-w-md bg-surface-container-lowest p-6 sm:p-8 rounded-[24px] shadow-[0px_4px_20px_rgba(0,0,0,0.05)] border border-outline-variant/30 relative">
      
      {/* Header */}
      <div className="mb-6">
        <h2 className="font-headline-lg text-headline-lg text-on-surface mb-2 font-bold text-2xl sm:text-3xl">
          {isEn ? 'Welcome Back 👋' : 'वापसी पर स्वागत है 👋'}
        </h2>
        <p className="font-body-md text-body-md text-on-surface-variant text-sm">
          {isEn ? 'Login to continue to Farmer Helper.' : 'फॉर्मर हेल्पर का उपयोग जारी रखने के लिए लॉगिन करें।'}
        </p>
      </div>

      {/* Quick 1-Click Role Preview Selector */}
      <div className="mb-6 p-3 bg-surface-container-low/80 rounded-2xl border border-outline-variant/30 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-on-surface-variant flex items-center gap-1">
            <span className="material-symbols-outlined text-[15px] text-primary">touch_app</span>
            {isEn ? 'Quick Login by Role:' : 'रोल अनुसार तुरंत लॉगिन:'}
          </span>
          <span className="text-[10px] text-primary font-bold">1-Click Test</span>
        </div>

        <div className="grid grid-cols-5 gap-1">
          {rolePills.map((r) => {
            const isSelected = selectedRole === r.id;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => handleQuickRoleLogin(r.id)}
                className={`py-2 px-1 rounded-xl text-center transition-all flex flex-col items-center justify-center gap-0.5 border ${
                  isSelected
                    ? 'border-primary bg-primary/10 shadow-xs'
                    : 'border-outline-variant/50 bg-surface hover:bg-surface-container'
                }`}
                title={isEn ? `Login as ${r.labelEn}` : `${r.labelHi} के रूप में लॉगिन करें`}
              >
                <span className="text-base leading-none">{r.emoji}</span>
                <span className="text-[10px] sm:text-[11px] font-bold text-on-surface truncate">
                  {isEn ? r.labelEn : r.labelHi}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {loginSuccess ? (
        <div className="py-8 text-center space-y-4 animate-fadeIn">
          <div className="w-16 h-16 bg-secondary/20 text-secondary rounded-full flex items-center justify-center mx-auto text-3xl font-bold">
            ✓
          </div>
          <h3 className="font-bold text-xl text-primary-container">
            {isEn ? 'Login Successful!' : 'लॉगिन सफल रहा!'}
          </h3>
          <p className="text-sm text-on-surface-variant">
            {isEn
              ? `Redirecting to your ${successRole} dashboard...`
              : `आपके डैशबोर्ड पर भेजा जा रहा है...`}
          </p>
          <div className="flex justify-center pt-2">
            <span className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin block" />
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Role selector dropdown/radio for manual login */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider block">
              {isEn ? 'Select Portal Role' : 'पोर्टल रोल चुनें'}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {rolePills.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setSelectedRole(r.id)}
                  className={`py-2 px-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    selectedRole === r.id
                      ? 'border-primary bg-primary/10 text-primary font-bold shadow-xs'
                      : 'border-outline-variant/40 bg-surface text-on-surface-variant hover:bg-surface-container'
                  }`}
                >
                  <span>{r.emoji}</span>
                  <span className="truncate">{isEn ? r.labelEn : r.labelHi}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Input: Mobile / Email */}
          <InputField
            id="identifier"
            label={isEn ? 'Mobile Number or Email' : 'मोबाइल नंबर या ईमेल'}
            placeholder={isEn ? 'Enter mobile or email (e.g. 9876543210)' : 'मोबाइल या ईमेल दर्ज करें'}
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            error={errors.identifier}
          />

          {/* Input: Password */}
          <PasswordInput
            id="password"
            label={isEn ? 'Password' : 'पासवर्ड'}
            placeholder={isEn ? 'Enter password (min 6 chars)' : 'पासवर्ड दर्ज करें'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            forgotPasswordText={isEn ? 'Forgot Password?' : 'पासवर्ड भूल गए?'}
            onForgotPassword={() => alert(isEn ? 'Password reset link sent to your registered mobile/email.' : 'पासवर्ड रीसेट लिंक आपके पंजीकृत नंबर/ईमेल पर भेजा गया।')}
          />

          {/* Primary Action Login Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full h-[50px] rounded-[14px] font-semibold text-[15px] sm:text-base text-white
              bg-gradient-to-r from-[#115322] via-[#1a6e2e] to-[#2d8c39]
              shadow-[0_4px_14px_rgba(18,83,33,0.28)]
              hover:from-[#145d27] hover:via-[#1f7934] hover:to-[#349a42]
              hover:shadow-[0_6px_20px_rgba(18,83,33,0.38)]
              hover:-translate-y-0.5
              active:scale-[0.98] active:translate-y-0
              transition-all duration-200 ease-out
              flex items-center justify-center gap-2.5
              ${isLoading ? 'cursor-wait opacity-90 pointer-events-none hover:translate-y-0 hover:shadow-[0_4px_14px_rgba(18,83,33,0.28)]' : isFormIncomplete ? 'opacity-85 shadow-[0_2px_10px_rgba(18,83,33,0.2)] hover:opacity-100 cursor-pointer' : 'cursor-pointer'}
            `}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2.5">
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin shrink-0"></span>
                <span>{isEn ? 'Logging in...' : 'लॉगिन हो रहा है...'}</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-[20px] leading-none shrink-0">
                  {currentRole.icon}
                </span>
                <span>{isEn ? currentRole.labelEn : currentRole.labelHi}</span>
              </div>
            )}
          </button>

          {/* Divider */}
          <div className="flex items-center my-4">
            <div className="flex-grow border-t border-outline-variant/50"></div>
            <span className="mx-4 font-caption text-caption text-on-surface-variant uppercase tracking-wider text-xs font-semibold">
              {isEn ? 'OR' : 'अथवा'}
            </span>
            <div className="flex-grow border-t border-outline-variant/50"></div>
          </div>

          {/* Secondary Action: Social Login */}
          <SocialLogin
            label={isEn ? 'Continue with Google' : 'Google से आगे बढ़ें'}
            onClick={handleGoogleLogin}
          />

          {/* Footer Navigation */}
          <div className="mt-6 text-center">
            <p className="font-body-md text-body-md text-on-surface-variant text-sm">
              {isEn ? "Don't have an account?" : 'खाता नहीं है?'}{' '}
              <Link
                to="/register"
                className="font-label-md text-label-md text-primary font-bold hover:underline"
              >
                {isEn ? 'Create Account' : 'नया खाता बनाएं'}
              </Link>
            </p>
          </div>

        </form>
      )}

    </div>
  );
}
