// ─────────────────────────────────────────────────────────────────────────────
// Farmer Helper - Admin Portal Initial Data & Constants
// ─────────────────────────────────────────────────────────────────────────────

export const AUDIT_LOGS_STORAGE_KEY = 'farmer_helper_audit_logs';
export const ADMIN_REPORTS_STORAGE_KEY = 'farmer_helper_admin_reports';
export const PLATFORM_SETTINGS_STORAGE_KEY = 'farmer_helper_platform_settings';
export const ADMIN_TRAININGS_STORAGE_KEY = 'farmer_helper_all_trainings';
export const ADMIN_SCHEMES_STORAGE_KEY = 'farmer_helper_all_schemes';
export const ADMIN_STORAGE_FACILITIES_KEY = 'farmer_helper_storage_facilities';
export const ADMIN_CROP_LOSS_STORAGE_KEY = 'farmer_helper_crop_loss_reports';

// Initial platform settings
export const DEFAULT_PLATFORM_SETTINGS = {
  maintenanceMode: false,
  allowRegistrations: true,
  featureToggles: {
    universalChat: true,
    cropDoctor: true,
    cropLossReporting: true,
    storageFinder: true,
    governmentSchemes: true,
    internships: true,
    trainingWorkshops: true,
    bestBuyersMarketplace: true,
  },
  security: {
    requireStrongPassword: true,
    sessionTimeoutMinutes: 60,
    twoFactorEnforced: false,
  },
  adminProfile: {
    name: 'Platform Administrator',
    email: 'admin@farmerhelper.in',
    phone: '9999900000',
    department: 'Platform Operations & Moderation',
    role: 'Super Administrator',
  },
};

// Seed audit logs
export const INITIAL_AUDIT_LOGS = [
  {
    id: 'log_01',
    adminId: 'user_admin_01',
    adminName: 'Platform Administrator',
    action: 'ADMIN_LOGIN',
    targetType: 'Session',
    targetId: 'session_auth_01',
    description: 'Administrator logged into the Admin Portal successfully.',
    timestamp: '2026-10-06T08:15:20Z',
    device: 'Desktop Chrome / Windows 11',
  },
  {
    id: 'log_02',
    adminId: 'user_admin_01',
    adminName: 'Platform Administrator',
    action: 'RESOURCE_VERIFIED',
    targetType: 'Resource',
    targetId: 'seed_res_01',
    description: 'Verified Mahindra 575 DI Tractor for Sardar Gurpreet Singh.',
    timestamp: '2026-10-06T08:30:12Z',
    device: 'Desktop Chrome / Windows 11',
  },
  {
    id: 'log_03',
    adminId: 'user_admin_01',
    adminName: 'Platform Administrator',
    action: 'SCHEME_UPDATED',
    targetType: 'Government Scheme',
    targetId: 'scheme_pm_kisan',
    description: 'Updated eligibility and official portal URL for PM-KISAN Samman Nidhi.',
    timestamp: '2026-10-06T09:10:45Z',
    device: 'Desktop Chrome / Windows 11',
  },
  {
    id: 'log_04',
    adminId: 'user_admin_01',
    adminName: 'Platform Administrator',
    action: 'REPORT_REVIEWED',
    targetType: 'Report',
    targetId: 'rep_001',
    description: 'Reviewed community post report and marked under review.',
    timestamp: '2026-10-06T10:05:00Z',
    device: 'Desktop Chrome / Windows 11',
  },
];

// Seed central moderation reports
export const INITIAL_ADMIN_REPORTS = [
  {
    id: 'rep_001',
    type: 'Community Post',
    targetId: 'post_01',
    targetTitle: 'Wheat sowing fertilizer tips discussion',
    reportedUser: 'Rajesh Kumar',
    reportedUserId: 'user_farmer_01',
    reportedUserRole: 'farmer',
    reporterName: 'Aman Verma',
    reporterRole: 'student',
    reason: 'Incorrect pesticide dosage advice',
    description: 'The recommendation for chlorpyrifos dosage is unusually high for early vegetative stage.',
    status: 'Under Review',
    adminNotes: 'Assigned to agricultural advisor for technical accuracy check.',
    createdAt: '2026-10-05T14:20:00Z',
  },
  {
    id: 'rep_002',
    type: 'Resource',
    targetId: 'seed_res_02',
    targetTitle: 'Wheat Harvesting Labour Squad',
    reportedUser: 'Ramesh Labour Chokhat',
    reportedUserId: 'res_owner_ramesh_02',
    reportedUserRole: 'provider',
    reporterName: 'Vikram Sharma',
    reporterRole: 'buyer',
    reason: 'Listing availability delay',
    description: 'Labour squad was marked immediately available but requested 3-day lead time.',
    status: 'Pending',
    adminNotes: '',
    createdAt: '2026-10-05T17:40:00Z',
  },
  {
    id: 'rep_003',
    type: 'Message',
    targetId: 'msg_conv_01_03',
    targetTitle: 'Direct Chat conversation: Rajesh Kumar & Aman Verma',
    reportedUser: 'Aman Verma',
    reportedUserId: 'user_student_01',
    reportedUserRole: 'student',
    reporterName: 'Rajesh Kumar',
    reporterRole: 'farmer',
    reason: 'Repeated spam inquiry',
    description: 'User sent 5 duplicated questions regarding internship stipend.',
    status: 'Resolved',
    adminNotes: 'Informed student to use proper chat etiquette. No abusive content found.',
    createdAt: '2026-10-04T11:15:00Z',
  },
  {
    id: 'rep_004',
    type: 'Internship',
    targetId: 'agro-02',
    targetTitle: 'Organic Horticulture & Greenhouse Management',
    reportedUser: 'Virendra Singh',
    reportedUserId: 'user_farmer_02',
    reportedUserRole: 'farmer',
    reporterName: 'Priya Sharma',
    reporterRole: 'student',
    reason: 'Expired application link query',
    description: 'Internship deadline displayed passed but listing still shows active.',
    status: 'Pending',
    adminNotes: '',
    createdAt: '2026-10-06T07:30:00Z',
  },
];
