import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate, useSearchParams, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DashboardSidebar from '../components/dashboard/DashboardSidebar';
import DashboardMobileNav from '../components/dashboard/DashboardMobileNav';
import logoImg from '../assets/logo.png';

import { INITIAL_INTERNSHIPS, INITIAL_APPLICATIONS } from '../data/internshipsData';
import { TRAINING_PROGRAMS } from '../data/trainingData';

// Seeker / Student UI Components (Stitch Visual Design preserved)
import InternshipHero from '../components/internships/InternshipHero';
import InternshipSearch from '../components/internships/InternshipSearch';
import InternshipFilters from '../components/internships/InternshipFilters';
import InternshipCard from '../components/internships/InternshipCard';
import TrainingCard from '../components/internships/TrainingCard';
import InternshipDetailsModal from '../components/internships/InternshipDetailsModal';
import ApplicationModal from '../components/internships/ApplicationModal';
import ApplicationSuccessModal from '../components/internships/ApplicationSuccessModal';
import MyApplicationsModal from '../components/internships/MyApplicationsModal';
import TrainingEnrollModal from '../components/internships/TrainingEnrollModal';

// Farmer / Provider UI Components
import FarmerMyInternshipsView from '../components/internships/FarmerMyInternshipsView';
import PostInternshipModal from '../components/internships/PostInternshipModal';
import FarmerManageApplicationsModal from '../components/internships/FarmerManageApplicationsModal';
import EditInternshipModal from '../components/internships/EditInternshipModal';

// In-App Chat Components & Data
import {
  getStoredConversations,
  saveStoredConversations,
  getOrCreateConversation,
  sendMessageToConversation,
  isUserInConversation,
  CHAT_UPDATE_EVENT
} from '../data/chatData';
import ChatModal from '../components/chat/ChatModal';
import ConversationListModal from '../components/chat/ConversationListModal';

