import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import MobileBottomNav from './components/MobileBottomNav';
import HeroSection from './components/HeroSection';
import StatsBar from './components/StatsBar';
import ServicesView from './components/ServicesView';
import MarketplaceView from './components/MarketplaceView';
import CommunityView from './components/CommunityView';
import NearbyHelpModal from './components/NearbyHelpModal';
import LoginModal from './components/LoginModal';
import Footer from './components/Footer';

import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import FarmOnboardingPage from './pages/FarmOnboardingPage';
import DashboardPage from './pages/DashboardPage';
import ResourcesPage from './pages/ResourcesPage';
import MeraKhetKaDoctor from './pages/MeraKhetKaDoctor';
import CropLossReportPage from './pages/CropLossReportPage';
import StorageFinderPage from './pages/StorageFinderPage';
import CropProfitCalculatorPage from './pages/CropProfitCalculatorPage';
import InternshipsPage from './pages/InternshipsPage';
import StudentTrainingWorkshopsPage from './pages/StudentTrainingWorkshopsPage';
import BestBuyersPage from './pages/BestBuyersPage';
import ChatPage from './pages/ChatPage';
import CommunityPage from './pages/CommunityPage';
import GovernmentSchemesPage from './pages/GovernmentSchemesPage';
import ErrorBoundary from './components/common/ErrorBoundary';

// Admin Portal Pages
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminResourcesPage from './pages/admin/AdminResourcesPage';
import AdminInternshipsPage from './pages/admin/AdminInternshipsPage';
import AdminTrainingPage from './pages/admin/AdminTrainingPage';
import AdminCommunityPage from './pages/admin/AdminCommunityPage';
import AdminMessagesPage from './pages/admin/AdminMessagesPage';
import AdminGovernmentSchemesPage from './pages/admin/AdminGovernmentSchemesPage';
import AdminKhetDoctorPage from './pages/admin/AdminKhetDoctorPage';
import AdminCropLossReportsPage from './pages/admin/AdminCropLossReportsPage';
import AdminStoragePage from './pages/admin/AdminStoragePage';
import AdminMarketplacePage from './pages/admin/AdminMarketplacePage';
import AdminReportsPage from './pages/admin/AdminReportsPage';
import AdminAuditLogsPage from './pages/admin/AdminAuditLogsPage';
import AdminAnalyticsPage from './pages/admin/AdminAnalyticsPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';

