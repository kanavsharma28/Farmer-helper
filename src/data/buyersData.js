// ─── Best Buyers / Marketplace — Data Layer ──────────────────────────────────
// Pattern mirrors resourceContent.js (SEED + localStorage persistence).

const BUYERS_STORAGE_KEY = 'farmer_helper_all_buyers';

// ── Seed / demo buyers (always visible in the marketplace) ───────────────────
export const SEED_BUYERS = [
  {
    id: 'buyer_seed_01',
    ownerId: 'user_buyer_01',                    // maps to preset Buyer login
    ownerRole: 'buyer',
    businessName: 'Kisan Mandi Agro Traders',
    businessNameHi: 'किसान मंडी एग्रो ट्रेडर्स',
    contactPerson: 'Vikram Sharma',
    contactPersonHi: 'विक्रम शर्मा',
    buyerType: 'Wholesale Trader & Processor',
    buyerTypeHi: 'थोक व्यापारी एवं प्रोसेसर',
    buyerCategory: 'wholesaler',
    phone: '9988776655',
    email: 'vikram@kisanmanditraders.com',
    locationEn: 'Khanna Mandi, Meerut, Uttar Pradesh',
    locationHi: 'खन्ना मंडी, मेरठ, उत्तर प्रदेश',
    distanceEn: '2.8 km away',
    distanceHi: '2.8 किमी दूर',
    rating: 4.8,
    reviewsCount: 128,
    verified: true,
    cropsPurchased: ['Wheat', 'Rice', 'Pulses', 'Soybean'],
    cropsPurchasedHi: ['गेहूं', 'चावल', 'दालें', 'सोयाबीन'],
    currentRequirement: 'Wheat — 500+ Quintals, Immediate',
    currentRequirementHi: 'गेहूं — 500+ क्विंटल, तुरंत',
    minQuantity: '50 Quintals',
    minQuantityHi: '50 क्विंटल',
    paymentTerms: 'Same-day / Next-day settlement',
    paymentTermsHi: 'उसी दिन / अगले दिन भुगतान',
    buyingFrequency: 'Daily',
    buyingFrequencyHi: 'दैनिक',
    descEn: 'Established wholesale trader & processor with 15+ years of experience. Direct purchase from farm gate at competitive prices. GST-compliant invoices provided.',
    descHi: '15+ वर्षों के अनुभव के साथ स्थापित थोक व्यापारी। खेत से सीधी खरीदी, प्रतिस्पर्धी भाव। GST अनुपालन बिल प्रदान किए जाते हैं।',
    icon: 'storefront',
    gstNumber: '09AAACK1234M1Z5',
    createdAt: '2026-07-01T10:00:00Z',
    isSeed: true,
  },
  {
    id: 'buyer_seed_02',
    ownerId: 'res_owner_mandi_02',
    ownerRole: 'buyer',
    businessName: 'Ganga Yamuna Grain Mandi',
    businessNameHi: 'गंगा यमुना अनाज मंडी',
    contactPerson: 'Suresh Agarwal',
    contactPersonHi: 'सुरेश अग्रवाल',
    buyerType: 'Mandi / Commission Agent',
    buyerTypeHi: 'मंडी / आढ़ती',
    buyerCategory: 'mandi',
    phone: '9812300011',
    email: 'ganga.yamuna.mandi@gmail.com',
    locationEn: 'Hapur Road, Ghaziabad, UP',
    locationHi: 'हापुड़ रोड, गाजियाबाद, UP',
    distanceEn: '14.2 km away',
    distanceHi: '14.2 किमी दूर',
    rating: 4.6,
    reviewsCount: 89,
    verified: true,
    cropsPurchased: ['Wheat', 'Paddy', 'Maize', 'Barley', 'Millets'],
    cropsPurchasedHi: ['गेहूं', 'धान', 'मक्का', 'जौ', 'बाजरा'],
    currentRequirement: 'Paddy — 1000 Quintals',
    currentRequirementHi: 'धान — 1000 क्विंटल',
    minQuantity: '20 Quintals',
    minQuantityHi: '20 क्विंटल',
    paymentTerms: '2–3 business days',
    paymentTermsHi: '2–3 कार्य दिवस',
    buyingFrequency: 'Weekly',
    buyingFrequencyHi: 'साप्ताहिक',
    descEn: 'Licensed government-approved mandi operating since 1998. Transparent auction process with immediate loading facilities. Serving 500+ farmers across Hapur & Ghaziabad.',
    descHi: '1998 से संचालित सरकारी-अनुमोदित लाइसेंसी मंडी। पारदर्शी नीलामी प्रक्रिया। 500+ किसानों की सेवा।',
    icon: 'warehouse',
    createdAt: '2026-07-15T09:00:00Z',
    isSeed: true,
  },
  {
    id: 'buyer_seed_03',
    ownerId: 'res_owner_food_03',
    ownerRole: 'buyer',
    businessName: 'AgroVeda Food Processors Pvt Ltd',
    businessNameHi: 'एग्रोवेदा फूड प्रोसेसर्स प्रा. लि.',
    contactPerson: 'Priya Mehta',
    contactPersonHi: 'प्रिया मेहता',
    buyerType: 'Food Processor / Exporter',
    buyerTypeHi: 'खाद्य प्रोसेसर / निर्यातक',
    buyerCategory: 'processor',
    phone: '9977665544',
    email: 'procurement@agroveda.in',
    locationEn: 'UPSIDC Industrial Area, Meerut',
    locationHi: 'UPSIDC औद्योगिक क्षेत्र, मेरठ',
    distanceEn: '5.6 km away',
    distanceHi: '5.6 किमी दूर',
    rating: 4.9,
    reviewsCount: 211,
    verified: true,
    cropsPurchased: ['Potato', 'Tomato', 'Onion', 'Carrot', 'Peas'],
    cropsPurchasedHi: ['आलू', 'टमाटर', 'प्याज', 'गाजर', 'मटर'],
    currentRequirement: 'Potato — 2000 Quintals (Grade A)',
    currentRequirementHi: 'आलू — 2000 क्विंटल (ग्रेड A)',
    minQuantity: '100 Quintals',
    minQuantityHi: '100 क्विंटल',
    paymentTerms: '7-day credit or advance on contract',
    paymentTermsHi: '7 दिन क्रेडिट या अनुबंध पर अग्रिम',
    buyingFrequency: 'Seasonal',
    buyingFrequencyHi: 'मौसमी',
    descEn: 'ISO-certified food processing unit supplying to major national retail chains and export markets. Premium prices for Grade-A produce with quality grading on-site.',
    descHi: 'ISO-प्रमाणित खाद्य प्रसंस्करण इकाई। राष्ट्रीय रिटेल चेन और निर्यात बाजारों को आपूर्ति। ग्रेड-A उपज के लिए प्रीमियम मूल्य।',
    icon: 'factory',
    createdAt: '2026-08-01T08:00:00Z',
    isSeed: true,
  },
  {
    id: 'buyer_seed_04',
    ownerId: 'res_owner_sugar_04',
    ownerRole: 'buyer',
    businessName: 'Sardar Cooperative Sugar Mills',
    businessNameHi: 'सरदार सहकारी शुगर मिल',
    contactPerson: 'Harpinder Bhatia',
    contactPersonHi: 'हरपिंदर भाटिया',
    buyerType: 'Sugar Mill / Cooperative',
    buyerTypeHi: 'शुगर मिल / सहकारी',
    buyerCategory: 'cooperative',
    phone: '9855442211',
    email: 'harpinder@sardarsugarmills.com',
    locationEn: 'Muzaffarnagar, Uttar Pradesh',
    locationHi: 'मुजफ्फरनगर, उत्तर प्रदेश',
    distanceEn: '38 km away',
    distanceHi: '38 किमी दूर',
    rating: 4.4,
    reviewsCount: 302,
    verified: true,
    cropsPurchased: ['Sugarcane'],
    cropsPurchasedHi: ['गन्ना'],
    currentRequirement: 'Sugarcane — Unlimited quantity during crushing season',
    currentRequirementHi: 'गन्ना — पेराई मौसम में असीमित मात्रा',
    minQuantity: 'No minimum (farm gate pickup)',
    minQuantityHi: 'कोई न्यूनतम नहीं (खेत से उठान)',
    paymentTerms: 'Fortnightly (as per UP Cane Price Policy)',
    paymentTermsHi: '15 दिन में (UP गन्ना मूल्य नीति अनुसार)',
    buyingFrequency: 'Seasonal (Oct–April)',
    buyingFrequencyHi: 'मौसमी (अक्टू–अप्रैल)',
    descEn: 'Government-recognized cooperative sugar mill with dedicated sugarcane purchase centers across UP. Transparent slips and direct bank transfers as per state SAP.',
    descHi: 'सरकार-मान्यता प्राप्त सहकारी शुगर मिल। पूरे UP में गन्ना खरीद केंद्र। पारदर्शी पर्ची और सीधे बैंक ट्रांसफर।',
    icon: 'local_drink',
    createdAt: '2026-06-01T07:00:00Z',
    isSeed: true,
  },
  {
    id: 'buyer_seed_05',
    ownerId: 'res_owner_retail_05',
    ownerRole: 'buyer',
    businessName: 'FreshMart Organic Retail Chain',
    businessNameHi: 'फ्रेशमार्ट ऑर्गेनिक रिटेल',
    contactPerson: 'Ananya Srivastava',
    contactPersonHi: 'अनन्या श्रीवास्तव',
    buyerType: 'Organic Retailer / Direct Buyer',
    buyerTypeHi: 'ऑर्गेनिक रिटेलर / डायरेक्ट बायर',
    buyerCategory: 'retailer',
    phone: '9911223344',
    email: 'ananya@freshmart.in',
    locationEn: 'Civil Lines, Meerut',
    locationHi: 'सिविल लाइंस, मेरठ',
    distanceEn: '3.4 km away',
    distanceHi: '3.4 किमी दूर',
    rating: 4.7,
    reviewsCount: 63,
    verified: true,
    cropsPurchased: ['Vegetables', 'Fruits', 'Organic Wheat', 'Pulses', 'Herbs'],
    cropsPurchasedHi: ['सब्जियां', 'फल', 'ऑर्गेनिक गेहूं', 'दालें', 'जड़ी-बूटियां'],
    currentRequirement: 'Organic Vegetables — Mixed lot, weekly',
    currentRequirementHi: 'ऑर्गेनिक सब्जियां — मिश्रित लॉट, साप्ताहिक',
    minQuantity: '5 Quintals / variety',
    minQuantityHi: '5 क्विंटल / किस्म',
    paymentTerms: 'Same-day payment (cash/UPI)',
    paymentTermsHi: 'उसी दिन भुगतान (नकद/UPI)',
    buyingFrequency: 'Daily',
    buyingFrequencyHi: 'दैनिक',
    descEn: 'Premium organic retail chain with direct farm-to-shelf model. Pays 25–40% above mandi rates for certified organic produce. Preferred partner for small-scale farmers.',
    descHi: 'प्रीमियम ऑर्गेनिक रिटेल चेन। सीधे खेत से शेल्फ तक। मंडी भाव से 25–40% अधिक। छोटे किसानों के लिए पसंदीदा भागीदार।',
    icon: 'eco',
    createdAt: '2026-08-10T11:00:00Z',
    isSeed: true,
  },
  {
    id: 'buyer_seed_06',
    ownerId: 'res_owner_export_06',
    ownerRole: 'buyer',
    businessName: 'Punjab Agri Exports International',
    businessNameHi: 'पंजाब एग्री एक्सपोर्ट्स इंटरनेशनल',
    contactPerson: 'Davinder Pal Singh',
    contactPersonHi: 'दविंदर पाल सिंह',
    buyerType: 'Exporter / Trader',
    buyerTypeHi: 'निर्यातक / व्यापारी',
    buyerCategory: 'exporter',
    phone: '9878001122',
    email: 'davinder@punjabagriexport.com',
    locationEn: 'Ghaziabad APMC, UP',
    locationHi: 'गाजियाबाद APMC, UP',
    distanceEn: '12.1 km away',
    distanceHi: '12.1 किमी दूर',
    rating: 4.5,
    reviewsCount: 45,
    verified: false,
    cropsPurchased: ['Basmati Rice', 'Wheat', 'Maize', 'Chickpea'],
    cropsPurchasedHi: ['बासमती चावल', 'गेहूं', 'मक्का', 'चना'],
    currentRequirement: 'Basmati Rice — 500 MT for Gulf export',
    currentRequirementHi: 'बासमती चावल — 500 MT गल्फ निर्यात हेतु',
    minQuantity: '200 Quintals',
    minQuantityHi: '200 क्विंटल',
    paymentTerms: 'Advance 30%, balance on loading',
    paymentTermsHi: '30% अग्रिम, लोडिंग पर शेष',
    buyingFrequency: 'Monthly',
    buyingFrequencyHi: 'मासिक',
    descEn: 'Active exporter with IEC code, supplying Basmati rice to Middle East and Southeast Asia. Prefers direct contracts with farmer groups or FPOs.',
    descHi: 'IEC कोड सहित सक्रिय निर्यातक। मध्य-पूर्व और दक्षिण-पूर्व एशिया को बासमती चावल निर्यात। FPO या किसान समूहों से सीधा अनुबंध पसंद।',
    icon: 'flight_takeoff',
    createdAt: '2026-08-20T10:00:00Z',
    isSeed: true,
  },
];

