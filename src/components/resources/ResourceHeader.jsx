import React from 'react';

export default function ResourceHeader({
  searchQuery,
  setSearchQuery,
  lang,
  setLang,
  onOpenAddResource
}) {
  const isEn = lang === 'en';

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
      
      {/* Title & Location Subtitle */}
      <div>
        <div className="inline-flex items-center gap-2 bg-secondary-container/60 text-on-secondary-container px-3 py-1 rounded-full text-xs font-bold mb-2">
          <span className="material-symbols-outlined text-sm material-fill">handshake</span>
          {isEn ? 'Kisan Sharing Network' : 'किसान साधन साझा मंच'}
        </div>
        <h1 className="font-display-lg text-3xl sm:text-4xl font-bold text-primary tracking-tight">
          {isEn ? 'Agricultural Resource Sharing' : 'कृषि साधन एवं मशीनरी किराया'}
        </h1>
        <p className="font-body-md text-on-surface-variant text-sm sm:text-base mt-1 flex items-center gap-1.5">
          <span className="material-symbols-outlined text-base text-primary">location_on</span>
          <span>{isEn ? 'Showing verified resources near Meerut, UP' : 'मेरठ, उ.प्र. के निकटतम सत्यापित साधन'}</span>
        </p>
      </div>

      {/* Controls: Search, Language Switch & Add Resource CTA */}
      <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
        
        {/* Search Input */}
        <div className="relative flex-1 md:w-64">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isEn ? "Search tractor, labour, seeds..." : "ट्रैक्टर, मजदूर, बीज खोजें..."}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-outline-variant rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-xs"
          />
        </div>

        {/* Language Switch */}
        <button
          onClick={() => setLang((prev) => (prev === 'en' ? 'hi' : 'en'))}
          className="px-3 py-2 bg-surface-container border border-outline-variant/60 rounded-full text-xs font-bold text-on-surface-variant hover:text-primary transition-all"
        >
          {isEn ? 'EN | हिंदी' : 'हिंदी | EN'}
        </button>

        {/* + Add Resource CTA Button */}
        <button
          onClick={onOpenAddResource}
          className="h-11 px-5 bg-primary text-on-primary rounded-[16px] font-label-md text-xs sm:text-sm font-bold hover:bg-primary-container transition-all shadow-md active:scale-95 flex items-center gap-1.5 shrink-0"
        >
          <span className="material-symbols-outlined text-lg">add_circle</span>
          <span>{isEn ? 'Add Resource' : '+ साधन जोड़ें'}</span>
        </button>

      </div>

    </div>
  );
}
