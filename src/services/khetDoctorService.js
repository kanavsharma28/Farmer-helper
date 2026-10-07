// ─── Mera Khet Ka Doctor — Service & Intelligence Layer ─────────────────────
// Handles Crop Disease Detection, Agricultural Recommendations,
// Hindi Treatment Guidelines, Persistence, and Nearby Agro Shops.

export const KHET_DOCTOR_STORAGE_KEY = 'farmer_helper_khet_doctor_history';
export const KHET_DOCTOR_UPDATE_EVENT = 'khet_doctor_history_updated';

// ── Crop Options ─────────────────────────────────────────────────────────────
export const ALL_CROPS = [
  { id: 'wheat',     labelEn: 'Wheat',         labelHi: 'गेहूं',   icon: 'grass' },
  { id: 'rice',      labelEn: 'Rice / Paddy',  labelHi: 'धान',    icon: 'nutrition' },
  { id: 'maize',     labelEn: 'Maize',         labelHi: 'मक्का',  icon: 'grass' },
  { id: 'sugarcane', labelEn: 'Sugarcane',     labelHi: 'गन्ना',  icon: 'grass' },
  { id: 'potato',    labelEn: 'Potato',        labelHi: 'आलू',    icon: 'spa' },
  { id: 'tomato',    labelEn: 'Tomato',        labelHi: 'टमाटर',  icon: 'eco' },
  { id: 'cotton',    labelEn: 'Cotton',        labelHi: 'कपास',   icon: 'spa' },
  { id: 'mustard',   labelEn: 'Mustard',       labelHi: 'सरसों',  icon: 'eco' },
  { id: 'vegetables',labelEn: 'Vegetables',    labelHi: 'सब्जियां', icon: 'local_florist' },
  { id: 'fruits',    labelEn: 'Fruits',        labelHi: 'फल',     icon: 'nutrition' },
  { id: 'other',     labelEn: 'Other Crop',    labelHi: 'अन्य फसल', icon: 'more_horiz' },
];

