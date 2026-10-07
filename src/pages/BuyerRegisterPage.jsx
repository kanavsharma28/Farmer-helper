import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function BuyerRegisterPage() {
  const navigate = useNavigate();
  const [lang, setLang] = useState('en');
  const isEn = lang === 'en';

  const [buyerData, setBuyerData] = useState({
    businessName: 'Sharma Grain Traders',
    contactPerson: 'Ramesh Sharma',
    mobileNumber: '+91 98765 43210',
    businessType: 'wholesaler',
    location: 'Meerut, UP',
    cropsPurchased: ['wheat', 'rice']
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const availableCrops = [
    { id: 'wheat', labelEn: 'Wheat', labelHi: 'गेहूं' },
    { id: 'corn', labelEn: 'Corn', labelHi: 'मक्का' },
    { id: 'soybeans', labelEn: 'Soybeans', labelHi: 'सोयाबीन' },
    { id: 'rice', labelEn: 'Rice', labelHi: 'धान / चावल' },
    { id: 'sugarcane', labelEn: 'Sugarcane', labelHi: 'गन्ना' },
    { id: 'other', labelEn: 'Other...', labelHi: 'अन्य...' },
  ];

  const handleInputChange = (field, value) => {
    setBuyerData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const toggleCropSelection = (cropId) => {
    setBuyerData((prev) => {
      const exists = prev.cropsPurchased.includes(cropId);
      const updated = exists
        ? prev.cropsPurchased.filter((c) => c !== cropId)
        : [...prev.cropsPurchased, cropId];
      return { ...prev, cropsPurchased: updated };
    });
    if (errors.cropsPurchased) {
      setErrors((prev) => ({ ...prev, cropsPurchased: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!buyerData.businessName.trim()) {
      newErrors.businessName = isEn ? 'Please enter company name' : 'कृपया कंपनी का नाम दर्ज करें';
    }
    if (!buyerData.contactPerson.trim()) {
      newErrors.contactPerson = isEn ? 'Please enter contact person' : 'कृपया संपर्क व्यक्ति दर्ज करें';
    }
    if (!buyerData.mobileNumber.trim() || buyerData.mobileNumber.length < 10) {
      newErrors.mobileNumber = isEn ? 'Please enter valid mobile number' : 'कृपया मान्य मोबाइल नंबर दर्ज करें';
    }
    if (!buyerData.businessType) {
      newErrors.businessType = isEn ? 'Please select business type' : 'कृपया व्यवसाय प्रकार चुनें';
    }
    if (buyerData.cropsPurchased.length === 0) {
      newErrors.cropsPurchased = isEn ? 'Please select at least one crop' : 'कृपया कम से कम एक फसल चुनें';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    }, 1000);
  };

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen flex flex-col antialiased selection:bg-primary-container selection:text-white">
      
      {/* Brand Header */}
      <header className="w-full bg-surface-container-lowest py-4 px-4 sm:px-6 md:px-10 flex justify-between items-center shadow-sm z-50">
        <Link to="/" className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-3xl">agriculture</span>
          <span className="font-headline-md text-xl font-bold text-primary tracking-tight">Farmer Helper</span>
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setLang((prev) => (prev === 'en' ? 'hi' : 'en'))}
            className="px-3 py-1 bg-surface-container border border-outline-variant/60 rounded-full text-xs font-bold text-on-surface-variant hover:text-primary transition-all"
          >
            {isEn ? 'EN | हिंदी' : 'हिंदी | EN'}
          </button>
          <span className="text-on-surface-variant font-label-md text-xs sm:text-sm font-medium">
            {isEn ? 'Buyer Onboarding Step 1 of 2' : 'खरीदार पंजीकरण चरण 1 ऑफ 2'}
          </span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow flex items-center justify-center py-8 sm:py-12 px-4 sm:px-6">
        <div className="w-full max-w-3xl bg-surface-container-lowest rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-outline-variant/30 overflow-hidden flex flex-col md:flex-row">
          
          {/* Left Branding Area (Image) */}
          <div className="hidden md:block md:w-5/12 bg-surface-container relative">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBt9CPAFeG8buIluEACl3RpXiDvWwwfc5Z515Rs-FDoOWjUnP3kr9SoDhpnM7XkeHR8CeGtS3KtsmA0cNXVl_6pFv8W2YqUz5UqaLS0sQenfRCrsw5TI_tIOA-TMRiyd1ipZ69KqAXA6Oiqnw7XwIt8GK4tZuROWorRhYzpGI9faa8LEwoOzSlu3rjDgc1lCfXkBVoXslr1qeFcPo-kDPlSrGfS0CeEnoidwZ5WkgIe1SZywXH4dQ1X"
              alt="Lush agricultural field"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-primary/20 mix-blend-multiply"></div>
          </div>

          {/* Right Form Area */}
          <div className="w-full md:w-7/12 p-6 sm:p-8 md:p-12 flex flex-col justify-center">
            
            <div className="mb-6 sm:mb-8">
              <h1 className="font-headline-lg text-2xl sm:text-3xl font-bold text-on-background mb-2">
                {isEn ? 'Create Buyer Profile' : 'खरीदार प्रोफाइल बनाएं'}
              </h1>
              <p className="font-body-md text-sm text-on-surface-variant">
                {isEn
                  ? 'Tell us about your business to connect with quality farmers.'
                  : 'उत्कृष्ट किसानों से सीधे जुड़ने के लिए अपने व्यापार का विवरण दर्ज करें।'}
              </p>
            </div>

            {isSuccess ? (
              <div className="py-8 text-center space-y-3 animate-fadeIn">
                <div className="w-16 h-16 bg-secondary/20 text-secondary rounded-full flex items-center justify-center mx-auto text-3xl font-bold">
                  ✓
                </div>
                <h3 className="font-bold text-xl text-primary">
                  {isEn ? 'Buyer Profile Created!' : 'खरीदार प्रोफाइल सफलतापूर्वक बन गया!'}
                </h3>
                <p className="text-xs text-on-surface-variant">
                  {isEn ? 'Redirecting to your dashboard...' : 'डैशबोर्ड पर निर्देशित किया जा रहा है...'}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* Business / Company Name */}
                <div>
                  <label className="block font-label-md text-xs font-semibold text-on-background mb-1" htmlFor="businessName">
                    {isEn ? 'Business / Company Name' : 'व्यापार / कंपनी का नाम'} <span className="text-error">*</span>
                  </label>
                  <input
                    id="businessName"
                    type="text"
                    value={buyerData.businessName}
                    onChange={(e) => handleInputChange('businessName', e.target.value)}
                    placeholder={isEn ? "e.g., AgriTrade Solutions" : "जैसे, शर्मा गल्ला मंडी"}
                    className={`w-full bg-surface border ${
                      errors.businessName ? 'border-error' : 'border-outline-variant'
                    } rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm font-medium transition-colors text-on-background`}
                  />
                  {errors.businessName && <p className="text-xs text-error mt-1">{errors.businessName}</p>}
                </div>

                {/* Contact Person & Mobile Number */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-label-md text-xs font-semibold text-on-background mb-1" htmlFor="contactPerson">
                      {isEn ? 'Contact Person' : 'संपर्क व्यक्ति'} <span className="text-error">*</span>
                    </label>
                    <input
                      id="contactPerson"
                      type="text"
                      value={buyerData.contactPerson}
                      onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                      placeholder={isEn ? "Full Name" : "पूरा नाम"}
                      className={`w-full bg-surface border ${
                        errors.contactPerson ? 'border-error' : 'border-outline-variant'
                      } rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm font-medium transition-colors text-on-background`}
                    />
                    {errors.contactPerson && <p className="text-xs text-error mt-1">{errors.contactPerson}</p>}
                  </div>

                  <div>
                    <label className="block font-label-md text-xs font-semibold text-on-background mb-1" htmlFor="mobileNumber">
                      {isEn ? 'Mobile Number' : 'मोबाइल नंबर'} <span className="text-error">*</span>
                    </label>
                    <input
                      id="mobileNumber"
                      type="tel"
                      value={buyerData.mobileNumber}
                      onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
                      placeholder="+91 98765 43210"
                      className={`w-full bg-surface border ${
                        errors.mobileNumber ? 'border-error' : 'border-outline-variant'
                      } rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm font-medium transition-colors text-on-background`}
                    />
                    {errors.mobileNumber && <p className="text-xs text-error mt-1">{errors.mobileNumber}</p>}
                  </div>
                </div>

                {/* Business Type & Location */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-label-md text-xs font-semibold text-on-background mb-1" htmlFor="businessType">
                      {isEn ? 'Business Type' : 'व्यवसाय का प्रकार'} <span className="text-error">*</span>
                    </label>
                    <select
                      id="businessType"
                      value={buyerData.businessType}
                      onChange={(e) => handleInputChange('businessType', e.target.value)}
                      className={`w-full bg-surface border ${
                        errors.businessType ? 'border-error' : 'border-outline-variant'
                      } rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm font-medium transition-colors text-on-background appearance-none`}
                    >
                      <option value="" disabled>{isEn ? 'Select Type' : 'प्रकार चुनें'}</option>
                      <option value="wholesaler">{isEn ? 'Wholesaler (थोक विक्रेता)' : 'थोक विक्रेता (Wholesaler)'}</option>
                      <option value="retailer">{isEn ? 'Retailer (खुदरा विक्रेता)' : 'खुदरा विक्रेता (Retailer)'}</option>
                      <option value="processor">{isEn ? 'Processor (प्रसंस्करणकर्ता)' : 'प्रसंस्करणकर्ता (Processor)'}</option>
                      <option value="exporter">{isEn ? 'Exporter (निर्यातक)' : 'निर्यातक (Exporter)'}</option>
                      <option value="graintrader">{isEn ? 'Grain Trader (गल्ला व्यापारी)' : 'गल्ला व्यापारी (Grain Trader)'}</option>
                    </select>
                    {errors.businessType && <p className="text-xs text-error mt-1">{errors.businessType}</p>}
                  </div>

                  <div>
                    <label className="block font-label-md text-xs font-semibold text-on-background mb-1" htmlFor="location">
                      {isEn ? 'Location' : 'स्थान / मंडी'}
                    </label>
                    <input
                      id="location"
                      type="text"
                      value={buyerData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      placeholder={isEn ? "City, Region" : "शहर, मंडी"}
                      className="w-full bg-surface border border-outline-variant rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm font-medium transition-colors text-on-background"
                    />
                  </div>
                </div>

                {/* Crops Purchased Multi-Select Chips */}
                <div>
                  <label className="block font-label-md text-xs font-semibold text-on-background mb-1">
                    {isEn ? 'Crops Purchased (Select multiple)' : 'खरीदी जाने वाली फसलें (बहु-चयन)'} <span className="text-error">*</span>
                  </label>
                  
                  <div className="flex flex-wrap gap-2 mt-2">
                    {availableCrops.map((crop) => {
                      const isSelected = buyerData.cropsPurchased.includes(crop.id);

                      return (
                        <button
                          key={crop.id}
                          type="button"
                          onClick={() => toggleCropSelection(crop.id)}
                          className={`px-4 py-2 rounded-full border text-xs font-bold transition-all select-none ${
                            isSelected
                              ? 'bg-secondary-container/40 text-on-secondary-container border-secondary font-bold shadow-2xs scale-102'
                              : 'bg-surface border-outline-variant text-on-surface-variant hover:bg-surface-container'
                          }`}
                        >
                          {isEn ? crop.labelEn : crop.labelHi}
                        </button>
                      );
                    })}
                  </div>
                  {errors.cropsPurchased && <p className="text-xs text-error mt-1">{errors.cropsPurchased}</p>}
                </div>

                {/* Submit Action CTA */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-14 bg-primary-container text-on-primary rounded-[16px] font-label-md text-sm font-bold hover:bg-primary transition-colors flex items-center justify-center gap-2 shadow-sm active:scale-95 cursor-pointer"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        <span>{isEn ? 'Creating Profile...' : 'प्रोफाइल बनाई जा रही है...'}</span>
                      </div>
                    ) : (
                      <>
                        <span>{isEn ? 'Create Buyer Profile' : 'खरीदार प्रोफाइल बनाएं'}</span>
                        <span className="material-symbols-outlined text-lg">arrow_forward</span>
                      </>
                    )}
                  </button>
                </div>

              </form>
            )}

          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-surface-container-lowest border-t border-outline-variant/30 w-full py-8 mt-auto">
        <div className="flex flex-col md:flex-row justify-between items-center px-4 sm:px-6 md:px-10 gap-4 w-full text-xs text-on-surface-variant">
          
          <div className="flex items-center gap-2 font-bold text-primary text-sm">
            <span className="material-symbols-outlined">agriculture</span>
            <span>Farmer Helper</span>
          </div>

          <div className="flex flex-wrap gap-4">
            <a href="#" className="hover:underline hover:text-primary">
              {isEn ? 'Privacy Policy' : 'गोपनीयता नीति'}
            </a>
            <a href="#" className="hover:underline hover:text-primary">
              {isEn ? 'Terms of Service' : 'सेवा की शर्तें'}
            </a>
            <a href="#" className="hover:underline hover:text-primary">
              {isEn ? 'Help Center' : 'सहायता केंद्र'}
            </a>
            <a href="#" className="hover:underline hover:text-primary">
              {isEn ? 'Contact Us' : 'संपर्क करें'}
            </a>
          </div>

          <div>
            © 2026 Farmer Helper. {isEn ? 'All rights reserved.' : 'सर्वाधिकार सुरक्षित।'}
          </div>

        </div>
      </footer>

    </div>
  );
}
