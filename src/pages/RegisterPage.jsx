import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import heroFarmerImg from '../assets/hero_farmer.jpg';

import RoleSelector from '../components/register/RoleSelector';
import FarmerRegisterForm from '../components/register/FarmerRegisterForm';
import StudentRegisterForm from '../components/register/StudentRegisterForm';
import BuyerRegisterForm from '../components/register/BuyerRegisterForm';
import ProviderRegisterForm from '../components/register/ProviderRegisterForm';

/* ─── Role metadata for the active form heading ─── */
const ROLE_META = {
  farmer: {
    emoji: '🌾',
    titleEn: 'Farmer Account',
    titleHi: 'किसान खाता',
    descEn: 'Manage your farm and discover agricultural services.',
    descHi: 'खेत प्रबंधन करें और कृषि सेवाएं खोजें।',
    form: FarmerRegisterForm,
  },
  student: {
    emoji: '🎓',
    titleEn: 'Student Profile',
    titleHi: 'छात्र प्रोफाइल',
    descEn: 'Find agriculture internships and farm training opportunities.',
    descHi: 'इंटर्नशिप और खेती प्रशिक्षण के अवसर पाएं।',
    form: StudentRegisterForm,
  },
  buyer: {
    emoji: '🛒',
    titleEn: 'Buyer Profile',
    titleHi: 'खरीदार प्रोफाइल',
    descEn: 'Connect with farmers and source quality agricultural products.',
    descHi: 'किसानों से जुड़ें और उत्कृष्ट उत्पाद खरीदें।',
    form: BuyerRegisterForm,
  },
  provider: {
    emoji: '🚜',
    titleEn: 'Resource Provider',
    titleHi: 'संसाधन प्रदाता',
    descEn: 'List tractors, labour, machines and other farm resources.',
    descHi: 'ट्रैक्टर, मशीन व मजदूर किराए पर दें।',
    form: ProviderRegisterForm,
  },
};