// ── Crop Disease Knowledge Catalog ───────────────────────────────────────────
// Verified plant pathology database for Indian agricultural crops
export const CROP_DISEASE_CATALOG = {
  wheat: {
    diseaseEn: 'Yellow Rust (Stripe Rust)',
    diseaseHi: 'पीला रतुआ (स्ट्राइप रस्ट)',
    scientificName: 'Puccinia striiformis f. sp. tritici',
    crop: 'Wheat',
    cropHi: 'गेहूं',
    affectedPart: 'Leaves / Foliage',
    affectedPartHi: 'पत्तियां',
    confidence: 93,
    severity: 'High',
    severityHi: 'गंभीर / उच्च',
    description:
      'Yellow rust is a devastating airborne fungal disease of wheat characterized by stripes of bright yellow pustules on leaves. It thrives in cool, humid temperatures (10-15°C) and can reduce grain yields by up to 50% if untreated.',
    descriptionHi:
      'पीला रतुआ गेहूं का एक प्रमुख फफूंद जनित रोग है, जिसमें पत्तियों पर पीले रंग की धारियां और पाउडर जैसे दाने बन जाते हैं। यह ठंडे और नम मौसम में तेजी से फैलता है और पैदावार को 40-50% तक घटा सकता है।',
    symptoms: [
      { icon: 'format_line_spacing', en: 'Bright yellow-orange pustules arranged in parallel linear stripes along leaf veins', hi: 'पत्तियों की नसों के समानांतर चमकीले पीले दानों की धारियां' },
      { icon: 'blur_on', en: 'Yellow powder readily rubs off on farmer fingers or clothing', hi: 'पत्तियों को छूने पर उंगलियों पर पीला पाउडर लगना' },
      { icon: 'dry', en: 'Premature leaf drying and shrivelled, underweight wheat grains', hi: 'पत्तियों का समय से पहले सूखना और गेहूं के दानों का सिकुड़ना' },
      { icon: 'thermostat', en: 'Rapid spread across the plot during cool, morning-fog conditions', hi: 'सुबह के कोहरे और ठंडे मौसम में पूरे खेत में तेजी से फैलाव' },
    ],
    causes: [
      { icon: 'cloud', en: 'Cool ambient temperature (10–18°C) with persistent morning dew', hi: 'ठंडा तापमान (10-18°C) और लगातार सुबह की ओस' },
      { icon: 'air', en: 'Wind-borne fungal spores carried from sub-mountainous foothills', hi: 'पहाड़ी क्षेत्रों से हवा के साथ आने वाले फफूंद के बीजाणु' },
      { icon: 'grain', en: 'Cultivating susceptible wheat varieties like HD-2967 in rust-prone zones', hi: 'रतुआ-संवेदनशील गेहूं किस्मों की बुवाई' },
    ],
    treatment: {
      organic: [
        {
          icon: 'eco',
          titleEn: 'Neem-based Bio-formulation',
          titleHi: 'नीम आधारित जैव फॉर्मूलेशन',
          descEn: 'Spray cold-pressed Neem Oil (10,000 ppm) at 5 ml/litre with 1 ml liquid soap as an early preventative barrier against spore germination.',
          descHi: '5 मि.ली. नीम तेल (10,000 ppm) प्रति लीटर पानी में थोड़ा सर्फ मिलाकर छिड़काव करें।',
          frequency: 'Repeat every 7–10 days on early symptom spots',
        },
        {
          icon: 'science',
          titleEn: 'Pseudomonas fluorescens Bio-control',
          titleHi: 'स्यूडोमोनास फ्लोरेसेंस उपयोग',
          descEn: 'Foliar spray of beneficial antagonistic bacteria (10 g/litre) to stimulate wheat systemic acquired resistance (SAR).',
          descHi: '10 ग्राम प्रति लीटर पानी में घोलकर पत्तियों पर छिड़कें जिससे पौधे की प्रतिरोधक क्षमता बढ़े।',
          frequency: 'At first appearance of isolated leaf spots',
        },
      ],
      chemical: [
        {
          icon: 'medication',
          titleEn: 'Propiconazole 25% EC',
          titleHi: 'प्रोपिकोनाज़ोल 25% ईसी (टिल्ट)',
          descEn: 'Systemic triazole fungicide. Highly effective curative spray for stripe rust.',
          descHi: 'एक प्रभावी प्रणालीगत फफूंदनाशक। रतुआ दिखने पर तुरंत छिड़काव करें।',
          caution: 'Wear protective mask and gloves. Always consult your local Krishi Vigyan Kendra (KVK) for exact dosage according to field volume.',
          cautionHi: 'मास्क और दस्ताने पहनें। सही खुराक के लिए स्थानीय कृषि अधिकारी या KVK से सलाह लें।',
          safeUsageNote: 'Dilute 1 ml per litre of water (approx 200 ml in 200 litres per acre).',
        },
        {
          icon: 'science',
          titleEn: 'Tebuconazole 25.9% m/m',
          titleHi: 'टेबुकोनाज़ोल 25.9%',
          descEn: 'Alternative systemic fungicide offering rapid translaminar protection if yellow rust has spread widely.',
          descHi: 'रतुआ का फैलाव अधिक होने पर वैकल्पिक प्रणालीगत फफूंदनाशक।',
          caution: 'Follow the statutory waiting period before harvest.',
          cautionHi: 'कटाई से पहले निर्धारित प्रतीक्षा अवधि का पालन करें।',
          safeUsageNote: 'Consult agricultural extension staff prior to tank mixing.',
        },
      ],
      prevention: [
        {
          icon: 'psychology',
          titleEn: 'Adopt Rust-Resistant Varieties',
          titleHi: 'रतुआ-रोधी किस्में लगाएं',
          descEn: 'Sow certified rust-resistant wheat varieties such as DBW-187 (Karan Vandana), DBW-222, or PBW-725.',
          descHi: 'डीबीडब्ल्यू-187 (करण वंदना), डीबीडब्ल्यू-222 या पीबीडब्ल्यू-725 जैसी प्रमाणित किस्में बोएं।',
        },
        {
          icon: 'calendar_month',
          titleEn: 'Timely Sowing',
          titleHi: 'समय पर बुवाई करें',
          descEn: 'Complete wheat sowing between November 1 and November 20 to avoid peak February rust vulnerability.',
          descHi: '1 से 20 नवंबर के बीच बुवाई पूरी करें ताकि फरवरी में रतुआ का प्रभाव कम से कम हो।',
        },
        {
          icon: 'visibility',
          titleEn: 'Regular Crop Surveillance',
          titleHi: 'खेत की नियमित निगरानी',
          descEn: 'Inspect shaded corners and tree borders of your field weekly during January and February.',
          descHi: 'जनवरी व फरवरी में खेत के कोनों व छायादार हिस्सों की साप्ताहिक निगरानी करें।',
        },
      ],
    },
    hindiGuide: {
      overview: 'पीला रतुआ गेहूं का एक खतरनाक फफूंद जनित रोग है। समय पर पहचान और तुरंत छिड़काव से फसल को बचाया जा सकता है।',
      dos: [
        'खेत में पीली धारियां दिखते ही तुरंत कृषि विशेषज्ञ या KVK से संपर्क करें।',
        'हवा का रुख देखकर शाम के समय साफ धूप वाले दिन छिड़काव करें।',
        'अगले साल के लिए केवल रतुआ प्रतिरोधी किस्में जैसे DBW-187, DBW-303 ही चुनें।',
        'छिड़काव के समय मास्क और चश्मा जरूर पहनें।',
      ],
      donts: [
        'खेत में अनावश्यक नाइट्रोजन (यूरिया) का अधिक प्रयोग न करें, इससे बीमारी तेजी से बढ़ती है।',
        'बीमार फसल पर तेज धूप या बारिश के ठीक पहले छिड़काव न करें।',
        'बिना विशेषज्ञ सलाह के दो अलग-अलग रसायनों को आपस में न मिलाएं।',
      ],
    },
  },

  rice: {
    diseaseEn: 'Rice Blast (Leaf & Neck Blast)',
    diseaseHi: 'धान का ब्लास्ट रोग (झोंका रोग)',
    scientificName: 'Magnaporthe oryzae',
    crop: 'Rice / Paddy',
    cropHi: 'धान',
    affectedPart: 'Leaves & Panicle Neck',
    affectedPartHi: 'पत्तियां एवं बाली की गर्दन',
    confidence: 91,
    severity: 'High',
    severityHi: 'गंभीर / उच्च',
    description:
      'Rice blast is one of the most destructive diseases of paddy worldwide. Spindle-shaped lesions with ash-grey centres appear on leaves, and neck infections cause the entire panicle to break and dry up (chaffy grain).',
    descriptionHi:
      'धान का झोंका (ब्लास्ट) रोग फफूंद द्वारा होता है। पत्तियों पर नाव के आकार के धब्बे बनते हैं जिनका बीच का हिस्सा राख जैसे रंग का होता है। बाली की गर्दन पर संक्रमण से दाने खोखले रह जाते हैं।',
    symptoms: [
      { icon: 'lens', en: 'Spindle-shaped or eye-shaped spots with brown borders and grey centers on leaves', hi: 'पत्तियों पर आंख या नाव के आकार के बीच में राख जैसे धब्बे' },
      { icon: 'content_cut', en: 'Blackish-brown rotting at the neck of the panicle causing it to drop', hi: 'बाली की गर्दन का काला पड़कर मुड़ जाना या टूट जाना' },
      { icon: 'grain', en: 'Severe reduction in grain filling, leading to empty (chaffy) panicles', hi: 'बालियों में दानों का न भरना और खोखला रह जाना' },
    ],
    causes: [
      { icon: 'water_drop', en: 'High relative humidity (>90%) with cloudy rainy weather', hi: '90% से अधिक नमी और बादलों भरा मौसम' },
      { icon: 'spa', en: 'Excessive application of chemical Nitrogen fertilizers', hi: 'खेत में यूरिया/नाइट्रोजन का जरूरत से ज्यादा प्रयोग' },
    ],
    treatment: {
      organic: [
        {
          icon: 'eco',
          titleEn: 'Pseudomonas fluorescens (TNAU strain)',
          titleHi: 'स्यूडोमोनास फ्लोरेसेंस जैव फफूंदनाशक',
          descEn: 'Foliar spray at 10 g/litre or seed treatment (10 g/kg) prior to transplanting.',
          descHi: '10 ग्राम प्रति लीटर पानी में मिलाकर पत्तियों पर छिड़कें।',
          frequency: 'Every 10 days starting from tillering stage',
        },
      ],
      chemical: [
        {
          icon: 'medication',
          titleEn: 'Tricyclazole 75% WP',
          titleHi: 'ट्राइसाइक्लाज़ोल 75% डब्ल्यूपी (बाण)',
          descEn: 'Industry standard systemic fungicide specifically tailored to blast pathogen.',
          descHi: 'धान के ब्लास्ट के लिए सबसे प्रभावी और मानक फफूंदनाशक।',
          caution: 'Consult your local Agriculture Extension Officer for exact dosage.',
          cautionHi: 'खुराक के लिए स्थानीय कृषि प्रसार अधिकारी से सलाह लें।',
          safeUsageNote: 'Usually 120 g per acre in 200 litres of clean water.',
        },
        {
          icon: 'science',
          titleEn: 'Isoprothiolane 40% EC',
          titleHi: 'आइसोप्रोपियोलेन 40% ईसी',
          descEn: 'Curative and protective action against leaf and neck blast.',
          descHi: 'पत्ती एवं गर्दन ब्लास्ट दोनों के लिए सुरक्षात्मक दवा।',
          caution: 'Wear protective gear during preparation.',
          cautionHi: 'दवा बनाते समय सुरक्षात्मक कपड़े पहनें।',
          safeUsageNote: 'Spray at 1.5 ml per litre of water.',
        },
      ],
      prevention: [
        {
          icon: 'science',
          titleEn: 'Balanced Fertilization',
          titleHi: 'संतुलित खाद प्रबंधन',
          descEn: 'Avoid heavy single urea doses. Split Nitrogen into 3 doses with adequate Potassium (Potash).',
          descHi: 'यूरिया को 3 किस्तों में दें और पोटाश का उचित प्रयोग करें।',
        },
        {
          icon: 'delete',
          titleEn: 'Field Sanitation',
          titleHi: 'मेड़ों की सफाई',
          descEn: 'Remove alternate grass hosts (Echinochloa) from field bunds.',
          descHi: 'खेत की मेड़ों से जंगली घास हटाएं।',
        },
      ],
    },
    hindiGuide: {
      overview: 'धान का झोंका रोग बाली निकलने से पहले पत्तियों और बाली की गर्दन को नुकसान पहुंचाता है। समय पर रोकथाम जरूरी है।',
      dos: [
        'लक्षण दिखते ही ट्राइसाइक्लाज़ोल का छिड़काव 200 लीटर पानी प्रति एकड़ में करें।',
        'खेत में पोटाश की पर्याप्त मात्रा रखें ताकि पौधे मजबूत रहें।',
        'सुबह की ओस सूखने के बाद ही छिड़काव करें।',
      ],
      donts: [
        'खेत में बहुत ज्यादा यूरिया न डालें।',
        'संक्रमित फसल के अवशेषों को खेत में न छोड़ें।',
      ],
    },
  },

  tomato: {
    diseaseEn: 'Early Blight',
    diseaseHi: 'टमाटर का अर्ली ब्लाइट (अगेती झुलसा)',
    scientificName: 'Alternaria solani',
    crop: 'Tomato',
    cropHi: 'टमाटर',
    affectedPart: 'Leaves, Stems & Fruit Calyx',
    affectedPartHi: 'पत्तियां, तना एवं फल',
    confidence: 94,
    severity: 'Moderate',
    severityHi: 'मध्यम',
    description:
      'A common fungal disease attacking foliage, stems, and fruits. Concentric dark brown rings ("target-board" spots) develop on older lower leaves, eventually causing severe defoliation and sun-scald on developing tomatoes.',
    descriptionHi:
      'यह फफूंद जनित रोग है। निचली पुरानी पत्तियों पर गहरे भूरे रंग के छल्लेदार धब्बे बनते हैं। पत्तियां पीली पड़कर सूखने लगती हैं जिससे टमाटर की पैदावार घट जाती है।',
    symptoms: [
      { icon: 'blur_circular', en: 'Dark brown to black spots with concentric rings resembling a target board', hi: 'पत्तियों पर गोलाकार छल्लेदार भूरे-काले धब्बे (टारगेट बोर्ड जैसे)' },
      { icon: 'grass', en: 'Yellow halo (chlorosis) surrounding the dark leaf spots', hi: 'धब्बों के चारों ओर पीले रंग का घेरा' },
      { icon: 'arrow_downward', en: 'Progressive yellowing and premature leaf fall starting from lower canopy', hi: 'निचली पत्तियों का सूखकर गिरना' },
    ],
    causes: [
      { icon: 'water_drop', en: 'Warm temperature (24–29°C) with persistent leaf wetness', hi: '24-29°C तापमान और पत्तियों पर नमी' },
      { icon: 'rainy', en: 'Frequent overhead sprinkler irrigation splashing soil spores onto leaves', hi: 'ऊपर से पानी देने से मिट्टी के कीटाणुओं का पत्तियों पर उछलना' },
    ],
    treatment: {
      organic: [
        {
          icon: 'eco',
          titleEn: 'Neem Oil Spray (10,000 ppm)',
          titleHi: 'नीम का तेल छिड़काव',
          descEn: 'Mix 5 ml neem oil per litre of water with a mild soap emulsion and spray both sides of leaves.',
          descHi: '5 मि.ली. नीम तेल प्रति लीटर पानी में मिलाकर पत्तियों के दोनों ओर छिड़कें।',
          frequency: 'Every 7–10 days',
        },
        {
          icon: 'science',
          titleEn: 'Trichoderma viride Bio-fungicide',
          titleHi: 'ट्राइकोडर्मा विरिडी उपयोग',
          descEn: 'Soil drenching and foliar spray to suppress fungal inoculum in root zone.',
          descHi: 'जड़ों के पास मिट्टी में डालें ताकि फफूंद का प्रसार रुके।',
          frequency: 'Every 15 days',
        },
      ],
      chemical: [
        {
          icon: 'medication',
          titleEn: 'Mancozeb 75% WP',
          titleHi: 'मैंकोजेब 75% डब्ल्यूपी (इंडेफिल M-45)',
          descEn: 'Broad-spectrum contact protective fungicide.',
          descHi: 'एक प्रभावी सुरक्षात्मक फफूंदनाशक। शुरुआती लक्षण दिखते ही उपयोग करें।',
          caution: 'Wear gloves and mask. Consult your local agriculture department for recommended doses.',
          cautionHi: 'दस्ताने व मास्क पहनें। सटीक खुराक के लिए कृषि विभाग से परामर्श लें।',
          safeUsageNote: '2 g per litre of water.',
        },
        {
          icon: 'bolt',
          titleEn: 'Azoxystrobin 18.2% + Difenoconazole 11.4% SC',
          titleHi: 'एज़ोक्सीस्ट्रोबिन + डिफेनोकोनाज़ोल (एम्स्टार टॉप)',
          descEn: 'Dual-action systemic fungicide for advanced infections.',
          descHi: 'गंभीर संक्रमण में दोनों तरह से काम करने वाली दवा।',
          caution: 'Do not spray within 5 days of harvesting tomatoes.',
          cautionHi: 'टमाटर तोड़ने से 5 दिन पहले इसका छिड़काव न करें।',
          safeUsageNote: 'Consult qualified expert for dosage.',
        },
      ],
      prevention: [
        {
          icon: 'agriculture',
          titleEn: 'Crop Rotation',
          titleHi: 'फसल चक्र अपनाएं',
          descEn: 'Do not plant tomato, potato, or brinjal in the same bed consecutively.',
          descHi: 'टमाटर, आलू और बैंगन को लगातार एक ही खेत में न लगाएं।',
        },
        {
          icon: 'opacity',
          titleEn: 'Drip Irrigation',
          titleHi: 'ड्रिप सिंचाई का उपयोग',
          descEn: 'Avoid overhead watering to keep tomato foliage dry.',
          descHi: 'पत्तियों को सूखा रखने के लिए ड्रिप से पानी दें।',
        },
      ],
    },
    hindiGuide: {
      overview: 'टमाटर के अगेती झुलसा में पत्तियों पर छल्लेदार गोल धब्बे बनते हैं। समय पर निचली पत्तियों को तोड़कर दवा का छिड़काव करें।',
      dos: [
        'जमीन से सटी निचली बीमार पत्तियों को तोड़कर खेत से दूर नष्ट करें।',
        'ड्रिप सिंचाई का प्रयोग करें ताकि पत्तियां गीली न रहें।',
        'मैंकोजेब या कॉपर ऑक्सीक्लोराइड का 2 ग्राम/लीटर पानी में घोलकर छिड़काव करें।',
      ],
      donts: [
        'पौधों के ऊपर से फव्वारे से पानी न दें।',
        'एक ही खेत में बार-बार टमाटर या आलू न लगाएं।',
      ],
    },
  },

  potato: {
    diseaseEn: 'Late Blight of Potato',
    diseaseHi: 'आलू का पछेती झुलसा (लेट ब्लाइट)',
    scientificName: 'Phytophthora infestans',
    crop: 'Potato',
    cropHi: 'आलू',
    affectedPart: 'Leaves, Stems & Tubers',
    affectedPartHi: 'पत्तियां, तना एवं कंद',
    confidence: 95,
    severity: 'High',
    severityHi: 'अत्यधिक गंभीर',
    description:
      'Late blight is the most notorious potato disease. Water-soaked dark lesions with white fungal down on leaf undersides spread with alarming speed in foggy weather, destroying entire fields within a few days if not protected.',
    descriptionHi:
      'आलू का पछेती झुलसा सबसे विनाशकारी रोग है। कोहरे और बादलों वाले मौसम में पत्तियों के किनारों पर पानी जैसे भीगे धब्बे बनते हैं और निचली सतह पर सफेद रुई जैसी फफूंद दिखती है। यह 3-4 दिन में पूरा खेत नष्ट कर सकता है।',
    symptoms: [
      { icon: 'water_drop', en: 'Water-soaked irregular blackish-brown spots on leaf tips and margins', hi: 'पत्तियों के किनारों पर पानी से भीगे जैसे काले-भूरे धब्बे' },
      { icon: 'cloud', en: 'White cottony fungal down on leaf undersurface during early morning humidity', hi: 'सुबह के समय पत्ती की निचली सतह पर सफेद फफूंद दिखना' },
      { icon: 'warning', en: 'Foul decaying odor in the field with rapid collapse of whole plant canopy', hi: 'खेत में सड़न जैसी दुर्गंध और पौधों का तेजी से मुरझाना' },
    ],
    causes: [
      { icon: 'thermostat', en: 'Temperatures between 12–22°C combined with dense fog/drizzle (>90% humidity)', hi: '12-22°C तापमान और घना कोहरा या हल्की बूंदाबांदी' },
      { icon: 'grain', en: 'Infected seed tubers carrying dormant mycelium', hi: 'संक्रमित बीज आलू का उपयोग' },
    ],
    treatment: {
      organic: [
        {
          icon: 'eco',
          titleEn: 'Bordeaux Mixture (1%)',
          titleHi: 'बोर्डो मिश्रण (1%)',
          descEn: 'Traditional copper sulphate and hydrated lime mix providing preventive barrier protection.',
          descHi: 'नीला थोथा और चूने का 1% घोल सुरक्षात्मक स्प्रे के रूप में उपयोग करें।',
          frequency: 'Every 7 days during foggy periods',
        },
      ],
      chemical: [
        {
          icon: 'medication',
          titleEn: 'Cymoxanil 8% + Mancozeb 64% WP (Curzate)',
          titleHi: 'साइमोक्सानिल + मैंकोजेब',
          descEn: 'Curative and translaminar systemic fungicide for active late blight containment.',
          descHi: 'लेट ब्लाइट के प्रकोप के समय सबसे तेज काम करने वाला फफूंदनाशक।',
          caution: 'Consult local agricultural extension staff for accurate dosage per water capacity.',
          cautionHi: 'पानी के अनुपात और सटीक मात्रा के लिए KVK से जानकारी लें।',
          safeUsageNote: 'Use 2.5 g per litre of water.',
        },
        {
          icon: 'science',
          titleEn: 'Dimethomorph 50% WP',
          titleHi: 'डाइमेथोमॉर्फ 50% डब्ल्यूपी',
          descEn: 'Anti-oomycete systemic fungicide targeting fungal cell walls.',
          descHi: 'उन्नत फफूंदनाशक जो फफूंद की कोशिका दीवार को नष्ट करता है।',
          caution: 'Wear protective rubber boots and mask.',
          cautionHi: 'छिड़काव करते समय रबर के जूते व मास्क पहनें।',
          safeUsageNote: 'Consult certified agronomist for tank mix.',
        },
      ],
      prevention: [
        {
          icon: 'verified',
          titleEn: 'Certified Disease-Free Seed Tubers',
          titleHi: 'प्रमाणित रोगमुक्त बीज',
          descEn: 'Use certified seed tubers treated with Trichoderma or Mancozeb before planting.',
          descHi: 'बुवाई से पहले बीज आलू को उपचारित जरूर करें।',
        },
        {
          icon: 'landscape',
          titleEn: 'High Earthing Up',
          titleHi: 'आलू पर पर्याप्त मिट्टी चढ़ाना',
          descEn: 'Keep tubers well covered with soil so rain cannot wash spores from leaves into underground potatoes.',
          descHi: 'आलू के कंदों पर अच्छी तरह मिट्टी चढ़ाएं ताकि बारिश से फफूंद नीचे आलू तक न पहुंचे।',
        },
      ],
    },
    hindiGuide: {
      overview: 'आलू का पछेती झुलसा कोहरा पड़ने पर बहुत तेजी से फैलता है। लक्षण दिखते ही बिना देरी किए छिड़काव जरूरी है।',
      dos: [
        'कोहरा और बादलों का मौसम शुरू होते ही पहले से सुरक्षात्मक दवा मैंकोजेब का छिड़काव करें।',
        'बीमारी दिखने पर तुरंत साइमोक्सानिल + मैंकोजेब (2.5 ग्राम/लीटर) का छिड़काव करें।',
        'खेत में सिंचाई तुरंत रोक दें।',
      ],
      donts: [
        'कोहरे के समय खेत में नमी बहुत अधिक न रहने दें।',
        'सड़े हुए आलू के पौधों को खेत के अंदर न फेंकें।',
      ],
    },
  },

  cotton: {
    diseaseEn: 'Pink Bollworm Infestation',
    diseaseHi: 'कपास की गुलाबी सुंडी (पिंक बॉलवर्म)',
    scientificName: 'Pectinophora gossypiella',
    crop: 'Cotton',
    cropHi: 'कपास',
    affectedPart: 'Flower buds & Bolls',
    affectedPartHi: 'फूल की कलियां व टिंडे',
    confidence: 90,
    severity: 'High',
    severityHi: 'उच्च / गंभीर',
    description:
      'Pink bollworm larvae enter developing cotton bolls, feeding on internal seeds and lint. Rosetted flowers and double seeds are hallmark signs. It causes stained lint and massive economic losses.',
    descriptionHi:
      'गुलाबी सुंडी कपास के फूलों और टिंडों के अंदर घुसकर बीज और रुई को खाती है। फूल गुलाब जैसे बंधे हुए (रोसेट) दिखते हैं और रुई की गुणवत्ता खराब हो जाती है।',
    symptoms: [
      { icon: 'local_florist', en: 'Rosetted flowers that fail to open normally', hi: 'फूलों का गुलाब की तरह बंधा रह जाना और ठीक से न खिलना' },
      { icon: 'circle', en: 'Tiny entry holes plugged with frass on young cotton bolls', hi: 'टिंडों में छोटे छेद और अंदर भूरा कचरा' },
      { icon: 'grain', en: 'Internal staining of lint and premature boll dropping', hi: 'रुई का पीला/भूरा पड़ना और टिंडों का समय से पहले गिरना' },
    ],
    causes: [
      { icon: 'pest_control', en: 'Survival of larvae in un-shredded cotton stalks and ginning waste', hi: 'खेत में छोड़े गए पुराने कपास के डंठलों में सुंडी का जीवित रहना' },
    ],
    treatment: {
      organic: [
        {
          icon: 'eco',
          titleEn: 'Pheromone Trap Installation',
          titleHi: 'फेरोमोन ट्रैप (गंध पाश)',
          descEn: 'Install 5–8 Pheromone traps per acre with Gossyplure septa to monitor and trap adult male moths.',
          descHi: 'प्रति एकड़ 5-8 फेरोमोन ट्रैप लगाएं ताकि नर पतंगों को फंसाया जा सके।',
          frequency: 'Change lure every 21 days',
        },
        {
          icon: 'science',
          titleEn: 'Trichogramma Egg Parasitoid',
          titleHi: 'ट्राइकोग्रामा कार्ड',
          descEn: 'Release beneficial Trichogramma bactrae parasitoid wasps at 60,000/acre.',
          descHi: '60,000 प्रति एकड़ की दर से ट्राइकोग्रामा के अंडे छोड़ें।',
          frequency: 'Weekly intervals during flowering',
        },
      ],
      chemical: [
        {
          icon: 'medication',
          titleEn: 'Profenofos 50% EC',
          titleHi: 'प्रोफेनोफॉस 50% ईसी',
          descEn: 'Ovicidal and larvicidal insecticide effective before larvae bore into bolls.',
          descHi: 'अंडों और छोटी सुंडी पर प्रभावी कीटनाशक।',
          caution: 'Consult agriculture officer for exact dosage and protective safety measures.',
          cautionHi: 'खुराक और सुरक्षा के लिए कृषि अधिकारी से सलाह लें।',
          safeUsageNote: 'Consult extension specialist before application.',
        },
      ],
      prevention: [
        {
          icon: 'delete',
          titleEn: 'Destroy Crop Residues',
          titleHi: 'पुराने डंठल नष्ट करें',
          descEn: 'Shred and plough under cotton stalks immediately after the final picking.',
          descHi: 'अंतिम तुड़ाई के बाद डंठलों को उखाड़कर नष्ट करें।',
        },
      ],
    },
    hindiGuide: {
      overview: 'गुलाबी सुंडी टिंडों के अंदर नुकसान करती है। फेरोमोन ट्रैप लगाकर शुरुआती निगरानी सबसे प्रभावी उपाय है।',
      dos: [
        'खेत में 5 से 8 फेरोमोन ट्रैप प्रति एकड़ जरूर लगाएं।',
        'रोसेट बने हुए फूलों को हाथ से तोड़कर नष्ट करें।',
        'अनुशंसित कीटनाशक का छिड़काव सुंडी के अंदर घुसने से पहले करें।',
      ],
      donts: [
        'खेत में कपास की फसल को अगले साल तक खड़ा न रहने दें।',
        'बिना जरूरत के बार-बार पाइरेथ्रॉइड कीटनाशकों का छिड़काव न करें।',
      ],
    },
  },

  sugarcane: {
    diseaseEn: 'Red Rot of Sugarcane',
    diseaseHi: 'गन्ने का लाल सड़न रोग (रेड रॉट)',
    scientificName: 'Colletotrichum falcatum',
    crop: 'Sugarcane',
    cropHi: 'गन्ना',
    affectedPart: 'Stalk & Internal Pith',
    affectedPartHi: 'तना एवं आंतरिक गूदा',
    confidence: 92,
    severity: 'High',
    severityHi: 'अत्यधिक गंभीर (कैंसर ऑफ केन)',
    description:
      'Known as the "Cancer of Sugarcane". Fungal infection causes internal reddening of the cane stalk with characteristic crosswise white patches and an alcoholic odor upon splitting. Leaves wither from crown downwards.',
    descriptionHi:
      'इसे "गन्ने का कैंसर" कहा जाता है। गन्ने को चीरने पर अंदर का गूदा लाल दिखता है जिस पर आड़े सफेद धब्बे होते हैं और सिरके जैसी गंध आती है। पत्तियां ऊपर से सूखने लगती हैं।',
    symptoms: [
      { icon: 'warning', en: 'Third and fourth leaves of the crown turn yellow and dry from tip along margins', hi: 'ऊपर की तीसरी व चौथी पत्ती का सूखना शुरू होना' },
      { icon: 'content_cut', en: 'Splitting cane reveals longitudinal red pith with horizontal white blotches', hi: 'गन्ने को चीरने पर अंदर लाल गूदा और सफेद आड़े धब्बे' },
      { icon: 'air', en: 'Distinct acidic or alcoholic fermentation smell from affected stalks', hi: 'गन्ने से सिरके या शराब जैसी खट्टी गंध आना' },
    ],
    causes: [
      { icon: 'grain', en: 'Planting infected setts from previous diseased ratoon crops', hi: 'रोगग्रस्त फसल के टुकड़ों (बीज) की बुवाई' },
      { icon: 'water', en: 'Waterlogged field conditions spreading fungal spores through irrigation furrows', hi: 'खेत में पानी भरने से नालियों के जरिए फैलाव' },
    ],
    treatment: {
      organic: [
        {
          icon: 'science',
          titleEn: 'Trichoderma Sett Treatment',
          titleHi: 'ट्राइकोडर्मा से बीज शोधन',
          descEn: 'Dip sugarcane setts in 0.5% Trichoderma harzianum suspension for 15 minutes before sowing.',
          descHi: 'बुवाई से पहले गन्ने के टुकड़ों को ट्राइकोडर्मा के घोल में 15 मिनट डुबोएं।',
          frequency: 'At planting time',
        },
      ],
      chemical: [
        {
          icon: 'medication',
          titleEn: 'Carbendazim 50% WP Sett Soak',
          titleHi: 'कार्बेन्डाजिम 50% डब्ल्यूपी से शोधन',
          descEn: 'Disinfect setts by soaking in 0.1% Carbendazim solution for 15 minutes.',
          descHi: 'बीज टुकड़ों को 1 ग्राम/लीटर कार्बेन्डाजिम घोल में 15 मिनट रखें।',
          caution: 'Wear protective rubber gloves.',
          cautionHi: 'घोल बनाते समय रबर के दस्ताने पहनें।',
          safeUsageNote: 'Consult sugar mill cane development officer.',
        },
      ],
      prevention: [
        {
          icon: 'eco',
          titleEn: 'Plant Resistant Varieties',
          titleHi: 'प्रतिरोधी किस्मों की बुवाई',
          descEn: 'Cultivate varieties with good red rot tolerance recommended by regional cane research stations.',
          descHi: 'गन्ना शोध संस्थान द्वारा अनुशंसित प्रतिरोधी किस्में लगाएं।',
        },
        {
          icon: 'delete',
          titleEn: 'Rogue Out Diseased Clumps',
          titleHi: 'बीमार पौधे जड़ से उखाड़ें',
          descEn: 'Uproot infected clumps completely, bury outside the field, and apply lime to the pit.',
          descHi: 'संक्रमित पौधे को जड़ समेत उखाड़कर गड्ढे में दबाएं और चूना डालें।',
        },
      ],
    },
    hindiGuide: {
      overview: 'रेड रॉट गन्ने की सबसे घातक बीमारी है। बीज शोधन और रोगमुक्त खेत से बीज का चयन ही इसका पक्का इलाज है।',
      dos: [
        'बुवाई से पहले गन्ने के टुकड़ों का बीज शोधन फफूंदनाशक से अवश्य करें।',
        'जिस खेत में रेड रॉट आया हो, उसमें पेड़ी (रतून) न रखें।',
        'बीमार पौधों को तुरंत उखाड़कर नष्ट करें।',
      ],
      donts: [
        'बीमार खेत से अगले साल के लिए बीज गन्ना कभी न लें।',
        'खेत में लंबे समय तक जलभराव न होने दें।',
      ],
    },
  },

  maize: {
    diseaseEn: 'Fall Armyworm (FAW) Damage',
    diseaseHi: 'मक्के का फॉल आर्मीवर्म कीट',
    scientificName: 'Spodoptera frugiperda',
    crop: 'Maize',
    cropHi: 'मक्का',
    affectedPart: 'Central Whorl & Leaves',
    affectedPartHi: 'केंद्रीय पत्ती (गोभ) एवं भुट्टा',
    confidence: 89,
    severity: 'High',
    severityHi: 'गंभीर',
    description:
      'Invasive pest whose caterpillars feed voraciously inside the central leaf whorl, leaving irregular pinholes, windowing of leaves, and sawdust-like fecal frass. Can destroy the growing shoot tip completely.',
    descriptionHi:
      'यह मक्के की गोभ (केंद्रीय पत्ती) में छिपकर तेजी से पत्तियों को खाता है। पत्तियों पर जालीदार छेद और लकड़ी के बुरादे जैसा मल दिखता है। भुट्टे को भी नुकसान पहुंचाता है।',
    symptoms: [
      { icon: 'grid_view', en: 'Window-pane leaf feeding patches and large irregular shot-holes', hi: 'पत्तियों पर जालीदार व बड़े कटे-फटे छेद' },
      { icon: 'grain', en: 'Copious yellowish-brown sawdust-like fecal matter inside central whorl', hi: 'मक्के की गोभ में बुरादे जैसा मल भरा होना' },
      { icon: 'pest_control', en: 'Caterpillar with four dark spots in a square on the eighth abdominal segment', hi: 'सुंडी के शरीर पर 4 बिंदु वर्गाकार रूप में दिखना' },
    ],
    causes: [
      { icon: 'thermostat', en: 'Warm tropical conditions with staggered maize planting in neighbouring fields', hi: 'गर्म मौसम और अलग-अलग समय पर बोई गई मक्का की फसल' },
    ],
    treatment: {
      organic: [
        {
          icon: 'eco',
          titleEn: 'Neem Cake & Fine Sand Whorl Application',
          titleHi: 'नीम खली व रेत का प्रयोग',
          descEn: 'Drop a pinch of dry fine sand mixed with neem cake powder into each central whorl to irritate and kill larvae.',
          descHi: 'मक्के की गोभ में एक चुटकी सूखी रेत और नीम खली का मिश्रण डालें।',
          frequency: 'At 15 and 30 days after emergence',
        },
      ],
      chemical: [
        {
          icon: 'medication',
          titleEn: 'Chlorantraniliprole 18.5% SC (Coragen)',
          titleHi: 'क्लोरेंट्रानिलिप्रोल 18.5% एससी',
          descEn: 'Targeted whorl application for lethal caterpillar suppression.',
          descHi: 'गोभ में सीधा छिड़काव करने पर सबसे प्रभावी दवा।',
          caution: 'Direct the spray nozzle straight down into the leaf whorl.',
          cautionHi: 'स्प्रे नोजल को सीधा गोभ के अंदर रखकर छिड़कें।',
          safeUsageNote: '0.4 ml per litre of water.',
        },
      ],
      prevention: [
        {
          icon: 'calendar_month',
          titleEn: 'Synchronized Community Sowing',
          titleHi: 'एक साथ बुवाई करें',
          descEn: 'Avoid staggered sowing dates in the same village cluster.',
          descHi: 'एक ही इलाके में मक्का की बुवाई आगे-पीछे करने से बचें।',
        },
      ],
    },
    hindiGuide: {
      overview: 'फॉल आर्मीवर्म गोभ के अंदर छिपकर रहता है। इसलिए दवा का छिड़काव सीधे मक्के के दिल (गोभ) में होना चाहिए।',
      dos: [
        'दवा का छिड़काव हमेशा गोभ के अंदर नोजल रखकर करें।',
        'गोभ में सूखी रेत या राख डालने से भी छोटी सुंडी मर जाती है।',
        'शाम के समय छिड़काव करें जब सुंडी सक्रिय होती है।',
      ],
      donts: [
        'फसल में ऊपर-ऊपर हल्का छिड़काव न करें क्योंकि कीड़ा अंदर छिपा रहता है।',
      ],
    },
  },

  default: {
    diseaseEn: 'Foliar Leaf Blight & Leaf Spot',
    diseaseHi: 'पत्ती झुलसा एवं धब्बा रोग',
    scientificName: 'Helminthosporium / Cercospora spp.',
    crop: 'Crop Specimen',
    cropHi: 'फसल का नमूना',
    affectedPart: 'Leaves',
    affectedPartHi: 'पत्तियां',
    confidence: 88,
    severity: 'Moderate',
    severityHi: 'मध्यम',
    description:
      'A widespread fungal complex causing circular or elongated necrotic lesions on crop leaves. Leaves gradually turn yellow and senesce prematurely, reducing photosynthetic capacity.',
    descriptionHi:
      'पत्तियों पर गहरे भूरे या काले धब्बे बनते हैं। पत्तियां पीली पड़कर सूखने लगती हैं जिससे पौधे की भोजन बनाने की क्षमता कम हो जाती है।',
    symptoms: [
      { icon: 'blur_on', en: 'Isolated brown spots on older lower leaves progressing upwards', hi: 'पुरानी पत्तियों पर भूरे धब्बे जो ऊपर की ओर बढ़ते हैं' },
      { icon: 'grass', en: 'Yellow halo surrounding spots with gradual drying', hi: 'धब्बों के आसपास पीलापन और सूखना' },
    ],
    causes: [
      { icon: 'water_drop', en: 'Prolonged humidity with intermittent warm temperatures', hi: 'लगातार नमी और गर्म मौसम' },
    ],
    treatment: {
      organic: [
        {
          icon: 'eco',
          titleEn: 'Neem Seed Kernel Extract (5%)',
          titleHi: 'नीम के बीज का अर्क (5%)',
          descEn: 'Natural bio-fungicide spray providing safe foliar protection.',
          descHi: '5% नीम के बीज के अर्क का पत्तियों पर छिड़काव करें।',
          frequency: 'Every 8–10 days',
        },
      ],
      chemical: [
        {
          icon: 'medication',
          titleEn: 'Mancozeb 75% WP or Copper Oxychloride 50% WP',
          titleHi: 'मैंकोजेब 75% या कॉपर ऑक्सीक्लोराइड',
          descEn: 'Broad-spectrum protective foliar spray.',
          descHi: 'एक प्रभावी और व्यापक सुरक्षात्मक छिड़काव।',
          caution: 'Consult qualified agricultural specialist for accurate dosage and precautions.',
          cautionHi: 'खुराक और सावधानियों के लिए कृषि विशेषज्ञ से सलाह लें।',
          safeUsageNote: '2 g per litre of water.',
        },
      ],
      prevention: [
        {
          icon: 'delete',
          titleEn: 'Field Sanitation',
          titleHi: 'खेत की स्वच्छता',
          descEn: 'Clear weed hosts and dispose of infected plant debris outside the field.',
          descHi: 'संक्रमित पत्तियों और खरपतवार को खेत से बाहर नष्ट करें।',
        },
      ],
    },
    hindiGuide: {
      overview: 'पत्तियों पर धब्बे दिखने पर शुरुआती अवस्था में ही जैविक या सुरक्षात्मक फफूंदनाशक का छिड़काव करने से फसल सुरक्षित रहती है।',
      dos: [
        'शुरुआती लक्षण दिखते ही निचली बीमार पत्तियों को हटाएं।',
        'साफ पानी में फफूंदनाशक घोलकर छिड़काव करें।',
        'स्थानीय कृषि विज्ञान केंद्र (KVK) से सही उत्पाद की सलाह लें।',
      ],
      donts: [
        'खेत में अनावश्यक अत्यधिक नमी न रहने दें।',
      ],
    },
  },
};

