import React, { useState } from 'react';
import { HUB_STATS, MOCK_REPORTS } from '../../data/cropLossData';

export default function CropLossHub({
  lang = 'en',
  reports = MOCK_REPORTS,
  onStartNewReport,
  onViewReport,
  onResumeDraft,
}) {
  const isEn = lang === 'en';
  const [filterTab, setFilterTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filterTabs = [
    { id: 'all',      en: 'All Reports',    hi: 'सभी रिपोर्ट',   count: reports.length },
    { id: 'ready',    en: 'Ready',          hi: 'तैयार',        count: reports.filter((r) => r.status === 'ready').length },
    { id: 'approved', en: 'Approved',       hi: 'स्वीकृत',      count: reports.filter((r) => r.status === 'approved').length },
    { id: 'draft',    en: 'Drafts',         hi: 'प्रारूप',      count: reports.filter((r) => r.status === 'draft').length },
  ];

  const filteredReports = reports.filter((report) => {
    if (filterTab !== 'all' && report.status !== filterTab) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = report.id?.toLowerCase().includes(q);
      const matchCrop = (report.cropEn || report.crop || '').toLowerCase().includes(q);
      const matchCause = (report.causeEn || report.damageCause || '').toLowerCase().includes(q);
      return matchId || matchCrop || matchCause;
    }
    return true;
  });

  return (
    <div className="space-y-8">
      {/* ── Hero Banner Section ───────────────────────────────────────── */}
      <div className="bg-surface rounded-3xl border border-outline-variant/40 shadow-sm overflow-hidden p-6 sm:p-8 lg:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column (lg:col-span-7) */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-fixed/40 text-primary text-xs font-bold tracking-wide">
              <span className="material-symbols-outlined text-[16px] material-fill">shield</span>
              {isEn ? 'PMFBY Fast Claim Assistance • फसल सुरक्षा' : 'PMFBY त्वरित क्लेम सहायता • फसल सुरक्षा'}
            </div>

            <h1 className="font-headline-lg text-2xl sm:text-3xl lg:text-4xl font-extrabold text-on-surface tracking-tight leading-tight">
              {isEn ? (
                <>
                  Crop Loss Intimation & <br className="hidden sm:inline" />
                  <span className="text-primary">Formal Damage Report</span>
                </>
              ) : (
                <>
                  फसल नुकसान रिपोर्ट एवं <br className="hidden sm:inline" />
                  <span className="text-primary">त्वरित क्लेम सहायता</span>
                </>
              )}
            </h1>

            <p className="font-body-md text-sm sm:text-base text-on-surface-variant leading-relaxed max-w-xl">
              {isEn
                ? 'Generate verified, GPS-geotagged loss documentation within the mandatory 72-hour window. Accepted by agricultural insurance surveyors and revenue officers.'
                : 'प्राकृतिक आपदा या कीट प्रकोप से हुए नुकसान की जियो-टैग्ड रिपोर्ट अनिवार्य 72 घंटे में तैयार करें। बीमा सर्वेक्षक व राजस्व अधिकारियों द्वारा मान्य।'}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onStartNewReport}
                type="button"
                className="px-6 py-3.5 rounded-2xl bg-primary hover:bg-primary-hover active:scale-95 text-on-primary font-bold text-sm shadow-[0_4px_16px_rgba(0,69,13,0.25)] flex items-center gap-2 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">add_circle</span>
                {isEn ? 'File New Crop Loss Report' : 'नई नुकसान रिपोर्ट दर्ज करें'}
              </button>

              <a
                href="#how-it-works"
                className="px-5 py-3.5 rounded-2xl bg-surface-container hover:bg-surface-container-high text-on-surface font-semibold text-sm flex items-center gap-1.5 transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">info</span>
                {isEn ? 'How It Works' : 'प्रक्रिया समझें'}
              </a>
            </div>

            {/* Feature Pills */}
            <div className="pt-3 flex flex-wrap items-center gap-4 text-xs text-on-surface-variant font-medium">
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-secondary text-[18px] material-fill">pin_drop</span>
                {isEn ? 'Tamper-proof Geotag' : 'भू-टैग्ड प्रमाण'}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-primary text-[18px]">timer</span>
                {isEn ? '72-Hour Rule Compliance' : '72 घंटे की समय सीमा'}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-tertiary text-[18px]">picture_as_pdf</span>
                {isEn ? 'Official PDF Export' : 'आधिकारिक PDF रिपोर्ट'}
              </span>
            </div>
          </div>

          {/* Right Column (lg:col-span-5) Graphic Card */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden shadow-lg border border-outline-variant/30 group">
              <img
                src="https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=800&q=80"
                alt="Agricultural field damaged by storm"
                className="w-full h-56 sm:h-64 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-5 text-white">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-error text-on-error text-xs font-bold w-fit mb-2">
                  <span className="material-symbols-outlined text-[14px]">warning</span>
                  {isEn ? '72-Hour Intimation Clock' : '72 घंटे की सूचना सीमा'}
                </div>
                <h3 className="font-bold text-base sm:text-lg">
                  {isEn ? 'Report Damage Promptly' : 'नुकसान होते ही तुरंत सूचना दें'}
                </h3>
                <p className="text-xs text-white/80 mt-0.5 font-label-md">
                  {isEn
                    ? 'Informing within 72 hrs is compulsory under PMFBY guidelines.'
                    : 'PMFBY नियमानुसार 72 घंटे के अंदर सूचना देना अनिवार्य है।'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Metric Cards Row ──────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {HUB_STATS.map((stat) => (
          <div
            key={stat.id}
            className="bg-surface rounded-2xl p-5 border border-outline-variant/40 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                {isEn ? stat.labelEn : stat.labelHi}
              </span>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${stat.iconBg}`}>
                <span className="material-symbols-outlined text-[20px] material-fill">{stat.icon}</span>
              </div>
            </div>

            <div className="font-headline-lg text-2xl font-black text-on-surface mb-2">
              {stat.value}
            </div>

            {/* Progress bar */}
            <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden mb-2">
              <div
                className={`h-full rounded-full ${stat.barColor}`}
                style={{ width: `${stat.barWidth}%` }}
              />
            </div>

            <div className={`text-xs font-semibold flex items-center gap-1 ${stat.noteColor}`}>
              <span>●</span>
              <span>{isEn ? stat.note : stat.noteHi}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Main Bento Section (8 cols reports + 4 cols info) ──────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Reports Feed Column (lg:col-span-8) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Filter Bar & Search */}
          <div className="bg-surface rounded-2xl p-4 border border-outline-variant/40 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {filterTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilterTab(tab.id)}
                  type="button"
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                    filterTab === tab.id
                      ? 'bg-primary text-on-primary shadow-sm'
                      : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                  }`}
                >
                  <span>{isEn ? tab.en : tab.hi}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                      filterTab === tab.id ? 'bg-on-primary/20 text-on-primary' : 'bg-outline-variant/40 text-on-surface'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative shrink-0 sm:w-56">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-outline">
                search
              </span>
              <input
                type="text"
                placeholder={isEn ? 'Search reports…' : 'रिपोर्ट खोजें…'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-surface-container-low border border-outline-variant/40 rounded-xl text-xs font-body-md text-on-surface placeholder:text-outline focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          {/* Report List */}
          {filteredReports.length === 0 ? (
            <div className="bg-surface rounded-2xl p-12 text-center border border-dashed border-outline-variant">
              <div className="w-16 h-16 bg-surface-container-high text-outline rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-[32px]">folder_open</span>
              </div>
              <h3 className="font-headline-sm text-base font-bold text-on-surface">
                {isEn ? 'No reports found' : 'कोई रिपोर्ट नहीं मिली'}
              </h3>
              <p className="text-xs text-on-surface-variant mt-1 max-w-sm mx-auto">
                {isEn
                  ? 'No crop loss reports match your current filter criteria.'
                  : 'आपके चयनित फ़िल्टर के अनुसार कोई रिपोर्ट उपलब्ध नहीं है।'}
              </p>
              <button
                onClick={onStartNewReport}
                type="button"
                className="mt-4 px-5 py-2.5 rounded-xl bg-primary text-on-primary text-xs font-bold inline-flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">add</span>
                {isEn ? 'Create First Report' : 'पहली रिपोर्ट बनाएं'}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredReports.map((report) => {
                const isDraft = report.status === 'draft';
                const isApproved = report.status === 'approved';

                return (
                  <div
                    key={report.id}
                    className="bg-surface rounded-2xl p-5 sm:p-6 border border-outline-variant/40 shadow-sm hover:shadow-md transition-all group"
                  >
                    {/* Header Row */}
                    <div className="flex flex-wrap items-start justify-between gap-3 pb-4 border-b border-outline-variant/30">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-surface-container-high flex items-center justify-center text-primary font-bold text-xl">
                          <span className="material-symbols-outlined text-[24px]">
                            {report.icon || 'agriculture'}
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-sm text-on-surface">
                              {report.id}
                            </span>
                            <span className="text-xs text-on-surface-variant">•</span>
                            <span className="text-xs text-on-surface-variant font-medium">
                              {isEn ? report.dateEn : report.dateHi}
                            </span>
                          </div>
                          <p className="text-xs text-on-surface-variant flex items-center gap-1 mt-0.5">
                            <span className="material-symbols-outlined text-[14px]">location_on</span>
                            {report.location || 'Meerut, UP'}
                          </p>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                          report.statusClass || 'bg-surface-container-high text-on-surface'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[14px] material-fill">
                          {report.badgeIcon || 'info'}
                        </span>
                        {isEn ? report.statusEn : report.statusHi}
                      </span>
                    </div>

                    {/* Report Content Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 text-xs">
                      <div>
                        <span className="text-on-surface-variant block">{isEn ? 'Crop & Variety' : 'फसल व किस्म'}</span>
                        <span className="font-bold text-sm text-on-surface">
                          {isEn ? report.cropEn : report.cropHi}
                        </span>
                        <span className="text-[11px] text-on-surface-variant block">{report.variety}</span>
                      </div>

                      <div>
                        <span className="text-on-surface-variant block">{isEn ? 'Damage Cause' : 'नुकसान का कारण'}</span>
                        <span className="font-bold text-sm text-on-surface flex items-center gap-1">
                          <span>{report.causeEmoji}</span>
                          <span>{isEn ? report.causeEn : report.causeHi}</span>
                        </span>
                      </div>

                      <div>
                        <span className="text-on-surface-variant block">{isEn ? 'Affected Area' : 'प्रभावित क्षेत्र'}</span>
                        <span className="font-bold text-sm text-on-surface">
                          {report.areaAffected} {report.areaUnit}
                        </span>
                      </div>

                      <div>
                        <span className="text-on-surface-variant block">{isEn ? 'Damage Severity' : 'क्षति प्रतिशत'}</span>
                        <span
                          className={`font-black text-sm ${
                            report.damagePercent > 60 ? 'text-error' : report.damagePercent > 30 ? 'text-tertiary' : 'text-secondary'
                          }`}
                        >
                          {report.damagePercent}% ({report.severityEn})
                        </span>
                      </div>
                    </div>

                    {/* Note / Specific Info strip */}
                    {isDraft && (
                      <div className="bg-error-container/40 text-on-error-container p-3 rounded-xl text-xs flex items-center justify-between gap-2 mb-4">
                        <span className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[16px]">warning</span>
                          {isEn ? report.pendingNote : report.pendingNoteHi}
                        </span>
                        <span className="font-bold text-[11px]">{report.urgency}</span>
                      </div>
                    )}

                    {isApproved && (
                      <div className="bg-secondary-fixed/40 text-on-secondary-fixed p-3 rounded-xl text-xs flex items-center justify-between gap-2 mb-4">
                        <span className="flex items-center gap-1.5 font-bold">
                          <span className="material-symbols-outlined text-[16px] material-fill">paid</span>
                          {isEn ? `Claim Disbursed: ${report.claimAmount}` : `मुआवजा राशि: ${report.claimAmount}`}
                        </span>
                        <span className="text-[11px] font-mono">{report.utrRef}</span>
                      </div>
                    )}

                    {/* Action Bar */}
                    <div className="flex items-center justify-end gap-3 pt-2">
                      {isDraft ? (
                        <button
                          onClick={() => onResumeDraft?.(report)}
                          type="button"
                          className="px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-bold hover:bg-primary-hover active:scale-95 transition-all flex items-center gap-1.5"
                        >
                          <span className="material-symbols-outlined text-[16px]">edit</span>
                          {isEn ? 'Resume Draft' : 'प्रारूप पूरा करें'}
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => onViewReport(report)}
                            type="button"
                            className="px-4 py-2 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-xs font-semibold transition-all flex items-center gap-1.5"
                          >
                            <span className="material-symbols-outlined text-[16px]">visibility</span>
                            {isEn ? 'View Report' : 'रिपोर्ट देखें'}
                          </button>

                          <button
                            onClick={() => onViewReport(report)}
                            type="button"
                            className="px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-bold hover:bg-primary-hover active:scale-95 transition-all flex items-center gap-1.5"
                          >
                            <span className="material-symbols-outlined text-[16px]">print</span>
                            {isEn ? 'Print / PDF' : 'प्रिंट / PDF'}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Sidebar Column (lg:col-span-4) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Kisan Helpline Card */}
          <div className="bg-primary text-on-primary rounded-3xl p-6 shadow-md relative overflow-hidden">
            <div className="absolute -right-6 -bottom-6 opacity-10 pointer-events-none">
              <span className="material-symbols-outlined text-[160px]">support_agent</span>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold mb-3">
              <span className="material-symbols-outlined text-[14px]">call</span>
              {isEn ? '24x7 Toll Free' : '24x7 निःशुल्क'}
            </div>

            <h3 className="text-xl font-extrabold mb-1">
              {isEn ? 'Kisan Call Centre' : 'किसान कॉल सेंटर'}
            </h3>
            <p className="text-xs text-white/80 leading-relaxed mb-4">
              {isEn
                ? 'Facing difficulty filing PMFBY loss report? Speak directly with an agriculture officer.'
                : 'फसल नुकसान दर्ज करने में सहायता के लिए कृषि विशेषज्ञ से तुरंत संपर्क करें।'}
            </p>

            <a
              href="tel:18001801551"
              className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-white text-primary font-bold text-sm shadow-md hover:bg-slate-100 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">phone_in_talk</span>
              1800-180-1551
            </a>
          </div>

          {/* How It Works Card */}
          <div id="how-it-works" className="bg-surface rounded-3xl p-6 border border-outline-variant/40 shadow-sm space-y-4">
            <h3 className="font-headline-sm text-base font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">verified</span>
              {isEn ? 'How Crop Loss Claim Works' : 'फसल नुकसान दावा प्रक्रिया'}
            </h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center shrink-0">
                  1
                </div>
                <div>
                  <h4 className="font-bold text-on-surface">
                    {isEn ? 'Intimate Within 72 Hours' : '72 घंटे के अंदर सूचना'}
                  </h4>
                  <p className="text-on-surface-variant mt-0.5">
                    {isEn
                      ? 'Inform as soon as natural peril hits to preserve claim validity.'
                      : 'आपदा होने के 72 घंटे में विवरण दर्ज करना अनिवार्य है।'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center shrink-0">
                  2
                </div>
                <div>
                  <h4 className="font-bold text-on-surface">
                    {isEn ? 'Geotagged Photo Evidence' : 'जियो-टैग्ड फोटो प्रमाण'}
                  </h4>
                  <p className="text-on-surface-variant mt-0.5">
                    {isEn
                      ? 'Upload clear pictures of the damaged crop with automated GPS tagging.'
                      : 'खेत में खड़े होकर GPS युक्त स्पष्ट फोटो लें।'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center shrink-0">
                  3
                </div>
                <div>
                  <h4 className="font-bold text-on-surface">
                    {isEn ? 'Surveyor Joint Inspection' : 'संयुक्त स्थलीय सर्वे'}
                  </h4>
                  <p className="text-on-surface-variant mt-0.5">
                    {isEn
                      ? 'Insurance surveyor & Patwari verify your claim on the spot.'
                      : 'पटवारी व बीमा कंपनी के प्रतिनिधि खेत का मौका मुआयना करेंगे।'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center shrink-0">
                  4
                </div>
                <div>
                  <h4 className="font-bold text-on-surface">
                    {isEn ? 'Direct Bank Transfer (DBT)' : 'सीधे बैंक खाते में क्लेम'}
                  </h4>
                  <p className="text-on-surface-variant mt-0.5">
                    {isEn
                      ? 'Approved claim money transferred to your Aadhaar-linked bank account.'
                      : 'स्वीकृत क्लेम राशि DBT द्वारा सीधे बैंक खाते में आएगी।'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* PMFBY Checklist Info */}
          <div className="bg-surface-container-low rounded-3xl p-6 border border-outline-variant/40 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">checklist</span>
              {isEn ? 'Documents Needed for Claim' : 'क्लेम हेतु आवश्यक दस्तावेज'}
            </h4>
            <ul className="text-xs text-on-surface-variant space-y-2">
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[16px]">check_circle</span>
                {isEn ? 'Khasra / Khatoni Land Record' : 'खसरा / खतौनी नकल'}
              </li>
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[16px]">check_circle</span>
                {isEn ? 'Bank Passbook copy (Aadhaar linked)' : 'बैंक पासबुक प्रति'}
              </li>
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[16px]">check_circle</span>
                {isEn ? 'Sowing Certificate / Declaration' : 'बुवाई प्रमाण पत्र / घोषणा'}
              </li>
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[16px]">check_circle</span>
                {isEn ? 'Generated Crop Loss PDF' : 'यह फसल नुकसान PDF प्रपत्र'}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
