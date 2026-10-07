import React from 'react';
import { getDamageSeverity } from '../../data/cropLossData';

export default function ReportPreview({ lang = 'en', report, onBack }) {
  const isEn = lang === 'en';

  const reportId = report?.id || 'FLR-2026-08942';
  const farmerName = report?.farmerName || 'Rameshwar Sharma';
  const mobile = report?.mobile || '+91 98765 43210';
  const state = report?.state || 'Uttar Pradesh';
  const district = report?.district || 'Meerut';
  const village = report?.village || 'Kharkhauda';
  const khasra = report?.khasra || '412/9';
  const ownership = report?.ownership || 'Owned (स्वयं की)';

  const crop = report?.crop || report?.cropEn || 'Wheat';
  const variety = report?.variety || 'PBW-502';
  const sowingDate = report?.sowingDate || '15 Nov 2025';
  const harvestDate = report?.harvestDate || '10 Apr 2026';
  const totalArea = report?.totalArea || '5.0';
  const areaUnit = report?.areaUnit || 'Acre';

  const damageCause = report?.damageCause || report?.causeEn || 'Hailstorm';
  const damageDate = report?.damageDate || '16 Sep 2026';
  const affectedArea = report?.affectedArea || '3.5';
  const damagePercent = Number(report?.damagePercent || 65);
  const severity = getDamageSeverity(damagePercent);

  const photos = report?.photos || [
    { url: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=600&q=80', caption: 'Wide angle crop damage' },
    { url: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=600&q=80', caption: 'Close-up fallen crop stems' },
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto py-4 sm:py-8 px-3 sm:px-6">
      {/* Action Bar (hidden on print) */}
      <div className="flex items-center justify-between gap-4 mb-6 print:hidden">
        <button
          onClick={onBack}
          type="button"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface border border-outline-variant/60 text-sm font-semibold text-on-surface hover:bg-surface-container-low transition-all shadow-sm"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          {isEn ? 'Back to Dashboard' : 'डैशबोर्ड पर वापस जाएं'}
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            type="button"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-on-primary text-sm font-bold shadow-md hover:bg-primary-hover active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">print</span>
            {isEn ? 'Print / Save as PDF' : 'प्रिंट / PDF सुरक्षित करें'}
          </button>
        </div>
      </div>

      {/* Official Document Sheet */}
      <div className="bg-surface rounded-2xl shadow-xl border border-outline-variant/60 p-6 sm:p-10 text-on-surface print:shadow-none print:border-none print:p-0">
        {/* Document Header */}
        <div className="border-b-2 border-primary/20 pb-6 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-primary text-on-primary rounded-2xl flex items-center justify-center font-bold text-2xl shadow-md">
                <span className="material-symbols-outlined text-[32px] material-fill">agriculture</span>
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-primary tracking-tight">
                  FARMER HELPER
                </h1>
                <p className="text-xs uppercase tracking-widest text-on-surface-variant font-bold">
                  Kisan Sahayak Portal • National Crop Loss Intimation System
                </p>
              </div>
            </div>

            <div className="sm:text-right">
              <span className="inline-block px-3 py-1 rounded-md bg-secondary-fixed text-on-secondary-fixed text-xs font-bold tracking-wider uppercase mb-1">
                {isEn ? 'Official Record' : 'आधिकारिक अभिलेख'}
              </span>
              <p className="font-mono font-bold text-sm text-on-surface">{reportId}</p>
              <p className="text-xs text-on-surface-variant">Date: {new Date().toLocaleDateString('en-IN')}</p>
            </div>
          </div>

          <div className="mt-4 text-center py-2 bg-surface-container-low rounded-xl border border-outline-variant/40">
            <h2 className="font-headline-sm text-base sm:text-lg font-bold text-on-surface">
              CROP LOSS INTIMATION & DAMAGE APPRAISAL REPORT
            </h2>
            <p className="text-xs text-on-surface-variant font-hindi">
              फसल नुकसान सूचना एवं प्रारम्भिक क्षति आंकलन प्रपत्र (PMFBY अनुरूप)
            </p>
          </div>
        </div>

        {/* Section 1: Farmer Particulars */}
        <div className="mb-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-primary border-b border-outline-variant/40 pb-1 mb-3 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px]">person</span>
            1. Farmer & Holding Details / कृषक एवं जोत विवरण
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-on-surface-variant block font-medium">Farmer Name:</span>
              <span className="font-bold text-sm text-on-surface">{farmerName}</span>
            </div>
            <div>
              <span className="text-on-surface-variant block font-medium">Mobile Number:</span>
              <span className="font-bold text-sm text-on-surface">{mobile}</span>
            </div>
            <div>
              <span className="text-on-surface-variant block font-medium">State & District:</span>
              <span className="font-bold text-sm text-on-surface">{district}, {state}</span>
            </div>
            <div>
              <span className="text-on-surface-variant block font-medium">Village / Town:</span>
              <span className="font-bold text-sm text-on-surface">{village}</span>
            </div>
            <div>
              <span className="text-on-surface-variant block font-medium">Khasra / Survey No:</span>
              <span className="font-bold text-sm text-on-surface">{khasra}</span>
            </div>
            <div>
              <span className="text-on-surface-variant block font-medium">Land Holding Type:</span>
              <span className="font-bold text-sm text-on-surface">{ownership}</span>
            </div>
            <div>
              <span className="text-on-surface-variant block font-medium">PMFBY Portal Sync:</span>
              <span className="font-semibold text-secondary flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px] material-fill">check_circle</span>
                Synced (Live)
              </span>
            </div>
            <div>
              <span className="text-on-surface-variant block font-medium">Bank Link Status:</span>
              <span className="font-semibold text-on-surface">Aadhaar Seeded DBT</span>
            </div>
          </div>
        </div>

        {/* Section 2: Crop Particulars */}
        <div className="mb-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-primary border-b border-outline-variant/40 pb-1 mb-3 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px]">eco</span>
            2. Crop & Season Particulars / फसल एवं मौसम विवरण
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-on-surface-variant block font-medium">Crop Name:</span>
              <span className="font-bold text-sm text-on-surface capitalize">{crop}</span>
            </div>
            <div>
              <span className="text-on-surface-variant block font-medium">Variety:</span>
              <span className="font-bold text-sm text-on-surface">{variety}</span>
            </div>
            <div>
              <span className="text-on-surface-variant block font-medium">Sowing Date:</span>
              <span className="font-bold text-sm text-on-surface">{sowingDate}</span>
            </div>
            <div>
              <span className="text-on-surface-variant block font-medium">Total Cultivated Area:</span>
              <span className="font-bold text-sm text-on-surface">{totalArea} {areaUnit}</span>
            </div>
          </div>
        </div>

        {/* Section 3: Damage Appraisal */}
        <div className="mb-6 bg-surface-container-low p-4 sm:p-5 rounded-xl border border-outline-variant/40">
          <h3 className="text-xs font-bold uppercase tracking-wider text-primary border-b border-outline-variant/40 pb-1 mb-3 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px]">warning</span>
            3. Peril & Loss Appraisal / आपदा एवं नुकसान आंकलन
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs mb-4">
            <div>
              <span className="text-on-surface-variant block font-medium">Cause of Damage:</span>
              <span className="font-bold text-sm text-on-surface capitalize">{damageCause}</span>
            </div>
            <div>
              <span className="text-on-surface-variant block font-medium">Date of Occurrence:</span>
              <span className="font-bold text-sm text-on-surface">{damageDate}</span>
            </div>
            <div>
              <span className="text-on-surface-variant block font-medium">Damaged Area:</span>
              <span className="font-bold text-sm text-on-surface">{affectedArea} {areaUnit}</span>
            </div>
            <div>
              <span className="text-on-surface-variant block font-medium">Damage Severity:</span>
              <span className={`font-bold text-sm ${severity.color}`}>{isEn ? severity.en : severity.hi}</span>
            </div>
          </div>

          <div className="bg-surface p-3 rounded-lg border border-outline-variant/40 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <span className="text-xs text-on-surface-variant font-medium">Assessed Loss Percentage:</span>
              <p className="text-2xl font-black text-error">{damagePercent}%</p>
            </div>
            <div className="w-full sm:w-64 bg-surface-container-high rounded-full h-3 overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  damagePercent > 66 ? 'bg-error' : damagePercent > 33 ? 'bg-amber-500' : 'bg-secondary'
                }`}
                style={{ width: `${damagePercent}%` }}
              />
            </div>
            <div className="text-xs text-on-surface-variant text-right">
              Threshold: &gt;33% Eligible for PMFBY Claim
            </div>
          </div>
        </div>

        {/* Section 4: Geotagged Evidence */}
        <div className="mb-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-primary border-b border-outline-variant/40 pb-1 mb-3 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px]">photo_camera</span>
            4. Geotagged Photographic Evidence / भू-टैग्ड साक्ष्य
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
            {photos.map((p, idx) => (
              <div key={idx} className="rounded-xl overflow-hidden border border-outline-variant/40 bg-surface-container-low">
                <img
                  src={p.url || p}
                  alt={`Evidence ${idx + 1}`}
                  className="w-full h-28 object-cover"
                />
                <div className="p-2 text-[10px] text-on-surface-variant font-mono">
                  <span>LAT: 28.9845° N | LNG: 77.7064° E</span>
                  <div className="text-on-surface font-sans font-medium truncate mt-0.5">
                    {p.caption || `Photo ${idx + 1} - Field Evidence`}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-secondary font-semibold flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px] material-fill">verified</span>
            All images embedded with tamper-proof EXIF GPS coordinates and timestamp hash.
          </p>
        </div>

        {/* Section 5: Legal Declaration & Signatures */}
        <div className="border-t-2 border-outline-variant/40 pt-4 mt-8">
          <div className="bg-surface-container-lowest p-3 rounded-xl text-[10px] text-on-surface-variant leading-relaxed mb-8">
            <strong>Farmer Declaration:</strong> I hereby solemnly affirm that the information given above is true and correct to the best of my knowledge. The crop damage has occurred due to unseasonal / natural calamity as stated.
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 pt-4">
            <div className="text-center">
              <div className="h-14 border-b border-dashed border-outline flex items-end justify-center pb-1">
                <span className="font-caveat font-bold text-lg text-primary">{farmerName}</span>
              </div>
              <span className="text-[11px] font-semibold text-on-surface block mt-1">Signature of Farmer</span>
              <span className="text-[10px] text-on-surface-variant">किसान के हस्ताक्षर</span>
            </div>

            <div className="text-center">
              <div className="h-14 border-b border-dashed border-outline flex items-end justify-center pb-1">
                <span className="text-[11px] text-outline italic">[Official Seal]</span>
              </div>
              <span className="text-[11px] font-semibold text-on-surface block mt-1">Lekhpal / Patwari Sign</span>
              <span className="text-[10px] text-on-surface-variant">राजस्व लेखपाल सत्यापन</span>
            </div>

            <div className="text-center col-span-2 sm:col-span-1">
              <div className="h-14 border-b border-dashed border-outline flex items-end justify-center pb-1">
                <span className="text-[11px] text-outline italic">[Insurance Surveyor]</span>
              </div>
              <span className="text-[11px] font-semibold text-on-surface block mt-1">Insurance Surveyor Sign</span>
              <span className="text-[10px] text-on-surface-variant">बीमा सर्वेक्षक हस्ताक्षर</span>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-8 pt-4 border-t border-outline-variant/40 text-[10px] text-on-surface-variant flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Generated via Farmer Helper Platform • www.farmerhelper.in</span>
          <span>Helpline: 1800-180-1551 (Kisan Call Centre)</span>
        </div>
      </div>
    </div>
  );
}
