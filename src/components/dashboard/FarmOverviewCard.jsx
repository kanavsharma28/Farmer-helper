import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  getFarmerFarms,
  deleteFarmRecord,
  FARMS_UPDATE_EVENT,
} from '../../data/farmData';
import { dashboardData } from '../../data/dashboardContent';

// ─── Modal: View Full Farm Details ───────────────────────────────────────────
function FarmDetailsModal({ farm, isOpen, onClose, isEn, onEdit }) {
  if (!isOpen || !farm) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-surface-container-lowest rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-outline-variant/40 shadow-2xl p-6 sm:p-8 space-y-5">
        
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-outline-variant/30 pb-4">
          <div className="flex items-center gap-3">
            {farm.farmPhoto ? (
              <img
                src={farm.farmPhoto}
                alt={farm.farmName}
                className="w-14 h-14 rounded-2xl object-cover border border-outline-variant"
              />
            ) : (
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold text-2xl">
                🌱
              </div>
            )}
            <div>
              <h3 className="font-display text-lg sm:text-xl font-bold text-on-surface">
                {farm.farmName}
              </h3>
              <p className="text-xs text-on-surface-variant flex items-center gap-1">
                <span className="material-symbols-outlined text-sm text-outline">location_on</span>
                <span>{farm.village ? `${farm.village}, ` : ''}{farm.district}, {farm.state} - {farm.pincode}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Big Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center text-xs">
          <div className="p-3 bg-surface-container-low rounded-2xl border border-outline-variant/30">
            <span className="text-on-surface-variant block mb-1 font-medium">{isEn ? 'Area' : 'क्षेत्रफल'}</span>
            <span className="font-bold text-sm text-primary">{farm.area} {farm.areaUnit}</span>
          </div>
          <div className="p-3 bg-surface-container-low rounded-2xl border border-outline-variant/30">
            <span className="text-on-surface-variant block mb-1 font-medium">{isEn ? 'Farm Type' : 'प्रकार'}</span>
            <span className="font-bold text-xs text-on-surface">{farm.farmType}</span>
          </div>
          <div className="p-3 bg-surface-container-low rounded-2xl border border-outline-variant/30">
            <span className="text-on-surface-variant block mb-1 font-medium">{isEn ? 'Primary Crop' : 'मुख्य फसल'}</span>
            <span className="font-bold text-sm text-primary">🌾 {farm.primaryCrop}</span>
          </div>
          <div className="p-3 bg-surface-container-low rounded-2xl border border-outline-variant/30">
            <span className="text-on-surface-variant block mb-1 font-medium">{isEn ? 'Irrigation' : 'सिंचाई'}</span>
            <span className="font-bold text-xs text-on-surface">💧 {farm.irrigationType}</span>
          </div>
        </div>

        {/* Detailed Attributes */}
        <div className="space-y-3 text-xs bg-surface-container-low p-4 rounded-2xl border border-outline-variant/30">
          <div className="flex justify-between py-1 border-b border-outline-variant/20">
            <span className="text-on-surface-variant">{isEn ? 'Soil Type' : 'मिट्टी का प्रकार'}</span>
            <span className="font-semibold text-on-surface">{farm.soilType || 'Alluvial'}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-outline-variant/20">
            <span className="text-on-surface-variant">{isEn ? 'Water Availability' : 'पानी की उपलब्धता'}</span>
            <span className="font-semibold text-on-surface">{farm.waterAvailability || 'Year Round'}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-outline-variant/20">
            <span className="text-on-surface-variant">{isEn ? 'Land Ownership' : 'स्वामित्व'}</span>
            <span className="font-semibold text-on-surface">{farm.landOwnership || 'Owned'}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-outline-variant/20">
            <span className="text-on-surface-variant">{isEn ? 'Soil Health Card' : 'मृदा स्वास्थ्य कार्ड'}</span>
            <span className="font-semibold text-on-surface">{farm.soilTestAvailable === 'Yes' ? '✓ Available' : 'No'}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-outline-variant/20">
            <span className="text-on-surface-variant">{isEn ? 'Farming Practices' : 'कृषि पद्धति'}</span>
            <span className="font-semibold text-on-surface">{farm.practices || 'Conventional'}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-on-surface-variant">{isEn ? 'Workers Available' : 'उपलब्ध मजदूर'}</span>
            <span className="font-semibold text-on-surface">{farm.workers || '1-2 Workers'}</span>
          </div>
        </div>

        {/* Other Crops & Equipment */}
        {farm.otherCrops && farm.otherCrops.length > 0 && (
          <div>
            <span className="text-xs font-bold text-on-surface block mb-1.5">
              {isEn ? 'Other Crops Grown:' : 'अन्य फसलें:'}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {farm.otherCrops.map((c) => (
                <span key={c} className="px-2.5 py-1 rounded-lg bg-secondary-container/30 text-on-secondary-container font-semibold text-xs">
                  {c}
                </span>
              ))}
            </div>
          </div>
        )}

        {farm.equipment && farm.equipment.length > 0 && (
          <div>
            <span className="text-xs font-bold text-on-surface block mb-1.5">
              {isEn ? 'Farm Machinery & Equipment:' : 'कृषि मशीनें:'}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {farm.equipment.map((eq) => (
                <span key={eq} className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary font-semibold text-xs flex items-center gap-1">
                  <span>🚜</span>
                  <span>{eq}</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={() => {
              onClose();
              onEdit(farm.id);
            }}
            className="flex-1 h-11 rounded-xl bg-primary text-white font-bold text-xs hover:bg-primary-container transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
          >
            <span className="material-symbols-outlined text-base">edit</span>
            <span>{isEn ? 'Edit Farm' : 'खेत संपादित करें'}</span>
          </button>
          <button
            onClick={onClose}
            className="h-11 px-5 rounded-xl border border-outline-variant text-on-surface font-semibold text-xs hover:bg-surface-container transition-all cursor-pointer"
          >
            {isEn ? 'Close' : 'बंद करें'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Modal: Delete Confirmation ───────────────────────────────────────────────
function DeleteConfirmationModal({ farm, isOpen, onClose, onConfirm, isEn }) {
  if (!isOpen || !farm) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-surface-container-lowest rounded-3xl max-w-sm w-full p-6 text-center space-y-4 border border-outline-variant/40 shadow-2xl">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-error/10 text-error flex items-center justify-center">
          <span className="material-symbols-outlined text-3xl">delete_forever</span>
        </div>
        <div>
          <h3 className="font-display text-lg font-bold text-on-surface">
            {isEn ? 'Delete Farm?' : 'खेत हटाएं?'}
          </h3>
          <p className="text-xs text-on-surface-variant mt-1">
            {isEn
              ? `Are you sure you want to delete "${farm.farmName}"? This action cannot be undone.`
              : `क्या आप निश्चित रूप से "${farm.farmName}" को हटाना चाहते हैं? यह क्रिया वापस नहीं ली जा सकती।`}
          </p>
        </div>
        <div className="flex gap-2.5 pt-2">
          <button
            onClick={onClose}
            className="flex-1 h-11 rounded-xl border border-outline-variant text-on-surface font-semibold text-xs hover:bg-surface-container transition-colors cursor-pointer"
          >
            {isEn ? 'Cancel' : 'रद्द करें'}
          </button>
          <button
            onClick={() => onConfirm(farm.id)}
            className="flex-1 h-11 rounded-xl bg-error text-white font-bold text-xs hover:bg-error/90 transition-colors cursor-pointer shadow-xs"
          >
            {isEn ? 'Yes, Delete' : 'हाँ, हटाएं'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main FarmOverviewCard Component ──────────────────────────────────────────
export default function FarmOverviewCard({ lang = 'en', onViewDetails }) {
  const isEn = lang === 'en';
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const viewFarmParam = searchParams.get('viewFarm');

  const { user } = useAuth();
  const currentFarmerId = user?.id || 'user_farmer_01';

  const [farms, setFarms] = useState(() => getFarmerFarms(currentFarmerId));
  const [activeFarmIndex, setActiveFarmIndex] = useState(0);
  const [selectedFarmForModal, setSelectedFarmForModal] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [farmToDelete, setFarmToDelete] = useState(null);

  // Sync farms when storage changes or custom event fires
  useEffect(() => {
    const refreshFarms = () => {
      const updated = getFarmerFarms(currentFarmerId);
      setFarms(updated);
      if (activeFarmIndex >= updated.length) {
        setActiveFarmIndex(Math.max(0, updated.length - 1));
      }
    };

    window.addEventListener(FARMS_UPDATE_EVENT, refreshFarms);
    window.addEventListener('storage', refreshFarms);
    return () => {
      window.removeEventListener(FARMS_UPDATE_EVENT, refreshFarms);
      window.removeEventListener('storage', refreshFarms);
    };
  }, [currentFarmerId, activeFarmIndex]);

  // Open modal if URL has viewFarm parameter
  useEffect(() => {
    if (viewFarmParam && farms.length > 0) {
      const target = farms.find((f) => f.id === viewFarmParam);
      if (target) {
        setSelectedFarmForModal(target);
        setIsViewModalOpen(true);
        // Clear param after opening
        const next = new URLSearchParams(searchParams);
        next.delete('viewFarm');
        setSearchParams(next, { replace: true });
      }
    }
  }, [viewFarmParam, farms, searchParams, setSearchParams]);

  // Current active farm
  const currentFarm = farms[activeFarmIndex] || null;

  const handleOpenDetails = (farm) => {
    if (farm) {
      setSelectedFarmForModal(farm);
      setIsViewModalOpen(true);
    } else if (onViewDetails) {
      onViewDetails();
    }
  };

  const handleEditFarm = (farmId) => {
    navigate(`/onboarding/farm?edit=${farmId}`);
  };

  const handleDeleteConfirm = (farmId) => {
    try {
      deleteFarmRecord(farmId, currentFarmerId);
      setFarmToDelete(null);
      const updated = getFarmerFarms(currentFarmerId);
      setFarms(updated);
      setActiveFarmIndex(0);
    } catch (err) {
      alert(err.message || 'Error deleting farm');
    }
  };

  // If farmer has no farms yet
  if (!currentFarm) {
    return (
      <div className="glass-card rounded-[24px] p-6 md:col-span-8 flex flex-col justify-between border border-outline-variant/50 shadow-md">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-2xl">agriculture</span>
            </div>
            <div>
              <h3 className="font-headline-md font-bold text-on-surface text-lg sm:text-xl">
                {isEn ? 'My Farm Overview' : 'मेरे खेत का विवरण'}
              </h3>
              <p className="text-xs text-on-surface-variant">
                {isEn ? 'No farms registered yet' : 'अभी तक कोई खेत नहीं जोड़ा गया'}
              </p>
            </div>
          </div>
        </div>

        <div className="p-8 text-center bg-surface-container-low rounded-2xl border border-dashed border-outline-variant my-4 space-y-3">
          <span className="text-4xl block">🌱</span>
          <h4 className="font-bold text-sm text-on-surface">
            {isEn ? 'Register Your Farm' : 'अपना खेत पंजीकृत करें'}
          </h4>
          <p className="text-xs text-on-surface-variant max-w-sm mx-auto">
            {isEn
              ? 'Add your farm details to get personalized agricultural recommendations, weather advisories, and connect with direct buyers.'
              : 'व्यक्तिगत सलाह, मौसम पूर्वानुमान और सीधे खरीदारों से जुड़ने के लिए अपने खेत का विवरण जोड़ें।'}
          </p>
          <button
            onClick={() => navigate('/onboarding/farm')}
            className="inline-flex items-center gap-2 px-6 h-11 rounded-xl bg-primary text-white text-xs font-bold shadow-md hover:bg-primary-container transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">add</span>
            <span>{isEn ? 'Add Your Farm' : 'खेत जोड़ें'}</span>
          </button>
        </div>
      </div>
    );
  }

  // Formatting values matching User Requirement 12
  const otherCropsText =
    currentFarm.otherCrops && currentFarm.otherCrops.length > 0
      ? ` • ${currentFarm.otherCrops.slice(0, 2).join(' • ')}`
      : '';

  return (
    <>
      <div className="glass-card rounded-[24px] p-6 md:col-span-8 flex flex-col justify-between border border-outline-variant/50 shadow-md">
        
        {/* Header with Title & Multi-Farm Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-secondary-container flex items-center justify-center text-on-secondary-container shrink-0 shadow-2xs">
              <span className="material-symbols-outlined material-fill text-2xl">
                agriculture
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-headline-md font-bold text-on-surface text-lg sm:text-xl">
                  {currentFarm.farmName || (isEn ? 'My Farm Overview' : 'मेरे खेत का विवरण')}
                </h3>
                <span className="bg-secondary-fixed text-on-secondary-fixed-variant px-2.5 py-0.5 rounded-full font-label-md text-[11px] font-bold shadow-2xs">
                  {currentFarm.status || (isEn ? dashboardData.farmOverview.statusEn : dashboardData.farmOverview.statusHi)}
                </span>
              </div>
              <p className="font-body-md text-xs sm:text-sm text-on-surface-variant flex items-center gap-1 mt-0.5">
                <span className="material-symbols-outlined text-[16px] text-primary">location_on</span>
                <span>
                  {currentFarm.village ? `${currentFarm.village}, ` : ''}{currentFarm.district}, {currentFarm.state}
                </span>
              </p>
            </div>
          </div>

          {/* Multi-farm tabs if user has > 1 farm */}
          <div className="flex items-center gap-2 flex-wrap">
            {farms.length > 1 && (
              <div className="flex items-center bg-surface-container rounded-xl p-1 border border-outline-variant/40">
                {farms.map((f, idx) => (
                  <button
                    key={f.id}
                    onClick={() => setActiveFarmIndex(idx)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      activeFarmIndex === idx
                        ? 'bg-primary text-white shadow-xs'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    {f.farmName.split(' ')[0]}
                  </button>
                ))}
              </div>
            )}

            <button
              onClick={() => navigate('/onboarding/farm')}
              className="px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
              title={isEn ? 'Add Another Farm' : 'एक और खेत जोड़ें'}
            >
              <span className="material-symbols-outlined text-sm">add</span>
              <span>{isEn ? '+ Add Farm' : '+ खेत जोड़ें'}</span>
            </button>
          </div>
        </div>

        {/* 4 Item Stats Grid matching Requirement 12 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mb-6">
          {/* Crop */}
          <div className="bg-surface-container-low p-3.5 rounded-xl border border-outline-variant/30 flex flex-col justify-between">
            <p className="font-caption text-xs text-on-surface-variant mb-1 font-medium flex items-center gap-1">
              <span>🌾</span>
              <span>{isEn ? 'Crops Grown' : 'उगाई गई फसल'}</span>
            </p>
            <p className="font-body-lg text-sm sm:text-base font-bold text-primary truncate" title={`${currentFarm.primaryCrop}${otherCropsText}`}>
              {currentFarm.primaryCrop}{otherCropsText}
            </p>
          </div>

          {/* Land Area */}
          <div className="bg-surface-container-low p-3.5 rounded-xl border border-outline-variant/30 flex flex-col justify-between">
            <p className="font-caption text-xs text-on-surface-variant mb-1 font-medium flex items-center gap-1">
              <span>📐</span>
              <span>{isEn ? 'Land Area' : 'भूमि का आकार'}</span>
            </p>
            <p className="font-body-lg text-sm sm:text-base font-bold text-primary">
              {currentFarm.area} {currentFarm.areaUnit || 'Acres'}
            </p>
          </div>

          {/* Irrigation */}
          <div className="bg-surface-container-low p-3.5 rounded-xl border border-outline-variant/30 flex flex-col justify-between">
            <p className="font-caption text-xs text-on-surface-variant mb-1 font-medium flex items-center gap-1">
              <span>💧</span>
              <span>{isEn ? 'Irrigation' : 'सिंचाई'}</span>
            </p>
            <p className="font-body-lg text-sm sm:text-base font-bold text-primary truncate">
              {currentFarm.irrigationType}
            </p>
          </div>

          {/* Soil Type / Ownership */}
          <div className="bg-surface-container-low p-3.5 rounded-xl border border-outline-variant/30 flex flex-col justify-between">
            <p className="font-caption text-xs text-on-surface-variant mb-1 font-medium flex items-center gap-1">
              <span>🌱</span>
              <span>{isEn ? 'Soil & Type' : 'मिट्टी व प्रकार'}</span>
            </p>
            <p className="font-body-lg text-xs sm:text-sm font-bold text-primary truncate">
              {currentFarm.soilType} • {currentFarm.farmType}
            </p>
          </div>
        </div>

        {/* Action Buttons: View Farm | Edit | Delete (Matching Requirement 12) */}
        <div className="flex items-center gap-3 pt-2">
          {/* View Farm Button */}
          <button
            onClick={() => handleOpenDetails(currentFarm)}
            className="flex-1 h-12 bg-surface text-primary border-2 border-primary rounded-xl font-label-md text-xs sm:text-sm font-bold hover:bg-primary hover:text-white transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-95"
          >
            <span className="material-symbols-outlined text-lg">visibility</span>
            <span>{isEn ? 'View Farm' : 'खेत का विवरण देखें'}</span>
          </button>

          {/* Edit Button */}
          <button
            onClick={() => handleEditFarm(currentFarm.id)}
            className="h-12 px-4 bg-surface-container-high text-on-surface-variant border border-outline-variant rounded-xl flex items-center justify-center gap-1.5 hover:bg-primary hover:text-white transition-colors shrink-0 text-xs font-bold cursor-pointer"
            title={isEn ? 'Edit Farm' : 'संपादित करें'}
          >
            <span className="material-symbols-outlined text-lg">edit</span>
            <span className="hidden sm:inline">{isEn ? 'Edit' : 'बदलें'}</span>
          </button>

          {/* Delete Button */}
          <button
            onClick={() => setFarmToDelete(currentFarm)}
            className="h-12 px-4 bg-surface-container-high text-error hover:bg-error hover:text-white border border-outline-variant rounded-xl flex items-center justify-center gap-1.5 transition-colors shrink-0 text-xs font-bold cursor-pointer"
            title={isEn ? 'Delete Farm' : 'हटाएं'}
          >
            <span className="material-symbols-outlined text-lg">delete</span>
            <span className="hidden sm:inline">{isEn ? 'Delete' : 'हटाएं'}</span>
          </button>
        </div>

      </div>

      {/* View Farm Modal */}
      <FarmDetailsModal
        farm={selectedFarmForModal}
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedFarmForModal(null);
        }}
        isEn={isEn}
        onEdit={handleEditFarm}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        farm={farmToDelete}
        isOpen={Boolean(farmToDelete)}
        onClose={() => setFarmToDelete(null)}
        onConfirm={handleDeleteConfirm}
        isEn={isEn}
      />
    </>
  );
}
