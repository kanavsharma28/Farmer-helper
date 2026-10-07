// ─── Farm Data Layer & LocalStorage Persistence ──────────────────────────────
// Manages Farmer Helper farms with role-based ownership (farmerId = currentUser.id)

export const FARMS_STORAGE_KEY = 'farmer_helper_farms';
export const FARMS_UPDATE_EVENT = 'farmer_helper_farms_updated';

// Initial seed farm for default demo farmer Rajesh Kumar (user_farmer_01)
export const INITIAL_SEED_FARMS = [
  {
    id: 'farm_seed_01',
    farmerId: 'user_farmer_01',
    farmerName: 'Rajesh Kumar',
    farmName: 'Sharma Krishi Farm',
    farmNameHi: 'शर्मा कृषि फार्म',
    farmType: 'Own Farm',
    farmTypeHi: 'अपनी खेती',
    area: '12',
    areaUnit: 'Acre',
    areaUnitHi: 'एकड़',
    state: 'Uttar Pradesh',
    stateHi: 'उत्तर प्रदेश',
    district: 'Meerut',
    districtHi: 'मेरठ',
    village: 'Khanna Village',
    villageHi: 'खन्ना गांव',
    pincode: '250001',
    primaryCrop: 'Wheat',
    primaryCropHi: 'गेहूं',
    otherCrops: ['Sugarcane', 'Mustard'],
    otherCropsHi: ['गन्ना', 'सरसों'],
    soilType: 'Alluvial',
    soilTypeHi: 'जलोढ़ मिट्टी',
    landOwnership: 'Owned',
    landOwnershipHi: 'स्वामित्व',
    soilTestAvailable: 'Yes',
    irrigationType: 'Tube Well',
    irrigationTypeHi: 'ट्यूबवेल',
    waterAvailability: 'Year Round',
    waterAvailabilityHi: 'साल भर',
    farmPhoto: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=80',
    experience: '10+ Years',
    practices: 'Mixed Crop-Livestock & Bio-fertilizer',
    workers: '3-5 Workers',
    equipment: ['Tractor', 'Rotavator', 'Solar Pump'],
    latitude: 28.9845,
    longitude: 77.7064,
    status: 'Active',
    createdAt: '2026-09-01T10:00:00Z',
    updatedAt: '2026-09-01T10:00:00Z',
  }
];

// ── Dropdown & Selection Option Constants ─────────────────────────────────────

export const FARM_TYPES = [
  { id: 'Own Farm', labelEn: 'Own Farm', labelHi: 'अपनी खेती', icon: 'home' },
  { id: 'Leased Farm', labelEn: 'Leased Farm', labelHi: 'पट्टे पर खेत', icon: 'handshake' },
  { id: 'Family Farm', labelEn: 'Family Farm', labelHi: 'पारिवारिक खेत', icon: 'family_restroom' },
  { id: 'Other', labelEn: 'Other', labelHi: 'अन्य', icon: 'more_horiz' },
];

export const AREA_UNITS = [
  { id: 'Acre', labelEn: 'Acre', labelHi: 'एकड़' },
  { id: 'Hectare', labelEn: 'Hectare', labelHi: 'हेक्टेयर' },
  { id: 'Bigha', labelEn: 'Bigha', labelHi: 'बीघा' },
];

export const PRIMARY_CROPS_LIST = [
  { id: 'Wheat', labelEn: 'Wheat', labelHi: 'गेहूं', emoji: '🌾' },
  { id: 'Rice', labelEn: 'Rice', labelHi: 'चावल / धान', emoji: '🌾' },
  { id: 'Maize', labelEn: 'Maize', labelHi: 'मक्का', emoji: '🌽' },
  { id: 'Sugarcane', labelEn: 'Sugarcane', labelHi: 'गन्ना', emoji: '🎋' },
  { id: 'Potato', labelEn: 'Potato', labelHi: 'आलू', emoji: '🥔' },
  { id: 'Mustard', labelEn: 'Mustard', labelHi: 'सरसों', emoji: '🌼' },
  { id: 'Vegetables', labelEn: 'Vegetables', labelHi: 'सब्जियां', emoji: '🥦' },
  { id: 'Fruits', labelEn: 'Fruits', labelHi: 'फल', emoji: '🍎' },
  { id: 'Other', labelEn: 'Other', labelHi: 'अन्य', emoji: '🌱' },
];

export const OTHER_CROPS_OPTIONS = [
  { id: 'Sugarcane', labelEn: 'Sugarcane', labelHi: 'गन्ना' },
  { id: 'Mustard', labelEn: 'Mustard', labelHi: 'सरसों' },
  { id: 'Pulses / Dal', labelEn: 'Pulses / Dal', labelHi: 'दालें / दलहन' },
  { id: 'Cotton', labelEn: 'Cotton', labelHi: 'कपास' },
  { id: 'Bajra', labelEn: 'Bajra', labelHi: 'बाजरा' },
  { id: 'Soybean', labelEn: 'Soybean', labelHi: 'सोयाबीन' },
  { id: 'Onion', labelEn: 'Onion', labelHi: 'प्याज' },
  { id: 'Garlic', labelEn: 'Garlic', labelHi: 'लहसुन' },
  { id: 'Tomato', labelEn: 'Tomato', labelHi: 'टमाटर' },
  { id: 'Chana / Gram', labelEn: 'Gram / Chana', labelHi: 'चना' },
  { id: 'Barley', labelEn: 'Barley', labelHi: 'जौ' },
  { id: 'Fodder', labelEn: 'Green Fodder', labelHi: 'हरा चारा' },
];

