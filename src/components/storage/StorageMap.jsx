import React, { useState } from 'react';

export default function StorageMap({
  facilities = [],
  selectedFacility,
  onSelectFacility,
  onViewDetails,
  lang = 'en',
}) {
  const isEn = lang === 'en';
  const [isSatellite, setIsSatellite] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  const handleZoomIn = () => setZoomLevel((z) => Math.min(1.4, z + 0.1));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(0.8, z - 0.1));

  return (
    <div className="bg-surface rounded-3xl shadow-sm border border-outline-variant/40 p-4 sm:p-5 flex flex-col gap-3 relative overflow-hidden">
      {/* Map Header Controls */}
      <div className="flex items-center justify-between pb-2 border-b border-outline-variant/30">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-ping"></span>
          <span className="font-bold text-xs sm:text-sm text-on-surface">
            {isEn ? 'Live Storage Radar Map (GPS Active)' : 'लाइव मैप दृश्य (GPS Active)'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSatellite(!isSatellite)}
            type="button"
            className={`px-3 py-1 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              isSatellite
                ? 'bg-primary text-on-primary shadow-sm'
                : 'bg-surface-container-low hover:bg-surface-container text-on-surface-variant'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">layers</span>
            <span>{isSatellite ? (isEn ? 'Satellite' : 'सैटेलाइट') : (isEn ? 'Road Map' : 'सड़क दृश्य')}</span>
          </button>

          <button
            onClick={() => setZoomLevel(1)}
            type="button"
            title="Locate Me"
            className="p-1.5 bg-surface-container-low hover:bg-surface-container rounded-xl text-on-surface-variant transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">gps_fixed</span>
          </button>
        </div>
      </div>

      {/* Map Canvas Simulation */}
      <div
        className={`relative w-full h-[480px] sm:h-[540px] rounded-2xl overflow-hidden flex items-center justify-center transition-all ${
          isSatellite ? 'bg-[#2b3a32]' : 'bg-[#e8ece9]'
        }`}
      >
        {/* Styled SVG Road & Topography Layers */}
        <div
          className="absolute inset-0 w-full h-full transition-transform duration-300 pointer-events-none"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          <svg className="w-full h-full" viewBox="0 0 500 600" fill="none" preserveAspectRatio="none">
            {/* Secondary Rural Road Lines */}
            <path d="M-20 80 Q 150 120 280 90 T 520 140" stroke={isSatellite ? '#405847' : '#d2dcd3'} strokeWidth="5" />
            <path d="M80 620 L 160 380 L 210 240 L 190 -20" stroke={isSatellite ? '#405847' : '#d2dcd3'} strokeWidth="7" />
            <path d="M480 500 Q 320 400 240 310 T -20 260" stroke={isSatellite ? '#3a5040' : '#dae4dc'} strokeWidth="5" />

            {/* Major Highway (GT Road / Express Corridor) */}
            <path d="M-10 460 C 140 430, 260 300, 360 180 S 510 60, 520 50" stroke={isSatellite ? '#607d67' : '#b8cab9'} strokeWidth="12" />
            <path d="M-10 460 C 140 430, 260 300, 360 180 S 510 60, 520 50" stroke="#ffffff" strokeDasharray="8 6" strokeWidth="4" />

            {/* Canal / Water Body */}
            <path d="M 390 -20 Q 340 200 420 420 T 360 620" stroke={isSatellite ? '#1e3845' : '#b5d5e8'} strokeWidth="10" />
          </svg>

          {/* Regional Geographic Labels */}
          <span className={`absolute top-8 left-8 text-[10px] font-extrabold uppercase tracking-widest pointer-events-none ${
            isSatellite ? 'text-white/40' : 'text-slate-500/60'
          }`}>
            ग्रेटर नोएडा वेस्ट (GN West)
          </span>
          <span className={`absolute top-20 right-10 text-[10px] font-extrabold uppercase tracking-widest pointer-events-none ${
            isSatellite ? 'text-white/40' : 'text-slate-500/60'
          }`}>
            दादरी इंडस्ट्रियल क्लस्टर (Dadri Hub)
          </span>
          <span className={`absolute bottom-16 left-6 text-[10px] font-extrabold uppercase tracking-widest pointer-events-none ${
            isSatellite ? 'text-white/40' : 'text-slate-500/60'
          }`}>
            सिकंदराबाद जीटी रोड (Sikandrabad)
          </span>
        </div>

        {/* Farmer Current Location Pin (Pulsing Center) */}
        <div className="absolute top-[48%] left-[44%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none z-20">
          <div className="relative flex items-center justify-center">
            <span className="absolute w-12 h-12 bg-primary/25 rounded-full animate-ping"></span>
            <span className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-lg border-2 border-white">
              <span className="material-symbols-outlined text-[18px]">person_pin_circle</span>
            </span>
          </div>
          <span className="mt-1 bg-surface/95 backdrop-blur-sm px-2 py-0.5 rounded-lg text-[10px] font-bold text-primary shadow-sm border border-outline-variant/30 whitespace-nowrap">
            📍 {isEn ? 'Your Farm Location' : 'आपका खेत (दादरी)'}
          </span>
        </div>

        {/* Facility Marker Pins */}
        {facilities.map((fac) => {
          const isSelected = selectedFacility?.id === fac.id;
          const isFull = fac.status === 'full';
          const isLimited = fac.status === 'limited';

          return (
            <div
              key={fac.id}
              onClick={() => onSelectFacility?.(fac)}
              style={{ top: fac.mapCoords.top, left: fac.mapCoords.left }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-30 cursor-pointer group transition-transform duration-200 hover:scale-110 active:scale-95"
            >
              <div className="flex flex-col items-center">
                <div
                  className={`px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1.5 text-[11px] font-bold border-2 transition-all ${
                    isSelected
                      ? 'bg-primary text-on-primary border-white scale-110 shadow-xl ring-2 ring-primary/40'
                      : 'bg-surface text-on-surface border-outline-variant/40 hover:bg-surface-container'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full shrink-0 ${
                      isFull ? 'bg-error' : isLimited ? 'bg-tertiary' : 'bg-secondary'
                    }`}
                  />
                  <span className="truncate max-w-[120px]">
                    {isEn ? fac.name.split(' ')[0] : fac.nameHi.split(' ')[0]} • ₹{fac.ratePerQtl}
                  </span>
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded-full font-semibold ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : isFull
                        ? 'bg-error/15 text-error'
                        : 'bg-secondary/15 text-secondary'
                    }`}
                  >
                    {isFull ? (isEn ? 'Full' : 'भरा') : `${fac.capacityAvailable} MT`}
                  </span>
                </div>
                {/* Pointer arrow */}
                <div
                  className={`w-2 h-2 rotate-45 -mt-1 shadow-sm ${
                    isSelected ? 'bg-primary' : 'bg-surface'
                  }`}
                />
              </div>
            </div>
          );
        })}

        {/* Zoom Controls */}
        <div className="absolute right-3 bottom-20 flex flex-col gap-1 bg-surface/90 backdrop-blur-md rounded-2xl p-1 shadow-md border border-outline-variant/30 z-40">
          <button
            onClick={handleZoomIn}
            type="button"
            className="w-8 h-8 flex items-center justify-center text-on-surface hover:bg-surface-container rounded-xl font-bold text-base cursor-pointer"
          >
            +
          </button>
          <button
            onClick={handleZoomOut}
            type="button"
            className="w-8 h-8 flex items-center justify-center text-on-surface hover:bg-surface-container rounded-xl font-bold text-base cursor-pointer"
          >
            –
          </button>
        </div>

        {/* Bottom Selected Storage Quick Preview Card */}
        {selectedFacility && (
          <div className="absolute bottom-3 left-3 right-3 bg-surface/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-outline-variant/40 z-40 flex items-center justify-between gap-3 animate-fade-in">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-11 h-11 rounded-xl bg-primary-container text-on-primary flex items-center justify-center font-bold shrink-0">
                <span className="material-symbols-outlined text-[22px]">warehouse</span>
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-xs sm:text-sm text-on-surface truncate">
                  {isEn ? selectedFacility.name : selectedFacility.nameHi}
                </h4>
                <p className="text-[11px] text-on-surface-variant flex items-center gap-2 truncate">
                  <span>{selectedFacility.distanceLabel}</span>
                  <span>•</span>
                  <span className="font-bold text-primary">₹{selectedFacility.ratePerQtl} {isEn ? '/ Qtl' : '/ क्विंटल'}</span>
                  <span>•</span>
                  <span className="text-secondary font-semibold">{selectedFacility.capacityAvailable} MT Available</span>
                </p>
              </div>
            </div>

            <button
              onClick={() => onViewDetails?.(selectedFacility)}
              type="button"
              className="px-3.5 py-2 rounded-xl bg-primary text-on-primary text-xs font-bold hover:bg-primary-hover active:scale-95 transition-all shrink-0 cursor-pointer"
            >
              {isEn ? 'Book Now' : 'बुक करें'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
