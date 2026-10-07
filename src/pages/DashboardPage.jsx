import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DashboardSidebar from '../components/dashboard/DashboardSidebar';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import WelcomeWeatherHeader from '../components/dashboard/WelcomeWeatherHeader';
import FarmOverviewCard from '../components/dashboard/FarmOverviewCard';
import CropHealthCard from '../components/dashboard/CropHealthCard';
import FarmStatsRow from '../components/dashboard/FarmStatsRow';
import QuickActionsGrid from '../components/dashboard/QuickActionsGrid';
import ExploreNearbyMap from '../components/dashboard/ExploreNearbyMap';
import ResourcesNearYou from '../components/dashboard/ResourcesNearYou';
import ProfitAndBuyersRow from '../components/dashboard/ProfitAndBuyersRow';
import DashboardMobileNav from '../components/dashboard/DashboardMobileNav';

// Role-specific dashboard views
import StudentDashboardView from '../components/dashboard/StudentDashboardView';
import BuyerDashboardView from '../components/dashboard/BuyerDashboardView';
import ProviderDashboardView from '../components/dashboard/ProviderDashboardView';
import FarmerInternshipQuickCard from '../components/dashboard/FarmerInternshipQuickCard';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab');

  const { user } = useAuth();
  const role = user?.role || 'farmer';

  const [activeNav, setActiveNav] = useState('dashboard');
  const [lang, setLang] = useState('en');
  const isEn = lang === 'en';

  React.useEffect(() => {
    if (role === 'admin') {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [role, navigate]);

  const handleAddFarm = () => {
    navigate('/onboarding/farm');
  };

  const handleQuickAction = (actionId) => {
    if (actionId === 'loss') {
      navigate('/crop-loss');
      return;
    }
    if (actionId === 'disease') {
      navigate('/crop-doctor');
      return;
    }
    if (actionId === 'storage') {
      navigate('/storage');
      return;
    }
    if (actionId === 'profitCalc') {
      navigate('/profit-calculator');
      return;
    }
    if (actionId === 'tractor' || actionId === 'labour') {
      navigate('/resources');
      return;
    }
    if (actionId === 'buyers') {
      navigate('/buyers');
      return;
    }
    if (actionId === 'schemes') {
      setSearchParams({ tab: 'schemes' });
      return;
    }
    if (actionId === 'internships') {
      navigate('/internships');
      return;
    }
    alert(isEn ? `Action triggered: ${actionId}` : `कार्य चुना गया: ${actionId}`);
  };

  const handleBookResource = (resourceName) => {
    navigate('/resources');
  };

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col lg:flex-row font-sans selection:bg-primary-container selection:text-white">
      
      {/* Desktop Sticky Sidebar Navigation */}
      <DashboardSidebar
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        lang={lang}
      />

      {/* Main Right Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-24 lg:pb-8">
        
        {/* Top Header Bar */}
        <DashboardHeader
          lang={lang}
          setLang={setLang}
        />

        {/* Dashboard Main Canvas */}
        <main className="flex-1 p-4 sm:p-6 lg:p-10 overflow-y-auto">

          {/* Tab: Community View Modal/Banner */}
          {activeTab === 'community' && (
            <div className="mb-6 p-6 bg-surface-container-lowest rounded-3xl border border-primary/20 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-2xl">groups</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-on-surface">
                      {isEn ? 'Kisan & Agri Community Forum' : 'किसान एवं कृषि समुदाय चर्चा'}
                    </h3>
                    <p className="text-xs text-on-surface-variant">
                      {isEn ? 'Connect with fellow farmers, agronomists, and local experts' : 'अन्य किसानों और कृषि विशेषज्ञों से सवाल पूछें व चर्चा करें'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    to="/community"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white font-semibold text-xs shadow-xs hover:bg-primary-container transition-all"
                  >
                    <span>{isEn ? 'Open Full Community' : 'पूरा समुदाय मंच खोलें'}</span>
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </Link>
                  <button
                    onClick={() => setSearchParams({})}
                    className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-lg">close</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 bg-surface-container-low rounded-2xl border border-outline-variant/30 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-primary">🌾 Wheat Yellow Rust alert in Western UP</span>
                    <span className="text-[11px] text-on-surface-variant">2h ago</span>
                  </div>
                  <p className="text-on-surface-variant">Farmers in Meerut report early rust spots. Experts advise Propiconazole spray within 48 hours.</p>
                  <span className="inline-block text-[11px] font-semibold text-secondary">💬 14 replies</span>
                </div>

                <div className="p-3.5 bg-surface-container-low rounded-2xl border border-outline-variant/30 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-primary">🚜 Combine Harvester sharing in Modinagar</span>
                    <span className="text-[11px] text-on-surface-variant">4h ago</span>
                  </div>
                  <p className="text-on-surface-variant">Group booking available for upcoming paddy harvest to save 20% on diesel and hourly rental.</p>
                  <span className="inline-block text-[11px] font-semibold text-secondary">💬 8 replies</span>
                </div>
              </div>
            </div>
          )}

          {/* Tab: Government Schemes View */}
          {activeTab === 'schemes' && (
            <div className="mb-6 p-6 bg-surface-container-lowest rounded-3xl border border-primary/20 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-2xl">gavel</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-on-surface">
                      {isEn ? 'Government Agricultural Schemes 🇮🇳' : 'सरकारी कृषि योजनाएं 🇮🇳'}
                    </h3>
                    <p className="text-xs text-on-surface-variant">
                      {isEn ? 'Active subsidies and financial support for Indian agriculture' : 'सक्रिय सब्सिडी और सरकारी वित्तीय सहायता'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    to="/government-schemes"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white font-semibold text-xs shadow-xs hover:bg-primary-container transition-all"
                  >
                    <span>{isEn ? 'Open Full Schemes Portal' : 'पूरा योजना पोर्टल खोलें'}</span>
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </Link>
                  <button
                    onClick={() => setSearchParams({})}
                    className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-lg">close</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                {[
                  { name: 'PM-KISAN Samman Nidhi', desc: '₹6,000/year direct DBT transfer to landholding farmers.', tag: '18th Installment Active' },
                  { name: 'Pradhan Mantri Fasal Bima', desc: 'Crop insurance with nominal 1.5% - 2% premium subsidy.', tag: 'Enrollment Open' },
                  { name: 'Sub-Mission on Agri Mechanization', desc: 'Up to 50% subsidy on purchase of custom farm machinery.', tag: 'State Portal' },
                ].map((sc, i) => (
                  <div key={i} className="p-3.5 bg-surface-container-low rounded-2xl border border-outline-variant/30 space-y-1.5 flex flex-col justify-between">
                    <div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary">{sc.tag}</span>
                      <h4 className="font-bold text-on-surface text-sm mt-1">{sc.name}</h4>
                      <p className="text-on-surface-variant mt-0.5">{sc.desc}</p>
                    </div>
                    <Link
                      to="/government-schemes"
                      className="text-primary font-bold hover:underline text-left pt-2 inline-block"
                    >
                      {isEn ? 'Check Eligibility →' : 'पात्रता जांचें →'}
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab: Profile View */}
          {activeTab === 'profile' && (
            <div className="mb-6 p-6 bg-surface-container-lowest rounded-3xl border border-primary/20 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-base shadow-xs">
                    {user?.initials || 'FH'}
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-on-surface">{user?.name || 'User Profile'}</h3>
                    <p className="text-xs text-primary font-semibold capitalize">{user?.roleLabelEn || role}</p>
                    <p className="text-xs text-on-surface-variant">{user?.location || 'India'}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSearchParams({})}
                  className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high"
                >
                  <span className="material-symbols-outlined text-lg">close</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-surface-container-low p-4 rounded-2xl">
                <div>
                  <span className="text-on-surface-variant block">{isEn ? 'Contact Mobile' : 'संपर्क नंबर'}</span>
                  <span className="font-semibold text-on-surface">{user?.phone || '9876543210'}</span>
                </div>
                <div>
                  <span className="text-on-surface-variant block">{isEn ? 'Email Address' : 'ईमेल'}</span>
                  <span className="font-semibold text-on-surface">{user?.email || 'user@farmerhelper.in'}</span>
                </div>
                <div>
                  <span className="text-on-surface-variant block">{isEn ? 'Membership' : 'सदस्यता'}</span>
                  <span className="font-semibold text-emerald-700 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">verified</span>
                    {isEn ? 'Active & Verified' : 'सक्रिय व सत्यापित'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════
              DYNAMIC CONTENT BASED ON AUTHENTICATED USER ROLE
             ══════════════════════════════════════════════════ */}
          {role === 'student' ? (
            <StudentDashboardView lang={lang} />
          ) : role === 'buyer' ? (
            <BuyerDashboardView
              lang={lang}
              urlTab={activeTab}
              onTabChange={(tab) => setSearchParams(tab ? { tab } : {})}
            />
          ) : role === 'provider' ? (
            <ProviderDashboardView lang={lang} />
          ) : (
            /* FARMER DASHBOARD (Preserves exact existing Farmer UI/design) */
            <>
              {/* Welcome & Weather Header */}
              <WelcomeWeatherHeader
                lang={lang}
                onAddFarm={handleAddFarm}
              />

              {/* 12-Column Bento Grid: My Farm Overview (8 cols) & Crop Health (4 cols) */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-8">
                <FarmOverviewCard
                  lang={lang}
                  onViewDetails={() => alert(isEn ? 'Opening Farm Details...' : 'खेत की पूरी जानकारी खुल रही है...')}
                />
                <CropHealthCard
                  lang={lang}
                />
              </div>

              {/* 4 Metric Statistics Row */}
              <FarmStatsRow
                lang={lang}
              />

              {/* Farmer Agriculture Internship & Student Training Provider Card */}
              <FarmerInternshipQuickCard
                lang={lang}
              />

              {/* Quick Actions (7 cols) & Explore Nearby Map (5 cols) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
                <QuickActionsGrid
                  lang={lang}
                  onActionClick={handleQuickAction}
                />
                <ExploreNearbyMap
                  lang={lang}
                />
              </div>

              {/* Resources Near You Horizontal Scroll List */}
              <ResourcesNearYou
                lang={lang}
                onBookResource={handleBookResource}
              />

              {/* Estimated Profit & Best Buyers Row */}
              <ProfitAndBuyersRow
                lang={lang}
              />
            </>
          )}

        </main>
      </div>

      {/* Sticky Mobile Bottom Navigation */}
      <DashboardMobileNav
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        lang={lang}
      />

    </div>
  );
}