export default function InternshipsPage({ routeView }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id: paramId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const isFarmer = user?.role === 'farmer';
  const isStudent = user?.role === 'student';

  const [lang, setLang] = useState('en');
  const isEn = lang === 'en';
  const [activeNav, setActiveNav] = useState('internships');

  // Master Internships State (Persisted in localStorage)
  const [internships, setInternships] = useState(() => {
    try {
      const stored = localStorage.getItem('farmer_helper_all_internships');
      return stored ? JSON.parse(stored) : INITIAL_INTERNSHIPS;
    } catch {
      return INITIAL_INTERNSHIPS;
    }
  });

  // Master Applications State (Persisted in localStorage for bidirectional Farmer <-> Student sync)
  const [allApplications, setAllApplications] = useState(() => {
    try {
      const stored = localStorage.getItem('farmer_helper_all_applications');
      return stored ? JSON.parse(stored) : INITIAL_APPLICATIONS;
    } catch {
      return INITIAL_APPLICATIONS;
    }
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('farmer_helper_all_internships', JSON.stringify(internships));
    } catch {
      // ignore
    }
  }, [internships]);

  useEffect(() => {
    try {
      localStorage.setItem('farmer_helper_all_applications', JSON.stringify(allApplications));
    } catch {
      // ignore
    }
  }, [allApplications]);

  // Master Chat Conversations State (Persisted in localStorage for Farmer <-> Student communication)
  const [conversations, setConversations] = useState(() => getStoredConversations());
  const [activeChatConversation, setActiveChatConversation] = useState(null);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [isConversationListOpen, setIsConversationListOpen] = useState(false);
  const [openedChatFromList, setOpenedChatFromList] = useState(false);

  useEffect(() => {
    saveStoredConversations(conversations);
  }, [conversations]);

  useEffect(() => {
    const handleSync = () => {
      setConversations(getStoredConversations());
    };
    window.addEventListener(CHAT_UPDATE_EVENT, handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener(CHAT_UPDATE_EVENT, handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  // Handle URL query tabs like ?tab=messages or ?tab=chat or ?chat=id
  useEffect(() => {
    const tab = searchParams.get('tab');
    const chatParam = searchParams.get('chat') || searchParams.get('conversation');
    if (tab === 'messages' || tab === 'chat') {
      setIsConversationListOpen(true);
    } else if (tab === 'applications' && isStudent) {
      setIsMyApplicationsOpen(true);
    }
    if (chatParam) {
      const found = conversations.find(
        (c) => c.id === chatParam || c.internshipId === chatParam
      );
      if (found) {
        setActiveChatConversation(found);
        setIsChatModalOpen(true);
      }
    }
  }, [searchParams, isStudent, conversations]);

  // Handle opening chat from an internship (Student clicking Chat with Farmer)
  const handleOpenChatFromInternship = (internshipItem) => {
    if (!internshipItem) return;
    setOpenedChatFromList(false);
    const targetInternshipId = internshipItem.id || internshipItem.internshipId || 'agro-01';
    const targetFarmerId = internshipItem.ownerId || internshipItem.farmerId || 'user_farmer_01';
    const targetFarmerName = internshipItem.ownerName || internshipItem.farmerName || 'Rajesh Kumar';
    const title = internshipItem.title || internshipItem.internshipTitle || 'Farm Internship';

    const conv = getOrCreateConversation({
      currentUser: user,
      targetUser: {
        id: targetFarmerId,
        name: targetFarmerName,
        role: 'farmer',
        phone: internshipItem.contactPhone || internshipItem.farmerPhone || '9876543210',
        farmName: internshipItem.farmName || internshipItem.organization || `${targetFarmerName} Model Farm`
      },
      context: {
        type: 'internship',
        id: targetInternshipId,
        title: title,
        subtitle: internshipItem.farmName || internshipItem.organization
      },
      initialText: `Namaste ${targetFarmerName}! I am interested in "${title}" on your farm. Could you share details regarding field schedule and joining dates?`
    });

    setConversations(getStoredConversations());
    setActiveChatConversation(conv);
    setIsChatModalOpen(true);
  };

  // Handle opening chat from an applicant (Farmer clicking Chat with Student)
  const handleOpenChatFromApplicant = (applicantItem) => {
    setOpenedChatFromList(false);
    const targetStudentId = applicantItem.studentId || 'user_student_01';
    const targetStudentName = applicantItem.studentName || 'Aman Verma';
    const targetInternshipId = applicantItem.internshipId || 'agro-01';
    const title = applicantItem.internshipTitle || 'Farm Internship';

    const conv = getOrCreateConversation({
      currentUser: user,
      targetUser: {
        id: targetStudentId,
        name: targetStudentName,
        role: 'student',
        phone: applicantItem.studentMobile || '9812345678',
        email: applicantItem.studentEmail || 'student@agri.edu',
        details: {
          course: applicantItem.course,
          college: applicantItem.college
        }
      },
      context: {
        type: 'internship',
        id: targetInternshipId,
        title: title,
        subtitle: applicantItem.farmName
      },
      initialText: `Hello ${targetStudentName}! I reviewed your application for "${title}". Please share more details about your available dates and previous field experience.`
    });

    setConversations(getStoredConversations());
    setActiveChatConversation(conv);
    setIsChatModalOpen(true);
  };

  // Handle sending a message in a conversation
  const handleSendMessage = (conversationId, messageText) => {
    const updated = sendMessageToConversation({
      conversations,
      conversationId,
      senderUser: user,
      text: messageText
    });

    setConversations(updated);
    const updatedConv = updated.find((c) => c.id === conversationId);
    if (updatedConv) {
      setActiveChatConversation(updatedConv);
    }
  };

  // Count relevant user conversations with unread
  const userConversations = useMemo(() => {
    if (!user?.id) return [];
    return conversations.filter((c) => isUserInConversation(c, user.id));
  }, [conversations, user?.id]);

  // Farmer Tab State: 'my-listings' | 'browse' | 'applicants'
  const initialFarmerTab = useMemo(() => {
    if (!isFarmer) return 'browse';
    const viewQuery = searchParams.get('view');
    if (routeView === 'my-listings' || viewQuery === 'my-listings') return 'my-listings';
    if (routeView === 'browse' || viewQuery === 'browse') return 'browse';
    if (viewQuery === 'applicants') return 'applicants';
    return 'my-listings';
  }, [isFarmer, routeView, searchParams]);

  const [farmerActiveTab, setFarmerActiveTab] = useState(initialFarmerTab);

  // Sync tab with search params/routeView if role is farmer
  useEffect(() => {
    if (isFarmer) {
      const viewQuery = searchParams.get('view');
      if (routeView === 'my-listings' || viewQuery === 'my-listings') {
        setFarmerActiveTab('my-listings');
      } else if (viewQuery === 'applicants') {
        setFarmerActiveTab('applicants');
      } else if (viewQuery === 'browse') {
        setFarmerActiveTab('browse');
      }
    }
  }, [isFarmer, routeView, searchParams]);

  // Modals State
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [managingInternship, setManagingInternship] = useState(null);
  const [editingInternship, setEditingInternship] = useState(null);

  // Student Modals State
  const [selectedForDetails, setSelectedForDetails] = useState(null);
  const [selectedForApply, setSelectedForApply] = useState(null);
  const [submittedApplication, setSubmittedApplication] = useState(null);
  const [isMyApplicationsOpen, setIsMyApplicationsOpen] = useState(false);
  const [selectedTrainingForEnroll, setSelectedTrainingForEnroll] = useState(null);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Handle routeView prop actions upon mount / route change
  useEffect(() => {
    if (routeView === 'create' && isFarmer) {
      setIsPostModalOpen(true);
    } else if (routeView === 'manage-applications' && isFarmer && paramId) {
      const target = internships.find((i) => i.id === paramId);
      if (target) {
        if (target.ownerId === user?.id || target.ownerId === 'user_farmer_01' || !target.ownerId) {
          setManagingInternship(target);
        } else {
          alert('You can only manage student applications for internships hosted on your own farm.');
          navigate('/internships/my-listings');
        }
      }
    } else if (routeView === 'apply' && isStudent && paramId) {
      const target = internships.find((i) => i.id === paramId);
      if (target) {
        setSelectedForApply(target);
      }
    } else if (routeView === 'my-applications' && isStudent) {
      setIsMyApplicationsOpen(true);
    }
  }, [routeView, isFarmer, isStudent, paramId, internships, user?.id, navigate]);

  // Handle URL query parameters (e.g. ?action=post or ?tab=applications)
  useEffect(() => {
    if (isFarmer && searchParams.get('action') === 'post') {
      setIsPostModalOpen(true);
    }
    if (isStudent && (searchParams.get('tab') === 'applications' || searchParams.get('view') === 'my-applications')) {
      setIsMyApplicationsOpen(true);
    }
    if (searchParams.get('filter') === 'training') {
      setActiveQuickChip('training');
    }
  }, [searchParams, isFarmer, isStudent]);

  // Saved / Bookmarked state persisted in localStorage
  const [savedIds, setSavedIds] = useState(() => {
    try {
      const stored = localStorage.getItem('farmer_helper_saved_internships');
      return stored ? JSON.parse(stored) : ['agro-01'];
    } catch {
      return ['agro-01'];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('farmer_helper_saved_internships', JSON.stringify(savedIds));
    } catch {
      // ignore
    }
  }, [savedIds]);

  const handleToggleSave = (id) => {
    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Student's personal applications: filtered from master `allApplications`
  const studentApplications = useMemo(() => {
    if (!user) return allApplications;
    return allApplications.filter(
      (app) => app.studentId === user.id || app.studentEmail === user.email || !app.studentId
    );
  }, [allApplications, user]);

  // Farmer's owned listings
  const farmerOwnedListings = useMemo(() => {
    return internships.filter(
      (item) => item.ownerId === user?.id || item.ownerId === 'user_farmer_01' || (!item.ownerId && isFarmer)
    );
  }, [internships, user?.id, isFarmer]);

  // All applications submitted to this farmer's listings
  const farmerReceivedApplications = useMemo(() => {
    const ownedIds = new Set(farmerOwnedListings.map((l) => l.id));
    return allApplications.filter((app) => ownedIds.has(app.internshipId) || app.ownerId === user?.id || app.ownerId === 'user_farmer_01');
  }, [allApplications, farmerOwnedListings, user?.id]);

  // Search & Filter State (Student / Browse View)
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [activeQuickChip, setActiveQuickChip] = useState('all');

  const [selectedTypes, setSelectedTypes] = useState(['Internship', 'Training Workshop']);
  const [selectedDomains, setSelectedDomains] = useState([]);
  const [selectedStipendRange, setSelectedStipendRange] = useState('all');
  const [selectedDuration, setSelectedDuration] = useState('all');
  const [selectedModes, setSelectedModes] = useState([]);
  const [selectedPerks, setSelectedPerks] = useState([]);

  const [sortBy, setSortBy] = useState('relevant');
  const [viewMode, setViewMode] = useState('list');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedLocation('');
    setActiveQuickChip('all');
    setSelectedTypes([]);
    setSelectedDomains([]);
    setSelectedStipendRange('all');
    setSelectedDuration('all');
    setSelectedModes([]);
    setSelectedPerks([]);
    setCurrentPage(1);
  };

  // Filter & Search Logic for Browse Feed
  const filteredInternships = useMemo(() => {
    return internships.filter((item) => {
      // In browse feed, do not show closed listings
      if (item.status === 'Closed') return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const fullText = `${item.title} ${item.organization || ''} ${item.farmName || ''} ${item.location || ''} ${item.domain || item.category || ''} ${(item.skills || []).join(' ')}`.toLowerCase();
        if (!fullText.includes(q)) return false;
      }

      // Location filter
      if (selectedLocation && selectedLocation !== 'All North India') {
        if (!item.location?.toLowerCase().includes(selectedLocation.toLowerCase().split('&')[0].trim().toLowerCase())) {
          return false;
        }
      }

      // Quick Chips Filter
      if (activeQuickChip === 'paid' && item.stipend <= 0) return false;
      if (activeQuickChip === 'training' && item.type !== 'Training Workshop' && item.type !== 'Field Apprenticeship') return false;
      if (activeQuickChip === 'duration-1-3' && item.durationCategory !== '1-3 Mos') return false;
      if (activeQuickChip === 'accommodation' && !item.perks?.includes('Free Accommodation')) return false;
      if (activeQuickChip === 'saved' && !savedIds.includes(item.id)) return false;

      // Opportunity Type Filter
      if (selectedTypes.length > 0 && item.type && !selectedTypes.includes(item.type)) {
        return false;
      }

      // Domain Filter
      if (selectedDomains.length > 0 && !selectedDomains.includes(item.domain)) {
        return false;
      }

      // Stipend Range Filter
      if (selectedStipendRange === 'paid-6k' && item.stipend < 6000) return false;
      if (selectedStipendRange === 'paid-10k' && item.stipend < 10000) return false;
      if (selectedStipendRange === 'bonus' && !item.stipendPerks?.toLowerCase().includes('bonus') && !item.perks?.includes('Pre-placement Offer (PPO)')) return false;

      // Duration Filter
      if (selectedDuration !== 'all' && item.durationCategory !== selectedDuration) {
        return false;
      }

      // Work Mode Filter
      if (selectedModes.length > 0 && !selectedModes.includes(item.workMode)) {
        return false;
      }

      // Perks Filter
      if (selectedPerks.length > 0) {
        const hasAllPerks = selectedPerks.every((p) => item.perks?.includes(p));
        if (!hasAllPerks) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'stipend-high') {
        return (b.stipend || 0) - (a.stipend || 0);
      }
      if (sortBy === 'deadline-soon') {
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      }
      if (sortBy === 'newest') {
        return b.id.localeCompare(a.id);
      }
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return 0;
    });
  }, [
    internships,
    searchQuery,
    selectedLocation,
    activeQuickChip,
    selectedTypes,
    selectedDomains,
    selectedStipendRange,
    selectedDuration,
    selectedModes,
    selectedPerks,
    sortBy,
    savedIds
  ]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredInternships.length]);

  const totalPages = Math.ceil(filteredInternships.length / itemsPerPage) || 1;
  const paginatedInternships = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredInternships.slice(start, start + itemsPerPage);
  }, [filteredInternships, currentPage]);

  // ══════════════════════════════════════════════════
  // FARMER ACTIONS (Post, Edit, Close, Delete, Status Update)
  // ══════════════════════════════════════════════════

  // 1. Post New Internship (Farmer)
  const handlePostInternship = (newListing) => {
    const fullListing = {
      ...newListing,
      ownerId: user?.id || 'user_farmer_01',
      ownerName: user?.name || 'Rajesh Kumar',
      ownerRole: 'farmer',
      farmName: newListing.farmName || `${user?.name || 'Kisan'} Model Farm`,
      status: 'Active',
      applicantsCount: 0,
    };

    setInternships((prev) => [fullListing, ...prev]);
    setIsPostModalOpen(false);
    setFarmerActiveTab('my-listings');
  };

  // 2. Edit Internship (Farmer)
  const handleSaveEditedInternship = (updated) => {
    if (updated.ownerId && updated.ownerId !== user?.id && user?.id !== 'user_farmer_01') {
      alert(isEn ? 'Permission denied. You can only edit internships from your own farm.' : 'अनुमति अस्वीकृत। आप केवल अपने खेत की इंटर्नशिप संपादित कर सकते हैं।');
      return;
    }
    setInternships((prev) =>
      prev.map((item) => (item.id === updated.id ? { ...item, ...updated } : item))
    );
    setEditingInternship(null);
  };

  // 3. Toggle Status (Active <-> Closed) (Farmer)
  const handleToggleListingStatus = (id) => {
    setInternships((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          if (item.ownerId && item.ownerId !== user?.id && user?.id !== 'user_farmer_01') {
            alert(isEn ? 'Permission denied.' : 'अनुमति अस्वीकृत।');
            return item;
          }
          const nextStatus = item.status === 'Closed' ? 'Active' : 'Closed';
          return { ...item, status: nextStatus };
        }
        return item;
      })
    );
  };

  // 4. Delete Listing (Farmer)
  const handleDeleteListing = (id) => {
    const target = internships.find((i) => i.id === id);
    if (target && target.ownerId && target.ownerId !== user?.id && user?.id !== 'user_farmer_01') {
      alert(isEn ? 'Permission denied. You can only delete your own listings.' : 'अनुमति अस्वीकृत। आप केवल अपनी सूची हटा सकते हैं।');
      return;
    }
    setInternships((prev) => prev.filter((item) => item.id !== id));
  };

  // 5. Update Applicant Status (Farmer updates Student application)
  const handleUpdateApplicationStatus = (appId, newStatus, feedbackNote) => {
    setAllApplications((prev) =>
      prev.map((app) => {
        if (app.id === appId) {
          return {
            ...app,
            status: newStatus,
            nextStep: feedbackNote || `Application marked as ${newStatus} by farm host.`,
            lastUpdated: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
          };
        }
        return app;
      })
    );
  };

  // ══════════════════════════════════════════════════
  // STUDENT ACTIONS (Apply to Internship)
  // ══════════════════════════════════════════════════
  const handleApplicationSuccess = (newApp) => {
    const applicationRecord = {
      ...newApp,
      studentId: user?.id || 'user_student_01',
      studentName: newApp.fullName || user?.name || 'Aman Verma',
      studentEmail: newApp.email || user?.email || 'aman.verma@agriuni.ac.in',
      studentMobile: newApp.mobile || user?.phone || '9812345678',
      ownerId: selectedForApply?.ownerId || 'user_farmer_01',
      ownerName: selectedForApply?.ownerName || 'Rajesh Kumar',
      farmName: selectedForApply?.farmName || selectedForApply?.organization || 'Kisan Model Farm',
      internshipId: selectedForApply?.id,
      internshipTitle: selectedForApply?.title,
      location: selectedForApply?.location,
      status: 'Submitted',
      appliedDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
    };

    setAllApplications((prev) => [applicationRecord, ...prev]);

    // Increment applicants counter on the internship
    if (selectedForApply?.id) {
      setInternships((prev) =>
        prev.map((item) =>
          item.id === selectedForApply.id
            ? { ...item, applicantsCount: (item.applicantsCount || 0) + 1 }
            : item
        )
      );
    }

    setSelectedForApply(null);
    setSubmittedApplication(applicationRecord);
  };

  // Farmer Applicant Status Filter for the "applicants" tab
  const [applicantFilterStatus, setApplicantFilterStatus] = useState('all');
  const filteredFarmerApplicants = useMemo(() => {
    if (applicantFilterStatus === 'all') return farmerReceivedApplications;
    return farmerReceivedApplications.filter(
      (a) => a.status.toLowerCase() === applicantFilterStatus.toLowerCase()
    );
  }, [farmerReceivedApplications, applicantFilterStatus]);

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col lg:flex-row font-sans selection:bg-primary-container selection:text-white">
      
      {/* Desktop Sticky Sidebar Navigation */}
      <DashboardSidebar
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        lang={lang}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-24 lg:pb-12">
        
        {/* Stitch-style Top Header */}
        <header className="sticky top-0 z-40 h-20 bg-surface/90 backdrop-blur-xl border-b border-outline-variant/30 shadow-xs flex items-center justify-between px-4 sm:px-6 lg:px-8 gap-4">
          
          {/* Mobile Logo & Title */}
          <div className="flex items-center gap-2.5 lg:hidden shrink-0">
            <Link to="/" className="flex items-center gap-2">
              <img src={logoImg} alt="Logo" className="h-7 w-auto rounded-md object-contain" />
              <span className="font-display-lg text-base sm:text-lg font-bold text-primary">
                Farmer Helper
              </span>
            </Link>
          </div>

          {/* Search Input on Desktop Header (Browse Mode) */}
          <div className="hidden lg:flex flex-1 max-w-xl">
            <div className="relative flex items-center w-full">
              <span className="material-symbols-outlined absolute left-4 text-outline text-[20px]">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  isFarmer
                    ? (isEn ? "Search internships, domains, or skills..." : "इंटर्नशिप, कौशल या विषय खोजें...")
                    : (isEn ? "Search internships, training, skills, locations..." : "इंटर्नशिप, प्रशिक्षण, कौशल या स्थान खोजें...")
                }
                className="w-full pl-11 pr-4 py-2.5 bg-surface-container-lowest rounded-xl font-body-md text-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/20 border border-outline-variant/30 shadow-xs transition-all"
              />
            </div>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Location Pill */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-surface-container-low rounded-xl text-on-surface-variant font-label-md text-xs border border-outline-variant/30">
              <span className="material-symbols-outlined text-primary text-[18px]">location_on</span>
              <span>{user?.location || 'Meerut, UP'}</span>
            </div>

            {/* Language Switcher */}
            <div className="flex items-center bg-surface-container-low rounded-xl p-0.5 border border-outline-variant/30 text-xs">
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`px-2.5 py-1 rounded-lg font-label-md font-semibold transition-all ${
                  lang === 'en'
                    ? 'bg-surface-container-lowest text-primary shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setLang('hi')}
                className={`px-2.5 py-1 rounded-lg font-label-md font-semibold transition-all ${
                  lang === 'hi'
                    ? 'bg-surface-container-lowest text-primary shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                हिंदी
              </button>
            </div>

            {/* FARMER QUICK ACTION: Post Internship Header Button */}
            {isFarmer && (
              <button
                type="button"
                onClick={() => setIsPostModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-primary text-white font-label-md text-xs font-bold hover:bg-primary-container shadow-xs active:scale-95 transition-all cursor-pointer"
                title="Post a practical training or internship opportunity on your farm"
              >
                <span className="material-symbols-outlined text-[18px]">add_circle</span>
                <span className="hidden sm:inline">{isEn ? 'Post Internship' : 'इंटर्नशिप पोस्ट करें'}</span>
              </button>
            )}

            {/* STUDENT QUICK ACTION: My Applications Modal Button */}
            {isStudent && (
              <button
                type="button"
                onClick={() => setIsMyApplicationsOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-xs font-semibold border border-outline-variant/30 transition-colors"
                title="View my submitted applications"
              >
                <span className="material-symbols-outlined text-primary text-[18px]">folder_shared</span>
                <span className="hidden md:inline">{isEn ? 'My Applications' : 'मेरे आवेदन'}</span>
                <span className="bg-primary text-on-primary font-bold px-1.5 py-0.2 rounded-full text-[10px]">
                  {studentApplications.length}
                </span>
              </button>
            )}

            {/* IN-APP CHAT & CONVERSATIONS BUTTON */}
            <button
              type="button"
              onClick={() => setIsConversationListOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-xs font-semibold border border-outline-variant/30 transition-colors cursor-pointer"
              title={isEn ? "Open in-app conversations & chat" : "इन-ऐप चैट और संदेश देखें"}
            >
              <span className="material-symbols-outlined text-primary text-[18px]">chat</span>
              <span className="hidden md:inline">{isEn ? 'Messages' : 'चैट संदेश'}</span>
              <span className="bg-primary text-on-primary font-bold px-1.5 py-0.2 rounded-full text-[10px]">
                {userConversations.length}
              </span>
            </button>

            <div className="h-6 w-px bg-surface-container-high mx-1 hidden sm:block"></div>

            {/* User Avatar */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                {user?.initials || (isFarmer ? 'RK' : 'AV')}
              </div>
              <div className="hidden xl:flex flex-col text-left">
                <span className="font-label-md text-xs font-bold text-on-surface leading-tight">
                  {user?.name || (isFarmer ? 'Rajesh Kumar' : 'Aman Verma')}
                </span>
                <span className="font-caption text-[11px] text-on-surface-variant leading-tight">
                  {isFarmer ? (isEn ? 'Farm Host / Provider' : 'किसान / प्रशिक्षण प्रदाता') : (user?.details?.course || 'Agri Student')}
                </span>
              </div>
            </div>
          </div>

        </header>

        {/* Master Content Body */}
        <main className="w-full flex-1 px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col w-full space-y-6">
            
            {/* ══════════════════════════════════════════════════
                FARMER ROLE NAVIGATION TABS & PROVIDER BANNER
               ══════════════════════════════════════════════════ */}
            {isFarmer && (
              <div className="bg-surface-container-lowest p-4 sm:p-5 rounded-3xl border border-outline-variant/30 shadow-2xs space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-primary/10 text-primary">
                      <span className="material-symbols-outlined text-xs">agriculture</span>
                      <span>{isEn ? 'Farm Internship & Training Provider Hub' : 'फार्म इंटर्नशिप एवं प्रशिक्षण प्रदाता केंद्र'}</span>
                    </div>
                    <h1 className="text-xl sm:text-2xl font-bold text-on-surface">
                      {isEn ? 'Host Agriculture Internships on Your Farm' : 'अपने खेत पर कृषि इंटर्नशिप व प्रशिक्षण आयोजित करें'}
                    </h1>
                    <p className="text-xs sm:text-sm text-on-surface-variant">
                      {isEn
                        ? 'Empower agricultural college students with practical field skills while getting qualified hands for your crops.'
                        : 'कृषि छात्रों को व्यावहारिक फील्ड अनुभव दें और अपने खेत के लिए प्रशिक्षित मानव संसाधन पाएं।'}
                    </p>
                  </div>

                  {/* Big Post Internship CTA Button */}
                  <button
                    onClick={() => setIsPostModalOpen(true)}
                    className="px-5 py-2.5 rounded-2xl bg-primary text-white font-bold text-xs sm:text-sm hover:bg-primary-container active:scale-95 transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer shrink-0"
                  >
                    <span className="material-symbols-outlined text-lg">add_circle</span>
                    <span>{isEn ? 'Post New Farm Internship' : 'नया प्रशिक्षण / इंटर्नशिप जोड़ें'}</span>
                  </button>
                </div>

                {/* Role-Specific View Tabs */}
                <div className="flex items-center gap-2 border-t border-outline-variant/20 pt-3 overflow-x-auto">
                  <button
                    type="button"
                    onClick={() => setFarmerActiveTab('my-listings')}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                      farmerActiveTab === 'my-listings'
                        ? 'bg-primary text-white shadow-xs'
                        : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    <span className="material-symbols-outlined text-base">inventory_2</span>
                    <span>{isEn ? 'My Farm Listings' : 'मेरी खेत सूचियां'}</span>
                    <span className={`px-2 py-0.2 rounded-full text-[11px] ${
                      farmerActiveTab === 'my-listings' ? 'bg-white/20 text-white' : 'bg-surface-container text-on-surface-variant'
                    }`}>
                      {farmerOwnedListings.length}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFarmerActiveTab('applicants')}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                      farmerActiveTab === 'applicants'
                        ? 'bg-primary text-white shadow-xs'
                        : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    <span className="material-symbols-outlined text-base">groups</span>
                    <span>{isEn ? 'Review Student Applicants' : 'छात्र आवेदक देखें'}</span>
                    <span className={`px-2 py-0.2 rounded-full text-[11px] ${
                      farmerActiveTab === 'applicants' ? 'bg-white/20 text-white' : 'bg-primary/10 text-primary font-bold'
                    }`}>
                      {farmerReceivedApplications.length}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFarmerActiveTab('browse')}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                      farmerActiveTab === 'browse'
                        ? 'bg-primary text-white shadow-xs'
                        : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    <span className="material-symbols-outlined text-base">travel_explore</span>
                    <span>{isEn ? 'Browse All Opportunities' : 'सभी अवसर देखें'}</span>
                    <span className={`px-2 py-0.2 rounded-full text-[11px] ${
                      farmerActiveTab === 'browse' ? 'bg-white/20 text-white' : 'bg-surface-container text-on-surface-variant'
                    }`}>
                      {internships.length}
                    </span>
                  </button>
                </div>
              </div>
            )}

            {/* ══════════════════════════════════════════════════
                TAB VIEW: FARMER MY LISTINGS
               ══════════════════════════════════════════════════ */}
            {isFarmer && farmerActiveTab === 'my-listings' && (
              <FarmerMyInternshipsView
                internships={internships}
                applications={allApplications}
                onOpenPostModal={() => setIsPostModalOpen(true)}
                onOpenEditModal={(item) => setEditingInternship(item)}
                onOpenManageApplications={(item) => setManagingInternship(item)}
                onToggleStatus={handleToggleListingStatus}
                onDeleteListing={handleDeleteListing}
                onViewDetails={(item) => setSelectedForDetails(item)}
                lang={lang}
              />
            )}

            {/* ══════════════════════════════════════════════════
                TAB VIEW: FARMER APPLICANTS DIRECT MANAGEMENT
               ══════════════════════════════════════════════════ */}
            {isFarmer && farmerActiveTab === 'applicants' && (
              <div className="space-y-6">
                <div className="bg-surface-container-lowest p-5 rounded-3xl border border-outline-variant/30 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-on-surface flex items-center gap-2">
                      <span>{isEn ? 'All Student Applicants' : 'सभी छात्र आवेदक'}</span>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-bold">
                        {farmerReceivedApplications.length} {isEn ? 'Total' : 'कुल'}
                      </span>
                    </h2>
                    <p className="text-xs text-on-surface-variant mt-0.5">
                      {isEn
                        ? 'Evaluate student candidate profiles, resumes, and update application statuses.'
                        : 'छात्र उम्मीदवारों के प्रोफाइल, बायोडाटा देखें और आवेदन की स्थिति अपडेट करें।'}
                    </p>
                  </div>

                  {/* Status filter tabs */}
                  <div className="flex flex-wrap items-center bg-surface-container-low p-1 rounded-xl text-xs font-semibold gap-1">
                    {['all', 'Submitted', 'Under Review', 'Shortlisted', 'Interview', 'Selected', 'Rejected'].map((st) => (
                      <button
                        key={st}
                        onClick={() => setApplicantFilterStatus(st)}
                        className={`px-2.5 py-1 rounded-lg transition-all capitalize ${
                          applicantFilterStatus.toLowerCase() === st.toLowerCase()
                            ? 'bg-surface-container-lowest text-primary shadow-xs font-bold'
                            : 'text-on-surface-variant hover:text-on-surface'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Applicants Cards */}
                {filteredFarmerApplicants.length === 0 ? (
                  <div className="bg-surface-container-lowest p-12 rounded-3xl border border-outline-variant/30 text-center space-y-3">
                    <span className="material-symbols-outlined text-4xl text-outline">group_off</span>
                    <h3 className="text-base font-bold text-on-surface">
                      {isEn ? 'No applicants in this category' : 'इस श्रेणी में कोई आवेदक नहीं'}
                    </h3>
                    <p className="text-xs text-on-surface-variant">
                      {isEn
                        ? 'Students applying to your farm listings will be shown here.'
                        : 'आपके खेत की इंटर्नशिप के लिए आवेदन करने वाले छात्र यहाँ दिखेंगे।'}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredFarmerApplicants.map((app) => (
                      <div
                        key={app.id}
                        className="bg-surface-container-lowest p-5 rounded-3xl border border-outline-variant/30 shadow-2xs space-y-4 hover:border-primary/40 transition-all flex flex-col justify-between"
                      >
                        <div className="space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h3 className="font-bold text-base text-on-surface">{app.studentName}</h3>
                              <p className="text-xs text-primary font-semibold">{app.course} • {app.yearOfStudy || 'Undergraduate'}</p>
                              <p className="text-xs text-on-surface-variant">{app.college} • {app.location}</p>
                              
                              {/* Student Direct Contact with Chat */}
                              <div className="flex flex-wrap items-center gap-2 pt-1.5 text-xs">
                                <a
                                  href={`tel:${app.studentMobile || '9812345678'}`}
                                  className="font-semibold text-primary hover:underline flex items-center gap-1"
                                >
                                  <span className="material-symbols-outlined text-xs">call</span>
                                  <span>+91 {app.studentMobile || '98123 45678'}</span>
                                </a>
                                <span className="text-outline">•</span>
                                <span className="text-on-surface-variant font-medium flex items-center gap-1">
                                  <span className="material-symbols-outlined text-xs">mail</span>
                                  <span>{app.studentEmail || 'student@agri.edu'}</span>
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleOpenChatFromApplicant(app)}
                                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary font-bold text-[11px] border border-primary/25 cursor-pointer transition-colors shadow-2xs"
                                  title={isEn ? `Chat with ${app.studentName}` : 'छात्र से चैट करें'}
                                >
                                  <span className="material-symbols-outlined text-[13px]">chat</span>
                                  <span>{isEn ? 'Chat' : 'चैट'}</span>
                                </button>
                              </div>
                            </div>

                            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20 shrink-0">
                              {app.status}
                            </span>
                          </div>

                          <div className="p-3 bg-surface-container-low rounded-2xl text-xs space-y-1.5">
                            <div className="flex items-center justify-between text-on-surface-variant font-medium">
                              <span>Applied for: <strong>{app.internshipTitle}</strong></span>
                              <span className="text-[11px] text-outline">{app.appliedDate}</span>
                            </div>
                            {app.skills && (
                              <p className="text-on-surface-variant truncate">
                                <strong>Skills:</strong> {app.skills}
                              </p>
                            )}
                            {app.coverLetter && (
                              <p className="text-on-surface-variant line-clamp-2 italic text-[11px]">
                                "{app.coverLetter}"
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Status update selector & Resume and Chat action */}
                        <div className="pt-2 border-t border-outline-variant/20 flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5 text-xs">
                            <span className="text-on-surface-variant font-medium">Update Status:</span>
                            <select
                              value={app.status}
                              onChange={(e) => handleUpdateApplicationStatus(app.id, e.target.value)}
                              className="px-2.5 py-1 rounded-lg bg-surface-container border border-outline-variant/40 font-semibold text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                            >
                              <option value="Submitted">Submitted</option>
                              <option value="Under Review">Under Review</option>
                              <option value="Shortlisted">Shortlisted</option>
                              <option value="Interview">Interview</option>
                              <option value="Selected">Selected</option>
                              <option value="Rejected">Rejected</option>
                            </select>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => alert(`Opening student resume: ${app.resumeName || 'Resume.pdf'}`)}
                              className="px-3 py-1 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold flex items-center gap-1 transition-colors"
                            >
                              <span className="material-symbols-outlined text-sm">description</span>
                              <span>{app.resumeName ? 'View Resume' : 'Resume'}</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleOpenChatFromApplicant(app)}
                              className="px-3 py-1 rounded-xl bg-primary text-white text-xs font-bold flex items-center gap-1 hover:bg-primary-container transition-colors shadow-2xs cursor-pointer"
                              title={isEn ? `Open direct chat with ${app.studentName}` : 'छात्र से इन-ऐप चैट करें'}
                            >
                              <span className="material-symbols-outlined text-sm">chat</span>
                              <span>{isEn ? 'Chat' : 'चैट'}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ══════════════════════════════════════════════════
                BROWSE / SEEKER OPPORTUNITIES FEED (Students & Farmers)
               ══════════════════════════════════════════════════ */}
            {(!isFarmer || farmerActiveTab === 'browse') && (
              <>
                {/* Hero Section (Only shown to Students or when Farmer explores) */}
                {isStudent && (
                  <InternshipHero
                    onExploreInternships={() => {
                      const el = document.getElementById('feed');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    onViewWorkshops={() => {
                      const el = document.getElementById('workshops');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                  />
                )}

                {/* Comprehensive Search & Filter Control Bar */}
                <InternshipSearch
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  selectedLocation={selectedLocation}
                  setSelectedLocation={setSelectedLocation}
                  activeQuickChip={activeQuickChip}
                  setActiveQuickChip={setActiveQuickChip}
                  totalResults={filteredInternships.length}
                  sortBy={sortBy}
                  setSortBy={setSortBy}
                  viewMode={viewMode}
                  setViewMode={setViewMode}
                  onOpenMobileFilters={() => setIsMobileFiltersOpen(true)}
                  savedCount={savedIds.length}
                />

                {/* Two-Column Layout (Filters Sidebar & Opportunity Feed) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start" id="feed">
                  
                  {/* Left Column: Filters Sidebar (Desktop) */}
                  <div className="hidden lg:block lg:col-span-4 xl:col-span-3 sticky top-24">
                    <InternshipFilters
                      selectedTypes={selectedTypes}
                      toggleType={(t) =>
                        setSelectedTypes((prev) =>
                          prev.includes(t) ? prev.filter((item) => item !== t) : [...prev, t]
                        )
                      }
                      selectedDomains={selectedDomains}
                      toggleDomain={(d) =>
                        setSelectedDomains((prev) =>
                          prev.includes(d) ? prev.filter((item) => item !== d) : [...prev, d]
                        )
                      }
                      selectedStipendRange={selectedStipendRange}
                      setSelectedStipendRange={setSelectedStipendRange}
                      selectedDuration={selectedDuration}
                      setSelectedDuration={setSelectedDuration}
                      selectedModes={selectedModes}
                      toggleMode={(m) =>
                        setSelectedModes((prev) =>
                          prev.includes(m) ? prev.filter((item) => item !== m) : [...prev, m]
                        )
                      }
                      selectedPerks={selectedPerks}
                      togglePerk={(p) =>
                        setSelectedPerks((prev) =>
                          prev.includes(p) ? prev.filter((item) => item !== p) : [...prev, p]
                        )
                      }
                      onResetFilters={handleResetFilters}
                    />
                  </div>

                  {/* Mobile Filters Drawer */}
                  {isMobileFiltersOpen && (
                    <InternshipFilters
                      isMobileDrawer={true}
                      onCloseMobileDrawer={() => setIsMobileFiltersOpen(false)}
                      selectedTypes={selectedTypes}
                      toggleType={(t) =>
                        setSelectedTypes((prev) =>
                          prev.includes(t) ? prev.filter((item) => item !== t) : [...prev, t]
                        )
                      }
                      selectedDomains={selectedDomains}
                      toggleDomain={(d) =>
                        setSelectedDomains((prev) =>
                          prev.includes(d) ? prev.filter((item) => item !== d) : [...prev, d]
                        )
                      }
                      selectedStipendRange={selectedStipendRange}
                      setSelectedStipendRange={setSelectedStipendRange}
                      selectedDuration={selectedDuration}
                      setSelectedDuration={setSelectedDuration}
                      selectedModes={selectedModes}
                      toggleMode={(m) =>
                        setSelectedModes((prev) =>
                          prev.includes(m) ? prev.filter((item) => item !== m) : [...prev, m]
                        )
                      }
                      selectedPerks={selectedPerks}
                      togglePerk={(p) =>
                        setSelectedPerks((prev) =>
                          prev.includes(p) ? prev.filter((item) => item !== p) : [...prev, p]
                        )
                      }
                      onResetFilters={handleResetFilters}
                    />
                  )}

                  {/* Right Column: Opportunity Feed (8-9 cols) */}
                  <div className="lg:col-span-8 xl:col-span-9 space-y-5">
                    
                    {filteredInternships.length === 0 ? (
                      /* Empty Search Results State */
                      <div className="p-8 sm:p-12 rounded-3xl bg-surface-container-lowest border border-outline-variant/30 text-center space-y-4 shadow-sm">
                        <div className="w-16 h-16 rounded-2xl bg-surface-container-low text-outline flex items-center justify-center mx-auto">
                          <span className="material-symbols-outlined text-4xl">search_off</span>
                        </div>
                        <div className="space-y-1">
                          <h3 className="font-headline-md text-lg sm:text-xl font-bold text-on-surface">
                            {isEn ? 'No internships found' : 'कोई इंटर्नशिप नहीं मिली'}
                          </h3>
                          <p className="font-body-md text-xs sm:text-sm text-on-surface-variant max-w-md mx-auto">
                            {isEn
                              ? 'Try changing your search terms or clearing some filters to see more agricultural opportunities.'
                              : 'अधिक कृषि अवसर देखने के लिए फ़िल्टर बदलें या खोज शब्द रीसेट करें।'}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={handleResetFilters}
                          className="px-6 py-2.5 rounded-xl bg-primary text-on-primary font-label-md text-sm font-semibold hover:bg-primary-container transition-colors shadow-xs"
                        >
                          {isEn ? 'Clear All Filters' : 'सभी फ़िल्टर साफ़ करें'}
                        </button>
                      </div>
                    ) : (
                      <>
                        {/* Cards Container: Grid vs List */}
                        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-5' : 'space-y-5'}>
                          {paginatedInternships.map((internship) => (
                            <InternshipCard
                              key={internship.id}
                              internship={internship}
                              isSaved={savedIds.includes(internship.id)}
                              onToggleSave={handleToggleSave}
                              onViewDetails={(item) => setSelectedForDetails(item)}
                              onApply={(item) => setSelectedForApply(item)}
                              onManageListing={(item) => setManagingInternship(item)}
                              onOpenChat={handleOpenChatFromInternship}
                            />
                          ))}
                        </div>

                        {/* Pagination Controls */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-outline-variant/20">
                          <span className="font-caption text-xs text-on-surface-variant">
                            {isEn ? 'Showing' : 'दिखा रहे हैं'} {(currentPage - 1) * itemsPerPage + 1}-
                            {Math.min(currentPage * itemsPerPage, filteredInternships.length)} {isEn ? 'of' : 'कुल'} {filteredInternships.length} {isEn ? 'opportunities' : 'अवसर'}
                          </span>

                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                              disabled={currentPage === 1}
                              className="px-3.5 py-2 rounded-xl bg-surface-container-lowest font-label-md text-xs font-semibold text-on-surface-variant hover:bg-surface-container shadow-2xs border border-outline-variant/30 disabled:opacity-40 transition-colors"
                            >
                              {isEn ? 'Previous' : 'पिछला'}
                            </button>

                            {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((num) => (
                              <button
                                key={num}
                                type="button"
                                onClick={() => setCurrentPage(num)}
                                className={`w-9 h-9 rounded-xl font-label-md text-xs font-semibold flex items-center justify-center transition-all ${
                                  currentPage === num
                                    ? 'bg-primary text-on-primary shadow-xs'
                                    : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container border border-outline-variant/30 shadow-2xs'
                                }`}
                              >
                                {num}
                              </button>
                            ))}

                            <button
                              type="button"
                              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                              disabled={currentPage === totalPages}
                              className="px-3.5 py-2 rounded-xl bg-surface-container-lowest font-label-md text-xs font-semibold text-on-surface hover:bg-surface-container shadow-2xs border border-outline-variant/30 disabled:opacity-40 transition-colors"
                            >
                              {isEn ? 'Next' : 'अगला'}
                            </button>
                          </div>
                        </div>
                      </>
                    )}

                  </div>
                </div>

                {/* Featured Hands-on Training Programs Section */}
                <section className="space-y-4 pt-6" id="workshops">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-outline-variant/30 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-secondary text-[24px]">workspace_premium</span>
                        <h2 className="font-headline-md text-lg sm:text-xl font-bold text-on-surface">
                          {isEn ? 'Featured Hands-on Training & Certification Bootcamps' : 'प्रमुख व्यावहारिक प्रशिक्षण व प्रमाणन कार्यक्रम'}
                        </h2>
                      </div>
                      <p className="font-body-md text-xs sm:text-sm text-on-surface-variant">
                        लघु अवधि के व्यावहारिक प्रशिक्षण कार्यक्रम (Short-term certified masterclasses with field visits)
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveQuickChip('training')}
                      className="font-label-md text-xs sm:text-sm text-primary font-semibold hover:underline flex items-center gap-1 cursor-pointer self-start sm:self-auto"
                    >
                      <span>{isEn ? 'View all programs' : 'सभी कार्यक्रम देखें'}</span>
                      <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                    </button>
                  </div>

                  {/* Training Programs Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {TRAINING_PROGRAMS.map((prog) => (
                      <TrainingCard
                        key={prog.id}
                        program={prog}
                        onEnroll={(p) => setSelectedTrainingForEnroll(p)}
                      />
                    ))}
                  </div>
                </section>
              </>
            )}

          </div>
        </main>

      </div>

      {/* Mobile Sticky Bottom Navigation */}
      <DashboardMobileNav
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        lang={lang}
      />

      {/* ══════════════════════════════════════════════════
          MODALS & DIALOGS
         ══════════════════════════════════════════════════ */}

      {/* 1. Farmer: Post Internship / Training Modal */}
      {isFarmer && (
        <PostInternshipModal
          isOpen={isPostModalOpen}
          onClose={() => setIsPostModalOpen(false)}
          onSubmitSuccess={handlePostInternship}
          farmerUser={user}
        />
      )}

      {/* 2. Farmer: Edit Existing Internship Modal */}
      {isFarmer && (
        <EditInternshipModal
          isOpen={Boolean(editingInternship)}
          onClose={() => setEditingInternship(null)}
          internship={editingInternship}
          onSave={handleSaveEditedInternship}
        />
      )}

      {/* 3. Farmer: Manage Student Applicants Modal for a Listing */}
      {isFarmer && (
        <FarmerManageApplicationsModal
          isOpen={Boolean(managingInternship)}
          onClose={() => setManagingInternship(null)}
          internship={managingInternship}
          applications={allApplications}
          onUpdateStatus={handleUpdateApplicationStatus}
          onUpdateApplicationStatus={handleUpdateApplicationStatus}
          onOpenChat={handleOpenChatFromApplicant}
          lang={lang}
        />
      )}

      {/* 4. Public / Student: Opportunity Details Modal */}
      <InternshipDetailsModal
        internship={selectedForDetails}
        isOpen={Boolean(selectedForDetails)}
        onClose={() => setSelectedForDetails(null)}
        isSaved={selectedForDetails ? savedIds.includes(selectedForDetails.id) : false}
        onToggleSave={handleToggleSave}
        onApply={(item) => setSelectedForApply(item)}
        onOpenChat={handleOpenChatFromInternship}
        lang={lang}
      />

      {/* 5. Student: Apply Now Modal */}
      <ApplicationModal
        internship={selectedForApply}
        isOpen={Boolean(selectedForApply)}
        onClose={() => setSelectedForApply(null)}
        onSubmitSuccess={handleApplicationSuccess}
      />

      {/* 6. Student: Application Success Modal */}
      <ApplicationSuccessModal
        application={submittedApplication}
        isOpen={Boolean(submittedApplication)}
        onClose={() => setSubmittedApplication(null)}
        onViewMyApplications={() => {
          setSubmittedApplication(null);
          setIsMyApplicationsOpen(true);
        }}
        onOpenChat={(app) => {
          setSubmittedApplication(null);
          handleOpenChatFromInternship({
            id: app.internshipId,
            internshipId: app.internshipId,
            title: app.internshipTitle,
            ownerId: app.ownerId || 'user_farmer_01',
            ownerName: app.ownerName || 'Rajesh Kumar',
            farmName: app.farmName || app.organization,
            contactPhone: app.contactPhone || '9876543210'
          });
        }}
      />

      {/* 7. Student: My Applications Tracker Modal */}
      <MyApplicationsModal
        isOpen={isMyApplicationsOpen}
        onClose={() => setIsMyApplicationsOpen(false)}
        applications={studentApplications}
        onOpenChat={handleOpenChatFromInternship}
        lang={lang}
        onExploreMore={() => {
          const el = document.getElementById('feed');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* 8. Workshop / Training Enrollment Modal */}
      <TrainingEnrollModal
        program={selectedTrainingForEnroll}
        isOpen={Boolean(selectedTrainingForEnroll)}
        onClose={() => setSelectedTrainingForEnroll(null)}
      />

      {/* 9. In-App Direct Chatbox Modal (Farmer <-> Student) */}
      <ChatModal
        isOpen={isChatModalOpen}
        onClose={() => setIsChatModalOpen(false)}
        onBack={() => {
          setIsChatModalOpen(false);
          if (openedChatFromList) {
            setIsConversationListOpen(true);
          }
        }}
        conversation={activeChatConversation}
        onSendMessage={handleSendMessage}
        currentUser={user}
        lang={lang}
      />

      {/* 10. In-App Conversations & Messages List Modal */}
      <ConversationListModal
        isOpen={isConversationListOpen}
        onClose={() => setIsConversationListOpen(false)}
        conversations={conversations}
        currentUser={user}
        lang={lang}
        onSelectConversation={(conv) => {
          setOpenedChatFromList(true);
          setIsConversationListOpen(false);
          setActiveChatConversation(conv);
          setIsChatModalOpen(true);
        }}
      />

    </div>
  );
}
