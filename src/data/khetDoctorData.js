// ====================================================================
// Mera Khet Ka Doctor — Mock Data
// All data is API-ready: replace these exports with API call results
// when the backend is ready.
// ====================================================================

export const cropOptions = [
  { value: 'wheat',     labelEn: 'Wheat',     labelHi: 'गेहूं',   icon: 'grass'    },
  { value: 'rice',      labelEn: 'Rice / Paddy', labelHi: 'धान',  icon: 'nutrition' },
  { value: 'maize',     labelEn: 'Maize',     labelHi: 'मक्का',  icon: 'grass'    },
  { value: 'tomato',    labelEn: 'Tomato',    labelHi: 'टमाटर',  icon: 'eco'      },
  { value: 'potato',    labelEn: 'Potato',    labelHi: 'आलू',    icon: 'spa'      },
  { value: 'cotton',    labelEn: 'Cotton',    labelHi: 'कपास',   icon: 'spa'      },
  { value: 'sugarcane', labelEn: 'Sugarcane', labelHi: 'गन्ना',  icon: 'grass'    },
  { value: 'mustard',   labelEn: 'Mustard',   labelHi: 'सरसों',  icon: 'eco'      },
  { value: 'other',     labelEn: 'Other',     labelHi: 'अन्य',   icon: 'more_horiz' },
];

export const growthStages = [
  { value: 'seedling',   labelEn: 'Seedling',    labelHi: 'अंकुर अवस्था'   },
  { value: 'vegetative', labelEn: 'Vegetative',  labelHi: 'वनस्पति अवस्था' },
  { value: 'flowering',  labelEn: 'Flowering',   labelHi: 'फूल अवस्था'     },
  { value: 'fruiting',   labelEn: 'Fruiting',    labelHi: 'फल अवस्था'      },
  { value: 'harvest',    labelEn: 'Harvest',     labelHi: 'कटाई अवस्था'    },
];

export const stateOptions = [
  'Uttar Pradesh', 'Punjab', 'Haryana', 'Madhya Pradesh', 'Rajasthan',
  'Maharashtra', 'Bihar', 'Gujarat', 'Andhra Pradesh', 'Karnataka',
  'Tamil Nadu', 'Odisha', 'West Bengal', 'Chhattisgarh', 'Jharkhand', 'Other',
];

// Quick-select chips shown in the upload hero
export const quickCrops = [
  { id: 'wheat',  icon: 'grass',     en: 'Wheat / गेहूं',   hi: 'गेहूं',   subEn: 'Rust & Blight',  subHi: 'रतुआ और झुलसा' },
  { id: 'rice',   icon: 'nutrition', en: 'Paddy / धान',     hi: 'धान',    subEn: 'Blast & Spot',   subHi: 'ब्लास्ट और धब्बा' },
  { id: 'tomato', icon: 'eco',       en: 'Tomato / टमाटर',  hi: 'टमाटर',  subEn: 'Early Blight',   subHi: 'झुलसा रोग'    },
  { id: 'cotton', icon: 'spa',       en: 'Cotton / कपास',   hi: 'कपास',   subEn: 'Bollworm',        subHi: 'बॉलवर्म'      },
];

// Photo tips shown in the right sidebar card
export const photoTips = [
  {
    icon: 'light_mode',
    titleEn: 'Good Natural Lighting',
    titleHi: 'अच्छी प्राकृतिक रोशनी',
    descEn: 'Take photos in daylight without harsh shadows or direct flash.',
    descHi: 'कड़ी धूप या फ्लैश के बिना दिन की रोशनी में फोटो लें।',
  },
  {
    icon: 'center_focus_strong',
    titleEn: 'Focus on Affected Area',
    titleHi: 'प्रभावित हिस्से पर फोकस करें',
    descEn: 'Ensure the spots or discoloration fills most of the frame.',
    descHi: 'धब्बे या रंग बदलाव फ्रेम में साफ दिखे।',
  },
  {
    icon: 'photo_camera',
    titleEn: 'Clear, Blur-Free Photo',
    titleHi: 'साफ और शार्प फोटो',
    descEn: 'Hold steady and ensure the photo is sharp and not blurry.',
    descHi: 'फोटो blur-free और साफ होनी चाहिए।',
  },
  {
    icon: 'crop_free',
    titleEn: 'One Plant at a Time',
    titleHi: 'एक पौधे पर ध्यान दें',
    descEn: 'Focus on a single plant specimen for better diagnosis accuracy.',
    descHi: 'बेहतर पहचान के लिए एक ही पौधे पर फोकस करें।',
  },
];