export default function RegisterPage() {
  /* ─── State ─── */
  const [selectedRole, setSelectedRole] = useState('farmer');
  const [lang, setLang] = useState('en');

  const isEn = lang === 'en';
  const meta = ROLE_META[selectedRole];
  const ActiveForm = meta.form;

  /* Role change resets to fresh form — key forces unmount/remount */
  const handleRoleSelect = (roleId) => {
    setSelectedRole(roleId);
  };

  return (
    <div className="min-h-screen bg-background font-sans text-on-background antialiased selection:bg-primary-container selection:text-white flex flex-col">

      {/* ══════════════════ HEADER ══════════════════ */}
      <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-surface/95 backdrop-blur-md shadow-sm border-b border-outline-variant/30 flex items-center justify-between px-4 sm:px-6 md:px-10">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
            <span className="material-symbols-outlined text-white text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              agriculture
            </span>
          </div>
          <span className="font-bold text-xl text-primary tracking-tight" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Farmer Helper
          </span>
        </Link>

        {/* Right controls */}
        <div className="flex items-center gap-3">
          {/* Language toggle */}
          <button
            onClick={() => setLang((l) => l === 'en' ? 'hi' : 'en')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-low hover:bg-surface-container border border-outline-variant/50 text-on-surface-variant hover:text-primary transition-all text-xs font-semibold"
            aria-label="Toggle language"
          >
            <span className="material-symbols-outlined text-base">language</span>
            <span>{lang === 'en' ? 'EN | हिंदी' : 'हिंदी | EN'}</span>
          </button>

          {/* Login link — hidden on very small screens */}
          <div className="hidden sm:flex items-center gap-2 text-sm text-on-surface-variant">
            <span>{isEn ? 'Have an account?' : 'खाता है?'}</span>
            <Link
              to="/login"
              className="font-bold text-primary hover:text-primary-container transition-colors underline-offset-2 hover:underline"
            >
              {isEn ? 'Login' : 'लॉगिन'}
            </Link>
          </div>
        </div>
      </header>

      {/* ══════════════════ MAIN LAYOUT ══════════════════ */}
      <main className="flex-1 flex flex-col md:flex-row mt-16 min-h-[calc(100vh-4rem)]">

        {/* ── Left Visual Anchor (Desktop Only) ── */}
        <aside className="hidden md:flex md:w-5/12 lg:w-[44%] relative bg-surface-container-high overflow-hidden select-none flex-shrink-0">
          {/* Background Image */}
          <img
            src={heroFarmerImg}
            alt="Agricultural landscape with Indian farmer"
            className="absolute inset-0 w-full h-full object-cover z-0 transition-transform duration-[2s] hover:scale-105"
          />

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/88 via-black/45 to-primary/20 z-10 pointer-events-none" />

          {/* Content */}
          <div className="relative z-20 flex flex-col justify-between h-full p-10 lg:p-12">
            {/* Top badge */}
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 px-3 py-1.5 rounded-full self-start">
              <div className="w-2 h-2 bg-secondary-fixed rounded-full animate-pulse" />
              <span className="text-white/90 text-xs font-semibold">
                {isEn ? '2 Million+ Farmers Connected' : '20 लाख+ किसान जुड़े'}
              </span>
            </div>

            {/* Bottom headline + description */}
            <div className="space-y-4">
              <h2 className="text-white font-bold leading-tight" style={{ fontFamily: 'Poppins, sans-serif', fontSize: 'clamp(1.75rem, 3vw, 2.5rem)' }}>
                🌱 {isEn ? 'Har Kisan Ka' : 'हर किसान का'}
                <br />
                <span className="text-secondary-fixed">{isEn ? 'Digital Saathi' : 'डिजिटल साथी'}</span>
              </h2>

              <p className="text-white/80 text-sm leading-relaxed max-w-xs">
                {isEn
                  ? 'Access farming resources, crop guidance, buyers, storage and government schemes — all in one place.'
                  : 'खेती के साधन, फसल मार्गदर्शन, खरीदार और सरकारी योजनाएं — सब एक जगह।'}
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 mt-6">
                {[
                  { val: '2M+', label: isEn ? 'Farmers' : 'किसान' },
                  { val: '50K+', label: isEn ? 'Buyers' : 'खरीदार' },
                  { val: '28', label: isEn ? 'States' : 'राज्य' },
                ].map((stat) => (
                  <div key={stat.label} className="bg-white/12 backdrop-blur-sm rounded-xl p-3 border border-white/15 text-center">
                    <p className="text-white font-bold text-lg leading-none">{stat.val}</p>
                    <p className="text-white/70 text-xs mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* ── Right Form Canvas ── */}
        <section className="w-full md:w-7/12 lg:w-[56%] flex flex-col bg-surface overflow-y-auto">
          <div className="flex-1 flex flex-col items-center justify-start py-8 md:py-10 px-4 sm:px-6 md:px-10 lg:px-12">
            <div className="w-full max-w-[560px]">

              {/* Mobile logo (only visible on mobile) */}
              <div className="md:hidden text-center mb-6">
                <Link to="/" className="inline-flex flex-col items-center gap-1">
                  <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-md mb-1">
                    <span className="material-symbols-outlined text-white text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                      agriculture
                    </span>
                  </div>
                  <span className="font-bold text-2xl text-primary" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Farmer Helper
                  </span>
                </Link>
              </div>

              {/* Page heading */}
              <div className="mb-6">
                <h1 className="font-bold text-2xl sm:text-3xl text-on-surface" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  {isEn ? 'Create Your Account 🌱' : 'अपना खाता बनाएं 🌱'}
                </h1>
                <p className="text-on-surface-variant text-sm mt-1.5">
                  {isEn
                    ? 'Choose your role and create your Farmer Helper profile.'
                    : 'अपना रोल चुनें और Farmer Helper प्रोफाइल बनाएं।'}
                </p>
              </div>

              {/* ═══ ROLE SELECTOR ═══ */}
              <RoleSelector
                selectedRole={selectedRole}
                onSelectRole={handleRoleSelect}
                lang={lang}
              />

              {/* Active Role Banner */}
              <div className="flex items-center gap-3 bg-primary/5 border border-primary/15 rounded-2xl px-4 py-3 my-5">
                <span className="text-2xl">{meta.emoji}</span>
                <div className="min-w-0">
                  <p className="font-bold text-primary text-sm">
                    {isEn ? meta.titleEn : meta.titleHi}
                  </p>
                  <p className="text-on-surface-variant text-xs truncate">
                    {isEn ? meta.descEn : meta.descHi}
                  </p>
                </div>
              </div>

              {/* ═══ REGISTRATION CARD ═══ */}
              <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/30 shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-5 sm:p-7">
                {/*
                  key={selectedRole} forces React to unmount + remount
                  the form when role changes — this cleanly resets all
                  form state without any manual reset logic.
                */}
                <ActiveForm key={selectedRole} lang={lang} />
              </div>

              {/* Footer links */}
              <div className="mt-6 text-center space-y-3">
                {/* Login link for mobile */}
                <p className="text-sm text-on-surface-variant sm:hidden">
                  {isEn ? 'Already have an account?' : 'पहले से खाता है?'}{' '}
                  <Link to="/login" className="font-bold text-primary hover:underline">
                    {isEn ? 'Login' : 'लॉगिन'}
                  </Link>
                </p>

                <p className="text-xs text-on-surface-variant max-w-md mx-auto leading-relaxed">
                  {isEn ? (
                    <>
                      By creating an account, you agree to our{' '}
                      <a href="#" className="underline hover:text-primary transition-colors">Terms &amp; Conditions</a>{' '}
                      and{' '}
                      <a href="#" className="underline hover:text-primary transition-colors">Privacy Policy</a>.
                    </>
                  ) : (
                    <>
                      खाता बनाकर आप हमारी{' '}
                      <a href="#" className="underline hover:text-primary transition-colors">नियम और शर्तों</a>{' '}
                      तथा{' '}
                      <a href="#" className="underline hover:text-primary transition-colors">गोपनीयता नीति</a>{' '}
                      से सहमत होते हैं।
                    </>
                  )}
                </p>
              </div>

              {/* Bottom spacer for mobile scroll comfort */}
              <div className="h-8" />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
