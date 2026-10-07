import React from 'react';

export default function BookingSuccessModal({
  booking,
  isOpen,
  onViewBookings,
  onBackToFinder,
  lang = 'en',
}) {
  const isEn = lang === 'en';

  if (!isOpen || !booking) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-surface rounded-3xl w-full max-w-lg shadow-2xl border border-outline-variant/40 overflow-hidden text-center p-6 sm:p-8 space-y-6 animate-scale-up">
        {/* Animated Checkmark Badge */}
        <div className="w-20 h-20 bg-secondary-container text-on-secondary-container rounded-full flex items-center justify-center mx-auto shadow-[0_8px_30px_rgba(0,110,28,0.2)]">
          <span className="material-symbols-outlined text-[48px] material-fill text-secondary">
            check_circle
          </span>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed text-xs font-bold uppercase tracking-wider">
            <span className="material-symbols-outlined text-[14px]">task_alt</span>
            {isEn ? 'Request Submitted' : 'अनुरोध दर्ज हुआ'}
          </span>
          <h2 className="font-headline-lg text-2xl sm:text-3xl font-extrabold text-on-surface">
            {isEn ? 'Booking Request Sent!' : 'बुकिंग अनुरोध भेज दिया गया!'}
          </h2>
          <p className="text-xs sm:text-sm text-on-surface-variant max-w-sm mx-auto">
            {isEn
              ? 'The facility manager will review and confirm your slot availability. You will receive an SMS confirmation on your mobile.'
              : 'Storage provider आपके अनुरोध को review करेगा। पुष्टि होने पर आपके मोबाइल पर SMS सूचना भेजी जाएगी।'}
          </p>
        </div>

        {/* Reference ID Card */}
        <div className="bg-surface-container-low p-4 rounded-2xl border border-outline-variant/30 flex items-center justify-between text-left">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-on-surface-variant block">
              {isEn ? 'Reference Number' : 'अनुरोध संदर्भ संख्या'}
            </span>
            <span className="font-mono font-black text-lg sm:text-xl text-primary tracking-wide">
              {booking.id}
            </span>
          </div>
          <span className="px-3 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-xs font-bold">
            {isEn ? 'Pending Review' : 'पुष्टि बाकी'}
          </span>
        </div>

        {/* Summary Card */}
        <div className="bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/30 text-left text-xs space-y-2">
          <div className="flex justify-between pb-1 border-b border-outline-variant/20">
            <span className="text-on-surface-variant">{isEn ? 'Storage Facility:' : 'स्टोरेज केंद्र:'}</span>
            <span className="font-bold text-on-surface">{booking.facilityName}</span>
          </div>
          <div className="flex justify-between pb-1 border-b border-outline-variant/20">
            <span className="text-on-surface-variant">{isEn ? 'Crop & Quantity:' : 'फसल व मात्रा:'}</span>
            <span className="font-bold text-on-surface capitalize">
              {booking.crop} ({booking.quantity} {booking.quantityUnit})
            </span>
          </div>
          <div className="flex justify-between pb-1 border-b border-outline-variant/20">
            <span className="text-on-surface-variant">{isEn ? 'Inward Date:' : 'जमा दिनांक:'}</span>
            <span className="font-semibold text-on-surface">{booking.inwardDate}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-on-surface-variant">{isEn ? 'Estimated Cost:' : 'अनुमानित किराया:'}</span>
            <span className="font-black text-primary text-sm">₹{booking.estimatedAmount?.toLocaleString()}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          <button
            onClick={onViewBookings}
            type="button"
            className="w-full py-3.5 px-6 rounded-2xl bg-primary hover:bg-primary-hover active:scale-95 text-on-primary font-bold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[20px]">receipt_long</span>
            <span>{isEn ? 'Track in My Bookings' : 'मेरी बुकिंग में देखें'}</span>
          </button>

          <button
            onClick={onBackToFinder}
            type="button"
            className="w-full py-3 px-6 rounded-2xl bg-surface-container hover:bg-surface-container-high text-on-surface font-semibold text-xs transition-all cursor-pointer"
          >
            {isEn ? 'Back to Storage Finder' : 'स्टोरेज खोज पर वापस जाएं'}
          </button>
        </div>
      </div>
    </div>
  );
}
