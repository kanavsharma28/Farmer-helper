import React, { useState } from 'react';
import { mandiData, translations } from '../data/content';

export default function MarketplaceView({ lang }) {
  const isEn = lang === 'en';
  const t = translations[lang] || translations.en;

  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [alertSubscribed, setAlertSubscribed] = useState({});

  const filteredMandi = mandiData.filter((item) => {
    const cropName = isEn ? item.cropEn : item.cropHi;
    const mandiName = isEn ? item.mandiEn : item.mandiHi;
    const matchesSearch = cropName.toLowerCase().includes(search.toLowerCase()) || 
                          mandiName.toLowerCase().includes(search.toLowerCase());
    const matchesCat = filterCategory === 'all' || item.category === filterCategory;
    return matchesSearch && matchesCat;
  });

  const toggleAlert = (id) => {
    setAlertSubscribed((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-12 md:py-16 space-y-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 bg-secondary-container/60 text-on-secondary-container px-3 py-1 rounded-full font-label-md text-xs font-semibold mb-3">
            <span className="material-symbols-outlined text-sm">storefront</span>
            {isEn ? 'Live Mandi Intelligence' : 'लाइव मंडी भाव'}
          </div>
          <h2 className="font-display-lg text-3xl sm:text-4xl font-bold text-on-surface">
            {t.mandiTitle}
          </h2>
          <p className="font-body-md text-on-surface-variant text-base mt-1">
            {t.mandiSub}
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">
            search
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.searchCropPlaceholder}
            className="w-full bg-white border border-outline-variant rounded-2xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
          />
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-3">
        {[
          { id: 'all', label: t.filterAll },
          { id: 'cereal', label: t.filterCereal },
          { id: 'veg', label: t.filterVeg },
          { id: 'pulses', label: t.filterPulses },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setFilterCategory(cat.id)}
            className={`px-5 py-2.5 rounded-full text-sm font-label-md transition-all shadow-sm ${
              filterCategory === cat.id
                ? 'bg-primary-container text-on-primary-container font-bold shadow-md'
                : 'bg-white text-on-surface-variant hover:bg-surface-container border border-surface-variant'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Mandi Table */}
      <div className="glass-card rounded-3xl border border-surface-variant/80 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-surface-variant text-on-surface-variant font-label-md text-xs uppercase tracking-wider">
                <th className="py-4 px-6">{t.cropCol}</th>
                <th className="py-4 px-6">{t.mandiCol}</th>
                <th className="py-4 px-6">{t.priceCol}</th>
                <th className="py-4 px-6">{t.trendCol}</th>
                <th className="py-4 px-6 text-right">{t.actionCol}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-variant/60 font-body-md text-sm">
              {filteredMandi.length > 0 ? (
                filteredMandi.map((item) => (
                  <tr key={item.id} className="hover:bg-surface-container-lowest/80 transition-colors">
                    <td className="py-4 px-6 font-bold text-on-surface flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-secondary-container/30 text-secondary flex items-center justify-center font-bold text-xs">
                        🌾
                      </span>
                      {isEn ? item.cropEn : item.cropHi}
                    </td>
                    <td className="py-4 px-6 text-on-surface-variant font-medium">
                      {isEn ? item.mandiEn : item.mandiHi}
                    </td>
                    <td className="py-4 px-6 font-extrabold text-primary-container">
                      ₹{item.minPrice.toLocaleString()} - ₹{item.maxPrice.toLocaleString()}
                    </td>
                    <td className="py-4 px-6 font-semibold">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                        item.isUp ? 'bg-secondary/10 text-secondary' : 'bg-error/10 text-error'
                      }`}>
                        <span className="material-symbols-outlined text-sm">
                          {item.isUp ? 'trending_up' : 'trending_down'}
                        </span>
                        {item.trend}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => toggleAlert(item.id)}
                        className={`px-4 py-2 rounded-xl text-xs font-label-md transition-all shadow-sm ${
                          alertSubscribed[item.id]
                            ? 'bg-secondary text-white font-bold'
                            : 'border border-primary text-primary hover:bg-primary hover:text-white'
                        }`}
                      >
                        {alertSubscribed[item.id] 
                          ? (isEn ? 'Alert Active' : 'अलर्ट चालू') 
                          : t.getAlerts}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-on-surface-variant font-medium">
                    {isEn ? 'No Mandi prices found matching your search.' : 'आपकी खोज से मेल खाते कोई मंडी भाव नहीं मिले।'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </section>
  );
}
