import React, { useRef, useState, useEffect } from 'react';
import { ALL_CROPS } from '../../services/khetDoctorService';
import { photoTips } from '../../data/khetDoctorData';
import { ALL_INDIAN_STATES, getDistrictsForState } from '../../data/indiaLocations';

export default function CropUpload({
  lang,
  initialCrop = '',
  initialLocation = 'Meerut, Uttar Pradesh',
  recentHistory = [],
  onImageSelected,
  onAnalyze,
  onViewPreviousDiagnosis,
  isAnalyzing = false,
}) {
  const isEn = lang === 'en';
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  // Component States
  const [selectedImage, setSelectedImage] = useState(null); // { url, file, name, size }
  const [isDragging, setIsDragging] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState(initialCrop || 'wheat');
  const [location, setLocation] = useState(initialLocation || 'Meerut, Uttar Pradesh');
  const [isEditingLocation, setIsEditingLocation] = useState(false);
  const [locState, setLocState] = useState('Uttar Pradesh');
  const [locDistrict, setLocDistrict] = useState('Meerut');
  const [validationError, setValidationError] = useState('');

  // Update crop if initialCrop changes
  useEffect(() => {
    if (initialCrop) {
      setSelectedCrop(initialCrop.toLowerCase());
    }
  }, [initialCrop]);

  // Update location if initialLocation changes
  useEffect(() => {
    if (initialLocation) {
      setLocation(initialLocation);
      const parts = initialLocation.split(',').map((s) => s.trim());
      if (parts.length >= 2) {
        setLocDistrict(parts[0]);
        setLocState(parts[1]);
      }
    }
  }, [initialLocation]);

  // Supported image extensions and size limit (25 MB)
  const VALID_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024; // 25 MB

  const validateFile = (file) => {
    if (!file) {
      return isEn ? 'Please upload a crop image.' : 'कृपया फसल की फोटो अपलोड करें।';
    }
    if (!VALID_MIME_TYPES.includes(file.type.toLowerCase())) {
      return isEn
        ? 'Please upload JPG, PNG or WEBP.'
        : 'कृपया JPG, PNG या WEBP प्रारूप की फोटो ही अपलोड करें।';
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return isEn
        ? 'Image size is too large. Please upload a smaller image (under 25MB).'
        : 'फोटो का आकार बहुत बड़ा है। कृपया 25MB से छोटी फोटो अपलोड करें।';
    }
    return null;
  };

  const handleProcessFile = (file) => {
    setValidationError('');
    const errorMsg = validateFile(file);
    if (errorMsg) {
      setValidationError(errorMsg);
      return;
    }

    try {
      const url = URL.createObjectURL(file);
      const imgData = {
        url,
        file,
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
      };
      setSelectedImage(imgData);
      onImageSelected?.(imgData);
    } catch {
      setValidationError(
        isEn
          ? 'Unable to load image. Please try again with another photo.'
          : 'फोटो लोड करने में असमर्थ। कृपया दूसरी फोटो से प्रयास करें।'
      );
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleProcessFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleProcessFile(file);
  };

  const handleRemove = () => {
    setSelectedImage(null);
    setValidationError('');
    onImageSelected?.(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  const handleSaveLocation = () => {
    const newLoc = `${locDistrict}, ${locState}`;
    setLocation(newLoc);
    setIsEditingLocation(false);
  };

  const handleTriggerAnalyze = () => {
    setValidationError('');
    if (!selectedImage) {
      setValidationError(
        isEn ? 'Please upload a crop image.' : 'कृपया जांच के लिए फसल की फोटो अपलोड करें।'
      );
      return;
    }
    if (!selectedCrop) {
      setValidationError(
        isEn ? 'Please select the crop before analysis.' : 'कृपया जांच से पहले फसल चुनें।'
      );
      return;
    }

    onAnalyze?.({
      crop: selectedCrop,
      image: selectedImage,
      location,
    });
  };

  const availableDistricts = getDistrictsForState(locState);

  return (
    <div className="flex flex-col gap-8">
      {/* ── Page Header ────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-8 h-8 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">medical_services</span>
            </span>
            <span className="text-xs font-bold font-label-md text-primary uppercase tracking-widest">
              {isEn ? 'Mera Khet Ka Doctor • AI Plant Clinic' : 'मेरा खेत का डॉक्टर • एआई फसल क्लिनिक'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
            {isEn ? 'Mera Khet Ka Doctor' : 'मेरा खेत का डॉक्टर'}
          </h1>
          <p className="text-sm text-on-surface-variant max-w-2xl mt-1 leading-relaxed">
            {isEn
              ? 'Upload a photo of your crop and get AI-powered disease insights and treatment guidance.'
              : 'अपनी फसल की फोटो अपलोड करें और एआई-संचालित रोग पहचान व हिंदी उपचार मार्गदर्शन प्राप्त करें।'}
          </p>
        </div>

        {/* Current Location Badge & Edit */}
        <div className="flex items-center gap-2 self-start sm:self-auto bg-surface-container-low px-3.5 py-2 rounded-2xl border border-outline-variant/30 text-xs text-on-surface">
          <span className="material-symbols-outlined text-primary text-base">location_on</span>
          <span className="font-semibold">
            {isEn ? 'Location:' : 'स्थान:'} {location}
          </span>
          <button
            type="button"
            onClick={() => setIsEditingLocation(!isEditingLocation)}
            className="text-primary hover:underline font-bold text-[11px] ml-1 cursor-pointer"
          >
            {isEditingLocation ? (isEn ? 'Done' : 'पूर्ण') : (isEn ? 'Change' : 'बदलें')}
          </button>
        </div>
      </div>

      {/* Edit Location Dropdown Panel */}
      {isEditingLocation && (
        <div className="p-4 rounded-2xl bg-surface-container-low border border-primary/20 space-y-3 animate-fade-in">
          <span className="text-xs font-bold text-on-surface block">
            {isEn ? 'Select Farm State and District for Nearby Shop Recommendations:' : 'दुकान सुझावों के लिए अपना राज्य और जिला चुनें:'}
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-on-surface-variant uppercase block mb-1">
                {isEn ? 'State' : 'राज्य'}
              </label>
              <select
                value={locState}
                onChange={(e) => {
                  setLocState(e.target.value);
                  const firstDist = getDistrictsForState(e.target.value)[0] || '';
                  setLocDistrict(firstDist);
                }}
                className="w-full px-3 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant/40 text-xs font-medium focus:outline-none focus:border-primary"
              >
                {ALL_INDIAN_STATES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[11px] font-bold text-on-surface-variant uppercase block mb-1">
                {isEn ? 'District' : 'जिला'}
              </label>
              <select
                value={locDistrict}
                onChange={(e) => setLocDistrict(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant/40 text-xs font-medium focus:outline-none focus:border-primary"
              >
                {availableDistricts.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleSaveLocation}
              className="px-4 py-1.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-container cursor-pointer"
            >
              {isEn ? 'Apply Location' : 'स्थान लागू करें'}
            </button>
          </div>
        </div>
      )}

      {/* Friendly Validation Error Banner */}
      {validationError && (
        <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-2.5 text-rose-800 text-xs font-medium animate-fade-in">
          <span className="material-symbols-outlined text-lg shrink-0">error</span>
          <span>{validationError}</span>
        </div>
      )}

      {/* ── Main Layout: LEFT (8 cols) & RIGHT (4 cols) ────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* ─── LEFT: Crop Image Upload & Diagnosis Form (8 cols) ─── */}
        <div className="lg:col-span-8 bg-surface-container-lowest rounded-3xl p-6 sm:p-8 border border-outline-variant/30 shadow-xs flex flex-col gap-6 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-2xl">crop_free</span>
              </div>
              <div>
                <h2 className="font-bold text-lg text-on-surface">
                  {isEn ? 'Upload Crop Photo' : 'फसल की फोटो अपलोड करें'}
                </h2>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  {isEn
                    ? 'Take a clear photo of the affected leaf, stem, fruit or crop.'
                    : 'प्रभावित पत्ते, तना, फल या पौधे की स्पष्ट फोटो लें।'}
                </p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-primary/10 text-primary border border-primary/20 shrink-0">
              {isEn ? 'AI Health Check' : 'एआई जांच'}
            </span>
          </div>

          {/* ── Upload Area / Preview ── */}
          {selectedImage ? (
            /* Selected Image Preview with Replace & Remove */
            <div className="relative rounded-2xl overflow-hidden border border-outline-variant/40 bg-surface-container-low shadow-xs">
              <img
                src={selectedImage.url}
                alt="Selected crop specimen"
                className="w-full h-64 sm:h-80 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-4">
                <div className="text-white flex-1 min-w-0 mr-3">
                  <span className="text-[10px] font-mono uppercase tracking-wider opacity-80 block">
                    {isEn ? 'Ready for Analysis' : 'जांच के लिए तैयार'}
                  </span>
                  <p className="text-sm font-bold truncate">{selectedImage.name}</p>
                  <p className="text-[11px] text-white/80">{selectedImage.size}</p>
                </div>
              </div>

              {/* Action Buttons Top Right */}
              <div className="absolute top-3 right-3 flex gap-2">
                <label
                  htmlFor="file-input-replace"
                  className="px-3 py-1.5 bg-white/90 text-on-surface rounded-xl text-xs font-bold cursor-pointer hover:bg-white transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <span className="material-symbols-outlined text-[16px]">swap_horiz</span>
                  <span>{isEn ? 'Replace' : 'बदलें'}</span>
                </label>
                <input
                  id="file-input-replace"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <button
                  type="button"
                  onClick={handleRemove}
                  className="px-3 py-1.5 bg-rose-600/90 text-white rounded-xl text-xs font-bold cursor-pointer hover:bg-rose-600 transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <span className="material-symbols-outlined text-[16px]">delete</span>
                  <span>{isEn ? 'Remove' : 'हटाएं'}</span>
                </button>
              </div>
            </div>
          ) : (
            /* Drag & Drop Upload Dropzone */
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-3xl p-8 sm:p-10 text-center transition-all cursor-pointer ${
                isDragging
                  ? 'border-primary bg-primary/10 scale-[1.01]'
                  : 'border-outline-variant/60 hover:border-primary hover:bg-primary/5 bg-surface-container-low/60'
              }`}
            >
              {/* Native Hidden File Inputs */}
              <input
                ref={fileInputRef}
                id="crop-file-input"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                onChange={handleFileChange}
                aria-label={isEn ? 'Upload crop photo' : 'फसल फोटो अपलोड करें'}
              />
              <input
                ref={cameraInputRef}
                id="crop-camera-input"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                capture="environment"
                className="hidden"
                onChange={handleFileChange}
              />

              {/* Friendly Empty State */}
              <div className="w-16 h-16 bg-surface-container-high rounded-full flex items-center justify-center mx-auto mb-3 shadow-xs">
                <span className="text-3xl">🌱</span>
              </div>

              <h3 className="font-bold text-base sm:text-lg text-on-surface mb-1">
                {isEn ? 'No crop image selected' : 'कोई फोटो नहीं चुनी गई'}
              </h3>
              <p className="text-xs sm:text-sm text-on-surface-variant max-w-md mx-auto mb-5">
                {isEn
                  ? 'Upload a clear photo of the affected crop to get started. Supports JPG, PNG, WEBP (up to 25 MB).'
                  : 'शुरू करने के लिए प्रभावित फसल की साफ फोटो अपलोड करें। (JPG, PNG, WEBP — 25MB तक)'}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center pointer-events-none">
                <label
                  htmlFor="crop-camera-input"
                  className="pointer-events-auto px-5 py-2.5 bg-primary text-white rounded-xl text-xs font-bold shadow-xs hover:bg-primary-container transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className="material-symbols-outlined text-base">photo_camera</span>
                  <span>{isEn ? 'Take Photo' : 'फोटो खींचें'}</span>
                </label>
                <label
                  htmlFor="crop-file-input"
                  className="pointer-events-auto px-5 py-2.5 bg-surface-container-high text-on-surface rounded-xl text-xs font-bold hover:bg-surface-container-highest transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 border border-outline-variant/30"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className="material-symbols-outlined text-base">upload_file</span>
                  <span>{isEn ? 'Upload Photo' : 'गैलरी से अपलोड'}</span>
                </label>
              </div>
            </div>
          )}

          {/* ── Requirement 5: Crop Selection ──────────────────────── */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant block">
                {isEn ? 'Select Crop' : 'फसल चुनें'} <span className="text-rose-600">*</span>
              </label>
              {initialCrop && (
                <span className="text-[11px] text-primary font-semibold">
                  {isEn ? `Pre-selected from your farm: ${initialCrop}` : `आपके खेत से चुनी गई: ${initialCrop}`}
                </span>
              )}
            </div>

            {/* Quick Crop Chips Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {ALL_CROPS.slice(0, 8).map((crop) => {
                const isSelected = selectedCrop === crop.id;
                return (
                  <button
                    key={crop.id}
                    type="button"
                    onClick={() => {
                      setSelectedCrop(crop.id);
                      setValidationError('');
                    }}
                    className={`p-3 rounded-2xl border text-xs font-semibold text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                      isSelected
                        ? 'bg-primary text-white border-primary shadow-xs'
                        : 'bg-surface-container-low text-on-surface border-outline-variant/30 hover:bg-surface-container'
                    }`}
                  >
                    <span className="material-symbols-outlined text-lg shrink-0">
                      {crop.icon}
                    </span>
                    <span className="truncate">{isEn ? crop.labelEn : crop.labelHi}</span>
                  </button>
                );
              })}
            </div>

            {/* Searchable Dropdown for All Crops */}
            <div className="pt-1">
              <select
                value={selectedCrop}
                onChange={(e) => {
                  setSelectedCrop(e.target.value);
                  setValidationError('');
                }}
                className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-xs font-medium text-on-surface focus:outline-none focus:border-primary cursor-pointer"
              >
                {ALL_CROPS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {isEn ? c.labelEn : c.labelHi}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* ── Requirement 7: Primary Analyze CTA Button ──────────── */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleTriggerAnalyze}
              disabled={isAnalyzing}
              className={`w-full py-4 rounded-2xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
                isAnalyzing
                  ? 'bg-primary/50 text-white cursor-not-allowed'
                  : 'bg-primary text-white hover:bg-primary-container active:scale-[0.99]'
              }`}
            >
              {isAnalyzing ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{isEn ? 'Analyzing your crop...' : 'फसल की जांच हो रही है...'}</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-lg">search</span>
                  <span>{isEn ? 'Analyze Crop' : 'फसल की जांच करें'}</span>
                </>
              )}
            </button>
            <p className="text-[11px] text-on-surface-variant text-center mt-2 italic">
              {isEn
                ? 'AI-based preliminary assessment. Informational only.'
                : 'एआई-आधारित प्रारंभिक आंकलन। केवल सूचना मार्गदर्शन हेतु।'}
            </p>
          </div>
        </div>

        {/* ─── RIGHT: How It Works / Tips / History / Helpline (4 cols) ─── */}
        <div className="lg:col-span-4 flex flex-col gap-6">

          {/* How It Works */}
          <div className="bg-surface-container-lowest rounded-3xl p-6 border border-outline-variant/30 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-primary">
              <span className="material-symbols-outlined text-xl">help</span>
              <h3 className="font-bold text-sm text-on-surface">
                {isEn ? 'How It Works' : 'यह कैसे काम करता है?'}
              </h3>
            </div>
            <div className="space-y-3 text-xs text-on-surface-variant">
              {[
                { step: '1', title: isEn ? 'Take Photo' : 'फोटो लें', desc: isEn ? 'Capture clear photo of affected leaf or stem.' : 'प्रभावित पत्ते या तने की साफ फोटो लें।' },
                { step: '2', title: isEn ? 'Select Crop' : 'फसल चुनें', desc: isEn ? 'Choose Wheat, Rice, Tomato, Potato, etc.' : 'गेहूं, धान, टमाटर, आलू आदि फसल चुनें।' },
                { step: '3', title: isEn ? 'Instant Diagnosis' : 'त्वरित जांच', desc: isEn ? 'Get disease name, severity & confidence score.' : 'संभावित बीमारी का नाम व गंभीरता स्तर पाएं।' },
                { step: '4', title: isEn ? 'Hindi Treatment' : 'हिंदी इलाज', desc: isEn ? 'Read Dos and Don’ts and locate nearby shops.' : 'क्या करें, क्या न करें और नजदीकी दुकानें देखें।' },
              ].map((item) => (
                <div key={item.step} className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-primary/10 text-primary font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    {item.step}
                  </span>
                  <div>
                    <strong className="text-on-surface block font-semibold">{item.title}</strong>
                    <span className="leading-relaxed">{item.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Photo Tips Card */}
          <div className="bg-surface-container-lowest rounded-3xl p-6 border border-outline-variant/30 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-amber-700">
              <span className="material-symbols-outlined text-xl">tips_and_updates</span>
              <h3 className="font-bold text-sm text-on-surface">
                {isEn ? 'Tips for Accurate Photos' : 'सटीक फोटो के लिए सुझाव'}
              </h3>
            </div>
            <ul className="space-y-2.5 text-xs text-on-surface-variant">
              {photoTips.slice(0, 3).map((tip, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-emerald-600 text-sm mt-0.5 shrink-0">
                    check_circle
                  </span>
                  <div>
                    <span className="font-semibold text-on-surface block">
                      {isEn ? tip.titleEn : tip.titleHi}
                    </span>
                    <span className="text-[11px] leading-relaxed">
                      {isEn ? tip.descEn : tip.descHi}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Krishi Helpline */}
          <div className="bg-gradient-to-br from-primary to-primary-container text-white rounded-3xl p-6 shadow-md space-y-3 relative overflow-hidden">
            <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-[96px] text-white/10 pointer-events-none">
              support_agent
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/20 text-white inline-block">
              {isEn ? 'Toll-Free Helpline' : 'निशुल्क हेल्पलाइन'}
            </span>
            <h4 className="font-bold text-base">
              {isEn ? 'Need Expert Agronomist Support?' : 'कृषि वैज्ञानिक से बात करें?'}
            </h4>
            <p className="text-xs text-white/90 leading-relaxed">
              {isEn
                ? 'Speak directly with government agricultural scientists at Kisan Call Center.'
                : 'किसान कॉल सेंटर के माध्यम से कृषि विशेषज्ञों से सीधे संपर्क करें।'}
            </p>
            <a
              href="tel:18001801551"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-primary font-bold text-xs shadow-xs hover:bg-surface-container transition-all"
            >
              <span className="material-symbols-outlined text-sm">call</span>
              <span>1800-180-1551</span>
            </a>
          </div>

        </div>
      </div>

      {/* ── Requirement 14: Recent Diagnosis History Section ─────────── */}
      <div className="bg-surface-container-lowest rounded-3xl p-6 sm:p-8 border border-outline-variant/30 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-surface-container text-primary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-xl">history</span>
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg text-on-surface">
                {isEn ? 'My Diagnosis History' : 'मेरी फसल जांच का इतिहास'}
              </h3>
              <p className="text-xs text-on-surface-variant">
                {isEn ? 'Your previous crop health scans' : 'आपके द्वारा की गई पिछली जांचें'}
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold text-primary">
            {recentHistory.length} {isEn ? 'Records' : 'रिकॉर्ड'}
          </span>
        </div>

        {recentHistory.length === 0 ? (
          <div className="p-8 text-center bg-surface-container-low rounded-2xl text-xs text-on-surface-variant space-y-1">
            <span className="material-symbols-outlined text-2xl text-on-surface-variant/50">
              history_toggle_off
            </span>
            <p>{isEn ? 'No diagnoses saved yet. Your scan history will appear here.' : 'अभी तक कोई जांच सहेजी नहीं गई है। आपकी स्कैन हिस्ट्री यहाँ दिखेगी।'}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {recentHistory.map((item) => (
              <div
                key={item.id}
                onClick={() => onViewPreviousDiagnosis?.(item)}
                className="p-3.5 rounded-2xl bg-surface-container-low border border-outline-variant/30 hover:border-primary/40 hover:shadow-xs transition-all cursor-pointer flex gap-3 items-center group"
              >
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-surface-container shrink-0">
                  <img
                    src={item.imageUrl || 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=200&q=80'}
                    alt={item.crop}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <span className="text-[10px] text-on-surface-variant">{item.dateEn || item.date}</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-primary/10 text-primary">
                      {item.confidence}%
                    </span>
                  </div>
                  <h4 className="font-bold text-xs text-on-surface truncate group-hover:text-primary transition-colors">
                    {isEn ? item.crop : (item.cropHi || item.crop)}: {isEn ? item.diseaseEn : (item.diseaseHi || item.diseaseEn)}
                  </h4>
                  <div className="flex items-center justify-between text-[11px] text-primary font-semibold mt-1">
                    <span>{isEn ? 'View Diagnosis →' : 'विवरण देखें →'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
