import React from 'react';
import heroFarmerImg from '../../assets/hero_farmer.jpg';

export default function VisualAnchor({ lang }) {
  const isEn = lang === 'en';

  return (
    <section className="hidden md:flex md:w-1/2 relative bg-surface-container-high overflow-hidden select-none">
      <img
        src={heroFarmerImg}
        alt="Agricultural Landscape with Indian Farmer"
        className="absolute inset-0 w-full h-full object-cover z-0 transition-transform duration-1000 hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent z-10 pointer-events-none"></div>

      <div className="relative z-20 flex flex-col justify-end p-10 lg:p-12 h-full max-w-xl">
        <h1 className="font-display-lg text-4xl lg:text-5xl text-white mb-4 leading-tight font-bold tracking-tight">
          🌱 Farmer Helper<br />
          <span className="text-secondary-fixed font-extrabold text-3xl lg:text-4xl block mt-1">
            {isEn ? 'Har Kisan Ka Digital Saathi' : 'हर किसान का डिजिटल साथी'}
          </span>
        </h1>
        <p className="font-body-lg text-lg text-surface-container-highest/90 leading-relaxed font-normal">
          {isEn
            ? 'Access your farming resources, crop guidance, buyers, storage and government schemes from one place.'
            : 'अपनी खेती के साधन, फसल मार्गदर्शन, खरीदार और सरकारी योजनाएं एक ही स्थान पर प्राप्त करें।'}
        </p>
      </div>
    </section>
  );
}
