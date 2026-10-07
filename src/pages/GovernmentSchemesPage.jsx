import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import DashboardSidebar from '../components/dashboard/DashboardSidebar';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import DashboardMobileNav from '../components/dashboard/DashboardMobileNav';
import { useAuth } from '../context/AuthContext';
import { ALL_INDIAN_STATES } from '../data/indiaLocations';
import { getFarmerFarms } from '../data/farmData';
import {
  OFFICIAL_GOVERNMENT_SCHEMES,
  SCHEME_CATEGORIES,
  BENEFIT_TYPES,
  getSavedSchemeIds,
  toggleSaveScheme,
  getSchemeApplications,
  recordSchemeApplication,
  matchSchemesForFarm,
  SCHEMES_UPDATE_EVENT,
} from '../data/schemesData';

export default function GovernmentSchemesPage() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [lang, setLang] = useState('en');
  const isEn = lang === 'en';
  const [activeNav, setActiveNav] = useState('govSchemes');

  // Active Main View Tab: 'all' | 'saved' | 'applications' | 'checker'
  const currentTab = searchParams.get('tab') || 'all';

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [selectedState, setSelectedState] = useState('');
  const [stateSearchText, setStateSearchText] = useState('');
  const [isStateDropdownOpen, setIsStateDropdownOpen] = useState(false);
  const [selectedBenefitType, setSelectedBenefitType] = useState('all');
  const [selectedEligibilityFilter, setSelectedEligibilityFilter] = useState('all');

  // Saved Schemes & Applications
  const farmerId = user?.id || 'user_farmer_01';
  const [savedIds, setSavedIds] = useState(() => getSavedSchemeIds(farmerId));
  const [applications, setApplications] = useState(() => getSchemeApplications(farmerId));

  // Modal States
  const [detailsScheme, setDetailsScheme] = useState(null);
  const [isEligibilityCheckerOpen, setIsEligibilityCheckerOpen] = useState(false);
  const [prefilledSchemeForChecker, setPrefilledSchemeForChecker] = useState(null);
  const [successToast, setSuccessToast] = useState('');

  // Farmer's primary farm
  const farmerFarms = useMemo(() => getFarmerFarms(user?.id), [user?.id]);
  const primaryFarm = farmerFarms[0] || null;

  // Listen to updates from other tabs or actions
  useEffect(() => {
    const handleUpdate = () => {
      setSavedIds(getSavedSchemeIds(farmerId));
      setApplications(getSchemeApplications(farmerId));
    };
    window.addEventListener(SCHEMES_UPDATE_EVENT, handleUpdate);
    return () => window.removeEventListener(SCHEMES_UPDATE_EVENT, handleUpdate);
  }, [farmerId]);

  // Sync saved list when farmerId changes
  useEffect(() => {
    setSavedIds(getSavedSchemeIds(farmerId));
    setApplications(getSchemeApplications(farmerId));
  }, [farmerId]);

  // Set initial category from query param if present
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setSelectedCategory(cat);
  }, [searchParams]);

  // Toast auto-dismiss
  useEffect(() => {
    if (!successToast) return;
    const timer = setTimeout(() => setSuccessToast(''), 3500);
    return () => clearTimeout(timer);
  }, [successToast]);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleToggleSave = (schemeId, e) => {
    if (e) e.stopPropagation();
    const isNowSaved = toggleSaveScheme(schemeId, farmerId);
    setSavedIds(getSavedSchemeIds(farmerId));
    setSuccessToast(
      isNowSaved
        ? (isEn ? 'Scheme saved to your bookmarks!' : 'योजना आपके सहेजे गए अनुभाग में जोड़ी गई!')
        : (isEn ? 'Scheme removed from your bookmarks.' : 'योजना सहेजे गए अनुभाग से हटाई गई।')
    );
  };

  const handleOpenDetails = (scheme) => {
    setDetailsScheme(scheme);
  };

  const handleOpenCheckerForScheme = (scheme = null) => {
    setPrefilledSchemeForChecker(scheme);
    setIsEligibilityCheckerOpen(true);
  };

  const handleApplyTracking = (scheme) => {
    recordSchemeApplication(scheme.id, scheme.name, farmerId, {
      notesEn: `Inquiry created from Farmer Helper portal. Redirected to official website ${scheme.officialUrl}`,
      notesHi: `किसान हेल्पर पोर्टल से आवेदन दर्ज किया गया। आधिकारिक वेबसाइट ${scheme.officialUrl} पर निर्देशित किया गया।`,
    });
    setApplications(getSchemeApplications(farmerId));
    setSuccessToast(isEn ? 'Inquiry logged in "My Applications"! Now opening official portal...' : 'आवेदन "मेरे आवेदन" में दर्ज हुआ! आधिकारिक पोर्टल खुल रहा है...');
    window.open(scheme.officialUrl, '_blank', 'noopener,noreferrer');
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedState('');
    setStateSearchText('');
    setSelectedBenefitType('all');
    setSelectedEligibilityFilter('all');
  };

  // State search filtering for dropdown
  const filteredStatesList = useMemo(() => {
    if (!stateSearchText) return ALL_INDIAN_STATES;
    return ALL_INDIAN_STATES.filter((st) =>
      st.toLowerCase().includes(stateSearchText.toLowerCase())
    );
  }, [stateSearchText]);

  // ── Core Filtering Logic ───────────────────────────────────────────────────
  const filteredSchemes = useMemo(() => {
    return OFFICIAL_GOVERNMENT_SCHEMES.filter((scheme) => {
      // 1. Saved filter
      if (currentTab === 'saved') {
        if (!savedIds.includes(scheme.id)) return false;
      }

      // 2. Category filter
      if (selectedCategory !== 'all') {
        if (scheme.category !== selectedCategory) return false;
      }

      // 3. State filter (Selected state: Must be All India OR explicitly include selectedState)
      if (selectedState) {
        const isAllIndia = scheme.applicableStates.includes('All India');
        const isSpecificMatch = scheme.applicableStates.some(
          (s) => s.toLowerCase() === selectedState.toLowerCase()
        );
        if (!isAllIndia && !isSpecificMatch) {
          return false;
        }
      }

      // 4. Benefit Type filter
      if (selectedBenefitType !== 'all') {
        if (selectedBenefitType === 'dbt' && !scheme.benefitType.toLowerCase().includes('dbt') && !scheme.benefitType.toLowerCase().includes('direct')) {
          return false;
        }
        if (selectedBenefitType === 'subsidy' && !scheme.benefitType.toLowerCase().includes('subsidy')) {
          return false;
        }
        if (selectedBenefitType === 'insurance' && !scheme.benefitType.toLowerCase().includes('insurance')) {
          return false;
        }
        if (selectedBenefitType === 'credit' && !scheme.benefitType.toLowerCase().includes('credit') && !scheme.benefitType.toLowerCase().includes('loan')) {
          return false;
        }
        if (selectedBenefitType === 'solar' && !scheme.benefitType.toLowerCase().includes('solar')) {
          return false;
        }
      }

      // 5. Eligibility criteria filter
      if (selectedEligibilityFilter === 'small_marginal') {
        // Must allow small landholding
        if (scheme.eligibilityCriteria.maxLandSize && scheme.eligibilityCriteria.maxLandSize < 2) return false;
      } else if (selectedEligibilityFilter === 'women_only') {
        if (scheme.category !== 'women_farmers' && scheme.eligibilityCriteria.specialCategory !== 'Women Farmers Only') return false;
      }

      // 6. Free text search across Name, Description, Category, Crop, State, Benefit
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = scheme.name.toLowerCase().includes(q) || (scheme.nameHi && scheme.nameHi.toLowerCase().includes(q));
        const matchesDesc = scheme.shortDescription.toLowerCase().includes(q) || scheme.description.toLowerCase().includes(q);
        const matchesCat = scheme.categoryLabelEn.toLowerCase().includes(q) || scheme.categoryLabelHi.toLowerCase().includes(q);
        const matchesCrop = scheme.applicableCrops.some((c) => c.toLowerCase().includes(q));
        const matchesState = scheme.applicableStates.some((s) => s.toLowerCase().includes(q));
        const matchesBenefit = scheme.benefitType.toLowerCase().includes(q);

        if (!matchesName && !matchesDesc && !matchesCat && !matchesCrop && !matchesState && !matchesBenefit) {
          return false;
        }
      }

      return true;
    });
  }, [
    currentTab,
    savedIds,
    selectedCategory,
    selectedState,
    selectedBenefitType,
    selectedEligibilityFilter,
    searchQuery,
  ]);

  const featuredSchemes = useMemo(() => {
    return OFFICIAL_GOVERNMENT_SCHEMES.filter((s) => s.isFeatured);
  }, []);

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col lg:flex-row font-sans selection:bg-primary-container selection:text-white">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3 rounded-2xl bg-primary text-white shadow-xl animate-fade-in border border-primary-container/40">
          <span className="material-symbols-outlined text-xl">check_circle</span>
          <span className="text-sm font-medium">{successToast}</span>
        </div>
      )}

      {/* Desktop Sticky Sidebar */}
      <DashboardSidebar
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        lang={lang}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-24 lg:pb-8">
        {/* Top Header Bar */}
        <DashboardHeader
          lang={lang}
          setLang={setLang}
        />

        {/* Dynamic Page Canvas */}
        <main className="flex-1 p-4 sm:p-6 lg:p-10 overflow-y-auto space-y-6">

          {/* ── Page Header & Subtitle ───────────────────────────────────── */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5 mb-1.5">
                <span className="w-9 h-9 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-2xl">gavel</span>
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-primary-container/10 text-primary border border-primary/20">
                  {isEn ? 'Official Welfare Schemes 🇮🇳' : 'आधिकारिक सरकारी योजनाएं 🇮🇳'}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
                {isEn ? 'Government Schemes' : 'सरकारी योजनाएं'}
              </h1>
              <p className="text-sm text-on-surface-variant max-w-2xl mt-1">
                {isEn
                  ? 'Discover government schemes and agricultural benefits that may be relevant to your farm.'
                  : 'अपने खेत और फसल के लिए केंद्र व राज्य सरकार की लाभकारी योजनाओं की खोज करें।'}
              </p>
            </div>

            {/* Quick Action Navigation Tabs */}
            <div className="flex items-center gap-2 bg-surface-container-low p-1.5 rounded-2xl border border-outline-variant/30 self-start md:self-auto overflow-x-auto max-w-full">
              <button
                onClick={() => setSearchParams({ tab: 'all' })}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  currentTab === 'all'
                    ? 'bg-primary text-white shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                }`}
              >
                <span className="material-symbols-outlined text-[17px]">hub</span>
                <span>{isEn ? 'All Schemes' : 'सभी योजनाएं'}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${currentTab === 'all' ? 'bg-white/20' : 'bg-surface-container-high'}`}>
                  {OFFICIAL_GOVERNMENT_SCHEMES.length}
                </span>
              </button>

              <button
                onClick={() => setSearchParams({ tab: 'saved' })}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  currentTab === 'saved'
                    ? 'bg-primary text-white shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                }`}
              >
                <span className="material-symbols-outlined text-[17px]">bookmark</span>
                <span>{isEn ? 'Saved Schemes' : 'सहेजे गए'}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${currentTab === 'saved' ? 'bg-white/20' : 'bg-surface-container-high'}`}>
                  {savedIds.length}
                </span>
              </button>

              <button
                onClick={() => setSearchParams({ tab: 'applications' })}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  currentTab === 'applications'
                    ? 'bg-primary text-white shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                }`}
              >
                <span className="material-symbols-outlined text-[17px]">assignment_turned_in</span>
                <span>{isEn ? 'My Applications' : 'मेरे आवेदन'}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${currentTab === 'applications' ? 'bg-white/20' : 'bg-surface-container-high'}`}>
                  {applications.length}
                </span>
              </button>
            </div>
          </div>

          {/* ── Requirement 14: Important Information Banner ─────────────── */}
          <div className="p-4 sm:p-4.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-amber-950">
            <div className="flex items-start sm:items-center gap-3">
              <span className="material-symbols-outlined text-amber-600 text-2xl shrink-0 mt-0.5 sm:mt-0">
                info
              </span>
              <div className="text-xs sm:text-sm">
                <span className="font-bold text-amber-900 mr-1.5">
                  {isEn ? 'Important Notice:' : 'महत्वपूर्ण सूचना:'}
                </span>
                <span className="text-amber-900/90 leading-relaxed">
                  {isEn
                    ? 'Always verify eligibility, benefits, deadlines, and application requirements on the official government portal before applying. Farmer Helper acts as an agricultural discovery assistant.'
                    : 'आवेदन करने से पूर्व आधिकारिक सरकारी पोर्टल पर पात्रता, लाभ, समय सीमा व नियमों का सत्यापन अवश्य करें। किसान हेल्पर एक सूचना व मार्गदर्शन सहायक है।'}
                </span>
              </div>
            </div>
            <a
              href="https://agricoop.nic.in"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-600 text-white font-semibold text-xs hover:bg-amber-700 transition-all shrink-0 self-start sm:self-auto cursor-pointer"
            >
              <span>{isEn ? 'Visit Official Portal' : 'आधिकारिक पोर्टल'}</span>
              <span className="material-symbols-outlined text-xs">open_in_new</span>
            </a>
          </div>

          {/* ── Requirement 3: Farmer Profile / Personalized Farm Matching Card ── */}
          <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-primary/10 via-primary-container/5 to-surface-container-lowest border border-primary/25 shadow-xs relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-primary/5 rounded-full blur-2xl pointer-events-none" />
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/15 text-primary text-xs font-bold">
                  <span className="material-symbols-outlined text-sm">psychology</span>
                  <span>{isEn ? 'Personalized Scheme Discovery' : 'आपके खेत अनुसार योजनाएं'}</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-on-surface">
                  {isEn ? 'Find schemes for your farm' : 'अपने खेत के लिए प्रासंगिक योजनाएं खोजें'}
                </h3>
                <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                  {primaryFarm ? (
                    isEn ? (
                      <>
                        Based on your profile for <strong className="text-on-surface">{primaryFarm.farmName}</strong> in{' '}
                        <strong className="text-on-surface">{primaryFarm.district}, {primaryFarm.state}</strong> ({primaryFarm.area} {primaryFarm.areaUnit}, {primaryFarm.primaryCrop}, {primaryFarm.irrigationType}).
                      </>
                    ) : (
                      <>
                        आपके फार्म <strong className="text-on-surface">{primaryFarm.farmNameHi || primaryFarm.farmName}</strong> ({primaryFarm.districtHi || primaryFarm.district}, {primaryFarm.stateHi || primaryFarm.state}, {primaryFarm.area} {primaryFarm.areaUnitHi || primaryFarm.areaUnit}, {primaryFarm.primaryCropHi || primaryFarm.primaryCrop}) के आधार पर।
                      </>
                    )
                  ) : (
                    isEn
                      ? 'Tell us your state, landholding size, and primary crop to discover schemes that may apply to you.'
                      : 'अपना राज्य, खेत का आकार और मुख्य फसल दर्ज कर उपयुक्त योजनाएं तुरंत खोजें।'
                  )}
                </p>
                <div className="text-[11px] text-on-surface-variant/80 italic flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">verified</span>
                  <span>
                    {isEn
                      ? 'Potentially relevant schemes based on the information you provided (not an official government eligibility decision).'
                      : 'आपके द्वारा दी गई जानकारी पर आधारित संभावित योजनाएं (यह आधिकारिक सरकारी निर्णय नहीं है)।'}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
                {primaryFarm && (
                  <button
                    onClick={() => {
                      setSelectedState(primaryFarm.state);
                      setSuccessToast(isEn ? `Applied filter for ${primaryFarm.state}` : `${primaryFarm.state} राज्य फ़िल्टर लागू किया गया`);
                    }}
                    className="px-4 py-2.5 rounded-2xl bg-surface-container-high text-on-surface font-semibold text-xs hover:bg-surface-container-highest transition-all border border-outline-variant/30 flex items-center gap-1.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base">location_on</span>
                    <span>{isEn ? `Filter by ${primaryFarm.state}` : `${primaryFarm.state} से फ़िल्टर`}</span>
                  </button>
                )}
                <button
                  onClick={() => handleOpenCheckerForScheme(null)}
                  className="px-5 py-2.5 rounded-2xl bg-primary text-white font-bold text-xs sm:text-sm hover:bg-primary-container transition-all shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer active:scale-98"
                >
                  <span className="material-symbols-outlined text-base">rule</span>
                  <span>{isEn ? 'Check My Eligibility' : 'पात्रता जांचें'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* ── View Tab: MY APPLICATIONS ─────────────────────────────────── */}
          {currentTab === 'applications' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-on-surface">
                    {isEn ? 'My Applications & Inquiries' : 'मेरे आवेदन व योजना पूछताछ'}
                  </h2>
                  <p className="text-xs text-on-surface-variant">
                    {isEn
                      ? 'Track your application checklist and inquiries submitted through Farmer Helper. Final approval rests with respective government departments.'
                      : 'किसान हेल्पर के माध्यम से दर्ज की गई योजनाओं की स्थिति देखें। अंतिम स्वीकृति संबंधित सरकारी विभाग द्वारा दी जाती है।'}
                  </p>
                </div>
                <button
                  onClick={() => setSearchParams({ tab: 'all' })}
                  className="px-3.5 py-1.5 rounded-xl bg-surface-container text-xs font-semibold text-on-surface hover:bg-surface-container-high transition-all"
                >
                  {isEn ? '← Back to All Schemes' : '← सभी योजनाएं देखें'}
                </button>
              </div>

              {applications.length === 0 ? (
                <div className="p-12 text-center bg-surface-container-lowest rounded-3xl border border-outline-variant/30 space-y-3">
                  <span className="material-symbols-outlined text-4xl text-on-surface-variant/50">
                    assignment_late
                  </span>
                  <h4 className="font-bold text-base text-on-surface">
                    {isEn ? 'No Applications Tracked Yet' : 'अभी तक कोई आवेदन दर्ज नहीं है'}
                  </h4>
                  <p className="text-xs text-on-surface-variant max-w-md mx-auto">
                    {isEn
                      ? 'When you explore schemes and click "Apply on Official Portal", we will log an inquiry here to help you track your progress.'
                      : 'जब आप किसी योजना का विवरण देखकर "आधिकारिक पोर्टल पर आवेदन करें" चुनेंगे, तो यहाँ प्रगति ट्रैक करने के लिए सूची बनेगी।'}
                  </p>
                  <button
                    onClick={() => setSearchParams({ tab: 'all' })}
                    className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-container"
                  >
                    {isEn ? 'Browse Government Schemes' : 'योजनाएं खोजें'}
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {applications.map((app) => (
                    <div
                      key={app.id}
                      className="p-5 rounded-3xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs hover:shadow-md transition-all space-y-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-surface-container text-on-surface-variant">
                            Ref: {app.trackingRef}
                          </span>
                          <h4 className="font-bold text-base text-on-surface mt-1.5">{app.schemeName}</h4>
                          <span className="text-xs text-on-surface-variant">
                            {isEn ? 'Date:' : 'दिनांक:'} {app.appliedDate}
                          </span>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                            app.status === 'Approved'
                              ? 'bg-emerald-500/15 text-emerald-700 border border-emerald-500/30'
                              : app.status === 'Under Review'
                              ? 'bg-amber-500/15 text-amber-700 border border-amber-500/30'
                              : app.status === 'Rejected'
                              ? 'bg-rose-500/15 text-rose-700 border border-rose-500/30'
                              : 'bg-blue-500/15 text-blue-700 border border-blue-500/30'
                          }`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current" />
                          <span>{isEn ? app.status : (app.statusHi || app.status)}</span>
                        </span>
                      </div>

                      <div className="p-3 rounded-2xl bg-surface-container-low text-xs text-on-surface-variant space-y-1">
                        <span className="font-semibold text-on-surface block">
                          {isEn ? 'Status Note / Remarks:' : 'प्रगति विवरण:'}
                        </span>
                        <p>{isEn ? app.notesEn : (app.notesHi || app.notesEn)}</p>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[11px] text-on-surface-variant italic">
                          {isEn ? 'Internal Checklist Tracker' : 'आंतरिक चेकलिस्ट ट्रैकर'}
                        </span>
                        {app.schemeId && (
                          <button
                            onClick={() => {
                              const s = OFFICIAL_GOVERNMENT_SCHEMES.find((item) => item.id === app.schemeId);
                              if (s) handleOpenDetails(s);
                            }}
                            className="text-xs font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <span>{isEn ? 'View Scheme Details' : 'विवरण देखें'}</span>
                            <span className="material-symbols-outlined text-sm">arrow_forward</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── View Tab: ALL / SAVED SCHEMES ─────────────────────────────── */}
          {currentTab !== 'applications' && (
            <>
              {/* ── Requirement 2 & 10: Search & Searchable Filters ─────────── */}
              <div className="p-5 rounded-3xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs space-y-4">
                {/* Search Bar Input */}
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">
                    search
                  </span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={
                      isEn
                        ? 'Search by scheme name, crop, benefit (e.g. PM-KISAN, Solar, Wheat, Subsidy)...'
                        : 'योजना का नाम, फसल, या लाभ से खोजें (उदा. पीएम-किसान, सोलर, गेहूं, सब्सिडी)...'
                    }
                    className="w-full pl-11 pr-10 py-3.5 rounded-2xl bg-surface-container-low border border-outline-variant/40 text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                  )}
                </div>

                {/* Filters Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {/* Filter 1: State (Searchable Dropdown reusing ALL_INDIAN_STATES) */}
                  <div className="relative">
                    <label className="block text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                      {isEn ? 'State / UT' : 'राज्य / केंद्र शासित प्रदेश'}
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsStateDropdownOpen(!isStateDropdownOpen)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-xs text-left flex items-center justify-between hover:bg-surface-container transition-all cursor-pointer"
                    >
                      <span className="truncate font-medium text-on-surface">
                        {selectedState || (isEn ? 'All India / Any State' : 'सम्पूर्ण भारत / कोई भी राज्य')}
                      </span>
                      <span className="material-symbols-outlined text-base text-on-surface-variant shrink-0">
                        {isStateDropdownOpen ? 'expand_less' : 'expand_more'}
                      </span>
                    </button>

                    {isStateDropdownOpen && (
                      <div className="absolute top-full left-0 right-0 mt-1.5 bg-surface-container-lowest border border-outline-variant/50 rounded-2xl shadow-xl z-30 p-2 max-h-64 flex flex-col animate-fade-in">
                        <div className="relative mb-2">
                          <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-sm text-on-surface-variant">
                            search
                          </span>
                          <input
                            type="text"
                            value={stateSearchText}
                            onChange={(e) => setStateSearchText(e.target.value)}
                            placeholder={isEn ? 'Search state...' : 'राज्य खोजें...'}
                            className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-surface-container-low text-xs border border-outline-variant/40 focus:outline-none focus:border-primary"
                            autoFocus
                          />
                        </div>
                        <div className="overflow-y-auto flex-1 space-y-0.5">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedState('');
                              setStateSearchText('');
                              setIsStateDropdownOpen(false);
                            }}
                            className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer ${
                              !selectedState
                                ? 'bg-primary text-white'
                                : 'text-on-surface hover:bg-surface-container'
                            }`}
                          >
                            {isEn ? '🇮🇳 All India / Any State' : '🇮🇳 सम्पूर्ण भारत / कोई भी राज्य'}
                          </button>
                          {filteredStatesList.map((st) => (
                            <button
                              key={st}
                              type="button"
                              onClick={() => {
                                setSelectedState(st);
                                setStateSearchText('');
                                setIsStateDropdownOpen(false);
                              }}
                              className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer ${
                                selectedState === st
                                  ? 'bg-primary text-white'
                                  : 'text-on-surface hover:bg-surface-container'
                              }`}
                            >
                              {st}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Filter 2: Category Dropdown */}
                  <div>
                    <label className="block text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                      {isEn ? 'Category' : 'योजना श्रेणी'}
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-xs font-medium text-on-surface focus:outline-none focus:border-primary cursor-pointer"
                    >
                      {SCHEME_CATEGORIES.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.emoji} {isEn ? c.labelEn : c.labelHi}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Filter 3: Benefit Type */}
                  <div>
                    <label className="block text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                      {isEn ? 'Benefit Type' : 'लाभ का प्रकार'}
                    </label>
                    <select
                      value={selectedBenefitType}
                      onChange={(e) => setSelectedBenefitType(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-xs font-medium text-on-surface focus:outline-none focus:border-primary cursor-pointer"
                    >
                      {BENEFIT_TYPES.map((b) => (
                        <option key={b.id} value={b.id}>
                          {isEn ? b.labelEn : b.labelHi}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Filter 4: Eligibility Type */}
                  <div>
                    <label className="block text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                      {isEn ? 'Eligibility' : 'पात्रता दायरा'}
                    </label>
                    <select
                      value={selectedEligibilityFilter}
                      onChange={(e) => setSelectedEligibilityFilter(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-xs font-medium text-on-surface focus:outline-none focus:border-primary cursor-pointer"
                    >
                      <option value="all">{isEn ? 'All Farmers' : 'सभी किसान'}</option>
                      <option value="small_marginal">{isEn ? 'Small & Marginal (< 5 Acres)' : 'लघु एवं सीमांत (< 5 एकड़)'}</option>
                      <option value="women_only">{isEn ? 'Women Farmers' : 'महिला किसान'}</option>
                    </select>
                  </div>
                </div>

                {/* Filter Meta & Clear Button */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-outline-variant/20 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-primary text-sm">
                      {filteredSchemes.length} {isEn ? 'schemes found' : 'योजनाएं उपलब्ध'}
                    </span>
                    {selectedState && (
                      <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-semibold text-[11px] flex items-center gap-1">
                        <span>{selectedState}</span>
                        <button
                          onClick={() => setSelectedState('')}
                          className="hover:text-primary-container cursor-pointer"
                        >
                          ×
                        </button>
                      </span>
                    )}
                    {selectedCategory !== 'all' && (
                      <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-semibold text-[11px] flex items-center gap-1">
                        <span>
                          {SCHEME_CATEGORIES.find((c) => c.id === selectedCategory)?.labelEn || selectedCategory}
                        </span>
                        <button
                          onClick={() => setSelectedCategory('all')}
                          className="hover:text-primary-container cursor-pointer"
                        >
                          ×
                        </button>
                      </span>
                    )}
                  </div>

                  {(searchQuery || selectedCategory !== 'all' || selectedState || selectedBenefitType !== 'all' || selectedEligibilityFilter !== 'all') && (
                    <button
                      onClick={handleClearFilters}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 transition-all cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm">filter_alt_off</span>
                      <span>{isEn ? 'Clear Filters' : 'फ़िल्टर हटाएं'}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* ── Requirement 4: 12 Category Filter Pills ─────────────────── */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                    {isEn ? 'Browse by Category' : 'श्रेणी अनुसार खोजें'}
                  </h3>
                  <span className="text-[11px] text-on-surface-variant">
                    {SCHEME_CATEGORIES.length - 1} {isEn ? 'Agriculture Categories' : 'कृषि श्रेणियां'}
                  </span>
                </div>
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none no-scrollbar">
                  {SCHEME_CATEGORIES.map((cat) => {
                    const isSelected = selectedCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                          isSelected
                            ? 'bg-primary text-white border-primary shadow-xs'
                            : 'bg-surface-container-lowest text-on-surface border-outline-variant/40 hover:bg-surface-container hover:border-primary/40'
                        }`}
                      >
                        <span className="text-sm">{cat.emoji}</span>
                        <span>{isEn ? cat.labelEn : cat.labelHi}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ── Requirement 11: Featured / Important Schemes ───────────── */}
              {selectedCategory === 'all' && !searchQuery && !selectedState && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                    <h3 className="text-sm font-bold text-on-surface">
                      {isEn ? 'Featured Flagship Schemes 🇮🇳' : 'प्रमुख राष्ट्रीय कृषि योजनाएं 🇮🇳'}
                    </h3>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-800 border border-emerald-500/20">
                      {isEn ? 'Verified Official Portals' : 'सत्यापित सरकारी पोर्टल'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {featuredSchemes.slice(0, 3).map((scheme) => (
                      <SchemeCard
                        key={scheme.id}
                        scheme={scheme}
                        isEn={isEn}
                        isSaved={savedIds.includes(scheme.id)}
                        onToggleSave={(e) => handleToggleSave(scheme.id, e)}
                        onViewDetails={() => handleOpenDetails(scheme)}
                        onCheckEligibility={() => handleOpenCheckerForScheme(scheme)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* ── Requirement 5: Scheme Cards Grid ───────────────────────── */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-on-surface">
                    {currentTab === 'saved'
                      ? (isEn ? 'Saved Schemes' : 'सहेजी गई योजनाएं')
                      : (isEn ? 'Available Schemes' : 'उपलब्ध योजनाएं')}
                  </h3>
                  <span className="text-xs text-on-surface-variant">
                    {filteredSchemes.length} {isEn ? 'results' : 'परिणाम'}
                  </span>
                </div>

                {filteredSchemes.length === 0 ? (
                  /* Requirement 17: Empty State */
                  <div className="p-12 text-center bg-surface-container-lowest rounded-3xl border border-outline-variant/30 space-y-3">
                    <span className="material-symbols-outlined text-4xl text-on-surface-variant/50">
                      travel_explore
                    </span>
                    <h4 className="font-bold text-base text-on-surface">
                      {searchQuery
                        ? (isEn ? 'No matching schemes found.' : 'कोई योजना मेल नहीं खाती।')
                        : (isEn ? 'No schemes found for your selected filters.' : 'चुने गए फ़िल्टर के लिए कोई योजना नहीं मिली।')}
                    </h4>
                    <p className="text-xs text-on-surface-variant max-w-md mx-auto">
                      {isEn
                        ? 'Try clearing state, crop, or category filters, or broaden your search keywords.'
                        : 'कृपया राज्य या श्रेणी फ़िल्टर बदलकर पुनः प्रयास करें।'}
                    </p>
                    <button
                      onClick={handleClearFilters}
                      className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-container cursor-pointer"
                    >
                      {isEn ? 'Clear All Filters' : 'सभी फ़िल्टर साफ़ करें'}
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredSchemes.map((scheme) => (
                      <SchemeCard
                        key={scheme.id}
                        scheme={scheme}
                        isEn={isEn}
                        isSaved={savedIds.includes(scheme.id)}
                        onToggleSave={(e) => handleToggleSave(scheme.id, e)}
                        onViewDetails={() => handleOpenDetails(scheme)}
                        onCheckEligibility={() => handleOpenCheckerForScheme(scheme)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

        </main>
      </div>

      {/* Sticky Mobile Bottom Navigation */}
      <DashboardMobileNav
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        lang={lang}
      />

      {/* ── Requirement 6: Detailed Scheme Modal ──────────────────────────── */}
      {detailsScheme && (
        <SchemeDetailsModal
          scheme={detailsScheme}
          isEn={isEn}
          onClose={() => setDetailsScheme(null)}
          onCheckEligibility={() => {
            const s = detailsScheme;
            setDetailsScheme(null);
            handleOpenCheckerForScheme(s);
          }}
          onApply={() => handleApplyTracking(detailsScheme)}
        />
      )}

      {/* ── Requirement 7: 5-Step Eligibility Checker Modal ───────────────── */}
      {isEligibilityCheckerOpen && (
        <EligibilityCheckerModal
          isEn={isEn}
          initialScheme={prefilledSchemeForChecker}
          primaryFarm={primaryFarm}
          onClose={() => {
            setIsEligibilityCheckerOpen(false);
            setPrefilledSchemeForChecker(null);
          }}
          onViewSchemeDetails={(scheme) => {
            setIsEligibilityCheckerOpen(false);
            setDetailsScheme(scheme);
          }}
        />
      )}
    </div>
  );
}

// ─── Scheme Card Component ────────────────────────────────────────────────────
function SchemeCard({
  scheme,
  isEn,
  isSaved,
  onToggleSave,
  onViewDetails,
  onCheckEligibility,
}) {
  const isAllIndia = scheme.applicableStates.includes('All India');

  return (
    <div className="p-5 rounded-3xl bg-surface-container-lowest border border-outline-variant/30 hover:border-primary/40 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group relative">
      {/* Top Meta Badges & Save Toggle */}
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary border border-primary/20">
              {isEn ? scheme.categoryLabelEn : scheme.categoryLabelHi}
            </span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                isAllIndia
                  ? 'bg-blue-500/10 text-blue-700 border border-blue-500/20'
                  : 'bg-amber-500/10 text-amber-800 border border-amber-500/20'
              }`}
            >
              📍 {isAllIndia ? (isEn ? 'All India' : 'सम्पूर्ण भारत') : scheme.applicableStates.join(', ')}
            </span>
          </div>

          {/* Bookmark Button */}
          <button
            type="button"
            onClick={onToggleSave}
            title={isSaved ? 'Remove from saved' : 'Save scheme'}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
              isSaved
                ? 'bg-primary text-white shadow-xs'
                : 'bg-surface-container text-on-surface-variant hover:text-primary hover:bg-primary/10'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">
              {isSaved ? 'bookmark_added' : 'bookmark_border'}
            </span>
          </button>
        </div>

        {/* Scheme Title & Description */}
        <div>
          <h3 className="font-extrabold text-base text-on-surface group-hover:text-primary transition-colors line-clamp-2">
            {isEn ? scheme.name : (scheme.nameHi || scheme.name)}
          </h3>
          <p className="text-xs text-on-surface-variant mt-1.5 line-clamp-3 leading-relaxed">
            {isEn ? scheme.shortDescription : (scheme.shortDescriptionHi || scheme.shortDescription)}
          </p>
        </div>

        {/* Benefit & Eligibility Summary */}
        <div className="p-3 rounded-2xl bg-surface-container-low/80 border border-outline-variant/20 space-y-2 text-xs">
          <div className="flex items-start gap-2">
            <span className="material-symbols-outlined text-emerald-600 text-sm shrink-0 mt-0.5">
              payments
            </span>
            <div>
              <span className="font-bold text-on-surface block text-[11px]">
                {isEn ? 'Key Benefit:' : 'मुख्य लाभ:'}
              </span>
              <span className="text-on-surface-variant text-[11px] line-clamp-1">
                {isEn ? scheme.benefitType : (scheme.benefitTypeHi || scheme.benefitType)}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <span className="material-symbols-outlined text-primary text-sm shrink-0 mt-0.5">
              verified_user
            </span>
            <div>
              <span className="font-bold text-on-surface block text-[11px]">
                {isEn ? 'Eligibility Summary:' : 'पात्रता सारांश:'}
              </span>
              <span className="text-on-surface-variant text-[11px] line-clamp-1">
                {isEn ? scheme.eligibilitySummary : (scheme.eligibilitySummaryHi || scheme.eligibilitySummary)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Card Action Buttons */}
      <div className="pt-4 border-t border-outline-variant/20 mt-4 space-y-2">
        <div className="flex items-center justify-between text-[11px] text-on-surface-variant">
          <span className="flex items-center gap-1 font-semibold text-emerald-700">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
            {scheme.status}
          </span>
          {scheme.officialUrl && (
            <a
              href={scheme.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline flex items-center gap-0.5 cursor-pointer"
            >
              <span>{isEn ? 'Official Website' : 'सरकारी पोर्टल'}</span>
              <span className="material-symbols-outlined text-xs">open_in_new</span>
            </a>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            type="button"
            onClick={onViewDetails}
            className="w-full py-2 px-3 rounded-xl bg-surface-container-high text-on-surface font-bold text-xs hover:bg-surface-container-highest transition-all text-center cursor-pointer"
          >
            {isEn ? 'View Details' : 'विवरण देखें'}
          </button>
          <button
            type="button"
            onClick={onCheckEligibility}
            className="w-full py-2 px-3 rounded-xl bg-primary text-white font-bold text-xs hover:bg-primary-container transition-all text-center shadow-xs cursor-pointer"
          >
            {isEn ? 'Check Eligibility' : 'पात्रता जांचें'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Requirement 6: Scheme Details Modal ──────────────────────────────────────
function SchemeDetailsModal({
  scheme,
  isEn,
  onClose,
  onCheckEligibility,
  onApply,
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-fade-in">
      <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/40 shadow-2xl max-w-2xl w-full my-8 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Modal Top Header */}
        <div className="p-6 bg-surface-container-low border-b border-outline-variant/30 flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
                {isEn ? scheme.categoryLabelEn : scheme.categoryLabelHi}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-700">
                📍 {scheme.applicableStates.includes('All India') ? (isEn ? 'All India' : 'सम्पूर्ण भारत') : scheme.applicableStates.join(', ')}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-800">
                {scheme.status}
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-on-surface">
              {isEn ? scheme.name : (scheme.nameHi || scheme.name)}
            </h2>
            <p className="text-xs text-on-surface-variant">
              {isEn ? 'Last Updated:' : 'अंतिम अपडेट:'} {scheme.lastUpdated}
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-all cursor-pointer shrink-0"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm">
          {/* Overview & Objective */}
          <div className="space-y-2">
            <h4 className="font-bold text-on-surface flex items-center gap-1.5 text-xs uppercase tracking-wider text-primary">
              <span className="material-symbols-outlined text-base">info</span>
              <span>{isEn ? 'Overview & Objective' : 'योजना का परिचय एवं उद्देश्य'}</span>
            </h4>
            <p className="text-on-surface-variant leading-relaxed text-xs sm:text-sm">
              {isEn ? scheme.description : (scheme.descriptionHi || scheme.description)}
            </p>
            {scheme.objective && (
              <div className="p-3 rounded-2xl bg-primary/5 border border-primary/15 text-xs text-on-surface-variant">
                <strong className="text-primary block font-semibold mb-0.5">
                  {isEn ? 'Core Objective:' : 'मुख्य लक्ष्य:'}
                </strong>
                {isEn ? scheme.objective : (scheme.objectiveHi || scheme.objective)}
              </div>
            )}
          </div>

          {/* Key Benefits */}
          <div className="space-y-2">
            <h4 className="font-bold text-on-surface flex items-center gap-1.5 text-xs uppercase tracking-wider text-primary">
              <span className="material-symbols-outlined text-base">payments</span>
              <span>{isEn ? 'Benefits & Financial Assistance' : 'मुख्य लाभ एवं अनुदान'}</span>
            </h4>
            <ul className="space-y-1.5">
              {(isEn ? scheme.benefits : (scheme.benefitsHi || scheme.benefits)).map((b, i) => (
                <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-on-surface-variant">
                  <span className="material-symbols-outlined text-emerald-600 text-sm shrink-0 mt-0.5">
                    check_circle
                  </span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Eligibility Criteria */}
          <div className="space-y-2">
            <h4 className="font-bold text-on-surface flex items-center gap-1.5 text-xs uppercase tracking-wider text-primary">
              <span className="material-symbols-outlined text-base">verified</span>
              <span>{isEn ? 'Who Can Apply & Eligibility' : 'पात्रता एवं कौन आवेदन कर सकता है'}</span>
            </h4>
            <div className="p-3.5 rounded-2xl bg-surface-container-low border border-outline-variant/30 space-y-2 text-xs">
              <p className="text-on-surface font-medium">
                {isEn ? scheme.eligibilitySummary : (scheme.eligibilitySummaryHi || scheme.eligibilitySummary)}
              </p>
              {scheme.eligibilityCriteria.exclusions && (
                <p className="text-rose-700 bg-rose-500/10 p-2 rounded-xl border border-rose-500/20 text-[11px]">
                  <strong>{isEn ? 'Exclusions / अपवाद:' : 'अपवाद:'}</strong> {scheme.eligibilityCriteria.exclusions}
                </p>
              )}
            </div>
          </div>

          {/* Requirement 8: Required Documents */}
          <div className="space-y-2">
            <h4 className="font-bold text-on-surface flex items-center gap-1.5 text-xs uppercase tracking-wider text-primary">
              <span className="material-symbols-outlined text-base">description</span>
              <span>{isEn ? 'Required Documents' : 'आवश्यक दस्तावेज'}</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {scheme.requiredDocuments.map((doc, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/30 flex items-center gap-2 text-xs"
                >
                  <span className="material-symbols-outlined text-primary text-base shrink-0">
                    {doc.icon || 'description'}
                  </span>
                  <span className="text-on-surface font-medium">{doc.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Application Process */}
          <div className="space-y-2">
            <h4 className="font-bold text-on-surface flex items-center gap-1.5 text-xs uppercase tracking-wider text-primary">
              <span className="material-symbols-outlined text-base">how_to_reg</span>
              <span>{isEn ? 'How to Apply' : 'आवेदन प्रक्रिया'}</span>
            </h4>
            <div className="space-y-1.5">
              {scheme.applicationProcess.map((step, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/20 text-xs text-on-surface-variant flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-primary/10 text-primary font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Important Dates & Portal Notice */}
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 space-y-1 text-xs text-amber-950">
            <div className="font-bold flex items-center gap-1.5 text-amber-900">
              <span className="material-symbols-outlined text-sm">schedule</span>
              <span>{isEn ? 'Timeline / Important Dates:' : 'समय सीमा एवं महत्वपूर्ण तिथियां:'}</span>
            </div>
            <p>{scheme.importantDates}</p>
            <p className="text-[11px] text-amber-900/80 pt-1">
              {isEn
                ? 'Official Portal: ' + scheme.officialUrl
                : 'आधिकारिक पोर्टल: ' + scheme.officialUrl}
            </p>
          </div>
        </div>

        {/* Modal Bottom Footer Actions */}
        <div className="p-4 sm:p-6 bg-surface-container-low border-t border-outline-variant/30 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={onCheckEligibility}
            className="px-4 py-2.5 rounded-xl bg-surface-container-high text-on-surface font-semibold text-xs hover:bg-surface-container-highest transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">rule</span>
            <span>{isEn ? 'Check My Eligibility' : 'पात्रता जांचें'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-on-surface-variant font-semibold text-xs hover:bg-surface-container cursor-pointer"
            >
              {isEn ? 'Close' : 'बंद करें'}
            </button>
            <button
              onClick={onApply}
              className="px-5 py-2.5 rounded-xl bg-primary text-white font-bold text-xs hover:bg-primary-container transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <span>{isEn ? 'Apply on Official Portal' : 'आधिकारिक पोर्टल पर जाएं'}</span>
              <span className="material-symbols-outlined text-sm">open_in_new</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Requirement 7: 5-Step Eligibility Checker ────────────────────────────────
function EligibilityCheckerModal({
  isEn,
  initialScheme,
  primaryFarm,
  onClose,
  onViewSchemeDetails,
}) {
  // 5 Steps:
  // 1: State
  // 2: Land Size & Unit
  // 3: Primary Crop
  // 4: Irrigation Type
  // 5: Farmer Category
  const [step, setStep] = useState(1);

  // Form State initialized from primaryFarm if available
  const [state, setState] = useState(primaryFarm?.state || 'Uttar Pradesh');
  const [landSize, setLandSize] = useState(primaryFarm?.area || '10');
  const [landUnit, setLandUnit] = useState(primaryFarm?.areaUnit || 'Acre');
  const [primaryCrop, setPrimaryCrop] = useState(primaryFarm?.primaryCrop || 'Wheat');
  const [irrigationType, setIrrigationType] = useState(primaryFarm?.irrigationType || 'Tube Well');
  const [farmerCategory, setFarmerCategory] = useState('Small & Marginal Farmer');

  // Match Results
  const matchResults = useMemo(() => {
    return matchSchemesForFarm({
      state,
      landSize,
      landUnit,
      primaryCrop,
      irrigationType,
      category: farmerCategory,
    });
  }, [state, landSize, landUnit, primaryCrop, irrigationType, farmerCategory]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-fade-in">
      <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/40 shadow-2xl max-w-2xl w-full my-8 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Modal Top Header */}
        <div className="p-6 bg-surface-container-low border-b border-outline-variant/30 flex items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-1">
              <span className="material-symbols-outlined text-sm">fact_check</span>
              <span>{isEn ? 'Scheme Eligibility Discovery Helper' : 'पात्रता जांच सहायक'}</span>
            </div>
            <h2 className="text-xl font-extrabold text-on-surface">
              {isEn ? 'Check Potentially Relevant Schemes' : 'अपने खेत के लिए संभावित योजनाएं खोजें'}
            </h2>
            <p className="text-xs text-on-surface-variant mt-0.5">
              {isEn
                ? 'Step-by-step discovery helper. Not an official legal government eligibility determination.'
                : '5 चरणों में अपने खेत के विवरण भरें और अनुकूल योजनाएं खोजें।'}
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">close</span>
          </button>
        </div>

        {/* Stepper Progress Indicator */}
        <div className="px-6 pt-4 pb-2 bg-surface-container-lowest border-b border-outline-variant/20">
          <div className="flex items-center justify-between text-xs">
            {['State', 'Land Size', 'Crop', 'Irrigation', 'Category', 'Results'].map((sName, idx) => {
              const stepNumber = idx + 1;
              const isActive = step === stepNumber;
              const isDone = step > stepNumber;

              return (
                <button
                  key={sName}
                  type="button"
                  onClick={() => setStep(stepNumber)}
                  className={`flex flex-col items-center gap-1 cursor-pointer transition-all ${
                    isActive ? 'font-bold text-primary' : isDone ? 'text-on-surface' : 'text-on-surface-variant/60'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-primary text-white shadow-xs'
                        : isDone
                        ? 'bg-emerald-500/20 text-emerald-800'
                        : 'bg-surface-container text-on-surface-variant'
                    }`}
                  >
                    {isDone ? '✓' : stepNumber}
                  </div>
                  <span className="hidden sm:inline text-[10px]">{sName}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Modal Body Step Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm flex-1">
          {/* STEP 1: STATE */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-base text-on-surface">
                  {isEn ? 'Step 1: Select Your Farm State' : 'चरण 1: अपने खेत का राज्य चुनें'}
                </h3>
                <p className="text-xs text-on-surface-variant">
                  {isEn
                    ? 'Schemes applicable to All India or specifically to your chosen state will be prioritized.'
                    : 'सम्पूर्ण भारत एवं आपके राज्य में सक्रिय योजनाओं को प्राथमिकता दी जाएगी।'}
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-on-surface-variant block">
                  {isEn ? 'State / Union Territory' : 'राज्य / केंद्र शासित प्रदेश'}
                </label>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-surface-container-low border border-outline-variant/40 text-sm font-medium focus:outline-none focus:border-primary"
                >
                  {ALL_INDIAN_STATES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* STEP 2: LAND SIZE & UNIT */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-base text-on-surface">
                  {isEn ? 'Step 2: Enter Your Total Landholding' : 'चरण 2: खेत का कुल आकार दर्ज करें'}
                </h3>
                <p className="text-xs text-on-surface-variant">
                  {isEn
                    ? 'Certain subsidies are reserved for small/marginal farmers (e.g. up to 2 hectares / 5 acres).'
                    : 'कई योजनाएं लघु एवं सीमांत किसानों (2 हेक्टेयर / 5 एकड़ तक) के लिए विशेष अनुदान देती हैं।'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-on-surface-variant block mb-1">
                    {isEn ? 'Total Land Size' : 'कुल भूमि आकार'}
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={landSize}
                    onChange={(e) => setLandSize(e.target.value)}
                    placeholder="e.g. 5"
                    className="w-full px-4 py-3 rounded-2xl bg-surface-container-low border border-outline-variant/40 text-sm font-medium focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-on-surface-variant block mb-1">
                    {isEn ? 'Unit' : 'इकाई'}
                  </label>
                  <select
                    value={landUnit}
                    onChange={(e) => setLandUnit(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-surface-container-low border border-outline-variant/40 text-sm font-medium focus:outline-none focus:border-primary"
                  >
                    <option value="Acre">Acre / एकड़</option>
                    <option value="Hectare">Hectare / हेक्टेयर</option>
                    <option value="Bigha">Bigha / बीघा</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: PRIMARY CROP */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-base text-on-surface">
                  {isEn ? 'Step 3: Primary Crop Grown' : 'चरण 3: मुख्य उगाई जाने वाली फसल'}
                </h3>
                <p className="text-xs text-on-surface-variant">
                  {isEn
                    ? 'Insurance and crop-specific input subsidies vary between food grains, pulses, and oilseeds.'
                    : 'फसल बीमा व बीज अनुदान फसल के प्रकार पर निर्भर करते हैं।'}
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {['Wheat', 'Paddy / Rice', 'Mustard', 'Sugarcane', 'Cotton', 'Pulses / Dal', 'Maize', 'Soybean', 'Horticulture / Fruits'].map((crop) => (
                  <button
                    key={crop}
                    type="button"
                    onClick={() => setPrimaryCrop(crop)}
                    className={`p-3 rounded-2xl border text-xs font-semibold text-left transition-all cursor-pointer ${
                      primaryCrop.toLowerCase().includes(crop.toLowerCase().split('/')[0].trim())
                        ? 'bg-primary text-white border-primary shadow-xs'
                        : 'bg-surface-container-low text-on-surface border-outline-variant/30 hover:bg-surface-container'
                    }`}
                  >
                    {crop}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: IRRIGATION TYPE */}
          {step === 4 && (
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-base text-on-surface">
                  {isEn ? 'Step 4: Irrigation Infrastructure' : 'चरण 4: सिंचाई का साधन'}
                </h3>
                <p className="text-xs text-on-surface-variant">
                  {isEn
                    ? 'Helps match micro-irrigation subsidies (Drip/Sprinkler) and PM-KUSUM solar pumping schemes.'
                    : 'ड्रिप/स्प्रिंकलर एवं पीएम-कुसुम सोलर पंप सब्सिडी मिलान में सहायक।'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { id: 'Tube Well', label: 'Tube Well / Borewell', icon: 'water_pump' },
                  { id: 'Canal', label: 'Canal / River Water', icon: 'water' },
                  { id: 'Drip Irrigation', label: 'Drip / Micro-Irrigation', icon: 'opacity' },
                  { id: 'Rainfed', label: 'Rainfed / Dependent on Monsoon', icon: 'rainy' },
                ].map((irri) => (
                  <button
                    key={irri.id}
                    type="button"
                    onClick={() => setIrrigationType(irri.id)}
                    className={`p-3.5 rounded-2xl border text-xs font-semibold flex items-center gap-2.5 transition-all cursor-pointer ${
                      irrigationType === irri.id
                        ? 'bg-primary text-white border-primary shadow-xs'
                        : 'bg-surface-container-low text-on-surface border-outline-variant/30 hover:bg-surface-container'
                    }`}
                  >
                    <span className="material-symbols-outlined text-lg">{irri.icon}</span>
                    <span>{irri.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 5: FARMER CATEGORY */}
          {step === 5 && (
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-base text-on-surface">
                  {isEn ? 'Step 5: Farmer & Beneficiary Category' : 'चरण 5: किसान श्रेणी'}
                </h3>
                <p className="text-xs text-on-surface-variant">
                  {isEn
                    ? 'Special grants and women-focused agricultural initiatives are highlighted based on category.'
                    : 'महिला किसानों एवं विशेष श्रेणियों के लिए अतिरिक्त अनुदान उपलब्ध होता है।'}
                </p>
              </div>

              <div className="space-y-2">
                {[
                  'Small & Marginal Farmer (< 2 Hectares)',
                  'Large / Commercial Landholder',
                  'Women Farmer',
                  'SC / ST Farmer',
                  'Farmer Producer Organization (FPO) Member',
                ].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setFarmerCategory(cat)}
                    className={`w-full p-3.5 rounded-2xl border text-xs font-semibold text-left transition-all cursor-pointer ${
                      farmerCategory === cat
                        ? 'bg-primary text-white border-primary shadow-xs'
                        : 'bg-surface-container-low text-on-surface border-outline-variant/30 hover:bg-surface-container'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 6: POTENTIALLY RELEVANT SCHEMES RESULTS */}
          {step === 6 && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-primary/10 border border-primary/20 text-xs text-primary space-y-1">
                <span className="font-bold block">
                  {isEn ? 'Discovery Result Summary:' : 'पात्रता खोज परिणाम:'}
                </span>
                <p className="text-on-surface-variant">
                  {isEn
                    ? `Based on ${state}, ${landSize} ${landUnit}, ${primaryCrop}, and ${irrigationType}. Here are potentially relevant schemes.`
                    : `${state}, ${landSize} ${landUnit}, ${primaryCrop}, और ${irrigationType} के आधार पर संभावित योजनाएं:`}
                </p>
              </div>

              <div className="space-y-3">
                {matchResults.slice(0, 6).map(({ scheme, matchScore, matchReasons, missingReasons }) => (
                  <div
                    key={scheme.id}
                    className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30 space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                            {scheme.categoryLabelEn}
                          </span>
                          <span className="text-[11px] font-semibold text-emerald-700">
                            {matchScore}% {isEn ? 'Match' : 'अनुकूल'}
                          </span>
                        </div>
                        <h4 className="font-bold text-sm text-on-surface mt-1">{scheme.name}</h4>
                      </div>

                      <button
                        type="button"
                        onClick={() => onViewSchemeDetails(scheme)}
                        className="px-3 py-1.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-container shrink-0 cursor-pointer"
                      >
                        {isEn ? 'View' : 'देखें'}
                      </button>
                    </div>

                    {/* Breakdown Reasons */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1 text-[11px]">
                      {matchReasons.map((r, i) => (
                        <div key={i} className="flex items-center gap-1 text-emerald-700 font-medium">
                          <span>✓</span>
                          <span>{isEn ? r.textEn : r.textHi}</span>
                        </div>
                      ))}
                      {missingReasons.map((r, i) => (
                        <div key={i} className="flex items-center gap-1 text-amber-700 font-medium">
                          <span>⚠</span>
                          <span>{isEn ? r.textEn : r.textHi}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-[11px] text-on-surface-variant text-center italic pt-2">
                {isEn
                  ? 'Note: More information or land document verification on official state portals is required before applying.'
                  : 'नोट: आधिकारिक सरकारी पोर्टल पर पात्रता, आधार व खतौनी सत्यापन के बाद ही अंतिम स्वीकृति मिलती है।'}
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Stepper Controls */}
        <div className="p-4 sm:p-6 bg-surface-container-low border-t border-outline-variant/30 flex items-center justify-between gap-3">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="px-4 py-2.5 rounded-xl bg-surface-container text-on-surface font-semibold text-xs hover:bg-surface-container-high transition-all cursor-pointer"
            >
              {isEn ? '← Back' : '← पीछे'}
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-on-surface-variant font-semibold text-xs hover:bg-surface-container cursor-pointer"
            >
              {isEn ? 'Cancel' : 'रद्द करें'}
            </button>
          )}

          {step < 6 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="px-6 py-2.5 rounded-xl bg-primary text-white font-bold text-xs hover:bg-primary-container transition-all shadow-md cursor-pointer flex items-center gap-1.5"
            >
              <span>{isEn ? (step === 5 ? 'Show Schemes' : 'Next Step') : (step === 5 ? 'योजनाएं देखें' : 'अगला चरण')}</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-primary text-white font-bold text-xs hover:bg-primary-container transition-all cursor-pointer"
            >
              {isEn ? 'Done' : 'पूर्ण'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
