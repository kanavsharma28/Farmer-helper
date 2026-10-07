import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import {
  getPlatformSettings,
  updatePlatformSettings,
  updateAdminProfile,
  changeAdminPassword,
} from '../../services/adminService';

export default function AdminSettingsPage() {
  const [lang, setLang] = useState('en');
  const [settings, setSettings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Profile Form state
  const [profileData, setProfileData] = useState({ name: '', email: '', phone: '' });
  const [profileSuccess, setProfileSuccess] = useState(false);

  // Password Form state
  const [passwordData, setPasswordData] = useState({ current: '', next: '', confirm: '' });
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // Settings Save Success
  const [settingsSuccess, setSettingsSuccess] = useState(false);

  useEffect(() => {
    try {
      const s = getPlatformSettings();
      setSettings(s);
      setProfileData({
        name: s.adminProfile?.name || 'Platform Administrator',
        email: s.adminProfile?.email || 'admin@farmerhelper.in',
        phone: s.adminProfile?.phone || '9999900000',
      });
    } catch (err) {
      console.error('Error reading settings:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleToggleFeature = (key) => {
    const nextToggles = {
      ...settings.featureToggles,
      [key]: !settings.featureToggles[key],
    };
    const updated = updatePlatformSettings({ featureToggles: nextToggles });
    setSettings(updated);
    setSettingsSuccess(true);
    setTimeout(() => setSettingsSuccess(false), 2000);
  };

  const handleToggleMaintenance = () => {
    const updated = updatePlatformSettings({ maintenanceMode: !settings.maintenanceMode });
    setSettings(updated);
    setSettingsSuccess(true);
    setTimeout(() => setSettingsSuccess(false), 2000);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    try {
      updateAdminProfile(profileData);
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 2500);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    setPasswordError('');

    if (passwordData.next !== passwordData.confirm) {
      setPasswordError('New password and confirmation do not match.');
      return;
    }

    try {
      changeAdminPassword(passwordData.current, passwordData.next);
      setPasswordSuccess(true);
      setPasswordData({ current: '', next: '', confirm: '' });
      setTimeout(() => setPasswordSuccess(false), 2500);
    } catch (err) {
      setPasswordError(err.message);
    }
  };

  if (isLoading || !settings) {
    return (
      <AdminLayout
        title="Admin Settings"
        subtitle="Manage administrator profile, security keys, and platform feature flags."
        lang={lang}
        setLang={setLang}
      >
        <div className="py-24 text-center">
          <span className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin inline-block" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title="Admin Settings & Platform Controls"
      subtitle="Manage administrator profile, security credentials, and module feature flags."
      lang={lang}
      setLang={setLang}
    >
      {settingsSuccess && (
        <div className="p-3.5 bg-emerald-50 text-emerald-900 rounded-2xl text-xs font-bold border border-emerald-200 animate-fadeIn">
          ✓ Platform configuration updated successfully!
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Admin Profile & Password */}
        <div className="space-y-6 lg:col-span-1">
          {/* Admin Profile Form */}
          <div className="bg-surface-container-lowest p-5 sm:p-6 rounded-2xl border border-outline-variant/40 shadow-xs space-y-4">
            <h3 className="font-bold text-base text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">admin_panel_settings</span>
              Administrator Profile
            </h3>

            {profileSuccess && (
              <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-semibold border border-emerald-200">
                ✓ Profile details saved successfully.
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-on-surface-variant font-semibold mb-1">Admin Name</label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant/40 bg-surface-container-lowest focus:outline-none focus:border-primary text-xs font-medium text-on-surface"
                  required
                />
              </div>

              <div>
                <label className="block text-on-surface-variant font-semibold mb-1">Official Email</label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant/40 bg-surface-container-lowest focus:outline-none focus:border-primary text-xs font-medium text-on-surface"
                  required
                />
              </div>

              <div>
                <label className="block text-on-surface-variant font-semibold mb-1">Mobile Contact</label>
                <input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant/40 bg-surface-container-lowest focus:outline-none focus:border-primary text-xs font-medium text-on-surface"
                  required
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary-container transition-colors shadow-xs cursor-pointer"
                >
                  Update Profile
                </button>
              </div>
            </form>
          </div>

          {/* Change Password Form */}
          <div className="bg-surface-container-lowest p-5 sm:p-6 rounded-2xl border border-outline-variant/40 shadow-xs space-y-4">
            <h3 className="font-bold text-base text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-700">lock_reset</span>
              Change Admin Password
            </h3>

            {passwordSuccess && (
              <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-semibold border border-emerald-200">
                ✓ Password updated successfully.
              </div>
            )}

            {passwordError && (
              <div className="p-2.5 bg-rose-50 text-rose-800 rounded-xl text-xs font-semibold border border-rose-200">
                {passwordError}
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-on-surface-variant font-semibold mb-1">Current Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={passwordData.current}
                  onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant/40 bg-surface-container-lowest focus:outline-none focus:border-primary text-xs font-medium text-on-surface"
                  required
                />
              </div>

              <div>
                <label className="block text-on-surface-variant font-semibold mb-1">New Password (Min 6 chars)</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={passwordData.next}
                  onChange={(e) => setPasswordData({ ...passwordData, next: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant/40 bg-surface-container-lowest focus:outline-none focus:border-primary text-xs font-medium text-on-surface"
                  required
                />
              </div>

              <div>
                <label className="block text-on-surface-variant font-semibold mb-1">Confirm New Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={passwordData.confirm}
                  onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant/40 bg-surface-container-lowest focus:outline-none focus:border-primary text-xs font-medium text-on-surface"
                  required
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-surface-container text-on-surface hover:bg-surface-container-high rounded-xl text-xs font-bold transition-colors cursor-pointer border border-outline-variant/40"
                >
                  Update Admin Password
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Platform Configuration & Feature Toggles */}
        <div className="space-y-6 lg:col-span-2">
          {/* Maintenance Mode Card */}
          <div className="bg-surface-container-lowest p-5 sm:p-6 rounded-2xl border border-outline-variant/40 shadow-xs flex items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-base text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-700">build</span>
                Maintenance Mode
              </h3>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Temporarily pause public marketplace transactions while keeping Admin Portal fully active.
              </p>
            </div>
            <button
              type="button"
              onClick={handleToggleMaintenance}
              className={`w-12 h-7 rounded-full transition-colors relative cursor-pointer ${
                settings.maintenanceMode ? 'bg-amber-600' : 'bg-surface-container-high'
              }`}
            >
              <span
                className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                  settings.maintenanceMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Feature Toggles */}
          <div className="bg-surface-container-lowest p-5 sm:p-6 rounded-2xl border border-outline-variant/40 shadow-xs space-y-4">
            <div>
              <h3 className="font-bold text-base text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">toggle_on</span>
                Platform Module Feature Toggles
              </h3>
              <p className="text-xs text-on-surface-variant">
                Instantly enable or disable specific features across the Farmer Helper application.
              </p>
            </div>

            <div className="divide-y divide-outline-variant/20 text-xs">
              {[
                { key: 'universalChat', label: 'Universal Cross-Role Direct Chat', desc: 'Allows Farmer ↔ Student ↔ Buyer ↔ Provider in-app messaging' },
                { key: 'cropDoctor', label: 'Mera Khet Ka Doctor (AI Diagnostics)', desc: 'Field crop pathology scanner and advisory suggestions' },
                { key: 'cropLossReporting', label: 'Crop Loss & Disaster Damage Reporting', desc: 'Permits farmers to submit geotagged crop loss insurance claims' },
                { key: 'storageFinder', label: 'Warehouse & Cold Storage Finder', desc: 'Interactive map and storage facility directory' },
                { key: 'governmentSchemes', label: 'Government Agriculture Schemes Directory', desc: 'Official DBT schemes, subsidies, and application guides' },
                { key: 'internships', label: 'Agricultural Internships Portal', desc: 'Farmer listings & student internship applications' },
                { key: 'trainingWorkshops', label: 'Student Training & Masterclasses', desc: 'Short-term bootcamps, workshops, and webinars' },
                { key: 'bestBuyersMarketplace', label: 'Best Buyers & Produce Marketplace', desc: 'Two-sided wholesale produce buying and seller discovery' },
              ].map((item) => {
                const isEnabled = settings.featureToggles?.[item.key] !== false;
                return (
                  <div key={item.key} className="py-3.5 flex items-center justify-between gap-4">
                    <div>
                      <div className="font-bold text-on-surface">{item.label}</div>
                      <p className="text-on-surface-variant text-[11px]">{item.desc}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleToggleFeature(item.key)}
                      className={`w-11 h-6 rounded-full transition-colors relative shrink-0 cursor-pointer ${
                        isEnabled ? 'bg-primary' : 'bg-surface-container-high'
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                          isEnabled ? 'translate-x-5.5' : 'translate-x-0.5'
                        }`}
                      />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
