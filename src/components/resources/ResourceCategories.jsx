import React from 'react';

export default function ResourceCategories({ selectedCategory, setSelectedCategory, lang }) {
  const isEn = lang === 'en';

  const categories = [
    { id: 'all', icon: 'apps', labelEn: 'All Resources', labelHi: 'सभी साधन' },
    { id: 'tractors', icon: 'agriculture', labelEn: '🚜 Tractors', labelHi: '🚜 ट्रैक्टर' },
    { id: 'labour', icon: 'engineering', labelEn: '👨‍🌾 Labour', labelHi: '👨‍🌾 मजदूर' },
    { id: 'machines', icon: 'pest_control', labelEn: '🛠 Spray Machines', labelHi: '🛠 स्प्रे मशीनें' },
    { id: 'seeds', icon: 'grain', labelEn: '🌱 Seeds', labelHi: '🌱 बीज' },
    { id: 'fertilizers', icon: 'science', labelEn: '🧪 Fertilizers', labelHi: '🧪 उर्वरक' },
  ];

  return (
    <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-3 mb-6">
      {categories.map((cat) => {
        const isActive = selectedCategory === cat.id;

        return (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`whitespace-nowrap px-4 py-2 rounded-full font-label-md text-xs sm:text-sm transition-all duration-200 shadow-2xs flex items-center gap-2 font-bold ${
              isActive
                ? 'bg-primary-container text-on-primary-container shadow-md scale-102 border border-primary-container'
                : 'bg-white text-on-surface-variant hover:bg-surface-container border border-outline-variant/60'
            }`}
          >
            <span>{isEn ? cat.labelEn : cat.labelHi}</span>
          </button>
        );
      })}
    </div>
  );
}
