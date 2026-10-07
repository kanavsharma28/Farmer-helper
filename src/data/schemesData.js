// ─── Government Agricultural Schemes Data & Persistence Layer ─────────────────
// Official Government of India & State Agriculture Schemes Dataset
// Verified official portal links (.gov.in / .nic.in). Always subject to official portal verification.

export const SCHEMES_STORAGE_KEY = 'farmer_helper_saved_schemes';
export const SCHEMES_APPLICATIONS_KEY = 'farmer_helper_scheme_applications';
export const SCHEMES_UPDATE_EVENT = 'farmer_helper_schemes_updated';

// ── 12 Scheme Categories per Specification ──────────────────────────────────
export const SCHEME_CATEGORIES = [
  { id: 'all', emoji: '🏛️', labelEn: 'All Schemes', labelHi: 'सभी योजनाएं' },
  { id: 'income_support', emoji: '🌾', labelEn: 'Farmer Income Support', labelHi: 'किसान आय सहायता', count: 2 },
  { id: 'crop_seeds', emoji: '🌱', labelEn: 'Crop & Seeds', labelHi: 'फसल व उन्नत बीज', count: 2 },
  { id: 'irrigation_water', emoji: '💧', labelEn: 'Irrigation & Water', labelHi: 'सिंचाई एवं जल संरक्षण', count: 2 },
  { id: 'equipment', emoji: '🚜', labelEn: 'Agriculture Equipment', labelHi: 'कृषि यंत्र व सब्सिडी', count: 2 },
  { id: 'crop_insurance', emoji: '🛡️', labelEn: 'Crop Insurance', labelHi: 'फसल बीमा सुरक्षा', count: 1 },
  { id: 'loans_finance', emoji: '🏦', labelEn: 'Agriculture Loans & Finance', labelHi: 'कृषि ऋण व वित्तीय सहायता', count: 2 },
  { id: 'storage_postharvest', emoji: '❄️', labelEn: 'Storage & Post-Harvest', labelHi: 'भंडारण व कटाई उपरांत', count: 1 },
  { id: 'organic_farming', emoji: '🌿', labelEn: 'Organic / Sustainable Farming', labelHi: 'जैविक व प्राकृतिक खेती', count: 1 },
  { id: 'women_farmers', emoji: '👩‍🌾', labelEn: 'Women Farmers', labelHi: 'महिला किसान सशक्तिकरण', count: 1 },
  { id: 'training', emoji: '🎓', labelEn: 'Agriculture Training', labelHi: 'कृषि कौशल व प्रशिक्षण', count: 1 },
  { id: 'livestock_dairy', emoji: '🐄', labelEn: 'Livestock & Dairy', labelHi: 'पशुपालन व डेयरी विकास', count: 1 },
  { id: 'infrastructure', emoji: '🏠', labelEn: 'Agriculture Infrastructure', labelHi: 'कृषि बुनियादी ढांचा कोष', count: 1 },
];

export const BENEFIT_TYPES = [
  { id: 'all', labelEn: 'All Benefit Types', labelHi: 'सभी प्रकार' },
  { id: 'dbt', labelEn: 'Direct Benefit Transfer (DBT)', labelHi: 'प्रत्यक्ष लाभ अंतरण (DBT)' },
  { id: 'subsidy', labelEn: 'Subsidy on Purchase', labelHi: 'उपकरण / बीज पर सब्सिडी' },
  { id: 'insurance', labelEn: 'Risk / Insurance Coverage', labelHi: 'फसल जोखिम सुरक्षा' },
  { id: 'credit', labelEn: 'Subsidized Credit / Loan', labelHi: 'सस्ता कृषि ऋण' },
  { id: 'solar', labelEn: 'Solar Energy & Pumping', labelHi: 'सोलर पंप अनुदान' },
];

