import React from 'react';

/**
 * ResourceCard — dual-mode card component
 *
 * MARKETPLACE MODE (default):
 *   Shows [Contact] [💬 Chat] [Book Now →] for other users' resources.
 *
 * OWNER MODE (isOwner = true):
 *   Shows [Edit] [Toggle Availability] [Delete] for the current user's own resources.
 *   Does NOT show Book Now — you can't book your own resource.
 */
export default function ResourceCard({
  resource,
  lang,
  onBook,
  onContact,
  onChat,
  onEdit,
  onDelete,
  onToggleAvailability,
  isOwner = false,
}) {
  const isEn = lang === 'en';
  const isAvailable = resource.available !== false;

  return (
    <div className={`glass-card rounded-[24px] p-6 border shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1 ${
      !isAvailable ? 'border-outline-variant/30 opacity-75' : 'border-outline-variant/60'
    }`}>

      <div className="space-y-3">

        {/* Top: Icon + Title + Badges */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-2xl shrink-0 transition-colors ${
              isOwner
                ? 'bg-secondary/10 text-secondary group-hover:bg-secondary group-hover:text-white'
                : 'bg-primary-container/10 text-primary-container group-hover:bg-primary-container group-hover:text-white'
            }`}>
              <span className="material-symbols-outlined text-2xl">{resource.icon}</span>
            </div>
            <div>
              <h3 className="font-headline-md text-base sm:text-lg font-bold text-on-surface group-hover:text-primary transition-colors leading-tight">
                {isEn ? resource.titleEn : resource.titleHi}
              </h3>
              <p className="font-caption text-xs text-on-surface-variant font-medium mt-0.5">
                {isOwner
                  ? (isEn ? '👤 Your Listing' : '👤 आपकी लिस्टिंग')
                  : (isEn ? `Owner: ${resource.ownerEn}` : `मालिक: ${resource.ownerHi}`)}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1 shrink-0">
            {/* Availability badge */}
            <span className={`px-2.5 py-0.5 rounded-full font-label-md text-[11px] font-bold border ${
              isAvailable
                ? 'bg-secondary-fixed/40 text-on-secondary-fixed-variant border-secondary/20'
                : 'bg-error/10 text-error border-error/20'
            }`}>
              {isAvailable
                ? (isEn ? 'Available' : 'उपलब्ध')
                : (isEn ? 'Unavailable' : 'अनुपलब्ध')}
            </span>
            {resource.verified && (
              <span className="text-secondary text-[11px] font-semibold flex items-center gap-0.5">
                <span className="material-symbols-outlined text-xs material-fill">verified</span>
                {isEn ? 'Verified' : 'सत्यापित'}
              </span>
            )}
            {/* Owner role badge */}
            {!isOwner && resource.ownerRole && (
              <span className="text-[10px] font-medium text-on-surface-variant/70 capitalize">
                {resource.ownerRole === 'provider'
                  ? (isEn ? 'Provider' : 'प्रदाता')
                  : (isEn ? 'Farmer' : 'किसान')}
              </span>
            )}
          </div>
        </div>

        {/* Location & Distance */}
        <div className="text-xs text-on-surface-variant flex items-center gap-2 pt-1 font-medium">
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-sm text-primary">location_on</span>
            {isEn ? resource.locationEn : resource.locationHi}
          </span>
          <span>•</span>
          <span className="text-primary font-bold">{isEn ? resource.distanceEn : resource.distanceHi}</span>
        </div>

        {/* Rating (only if has reviews) */}
        {resource.reviewsCount > 0 && (
          <div className="flex items-center gap-2 text-xs">
            <div className="flex items-center gap-1 text-tertiary font-bold bg-tertiary-fixed/30 px-2 py-0.5 rounded-md">
              <span>★</span>
              <span>{resource.rating?.toFixed(1)}</span>
            </div>
            <span className="text-on-surface-variant font-medium">
              ({resource.reviewsCount} {isEn ? 'reviews' : 'समीक्षाएं'})
            </span>
          </div>
        )}

        {/* Description */}
        <p className="text-xs text-on-surface-variant/90 leading-relaxed font-normal line-clamp-2">
          {isEn ? resource.descEn : resource.descHi}
        </p>
      </div>

      {/* ── Price & Action Footer ── */}
      <div className="pt-4 border-t border-outline-variant/30 mt-4 space-y-2.5">

        {/* Price */}
        <div>
          <span className="font-headline-md text-lg font-extrabold text-primary">
            ₹{resource.price?.toLocaleString()}
          </span>
          <span className="font-caption text-xs text-on-surface-variant ml-1 font-medium">
            {isEn ? resource.unitEn : resource.unitHi}
          </span>
        </div>

        {/* ── OWNER MODE: Edit / Toggle / Delete ── */}
        {isOwner ? (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              {/* Edit */}
              <button
                type="button"
                onClick={() => onEdit && onEdit(resource)}
                className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 rounded-xl border border-outline-variant text-on-surface hover:bg-surface-container font-label-md text-xs font-bold transition-all"
              >
                <span className="material-symbols-outlined text-[14px]">edit</span>
                {isEn ? 'Edit' : 'संपादन'}
              </button>

              {/* Toggle Availability */}
              <button
                type="button"
                onClick={() => onToggleAvailability && onToggleAvailability(resource)}
                className={`flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 rounded-xl border font-label-md text-xs font-bold transition-all ${
                  isAvailable
                    ? 'border-error/40 bg-error/8 text-error hover:bg-error/15'
                    : 'border-secondary/40 bg-secondary/8 text-secondary hover:bg-secondary/15'
                }`}
              >
                <span className="material-symbols-outlined text-[14px]">
                  {isAvailable ? 'toggle_on' : 'toggle_off'}
                </span>
                {isAvailable
                  ? (isEn ? 'Mark Off' : 'अनुपलब्ध करें')
                  : (isEn ? 'Mark On' : 'उपलब्ध करें')}
              </button>
            </div>

            {/* Delete — full width */}
            <button
              type="button"
              onClick={() => onDelete && onDelete(resource)}
              className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-error/10 text-error border border-error/30 hover:bg-error/20 font-label-md text-xs font-bold transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-sm">delete</span>
              {isEn ? 'Delete Listing' : 'लिस्टिंग हटाएं'}
            </button>
          </div>
        ) : (
          /* ── MARKETPLACE MODE: Contact / Chat / Book Now ── */
          <div className="flex flex-col gap-2">

            {/* Row 1: Contact + Chat */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onContact && onContact(resource)}
                className="flex-1 px-3 py-2 rounded-xl border border-outline-variant text-on-surface hover:bg-surface-container font-label-md text-xs font-bold transition-all"
              >
                {isEn ? 'Contact' : 'संपर्क'}
              </button>

              <button
                type="button"
                onClick={() => onChat && onChat(resource)}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-primary/40 bg-primary/8 hover:bg-primary/15 text-primary font-label-md text-xs font-bold transition-all"
                title={isEn ? 'Chat with owner on Farmer Helper' : 'मालिक से चैट करें'}
              >
                <span className="material-symbols-outlined text-[15px]">chat</span>
                <span>{isEn ? 'Chat' : 'चैट'}</span>
              </button>
            </div>

            {/* Row 2: Book Now — primary CTA (disabled if unavailable) */}
            <button
              type="button"
              onClick={() => isAvailable && onBook && onBook(resource)}
              disabled={!isAvailable}
              className={`w-full px-4 py-2.5 rounded-xl font-label-md text-xs font-bold transition-all shadow-xs active:scale-95 flex items-center justify-center gap-1.5 ${
                isAvailable
                  ? 'bg-primary-container text-on-primary hover:bg-primary'
                  : 'bg-surface-container text-on-surface-variant cursor-not-allowed opacity-60'
              }`}
            >
              <span>{isEn ? (isAvailable ? 'Book Now' : 'Unavailable') : (isAvailable ? 'बुक करें' : 'अनुपलब्ध')}</span>
              {isAvailable && <span className="material-symbols-outlined text-sm">arrow_forward</span>}
            </button>

          </div>
        )}
      </div>
    </div>
  );
}
