// ====================================================================
// Crop Loss Report — Data & Constants
// API-ready: replace exports with real API responses when backend is ready
// ====================================================================

// ── Step labels (for stepper) ────────────────────────────────────────
export const STEP_LABELS = [
  { en: 'Farm Details',    hi: 'खेत की जानकारी' },
  { en: 'Crop Details',    hi: 'फसल की जानकारी' },
  { en: 'Damage Details',  hi: 'नुकसान की जानकारी' },
  { en: 'Photos & Location', hi: 'फोटो और Location' },
  { en: 'Review',          hi: 'जानकारी जांचें' },
  { en: 'Generate Report', hi: 'रिपोर्ट बनाएं' },
];

// ── Crop options ─────────────────────────────────────────────────────
export const cropOptions = [
  { value: 'wheat',     en: 'Wheat',       hi: 'गेहूं',     icon: 'grass'     },
  { value: 'paddy',     en: 'Paddy (Rice)', hi: 'धान',       icon: 'nutrition' },
  { value: 'maize',     en: 'Maize',        hi: 'मक्का',    icon: 'grass'     },
  { value: 'cotton',    en: 'Cotton',        hi: 'कपास',     icon: 'spa'       },
  { value: 'sugarcane', en: 'Sugarcane',     hi: 'गन्ना',    icon: 'grass'     },
  { value: 'mustard',   en: 'Mustard',       hi: 'सरसों',    icon: 'eco'       },
  { value: 'potato',    en: 'Potato',        hi: 'आलू',      icon: 'spa'       },
  { value: 'tomato',    en: 'Tomato',        hi: 'टमाटर',    icon: 'eco'       },
  { value: 'other',     en: 'Other',         hi: 'अन्य',     icon: 'more_horiz'},
];

// ── Damage categories (cause cards) ─────────────────────────────────
export const damageCategories = [
  { value: 'flood',     emoji: '🌧️', en: 'Flood',        hi: 'बाढ़',          icon: 'flood'          },
  { value: 'rain',      emoji: '⛈️', en: 'Heavy Rain',   hi: 'भारी बारिश',   icon: 'thunderstorm'   },
  { value: 'hailstorm', emoji: '🧊', en: 'Hailstorm',    hi: 'ओलावृष्टि',    icon: 'ac_unit'        },
  { value: 'drought',   emoji: '☀️', en: 'Drought',      hi: 'सूखा',          icon: 'wb_sunny'       },
  { value: 'storm',     emoji: '💨', en: 'Storm',        hi: 'आंधी',          icon: 'air'            },
  { value: 'pest',      emoji: '🐛', en: 'Pest Attack',  hi: 'कीट प्रकोप',   icon: 'bug_report'     },
  { value: 'disease',   emoji: '🌱', en: 'Crop Disease', hi: 'फसल रोग',      icon: 'coronavirus'    },
  { value: 'other',     emoji: '⚡', en: 'Other',        hi: 'अन्य',          icon: 'help_outline'   },
];

// ── Damage severity thresholds ───────────────────────────────────────
export const getDamageSeverity = (pct) => {
  if (pct <= 25)  return { en: 'Minor Damage',    hi: 'कम नुकसान',     color: 'text-secondary', ring: 'secondary' };
  if (pct <= 50)  return { en: 'Moderate Damage', hi: 'मध्यम नुकसान', color: 'text-tertiary',  ring: 'tertiary'  };
  if (pct <= 75)  return { en: 'Severe Damage',   hi: 'अधिक नुकसान',  color: 'text-error',     ring: 'error'     };
  return           { en: 'Total Crop Loss',  hi: 'पूर्ण फसल हानि', color: 'text-error',     ring: 'error'     };
};

// ── State & district data ────────────────────────────────────────────
export const stateOptions = [
  'Uttar Pradesh', 'Punjab', 'Haryana', 'Madhya Pradesh', 'Rajasthan',
  'Maharashtra', 'Bihar', 'Gujarat', 'Andhra Pradesh', 'Karnataka',
  'Tamil Nadu', 'Odisha', 'West Bengal', 'Chhattisgarh', 'Jharkhand',
  'Himachal Pradesh', 'Uttarakhand', 'Other',
];