export const SOIL_TYPES = [
  { id: 'Alluvial', labelEn: 'Alluvial (दोमट / जलोढ़)', labelHi: 'जलोढ़ मिट्टी' },
  { id: 'Black Soil', labelEn: 'Black Soil (काली मिट्टी)', labelHi: 'काली मिट्टी' },
  { id: 'Red Soil', labelEn: 'Red Soil (लाल मिट्टी)', labelHi: 'लाल मिट्टी' },
  { id: 'Loamy', labelEn: 'Loamy (बलुई दोमट)', labelHi: 'दोमट मिट्टी' },
  { id: 'Sandy', labelEn: 'Sandy (रेतीली / बलुई)', labelHi: 'बलुई मिट्टी' },
  { id: 'Clay', labelEn: 'Clay (चिकनी मिट्टी)', labelHi: 'चिकनी मिट्टी' },
  { id: 'Other', labelEn: 'Other', labelHi: 'अन्य' },
];

export const LAND_OWNERSHIPS = [
  { id: 'Owned', labelEn: 'Owned', labelHi: 'स्वामित्व (स्वयं की)' },
  { id: 'Leased', labelEn: 'Leased', labelHi: 'पट्टा / किराए पर' },
  { id: 'Family', labelEn: 'Family', labelHi: 'पारिवारिक सांझा' },
];

export const IRRIGATION_TYPES = [
  { id: 'Tube Well', labelEn: 'Tube Well', labelHi: 'ट्यूबवेल', icon: 'water_drop', emoji: '💧' },
  { id: 'Borewell', labelEn: 'Borewell', labelHi: 'बोरवेल', icon: 'filter_drama', emoji: '🚰' },
  { id: 'Canal', labelEn: 'Canal', labelHi: 'नहर', icon: 'waves', emoji: '🌊' },
  { id: 'Rainfed', labelEn: 'Rainfed', labelHi: 'वर्षा आधारित', icon: 'rainy', emoji: '🌧️' },
  { id: 'Drip Irrigation', labelEn: 'Drip Irrigation', labelHi: 'टपक सिंचाई', icon: 'opacity', emoji: '🌱' },
  { id: 'Sprinkler', labelEn: 'Sprinkler', labelHi: 'फव्वारा', icon: 'shower', emoji: '🚿' },
  { id: 'Other', labelEn: 'Other', labelHi: 'अन्य', icon: 'add_circle', emoji: '➕' },
];

export const WATER_AVAILABILITIES = [
  { id: 'Year Round', labelEn: 'Year Round (12 Months)', labelHi: 'साल भर (12 महीने)', icon: 'check_circle' },
  { id: 'Seasonal', labelEn: 'Seasonal (Monsoon / Rabi)', labelHi: 'मौसमी (रबी/खरीफ)', icon: 'schedule' },
  { id: 'Limited', labelEn: 'Limited (Scarcity)', labelHi: 'सीमित (कमी)', icon: 'warning' },
];

export const FARMING_PRACTICES = [
  { id: 'Conventional', labelEn: 'Conventional Farming', labelHi: 'पारंपरिक रासायनिक खेती' },
  { id: 'Organic', labelEn: '100% Organic Farming', labelHi: 'जैविक खेती' },
  { id: 'Natural Farming', labelEn: 'Zero Budget Natural Farming (ZBNF)', labelHi: 'प्राकृतिक खेती' },
  { id: 'Precision', labelEn: 'Modern / Precision Agriculture', labelHi: 'आधुनिक / तकनीक आधारित' },
  { id: 'Mixed', labelEn: 'Mixed Farming (Crops + Dairy)', labelHi: 'मिश्रित खेती (फसल + पशुपालन)' },
];

export const FARMING_EXPERIENCE = [
  { id: '< 2 Years', labelEn: 'Less than 2 Years', labelHi: '2 साल से कम' },
  { id: '2-5 Years', labelEn: '2 – 5 Years', labelHi: '2 से 5 साल' },
  { id: '5-10 Years', labelEn: '5 – 10 Years', labelHi: '5 से 10 साल' },
  { id: '10+ Years', labelEn: 'More than 10 Years', labelHi: '10 साल से अधिक' },
];