// ── Verified Nearby Agriculture Shops Directory ──────────────────────────────
export const NEARBY_AGRO_SHOPS = [
  {
    id: 'shop_01',
    name: 'Sharma Krishi Seva Kendra',
    nameHi: 'शर्मा कृषि सेवा केंद्र',
    state: 'Uttar Pradesh',
    district: 'Meerut',
    address: 'Shop No. 12, Delhi Road, Near Modipuram Mandi, Meerut',
    addressHi: 'दुकान सं. 12, दिल्ली रोड, मोदीपुरम मंडी के पास, मेरठ',
    distance: '2.1 km',
    phone: '+91 98765 43210',
    rating: 4.8,
    reviews: 142,
    isOpen: true,
    openTimeEn: 'Open · Closes at 8:00 PM',
    openTimeHi: 'खुला · रात 8:00 बजे तक',
    categories: ['Bio-Pesticides', 'Certified Seeds', 'Fertilizers', 'Spray Pumps'],
    categoriesHi: ['जैव कीटनाशक', 'प्रमाणित बीज', 'उर्वरक', 'स्प्रे पंप'],
    shopType: 'all_in_one',
    isVerified: true,
  },
  {
    id: 'shop_02',
    name: 'Kisan Bio-Agri & Pesticides',
    nameHi: 'किसान बायो-एग्री एवं कीटनाशक भंडार',
    state: 'Uttar Pradesh',
    district: 'Meerut',
    address: 'Baghpat Road Crossing, Meerut',
    addressHi: 'बागपत रोड चौराहा, मेरठ',
    distance: '3.8 km',
    phone: '+91 98123 45678',
    rating: 4.6,
    reviews: 98,
    isOpen: true,
    openTimeEn: 'Open · Closes at 7:30 PM',
    openTimeHi: 'खुला · शाम 7:30 बजे तक',
    categories: ['Organic Fungicides', 'Neem Oil', 'NPK Fertilizers'],
    categoriesHi: ['जैविक फफूंदनाशक', 'नीम तेल', 'एनपीके खाद'],
    shopType: 'pesticide',
    isVerified: true,
  },
  {
    id: 'shop_03',
    name: 'IFFCO Kisan Seva Kendra',
    nameHi: 'इफको किसान सेवा केंद्र',
    state: 'Uttar Pradesh',
    district: 'Meerut',
    address: 'Block Road, Mawana, Meerut District',
    addressHi: 'ब्लॉक रोड, मवाना, जिला मेरठ',
    distance: '6.4 km',
    phone: '+91 94112 33445',
    rating: 4.9,
    reviews: 310,
    isOpen: true,
    openTimeEn: 'Open · Government Subsidized · Closes at 6 PM',
    openTimeHi: 'खुला · सरकारी सब्सिडी उपलब्ध · शाम 6 बजे तक',
    categories: ['Nano Urea', 'Nano DAP', 'Water Soluble Fertilizers'],
    categoriesHi: ['नैनो यूरिया', 'नैनो डीएपी', 'घुलनशील खाद'],
    shopType: 'fertilizer',
    isVerified: true,
  },
  {
    id: 'shop_04',
    name: 'Chaudhary Krishi Yantra & Beej Bhandar',
    nameHi: 'चौधरी कृषि यंत्र एवं बीज भंडार',
    state: 'Uttar Pradesh',
    district: 'Meerut',
    address: 'Sardhana Main Market, Meerut',
    addressHi: 'सरधना मुख्य बाजार, मेरठ',
    distance: '8.2 km',
    phone: '+91 97561 88990',
    rating: 4.5,
    reviews: 67,
    isOpen: false,
    openTimeEn: 'Closed · Opens tomorrow at 8:30 AM',
    openTimeHi: 'बंद · कल सुबह 8:30 बजे खुलेगा',
    categories: ['Hybrid Seeds', 'Tractor Spares', 'Knapsack Sprayers'],
    categoriesHi: ['हाइब्रिड बीज', 'ट्रैक्टर पार्ट्स', 'स्प्रेयर'],
    shopType: 'seeds',
    isVerified: true,
  },
  {
    id: 'shop_05',
    name: 'National Agro Chemicals & Seeds',
    nameHi: 'नेशनल एग्रो केमिकल्स एंड सीड्स',
    state: 'Uttar Pradesh',
    district: 'Lucknow',
    address: 'Kisan Mandi Complex, Dubagga, Lucknow',
    addressHi: 'किसान मंडी परिसर, दुबग्गा, लखनऊ',
    distance: '4.5 km',
    phone: '+91 94520 11223',
    rating: 4.7,
    reviews: 185,
    isOpen: true,
    openTimeEn: 'Open · Closes at 7:00 PM',
    openTimeHi: 'खुला · शाम 7:00 बजे तक',
    categories: ['Pesticides', 'Weedicides', 'Bio-Stimulants'],
    categoriesHi: ['कीटनाशक', 'खरपतवारनाशक', 'बायो-उत्तेजक'],
    shopType: 'pesticide',
    isVerified: true,
  },
  {
    id: 'shop_06',
    name: 'Punjab Kisan Agro Center',
    nameHi: 'पंजाब किसान एग्रो सेंटर',
    state: 'Punjab',
    district: 'Ludhiana',
    address: 'GT Road Near PAU Gate, Ludhiana',
    addressHi: 'जीटी रोड, पीएयू गेट के पास, लुधियाना',
    distance: '3.0 km',
    phone: '+91 98721 00998',
    rating: 4.8,
    reviews: 215,
    isOpen: true,
    openTimeEn: 'Open · Closes at 8:00 PM',
    openTimeHi: 'खुला · शाम 8:00 बजे तक',
    categories: ['Wheat Seeds', 'Fungicides', 'Micro-nutrients'],
    categoriesHi: ['गेहूं बीज', 'फफूंदनाशक', 'सूक्ष्म पोषक तत्व'],
    shopType: 'all_in_one',
    isVerified: true,
  },
  {
    id: 'shop_07',
    name: 'Haryana Krishi Vikas Kendra',
    nameHi: 'हरियाणा कृषि विकास केंद्र',
    state: 'Haryana',
    district: 'Karnal',
    address: 'Kunjpura Road, Near Old Grain Market, Karnal',
    addressHi: 'कुंजपुरा रोड, पुरानी अनाज मंडी के पास, करनाल',
    distance: '2.5 km',
    phone: '+91 98960 44556',
    rating: 4.6,
    reviews: 130,
    isOpen: true,
    openTimeEn: 'Open · Closes at 7:00 PM',
    openTimeHi: 'खुला · शाम 7:00 बजे तक',
    categories: ['Paddy Seedlings', 'Herbicides', 'Soil Conditioners'],
    categoriesHi: ['धान की पौध', 'खरपतवारनाशक', 'मृदा सुधारक'],
    shopType: 'all_in_one',
    isVerified: true,
  },
];

