import React from 'react';
import { dashboardData } from '../../data/dashboardContent';

export default function ResourcesNearYou({ lang = 'en', onBookResource }) {
  const isEn = lang === 'en';
  const { resourcesNearYou } = dashboardData;

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-headline-md text-xl font-bold text-on-surface">
          {isEn ? 'Resources Near You' : 'निकटतम साधन'}
        </h2>
        <button
          onClick={() => alert(isEn ? 'Viewing all resources near Meerut' : 'मेरठ के सभी साधन देख रहे हैं')}
          className="font-label-md text-sm text-primary hover:underline font-semibold"
        >
          {isEn ? 'View All' : 'सभी देखें'}
        </button>
      </div>

      <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-4">
        {resourcesNearYou.map((res) => (
          <div
            key={res.id}
            className="min-w-[280px] bg-surface-container-lowest border border-outline-variant/50 rounded-[16px] p-4 shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-3"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-primary shrink-0">
                  <span className="material-symbols-outlined text-xl">
                    {res.icon}
                  </span>
                </div>
                <div>
                  <h4 className="font-body-md text-sm font-bold text-on-surface">
                    {isEn ? res.nameEn : res.nameHi}
                  </h4>
                  <p className="font-caption text-xs text-on-surface-variant flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">location_on</span>
                    {isEn ? res.distanceEn : res.distanceHi}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-end mt-2 pt-3 border-t border-outline-variant/30">
              <div>
                <span className="font-headline-md text-base font-extrabold text-primary">
                  {isEn ? res.priceEn : res.priceHi}
                </span>
                <span className="font-caption text-xs text-on-surface-variant ml-1 font-medium">
                  {isEn ? res.unitEn : res.unitHi}
                </span>
              </div>
              <button
                onClick={() => onBookResource && onBookResource(res.nameEn)}
                className="px-4 py-1.5 bg-primary/10 text-primary rounded-full font-label-md text-xs font-bold hover:bg-primary/20 transition-colors"
              >
                {isEn ? res.actionEn : res.actionHi}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