export const WORKERS_OPTIONS = [
  { id: 'Family Only', labelEn: 'Family Only', labelHi: 'केवल परिवार' },
  { id: '1-2 Workers', labelEn: '1–2 Workers', labelHi: '1-2 मजदूर' },
  { id: '3-5 Workers', labelEn: '3–5 Workers', labelHi: '3-5 मजदूर' },
  { id: '5-10 Workers', labelEn: '5–10 Workers', labelHi: '5-10 मजदूर' },
  { id: '10+ Workers', labelEn: '10+ Workers', labelHi: '10 से अधिक मजदूर' },
];

export const EQUIPMENT_OPTIONS = [
  { id: 'Tractor', labelEn: 'Tractor', labelHi: 'ट्रैक्टर', icon: 'agriculture' },
  { id: 'Harvester', labelEn: 'Harvester', labelHi: 'कंबाइन हार्वेस्टर', icon: 'rv_hookup' },
  { id: 'Rotavator', labelEn: 'Rotavator', labelHi: 'रोटावेटर', icon: 'precision_manufacturing' },
  { id: 'Solar Pump', labelEn: 'Solar Pump', labelHi: 'सोलर पंप', icon: 'solar_power' },
  { id: 'Spray Machine', labelEn: 'Spray Machine', labelHi: 'स्प्रे मशीन', icon: 'pest_control' },
  { id: 'Cultivator', labelEn: 'Cultivator / Plough', labelHi: 'कल्टीवेटर / हल', icon: 'hardware' },
  { id: 'Thresher', labelEn: 'Thresher', labelHi: 'थ्रेशर', icon: 'grain' },
  { id: 'Drones', labelEn: 'Agri Drone', labelHi: 'कृषि ड्रोन', icon: 'flight' },
];

import { ALL_INDIAN_STATES, getDistrictsForState, isDistrictInState } from './indiaLocations';

export const INDIAN_STATES = ALL_INDIAN_STATES;
export { getDistrictsForState, isDistrictInState };

// ── LocalStorage Helpers ──────────────────────────────────────────────────────

export function getStoredFarms() {
  try {
    const raw = localStorage.getItem(FARMS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(FARMS_STORAGE_KEY, JSON.stringify(INITIAL_SEED_FARMS));
      return INITIAL_SEED_FARMS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(FARMS_STORAGE_KEY, JSON.stringify(INITIAL_SEED_FARMS));
      return INITIAL_SEED_FARMS;
    }
    return parsed;
  } catch (err) {
    console.error('Error reading farms from localStorage:', err);
    return INITIAL_SEED_FARMS;
  }
}

export function getFarmerFarms(farmerId) {
  const all = getStoredFarms();
  if (!farmerId) return all;
  return all.filter((f) => f.farmerId === farmerId);
}

export function getFarmById(farmId) {
  const all = getStoredFarms();
  return all.find((f) => f.id === farmId) || null;
}

export function saveFarmRecord(farmData, farmerId) {
  if (!farmerId) {
    throw new Error('Farmer authentication required to save a farm.');
  }

  const all = getStoredFarms();
  const now = new Date().toISOString();

  let updatedList;
  let savedRecord;

  if (farmData.id) {
    // Editing existing farm
    const existingIndex = all.findIndex((f) => f.id === farmData.id);
    if (existingIndex === -1) {
      throw new Error('Farm not found for update.');
    }

    // Security check: cannot edit other farmer's farm
    if (all[existingIndex].farmerId !== farmerId) {
      throw new Error('Unauthorized: You can only edit your own farm.');
    }

    savedRecord = {
      ...all[existingIndex],
      ...farmData,
      farmerId,
      updatedAt: now,
    };
    updatedList = [...all];
    updatedList[existingIndex] = savedRecord;
  } else {
    // Creating new farm
    savedRecord = {
      ...farmData,
      id: `farm_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      farmerId,
      status: farmData.status || 'Active',
      createdAt: now,
      updatedAt: now,
    };
    updatedList = [savedRecord, ...all];
  }

  try {
    localStorage.setItem(FARMS_STORAGE_KEY, JSON.stringify(updatedList));
    window.dispatchEvent(new CustomEvent(FARMS_UPDATE_EVENT, { detail: { farm: savedRecord } }));
  } catch (err) {
    console.error('Error saving farm to localStorage:', err);
    throw new Error('Storage error: Unable to save farm details.');
  }

  return savedRecord;
}

export function deleteFarmRecord(farmId, farmerId) {
  if (!farmerId) {
    throw new Error('Farmer authentication required to delete a farm.');
  }

  const all = getStoredFarms();
  const target = all.find((f) => f.id === farmId);
  if (!target) {
    return false;
  }

  // Security check: cannot delete other farmer's farm
  if (target.farmerId !== farmerId) {
    throw new Error('Unauthorized: You can only delete your own farm.');
  }

  const filtered = all.filter((f) => f.id !== farmId);
  try {
    localStorage.setItem(FARMS_STORAGE_KEY, JSON.stringify(filtered));
    window.dispatchEvent(new CustomEvent(FARMS_UPDATE_EVENT, { detail: { deletedId: farmId } }));
    return true;
  } catch (err) {
    console.error('Error deleting farm from localStorage:', err);
    return false;
  }
}
