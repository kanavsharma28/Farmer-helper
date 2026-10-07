// ─── Farm Produce & Buying Requirements — Shared Two-Sided Marketplace Data Layer ───
// Connects Farmers (selling produce) with Buyers (sourcing produce & posting buying requirements)

const PRODUCE_STORAGE_KEY = 'farmer_helper_farm_produce';
const REQUIREMENTS_STORAGE_KEY = 'farmer_helper_buying_requirements';

// ── Seed Produce Lots (Sold by Farmers) ──────────────────────────────────────
export const SEED_PRODUCE = [
  {
    id: 'prod_lot_01',
    farmerId: 'user_farmer_01', // Preset demo farmer Rajesh Kumar
    farmerName: 'Rajesh Kumar',
    farmerNameHi: 'राजेश कुमार',
    farmerPhone: '9876543210',
    verifiedFarmer: true,
    rating: 4.9,
    reviewsCount: 38,
    crop: 'Wheat',
    cropHi: 'गेहूं',
    variety: 'Sharbati Premium (शरबती गेहूं)',
    varietyHi: 'शरबती प्रीमियम गेहूं',
    quantity: '250 Quintals',
    quantityNum: 250,
    pricePerQuintal: 2450,
    priceFormatted: '₹2,450 / Quintal',
    location: 'Khanna Mandi Road, Meerut, Uttar Pradesh',
    locationHi: 'खन्ना मंडी रोड, मेरठ, उत्तर प्रदेश',
    district: 'Meerut',
    state: 'UP',
    distance: '3.2 km away',
    availabilityStatus: 'Ready for Dispatch',
    availabilityStatusHi: 'डिस्पैच के लिए तैयार',
    harvestDate: 'Ready for Dispatch',
    qualityGrade: 'Grade A+ (Moisture < 11%)',
    qualityGradeHi: 'ग्रेड A+ (नमी < 11%)',
    description: 'Golden-amber Sharbati wheat grown using balanced bio-fertilizers. Machine cleaned, zero weed seeds, test weight 79 kg/hl. Stored in moisture-proof HDPE bags.',
    descriptionHi: 'जैविक खाद से तैयार शरबती गेहूं। मशीन से साफ, कंकड़-बीज मुक्त। नमी प्रूफ कट्टों में सुरक्षित।',
    imageEmoji: '🌾',
    tags: ['Ready for Dispatch', 'Grade A+', 'Bio-fertilized'],
    createdAt: '2026-09-01T10:00:00Z',
    isSeed: true,
  },
  {
    id: 'prod_lot_02',
    farmerId: 'user_farmer_02',
    farmerName: 'Suresh Kumar',
    farmerNameHi: 'सुरेश कुमार',
    farmerPhone: '9822334455',
    verifiedFarmer: true,
    rating: 4.7,
    reviewsCount: 24,
    crop: 'Potato',
    cropHi: 'आलू',
    variety: 'Kufri Bahar Table Grade (कुफरी बहार आलू)',
    varietyHi: 'कुफरी बहार टेबल ग्रेड आलू',
    quantity: '120 Quintals',
    quantityNum: 120,
    pricePerQuintal: 1350,
    priceFormatted: '₹1,350 / Quintal',
    location: 'Modinagar, Uttar Pradesh',
    locationHi: 'मोदीनगर, उत्तर प्रदेश',
    district: 'Ghaziabad / Modinagar',
    state: 'UP',
    distance: '16.5 km away',
    availabilityStatus: 'Harvesting in 2 Days',
    availabilityStatusHi: '2 दिन में कटाई',
    harvestDate: 'Harvesting in 2 Days',
    qualityGrade: 'Table Grade 45mm–60mm',
    qualityGradeHi: 'टेबल ग्रेड 45-60mm',
    description: 'Fresh dug table potatoes, medium-large uniform tuber size, thin skin, excellent for wholesale and storage. Direct field loading available.',
    descriptionHi: 'ताजा खुदाई किया हुआ कुफरी आलू, मध्यम-बड़ा आकार, पतली छाल, थोक व्यापार के लिए उपयुक्त।',
    imageEmoji: '🥔',
    tags: ['Fresh Harvest', 'Uniform Size', 'Farm Gate Pickup'],
    createdAt: '2026-09-05T09:00:00Z',
    isSeed: true,
  },
  {
    id: 'prod_lot_03',
    farmerId: 'user_farmer_03',
    farmerName: 'Harpreet Dhillon',
    farmerNameHi: 'हरप्रीत ढिल्लों',
    farmerPhone: '9811445566',
    verifiedFarmer: true,
    rating: 4.8,
    reviewsCount: 52,
    crop: 'Rice',
    cropHi: 'चावल',
    variety: '1121 Pusa Basmati (बासमती 1121)',
    varietyHi: '1121 पूसा बासमती',
    quantity: '400 Quintals',
    quantityNum: 400,
    pricePerQuintal: 3800,
    priceFormatted: '₹3,800 / Quintal',
    location: 'Khanna Mandi, Ludhiana / Punjab',
    locationHi: 'खन्ना मंडी, लुधियाना, पंजाब',
    district: 'Ludhiana',
    state: 'Punjab',
    distance: 'Direct Interstate Delivery',
    availabilityStatus: 'Mandi Ready',
    availabilityStatusHi: 'मंडी में उपलब्ध',
    harvestDate: 'Mandi Ready',
    qualityGrade: 'Export Quality (Avg Length 8.4mm)',
    qualityGradeHi: 'निर्यात गुणवत्ता (लंबाई 8.4mm)',
    description: 'Extra long slender grain traditional 1121 basmati paddy. Matured harvest with low breakage percentage. Moisture tested at 13.5%.',
    descriptionHi: 'अतिरिक्त लंबा दाना 1121 बासमती धान। कम टूट, उच्च सुगंध। निर्यात गुणवत्ता।',
    imageEmoji: '🍚',
    tags: ['Export Quality', 'Low Breakage', 'Mandi Certified'],
    createdAt: '2026-09-08T11:30:00Z',
    isSeed: true,
  },
  {
    id: 'prod_lot_04',
    farmerId: 'user_farmer_04',
    farmerName: 'Mukesh Patidar',
    farmerNameHi: 'मुकेश पाटीदार',
    farmerPhone: '9893001122',
    verifiedFarmer: true,
    rating: 4.9,
    reviewsCount: 31,
    crop: 'Soybean',
    cropHi: 'सोयाबीन',
    variety: 'Yellow Soybean JS-9560 (पीली सोयाबीन)',
    varietyHi: 'पीली सोयाबीन JS-9560',
    quantity: '180 Quintals',
    quantityNum: 180,
    pricePerQuintal: 4600,
    priceFormatted: '₹4,600 / Quintal',
    location: 'Sanwer Road, Indore, Madhya Pradesh',
    locationHi: 'सांवेर रोड, इंदौर, मध्य प्रदेश',
    district: 'Indore',
    state: 'MP',
    distance: 'Direct Interstate Delivery',
    availabilityStatus: 'Ready for Dispatch',
    availabilityStatusHi: 'डिस्पैच के लिए तैयार',
    harvestDate: 'Ready for Dispatch',
    qualityGrade: 'NPOP Organic Certified (Oil 19.5%)',
    qualityGradeHi: 'NPOP जैविक प्रमाणित (तेल 19.5%)',
    description: 'Certified organic yellow soybean with high protein (40%) and oil content (19.5%). Screened and graded, zero pod shatter damage.',
    descriptionHi: 'प्रमाणित जैविक पीली सोयाबीन, उच्च प्रोटीन और तेल। छना हुआ एवं ग्रेड किया हुआ माल।',
    imageEmoji: '🫘',
    tags: ['Organic Certified', 'High Protein', 'Screened Lot'],
    createdAt: '2026-09-10T14:00:00Z',
    isSeed: true,
  },
  {
    id: 'prod_lot_05',
    farmerId: 'user_farmer_05',
    farmerName: 'Anita Devi',
    farmerNameHi: 'अनीता देवी',
    farmerPhone: '9829003344',
    verifiedFarmer: true,
    rating: 4.6,
    reviewsCount: 19,
    crop: 'Mustard',
    cropHi: 'सरसों',
    variety: 'Black Mustard / Pusa Bold (काली सरसों)',
    varietyHi: 'काली सरसों / पूसा बोल्ड',
    quantity: '95 Quintals',
    quantityNum: 95,
    pricePerQuintal: 5400,
    priceFormatted: '₹5,400 / Quintal',
    location: 'Ramgarh Road, Alwar, Rajasthan',
    locationHi: 'रामगढ़ रोड, अलवर, राजस्थान',
    district: 'Alwar',
    state: 'Rajasthan',
    distance: 'Direct Regional Delivery',
    availabilityStatus: 'Ready for Dispatch',
    availabilityStatusHi: 'डिस्पैच के लिए तैयार',
    harvestDate: 'Ready for Dispatch',
    qualityGrade: 'High Oil 42% (Bold Grain)',
    qualityGradeHi: 'उच्च तेल 42% (मोटा दाना)',
    description: 'Bold grain black mustard with verified oil recovery above 41.8%. Sun dried to 8% moisture. Excellent for oil expeller mills.',
    descriptionHi: 'मोटा दाना काली सरसों, 42% तेल मात्रा। धूप में सुखाई गई, तेल मिलों के लिए सर्वोत्तम।',
    imageEmoji: '🌱',
    tags: ['High Oil 42%', 'Sun Dried', 'Bold Seed'],
    createdAt: '2026-09-12T08:30:00Z',
    isSeed: true,
  },
  {
    id: 'prod_lot_06',
    farmerId: 'user_farmer_06',
    farmerName: 'Vikram Choudhary',
    farmerNameHi: 'विक्रम चौधरी',
    farmerPhone: '9823004455',
    verifiedFarmer: false,
    rating: 4.5,
    reviewsCount: 16,
    crop: 'Onion',
    cropHi: 'प्याज',
    variety: 'Nashik Red Onion Garwa (नासिक लाल प्याज)',
    varietyHi: 'नासिक लाल प्याज गरवा',
    quantity: '300 Quintals',
    quantityNum: 300,
    pricePerQuintal: 1850,
    priceFormatted: '₹1,850 / Quintal',
    location: 'Lasalgaon Mandi belt, Nashik, Maharashtra',
    locationHi: 'लासलगांव मंडी, नासिक, महाराष्ट्र',
    district: 'Nashik',
    state: 'Maharashtra',
    distance: 'All-India Rail/Road Freight',
    availabilityStatus: 'Ready for Dispatch',
    availabilityStatusHi: 'डिस्पैच के लिए तैयार',
    harvestDate: 'Ready for Dispatch',
    qualityGrade: 'Medium-Large (50mm–65mm)',
    qualityGradeHi: 'मध्यम-बड़ा (50mm–65mm)',
    description: 'Dry cured Garwa summer red onions with thick dark skin and long shelf storage life (4–5 months). Packed in 40kg aerated mesh bags.',
    descriptionHi: 'गर्मियों का गरवा लाल प्याज, मोटी लाल छाल, 4-5 महीने की लंबी भंडारण क्षमता। जालीदार बोरियों में पैक।',
    imageEmoji: '🧅',
    tags: ['Long Shelf Life', 'Mesh Bag Packed', 'Uniform Size'],
    createdAt: '2026-09-15T12:00:00Z',
    isSeed: true,
  },
  {
    id: 'prod_lot_07',
    farmerId: 'user_farmer_07',
    farmerName: 'Rameshwar Jat',
    farmerNameHi: 'रामेश्वर जाट',
    farmerPhone: '9828112233',
    verifiedFarmer: true,
    rating: 4.7,
    reviewsCount: 22,
    crop: 'Pulses',
    cropHi: 'दालें',
    variety: 'Desi Chana / Chickpea (देसी चना)',
    varietyHi: 'देसी चना',
    quantity: '150 Quintals',
    quantityNum: 150,
    pricePerQuintal: 5800,
    priceFormatted: '₹5,800 / Quintal',
    location: 'Nokha Mandi, Bikaner, Rajasthan',
    locationHi: 'नोखा मंडी, बीकानेर, राजस्थान',
    district: 'Bikaner',
    state: 'Rajasthan',
    distance: 'Direct Regional Delivery',
    availabilityStatus: 'Mandi Ready',
    availabilityStatusHi: 'मंडी में उपलब्ध',
    harvestDate: 'Mandi Ready',
    qualityGrade: 'Grade A Bold Desi',
    qualityGradeHi: 'ग्रेड A मोटा देसी',
    description: 'Cleaned and sorted desi chickpea. High dal yield recovery, zero chemical fumigation residue. Ready for dal mills and packaged dal brands.',
    descriptionHi: 'साफ एवं छांटा हुआ देसी चना। दाल मिलों के लिए बेहतरीन रिकवरी, बिना केमिकल।',
    imageEmoji: '🫘',
    tags: ['Grade A Bold', 'High Recovery', 'Ready for Mills'],
    createdAt: '2026-09-18T10:00:00Z',
    isSeed: true,
  },
];

