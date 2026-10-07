import React, { useState, useCallback } from 'react';
import DashboardSidebar from '../components/dashboard/DashboardSidebar';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import DashboardMobileNav from '../components/dashboard/DashboardMobileNav';
import { MOCK_REPORTS } from '../data/cropLossData';

import CropLossHub from '../components/cropLoss/CropLossHub';
import ReportStepper from '../components/cropLoss/ReportStepper';
import FarmDetailsForm from '../components/cropLoss/FarmDetailsForm';
import CropDetailsForm from '../components/cropLoss/CropDetailsForm';
import DamageDetailsForm from '../components/cropLoss/DamageDetailsForm';
import PhotoLocationStep from '../components/cropLoss/PhotoLocationStep';
import ReviewStep from '../components/cropLoss/ReviewStep';
import GeneratingReport from '../components/cropLoss/GeneratingReport';
import SuccessScreen from '../components/cropLoss/SuccessScreen';
import ReportPreview from '../components/cropLoss/ReportPreview';

export default function CropLossReportPage() {
  const [lang, setLang] = useState('en');
  const [activeNav, setActiveNav] = useState('lossReports');
  const [view, setView] = useState('hub');
  const [reports, setReports] = useState(MOCK_REPORTS);

  // Wizard Data Accumulator
  const [farmData, setFarmData] = useState(null);
  const [cropData, setCropData] = useState(null);
  const [damageData, setDamageData] = useState(null);
  const [photoData, setPhotoData] = useState(null);

  // Active Report for Success & Preview Views
  const [activeReport, setActiveReport] = useState(null);

  // ── Navigation & Flow Handlers ───────────────────────────────────────

  const handleStartNewReport = useCallback(() => {
    setFarmData(null);
    setCropData(null);
    setDamageData(null);
    setPhotoData(null);
    setView('farmDetails');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleFarmNext = useCallback((data) => {
    setFarmData(data);
    setView('cropDetails');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleCropNext = useCallback((data) => {
    setCropData(data);
    setView('damageDetails');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleDamageNext = useCallback((data) => {
    setDamageData(data);
    setView('photos');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handlePhotosNext = useCallback((data) => {
    setPhotoData(data);
    setView('review');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleReviewSubmit = useCallback(() => {
    setView('generating');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleGeneratingComplete = useCallback(() => {
    const randomId = `FLR-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const newReport = {
      id: randomId,
      farmerName: farmData?.farmerName || 'Farmer Rameshwar',
      mobile: farmData?.mobile || '9876543210',
      state: farmData?.state || 'Uttar Pradesh',
      district: farmData?.district || 'Meerut',
      village: farmData?.village || 'Kharkhauda',
      khasra: farmData?.khasraNo || '412/9',
      ownership: farmData?.ownership || 'Owned',

      crop: cropData?.crop || 'wheat',
      cropEn: cropData?.crop || 'Wheat',
      cropHi: 'गेहूं',
      variety: cropData?.variety || 'PBW-502',
      sowingDate: cropData?.sowingDate || '15 Nov 2025',
      harvestDate: cropData?.harvestDate || '10 Apr 2026',
      totalArea: cropData?.area || '5.0',
      areaAffected: damageData?.damageArea || cropData?.area || '3.5',
      areaUnit: cropData?.areaUnit || 'Acre',

      damageCause: damageData?.cause || 'hailstorm',
      causeEn: damageData?.cause || 'Hailstorm',
      causeHi: 'ओलावृष्टि',
      causeEmoji: '🧊',
      damageDate: damageData?.damageDate || '17 Sep 2026',
      damagePercent: Number(damageData?.damagePercent || 65),

      dateEn: 'Just now',
      dateHi: 'अभी-अभी',
      location: `${farmData?.district || 'Meerut'}, ${farmData?.state ? farmData.state.slice(0, 2).toUpperCase() : 'UP'}`,
      status: 'ready',
      statusEn: 'Ready / तैयार',
      statusHi: 'तैयार',
      statusClass: 'bg-primary-fixed/30 text-on-primary-fixed-variant',
      badgeIcon: 'task_alt',
      severityEn: 'Severe Damage',
      icon: 'thunderstorm',
      photos: photoData?.photos || [],
      locationDetails: photoData?.location || null,
    };

    setReports((prev) => [newReport, ...prev]);
    setActiveReport(newReport);
    setView('success');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [farmData, cropData, damageData, photoData]);

  const handleViewReport = useCallback((report) => {
    setActiveReport(report);
    setView('preview');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleResumeDraft = useCallback((draftReport) => {
    setFarmData({
      farmerName: 'Rameshwar Sharma',
      mobile: '9876543210',
      state: 'Uttar Pradesh',
      district: 'Meerut',
      village: 'Kharkhauda',
      khasraNo: '412/9',
    });
    setCropData({
      crop: draftReport.cropEn?.toLowerCase() || 'paddy',
      variety: draftReport.variety || 'Basmati 1509',
      sowingDate: '2026-06-15',
      harvestDate: '2026-11-20',
      area: draftReport.areaAffected || '3.0',
      areaUnit: draftReport.areaUnit || 'Acre',
    });
    setDamageData({
      cause: 'pest',
      damageDate: '2026-09-17',
      damageArea: draftReport.areaAffected || '3.0',
      damageAreaUnit: draftReport.areaUnit || 'Acre',
      damagePercent: draftReport.damagePercent || 50,
    });
    setView('photos');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleEditStep = useCallback((stepNum) => {
    if (stepNum === 1) setView('farmDetails');
    else if (stepNum === 2) setView('cropDetails');
    else if (stepNum === 3) setView('damageDetails');
    else if (stepNum === 4) setView('photos');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleBackToHub = useCallback(() => {
    setView('hub');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Determine current wizard step index (1-6)
  const isWizard = ['farmDetails', 'cropDetails', 'damageDetails', 'photos', 'review'].includes(view);
  const currentStepIndex =
    view === 'farmDetails' ? 1 :
    view === 'cropDetails' ? 2 :
    view === 'damageDetails' ? 3 :
    view === 'photos' ? 4 :
    view === 'review' ? 5 : 6;

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col lg:flex-row font-sans selection:bg-primary-container selection:text-white">
      {/* Desktop Sticky Sidebar */}
      <DashboardSidebar
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        lang={lang}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-24 lg:pb-8">
        {/* Top Header Bar */}
        <DashboardHeader
          lang={lang}
          setLang={setLang}
        />

        {/* Dynamic Page Canvas */}
        <main className="flex-1 p-4 sm:p-6 lg:p-10 overflow-y-auto">
          {/* Hub Landing View */}
          {view === 'hub' && (
            <CropLossHub
              lang={lang}
              reports={reports}
              onStartNewReport={handleStartNewReport}
              onViewReport={handleViewReport}
              onResumeDraft={handleResumeDraft}
            />
          )}

          {/* Stepper Header for multi-step form views */}
          {isWizard && (
            <div className="max-w-3xl mx-auto mb-8">
              {/* Back to Hub cancel link */}
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={handleBackToHub}
                  type="button"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-on-surface-variant hover:text-on-surface transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                  {lang === 'en' ? 'Back to Crop Loss Hub' : 'मुख्य पृष्ठ पर वापस जाएं'}
                </button>
                <span className="text-xs font-semibold text-primary">
                  {lang === 'en' ? 'PMFBY Self-Intimation' : 'PMFBY स्व-सूचना'}
                </span>
              </div>

              {/* Stepper */}
              <ReportStepper
                currentStep={currentStepIndex}
                totalSteps={6}
                lang={lang}
              />
            </div>
          )}

          {/* Step 1: Farm Details */}
          {view === 'farmDetails' && (
            <div className="max-w-3xl mx-auto bg-surface rounded-3xl p-6 sm:p-8 shadow-sm border border-outline-variant/40">
              <FarmDetailsForm
                lang={lang}
                data={farmData}
                onNext={handleFarmNext}
                onCancel={handleBackToHub}
              />
            </div>
          )}

          {/* Step 2: Crop Details */}
          {view === 'cropDetails' && (
            <div className="max-w-3xl mx-auto bg-surface rounded-3xl p-6 sm:p-8 shadow-sm border border-outline-variant/40">
              <CropDetailsForm
                lang={lang}
                data={cropData}
                onNext={handleCropNext}
                onBack={() => setView('farmDetails')}
              />
            </div>
          )}

          {/* Step 3: Damage Details */}
          {view === 'damageDetails' && (
            <div className="max-w-3xl mx-auto bg-surface rounded-3xl p-6 sm:p-8 shadow-sm border border-outline-variant/40">
              <DamageDetailsForm
                lang={lang}
                data={damageData}
                onNext={handleDamageNext}
                onBack={() => setView('cropDetails')}
              />
            </div>
          )}

          {/* Step 4: Photo & Location Upload */}
          {view === 'photos' && (
            <div className="max-w-3xl mx-auto bg-surface rounded-3xl p-6 sm:p-8 shadow-sm border border-outline-variant/40">
              <PhotoLocationStep
                lang={lang}
                data={photoData}
                onNext={handlePhotosNext}
                onBack={() => setView('damageDetails')}
              />
            </div>
          )}

          {/* Step 5: Review Step */}
          {view === 'review' && (
            <div className="max-w-3xl mx-auto bg-surface rounded-3xl p-6 sm:p-8 shadow-sm border border-outline-variant/40">
              <ReviewStep
                lang={lang}
                farmData={farmData}
                cropData={cropData}
                damageData={damageData}
                photoData={photoData}
                onSubmit={handleReviewSubmit}
                onBack={() => setView('photos')}
                onEditStep={handleEditStep}
              />
            </div>
          )}

          {/* Generating Animation State */}
          {view === 'generating' && (
            <GeneratingReport
              lang={lang}
              onComplete={handleGeneratingComplete}
            />
          )}

          {/* Success Screen State */}
          {view === 'success' && (
            <SuccessScreen
              lang={lang}
              reportData={activeReport}
              onViewReport={handleViewReport}
              onBackToHub={handleBackToHub}
            />
          )}

          {/* Official Document Report Preview */}
          {view === 'preview' && (
            <ReportPreview
              lang={lang}
              report={activeReport}
              onBack={handleBackToHub}
            />
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <DashboardMobileNav
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        lang={lang}
      />
    </div>
  );
}
