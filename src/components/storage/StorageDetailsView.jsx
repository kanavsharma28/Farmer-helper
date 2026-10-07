import React, { useState } from 'react';
import BookingRequestForm from './BookingRequestForm';

export default function StorageDetailsView({
  facility,
  onBack,
  onSubmitBooking,
  lang = 'en',
}) {
  const isEn = lang === 'en';
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const images = facility.images && facility.images.length > 0 ? facility.images : [
    'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&w=800&q=80',
  ];

  const galleryLabels = [
    isEn ? 'Chamber Unit' : 'चैम्बर यूनिट',
    isEn ? 'Weighbridge' : 'धर्मकांटा',
    isEn ? 'Loading Bay' : 'लोडिंग बे',
    isEn ? 'Quality Lab' : 'जांच लैब',
  ];

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: facility.name,
        text: `${facility.name} - ${facility.typeLabelEn} in ${facility.area}. Available: ${facility.capacityAvailable} MT.`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      alert(isEn ? 'Link copied to clipboard!' : 'लिंक कॉपी हो गया!');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Breadcrumbs & Quick Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center flex-wrap gap-2 text-on-surface-variant text-xs sm:text-sm font-body-md">
          <span onClick={onBack} className="hover:text-primary transition-colors flex items-center gap-1 cursor-pointer">
            <span className="material-symbols-outlined text-[16px]">home</span>
            {isEn ? 'Home' : 'होम'}
          </span>
          <span className="text-outline-variant">/</span>
          <span onClick={onBack} className="hover:text-primary transition-colors cursor-pointer">
            {isEn ? 'Storage Finder' : 'स्टोरेज खोजें'}
          </span>
          <span className="text-outline-variant">/</span>
          <span className="text-on-surface font-bold truncate max-w-[200px] sm:max-w-xs">
            {isEn ? facility.name : facility.nameHi}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            type="button"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs sm:text-sm font-bold transition-all shadow-sm cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            <span>{isEn ? 'Back to Storage List' : 'सूची पर वापस'}</span>
          </button>

          <div className="flex items-center gap-1 bg-surface p-1 rounded-xl shadow-sm border border-outline-variant/30">
            <button
              onClick={handleShare}
              type="button"
              className="p-1.5 text-on-surface-variant hover:text-primary transition-colors rounded-lg hover:bg-surface-container cursor-pointer"
              title={isEn ? 'Share Facility' : 'साझा करें'}
            >
              <span className="material-symbols-outlined text-[18px]">share</span>
            </button>
            <button
              onClick={() => window.print()}
              type="button"
              className="p-1.5 text-on-surface-variant hover:text-primary transition-colors rounded-lg hover:bg-surface-container cursor-pointer"
              title={isEn ? 'Print Rate Sheet' : 'प्रिंट करें'}
            >
              <span className="material-symbols-outlined text-[18px]">print</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Column (~58%) & Right Sticky Column (~42%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT / CENTER COLUMN */}
        <div className="lg:col-span-7 space-y-6">
          {/* Facility Header Banner Card */}
          <div className="bg-surface p-6 sm:p-8 rounded-3xl shadow-sm border border-outline-variant/40 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container text-xs font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px]">verified</span>
                {isEn ? 'Verified Partner' : 'प्रमाणित पार्टनर'}
              </span>
              <span className="px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed-variant text-xs font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px]">assured_workload</span>
                WDRA Reg: #WDRA-UP-8842
              </span>
              <span className="px-3 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-xs font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px]">bolt</span>
                {isEn ? '24/7 Power Backup' : '24/7 सौर व जनरेटर बैकअप'}
              </span>
            </div>

            <div>
              <h1 className="font-headline-lg text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
                {facility.name}
              </h1>
              <p className="font-headline-md text-base sm:text-lg text-primary font-semibold mt-0.5">
                {facility.nameHi}
              </p>
              <div className="flex items-center gap-1.5 mt-2 text-on-surface-variant text-xs sm:text-sm">
                <span className="material-symbols-outlined text-primary text-[18px] shrink-0">
                  pin_drop
                </span>
                <span>{facility.address}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-outline-variant/30">
              <div className="flex items-center gap-1.5 bg-surface-container px-3 py-1.5 rounded-xl">
                <span className="material-symbols-outlined text-amber-500 text-[18px] material-fill">star</span>
                <span className="text-xs sm:text-sm text-on-surface font-bold">{facility.rating}</span>
                <span className="text-xs text-on-surface-variant font-medium">({facility.reviewsCount} {isEn ? 'Farmer Reviews' : 'किसान समीक्षाएं'})</span>
              </div>

              <div className="text-xs text-secondary font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
                <span>{isEn ? 'Accepting Inward Harvest (Fast Unload)' : 'नई फसल का भंडारण खुला है'}</span>
              </div>
            </div>
          </div>

          {/* Photo Gallery with Interactive Thumbnails */}
          <div className="bg-surface p-5 sm:p-6 rounded-3xl shadow-sm border border-outline-variant/40 space-y-4">
            {/* Main Featured Image */}
            <div className="relative w-full h-72 sm:h-96 rounded-2xl overflow-hidden shadow-md group">
              <img
                src={images[selectedImageIndex] || images[0]}
                alt={facility.name}
                className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 pointer-events-none"></div>

              <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[15px]">photo_camera</span>
                <span>{selectedImageIndex + 1} / {images.length}</span>
              </div>

              <div className="absolute bottom-4 left-4 right-4 text-white">
                <p className="font-headline-md text-base sm:text-lg font-bold drop-shadow-sm">
                  {galleryLabels[selectedImageIndex] || galleryLabels[0]}
                </p>
                <p className="text-xs text-white/80 drop-shadow-sm">
                  {facility.name} • {facility.temperatureRange}
                </p>
              </div>
            </div>

            {/* Gallery Thumbnails */}
            <div className="grid grid-cols-4 gap-2.5">
              {images.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`cursor-pointer rounded-xl overflow-hidden h-18 sm:h-22 relative border-2 transition-all ${
                    selectedImageIndex === idx
                      ? 'border-primary ring-2 ring-primary/40 scale-98 shadow-sm'
                      : 'border-outline-variant/40 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
                  <span className="absolute bottom-1 left-1 font-caption text-[10px] text-white bg-black/70 px-1 rounded truncate max-w-[90%]">
                    {galleryLabels[idx] || `View ${idx + 1}`}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Live Chamber Capacity & Status Card */}
          <div className="bg-surface p-6 sm:p-8 rounded-3xl shadow-sm border border-outline-variant/40 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-outline-variant/30">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-ping"></span>
                  <h2 className="font-headline-md text-lg sm:text-xl font-bold text-on-surface">
                    {isEn ? 'Live Chamber Capacity' : 'रियल-टाइम चैम्बर क्षमता स्थिति'}
                  </h2>
                </div>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  {isEn ? 'Verified with Mandi IoT Sensors' : 'मंडी IoT सेंसर्स द्वारा प्रमाणित'}
                </p>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-on-surface-variant text-xs">
                <span className="material-symbols-outlined text-[15px]">schedule</span>
                <span>{isEn ? 'Last updated: Today' : 'अंतिम अपडेट: आज'}</span>
              </div>
            </div>

            {/* Capacity Progress Gauge */}
            <div className="p-5 rounded-2xl bg-surface-container-low space-y-4 border border-outline-variant/30">
              <div className="flex items-end justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-wider font-bold text-on-surface-variant">
                    {isEn ? 'Total Space Capacity' : 'कुल भंडारण क्षमता'}
                  </span>
                  <p className="font-headline-lg text-2xl sm:text-3xl font-black text-on-surface leading-none mt-0.5">
                    {facility.capacityTotal.toLocaleString()} <span className="text-sm font-normal text-on-surface-variant">Metric Tonnes (MT)</span>
                  </p>
                </div>
                <div className="text-right">
                  <span className="inline-block px-3 py-1 rounded-full bg-secondary text-on-secondary text-xs font-bold">
                    {facility.capacityAvailable.toLocaleString()} MT {isEn ? 'Available' : 'खाली है'}
                  </span>
                </div>
              </div>

              <div className="w-full bg-surface-container-high h-3 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    facility.occupancyPercent >= 90 ? 'bg-error' : 'bg-secondary'
                  }`}
                  style={{ width: `${facility.occupancyPercent}%` }}
                />
              </div>

              <div className="flex justify-between text-xs text-on-surface-variant font-medium">
                <span>{facility.capacityOccupied.toLocaleString()} MT {isEn ? 'Occupied' : 'भरा हुआ'} ({facility.occupancyPercent}%)</span>
                <span>{facility.capacityAvailable.toLocaleString()} MT {isEn ? 'Available' : 'उपलब्ध'} ({100 - facility.occupancyPercent}%)</span>
              </div>
            </div>

            {/* Specs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30 flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-primary-container text-on-primary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[22px]">thermostat</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-on-surface-variant block">
                    {isEn ? 'Temperature Range' : 'कक्ष तापमान रेंज'}
                  </span>
                  <p className="font-bold text-sm text-on-surface mt-0.5">{facility.temperatureRange}</p>
                  <p className="text-[11px] text-on-surface-variant">{isEn ? 'Automated digital zone sensors' : 'स्वचालित डिजिटल सेंसर्स'}</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30 flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-primary-container text-on-primary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[22px]">humidity_mid</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-on-surface-variant block">
                    {isEn ? 'Humidity Control' : 'नमी स्तर (Humidity)'}
                  </span>
                  <p className="font-bold text-sm text-on-surface mt-0.5">{facility.humidity}</p>
                  <p className="text-[11px] text-on-surface-variant">{isEn ? 'Controlled atomizers installed' : 'मिस्ट एटोमाइजर स्थापित'}</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30 flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-primary-container text-on-primary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[22px]">shelves</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-on-surface-variant block">
                    {isEn ? 'Packing Method' : 'पैकिंग व रैकिंग'}
                  </span>
                  <p className="font-bold text-sm text-on-surface mt-0.5">{facility.packingMethod}</p>
                  <p className="text-[11px] text-on-surface-variant">{isEn ? 'Airflow pallet gaps maintained' : 'हवादार पैलेट रैक व्यवस्था'}</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30 flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-primary-container text-on-primary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[22px]">date_range</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-on-surface-variant block">
                    {isEn ? 'Allowed Duration' : 'अनुमत अवधि'}
                  </span>
                  <p className="font-bold text-sm text-on-surface mt-0.5">{facility.allowedDuration}</p>
                  <p className="text-[11px] text-on-surface-variant">{isEn ? 'Flexible renewals & liquidation' : 'लचीला नवीनीकरण उपलब्ध'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Features & Security Checklist */}
          <div className="bg-surface p-6 sm:p-8 rounded-3xl shadow-sm border border-outline-variant/40 space-y-4">
            <div>
              <h2 className="font-headline-md text-lg sm:text-xl font-bold text-on-surface">
                {isEn ? 'Features & Security Assurances' : 'सुविधाएं एवं सुरक्षा गारंटी'}
              </h2>
              <p className="text-xs text-on-surface-variant mt-0.5">
                {isEn ? 'Verified parameters inspected by Agriculture Logistics Board' : 'कृषि लॉजिस्टिक्स बोर्ड द्वारा प्रमाणित मानक'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { en: '24x7 CCTV & Armed Guard Security', hi: '24x7 CCTV व सुरक्षा गार्ड' },
                { en: '100 MT Automated Digital Dharam Kanta', hi: '100 टन स्वचालित धर्मकांटा' },
                { en: 'Hydraulic Forklift Loading / Unloading', hi: 'हाइड्रॉलिक फोर्कलिफ्ट लोडिंग बे' },
                { en: 'Fire Safety & Automated CO2 Systems', hi: 'अग्निशमन सुरक्षा व CO2 सिस्टम' },
                { en: 'Certified Pest & Rodent Fumigation', hi: 'नियमित कीट व दीमक नियंत्रण' },
                { en: 'Agricultural Insurance & Claim Support', hi: '100% बीमित भंडार व क्लेम सहायता' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2.5 p-3 rounded-xl bg-surface-container-low border border-outline-variant/20">
                  <span className="material-symbols-outlined text-secondary text-[20px] material-fill">
                    check_circle
                  </span>
                  <span className="text-xs font-semibold text-on-surface">
                    {isEn ? item.en : item.hi}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Storage Provider & Operator Card */}
          <div className="bg-surface p-6 sm:p-8 rounded-3xl shadow-sm border border-outline-variant/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-surface-container flex items-center justify-center text-primary shrink-0 shadow-sm">
                <span className="material-symbols-outlined text-[32px]">storefront</span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-headline-md text-base sm:text-lg font-bold text-on-surface">
                    {facility.provider.name}
                  </h4>
                  <span className="material-symbols-outlined text-primary text-[18px] material-fill">
                    verified
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  {isEn ? 'Facility Manager:' : 'प्रबंधक:'} <span className="font-semibold text-on-surface">{facility.provider.manager}</span> ({facility.provider.experience})
                </p>
                <p className="text-xs text-on-surface-variant flex items-center gap-1 mt-1">
                  <span className="material-symbols-outlined text-[15px] text-secondary">phone</span>
                  <span>{facility.provider.phone} (Verified)</span>
                </p>
              </div>
            </div>

            <div className="flex flex-wrap sm:flex-col gap-2 w-full sm:w-auto shrink-0">
              <a
                href={`tel:${facility.provider.phone}`}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-on-primary text-xs font-bold shadow-sm hover:bg-primary-hover active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined text-[16px]">call</span>
                <span>{isEn ? 'Call Manager' : 'कॉल करें'}</span>
              </a>

              <a
                href={`https://wa.me/${facility.provider.phone.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold transition-all border border-outline-variant/30"
              >
                <span className="material-symbols-outlined text-[16px] text-secondary">chat</span>
                <span>WhatsApp</span>
              </a>

              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(facility.address)}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-1 text-xs font-bold text-primary hover:underline pt-1"
              >
                <span className="material-symbols-outlined text-[16px]">near_me</span>
                <span>{isEn ? `Directions (${facility.distanceLabel})` : `रास्ता देखें (${facility.distanceKm} किमी)`}</span>
              </a>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: STICKY BOOKING REQUEST FORM */}
        <div className="lg:col-span-5 lg:sticky lg:top-20">
          <BookingRequestForm
            facility={facility}
            lang={lang}
            onSubmitBooking={onSubmitBooking}
            onCancel={onBack}
          />
        </div>
      </div>
    </div>
  );
}