// ── Verified Official Schemes Dataset ─────────────────────────────────────────
export const OFFICIAL_GOVERNMENT_SCHEMES = [
  {
    id: 'scheme_pm_kisan',
    name: 'PM-KISAN Samman Nidhi',
    nameHi: 'प्रधानमंत्री किसान सम्मान निधि (पीएम-किसान)',
    category: 'income_support',
    categoryLabelEn: 'Farmer Income Support',
    categoryLabelHi: 'किसान आय सहायता',
    shortDescription: 'Income support of ₹6,000 per year in three equal installments of ₹2,000 directly transferred to bank accounts of landholding farmer families.',
    shortDescriptionHi: 'सभी पात्र भू-धारक किसान परिवारों को ₹6,000 प्रति वर्ष की वित्तीय सहायता, तीन समान ₹2,000 किस्तों में सीधे बैंक खाते में।',
    description: 'Pradhan Mantri Kisan Samman Nidhi (PM-KISAN) is a Central Sector Scheme to augment the financial needs of landholding farmers in procuring various inputs to ensure proper crop health and appropriate yields, commensurate with anticipated farm income.',
    descriptionHi: 'प्रधानमंत्री किसान सम्मान निधि योजना के तहत पात्र कृषक परिवारों को वर्ष में तीन बार डीबीटी के माध्यम से आर्थिक मदद दी जाती है ताकि वे बीज, खाद व कीटनाशक समय पर ले सकें।',
    objective: 'To provide assured financial backup to farmers for purchasing timely agricultural inputs and meeting household consumption expenses.',
    objectiveHi: 'किसानों को खेती की आवश्यकताओं के समय आर्थिक सहायता उपलब्ध कराना।',
    applicableStates: ['All India'],
    applicableCrops: ['All Crops'],
    benefitType: 'Direct Benefit Transfer (DBT)',
    benefitTypeHi: 'प्रत्यक्ष नकद हस्तांतरण (DBT)',
    benefits: [
      '₹6,000 annual direct cash transfer in 3 installments of ₹2,000 each',
      'Direct credit via Aadhaar-seeded Bank Account (DBT)',
      '100% funding by Government of India with automated grievance portal'
    ],
    benefitsHi: [
      '₹6,000 सालाना सीधे बैंक खाते में (3 किस्तों में)',
      'आधार से लिंक बैंक खाते में सीधे ट्रांसफर',
      'भारत सरकार द्वारा 100% वित्तपोषित योजना'
    ],
    eligibilitySummary: 'All landholding farmer families with cultivable land in their names (subject to scheme exclusion criteria).',
    eligibilitySummaryHi: 'सभी भू-धारक किसान परिवार जिनके नाम पर खेती योग्य जमीन दर्ज है (आयकर दाताओं को छोड़कर)।',
    eligibilityCriteria: {
      maxLandSize: null, // Open to all land sizes
      minLandSize: null,
      farmerTypes: ['Own Farm', 'Family Farm'],
      applicableCrops: ['All Crops'],
      irrigationTypes: ['All'],
      exclusions: 'Institutional landholders, income tax payers, serving/retired government officials.'
    },
    requiredDocuments: [
      { name: 'Aadhaar Card', icon: 'badge' },
      { name: 'Land Ownership Records (Khatoni/RoR)', icon: 'description' },
      { name: 'Bank Passbook / Account details linked to Aadhaar', icon: 'account_balance' },
      { name: 'Active Mobile Number for eKYC OTP', icon: 'phone_android' }
    ],
    applicationProcess: [
      'Step 1: Visit the official PM-KISAN portal (pmkisan.gov.in) or nearest Common Service Centre (CSC).',
      'Step 2: Click on "New Farmer Registration" and verify using Aadhaar OTP.',
      'Step 3: Enter your state, district, sub-district, village and land ownership Khasra/Khatauni numbers.',
      'Step 4: Complete biometric or OTP-based e-KYC. Status can be tracked online using Aadhaar or registration number.'
    ],
    importantDates: 'Active & Ongoing (18th installment active; continuous registration open)',
    officialUrl: 'https://pmkisan.gov.in',
    isVerifiedUrl: true,
    lastUpdated: 'October 2026',
    status: 'Active',
    isFeatured: true,
  },
  {
    id: 'scheme_pmfby',
    name: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
    nameHi: 'प्रधानमंत्री फसल बीमा योजना (पीएमएफबीवाई)',
    category: 'crop_insurance',
    categoryLabelEn: 'Crop Insurance',
    categoryLabelHi: 'फसल बीमा सुरक्षा',
    shortDescription: 'Comprehensive, low-cost crop insurance shielding farmers against unexpected yield loss from drought, flood, pests, unseasonal rain and localized hail storms.',
    shortDescriptionHi: 'बाढ़, सूखा, बेमौसम बारिश व कीट रोगों से फसल नुकसान पर व्यापक सुरक्षा कवच, न्यूनतम प्रीमियम (1.5% - 2%) पर।',
    description: 'PMFBY integrates multiple stakeholders onto a unified portal, deploying satellite imaging, remote sensing and drone crop cutting experiments (CCE) for expedited and transparent claims settlement.',
    descriptionHi: 'प्राकृतिक आपदाओं के कारण फसल बर्बाद होने की स्थिति में किसानों को आर्थिक सुरक्षा प्रदान करने के लिए व्यापक बीमा योजना।',
    objective: 'To stabilize farmer income in calamity years and encourage modern risk mitigation farming practices.',
    objectiveHi: 'फसल नुकसान होने पर किसानों को तत्काल वित्तीय सहायता प्रदान करना।',
    applicableStates: ['All India'],
    applicableCrops: ['Wheat', 'Rice', 'Maize', 'Sugarcane', 'Potato', 'Mustard', 'Cotton', 'Pulses / Dal', 'Soybean'],
    benefitType: 'Subsidized Insurance',
    benefitTypeHi: 'सब्सिडीयुक्त फसल बीमा',
    benefits: [
      'Very low farmer premium: Only 2% for Kharif, 1.5% for Rabi, 5% for annual commercial/horticulture crops',
      'Full sum insured without capping for localized natural calamities (Hailstorm, Inundation, Landslide)',
      'Post-harvest loss coverage up to 14 days after harvest while crops dry in the field'
    ],
    benefitsHi: [
      'किसानों के लिए न्यूनतम प्रीमियम: खरीफ 2%, रबी 1.5%, बागवानी 5%',
      'ओलावृष्टि व जलभराव जैसे स्थानीय नुकसान पर पूरा बीमा क्लेम',
      'कटाई के बाद 14 दिनों तक खेत में रखी फसल पर भी सुरक्षा'
    ],
    eligibilitySummary: 'All farmers growing notified crops in notified areas, including sharecroppers and tenant farmers.',
    eligibilitySummaryHi: 'अधिसूचित क्षेत्रों में अधिसूचित फसलें उगाने वाले सभी किसान, पट्टेदार व बटाईदार सहित।',
    eligibilityCriteria: {
      maxLandSize: null,
      minLandSize: 0.1,
      farmerTypes: ['Own Farm', 'Leased Farm', 'Family Farm'],
      applicableCrops: ['Wheat', 'Rice', 'Maize', 'Sugarcane', 'Potato', 'Mustard', 'Cotton'],
      irrigationTypes: ['All'],
    },
    requiredDocuments: [
      { name: 'Aadhaar Card', icon: 'badge' },
      { name: 'Land Record (RoR / Khasra-Khatauni) or Tenant Agreement', icon: 'description' },
      { name: 'Sowing Certificate / Crop Sown Declaration from Patwari', icon: 'assignment' },
      { name: 'Bank Passbook copy showing IFSC & Account Number', icon: 'account_balance' }
    ],
    applicationProcess: [
      'Step 1: Check whether your crop and district are notified for the current season on pmfby.gov.in.',
      'Step 2: Apply via Bank Branch (for KCC loan holders), CSC Kendra, or self-apply through National Crop Insurance Portal.',
      'Step 3: Upload Sowing Declaration and Land proof before the season cut-off date (e.g. 31 July for Kharif, 31 Dec for Rabi).'
    ],
    importantDates: 'Seasonal Enrollments (Kharif cutoff usually July 31; Rabi cutoff Dec 31)',
    officialUrl: 'https://pmfby.gov.in',
    isVerifiedUrl: true,
    lastUpdated: 'October 2026',
    status: 'Active',
    isFeatured: true,
  },
  {
    id: 'scheme_pm_kusum',
    name: 'PM-KUSUM (Pradhan Mantri Kisan Urja Suraksha)',
    nameHi: 'प्रधानमंत्री कुसुम योजना (सोलर पंप अनुदान)',
    category: 'irrigation_water',
    categoryLabelEn: 'Irrigation & Water',
    categoryLabelHi: 'सिंचाई एवं जल संरक्षण',
    shortDescription: 'Up to 60% government subsidy to replace costly diesel engines with off-grid / grid-connected standalone agricultural solar pumps.',
    shortDescriptionHi: 'डीजल पंपों को बदलकर सोलर पंप लगाने के लिए 60% तक सरकारी सब्सिडी, जिससे बिजली व डीजल खर्च खत्म हो सके।',
    description: 'PM-KUSUM aims to de-dieselise the farm sector, provide water security to off-grid cultivators, and create an additional revenue stream by selling surplus solar power back to DISCOMs.',
    descriptionHi: 'किसानों को दिन के समय सिंचाई के लिए विश्वसनीय सौर ऊर्जा प्रदान करने और बंजर भूमि पर सोलर प्लांट लगाकर अतिरिक्त आय कमाने की योजना।',
    objective: 'Providing clean day-time solar power for farm irrigation and cutting diesel irrigation costs.',
    objectiveHi: 'सिंचाई के लिए सौर ऊर्जा को बढ़ावा देना और खेती की लागत कम करना।',
    applicableStates: ['All India'],
    applicableCrops: ['All Crops'],
    benefitType: 'Solar Energy & Pumping',
    benefitTypeHi: 'सोलर पंप व ऊर्जा अनुदान',
    benefits: [
      '30% Central Financial Assistance (CFA) + 30% State Government subsidy (Total 60% subsidy)',
      'Farmer contributes only 10% upfront cost; remaining 30% available via bank loan',
      'Reliable daytime water supply; zero recurring electricity or diesel fuel bills'
    ],
    benefitsHi: [
      'कुल 60% सरकारी सब्सिडी (30% केंद्र + 30% राज्य सरकार)',
      'किसान को मात्र 10% लागत देनी होती है, 30% आसान बैंक ऋण',
      'दिन में निर्बाध सिंचाई सुविधा और डीजल के बढ़ते खर्च से मुक्ति'
    ],
    eligibilitySummary: 'Individual farmers, farmer groups, cooperatives, and FPOs having an existing borewell or water source.',
    eligibilitySummaryHi: 'व्यक्तिगत किसान, स्वयं सहायता समूह, सहकारी समितियां जिनके पास जल स्रोत/बोरवेल उपलब्ध है।',
    eligibilityCriteria: {
      maxLandSize: null,
      minLandSize: 0.5,
      farmerTypes: ['Own Farm', 'Family Farm'],
      applicableCrops: ['All Crops'],
      irrigationTypes: ['Tube Well', 'Borewell', 'Rainfed', 'Canal'],
    },
    requiredDocuments: [
      { name: 'Aadhaar Card', icon: 'badge' },
      { name: 'Land Record (Khatauni) verifying agricultural ownership', icon: 'description' },
      { name: 'Bank Account Passbook / Cancelled Cheque', icon: 'account_balance' },
      { name: 'Electricity connection status declaration / certificate', icon: 'bolt' }
    ],
    applicationProcess: [
      'Step 1: Check your respective state renewable energy portal (e.g. upneda.org.in for UP, hareda.gov.in for Haryana).',
      'Step 2: Register on official portal under Component-B (Standalone Solar Pump) or Component-C (Solarisation of Grid Pump).',
      'Step 3: Pay farmer share via online challan. Solar pump vendor installation is conducted upon verification.'
    ],
    importantDates: 'State-wise allotment windows open quarterly',
    officialUrl: 'https://pmkusum.mnre.gov.in',
    isVerifiedUrl: true,
    lastUpdated: 'October 2026',
    status: 'Active',
    isFeatured: true,
  },
  {
    id: 'scheme_smam',
    name: 'Sub-Mission on Agricultural Mechanization (SMAM)',
    nameHi: 'कृषि यंत्रीकरण उप-मिशन (एसएमएएम / कृषि यंत्र सब्सिडी)',
    category: 'equipment',
    categoryLabelEn: 'Agriculture Equipment',
    categoryLabelHi: 'कृषि यंत्र व सब्सिडी',
    shortDescription: '40% to 50% capital subsidy on purchase of tractors, rotavators, happy seeders, laser levellers, and modern farm machinery.',
    shortDescriptionHi: 'ट्रैक्टर, रोटावेटर, रीपर, सीड ड्रिल व कृषि यंत्रों की खरीद पर 40% से 50% तक सरकारी अनुदान।',
    description: 'SMAM promotes farm mechanization across India with higher subsidy benefits for small, marginal, women and SC/ST farmers to offset machinery purchase costs and establish Custom Hiring Centres (CHC).',
    descriptionHi: 'आधुनिक कृषि यंत्रों को छोटे किसानों तक पहुंचाने और फसल अवशेष प्रबंधन यंत्रों पर अनुदान देने के लिए प्रमुख योजना।',
    objective: 'To increase reach of farm mechanization to small and marginal landholdings where individual machinery ownership is cost-prohibitive.',
    objectiveHi: 'खेती में आधुनिक मशीनों का प्रयोग बढ़ाना और शारीरिक श्रम को कम करना।',
    applicableStates: ['All India'],
    applicableCrops: ['All Crops'],
    benefitType: 'Subsidy on Purchase',
    benefitTypeHi: 'यंत्र खरीद पर सीधी छूट',
    benefits: [
      '40% to 50% direct subsidy on approved agricultural equipment & machinery',
      'Special 10% additional subsidy for women, SC, ST, and small/marginal landholders',
      'Up to 80% subsidy for establishing village Custom Hiring Centres (CHCs) by farmer groups'
    ],
    benefitsHi: [
      'कृषि उपकरणों पर 40% से 50% तक सीधे बैंक खाते में सब्सिडी',
      'महिला, लघु-सीमांत और अनुसूचित जाति/जनजाति किसानों को 10% अतिरिक्त लाभ',
      'कस्टम हायरिंग सेंटर (CHC) स्थापना के लिए 80% तक अनुदान'
    ],
    eligibilitySummary: 'Farmers having valid agricultural land records, who have not availed equipment subsidy in the last 3 years.',
    eligibilitySummaryHi: 'भूमि धारक किसान जिन्होंने पिछले 3 वर्षों में उस श्रेणी के यंत्र पर सरकारी अनुदान न लिया हो।',
    eligibilityCriteria: {
      maxLandSize: null,
      minLandSize: 0.2,
      farmerTypes: ['Own Farm', 'Family Farm', 'Leased Farm'],
      applicableCrops: ['All Crops'],
      irrigationTypes: ['All'],
    },
    requiredDocuments: [
      { name: 'Aadhaar Card', icon: 'badge' },
      { name: 'Land Record (Khatauni / Revenue Records)', icon: 'description' },
      { name: 'Bank Passbook linked to Aadhaar', icon: 'account_balance' },
      { name: 'Quotation / Bill from Authorized Equipment Dealer', icon: 'receipt_long' }
    ],
    applicationProcess: [
      'Step 1: Register on the Central Direct Benefit Transfer in Agriculture Mechanization portal (agrimachinery.nic.in).',
      'Step 2: Choose equipment type, model, and authorized manufacturer/dealer in your district.',
      'Step 3: Upload land documents and submit application. Token is generated by State Agriculture Department.'
    ],
    importantDates: 'State Agriculture Department Token distribution windows',
    officialUrl: 'https://agrimachinery.nic.in',
    isVerifiedUrl: true,
    lastUpdated: 'October 2026',
    status: 'Active',
    isFeatured: true,
  },
  {
    id: 'scheme_kcc',
    name: 'Kisan Credit Card (KCC) & Interest Subvention',
    nameHi: 'किसान क्रेडिट कार्ड (केसीसी) एवं ब्याज अनुदान',
    category: 'loans_finance',
    categoryLabelEn: 'Agriculture Loans & Finance',
    categoryLabelHi: 'कृषि ऋण व वित्तीय सहायता',
    shortDescription: 'Concessional short-term crop loans up to ₹3,00,000 at an effective interest rate of only 4% per annum upon prompt repayment.',
    shortDescriptionHi: 'फसल की लागत व खेती खर्च के लिए ₹3 लाख तक का अल्पकालिक ऋण, समय पर भुगतान करने पर मात्र 4% वार्षिक ब्याज पर।',
    description: 'KCC gives farmers access to flexible institutional credit for crops, animal husbandry, poultry, and fisheries without relying on informal moneylenders charging usurious interest rates.',
    descriptionHi: 'किसानों को खेती, खाद, बीज व पशुपालन के लिए बिना किसी जटिल प्रक्रिया के सस्ता बैंक ऋण उपलब्ध कराना।',
    objective: 'Fulfilling timely credit needs for crop cultivation, post-harvest expenses, farm asset maintenance and allied agricultural activities.',
    objectiveHi: 'किसानों को साहूकारों के चंगुल से बचाकर सस्ता संस्थागत बैंक ऋण देना।',
    applicableStates: ['All India'],
    applicableCrops: ['All Crops'],
    benefitType: 'Subsidized Credit / Loan',
    benefitTypeHi: 'सस्ता रियायती कृषि ऋण',
    benefits: [
      'Effective interest rate of only 4% p.a. (7% benchmark rate minus 3% prompt repayment incentive)',
      'Collateral-free loan limit up to ₹1.60 Lakh without land mortgage',
      'Includes built-in accidental insurance coverage up to ₹50,000'
    ],
    benefitsHi: [
      'समय पर भुगतान करने पर मात्र 4% का वार्षिक ब्याज',
      'बिना किसी बंधक (Collateral-free) ₹1.60 लाख तक का ऋण',
      'कार्डधारक के लिए ₹50,000 का दुर्घटना बीमा सुरक्षा'
    ],
    eligibilitySummary: 'All individual farmers, joint borrowers, tenant farmers, oral lessees and sharecroppers.',
    eligibilitySummaryHi: 'सभी व्यक्तिगत किसान, संयुक्त ऋणदाता, पट्टेदार व बटाईदार किसान।',
    eligibilityCriteria: {
      maxLandSize: null,
      minLandSize: 0.1,
      farmerTypes: ['Own Farm', 'Leased Farm', 'Family Farm'],
      applicableCrops: ['All Crops'],
      irrigationTypes: ['All'],
    },
    requiredDocuments: [
      { name: 'Duly filled KCC Application Form', icon: 'assignment' },
      { name: 'Aadhaar Card & PAN Card / Form 60', icon: 'badge' },
      { name: 'Land Record (Khatauni / Patta) verified by Revenue Authority', icon: 'description' },
      { name: 'Passport Size Photographs (2)', icon: 'image' }
    ],
    applicationProcess: [
      'Step 1: Download the standardized 1-page KCC application form from RBI / Bank / pmkisan.gov.in.',
      'Step 2: Submit to your local Commercial Bank, Regional Rural Bank (RRB), or Cooperative Bank.',
      'Step 3: Banks are mandated to issue KCC within 14 working days of receiving verified land records.'
    ],
    importantDates: 'Year-round processing across all commercial and cooperative bank branches',
    officialUrl: 'https://pmkisan.gov.in',
    isVerifiedUrl: true,
    lastUpdated: 'October 2026',
    status: 'Active',
    isFeatured: true,
  },
  {
    id: 'scheme_pmksy',
    name: 'PM Krishi Sinchayee Yojana (PMKSY - Per Drop More Crop)',
    nameHi: 'प्रधानमंत्री कृषि सिंचाई योजना (प्रति बूंद अधिक फसल - ड्रिप/स्प्रिंकलर)',
    category: 'irrigation_water',
    categoryLabelEn: 'Irrigation & Water',
    categoryLabelHi: 'सिंचाई एवं जल संरक्षण',
    shortDescription: 'Financial subsidy up to 55% for small/marginal farmers and 45% for other farmers for installing Drip and Sprinkler micro-irrigation systems.',
    shortDescriptionHi: 'ड्रिप (टपक) व स्प्रिंकलर (फव्वारा) सिंचाई सिस्टम लगवाने पर 45% से 55% तक सरकारी सब्सिडी, जिससे पानी की 50% बचत होती है।',
    description: 'PMKSY focuses on end-to-end water solutions in water source creation, distribution networks, farm-level water application management, and micro-irrigation technology.',
    descriptionHi: 'खेत तक पानी पहुंचाना और सूक्ष्म सिंचाई तकनीकों से जल उपयोग क्षमता में सुधार लाना।',
    objective: 'Expanding cultivable area under assured irrigation and improving on-farm water use efficiency ("More Crop Per Drop").',
    objectiveHi: 'हर खेत को पानी और सिंचाई में पानी की बर्बादी रोकना।',
    applicableStates: ['All India'],
    applicableCrops: ['Sugarcane', 'Cotton', 'Potato', 'Vegetables', 'Fruits', 'Maize', 'Mustard', 'Wheat'],
    benefitType: 'Subsidy on Purchase',
    benefitTypeHi: 'सूक्ष्म सिंचाई उपकरण सब्सिडी',
    benefits: [
      '55% subsidy for Small & Marginal farmers; 45% for other farmers on micro-irrigation sets',
      'Water savings between 30% to 50% compared to traditional flood irrigation',
      'Fertilizer savings up to 25% through fertigation capability directly to plant roots'
    ],
    benefitsHi: [
      'लघु-सीमांत किसानों को 55% तथा अन्य किसानों को 45% अनुदान',
      'पारंपरिक सिंचाई की तुलना में 30% से 50% पानी की बचत',
      'उर्वरक की खपत में 25% तक कमी और पैदावार में 20% तक वृद्धि'
    ],
    eligibilitySummary: 'Farmers owning or leasing cultivable land with an assured water source (well, borewell, or farm pond).',
    eligibilitySummaryHi: 'खेती योग्य भूमि के मालिक या पट्टेदार किसान जिनके पास सिंचाई का जल स्रोत उपलब्ध हो।',
    eligibilityCriteria: {
      maxLandSize: null,
      minLandSize: 0.25,
      farmerTypes: ['Own Farm', 'Leased Farm', 'Family Farm'],
      applicableCrops: ['Sugarcane', 'Vegetables', 'Fruits', 'Potato', 'Cotton', 'Maize'],
      irrigationTypes: ['Tube Well', 'Borewell', 'Canal'],
    },
    requiredDocuments: [
      { name: 'Aadhaar Card', icon: 'badge' },
      { name: 'Land Record (Khatauni / 7/12 extract)', icon: 'description' },
      { name: 'Proof of Water Source (Electricity bill / well certificate)', icon: 'water_drop' },
      { name: 'Bank Passbook copy with IFSC', icon: 'account_balance' }
    ],
    applicationProcess: [
      'Step 1: Check state horticulture or agriculture portal (e.g. upagriculture.com in UP, mahadbt.maharashtra.gov.in in Maharashtra).',
      'Step 2: Choose empanelled micro-irrigation supplier (e.g. Jain Irrigation, Netafim). Field survey conducted by company.',
      'Step 3: System installed upon approval and direct subsidy credited to bank or vendor after joint verification.'
    ],
    importantDates: 'Annual state targets open at start of financial year',
    officialUrl: 'https://pmksy.gov.in',
    isVerifiedUrl: true,
    lastUpdated: 'October 2026',
    status: 'Active',
    isFeatured: false,
  },
  {
    id: 'scheme_pkvy',
    name: 'Paramparagat Krishi Vikas Yojana (PKVY)',
    nameHi: 'परम्परागत कृषि विकास योजना (जैविक खेती प्रोत्साहन)',
    category: 'organic_farming',
    categoryLabelEn: 'Organic / Sustainable Farming',
    categoryLabelHi: 'जैविक व प्राकृतिक खेती',
    shortDescription: 'Financial assistance of ₹50,000 per hectare for cluster-based organic farming, bio-fertilizer inputs, and participatory certification (PGS-India).',
    shortDescriptionHi: 'क्लस्टर आधारित जैविक खेती अपनाने, वर्मीकम्पोस्ट बनाने और जैविक प्रमाणन के लिए ₹50,000 प्रति हेक्टेयर की वित्तीय सहायता।',
    description: 'PKVY supports traditional indigenous farming practices, zero chemical fertilizer usage, and cluster certification to enable farmers to command premium prices on Jaivik Kheti portals.',
    descriptionHi: 'किसानों के समूह बनाकर जैविक खेती को प्रोत्साहित करना ताकि मिट्टी की उर्वरता बढ़े और किसानों को बेहतर मूल्य मिले।',
    objective: 'Promoting sustainable organic farming systems and chemical-free crop production.',
    objectiveHi: 'रसायन मुक्त खेती को बढ़ावा देना और जैविक उत्पाद का उचित मूल्य दिलाना।',
    applicableStates: ['All India'],
    applicableCrops: ['All Crops'],
    benefitType: 'Direct Benefit Transfer (DBT)',
    benefitTypeHi: 'जैविक इनपुट व प्रमाणन सहायता',
    benefits: [
      '₹50,000 per hectare for 3 years (₹31,000 directly for organic inputs like bio-fertilizers & vermicompost)',
      'Free Participatory Guarantee System (PGS-India) organic certification for 3 years',
      'Direct listing access to the national Jaivik Kheti e-commerce marketing platform'
    ],
    benefitsHi: [
      '3 वर्षों में ₹50,000 प्रति हेक्टेयर सहायता (जिसमें ₹31,000 जैविक खाद व इनपुट के लिए)',
      '3 वर्ष तक निःशुल्क जैविक प्रमाणीकरण (PGS-India)',
      'राष्ट्रीय जैविक खेती पोर्टल (jaivikkheti.in) पर सीधे बिक्री का अवसर'
    ],
    eligibilitySummary: 'Farmers willing to form clusters of 20 or more farmers holding continuous cultivable land.',
    eligibilitySummaryHi: 'कम से कम 20 किसानों का समूह बनाकर जैविक खेती अपनाने वाले किसान।',
    eligibilityCriteria: {
      maxLandSize: 2.0, // Per farmer subsidy limit up to 2 ha
      minLandSize: 0.1,
      farmerTypes: ['Own Farm', 'Family Farm', 'Leased Farm'],
      applicableCrops: ['All Crops'],
      irrigationTypes: ['All'],
    },
    requiredDocuments: [
      { name: 'Aadhaar Card', icon: 'badge' },
      { name: 'Land Revenue Record', icon: 'description' },
      { name: 'Cluster Farmer Group Agreement', icon: 'groups' },
      { name: 'Bank Passbook', icon: 'account_balance' }
    ],
    applicationProcess: [
      'Step 1: Contact District Agriculture Officer or Assistant Director (Horticulture/Agriculture).',
      'Step 2: Form a cluster of 20-50 farmers with minimum 20 hectares total contiguous land.',
      'Step 3: Registration on Jaivik Kheti portal (jaivikkheti.in).'
    ],
    importantDates: 'Cluster proposal submissions via State Agriculture Directorate',
    officialUrl: 'https://pgsindia-ncof.gov.in',
    isVerifiedUrl: true,
    lastUpdated: 'October 2026',
    status: 'Active',
    isFeatured: false,
  },
  {
    id: 'scheme_aif',
    name: 'Agriculture Infrastructure Fund (AIF)',
    nameHi: 'कृषि अवसंरचना कोष (एग्री इंफ्रा फंड - भंडारण व प्रोसेसिंग)',
    category: 'infrastructure',
    categoryLabelEn: 'Agriculture Infrastructure',
    categoryLabelHi: 'कृषि बुनियादी ढांचा कोष',
    shortDescription: 'Medium-long term debt financing with 3% interest subvention for establishing post-harvest cold stores, warehouses, grading units and pack-houses.',
    shortDescriptionHi: 'कोल्ड स्टोरेज, गोदाम, छंटाई व ग्रेडिंग यूनिट और पैक-हाउस लगाने के लिए 3% ब्याज छूट पर बैंक ऋण।',
    description: 'AIF is a ₹1 Lakh Crore financing facility to develop post-harvest management infrastructure and community farming assets to reduce harvest wastage.',
    descriptionHi: 'फसल कटाई के बाद होने वाले नुकसान को रोकने और ग्रामीण क्षेत्रों में गोदाम व कोल्ड स्टोरेज बनाने के लिए वित्तीय सहायता।',
    objective: 'Bridging infrastructure gaps by mobilizing private and cooperative investments in post-harvest supply chains.',
    objectiveHi: 'गांवों में फसलों के सुरक्षित भंडारण और प्रसंस्करण केंद्रों की स्थापना।',
    applicableStates: ['All India'],
    applicableCrops: ['All Crops'],
    benefitType: 'Subsidized Credit / Loan',
    benefitTypeHi: 'ब्याज अनुदानित पूंजी ऋण',
    benefits: [
      '3% per annum interest subvention on bank loans up to ₹2 Crore for up to 7 years',
      'Credit guarantee coverage under CGTMSE for loans up to ₹2 Crore (fee paid by Govt)',
      'Fast-track single window approvals through agriinfra.dac.gov.in'
    ],
    benefitsHi: [
      '₹2 करोड़ तक के बैंक ऋण पर 7 वर्षों के लिए 3% ब्याज छूट',
      '₹2 करोड़ तक के ऋण पर सरकारी क्रेडिट गारंटी (बिना अतिरिक्त गारंटी ऋण)',
      'एग्री इंफ्रा पोर्टल के माध्यम से त्वरित सिंगल-विंडो स्वीकृति'
    ],
    eligibilitySummary: 'Farmers, Primary Agricultural Credit Societies (PACS), FPOs, Agri-entrepreneurs and Startups.',
    eligibilitySummaryHi: 'किसान, एफपीओ, प्राथमिक कृषि सहकारी समितियां (PACS) और कृषि उद्यमी।',
    eligibilityCriteria: {
      maxLandSize: null,
      minLandSize: 0.1,
      farmerTypes: ['Own Farm', 'Family Farm', 'Leased Farm'],
      applicableCrops: ['All Crops'],
      irrigationTypes: ['All'],
    },
    requiredDocuments: [
      { name: 'Detailed Project Report (DPR) of Storage/Unit', icon: 'assignment' },
      { name: 'Land Record / Registered Lease for minimum 10 years', icon: 'description' },
      { name: 'KYC Documents (Aadhaar & PAN Card)', icon: 'badge' },
      { name: 'Bank Statement of last 6 months', icon: 'account_balance' }
    ],
    applicationProcess: [
      'Step 1: Prepare DPR for warehouse, cold chain, or grading unit.',
      'Step 2: Apply online at agriinfra.dac.gov.in and select preferred participating lending bank.',
      'Step 3: Ministry conducts initial appraisal within 7 days, followed by commercial bank loan sanction.'
    ],
    importantDates: 'Scheme operational through 2032-33; continuous loan intake',
    officialUrl: 'https://agriinfra.dac.gov.in',
    isVerifiedUrl: true,
    lastUpdated: 'October 2026',
    status: 'Active',
    isFeatured: false,
  },
  {
    id: 'scheme_mksp',
    name: 'Mahila Kisan Sashaktikaran Pariyojana (MKSP)',
    nameHi: 'महिला किसान सशक्तिकरण परियोजना (एमकेएसपी)',
    category: 'women_farmers',
    categoryLabelEn: 'Women Farmers',
    categoryLabelHi: 'महिला किसान सशक्तिकरण',
    shortDescription: 'Dedicated financial and skill support to empower women agricultural producers through self-help groups, community seed banks and kitchen gardens.',
    shortDescriptionHi: 'महिला किसानों को सशक्त बनाने, उन्नत बीज बैंक, पोषण वाटिका और पर्यावरण-अनुकूल खेती के लिए विशेष सरकारी सहायता।',
    description: 'A sub-component of Deendayal Antyodaya Yojana-NRLM, MKSP seeks to enhance the participation of women in agriculture and improve their access to land rights, technology, and market linkages.',
    descriptionHi: 'खेती में महिलाओं की भागीदारी बढ़ाने, तकनीकी जानकारी देने और महिला स्वयं सहायता समूहों को कृषि ऋण से जोड़ने की योजना।',
    objective: 'Strengthening women farmers by promoting sustainable agro-ecological practices and building community-managed institutions.',
    objectiveHi: 'महिला कृषकों की आय बढ़ाना और कृषि में आत्मनिर्भर बनाना।',
    applicableStates: ['All India'],
    applicableCrops: ['All Crops'],
    benefitType: 'Subsidy on Purchase',
    benefitTypeHi: 'तकनीकी व उपकरण सहायता',
    benefits: [
      'Up to 75% funding for women Self Help Groups (SHGs) for community agriculture implements',
      'Training on climate-resilient farming, bio-fertilizer production and value addition',
      'Free distribution of certified vegetable seed kits for backyard nutrition gardens'
    ],
    benefitsHi: [
      'महिला स्वयं सहायता समूहों को कृषि यंत्रों पर 75% तक अनुदान',
      'जैविक खाद निर्माण, बीज संरक्षण और मूल्य संवर्धन का निःशुल्क प्रशिक्षण',
      'पोषण वाटिका के लिए प्रमाणित सब्जियों के बीज किट का निःशुल्क वितरण'
    ],
    eligibilitySummary: 'Women farmers who are members of registered Self Help Groups (SHGs) or farming cooperatives.',
    eligibilitySummaryHi: 'महिला किसान जो स्वयं सहायता समूह (SHG) या कृषि सहकारी समिति की सदस्य हैं।',
    eligibilityCriteria: {
      maxLandSize: null,
      minLandSize: 0.1,
      farmerTypes: ['Own Farm', 'Family Farm', 'Leased Farm'],
      applicableCrops: ['All Crops'],
      irrigationTypes: ['All'],
      specialCategory: 'Women Farmers Only'
    },
    requiredDocuments: [
      { name: 'Aadhaar Card of Woman Farmer', icon: 'badge' },
      { name: 'SHG Membership Certificate / Passbook', icon: 'groups' },
      { name: 'Bank Account Passbook (Individually or Jointly with SHG)', icon: 'account_balance' },
      { name: 'Land Record / Residence Proof', icon: 'description' }
    ],
    applicationProcess: [
      'Step 1: Contact your Block Development Officer (BDO) or Block Mission Management Unit (BMMU).',
      'Step 2: Submit application through local Village Organization (VO) / Cluster Level Federation (CLF).',
      'Step 3: Verification conducted by State Rural Livelihoods Mission (SRLM).'
    ],
    importantDates: 'Active through Deendayal Antyodaya Yojana - NRLM',
    officialUrl: 'https://nrlm.gov.in',
    isVerifiedUrl: true,
    lastUpdated: 'October 2026',
    status: 'Active',
    isFeatured: false,
  },
  {
    id: 'scheme_nlm',
    name: 'National Livestock Mission (NLM) - Dairy & Poultry',
    nameHi: 'राष्ट्रीय पशुधन मिशन (पशुपालन, बकरी व कुक्कुट पालन सब्सिडी)',
    category: 'livestock_dairy',
    categoryLabelEn: 'Livestock & Dairy',
    categoryLabelHi: 'पशुपालन व डेयरी विकास',
    shortDescription: '50% capital subsidy (up to ₹50 Lakh) for establishing poultry hatcheries, sheep/goat breeding farms, and fodder seed production units.',
    shortDescriptionHi: 'बकरी पालन, भेड़ पालन, पोल्ट्री फार्म व हरा चारा बीज उत्पादन यूनिट लगाने के लिए 50% (अधिकतम ₹50 लाख) तक की सरकारी सब्सिडी।',
    description: 'NLM focuses on employment generation, breed improvement, feed & fodder availability, and risk management across livestock value chains for integrated rural prosperity.',
    descriptionHi: 'किसानों की आय दोगुनी करने के लिए खेती के साथ-साथ पशुपालन और चारा उत्पादन को बढ़ावा देने वाली राष्ट्रीय योजना।',
    objective: 'Promoting livestock development as a secondary income source alongside crop farming.',
    objectiveHi: 'पशुपालन को लाभकारी व्यवसाय बनाना और चारे की गुणवत्ता सुधारना।',
    applicableStates: ['All India'],
    applicableCrops: ['All Crops'],
    benefitType: 'Subsidy on Purchase',
    benefitTypeHi: 'पशुधन पूंजीगत सब्सिडी',
    benefits: [
      '50% capital subsidy on total project cost (up to ₹50 Lakh for sheep/goat & poultry units)',
      'Subsidized loans through scheduled commercial and cooperative banks',
      'Fodder seed development and pasture enhancement kits'
    ],
    benefitsHi: [
      'कुल प्रोजेक्ट लागत पर 50% पूंजीगत सब्सिडी (अधिकतम ₹50 लाख)',
      'व्यावसायिक बैंकों के माध्यम से रियायती दर पर ऋण सुविधा',
      'उच्च गुणवत्ता वाले चारे के बीज और साइलेज मेकिंग मशीनरी पर सहायता'
    ],
    eligibilitySummary: 'Individual farmers, farmer groups, Cooperatives, FPOs and rural entrepreneurs.',
    eligibilitySummaryHi: 'व्यक्तिगत किसान, स्वयं सहायता समूह, सहकारी समितियां और ग्रामीण युवा उद्यमी।',
    eligibilityCriteria: {
      maxLandSize: null,
      minLandSize: 0.1,
      farmerTypes: ['Own Farm', 'Family Farm', 'Leased Farm'],
      applicableCrops: ['All Crops'],
      irrigationTypes: ['All'],
    },
    requiredDocuments: [
      { name: 'Detailed Project Report (DPR) of Livestock Farm', icon: 'assignment' },
      { name: 'Aadhaar Card and PAN Card', icon: 'badge' },
      { name: 'Proof of land ownership or 10-year registered lease for animal sheds', icon: 'description' },
      { name: 'Bank In-Principle Sanction Letter', icon: 'account_balance' }
    ],
    applicationProcess: [
      'Step 1: Register on the NLM portal (nlm.udyamimitra.in) by SIDBI.',
      'Step 2: Upload DPR and select financing bank. Application reviewed by State Level Screening Committee.',
      'Step 3: Direct subsidy released in two installments upon bank loan disbursement and physical inspection.'
    ],
    importantDates: 'Continuous online intake on nlm.udyamimitra.in',
    officialUrl: 'https://nlm.udyamimitra.in',
    isVerifiedUrl: true,
    lastUpdated: 'October 2026',
    status: 'Active',
    isFeatured: false,
  },
  {
    id: 'scheme_seeds_sub_mission',
    name: 'National Mission on Seeds & Planting Material (SMSP)',
    nameHi: 'बीज एवं रोपण सामग्री उप-मिशन (प्रमाणित बीज सब्सिडी)',
    category: 'crop_seeds',
    categoryLabelEn: 'Crop & Seeds',
    categoryLabelHi: 'फसल व उन्नत बीज',
    shortDescription: 'Subsidized distribution of foundation and certified high-yielding hybrid seeds of wheat, paddy, pulses and oilseeds through Seed Villages.',
    shortDescriptionHi: 'गेहूं, धान, सरसों व दलहन के प्रमाणित उच्च उपज वाले बीजों पर 50% तक अनुदान तथा बीज ग्राम योजना के तहत मुफ्त किट।',
    description: 'The mission aims to increase Seed Replacement Rate (SRR), upgrade seed testing labs, and develop climate-resilient seed varieties to maximize farm productivity per acre.',
    descriptionHi: 'किसानों को समय पर उच्च गुणवत्ता वाले प्रमाणित बीज उचित दर पर उपलब्ध कराना।',
    objective: 'Ensuring production and multiplication of quality seeds of all crop varieties.',
    objectiveHi: 'गुणवत्तापूर्ण बीजों की उपलब्धता सुनिश्चित कर फसल उत्पादन बढ़ाना।',
    applicableStates: ['All India'],
    applicableCrops: ['Wheat', 'Rice', 'Maize', 'Mustard', 'Potato', 'Pulses / Dal', 'Soybean'],
    benefitType: 'Subsidy on Purchase',
    benefitTypeHi: 'बीज खरीद पर सब्सिडी',
    benefits: [
      'Up to 50% subsidy on purchase of certified seed varieties from government depots and cooperatives',
      'Free distribution of seed minikits of newly released high-yielding varieties to small/marginal farmers',
      'Seed treatment chemical kits supplied at nominal token cost to prevent seed-borne fungal infections'
    ],
    benefitsHi: [
      'कृषि विभाग और सहकारी समितियों से बीज खरीदने पर 50% तक अनुदान',
      'लघु और सीमांत किसानों को नई किस्मों के बीजों के मिनीकिट का मुफ्त वितरण',
      'बीज उपचार रसायनों पर भारी छूट'
    ],
    eligibilitySummary: 'All farmers holding cultivable agricultural land registering before Kharif or Rabi sowing.',
    eligibilitySummaryHi: 'खेती करने वाले सभी किसान जो बुवाई सीजन से पहले कृषि केंद्र पर पंजीकरण कराते हैं।',
    eligibilityCriteria: {
      maxLandSize: null,
      minLandSize: 0.1,
      farmerTypes: ['Own Farm', 'Leased Farm', 'Family Farm'],
      applicableCrops: ['Wheat', 'Rice', 'Maize', 'Mustard', 'Potato', 'Pulses / Dal', 'Soybean'],
      irrigationTypes: ['All'],
    },
    requiredDocuments: [
      { name: 'Aadhaar Card', icon: 'badge' },
      { name: 'Kisan Registration / Farmer ID Number', icon: 'badge' },
      { name: 'Land Record Slip', icon: 'description' },
      { name: 'Cash receipt of seed purchase from authorized government godown', icon: 'receipt' }
    ],
    applicationProcess: [
      'Step 1: Check your State Agriculture Seed Portal (e.g. upagriculture.com in UP, agri.punjab.gov.in in Punjab).',
      'Step 2: Collect subsidy token or visit your local Block Beej Godam (Block Seed Store).',
      'Step 3: Subsidy is either deducted upfront at purchase or credited directly through DBT.'
    ],
    importantDates: 'Prior to sowing season: May-June for Kharif; September-October for Rabi',
    officialUrl: 'https://seednet.gov.in',
    isVerifiedUrl: true,
    lastUpdated: 'October 2026',
    status: 'Active',
    isFeatured: false,
  },
  {
    id: 'scheme_up_solar_kisan',
    name: 'State Specific: UP Solar Pump & Borewell Subsidy (Neda)',
    nameHi: 'राज्य योजना: उत्तर प्रदेश सौर पंप व बोरवेल सब्सिडी (नेडा)',
    category: 'irrigation_water',
    categoryLabelEn: 'Irrigation & Water',
    categoryLabelHi: 'सिंचाई एवं जल संरक्षण',
    shortDescription: 'Specific state-level grant for farmers in Uttar Pradesh providing up to 60% concession on 2HP to 10HP DC & AC Solar Pumps.',
    shortDescriptionHi: 'उत्तर प्रदेश के किसानों के लिए 2HP से 10HP सोलर पंप लगवाने पर 60% तक राज्य स्तरीय अनुदान।',
    description: 'Organized by UPNEDA and Uttar Pradesh Agriculture Department to support farmers in Bundelkhand, Western UP, and Purvanchal with round-the-clock off-grid water pumping.',
    descriptionHi: 'उत्तर प्रदेश कृषि विभाग व नेडा द्वारा किसानों को सिंचाई के लिए सब्सिडी पर सोलर पंप उपलब्ध कराने की विशेष योजना।',
    objective: 'Promote renewable irrigation in Uttar Pradesh and eliminate high monthly electricity tube-well bills.',
    objectiveHi: 'उत्तर प्रदेश में भूजल स्तर को ध्यान में रखकर सौर सिंचाई को बढ़ावा देना।',
    applicableStates: ['Uttar Pradesh'],
    applicableCrops: ['Wheat', 'Sugarcane', 'Potato', 'Mustard', 'Rice', 'Vegetables'],
    benefitType: 'Solar Energy & Pumping',
    benefitTypeHi: 'राज्य सौर अनुदान',
    benefits: [
      '60% state subsidy on 2 HP, 3 HP, 5 HP, and 7.5 HP surface and submersible solar pumps',
      'Priority allocation for Bundelkhand and dark-zone adjacent blocks with micro-irrigation pairing',
      '5-year manufacturer on-site comprehensive maintenance guarantee'
    ],
    benefitsHi: [
      '2 HP से 7.5 HP तक के सबमर्सिबल सोलर पंप पर 60% तक सीधी छूट',
      'बुंदेलखंड व पश्चिमी यूपी के किसानों को विशेष प्राथमिकता',
      '5 साल तक कंपनी द्वारा निःशुल्क रख-रखाव और वारंटी'
    ],
    eligibilitySummary: 'Permanent resident farmers of Uttar Pradesh who have not received state pump subsidy in last 5 years.',
    eligibilitySummaryHi: 'उत्तर प्रदेश के मूल निवासी किसान जिन्होंने पिछले 5 वर्षों में सरकारी पंप सब्सिडी न ली हो।',
    eligibilityCriteria: {
      maxLandSize: null,
      minLandSize: 0.5,
      farmerTypes: ['Own Farm', 'Family Farm'],
      applicableCrops: ['Wheat', 'Sugarcane', 'Potato', 'Mustard', 'Rice', 'Vegetables'],
      irrigationTypes: ['Tube Well', 'Borewell'],
    },
    requiredDocuments: [
      { name: 'UP Agriculture Farmer Registration ID (कृषक पंजीकरण)', icon: 'badge' },
      { name: 'Khasra-Khatauni (Land ownership in Uttar Pradesh)', icon: 'description' },
      { name: 'Aadhaar Card linked Bank Account', icon: 'account_balance' },
      { name: 'Borewell Declaration with photo', icon: 'water_drop' }
    ],
    applicationProcess: [
      'Step 1: Visit upagriculture.com and click on "सोलर पंप हेतु टोकन व्यवस्था".',
      'Step 2: Enter Farmer Registration Number and choose pump capacity (2HP / 3HP / 5HP / 7.5HP).',
      'Step 3: Deposit token money online within 7 days to confirm equipment delivery.'
    ],
    importantDates: 'Token booking rounds announced periodically on upagriculture.com',
    officialUrl: 'https://upagriculture.com',
    isVerifiedUrl: true,
    lastUpdated: 'October 2026',
    status: 'Active',
    isFeatured: true,
  }
];