// ---- MOCK DIAGNOSIS RESULT ----
// Replace this with the actual API/AI model response when backend is ready
export const mockDiagnosis = {
  id: 'AG-9021',
  crop: 'Tomato',
  cropHi: 'टमाटर',
  diseaseEn: 'Early Blight',
  diseaseHi: 'अर्ली ब्लाइट / पत्ती झुलसा रोग',
  scientificName: 'Alternaria solani',
  confidence: 94,
  severity: 'Moderate',
  severityHi: 'मध्यम',
  description:
    'A common fungal disease caused by Alternaria solani. It attacks foliage, stems, and fruits, rapidly reducing the photosynthetic area and crop yield if left untreated. Early detection and timely management are critical for saving the crop.',

  symptoms: [
    { icon: 'blur_circular', en: 'Brown spots with concentric rings on leaves', hi: 'पत्तियों पर भूरे धब्बे जिनके चारों ओर गोलाकार छल्ले' },
    { icon: 'grass',         en: 'Yellowing (chlorosis) around lesion edges',   hi: 'धब्बों के आसपास पीला रंग (क्लोरोसिस)' },
    { icon: 'dry',           en: 'Leaves gradually drying and falling',         hi: 'पत्तियां धीरे-धीरे सूखना और झड़ना' },
    { icon: 'trending_down', en: 'Reduced plant growth and overall vigour',     hi: 'पौधे की वृद्धि और जोश प्रभावित होना' },
  ],

  causes: [
    { icon: 'water_drop', en: 'High humidity (above 85%)',                    hi: 'अधिक नमी (85% से अधिक)' },
    { icon: 'rainy',      en: 'Frequent rainfall and overhead irrigation',    hi: 'लगातार बारिश और ऊपर से सिंचाई' },
    { icon: 'air',        en: 'Poor air circulation in dense crop canopy',    hi: 'घनी फसल में खराब हवा का प्रवाह' },
    { icon: 'compost',    en: 'Infected plant debris left in the field',      hi: 'खेत में संक्रमित पौधों के अवशेष' },
  ],

  treatment: {
    organic: [
      {
        icon: 'eco',
        titleEn: 'Neem Oil Spray',
        titleHi: 'नीम का तेल स्प्रे',
        descEn: 'Mix 5 ml neem oil (10,000 ppm) per litre of water with a few drops of soap solution. Spray thoroughly on both leaf surfaces.',
        descHi: 'नीम का तेल 5 मि.ली. प्रति लीटर पानी में साबुन के घोल के साथ मिलाकर पत्तियों के दोनों तरफ छिड़काव करें।',
        frequency: 'हर 7-10 दिन में / Every 7-10 days',
      },
      {
        icon: 'science',
        titleEn: 'Trichoderma viride Application',
        titleHi: 'ट्राइकोडर्मा विरिडी उपयोग',
        descEn: 'Soil drenching with this bio-fungicide suppresses fungal inoculum and boosts plant systemic resistance.',
        descHi: 'इस जैव-फफूंदनाशक से मिट्टी को भिगोने से फफूंद का प्रसार रुकता है और पौधे की रोग प्रतिरोधक क्षमता बढ़ती है।',
        frequency: 'हर 15 दिन में एक बार / Once every 15 days',
      },
    ],
    chemical: [
      {
        icon: 'medication',
        titleEn: 'Mancozeb 75% WP',
        titleHi: 'मैंकोजेब 75% WP',
        descEn: 'A broad-spectrum protective fungicide. Apply at first appearance of symptoms for best results.',
        descHi: 'एक व्यापक सुरक्षात्मक फफूंदनाशक। लक्षण दिखते ही उपयोग करें।',
        caution: 'Wear gloves and mask. Consult your local KVK for exact dosage.',
        cautionHi: 'दस्ताने और मास्क पहनें। सटीक खुराक के लिए KVK से परामर्श लें।',
      },
      {
        icon: 'bolt',
        titleEn: 'Copper-based Fungicide',
        titleHi: 'कॉपर आधारित फफूंदनाशक',
        descEn: 'Broad-spectrum contact fungicide effective in persistent humid conditions. Follow label directions.',
        descHi: 'नमी वाले मौसम में प्रभावी संपर्क फफूंदनाशक। लेबल निर्देशों का पालन करें।',
        caution: 'Consult local agriculture office for recommended product & dosage.',
        cautionHi: 'खुराक के लिए स्थानीय कृषि विभाग से परामर्श लें।',
      },
    ],
    prevention: [
      {
        icon: 'agriculture',
        titleEn: 'Crop Rotation',
        titleHi: 'फसल चक्र अपनाएं',
        descEn: 'Avoid planting solanaceous crops (tomato, potato, brinjal) in the same field for at least 2 seasons.',
        descHi: 'एक ही खेत में टमाटर, आलू, बैंगन कम से कम 2 सीज़न तक न लगाएं।',
      },
      {
        icon: 'water_drop',
        titleEn: 'Switch to Drip Irrigation',
        titleHi: 'ड्रिप सिंचाई अपनाएं',
        descEn: 'Keep foliage dry by switching from overhead sprinklers to drip irrigation.',
        descHi: 'पत्तियों को सूखा रखने के लिए ड्रिप सिंचाई का उपयोग करें।',
      },
      {
        icon: 'delete_sweep',
        titleEn: 'Remove Infected Plant Material',
        titleHi: 'संक्रमित हिस्से हटाएं',
        descEn: 'Regularly remove and destroy infected leaves and debris to prevent spore spread.',
        descHi: 'संक्रमित पत्तियां और अवशेष नियमित रूप से हटाकर नष्ट करें।',
      },
    ],
  },

  steps: [
    { num: '01', en: 'Remove and destroy infected leaves immediately',       hi: 'प्रभावित पत्तियों को तुरंत हटाएं और नष्ट करें' },
    { num: '02', en: 'Ensure proper field drainage — avoid waterlogging',    hi: 'खेत में पानी जमा न होने दें, उचित जल निकासी सुनिश्चित करें' },
    { num: '03', en: 'Apply appropriate organic or chemical treatment',      hi: 'उचित जैविक या रासायनिक उपचार का उपयोग करें' },
    { num: '04', en: 'Re-inspect the crop after 7-10 days',                 hi: 'कुछ दिनों बाद फसल की दोबारा जांच करें' },
  ],
};

