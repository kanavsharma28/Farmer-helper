import React from 'react';
import { COMMUNITY_CATEGORIES } from '../../data/communityData';

export default function CommunityLeftSidebar({
  activeView,
  setActiveView,
  selectedCategory,
  setSelectedCategory,
  selectedRoleFilter,
  setSelectedRoleFilter,
  myPostsCount = 0,
  savedPostsCount = 0,
  myCommentsCount = 0,
  lang = 'en',
}) {
  const isEn = lang === 'en';

  const viewTabs = [
    {
      id: 'feed',
      labelEn: 'Community Home',
      labelHi: 'समुदाय होम',
      icon: 'home',
      count: null,
    },
    {
      id: 'my-posts',
      labelEn: 'My Posts',
      labelHi: 'मेरी पोस्ट',
      icon: 'edit_document',
      count: myPostsCount,
    },
    {
      id: 'saved',
      labelEn: 'Saved Posts',
      labelHi: 'सहेजी गई पोस्ट',
      icon: 'bookmark',
      count: savedPostsCount,
    },
    {
      id: 'my-comments',
      labelEn: 'My Comments',
      labelHi: 'मेरी टिप्पणियां',
      icon: 'forum',
      count: myCommentsCount,
    },
  ];

  const roleFilterOptions = [
    { id: 'all', labelEn: 'All Roles', labelHi: 'सभी', icon: 'groups' },
    { id: 'farmer', labelEn: 'Farmers', labelHi: 'किसान', icon: 'agriculture' },
    { id: 'student', labelEn: 'Students', labelHi: 'छात्र', icon: 'school' },
    { id: 'buyer', labelEn: 'Buyers', labelHi: 'खरीदार', icon: 'storefront' },
    { id: 'provider', labelEn: 'Providers', labelHi: 'प्रदाता', icon: 'handshake' },
  ];

  return (
    <div className="space-y-6">
      {/* ── Main Navigation Views ── */}
      <div className="bg-surface-container-lowest rounded-2xl p-3 border border-outline-variant/30 shadow-xs space-y-1">
        <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-outline">
          {isEn ? 'Navigation' : 'नेविगेशन'}
        </div>
        {viewTabs.map((tab) => {
          const isActive = activeView === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveView(tab.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-primary-container text-white shadow-xs'
                  : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span
                  className={`material-symbols-outlined text-[19px] ${
                    isActive ? 'text-white' : 'text-outline'
                  }`}
                >
                  {tab.icon}
                </span>
                <span>{isEn ? tab.labelEn : tab.labelHi}</span>
              </div>
              {tab.count !== null && (
                <span
                  className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-surface-container-high text-on-surface-variant'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Role Filter ── */}
      <div className="bg-surface-container-lowest rounded-2xl p-4 border border-outline-variant/30 shadow-xs space-y-3">
        <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-outline">
          <span>{isEn ? 'Filter by Role' : 'रोल अनुसार फिल्टर'}</span>
          {selectedRoleFilter !== 'all' && (
            <button
              onClick={() => setSelectedRoleFilter('all')}
              className="text-primary hover:underline lowercase font-normal"
            >
              {isEn ? 'clear' : 'हटाएं'}
            </button>
          )}
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {roleFilterOptions.map((roleOpt) => {
            const isSelected = selectedRoleFilter === roleOpt.id;
            return (
              <button
                key={roleOpt.id}
                type="button"
                onClick={() => setSelectedRoleFilter(roleOpt.id)}
                className={`flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-xs font-semibold transition-all border cursor-pointer ${
                  isSelected
                    ? 'bg-primary/10 border-primary text-primary shadow-2xs font-bold'
                    : 'bg-surface-container-low border-outline-variant/30 text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">{roleOpt.icon}</span>
                <span className="truncate">{isEn ? roleOpt.labelEn : roleOpt.labelHi}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Agricultural Categories ── */}
      <div className="bg-surface-container-lowest rounded-2xl p-4 border border-outline-variant/30 shadow-xs space-y-2">
        <div className="flex items-center justify-between px-1 text-[11px] font-bold uppercase tracking-wider text-outline">
          <span>{isEn ? 'Categories' : 'श्रेणियां'}</span>
          {selectedCategory !== 'all' && (
            <button
              onClick={() => setSelectedCategory('all')}
              className="text-primary hover:underline lowercase font-normal"
            >
              {isEn ? 'all' : 'सभी'}
            </button>
          )}
        </div>

        <div className="space-y-1">
          {COMMUNITY_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all text-left cursor-pointer ${
                  isSelected
                    ? 'bg-primary/10 text-primary font-bold border border-primary/20 shadow-2xs'
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                }`}
              >
                <span className="text-base leading-none shrink-0">{cat.emoji}</span>
                <span className="truncate">{isEn ? cat.labelEn : cat.labelHi}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
