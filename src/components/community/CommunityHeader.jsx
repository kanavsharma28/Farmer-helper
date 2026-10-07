import React from 'react';
import { ROLE_LABELS } from '../../data/navigationConfig';

export default function CommunityHeader({
  searchQuery,
  setSearchQuery,
  onOpenCreatePost,
  currentUser,
  lang = 'en',
  totalPostsCount = 0,
}) {
  const isEn = lang === 'en';
  const roleLabel = ROLE_LABELS[currentUser?.role] || ROLE_LABELS.farmer;

  return (
    <div className="bg-surface-container-lowest rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-outline-variant/30 shadow-xs space-y-5">
      {/* Top Banner Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-2xl">groups</span>
            </div>
            <div>
              <h1 className="font-display-lg text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
                {isEn ? 'Community' : 'कृषि समुदाय मंच'}
              </h1>
            </div>
            <span className="hidden sm:inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold bg-surface-container-high text-on-surface-variant">
              {totalPostsCount} {isEn ? 'Discussions' : 'चर्चाएं'}
            </span>
          </div>
          <p className="text-sm text-on-surface-variant max-w-2xl">
            {isEn
              ? 'Connect, learn and share with the Farmer Helper community.'
              : 'किसान सहायक समुदाय से जुड़ें, सीखें और अपने अनुभव साझा करें।'}
          </p>
        </div>

        {/* Right Action: User Status & Create Post Button */}
        <div className="flex items-center gap-3 self-start md:self-center">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            <span className="text-on-surface-variant font-medium">
              {isEn ? 'Active as:' : 'लॉगिन:'}
            </span>
            <span className={`font-bold flex items-center gap-1 ${roleLabel.badgeText}`}>
              <span className="material-symbols-outlined text-[14px]">{roleLabel.icon}</span>
              {currentUser?.name || 'User'}
            </span>
          </div>

          <button
            type="button"
            onClick={onOpenCreatePost}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#115322] via-[#1a6e2e] to-[#2d8c39] text-white font-semibold text-sm shadow-[0_4px_14px_rgba(18,83,33,0.28)] hover:shadow-[0_6px_20px_rgba(18,83,33,0.38)] hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">add_circle</span>
            <span>{isEn ? '+ Create Post' : '+ पोस्ट लिखें'}</span>
          </button>
        </div>
      </div>

      {/* Search Bar & Quick Topic Hints */}
      <div className="relative w-full">
        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-xl pointer-events-none">
          search
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={
            isEn
              ? 'Search by crop, disease, equipment, buyer demand, location or author...'
              : 'फसल, बीमारी, साधन, खरीद मांग, स्थान या लेखक द्वारा खोजें...'
          }
          className="w-full pl-11 pr-10 py-3 rounded-2xl bg-surface-container-low border border-outline-variant/40 text-sm text-on-surface placeholder:text-on-surface-variant/70 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-surface-bright transition-all"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-surface-container-high text-on-surface-variant hover:text-on-surface flex items-center justify-center text-xs"
            title="Clear search"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        )}
      </div>
    </div>
  );
}
