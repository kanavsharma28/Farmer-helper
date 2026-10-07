import React from 'react';

export default function MobileBottomNav({ activeTab, setActiveTab, lang, onOpenLogin }) {
  const isEn = lang === 'en';

  const navItems = [
    { id: 'home', icon: 'home', labelEn: 'Home', labelHi: 'होम' },
    { id: 'services', icon: 'agriculture', labelEn: 'Services', labelHi: 'सेवाएं' },
    { id: 'marketplace', icon: 'storefront', labelEn: 'Market', labelHi: 'मंडी' },
    { id: 'community', icon: 'groups', labelEn: 'Social', labelHi: 'चर्चा' },
    { id: 'login', icon: 'person', labelEn: 'Profile', labelHi: 'प्रोफाइल', action: onOpenLogin },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-surface/95 backdrop-blur-lg border-t border-surface-variant shadow-[0_-4px_20px_rgba(0,0,0,0.06)] h-16 px-2 pb-safe flex justify-around items-center">
      {navItems.map((item) => {
        const isActive = activeTab === item.id;
        
        return (
          <button
            key={item.id}
            onClick={() => {
              if (item.action) {
                item.action();
              } else {
                setActiveTab(item.id);
              }
            }}
            className={`flex flex-col items-center justify-center px-3 py-1 rounded-full transition-all ${
              isActive 
                ? 'bg-secondary-container text-on-secondary-container font-semibold scale-105 shadow-sm' 
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            <span 
              className={`material-symbols-outlined text-2xl ${isActive ? 'material-fill' : ''}`}
            >
              {item.icon}
            </span>
            <span className="font-label-md text-[11px] leading-tight mt-0.5">
              {isEn ? item.labelEn : item.labelHi}
            </span>
          </button>
        );
      })}
    </div>
  );
}