function LandingPage() {
  const [activeTab, setActiveTab] = useState('home');
  const [lang, setLang] = useState('en');
  const [isNearbyHelpOpen, setIsNearbyHelpOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-on-surface font-sans flex flex-col justify-between selection:bg-primary-container selection:text-white">
      
      {/* Top Header Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        lang={lang}
        setLang={setLang}
        onOpenLogin={() => setIsLoginOpen(true)}
        onOpenNearbyHelp={() => setIsNearbyHelpOpen(true)}
      />

      {/* Main Page View Content */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <div className="space-y-4">
            <HeroSection
              lang={lang}
              onExploreServices={() => setActiveTab('services')}
              onOpenNearbyHelp={() => setIsNearbyHelpOpen(true)}
            />
            <StatsBar lang={lang} />
            <ServicesView
              lang={lang}
              onOpenNearbyHelp={() => setIsNearbyHelpOpen(true)}
            />
            <MarketplaceView lang={lang} />
            <CommunityView lang={lang} />
          </div>
        )}

        {activeTab === 'services' && (
          <ServicesView
            lang={lang}
            onOpenNearbyHelp={() => setIsNearbyHelpOpen(true)}
          />
        )}

        {activeTab === 'marketplace' && (
          <MarketplaceView lang={lang} />
        )}

        {activeTab === 'community' && (
          <CommunityView lang={lang} />
        )}
      </main>

      {/* Footer */}
      <Footer
        lang={lang}
        setActiveTab={setActiveTab}
      />

      {/* Sticky Mobile Bottom Navigation */}
      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        lang={lang}
        onOpenLogin={() => setIsLoginOpen(true)}
      />

      {/* Interactive Modals */}
      <NearbyHelpModal
        isOpen={isNearbyHelpOpen}
        onClose={() => setIsNearbyHelpOpen(false)}
        lang={lang}
      />

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        lang={lang}
      />

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Backward-compatibility redirects for old URLs */}
          <Route path="/register/farmer" element={<Navigate to="/register" replace />} />
          <Route path="/buyer/register" element={<Navigate to="/register" replace />} />
          <Route path="/student/register" element={<Navigate to="/register" replace />} />

          {/* ══════════════════════════════════════════════════
              PROTECTED ROUTES WITH ROLE-BASED ACCESS CONTROL
             ══════════════════════════════════════════════════ */}
          
          {/* Dynamic Dashboard: Accessible to all 4 authenticated roles */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          {/* Farmer-Specific Features */}
          <Route
            path="/onboarding/farm"
            element={
              <ProtectedRoute allowedRoles={['farmer']}>
                <FarmOnboardingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-farm"
            element={
              <ProtectedRoute allowedRoles={['farmer']}>
                <FarmOnboardingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/crop-doctor"
            element={
              <ProtectedRoute allowedRoles={['farmer']}>
                <MeraKhetKaDoctor />
              </ProtectedRoute>
            }
          />
          <Route
            path="/khet-ka-doctor"
            element={
              <ProtectedRoute allowedRoles={['farmer']}>
                <MeraKhetKaDoctor />
              </ProtectedRoute>
            }
          />
          <Route
            path="/crop-loss"
            element={
              <ProtectedRoute allowedRoles={['farmer']}>
                <CropLossReportPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profit-calculator"
            element={
              <ProtectedRoute allowedRoles={['farmer']}>
                <CropProfitCalculatorPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/government-schemes"
            element={
              <ProtectedRoute allowedRoles={['farmer']}>
                <GovernmentSchemesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/schemes"
            element={
              <ProtectedRoute allowedRoles={['farmer']}>
                <GovernmentSchemesPage />
              </ProtectedRoute>
            }
          />

          {/* Storage Finder: Farmer & Buyer */}
          <Route
            path="/storage"
            element={
              <ProtectedRoute allowedRoles={['farmer', 'buyer']}>
                <StorageFinderPage />
              </ProtectedRoute>
            }
          />

          {/* Resource Sharing: Farmer, Provider, Buyer */}
          <Route
            path="/resources"
            element={
              <ProtectedRoute allowedRoles={['farmer', 'provider', 'buyer']}>
                <ResourcesPage />
              </ProtectedRoute>
            }
          />

          {/* Best Buyers / Marketplace: Strictly for Farmers */}
          <Route
            path="/buyers"
            element={
              <ProtectedRoute allowedRoles={['farmer']}>
                <BestBuyersPage />
              </ProtectedRoute>
            }
          />

          {/* Buyer Dedicated Dashboard Route */}
          <Route
            path="/buyer-dashboard"
            element={
              <ProtectedRoute allowedRoles={['buyer']}>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          {/* Internships & Training: Student & Farmer */}
          <Route
            path="/internships"
            element={
              <ProtectedRoute allowedRoles={['student', 'farmer']}>
                <InternshipsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/internships/create"
            element={
              <ProtectedRoute allowedRoles={['farmer']}>
                <InternshipsPage routeView="create" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/internships/my-listings"
            element={
              <ProtectedRoute allowedRoles={['farmer']}>
                <InternshipsPage routeView="my-listings" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/internships/:id/applications"
            element={
              <ProtectedRoute allowedRoles={['farmer']}>
                <InternshipsPage routeView="manage-applications" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/internships/:id/apply"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <InternshipsPage routeView="apply" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/internships/my-applications"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <InternshipsPage routeView="my-applications" />
              </ProtectedRoute>
            }
          />

          {/* Training & Workshops: Student Portal */}
          <Route
            path="/student/training-workshops"
            element={
              <ProtectedRoute allowedRoles={['student', 'farmer']}>
                <StudentTrainingWorkshopsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/training-workshops"
            element={
              <ProtectedRoute allowedRoles={['student', 'farmer']}>
                <StudentTrainingWorkshopsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/training"
            element={
              <ProtectedRoute allowedRoles={['student', 'farmer']}>
                <StudentTrainingWorkshopsPage />
              </ProtectedRoute>
            }
          />

          {/* In-App Direct Chat Routes: Accessible to all authenticated roles */}
          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <ErrorBoundary>
                  <ChatPage />
                </ErrorBoundary>
              </ProtectedRoute>
            }
          />
          <Route
            path="/chat/:conversationId"
            element={
              <ProtectedRoute>
                <ErrorBoundary>
                  <ChatPage />
                </ErrorBoundary>
              </ProtectedRoute>
            }
          />
          <Route
            path="/messages"
            element={
              <ProtectedRoute>
                <ErrorBoundary>
                  <ChatPage />
                </ErrorBoundary>
              </ProtectedRoute>
            }
          />
          <Route
            path="/messages/:conversationId"
            element={
              <ProtectedRoute>
                <ErrorBoundary>
                  <ChatPage />
                </ErrorBoundary>
              </ProtectedRoute>
            }
          />

          {/* Universal Agricultural Community: Accessible to all 4 authenticated roles */}
          <Route
            path="/community"
            element={
              <ProtectedRoute>
                <ErrorBoundary>
                  <CommunityPage />
                </ErrorBoundary>
              </ProtectedRoute>
            }
          />

          {/* ============================================================== */}
          {/* SECURE ADMIN PORTAL ROUTES (Strictly restricted to 'admin')     */}
          {/* ============================================================== */}
          <Route
            path="/admin"
            element={<Navigate to="/admin/dashboard" replace />}
          />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <ErrorBoundary>
                  <AdminDashboardPage />
                </ErrorBoundary>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <ErrorBoundary>
                  <AdminUsersPage />
                </ErrorBoundary>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/resources"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <ErrorBoundary>
                  <AdminResourcesPage />
                </ErrorBoundary>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/internships"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <ErrorBoundary>
                  <AdminInternshipsPage />
                </ErrorBoundary>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/training"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <ErrorBoundary>
                  <AdminTrainingPage />
                </ErrorBoundary>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/community"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <ErrorBoundary>
                  <AdminCommunityPage />
                </ErrorBoundary>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/messages"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <ErrorBoundary>
                  <AdminMessagesPage />
                </ErrorBoundary>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/government-schemes"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <ErrorBoundary>
                  <AdminGovernmentSchemesPage />
                </ErrorBoundary>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/khet-ka-doctor"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <ErrorBoundary>
                  <AdminKhetDoctorPage />
                </ErrorBoundary>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/crop-loss-reports"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <ErrorBoundary>
                  <AdminCropLossReportsPage />
                </ErrorBoundary>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/storage"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <ErrorBoundary>
                  <AdminStoragePage />
                </ErrorBoundary>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/marketplace"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <ErrorBoundary>
                  <AdminMarketplacePage />
                </ErrorBoundary>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/reports"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <ErrorBoundary>
                  <AdminReportsPage />
                </ErrorBoundary>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/analytics"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <ErrorBoundary>
                  <AdminAnalyticsPage />
                </ErrorBoundary>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/audit-logs"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <ErrorBoundary>
                  <AdminAuditLogsPage />
                </ErrorBoundary>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <ErrorBoundary>
                  <AdminSettingsPage />
                </ErrorBoundary>
              </ProtectedRoute>
            }
          />

          {/* Fallback Catch-all Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
