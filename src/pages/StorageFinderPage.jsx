import React, { useState, useMemo, useCallback } from 'react';
import DashboardSidebar from '../components/dashboard/DashboardSidebar';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import DashboardMobileNav from '../components/dashboard/DashboardMobileNav';

import {
  LOCATIONS,
  STORAGE_FACILITIES,
  INITIAL_BOOKINGS,
} from '../data/storageData';

import StorageSearchHero from '../components/storage/StorageSearchHero';
import StorageFilters from '../components/storage/StorageFilters';
import StorageCard from '../components/storage/StorageCard';
import StorageMap from '../components/storage/StorageMap';
import StorageDetailsView from '../components/storage/StorageDetailsView';
import MyBookingsView from '../components/storage/MyBookingsView';
import LocationSelectModal from '../components/storage/LocationSelectModal';
import BookingSuccessModal from '../components/storage/BookingSuccessModal';

export default function StorageFinderPage() {
  const [lang, setLang] = useState('en');
  const [activeNav, setActiveNav] = useState('storageFinder');

  // Page View States: 'finder' | 'details' | 'bookings'
  const [activeView, setActiveView] = useState('finder');

  // Active Location
  const [activeLocation, setActiveLocation] = useState(LOCATIONS[0]);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedCrop, setSelectedCrop] = useState('all');
  const [selectedDistance, setSelectedDistance] = useState(50);
  const [selectedAvailability, setSelectedAvailability] = useState('all');
  const [selectedMaxPrice, setSelectedMaxPrice] = useState('all');
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // Sorting: 'nearest' | 'availability' | 'price' | 'rating'
  const [sortBy, setSortBy] = useState('nearest');

  // Mobile list vs map view toggle: 'list' | 'map'
  const [mobileTab, setMobileTab] = useState('list');

  // Active Facilities & Details View
  const [selectedFacilityId, setSelectedFacilityId] = useState(STORAGE_FACILITIES[0]?.id || null);
  const [detailedFacility, setDetailedFacility] = useState(STORAGE_FACILITIES[0] || null);

  // Bookings State
  const [bookings, setBookings] = useState(INITIAL_BOOKINGS);
  const [latestSubmittedBooking, setLatestSubmittedBooking] = useState(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  // Calculate active filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedType !== 'all') count++;
    if (selectedCrop !== 'all') count++;
    if (selectedDistance < 50) count++;
    if (selectedAvailability !== 'all') count++;
    if (selectedMaxPrice !== 'all') count++;
    if (selectedAmenities.length > 0) count += selectedAmenities.length;
    return count;
  }, [selectedType, selectedCrop, selectedDistance, selectedAvailability, selectedMaxPrice, selectedAmenities]);

  const handleResetFilters = useCallback(() => {
    setSelectedType('all');
    setSelectedCrop('all');
    setSelectedDistance(50);
    setSelectedAvailability('all');
    setSelectedMaxPrice('all');
    setSelectedAmenities([]);
    setSearchQuery('');
  }, []);

  // Filter & Sort facilities
  const filteredFacilities = useMemo(() => {
    return STORAGE_FACILITIES.filter((fac) => {
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = fac.name.toLowerCase().includes(q) || fac.nameHi.includes(q);
        const matchArea = fac.area.toLowerCase().includes(q) || fac.address.toLowerCase().includes(q);
        const matchCrop = fac.supportedCrops.some((c) => c.toLowerCase().includes(q));
        const matchType = fac.type.toLowerCase().includes(q);
        if (!matchName && !matchArea && !matchCrop && !matchType) return false;
      }

      // Type filter
      if (selectedType !== 'all' && fac.type !== selectedType) {
        return false;
      }

      // Crop filter
      if (selectedCrop !== 'all' && !fac.supportedCrops.includes(selectedCrop)) {
        return false;
      }

      // Distance filter
      if (fac.distanceKm > selectedDistance) {
        return false;
      }

      // Availability filter
      if (selectedAvailability === 'available' && fac.status !== 'available') {
        return false;
      }
      if (selectedAvailability === 'limited' && fac.status !== 'limited') {
        return false;
      }

      // Max price filter
      if (selectedMaxPrice !== 'all' && fac.ratePerQtl > Number(selectedMaxPrice)) {
        return false;
      }

      // Amenities filter
      if (selectedAmenities.length > 0) {
        const hasAll = selectedAmenities.every((a) => fac.amenities.includes(a));
        if (!hasAll) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'nearest') return a.distanceKm - b.distanceKm;
      if (sortBy === 'availability') return b.capacityAvailable - a.capacityAvailable;
      if (sortBy === 'price') return a.ratePerQtl - b.ratePerQtl;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });
  }, [searchQuery, selectedType, selectedCrop, selectedDistance, selectedAvailability, selectedMaxPrice, selectedAmenities, sortBy]);

  // Selected facility for map marker highlight
  const selectedFacility = useMemo(() => {
    return STORAGE_FACILITIES.find((f) => f.id === selectedFacilityId) || filteredFacilities[0] || null;
  }, [selectedFacilityId, filteredFacilities]);

  // Handlers
  const handleViewDetails = (facility) => {
    setDetailedFacility(facility);
    setActiveView('details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBookingSubmit = (bookingData) => {
    const randomId = `SFR-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newBooking = {
      ...bookingData,
      id: randomId,
      status: 'pending',
      statusLabelEn: 'Pending Verification',
      statusLabelHi: 'सत्यापन प्रक्रियाधीन',
      statusClass: 'bg-tertiary-fixed text-on-tertiary-fixed',
      timelineStep: 2,
      createdAt: 'Just now',
    };

    setBookings((prev) => [newBooking, ...prev]);
    setLatestSubmittedBooking(newBooking);
    setIsSuccessModalOpen(true);
  };

  const handleCancelBooking = (bookingId) => {
    if (window.confirm(lang === 'en' ? 'Are you sure you want to cancel this booking request?' : 'क्या आप इस बुकिंग अनुरोध को रद्द करना चाहते हैं?')) {
      setBookings((prev) =>
        prev.map((b) =>
          b.id === bookingId
            ? {
                ...b,
                status: 'cancelled',
                statusLabelEn: 'Cancelled by Farmer',
                statusLabelHi: 'किसान द्वारा रद्द',
                statusClass: 'bg-error-container text-on-error-container',
              }
            : b
        )
      );
    }
  };

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col lg:flex-row font-sans selection:bg-primary-container selection:text-white">
      {/* Desktop Sticky Sidebar */}
      <DashboardSidebar
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        lang={lang}
      />

      {/* Main Content Column */}
      <div className="flex-1 flex flex-col min-w-0 pb-24 lg:pb-8">
        {/* Top Header Bar */}
        <DashboardHeader
          lang={lang}
          setLang={setLang}
        />

        {/* Dynamic Page Main Canvas */}
        <main className="flex-1 p-4 sm:p-6 lg:p-10 overflow-y-auto space-y-6">
          {/* Top Hero & Search Controls (Rendered on finder or bookings) */}
          <StorageSearchHero
            lang={lang}
            activeView={activeView}
            setActiveView={setActiveView}
            activeLocation={activeLocation}
            onOpenLocationModal={() => setIsLocationModalOpen(true)}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onOpenFilterModal={() => setIsFilterModalOpen(true)}
            activeFiltersCount={activeFiltersCount}
            onResetFilters={handleResetFilters}
            selectedType={selectedType}
            setSelectedType={setSelectedType}
            selectedCrop={selectedCrop}
            setSelectedCrop={setSelectedCrop}
            bookingsCount={bookings.filter((b) => b.status === 'pending' || b.status === 'confirmed').length}
            facilitiesCount={filteredFacilities.length}
          />

          {/* VIEW 1: Storage Finder Main Hub (List + Map) */}
          {activeView === 'finder' && (
            <div className="space-y-6">
              {/* Mobile View Switcher Pill (List View vs Map View) */}
              <div className="flex sm:hidden bg-surface-container-low p-1 rounded-2xl border border-outline-variant/40 shadow-inner">
                <button
                  onClick={() => setMobileTab('list')}
                  type="button"
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    mobileTab === 'list'
                      ? 'bg-surface text-primary shadow-sm'
                      : 'text-on-surface-variant'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">format_list_bulleted</span>
                  <span>{lang === 'en' ? `List View (${filteredFacilities.length})` : `सूची दृश्य (${filteredFacilities.length})`}</span>
                </button>

                <button
                  onClick={() => setMobileTab('map')}
                  type="button"
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    mobileTab === 'map'
                      ? 'bg-surface text-primary shadow-sm'
                      : 'text-on-surface-variant'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">map</span>
                  <span>{lang === 'en' ? 'Map Radar' : 'मैप राडार'}</span>
                </button>
              </div>

              {/* Main Split Layout: Facilities List (Left 58%) & Dynamic Map (Right 42%) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left Column: Storage Results */}
                <div className={`lg:col-span-7 space-y-4 ${mobileTab === 'map' ? 'hidden sm:block' : 'block'}`}>
                  {/* Sorting & Result Count Row */}
                  <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-2">
                      <span className="font-headline-md text-base sm:text-lg font-bold text-on-surface">
                        {lang === 'en' ? 'Available Storage Centers' : 'उपलब्ध केंद्र'}
                      </span>
                      <span className="bg-secondary-container text-on-secondary-container px-2.5 py-0.5 rounded-full text-xs font-bold">
                        {filteredFacilities.length} {lang === 'en' ? 'Centers' : 'उपलब्ध'}
                      </span>
                    </div>

                    {/* Sorting Select */}
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-on-surface-variant">
                      <span className="hidden sm:inline">{lang === 'en' ? 'Sort by:' : 'क्रमबद्ध:'}</span>
                      <div className="relative">
                        <select
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value)}
                          className="appearance-none bg-surface border border-outline-variant/40 rounded-xl px-3 py-1.5 pr-7 text-xs font-bold text-primary focus:outline-none cursor-pointer"
                        >
                          <option value="nearest">{lang === 'en' ? 'Distance (Nearest)' : 'दूरी (निकटतम)'}</option>
                          <option value="availability">{lang === 'en' ? 'Highest Availability' : 'अधिकतम खाली जगह'}</option>
                          <option value="price">{lang === 'en' ? 'Lowest Rental Rate' : 'न्यूनतम किराया'}</option>
                          <option value="rating">{lang === 'en' ? 'Highest Rating' : 'उच्चतम रेटिंग'}</option>
                        </select>
                        <span className="material-symbols-outlined absolute right-1.5 top-1/2 -translate-y-1/2 text-primary text-[16px] pointer-events-none">
                          expand_more
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Empty State when 0 facilities match filters */}
                  {filteredFacilities.length === 0 ? (
                    <div className="bg-surface rounded-3xl p-10 sm:p-14 text-center border border-dashed border-outline-variant/60 space-y-4">
                      <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center mx-auto text-outline">
                        <span className="material-symbols-outlined text-[32px]">search_off</span>
                      </div>
                      <div>
                        <h3 className="font-headline-sm text-base sm:text-lg font-bold text-on-surface">
                          {lang === 'en' ? 'No Storage Found in this Area' : 'आपके आसपास कोई Storage नहीं मिला'}
                        </h3>
                        <p className="text-xs text-on-surface-variant mt-1 max-w-sm mx-auto">
                          {lang === 'en'
                            ? 'Try expanding your distance radius, adjusting crop filters, or changing your district location.'
                            : 'Location बदलकर या search radius बढ़ाकर दोबारा कोशिश करें।'}
                        </p>
                      </div>
                      <div className="flex items-center justify-center gap-3 pt-2">
                        <button
                          onClick={handleResetFilters}
                          type="button"
                          className="px-4 py-2.5 rounded-xl bg-primary text-on-primary font-bold text-xs shadow-sm cursor-pointer"
                        >
                          {lang === 'en' ? 'Clear All Filters' : 'फिल्टर रीसेट करें'}
                        </button>
                        <button
                          onClick={() => setIsLocationModalOpen(true)}
                          type="button"
                          className="px-4 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-semibold text-xs cursor-pointer"
                        >
                          {lang === 'en' ? 'Change Location' : 'स्थान बदलें'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredFacilities.map((fac) => (
                        <StorageCard
                          key={fac.id}
                          facility={fac}
                          isSelected={selectedFacility?.id === fac.id}
                          onSelect={(f) => setSelectedFacilityId(f.id)}
                          onViewDetails={handleViewDetails}
                          lang={lang}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Right Column: Dynamic Interactive Map (Desktop Sticky or Mobile Map Tab) */}
                <div className={`lg:col-span-5 lg:sticky lg:top-20 ${mobileTab === 'list' ? 'hidden sm:block' : 'block'}`}>
                  <StorageMap
                    facilities={filteredFacilities}
                    selectedFacility={selectedFacility}
                    onSelectFacility={(f) => {
                      setSelectedFacilityId(f.id);
                      if (mobileTab === 'map') {
                        // On mobile, clicking a pin previews the facility
                      }
                    }}
                    onViewDetails={handleViewDetails}
                    lang={lang}
                  />
                </div>
              </div>
            </div>
          )}

          {/* VIEW 2: Storage Facility Details & Booking Form */}
          {activeView === 'details' && detailedFacility && (
            <StorageDetailsView
              facility={detailedFacility}
              onBack={() => {
                setActiveView('finder');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onSubmitBooking={handleBookingSubmit}
              lang={lang}
            />
          )}

          {/* VIEW 3: My Storage Bookings Dashboard */}
          {activeView === 'bookings' && (
            <MyBookingsView
              bookings={bookings}
              onCancelBooking={handleCancelBooking}
              onStartNewBooking={() => {
                setActiveView('finder');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              lang={lang}
            />
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <DashboardMobileNav
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        lang={lang}
      />

      {/* Location Selection Modal */}
      <LocationSelectModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        activeLocation={activeLocation}
        onSelectLocation={(loc) => {
          setActiveLocation(loc);
          handleResetFilters();
        }}
        lang={lang}
      />

      {/* Full Filter Modal & Mobile Bottom Sheet */}
      <StorageFilters
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        selectedCrop={selectedCrop}
        setSelectedCrop={setSelectedCrop}
        selectedDistance={selectedDistance}
        setSelectedDistance={setSelectedDistance}
        selectedAvailability={selectedAvailability}
        setSelectedAvailability={setSelectedAvailability}
        selectedMaxPrice={selectedMaxPrice}
        setSelectedMaxPrice={setSelectedMaxPrice}
        selectedAmenities={selectedAmenities}
        setSelectedAmenities={setSelectedAmenities}
        onResetFilters={handleResetFilters}
        lang={lang}
      />

      {/* Booking Confirmation Success Modal */}
      <BookingSuccessModal
        isOpen={isSuccessModalOpen}
        booking={latestSubmittedBooking}
        onViewBookings={() => {
          setIsSuccessModalOpen(false);
          setActiveView('bookings');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onBackToFinder={() => {
          setIsSuccessModalOpen(false);
          setActiveView('finder');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        lang={lang}
      />
    </div>
  );
}
