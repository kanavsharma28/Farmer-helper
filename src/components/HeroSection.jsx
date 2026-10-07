import React from 'react';
import heroImg from '../assets/hero_farmer.jpg';
import { translations } from '../data/content';

export default function HeroSection({ lang, onExploreServices, onOpenNearbyHelp }) {
  const t = translations[lang] || translations.en;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-12 md:py-20 grid md:grid-cols-2 gap-12 items-center">
      {/* Left Column Content */}
      <div className="space-y-6">
        {/* Tag Badge */}
        <div className="inline-flex items-center gap-2 bg-secondary/10 border border-secondary/20 text-secondary px-4 py-2 rounded-full font-label-md shadow-sm">
          <span className="material-symbols-outlined text-xl material-fill text-secondary">
            eco
          </span>
          <span>{t.tagline}</span>
        </div>

        {/* Main Heading */}
        <h1 className="font-display-lg text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-on-surface leading-[1.15]">
          {t.heroTitle.split(t.heroHighlight)[0]}
          <span className="text-primary-container block sm:inline underline decoration-secondary-container decoration-4 underline-offset-8">
            {t.heroHighlight}
          </span>
        </h1>

        {/* Subtitle */}
        <p className="font-body-lg text-lg sm:text-xl text-on-surface-variant max-w-xl leading-relaxed">
          {t.heroSubtitle}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-2">
          <button
            onClick={onExploreServices}
            className="bg-primary-container text-on-primary-container px-8 py-4 rounded-full font-label-md hover:bg-primary hover:text-on-primary transition-all duration-300 shadow-md hover:shadow-xl flex items-center justify-center gap-3 h-14 group active:scale-95"
          >
            <span>{t.exploreServices}</span>
            <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">
              arrow_forward
            </span>
          </button>

          <button
            onClick={onOpenNearbyHelp}
            className="border-2 border-outline/40 text-primary hover:border-primary px-8 py-4 rounded-full font-label-md hover:bg-surface-container-low transition-all duration-300 flex items-center justify-center gap-3 h-14 active:scale-95 bg-white/80"
          >
            <span className="material-symbols-outlined material-fill text-primary">
              my_location
            </span>
            <span>{t.findHelpNearMe}</span>
          </button>
        </div>

        {/* Feature Checkmarks */}
        <div className="flex flex-wrap gap-4 pt-4 text-sm text-on-surface-variant font-medium">
          <span className="flex items-center gap-2 bg-surface-container px-3 py-1.5 rounded-lg">
            <span className="material-symbols-outlined text-secondary text-lg">check_circle</span>
            {t.simpleToUse}
          </span>
          <span className="flex items-center gap-2 bg-surface-container px-3 py-1.5 rounded-lg">
            <span className="material-symbols-outlined text-secondary text-lg">check_circle</span>
            {t.hindiFriendly}
          </span>
          <span className="flex items-center gap-2 bg-surface-container px-3 py-1.5 rounded-lg">
            <span className="material-symbols-outlined text-secondary text-lg">check_circle</span>
            {t.access247}
          </span>
        </div>
      </div>

      {/* Right Column Image & Floating Cards */}
      <div className="relative">
        <div className="rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white bg-surface-container-low group">
          <img
            src={heroImg}
            alt="Indian farmer standing in a lush green agricultural field with a smartphone"
            className="w-full h-[420px] sm:h-[500px] object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none"></div>
        </div>

        {/* Floating Card 1: Resources Near You */}
        <div 
          onClick={onOpenNearbyHelp}
          className="absolute top-6 -left-4 sm:-left-8 glass-card rounded-2xl p-4 shadow-xl flex items-center gap-3 animate-float border border-white/60 cursor-pointer hover:scale-105 transition-transform"
        >
          <div className="bg-primary-container/20 p-3 rounded-full text-primary-container flex items-center justify-center">
            <span className="material-symbols-outlined material-fill text-2xl">
              location_on
            </span>
          </div>
          <div>
            <div className="text-base font-bold text-on-surface">12 Resources</div>
            <div className="text-xs text-on-surface-variant font-medium">{t.resourcesNearYou}</div>
          </div>
        </div>

        {/* Floating Card 2: Crop Profit */}
        <div className="absolute bottom-10 -right-4 sm:-right-6 glass-card rounded-2xl p-4 shadow-xl flex items-center gap-3 border border-white/60 hover:scale-105 transition-transform">
          <div className="bg-secondary-container/80 p-3 rounded-full text-on-secondary-container flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl font-bold">
              currency_rupee
            </span>
          </div>
          <div>
            <div className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider">{t.cropProfit}</div>
            <div className="text-2xl font-extrabold text-primary-container">₹42,500</div>
          </div>
        </div>

      </div>
    </section>
  );
}
