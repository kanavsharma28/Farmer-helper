import React, { useState, useRef, useEffect } from 'react';
import { FILTER_METADATA } from '../../data/internshipsData';

export default function InternshipSearch({
  searchQuery,
  setSearchQuery,
  selectedLocation,
  setSelectedLocation,
  activeQuickChip,
  setActiveQuickChip,
  totalResults,
  sortBy,
  setSortBy,
  viewMode,
  setViewMode,
  onOpenMobileFilters,
  savedCount = 0
}) {
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const locationRef = useRef(null);

  // Close location dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (locationRef.current && !locationRef.current.contains(event.target)) {
        setIsLocationDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const quickChips = [
    { id: 'all', label: 'All Types' },
    { id: 'paid', label: 'Paid Internship (Stipend)' },
    { id: 'training', label: 'Farm Training (Cert.)' },
    { id: 'duration-1-3', label: 'Duration: 1-3 Months' },
    { id: 'accommodation', label: 'Accommodation Provided' },
    { id: 'beginner', label: 'Beginner Friendly' },
    { id: 'saved', label: `Saved (${savedCount})` }
  ];

  return (
    <section className="space-y-4">
      {/* Search Input, Location Dropdown, & Search Button Bar */}
      <div className="p-3 sm:p-4 md:p-5 rounded-2xl bg-surface-container-lowest shadow-sm border border-outline-variant/30 flex flex-col md:flex-row items-stretch md:items-center gap-3">
        
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-[22px]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-surface-container-low rounded-xl font-body-md text-sm text-on-surface placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/20 transition-all"
            placeholder="Internship, skill या location खोजें (e.g. Farm Management, Horticulture, Organic Farming, Delhi NCR)..."
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface p-1 rounded-lg"
              title="Clear search"
            >
              <span className="material-symbols-outlined text-base">close</span>
            </button>
          )}
        </div>

        {/* Location Picker Dropdown Button */}
        <div className="w-full md:w-auto relative shrink-0" ref={locationRef}>
          <button
            type="button"
            onClick={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}
            className="w-full md:w-auto inline-flex items-center justify-between gap-3 px-4 py-3 bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-sm rounded-xl transition-colors border border-outline-variant/30"
          >
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">distance</span>
              <span className="font-medium truncate max-w-[180px]">
                {selectedLocation ? `📍 ${selectedLocation}` : '📍 All Locations'}
              </span>
            </div>
            <span className="material-symbols-outlined text-[18px] text-outline">
              {isLocationDropdownOpen ? 'expand_less' : 'expand_more'}
            </span>
          </button>

          {isLocationDropdownOpen && (
            <div className="absolute right-0 mt-2 w-72 max-h-60 overflow-y-auto bg-surface-container-lowest rounded-2xl shadow-xl border border-outline-variant/40 z-50 p-2 text-sm">
              <button
                type="button"
                onClick={() => {
                  setSelectedLocation('');
                  setIsLocationDropdownOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                  !selectedLocation ? 'bg-primary text-on-primary font-bold' : 'hover:bg-surface-container-low text-on-surface'
                }`}
              >
                All Locations (सभी क्षेत्र)
              </button>
              {FILTER_METADATA.locations.filter(l => l !== 'All North India').map((loc) => (
                <button
                  key={loc}
                  type="button"
                  onClick={() => {
                    setSelectedLocation(loc);
                    setIsLocationDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors truncate ${
                    selectedLocation === loc
                      ? 'bg-primary text-on-primary font-bold'
                      : 'hover:bg-surface-container-low text-on-surface'
                  }`}
                >
                  📍 {loc}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Primary Action */}
        <div className="flex items-center gap-2">
          {/* Mobile Filters Toggle Trigger */}
          <button
            type="button"
            onClick={onOpenMobileFilters}
            className="lg:hidden flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-surface-container text-on-surface font-label-md text-sm font-semibold hover:bg-surface-container-high transition-colors border border-outline-variant/30"
          >
            <span className="material-symbols-outlined text-[20px] text-primary">tune</span>
            <span>Filters</span>
          </button>

          <button
            type="button"
            className="flex-1 md:flex-none px-6 py-3 rounded-xl bg-primary text-on-primary font-label-md text-sm font-semibold hover:bg-primary-container transition-colors shrink-0 shadow-sm"
          >
            Search Now
          </button>
        </div>

      </div>

      {/* Filter Chips Row & Grid/List Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4">
        
        {/* Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none">
          {quickChips.map((chip) => {
            const isActive = activeQuickChip === chip.id;
            return (
              <button
                key={chip.id}
                type="button"
                onClick={() => setActiveQuickChip(isActive && chip.id !== 'all' ? 'all' : chip.id)}
                className={`px-3.5 py-1.5 rounded-full font-label-md text-xs sm:text-sm font-medium shrink-0 transition-all shadow-2xs ${
                  isActive
                    ? 'bg-primary text-on-primary shadow-xs font-semibold'
                    : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container border border-outline-variant/30'
                }`}
              >
                {chip.label}
              </button>
            );
          })}
        </div>

        {/* Active Count & Sort */}
        <div className="flex items-center justify-between lg:justify-end gap-3 shrink-0">
          <span className="font-label-md text-xs sm:text-sm text-on-surface-variant font-medium">
            <strong className="text-primary font-bold text-base">{totalResults}</strong> Opportunities Found
          </span>

          <div className="flex items-center gap-1.5 bg-surface-container-lowest p-1 rounded-xl shadow-xs border border-outline-variant/30">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent font-label-md text-xs sm:text-sm text-on-surface py-1 px-2 focus:outline-none cursor-pointer"
            >
              <option value="relevant">Most Relevant</option>
              <option value="stipend-high">Highest Stipend</option>
              <option value="deadline-soon">Deadline Soon</option>
              <option value="newest">Recently Added</option>
            </select>
            <div className="h-4 w-px bg-surface-container-high"></div>
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-surface-container text-primary'
                  : 'text-outline hover:text-on-surface'
              }`}
              title="Grid view"
            >
              <span className="material-symbols-outlined text-[18px]">grid_view</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'list'
                  ? 'bg-surface-container text-primary'
                  : 'text-outline hover:text-on-surface'
              }`}
              title="List view"
            >
              <span className="material-symbols-outlined text-[18px]">format_list_bulleted</span>
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