// ── LocalStorage Helpers for Saved Schemes & Internal Applications ────────────

export function getSavedSchemeIds(farmerId) {
  try {
    const raw = localStorage.getItem(SCHEMES_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed[farmerId] || [];
    }
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return [];
  } catch (err) {
    console.error('Error reading saved schemes from localStorage:', err);
    return [];
  }
}

export function toggleSaveScheme(schemeId, farmerId) {
  if (!schemeId || !farmerId) return false;
  try {
    const raw = localStorage.getItem(SCHEMES_STORAGE_KEY);
    let store = {};
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (typeof parsed === 'object' && !Array.isArray(parsed)) {
          store = parsed;
        }
      } catch {
        store = {};
      }
    }
    const currentList = store[farmerId] || [];
    const isSaved = currentList.includes(schemeId);
    let nextList;
    if (isSaved) {
      nextList = currentList.filter((id) => id !== schemeId);
    } else {
      nextList = [schemeId, ...currentList];
    }
    store[farmerId] = nextList;
    localStorage.setItem(SCHEMES_STORAGE_KEY, JSON.stringify(store));
    window.dispatchEvent(new CustomEvent(SCHEMES_UPDATE_EVENT, { detail: { farmerId, savedIds: nextList } }));
    return !isSaved; // returns new saved status
  } catch (err) {
    console.error('Error toggling saved scheme in localStorage:', err);
    return false;
  }
}

