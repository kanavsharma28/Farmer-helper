// ─── Seed / demo resources (always visible in the marketplace) ──────────────
export const SEED_RESOURCES = [
  {
    id: 'seed_res_01',
    // ownerId matches the preset Provider login (user_provider_01 = Sardar Gurpreet Singh)
    // so Farmer→Provider chat demo works out of the box
    ownerId: 'user_provider_01',
    ownerRole: 'provider',
    ownerName: 'Sardar Gurpreet Singh',
    ownerPhone: '9788665544',
    category: 'tractors',
    titleEn: 'Mahindra 575 DI Tractor',
    titleHi: 'महिंद्रा 575 डीआई ट्रैक्टर',
    ownerEn: 'Sardar Gurpreet Singh',
    ownerHi: 'सरदार गुरप्रीत सिंह',
    locationEn: 'Khanna Road, Meerut',
    locationHi: 'खन्ना रोड, मेरठ',
    distanceEn: '2.4 km away',
    distanceHi: '2.4 किमी दूर',
    price: 1200,
    unitEn: '/day',
    unitHi: '/दिन',
    rating: 4.8,
    reviewsCount: 34,
    icon: 'directions_car',
    verified: true,
    available: true,
    descEn: '45 HP heavy duty tractor equipped with trolley hitch and cultivator. Fuel efficient and ready for immediate field plowing.',
    descHi: '45 एचपी का शक्तिशाली ट्रैक्टर ट्रॉली और कल्टीवेटर के साथ उपलब्ध। तुरंत जुताई कार्य के लिए तैयार।',
    createdAt: '2026-08-01T10:00:00Z',
    isSeed: true,
  },
  {
    id: 'seed_res_02',
    ownerId: 'res_owner_ramesh_02',
    ownerRole: 'provider',
    ownerName: 'Ramesh Labour Chokhat',
    ownerPhone: '9812233445',
    category: 'labour',
    titleEn: 'Wheat Harvesting Labour Squad',
    titleHi: 'गेहूं कटाई मजदूर टीम',
    ownerEn: 'Ramesh Labour Chokhat',
    ownerHi: 'रमेश लेबर चौकहाट',
    locationEn: 'Modinagar, Meerut',
    locationHi: 'मोदीनगर, मेरठ',
    distanceEn: '4.1 km away',
    distanceHi: '4.1 किमी दूर',
    price: 450,
    unitEn: '/worker/day',
    unitHi: '/मजदूर/दिन',
    rating: 4.9,
    reviewsCount: 52,
    icon: 'engineering',
    verified: true,
    available: true,
    descEn: 'Experienced 12-member farm labour team specialized in crop harvesting, thresher loading, and bundling.',
    descHi: 'अनुभवी 12 सदस्यीय कृषि मजदूर टीम जो कटाई, थ्रेशर लोडिंग और बंडल बांधने में माहिर है।',
    createdAt: '2026-08-05T09:00:00Z',
    isSeed: true,
  },
  {
    id: 'seed_res_03',
    ownerId: 'res_owner_kisan_seva_03',
    ownerRole: 'provider',
    ownerName: 'Kisan Krishi Seva',
    ownerPhone: '9988001122',
    category: 'machines',
    titleEn: 'High Pressure Battery Sprayer',
    titleHi: 'हाई प्रेशर बैटरी स्प्रे मशीन',
    ownerEn: 'Kisan Krishi Seva',
    ownerHi: 'किसान कृषि सेवा केंद्र',
    locationEn: 'Main Mandi Shop #12',
    locationHi: 'मुख्य मंडी दुकान सं. 12',
    distanceEn: '1.8 km away',
    distanceHi: '1.8 किमी दूर',
    price: 600,
    unitEn: '/day',
    unitHi: '/दिन',
    rating: 4.6,
    reviewsCount: 19,
    icon: 'pest_control',
    verified: true,
    available: true,
    descEn: '16 Litre dual-nozzle battery sprayer with telescopic brass lance. Ideal for pesticide and liquid fertilizer spray.',
    descHi: '16 लीटर दोहरे नोजल वाली बैटरी स्प्रे मशीन। कीटनाशक और तरल उर्वरक छिड़काव के लिए आदर्श।',
    createdAt: '2026-08-10T11:00:00Z',
    isSeed: true,
  },
  {
    id: 'seed_res_04',
    ownerId: 'res_owner_sukhwinder_04',
    ownerRole: 'provider',
    ownerName: 'Sukhwinder Singh',
    ownerPhone: '9855667788',
    category: 'tractors',
    titleEn: 'Swaraj 744 FE with Rotavator',
    titleHi: 'स्वराज 744 एफई रोटावेटर के साथ',
    ownerEn: 'Sukhwinder Singh',
    ownerHi: 'सुखविंदर सिंह',
    locationEn: 'Sardhana, Meerut',
    locationHi: 'सरधना, मेरठ',
    distanceEn: '5.2 km away',
    distanceHi: '5.2 किमी दूर',
    price: 1500,
    unitEn: '/day',
    unitHi: '/दिन',
    rating: 4.7,
    reviewsCount: 28,
    icon: 'directions_car',
    verified: true,
    available: true,
    descEn: '48 HP Swaraj tractor paired with 7-feet multi-speed rotavator. Best for fine seedbed preparation.',
    descHi: '48 एचपी का स्वराज ट्रैक्टर 7-फिट रोटावेटर के साथ। खेत की बढ़िया जुताई और समतलीकरण के लिए उपयुक्त।',
    createdAt: '2026-08-12T08:00:00Z',
    isSeed: true,
  },
  {
    id: 'seed_res_05',
    ownerId: 'res_owner_vikash_05',
    ownerRole: 'provider',
    ownerName: 'Vikash Kumar',
    ownerPhone: '9776554433',
    category: 'labour',
    titleEn: 'Sugarcane Harvesting Team',
    titleHi: 'गन्ना छिलाई एवं कटाई टीम',
    ownerEn: 'Vikash Kumar',
    ownerHi: 'विकास कुमार',
    locationEn: 'Hastinapur, Meerut',
    locationHi: 'हस्तिनापुर, मेरठ',
    distanceEn: '3.5 km away',
    distanceHi: '3.5 किमी दूर',
    price: 500,
    unitEn: '/worker/day',
    unitHi: '/मजदूर/दिन',
    rating: 4.8,
    reviewsCount: 41,
    icon: 'engineering',
    verified: true,
    available: true,
    descEn: 'Hardworking 8-member team specialized in sugarcane cutting, stripping, and sugar mill truck loading.',
    descHi: 'गन्ना कटाई, छिलाई और मिल ट्रक लोडिंग में कुशल 8 मजदूरों का दल।',
    createdAt: '2026-08-15T07:00:00Z',
    isSeed: true,
  },
  {
    id: 'seed_res_06',
    ownerId: 'res_owner_greenearth_06',
    ownerRole: 'provider',
    ownerName: 'GreenEarth Organics',
    ownerPhone: '9811990088',
    category: 'fertilizers',
    titleEn: 'Organic Neem Cake Bio-Fertilizer',
    titleHi: 'जैविक नीम खली खाद',
    ownerEn: 'GreenEarth Organics',
    ownerHi: 'ग्रीन अर्थ ऑर्गेनिक स्टोर',
    locationEn: 'Industrial Area, Meerut',
    locationHi: 'इंडस्ट्रियल एरिया, मेरठ',
    distanceEn: '2.9 km away',
    distanceHi: '2.9 किमी दूर',
    price: 850,
    unitEn: '/50kg bag',
    unitHi: '/50किग्रा बोरी',
    rating: 4.9,
    reviewsCount: 63,
    icon: 'science',
    verified: true,
    available: true,
    descEn: 'Pure cold-pressed neem cake powder. Enriches soil organic matter and protects roots from nematodes and grubs.',
    descHi: 'शुद्ध नीम खली पाउडर। मिट्टी की उर्वरता बढ़ाता है और दीमक व कीटों से जड़ों की रक्षा करता है।',
    createdAt: '2026-08-18T10:00:00Z',
    isSeed: true,
  },
  {
    id: 'seed_res_07',
    ownerId: 'res_owner_nsc_07',
    ownerRole: 'provider',
    ownerName: 'NSC Approved Seed Center',
    ownerPhone: '9900112233',
    category: 'seeds',
    titleEn: 'Certified Basmati 1121 Paddy Seeds',
    titleHi: 'प्रमाणित बासमती 1121 धान बीज',
    ownerEn: 'NSC Approved Seed Center',
    ownerHi: 'राष्ट्रीय बीज निगम प्रमाणित केंद्र',
    locationEn: 'KVK Complex, Meerut',
    locationHi: 'केवीके परिसर, मेरठ',
    distanceEn: '1.5 km away',
    distanceHi: '1.5 किमी दूर',
    price: 1100,
    unitEn: '/10kg pack',
    unitHi: '/10किग्रा पैकेट',
    rating: 5.0,
    reviewsCount: 85,
    icon: 'grain',
    verified: true,
    available: true,
    descEn: '98% germination rate certified seed treated with fungicide. High yield aroma grain variety.',
    descHi: '98% अंकुरण क्षमता वाला रोग-उपचारित प्रमाणित बीज। उच्च पैदावार और खुशबूदार बासमती किस्म।',
    createdAt: '2026-08-20T09:00:00Z',
    isSeed: true,
  },
  {
    id: 'seed_res_08',
    ownerId: 'res_owner_chaudhary_08',
    ownerRole: 'provider',
    ownerName: 'Chaudhary Farm Services',
    ownerPhone: '9867453210',
    category: 'machines',
    titleEn: 'Tractor Mounted Boom Sprayer',
    titleHi: 'ट्रैक्टर माउंटेड बूम स्प्रेयर',
    ownerEn: 'Chaudhary Farm Services',
    ownerHi: 'चौधरी फार्म सर्विसेज',
    locationEn: 'Bypass Highway, Meerut',
    locationHi: 'बायपास हाईवे, मेरठ',
    distanceEn: '6.0 km away',
    distanceHi: '6.0 किमी दूर',
    price: 950,
    unitEn: '/day',
    unitHi: '/दिन',
    rating: 4.5,
    reviewsCount: 14,
    icon: 'agriculture',
    verified: true,
    available: true,
    descEn: '400 Litre tank with 12-meter folding spray boom. Covers 10 acres per hour easily.',
    descHi: '400 लीटर टैंक और 12 मीटर स्प्रे बूम। एक घंटे में 10 एकड़ फसल स्प्रे करने में सक्षम।',
    createdAt: '2026-08-22T11:00:00Z',
    isSeed: true,
  },
];

const STORAGE_KEY = 'farmer_helper_all_resources';

// ─── Retrieve resources from localStorage (merging seed resources) ────────────
export function getStoredResources() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Ensure seed resources are always present
        const existingIds = new Set(parsed.map((r) => r.id));
        const missingSeeds = SEED_RESOURCES.filter((s) => !existingIds.has(s.id));
        if (missingSeeds.length > 0) {
          const merged = [...parsed, ...missingSeeds];
          saveStoredResources(merged);
          return merged;
        }
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error reading resources from localStorage:', err);
  }
  return [...SEED_RESOURCES];
}

// ─── Persist resources to localStorage ───────────────────────────────────────
export function saveStoredResources(resources) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(resources));
  } catch (err) {
    console.error('Error saving resources to localStorage:', err);
  }
}

// Category icon map — shared utility
export const CATEGORY_ICON_MAP = {
  tractors: 'directions_car',
  labour: 'engineering',
  machines: 'pest_control',
  seeds: 'grain',
  fertilizers: 'science',
};

// Keep backward compat export used by other files
export const initialResources = SEED_RESOURCES;
