import React, { useState } from 'react';

export default function TrainingEnrollModal({
  program,
  isOpen,
  onClose
}) {
  const [name, setName] = useState('Aman Verma');
  const [mobile, setMobile] = useState('9876543210');
  const [email, setEmail] = useState('aman.verma@agri.edu');
  const [isSuccess, setIsSuccess] = useState(false);
  const [bookingPass, setBookingPass] = useState(null);

  if (!isOpen || !program) return null;

  const handleEnroll = (e) => {
    e.preventDefault();
    const passCode = `TR-${Date.now().toString().slice(-5)}`;
    setBookingPass(passCode);
    setIsSuccess(true);
  };

  const resetAndClose = () => {
    setIsSuccess(false);
    setBookingPass(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={resetAndClose}
      />

      {/* Dialog */}
      <div className="relative w-full max-w-lg bg-surface-container-lowest rounded-3xl shadow-2xl border border-outline-variant/40 p-6 sm:p-7 z-10 space-y-5 animate-fadeIn">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-outline-variant/30 pb-3">
          <div>
            <span className="font-caption text-xs uppercase font-bold text-primary tracking-wider">
              Farmer Helper — Training Program Enrollment
            </span>
            <h2 className="font-headline-md text-lg sm:text-xl font-bold text-on-surface mt-1">
              {program.title}
            </h2>
            <p className="font-caption text-xs text-on-surface-variant">
              {program.location} • {program.dates}
            </p>
          </div>
          <button
            type="button"
            onClick={resetAndClose}
            className="w-8 h-8 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-outline"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {isSuccess ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-secondary-container/40 text-on-secondary-container flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-4xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                check_circle
              </span>
            </div>
            <div>
              <h3 className="font-bold text-xl text-on-surface">Seat Confirmed!</h3>
              <p className="font-caption text-xs text-secondary font-semibold">प्रशिक्षण सीट सफलतापूर्वक बुक हो गई है</p>
            </div>
            <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30 text-left space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-outline">Registration Pass:</span>
                <span className="font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                  {bookingPass}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-outline">Participant:</span>
                <span className="font-semibold text-on-surface">{name}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-outline">Fee Status:</span>
                <span className="font-bold text-secondary">{program.fee === 'FREE' ? 'Free (Govt Funded)' : `${program.fee} (Pay on reporting)`}</span>
              </div>
            </div>
            <p className="font-caption text-xs text-on-surface-variant leading-relaxed">
              Venue instructions and preparation materials have been sent to <strong>{email}</strong>. Please bring valid college ID card on the first day.
            </p>
            <button
              type="button"
              onClick={resetAndClose}
              className="w-full py-3 rounded-xl bg-primary text-on-primary font-label-md text-sm font-semibold shadow-xs"
            >
              Done (पूर्ण करें)
            </button>
          </div>
        ) : (
          <form onSubmit={handleEnroll} className="space-y-4 text-xs sm:text-sm">
            <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/30 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-outline">Accreditation:</span>
                <span className="font-semibold text-primary">{program.accreditation}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-outline">Course Fee:</span>
                <span className="font-bold text-base text-primary">{program.fee}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-outline">Remaining Seats:</span>
                <span className="font-semibold text-error">{program.seatsLeft} seats left</span>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block font-semibold text-on-surface mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="block font-semibold text-on-surface mb-1">Mobile Number</label>
                <input
                  type="tel"
                  required
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="block font-semibold text-on-surface mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <div className="pt-2 flex gap-2 justify-end">
              <button
                type="button"
                onClick={resetAndClose}
                className="px-4 py-2.5 rounded-xl bg-surface-container text-on-surface font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-primary text-on-primary font-semibold shadow-xs hover:bg-primary-container"
              >
                Confirm Registration
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
