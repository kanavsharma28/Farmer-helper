import React, { useState, useMemo } from 'react';
import { calculateStorageQuote } from '../../data/storageData';

export default function BookingRequestForm({
  facility,
  lang = 'en',
  onSubmitBooking,
  onCancel,
}) {
  const isEn = lang === 'en';

  const [farmerName, setFarmerName] = useState('Rajesh Kumar');
  const [mobile, setMobile] = useState('+91 98765 43210');
  const [selectedCrop, setSelectedCrop] = useState(facility.supportedCrops[0] || 'potato');
  const [quantity, setQuantity] = useState(50);
  const [quantityUnit, setQuantityUnit] = useState('quintal'); // 'quintal' | 'mt'
  const [inwardDate, setInwardDate] = useState(
    new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [outwardDate, setOutwardDate] = useState(
    new Date(Date.now() + 65 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [packagingType, setPackagingType] = useState('Jute Gunny Bags (50kg)');
  const [pickupRequired, setPickupRequired] = useState(true);
  const [specialNotes, setSpecialNotes] = useState('Need chamber near ground loading ramp.');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Calculate live quotation
  const quote = useMemo(() => {
    return calculateStorageQuote({
      ratePerQtl: facility.ratePerQtl,
      quantity,
      unit: quantityUnit,
      inwardDate,
      outwardDate,
      pickupRequired,
    });
  }, [facility.ratePerQtl, quantity, quantityUnit, inwardDate, outwardDate, pickupRequired]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!farmerName.trim()) {
      setErrorMsg(isEn ? 'Please enter farmer name' : 'किसान का नाम दर्ज करें');
      return;
    }
    if (!mobile.trim()) {
      setErrorMsg(isEn ? 'Please enter mobile number' : 'मोबाइल नंबर दर्ज करें');
      return;
    }
    if (!quantity || Number(quantity) <= 0) {
      setErrorMsg(isEn ? 'Please specify storage quantity' : 'भंडारण मात्रा दर्ज करें');
      return;
    }

    setErrorMsg('');
    setIsSubmitting(true);

    const bookingPayload = {
      facilityId: facility.id,
      facilityName: facility.name,
      facilityNameHi: facility.nameHi,
      facilityAddress: facility.address,
      farmerName,
      mobile,
      crop: selectedCrop,
      quantity: Number(quantity),
      quantityUnit: quantityUnit === 'mt' ? 'MT' : 'Quintal',
      inwardDate,
      outwardDate,
      durationDays: quote.months * 30,
      packaging: packagingType,
      pickupRequired,
      specialNotes,
      estimatedAmount: quote.grandTotal,
      ratePerQtl: facility.ratePerQtl,
    };

    setTimeout(() => {
      setIsSubmitting(false);
      onSubmitBooking(bookingPayload);
    }, 600);
  };

  return (
    <div className="bg-surface rounded-3xl shadow-xl border border-outline-variant/40 overflow-hidden">
      {/* Header Banner */}
      <div className="bg-primary p-6 text-on-primary">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-primary-fixed font-bold">
              {isEn ? 'Priority Reservation' : 'प्राथमिकता आरक्षण'}
            </span>
            <h2 className="font-headline-md text-xl font-bold text-on-primary mt-0.5">
              {isEn ? 'Send Storage Booking Request' : 'बुकिंग अनुरोध भेजें'}
            </h2>
            <p className="text-xs text-on-primary/80 mt-0.5">
              {facility.name}
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center text-primary-fixed shrink-0">
            <span className="material-symbols-outlined text-[26px]">warehouse</span>
          </div>
        </div>

        {/* Free Request Notice */}
        <div className="mt-3.5 flex items-center gap-2 p-2.5 rounded-xl bg-black/25 text-white text-xs font-medium">
          <span className="material-symbols-outlined text-[18px] text-tertiary-fixed shrink-0">
            info
          </span>
          <span>{isEn ? 'This is a reservation inquiry. No immediate online payment required.' : 'यह आरक्षण अनुरोध है। ऑनलाइन कोई भुगतान करने की आवश्यकता नहीं है।'}</span>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 sm:p-7 space-y-4">
        {errorMsg && (
          <div className="p-3 rounded-xl bg-error-container text-on-error-container text-xs flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">error</span>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Farmer Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-on-surface">
              {isEn ? 'Farmer Name' : 'किसान का नाम'}
            </label>
            <input
              type="text"
              value={farmerName}
              onChange={(e) => setFarmerName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low text-xs text-on-surface border border-outline-variant/40 focus:outline-none focus:border-primary"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-on-surface">
              {isEn ? 'Mobile Number' : 'मोबाइल नंबर'}
            </label>
            <input
              type="tel"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low text-xs text-on-surface border border-outline-variant/40 focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        {/* Crop Selection */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-on-surface">
            {isEn ? 'Crop for Storage' : 'भंडारण हेतु फसल'}
          </label>
          <div className="relative">
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="w-full appearance-none px-3.5 py-2.5 pr-8 rounded-xl bg-surface-container-low text-xs text-on-surface border border-outline-variant/40 focus:outline-none focus:border-primary cursor-pointer capitalize"
            >
              {facility.supportedCropsDisplay?.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.emoji} {c.en} / {c.hi}
                </option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-outline text-[18px]">
              expand_more
            </span>
          </div>
        </div>

        {/* Quantity with Quintal/MT Toggle */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-on-surface">
            {isEn ? 'Storage Quantity' : 'भंडारण मात्रा'}
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              min="1"
              max="2000"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low text-xs font-bold text-on-surface border border-outline-variant/40 focus:outline-none focus:border-primary"
            />
            <div className="flex bg-surface-container-low p-1 rounded-xl shrink-0 border border-outline-variant/40">
              <button
                type="button"
                onClick={() => setQuantityUnit('quintal')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  quantityUnit === 'quintal'
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {isEn ? 'Quintal' : 'क्विंटल'}
              </button>
              <button
                type="button"
                onClick={() => setQuantityUnit('mt')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  quantityUnit === 'mt'
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                MT (टन)
              </button>
            </div>
          </div>
          <p className="text-[11px] text-on-surface-variant">
            {isEn ? '1 MT = 10 Quintals (~20 Bags of 50kg each)' : '1 टन = 10 क्विंटल (~20 बोरी)'}
          </p>
        </div>

        {/* Dates: Inward & Outward */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-on-surface">
              {isEn ? 'Inward Date' : 'जमा दिनांक'}
            </label>
            <input
              type="date"
              value={inwardDate}
              onChange={(e) => setInwardDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low text-xs text-on-surface border border-outline-variant/40 focus:outline-none focus:border-primary"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-on-surface">
              {isEn ? 'Expected Release' : 'निकासी दिनांक'}
            </label>
            <input
              type="date"
              value={outwardDate}
              onChange={(e) => setOutwardDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low text-xs text-on-surface border border-outline-variant/40 focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        {/* Packaging & Transport */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-on-surface">
              {isEn ? 'Packaging Type' : 'पैकिंग का प्रकार'}
            </label>
            <select
              value={packagingType}
              onChange={(e) => setPackagingType(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-surface-container-low text-xs text-on-surface border border-outline-variant/40 focus:outline-none focus:border-primary"
            >
              <option>Jute Gunny Bags (50kg)</option>
              <option>Mesh Leno Bags (30kg)</option>
              <option>Plastic Crates (25kg)</option>
            </select>
          </div>
          <div className="space-y-1 flex flex-col justify-end">
            <label className="flex items-center gap-2 p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 cursor-pointer h-[42px]">
              <input
                type="checkbox"
                checked={pickupRequired}
                onChange={(e) => setPickupRequired(e.target.checked)}
                className="w-4 h-4 text-primary rounded"
              />
              <span className="text-xs text-on-surface font-medium truncate">
                {isEn ? 'Tractor Pickup (+₹12/qtl)' : 'ट्रैक्टर पिकअप (+₹12)'}
              </span>
            </label>
          </div>
        </div>

        {/* Special Instructions */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-on-surface">
            {isEn ? 'Special Instructions (Optional)' : 'वैकल्पिक निर्देश'}
          </label>
          <input
            type="text"
            value={specialNotes}
            onChange={(e) => setSpecialNotes(e.target.value)}
            placeholder={isEn ? 'e.g. unload after 4 PM, ground ramp...' : 'जैसे: दोपहर बाद अनलोडिंग, ग्राउंड फ्लोर चैम्बर...'}
            className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low text-xs text-on-surface border border-outline-variant/40 focus:outline-none focus:border-primary"
          />
        </div>

        {/* Cost Calculation Breakdown Card */}
        <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30 space-y-2">
          <div className="flex items-center justify-between text-xs text-on-surface-variant">
            <span>
              {isEn ? 'Base Rent' : 'मूल किराया'} (₹{facility.ratePerQtl} × {quote.qtyInQtl} qtl × {quote.months} {isEn ? 'mos' : 'माह'}):
            </span>
            <span className="font-semibold text-on-surface">₹{quote.baseRateTotal.toLocaleString()}</span>
          </div>

          <div className="flex items-center justify-between text-xs text-on-surface-variant">
            <span>{isEn ? 'Govt Insurance & Handling (4%):' : 'बीमा एवं हैंडलिंग (4%):'}</span>
            <span className="font-semibold text-on-surface">₹{quote.insuranceHandling.toLocaleString()}</span>
          </div>

          {pickupRequired && (
            <div className="flex items-center justify-between text-xs text-on-surface-variant">
              <span>{isEn ? 'Arranged Tractor Transit:' : 'ट्रैक्टर परिवहन शुल्क:'}</span>
              <span className="font-semibold text-on-surface">₹{quote.pickupTransit.toLocaleString()}</span>
            </div>
          )}

          <div className="pt-2 border-t border-outline-variant/30 flex items-baseline justify-between">
            <div>
              <p className="text-xs font-bold text-on-surface">
                {isEn ? 'Net Estimated Total' : 'अनुमानित कुल लागत'}
              </p>
              <p className="text-[10px] text-on-surface-variant">
                ~₹{Math.round(quote.grandTotal / (quote.qtyInQtl * 2))} {isEn ? '/ bag for duration' : '/ बोरी कुल अवधि'}
              </p>
            </div>
            <div className="text-right">
              <span className="font-headline-md text-xl sm:text-2xl font-black text-primary">
                ₹{quote.grandTotal.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="p-2 rounded-xl bg-surface text-[11px] text-on-surface-variant flex items-center gap-1.5 border border-outline-variant/20">
            <span className="material-symbols-outlined text-[16px] text-secondary material-fill">
              payments
            </span>
            <span>
              <strong>₹0 {isEn ? 'Payable Now.' : 'अभी देय।'}</strong> {isEn ? 'Pay at gate after Dharam Kanta weigh.' : 'कांटा तौल के बाद गेट पर भुगतान करें।'}
            </span>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="space-y-2 pt-1">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-6 rounded-2xl bg-primary hover:bg-primary-hover active:scale-[0.99] text-on-primary font-bold text-sm shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <span className="material-symbols-outlined text-[18px] animate-spin">sync</span>
                <span>{isEn ? 'Sending Request…' : 'अनुरोध भेजा जा रहा है…'}</span>
              </>
            ) : (
              <>
                <span>{isEn ? 'Send Booking Request' : 'बुकिंग अनुरोध सबमिट करें'}</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </>
            )}
          </button>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="w-full py-2.5 text-xs text-on-surface-variant hover:text-on-surface font-semibold transition-colors cursor-pointer"
            >
              {isEn ? 'Cancel & Return' : 'रद्द करें'}
            </button>
          )}
        </div>

        {/* Trust Badges Footer */}
        <div className="flex items-center justify-center gap-3 pt-2 text-[11px] text-on-surface-variant">
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px] text-secondary">verified_user</span>
            <span>100% Verified</span>
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px] text-secondary">gavel</span>
            <span>WDRA e-NWR</span>
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px] text-secondary">sms</span>
            <span>SMS Receipt</span>
          </span>
        </div>
      </form>
    </div>
  );
}