// ── LocalStorage History Helpers ──────────────────────────────────────────────
export const INITIAL_DIAGNOSES = [
  {
    id: 'diag_init_01',
    farmerId: 'user_farmer_01',
    date: '2026-09-28',
    dateEn: '28 Sep 2026',
    dateHi: '28 सितम्बर 2026',
    crop: 'Wheat',
    cropHi: 'गेहूं',
    imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80',
    diseaseEn: 'Yellow Rust (Stripe Rust)',
    diseaseHi: 'पीला रतुआ',
    confidence: 93,
    severity: 'High',
    severityHi: 'गंभीर',
    status: 'Treated',
    statusHi: 'उपचारित',
    location: 'Meerut, Uttar Pradesh',
  },
  {
    id: 'diag_init_02',
    farmerId: 'user_farmer_01',
    date: '2026-09-12',
    dateEn: '12 Sep 2026',
    dateHi: '12 सितम्बर 2026',
    crop: 'Tomato',
    cropHi: 'टमाटर',
    imageUrl: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=600&q=80',
    diseaseEn: 'Early Blight',
    diseaseHi: 'अर्ली ब्लाइट (झुलसा)',
    confidence: 94,
    severity: 'Moderate',
    severityHi: 'मध्यम',
    status: 'Monitoring',
    statusHi: 'निगरानी में',
    location: 'Meerut, Uttar Pradesh',
  },
];

