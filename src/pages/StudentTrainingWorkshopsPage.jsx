import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import DashboardSidebar from '../components/dashboard/DashboardSidebar';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import DashboardMobileNav from '../components/dashboard/DashboardMobileNav';
import { useAuth } from '../context/AuthContext';
import {
  TRAINING_PROGRAMS,
  TRAINING_CATEGORIES,
  TRAINING_MODES,
  TRAINING_LEVELS,
  getStudentRegistrations,
  registerForTraining,
  cancelRegistration,
  isStudentRegistered,
  getSavedTrainingIds,
  toggleSaveTraining,
  isTrainingSaved,
  TRAINING_UPDATE_EVENT,
} from '../data/trainingData';
import {
  getOrCreateConversation,
  sendMessageToConversation,
  getStoredConversations,
  CHAT_UPDATE_EVENT,
} from '../data/chatData';
import ChatModal from '../components/chat/ChatModal';

export default function StudentTrainingWorkshopsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [lang, setLang] = useState('en');
  const isEn = lang === 'en';
  const [activeNav, setActiveNav] = useState('training');

  // Active View Tab: 'browse' | 'my-learning' | 'saved'
  const activeTab = searchParams.get('tab') || 'browse';

  // Sub-tab for My Learning: 'upcoming' | 'completed' | 'cancelled'
  const [myLearningSubTab, setMyLearningSubTab] = useState('upcoming');

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [selectedMode, setSelectedMode] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedFee, setSelectedFee] = useState('all'); // 'all' | 'free' | 'paid'

  // Student Identity
  const studentId = user?.id || 'user_student_01';
  const studentName = user?.name || 'Aman Verma';
  const collegeName = user?.details?.college || 'GB Pant University of Agriculture';
  const courseName = user?.details?.course || 'B.Sc Agriculture (Hons)';

  // Registrations and Saved Programs State
  const [registrations, setRegistrations] = useState(() => getStudentRegistrations(studentId));
  const [savedIds, setSavedIds] = useState(() => getSavedTrainingIds(studentId));

  // Modals State
  const [detailsProgram, setDetailsProgram] = useState(null);
  const [registeringProgram, setRegisteringProgram] = useState(null);
  const [registrationSuccessItem, setRegistrationSuccessItem] = useState(null);
  const [certificateModalItem, setCertificateModalItem] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  // Universal Chat Modal State
  const [activeChatConversation, setActiveChatConversation] = useState(null);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);

  // Sync state on updates
  useEffect(() => {
    const handleUpdate = () => {
      setRegistrations(getStudentRegistrations(studentId));
      setSavedIds(getSavedTrainingIds(studentId));
    };
    window.addEventListener(TRAINING_UPDATE_EVENT, handleUpdate);
    return () => window.removeEventListener(TRAINING_UPDATE_EVENT, handleUpdate);
  }, [studentId]);

  useEffect(() => {
    setRegistrations(getStudentRegistrations(studentId));
    setSavedIds(getSavedTrainingIds(studentId));
  }, [studentId]);

  // Sync query param category
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setSelectedCategory(cat);
  }, [searchParams]);

  // Toast auto-hide
  useEffect(() => {
    if (!toastMessage) return;
    const t = setTimeout(() => setToastMessage(''), 3500);
    return () => clearTimeout(t);
  }, [toastMessage]);

  const showToast = (msg) => {
    setToastMessage(msg);
  };

  // ── Actions ────────────────────────────────────────────────────────────────
  const handleToggleSave = (programId, e) => {
    if (e) e.stopPropagation();
    const isNowSaved = toggleSaveTraining(programId, studentId);
    setSavedIds(getSavedTrainingIds(studentId));
    showToast(
      isNowSaved
        ? (isEn ? 'Program saved to your bookmarks!' : 'कार्यक्रम आपके सहेजे गए अनुभाग में जोड़ा गया!')
        : (isEn ? 'Program removed from bookmarks.' : 'कार्यक्रम सहेजे गए अनुभाग से हटाया गया।')
    );
  };

  const handleOpenDetails = (program) => {
    setDetailsProgram(program);
  };

  const handleOpenRegister = (program, e) => {
    if (e) e.stopPropagation();
    if (isStudentRegistered(program.id, studentId)) {
      showToast(isEn ? 'You are already registered for this program.' : 'आप इस कार्यक्रम के लिए पहले से पंजीकृत हैं।');
      return;
    }
    setRegisteringProgram(program);
  };

  const handleConfirmRegistration = (notes = '') => {
    if (!registeringProgram) return;

    const res = registerForTraining({
      trainingId: registeringProgram.id,
      studentUser: user || {
        id: studentId,
        name: studentName,
        email: user?.email || 'aman.verma@agriuni.ac.in',
        phone: user?.phone || '9812345678',
        details: { college: collegeName, course: courseName },
      },
      notes,
    });

    if (res.success) {
      setRegistrations(getStudentRegistrations(studentId));
      setRegistrationSuccessItem(registeringProgram);
      setRegisteringProgram(null);
      setDetailsProgram(null);
    } else {
      showToast(res.error || (isEn ? 'Registration failed' : 'पंजीकरण विफल रहा'));
    }
  };

  const handleCancelRegistration = (regId) => {
    if (window.confirm(isEn ? 'Are you sure you want to cancel this registration?' : 'क्या आप वाकई यह पंजीकरण रद्द करना चाहते हैं?')) {
      cancelRegistration(regId, studentId);
      setRegistrations(getStudentRegistrations(studentId));
      showToast(isEn ? 'Registration cancelled.' : 'पंजीकरण रद्द कर दिया गया।');
    }
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedMode('all');
    setSelectedLevel('all');
    setSelectedFee('all');
  };

  // Chat with Trainer (reusing Universal In-App Chat)
  const handleChatWithTrainer = (program) => {
    const targetId = program.instructorId || 'user_farmer_01';
    const targetName = program.instructorName || 'Trainer';

    const conv = getOrCreateConversation({
      currentUser: user || { id: studentId, name: studentName, role: 'student' },
      targetUser: {
        id: targetId,
        name: targetName,
        role: program.organizerRole === 'farmer' ? 'farmer' : 'institution',
        phone: '9876543210',
        farmName: program.organizerName || program.provider,
      },
      context: {
        type: 'training',
        id: program.id,
        title: program.title,
        subtitle: program.organizerName || program.provider,
      },
      initialText: `Namaste! I am registered / interested in "${program.title}". Could you please share pre-requisite preparation details?`,
    });

    if (conv) {
      setActiveChatConversation(conv);
      setIsChatModalOpen(true);
    }
  };

  const handleSendChatMessage = ({ text }) => {
    if (!activeChatConversation || !text.trim()) return;
    sendMessageToConversation({
      conversationId: activeChatConversation.id,
      senderId: studentId,
      senderName: studentName,
      senderRole: 'student',
      receiverId: activeChatConversation.targetUser?.id || 'user_farmer_01',
      receiverRole: activeChatConversation.targetUser?.role || 'farmer',
      message: text,
    });
  };

  // ── Filtered Programs List ─────────────────────────────────────────────────
  const filteredPrograms = useMemo(() => {
    return TRAINING_PROGRAMS.filter((p) => {
      // Saved tab filter
      if (activeTab === 'saved') {
        if (!savedIds.includes(p.id)) return false;
      }

      // Category filter
      if (selectedCategory !== 'all' && p.category !== selectedCategory) {
        return false;
      }

      // Mode filter
      if (selectedMode !== 'all' && p.mode.toLowerCase() !== selectedMode.toLowerCase()) {
        return false;
      }

      // Level filter
      if (selectedLevel !== 'all' && p.skillLevel.toLowerCase() !== selectedLevel.toLowerCase()) {
        return false;
      }

      // Fee filter
      if (selectedFee === 'free' && !p.isFree) return false;
      if (selectedFee === 'paid' && p.isFree) return false;

      // Free text search across title, description, category, instructor, location
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const mTitle = p.title.toLowerCase().includes(q) || (p.titleHi && p.titleHi.toLowerCase().includes(q));
        const mDesc = p.description.toLowerCase().includes(q);
        const mCat = p.categoryLabelEn.toLowerCase().includes(q) || p.categoryLabelHi.toLowerCase().includes(q);
        const mInst = p.instructorName.toLowerCase().includes(q);
        const mLoc = p.location.toLowerCase().includes(q);
        const mTopics = p.topicsCovered?.some((t) => t.toLowerCase().includes(q));

        if (!mTitle && !mDesc && !mCat && !mInst && !mLoc && !mTopics) {
          return false;
        }
      }

      return true;
    });
  }, [activeTab, savedIds, selectedCategory, selectedMode, selectedLevel, selectedFee, searchQuery]);

  const featuredPrograms = useMemo(() => {
    return TRAINING_PROGRAMS.filter((p) => p.isFeatured);
  }, []);

  const upcomingWorkshops = useMemo(() => {
    return [...TRAINING_PROGRAMS].sort((a, b) => new Date(a.date) - new Date(b.date)).slice(0, 4);
  }, []);

  // Filter My Learning items by sub-tab
  const filteredRegistrations = useMemo(() => {
    return registrations.filter((r) => r.tabStatus === myLearningSubTab);
  }, [registrations, myLearningSubTab]);

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col lg:flex-row font-sans selection:bg-primary-container selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3 rounded-2xl bg-primary text-white shadow-xl animate-fade-in border border-primary-container/40">
          <span className="material-symbols-outlined text-xl">check_circle</span>
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Desktop Sticky Sidebar */}
      <DashboardSidebar
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        lang={lang}
      />

      {/* Main Content Column */}
      <div className="flex-1 flex flex-col min-w-0 pb-24 lg:pb-8">
        {/* Top Header Bar */}
        <DashboardHeader
          lang={lang}
          setLang={setLang}
        />

        {/* Dynamic Page Canvas */}
        <main className="flex-1 p-4 sm:p-6 lg:p-10 overflow-y-auto space-y-6">

          {/* ── Page Header & Top Actions ─────────────────────────────── */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-8 h-8 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-xl">psychology</span>
                </span>
                <span className="text-xs font-bold font-label-md text-primary uppercase tracking-widest">
                  {isEn ? 'Student Learning Portal • Skill Academy' : 'छात्र शिक्षण पोर्टल • कौशल अकादमी'}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
                {isEn ? 'Training & Workshops' : 'प्रशिक्षण एवं कार्यशालाएं'}
              </h1>
              <p className="text-sm text-on-surface-variant max-w-2xl mt-1 leading-relaxed">
                {isEn
                  ? 'Learn practical agriculture skills, join expert-led workshops and build your knowledge for a better career in agriculture.'
                  : 'व्यावहारिक कृषि कौशल सीखें, विशेषज्ञ कार्यशालाओं से जुड़ें और कृषि क्षेत्र में उज्ज्वल करियर बनाएं।'}
              </p>
            </div>

            {/* Top Navigation Mode Tabs */}
            <div className="flex items-center gap-2 bg-surface-container-low p-1.5 rounded-2xl border border-outline-variant/30 self-start md:self-auto overflow-x-auto max-w-full">
              <button
                type="button"
                onClick={() => setSearchParams({ tab: 'browse' })}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  activeTab === 'browse'
                    ? 'bg-primary text-white shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                }`}
              >
                <span className="material-symbols-outlined text-[17px]">school</span>
                <span>{isEn ? 'Explore Programs' : 'प्रशिक्षण खोजें'}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeTab === 'browse' ? 'bg-white/20' : 'bg-surface-container-high'}`}>
                  {TRAINING_PROGRAMS.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setSearchParams({ tab: 'my-learning' })}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  activeTab === 'my-learning'
                    ? 'bg-primary text-white shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                }`}
              >
                <span className="material-symbols-outlined text-[17px]">local_library</span>
                <span>{isEn ? 'My Learning' : 'मेरा शिक्षण'}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeTab === 'my-learning' ? 'bg-white/20' : 'bg-surface-container-high'}`}>
                  {registrations.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setSearchParams({ tab: 'saved' })}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  activeTab === 'saved'
                    ? 'bg-primary text-white shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                }`}
              >
                <span className="material-symbols-outlined text-[17px]">bookmark</span>
                <span>{isEn ? 'Saved' : 'सहेजे गए'}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeTab === 'saved' ? 'bg-white/20' : 'bg-surface-container-high'}`}>
                  {savedIds.length}
                </span>
              </button>
            </div>
          </div>

          {/* ── Requirement 4: Compact Hero Section ───────────────────── */}
          {activeTab === 'browse' && (
            <div className="p-6 rounded-3xl bg-gradient-to-r from-primary-container via-primary to-primary-container text-white shadow-sm relative overflow-hidden">
              <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-15 flex items-center justify-center pointer-events-none select-none">
                <span className="material-symbols-outlined text-[140px]">psychology</span>
              </div>
              <div className="relative z-10 max-w-2xl space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/15 text-white text-xs font-semibold backdrop-blur-xs">
                  <span className="material-symbols-outlined text-sm">workspace_premium</span>
                  <span>{isEn ? 'Certified Practical Learning' : 'प्रमाणित व्यावहारिक प्रशिक्षण'}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                  {isEn ? 'Learn. Practice. Grow.' : 'सीखें। अभ्यास करें। आगे बढ़ें।'}
                </h2>
                <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
                  {isEn
                    ? 'Explore agriculture training programs and workshops designed for students. Master protected polyhouses, soil testing, agri-drones, and organic inputs from certified scientists and lead farmers.'
                    : 'कृषि छात्रों के लिए तैयार विशेष प्रशिक्षण व कार्यशालाएं। पॉलीहाउस, मृदा परीक्षण, ड्रोन छिड़काव व जैविक खाद निर्माण सीखें।'}
                </p>
                <div className="flex items-center gap-3 pt-1 text-xs text-white/80">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm text-emerald-300">verified</span>
                    {isEn ? 'Govt / ICAR Accredited' : 'सरकारी व आईसीएआर मान्यता'}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm text-amber-300">card_membership</span>
                    {isEn ? 'Certificates of Completion' : 'सत्यापित प्रमाण पत्र'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ── VIEW TAB 1: BROWSE ALL / SAVED PROGRAMS ────────────────── */}
          {activeTab !== 'my-learning' && (
            <>
              {/* ── Requirement 6: Search & Multi-Filters ─────────────── */}
              <div className="p-5 rounded-3xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs space-y-4">
                {/* Search Bar Input */}
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">
                    search
                  </span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={
                      isEn
                        ? 'Search training by topic, skills, instructor, or location (e.g. Hydroponics, Soil, Drone, Meerut)...'
                        : 'विषय, कौशल, प्रशिक्षक या स्थान से खोजें (उदा. हाइड्रोपोनिक्स, मृदा, ड्रोन, मेरठ)...'
                    }
                    className="w-full pl-11 pr-10 py-3.5 rounded-2xl bg-surface-container-low border border-outline-variant/40 text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                  )}
                </div>

                {/* Filter Dropdowns Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {/* Mode */}
                  <div>
                    <label className="block text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                      {isEn ? 'Delivery Mode' : 'माध्यम'}
                    </label>
                    <select
                      value={selectedMode}
                      onChange={(e) => setSelectedMode(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-xs font-medium text-on-surface focus:outline-none focus:border-primary cursor-pointer"
                    >
                      {TRAINING_MODES.map((m) => (
                        <option key={m.id} value={m.id}>
                          {isEn ? m.labelEn : m.labelHi}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Level */}
                  <div>
                    <label className="block text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                      {isEn ? 'Skill Level' : 'कौशल स्तर'}
                    </label>
                    <select
                      value={selectedLevel}
                      onChange={(e) => setSelectedLevel(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-xs font-medium text-on-surface focus:outline-none focus:border-primary cursor-pointer"
                    >
                      {TRAINING_LEVELS.map((lvl) => (
                        <option key={lvl.id} value={lvl.id}>
                          {isEn ? lvl.labelEn : lvl.labelHi}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Fee */}
                  <div>
                    <label className="block text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                      {isEn ? 'Fee / Tuition' : 'शुल्क'}
                    </label>
                    <select
                      value={selectedFee}
                      onChange={(e) => setSelectedFee(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-xs font-medium text-on-surface focus:outline-none focus:border-primary cursor-pointer"
                    >
                      <option value="all">{isEn ? 'All Programs (Free & Paid)' : 'सभी (निशुल्क व सशुल्क)'}</option>
                      <option value="free">{isEn ? 'Free Only' : 'केवल निशुल्क'}</option>
                      <option value="paid">{isEn ? 'Paid / Masterclass' : 'सशुल्क मास्टरक्लास'}</option>
                    </select>
                  </div>

                  {/* Category Dropdown */}
                  <div>
                    <label className="block text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                      {isEn ? 'Category' : 'श्रेणी'}
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-xs font-medium text-on-surface focus:outline-none focus:border-primary cursor-pointer"
                    >
                      {TRAINING_CATEGORIES.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.emoji} {isEn ? c.labelEn : c.labelHi}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Filter Meta & Clear Button */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-outline-variant/20 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-primary text-sm">
                      {filteredPrograms.length} {isEn ? 'programs found' : 'कार्यक्रम उपलब्ध'}
                    </span>
                    {selectedCategory !== 'all' && (
                      <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-semibold text-[11px] flex items-center gap-1">
                        <span>{TRAINING_CATEGORIES.find((c) => c.id === selectedCategory)?.labelEn || selectedCategory}</span>
                        <button onClick={() => setSelectedCategory('all')} className="hover:text-primary-container cursor-pointer">×</button>
                      </span>
                    )}
                    {selectedMode !== 'all' && (
                      <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-semibold text-[11px] flex items-center gap-1">
                        <span>{selectedMode}</span>
                        <button onClick={() => setSelectedMode('all')} className="hover:text-primary-container cursor-pointer">×</button>
                      </span>
                    )}
                  </div>

                  {(searchQuery || selectedCategory !== 'all' || selectedMode !== 'all' || selectedLevel !== 'all' || selectedFee !== 'all') && (
                    <button
                      onClick={handleClearFilters}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 transition-all cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm">filter_alt_off</span>
                      <span>{isEn ? 'Clear Filters' : 'फ़िल्टर हटाएं'}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* ── Requirement 5: 12 Category Filter Chips ───────────── */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                    {isEn ? 'Browse by Domain' : 'डोमेन अनुसार खोजें'}
                  </h3>
                  <span className="text-[11px] text-on-surface-variant">
                    {TRAINING_CATEGORIES.length - 1} {isEn ? 'Skill Categories' : 'कौशल श्रेणियां'}
                  </span>
                </div>
                <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
                  {TRAINING_CATEGORIES.map((cat) => {
                    const isSelected = selectedCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                          isSelected
                            ? 'bg-primary text-white border-primary shadow-xs'
                            : 'bg-surface-container-lowest text-on-surface border-outline-variant/40 hover:bg-surface-container hover:border-primary/40'
                        }`}
                      >
                        <span className="text-sm">{cat.emoji}</span>
                        <span>{isEn ? cat.labelEn : cat.labelHi}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ── Requirement 8: Featured Training Programs ──────────── */}
              {selectedCategory === 'all' && !searchQuery && selectedMode === 'all' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                      <h3 className="text-sm font-bold text-on-surface">
                        {isEn ? 'Featured Practical Programs ⭐' : 'प्रमुख व्यावहारिक प्रशिक्षण ⭐'}
                      </h3>
                    </div>
                    <span className="text-[11px] font-semibold text-primary">
                      {isEn ? 'Certified Curriculums' : 'प्रमाणित पाठ्यक्रम'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {featuredPrograms.slice(0, 3).map((program) => (
                      <TrainingCard
                        key={program.id}
                        program={program}
                        isEn={isEn}
                        isSaved={savedIds.includes(program.id)}
                        isRegistered={isStudentRegistered(program.id, studentId)}
                        onToggleSave={(e) => handleToggleSave(program.id, e)}
                        onViewDetails={() => handleOpenDetails(program)}
                        onRegister={(e) => handleOpenRegister(program, e)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* ── Requirement 9: Upcoming Workshops Calendar Row ─────── */}
              {selectedCategory === 'all' && !searchQuery && (
                <div className="p-6 rounded-3xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-extrabold text-base text-on-surface">
                        {isEn ? 'Upcoming Workshops & Masterclasses 🔬' : 'आगामी कार्यशालाएं व मास्टरक्लास 🔬'}
                      </h3>
                      <p className="text-xs text-on-surface-variant">
                        {isEn ? 'Ordered chronologically by commencement date' : 'प्रारंभ तिथि के अनुसार क्रमबद्ध'}
                      </p>
                    </div>
                    <span className="text-xs text-on-surface-variant">
                      {upcomingWorkshops.length} {isEn ? 'sessions scheduled' : 'सत्र निर्धारित'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {upcomingWorkshops.map((ws) => (
                      <div
                        key={ws.id}
                        className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30 flex flex-col justify-between space-y-3 hover:border-primary/40 transition-all"
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="px-2 py-0.5 rounded-full font-bold bg-amber-500/10 text-amber-800">
                              {ws.mode}
                            </span>
                            <span className="font-mono font-semibold text-primary">{ws.dates.split('-')[0]}</span>
                          </div>
                          <h4 className="font-bold text-xs text-on-surface line-clamp-2">{ws.title}</h4>
                          <p className="text-[11px] text-on-surface-variant line-clamp-1">📍 {ws.location}</p>
                          <p className="text-[11px] text-primary font-semibold">👨‍🏫 {ws.instructorName.split('&')[0]}</p>
                        </div>

                        <div className="pt-2 border-t border-outline-variant/20 flex items-center justify-between text-xs">
                          <span className="font-bold text-on-surface">{ws.fee}</span>
                          <button
                            type="button"
                            onClick={() => handleOpenDetails(ws)}
                            className="text-primary font-bold hover:underline"
                          >
                            {isEn ? 'Register →' : 'नामांकन →'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Requirement 7: Main Training Programs Grid ────────── */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-on-surface">
                    {activeTab === 'saved'
                      ? (isEn ? 'My Saved Programs' : 'सहेजे गए कार्यक्रम')
                      : (isEn ? 'All Training Programs & Workshops' : 'सभी प्रशिक्षण कार्यक्रम एवं कार्यशालाएं')}
                  </h3>
                  <span className="text-xs text-on-surface-variant">
                    {filteredPrograms.length} {isEn ? 'programs' : 'कार्यक्रम'}
                  </span>
                </div>

                {filteredPrograms.length === 0 ? (
                  /* Requirement 27: Empty State */
                  <div className="p-12 text-center bg-surface-container-lowest rounded-3xl border border-outline-variant/30 space-y-3">
                    <span className="material-symbols-outlined text-4xl text-on-surface-variant/50">
                      school
                    </span>
                    <h4 className="font-bold text-base text-on-surface">
                      {isEn ? 'No training or workshops found.' : 'कोई प्रशिक्षण या कार्यशाला नहीं मिली।'}
                    </h4>
                    <p className="text-xs text-on-surface-variant max-w-md mx-auto">
                      {isEn
                        ? 'Try clearing category, mode, or keyword filters to browse other learning opportunities.'
                        : 'कृपया फ़िल्टर हटाकर अन्य प्रशिक्षण कार्यक्रम देखें।'}
                    </p>
                    <button
                      onClick={handleClearFilters}
                      className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-container cursor-pointer"
                    >
                      {isEn ? 'Clear All Filters' : 'सभी फ़िल्टर साफ़ करें'}
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredPrograms.map((program) => (
                      <TrainingCard
                        key={program.id}
                        program={program}
                        isEn={isEn}
                        isSaved={savedIds.includes(program.id)}
                        isRegistered={isStudentRegistered(program.id, studentId)}
                        onToggleSave={(e) => handleToggleSave(program.id, e)}
                        onViewDetails={() => handleOpenDetails(program)}
                        onRegister={(e) => handleOpenRegister(program, e)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {/* ── VIEW TAB 2: Requirement 13: MY LEARNING ────────────────── */}
          {activeTab === 'my-learning' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-extrabold text-on-surface">
                    {isEn ? 'My Learning Dashboard' : 'मेरा शिक्षण डैशबोर्ड'}
                  </h2>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    {isEn
                      ? 'Track your registered training programs, join upcoming live workshops, and download official certificates.'
                      : 'अपने पंजीकृत कार्यक्रमों की स्थिति देखें, लाइव सत्र से जुड़ें और प्रमाण पत्र डाउनलोड करें।'}
                  </p>
                </div>

                {/* Sub-tabs: Upcoming | Completed | Cancelled */}
                <div className="flex items-center gap-1.5 bg-surface-container-low p-1 rounded-2xl border border-outline-variant/30">
                  {[
                    { id: 'upcoming', labelEn: 'Upcoming', labelHi: 'आगामी' },
                    { id: 'completed', labelEn: 'Completed', labelHi: 'पूर्ण' },
                    { id: 'cancelled', labelEn: 'Cancelled', labelHi: 'रद्द' },
                  ].map((sub) => (
                    <button
                      key={sub.id}
                      type="button"
                      onClick={() => setMyLearningSubTab(sub.id)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        myLearningSubTab === sub.id
                          ? 'bg-primary text-white shadow-xs'
                          : 'text-on-surface-variant hover:text-on-surface'
                      }`}
                    >
                      {isEn ? sub.labelEn : sub.labelHi}
                    </button>
                  ))}
                </div>
              </div>

              {filteredRegistrations.length === 0 ? (
                <div className="p-12 text-center bg-surface-container-lowest rounded-3xl border border-outline-variant/30 space-y-3">
                  <span className="material-symbols-outlined text-4xl text-on-surface-variant/50">
                    local_library
                  </span>
                  <h4 className="font-bold text-base text-on-surface">
                    {isEn
                      ? `No ${myLearningSubTab} training programs found.`
                      : `कोई ${myLearningSubTab} कार्यक्रम नहीं मिला।`}
                  </h4>
                  <p className="text-xs text-on-surface-variant max-w-md mx-auto">
                    {isEn
                      ? 'Explore the catalog to register for agricultural bootcamps, workshops, and drone masterclasses.'
                      : 'कौशल विकास के लिए उपलब्ध प्रशिक्षण कार्यक्रमों में नामांकन करें।'}
                  </p>
                  <button
                    onClick={() => setSearchParams({ tab: 'browse' })}
                    className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-container cursor-pointer"
                  >
                    {isEn ? 'Browse Training Programs' : 'प्रशिक्षण खोजें'}
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredRegistrations.map((reg) => {
                    const originalProgram = TRAINING_PROGRAMS.find((p) => p.id === reg.trainingId);

                    return (
                      <div
                        key={reg.id}
                        className="p-5 rounded-3xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                      >
                        <div className="space-y-2.5">
                          <div className="flex items-start justify-between gap-2">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary border border-primary/20">
                              {reg.mode}
                            </span>
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                                reg.status === 'Completed'
                                  ? 'bg-emerald-500/15 text-emerald-800 border border-emerald-500/30'
                                  : reg.status === 'Confirmed'
                                  ? 'bg-blue-500/15 text-blue-800 border border-blue-500/30'
                                  : 'bg-rose-500/15 text-rose-800 border border-rose-500/30'
                              }`}
                            >
                              {isEn ? reg.status : (reg.statusHi || reg.status)}
                            </span>
                          </div>

                          <h3 className="font-extrabold text-base text-on-surface">{reg.trainingTitle}</h3>
                          <p className="text-xs text-on-surface-variant">📍 {reg.location}</p>
                          <p className="text-xs font-semibold text-primary">🗓 {reg.date}</p>

                          {/* Certificate Badge */}
                          <div className="p-3 rounded-2xl bg-surface-container-low border border-outline-variant/20 flex items-center justify-between text-xs">
                            <span className="text-on-surface-variant font-medium">
                              {isEn ? 'Certificate:' : 'प्रमाण पत्र:'}
                            </span>
                            <span className="font-bold text-emerald-700 flex items-center gap-1">
                              <span className="material-symbols-outlined text-sm">workspace_premium</span>
                              <span>{reg.certificateStatus}</span>
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="pt-2 border-t border-outline-variant/20 flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            {originalProgram && (
                              <button
                                type="button"
                                onClick={() => handleOpenDetails(originalProgram)}
                                className="px-3 py-1.5 rounded-xl bg-surface-container text-xs font-bold hover:bg-surface-container-high cursor-pointer"
                              >
                                {isEn ? 'Details' : 'विवरण'}
                              </button>
                            )}

                            {reg.onlineLink && reg.status !== 'Cancelled' && (
                              <a
                                href={reg.onlineLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3.5 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 flex items-center gap-1 shadow-xs"
                              >
                                <span className="material-symbols-outlined text-sm">video_camera_front</span>
                                <span>{isEn ? 'Join Training' : 'सत्र से जुड़ें'}</span>
                              </a>
                            )}

                            {reg.certificateStatus === 'Certificate Issued' && (
                              <button
                                type="button"
                                onClick={() => setCertificateModalItem(reg)}
                                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 flex items-center gap-1 shadow-xs cursor-pointer"
                              >
                                <span className="material-symbols-outlined text-sm">card_membership</span>
                                <span>{isEn ? 'View Certificate' : 'प्रमाण पत्र देखें'}</span>
                              </button>
                            )}
                          </div>

                          {reg.status === 'Confirmed' && (
                            <button
                              type="button"
                              onClick={() => handleCancelRegistration(reg.id)}
                              className="text-xs text-rose-600 font-semibold hover:underline cursor-pointer"
                            >
                              {isEn ? 'Cancel' : 'रद्द करें'}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

        </main>
      </div>

      {/* Sticky Mobile Bottom Navigation */}
      <DashboardMobileNav
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        lang={lang}
      />

      {/* ── Requirement 10: Training Details Modal ────────────────────── */}
      {detailsProgram && (
        <TrainingDetailsModal
          program={detailsProgram}
          isEn={isEn}
          isRegistered={isStudentRegistered(detailsProgram.id, studentId)}
          isSaved={savedIds.includes(detailsProgram.id)}
          onClose={() => setDetailsProgram(null)}
          onRegister={() => {
            const p = detailsProgram;
            setDetailsProgram(null);
            setRegisteringProgram(p);
          }}
          onToggleSave={() => handleToggleSave(detailsProgram.id)}
          onChatWithTrainer={() => {
            const p = detailsProgram;
            setDetailsProgram(null);
            handleChatWithTrainer(p);
          }}
        />
      )}

      {/* ── Requirement 12: Registration Confirmation Modal ──────────── */}
      {registeringProgram && (
        <RegistrationModal
          program={registeringProgram}
          isEn={isEn}
          studentUser={{
            name: studentName,
            email: user?.email || 'aman.verma@agriuni.ac.in',
            phone: user?.phone || '9812345678',
            college: collegeName,
            course: courseName,
          }}
          onClose={() => setRegisteringProgram(null)}
          onConfirm={handleConfirmRegistration}
        />
      )}

      {/* ── Registration Success Celebration Modal ────────────────────── */}
      {registrationSuccessItem && (
        <RegistrationSuccessModal
          program={registrationSuccessItem}
          isEn={isEn}
          onClose={() => setRegistrationSuccessItem(null)}
          onViewMyLearning={() => {
            setRegistrationSuccessItem(null);
            setSearchParams({ tab: 'my-learning' });
          }}
        />
      )}

      {/* ── Requirement 14: Certificate of Completion Modal ─────────── */}
      {certificateModalItem && (
        <CertificateModal
          item={certificateModalItem}
          isEn={isEn}
          studentName={studentName}
          onClose={() => setCertificateModalItem(null)}
        />
      )}

      {/* ── Universal Chat Modal ──────────────────────────────────────── */}
      {isChatModalOpen && activeChatConversation && (
        <ChatModal
          isOpen={isChatModalOpen}
          onClose={() => setIsChatModalOpen(false)}
          conversation={activeChatConversation}
          currentUser={user || { id: studentId, name: studentName, role: 'student' }}
          onSendMessage={handleSendChatMessage}
          lang={lang}
        />
      )}
    </div>
  );
}

// ─── Requirement 7: Training / Workshop Card Component ────────────────────────
function TrainingCard({
  program,
  isEn,
  isSaved,
  isRegistered,
  onToggleSave,
  onViewDetails,
  onRegister,
}) {
  return (
    <div className="p-5 rounded-3xl bg-surface-container-lowest border border-outline-variant/30 hover:border-primary/40 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group relative">
      <div className="space-y-3">
        {/* Top Badges & Bookmark */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary border border-primary/20">
              {isEn ? program.categoryLabelEn : program.categoryLabelHi}
            </span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                program.mode === 'Online'
                  ? 'bg-blue-500/10 text-blue-800 border border-blue-500/20'
                  : program.mode === 'Hybrid'
                  ? 'bg-purple-500/10 text-purple-800 border border-purple-500/20'
                  : 'bg-amber-500/10 text-amber-800 border border-amber-500/20'
              }`}
            >
              {program.mode === 'Online' ? '💻 Online' : program.mode === 'Hybrid' ? '⚡ Hybrid' : '📍 In-Person'}
            </span>
          </div>

          <button
            type="button"
            onClick={onToggleSave}
            title={isSaved ? 'Remove from saved' : 'Save program'}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
              isSaved
                ? 'bg-primary text-white shadow-xs'
                : 'bg-surface-container text-on-surface-variant hover:text-primary hover:bg-primary/10'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">
              {isSaved ? 'bookmark_added' : 'bookmark_border'}
            </span>
          </button>
        </div>

        {/* Thumbnail Image */}
        <div className="w-full h-36 rounded-2xl overflow-hidden bg-surface-container relative">
          <img
            src={program.image}
            alt={program.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-2 right-2">
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-black/60 text-white backdrop-blur-xs">
              {program.duration}
            </span>
          </div>
          <div className="absolute bottom-2 left-2">
            <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-primary text-white shadow-xs">
              {program.fee}
            </span>
          </div>
        </div>

        {/* Title & Short Description */}
        <div>
          <h3 className="font-extrabold text-base text-on-surface group-hover:text-primary transition-colors line-clamp-2">
            {isEn ? program.title : (program.titleHi || program.title)}
          </h3>
          <p className="text-xs text-on-surface-variant mt-1 line-clamp-2 leading-relaxed">
            {isEn ? program.description : (program.descriptionHi || program.description)}
          </p>
        </div>

        {/* Key Metadata Pills */}
        <div className="p-3 rounded-2xl bg-surface-container-low border border-outline-variant/20 space-y-1.5 text-[11px] text-on-surface-variant">
          <div className="flex items-center justify-between">
            <span className="truncate">👨‍🏫 {program.instructorName.split('&')[0]}</span>
            <span className="font-semibold text-primary">{program.skillLevel}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>🗓 {program.dates}</span>
            <span className="font-semibold text-emerald-700">
              {program.seatsLeft} {isEn ? 'seats left' : 'सीटें बाकी'}
            </span>
          </div>
        </div>
      </div>

      {/* Card Action Buttons */}
      <div className="pt-4 border-t border-outline-variant/20 mt-4 space-y-2">
        <div className="flex items-center justify-between text-[11px]">
          <span className="flex items-center gap-1 font-semibold text-emerald-800">
            <span className="material-symbols-outlined text-xs">verified</span>
            {isEn ? 'Certificate Available' : 'प्रमाण पत्र उपलब्ध'}
          </span>
          <span className="font-bold text-primary">{program.fee}</span>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            type="button"
            onClick={onViewDetails}
            className="w-full py-2 px-3 rounded-xl bg-surface-container-high text-on-surface font-bold text-xs hover:bg-surface-container-highest transition-all text-center cursor-pointer"
          >
            {isEn ? 'View Details' : 'विवरण देखें'}
          </button>

          {isRegistered ? (
            <span className="w-full py-2 px-3 rounded-xl bg-emerald-500/15 text-emerald-800 font-bold text-xs border border-emerald-500/30 flex items-center justify-center gap-1">
              <span>✓</span>
              <span>{isEn ? 'Registered' : 'पंजीकृत'}</span>
            </span>
          ) : (
            <button
              type="button"
              onClick={onRegister}
              className="w-full py-2 px-3 rounded-xl bg-primary text-white font-bold text-xs hover:bg-primary-container transition-all text-center shadow-xs cursor-pointer active:scale-98"
            >
              {isEn ? 'Register' : 'नामांकन'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Requirement 10: Training Details Modal Component ─────────────────────────
function TrainingDetailsModal({
  program,
  isEn,
  isRegistered,
  isSaved,
  onClose,
  onRegister,
  onToggleSave,
  onChatWithTrainer,
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-fade-in">
      <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/40 shadow-2xl max-w-2xl w-full my-8 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Top Header */}
        <div className="p-6 bg-surface-container-low border-b border-outline-variant/30 flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
                {isEn ? program.categoryLabelEn : program.categoryLabelHi}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-800">
                {program.mode}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-800">
                {program.fee}
              </span>
            </div>
            <h2 className="text-xl font-black text-on-surface">
              {isEn ? program.title : (program.titleHi || program.title)}
            </h2>
            <p className="text-xs text-on-surface-variant">
              {program.organizerName} • {program.accreditation}
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-all cursor-pointer shrink-0"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm">
          {/* Hero Specimen Image */}
          <div className="w-full h-48 rounded-2xl overflow-hidden relative shadow-inner">
            <img src={program.image} alt={program.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-4">
              <div className="text-white text-xs space-y-0.5">
                <span className="font-bold block">🗓 {program.dates} ({program.duration})</span>
                <span className="opacity-90">📍 {program.location}</span>
              </div>
            </div>
          </div>

          {/* Overview */}
          <div className="space-y-2">
            <h4 className="font-bold text-xs uppercase tracking-wider text-primary flex items-center gap-1.5">
              <span className="material-symbols-outlined text-base">info</span>
              <span>{isEn ? 'Program Overview' : 'कार्यक्रम का परिचय'}</span>
            </h4>
            <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
              {program.overview || program.description}
            </p>
          </div>

          {/* Requirement 11: What You Will Learn (Visual Bullet Cards) */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-xs uppercase tracking-wider text-primary flex items-center gap-1.5">
              <span className="material-symbols-outlined text-base">psychology</span>
              <span>{isEn ? 'What You Will Learn' : 'आप क्या सीखेंगे'}</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {program.whatYouWillLearn?.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-surface-container-low border border-outline-variant/30 flex items-start gap-2 text-xs"
                >
                  <span className="material-symbols-outlined text-emerald-600 text-base shrink-0 mt-0.5">
                    check_circle
                  </span>
                  <span className="text-on-surface leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Topics Covered */}
          <div className="space-y-2">
            <h4 className="font-bold text-xs uppercase tracking-wider text-primary flex items-center gap-1.5">
              <span className="material-symbols-outlined text-base">menu_book</span>
              <span>{isEn ? 'Key Topics & Modules' : 'प्रमुख विषय एवं मॉड्यूल'}</span>
            </h4>
            <div className="p-3.5 rounded-2xl bg-surface-container-low border border-outline-variant/30 space-y-1.5 text-xs text-on-surface-variant">
              {program.topicsCovered?.map((topic, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <span>{topic}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Instructor & Organization */}
          <div className="space-y-2">
            <h4 className="font-bold text-xs uppercase tracking-wider text-primary flex items-center gap-1.5">
              <span className="material-symbols-outlined text-base">person</span>
              <span>{isEn ? 'Instructor / Training Provider' : 'प्रशिक्षक एवं संस्थान'}</span>
            </h4>
            <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30 flex items-start justify-between gap-3">
              <div className="space-y-1">
                <h5 className="font-bold text-sm text-on-surface">{program.instructorName}</h5>
                <p className="text-xs text-primary font-semibold">{program.organizerName}</p>
                <p className="text-xs text-on-surface-variant leading-relaxed">{program.instructorBio}</p>
              </div>

              {/* Requirement 21: Chat with Trainer */}
              <button
                type="button"
                onClick={onChatWithTrainer}
                className="px-3.5 py-2 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 text-xs font-bold transition-all shrink-0 flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">chat</span>
                <span>{isEn ? 'Chat with Trainer' : 'प्रशिक्षक से चैट'}</span>
              </button>
            </div>
          </div>

          {/* Logistics, Eligibility & Certificate Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-surface-container-low border border-outline-variant/30 space-y-1.5">
              <span className="font-bold text-on-surface block">{isEn ? 'Eligibility & Level:' : 'पात्रता एवं स्तर:'}</span>
              <p className="text-on-surface-variant">{program.eligibility}</p>
              <span className="inline-block px-2 py-0.5 rounded bg-surface-container text-on-surface font-semibold text-[11px]">
                {program.skillLevel}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-surface-container-low border border-outline-variant/30 space-y-1.5">
              <span className="font-bold text-on-surface block">{isEn ? 'Certificate & Includes:' : 'प्रमाण पत्र एवं सुविधाएं:'}</span>
              <p className="text-emerald-800 font-semibold">{program.certificateTitle}</p>
              <p className="text-on-surface-variant text-[11px]">{program.includes}</p>
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="p-4 sm:p-6 bg-surface-container-low border-t border-outline-variant/30 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onToggleSave}
            className="px-4 py-2.5 rounded-xl bg-surface-container text-on-surface font-semibold text-xs hover:bg-surface-container-high transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">
              {isSaved ? 'bookmark_added' : 'bookmark_border'}
            </span>
            <span>{isSaved ? (isEn ? 'Saved' : 'सहेजा गया') : (isEn ? 'Save' : 'सहेजें')}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-on-surface-variant font-semibold text-xs hover:bg-surface-container cursor-pointer"
            >
              {isEn ? 'Close' : 'बंद करें'}
            </button>

            {isRegistered ? (
              <span className="px-5 py-2.5 rounded-xl bg-emerald-500/15 text-emerald-800 font-bold text-xs border border-emerald-500/30 flex items-center gap-1.5">
                <span>✓</span>
                <span>{isEn ? 'Already Registered' : 'पहले से पंजीकृत'}</span>
              </span>
            ) : (
              <button
                type="button"
                onClick={onRegister}
                className="px-6 py-2.5 rounded-xl bg-primary text-white font-bold text-xs hover:bg-primary-container transition-all shadow-md flex items-center gap-1.5 cursor-pointer active:scale-98"
              >
                <span>{isEn ? 'Register Now' : 'अभी नामांकन करें'}</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Requirement 12: Registration Confirmation Modal ──────────────────────────
function RegistrationModal({
  program,
  isEn,
  studentUser,
  onClose,
  onConfirm,
}) {
  const [notes, setNotes] = useState('');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-fade-in">
      <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/40 shadow-2xl max-w-lg w-full my-8 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 bg-surface-container-low border-b border-outline-variant/30 flex items-start justify-between gap-3">
          <div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary border border-primary/20">
              {isEn ? 'Registration Confirmation' : 'पंजीकरण पुष्टि'}
            </span>
            <h3 className="text-lg font-black text-on-surface mt-1">{program.title}</h3>
            <p className="text-xs text-on-surface-variant">
              🗓 {program.dates} • {program.mode} ({program.fee})
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface cursor-pointer shrink-0"
          >
            <span className="material-symbols-outlined text-base">close</span>
          </button>
        </div>

        {/* Body Prefilled Student Details */}
        <div className="p-6 space-y-4 text-xs">
          <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30 space-y-2">
            <span className="font-bold text-primary block uppercase tracking-wider text-[10px]">
              {isEn ? 'Student Profile Information' : 'छात्र प्रोफाइल विवरण'}
            </span>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-on-surface-variant block">{isEn ? 'Full Name:' : 'पूरा नाम:'}</span>
                <span className="font-bold text-on-surface text-sm">{studentUser.name}</span>
              </div>
              <div>
                <span className="text-on-surface-variant block">{isEn ? 'Mobile:' : 'मोबाइल नंबर:'}</span>
                <span className="font-bold text-on-surface">{studentUser.phone}</span>
              </div>
              <div className="col-span-2">
                <span className="text-on-surface-variant block">{isEn ? 'College / University:' : 'कॉलेज / विश्वविद्यालय:'}</span>
                <span className="font-semibold text-on-surface">{studentUser.college}</span>
              </div>
              <div className="col-span-2">
                <span className="text-on-surface-variant block">{isEn ? 'Course & Degree:' : 'पाठ्यक्रम:'}</span>
                <span className="font-semibold text-on-surface">{studentUser.course}</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-on-surface-variant uppercase mb-1">
              {isEn ? 'Any specific learning goal or questions (Optional):' : 'सीखने का उद्देश्य या प्रश्न (वैकल्पिक):'}
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={isEn ? 'e.g. Interested in hydroponic nutrient balancing for my project...' : 'उदा. प्रोजेक्ट के लिए पोषक तत्व प्रबंधन सीखना चाहता हूँ...'}
              className="w-full p-3 rounded-xl bg-surface-container-low border border-outline-variant/40 text-xs text-on-surface focus:outline-none focus:border-primary"
            />
          </div>

          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-900 text-[11px] leading-relaxed">
            {isEn
              ? 'By confirming, your registration seat will be secured. Official joining details will be available in "My Learning".'
              : 'पुष्टि करने पर आपका स्थान सुरक्षित हो जाएगा। सत्र में शामिल होने की जानकारी "मेरा शिक्षण" में उपलब्ध होगी।'}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 bg-surface-container-low border-t border-outline-variant/30 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-on-surface-variant font-semibold text-xs hover:bg-surface-container cursor-pointer"
          >
            {isEn ? 'Cancel' : 'रद्द करें'}
          </button>
          <button
            onClick={() => onConfirm(notes)}
            className="px-6 py-2.5 rounded-xl bg-primary text-white font-bold text-xs hover:bg-primary-container transition-all shadow-md cursor-pointer active:scale-98"
          >
            {isEn ? 'Confirm Registration' : 'पंजीकरण की पुष्टि करें'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Registration Success Modal ───────────────────────────────────────────────
function RegistrationSuccessModal({ program, isEn, onClose, onViewMyLearning }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-fade-in">
      <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/40 shadow-2xl max-w-md w-full my-8 p-6 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-800 flex items-center justify-center mx-auto text-3xl">
          🎉
        </div>
        <div className="space-y-1">
          <h3 className="text-xl font-black text-on-surface">
            {isEn ? 'Registration Successful!' : 'पंजीकरण सफल रहा!'}
          </h3>
          <p className="text-xs text-on-surface-variant">
            {isEn
              ? `You are successfully registered for "${program.title}".`
              : `"${program.title}" के लिए आपका पंजीकरण पूरा हो गया है।`}
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-surface-container-low border border-outline-variant/30 text-xs text-left space-y-1">
          <p><strong>🗓 {isEn ? 'Date:' : 'दिनांक:'}</strong> {program.dates}</p>
          <p><strong>📍 {isEn ? 'Mode & Venue:' : 'माध्यम व स्थान:'}</strong> {program.mode} • {program.location}</p>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={onViewMyLearning}
            className="w-full py-2.5 rounded-xl bg-primary text-white font-bold text-xs hover:bg-primary-container transition-all cursor-pointer"
          >
            {isEn ? 'View My Learning' : 'मेरा शिक्षण देखें'}
          </button>
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-surface-container-high text-on-surface font-semibold text-xs hover:bg-surface-container-highest transition-all cursor-pointer"
          >
            {isEn ? 'Back to Training' : 'अन्य कार्यक्रम'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Requirement 14: Certificate of Completion Modal ─────────────────────────
function CertificateModal({ item, isEn, studentName, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-fade-in">
      <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/40 shadow-2xl max-w-2xl w-full my-8 overflow-hidden flex flex-col">
        {/* Modal Top Bar */}
        <div className="p-4 bg-surface-container-low border-b border-outline-variant/30 flex items-center justify-between">
          <span className="font-bold text-xs text-primary flex items-center gap-1.5">
            <span className="material-symbols-outlined text-base">card_membership</span>
            <span>{isEn ? 'Official Certificate of Completion' : 'आधिकारिक समापन प्रमाण पत्र'}</span>
          </span>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">close</span>
          </button>
        </div>

        {/* Printable Styled Certificate Sheet */}
        <div className="p-8 sm:p-12 bg-amber-50/40 text-stone-900 border-8 border-double border-amber-900/20 m-6 rounded-2xl relative space-y-6 text-center">
          <div className="space-y-1">
            <span className="text-[11px] font-mono tracking-widest uppercase text-amber-900 font-bold block">
              Farmer Helper National Agri-Skills Academy
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-black tracking-tight text-amber-950">
              Certificate of Completion
            </h2>
            <p className="text-xs italic text-stone-600">This is to officially certify that</p>
          </div>

          <div className="py-2 border-b-2 border-amber-900/30 inline-block px-8">
            <h3 className="text-xl sm:text-2xl font-bold font-serif text-primary">{studentName}</h3>
          </div>

          <p className="text-xs sm:text-sm text-stone-700 max-w-lg mx-auto leading-relaxed">
            has successfully completed the practical skill development workshop on
            <strong className="block text-stone-900 text-sm mt-1">{item.trainingTitle}</strong>
          </p>

          <div className="grid grid-cols-3 gap-2 pt-6 text-[10px] text-stone-600 border-t border-amber-900/20">
            <div>
              <span className="block font-bold text-stone-900">{item.issuedDate || item.date}</span>
              <span>Date of Issue</span>
            </div>
            <div>
              <span className="block font-mono font-bold text-primary">{item.certificateId || 'FH-CERT-2026-901'}</span>
              <span>Verification ID</span>
            </div>
            <div>
              <span className="block font-bold text-stone-900">Dr. Suresh Patel</span>
              <span>Director of Academic Training</span>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 sm:p-6 bg-surface-container-low border-t border-outline-variant/30 flex items-center justify-between">
          <span className="text-xs text-on-surface-variant italic">
            {isEn ? 'Digitally verifiable certificate' : 'डिजिटली सत्यापित प्रमाण पत्र'}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-4 py-2 rounded-xl bg-primary text-white font-bold text-xs hover:bg-primary-container flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">print</span>
              <span>{isEn ? 'Print / Download Certificate' : 'प्रमाण पत्र डाउनलोड'}</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-surface-container text-on-surface text-xs font-semibold hover:bg-surface-container-high cursor-pointer"
            >
              {isEn ? 'Close' : 'बंद करें'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
