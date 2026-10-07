import React, { useState } from 'react';
import { servicesList, translations } from '../data/content';

export default function ServicesView({ lang, onOpenNearbyHelp }) {
  const isEn = lang === 'en';
  const t = translations[lang] || translations.en;

  // Soil Calculator State
  const [selectedCrop, setSelectedCrop] = useState('wheat');
  const [selectedSoil, setSelectedSoil] = useState('loam');
  const [calcResult, setCalcResult] = useState(null);

  const handleCalculateNPK = (e) => {
    e.preventDefault();
    let n = 120, p = 60, k = 40;
    if (selectedCrop === 'paddy') { n = 100; p = 50; k = 50; }
    if (selectedCrop === 'mustard') { n = 80; p = 40; k = 20; }
    if (selectedSoil === 'clay') { n = Math.round(n * 0.9); }
    if (selectedSoil === 'sandy') { n = Math.round(n * 1.15); p = Math.round(p * 1.1); }
    
    setCalcResult({ n, p, k, urea: Math.round(n * 2.17), ssp: Math.round(p * 6.25), mop: Math.round(k * 1.66) });
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-12 md:py-16 space-y-16">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 bg-secondary-container/60 text-on-secondary-container px-4 py-1.5 rounded-full font-label-md text-sm font-semibold">
          <span className="material-symbols-outlined text-lg">agriculture</span>
          {isEn ? 'Empowering Farmers' : 'किसान अधिकार'}
        </div>
        <h2 className="font-display-lg text-3xl sm:text-4xl lg:text-5xl font-bold text-on-surface">
          {t.quickServicesTitle}
        </h2>
        <p className="font-body-lg text-on-surface-variant text-base sm:text-lg">
          {t.quickServicesSub}
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {servicesList.map((srv) => (
          <div
            key={srv.id}
            className="glass-card rounded-3xl p-6 sm:p-8 border border-white/80 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-primary-container/10 text-primary-container flex items-center justify-center transition-colors group-hover:bg-primary-container group-hover:text-on-primary">
                  <span className="material-symbols-outlined text-3xl">
                    {srv.icon}
                  </span>
                </div>
                <span className="bg-secondary/10 text-secondary text-xs font-bold px-3 py-1.5 rounded-full">
                  {isEn ? srv.badgeEn : srv.badgeHi}
                </span>
              </div>

              <h3 className="font-headline-md text-xl font-bold text-on-surface group-hover:text-primary transition-colors">
                {isEn ? srv.titleEn : srv.titleHi}
              </h3>

              <p className="font-body-md text-on-surface-variant text-sm sm:text-base leading-relaxed">
                {isEn ? srv.descEn : srv.descHi}
              </p>
            </div>

            <div className="pt-6 border-t border-surface-variant/50 mt-6">
              <button
                onClick={onOpenNearbyHelp}
                className="w-full py-3 px-4 rounded-xl border border-primary/20 text-primary font-label-md hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2 group/btn"
              >
                <span>{isEn ? 'Access Service' : 'सेवा का उपयोग करें'}</span>
                <span className="material-symbols-outlined text-lg transition-transform group-hover/btn:translate-x-1">
                  chevron_right
                </span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Soil Health Calculator Tool */}
      <div className="bg-gradient-to-br from-primary-container to-primary text-white rounded-[2.5rem] p-8 sm:p-12 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="grid lg:grid-cols-2 gap-10 items-center relative z-10">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 bg-white/20 text-white px-3 py-1 rounded-full text-xs font-semibold">
              <span className="material-symbols-outlined text-sm">science</span>
              {t.soilToolTitle}
            </div>
            <h3 className="font-display-lg text-3xl sm:text-4xl font-bold leading-tight">
              {isEn ? 'Calculate Soil N-P-K & Fertilizer Requirement' : 'मिट्टी के लिए खाद (NPK) की सटीक मात्रा जानें'}
            </h3>
            <p className="text-white/80 text-base">
              {t.soilToolSub}
            </p>
          </div>

          <form onSubmit={handleCalculateNPK} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1 text-white/90">{t.selectCrop}</label>
                <select
                  value={selectedCrop}
                  onChange={(e) => setSelectedCrop(e.target.value)}
                  className="w-full bg-white text-on-surface font-medium rounded-xl p-3 text-sm border-0 focus:ring-2 focus:ring-secondary-fixed"
                >
                  <option value="wheat">{isEn ? 'Wheat (गेहूं)' : 'गेहूं (Wheat)'}</option>
                  <option value="paddy">{isEn ? 'Paddy (धान)' : 'धान (Paddy)'}</option>
                  <option value="mustard">{isEn ? 'Mustard (सरसों)' : 'सरसों (Mustard)'}</option>
                  <option value="potato">{isEn ? 'Potato (आलू)' : 'आलू (Potato)'}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-white/90">{t.selectSoil}</label>
                <select
                  value={selectedSoil}
                  onChange={(e) => setSelectedSoil(e.target.value)}
                  className="w-full bg-white text-on-surface font-medium rounded-xl p-3 text-sm border-0 focus:ring-2 focus:ring-secondary-fixed"
                >
                  <option value="loam">{isEn ? 'Alluvial / Loam (दोमट)' : 'दोमट (Loam)'}</option>
                  <option value="clay">{isEn ? 'Black Clay (काली मिट्टी)' : 'काली मिट्टी (Black Clay)'}</option>
                  <option value="sandy">{isEn ? 'Sandy / Light (बलुई)' : 'बलुई (Sandy)'}</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-secondary-container text-on-secondary-container hover:bg-white font-bold py-3 px-6 rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 text-sm"
            >
              <span className="material-symbols-outlined">calculate</span>
              {t.calculateBtn}
            </button>

            {calcResult && (
              <div className="mt-4 p-4 bg-white text-on-surface rounded-xl space-y-2 animate-fadeIn shadow-inner">
                <div className="text-xs font-bold text-primary uppercase tracking-wider">{t.recTitle}</div>
                <div className="grid grid-cols-3 gap-2 text-center text-xs font-semibold border-b border-surface-variant pb-2">
                  <div className="bg-surface-container p-2 rounded-lg">
                    <span className="text-primary font-bold block text-sm">{calcResult.n} kg</span>
                    {t.nitrogen}
                  </div>
                  <div className="bg-surface-container p-2 rounded-lg">
                    <span className="text-primary font-bold block text-sm">{calcResult.p} kg</span>
                    {t.phosphorus}
                  </div>
                  <div className="bg-surface-container p-2 rounded-lg">
                    <span className="text-primary font-bold block text-sm">{calcResult.k} kg</span>
                    {t.potassium}
                  </div>
                </div>
                <div className="text-xs text-on-surface-variant pt-1 flex justify-around">
                  <span><strong>Urea:</strong> ~{calcResult.urea} kg/acre</span>
                  <span><strong>SSP:</strong> ~{calcResult.ssp} kg/acre</span>
                  <span><strong>MOP:</strong> ~{calcResult.mop} kg/acre</span>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>

    </section>
  );
}
