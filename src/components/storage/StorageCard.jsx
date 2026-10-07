import React from 'react';

export default function StorageCard({
  facility,
  isSelected,
  onSelect,
  onViewDetails,
  lang = 'en',
}) {
  const isEn = lang === 'en';
  const isAvailable = facility.status === 'available';
  const isLimited = facility.status === 'limited';

  return (
    <article
      onClick={() => onSelect?.(facility)}
      className={`bg-surface p-5 sm:p-6 rounded-3xl border transition-all duration-300 relative overflow-hidden group cursor-pointer ${
        isSelected
          ? 'border-primary ring-2 ring-primary/20 shadow-md bg-gradient-to-br from-surface via-surface to-primary/5'
          : 'border-outline-variant/40 hover:border-primary/50 shadow-sm hover:shadow-md'
      }`}
    >
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
        <div className="space-y-1.5 flex-1">
          {/* Badges Row */}
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                isAvailable
                  ? 'bg-secondary-container text-on-secondary-container'
                  : isLimited
                  ? 'bg-tertiary-fixed text-on-tertiary-fixed'
                  : 'bg-error-container text-on-error-container'
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">
                {isAvailable ? 'check_circle' : isLimited ? 'warning' : 'cancel'}
              </span>
              <span>{isEn ? facility.statusLabelEn : facility.statusLabelHi}</span>
            </span>

            <span className="inline-flex items-center gap-1 bg-surface-container text-on-surface px-2.5 py-0.5 rounded-full text-xs font-medium">
              {isEn ? facility.typeLabelEn : facility.typeLabelHi}
            </span>

            <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700">
              <span className="material-symbols-outlined text-[16px] text-amber-500 material-fill">star</span>
              {facility.rating} <span className="text-on-surface-variant font-normal">({facility.reviewsCount})</span>
            </span>
          </div>

          {/* Facility Name */}
          <h3 className="font-headline-md text-lg sm:text-xl font-bold text-primary group-hover:text-primary-hover transition-colors leading-snug pt-0.5">
            {isEn ? facility.name : facility.nameHi}
          </h3>

          {/* Location & Distance */}
          <p className="text-xs sm:text-sm text-on-surface-variant flex items-center gap-1.5">
            <span className="material-symbols-outlined text-primary text-[18px] shrink-0">
              location_on
            </span>
            <span>
              <strong className="text-on-surface">{facility.distanceLabel}</strong> • {facility.address}
            </span>
          </p>
        </div>

        {/* Rental Rate Badge */}
        <div className="sm:text-right bg-surface-container-low sm:bg-transparent p-3 sm:p-0 rounded-2xl shrink-0">
          <span className="text-[11px] font-semibold text-on-surface-variant block uppercase tracking-wider">
            {isEn ? 'Monthly Rate' : 'मासिक किराया'}
          </span>
          <div className="font-headline-lg text-2xl sm:text-3xl font-black text-primary leading-tight">
            ₹{facility.ratePerQtl}
          </div>
          <span className="text-[11px] text-on-surface-variant">
            {isEn ? '/ Quintal / Month' : 'प्रति क्विंटल / माह'}
          </span>
        </div>
      </div>

      {/* Metrics Spec Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 py-3 px-4 bg-surface-container-low rounded-2xl mb-4 text-center border border-outline-variant/30">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-on-surface-variant block">
            {isEn ? 'Total Space' : 'कुल क्षमता'}
          </span>
          <span className="font-bold text-xs sm:text-sm text-on-surface">
            {facility.capacityTotal.toLocaleString()} MT
          </span>
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-on-surface-variant block">
            {isEn ? 'Available Space' : 'खाली जगह'}
          </span>
          <span className={`font-black text-xs sm:text-sm ${isAvailable ? 'text-secondary' : isLimited ? 'text-tertiary' : 'text-error'}`}>
            {facility.capacityAvailable.toLocaleString()} MT ({100 - facility.occupancyPercent}%)
          </span>
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-on-surface-variant block">
            {isEn ? 'Chamber Temp' : 'कक्ष तापमान'}
          </span>
          <span className="font-bold text-xs sm:text-sm text-on-surface">
            {facility.temperatureRange}
          </span>
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-on-surface-variant block">
            {isEn ? 'Humidity / Cond' : 'नमी / परिस्थिति'}
          </span>
          <span className="font-bold text-xs sm:text-sm text-on-surface">
            {facility.humidity}
          </span>
        </div>
      </div>

      {/* Occupancy Progress Gauge */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-on-surface-variant mb-1 font-medium">
          <span>{isEn ? 'Chamber Occupancy' : 'भंडारण स्तर (Occupancy)'}</span>
          <span className="font-bold text-on-surface">{facility.occupancyPercent}% {isEn ? 'Filled' : 'भरा हुआ'} ({facility.capacityOccupied.toLocaleString()} MT)</span>
        </div>
        <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              facility.occupancyPercent >= 90
                ? 'bg-error'
                : facility.occupancyPercent >= 70
                ? 'bg-secondary'
                : 'bg-primary'
            }`}
            style={{ width: `${facility.occupancyPercent}%` }}
          />
        </div>
      </div>

      {/* Supported Crops */}
      <div className="mb-4">
        <span className="text-xs font-bold text-on-surface-variant block mb-1.5">
          {isEn ? 'Suitable Crops:' : 'अनुकूल फसलें:'}
        </span>
        <div className="flex flex-wrap gap-1.5">
          {facility.supportedCropsDisplay?.map((crop) => (
            <span
              key={crop.id}
              className="bg-surface-container px-2.5 py-1 rounded-xl text-xs font-medium text-on-surface flex items-center gap-1"
            >
              <span>{crop.emoji}</span>
              <span>{isEn ? crop.en : crop.hi}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Amenities & Badges Pills */}
      <div className="flex flex-wrap items-center gap-3 text-xs text-on-surface-variant pb-4 border-b border-outline-variant/30">
        <span className="flex items-center gap-1">
          <span className="material-symbols-outlined text-[16px] text-secondary">bolt</span>
          <span>{isEn ? '24/7 Power Backup' : '24/7 जनरेटर'}</span>
        </span>
        <span className="flex items-center gap-1">
          <span className="material-symbols-outlined text-[16px] text-secondary">videocam</span>
          <span>{isEn ? 'CCTV Monitored' : 'CCTV निगरानी'}</span>
        </span>
        <span className="flex items-center gap-1">
          <span className="material-symbols-outlined text-[16px] text-secondary">scale</span>
          <span>{isEn ? 'Dharam Kanta' : 'कंप्यूटर धर्मकांटा'}</span>
        </span>
        <span className="flex items-center gap-1">
          <span className="material-symbols-outlined text-[16px] text-secondary">shield</span>
          <span>{isEn ? 'WDRA Insured' : 'बीमित भंडार'}</span>
        </span>
      </div>

      {/* Action CTAs */}
      <div className="flex flex-col sm:flex-row items-center gap-3 pt-3">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails?.(facility);
          }}
          type="button"
          className="w-full sm:flex-1 py-3 px-5 bg-primary text-on-primary font-bold text-xs sm:text-sm rounded-xl shadow-sm hover:bg-primary-hover active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">calendar_month</span>
          <span>{isEn ? 'View Details & Book' : 'विवरण देखें व जगह बुक करें'}</span>
        </button>

        <a
          href={`tel:${facility.provider.phone}`}
          onClick={(e) => e.stopPropagation()}
          className="w-full sm:w-auto py-3 px-4 bg-surface-container-low hover:bg-surface-container text-on-surface font-semibold text-xs sm:text-sm rounded-xl transition-all flex items-center justify-center gap-1.5 border border-outline-variant/40"
        >
          <span className="material-symbols-outlined text-[18px] text-primary">call</span>
          <span>{isEn ? 'Call Facility' : 'कॉल करें'}</span>
        </a>
      </div>
    </article>
  );
}
