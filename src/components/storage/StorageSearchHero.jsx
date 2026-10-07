import React from 'react';

export default function StorageSearchHero({
  lang = 'en',
  activeView,
  setActiveView,
  activeLocation,
  onOpenLocationModal,
  searchQuery,
  setSearchQuery,
  onOpenFilterModal,
  activeFiltersCount,
  onResetFilters,
  selectedType,
  setSelectedType,
  selectedCrop,
  setSelectedCrop,
  bookingsCount = 2,
  facilitiesCount = 24,
}) {
  const isEn = lang === 'en';

  const quickChips = [
    { id: 'all-type', label: isEn ? 'All' : 'सभी', active: selectedType === 'all', onClick: () => setSelectedType('all') },
    { id: 'cold', label: isEn ? '❄️ Cold Storage' : '❄️ कोल्ड स्टोरेज', active: selectedType === 'cold', onClick: () => setSelectedType('cold') },
    { id: 'warehouse', label: isEn ? '🏢 Dry Warehouse' : '🏢 सूखा गोदाम', active: selectedType === 'warehouse', onClick: () => setSelectedType('warehouse') },
    { id: 'potato', label: isEn ? '🥔 Potato / आलू' : '🥔 आलू', active: selectedCrop === 'potato', onClick: () => setSelectedCrop(selectedCrop === 'potato' ? 'all' : 'potato') },
    { id: 'wheat', label: isEn ? '🌾 Wheat / गेहूं' : '🌾 गेहूं', active: selectedCrop === 'wheat', onClick: () => setSelectedCrop(selectedCrop === 'wheat' ? 'all' : 'wheat') },
    { id: 'apple', label: isEn ? '🍎 Fruits / फल' : '🍎 फल', active: selectedCrop === 'apple', onClick: () => setSelectedCrop(selectedCrop === 'apple' ? 'all' : 'apple') },
  ];

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Geo Location Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <nav className="flex items-center gap-2 text-xs text-on-surface-variant font-body-md">
          <span className="flex items-center gap-1 hover:text-primary transition-colors cursor-pointer" onClick={() => setActiveView('finder')}>
            <span className="material-symbols-outlined text-[16px]">home</span>
            {isEn ? 'Home' : 'होम'}
          </span>
          <span className="text-outline-variant">/</span>
          <span>{isEn ? 'Services' : 'सुविधाएं'}</span>
          <span className="text-outline-variant">/</span>
          <span className="font-semibold text-primary">
            {isEn ? 'Storage Finder' : 'स्टोरेज खोजें'}
          </span>
        </nav>

        {/* Location Pill */}
        <div className="inline-flex items-center gap-2 bg-surface px-4 py-2 rounded-full shadow-sm border border-outline-variant/40">
          <span className="material-symbols-outlined text-primary text-[18px] material-fill">
            location_on
          </span>
          <div className="text-left">
            <span className="text-[10px] uppercase tracking-wider text-on-surface-variant block leading-none font-bold">
              {isEn ? 'Current Area' : 'समीपवर्ती क्षेत्र'}
            </span>
            <span className="text-xs font-bold text-on-surface">
              {isEn ? activeLocation.en : activeLocation.hi}
            </span>
          </div>
          <button
            onClick={onOpenLocationModal}
            type="button"
            className="ml-2 px-3 py-1 bg-surface-container hover:bg-surface-container-high rounded-full text-xs text-primary font-bold transition-all cursor-pointer"
          >
            {isEn ? 'Change' : 'बदलें'}
          </button>
        </div>
      </div>

      {/* Hero Banner with Key Metrics & Bilingual Guidance */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary-container to-secondary text-on-primary p-6 sm:p-8 lg:p-10 shadow-md">
        <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-white/10 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 bg-primary-fixed text-on-primary-fixed px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide">
              <span className="material-symbols-outlined text-[16px] material-fill">verified</span>
              <span>{isEn ? 'Certified Agri Storage Network • प्रमाणित नेटवर्क' : 'प्रमाणित कृषि भंडारण नेटवर्क (WDRA Certified)'}</span>
            </div>

            <h1 className="font-headline-lg text-2xl sm:text-3xl lg:text-4xl font-black text-on-primary leading-tight">
              {isEn ? (
                <>
                  Find the Right Storage & Warehouse <br className="hidden sm:inline" />
                  <span className="text-primary-fixed">for Your Harvest</span>
                </>
              ) : (
                <>
                  अपनी फसल के लिए सही स्टोरेज खोजें <br className="hidden sm:inline" />
                  <span className="text-primary-fixed">कोल्ड स्टोरेज एवं आधुनिक वेयरहाउस</span>
                </>
              )}
            </h1>

            <p className="text-sm sm:text-base text-white/90 leading-relaxed max-w-xl font-label-md">
              {isEn
                ? 'Check real-time chamber capacity, temperature control, and government subsidized rates near your farm. Send instant booking requests with zero online payment.'
                : 'अपने नजदीकी कोल्ड स्टोरेज और वेयरहाउस में रीयल-टाइम जगह, तापमान नियंत्रण एवं न्यूनतम सरकारी रियायती दरें देखें और एक क्लिक में स्लॉट बुक करें।'}
            </p>

            {/* Quick Proof Badges */}
            <div className="flex flex-wrap gap-2.5 pt-2 text-xs">
              <div className="flex items-center gap-1.5 bg-black/25 backdrop-blur-md px-3 py-1.5 rounded-xl text-white font-medium">
                <span className="material-symbols-outlined text-secondary-fixed text-[18px]">ac_unit</span>
                <span>{isEn ? '24/7 Temp Tracking' : '24/7 टेम्परेचर ट्रैकिंग'}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-black/25 backdrop-blur-md px-3 py-1.5 rounded-xl text-white font-medium">
                <span className="material-symbols-outlined text-secondary-fixed text-[18px]">policy</span>
                <span>{isEn ? 'WDRA & e-NWR Compliant' : 'WDRA व e-NWR अनुपालन'}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-black/25 backdrop-blur-md px-3 py-1.5 rounded-xl text-white font-medium">
                <span className="material-symbols-outlined text-secondary-fixed text-[18px]">savings</span>
                <span>{isEn ? 'Subsidized Fair Rates' : 'सब्सिडी वाले रियायती रेट्स'}</span>
              </div>
            </div>
          </div>

          {/* Action Segment Tabs */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 min-w-[260px]">
            <button
              onClick={() => setActiveView('finder')}
              type="button"
              className={`flex items-center justify-between gap-3 px-5 py-3.5 rounded-2xl font-bold text-sm shadow-md transition-all cursor-pointer ${
                activeView === 'finder'
                  ? 'bg-surface text-primary'
                  : 'bg-black/25 text-on-primary hover:bg-black/35 backdrop-blur-md'
              }`}
            >
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px]">near_me</span>
                <span>{isEn ? 'Find Nearby Storage' : 'नजदीकी स्टोरेज खोजें'}</span>
              </span>
              <span className="bg-primary-fixed text-on-primary-fixed px-2.5 py-0.5 rounded-full text-xs font-black">
                {facilitiesCount}
              </span>
            </button>

            <button
              onClick={() => setActiveView('bookings')}
              type="button"
              className={`flex items-center justify-between gap-3 px-5 py-3.5 rounded-2xl font-bold text-sm shadow-md transition-all cursor-pointer ${
                activeView === 'bookings'
                  ? 'bg-surface text-primary'
                  : 'bg-black/25 text-on-primary hover:bg-black/35 backdrop-blur-md'
              }`}
            >
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px]">receipt_long</span>
                <span>{isEn ? 'My Bookings' : 'मेरी बुकिंग'}</span>
              </span>
              <span className="bg-secondary-container text-on-secondary-container px-2.5 py-0.5 rounded-full text-xs font-black">
                {bookingsCount} {isEn ? 'Active' : 'सक्रिय'}
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Dynamic Search & Multi-Filter Control Hub (Shown in Finder View) */}
      {activeView === 'finder' && (
        <section className="bg-surface p-5 sm:p-6 rounded-3xl border border-outline-variant/40 shadow-sm space-y-4">
          {/* Top Search Input Row */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-[22px]">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isEn ? 'Search storage name, location (Dadri, Badalpur) or crop (Potato, Wheat)...' : 'Storage, location या crop खोजें (जैसे: कोल्ड स्टोरेज, आलू, गेहूं)...'}
                className="w-full pl-12 pr-10 py-3.5 bg-surface-container-low rounded-2xl font-body-md text-sm text-on-surface placeholder:text-outline border border-outline-variant/30 focus:outline-none focus:border-primary focus:bg-surface transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  type="button"
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface p-1"
                >
                  <span className="material-symbols-outlined text-[18px]">cancel</span>
                </button>
              )}
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenFilterModal}
                type="button"
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3.5 bg-primary text-on-primary rounded-2xl font-bold text-xs sm:text-sm shadow-sm hover:bg-primary-hover active:scale-95 transition-all cursor-pointer whitespace-nowrap"
              >
                <span className="material-symbols-outlined text-[18px]">tune</span>
                <span>{isEn ? 'Filters' : 'फिल्टर'}</span>
                {activeFiltersCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-black text-[11px] flex items-center justify-center ml-0.5">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              {activeFiltersCount > 0 && (
                <button
                  onClick={onResetFilters}
                  type="button"
                  className="px-4 py-3.5 bg-surface-container-low hover:bg-surface-container rounded-2xl text-xs font-semibold text-on-surface-variant transition-all cursor-pointer whitespace-nowrap"
                >
                  {isEn ? 'Clear All' : 'रीसेट'}
                </button>
              )}
            </div>
          </div>

          {/* Quick Filter Horizontal Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {quickChips.map((chip) => (
              <button
                key={chip.id}
                onClick={chip.onClick}
                type="button"
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all cursor-pointer ${
                  chip.active
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'bg-surface-container-low hover:bg-surface-container text-on-surface-variant border border-outline-variant/30'
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
