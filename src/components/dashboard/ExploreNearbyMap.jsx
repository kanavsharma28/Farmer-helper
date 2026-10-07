import React, { useState } from 'react';

export default function ExploreNearbyMap({ lang = 'en' }) {
  const isEn = lang === 'en';
  const [activeFilter, setActiveFilter] = useState('all');

  const filterChips = [
    { id: 'all', labelEn: 'All', labelHi: 'सभी' },
    { id: 'tractors', labelEn: 'Tractors', labelHi: 'ट्रैक्टर' },
    { id: 'labour', labelEn: 'Labour', labelHi: 'मजदूर' },
    { id: 'storage', labelEn: 'Storage', labelHi: 'भंडारण' },
    { id: 'buyers', labelEn: 'Buyers', labelHi: 'खरीदार' },
  ];

  return (
    <div className="lg:col-span-5 flex flex-col gap-4">
      <h2 className="font-headline-md text-xl font-bold text-on-surface mb-1">
        {isEn ? 'Explore Nearby' : 'निकटतम क्षेत्र'}
      </h2>

      <div className="glass-card rounded-[24px] overflow-hidden flex flex-col h-[380px] sm:h-[400px] border border-outline-variant/50 shadow-md">
        
        {/* Filter Chips Horizontal Bar */}
        <div className="flex gap-2 p-3 overflow-x-auto hide-scrollbar bg-surface-bright/90 border-b border-outline-variant/30">
          {filterChips.map((chip) => {
            const isActive = activeFilter === chip.id;

            return (
              <button
                key={chip.id}
                onClick={() => setActiveFilter(chip.id)}
                className={`whitespace-nowrap px-4 py-1.5 rounded-full font-label-md text-xs transition-all ${
                  isActive
                    ? 'bg-primary-container text-on-primary font-bold shadow-xs'
                    : 'bg-surface-container border border-outline-variant text-on-surface-variant hover:bg-surface-variant'
                }`}
              >
                {isEn ? chip.labelEn : chip.labelHi}
              </button>
            );
          })}
        </div>

        {/* Map Area Simulation */}
        <div className="flex-1 bg-surface-variant relative overflow-hidden group">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuB5zlLrbzr0TS3frnncYc8ocYZZsaUtMI_WJitXRjB7vrh6dpCBEr750w62cAvWmHPxSRQ9wezARGBJt32e3zkGvUfLUfVM74098yiVBLk0hxLOoMtsfQSEQRIUTkyqMwpjGltXxcYUtgINbRqfksKN6X-0YP6Y1re70JFaSo53EEVuBDHoygBKCQgd5dc-p-xRiUb5SO3tmfu_qX-bgu0NMpTgKxx-VMh6RabSGMjH0cUiQO-UxMS5"
            alt="Agricultural Map Meerut"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />

          {/* Simulated Map Markers */}
          {(activeFilter === 'all' || activeFilter === 'tractors') && (
            <div className="absolute top-1/4 left-1/4 w-8 h-8 bg-primary text-on-primary rounded-full flex items-center justify-center shadow-lg border-2 border-white animate-bounce">
              <span className="material-symbols-outlined text-[16px]">directions_car</span>
            </div>
          )}

          {(activeFilter === 'all' || activeFilter === 'labour') && (
            <div className="absolute top-1/2 left-2/3 w-8 h-8 bg-secondary text-on-secondary rounded-full flex items-center justify-center shadow-lg border-2 border-white animate-bounce delay-150">
              <span className="material-symbols-outlined text-[16px]">engineering</span>
            </div>
          )}

          {(activeFilter === 'all' || activeFilter === 'buyers') && (
            <div className="absolute bottom-1/4 left-1/3 w-8 h-8 bg-tertiary text-on-tertiary rounded-full flex items-center justify-center shadow-lg border-2 border-white animate-bounce delay-300">
              <span className="material-symbols-outlined text-[16px]">storefront</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
