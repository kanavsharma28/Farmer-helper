import React from 'react';
import { dashboardData } from '../../data/dashboardContent';

export default function WelcomeWeatherHeader({ lang = 'en', onAddFarm }) {
  const isEn = lang === 'en';
  const { farmer, weather } = dashboardData;

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
      <div>
        <h1 className="font-display-lg-mobile md:font-display-lg text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mb-2 tracking-tight">
          {isEn ? `Namaste, ${farmer.name.split(' ')[0]} 👋` : `नमस्ते, ${farmer.nameHi.split(' ')[0]} 👋`}
        </h1>
        <p className="font-body-lg text-on-surface-variant text-base sm:text-lg">
          {isEn ? "Here's what's happening with your farm today." : "आज आपके खेत का ताज़ा विवरण।"}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
        {/* Weather Chip */}
        <div className="flex items-center gap-3 bg-tertiary-fixed border border-outline-variant/60 rounded-full px-4 py-2 shadow-sm">
          <span className="material-symbols-outlined text-tertiary-container material-fill text-2xl">
            light_mode
          </span>
          <div className="flex flex-col text-left">
            <span className="font-label-md text-label-md text-on-tertiary-fixed font-bold text-xs sm:text-sm">
              {isEn ? weather.locationEn : weather.locationHi}
            </span>
            <span className="font-caption text-caption text-on-tertiary-fixed-variant text-xs font-medium">
              {weather.temp}, {isEn ? weather.conditionEn : weather.conditionHi}
            </span>
          </div>
        </div>

        {/* Add Farm Button */}
        <button
          onClick={onAddFarm}
          className="h-14 px-6 bg-primary text-on-primary rounded-[16px] font-label-md text-label-md font-semibold hover:bg-primary-container transition-all flex items-center justify-center gap-2 shadow-md active:scale-95 text-sm"
        >
          <span className="material-symbols-outlined text-xl">add</span>
          <span>{isEn ? 'Add Farm' : 'खेत जोड़ें'}</span>
        </button>
      </div>
    </div>
  );
}
