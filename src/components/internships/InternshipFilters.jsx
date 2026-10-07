import React from 'react';
import { FILTER_METADATA } from '../../data/internshipsData';

export default function InternshipFilters({
  selectedTypes,
  toggleType,
  selectedDomains,
  toggleDomain,
  selectedStipendRange,
  setSelectedStipendRange,
  selectedDuration,
  setSelectedDuration,
  selectedModes,
  toggleMode,
  selectedPerks,
  togglePerk,
  onResetFilters,
  isMobileDrawer = false,
  onCloseMobileDrawer
}) {
  const content = (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[20px]">filter_list</span>
          <h2 className="font-headline-md text-on-surface font-semibold text-base sm:text-lg leading-tight">
            Filters (फ़िल्टर)
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onResetFilters}
            className="font-label-md text-xs sm:text-sm text-primary font-semibold hover:underline cursor-pointer"
          >
            Reset All
          </button>
          {isMobileDrawer && (
            <button
              type="button"
              onClick={onCloseMobileDrawer}
              className="p-1 rounded-lg text-outline hover:text-on-surface"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter 1: Opportunity Type */}
      <div className="space-y-3">
        <h3 className="font-label-md font-semibold text-on-surface uppercase tracking-wider text-xs">
          Opportunity Type
        </h3>
        <div className="space-y-2.5">
          {FILTER_METADATA.opportunityTypes.map((t) => {
            const isChecked = selectedTypes.includes(t.id);
            return (
              <label
                key={t.id}
                className="flex items-center justify-between cursor-pointer group text-xs sm:text-sm"
              >
                <span className="flex items-center gap-2.5 font-body-md text-on-surface-variant group-hover:text-on-surface">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleType(t.id)}
                    className="w-4 h-4 rounded text-primary accent-primary cursor-pointer"
                  />
                  <span>{t.label}</span>
                </span>
                <span className="font-caption text-outline bg-surface-container px-2 py-0.5 rounded-full text-xs">
                  {t.count}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Filter 2: Agriculture Domain */}
      <div className="space-y-3 pt-2">
        <h3 className="font-label-md font-semibold text-on-surface uppercase tracking-wider text-xs">
          Agriculture Domain
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {FILTER_METADATA.domains.map((dom) => {
            const isSelected = selectedDomains.includes(dom);
            return (
              <button
                key={dom}
                type="button"
                onClick={() => toggleDomain(dom)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-primary text-on-primary font-semibold shadow-2xs'
                    : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                }`}
              >
                {dom}
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter 3: Stipend & Support */}
      <div className="space-y-3 pt-2">
        <h3 className="font-label-md font-semibold text-on-surface uppercase tracking-wider text-xs">
          Stipend &amp; Support
        </h3>
        <div className="space-y-2">
          {FILTER_METADATA.stipendRanges.map((r) => (
            <label
              key={r.id}
              className="flex items-center gap-2.5 cursor-pointer font-body-md text-xs sm:text-sm text-on-surface-variant hover:text-on-surface"
            >
              <input
                type="radio"
                name="stipend"
                value={r.id}
                checked={selectedStipendRange === r.id}
                onChange={() => setSelectedStipendRange(r.id)}
                className="w-4 h-4 text-primary accent-primary cursor-pointer"
              />
              <span>{r.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Filter 4: Duration */}
      <div className="space-y-3 pt-2">
        <h3 className="font-label-md font-semibold text-on-surface uppercase tracking-wider text-xs">
          Duration
        </h3>
        <div className="grid grid-cols-4 gap-1.5">
          {FILTER_METADATA.durations.map((d) => {
            const isSelected = selectedDuration === d.id;
            return (
              <button
                key={d.id}
                type="button"
                onClick={() => setSelectedDuration(isSelected ? 'all' : d.id)}
                className={`py-1.5 px-1.5 text-center rounded-lg font-caption text-xs transition-colors truncate ${
                  isSelected
                    ? 'bg-primary text-on-primary font-semibold shadow-2xs'
                    : 'bg-surface-container hover:bg-surface-container-high text-on-surface'
                }`}
              >
                {d.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter 5: Work Mode */}
      <div className="space-y-3 pt-2">
        <h3 className="font-label-md font-semibold text-on-surface uppercase tracking-wider text-xs">
          Work Setting / Mode
        </h3>
        <div className="space-y-2">
          {FILTER_METADATA.workModes.map((wm) => {
            const isChecked = selectedModes.includes(wm.id);
            return (
              <label
                key={wm.id}
                className="flex items-center gap-2.5 cursor-pointer font-body-md text-xs sm:text-sm text-on-surface-variant hover:text-on-surface"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleMode(wm.id)}
                  className="w-4 h-4 rounded text-primary accent-primary cursor-pointer"
                />
                <span>{wm.label}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Filter 6: Perks & Benefits */}
      <div className="space-y-3 pt-2">
        <h3 className="font-label-md font-semibold text-on-surface uppercase tracking-wider text-xs">
          Perks &amp; Benefits
        </h3>
        <div className="space-y-2.5">
          {FILTER_METADATA.perks.map((p) => {
            const isChecked = selectedPerks.includes(p.id);
            return (
              <label
                key={p.id}
                className="flex items-center justify-between cursor-pointer group text-xs sm:text-sm"
              >
                <span className="flex items-center gap-2.5 font-body-md text-on-surface-variant group-hover:text-on-surface">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => togglePerk(p.id)}
                    className="w-4 h-4 rounded text-primary accent-primary cursor-pointer"
                  />
                  <span>{p.label}</span>
                </span>
                <span className="font-caption text-outline bg-surface-container px-2 py-0.5 rounded-full text-xs">
                  {p.count}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Mobile Apply Button */}
      {isMobileDrawer && (
        <div className="pt-4 border-t border-outline-variant/30">
          <button
            type="button"
            onClick={onCloseMobileDrawer}
            className="w-full py-3 rounded-xl bg-primary text-on-primary font-label-md text-sm font-semibold shadow-sm"
          >
            Show Results
          </button>
        </div>
      )}
    </div>
  );

  if (isMobileDrawer) {
    return (
      <div className="fixed inset-0 z-50 flex">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
          onClick={onCloseMobileDrawer}
        />
        {/* Slide-over Drawer */}
        <div className="relative ml-auto w-full max-w-xs sm:max-w-sm h-full bg-surface-container-lowest p-6 shadow-2xl overflow-y-auto">
          {content}
        </div>
      </div>
    );
  }

  return (
    <aside className="space-y-5 bg-surface-container-lowest p-5 sm:p-6 rounded-2xl shadow-sm border border-outline-variant/30">
      {content}
    </aside>
  );
}
