import React, { useState, useEffect } from 'react';
import { CATEGORY_ICON_MAP } from '../../data/resourceContent';

export default function EditResourceModal({ isOpen, onClose, resource, onSave, lang = 'en' }) {
  const isEn = lang === 'en';

  const [category, setCategory] = useState(resource?.category || 'tractors');
  const [title, setTitle] = useState(resource?.titleEn || '');
  const [location, setLocation] = useState(resource?.locationEn || '');
  const [price, setPrice] = useState(String(resource?.price || ''));
  const [desc, setDesc] = useState(resource?.descEn || '');
  const [isAvailable, setIsAvailable] = useState(resource?.available !== false);
  const [isLoading, setIsLoading] = useState(false);

  // Reset form when resource changes
  useEffect(() => {
    if (resource) {
      setCategory(resource.category || 'tractors');
      setTitle(resource.titleEn || '');
      setLocation(resource.locationEn || '');
      setPrice(String(resource.price || ''));
      setDesc(resource.descEn || '');
      setIsAvailable(resource.available !== false);
    }
  }, [resource]);

  if (!isOpen || !resource) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !price) {
      alert(isEn ? 'Please fill in resource title and price.' : 'कृपया साधन का नाम और किराया मूल्य दर्ज करें।');
      return;
    }
    setIsLoading(true);

    const updated = {
      ...resource,
      category,
      titleEn: title,
      titleHi: title,
      locationEn: location || resource.locationEn,
      locationHi: location || resource.locationHi,
      price: parseInt(price) || resource.price,
      descEn: desc || resource.descEn,
      descHi: desc || resource.descHi,
      available: isAvailable,
      icon: CATEGORY_ICON_MAP[category] || resource.icon,
      updatedAt: new Date().toISOString(),
    };

    setTimeout(() => {
      setIsLoading(false);
      onSave(updated);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-surface-variant space-y-5 relative max-h-[90vh] overflow-y-auto">

        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors"
        >
          <span className="material-symbols-outlined text-xl">close</span>
        </button>

        <div className="space-y-1 pr-10">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold">
            <span className="material-symbols-outlined text-sm">edit</span>
            {isEn ? 'Edit Resource Listing' : 'साधन लिस्टिंग संपादित करें'}
          </div>
          <h3 className="font-display-lg text-2xl font-bold text-on-surface">
            {isEn ? 'Update Your Listing' : 'अपनी लिस्टिंग अपडेट करें'}
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="block text-xs font-semibold text-on-surface mb-1">
              {isEn ? 'Resource Category' : 'साधन की श्रेणी'} *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full h-12 px-4 rounded-xl border border-outline-variant focus:border-primary text-sm font-medium focus:outline-none bg-white"
            >
              <option value="tractors">🚜 {isEn ? 'Tractors & Heavy Machinery' : 'ट्रैक्टर एवं भारी मशीनरी'}</option>
              <option value="labour">👨‍🌾 {isEn ? 'Farm Labour Squad' : 'कृषि मजदूर टीम'}</option>
              <option value="machines">🛠 {isEn ? 'Spray & Thresher Machines' : 'स्प्रे एवं थ्रेशर मशीनें'}</option>
              <option value="seeds">🌱 {isEn ? 'High Yield Seeds' : 'उच्च पैदावार बीज'}</option>
              <option value="fertilizers">🧪 {isEn ? 'Bio-Fertilizers & Nutrients' : 'उर्वरक एवं पोषक तत्व'}</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-on-surface mb-1">
              {isEn ? 'Resource Title / Name' : 'साधन का नाम'} *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full h-12 px-4 rounded-xl border border-outline-variant focus:border-primary text-sm font-medium focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-on-surface mb-1">
                {isEn ? 'Rate (₹)' : 'दर (₹)'} *
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                min="1"
                className="w-full h-12 px-4 rounded-xl border border-outline-variant focus:border-primary text-sm font-medium focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-on-surface mb-1">
                {isEn ? 'Location' : 'स्थान'}
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full h-12 px-4 rounded-xl border border-outline-variant focus:border-primary text-sm font-medium focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-on-surface mb-1">
              {isEn ? 'Description' : 'विवरण'}
            </label>
            <textarea
              rows="2"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="w-full p-3 rounded-xl border border-outline-variant focus:border-primary text-xs font-medium focus:outline-none"
            />
          </div>

          {/* Availability toggle */}
          <div className="flex items-center justify-between p-3 bg-surface-container-low rounded-xl border border-outline-variant/40">
            <div>
              <p className="text-xs font-semibold text-on-surface">
                {isEn ? 'Available for Booking' : 'बुकिंग के लिए उपलब्ध'}
              </p>
              <p className="text-[11px] text-on-surface-variant">
                {isAvailable
                  ? (isEn ? 'Visible and bookable' : 'दिखाई दे रहा है और बुक किया जा सकता है')
                  : (isEn ? 'Hidden from marketplace' : 'बाजार से छिपाया गया')}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsAvailable(!isAvailable)}
              className={`relative w-11 h-6 rounded-full transition-colors ${isAvailable ? 'bg-primary' : 'bg-outline-variant'}`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${isAvailable ? 'translate-x-5' : 'translate-x-0'}`}
              />
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-14 bg-primary text-on-primary font-bold text-sm rounded-[16px] hover:bg-primary-container transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>{isEn ? 'Saving...' : 'सहेजा जा रहा है...'}</span>
              </div>
            ) : (
              <>
                <span>{isEn ? 'Save Changes' : 'परिवर्तन सहेजें'}</span>
                <span className="material-symbols-outlined text-lg">save</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
