import React from 'react';
import { nearbyResources, translations } from '../data/content';

export default function NearbyHelpModal({ isOpen, onClose, lang }) {
  if (!isOpen) return null;

  const isEn = lang === 'en';
  const t = translations[lang] || translations.en;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-surface-variant space-y-6 relative max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors"
        >
          <span className="material-symbols-outlined text-xl">close</span>
        </button>

        {/* Modal Header */}
        <div className="space-y-2 pr-10">
          <div className="inline-flex items-center gap-2 bg-secondary/10 text-secondary px-3 py-1 rounded-full text-xs font-bold">
            <span className="material-symbols-outlined text-sm material-fill">near_me</span>
            GPS Location Active
          </div>
          <h3 className="font-display-lg text-2xl sm:text-3xl font-bold text-on-surface">
            {t.nearbyModalTitle}
          </h3>
          <p className="font-body-md text-on-surface-variant text-sm">
            {t.nearbyModalSub}
          </p>
        </div>

        {/* Resources List */}
        <div className="space-y-4">
          {nearbyResources.map((res) => (
            <div
              key={res.id}
              className="p-5 rounded-2xl bg-surface-container-low border border-surface-variant/80 hover:border-primary/40 transition-all space-y-3"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h4 className="font-bold text-base text-on-surface">
                    {isEn ? res.nameEn : res.nameHi}
                  </h4>
                  <div className="text-xs text-secondary font-semibold mt-0.5">
                    {isEn ? res.typeEn : res.typeHi}
                  </div>
                  <div className="text-xs text-on-surface-variant mt-1 flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">location_on</span>
                    {isEn ? res.addressEn : res.addressHi}
                  </div>
                </div>
                <span className="bg-primary-container/10 text-primary-container text-xs font-bold px-3 py-1 rounded-full shrink-0">
                  {isEn ? res.distanceEn : res.distanceHi}
                </span>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <a
                  href={`tel:${res.phone}`}
                  className="flex-1 bg-primary-container text-on-primary-container hover:bg-primary hover:text-white py-2.5 px-4 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm">call</span>
                  {t.callBtn} ({res.phone})
                </a>
                <button
                  onClick={() => alert(`Opening Navigation to ${isEn ? res.nameEn : res.nameHi}...`)}
                  className="bg-white border border-outline/40 hover:bg-surface-container py-2.5 px-4 rounded-xl text-xs font-bold text-on-surface transition-colors flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm">directions</span>
                  {t.directionsBtn}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer info */}
        <div className="pt-2 text-center text-xs text-on-surface-variant font-medium">
          {isEn ? 'Showing resources within 10 km radius' : '10 किमी के दायरे में साधन दिखाए जा रहे हैं'}
        </div>

      </div>
    </div>
  );
}
