import React, { useState } from 'react';
import { translations } from '../data/content';

export default function LoginModal({ isOpen, onClose, lang }) {
  const isEn = lang === 'en';
  const t = translations[lang] || translations.en;

  const [phone, setPhone] = useState('');
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (phone.length < 10) {
      alert(isEn ? 'Please enter a valid 10-digit mobile number' : 'कृपया 10 अंकों का वैध मोबाइल नंबर दर्ज करें');
      return;
    }
    setStep(2);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (otp === '123456' || otp.length === 6) {
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setStep(1);
        setPhone('');
        setOtp('');
        onClose();
      }, 1500);
    } else {
      alert(isEn ? 'Invalid OTP. Please enter 123456' : 'अमान्य ओटीपी। कृपया 123456 दर्ज करें');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-surface-variant space-y-6 relative">
        
        {/* Close Button */}
        <button
          onClick={() => {
            setStep(1);
            onClose();
          }}
          className="absolute top-6 right-6 w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors"
        >
          <span className="material-symbols-outlined text-xl">close</span>
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2 pt-2">
          <div className="w-16 h-16 rounded-full bg-primary-container/10 text-primary-container flex items-center justify-center mx-auto mb-3">
            <span className="material-symbols-outlined text-3xl">badge</span>
          </div>
          <h3 className="font-display-lg text-2xl font-bold text-on-surface">
            {t.loginModalTitle}
          </h3>
          <p className="font-body-md text-on-surface-variant text-xs sm:text-sm max-w-xs mx-auto">
            {t.loginModalSub}
          </p>
        </div>

        {isSuccess ? (
          <div className="py-8 text-center space-y-3 animate-fadeIn">
            <div className="w-16 h-16 bg-secondary/20 text-secondary rounded-full flex items-center justify-center mx-auto text-3xl">
              ✓
            </div>
            <div className="font-bold text-lg text-primary-container">
              {isEn ? 'Login Successful!' : 'लॉगिन सफल रहा!'}
            </div>
          </div>
        ) : step === 1 ? (
          <form onSubmit={handleSendOtp} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">
                {t.phoneLabel}
              </label>
              <div className="flex items-center border border-outline-variant rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-primary shadow-sm">
                <span className="bg-surface-container px-4 py-3 text-sm font-bold text-on-surface border-r border-outline-variant">
                  +91
                </span>
                <input
                  type="tel"
                  maxLength="10"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="9876543210"
                  className="w-full px-4 py-3 text-sm font-medium focus:outline-none"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-primary-container text-on-primary-container hover:bg-primary hover:text-white py-3.5 px-6 rounded-2xl font-label-md font-bold transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
            >
              <span>{t.sendOtp}</span>
              <span className="material-symbols-outlined text-lg">sms</span>
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">
                {t.otpLabel}
              </label>
              <input
                type="text"
                maxLength="6"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="123456"
                className="w-full border border-outline-variant rounded-2xl px-4 py-3 text-center text-xl font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
                required
              />
              <div className="text-center text-xs text-secondary font-bold mt-2">
                💡 {t.enterMockOtp}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-secondary text-white hover:bg-primary-container py-3.5 px-6 rounded-2xl font-label-md font-bold transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
            >
              <span>{t.verifyOtp}</span>
              <span className="material-symbols-outlined text-lg">check_circle</span>
            </button>

            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full text-xs text-on-surface-variant hover:text-primary font-semibold text-center"
            >
              ← {isEn ? 'Change Phone Number' : 'फोन नंबर बदलें'}
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
