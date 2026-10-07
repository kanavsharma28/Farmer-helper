import React from 'react';
import logoImg from '../assets/logo.png';
import { translations } from '../data/content';

export default function Footer({ lang, setActiveTab }) {
  const isEn = lang === 'en';
  const t = translations[lang] || translations.en;

  return (
    <footer className="bg-surface-container-low border-t border-surface-variant/80 pt-12 pb-24 md:pb-12 text-on-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 space-y-12">
        
        {/* Kisan Call Centre Helpline Banner */}
        <div className="bg-gradient-to-r from-primary-container to-secondary p-6 sm:p-8 rounded-3xl text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-3xl">headset_mic</span>
            </div>
            <div>
              <div className="font-label-md text-xs uppercase tracking-wider text-white/80">
                {t.helplineTitle}
              </div>
              <div className="font-display-lg text-2xl sm:text-3xl font-extrabold tracking-tight">
                {t.helplineNumber}
              </div>
            </div>
          </div>

          <a
            href="tel:18001801551"
            className="bg-white text-primary hover:bg-secondary-container hover:text-on-secondary-container font-bold px-8 py-3.5 rounded-full shadow-md hover:shadow-lg transition-all active:scale-95 text-sm shrink-0 flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-lg">call</span>
            <span>{t.callBtn}</span>
          </a>
        </div>

        {/* Links & Brand Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pt-4">
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-3">
              <img src={logoImg} alt="Logo" className="h-8 w-auto rounded-md" />
              <span className="font-display-lg text-xl font-bold text-primary">
                Farmer Helper
              </span>
            </div>
            <p className="font-body-md text-on-surface-variant text-sm max-w-md leading-relaxed">
              {t.footerDesc}
            </p>
          </div>

          <div>
            <h4 className="font-headline-md text-sm font-bold text-on-surface uppercase tracking-wider mb-4">
              {t.quickLinks}
            </h4>
            <ul className="space-y-2.5 text-sm text-on-surface-variant font-medium">
              <li>
                <button onClick={() => setActiveTab('home')} className="hover:text-primary transition-colors">
                  {t.navHome}
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('services')} className="hover:text-primary transition-colors">
                  {t.navServices}
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('marketplace')} className="hover:text-primary transition-colors">
                  {t.navMarketplace}
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('community')} className="hover:text-primary transition-colors">
                  {t.navCommunity}
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-headline-md text-sm font-bold text-on-surface uppercase tracking-wider mb-4">
              {isEn ? 'Support & Legal' : 'सहायता एवं कानूनी'}
            </h4>
            <ul className="space-y-2.5 text-sm text-on-surface-variant font-medium">
              <li><a href="#" className="hover:text-primary transition-colors">{t.contactUs}</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">{t.privacyPolicy}</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">{t.termsOfService}</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-surface-variant/60 flex flex-col sm:flex-row items-center justify-between text-xs text-on-surface-variant gap-4">
          <div>
            © {new Date().getFullYear()} Farmer Helper. All rights reserved.
          </div>
          <div className="flex gap-4 font-semibold">
            <span>🇮🇳 Made for India</span>
            <span>•</span>
            <span>Stitch AgriTech Design</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
