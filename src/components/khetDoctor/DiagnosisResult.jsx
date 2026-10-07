import React, { useState, useMemo } from 'react';
import {
  getNearbyAgroShops,
  saveDiagnosisRecord,
} from '../../services/khetDoctorService';

// ── Severity Badge Helper ───────────────────────────────────────────────────
function SeverityBadge({ severity, isEn, labelHi }) {
  const map = {
    High: {
      cls: 'bg-rose-500/15 text-rose-700 border border-rose-500/30',
      icon: 'emergency',
      textEn: 'High Severity',
    },
    Moderate: {
      cls: 'bg-amber-500/15 text-amber-800 border border-amber-500/30',
      icon: 'warning',
      textEn: 'Moderate Severity',
    },
    Low: {
      cls: 'bg-emerald-500/15 text-emerald-800 border border-emerald-500/30',
      icon: 'check_circle',
      textEn: 'Low Severity',
    },
  };
  const config = map[severity] || map.Moderate;

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${config.cls}`}>
      <span className="material-symbols-outlined text-[15px]">{config.icon}</span>
      <span>{isEn ? config.textEn : (labelHi || severity)}</span>
    </span>
  );
}

export default function DiagnosisResult({
  lang,
  diagnosisData,
  farmerName = 'Rajesh Kumar',
  farmerId = 'user_farmer_01',
  onNewScan,
  onViewHistory,
}) {
  const isEn = lang === 'en';
  const [activeTab, setActiveTab] = useState('hindi'); // 'hindi' | 'organic' | 'chemical' | 'prevention'
  const [isSaved, setIsSaved] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [selectedShopModal, setSelectedShopModal] = useState(null);

  // Shop Search & Filters
  const [shopSearch, setShopSearch] = useState('');
  const [shopFilterType, setShopFilterType] = useState('all');
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  // Safe fallback if diagnosisData is missing fields
  const d = diagnosisData || {
    id: 'AG-9021',
    crop: 'Wheat',
    cropHi: 'गेहूं',
    diseaseEn: 'Yellow Rust',
    diseaseHi: 'पीला रतुआ',
    scientificName: 'Puccinia striiformis',
    confidence: 93,
    severity: 'High',
    severityHi: 'गंभीर',
    affectedPart: 'Leaves / Foliage',
    affectedPartHi: 'पत्तियां',
    description: 'Yellow rust is a fungal disease affecting wheat leaves.',
    descriptionHi: 'पीला रतुआ गेहूं की पत्तियों पर लगने वाला एक फफूंद जनित रोग है।',
    symptoms: [],
    causes: [],
    treatment: { organic: [], chemical: [], prevention: [] },
    hindiGuide: { overview: '', dos: [], donts: [] },
    location: 'Meerut, Uttar Pradesh',
    imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80',
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Save Diagnosis Action
  const handleSaveDiagnosis = () => {
    saveDiagnosisRecord(
      {
        ...d,
        imageUrl: d.imageUrl,
      },
      farmerId
    );
    setIsSaved(true);
    showToast(isEn ? '✅ Diagnosis saved to your history!' : '✅ जांच आपके इतिहास में सहेजी गई!');
  };

  // Download / Print Diagnosis Report
  const handleDownloadReport = () => {
    window.print();
  };

  // Share Diagnosis Report
  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `Crop Diagnosis: ${d.crop} - ${d.diseaseEn}`,
          text: `Mera Khet Ka Doctor report for ${d.crop} (${d.diseaseEn}, Confidence: ${d.confidence}%).`,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard?.writeText?.(
        `Farmer Helper Diagnosis Report: ${d.crop} - ${d.diseaseEn} (${d.confidence}% Confidence). Location: ${d.location}`
      );
      showToast(isEn ? '🔗 Report details copied to clipboard!' : '🔗 रिपोर्ट कॉपी हो गई!');
    }
  };

  // Filter Nearby Shops
  const shops = useMemo(() => {
    return getNearbyAgroShops({
      search: shopSearch,
      shopType: shopFilterType,
      verifiedOnly,
    });
  }, [shopSearch, shopFilterType, verifiedOnly]);

  return (
    <div className="flex flex-col gap-8 pb-8 print:p-0">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2 px-5 py-3 rounded-2xl bg-primary text-white shadow-xl animate-fade-in border border-primary-container/40">
          <span className="material-symbols-outlined text-xl">check_circle</span>
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* ── Page Header & Action Bar ────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider mb-1">
            <span className="material-symbols-outlined text-base">task_alt</span>
            <span>{isEn ? 'Diagnosis Completed' : 'जांच पूर्ण हुई'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface">
            {isEn ? 'Crop Health Assessment' : 'फसल स्वास्थ्य निदान परिणाम'}
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">
            {isEn
              ? 'Review disease detection findings, recommended treatments, and nearby agri-input dealers.'
              : 'रोग पहचान परिणाम, अनुशंसित उपचार और नजदीकी कृषि सेवा केंद्र देखें।'}
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={handleSaveDiagnosis}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
              isSaved
                ? 'bg-emerald-600 text-white'
                : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest border border-outline-variant/30'
            }`}
          >
            <span className="material-symbols-outlined text-base">
              {isSaved ? 'bookmark_added' : 'bookmark_border'}
            </span>
            <span>{isSaved ? (isEn ? 'Saved' : 'सहेजा गया') : (isEn ? 'Save Diagnosis' : 'जांच सहेजें')}</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadReport}
            className="px-4 py-2.5 rounded-xl bg-surface-container-high text-on-surface hover:bg-surface-container-highest font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer border border-outline-variant/30"
          >
            <span className="material-symbols-outlined text-base">print</span>
            <span>{isEn ? 'Print / Download Report' : 'रिपोर्ट डाउनलोड / प्रिंट'}</span>
          </button>

          <button
            type="button"
            onClick={handleShare}
            className="px-4 py-2.5 rounded-xl bg-surface-container-high text-on-surface hover:bg-surface-container-highest font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer border border-outline-variant/30"
          >
            <span className="material-symbols-outlined text-base">share</span>
            <span>{isEn ? 'Share' : 'शेयर'}</span>
          </button>

          <button
            type="button"
            onClick={onNewScan}
            className="px-5 py-2.5 rounded-xl bg-primary text-white hover:bg-primary-container font-bold text-xs transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">add_photo_alternate</span>
            <span>{isEn ? 'Analyze Another Crop' : 'दूसरी फसल जांचें'}</span>
          </button>
        </div>
      </div>

      {/* ── Requirement 8: Preliminary Assessment Disclaimer Banner ── */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start sm:items-center gap-3 text-amber-950 text-xs sm:text-sm">
        <span className="material-symbols-outlined text-amber-600 text-2xl shrink-0">
          health_and_safety
        </span>
        <div className="leading-relaxed">
          <strong className="text-amber-900 block sm:inline mr-1">
            {isEn ? 'AI-Based Preliminary Assessment:' : 'एआई-आधारित प्रारंभिक आंकलन:'}
          </strong>
          <span>
            {isEn
              ? 'This result is for informational and educational discovery purposes only. Please verify with a qualified agricultural scientist or local Krishi Vigyan Kendra (KVK) before chemical applications.'
              : 'यह परिणाम केवल प्रारंभिक मार्गदर्शन हेतु है। रासायनिक छिड़काव से पहले कृषि वैज्ञानिक अथवा स्थानीय कृषि विज्ञान केंद्र (KVK) से सलाह अवश्य लें।'}
          </span>
        </div>
      </div>

      {/* ── Main Layout: LEFT (5 cols) & RIGHT (7 cols) ────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* ─── LEFT: Image & Core Detection Metrics (5 cols) ─── */}
        <div className="lg:col-span-5 flex flex-col gap-6">

          {/* Photo & Confidence Card */}
          <div className="bg-surface-container-lowest rounded-3xl p-6 border border-outline-variant/30 shadow-xs space-y-4">
            <div className="relative w-full h-64 sm:h-72 rounded-2xl overflow-hidden bg-surface-container-low shadow-inner">
              <img
                src={d.imageUrl}
                alt={d.diseaseEn}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-black/60 text-white backdrop-blur-xs flex items-center gap-1">
                  <span>📍 {d.location}</span>
                </span>
              </div>
              <div className="absolute top-3 right-3">
                <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-600 text-white shadow-sm flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">verified</span>
                  <span>{d.confidence}% {isEn ? 'Confidence' : 'संभावना'}</span>
                </span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent flex items-end p-4">
                <div className="text-white">
                  <span className="text-[10px] uppercase font-mono tracking-wider opacity-80 block">
                    {isEn ? 'Crop Specimen' : 'फसल का नमूना'}
                  </span>
                  <p className="text-base font-bold">
                    {isEn ? d.crop : (d.cropHi || d.crop)} • {isEn ? d.affectedPart : (d.affectedPartHi || d.affectedPart)}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-surface-container-low border border-outline-variant/20 space-y-1">
                <span className="text-[11px] font-bold text-on-surface-variant block uppercase">
                  {isEn ? 'Confidence' : 'विश्वसनीयता'}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-black text-primary">{d.confidence}%</span>
                  <span className="text-xs font-semibold text-emerald-700">
                    {d.confidence >= 90 ? (isEn ? 'High' : 'उच्च') : (isEn ? 'Good' : 'सटीक')}
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-surface-container-low border border-outline-variant/20 space-y-1">
                <span className="text-[11px] font-bold text-on-surface-variant block uppercase">
                  {isEn ? 'Severity' : 'गंभीरता स्तर'}
                </span>
                <div className="pt-1">
                  <SeverityBadge severity={d.severity} isEn={isEn} labelHi={d.severityHi} />
                </div>
              </div>
            </div>
          </div>

          {/* Symptoms Card */}
          <div className="bg-surface-container-lowest rounded-3xl p-6 border border-outline-variant/30 shadow-xs space-y-3">
            <h3 className="font-bold text-sm text-on-surface flex items-center gap-2 text-primary">
              <span className="material-symbols-outlined text-lg">medical_information</span>
              <span>{isEn ? 'Observed Symptoms' : 'रोग के मुख्य लक्षण'}</span>
            </h3>
            <div className="space-y-2.5">
              {d.symptoms.map((s, i) => (
                <div key={i} className="flex items-start gap-2.5 p-3 rounded-2xl bg-surface-container-low text-xs">
                  <span className="material-symbols-outlined text-primary text-base shrink-0 mt-0.5">
                    {s.icon || 'arrow_right'}
                  </span>
                  <p className="text-on-surface leading-relaxed">
                    {isEn ? s.en : s.hi}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Causes Card */}
          <div className="bg-surface-container-lowest rounded-3xl p-6 border border-outline-variant/30 shadow-xs space-y-3">
            <h3 className="font-bold text-sm text-on-surface flex items-center gap-2 text-primary">
              <span className="material-symbols-outlined text-lg">cloud_sync</span>
              <span>{isEn ? 'Possible Causes & Triggers' : 'संभावित कारण व मौसम की स्थिति'}</span>
            </h3>
            <div className="space-y-2">
              {d.causes.map((c, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-on-surface-variant">
                  <span className="material-symbols-outlined text-amber-600 text-sm shrink-0 mt-0.5">
                    {c.icon || 'info'}
                  </span>
                  <span>{isEn ? c.en : c.hi}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ─── RIGHT: Disease Details, Hindi Guide, Treatment & Prevention (7 cols) ─── */}
        <div className="lg:col-span-7 flex flex-col gap-6">

          {/* Disease Banner */}
          <div className="bg-surface-container-lowest rounded-3xl p-6 sm:p-8 border border-outline-variant/30 shadow-xs relative overflow-hidden space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
                {isEn ? 'Detected Disease' : 'पहचाना गया रोग'}
              </span>
              <span className="text-xs font-mono text-on-surface-variant">ID: #{d.id}</span>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-on-surface">
                {isEn ? d.diseaseEn : (d.diseaseHi || d.diseaseEn)}
              </h2>
              <h3 className="text-lg font-bold text-primary mt-0.5">
                {isEn ? d.diseaseHi : d.diseaseEn}
              </h3>
              <p className="text-xs text-on-surface-variant font-mono italic mt-1">
                {d.scientificName}
              </p>
            </div>

            <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
              {isEn ? d.description : (d.descriptionHi || d.description)}
            </p>

            {/* Treatment Guide Tabs */}
            <div className="pt-2 border-t border-outline-variant/20">
              <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                {[
                  { id: 'hindi', labelEn: 'Hindi Treatment Guide', labelHi: 'हिंदी इलाज गाइड (क्या करें / क्या न करें)', icon: 'translate' },
                  { id: 'organic', labelEn: 'Organic Solution', labelHi: 'जैविक उपचार', icon: 'eco' },
                  { id: 'chemical', labelEn: 'Chemical Treatment', labelHi: 'रासायनिक उपचार', icon: 'medication' },
                  { id: 'prevention', labelEn: 'Prevention Advice', labelHi: 'बचाव के उपाय', icon: 'shield' },
                ].map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border ${
                        isActive
                          ? 'bg-primary text-white border-primary shadow-xs'
                          : 'bg-surface-container-low text-on-surface border-outline-variant/30 hover:bg-surface-container'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">{tab.icon}</span>
                      <span>{isEn ? tab.labelEn : tab.labelHi}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* TAB 1: Requirement 10: Hindi Treatment Guide */}
            {activeTab === 'hindi' && (
              <div className="space-y-4 pt-2 animate-fade-in">
                <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 space-y-2">
                  <h4 className="font-bold text-sm text-primary flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-lg">medical_services</span>
                    <span>इलाज (Treatment Overview)</span>
                  </h4>
                  <p className="text-xs sm:text-sm text-on-surface leading-relaxed">
                    {d.hindiGuide?.overview || d.descriptionHi}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* क्या करें? (Do's) */}
                  <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 space-y-2.5">
                    <h5 className="font-bold text-xs uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-base">check_circle</span>
                      <span>क्या करें? (Do's)</span>
                    </h5>
                    <ul className="space-y-2 text-xs text-emerald-950">
                      {(d.hindiGuide?.dos || [
                        'प्रभावित पत्तियों को तुरंत हटाकर नष्ट करें।',
                        'खेत में जलभराव न होने दें।',
                        'अनुशंसित फफूंदनाशक का सही मात्रा में छिड़काव करें।',
                      ]).map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-emerald-700 font-bold shrink-0">✓</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* क्या न करें? (Don'ts) */}
                  <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/25 space-y-2.5">
                    <h5 className="font-bold text-xs uppercase tracking-wider text-rose-800 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-base">cancel</span>
                      <span>क्या न करें? (Don'ts)</span>
                    </h5>
                    <ul className="space-y-2 text-xs text-rose-950">
                      {(d.hindiGuide?.donts || [
                        'खेत में जरूरत से ज्यादा यूरिया का उपयोग न करें।',
                        'बिना विशेषज्ञ सलाह के दो रसायनों को आपस में न मिलाएं।',
                        'बीमार पत्तियों को खेत के अंदर न छोड़ें।',
                      ]).map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-rose-700 font-bold shrink-0">✗</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: Organic Treatment */}
            {activeTab === 'organic' && (
              <div className="space-y-3 pt-2 animate-fade-in">
                <span className="text-xs font-bold text-primary block">
                  {isEn ? 'Eco-Friendly & Bio-Control Formulations' : 'पर्यावरण-अनुकूल जैविक उपचार'}
                </span>
                <div className="space-y-3">
                  {d.treatment?.organic?.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30 space-y-1.5"
                    >
                      <div className="flex items-center gap-2 text-emerald-700">
                        <span className="material-symbols-outlined text-lg">{item.icon || 'eco'}</span>
                        <h5 className="font-bold text-xs sm:text-sm text-on-surface">
                          {isEn ? item.titleEn : item.titleHi}
                        </h5>
                      </div>
                      <p className="text-xs text-on-surface-variant leading-relaxed">
                        {isEn ? item.descEn : item.descHi}
                      </p>
                      {item.frequency && (
                        <span className="inline-block text-[11px] font-semibold text-primary pt-1">
                          ⏱ {isEn ? `Schedule: ${item.frequency}` : `छिड़काव चक्र: ${item.frequency}`}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: Requirement 11: Chemical Treatment with Strict Safety */}
            {activeTab === 'chemical' && (
              <div className="space-y-3 pt-2 animate-fade-in">
                <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-amber-900 text-xs">
                  <strong>{isEn ? 'Safety Advisory:' : 'सुरक्षा परामर्श:'}</strong>{' '}
                  {isEn
                    ? 'Consult a qualified agricultural expert for product selection and dosage. Always wear gloves, masks, and adhere to waiting periods before harvest.'
                    : 'रसायनों के चयन व सटीक खुराक के लिए कृषि विशेषज्ञ से परामर्श अवश्य लें। छिड़काव के समय दस्ताने व मास्क का प्रयोग अनिवार्य करें।'}
                </div>

                <div className="space-y-3">
                  {d.treatment?.chemical?.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30 space-y-2"
                    >
                      <div className="flex items-center gap-2 text-primary">
                        <span className="material-symbols-outlined text-lg">{item.icon || 'medication'}</span>
                        <h5 className="font-bold text-xs sm:text-sm text-on-surface">
                          {isEn ? item.titleEn : item.titleHi}
                        </h5>
                      </div>
                      <p className="text-xs text-on-surface-variant leading-relaxed">
                        {isEn ? item.descEn : item.descHi}
                      </p>
                      {item.safeUsageNote && (
                        <p className="text-[11px] text-on-surface font-semibold bg-surface-container p-2 rounded-xl">
                          ℹ {item.safeUsageNote}
                        </p>
                      )}
                      {(item.caution || item.cautionHi) && (
                        <p className="text-[11px] text-rose-800 bg-rose-500/10 p-2 rounded-xl border border-rose-500/20">
                          ⚠ {isEn ? item.caution : (item.cautionHi || item.caution)}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: Prevention Advice */}
            {activeTab === 'prevention' && (
              <div className="space-y-3 pt-2 animate-fade-in">
                <span className="text-xs font-bold text-primary block">
                  {isEn ? 'Long-Term Farm Preventive Measures' : 'दीर्घकालिक बचाव व सुरक्षा उपाय'}
                </span>
                <div className="space-y-3">
                  {d.treatment?.prevention?.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30 space-y-1.5"
                    >
                      <div className="flex items-center gap-2 text-primary">
                        <span className="material-symbols-outlined text-lg">{item.icon || 'shield'}</span>
                        <h5 className="font-bold text-xs sm:text-sm text-on-surface">
                          {isEn ? item.titleEn : item.titleHi}
                        </h5>
                      </div>
                      <p className="text-xs text-on-surface-variant leading-relaxed">
                        {isEn ? item.descEn : item.descHi}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Bottom Actions Card */}
          <div className="p-5 rounded-3xl bg-surface-container-low border border-outline-variant/30 flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={onNewScan}
              className="px-4 py-2 rounded-xl bg-surface-container-high text-on-surface font-semibold text-xs hover:bg-surface-container-highest transition-all cursor-pointer"
            >
              {isEn ? '← Analyze Another Crop' : '← दूसरी फसल जांचें'}
            </button>
            <button
              onClick={onViewHistory}
              className="px-4 py-2 rounded-xl bg-primary text-white font-bold text-xs hover:bg-primary-container transition-all cursor-pointer"
            >
              {isEn ? 'View All My Scans' : 'मेरी सभी फसल जांचें'}
            </button>
          </div>
        </div>

      </div>

      {/* ── Requirements 12 & 13: Nearby Pesticide/Fertilizer Shops Section ── */}
      <div className="bg-surface-container-lowest rounded-3xl p-6 sm:p-8 border border-outline-variant/30 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider mb-1">
              <span className="material-symbols-outlined text-base">store</span>
              <span>{isEn ? 'Local Agri-Inputs & Support' : 'स्थानीय कृषि केंद्र व दुकानें'}</span>
            </div>
            <h3 className="font-extrabold text-xl text-on-surface">
              {isEn ? 'Nearby Agriculture & Pesticide Shops' : 'नजदीकी कीटनाशक एवं कृषि सेवा केंद्र'}
            </h3>
            <p className="text-xs text-on-surface-variant mt-0.5">
              {isEn
                ? `Showing verified agri-input centers near ${d.location}`
                : `${d.location} के पास प्रमाणित कीटनाशक व बीज भंडार`}
            </p>
          </div>

          {/* Shop Type Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto self-start md:self-auto">
            {[
              { id: 'all', labelEn: 'All Shops', labelHi: 'सभी दुकानें' },
              { id: 'pesticide', labelEn: 'Pesticides', labelHi: 'कीटनाशक' },
              { id: 'fertilizer', labelEn: 'Fertilizers', labelHi: 'उर्वरक' },
              { id: 'seeds', labelEn: 'Seeds', labelHi: 'बीज भंडार' },
            ].map((st) => (
              <button
                key={st.id}
                type="button"
                onClick={() => setShopFilterType(st.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  shopFilterType === st.id
                    ? 'bg-primary text-white shadow-xs'
                    : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {isEn ? st.labelEn : st.labelHi}
              </button>
            ))}
          </div>
        </div>

        {/* Search Bar for Shops */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">
              search
            </span>
            <input
              type="text"
              value={shopSearch}
              onChange={(e) => setShopSearch(e.target.value)}
              placeholder={
                isEn
                  ? 'Search pesticide, fertilizer or agriculture shops by name or address...'
                  : 'दुकान का नाम या पते से खोजें...'
              }
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-xs focus:outline-none focus:border-primary"
            />
          </div>

          <label className="flex items-center gap-2 px-3 py-2 bg-surface-container-low rounded-xl border border-outline-variant/30 text-xs text-on-surface cursor-pointer select-none">
            <input
              type="checkbox"
              checked={verifiedOnly}
              onChange={(e) => setVerifiedOnly(e.target.checked)}
              className="accent-primary rounded"
            />
            <span>{isEn ? 'Verified Dealers Only' : 'केवल प्रमाणित विक्रेता'}</span>
          </label>
        </div>

        {/* Shops Grid */}
        {shops.length === 0 ? (
          <div className="p-8 text-center bg-surface-container-low rounded-2xl text-xs text-on-surface-variant space-y-2">
            <span className="material-symbols-outlined text-2xl text-on-surface-variant/50">storefront</span>
            <p>{isEn ? 'No agriculture shops found matching your search.' : 'आपकी खोज के अनुसार कोई दुकान नहीं मिली।'}</p>
            <button
              onClick={() => {
                setShopSearch('');
                setShopFilterType('all');
                setVerifiedOnly(false);
              }}
              className="text-primary font-bold hover:underline"
            >
              {isEn ? 'Clear filters' : 'फ़िल्टर हटाएं'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {shops.map((shop) => (
              <div
                key={shop.id}
                className="p-5 rounded-3xl bg-surface-container-low border border-outline-variant/30 hover:border-primary/40 hover:shadow-xs transition-all flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-sm text-on-surface">
                        {isEn ? shop.name : (shop.nameHi || shop.name)}
                      </h4>
                      <p className="text-[11px] text-on-surface-variant mt-0.5">
                        📍 {shop.distance} • {isEn ? shop.district : (shop.district || shop.state)}
                      </p>
                    </div>
                    {shop.isVerified && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-800 border border-emerald-500/20 shrink-0">
                        {isEn ? '✓ Verified' : '✓ प्रमाणित'}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-on-surface-variant line-clamp-2">
                    {isEn ? shop.address : (shop.addressHi || shop.address)}
                  </p>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {(isEn ? shop.categories : (shop.categoriesHi || shop.categories)).map((cat, ci) => (
                      <span
                        key={ci}
                        className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-surface-container text-on-surface-variant"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-outline-variant/20 flex items-center justify-between gap-2 text-xs">
                  <span className="font-semibold text-emerald-700 text-[11px]">
                    {isEn ? shop.openTimeEn : (shop.openTimeHi || shop.openTimeEn)}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <a
                      href={`tel:${shop.phone}`}
                      className="px-3 py-1.5 rounded-xl bg-primary text-white font-bold text-[11px] hover:bg-primary-container transition-all flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-xs">call</span>
                      <span>{isEn ? 'Call' : 'कॉल'}</span>
                    </a>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(shop.name + ' ' + shop.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-surface-container-high text-on-surface font-semibold text-[11px] hover:bg-surface-container-highest transition-all flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-xs">directions</span>
                      <span>{isEn ? 'Directions' : 'दिशा'}</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Printable Report Template (Visible in Print View) ─────── */}
      <div className="hidden print:block p-8 bg-white text-black space-y-6">
        <div className="border-b pb-4">
          <h1 className="text-2xl font-bold">Mera Khet Ka Doctor — Diagnosis Report</h1>
          <p className="text-sm text-gray-600">Farmer Helper AgriTech Platform</p>
        </div>

        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <p><strong>Farmer Name:</strong> {farmerName}</p>
            <p><strong>Location:</strong> {d.location}</p>
            <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
          </div>
          <div>
            <p><strong>Crop:</strong> {d.crop} ({d.cropHi})</p>
            <p><strong>Affected Part:</strong> {d.affectedPart}</p>
            <p><strong>Confidence:</strong> {d.confidence}%</p>
          </div>
        </div>

        <div className="border p-4 rounded">
          <h2 className="text-lg font-bold text-green-900">{d.diseaseEn} ({d.diseaseHi})</h2>
          <p className="text-xs italic text-gray-700">{d.scientificName} • Severity: {d.severity}</p>
          <p className="text-xs mt-2">{d.description}</p>
        </div>

        <div className="text-xs space-y-2">
          <h3 className="font-bold text-sm">Key Symptoms</h3>
          <ul className="list-disc pl-5">
            {d.symptoms.map((s, i) => (
              <li key={i}>{s.en} ({s.hi})</li>
            ))}
          </ul>
        </div>

        <div className="text-xs space-y-2">
          <h3 className="font-bold text-sm">Hindi Treatment Guide (इलाज)</h3>
          <p>{d.hindiGuide?.overview}</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <strong>क्या करें?</strong>
              <ul className="list-disc pl-5">
                {d.hindiGuide?.dos?.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <strong>क्या न करें?</strong>
              <ul className="list-disc pl-5">
                {d.hindiGuide?.donts?.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t pt-4 text-[10px] text-gray-500 italic">
          Disclaimer: AI-based preliminary assessment for informational purposes. Always verify with an agricultural expert before chemical applications.
        </div>
      </div>
    </div>
  );
}
