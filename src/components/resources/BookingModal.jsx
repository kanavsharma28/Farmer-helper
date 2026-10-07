import React, { useState } from 'react';

export default function BookingModal({ resource, isOpen, onClose, lang = 'en' }) {
  const isEn = lang === 'en';

  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [durationDays, setDurationDays] = useState(2);
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen || !resource) return null;

  const totalPrice = (resource?.price || 0) * Math.max(1, durationDays);

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 1800);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-surface-variant space-y-6 relative max-h-[90vh] overflow-y-auto">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors"
        >
          <span className="material-symbols-outlined text-xl">close</span>
        </button>

        {/* Modal Title */}
        <div className="space-y-1 pr-10">
          <div className="inline-flex items-center gap-2 bg-primary-container/10 text-primary-container px-3 py-1 rounded-full text-xs font-bold">
            <span className="material-symbols-outlined text-sm">event_available</span>
            {isEn ? 'Resource Rental Booking' : 'साधन किराया बुकिंग'}
          </div>
          <h3 className="font-display-lg text-2xl font-bold text-on-surface">
            {isEn ? resource.titleEn : resource.titleHi}
          </h3>
          <p className="font-body-md text-xs text-on-surface-variant">
            {isEn ? `Provided by ${resource.ownerEn} • ${resource.locationEn}` : `${resource.ownerHi} द्वारा संचालित • ${resource.locationHi}`}
          </p>
        </div>

        {isSuccess ? (
          <div className="py-8 text-center space-y-3 animate-fadeIn">
            <div className="w-16 h-16 bg-secondary/20 text-secondary rounded-full flex items-center justify-center mx-auto text-3xl font-bold">
              ✓
            </div>
            <h4 className="font-bold text-xl text-primary-container">
              {isEn ? 'Booking Request Sent Successfully!' : 'बुकिंग अनुरोध सफलतापूर्वक भेजा गया!'}
            </h4>
            <p className="text-xs text-on-surface-variant max-w-xs mx-auto">
              {isEn
                ? `Owner ${resource.ownerEn} has been notified and will call you on your mobile number.`
                : `मालिक ${resource.ownerHi} को सूचित कर दिया गया है और वे शीघ्र ही आपसे संपर्क करेंगे।`}
            </p>
          </div>
        ) : (
          <form onSubmit={handleBookingSubmit} className="space-y-4">
            
            {/* Start Date */}
            <div>
              <label className="block text-xs font-semibold text-on-surface mb-1">
                {isEn ? 'Rental Start Date' : 'किराया शुरू होने की तारीख'}
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full h-12 px-4 rounded-xl border border-outline-variant focus:border-primary focus:ring-primary text-sm font-medium focus:outline-none"
                required
              />
            </div>

            {/* Duration Days */}
            <div>
              <label className="block text-xs font-semibold text-on-surface mb-1">
                {isEn ? 'Duration (Days)' : 'अवधि (दिनों में)'}
              </label>
              <input
                type="number"
                min="1"
                max="30"
                value={durationDays}
                onChange={(e) => setDurationDays(parseInt(e.target.value) || 1)}
                className="w-full h-12 px-4 rounded-xl border border-outline-variant focus:border-primary focus:ring-primary text-sm font-medium focus:outline-none"
                required
              />
            </div>

            {/* Special Instructions */}
            <div>
              <label className="block text-xs font-semibold text-on-surface mb-1">
                {isEn ? 'Special Instructions / Requirements (Optional)' : 'विशेष निर्देश / आवश्यकताएं (वैकल्पिक)'}
              </label>
              <textarea
                rows="2"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={isEn ? "e.g., Require delivery at North Plot farm..." : "जैसे, उत्तर खेत पर डिलीवरी चाहिए..."}
                className="w-full p-3 rounded-xl border border-outline-variant focus:border-primary focus:ring-primary text-xs font-medium focus:outline-none"
              ></textarea>
            </div>

            {/* Total Cost Summary Card */}
            <div className="bg-surface-container-low p-4 rounded-2xl border border-outline-variant/50 flex justify-between items-center">
              <div>
                <span className="text-xs text-on-surface-variant block font-medium">
                  {isEn ? 'Estimated Total Amount' : 'अनुमानित कुल राशि'}
                </span>
                <span className="text-xs text-secondary font-bold">
                  ₹{resource.price} x {durationDays} {isEn ? 'days' : 'दिन'}
                </span>
              </div>
              <span className="font-display-lg text-2xl font-extrabold text-primary">
                ₹{totalPrice.toLocaleString()}
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 bg-primary-container text-on-primary font-bold text-sm rounded-[16px] hover:bg-primary transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>{isEn ? 'Sending Request...' : 'अभिषेक भेजा जा रहा है...'}</span>
                </div>
              ) : (
                <>
                  <span>{isEn ? 'Request Booking' : 'बुकिंग का अनुरोध करें'}</span>
                  <span className="material-symbols-outlined text-lg">check_circle</span>
                </>
              )}
            </button>

          </form>
        )}

      </div>
    </div>
  );
}