// ── localStorage persistence (same pattern as resourceContent.js) ─────────────
export function getStoredBuyers() {
  try {
    const raw = localStorage.getItem(BUYERS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Merge any missing seed buyers
        const existingIds = new Set(parsed.map((b) => b.id));
        const missingSeeds = SEED_BUYERS.filter((s) => !existingIds.has(s.id));
        if (missingSeeds.length > 0) {
          const merged = [...parsed, ...missingSeeds];
          saveStoredBuyers(merged);
          return merged;
        }
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error reading buyers from localStorage:', err);
  }
  // First load — save seeds and return
  saveStoredBuyers(SEED_BUYERS);
  return SEED_BUYERS;
}

export function saveStoredBuyers(buyers) {
  try {
    localStorage.setItem(BUYERS_STORAGE_KEY, JSON.stringify(buyers));
  } catch (err) {
    console.error('Error saving buyers to localStorage:', err);
  }
}

// ── Crop filter options ───────────────────────────────────────────────────────
export const CROP_FILTER_OPTIONS = [
  { id: 'all',        labelEn: 'All Crops',   labelHi: 'सभी फसलें',   icon: '🌾' },
  { id: 'Wheat',      labelEn: 'Wheat',       labelHi: 'गेहूं',        icon: '🌾' },
  { id: 'Rice',       labelEn: 'Rice',        labelHi: 'चावल',         icon: '🍚' },
  { id: 'Paddy',      labelEn: 'Paddy',       labelHi: 'धान',          icon: '🌾' },
  { id: 'Sugarcane',  labelEn: 'Sugarcane',   labelHi: 'गन्ना',        icon: '🎋' },
  { id: 'Potato',     labelEn: 'Potato',      labelHi: 'आलू',          icon: '🥔' },
  { id: 'Onion',      labelEn: 'Onion',       labelHi: 'प्याज',        icon: '🧅' },
  { id: 'Tomato',     labelEn: 'Tomato',      labelHi: 'टमाटर',        icon: '🍅' },
  { id: 'Pulses',     labelEn: 'Pulses',      labelHi: 'दालें',        icon: '🫘' },
  { id: 'Vegetables', labelEn: 'Vegetables',  labelHi: 'सब्जियां',     icon: '🥦' },
  { id: 'Maize',      labelEn: 'Maize',       labelHi: 'मक्का',        icon: '🌽' },
  { id: 'Soybean',    labelEn: 'Soybean',     labelHi: 'सोयाबीन',     icon: '🫘' },
  { id: 'Fruits',     labelEn: 'Fruits',      labelHi: 'फल',           icon: '🍎' },
];

// ── Buyer category filter options ─────────────────────────────────────────────
export const BUYER_CATEGORY_OPTIONS = [
  { id: 'all',         labelEn: 'All Types',         labelHi: 'सभी प्रकार' },
  { id: 'wholesaler',  labelEn: 'Wholesaler',         labelHi: 'थोक व्यापारी' },
  { id: 'mandi',       labelEn: 'Mandi / Commission', labelHi: 'मंडी / आढ़ती' },
  { id: 'processor',   labelEn: 'Food Processor',     labelHi: 'फूड प्रोसेसर' },
  { id: 'exporter',    labelEn: 'Exporter',           labelHi: 'निर्यातक' },
  { id: 'retailer',    labelEn: 'Retailer',           labelHi: 'रिटेलर' },
  { id: 'cooperative', labelEn: 'Cooperative / Mill', labelHi: 'सहकारी / मिल' },
];

// ── Crop emoji helper ─────────────────────────────────────────────────────────
export const CROP_EMOJIS = {
  Wheat: '🌾', Rice: '🍚', Paddy: '🌾', Sugarcane: '🎋', Potato: '🥔',
  Onion: '🧅', Tomato: '🍅', Pulses: '🫘', Vegetables: '🥦', Maize: '🌽',
  Soybean: '🫘', Fruits: '🍎', Basmati: '🍚', 'Basmati Rice': '🍚',
  Chickpea: '🫘', Carrot: '🥕', Peas: '🟢', Millets: '🌾', Barley: '🌾',
  Herbs: '🌿', 'Organic Wheat': '🌾',
};
