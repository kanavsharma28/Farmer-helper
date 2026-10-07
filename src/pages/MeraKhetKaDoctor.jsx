import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import DashboardSidebar from '../components/dashboard/DashboardSidebar';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import DashboardMobileNav from '../components/dashboard/DashboardMobileNav';
import CropUpload from '../components/khetDoctor/CropUpload';
import DiagnosisLoading from '../components/khetDoctor/DiagnosisLoading';
import DiagnosisResult from '../components/khetDoctor/DiagnosisResult';
import { useAuth } from '../context/AuthContext';
import { getFarmerFarms } from '../data/farmData';
import {
  analyzeCropImage,
  getDiagnosisHistory,
  KHET_DOCTOR_UPDATE_EVENT,
} from '../services/khetDoctorService';

export default function MeraKhetKaDoctor() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [lang, setLang] = useState('en');
  const isEn = lang === 'en';
  const [activeNav, setActiveNav] = useState('khetDoctor');

  // Page View Modes: 'upload' | 'analyzing' | 'result'
  const [view, setView] = useState('upload');
  const [imageData, setImageData] = useState(null); // { url, file, name, size }
  const [selectedCrop, setSelectedCrop] = useState('wheat');
  const [currentDiagnosis, setCurrentDiagnosis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const farmerId = user?.id || 'user_farmer_01';
  const farmerName = user?.name || 'Rajesh Kumar';

  // Primary Farm Info (prefill crop & location if available)
  const farmerFarms = useMemo(() => getFarmerFarms(user?.id), [user?.id]);
  const primaryFarm = farmerFarms[0] || null;

  const initialCrop = useMemo(() => {
    return primaryFarm?.primaryCrop ? primaryFarm.primaryCrop.toLowerCase() : 'wheat';
  }, [primaryFarm]);

  const initialLocation = useMemo(() => {
    if (primaryFarm?.district && primaryFarm?.state) {
      return `${primaryFarm.district}, ${primaryFarm.state}`;
    }
    return 'Meerut, Uttar Pradesh';
  }, [primaryFarm]);

  // Diagnosis History
  const [history, setHistory] = useState(() => getDiagnosisHistory(farmerId));

  useEffect(() => {
    const handleUpdate = () => {
      setHistory(getDiagnosisHistory(farmerId));
    };
    window.addEventListener(KHET_DOCTOR_UPDATE_EVENT, handleUpdate);
    return () => window.removeEventListener(KHET_DOCTOR_UPDATE_EVENT, handleUpdate);
  }, [farmerId]);

  useEffect(() => {
    setHistory(getDiagnosisHistory(farmerId));
  }, [farmerId]);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleImageSelected = useCallback((img) => {
    setImageData(img);
    setErrorMessage('');
  }, []);

  const handleStartAnalysis = useCallback(
    async ({ crop, image, location }) => {
      setErrorMessage('');
      setSelectedCrop(crop);
      setImageData(image);
      setIsAnalyzing(true);
      setView('analyzing');

      try {
        const result = await analyzeCropImage({
          crop,
          imageFile: image.file,
          imageUrl: image.url,
          location,
          farmerId,
        });

        setCurrentDiagnosis(result);
        setIsAnalyzing(false);
        setView('result');
      } catch (err) {
        console.error('Diagnosis analysis failed:', err);
        setIsAnalyzing(false);
        setErrorMessage(
          isEn
            ? "We couldn't analyze the image right now. Please try again."
            : 'तकनीकी समस्या के कारण जांच पूरी नहीं हो सकी। कृपया पुनः प्रयास करें।'
        );
        setView('upload');
      }
    },
    [farmerId, isEn]
  );

  const handleNewScan = useCallback(() => {
    setImageData(null);
    setCurrentDiagnosis(null);
    setErrorMessage('');
    setView('upload');
  }, []);

  const handleViewPreviousDiagnosis = useCallback((historyItem) => {
    // Generate/render diagnosis result from history record
    setCurrentDiagnosis({
      id: historyItem.id,
      crop: historyItem.crop,
      cropHi: historyItem.cropHi || historyItem.crop,
      diseaseEn: historyItem.diseaseEn,
      diseaseHi: historyItem.diseaseHi || historyItem.diseaseEn,
      scientificName: historyItem.scientificName || 'Foliar Pathogen',
      confidence: historyItem.confidence || 90,
      severity: historyItem.severity || 'Moderate',
      severityHi: historyItem.severityHi || 'मध्यम',
      affectedPart: historyItem.affectedPart || 'Leaves / Foliage',
      affectedPartHi: historyItem.affectedPartHi || 'पत्तियां',
      description:
        historyItem.description ||
        `Crop health assessment for ${historyItem.crop} showing signs of ${historyItem.diseaseEn}.`,
      descriptionHi:
        historyItem.descriptionHi ||
        `${historyItem.crop} की फसल में ${historyItem.diseaseHi || historyItem.diseaseEn} के लक्षण पाए गए।`,
      symptoms: historyItem.symptoms || [
        { icon: 'grass', en: 'Visible discoloration and fungal spots on foliage', hi: 'पत्तियों पर धब्बे और पीलापन' },
        { icon: 'warning', en: 'Stunted plant growth in infected patches', hi: 'प्रभावित पौधों की वृद्धि रुकना' },
      ],
      causes: historyItem.causes || [
        { icon: 'water_drop', en: 'High relative humidity and warm conditions', hi: 'अधिक नमी और गर्म मौसम' },
      ],
      treatment: historyItem.treatment || {
        organic: [
          {
            icon: 'eco',
            titleEn: 'Neem-Based Bio-Fungicide (10,000 ppm)',
            titleHi: 'नीम आधारित जैव फफूंदनाशक',
            descEn: 'Spray 5 ml/litre on both upper and lower leaf surfaces.',
            descHi: '5 मि.ली. प्रति लीटर पानी में मिलाकर पत्तियों पर छिड़कें।',
            frequency: 'Every 7–10 days',
          },
        ],
        chemical: [
          {
            icon: 'medication',
            titleEn: 'Recommended Protective Fungicide',
            titleHi: 'अनुशंसित सुरक्षात्मक फफूंदनाशक',
            descEn: 'Apply certified protective fungicide in initial stages.',
            descHi: 'शुरुआती लक्षण दिखते ही अनुशंसित फफूंदनाशक का छिड़काव करें।',
            caution: 'Consult qualified agricultural scientist for exact dosage.',
            cautionHi: 'खुराक के लिए कृषि विशेषज्ञ से परामर्श अवश्य लें।',
          },
        ],
        prevention: [
          {
            icon: 'shield',
            titleEn: 'Field Sanitation and Water Management',
            titleHi: 'खेत की स्वच्छता व जल प्रबंधन',
            descEn: 'Avoid waterlogging and destroy diseased leaf material.',
            descHi: 'खेत में पानी जमा न होने दें और संक्रमित पत्तियां नष्ट करें।',
          },
        ],
      },
      hindiGuide: historyItem.hindiGuide || {
        overview: `${historyItem.crop} की फसल में ${historyItem.diseaseHi || historyItem.diseaseEn} की रोकथाम के लिए समय पर उचित प्रबंधन जरूरी है।`,
        dos: [
          'प्रभावित पौधों और पत्तियों को अलग करके नष्ट करें।',
          'स्वच्छ पानी में दवा घोलकर शाम के समय छिड़काव करें।',
          'नजदीकी कृषि विज्ञान केंद्र से सही दवा की सलाह लें।',
        ],
        donts: [
          'अनावश्यक रासायनिक खादों का अधिक उपयोग न करें।',
          'खेत में लंबे समय तक जलभराव न होने दें।',
        ],
      },
      location: historyItem.location || 'Meerut, Uttar Pradesh',
      imageUrl: historyItem.imageUrl || 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80',
    });
    setView('result');
  }, []);

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
        <main className="flex-1 p-4 sm:p-6 lg:p-10 overflow-y-auto space-y-6">

          {/* Error Banner with Try Again */}
          {errorMessage && (
            <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-between gap-3 text-rose-800 text-xs sm:text-sm animate-fade-in">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-lg shrink-0">error</span>
                <span>{errorMessage}</span>
              </div>
              <button
                onClick={() => setErrorMessage('')}
                className="px-3 py-1 bg-rose-700 text-white rounded-lg text-xs font-bold hover:bg-rose-800 cursor-pointer"
              >
                {isEn ? 'Try Again' : 'पुनः प्रयास'}
              </button>
            </div>
          )}

          {/* VIEW 1: UPLOAD & CROP SELECTION */}
          {view === 'upload' && (
            <CropUpload
              lang={lang}
              initialCrop={initialCrop}
              initialLocation={initialLocation}
              recentHistory={history}
              onImageSelected={handleImageSelected}
              onAnalyze={handleStartAnalysis}
              onViewPreviousDiagnosis={handleViewPreviousDiagnosis}
              isAnalyzing={isAnalyzing}
            />
          )}

          {/* VIEW 2: ANIMATED SCANNING & ANALYSIS */}
          {view === 'analyzing' && (
            <DiagnosisLoading
              lang={lang}
              imageData={imageData}
              onComplete={() => {
                // If API already set diagnosis, show result
                if (currentDiagnosis) setView('result');
              }}
            />
          )}

          {/* VIEW 3: COMPREHENSIVE DIAGNOSIS RESULT */}
          {view === 'result' && (
            <DiagnosisResult
              lang={lang}
              diagnosisData={currentDiagnosis}
              farmerName={farmerName}
              farmerId={farmerId}
              onNewScan={handleNewScan}
              onViewHistory={() => setView('upload')}
            />
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
