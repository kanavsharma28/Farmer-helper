import React, { useState, useRef, useCallback } from 'react';
import { photoTips, MOCK_LOCATION } from '../../data/cropLossData';

const MAX_PHOTOS = 10;

export default function PhotoLocationStep({ lang, data, onNext, onBack }) {
  const isEn = lang === 'en';
  const [photos, setPhotos]   = useState(data?.photos || []);
  const [location, setLocation] = useState(data?.location || null);
  const [locLoading, setLocLoading] = useState(false);
  const [locError, setLocError]     = useState(false);
  const [errors, setErrors]   = useState({});
  const fileRef = useRef();
  const cameraRef = useRef();

  // Add images from file input
  const handleFiles = useCallback((files) => {
    if (!files?.length) return;
    const arr = Array.from(files).slice(0, MAX_PHOTOS - photos.length);
    const readers = arr.map(file => new Promise(res => {
      const reader = new FileReader();
      reader.onload = (e) => res({ id: Date.now() + Math.random(), url: e.target.result, file, name: file.name });
      reader.readAsDataURL(file);
    }));
    Promise.all(readers).then(newImgs => {
      setPhotos(p => [...p, ...newImgs]);
      if (errors.photos) setErrors(e => ({ ...e, photos: '' }));
    });
  }, [photos, errors]);

  const removePhoto = (id) => setPhotos(p => p.filter(ph => ph.id !== id));

  const addSamplePhoto = () => {
    const sample = {
      id: Date.now(),
      url: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=600&q=80',
      name: 'field_damage_sample.jpg',
    };
    setPhotos(p => [...p, sample]);
    if (errors.photos) setErrors(e => ({ ...e, photos: '' }));
  };

  const replacePhoto = (id) => {
    // trigger file input, tag which one to replace
    const input = document.createElement('input');
    input.type = 'file'; input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        setPhotos(p => p.map(ph => ph.id === id ? { ...ph, url: ev.target.result, file, name: file.name } : ph));
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  const handleDetectLocation = () => {
    setLocLoading(true); setLocError(false);
    // Mock detection — in production replace with navigator.geolocation
    setTimeout(() => {
      setLocLoading(false);
      setLocation(MOCK_LOCATION);
    }, 1800);
  };

  const validate = () => {
    const e = {};
    if (photos.length === 0) e.photos = isEn ? 'Please add at least 1 photo' : 'कम से कम 1 फोटो जोड़ें';
    return e;
  };

  const handleNext = () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onNext({ photos, location });
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <span className="text-xs font-label-md font-semibold text-primary uppercase tracking-widest">
          {isEn ? 'Step 4 of 6' : 'चरण 4 / 6'}
        </span>
        <h2 className="font-headline-lg text-xl sm:text-2xl font-bold text-on-surface mt-1">
          {isEn ? 'Add Damage Photos & Location' : 'नुकसान की फोटो और Location जोड़ें'}
        </h2>
        <p className="text-xs text-on-surface-variant font-label-md mt-1">
          {isEn
            ? 'Clear photos from different angles improve your report quality.'
            : 'फसल के नुकसान को दिखाने के लिए साफ और अलग-अलग angles से फोटो जोड़ें।'}
        </p>
      </div>

      <div className="flex flex-col gap-6">

        {/* ── Photo Upload Card ── */}
        <div className="bg-surface rounded-[24px] p-5 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.06)] flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <h3 className="font-headline-md text-base font-bold text-on-surface">
              {isEn ? 'Damage Photos' : 'नुकसान की फोटो'}
            </h3>
            <span className={`text-xs font-label-md font-semibold px-3 py-1 rounded-full
              ${photos.length === 0 ? 'bg-error-container text-on-error-container' : 'bg-secondary-fixed/40 text-on-secondary-fixed-variant'}`}>
              {photos.length} / {MAX_PHOTOS} {isEn ? 'photos' : 'फोटो'}
            </span>
          </div>

          {/* Upload zone — shows when below max */}
          {photos.length < MAX_PHOTOS && (
            <>
              {/* Hidden file inputs */}
              <input ref={fileRef} type="file" accept="image/*" multiple className="hidden"
                onChange={e => { handleFiles(e.target.files); e.target.value = ''; }} />
              <input ref={cameraRef} type="file" accept="image/*" capture="environment" className="hidden"
                onChange={e => { handleFiles(e.target.files); e.target.value = ''; }} />

              <div
                className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center gap-4 transition-all
                  ${errors.photos ? 'border-error bg-error/5' : 'border-outline-variant hover:border-primary hover:bg-primary/5'}`}
              >
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-[32px]">add_a_photo</span>
                </div>
                <div className="text-center">
                  <p className="font-label-md text-sm font-semibold text-on-surface">
                    {isEn ? 'Add damage photos' : 'नुकसान की फोटो जोड़ें'}
                  </p>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    {isEn ? 'JPG, PNG up to 10MB each' : 'JPG, PNG • प्रत्येक 10MB तक'}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <button type="button" onClick={() => cameraRef.current.click()}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 bg-primary text-on-primary rounded-xl font-label-md text-sm font-semibold hover:bg-primary-container hover:text-on-primary-container transition-all active:scale-95 shadow-sm">
                    <span className="material-symbols-outlined text-[18px]">photo_camera</span>
                    {isEn ? 'Take Photo' : 'फोटो लें'}
                  </button>
                  <button type="button" onClick={() => fileRef.current.click()}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 bg-surface-container text-on-surface rounded-xl font-label-md text-sm font-semibold hover:bg-surface-container-high transition-all active:scale-95">
                    <span className="material-symbols-outlined text-[18px]">image</span>
                    {isEn ? 'Upload from Gallery' : 'Gallery से चुनें'}
                  </button>
                </div>
                <button
                  type="button"
                  onClick={addSamplePhoto}
                  className="text-xs text-primary font-semibold hover:underline flex items-center gap-1 mt-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[15px]">add_photo_alternate</span>
                  {isEn ? '+ Attach Demo Field Photo' : '+ नमूना खेत फोटो जोड़ें'}
                </button>
              </div>
              {errors.photos && (
                <p className="text-xs text-error font-label-md flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">error</span>
                  {errors.photos}
                </p>
              )}
            </>
          )}

          {/* Photo thumbnails grid */}
          {photos.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {photos.map((ph, idx) => (
                <div key={ph.id} className="relative group rounded-xl overflow-hidden aspect-square bg-surface-container">
                  <img src={ph.url} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover" />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-inverse-surface/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                    <button type="button" onClick={() => replacePhoto(ph.id)}
                      className="px-3 py-1.5 bg-surface rounded-lg font-label-md text-xs font-semibold text-on-surface hover:bg-surface-container-low transition-all flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">swap_horiz</span>
                      {isEn ? 'Replace' : 'बदलें'}
                    </button>
                    <button type="button" onClick={() => removePhoto(ph.id)}
                      className="px-3 py-1.5 bg-error text-on-error rounded-lg font-label-md text-xs font-semibold hover:bg-error-container transition-all flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">delete</span>
                      {isEn ? 'Remove' : 'हटाएं'}
                    </button>
                  </div>
                  {/* Counter badge */}
                  <span className="absolute top-2 left-2 bg-inverse-surface text-inverse-on-surface text-[10px] font-label-md font-bold px-2 py-0.5 rounded-full">
                    {idx + 1}
                  </span>
                </div>
              ))}
              {/* Add more tile */}
              {photos.length < MAX_PHOTOS && (
                <button type="button" onClick={() => fileRef.current.click()}
                  className="aspect-square rounded-xl border-2 border-dashed border-outline-variant hover:border-primary hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-1 text-on-surface-variant hover:text-primary">
                  <span className="material-symbols-outlined text-[24px]">add_photo_alternate</span>
                  <span className="text-[10px] font-label-md font-semibold">{isEn ? 'Add More' : 'और जोड़ें'}</span>
                </button>
              )}
            </div>
          )}

          {/* Photo tips */}
          <div className="bg-primary/5 border border-primary/15 rounded-xl p-4">
            <p className="font-label-md text-xs font-bold text-primary mb-2 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">tips_and_updates</span>
              {isEn ? 'Tips for better evidence' : 'बेहतर सबूत के लिए'}
            </p>
            <ul className="flex flex-col gap-1.5">
              {photoTips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-on-surface-variant">
                  <span className="material-symbols-outlined text-secondary text-[14px] mt-0.5 shrink-0">check_circle</span>
                  <span>{isEn ? tip.en : tip.hi}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Location Card ── */}
        <div className="bg-surface rounded-[24px] p-5 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.06)] flex flex-col gap-4">
          <h3 className="font-headline-md text-base font-bold text-on-surface">
            {isEn ? 'Add Farm Location' : 'खेत का स्थान जोड़ें'}
          </h3>

          {!location && !locLoading && !locError && (
            <div className="border-2 border-dashed border-outline-variant rounded-2xl p-6 flex flex-col items-center justify-center gap-4 text-center">
              <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-secondary text-[28px]">my_location</span>
              </div>
              <div>
                <p className="font-label-md text-sm font-semibold text-on-surface">
                  {isEn ? 'Add GPS location to strengthen your report' : 'रिपोर्ट को मजबूत बनाने के लिए GPS location जोड़ें'}
                </p>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  {isEn ? 'Location is optional but strongly recommended' : 'Location वैकल्पिक है लेकिन अत्यंत अनुशंसित'}
                </p>
              </div>
              <button type="button" onClick={handleDetectLocation}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-secondary text-on-secondary rounded-xl font-label-md text-sm font-semibold hover:bg-on-secondary-container transition-all active:scale-95 shadow-sm">
                <span className="material-symbols-outlined text-[18px]">gps_fixed</span>
                {isEn ? 'Detect Current Location' : '📍 Current Location'}
              </button>
            </div>
          )}

          {locLoading && (
            <div className="flex flex-col items-center justify-center gap-3 py-8">
              <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
              <p className="text-sm font-label-md text-on-surface-variant">
                {isEn ? 'Detecting location…' : 'Location खोजी जा रही है…'}
              </p>
            </div>
          )}

          {locError && (
            <div className="flex flex-col items-center gap-3 py-6 text-center">
              <span className="material-symbols-outlined text-error text-[40px]">location_off</span>
              <p className="text-sm font-label-md text-error font-semibold">
                {isEn ? 'Could not detect location' : 'Location detect नहीं हो पाई'}
              </p>
              <button type="button" onClick={handleDetectLocation}
                className="px-4 py-2 bg-error text-on-error rounded-xl font-label-md text-xs font-semibold hover:bg-error-container transition-all">
                {isEn ? 'Try Again' : 'Location फिर से खोजें'}
              </button>
            </div>
          )}

          {location && (
            <div className="flex flex-col gap-3">
              {/* Mock map preview */}
              <div className="w-full h-36 bg-gradient-to-br from-secondary/10 to-primary/10 rounded-2xl flex items-center justify-center border border-outline-variant/30 relative overflow-hidden">
                <div className="absolute inset-0 grid grid-cols-8 grid-rows-5 opacity-20">
                  {Array.from({length: 40}).map((_, i) => (
                    <div key={i} className="border border-primary/30" />
                  ))}
                </div>
                <div className="relative z-10 flex flex-col items-center gap-1">
                  <div className="w-10 h-10 rounded-full bg-error/90 flex items-center justify-center shadow-lg">
                    <span className="material-symbols-outlined text-white text-[20px] material-fill">location_on</span>
                  </div>
                  <div className="bg-surface/90 backdrop-blur px-3 py-1 rounded-lg shadow-sm">
                    <p className="text-xs font-label-md font-bold text-on-surface">{location.village}, {location.district}</p>
                  </div>
                </div>
              </div>

              {/* Location details */}
              <div className="bg-surface-container-low rounded-2xl p-4 flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary text-[18px] material-fill">location_on</span>
                    <span className="font-label-md text-sm font-bold text-on-surface">
                      {isEn ? 'Location Detected' : 'Location मिली'}
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary-fixed/40 text-on-secondary-fixed-variant font-label-md text-[10px] font-bold">
                    <span className="material-symbols-outlined text-[12px]">check_circle</span>
                    {isEn ? 'Verified' : 'सत्यापित'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div><span className="text-on-surface-variant">{isEn ? 'Village:' : 'गाँव:'}</span> <span className="font-semibold text-on-surface">{location.village}</span></div>
                  <div><span className="text-on-surface-variant">{isEn ? 'District:' : 'जिला:'}</span> <span className="font-semibold text-on-surface">{location.district}</span></div>
                  <div><span className="text-on-surface-variant">{isEn ? 'State:' : 'राज्य:'}</span> <span className="font-semibold text-on-surface">{location.state}</span></div>
                  <div><span className="text-on-surface-variant">{isEn ? 'Khasra:' : 'खसरा:'}</span> <span className="font-semibold text-on-surface">{location.khasra}</span></div>
                  <div className="col-span-2 font-caption text-on-surface-variant">{isEn ? 'Coordinates:' : 'निर्देशांक:'} <span className="font-mono">{location.lat}°N, {location.lng}°E</span></div>
                </div>
                <button type="button" onClick={() => setLocation(null)}
                  className="self-start text-xs text-primary font-label-md font-semibold hover:underline flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">edit</span>
                  {isEn ? 'Change Location' : 'Location बदलें'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CTAs */}
      <div className="flex flex-col-reverse sm:flex-row gap-3 justify-between">
        <button type="button" onClick={onBack}
          className="px-5 py-3 bg-surface-container text-on-surface rounded-xl font-label-md text-sm font-semibold hover:bg-surface-container-high transition-all flex items-center justify-center gap-2 active:scale-95">
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          {isEn ? 'Back' : 'वापस'}
        </button>
        <button type="button" onClick={handleNext}
          className="flex-1 sm:flex-none sm:px-8 py-3 bg-primary text-on-primary rounded-xl font-label-md text-sm font-bold hover:bg-primary-container hover:text-on-primary-container transition-all flex items-center justify-center gap-2 shadow-md active:scale-95">
          {isEn ? 'Continue →' : 'आगे बढ़ें →'}
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </button>
      </div>
    </div>
  );
}
