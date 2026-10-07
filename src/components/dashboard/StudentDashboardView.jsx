import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { INITIAL_INTERNSHIPS } from '../../data/internshipsData';
import { TRAINING_PROGRAMS } from '../../data/trainingData';

export default function StudentDashboardView({ lang = 'en' }) {
  const isEn = lang === 'en';
  const navigate = useNavigate();
  const { user } = useAuth();

  // Read saved applications
  const [applications] = useState(() => {
    try {
      const stored = localStorage.getItem('farmer_helper_my_applications');
      return stored
        ? JSON.parse(stored)
        : [
            {
              id: 'FH-AGRI-8942',
              internshipTitle: 'Agri-Tech Field Sensor & Drone Scouting Trainee',
              organization: 'Bharat AgTech Research Lab',
              location: 'Lucknow / Kanpur, UP',
              appliedDate: '14 Sep 2026',
              status: 'Under Review',
            },
          ];
    } catch {
      return [];
    }
  });

  const studentName = isEn
    ? (user?.name || 'Aman Verma')
    : (user?.nameHi || user?.name || 'अमन वर्मा');

  const collegeName = user?.details?.college || 'GB Pant University of Agriculture';
  const courseName = user?.details?.course || 'B.Sc Agriculture (3rd Year)';
  const areaInterest = user?.details?.areaOfInterest || 'Agri-Tech & Precision Farming';

  const recommendedInternships = INITIAL_INTERNSHIPS.slice(0, 3);
  const featuredWorkshops = TRAINING_PROGRAMS.slice(0, 3);

  return (
    <div className="space-y-8">
      {/* ── Welcome Banner ── */}
      <div className="bg-gradient-to-r from-primary-container via-primary to-primary-container text-white rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 flex items-center justify-center pointer-events-none select-none">
          <span className="material-symbols-outlined text-[180px]">school</span>
        </div>

        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-semibold text-white/90">
            <span className="material-symbols-outlined text-[16px]">verified</span>
            <span>{isEn ? 'Student Career Portal' : 'छात्र करियर पोर्टल'}</span>
          </div>

          <h1 className="font-headline-lg text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
            {isEn ? `Namaste, ${studentName} 🎓` : `नमस्ते, ${studentName} 🎓`}
          </h1>

          <p className="text-white/90 text-sm sm:text-base leading-relaxed">
            {isEn
              ? 'Find agriculture internships, training programs, and career opportunities.'
              : 'कृषि इंटर्नशिप, प्रशिक्षण कार्यक्रम और करियर अवसर खोजें।'}
          </p>

          {/* Quick buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              to="/internships"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-primary font-bold text-xs sm:text-sm hover:bg-white/90 active:scale-95 transition-all shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px]">explore</span>
              <span>{isEn ? 'Browse Internships' : 'इंटर्नशिप खोजें'}</span>
            </Link>

            <Link
              to="/student/training-workshops"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/20 hover:bg-white/30 text-white font-bold text-xs sm:text-sm active:scale-95 transition-all backdrop-blur-xs border border-white/20"
            >
              <span className="material-symbols-outlined text-[18px]">psychology</span>
              <span>{isEn ? 'Workshops & Training' : 'कार्यशालाएं व प्रशिक्षण'}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Key Metrics Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            titleEn: 'My Applications',
            titleHi: 'सक्रिय आवेदन',
            val: applications.length,
            icon: 'folder_shared',
            color: 'text-primary',
            bg: 'bg-primary/10',
          },
          {
            titleEn: 'Open Internships',
            titleHi: 'उपलब्ध इंटर्नशिप',
            val: INITIAL_INTERNSHIPS.length,
            icon: 'school',
            color: 'text-blue-600',
            bg: 'bg-blue-500/10',
          },
          {
            titleEn: 'Workshops',
            titleHi: 'प्रशिक्षण सत्र',
            val: TRAINING_PROGRAMS.length,
            icon: 'model_training',
            color: 'text-amber-600',
            bg: 'bg-amber-500/10',
          },
          {
            titleEn: 'Profile Readiness',
            titleHi: 'प्रोफाइल पूर्णता',
            val: '92%',
            icon: 'check_circle',
            color: 'text-emerald-600',
            bg: 'bg-emerald-500/10',
          },
        ].map((m, idx) => (
          <div
            key={idx}
            className="bg-surface-container-lowest p-4 sm:p-5 rounded-2xl border border-outline-variant/30 shadow-2xs flex items-center gap-3.5"
          >
            <div className={`w-11 h-11 rounded-xl ${m.bg} ${m.color} flex items-center justify-center shrink-0`}>
              <span className="material-symbols-outlined text-2xl">{m.icon}</span>
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold text-on-surface leading-tight">{m.val}</p>
              <p className="text-xs text-on-surface-variant font-medium mt-0.5">
                {isEn ? m.titleEn : m.titleHi}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Main Bento Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Recommended Internships (8 cols) */}
        <div className="lg:col-span-8 bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/30 shadow-2xs space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-on-surface">
                {isEn ? 'Recommended Agri Opportunities 🎯' : 'अनुशंसित कृषि अवसर 🎯'}
              </h2>
              <p className="text-xs text-on-surface-variant mt-0.5">
                {isEn ? 'Matched with your agriculture degree and interests' : 'आपकी डिग्री और रुचि के अनुसार अनुकूल'}
              </p>
            </div>
            <Link
              to="/internships"
              className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
            >
              <span>{isEn ? 'View All' : 'सभी देखें'}</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>

          <div className="space-y-3.5">
            {recommendedInternships.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl border border-outline-variant/30 bg-surface-container-low/40 hover:bg-surface-container-low transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary">
                      {item.type || 'Internship'}
                    </span>
                    <span className="text-xs text-on-surface-variant flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">location_on</span>
                      {item.location}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-on-surface truncate">
                    {item.title}
                  </h3>
                  <p className="text-xs text-on-surface-variant font-medium">
                    {item.organization}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-on-surface-variant pt-1">
                    <span className="font-semibold text-secondary">{item.stipend}</span>
                    <span>•</span>
                    <span>{item.duration}</span>
                  </div>
                </div>

                <div className="flex sm:flex-col gap-2 shrink-0">
                  <button
                    onClick={() => navigate('/internships')}
                    className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-container active:scale-95 transition-all"
                  >
                    {isEn ? 'Apply Now' : 'आवेदन करें'}
                  </button>
                  <button
                    onClick={() => navigate('/internships')}
                    className="px-4 py-2 rounded-xl border border-outline-variant/60 text-xs font-semibold text-on-surface hover:bg-surface-container transition-all"
                  >
                    {isEn ? 'Details' : 'विवरण'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Student Profile & Quick Info (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/30 shadow-2xs space-y-4">
            <div className="flex items-center gap-3 border-b border-outline-variant/20 pb-4">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold text-base shadow-xs">
                {user?.initials || 'AV'}
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-sm text-on-surface truncate">{studentName}</h3>
                <p className="text-xs text-primary font-semibold truncate">{courseName}</p>
                <p className="text-[11px] text-on-surface-variant truncate">{collegeName}</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-outline-variant/15">
                <span className="text-on-surface-variant">{isEn ? 'Academic Level' : 'अध्ययन वर्ष'}:</span>
                <span className="font-semibold text-on-surface">{user?.details?.yearOfStudy || '3rd Year'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-outline-variant/15">
                <span className="text-on-surface-variant">{isEn ? 'Focus Area' : 'रुचि क्षेत्र'}:</span>
                <span className="font-semibold text-on-surface truncate max-w-[140px]">{areaInterest}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-outline-variant/15">
                <span className="text-on-surface-variant">{isEn ? 'Resume' : 'बायोडाटा'}:</span>
                <span className="font-semibold text-emerald-600 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">check_circle</span>
                  {isEn ? 'Uploaded' : 'अपलोड किया'}
                </span>
              </div>
            </div>

            <Link
              to="/internships"
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-primary/30 text-primary font-bold text-xs hover:bg-primary/5 transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">edit_document</span>
              <span>{isEn ? 'Update Resume / Preferences' : 'प्रोफाइल अपडेट करें'}</span>
            </Link>
          </div>

          {/* Quick Help Card */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200/50 p-5 rounded-3xl space-y-2">
            <span className="material-symbols-outlined text-emerald-700 text-2xl">support_agent</span>
            <h4 className="font-bold text-sm text-emerald-900">
              {isEn ? 'Agri Career Mentorship' : 'कृषि करियर मार्गदर्शन'}
            </h4>
            <p className="text-xs text-emerald-800/80 leading-relaxed">
              {isEn
                ? 'Get your research or field resume reviewed by ICAR and state university professors.'
                : 'अपने बायोडाटा और शोध पत्र की समीक्षा विशेषज्ञों से कराएं।'}
            </p>
          </div>
        </div>

      </div>

      {/* ── Upcoming Workshops Row ── */}
      <div className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/30 shadow-2xs space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-on-surface">
              {isEn ? 'Hands-on Agriculture Workshops 🔬' : 'व्यावहारिक कृषि कार्यशालाएं 🔬'}
            </h2>
            <p className="text-xs text-on-surface-variant mt-0.5">
              {isEn ? 'Short-term certified training programs to build practical skills' : 'कौशल विकास हेतु अल्पकालिक प्रमाणित प्रशिक्षण'}
            </p>
          </div>
          <Link
            to="/student/training-workshops"
            className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
          >
            <span>{isEn ? 'View All Workshops' : 'सभी कार्यशालाएं'}</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {featuredWorkshops.map((w) => (
            <div
              key={w.id}
              className="p-4 rounded-2xl border border-outline-variant/30 bg-surface-container-low/30 hover:border-primary/40 transition-all flex flex-col justify-between space-y-3"
            >
              <div className="space-y-1.5">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-800">
                  {w.mode || 'Hybrid / In-Person'}
                </span>
                <h4 className="font-bold text-sm text-on-surface line-clamp-1">{w.title}</h4>
                <p className="text-xs text-on-surface-variant line-clamp-2">{w.organization}</p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-outline-variant/20">
                <span className="text-xs font-bold text-primary">{w.fee || 'Free'}</span>
                <Link
                  to="/student/training-workshops"
                  className="text-xs font-bold text-primary hover:underline"
                >
                  {isEn ? 'Enroll' : 'नामांकन'}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
