import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function FarmerInternshipQuickCard({ lang = 'en' }) {
  const navigate = useNavigate();
  const isEn = lang === 'en';

  // Read current applications count from localStorage if available
  let totalApplicants = 3;
  let activeListings = 2;
  try {
    const apps = JSON.parse(localStorage.getItem('farmer_helper_all_applications') || '[]');
    if (apps.length) totalApplicants = apps.length;
    const listings = JSON.parse(localStorage.getItem('farmer_helper_all_internships') || '[]');
    if (listings.length) {
      activeListings = listings.filter((l) => (l.status || 'Active') === 'Active').length;
    }
  } catch {
    // fallback defaults
  }

  return (
    <div className="bg-gradient-to-br from-surface-container-lowest via-surface-container-lowest to-primary/5 rounded-3xl border border-primary/20 shadow-xs p-6 mb-8 relative overflow-hidden">
      {/* Decorative background watermark */}
      <div className="absolute right-3 top-2 opacity-5 pointer-events-none select-none text-primary">
        <span className="material-symbols-outlined text-[130px]">school</span>
      </div>

      <div className="relative z-10 space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-2xl">school</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base sm:text-lg text-on-surface">
                  {isEn ? 'Farm Internships & Student Training' : 'फार्म इंटर्नशिप एवं छात्र प्रशिक्षण'}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary text-white">
                  {isEn ? 'Provider' : 'प्रदाता'}
                </span>
              </div>
              <p className="text-xs text-on-surface-variant mt-0.5">
                {isEn
                  ? 'Host agricultural college students on your farm for crop management and practical field training'
                  : 'अपने खेत पर कृषि कॉलेज छात्रों को व्यावहारिक प्रशिक्षण दें और कुशल सहायता पाएं'}
              </p>
            </div>
          </div>

          {/* Stat Pills */}
          <div className="flex items-center gap-2 text-xs shrink-0">
            <span className="px-3 py-1.5 rounded-xl bg-surface-container font-semibold text-on-surface flex items-center gap-1.5 border border-outline-variant/30">
              <span className="w-2 h-2 rounded-full bg-emerald-700"></span>
              <span>{activeListings} {isEn ? 'Active Listings' : 'सक्रिय सूचियां'}</span>
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-primary/10 font-bold text-primary flex items-center gap-1.5 border border-primary/20">
              <span className="material-symbols-outlined text-[16px]">groups</span>
              <span>{totalApplicants} {isEn ? 'Applicants' : 'आवेदक'}</span>
            </span>
          </div>
        </div>

        {/* 3 Quick Action Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          {/* Action 1: Post New Internship */}
          <button
            onClick={() => navigate('/internships/create')}
            className="p-4 rounded-2xl bg-surface-container-low hover:bg-primary/10 border border-outline-variant/30 hover:border-primary/40 transition-all text-left group flex items-start gap-3.5 cursor-pointer shadow-2xs"
          >
            <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs">
              <span className="material-symbols-outlined text-xl">add_circle</span>
            </div>
            <div>
              <h4 className="font-bold text-sm text-on-surface group-hover:text-primary transition-colors">
                {isEn ? 'Post New Internship' : 'नई इंटर्नशिप पोस्ट करें'}
              </h4>
              <p className="text-[11px] text-on-surface-variant mt-0.5">
                {isEn ? 'Create training position on your farm' : 'अपने खेत के लिए नया प्रशिक्षण पद बनाएं'}
              </p>
            </div>
          </button>

          {/* Action 2: My Internship Listings */}
          <button
            onClick={() => navigate('/internships/my-listings')}
            className="p-4 rounded-2xl bg-surface-container-low hover:bg-surface-container border border-outline-variant/30 hover:border-primary/40 transition-all text-left group flex items-start gap-3.5 cursor-pointer shadow-2xs"
          >
            <div className="w-10 h-10 rounded-xl bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-xl">inventory_2</span>
            </div>
            <div>
              <h4 className="font-bold text-sm text-on-surface group-hover:text-primary transition-colors">
                {isEn ? 'My Internship Listings' : 'मेरी इंटर्नशिप सूचियां'}
              </h4>
              <p className="text-[11px] text-on-surface-variant mt-0.5">
                {isEn ? 'Edit, close or view active listings' : 'अपनी सूचियां देखें, संपादित करें या बंद करें'}
              </p>
            </div>
          </button>

          {/* Action 3: Manage Applicants */}
          <button
            onClick={() => navigate('/internships?view=applicants')}
            className="p-4 rounded-2xl bg-surface-container-low hover:bg-surface-container border border-outline-variant/30 hover:border-primary/40 transition-all text-left group flex items-start gap-3.5 cursor-pointer shadow-2xs"
          >
            <div className="w-10 h-10 rounded-xl bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-xl">how_to_reg</span>
            </div>
            <div>
              <h4 className="font-bold text-sm text-on-surface group-hover:text-primary transition-colors">
                {isEn ? 'Manage Applicants' : 'आवेदक प्रबंधन'}
              </h4>
              <p className="text-[11px] text-on-surface-variant mt-0.5">
                {isEn ? 'Review resumes & update status' : 'रिज्यूमे जांचें और स्थिति अपडेट करें'}
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
