import React from 'react';
import { STORAGE_TYPES, CROPS_SUPPORTED, AMENITIES_LIST } from '../../data/storageData';

export default function StorageFilters({
  lang = 'en',
  isOpen,
  onClose,
  selectedType,
  setSelectedType,
  selectedCrop,
  setSelectedCrop,
  selectedDistance,
  setSelectedDistance,
  selectedAvailability,
  setSelectedAvailability,
  selectedMaxPrice,
  setSelectedMaxPrice,
  selectedAmenities,
  setSelectedAmenities,
  onResetFilters,
}) {
  const isEn = lang === 'en';

  if (!isOpen) return null;

  const toggleAmenity = (id) => {
    setSelectedAmenities((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4 animate-fade-in">
      <div className="bg-surface rounded-t-3xl sm:rounded-3xl w-full max-w-2xl max-h-[85vh] shadow-2xl border border-outline-variant/40 flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-outline-variant/30 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">tune</span>
            <h3 className="font-headline-sm text-base sm:text-lg font-bold text-on-surface">
              {isEn ? 'Filter Storage Facilities' : 'स्टोरेज फिल्टर करें'}
            </h3>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onResetFilters}
              type="button"
              className="text-xs font-semibold text-primary hover:underline cursor-pointer"
            >
              {isEn ? 'Reset All' : 'रीसेट करें'}
            </button>
            <button
              onClick={onClose}
              type="button"
              className="w-8 h-8 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-6 overflow-y-auto">
          {/* Storage Type */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant block mb-2">
              {isEn ? 'Storage Type' : 'स्टोरेज का प्रकार'}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {STORAGE_TYPES.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  type="button"
                  className={`p-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-all cursor-pointer ${
                    selectedType === type.id
                      ? 'bg-primary text-on-primary border-primary shadow-sm'
                      : 'bg-surface-container-low text-on-surface border-outline-variant/30 hover:bg-surface-container'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">{type.icon}</span>
                  <span className="truncate">{isEn ? type.en : type.hi}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Suitable Crop */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant block mb-2">
              {isEn ? 'Crop for Storage' : 'भंडारण हेतु फसल'}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {CROPS_SUPPORTED.map((crop) => (
                <button
                  key={crop.id}
                  onClick={() => setSelectedCrop(crop.id)}
                  type="button"
                  className={`p-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-all cursor-pointer ${
                    selectedCrop === crop.id
                      ? 'bg-primary text-on-primary border-primary shadow-sm'
                      : 'bg-surface-container-low text-on-surface border-outline-variant/30 hover:bg-surface-container'
                  }`}
                >
                  <span>{crop.emoji}</span>
                  <span className="truncate">{isEn ? crop.en : crop.hi}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Distance & Availability */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Radius Distance */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant block mb-2">
                {isEn ? 'Distance Radius' : 'खेत से दूरी'}
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[5, 10, 25, 50].map((dist) => (
                  <button
                    key={dist}
                    onClick={() => setSelectedDistance(dist)}
                    type="button"
                    className={`py-2 rounded-xl text-xs font-bold border text-center transition-all cursor-pointer ${
                      selectedDistance === dist
                        ? 'bg-primary text-on-primary border-primary'
                        : 'bg-surface-container-low text-on-surface border-outline-variant/30 hover:bg-surface-container'
                    }`}
                  >
                    {dist} km
                  </button>
                ))}
              </div>
            </div>

            {/* Availability */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant block mb-2">
                {isEn ? 'Availability Status' : 'उपलब्धता स्थिति'}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'all', en: 'All', hi: 'सभी' },
                  { id: 'available', en: 'Ready Space', hi: 'खाली जगह' },
                  { id: 'limited', en: 'Limited (<20%)', hi: 'सीमित' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedAvailability(item.id)}
                    type="button"
                    className={`py-2 px-1 rounded-xl text-xs font-semibold border text-center truncate transition-all cursor-pointer ${
                      selectedAvailability === item.id
                        ? 'bg-primary text-on-primary border-primary'
                        : 'bg-surface-container-low text-on-surface border-outline-variant/30 hover:bg-surface-container'
                    }`}
                  >
                    {isEn ? item.en : item.hi}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Max Rate Limit */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                {isEn ? 'Maximum Rental Rate' : 'अधिकतम मासिक किराया'}
              </label>
              <span className="text-xs font-bold text-primary">
                {selectedMaxPrice === 'all' ? (isEn ? 'Any Rate' : 'कोई सीमा नहीं') : `≤ ₹${selectedMaxPrice}/qtl`}
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'all', label: isEn ? 'Any' : 'सभी' },
                { id: '50', label: '≤ ₹50' },
                { id: '90', label: '≤ ₹90' },
                { id: '150', label: '≤ ₹150' },
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedMaxPrice(p.id)}
                  type="button"
                  className={`py-2 rounded-xl text-xs font-semibold border text-center transition-all cursor-pointer ${
                    selectedMaxPrice === p.id
                      ? 'bg-primary text-on-primary border-primary'
                      : 'bg-surface-container-low text-on-surface border-outline-variant/30 hover:bg-surface-container'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Amenities & Security Checklist */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant block mb-2">
              {isEn ? 'Required Facilities & Certifications' : 'आवश्यक सुविधाएं व सुरक्षा'}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {AMENITIES_LIST.map((amenity) => {
                const isChecked = selectedAmenities.includes(amenity.id);
                return (
                  <button
                    key={amenity.id}
                    onClick={() => toggleAmenity(amenity.id)}
                    type="button"
                    className={`p-2.5 rounded-xl text-left text-xs font-medium flex items-center justify-between border transition-all cursor-pointer ${
                      isChecked
                        ? 'bg-primary-fixed/30 text-primary border-primary/50'
                        : 'bg-surface-container-low text-on-surface border-outline-variant/30 hover:bg-surface-container'
                    }`}
                  >
                    <span className="flex items-center gap-2 truncate">
                      <span className="material-symbols-outlined text-[16px] text-secondary">
                        {amenity.icon}
                      </span>
                      <span className="truncate">{isEn ? amenity.en : amenity.hi}</span>
                    </span>
                    <span className="material-symbols-outlined text-[18px]">
                      {isChecked ? 'check_box' : 'check_box_outline_blank'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer CTA */}
        <div className="p-4 sm:p-5 border-t border-outline-variant/30 bg-surface-container-lowest shrink-0 flex items-center gap-3">
          <button
            onClick={onClose}
            type="button"
            className="w-full py-3 rounded-xl bg-primary text-on-primary font-bold text-sm hover:bg-primary-hover active:scale-95 shadow-md transition-all cursor-pointer"
          >
            {isEn ? 'Apply Filters & View Results' : 'फिल्टर लागू करें व परिणाम देखें'}
          </button>
        </div>
      </div>
    </div>
  );
}