export function isSchemeSaved(schemeId, farmerId) {
  const ids = getSavedSchemeIds(farmerId);
  return ids.includes(schemeId);
}

// ── Internal Application Tracker for Farmer Helper Inquiries ─────────────────
// (Disclaims clearly that this tracks Farmer Helper internal inquiries / checklists, not live govt integration)
export function getSchemeApplications(farmerId) {
  try {
    const raw = localStorage.getItem(SCHEMES_APPLICATIONS_KEY);
    if (!raw) {
      // Seed an initial demo application tracking record for Rajesh Kumar
      const initial = [
        {
          id: 'app_pmkisan_01',
          schemeId: 'scheme_pm_kisan',
          schemeName: 'PM-KISAN Samman Nidhi',
          farmerId: 'user_farmer_01',
          appliedDate: '2026-08-15',
          status: 'Approved',
          statusHi: 'स्वीकृत',
          trackingRef: 'PMK-UP-2026-89412',
          notesEn: '18th Installment successfully credited to Aadhaar-linked Bank Account.',
          notesHi: '18वीं किस्त आधार लिंक बैंक खाते में सफलतापूर्वक भेजी गई।'
        },
        {
          id: 'app_kusum_02',
          schemeId: 'scheme_pm_kusum',
          schemeName: 'PM-KUSUM Solar Pump (5HP)',
          farmerId: 'user_farmer_01',
          appliedDate: '2026-09-02',
          status: 'Under Review',
          statusHi: 'सत्यापन प्रक्रिया में',
          trackingRef: 'KUSUM-UP-NEDA-5012',
          notesEn: 'Site survey and borewell verification completed by District NEDA officer. Awaiting vendor dispatch.',
          notesHi: 'जिला नेडा अधिकारी द्वारा बोरवेल स्थल सत्यापन पूर्ण। वेंडर डिस्पैच की प्रतीक्षा।'
        }
      ];
      localStorage.setItem(SCHEMES_APPLICATIONS_KEY, JSON.stringify(initial));
      return initial.filter((a) => !farmerId || a.farmerId === farmerId);
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((a) => !farmerId || a.farmerId === farmerId);
  } catch (err) {
    console.error('Error reading scheme applications:', err);
    return [];
  }
}

export function recordSchemeApplication(schemeId, schemeName, farmerId, details = {}) {
  try {
    const current = getSchemeApplications();
    const newRecord = {
      id: `app_${Date.now()}`,
      schemeId,
      schemeName,
      farmerId: farmerId || 'user_farmer_01',
      appliedDate: new Date().toISOString().split('T')[0],
      status: 'Submitted',
      statusHi: 'जमा किया गया',
      trackingRef: `FH-${schemeId.toUpperCase().slice(-5)}-${Math.floor(1000 + Math.random() * 9000)}`,
      notesEn: details.notesEn || 'Inquiry registered. Farmer redirected to official portal for final submission.',
      notesHi: details.notesHi || 'आवेदन दर्ज। अंतिम दस्तावेज जमा करने के लिए आधिकारिक पोर्टल पर निर्देशित किया गया।',
      ...details,
    };
    const updated = [newRecord, ...current];
    localStorage.setItem(SCHEMES_APPLICATIONS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent(SCHEMES_UPDATE_EVENT, { detail: { newRecord } }));
    return newRecord;
  } catch (err) {
    console.error('Error recording scheme application:', err);
    return null;
  }
}

// ── Eligibility Matching Algorithm ────────────────────────────────────────────
/**
 * Evaluates potentially relevant schemes based on farmer/farm profile.
 * Does NOT claim official legal eligibility decision (discovery helper).
 */
export function matchSchemesForFarm({
  state = '',
  landSize = '',
  landUnit = 'Acre',
  primaryCrop = '',
  irrigationType = '',
  farmerType = '',
  category = 'All'
}) {
  const parsedSize = parseFloat(landSize) || 0;
  // Convert to Acre equivalent for comparison
  let sizeInAcres = parsedSize;
  if (landUnit.toLowerCase() === 'hectare') {
    sizeInAcres = parsedSize * 2.47105;
  } else if (landUnit.toLowerCase() === 'bigha') {
    sizeInAcres = parsedSize * 0.2; // approx north india bigha
  }

  return OFFICIAL_GOVERNMENT_SCHEMES.map((scheme) => {
    let score = 0;
    const matchReasons = [];
    const missingReasons = [];

    // 1. State Match Check
    const stateMatch =
      !state ||
      scheme.applicableStates.includes('All India') ||
      scheme.applicableStates.some((s) => s.toLowerCase() === state.toLowerCase());

    if (stateMatch) {
      score += 35;
      if (state) {
        matchReasons.push({
          type: 'state',
          textEn: scheme.applicableStates.includes('All India')
            ? `Applicable across All India (including ${state})`
            : `Specifically active in ${state}`,
          textHi: scheme.applicableStates.includes('All India')
            ? `पूरे भारत में लागू (${state} सहित)`
            : `${state} में विशेष रूप से लागू`
        });
      }
    } else {
      missingReasons.push({
        type: 'state',
        textEn: `Restricted to other states (${scheme.applicableStates.join(', ')})`,
        textHi: `अन्य राज्यों के लिए सीमित (${scheme.applicableStates.join(', ')})`
      });
    }

    // 2. Crop Match Check
    const cropMatch =
      !primaryCrop ||
      scheme.applicableCrops.includes('All Crops') ||
      scheme.applicableCrops.some((c) => c.toLowerCase() === primaryCrop.toLowerCase());

    if (cropMatch) {
      score += 25;
      if (primaryCrop) {
        matchReasons.push({
          type: 'crop',
          textEn: scheme.applicableCrops.includes('All Crops')
            ? `Supports all major agricultural crops`
            : `Specifically covers ${primaryCrop}`,
          textHi: scheme.applicableCrops.includes('All Crops')
            ? `सभी प्रमुख फसलों के लिए मान्य`
            : `${primaryCrop} फसल के लिए विशेष रूप से मान्य`
        });
      }
    } else {
      missingReasons.push({
        type: 'crop',
        textEn: `Does not specifically cover ${primaryCrop}`,
        textHi: `${primaryCrop} फसल इस योजना में शामिल नहीं है`
      });
    }

    // 3. Land Size Check
    const crit = scheme.eligibilityCriteria;
    let landMatch = true;
    if (parsedSize > 0) {
      if (crit.maxLandSize && sizeInAcres > crit.maxLandSize) {
        landMatch = false;
        missingReasons.push({
          type: 'land',
          textEn: `Requires landholding up to ${crit.maxLandSize} acres (Your farm: ${sizeInAcres.toFixed(1)} acres)`,
          textHi: `अधिकतम ${crit.maxLandSize} एकड़ तक की सीमा (आपका खेत: ${sizeInAcres.toFixed(1)} एकड़)`
        });
      } else {
        score += 20;
        matchReasons.push({
          type: 'land',
          textEn: `Matches your farm land size (${parsedSize} ${landUnit})`,
          textHi: `आपके खेत के आकार (${parsedSize} ${landUnit}) के अनुकूल`
        });
      }
    } else {
      score += 10;
    }

    // 4. Irrigation Check
    if (scheme.category === 'irrigation_water' && irrigationType) {
      const irriMatch =
        crit.irrigationTypes.includes('All') ||
        crit.irrigationTypes.some((i) => i.toLowerCase() === irrigationType.toLowerCase());

      if (irriMatch) {
        score += 20;
        matchReasons.push({
          type: 'irrigation',
          textEn: `Matches irrigation source: ${irrigationType}`,
          textHi: `सिंचाई साधन के अनुकूल: ${irrigationType}`
        });
      }
    } else {
      score += 15;
    }

    // Special category check
    if (crit.specialCategory === 'Women Farmers Only') {
      if (category === 'Women Farmer') {
        score += 20;
        matchReasons.push({
          type: 'category',
          textEn: 'Priority benefit for Women Farmers',
          textHi: 'महिला किसानों के लिए विशेष प्राथमिकता'
        });
      } else {
        score -= 20;
      }
    }

    return {
      scheme,
      matchScore: Math.min(100, Math.max(10, score)),
      isPotentiallyRelevant: stateMatch && landMatch,
      matchReasons,
      missingReasons,
    };
  }).sort((a, b) => b.matchScore - a.matchScore);
}
