import React, { useState } from 'react';
import { LOCATIONS } from '../../data/storageData';

export default function LocationSelectModal({ isOpen, onClose, activeLocation, onSelectLocation, lang = 'en' }) {
  const isEn = lang === 'en';
  const [customSearch, setCustomSearch] = useState('');
  const [isDetecting, setIsDetecting] = useState(false);

  if (!isOpen) return null;

  const handleDetectGPS = () => {
    setIsDetecting(true);
    setTimeout(() => {
      setIsDetecting(false);
      onSelectLocation(LOCATIONS[0]);
      onClose();
    }, 1200);
  };

  const filteredLocations = LOCATIONS.filter(loc => {
    if (!customSearch.trim()) return true;
    const q = customSearch.toLowerCase();
    return loc.en.toLowerCase().includes(q) || loc.hi.includes(q);
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-surface rounded-3xl w-full max-w-md shadow-2xl border border-outline-variant/40 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-outline-variant/30 flex items-center justify-between">
          <div>
            <span className="text-xs uppercase tracking-wider text-primary font-bold">
              {isEn ? 'Select Agricultural Zone' : 'कृषि भंडारण क्षेत्र चुनें'}
            </span>
            <h3 className="font-headline-sm text-lg sm:text-xl font-bold text-on-surface mt-0.5">
              {isEn ? 'Change Storage Location' : 'स्थान बदलें'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 overflow-y-auto">
          {/* Quick GPS Button */}
          <button
            type="button"
            onClick={handleDetectGPS}
            disabled={isDetecting}
            className="w-full py-3 px-4 rounded-2xl bg-primary-fixed/40 hover:bg-primary-fixed/60 text-primary font-bold text-sm flex items-center justify-between transition-all"
          >
            <span className="flex items-center gap-2">
              <span className={`material-symbols-outlined text-[20px] ${isDetecting ? 'animate-spin' : 'material-fill'}`}>
                {isDetecting ? 'sync' : 'my_location'}
              </span>
              <span>{isDetecting ? (isEn ? 'Detecting Farm GPS…' : 'GPS खोज जारी है…') : (isEn ? 'Use Current Farm Location' : 'वर्तमान खेत स्थान का उपयोग करें')}</span>
            </span>
            <span className="text-xs font-semibold text-primary/80">
              {isEn ? 'Accurate' : 'सटीक'}
            </span>
          </button>

          {/* Search Box */}
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[18px] text-outline">
              search
            </span>
            <input
              type="text"
              placeholder={isEn ? 'Search district, mandi or pin code…' : 'मंडी, जिला या पिन कोड खोजें…'}
              value={customSearch}
              onChange={(e) => setCustomSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-surface-container-low rounded-xl border border-outline-variant/40 text-xs font-body-md text-on-surface placeholder:text-outline focus:outline-none focus:border-primary"
            />
          </div>

          {/* Locations List */}
          <div className="space-y-2 pt-1">
            <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
              {isEn ? 'Popular Mandi & Cold Storage Corridors' : 'प्रमुख मंडी व कोल्ड स्टोरेज कॉरिडोर'}
            </p>
            {filteredLocations.map((loc) => {
              const isSelected = activeLocation?.id === loc.id;
              return (
                <button
                  key={loc.id}
                  onClick={() => {
                    onSelectLocation(loc);
                    onClose();
                  }}
                  type="button"
                  className={`w-full p-3.5 rounded-2xl flex items-center justify-between text-left transition-all border ${
                    isSelected
                      ? 'bg-primary text-on-primary border-primary shadow-sm'
                      : 'bg-surface-container-low hover:bg-surface-container text-on-surface border-outline-variant/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[20px] shrink-0">
                      location_on
                    </span>
                    <div>
                      <p className="font-semibold text-xs sm:text-sm">
                        {isEn ? loc.en : loc.hi}
                      </p>
                      <p className={`text-[11px] ${isSelected ? 'text-on-primary/80' : 'text-on-surface-variant'}`}>
                        {loc.count} {isEn ? 'Storage centers available' : 'स्टोरेज केंद्र उपलब्ध'}
                      </p>
                    </div>
                  </div>
                  {isSelected && (
                    <span className="material-symbols-outlined text-[20px] text-on-primary">
                      check_circle
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
