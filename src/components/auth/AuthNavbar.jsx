import React from 'react';
import { Link } from 'react-router-dom';
import logoImg from '../../assets/logo.png';

export default function AuthNavbar({ lang, setLang }) {
  const toggleLang = () => {
    setLang((prev) => (prev === 'en' ? 'hi' : 'en'));
  };

  return (
    <header className="bg-surface/90 backdrop-blur-md shadow-sm fixed top-0 w-full z-50 h-16 flex justify-between items-center px-4 md:px-10 border-b border-surface-variant/60">
      <Link to="/" className="flex items-center gap-2.5 group">
        <img src={logoImg} alt="Farmer Helper Logo" className="h-8 w-auto rounded-md object-contain" />
        <span className="font-display-lg text-xl sm:text-2xl text-primary font-bold tracking-tight">
          Farmer Helper
        </span>
      </Link>

      <div className="flex items-center gap-4">
        <button
          onClick={toggleLang}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-low hover:bg-surface-container border border-outline-variant/50 text-on-surface-variant hover:text-primary transition-all text-xs font-semibold"
        >
          <span className="material-symbols-outlined text-lg">language</span>
          <span className="font-label-md">{lang === 'en' ? 'EN | हिंदी' : 'हिंदी | EN'}</span>
        </button>
      </div>
    </header>
  );
}
