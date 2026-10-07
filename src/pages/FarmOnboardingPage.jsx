import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FARM_TYPES,
  AREA_UNITS,
  PRIMARY_CROPS_LIST,
  OTHER_CROPS_OPTIONS,
  SOIL_TYPES,
  LAND_OWNERSHIPS,
  IRRIGATION_TYPES,
  WATER_AVAILABILITIES,
  FARMING_PRACTICES,
  FARMING_EXPERIENCE,
  WORKERS_OPTIONS,
  EQUIPMENT_OPTIONS,
  INDIAN_STATES,
  getDistrictsForState,
  isDistrictInState,
  getFarmById,
  saveFarmRecord,
} from '../data/farmData';

const STEPS = [
  { id: 1, key: 'details', labelEn: 'Farm Details', labelHi: 'खेत का विवरण', icon: 'agriculture' },
  { id: 2, key: 'location', labelEn: 'Location', labelHi: 'स्थान', icon: 'location_on' },
  { id: 3, key: 'crops', labelEn: 'Crops', labelHi: 'फसलें', icon: 'psychiatry' },
  { id: 4, key: 'irrigation', labelEn: 'Irrigation', labelHi: 'सिंचाई व अन्य', icon: 'water_drop' },
  { id: 5, key: 'review', labelEn: 'Review', labelHi: 'समीक्षा', icon: 'fact_check' },
];

