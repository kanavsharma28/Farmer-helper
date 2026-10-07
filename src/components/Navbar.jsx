import React from 'react';
import { Link } from 'react-router-dom';
import logoImg from '../assets/logo.png';

export default function Navbar({ activeTab, setActiveTab, lang, setLang, onOpenLogin, onOpenNearbyHelp }) {
  const isEn = lang === 'en';

  return (
    <header className="sticky top-0 w-full z-50 bg-surface/95 backdrop-blur-md border-b border-surface-variant shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 h-20 flex items-center justify-between">
        
        {/* Brand Logo & Name */}
        <div 
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="relative overflow-hidden rounded-xl bg-white shadow-sm border border-surface-variant p-1 transition-transform group-hover:scale-105">
            <img 
              src={logoImg} 
              alt="Farmer Helper Logo" 
              className="h-10 w-auto object-contain rounded-lg"
            />
          </div>
          <span className="font-display-lg text-2xl font-bold tracking-tight text-primary flex items-center gap-1.5">
            Farmer Helper
            <span className="inline-block w-2 h-2 rounded-full bg-secondary animate-ping"></span>
          </span>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 font-body-md">
          {[
            { id: 'home', labelEn: 'Home', labelHi: 'होम' },
            { id: 'services', labelEn: 'Services', labelHi: 'सेवाएं' },
            { id: 'marketplace', labelEn: 'Marketplace', labelHi: 'मंडी भाव' },
            { id: 'community', labelEn: 'Community', labelHi: 'किसान चर्चा' },
          ].map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative py-1 font-medium transition-all ${
                  isActive 
                    ? 'text-primary font-bold border-b-2 border-primary' 
                    : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                {isEn ? item.labelEn : item.labelHi}
              </button>
            );
          })}
        </nav>

        {/* Right Action Controls */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Language Switcher */}
          <div className="flex items-center bg-surface-container-low border border-outline-variant/60 rounded-full p-1 text-xs font-semibold shadow-inner">
            <button
              onClick={() => setLang('en')}
              className={`px-2.5 py-1 rounded-full transition-all ${
                isEn 
                  ? 'bg-primary-container text-on-primary-container shadow-sm' 
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLang('hi')}
              className={`px-2.5 py-1 rounded-full transition-all ${
                !isEn 
                  ? 'bg-primary-container text-on-primary-container shadow-sm' 
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              हिं
            </button>
          </div>

          {/* Login Link to /login */}
          <Link
            to="/login"
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full font-label-md text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-xl">login</span>
            <span>{isEn ? 'Login' : 'लॉगिन'}</span>
          </Link>

          {/* Get Started CTA */}
          <button
            onClick={onOpenNearbyHelp}
            className="bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary px-5 py-2.5 sm:px-6 sm:py-3 rounded-full font-label-md transition-all shadow-sm hover:shadow-md active:scale-95 flex items-center gap-2"
          >
            <span>{isEn ? 'Get Started' : 'शुरू करें'}</span>
            <span className="material-symbols-outlined text-lg">arrow_forward</span>
          </button>
        </div>

      </div>
    </header>
  );
}