export const districtMap = {
  'Uttar Pradesh':   ['Meerut', 'Lucknow', 'Agra', 'Varanasi', 'Kanpur', 'Mathura', 'Aligarh', 'Muzaffarnagar'],
  'Punjab':          ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda', 'Firozpur'],
  'Haryana':         ['Rohtak', 'Hisar', 'Karnal', 'Panipat', 'Ambala', 'Sirsa'],
  'Madhya Pradesh':  ['Bhopal', 'Indore', 'Jabalpur', 'Gwalior', 'Rewa', 'Sagar'],
  'Rajasthan':       ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Bikaner', 'Ajmer'],
  'Maharashtra':     ['Nashik', 'Pune', 'Mumbai', 'Nagpur', 'Aurangabad', 'Solapur'],
  'Bihar':           ['Patna', 'Gaya', 'Muzaffarpur', 'Bhagalpur', 'Darbhanga'],
  'Gujarat':         ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar'],
  'default':         ['Please select a state first'],
};

// ── Land ownership types ─────────────────────────────────────────────
export const ownershipTypes = [
  { value: 'owned',   en: 'Owned',   hi: 'स्वयं की' },
  { value: 'leased',  en: 'Leased',  hi: 'पट्टे पर' },
  { value: 'shared',  en: 'Shared',  hi: 'साझा खेत' },
];

// ── Area units ───────────────────────────────────────────────────────
export const areaUnits = [
  { value: 'acre',     en: 'Acre',     hi: 'एकड़'  },
  { value: 'hectare',  en: 'Hectare',  hi: 'हेक्टेयर' },
  { value: 'bigha',    en: 'Bigha',    hi: 'बीघा'  },
];

// ── Photo guidance tips ──────────────────────────────────────────────
export const photoTips = [
  { en: 'Take one wide-angle photo showing the full affected field area', hi: 'पूरे प्रभावित खेत का एक wide-angle फोटो लें' },
  { en: 'Take close-up photos of the damaged crop parts', hi: 'नुकसान वाले हिस्से की close-up फोटो लें' },
  { en: 'Show the field boundary and surrounding area', hi: 'खेत का boundary और आस-पास का हिस्सा दिखाएं' },
  { en: 'Take photos in clear daylight for best results', hi: 'साफ और अच्छी रोशनी वाली फोटो लें' },
];

// ── Mock GPS location ────────────────────────────────────────────────
export const MOCK_LOCATION = {
  village: 'Kharkhauda',
  district: 'Meerut',
  state: 'Uttar Pradesh',
  lat: '28.9845',
  lng: '77.7064',
  khasra: '412/9',
  verified: true,
};