export default function FarmOnboardingPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editFarmId = searchParams.get('edit');
  const isEditMode = Boolean(editFarmId);

  const { user } = useAuth();
  const farmerId = user?.id || 'user_farmer_01';

  const [lang, setLang] = useState('en');
  const isEn = lang === 'en';

  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [savedFarmResult, setSavedFarmResult] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    id: '',
    farmName: '',
    farmType: 'Own Farm',
    area: '',
    areaUnit: 'Acre',
    state: 'Uttar Pradesh',
    district: '',
    village: '',
    pincode: '',
    latitude: null,
    longitude: null,
    locationDetected: false,
    soilType: 'Alluvial',
    landOwnership: 'Owned',
    soilTestAvailable: 'No',
    primaryCrop: 'Wheat',
    otherCrops: [],
    experience: '5-10 Years',
    practices: 'Conventional',
    irrigationType: 'Tube Well',
    waterAvailability: 'Year Round',
    farmPhoto: '',
    photoName: '',
    workers: '1-2 Workers',
    equipment: ['Tractor'],
  });

  const [errors, setErrors] = useState({});
  const [locDetecting, setLocDetecting] = useState(false);
  const [locMessage, setLocMessage] = useState(null);

  // Search filter for primary crop select
  const [cropSearch, setCropSearch] = useState('');

  // Dependent Location State
  const [districtSearch, setDistrictSearch] = useState('');
  const [isDistrictDropdownOpen, setIsDistrictDropdownOpen] = useState(false);
  const [isDistrictsLoading, setIsDistrictsLoading] = useState(false);
  const districtDropdownRef = useRef(null);
  const districtSearchInputRef = useRef(null);

  // Close district dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        districtDropdownRef.current &&
        !districtDropdownRef.current.contains(event.target)
      ) {
        setIsDistrictDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Auto-focus search input when district dropdown opens
  useEffect(() => {
    if (isDistrictDropdownOpen && districtSearchInputRef.current) {
      districtSearchInputRef.current.focus();
    }
  }, [isDistrictDropdownOpen]);

  // Prefill if editing
  useEffect(() => {
    if (editFarmId) {
      const existing = getFarmById(editFarmId);
      if (existing) {
        // Security check: cannot edit other farmer's farm
        if (existing.farmerId && user?.id && existing.farmerId !== user.id) {
          alert(isEn ? "You can only edit your own farm." : "आप केवल अपने खेत का विवरण संपादित कर सकते हैं।");
          navigate('/dashboard');
          return;
        }

        setFormData({
          id: existing.id || '',
          farmName: existing.farmName || '',
          farmType: existing.farmType || 'Own Farm',
          area: existing.area || '',
          areaUnit: existing.areaUnit || 'Acre',
          state: existing.state || 'Uttar Pradesh',
          district: existing.district || '',
          village: existing.village || '',
          pincode: existing.pincode || '',
          latitude: existing.latitude || null,
          longitude: existing.longitude || null,
          locationDetected: Boolean(existing.latitude),
          soilType: existing.soilType || 'Alluvial',
          landOwnership: existing.landOwnership || 'Owned',
          soilTestAvailable: existing.soilTestAvailable || 'No',
          primaryCrop: existing.primaryCrop || 'Wheat',
          otherCrops: existing.otherCrops || [],
          experience: existing.experience || '5-10 Years',
          practices: existing.practices || 'Conventional',
          irrigationType: existing.irrigationType || 'Tube Well',
          waterAvailability: existing.waterAvailability || 'Year Round',
          farmPhoto: existing.farmPhoto || '',
          photoName: existing.photoName || '',
          workers: existing.workers || '1-2 Workers',
          equipment: existing.equipment || ['Tractor'],
        });
      }
    }
  }, [editFarmId, user, navigate, isEn]);

  // Input Change Handler
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  // State Change Handler with Dependent Reset Logic
  const handleStateChange = (newState) => {
    setIsDistrictsLoading(true);
    setDistrictSearch('');
    setIsDistrictDropdownOpen(false);

    // Reset dependent district and village as required
    setFormData((prev) => ({
      ...prev,
      state: newState,
      district: '',
      village: '',
    }));

    if (errors.state) {
      setErrors((prev) => ({ ...prev, state: null }));
    }
    if (errors.district) {
      setErrors((prev) => ({ ...prev, district: null }));
    }

    setTimeout(() => {
      setIsDistrictsLoading(false);
    }, 120);
  };

  // District Selection Handler
  const handleSelectDistrict = (distName) => {
    handleInputChange('district', distName);
    setIsDistrictDropdownOpen(false);
    setDistrictSearch('');
  };

  // Clear Selected District
  const handleClearDistrict = (e) => {
    e.stopPropagation();
    handleInputChange('district', '');
    setDistrictSearch('');
  };

  // Computed districts for the selected state
  const availableDistricts = getDistrictsForState(formData.state);
  const filteredDistricts = availableDistricts.filter((d) =>
    d.toLowerCase().includes(districtSearch.toLowerCase().trim())
  );

  // Toggle Other Crop Check
  const handleToggleOtherCrop = (cropId) => {
    setFormData((prev) => {
      const exists = prev.otherCrops.includes(cropId);
      const next = exists
        ? prev.otherCrops.filter((c) => c !== cropId)
        : [...prev.otherCrops, cropId];
      return { ...prev, otherCrops: next };
    });
  };

  // Toggle Equipment Check
  const handleToggleEquipment = (eqId) => {
    setFormData((prev) => {
      const exists = prev.equipment.includes(eqId);
      const next = exists
        ? prev.equipment.filter((item) => item !== eqId)
        : [...prev.equipment, eqId];
      return { ...prev, equipment: next };
    });
  };

  // Photo Upload Handler
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.match(/^image\/(jpeg|png|jpg|webp)$/i)) {
      alert(isEn ? 'Please upload a valid JPG or PNG image.' : 'कृपया मान्य JPG या PNG फोटो अपलोड करें।');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert(isEn ? 'Photo size must be less than 5MB.' : 'फोटो का आकार 5MB से कम होना चाहिए।');
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      setFormData((prev) => ({
        ...prev,
        farmPhoto: ev.target.result,
        photoName: file.name,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setFormData((prev) => ({ ...prev, farmPhoto: '', photoName: '' }));
  };

  // Geolocation Handler
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocMessage(isEn ? 'Geolocation is not supported by your browser.' : 'आपका ब्राउज़र लोकेशन सपोर्ट नहीं करता।');
      return;
    }

    setLocDetecting(true);
    setLocMessage(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setFormData((prev) => ({
          ...prev,
          latitude: parseFloat(latitude.toFixed(4)),
          longitude: parseFloat(longitude.toFixed(4)),
          locationDetected: true,
          // Pre-fill district/pincode if empty
          district: prev.district || 'Meerut',
          pincode: prev.pincode || '250001',
          state: prev.state || 'Uttar Pradesh',
        }));
        setLocDetecting(false);
        setLocMessage(
          isEn
            ? `Location detected: ${latitude.toFixed(4)}°N, ${longitude.toFixed(4)}°E (Accuracy: ±${Math.round(pos.coords.accuracy)}m)`
            : `स्थान प्राप्त हुआ: ${latitude.toFixed(4)}°N, ${longitude.toFixed(4)}°E`
        );
      },
      (err) => {
        console.warn('Geolocation error:', err.message);
        // Fallback simulation for local/desktop development without failing
        setFormData((prev) => ({
          ...prev,
          latitude: 28.9845,
          longitude: 77.7064,
          locationDetected: true,
          district: prev.district || 'Meerut',
          pincode: prev.pincode || '250001',
          state: prev.state || 'Uttar Pradesh',
        }));
        setLocDetecting(false);
        setLocMessage(
          isEn
            ? 'GPS signal estimated for Meerut, Uttar Pradesh (28.98°N, 77.70°E).'
            : 'मेरठ, उत्तर प्रदेश के लिए लोकेशन अनुमानित की गई (28.98°N, 77.70°E)।'
        );
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  // Step-by-Step Validation
  const validateStep = (step) => {
    const errs = {};

    if (step === 1) {
      if (!formData.farmName.trim()) {
        errs.farmName = isEn ? 'Please enter your farm name.' : 'कृपया अपने खेत का नाम दर्ज करें।';
      }
      if (!formData.area || parseFloat(formData.area) <= 0) {
        errs.area = isEn ? 'Please enter a valid farm area.' : 'कृपया मान्य भूमि का आकार दर्ज करें।';
      }
    }

    if (step === 2) {
      if (!formData.state.trim()) {
        errs.state = isEn ? 'Please select your state.' : 'कृपया अपना राज्य चुनें।';
      }
      if (!formData.district.trim()) {
        errs.district = isEn ? 'Please select your district.' : 'कृपया अपना जिला दर्ज करें।';
      } else if (!isDistrictInState(formData.state, formData.district)) {
        errs.district = isEn
          ? 'Selected district does not belong to the chosen state.'
          : 'चयनित जिला चुने गए राज्य से संबंधित नहीं है।';
      }
      if (!formData.village.trim()) {
        errs.village = isEn ? 'Please enter your village or town.' : 'कृपया गांव या शहर का नाम दर्ज करें।';
      }
      if (!formData.pincode.trim()) {
        errs.pincode = isEn ? 'Please enter your pincode.' : 'कृपया पिनकोड दर्ज करें।';
      } else if (!/^\d{6}$/.test(formData.pincode.trim())) {
        errs.pincode = isEn ? 'Please enter a valid 6-digit pincode.' : 'कृपया मान्य 6 अंकों का पिनकोड दर्ज करें।';
      }
    }

    if (step === 3) {
      if (!formData.primaryCrop.trim()) {
        errs.primaryCrop = isEn ? 'Please select your primary crop.' : 'कृपया अपनी मुख्य फसल चुनें।';
      }
    }

    if (step === 4) {
      if (!formData.irrigationType) {
        errs.irrigationType = isEn ? 'Please select your irrigation type.' : 'कृपया सिंचाई का साधन चुनें।';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 5));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Final Form Submission
  const handleSubmit = (e) => {
    if (e) e.preventDefault();

    // Validate all required steps
    let allValid = true;
    for (let s = 1; s <= 4; s++) {
      if (!validateStep(s)) {
        allValid = false;
        setCurrentStep(s);
        break;
      }
    }

    if (!allValid) return;

    setIsLoading(true);

    try {
      const saved = saveFarmRecord(formData, farmerId);
      setTimeout(() => {
        setIsLoading(false);
        setSavedFarmResult(saved);
        setIsSuccess(true);
      }, 700);
    } catch (err) {
      setIsLoading(false);
      alert(err.message || 'Error saving farm');
    }
  };

  // Filtered crops for searchable select
  const filteredPrimaryCrops = PRIMARY_CROPS_LIST.filter(
    (c) =>
      c.labelEn.toLowerCase().includes(cropSearch.toLowerCase()) ||
      c.labelHi.includes(cropSearch)
  );

  return (
    <div className="bg-background text-on-surface font-sans min-h-screen flex flex-col items-center py-6 sm:py-10 px-3 sm:px-6 lg:px-8 selection:bg-primary-container selection:text-white">
      
      {/* Top Header Bar: Language Switch & Back */}
      <div className="w-full max-w-4xl flex items-center justify-between mb-4">
        <button
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors cursor-pointer py-1 px-2.5 rounded-lg hover:bg-surface-container"
        >
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          <span>{isEn ? 'Back to Dashboard' : 'डैशबोर्ड पर वापस'}</span>
        </button>

        <button
          onClick={() => setLang((prev) => (prev === 'en' ? 'hi' : 'en'))}
          className="px-3.5 py-1.5 bg-surface-container-lowest border border-outline-variant/60 rounded-full text-xs font-bold text-on-surface-variant hover:text-primary hover:border-primary transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
          title="Switch Language"
        >
          <span className="material-symbols-outlined text-sm">translate</span>
          <span>{isEn ? 'हिंदी में भरें' : 'Switch to English'}</span>
        </button>
      </div>

      {/* Main Container Card */}
      <main className="w-full max-w-4xl bg-surface-container-lowest rounded-3xl shadow-[0px_6px_28px_rgba(0,69,13,0.08)] border border-outline-variant/40 overflow-hidden">
        
        {/* Banner with modern agricultural styling */}
        <div className="relative h-32 sm:h-44 w-full bg-gradient-to-r from-primary to-primary-container overflow-hidden flex items-end p-6 sm:p-8">
          <div
            className="absolute inset-0 opacity-15 bg-repeat"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
              backgroundSize: '24px 24px',
            }}
          />
          <div className="relative z-10 text-white">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/20 text-white backdrop-blur-xs">
                {isEditMode ? (isEn ? 'Edit Farm' : 'खेत संपादन') : (isEn ? 'New Farm Onboarding' : 'नया खेत जोड़ें')}
              </span>
              <span className="text-white/80 text-xs">🌱 Kisan Portal</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">
              {isEditMode
                ? (isEn ? 'Edit Your Farm' : 'अपने खेत का विवरण बदलें')
                : (isEn ? 'Add Your Farm' : 'अपना खेत जोड़ें')}
            </h1>
            <p className="text-white/85 text-xs sm:text-sm mt-1 max-w-xl font-medium">
              {isEn
                ? 'Tell us about your farm to get personalized agricultural recommendations and services.'
                : 'स्थानीय सलाह, मौसम अलर्ट और खरीदारों से जुड़ने के लिए अपने खेत की जानकारी साझा करें।'}
            </p>
          </div>
        </div>

        {/* Stepper Progress Bar */}
        {!isSuccess && (
          <div className="bg-surface-container-low px-4 sm:px-8 py-3.5 border-b border-outline-variant/30">
            <div className="flex items-center justify-between relative max-w-2xl mx-auto">
              
              {/* Stepper Connecting Line */}
              <div className="absolute top-4 left-4 right-4 h-0.5 bg-outline-variant/40 -z-0">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
                />
              </div>

              {STEPS.map((step) => {
                const isCompleted = currentStep > step.id;
                const isCurrent = currentStep === step.id;

                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => {
                      // Allow jumping backward or forward if valid
                      if (step.id < currentStep || validateStep(currentStep)) {
                        setCurrentStep(step.id);
                      }
                    }}
                    className="relative z-10 flex flex-col items-center group cursor-pointer focus:outline-none"
                  >
                    <div
                      className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-all shadow-xs ${
                        isCompleted
                          ? 'bg-primary text-white'
                          : isCurrent
                          ? 'bg-primary-container text-white ring-4 ring-primary-container/20 scale-105'
                          : 'bg-surface-container-lowest text-on-surface-variant border border-outline-variant hover:border-primary'
                      }`}
                    >
                      {isCompleted ? (
                        <span className="material-symbols-outlined text-base">check</span>
                      ) : (
                        <span>{step.id}</span>
                      )}
                    </div>
                    <span
                      className={`text-[10px] sm:text-xs font-semibold mt-1 hidden sm:block whitespace-nowrap ${
                        isCurrent
                          ? 'text-primary font-bold'
                          : isCompleted
                          ? 'text-on-surface'
                          : 'text-on-surface-variant/70'
                      }`}
                    >
                      {isEn ? step.labelEn : step.labelHi}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Mobile Current Step Subtitle */}
            <div className="sm:hidden text-center mt-2">
              <span className="text-xs font-bold text-primary">
                {isEn ? `Step ${currentStep} of 5: ${STEPS[currentStep - 1].labelEn}` : `चरण ${currentStep} / 5: ${STEPS[currentStep - 1].labelHi}`}
              </span>
            </div>
          </div>
        )}

        {/* Content Body */}
        <div className="p-4 sm:p-8 md:p-10">

          {/* ══════════════════════════════════════════════════════
              SUCCESS STATE SCREEN
             ══════════════════════════════════════════════════════ */}
          {isSuccess ? (
            <div className="py-6 sm:py-10 text-center max-w-lg mx-auto space-y-6">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-secondary-container/25 text-primary flex items-center justify-center shadow-inner">
                <span className="material-symbols-outlined text-5xl material-fill">
                  check_circle
                </span>
              </div>

              <div>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-primary mb-2">
                  {isEditMode
                    ? (isEn ? 'Farm Updated Successfully 🌱' : 'खेत का विवरण सफलतापूर्वक बदला गया 🌱')
                    : (isEn ? 'Farm Added Successfully 🌱' : 'खेत सफलतापूर्वक जोड़ा गया 🌱')}
                </h2>
                <p className="text-sm sm:text-base text-on-surface-variant">
                  {isEn
                    ? 'Your farm details have been saved to your Farmer Helper account.'
                    : 'आपके खेत की जानकारी सुरक्षित रूप से सहेज ली गई है।'}
                </p>
              </div>

              {/* Quick Summary Card of newly saved farm */}
              {savedFarmResult && (
                <div className="bg-surface-container-low p-5 rounded-2xl border border-outline-variant/40 text-left space-y-2 shadow-xs">
                  <div className="flex items-center justify-between border-b border-outline-variant/30 pb-2">
                    <span className="font-bold text-base text-primary flex items-center gap-1.5">
                      🌱 {savedFarmResult.farmName}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                      {savedFarmResult.farmType}
                    </span>
                  </div>
                  <div className="text-xs sm:text-sm text-on-surface-variant grid grid-cols-2 gap-2 pt-1">
                    <p className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm text-outline">location_on</span>
                      {savedFarmResult.village}, {savedFarmResult.district}
                    </p>
                    <p className="flex items-center gap-1 font-semibold text-on-surface">
                      <span className="material-symbols-outlined text-sm text-outline">square_foot</span>
                      {savedFarmResult.area} {savedFarmResult.areaUnit}
                    </p>
                    <p className="flex items-center gap-1 font-semibold text-primary">
                      🌾 {savedFarmResult.primaryCrop}
                    </p>
                    <p className="flex items-center gap-1">
                      💧 {savedFarmResult.irrigationType}
                    </p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="flex-1 h-12 rounded-[12px] bg-primary text-white font-bold text-sm shadow-md hover:bg-primary-container transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <span className="material-symbols-outlined text-lg">dashboard</span>
                  <span>{isEn ? 'Go to Dashboard' : 'डैशबोर्ड पर जाएं'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => navigate(`/dashboard?viewFarm=${savedFarmResult?.id || ''}`)}
                  className="flex-1 h-12 rounded-[12px] bg-surface-container border border-outline-variant text-on-surface font-semibold text-sm hover:bg-surface-container-high transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-lg">visibility</span>
                  <span>{isEn ? 'View Farm' : 'खेत देखें'}</span>
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={(e) => e.preventDefault()} className="space-y-6">

              {/* ══════════════════════════════════════════════════
                  STEP 1: FARM DETAILS & SOIL DETAILS
                 ══════════════════════════════════════════════════ */}
              {currentStep === 1 && (
                <div className="space-y-6 animate-fadeIn">
                  <div>
                    <h2 className="font-display text-xl font-bold text-primary flex items-center gap-2">
                      <span className="material-symbols-outlined material-fill text-2xl text-primary">
                        agriculture
                      </span>
                      <span>{isEn ? 'Farm Information' : 'खेत की मूल जानकारी'}</span>
                    </h2>
                    <p className="text-xs text-on-surface-variant mt-0.5">
                      {isEn
                        ? 'Enter the name, ownership type and size of your farmland.'
                        : 'अपने खेत का नाम, प्रकार और कुल क्षेत्रफल भरें।'}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Farm Name */}
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-on-surface mb-1.5">
                        {isEn ? 'Farm Name' : 'खेत का नाम'} <span className="text-error">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.farmName}
                        onChange={(e) => handleInputChange('farmName', e.target.value)}
                        placeholder={isEn ? "e.g. Sharma Farm" : "जैसे, शर्मा कृषि फार्म"}
                        className={`w-full h-12 px-4 rounded-xl border ${
                          errors.farmName ? 'border-error bg-error/5 ring-1 ring-error' : 'border-outline-variant'
                        } text-sm font-medium text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 bg-surface-container-lowest`}
                      />
                      {errors.farmName && (
                        <p className="text-xs text-error mt-1 flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">error</span>
                          {errors.farmName}
                        </p>
                      )}
                      <p className="text-[11px] text-on-surface-variant/80 mt-1">
                        {isEn ? 'Give your farm a friendly identifier name.' : 'पहचान के लिए अपने खेत को एक नाम दें।'}
                      </p>
                    </div>

                    {/* Farm Type */}
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-on-surface mb-2">
                        {isEn ? 'Farm Type' : 'खेत का प्रकार'} <span className="text-error">*</span>
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {FARM_TYPES.map((type) => {
                          const isSelected = formData.farmType === type.id;
                          return (
                            <button
                              key={type.id}
                              type="button"
                              onClick={() => handleInputChange('farmType', type.id)}
                              className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                                isSelected
                                  ? 'border-2 border-primary bg-primary/5 text-primary font-bold shadow-xs'
                                  : 'border-outline-variant hover:bg-surface-container-low text-on-surface'
                              }`}
                            >
                              <div className="flex items-center justify-between w-full mb-1">
                                <span className={`material-symbols-outlined text-xl ${isSelected ? 'text-primary' : 'text-outline'}`}>
                                  {type.icon}
                                </span>
                                {isSelected && (
                                  <span className="material-symbols-outlined text-sm text-primary material-fill">
                                    check_circle
                                  </span>
                                )}
                              </div>
                              <span className="text-xs sm:text-sm font-semibold">
                                {isEn ? type.labelEn : type.labelHi}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Farm Area & Unit */}
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-on-surface mb-1.5">
                        {isEn ? 'Total Farm Area' : 'कुल खेत का क्षेत्रफल'} <span className="text-error">*</span>
                      </label>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                          <input
                            type="number"
                            step="0.1"
                            min="0.1"
                            value={formData.area}
                            onChange={(e) => handleInputChange('area', e.target.value)}
                            placeholder="e.g. 12"
                            className={`w-full h-12 px-4 rounded-xl border ${
                              errors.area ? 'border-error bg-error/5 ring-1 ring-error' : 'border-outline-variant'
                            } text-sm font-medium text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 bg-surface-container-lowest`}
                          />
                        </div>

                        <div className="flex gap-2">
                          {AREA_UNITS.map((u) => {
                            const isSelected = formData.areaUnit === u.id;
                            return (
                              <button
                                key={u.id}
                                type="button"
                                onClick={() => handleInputChange('areaUnit', u.id)}
                                className={`px-4 h-12 rounded-xl border text-xs sm:text-sm font-bold transition-all cursor-pointer flex-1 sm:flex-none ${
                                  isSelected
                                    ? 'bg-primary text-white border-primary shadow-xs'
                                    : 'border-outline-variant text-on-surface-variant hover:bg-surface-container-low'
                                }`}
                              >
                                {isEn ? u.labelEn : u.labelHi}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                      {errors.area && (
                        <p className="text-xs text-error mt-1 flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">error</span>
                          {errors.area}
                        </p>
                      )}
                    </div>
                  </div>

                  <hr className="border-outline-variant/30 my-4" />

                  {/* Land & Soil Section */}
                  <div>
                    <h3 className="font-display text-base font-bold text-primary mb-1 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-xl text-primary">landscape</span>
                      <span>{isEn ? 'Land & Soil Details' : 'भूमि एवं मिट्टी का प्रकार'}</span>
                    </h3>
                    <p className="text-xs text-on-surface-variant mb-4">
                      {isEn
                        ? 'Soil properties help calculate exact fertilizer and irrigation needs.'
                        : 'मिट्टी की जानकारी से उपयुक्त खाद व सिंचाई की सिफारिश मिलती है।'}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {/* Soil Type */}
                      <div>
                        <label className="block text-xs font-bold text-on-surface mb-1">
                          {isEn ? 'Soil Type' : 'मिट्टी का प्रकार'}
                        </label>
                        <select
                          value={formData.soilType}
                          onChange={(e) => handleInputChange('soilType', e.target.value)}
                          className="w-full h-11 px-3.5 rounded-xl border border-outline-variant text-xs sm:text-sm font-medium text-on-surface bg-surface-container-lowest focus:outline-none focus:border-primary"
                        >
                          {SOIL_TYPES.map((st) => (
                            <option key={st.id} value={st.id}>
                              {isEn ? st.labelEn : st.labelHi}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Land Ownership */}
                      <div>
                        <label className="block text-xs font-bold text-on-surface mb-1">
                          {isEn ? 'Land Ownership' : 'भूमि का स्वामित्व'}
                        </label>
                        <select
                          value={formData.landOwnership}
                          onChange={(e) => handleInputChange('landOwnership', e.target.value)}
                          className="w-full h-11 px-3.5 rounded-xl border border-outline-variant text-xs sm:text-sm font-medium text-on-surface bg-surface-container-lowest focus:outline-none focus:border-primary"
                        >
                          {LAND_OWNERSHIPS.map((lo) => (
                            <option key={lo.id} value={lo.id}>
                              {isEn ? lo.labelEn : lo.labelHi}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Soil Test Available */}
                      <div>
                        <label className="block text-xs font-bold text-on-surface mb-1">
                          {isEn ? 'Soil Test Available?' : 'मृदा स्वास्थ्य कार्ड (परीक्षण)?'}
                        </label>
                        <div className="flex gap-2">
                          {['Yes', 'No'].map((opt) => (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => handleInputChange('soilTestAvailable', opt)}
                              className={`flex-1 h-11 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                                formData.soilTestAvailable === opt
                                  ? 'bg-primary text-white border-primary shadow-xs'
                                  : 'border-outline-variant text-on-surface-variant hover:bg-surface-container-low'
                              }`}
                            >
                              {opt === 'Yes' ? (isEn ? 'Yes (हाँ)' : 'हाँ') : (isEn ? 'No (नहीं)' : 'नहीं')}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ══════════════════════════════════════════════════
                  STEP 2: FARM LOCATION
                 ══════════════════════════════════════════════════ */}
              {currentStep === 2 && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h2 className="font-display text-xl font-bold text-primary flex items-center gap-2">
                        <span className="material-symbols-outlined material-fill text-2xl text-primary">
                          location_on
                        </span>
                        <span>{isEn ? 'Farm Location' : 'खेत का स्थान'}</span>
                      </h2>
                      <p className="text-xs text-on-surface-variant mt-0.5">
                        {isEn
                          ? 'Pinpoint your farm for village weather forecasts and nearby mandi buyers.'
                          : 'सटीक मौसम पूर्वानुमान और पास की मंडियों के लिए अपना स्थान बताएं।'}
                      </p>
                    </div>

                    {/* Geolocation Trigger Button */}
                    <button
                      type="button"
                      onClick={handleUseCurrentLocation}
                      disabled={locDetecting}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-secondary-fixed/50 border border-secondary text-primary font-bold text-xs hover:bg-secondary-fixed transition-all cursor-pointer shrink-0 shadow-xs"
                    >
                      {locDetecting ? (
                        <span className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <span className="material-symbols-outlined text-base">my_location</span>
                      )}
                      <span>
                        {locDetecting
                          ? (isEn ? 'Detecting Location...' : 'स्थान खोजा जा रहा है...')
                          : (isEn ? 'Use my current location' : 'मेरा वर्तमान स्थान उपयोग करें')}
                      </span>
                    </button>
                  </div>

                  {locMessage && (
                    <div className="p-3 bg-primary/10 border border-primary/20 rounded-xl text-xs text-primary font-medium flex items-center gap-2">
                      <span className="material-symbols-outlined text-base">info</span>
                      <span>{locMessage}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* State Dropdown */}
                    <div>
                      <label className="block text-xs font-bold text-on-surface mb-1.5">
                        {isEn ? 'State' : 'राज्य'} <span className="text-error">*</span>
                      </label>
                      <div className="relative">
                        <select
                          value={formData.state}
                          onChange={(e) => handleStateChange(e.target.value)}
                          className={`w-full h-12 px-3.5 pr-10 rounded-xl border ${
                            errors.state ? 'border-error ring-1 ring-error' : 'border-outline-variant'
                          } text-xs sm:text-sm font-medium text-on-surface bg-surface-container-lowest focus:outline-none focus:border-primary appearance-none cursor-pointer`}
                        >
                          <option value="">{isEn ? '-- Select State --' : '-- राज्य चुनें --'}</option>
                          {INDIAN_STATES.map((st) => (
                            <option key={st} value={st}>
                              {st}
                            </option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-outline">
                          <span className="material-symbols-outlined text-lg">expand_more</span>
                        </div>
                      </div>
                      {errors.state && <p className="text-xs text-error mt-1">{errors.state}</p>}
                    </div>

                    {/* District Dependent Searchable Dropdown */}
                    <div className="relative" ref={districtDropdownRef}>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-bold text-on-surface">
                          {isEn ? 'District' : 'जिला'} <span className="text-error">*</span>
                        </label>
                        {formData.state && !isDistrictsLoading && (
                          <span className="text-[11px] text-on-surface-variant font-medium">
                            {availableDistricts.length} {isEn ? 'districts' : 'जिले'}
                          </span>
                        )}
                      </div>

                      {/* Dropdown Trigger Button */}
                      <button
                        type="button"
                        disabled={!formData.state || isDistrictsLoading}
                        onClick={() => {
                          if (formData.state && !isDistrictsLoading) {
                            setIsDistrictDropdownOpen((prev) => !prev);
                          }
                        }}
                        className={`w-full h-12 px-4 rounded-xl border text-left flex items-center justify-between transition-all select-none ${
                          !formData.state
                            ? 'bg-surface-container/60 border-outline-variant/50 text-on-surface-variant/60 cursor-not-allowed'
                            : isDistrictsLoading
                            ? 'bg-surface-container-low border-outline-variant text-on-surface-variant cursor-wait'
                            : errors.district
                            ? 'border-error bg-error/5 ring-1 ring-error text-on-surface cursor-pointer'
                            : isDistrictDropdownOpen
                            ? 'border-primary ring-2 ring-primary/20 bg-surface-container-lowest text-on-surface cursor-pointer'
                            : 'border-outline-variant bg-surface-container-lowest hover:border-primary text-on-surface cursor-pointer'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate flex-1 min-w-0">
                          {isDistrictsLoading ? (
                            <span className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin shrink-0" />
                          ) : (
                            <span className="material-symbols-outlined text-base text-outline shrink-0">
                              {!formData.state ? 'lock' : 'location_city'}
                            </span>
                          )}
                          <span className={`text-xs sm:text-sm truncate ${
                            !formData.state
                              ? 'text-on-surface-variant/60 font-medium'
                              : isDistrictsLoading
                              ? 'text-primary font-medium'
                              : formData.district
                              ? 'text-on-surface font-semibold'
                              : 'text-on-surface-variant font-medium'
                          }`}>
                            {!formData.state
                              ? (isEn ? 'Select state first' : 'पहले राज्य चुनें')
                              : isDistrictsLoading
                              ? (isEn ? 'Loading districts...' : 'जिले लोड हो रहे हैं...')
                              : formData.district
                              ? formData.district
                              : (isEn ? 'Select District' : 'जिला चुनें')}
                          </span>
                        </div>

                        <div className="flex items-center gap-1 shrink-0 ml-2">
                          {formData.district && !isDistrictsLoading && (
                            <span
                              role="button"
                              tabIndex={0}
                              onClick={handleClearDistrict}
                              title={isEn ? 'Clear selected district' : 'जिला हटाएं'}
                              className="w-5 h-5 rounded-full hover:bg-surface-container-high flex items-center justify-center text-outline hover:text-on-surface text-xs font-bold mr-0.5 cursor-pointer"
                            >
                              ✕
                            </span>
                          )}
                          <span className={`material-symbols-outlined text-lg text-outline transition-transform duration-200 ${
                            isDistrictDropdownOpen ? 'rotate-180 text-primary' : ''
                          }`}>
                            expand_more
                          </span>
                        </div>
                      </button>

                      {/* Searchable Dropdown Overlay */}
                      {isDistrictDropdownOpen && formData.state && !isDistrictsLoading && (
                        <div className="absolute top-full left-0 right-0 mt-1.5 z-40 bg-surface-container-lowest border border-outline-variant/60 rounded-2xl shadow-xl overflow-hidden animate-fadeIn">
                          {/* Search Input Box */}
                          <div className="p-2.5 border-b border-outline-variant/30 bg-surface-container-low">
                            <div className="relative">
                              <input
                                ref={districtSearchInputRef}
                                type="text"
                                value={districtSearch}
                                onChange={(e) => setDistrictSearch(e.target.value)}
                                placeholder={isEn ? "Search district (e.g. Meerut, Patna)..." : "जिला खोजें (जैसे मेरठ, पटना)..."}
                                className="w-full h-9 pl-8 pr-7 rounded-lg border border-outline-variant text-xs font-medium text-on-surface bg-surface-container-lowest focus:outline-none focus:border-primary"
                              />
                              <span className="material-symbols-outlined absolute left-2 top-2 text-outline text-base">
                                search
                              </span>
                              {districtSearch && (
                                <button
                                  type="button"
                                  onClick={() => setDistrictSearch('')}
                                  className="absolute right-2 top-1.5 text-outline hover:text-on-surface text-xs font-bold"
                                >
                                  ✕
                                </button>
                              )}
                            </div>
                          </div>

                          {/* District Options List */}
                          <div className="max-h-60 overflow-y-auto divide-y divide-outline-variant/15 p-1">
                            {filteredDistricts.length > 0 ? (
                              filteredDistricts.map((d) => {
                                const isSelected = formData.district === d;
                                return (
                                  <button
                                    key={d}
                                    type="button"
                                    onClick={() => handleSelectDistrict(d)}
                                    className={`w-full px-3.5 py-2.5 text-left text-xs sm:text-sm rounded-xl transition-all flex items-center justify-between cursor-pointer ${
                                      isSelected
                                        ? 'bg-primary/10 text-primary font-bold'
                                        : 'text-on-surface hover:bg-surface-container-low hover:text-primary'
                                    }`}
                                  >
                                    <span>{d}</span>
                                    {isSelected && (
                                      <span className="material-symbols-outlined text-base text-primary material-fill">
                                        check
                                      </span>
                                    )}
                                  </button>
                                );
                              })
                            ) : (
                              <div className="p-4 text-center text-xs text-on-surface-variant space-y-1">
                                <span className="material-symbols-outlined text-xl text-outline">search_off</span>
                                <p>{isEn ? `No districts found matching "${districtSearch}"` : `"${districtSearch}" से मिलता कोई जिला नहीं मिला`}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {errors.district && (
                        <p className="text-xs text-error mt-1 flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">error</span>
                          {errors.district}
                        </p>
                      )}
                    </div>

                    {/* Village / Town Input */}
                    <div>
                      <label className="block text-xs font-bold text-on-surface mb-1.5">
                        {isEn ? 'Village / Town' : 'गांव / शहर'} <span className="text-error">*</span>
                      </label>
                      <input
                        type="text"
                        disabled={!formData.state || !formData.district}
                        value={formData.village}
                        onChange={(e) => handleInputChange('village', e.target.value)}
                        placeholder={
                          !formData.state
                            ? (isEn ? "Select state first" : "पहले राज्य चुनें")
                            : !formData.district
                            ? (isEn ? "Select district first" : "पहले जिला चुनें")
                            : (isEn ? "e.g. Khanna Village" : "जैसे, खन्ना गांव")
                        }
                        className={`w-full h-12 px-4 rounded-xl border ${
                          !formData.state || !formData.district
                            ? 'bg-surface-container/60 border-outline-variant/50 text-on-surface-variant/60 cursor-not-allowed'
                            : errors.village
                            ? 'border-error ring-1 ring-error bg-error/5 text-on-surface'
                            : 'border-outline-variant bg-surface-container-lowest text-on-surface focus:border-primary'
                        } text-xs sm:text-sm font-medium focus:outline-none`}
                      />
                      {errors.village && <p className="text-xs text-error mt-1">{errors.village}</p>}
                    </div>

                    {/* Pincode Input */}
                    <div>
                      <label className="block text-xs font-bold text-on-surface mb-1.5">
                        {isEn ? 'Pincode' : 'पिनकोड (6 अंक)'} <span className="text-error">*</span>
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        value={formData.pincode}
                        onChange={(e) => handleInputChange('pincode', e.target.value.replace(/\D/g, ''))}
                        placeholder="250001"
                        className={`w-full h-12 px-4 rounded-xl border ${
                          errors.pincode ? 'border-error ring-1 ring-error' : 'border-outline-variant'
                        } text-xs sm:text-sm font-medium text-on-surface bg-surface-container-lowest focus:outline-none focus:border-primary`}
                      />
                      {errors.pincode && <p className="text-xs text-error mt-1">{errors.pincode}</p>}
                    </div>
                  </div>

                  {/* Agricultural Map Card Preview */}
                  <div className="mt-4 p-4 rounded-2xl bg-surface-container-low border border-outline-variant/40 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-2xl">pin_drop</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-xs sm:text-sm text-on-surface">
                          {formData.village
                            ? `${formData.village}, ${formData.district || ''}, ${formData.state}`
                            : (isEn ? 'Location Map Pin' : 'स्थान पिन विवरण')}
                        </h4>
                        <p className="text-[11px] text-on-surface-variant">
                          {formData.latitude
                            ? `GPS Coordinates: ${formData.latitude}°N, ${formData.longitude}°E`
                            : (isEn ? 'Location helps connect you with buyers in your radius.' : 'स्थान से आपके आस-पास के खरीदार जुड़ पाएंगे।')}
                        </p>
                      </div>
                    </div>

                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary flex items-center gap-1 shrink-0">
                      <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                      {formData.locationDetected ? (isEn ? 'GPS Linked' : 'जीपीएस जुड़ा है') : (isEn ? 'Manual Address' : 'पता दर्ज')}
                    </span>
                  </div>
                </div>
              )}

              {/* ══════════════════════════════════════════════════
                  STEP 3: CROPS & FARMING PRACTICES
                 ══════════════════════════════════════════════════ */}
              {currentStep === 3 && (
                <div className="space-y-6 animate-fadeIn">
                  <div>
                    <h2 className="font-display text-xl font-bold text-primary flex items-center gap-2">
                      <span className="material-symbols-outlined material-fill text-2xl text-primary">
                        psychiatry
                      </span>
                      <span>{isEn ? 'Crops & Farming Practices' : 'फसलें एवं कृषि पद्धतियां'}</span>
                    </h2>
                    <p className="text-xs text-on-surface-variant mt-0.5">
                      {isEn
                        ? 'Select what you grow to receive customized disease alerts and crop market rates.'
                        : 'फसल दर और रोग निदान के लिए अपनी उगाई जाने वाली फसलें चुनें।'}
                    </p>
                  </div>

                  {/* Primary Crop - Selectable / Searchable */}
                  <div>
                    <label className="block text-xs font-bold text-on-surface mb-2">
                      {isEn ? 'Primary Crop' : 'मुख्य फसल'} <span className="text-error">*</span>
                    </label>

                    {/* Quick Selected Crop Badge */}
                    <div className="mb-3 flex items-center gap-3 p-3 bg-primary/5 rounded-xl border border-primary/20">
                      <span className="text-2xl">
                        {PRIMARY_CROPS_LIST.find((c) => c.id === formData.primaryCrop)?.emoji || '🌱'}
                      </span>
                      <div>
                        <span className="text-xs text-on-surface-variant block font-medium">
                          {isEn ? 'Currently Selected Primary Crop:' : 'चयनित मुख्य फसल:'}
                        </span>
                        <span className="font-bold text-sm text-primary">
                          {formData.primaryCrop}
                        </span>
                      </div>
                    </div>

                    {/* Search filter for primary crop */}
                    <div className="relative mb-3">
                      <input
                        type="text"
                        value={cropSearch}
                        onChange={(e) => setCropSearch(e.target.value)}
                        placeholder={isEn ? "Search crop (e.g. Wheat, Rice, Mustard...)" : "फसल खोजें (जैसे गेहूं, धान, सरसों...)"}
                        className="w-full h-10 px-4 pl-9 rounded-xl border border-outline-variant text-xs sm:text-sm font-medium text-on-surface bg-surface-container-lowest focus:outline-none focus:border-primary"
                      />
                      <span className="material-symbols-outlined absolute left-2.5 top-2.5 text-outline text-lg">search</span>
                      {cropSearch && (
                        <button
                          type="button"
                          onClick={() => setCropSearch('')}
                          className="absolute right-3 top-2 text-outline hover:text-on-surface text-xs font-bold"
                        >
                          ✕
                        </button>
                      )}
                    </div>

                    {/* Crop Options Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
                      {filteredPrimaryCrops.map((crop) => {
                        const isSelected = formData.primaryCrop === crop.id;
                        return (
                          <button
                            key={crop.id}
                            type="button"
                            onClick={() => handleInputChange('primaryCrop', crop.id)}
                            className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-primary text-white border-primary shadow-xs font-bold scale-[1.02]'
                                : 'border-outline-variant hover:bg-surface-container-low text-on-surface'
                            }`}
                          >
                            <span className="text-2xl">{crop.emoji}</span>
                            <span className="text-xs text-center">
                              {isEn ? crop.labelEn : crop.labelHi}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                    {errors.primaryCrop && (
                      <p className="text-xs text-error mt-1 flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">error</span>
                        {errors.primaryCrop}
                      </p>
                    )}
                  </div>

                  {/* Other Crops (Multiple Select) */}
                  <div>
                    <label className="block text-xs font-bold text-on-surface mb-2">
                      {isEn ? 'Other Crops (Intercropping / Seasonal)' : 'अन्य फसलें (सांझा / मौसमी)'}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {OTHER_CROPS_OPTIONS.map((c) => {
                        const isSelected = formData.otherCrops.includes(c.id);
                        return (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => handleToggleOtherCrop(c.id)}
                            className={`px-3 py-1.5 rounded-full border text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                              isSelected
                                ? 'bg-secondary-container text-on-secondary-container border-secondary font-bold'
                                : 'border-outline-variant text-on-surface-variant hover:bg-surface-container-low'
                            }`}
                          >
                            <span>{isSelected ? '✓' : '+'}</span>
                            <span>{isEn ? c.labelEn : c.labelHi}</span>
                          </button>
                        );
                      })}
                    </div>
                    <p className="text-[11px] text-on-surface-variant mt-1.5">
                      {isEn
                        ? 'Select all other crops that apply to your crop rotation cycle.'
                        : 'फसल चक्र में उगाई जाने वाली अन्य फसलें चुनें।'}
                    </p>
                  </div>

                  <hr className="border-outline-variant/30 my-4" />

                  {/* Experience & Practices */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-on-surface mb-1.5">
                        {isEn ? 'Farming Experience' : 'खेती का अनुभव'}
                      </label>
                      <select
                        value={formData.experience}
                        onChange={(e) => handleInputChange('experience', e.target.value)}
                        className="w-full h-11 px-3.5 rounded-xl border border-outline-variant text-xs sm:text-sm font-medium text-on-surface bg-surface-container-lowest focus:outline-none focus:border-primary"
                      >
                        {FARMING_EXPERIENCE.map((exp) => (
                          <option key={exp.id} value={exp.id}>
                            {isEn ? exp.labelEn : exp.labelHi}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-on-surface mb-1.5">
                        {isEn ? 'Current Farming Practices' : 'वर्तमान कृषि पद्धति'}
                      </label>
                      <select
                        value={formData.practices}
                        onChange={(e) => handleInputChange('practices', e.target.value)}
                        className="w-full h-11 px-3.5 rounded-xl border border-outline-variant text-xs sm:text-sm font-medium text-on-surface bg-surface-container-lowest focus:outline-none focus:border-primary"
                      >
                        {FARMING_PRACTICES.map((pr) => (
                          <option key={pr.id} value={pr.id}>
                            {isEn ? pr.labelEn : pr.labelHi}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* ══════════════════════════════════════════════════
                  STEP 4: IRRIGATION, PHOTO & EXTRAS
                 ══════════════════════════════════════════════════ */}
              {currentStep === 4 && (
                <div className="space-y-6 animate-fadeIn">
                  <div>
                    <h2 className="font-display text-xl font-bold text-primary flex items-center gap-2">
                      <span className="material-symbols-outlined material-fill text-2xl text-primary">
                        water_drop
                      </span>
                      <span>{isEn ? 'Irrigation Details' : 'सिंचाई व्यवस्था एवं अन्य विवरण'}</span>
                    </h2>
                    <p className="text-xs text-on-surface-variant mt-0.5">
                      {isEn
                        ? 'Select your farm’s water sources, equipment and optional photo.'
                        : 'खेत के पानी के स्रोत, उपकरण और फोटो जोड़ें।'}
                    </p>
                  </div>

                  {/* Irrigation Type - Selectable Cards */}
                  <div>
                    <label className="block text-xs font-bold text-on-surface mb-2">
                      {isEn ? 'Primary Irrigation Type' : 'मुख्य सिंचाई का साधन'} <span className="text-error">*</span>
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {IRRIGATION_TYPES.map((opt) => {
                        const isSelected = formData.irrigationType === opt.id;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => handleInputChange('irrigationType', opt.id)}
                            className={`p-3.5 rounded-xl border flex flex-col items-center justify-center text-center transition-all cursor-pointer relative ${
                              isSelected
                                ? 'border-2 border-primary bg-primary/10 text-primary font-bold shadow-xs'
                                : 'border-outline-variant hover:bg-surface-container-low text-on-surface'
                            }`}
                          >
                            <span className="text-2xl mb-1">{opt.emoji}</span>
                            <span className="text-xs sm:text-sm font-semibold">
                              {isEn ? opt.labelEn : opt.labelHi}
                            </span>
                            {isSelected && (
                              <span className="absolute top-2 right-2 material-symbols-outlined text-sm text-primary material-fill">
                                check_circle
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                    {errors.irrigationType && (
                      <p className="text-xs text-error mt-1 flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">error</span>
                        {errors.irrigationType}
                      </p>
                    )}
                  </div>

                  {/* Water Availability */}
                  <div>
                    <label className="block text-xs font-bold text-on-surface mb-2">
                      {isEn ? 'Water Availability' : 'पानी की उपलब्धता'}
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {WATER_AVAILABILITIES.map((wa) => {
                        const isSelected = formData.waterAvailability === wa.id;
                        return (
                          <button
                            key={wa.id}
                            type="button"
                            onClick={() => handleInputChange('waterAvailability', wa.id)}
                            className={`p-3 rounded-xl border flex items-center gap-2.5 transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-primary text-white border-primary shadow-xs font-bold'
                                : 'border-outline-variant text-on-surface hover:bg-surface-container-low'
                            }`}
                          >
                            <span className="material-symbols-outlined text-lg">
                              {wa.icon}
                            </span>
                            <span className="text-xs sm:text-sm">
                              {isEn ? wa.labelEn : wa.labelHi}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <hr className="border-outline-variant/30 my-4" />

                  {/* Farm Photo Upload Section */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold text-on-surface flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-base text-primary">add_a_photo</span>
                        <span>{isEn ? 'Farm Photo (Optional)' : 'खेत की फोटो (वैकल्पिक)'}</span>
                      </label>
                      <span className="text-[11px] text-on-surface-variant font-medium">
                        {isEn ? 'JPG, PNG up to 5MB' : 'JPG, PNG अधिकतम 5MB'}
                      </span>
                    </div>

                    {formData.farmPhoto ? (
                      <div className="p-4 bg-surface-container-low rounded-2xl border border-outline-variant/40 flex flex-col sm:flex-row items-center gap-4">
                        <div className="w-24 h-24 rounded-xl overflow-hidden border border-outline-variant/60 shrink-0">
                          <img
                            src={formData.farmPhoto}
                            alt="Farm Preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 text-center sm:text-left">
                          <p className="text-xs font-bold text-on-surface">
                            {formData.photoName || (isEn ? 'Farm Photo Uploaded' : 'फोटो अपलोड की गई')}
                          </p>
                          <p className="text-[11px] text-on-surface-variant mt-0.5">
                            {isEn ? 'Photo preview ready for farm card.' : 'खेत कार्ड के लिए फोटो तैयार है।'}
                          </p>
                          <div className="flex items-center justify-center sm:justify-start gap-2 mt-3">
                            <label className="px-3 py-1.5 rounded-lg bg-surface text-primary border border-primary text-xs font-bold hover:bg-primary hover:text-white transition-colors cursor-pointer">
                              <span>{isEn ? 'Change Photo' : 'फोटो बदलें'}</span>
                              <input
                                type="file"
                                accept="image/jpeg,image/png,image/jpg"
                                onChange={handlePhotoUpload}
                                className="hidden"
                              />
                            </label>
                            <button
                              type="button"
                              onClick={handleRemovePhoto}
                              className="px-3 py-1.5 rounded-lg bg-error/10 text-error text-xs font-bold hover:bg-error hover:text-white transition-colors cursor-pointer"
                            >
                              {isEn ? 'Remove' : 'हटाएं'}
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <label className="border-2 border-dashed border-outline-variant/80 hover:border-primary/80 rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center text-center cursor-pointer bg-surface-container-lowest hover:bg-surface-container-low transition-all">
                        <span className="material-symbols-outlined text-4xl text-primary mb-2">
                          cloud_upload
                        </span>
                        <span className="text-xs sm:text-sm font-bold text-on-surface">
                          {isEn ? '📷 Upload Farm Photo' : '📷 खेत की फोटो अपलोड करें'}
                        </span>
                        <span className="text-[11px] text-on-surface-variant mt-1">
                          {isEn ? 'Drag & drop or click to browse from device' : 'क्लिक करके फोटो चुनें या यहां ड्रैग करें'}
                        </span>
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/jpg"
                          onChange={handlePhotoUpload}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>

                  <hr className="border-outline-variant/30 my-4" />

                  {/* Workers & Equipment */}
                  <div className="space-y-4">
                    <h3 className="font-display text-sm font-bold text-primary">
                      {isEn ? 'Additional Information (Optional)' : 'अतिरिक्त जानकारी (वैकल्पिक)'}
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-on-surface mb-1.5">
                          {isEn ? 'Number of Workers' : 'मजदूरों की संख्या'}
                        </label>
                        <select
                          value={formData.workers}
                          onChange={(e) => handleInputChange('workers', e.target.value)}
                          className="w-full h-11 px-3.5 rounded-xl border border-outline-variant text-xs sm:text-sm font-medium text-on-surface bg-surface-container-lowest focus:outline-none focus:border-primary"
                        >
                          {WORKERS_OPTIONS.map((w) => (
                            <option key={w.id} value={w.id}>
                              {isEn ? w.labelEn : w.labelHi}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-on-surface mb-2">
                          {isEn ? 'Available Farm Machinery & Equipment' : 'उपलब्ध कृषि मशीनें व साधन'}
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {EQUIPMENT_OPTIONS.map((eq) => {
                            const isSelected = formData.equipment.includes(eq.id);
                            return (
                              <button
                                key={eq.id}
                                type="button"
                                onClick={() => handleToggleEquipment(eq.id)}
                                className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                                  isSelected
                                    ? 'bg-primary text-white border-primary shadow-xs font-bold'
                                    : 'border-outline-variant text-on-surface hover:bg-surface-container-low'
                                }`}
                              >
                                <span className="material-symbols-outlined text-base">
                                  {eq.icon}
                                </span>
                                <span>{isEn ? eq.labelEn : eq.labelHi}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ══════════════════════════════════════════════════
                  STEP 5: REVIEW BEFORE SUBMIT (FARM SUMMARY)
                 ══════════════════════════════════════════════════ */}
              {currentStep === 5 && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="font-display text-xl font-bold text-primary flex items-center gap-2">
                        <span className="material-symbols-outlined material-fill text-2xl text-primary">
                          fact_check
                        </span>
                        <span>{isEn ? 'Review Farm Details' : 'खेत के विवरण की समीक्षा'}</span>
                      </h2>
                      <p className="text-xs text-on-surface-variant mt-0.5">
                        {isEn
                          ? 'Please review your farm information carefully before saving.'
                          : 'सहेजने से पहले कृपया सभी विवरणों की जांच कर लें।'}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="px-3 py-1.5 rounded-lg bg-surface border border-primary text-primary text-xs font-bold hover:bg-primary hover:text-white transition-all cursor-pointer flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-sm">edit</span>
                      <span>{isEn ? 'Edit Details' : 'संपादित करें'}</span>
                    </button>
                  </div>

                  {/* Summary Card */}
                  <div className="p-6 rounded-2xl bg-surface-container-low border border-outline-variant/50 space-y-5 shadow-xs">
                    
                    {/* Header line with Name & Photo */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-outline-variant/30 pb-4">
                      <div className="flex items-center gap-3">
                        {formData.farmPhoto ? (
                          <img
                            src={formData.farmPhoto}
                            alt="Farm"
                            className="w-16 h-16 rounded-xl object-cover border border-outline-variant"
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-2xl shadow-xs">
                            🌱
                          </div>
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-display text-lg sm:text-xl font-bold text-on-surface">
                              {formData.farmName || (isEn ? 'Unnamed Farm' : 'अनाम खेत')}
                            </h3>
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary">
                              {formData.farmType}
                            </span>
                          </div>
                          <p className="text-xs text-on-surface-variant flex items-center gap-1 mt-0.5">
                            <span className="material-symbols-outlined text-sm text-outline">location_on</span>
                            <span>
                              {formData.village}, {formData.district}, {formData.state} - {formData.pincode}
                            </span>
                          </p>
                        </div>
                      </div>

                      <div className="text-left sm:text-right">
                        <span className="text-xs text-on-surface-variant block font-medium">
                          {isEn ? 'Total Area' : 'कुल क्षेत्रफल'}
                        </span>
                        <span className="font-display text-lg sm:text-xl font-bold text-primary">
                          {formData.area} {formData.areaUnit}
                        </span>
                      </div>
                    </div>

                    {/* Key Attributes Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div className="p-3 bg-surface-container-lowest rounded-xl border border-outline-variant/30">
                        <span className="text-on-surface-variant block mb-1 font-medium">
                          {isEn ? 'Primary Crop' : 'मुख्य फसल'}
                        </span>
                        <span className="font-bold text-sm text-primary flex items-center gap-1">
                          🌾 {formData.primaryCrop}
                        </span>
                      </div>

                      <div className="p-3 bg-surface-container-lowest rounded-xl border border-outline-variant/30">
                        <span className="text-on-surface-variant block mb-1 font-medium">
                          {isEn ? 'Irrigation' : 'सिंचाई व्यवस्था'}
                        </span>
                        <span className="font-bold text-sm text-on-surface flex items-center gap-1">
                          💧 {formData.irrigationType}
                        </span>
                      </div>

                      <div className="p-3 bg-surface-container-lowest rounded-xl border border-outline-variant/30">
                        <span className="text-on-surface-variant block mb-1 font-medium">
                          {isEn ? 'Soil Type' : 'मिट्टी का प्रकार'}
                        </span>
                        <span className="font-bold text-sm text-on-surface">
                          {formData.soilType}
                        </span>
                      </div>

                      <div className="p-3 bg-surface-container-lowest rounded-xl border border-outline-variant/30">
                        <span className="text-on-surface-variant block mb-1 font-medium">
                          {isEn ? 'Water Supply' : 'पानी की उपलब्धता'}
                        </span>
                        <span className="font-bold text-sm text-on-surface">
                          {formData.waterAvailability}
                        </span>
                      </div>
                    </div>

                    {/* Secondary Attributes List */}
                    <div className="text-xs space-y-2 pt-2 border-t border-outline-variant/30">
                      {formData.otherCrops && formData.otherCrops.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="font-bold text-on-surface">
                            {isEn ? 'Other Crops:' : 'अन्य फसलें:'}
                          </span>
                          {formData.otherCrops.map((c) => (
                            <span key={c} className="px-2 py-0.5 rounded-md bg-secondary-container/30 text-on-secondary-container font-semibold">
                              {c}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="flex flex-wrap items-center gap-4 text-on-surface-variant">
                        <span>
                          <strong className="text-on-surface">{isEn ? 'Ownership:' : 'स्वामित्व:'}</strong> {formData.landOwnership}
                        </span>
                        <span>
                          <strong className="text-on-surface">{isEn ? 'Soil Test:' : 'मृदा जांच:'}</strong> {formData.soilTestAvailable}
                        </span>
                        <span>
                          <strong className="text-on-surface">{isEn ? 'Practices:' : 'पद्धति:'}</strong> {formData.practices}
                        </span>
                        <span>
                          <strong className="text-on-surface">{isEn ? 'Experience:' : 'अनुभव:'}</strong> {formData.experience}
                        </span>
                      </div>

                      {formData.equipment && formData.equipment.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          <span className="font-bold text-on-surface">
                            {isEn ? 'Equipment:' : 'उपकरण:'}
                          </span>
                          {formData.equipment.map((eq) => (
                            <span key={eq} className="px-2 py-0.5 rounded-md bg-primary/10 text-primary font-medium text-[11px]">
                              {eq}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ══════════════════════════════════════════════════
                  FORM ACTIONS BAR: NEXT / BACK / SAVE / CANCEL
                 ══════════════════════════════════════════════════ */}
              <div className="pt-6 border-t border-outline-variant/30 flex flex-col-reverse sm:flex-row items-center justify-between gap-3">
                {/* Secondary Button: Cancel or Back */}
                <div className="w-full sm:w-auto flex items-center gap-2">
                  {currentStep > 1 ? (
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      className="w-full sm:w-auto h-12 px-6 rounded-xl border border-outline-variant text-on-surface font-semibold text-xs sm:text-sm hover:bg-surface-container transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-lg">arrow_back</span>
                      <span>{isEn ? 'Back' : 'पीछे जाएं'}</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => navigate('/dashboard')}
                      className="w-full sm:w-auto h-12 px-6 rounded-xl border border-outline-variant text-on-surface-variant font-semibold text-xs sm:text-sm hover:bg-surface-container transition-all cursor-pointer"
                    >
                      {isEn ? 'Cancel' : 'रद्द करें'}
                    </button>
                  )}
                </div>

                {/* Primary Button: Next or Save Farm */}
                <div className="w-full sm:w-auto flex items-center gap-2">
                  {currentStep < 5 ? (
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="w-full sm:w-auto h-12 px-8 rounded-xl bg-primary text-white font-bold text-xs sm:text-sm shadow-md hover:bg-primary-container hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                    >
                      <span>{isEn ? 'Next Step' : 'अगला चरण'}</span>
                      <span className="material-symbols-outlined text-lg">arrow_forward</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={isLoading}
                      className="w-full sm:w-auto h-12 px-10 rounded-[12px] bg-gradient-to-r from-emerald-800 to-green-700 hover:from-emerald-900 hover:to-green-800 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <>
                          <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>{isEn ? 'Saving Farm...' : 'सहेजा जा रहा है...'}</span>
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-lg material-fill">check_circle</span>
                          <span>
                            {isEditMode
                              ? (isEn ? 'Update Farm' : 'खेत अपडेट करें')
                              : (isEn ? 'Save Farm' : 'खेत सहेजें')}
                          </span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

            </form>
          )}

        </div>
      </main>

    </div>
  );
}
