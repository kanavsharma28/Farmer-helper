import React, { useState } from 'react';

export default function MyBookingsView({
  bookings = [],
  onCancelBooking,
  onStartNewBooking,
  lang = 'en',
}) {
  const isEn = lang === 'en';
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedBookingForDetail, setSelectedBookingForDetail] = useState(null);

  const statusTabs = [
    { id: 'all', en: 'All Bookings', hi: 'सभी बुकिंग' },
    { id: 'pending', en: 'Pending', hi: 'सत्यापन बाकी' },
    { id: 'confirmed', en: 'Confirmed', hi: 'स्वीकृत' },
    { id: 'completed', en: 'Completed', hi: 'पूर्ण' },
    { id: 'cancelled', en: 'Cancelled', hi: 'रद्द' },
  ];

  const filteredBookings = bookings.filter((b) => {
    if (activeFilter === 'all') return true;
    return b.status === activeFilter;
  });

  const timelineSteps = [
    { num: 1, en: 'Request Sent', hi: 'अनुरोध भेजा गया', descEn: 'Submitted online', descHi: 'ऑनलाइन दर्ज' },
    { num: 2, en: 'Provider Reviewing', hi: 'सत्यापन जारी', descEn: 'Manager checking slot', descHi: 'प्रबंधक द्वारा जांच' },
    { num: 3, en: 'Confirmed', hi: 'स्लॉट स्वीकृत', descEn: 'Slot reserved at gate', descHi: 'गेट पर स्थान आरक्षित' },
    { num: 4, en: 'Storage Started', hi: 'भंडारण प्रारंभ', descEn: 'Weighed & stacked', descHi: 'तौल उपरांत भंडारण' },
    { num: 5, en: 'Completed', hi: 'सकुशल निकासी', descEn: 'Final clearance & exit', descHi: 'निकासी पूर्ण' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-outline-variant/30">
        <div>
          <h2 className="font-headline-md text-xl sm:text-2xl font-bold text-on-surface">
            {isEn ? 'My Storage Bookings & Requests' : 'मेरी Storage Bookings'}
          </h2>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">
            {isEn
              ? 'Track real-time approval status, weighbridge dates, and storage receipts.'
              : 'अपने भंडारण अनुरोधों की लाइव स्थिति, तौल दिनांक व रसीदें देखें।'}
          </p>
        </div>

        <button
          onClick={onStartNewBooking}
          type="button"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-primary text-on-primary font-bold text-xs sm:text-sm shadow-sm hover:bg-primary-hover active:scale-95 transition-all self-start sm:self-auto cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">add_circle</span>
          <span>{isEn ? 'Book Another Storage' : 'नया स्टोरेज बुक करें'}</span>
        </button>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {statusTabs.map((tab) => {
          const count =
            tab.id === 'all'
              ? bookings.length
              : bookings.filter((b) => b.status === tab.id).length;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              type="button"
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                activeFilter === tab.id
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'bg-surface text-on-surface-variant hover:bg-surface-container border border-outline-variant/30'
              }`}
            >
              <span>{isEn ? tab.en : tab.hi}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  activeFilter === tab.id
                    ? 'bg-white/20 text-white'
                    : 'bg-surface-container-high text-on-surface'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="bg-surface rounded-3xl p-12 text-center border border-dashed border-outline-variant/60 space-y-4">
          <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center mx-auto text-outline">
            <span className="material-symbols-outlined text-[32px]">receipt_long</span>
          </div>
          <div>
            <h3 className="font-headline-sm text-base font-bold text-on-surface">
              {isEn ? 'No storage bookings found' : 'अभी कोई booking नहीं है'}
            </h3>
            <p className="text-xs text-on-surface-variant mt-1 max-w-sm mx-auto">
              {isEn
                ? 'You do not have any bookings matching this filter. Find nearby cold storage or warehouses to send a request.'
                : 'इस फिल्टर के अनुसार कोई बुकिंग नहीं मिली। नजदीकी स्टोरेज खोजें और तुरंत अनुरोध भेजें।'}
            </p>
          </div>
          <button
            onClick={onStartNewBooking}
            type="button"
            className="px-5 py-2.5 rounded-xl bg-primary text-on-primary font-bold text-xs inline-flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">search</span>
            <span>{isEn ? 'Find Storage Now' : 'Storage खोजें'}</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((b) => {
            const isPending = b.status === 'pending' || b.status === 'reviewing';
            const isConfirmed = b.status === 'confirmed';
            const isCancelled = b.status === 'cancelled';

            return (
              <div
                key={b.id}
                className="bg-surface p-5 sm:p-6 rounded-3xl border border-outline-variant/40 shadow-sm hover:shadow-md transition-all space-y-4"
              >
                {/* Header Row */}
                <div className="flex flex-wrap items-start justify-between gap-3 pb-3 border-b border-outline-variant/20">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-sm text-primary">
                        {b.id}
                      </span>
                      <span className="text-xs text-on-surface-variant">•</span>
                      <span className="text-xs text-on-surface-variant">
                        {b.createdAt}
                      </span>
                    </div>
                    <h3 className="font-headline-md text-base sm:text-lg font-bold text-on-surface mt-0.5">
                      {isEn ? b.facilityName : b.facilityNameHi || b.facilityName}
                    </h3>
                    <p className="text-xs text-on-surface-variant flex items-center gap-1 mt-0.5">
                      <span className="material-symbols-outlined text-[14px]">location_on</span>
                      <span>{b.facilityAddress}</span>
                    </p>
                  </div>

                  {/* Status Badge */}
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1 ${
                      isPending
                        ? 'bg-tertiary-fixed text-on-tertiary-fixed'
                        : isConfirmed
                        ? 'bg-secondary-fixed text-on-secondary-fixed'
                        : isCancelled
                        ? 'bg-error-container text-on-error-container'
                        : 'bg-primary-fixed/40 text-primary'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[14px]">
                      {isPending ? 'hourglass_top' : isConfirmed ? 'verified' : isCancelled ? 'cancel' : 'check'}
                    </span>
                    <span>{isEn ? b.statusLabelEn : b.statusLabelHi}</span>
                  </span>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-surface-container-low p-3.5 rounded-2xl border border-outline-variant/30">
                  <div>
                    <span className="text-on-surface-variant block font-medium">
                      {isEn ? 'Crop & Quantity' : 'फसल व मात्रा'}
                    </span>
                    <span className="font-bold text-on-surface text-sm">
                      {b.cropEmoji} {b.crop} ({b.quantity} {b.quantityUnit})
                    </span>
                  </div>

                  <div>
                    <span className="text-on-surface-variant block font-medium">
                      {isEn ? 'Inward Date' : 'जमा दिनांक'}
                    </span>
                    <span className="font-bold text-on-surface text-sm">
                      {b.inwardDate}
                    </span>
                  </div>

                  <div>
                    <span className="text-on-surface-variant block font-medium">
                      {isEn ? 'Expected Outward' : 'निकासी दिनांक'}
                    </span>
                    <span className="font-bold text-on-surface text-sm">
                      {b.outwardDate} ({b.durationDays} {isEn ? 'Days' : 'दिन'})
                    </span>
                  </div>

                  <div>
                    <span className="text-on-surface-variant block font-medium">
                      {isEn ? 'Estimated Amount' : 'अनुमानित किराया'}
                    </span>
                    <span className="font-black text-primary text-sm">
                      ₹{b.estimatedAmount?.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <div className="text-[11px] text-on-surface-variant font-medium">
                    {isPending
                      ? (isEn ? '● Facility manager reviewing request' : '● प्रबंधक द्वारा स्लॉट उपलब्धता की समीक्षा जारी')
                      : isConfirmed
                      ? (isEn ? '✓ Inward confirmed. Bring slip to Dharam Kanta.' : '✓ स्लॉट आरक्षित। कांटा तौल हेतु पर्ची साथ लाएं।')
                      : ''}
                  </div>

                  <div className="flex items-center gap-2">
                    {isPending && (
                      <button
                        onClick={() => onCancelBooking?.(b.id)}
                        type="button"
                        className="px-3.5 py-1.5 rounded-xl bg-surface-container hover:bg-error-container hover:text-on-error-container text-on-surface-variant text-xs font-semibold transition-all cursor-pointer"
                      >
                        {isEn ? 'Cancel Request' : 'अनुरोध रद्द करें'}
                      </button>
                    )}

                    <button
                      onClick={() => setSelectedBookingForDetail(b)}
                      type="button"
                      className="px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-bold hover:bg-primary-hover active:scale-95 transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                    >
                      <span className="material-symbols-outlined text-[16px]">visibility</span>
                      <span>{isEn ? 'Track Timeline' : 'स्थिति व टाइमलाइन'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Booking Detail Modal with 5-Step Visual Timeline */}
      {selectedBookingForDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface rounded-3xl w-full max-w-xl shadow-2xl border border-outline-variant/40 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 sm:p-6 border-b border-outline-variant/30 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-primary font-mono">
                  {selectedBookingForDetail.id}
                </span>
                <h3 className="font-headline-sm text-base sm:text-lg font-bold text-on-surface">
                  {isEn ? 'Booking Status Timeline' : 'बुकिंग प्रगति एवं टाइमलाइन'}
                </h3>
              </div>
              <button
                onClick={() => setSelectedBookingForDetail(null)}
                className="w-8 h-8 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto">
              {/* Facility & Crop Info Header */}
              <div className="bg-surface-container-low p-4 rounded-2xl space-y-1">
                <h4 className="font-bold text-sm text-on-surface">
                  {selectedBookingForDetail.facilityName}
                </h4>
                <p className="text-xs text-on-surface-variant">
                  {selectedBookingForDetail.facilityAddress}
                </p>
                <p className="text-xs font-semibold text-primary pt-1">
                  {selectedBookingForDetail.crop} • {selectedBookingForDetail.quantity} {selectedBookingForDetail.quantityUnit} • ₹{selectedBookingForDetail.estimatedAmount?.toLocaleString()}
                </p>
              </div>

              {/* 5-Step Visual Timeline */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                  {isEn ? 'Progress Milestones' : 'प्रगति के चरण'}
                </h4>

                <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-outline-variant/50">
                  {timelineSteps.map((step) => {
                    const currentStep = selectedBookingForDetail.timelineStep || 2;
                    const isDone = currentStep > step.num;
                    const isCurrent = currentStep === step.num;

                    return (
                      <div key={step.num} className="relative flex items-start gap-3">
                        {/* Step Marker Dot */}
                        <div
                          className={`absolute -left-6 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition-all ${
                            isDone
                              ? 'bg-secondary border-secondary text-on-secondary'
                              : isCurrent
                              ? 'bg-primary border-primary text-on-primary ring-4 ring-primary/20 animate-pulse'
                              : 'bg-surface border-outline-variant text-outline'
                          }`}
                        >
                          {isDone ? (
                            <span className="material-symbols-outlined text-[12px]">check</span>
                          ) : (
                            step.num
                          )}
                        </div>

                        {/* Step Text */}
                        <div className="pt-0.5">
                          <p
                            className={`text-xs font-bold ${
                              isCurrent ? 'text-primary' : isDone ? 'text-on-surface' : 'text-outline'
                            }`}
                          >
                            {isEn ? step.en : step.hi}
                            {isCurrent && (
                              <span className="ml-2 text-[10px] font-semibold bg-primary-fixed/40 text-primary px-2 py-0.5 rounded-full">
                                {isEn ? 'Current' : 'वर्तमान'}
                              </span>
                            )}
                          </p>
                          <p className="text-[11px] text-on-surface-variant">
                            {isEn ? step.descEn : step.descHi}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Gate Pass Instructions */}
              <div className="p-4 rounded-2xl bg-secondary-container/20 border border-secondary/20 text-xs space-y-1">
                <p className="font-bold text-secondary flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] material-fill">info</span>
                  {isEn ? 'Important Inward Advice' : 'आवश्यक दिशा-निर्देश'}
                </p>
                <p className="text-on-surface-variant leading-relaxed">
                  {isEn
                    ? 'Bring your Kisan Aadhaar card and tractor weigh slip. Payment is calculated on certified weighbridge net metric weight.'
                    : 'खेत से फसल लाते समय किसान आधार कार्ड व वाहन साथ रखें। पूरा भुगतान कांटा तौल के शुद्ध वजन अनुसार गेट पर मान्य होगा।'}
                </p>
              </div>
            </div>

            <div className="p-4 border-t border-outline-variant/30 bg-surface-container-lowest flex justify-end">
              <button
                onClick={() => setSelectedBookingForDetail(null)}
                type="button"
                className="px-5 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-xs font-bold text-on-surface transition-all cursor-pointer"
              >
                {isEn ? 'Close' : 'बंद करें'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