// ── Seed Buying Requirements (Posted by Buyers) ──────────────────────────────
export const SEED_BUYING_REQUIREMENTS = [
  {
    id: 'req_seed_01',
    buyerId: 'buyer_seed_01', // Kisan Mandi Agro Traders
    buyerOwnerId: 'user_buyer_01',
    buyerName: 'Kisan Mandi Agro Traders',
    buyerNameHi: 'किसान मंडी एग्रो ट्रेडर्स',
    contactPerson: 'Vikram Sharma',
    contactPersonHi: 'विक्रम शर्मा',
    buyerPhone: '9988776655',
    buyerType: 'Wholesale Trader & Processor',
    verifiedBuyer: true,
    crop: 'Wheat',
    cropHi: 'गेहूं',
    cropVariety: 'Sharbati or Mill Quality (शरबती या मिल क्वालिटी)',
    quantity: '500 Quintals',
    quantityNum: 500,
    location: 'Khanna Mandi, Meerut, Uttar Pradesh',
    locationHi: 'खन्ना मंडी, मेरठ, उत्तर प्रदेश',
    expectedPriceRange: '₹2,400 – ₹2,550 / Quintal',
    qualityRequirements: 'Moisture < 12%, No weevil damage, test weight > 78',
    purchaseDeadline: 'Immediate (Within 5 Days)',
    paymentTerms: 'Same-day / T+1 Direct Bank Transfer',
    status: 'Active',
    description: 'Urgent procurement for our flour milling and retail packaging facility in Meerut. Farm gate pickup provided for lots over 100 quintals.',
    descriptionHi: 'आटा मिल और पैकेजिंग इकाई के लिए तत्काल गेहूं खरीद। 100+ क्विंटल के लिए खेत से उठान सुविधा।',
    createdAt: '2026-09-20T08:00:00Z',
    isSeed: true,
  },
  {
    id: 'req_seed_02',
    buyerId: 'buyer_seed_03', // AgroVeda Food Processors
    buyerOwnerId: 'res_owner_food_03',
    buyerName: 'AgroVeda Food Processors Pvt Ltd',
    buyerNameHi: 'एग्रोवेदा फूड प्रोसेसर्स प्रा. लि.',
    contactPerson: 'Priya Mehta',
    contactPersonHi: 'प्रिया मेहता',
    buyerPhone: '9977665544',
    buyerType: 'Food Processor / Exporter',
    verifiedBuyer: true,
    crop: 'Potato',
    cropHi: 'आलू',
    cropVariety: 'Kufri Chipsona / Table Grade A (चिप्सोना / ग्रेड A)',
    quantity: '200 Quintals',
    quantityNum: 200,
    location: 'UPSIDC Industrial Area, Meerut, UP',
    locationHi: 'UPSIDC औद्योगिक क्षेत्र, मेरठ, UP',
    expectedPriceRange: '₹1,300 – ₹1,450 / Quintal',
    qualityRequirements: 'Grade A, Minimum 45mm diameter, dry-skinned, low sugar',
    purchaseDeadline: 'Within 7 Days',
    paymentTerms: '7-day credit or 30% advance on inspection',
    status: 'Active',
    description: 'Contract procurement for potato chips and extruded snack processing line. Long-term seasonal contracts offered for certified quality growers.',
    descriptionHi: 'आलू चिप्स और स्नैक निर्माण के लिए गुणवत्तापूर्ण आलू खरीद। नियमित उत्पादकों के लिए दीर्घकालिक अनुबंध।',
    createdAt: '2026-09-21T09:30:00Z',
    isSeed: true,
  },
  {
    id: 'req_seed_03',
    buyerId: 'buyer_seed_02', // Ganga Yamuna Grain Mandi
    buyerOwnerId: 'res_owner_mandi_02',
    buyerName: 'Ganga Yamuna Grain Mandi',
    buyerNameHi: 'गंगा यमुना अनाज मंडी',
    contactPerson: 'Suresh Agarwal',
    contactPersonHi: 'सुरेश अग्रवाल',
    buyerPhone: '9812300011',
    buyerType: 'Mandi / Commission Agent',
    verifiedBuyer: true,
    crop: 'Rice',
    cropHi: 'चावल / धान',
    cropVariety: 'Paddy PR-126 or Basmati 1509 (धान PR-126 या 1509)',
    quantity: '1,000 Quintals',
    quantityNum: 1000,
    location: 'Hapur Road, Ghaziabad, UP',
    locationHi: 'हापुड़ रोड, गाजियाबाद, UP',
    expectedPriceRange: '₹2,200 – ₹2,350 / Quintal',
    qualityRequirements: 'Standard APMC auction lot, moisture < 17%',
    purchaseDeadline: 'Ongoing Seasonal Procurement',
    paymentTerms: '2–3 Business Days via Mandi E-Pay',
    status: 'Active',
    description: 'Continuous auction and direct spot procurement. Computerized weighment and unloading facilities available 24/7.',
    descriptionHi: 'मंडी में निरंतर नीलामी एवं सीधी खरीद। कम्प्यूटरीकृत तौल और 24/7 अनलोडिंग सुविधा।',
    createdAt: '2026-09-22T10:15:00Z',
    isSeed: true,
  },
  {
    id: 'req_seed_04',
    buyerId: 'buyer_seed_06', // Punjab Agri Exports
    buyerOwnerId: 'res_owner_export_06',
    buyerName: 'Punjab Agri Exports International',
    buyerNameHi: 'पंजाब एग्री एक्सपोर्ट्स इंटरनेशनल',
    contactPerson: 'Davinder Pal Singh',
    contactPersonHi: 'दविंदर पाल सिंह',
    buyerPhone: '9878001122',
    buyerType: 'Exporter / International Trader',
    verifiedBuyer: false,
    crop: 'Rice',
    cropHi: 'बासमती चावल',
    cropVariety: 'Traditional or 1121 Pusa Basmati (1121 पूसा बासमती)',
    quantity: '500 MT (5,000 Qtl)',
    quantityNum: 5000,
    location: 'Ghaziabad APMC / Western UP',
    locationHi: 'गाजियाबाद APMC / पश्चिमी UP',
    expectedPriceRange: '₹3,750 – ₹3,950 / Quintal',
    qualityRequirements: 'Export grade, avg grain length > 8.35mm, nil pesticide residue',
    purchaseDeadline: 'Within 14 Days',
    paymentTerms: '30% Advance, 70% against loading weigh slip',
    status: 'Active',
    description: 'Bulk procurement for international export consignment to UAE and Saudi Arabia. Open to FPOs and farmer clusters.',
    descriptionHi: 'खाड़ी देशों को निर्यात के लिए बासमती धान की थोक खरीद। FPO और किसान उत्पादक संगठनों का स्वागत।',
    createdAt: '2026-09-23T11:00:00Z',
    isSeed: true,
  },
  {
    id: 'req_seed_05',
    buyerId: 'buyer_seed_05', // FreshMart Organic Retail
    buyerOwnerId: 'res_owner_retail_05',
    buyerName: 'FreshMart Organic Retail Chain',
    buyerNameHi: 'फ्रेशमार्ट ऑर्गेनिक रिटेल',
    contactPerson: 'Ananya Srivastava',
    contactPersonHi: 'अनन्या श्रीवास्तव',
    buyerPhone: '9911223344',
    buyerType: 'Organic Retailer / Direct Buyer',
    verifiedBuyer: true,
    crop: 'Pulses',
    cropHi: 'दालें',
    cropVariety: 'Organic Arhar / Toor & Moong (जैविक अरहर व मूंग)',
    quantity: '100 Quintals',
    quantityNum: 100,
    location: 'Civil Lines, Meerut, UP',
    locationHi: 'सिविल लाइंस, मेरठ, UP',
    expectedPriceRange: '₹7,200 – ₹8,000 / Quintal',
    qualityRequirements: 'Naturally grown or PGS/NPOP certified, unpolished, zero chemicals',
    purchaseDeadline: 'Replenishment Batch (Within 10 Days)',
    paymentTerms: 'Instant Bank Transfer upon quality clearance',
    status: 'Active',
    description: 'Direct procurement for premium farm-to-shelf retail stores. 20-30% premium paid above regular mandi benchmark.',
    descriptionHi: 'प्रीमियम रिटेल स्टोर के लिए बिना पॉलिश की जैविक दालें। मंडी भाव से 20-30% अधिक मूल्य।',
    createdAt: '2026-09-24T12:00:00Z',
    isSeed: true,
  },
];

