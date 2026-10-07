import React from 'react';
import { cropOptions, damageCategories } from '../../data/cropLossData';

function SectionCard({ title, onEdit, children, lang }) {
  const isEn = lang === 'en';
  return (
    <div className="bg-surface rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-outline-variant/20">
        <h3 className="font-label-md text-sm font-bold text-on-surface">{title}</h3>
        <button type="button" onClick={onEdit}
          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-label-md font-semibold text-primary bg-primary/5 rounded-lg hover:bg-primary/10 transition-all active:scale-95">
          <span className="material-symbols-outlined text-[14px]">edit</span>
          {isEn ? 'Edit' : 'संपादित करें'}
        </button>
      </div>
      <div className="px-5 py-4">
        {children}
      </div>
    </div>
  );
}

function Row({ label, value }) {
  if (!value) return null;
  return (
    <div className="flex items-start justify-between gap-4 py-1.5 border-b border-outline-variant/10 last:border-0">
      <span className="text-xs text-on-surface-variant font-label-md shrink-0">{label}</span>
      <span className="text-xs font-semibold text-on-surface text-right font-label-md">{value}</span>
    </div>
  );
}

export default function ReviewStep({ lang, farmData, cropData, damageData, photoData, onSubmit, onBack, onEditStep }) {
  const isEn = lang === 'en';

  const getCropLabel = (val) => {
    const c = cropOptions.find(o => o.value === val);
    return c ? (isEn ? c.en : c.hi) : val;
  };
  const getCauseLabel = (val) => {
    const d = damageCategories.find(o => o.value === val);
    return d ? `${d.emoji} ${isEn ? d.en : d.hi}` : val;
  };

  const severity = damageData?.damagePercent >= 67 ? (isEn ? 'Severe' : 'अधिक नुकसान')
                 : damageData?.damagePercent >= 34 ? (isEn ? 'Moderate' : 'मध्यम')
                 : (isEn ? 'Minor' : 'कम');

  return (
    <div className="flex flex-col gap-6">
      <div>
        <span className="text-xs font-label-md font-semibold text-primary uppercase tracking-widest">
          {isEn ? 'Step 5 of 6' : 'चरण 5 / 6'}
        </span>
        <h2 className="font-headline-lg text-xl sm:text-2xl font-bold text-on-surface mt-1">
          {isEn ? 'Review Your Information' : 'अपनी जानकारी जांचें'}
        </h2>
        <p className="text-xs text-on-surface-variant font-label-md mt-1">
          {isEn ? 'Verify all details before generating the report.' : 'रिपोर्ट बनाने से पहले सभी जानकारी जांचें।'}
        </p>
      </div>

      {/* Summary cards */}
      <div className="flex flex-col gap-4">

        {/* Farmer Details */}
        <SectionCard title={isEn ? '👤 Farmer Details' : '👤 किसान की जानकारी'} onEdit={() => onEditStep(1)} lang={lang}>
          <Row label={isEn ? 'Name' : 'नाम'} value={farmData?.farmerName} />
          <Row label={isEn ? 'Mobile' : 'मोबाइल'} value={farmData?.mobile} />
          <Row label={isEn ? 'State' : 'राज्य'} value={farmData?.state} />
          <Row label={isEn ? 'District' : 'जिला'} value={farmData?.district || (isEn ? 'Not specified' : 'नहीं बताया')} />
          <Row label={isEn ? 'Village' : 'गाँव'} value={farmData?.village} />
          <Row label={isEn ? 'Survey / Khasra' : 'सर्वे / खसरा'} value={farmData?.khasraNo || '—'} />
        </SectionCard>

        {/* Crop Details */}
        <SectionCard title={isEn ? '🌾 Crop Details' : '🌾 फसल की जानकारी'} onEdit={() => onEditStep(2)} lang={lang}>
          <Row label={isEn ? 'Crop' : 'फसल'} value={getCropLabel(cropData?.crop)} />
          <Row label={isEn ? 'Variety' : 'किस्म'} value={cropData?.variety || '—'} />
          <Row label={isEn ? 'Sowing Date' : 'बुवाई की तारीख'} value={cropData?.sowingDate} />
          <Row label={isEn ? 'Expected Harvest' : 'अपेक्षित कटाई'} value={cropData?.harvestDate || '—'} />
          <Row label={isEn ? 'Total Area' : 'कुल क्षेत्र'} value={cropData?.area ? `${cropData.area} ${cropData.areaUnit}` : '—'} />
        </SectionCard>

        {/* Damage Details */}
        <SectionCard title={isEn ? '⚠️ Damage Details' : '⚠️ नुकसान की जानकारी'} onEdit={() => onEditStep(3)} lang={lang}>
          <Row label={isEn ? 'Cause' : 'कारण'} value={getCauseLabel(damageData?.cause)} />
          <Row label={isEn ? 'Date of Damage' : 'नुकसान की तारीख'} value={damageData?.damageDate} />
          <Row label={isEn ? 'Affected Area' : 'नुकसान का क्षेत्र'} value={damageData?.damageArea ? `${damageData.damageArea} ${damageData.damageAreaUnit}` : '—'} />
          <Row label={isEn ? 'Estimated Damage' : 'अनुमानित नुकसान'} value={`${damageData?.damagePercent || 0}% (${severity})`} />
        </SectionCard>

        {/* Evidence */}
        <SectionCard title={isEn ? '📸 Evidence' : '📸 सबूत'} onEdit={() => onEditStep(4)} lang={lang}>
          <Row label={isEn ? 'Photos Added' : 'फोटो जोड़ी गईं'}
            value={`${photoData?.photos?.length || 0} ${isEn ? 'photos' : 'फोटो'}`} />
          <Row label={isEn ? 'GPS Location' : 'GPS Location'}
            value={photoData?.location
              ? `✓ ${photoData.location.village}, ${photoData.location.district}`
              : (isEn ? 'Not added' : 'नहीं जोड़ा')} />
        </SectionCard>

        {/* Confirmation */}
        <div className="flex items-start gap-3 bg-secondary-fixed/20 border border-secondary/20 rounded-2xl p-4">
          <span className="material-symbols-outlined text-secondary text-[20px] mt-0.5 shrink-0 material-fill">check_circle</span>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            {isEn
              ? 'By generating this report, you confirm that all information provided is accurate and true to the best of your knowledge.'
              : 'यह रिपोर्ट बनाकर आप पुष्टि करते हैं कि दी गई सभी जानकारी आपकी जानकारी के अनुसार सही और सत्य है।'}
          </p>
        </div>
      </div>

      {/* CTAs */}
      <div className="flex flex-col-reverse sm:flex-row gap-3 justify-between">
        <button type="button" onClick={onBack}
          className="px-5 py-3 bg-surface-container text-on-surface rounded-xl font-label-md text-sm font-semibold hover:bg-surface-container-high transition-all flex items-center justify-center gap-2 active:scale-95">
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          {isEn ? 'Back' : 'वापस'}
        </button>
        <button type="button" onClick={onSubmit}
          className="flex-1 sm:flex-none sm:px-8 py-3.5 bg-primary text-on-primary rounded-xl font-label-md text-sm font-bold hover:bg-primary-container hover:text-on-primary-container transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95">
          <span className="material-symbols-outlined text-[20px] material-fill">description</span>
          {isEn ? 'Generate Report' : 'रिपोर्ट तैयार करें'}
        </button>
      </div>
    </div>
  );
}