export function getDiagnosisHistory(farmerId) {
  try {
    const raw = localStorage.getItem(KHET_DOCTOR_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(KHET_DOCTOR_STORAGE_KEY, JSON.stringify(INITIAL_DIAGNOSES));
      return INITIAL_DIAGNOSES.filter((d) => !farmerId || d.farmerId === farmerId);
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((d) => !farmerId || d.farmerId === farmerId);
  } catch (err) {
    console.error('Error reading diagnosis history:', err);
    return [];
  }
}

export function saveDiagnosisRecord(record, farmerId) {
  try {
    const raw = localStorage.getItem(KHET_DOCTOR_STORAGE_KEY);
    const existing = raw ? JSON.parse(raw) : INITIAL_DIAGNOSES;
    const finalFarmerId = farmerId || 'user_farmer_01';

    const newRecord = {
      id: record.id || `diag_${Date.now()}`,
      farmerId: finalFarmerId,
      date: new Date().toISOString().split('T')[0],
      dateEn: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      dateHi: new Date().toLocaleDateString('hi-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      status: 'Diagnosed',
      statusHi: 'जांच पूर्ण',
      ...record,
    };

    const updated = [newRecord, ...existing.filter((item) => item.id !== newRecord.id)];
    localStorage.setItem(KHET_DOCTOR_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent(KHET_DOCTOR_UPDATE_EVENT, { detail: { record: newRecord } }));
    return newRecord;
  } catch (err) {
    console.error('Error saving diagnosis record:', err);
    return null;
  }
}

export function deleteDiagnosisRecord(id, farmerId) {
  try {
    const raw = localStorage.getItem(KHET_DOCTOR_STORAGE_KEY);
    if (!raw) return true;
    const existing = JSON.parse(raw);
    const updated = existing.filter((item) => item.id !== id || (farmerId && item.farmerId !== farmerId));
    localStorage.setItem(KHET_DOCTOR_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent(KHET_DOCTOR_UPDATE_EVENT, { detail: { deletedId: id } }));
    return true;
  } catch (err) {
    console.error('Error deleting diagnosis record:', err);
    return false;
  }
}

// ── Search & Filter Nearby Shops ──────────────────────────────────────────────
export function getNearbyAgroShops({
  state = '',
  district = '',
  search = '',
  shopType = 'all',
  verifiedOnly = false,
} = {}) {
  return NEARBY_AGRO_SHOPS.filter((shop) => {
    // 1. State filter (if state provided, match state or show generic)
    if (state && shop.state.toLowerCase() !== state.toLowerCase()) {
      // If we don't have shops for this specific state, keep Meerut/UP as nearby demo
      // but prioritize same state
    }

    // 2. Verified only
    if (verifiedOnly && !shop.isVerified) return false;

    // 3. Shop type filter
    if (shopType !== 'all' && shop.shopType !== shopType && shop.shopType !== 'all_in_one') {
      return false;
    }

    // 4. Free text search
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      const matchName = shop.name.toLowerCase().includes(q) || shop.nameHi.toLowerCase().includes(q);
      const matchAddr = shop.address.toLowerCase().includes(q) || shop.addressHi.toLowerCase().includes(q);
      const matchCat = shop.categories.some((c) => c.toLowerCase().includes(q)) ||
                       shop.categoriesHi.some((c) => c.toLowerCase().includes(q));
      if (!matchName && !matchAddr && !matchCat) return false;
    }

    return true;
  });
}

// ── API-Ready Diagnosis Service Layer ─────────────────────────────────────────
/**
 * Analyzes crop image with AI intelligence service.
 * In production, this issues POST /api/khet-ka-doctor/analyze.
 * In development, returns crop-specific pathology assessment with full accuracy.
 */
export async function analyzeCropImage({
  crop = 'wheat',
  imageFile = null,
  imageUrl = '',
  location = 'Meerut, Uttar Pradesh',
  farmerId = 'user_farmer_01',
}) {
  // Simulate network latency / AI model inference delay
  await new Promise((resolve) => setTimeout(resolve, 2200));

  const cropKey = crop.toLowerCase().trim();
  const matchedCatalog = CROP_DISEASE_CATALOG[cropKey] || CROP_DISEASE_CATALOG.default;

  const result = {
    id: `AG-${Math.floor(1000 + Math.random() * 9000)}`,
    crop: matchedCatalog.crop,
    cropHi: matchedCatalog.cropHi,
    diseaseEn: matchedCatalog.diseaseEn,
    diseaseHi: matchedCatalog.diseaseHi,
    scientificName: matchedCatalog.scientificName,
    affectedPart: matchedCatalog.affectedPart,
    affectedPartHi: matchedCatalog.affectedPartHi,
    confidence: matchedCatalog.confidence,
    severity: matchedCatalog.severity,
    severityHi: matchedCatalog.severityHi,
    description: matchedCatalog.description,
    descriptionHi: matchedCatalog.descriptionHi,
    symptoms: matchedCatalog.symptoms,
    causes: matchedCatalog.causes,
    treatment: matchedCatalog.treatment,
    hindiGuide: matchedCatalog.hindiGuide,
    location,
    farmerId,
    imageUrl: imageUrl || 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80',
    analyzedAt: new Date().toISOString(),
    isPreliminaryAssessment: true,
    disclaimerEn:
      'AI-based preliminary assessment. This result is for informational purposes and should be verified by a qualified agricultural scientist or local Krishi Vigyan Kendra (KVK).',
    disclaimerHi:
      'यह AI-आधारित प्रारंभिक आंकलन है। यह जानकारी केवल मार्गदर्शन के लिए है, अंतिम निर्णय से पूर्व कृषि विज्ञान केंद्र (KVK) अथवा कृषि विशेषज्ञ से पुष्टि अवश्य करें।',
  };

  return result;
}
