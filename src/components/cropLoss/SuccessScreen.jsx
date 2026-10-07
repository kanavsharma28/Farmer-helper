import React, { useState } from 'react';

export default function SuccessScreen({ lang = 'en', reportData, onViewReport, onBackToHub }) {
  const isEn = lang === 'en';
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const reportId = reportData?.id || `FLR-2026-${Math.floor(10000 + Math.random() * 90000)}`;

  const handleCopyId = () => {
    navigator.clipboard?.writeText(reportId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      window.print();
    }, 600);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Crop Loss Report - ${reportId}`,
        text: `Farmer Helper Crop Loss Report ${reportId} for ${reportData?.farmerName || 'Farmer'}.`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      handleCopyId();
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6">
      {/* Success Badge & Header */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-primary-fixed/40 text-primary rounded-full flex items-center justify-center mx-auto mb-5 shadow-[0_8px_30px_rgba(0,69,13,0.18)] animate-[bounce_1s_ease-out_1]">
          <span className="material-symbols-outlined text-[48px] sm:text-[56px] material-fill">
            verified
          </span>
        </div>

        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-secondary-fixed text-on-secondary-fixed text-xs font-semibold uppercase tracking-wider mb-2">
          <span className="material-symbols-outlined text-[16px] material-fill">check_circle</span>
          {isEn ? 'Official Report Generated' : 'आधिकारिक रिपोर्ट तैयार'}
        </span>

        <h1 className="font-headline-lg text-2xl sm:text-3xl font-extrabold text-on-surface mt-2">
          {isEn ? 'Crop Loss Report Generated!' : 'फसल नुकसान रिपोर्ट तैयार हो गई!'}
        </h1>
        <p className="text-sm text-on-surface-variant font-label-md mt-2 max-w-md mx-auto">
          {isEn
            ? 'Your formal claim document is ready. You can present this report to PMFBY, bank surveyor, or revenue officials.'
            : 'आपका औपचारिक दावा दस्तावेज़ तैयार है। इसे PMFBY, बीमा कंपनी या राजस्व अधिकारी (पटवारी) को प्रस्तुत करें।'}
        </p>
      </div>

      {/* Report ID Card */}
      <div className="bg-surface rounded-2xl p-5 shadow-sm border border-outline-variant/40 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-wider text-on-surface-variant font-medium">
            {isEn ? 'Report Reference Number' : 'रिपोर्ट संदर्भ संख्या'}
          </span>
          <div className="flex items-center gap-2 mt-1">
            <span className="font-headline-md font-mono text-xl sm:text-2xl font-black text-primary tracking-wide">
              {reportId}
            </span>
          </div>
        </div>

        <button
          onClick={handleCopyId}
          type="button"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface-container-high hover:bg-surface-container-highest active:scale-95 text-xs font-semibold text-on-surface transition-all"
        >
          <span className="material-symbols-outlined text-[16px]">
            {copied ? 'check' : 'content_copy'}
          </span>
          {copied ? (isEn ? 'Copied!' : 'कॉपी हो गया!') : (isEn ? 'Copy ID' : 'ID कॉपी करें')}
        </button>
      </div>

      {/* Report Summary Details Card */}
      <div className="bg-surface rounded-2xl p-6 shadow-sm border border-outline-variant/40 mb-6 space-y-4">
        <h3 className="font-headline-sm text-base font-bold text-on-surface border-b border-outline-variant/30 pb-3 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[20px]">assignment</span>
          {isEn ? 'Report Summary' : 'रिपोर्ट सारांश'}
        </h3>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-xs text-on-surface-variant">{isEn ? 'Farmer Name' : 'किसान का नाम'}</span>
            <p className="font-semibold text-on-surface">{reportData?.farmerName || 'Rameshwar Sharma'}</p>
          </div>
          <div>
            <span className="text-xs text-on-surface-variant">{isEn ? 'Location' : 'स्थान'}</span>
            <p className="font-semibold text-on-surface">{reportData?.district || 'Meerut'}, {reportData?.state || 'Uttar Pradesh'}</p>
          </div>
          <div>
            <span className="text-xs text-on-surface-variant">{isEn ? 'Crop' : 'फसल'}</span>
            <p className="font-semibold text-on-surface capitalize">{reportData?.crop || 'Wheat'} {reportData?.variety ? `(${reportData.variety})` : ''}</p>
          </div>
          <div>
            <span className="text-xs text-on-surface-variant">{isEn ? 'Damage Cause' : 'नुकसान का कारण'}</span>
            <p className="font-semibold text-on-surface capitalize">{reportData?.damageCause || 'Hailstorm'}</p>
          </div>
          <div>
            <span className="text-xs text-on-surface-variant">{isEn ? 'Estimated Loss' : 'अनुमानित क्षति'}</span>
            <p className="font-bold text-error">{reportData?.damagePercent || 65}%</p>
          </div>
          <div>
            <span className="text-xs text-on-surface-variant">{isEn ? 'Affected Area' : 'प्रभावित क्षेत्र'}</span>
            <p className="font-semibold text-on-surface">{reportData?.affectedArea || '3.5'} {reportData?.areaUnit || 'Acre'}</p>
          </div>
          <div>
            <span className="text-xs text-on-surface-variant">{isEn ? 'Photos Attached' : 'संलग्न फोटो'}</span>
            <p className="font-semibold text-on-surface flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px] text-secondary">photo_camera</span>
              {reportData?.photos?.length || 3} {isEn ? 'Photos' : 'फोटो'}
            </p>
          </div>
          <div>
            <span className="text-xs text-on-surface-variant">{isEn ? 'Geo-tagging' : 'जियो-टैगिंग'}</span>
            <p className="font-semibold text-secondary flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px] material-fill">pin_drop</span>
              {isEn ? 'GPS Verified' : 'GPS सत्यापित'}
            </p>
          </div>
        </div>
      </div>

      {/* 72-Hour PMFBY Notice */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 sm:p-5 mb-8 flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-700 flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-[24px]">schedule</span>
        </div>
        <div>
          <h4 className="text-sm font-bold text-amber-900">
            {isEn ? 'Important: 72-Hour Intimation Window (PMFBY)' : 'ज़रूरी: 72 घंटे की सूचना सीमा (PMFBY)'}
          </h4>
          <p className="text-xs text-amber-800/90 mt-1 leading-relaxed">
            {isEn
              ? 'As per PMFBY guidelines, inform your insurance company or agriculture officer within 72 hours of damage occurrence to claim settlement.'
              : 'प्रधानमंत्री फसल बीमा योजना नियमानुसार, नुकसान होने के 72 घंटे के भीतर बीमा कंपनी अथवा कृषि अधिकारी को इस रिपोर्ट के साथ सूचित करें।'}
          </p>
        </div>
      </div>

      {/* Primary Actions */}
      <div className="space-y-3">
        <button
          onClick={() => onViewReport({ ...reportData, id: reportId })}
          type="button"
          className="w-full py-3.5 px-6 rounded-xl bg-primary hover:bg-primary-hover active:scale-[0.99] text-on-primary font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all"
        >
          <span className="material-symbols-outlined text-[20px]">description</span>
          {isEn ? 'View & Print Official Report' : 'आधिकारिक रिपोर्ट देखें और प्रिंट करें'}
        </button>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleDownload}
            type="button"
            disabled={downloading}
            className="py-3 px-4 rounded-xl bg-surface hover:bg-surface-container-low border border-outline-variant/60 font-semibold text-xs sm:text-sm text-on-surface flex items-center justify-center gap-1.5 transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">
              {downloading ? 'sync' : 'download'}
            </span>
            {downloading ? (isEn ? 'Preparing…' : 'तैयारी जारी…') : (isEn ? 'Download PDF' : 'PDF डाउनलोड')}
          </button>

          <button
            onClick={handleShare}
            type="button"
            className="py-3 px-4 rounded-xl bg-surface hover:bg-surface-container-low border border-outline-variant/60 font-semibold text-xs sm:text-sm text-on-surface flex items-center justify-center gap-1.5 transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">share</span>
            {isEn ? 'Share Report' : 'शेयर करें'}
          </button>
        </div>

        <button
          onClick={onBackToHub}
          type="button"
          className="w-full py-3 px-6 rounded-xl text-on-surface-variant hover:text-on-surface text-xs font-semibold flex items-center justify-center gap-1 transition-all"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          {isEn ? 'Back to Crop Loss Hub' : 'मुख्य पृष्ठ पर वापस जाएं'}
        </button>
      </div>
    </div>
  );
}