// ---- NEARBY AGRO SHOPS (mock) ----
export const nearbyShops = [
  {
    id: 1,
    name: 'Sharma Agro Center',
    nameHi: 'शर्मा एग्रो सेंटर',
    distance: '2.4 km',
    rating: 4.6,
    reviews: 128,
    address: 'Main Market Road, Near Bus Stand',
    addressHi: 'मुख्य बाजार रोड, बस स्टैंड के पास',
    categories: ['Seeds', 'Fertilizer', 'Crop Protection'],
    categoriesHi: ['बीज', 'उर्वरक', 'फसल सुरक्षा'],
    phone: '+91 98765 43210',
    isOpen: true,
    openTimeEn: 'Open · Closes at 7 PM',
    openTimeHi: 'खुला · शाम 7 बजे बंद',
  },
  {
    id: 2,
    name: 'Kisaan Krishi Seva Kendra',
    nameHi: 'किसान कृषि सेवा केंद्र',
    distance: '3.1 km',
    rating: 4.3,
    reviews: 89,
    address: 'Grain Market Lane, Shop No. 14',
    addressHi: 'अनाज मंडी गली, दुकान सं. 14',
    categories: ['Bio-Fertilizer', 'Pesticide', 'Equipment'],
    categoriesHi: ['जैव उर्वरक', 'कीटनाशक', 'उपकरण'],
    phone: '+91 98123 45678',
    isOpen: true,
    openTimeEn: 'Open · Closes at 6 PM',
    openTimeHi: 'खुला · शाम 6 बजे बंद',
  },
  {
    id: 3,
    name: 'Green Field Agro Store',
    nameHi: 'ग्रीन फील्ड एग्रो स्टोर',
    distance: '5.0 km',
    rating: 4.1,
    reviews: 54,
    address: 'Bypass Highway Junction, Sector 3',
    addressHi: 'बाईपास हाईवे जंक्शन, सेक्टर 3',
    categories: ['Seeds', 'Organic Products'],
    categoriesHi: ['बीज', 'जैविक उत्पाद'],
    phone: '+91 97890 12345',
    isOpen: false,
    openTimeEn: 'Closed · Opens at 9 AM',
    openTimeHi: 'बंद · सुबह 9 बजे खुलेगा',
  },
];

