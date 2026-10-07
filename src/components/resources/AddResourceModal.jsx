import React, { useState } from 'react';
import { CATEGORY_ICON_MAP } from '../../data/resourceContent';

export default function AddResourceModal({ isOpen, onClose, onAddSuccess, lang = 'en', currentUser }) {
  const isEn = lang === 'en';

  const [category, setCategory] = useState('tractors');
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState(currentUser?.location || '');
  const [price, setPrice] = useState('');
  const [priceUnit, setPriceUnit] = useState('day');
  const [desc, setDesc] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const unitOptions = [
    { value: 'day',        enLabel: '/day',         hiLabel: '/दिन' },
    { value: 'hour',       enLabel: '/hour',        hiLabel: '/घंटा' },
    { value: 'worker/day', enLabel: '/worker/day',  hiLabel: '/मजदूर/दिन' },
    { value: 'bag',        enLabel: '/bag',         hiLabel: '/बोरी' },
    { value: 'kg',         enLabel: '/10kg pack',   hiLabel: '/10किग्रा पैकेट' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !price) {
      alert(isEn ? 'Please fill in resource title and price.' : 'कृपया साधन का नाम और किराया मूल्य दर्ज करें।');
      return;
    }

    setIsLoading(true);

    const ownerName = currentUser?.name || 'Farmer';
    const ownerId   = currentUser?.id   || 'user_farmer_01';
    const ownerRole = currentUser?.role  || 'farmer';
    const unitObj   = unitOptions.find((u) => u.value === priceUnit) || unitOptions[0];

    const newResource = {
      id:        `res_user_${Date.now()}`,
      ownerId,
      ownerRole,
      ownerName,
      ownerPhone: currentUser?.phone || '',
      category,
      titleEn:   title,
      titleHi:   title,
      ownerEn:   ownerName,
      ownerHi:   ownerName,
      locationEn: location || 'Meerut, UP',
      locationHi: location || 'मेरठ, उ.प्र.',
      distanceEn: 'Nearby',
      distanceHi: 'पास में',
      price:     parseInt(price) || 1000,
      unitEn:    unitObj.enLabel,
      unitHi:    unitObj.hiLabel,
      rating:    5.0,
      reviewsCount: 0,
      icon:      CATEGORY_ICON_MAP[category] || 'agriculture',
      verified:  false,
      available: isAvailable,
      descEn:    desc || 'Newly listed resource available for use.',
      descHi:    desc || 'किराए के लिए उपलब्ध नया साधन।',
      createdAt: new Date().toISOString(),
      isSeed:    false,
    };

    setTimeout(() => {
      setIsLoading(false);
      onAddSuccess(newResource);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-surface-variant space-y-5 relative max-h-[90vh] overflow-y-auto">

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors"
        >
          <span className="material-symbols-outlined text-xl">close</span>
        </button>

        {/* Header */}
        <div className="space-y-1 pr-10">
          <div className="inline-flex items-center gap-2 bg-secondary/10 text-secondary px-3 py-1 rounded-full text-xs font-bold">
            <span className="material-symbols-outlined text-sm">add_circle</span>
            {isEn ? 'Share Your Equipment' : 'अपना साधन किराए पर दें'}
          </div>
          <h3 className="font-display-lg text-2xl font-bold text-on-surface">
            {isEn ? 'Post a Resource Listing' : 'नया साधन सूचीबद्ध करें'}
          </h3>
          <p className="font-body-md text-xs text-on-surface-variant">
            {isEn
              ? 'List your tractor, farm machinery, seeds, or labour squad for nearby users to rent or use.'
              : 'अपने ट्रैक्टर, कृषि मशीनरी, बीज या मजदूर टीम को पास के उपयोगकर्ताओं के लिए उपलब्ध कराएं।'}
          </p>
          {/* Auto-populated owner badge */}
          <div className="mt-2 inline-flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1.5 rounded-xl text-xs font-semibold">
            <span className="material-symbols-outlined text-sm">person</span>
            {isEn ? `Listing as: ${currentUser?.name || 'You'}` : `नाम से: ${currentUser?.name || 'आप'}`}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Category */}
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

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-on-surface mb-1">
              {isEn ? 'Resource Title / Name' : 'साधन का नाम'} *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={isEn ? 'e.g., Mahindra 575 DI Tractor' : 'जैसे, महिंद्रा 575 डीआई ट्रैक्टर'}
              className="w-full h-12 px-4 rounded-xl border border-outline-variant focus:border-primary text-sm font-medium focus:outline-none"
              required
            />
          </div>

          {/* Price + Unit */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-on-surface mb-1">
                {isEn ? 'Rate (₹)' : 'दर (₹)'} *
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="1200"
                min="1"
                className="w-full h-12 px-4 rounded-xl border border-outline-variant focus:border-primary text-sm font-medium focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-on-surface mb-1">
                {isEn ? 'Price Unit' : 'मूल्य इकाई'}
              </label>
              <select
                value={priceUnit}
                onChange={(e) => setPriceUnit(e.target.value)}
                className="w-full h-12 px-4 rounded-xl border border-outline-variant focus:border-primary text-sm font-medium focus:outline-none bg-white"
              >
                {unitOptions.map((u) => (
                  <option key={u.value} value={u.value}>
                    {isEn ? u.enLabel : u.hiLabel}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs font-semibold text-on-surface mb-1">
              {isEn ? 'Village / Location' : 'गांव / स्थान'}
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder={isEn ? 'Khanna Road, Meerut' : 'खन्ना रोड, मेरठ'}
              className="w-full h-12 px-4 rounded-xl border border-outline-variant focus:border-primary text-sm font-medium focus:outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-on-surface mb-1">
              {isEn ? 'Description & Condition' : 'विवरण एवं स्थिति'}
            </label>
            <textarea
              rows="2"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder={isEn ? 'Describe equipment condition, attachments included...' : 'साधन की स्थिति और साथ में मिलने वाले सामान की जानकारी...'}
              className="w-full p-3 rounded-xl border border-outline-variant focus:border-primary text-xs font-medium focus:outline-none"
            />
          </div>

          {/* Availability toggle */}
          <div className="flex items-center justify-between p-3 bg-surface-container-low rounded-xl border border-outline-variant/40">
            <div>
              <p className="text-xs font-semibold text-on-surface">
                {isEn ? 'Mark as Available' : 'उपलब्ध के रूप में चिह्नित करें'}
              </p>
              <p className="text-[11px] text-on-surface-variant">
                {isEn ? 'Visible and bookable in the marketplace' : 'बाजार में दिखाई देगा और बुक किया जा सकेगा'}
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

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-14 bg-primary text-on-primary font-bold text-sm rounded-[16px] hover:bg-primary-container transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>{isEn ? 'Publishing...' : 'प्रकाशित हो रहा है...'}</span>
              </div>
            ) : (
              <>
                <span>{isEn ? 'Publish Listing' : 'साधन सूची प्रकाशित करें'}</span>
                <span className="material-symbols-outlined text-lg">check_circle</span>
              </>
            )}
          </button>

        </form>
      </div>
    </div>
  );
}