// ── Mock report data (3 sample reports) ─────────────────────────────
export const MOCK_REPORTS = [
  {
    id: 'FLR-2026-08942',
    cropEn: 'Wheat',
    cropHi: 'गेहूं',
    variety: 'PBW-502',
    causeEn: 'Hailstorm',
    causeHi: 'ओलावृष्टि',
    causeEmoji: '🧊',
    damagePercent: 65,
    areaAffected: '4.2',
    areaUnit: 'Acre',
    dateEn: '17 Sep 2026',
    dateHi: '17 सितम्बर 2026',
    location: 'Meerut, UP',
    status: 'ready',
    statusEn: 'Ready / तैयार',
    statusHi: 'तैयार',
    statusClass: 'bg-primary-fixed/30 text-on-primary-fixed-variant',
    badgeIcon: 'task_alt',
    insuranceInfo: 'AIC of India (Claim ID: AIC-881920)',
    geoTag: '28.988° N, 77.712° E',
    surveyorNote: 'Surveyor Sign Verified',
    severityEn: 'Severe Damage',
    icon: 'thunderstorm',
    iconColor: 'text-error',
  },
  {
    id: 'FLR-2026-07119',
    cropEn: 'Mustard',
    cropHi: 'सरसों',
    variety: 'Pusa Bold',
    causeEn: 'Heavy Rain / Waterlogging',
    causeHi: 'भारी बारिश / जलभराव',
    causeEmoji: '⛈️',
    damagePercent: 35,
    areaAffected: '2.5',
    areaUnit: 'Acre',
    dateEn: '04 Aug 2026',
    dateHi: '04 अगस्त 2026',
    location: 'Meerut, UP',
    status: 'approved',
    statusEn: 'Approved / स्वीकृत',
    statusHi: 'स्वीकृत',
    statusClass: 'bg-secondary-fixed text-on-secondary-fixed',
    badgeIcon: 'verified',
    claimAmount: '₹48,000',
    utrRef: 'SBI-20260904-89382',
    severityEn: 'Moderate Damage',
    icon: 'water_drop',
    iconColor: 'text-tertiary',
  },
  {
    id: 'FLR-2026-09201',
    cropEn: 'Paddy',
    cropHi: 'धान',
    variety: 'Basmati 1509',
    causeEn: 'Pest Attack (Stem Borer)',
    causeHi: 'कीट प्रकोप (तना छेदक)',
    causeEmoji: '🐛',
    damagePercent: 50,
    areaAffected: '3.0',
    areaUnit: 'Acre',
    dateEn: 'Today (Draft)',
    dateHi: 'आज (प्रारूप)',
    location: 'Meerut, UP',
    status: 'draft',
    statusEn: 'Draft (Incomplete)',
    statusHi: 'अपूर्ण प्रारूप',
    statusClass: 'bg-error-container text-on-error-container',
    badgeIcon: 'warning',
    pendingNote: '2 more geotagged photos needed',
    pendingNoteHi: 'भू-टैग्ड 2 और फोटो अपलोड करना बाकी है',
    urgency: '18 घंटे शेष (72 घंटे की सीमा)',
    severityEn: 'Moderate Damage',
    icon: 'bug_report',
    iconColor: 'text-on-surface-variant',
  },
];

// ── Stats for the hub metrics row ────────────────────────────────────
export const HUB_STATS = [
  {
    id: 'total',
    labelEn: 'Total Reports Filed',
    labelHi: 'कुल रिपोर्ट दर्ज',
    value: '3',
    note: '100% Filed on time',
    noteHi: '100% समय पर',
    noteColor: 'text-secondary',
    barWidth: 100,
    barColor: 'bg-primary',
    icon: 'assignment',
    iconBg: 'bg-primary-fixed/40 text-primary',
  },
  {
    id: 'review',
    labelEn: 'Under Review',
    labelHi: 'सत्यापनाधीन',
    value: '1',
    note: 'Patwari / Surveyor Assigned',
    noteHi: 'सर्वेयर नियुक्त',
    noteColor: 'text-tertiary',
    barWidth: 33,
    barColor: 'bg-tertiary',
    icon: 'pending_actions',
    iconBg: 'bg-tertiary-fixed/40 text-tertiary',
  },
  {
    id: 'approved',
    labelEn: 'Claim Approved',
    labelHi: 'स्वीकृत क्लेम',
    value: '₹1,42,000',
    note: 'DBT Disbursed',
    noteHi: 'बैंक में जमा',
    noteColor: 'text-secondary',
    barWidth: 75,
    barColor: 'bg-secondary',
    icon: 'payments',
    iconBg: 'bg-secondary-fixed/50 text-secondary',
  },
  {
    id: 'drafts',
    labelEn: 'Drafts (Incomplete)',
    labelHi: 'अपूर्ण प्रारूप',
    value: '1',
    note: 'Needs 2 more photos',
    noteHi: '2 फोटो बाकी',
    noteColor: 'text-error',
    barWidth: 50,
    barColor: 'bg-outline',
    icon: 'edit_note',
    iconBg: 'bg-surface-container-high text-outline',
  },
];
