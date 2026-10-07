import React from 'react';

export default function InternshipHero({ onExploreInternships, onViewWorkshops }) {
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="relative overflow-hidden rounded-3xl bg-surface-container-lowest shadow-sm border border-outline-variant/30">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Content */}
        <div className="lg:col-span-7 p-6 sm:p-8 xl:p-10 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary-container/40 text-on-secondary-fixed-variant font-label-md text-xs sm:text-sm font-semibold border border-secondary/20">
              <span className="material-symbols-outlined text-[18px]">verified_user</span>
              <span>ICAR &amp; Skill India Aligned Opportunities</span>
            </div>

            <div className="space-y-2">
              <h1 className="font-headline-lg text-2xl sm:text-3xl lg:text-4xl text-on-surface font-bold tracking-tight leading-tight">
                कृषि में अपना करियर शुरू करें <br className="hidden sm:block" />
                <span className="text-primary font-medium text-xl sm:text-2xl lg:text-3xl block mt-1">
                  Launch Your Agriculture Career
                </span>
              </h1>
              <p className="font-body-md text-on-surface-variant max-w-xl text-sm sm:text-base leading-relaxed">
                कृषि इंटर्नशिप, farm training और practical learning opportunities खोजें और अपने career को आधुनिक एग्रीटेक एवं टिकाऊ खेती के साथ आगे बढ़ाएं।
              </p>
            </div>
          </div>

          {/* Metrics Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-2">
            <div className="p-3.5 rounded-2xl bg-surface-container-low flex flex-col border border-outline-variant/20 hover:border-primary/40 transition-colors">
              <span className="font-headline-md text-xl sm:text-2xl text-primary font-bold">500+</span>
              <span className="font-caption text-xs text-on-surface-variant font-medium mt-0.5">Active Opportunities</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-surface-container-low flex flex-col border border-outline-variant/20 hover:border-primary/40 transition-colors">
              <span className="font-headline-md text-xl sm:text-2xl text-primary font-bold">100+</span>
              <span className="font-caption text-xs text-on-surface-variant font-medium mt-0.5">Verified Farms</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-surface-container-low flex flex-col border border-outline-variant/20 hover:border-primary/40 transition-colors">
              <span className="font-headline-md text-xl sm:text-2xl text-primary font-bold">50+</span>
              <span className="font-caption text-xs text-on-surface-variant font-medium mt-0.5">Certified Trainings</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-surface-container-low flex flex-col border border-outline-variant/20 hover:border-secondary/40 transition-colors">
              <span className="font-headline-md text-xl sm:text-2xl text-secondary font-bold">₹12k</span>
              <span className="font-caption text-xs text-on-surface-variant font-medium mt-0.5">Avg Stipend/Month</span>
            </div>
          </div>

          {/* Quick CTAs */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2">
            <button
              onClick={() => {
                if (onExploreInternships) onExploreInternships();
                else scrollTo('feed');
              }}
              className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3 rounded-xl bg-primary text-on-primary font-label-md text-sm font-semibold hover:bg-primary-container transition-all shadow-sm active:scale-95"
            >
              <span className="material-symbols-outlined text-[20px]">search</span>
              <span>🔎 Internship खोजें (Explore Internships)</span>
            </button>
            <button
              onClick={() => {
                if (onViewWorkshops) onViewWorkshops();
                else scrollTo('workshops');
              }}
              className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3 rounded-xl bg-surface-container text-on-surface font-label-md text-sm font-semibold hover:bg-surface-container-high transition-all active:scale-95 border border-outline-variant/30"
            >
              <span className="material-symbols-outlined text-[20px]">local_library</span>
              <span>📚 Training Programs देखें (View Workshops)</span>
            </button>
          </div>
        </div>

        {/* Right Visual Image */}
        <div className="lg:col-span-5 relative min-h-[260px] sm:min-h-[320px] lg:min-h-[440px] overflow-hidden rounded-b-3xl lg:rounded-b-none lg:rounded-r-3xl">
          <img
            alt="Agriculture students in greenhouse field inspecting crops with trainer"
            className="absolute inset-0 w-full h-full object-cover object-center"
            src="https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=1200&q=80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent lg:bg-gradient-to-l lg:from-transparent lg:via-black/20 lg:to-black/50"></div>
          
          {/* Floating Highlight Banner */}
          <div className="absolute bottom-4 left-4 right-4 p-3.5 sm:p-4 rounded-2xl bg-surface-container-lowest/95 backdrop-blur-md text-on-surface shadow-lg border border-white/40 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0 shadow-xs">
              <span className="material-symbols-outlined text-[22px]">nature_people</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-label-md text-sm font-bold truncate text-on-surface">Practical Polyhouse &amp; Drone Training</p>
              <p className="font-caption text-xs text-on-surface-variant truncate">Interactive cohort starting next Monday in Meerut</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