// ── LocalStorage Helpers for Produce ─────────────────────────────────────────
export function getStoredProduce() {
  try {
    const raw = localStorage.getItem(PRODUCE_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const existingIds = new Set(parsed.map((p) => p.id));
        const missingSeeds = SEED_PRODUCE.filter((s) => !existingIds.has(s.id));
        if (missingSeeds.length > 0) {
          const merged = [...parsed, ...missingSeeds];
          saveStoredProduce(merged);
          return merged;
        }
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error reading produce from localStorage:', err);
  }
  saveStoredProduce(SEED_PRODUCE);
  return SEED_PRODUCE;
}

export function saveStoredProduce(produceList) {
  try {
    localStorage.setItem(PRODUCE_STORAGE_KEY, JSON.stringify(produceList));
  } catch (err) {
    console.error('Error saving produce to localStorage:', err);
  }
}

// ── LocalStorage Helpers for Buying Requirements ─────────────────────────────
export function getStoredRequirements() {
  try {
    const raw = localStorage.getItem(REQUIREMENTS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const existingIds = new Set(parsed.map((r) => r.id));
        const missingSeeds = SEED_BUYING_REQUIREMENTS.filter((s) => !existingIds.has(s.id));
        if (missingSeeds.length > 0) {
          const merged = [...parsed, ...missingSeeds];
          saveStoredRequirements(merged);
          return merged;
        }
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error reading requirements from localStorage:', err);
  }
  saveStoredRequirements(SEED_BUYING_REQUIREMENTS);
  return SEED_BUYING_REQUIREMENTS;
}

export function saveStoredRequirements(reqList) {
  try {
    localStorage.setItem(REQUIREMENTS_STORAGE_KEY, JSON.stringify(reqList));
  } catch (err) {
    console.error('Error saving requirements to localStorage:', err);
  }
}

// ── Buyer Filter Helper Options ──────────────────────────────────────────────
export const PRODUCE_CROP_OPTIONS = [
  { id: 'all', labelEn: 'All Crops', labelHi: 'सभी फसलें', icon: '🌾' },
  { id: 'Wheat', labelEn: 'Wheat', labelHi: 'गेहूं', icon: '🌾' },
  { id: 'Potato', labelEn: 'Potato', labelHi: 'आलू', icon: '🥔' },
  { id: 'Rice', labelEn: 'Rice / Paddy', labelHi: 'चावल / धान', icon: '🍚' },
  { id: 'Soybean', labelEn: 'Soybean', labelHi: 'सोयाबीन', icon: '🫘' },
  { id: 'Mustard', labelEn: 'Mustard', labelHi: 'सरसों', icon: '🌱' },
  { id: 'Onion', labelEn: 'Onion', labelHi: 'प्याज', icon: '🧅' },
  { id: 'Pulses', labelEn: 'Pulses / Chana', labelHi: 'दालें / चना', icon: '🫘' },
];

export const QUANTITY_FILTER_OPTIONS = [
  { id: 'all', labelEn: 'Any Quantity', labelHi: 'कोई भी मात्रा' },
  { id: '50', labelEn: '50+ Quintals', labelHi: '50+ क्विंटल' },
  { id: '100', labelEn: '100+ Quintals', labelHi: '100+ क्विंटल' },
  { id: '200', labelEn: '200+ Quintals', labelHi: '200+ क्विंटल' },
  { id: '500', labelEn: '500+ Quintals', labelHi: '500+ क्विंटल' },
];

export const AVAILABILITY_OPTIONS = [
  { id: 'all', labelEn: 'All Status', labelHi: 'सभी स्थिति' },
  { id: 'ready', labelEn: 'Ready for Dispatch', labelHi: 'डिस्पैच हेतु तैयार' },
  { id: 'mandi', labelEn: 'Mandi Ready', labelHi: 'मंडी में उपलब्ध' },
  { id: 'soon', labelEn: 'Harvesting Soon', labelHi: 'जल्द कटाई' },
];