// ---- EXPERT DATA (mock) ----
export const expertData = [
  {
    id: 1,
    name: 'Dr. Suresh Patel',
    nameHi: 'डॉ. सुरेश पटेल',
    role: 'Senior Agronomist',
    roleHi: 'वरिष्ठ कृषि वैज्ञानिक',
    org: 'KVK Meerut',
    orgHi: 'केवीके मेरठ',
    experience: '18 yrs',
    specialization: 'Crop Diseases & Soil Health',
    specializationHi: 'फसल रोग एवं मृदा स्वास्थ्य',
    available: true,
    responseTime: 'Responds within 2 hours',
    responseTimeHi: '2 घंटे में जवाब',
    initials: 'SP',
    color: 'bg-primary-container text-on-primary-container',
  },
  {
    id: 2,
    name: 'Dr. Meena Sharma',
    nameHi: 'डॉ. मीना शर्मा',
    role: 'Plant Pathologist',
    roleHi: 'पादप रोगविज्ञानी',
    org: 'ICAR Regional Office',
    orgHi: 'ICAR क्षेत्रीय कार्यालय',
    experience: '12 yrs',
    specialization: 'Fungal & Viral Crop Diseases',
    specializationHi: 'फफूंद एवं वायरल फसल रोग',
    available: false,
    responseTime: 'Responds within 4-6 hours',
    responseTimeHi: '4-6 घंटे में जवाब',
    initials: 'MS',
    color: 'bg-secondary-container text-on-secondary-container',
  },
];

// ---- DIAGNOSIS HISTORY (mock) ----
export const diagnosisHistory = [
  {
    id: 1,
    cropEn: 'Wheat Field #3',
    cropHi: 'गेहूं खेत #3',
    dateEn: '15 Sep 2026',
    dateHi: '15 सितम्बर 2026',
    diseaseEn: 'Yellow Rust',
    diseaseHi: 'पीला रतुआ',
    severity: 'High',
    severityHi: 'अधिक',
    status: 'treated',
    statusEn: 'Treatment Applied',
    statusHi: 'उपचार किया',
    badgeClass: 'bg-error/10 text-error',
  },
  {
    id: 2,
    cropEn: 'Paddy Plot A',
    cropHi: 'धान भूखंड A',
    dateEn: '10 Sep 2026',
    dateHi: '10 सितम्बर 2026',
    diseaseEn: 'Healthy',
    diseaseHi: 'स्वस्थ',
    severity: 'None',
    severityHi: 'कोई नहीं',
    status: 'healthy',
    statusEn: 'No Disease Found',
    statusHi: 'कोई रोग नहीं',
    badgeClass: 'bg-secondary/10 text-secondary',
  },
  {
    id: 3,
    cropEn: 'Tomato Plot B',
    cropHi: 'टमाटर भूखंड B',
    dateEn: '2 Sep 2026',
    dateHi: '2 सितम्बर 2026',
    diseaseEn: 'Early Blight',
    diseaseHi: 'अर्ली ब्लाइट',
    severity: 'Moderate',
    severityHi: 'मध्यम',
    status: 'monitoring',
    statusEn: 'Under Monitoring',
    statusHi: 'निगरानी में',
    badgeClass: 'bg-tertiary-fixed text-on-tertiary-fixed',
  },
];
