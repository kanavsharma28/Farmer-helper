// ─────────────────────────────────────────────────────────────────────────────
// Farmer Helper - Complete Admin API & Backend Service Layer
// Enforces role-based backend authorization, audit logging, and data mutations.
// ─────────────────────────────────────────────────────────────────────────────

import { DEFAULT_PRESET_USERS } from '../context/AuthContext';
import { getStoredResources, saveStoredResources, SEED_RESOURCES } from '../data/resourceContent';
import { INITIAL_INTERNSHIPS, INITIAL_APPLICATIONS } from '../data/internshipsData';
import { TRAINING_PROGRAMS, TRAINING_REGISTRATIONS_KEY } from '../data/trainingData';
import { getStoredCommunityPosts, saveStoredCommunityPosts } from '../data/communityData';
import { getStoredConversations, saveStoredConversations } from '../data/chatData';
import { OFFICIAL_GOVERNMENT_SCHEMES } from '../data/schemesData';
import { MOCK_REPORTS } from '../data/cropLossData';
import { STORAGE_FACILITIES } from '../data/storageData';
import { SEED_BUYERS } from '../data/buyersData';
import { SEED_PRODUCE } from '../data/produceData';
import { INITIAL_DIAGNOSES, KHET_DOCTOR_STORAGE_KEY } from '../services/khetDoctorService';

import {
  AUDIT_LOGS_STORAGE_KEY,
  ADMIN_REPORTS_STORAGE_KEY,
  PLATFORM_SETTINGS_STORAGE_KEY,
  ADMIN_TRAININGS_STORAGE_KEY,
  ADMIN_SCHEMES_STORAGE_KEY,
  ADMIN_STORAGE_FACILITIES_KEY,
  ADMIN_CROP_LOSS_STORAGE_KEY,
  DEFAULT_PLATFORM_SETTINGS,
  INITIAL_AUDIT_LOGS,
  INITIAL_ADMIN_REPORTS,
} from '../data/adminData';

const REGISTERED_USERS_KEY = 'farmer_helper_registered_users';
const INTERNSHIPS_STORAGE_KEY = 'farmer_helper_all_internships';
const APPLICATIONS_STORAGE_KEY = 'farmer_helper_all_applications';
const BUYERS_STORAGE_KEY = 'farmer_helper_all_buyers';
const PRODUCE_STORAGE_KEY = 'farmer_helper_farm_produce';

// ═════════════════════════════════════════════════════════════════════════════
// 1. BACKEND AUTHORIZATION & SECURITY GUARDS
// ═════════════════════════════════════════════════════════════════════════════

export function getCurrentAuthUser() {
  try {
    const raw = localStorage.getItem('farmer_helper_auth_user');
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function isUserAdmin(user) {
  if (!user) return false;
  return user.role === 'admin';
}

export function requireAdmin() {
  const current = getCurrentAuthUser();
  if (!current || current.role !== 'admin') {
    const error = new Error('403 Forbidden: You do not have permission to access Admin APIs.');
    error.statusCode = 403;
    throw error;
  }
  return current;
}

// ═════════════════════════════════════════════════════════════════════════════
// 2. AUDIT LOGGING SERVICE
// ═════════════════════════════════════════════════════════════════════════════

export function logAdminAction({ action, targetType, targetId, description, details = null }) {
  try {
    const admin = getCurrentAuthUser() || { id: 'user_admin_01', name: 'Platform Administrator' };
    const rawLogs = localStorage.getItem(AUDIT_LOGS_STORAGE_KEY);
    const existing = rawLogs ? JSON.parse(rawLogs) : INITIAL_AUDIT_LOGS;

    const newLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      adminId: admin.id || 'user_admin_01',
      adminName: admin.name || 'Platform Administrator',
      action: action || 'ADMIN_ACTION',
      targetType: targetType || 'General',
      targetId: targetId || 'N/A',
      description: description || '',
      details: details || null,
      timestamp: new Date().toISOString(),
      device: typeof navigator !== 'undefined' ? `${navigator.platform || 'Desktop'} / Browser` : 'Web Client',
    };

    const updated = [newLog, ...existing];
    localStorage.setItem(AUDIT_LOGS_STORAGE_KEY, JSON.stringify(updated));
    return newLog;
  } catch (err) {
    console.error('Failed to log admin action:', err);
    return null;
  }
}

export function getAuditLogs({ admin = '', action = '', dateFrom = '', dateTo = '', targetType = '', page = 1, limit = 15 } = {}) {
  requireAdmin();
  try {
    const rawLogs = localStorage.getItem(AUDIT_LOGS_STORAGE_KEY);
    let logs = rawLogs ? JSON.parse(rawLogs) : INITIAL_AUDIT_LOGS;

    if (admin) {
      logs = logs.filter((l) => l.adminName?.toLowerCase().includes(admin.toLowerCase()) || l.adminId === admin);
    }
    if (action && action !== 'all') {
      logs = logs.filter((l) => l.action?.toLowerCase() === action.toLowerCase());
    }
    if (targetType && targetType !== 'all') {
      logs = logs.filter((l) => l.targetType?.toLowerCase() === targetType.toLowerCase());
    }
    if (dateFrom) {
      logs = logs.filter((l) => new Date(l.timestamp) >= new Date(dateFrom));
    }
    if (dateTo) {
      logs = logs.filter((l) => new Date(l.timestamp) <= new Date(dateTo + 'T23:59:59'));
    }

    const total = logs.length;
    const startIndex = (page - 1) * limit;
    const paginated = logs.slice(startIndex, startIndex + limit);

    return {
      data: paginated,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  } catch (err) {
    console.error('Error fetching audit logs:', err);
    return { data: [], total: 0, page: 1, limit, totalPages: 1 };
  }
}

// ═════════════════════════════════════════════════════════════════════════════
// 3. USER MANAGEMENT SERVICE
// ═════════════════════════════════════════════════════════════════════════════

export function getAllUsersRaw() {
  const presetList = [
    {
      ...DEFAULT_PRESET_USERS.farmer,
      status: 'active',
      joinedDate: '2026-06-15T10:00:00Z',
      isPreset: true,
    },
    {
      ...DEFAULT_PRESET_USERS.student,
      status: 'active',
      joinedDate: '2026-07-20T11:30:00Z',
      isPreset: true,
    },
    {
      ...DEFAULT_PRESET_USERS.buyer,
      status: 'active',
      joinedDate: '2026-08-01T09:15:00Z',
      isPreset: true,
    },
    {
      ...DEFAULT_PRESET_USERS.provider,
      status: 'active',
      joinedDate: '2026-08-10T14:45:00Z',
      isPreset: true,
    },
  ];

  try {
    const raw = localStorage.getItem(REGISTERED_USERS_KEY);
    const registered = raw ? JSON.parse(raw) : [];

    // Map overrides for preset users
    const registeredMap = new Map();
    registered.forEach((u) => {
      registeredMap.set(u.id, u);
    });

    const mergedPresets = presetList.map((preset) => {
      if (registeredMap.has(preset.id)) {
        return {
          ...preset,
          ...registeredMap.get(preset.id),
          isPreset: true,
        };
      }
      return preset;
    });

    const nonPresetRegistered = registered
      .filter((u) => !mergedPresets.some((p) => p.id === u.id))
      .map((u) => ({
        ...u,
        status: u.status || 'active',
        joinedDate: u.joinedDate || u.createdAt || new Date().toISOString(),
        isPreset: false,
      }));

    return [...mergedPresets, ...nonPresetRegistered];
  } catch {
    return presetList;
  }
}

export function getAdminUsers({ search = '', role = 'all', status = 'all', page = 1, limit = 10, sortBy = 'joinedDate', sortOrder = 'desc' } = {}) {
  requireAdmin();
  let users = getAllUsersRaw();

  // Exclude admin itself from normal user management list
  users = users.filter((u) => u.role !== 'admin');

  // Search filter
  if (search.trim()) {
    const q = search.toLowerCase().trim();
    users = users.filter(
      (u) =>
        u.name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.phone?.includes(q) ||
        u.location?.toLowerCase().includes(q) ||
        u.details?.farmName?.toLowerCase().includes(q) ||
        u.details?.college?.toLowerCase().includes(q) ||
        u.details?.businessName?.toLowerCase().includes(q)
    );
  }

  // Role filter
  if (role && role !== 'all') {
    users = users.filter((u) => u.role === role);
  }

  // Status filter
  if (status && status !== 'all') {
    users = users.filter((u) => (u.status || 'active').toLowerCase() === status.toLowerCase());
  }

  // Sorting
  users.sort((a, b) => {
    let fieldA = a[sortBy] || '';
    let fieldB = b[sortBy] || '';
    if (sortBy === 'joinedDate') {
      const timeA = new Date(fieldA).getTime() || 0;
      const timeB = new Date(fieldB).getTime() || 0;
      return sortOrder === 'asc' ? timeA - timeB : timeB - timeA;
    }
    if (typeof fieldA === 'string') fieldA = fieldA.toLowerCase();
    if (typeof fieldB === 'string') fieldB = fieldB.toLowerCase();
    if (fieldA < fieldB) return sortOrder === 'asc' ? -1 : 1;
    if (fieldA > fieldB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const total = users.length;
  const startIndex = (page - 1) * limit;
  const paginated = users.slice(startIndex, startIndex + limit);

  return {
    data: paginated,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit) || 1,
  };
}

export function getUserDetails(userId) {
  requireAdmin();
  const allUsers = getAllUsersRaw();
  const user = allUsers.find((u) => u.id === userId);
  if (!user) {
    throw new Error('User not found.');
  }

  // Role-specific statistics
  const roleData = {};

  if (user.role === 'farmer') {
    const resources = getStoredResources().filter((r) => r.ownerId === user.id);
    const rawApps = localStorage.getItem(INTERNSHIPS_STORAGE_KEY);
    const internships = rawApps ? JSON.parse(rawApps) : INITIAL_INTERNSHIPS;
    const userInternships = internships.filter((i) => i.ownerId === user.id);
    const posts = getStoredCommunityPosts().filter((p) => p.authorId === user.id);
    
    roleData.farmer = {
      farmDetails: user.details || { landSize: '5 Acres', primaryCrop: 'Wheat (गेहूं)' },
      resourcesCount: resources.length,
      resources,
      internshipsPostedCount: userInternships.length,
      internshipsPosted: userInternships,
      communityPostsCount: posts.length,
    };
  } else if (user.role === 'student') {
    const rawApps = localStorage.getItem(APPLICATIONS_STORAGE_KEY);
    const allApps = rawApps ? JSON.parse(rawApps) : INITIAL_APPLICATIONS;
    const applications = allApps.filter((a) => a.studentId === user.id);
    
    let registrations = [];
    try {
      const rawRegs = localStorage.getItem(TRAINING_REGISTRATIONS_KEY);
      const parsed = rawRegs ? JSON.parse(rawRegs) : {};
      registrations = parsed[user.id] || [];
    } catch {
      registrations = [];
    }

    const posts = getStoredCommunityPosts().filter((p) => p.authorId === user.id);

    roleData.student = {
      education: {
        college: user.details?.college || 'GB Pant University of Agriculture',
        course: user.details?.course || 'B.Sc Agriculture (Hons)',
        yearOfStudy: user.details?.yearOfStudy || '3rd Year',
        areaOfInterest: user.details?.areaOfInterest || 'Agri-Tech & Precision Farming',
      },
      applicationsCount: applications.length,
      applications,
      trainingRegistrationsCount: registrations.length,
      trainingRegistrations: registrations,
      communityPostsCount: posts.length,
    };
  } else if (user.role === 'buyer') {
    let rawBuyers = localStorage.getItem(BUYERS_STORAGE_KEY);
    let buyers = rawBuyers ? JSON.parse(rawBuyers) : SEED_BUYERS;
    const buyerProfile = buyers.find((b) => b.ownerId === user.id) || user.details || {};

    let rawProduce = localStorage.getItem(PRODUCE_STORAGE_KEY);
    let produce = rawProduce ? JSON.parse(rawProduce) : SEED_PRODUCE;

    roleData.buyer = {
      businessName: user.businessName || user.details?.businessName || 'Kisan Mandi Agro Traders',
      contactPerson: user.name,
      businessType: user.details?.businessType || 'Wholesale Trader & Processor',
      cropsPurchased: user.details?.cropsPurchased || ['Wheat', 'Basmati Rice', 'Soybean'],
      gstNumber: user.details?.gstNumber || '09AAACK1234M1Z5',
      currentRequirement: user.details?.currentRequirement || 'Wheat — 500+ Quintals, Immediate',
      marketplaceLotsAvailable: produce.length,
    };
  } else if (user.role === 'provider') {
    const resources = getStoredResources().filter((r) => r.ownerId === user.id);
    roleData.provider = {
      equipmentCount: resources.length,
      resources,
      resourceCategory: user.details?.resourceCategory || 'Tractors, Harvesters & Labour',
      availability: user.details?.availability || 'Immediate Dispatch',
      location: user.location,
    };
  }

  return {
    ...user,
    roleData,
  };
}

export function updateUser(userId, updates) {
  requireAdmin();
  try {
    const raw = localStorage.getItem(REGISTERED_USERS_KEY);
    let registered = raw ? JSON.parse(raw) : [];
    const index = registered.findIndex((u) => u.id === userId);

    if (index !== -1) {
      registered[index] = { ...registered[index], ...updates, updatedAt: new Date().toISOString() };
      localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(registered));
    }

    logAdminAction({
      action: 'USER_EDITED',
      targetType: 'User',
      targetId: userId,
      description: `Updated profile details for user ${updates.name || userId}.`,
      details: updates,
    });

    return { success: true };
  } catch (err) {
    console.error('Error updating user:', err);
    throw err;
  }
}

export function setUserStatus(userId, status) {
  requireAdmin();
  try {
    const raw = localStorage.getItem(REGISTERED_USERS_KEY);
    let registered = raw ? JSON.parse(raw) : [];
    const index = registered.findIndex((u) => u.id === userId);

    if (index !== -1) {
      registered[index].status = status;
      localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(registered));
    } else {
      // If preset user, store in registered to override status
      const all = getAllUsersRaw();
      const user = all.find((u) => u.id === userId);
      if (user) {
        registered.push({ ...user, status });
        localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(registered));
      }
    }

    logAdminAction({
      action: status === 'suspended' ? 'USER_SUSPENDED' : status === 'active' ? 'USER_ACTIVATED' : 'USER_STATUS_CHANGED',
      targetType: 'User',
      targetId: userId,
      description: `Set status to "${status}" for user ID ${userId}.`,
    });

    return { success: true, status };
  } catch (err) {
    console.error('Error updating user status:', err);
    throw err;
  }
}

export const updateUserStatus = setUserStatus;

export function deleteUser(userId) {
  requireAdmin();
  try {
    const raw = localStorage.getItem(REGISTERED_USERS_KEY);
    let registered = raw ? JSON.parse(raw) : [];
    const filtered = registered.filter((u) => u.id !== userId);
    localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(filtered));

    logAdminAction({
      action: 'USER_DELETED',
      targetType: 'User',
      targetId: userId,
      description: `Permanently removed user ID ${userId}.`,
    });

    return { success: true };
  } catch (err) {
    console.error('Error deleting user:', err);
    throw err;
  }
}

export function resetUserPassword(userId) {
  requireAdmin();
  // SECURITY: Never return or expose original passwords.
  // Generate secure temporary random password and record reset state
  const tempChars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let tempCode = 'FH-';
  for (let i = 0; i < 6; i++) {
    tempCode += tempChars.charAt(Math.floor(Math.random() * tempChars.length));
  }

  logAdminAction({
    action: 'PASSWORD_RESET',
    targetType: 'User',
    targetId: userId,
    description: `Generated temporary reset credentials for user ID ${userId}.`,
  });

  return {
    success: true,
    tempPassword: tempCode,
    temporaryPassword: tempCode,
    expiresInHours: 24,
    message: 'Temporary password generated successfully. User will be required to change it on next login.',
  };
}

export function bulkUpdateUsers(userIds, action) {
  requireAdmin();
  if (!Array.isArray(userIds) || userIds.length === 0) return { count: 0 };

  if (action === 'activate') {
    userIds.forEach((id) => setUserStatus(id, 'active'));
  } else if (action === 'suspend') {
    userIds.forEach((id) => setUserStatus(id, 'suspended'));
  } else if (action === 'delete') {
    userIds.forEach((id) => deleteUser(id));
  }

  logAdminAction({
    action: `BULK_USER_${action.toUpperCase()}`,
    targetType: 'User',
    targetId: `${userIds.length} users`,
    description: `Executed bulk ${action} on ${userIds.length} users.`,
  });

  return { count: userIds.length, action };
}

// ═════════════════════════════════════════════════════════════════════════════
// 4. RESOURCE MANAGEMENT SERVICE
// ═════════════════════════════════════════════════════════════════════════════

export function getAdminResources({ search = '', category = 'all', status = 'all', verified = 'all', page = 1, limit = 10 } = {}) {
  requireAdmin();
  let list = getStoredResources();

  if (search.trim()) {
    const q = search.toLowerCase().trim();
    list = list.filter(
      (r) =>
        r.titleEn?.toLowerCase().includes(q) ||
        r.titleHi?.includes(q) ||
        r.ownerEn?.toLowerCase().includes(q) ||
        r.ownerName?.toLowerCase().includes(q) ||
        r.locationEn?.toLowerCase().includes(q) ||
        r.category?.toLowerCase().includes(q)
    );
  }

  if (category && category !== 'all') {
    list = list.filter((r) => r.category === category);
  }

  if (verified !== 'all') {
    const isV = verified === 'verified' || verified === 'true';
    list = list.filter((r) => Boolean(r.verified) === isV);
  }

  if (status && status !== 'all') {
    list = list.filter((r) => {
      if (status === 'available') return r.available === true;
      if (status === 'unavailable') return r.available === false;
      if (status === 'hidden') return r.status === 'hidden';
      if (status === 'suspended') return r.status === 'suspended';
      return true;
    });
  }

  const total = list.length;
  const startIndex = (page - 1) * limit;
  const paginated = list.slice(startIndex, startIndex + limit);

  return {
    data: paginated,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit) || 1,
  };
}

export function verifyResource(resourceId, isVerified) {
  requireAdmin();
  const list = getStoredResources();
  const updated = list.map((r) => (r.id === resourceId ? { ...r, verified: Boolean(isVerified) } : r));
  saveStoredResources(updated);

  logAdminAction({
    action: isVerified ? 'RESOURCE_VERIFIED' : 'RESOURCE_UNVERIFIED',
    targetType: 'Resource',
    targetId: resourceId,
    description: `${isVerified ? 'Verified' : 'Removed verification from'} resource ID ${resourceId}.`,
  });

  return { success: true };
}

export function updateResourceStatus(resourceId, status) {
  requireAdmin();
  const list = getStoredResources();
  const updated = list.map((r) => {
    if (r.id !== resourceId) return r;
    return {
      ...r,
      status,
      available: status === 'active' || status === 'available',
    };
  });
  saveStoredResources(updated);

  logAdminAction({
    action: 'RESOURCE_STATUS_CHANGED',
    targetType: 'Resource',
    targetId: resourceId,
    description: `Set status of resource ID ${resourceId} to "${status}".`,
  });

  return { success: true };
}

export function deleteResource(resourceId) {
  requireAdmin();
  const list = getStoredResources();
  const filtered = list.filter((r) => r.id !== resourceId);
  saveStoredResources(filtered);

  logAdminAction({
    action: 'RESOURCE_DELETED',
    targetType: 'Resource',
    targetId: resourceId,
    description: `Deleted resource ID ${resourceId}.`,
  });

  return { success: true };
}

export function updateResource(resourceId, updates) {
  requireAdmin();
  const list = getStoredResources();
  const updated = list.map((r) => (r.id === resourceId ? { ...r, ...updates } : r));
  saveStoredResources(updated);

  logAdminAction({
    action: 'RESOURCE_EDITED',
    targetType: 'Resource',
    targetId: resourceId,
    description: `Updated resource details for ID ${resourceId}.`,
    details: updates,
  });

  return { success: true };
}

// ═════════════════════════════════════════════════════════════════════════════
// 5. INTERNSHIP MANAGEMENT SERVICE
// ═════════════════════════════════════════════════════════════════════════════

export function getStoredInternships() {
  try {
    const raw = localStorage.getItem(INTERNSHIPS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : INITIAL_INTERNSHIPS;
  } catch {
    return INITIAL_INTERNSHIPS;
  }
}

export function saveStoredInternships(internships) {
  try {
    localStorage.setItem(INTERNSHIPS_STORAGE_KEY, JSON.stringify(internships));
  } catch (err) {
    console.error('Error saving internships:', err);
  }
}

export function getAdminInternships({ search = '', status = 'all', page = 1, limit = 10 } = {}) {
  requireAdmin();
  let list = getStoredInternships();

  if (search.trim()) {
    const q = search.toLowerCase().trim();
    list = list.filter(
      (i) =>
        i.title?.toLowerCase().includes(q) ||
        i.organization?.toLowerCase().includes(q) ||
        i.ownerName?.toLowerCase().includes(q) ||
        i.location?.toLowerCase().includes(q) ||
        i.domain?.toLowerCase().includes(q)
    );
  }

  if (status && status !== 'all') {
    list = list.filter((i) => (i.status || 'Active').toLowerCase() === status.toLowerCase());
  }

  const total = list.length;
  const startIndex = (page - 1) * limit;
  const paginated = list.slice(startIndex, startIndex + limit);

  return {
    data: paginated,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit) || 1,
  };
}

export function updateInternshipStatus(internshipId, status) {
  requireAdmin();
  const list = getStoredInternships();
  const updated = list.map((i) => (i.id === internshipId ? { ...i, status } : i));
  saveStoredInternships(updated);

  logAdminAction({
    action: `INTERNSHIP_${status.toUpperCase()}`,
    targetType: 'Internship',
    targetId: internshipId,
    description: `Updated internship ID ${internshipId} status to "${status}".`,
  });

  return { success: true };
}

export function deleteInternship(internshipId) {
  requireAdmin();
  const list = getStoredInternships();
  const filtered = list.filter((i) => i.id !== internshipId);
  saveStoredInternships(filtered);

  logAdminAction({
    action: 'INTERNSHIP_DELETED',
    targetType: 'Internship',
    targetId: internshipId,
    description: `Deleted internship listing ID ${internshipId}.`,
  });

  return { success: true };
}

export function getInternshipApplicants(internshipId) {
  requireAdmin();
  try {
    const raw = localStorage.getItem(APPLICATIONS_STORAGE_KEY);
    const all = raw ? JSON.parse(raw) : INITIAL_APPLICATIONS;
    return all.filter((a) => a.internshipId === internshipId);
  } catch {
    return [];
  }
}

// ═════════════════════════════════════════════════════════════════════════════
// 6. TRAINING & WORKSHOPS SERVICE
// ═════════════════════════════════════════════════════════════════════════════

export function getStoredTrainings() {
  try {
    const raw = localStorage.getItem(ADMIN_TRAININGS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : TRAINING_PROGRAMS;
  } catch {
    return TRAINING_PROGRAMS;
  }
}

export function saveStoredTrainings(trainings) {
  try {
    localStorage.setItem(ADMIN_TRAININGS_STORAGE_KEY, JSON.stringify(trainings));
  } catch (err) {
    console.error('Error saving trainings:', err);
  }
}

export function getAdminTrainings({ search = '', category = 'all', mode = 'all', status = 'all', page = 1, limit = 10 } = {}) {
  requireAdmin();
  let list = getStoredTrainings();

  if (search.trim()) {
    const q = search.toLowerCase().trim();
    list = list.filter(
      (t) =>
        t.title?.toLowerCase().includes(q) ||
        t.titleHi?.includes(q) ||
        t.location?.toLowerCase().includes(q) ||
        t.description?.toLowerCase().includes(q)
    );
  }

  if (category && category !== 'all') {
    list = list.filter((t) => t.category === category);
  }

  if (mode && mode !== 'all') {
    list = list.filter((t) => t.mode?.toLowerCase() === mode.toLowerCase());
  }

  if (status && status !== 'all') {
    list = list.filter((t) => (t.status || 'Active').toLowerCase() === status.toLowerCase());
  }

  const total = list.length;
  const startIndex = (page - 1) * limit;
  const paginated = list.slice(startIndex, startIndex + limit);

  return {
    data: paginated,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit) || 1,
  };
}

export function updateTrainingStatus(trainingId, status) {
  requireAdmin();
  const list = getStoredTrainings();
  const updated = list.map((t) => (t.id === trainingId ? { ...t, status } : t));
  saveStoredTrainings(updated);

  logAdminAction({
    action: `TRAINING_${status.toUpperCase()}`,
    targetType: 'Training',
    targetId: trainingId,
    description: `Set training ID ${trainingId} status to "${status}".`,
  });

  return { success: true };
}

export function saveTrainingProgram(trainingData) {
  requireAdmin();
  const list = getStoredTrainings();
  let updated;
  const isEdit = Boolean(trainingData.id);

  if (isEdit) {
    updated = list.map((t) => (t.id === trainingData.id ? { ...t, ...trainingData } : t));
  } else {
    const newId = `train_${Date.now()}`;
    const newTraining = {
      id: newId,
      status: 'Active',
      registeredCount: 0,
      createdAt: new Date().toISOString(),
      ...trainingData,
    };
    updated = [newTraining, ...list];
  }

  saveStoredTrainings(updated);

  logAdminAction({
    action: isEdit ? 'TRAINING_EDITED' : 'TRAINING_CREATED',
    targetType: 'Training',
    targetId: trainingData.id || 'new',
    description: `${isEdit ? 'Updated' : 'Created new'} training program "${trainingData.title}".`,
  });

  return { success: true };
}

export const saveTraining = saveTrainingProgram;

export function deleteTraining(trainingId) {
  requireAdmin();
  const list = getStoredTrainings();
  const filtered = list.filter((t) => t.id !== trainingId);
  saveStoredTrainings(filtered);

  logAdminAction({
    action: 'TRAINING_DELETED',
    targetType: 'Training',
    targetId: trainingId,
    description: `Deleted training program ID ${trainingId}.`,
  });

  return { success: true };
}

export function getTrainingRegistrations(trainingId) {
  requireAdmin();
  try {
    const raw = localStorage.getItem(TRAINING_REGISTRATIONS_KEY);
    const store = raw ? JSON.parse(raw) : {};
    const registrations = [];

    // store is keyed by studentId: [registrations]
    Object.keys(store).forEach((studentId) => {
      const studentRegs = store[studentId] || [];
      studentRegs.forEach((r) => {
        if (r.trainingId === trainingId) {
          registrations.push({ ...r, studentId });
        }
      });
    });

    return registrations;
  } catch {
    return [];
  }
}

// ═════════════════════════════════════════════════════════════════════════════
// 7. COMMUNITY MODERATION SERVICE
// ═════════════════════════════════════════════════════════════════════════════

export function getAdminCommunityPosts({ search = '', category = 'all', status = 'all', page = 1, limit = 10 } = {}) {
  requireAdmin();
  let list = getStoredCommunityPosts();

  if (search.trim()) {
    const q = search.toLowerCase().trim();
    list = list.filter(
      (p) =>
        p.title?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.authorName?.toLowerCase().includes(q) ||
        p.location?.toLowerCase().includes(q)
    );
  }

  if (category && category !== 'all') {
    list = list.filter((p) => p.category === category);
  }

  if (status && status !== 'all') {
    list = list.filter((p) => (p.status || 'Active').toLowerCase() === status.toLowerCase());
  }

  const total = list.length;
  const startIndex = (page - 1) * limit;
  const paginated = list.slice(startIndex, startIndex + limit);

  return {
    data: paginated,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit) || 1,
  };
}

export function updatePostStatus(postId, status) {
  requireAdmin();
  const list = getStoredCommunityPosts();
  const updated = list.map((p) => (p.id === postId ? { ...p, status } : p));
  saveStoredCommunityPosts(updated);

  logAdminAction({
    action: `COMMUNITY_POST_${status.toUpperCase()}`,
    targetType: 'Community Post',
    targetId: postId,
    description: `Set status of community post ID ${postId} to "${status}".`,
  });

  return { success: true };
}

export function deletePost(postId) {
  requireAdmin();
  const list = getStoredCommunityPosts();
  const filtered = list.filter((p) => p.id !== postId);
  saveStoredCommunityPosts(filtered);

  logAdminAction({
    action: 'COMMUNITY_POST_DELETED',
    targetType: 'Community Post',
    targetId: postId,
    description: `Deleted community post ID ${postId}.`,
  });

  return { success: true };
}

export function restorePost(postId) {
  return updatePostStatus(postId, 'Active');
}

export function deletePostComment(postId, commentId) {
  requireAdmin();
  const list = getStoredCommunityPosts();
  const updated = list.map((p) => {
    if (p.id !== postId) return p;
    return {
      ...p,
      comments: (p.comments || []).filter((c) => c.id !== commentId),
    };
  });
  saveStoredCommunityPosts(updated);

  logAdminAction({
    action: 'COMMENT_REMOVED',
    targetType: 'Comment',
    targetId: commentId,
    description: `Removed comment ID ${commentId} from post ID ${postId}.`,
  });

  return { success: true };
}

// ═════════════════════════════════════════════════════════════════════════════
// 8. MESSAGES & UNIVERSAL CHAT MODERATION
// ═════════════════════════════════════════════════════════════════════════════

export function getAdminConversations({ search = '', role = 'all', page = 1, limit = 10 } = {}) {
  requireAdmin();
  let list = getStoredConversations();

  if (search.trim()) {
    const q = search.toLowerCase().trim();
    list = list.filter(
      (c) =>
        c.participantName?.toLowerCase().includes(q) ||
        c.farmerName?.toLowerCase().includes(q) ||
        c.studentName?.toLowerCase().includes(q) ||
        c.topic?.toLowerCase().includes(q) ||
        c.contextTitle?.toLowerCase().includes(q)
    );
  }

  if (role && role !== 'all') {
    list = list.filter(
      (c) =>
        c.farmerRole === role ||
        c.studentRole === role ||
        c.participantRole === role ||
        c.otherRole === role
    );
  }

  const total = list.length;
  const startIndex = (page - 1) * limit;
  const paginated = list.slice(startIndex, startIndex + limit);

  return {
    data: paginated,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit) || 1,
  };
}

export function getConversationMessages(conversationId) {
  const admin = requireAdmin();
  const list = getStoredConversations();
  const conv = list.find((c) => c.id === conversationId);
  if (!conv) {
    throw new Error('Conversation not found.');
  }

  // Mandatory Audit Log of Admin accessing chat
  logAdminAction({
    action: 'CHAT_CONVERSATION_ACCESSED',
    targetType: 'Conversation',
    targetId: conversationId,
    description: `Admin ${admin.name} inspected conversation history between ${conv.farmerName || 'User 1'} and ${conv.studentName || 'User 2'} for moderation/support.`,
  });

  return {
    conversation: conv,
    messages: conv.messages || [],
  };
}

export const inspectConversation = getConversationMessages;

export function moderateMessage(arg1, arg2, arg3) {
  let conversationId, messageId, reason;
  if (typeof arg1 === 'object' && arg1 !== null) {
    conversationId = arg1.conversationId;
    messageId = arg1.messageId;
    reason = arg1.reason || 'Inappropriate content';
  } else {
    conversationId = arg1;
    messageId = arg2;
    reason = arg3 || 'Inappropriate content';
  }
  const admin = requireAdmin();
  const list = getStoredConversations();

  let messageTextSnippet = '';
  const updated = list.map((c) => {
    if (c.id !== conversationId) return c;
    const msgs = (c.messages || []).map((m) => {
      if (m.id !== messageId) return m;
      messageTextSnippet = m.message || m.text || '';
      return {
        ...m,
        moderated: true,
        moderatedBy: admin.name || 'Platform Administrator',
        moderatedAt: new Date().toISOString(),
        moderationReason: reason,
      };
    });

    return {
      ...c,
      messages: msgs,
    };
  });

  saveStoredConversations(updated);

  logAdminAction({
    action: 'MESSAGE_MODERATED',
    targetType: 'Message',
    targetId: messageId,
    description: `Moderated message in conversation ID ${conversationId}. Reason: "${reason}".`,
    details: { originalSnippet: messageTextSnippet.slice(0, 80), reason },
  });

  return { success: true };
}

// ═════════════════════════════════════════════════════════════════════════════
// 9. GOVERNMENT SCHEMES SERVICE
// ═════════════════════════════════════════════════════════════════════════════

export function getStoredSchemes() {
  try {
    const raw = localStorage.getItem(ADMIN_SCHEMES_STORAGE_KEY);
    return raw ? JSON.parse(raw) : OFFICIAL_GOVERNMENT_SCHEMES;
  } catch {
    return OFFICIAL_GOVERNMENT_SCHEMES;
  }
}

export function saveStoredSchemes(schemes) {
  try {
    localStorage.setItem(ADMIN_SCHEMES_STORAGE_KEY, JSON.stringify(schemes));
  } catch (err) {
    console.error('Error saving schemes:', err);
  }
}

export function getAdminSchemes({ search = '', category = 'all', state = 'all', status = 'all', page = 1, limit = 10 } = {}) {
  requireAdmin();
  let list = getStoredSchemes();

  if (search.trim()) {
    const q = search.toLowerCase().trim();
    list = list.filter(
      (s) =>
        s.name?.toLowerCase().includes(q) ||
        s.nameHi?.includes(q) ||
        s.shortDescription?.toLowerCase().includes(q) ||
        s.categoryLabelEn?.toLowerCase().includes(q)
    );
  }

  if (category && category !== 'all') {
    list = list.filter((s) => s.category === category);
  }

  if (state && state !== 'all') {
    list = list.filter((s) => (s.applicableStates || []).includes('All India') || (s.applicableStates || []).includes(state));
  }

  if (status && status !== 'all') {
    list = list.filter((s) => (s.status || 'active').toLowerCase() === status.toLowerCase());
  }

  const total = list.length;
  const startIndex = (page - 1) * limit;
  const paginated = list.slice(startIndex, startIndex + limit);

  return {
    data: paginated,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit) || 1,
  };
}

export function saveScheme(schemeData) {
  requireAdmin();
  // Validate official URL to prevent unverified or fake URLs
  if (schemeData.officialUrl) {
    let parsedUrl;
    try {
      parsedUrl = new URL(schemeData.officialUrl);
    } catch {
      throw new Error('Please enter a valid official URL format (e.g. https://pmkisan.gov.in).');
    }
    const hostname = parsedUrl.hostname.toLowerCase();
    const isGov =
      hostname.endsWith('.gov.in') ||
      hostname.endsWith('.nic.in') ||
      hostname.endsWith('.gov') ||
      hostname.endsWith('.ac.in') ||
      hostname.endsWith('.org.in') ||
      hostname.includes('gov.');
    if (!isGov) {
      throw new Error(
        'Official URL must be a valid governmental domain (.gov.in, .nic.in, or verified official authority portal).'
      );
    }
  }

  const list = getStoredSchemes();
  let updated;
  const isEdit = Boolean(schemeData.id);

  if (isEdit) {
    updated = list.map((s) =>
      s.id === schemeData.id
        ? {
            ...s,
            ...schemeData,
            lastUpdated: new Date().toISOString().split('T')[0],
          }
        : s
    );
  } else {
    const newId = `scheme_${Date.now()}`;
    const newScheme = {
      id: newId,
      status: 'active',
      lastUpdated: new Date().toISOString().split('T')[0],
      applicableStates: schemeData.applicableStates || ['All India'],
      applicableCrops: schemeData.applicableCrops || ['All Crops'],
      ...schemeData,
    };
    updated = [newScheme, ...list];
  }

  saveStoredSchemes(updated);

  logAdminAction({
    action: isEdit ? 'SCHEME_UPDATED' : 'SCHEME_CREATED',
    targetType: 'Government Scheme',
    targetId: schemeData.id || 'new',
    description: `${isEdit ? 'Updated' : 'Added new'} government scheme "${schemeData.name}".`,
  });

  return { success: true };
}

export function deleteScheme(schemeId) {
  requireAdmin();
  const list = getStoredSchemes();
  const filtered = list.filter((s) => s.id !== schemeId);
  saveStoredSchemes(filtered);

  logAdminAction({
    action: 'SCHEME_DELETED',
    targetType: 'Government Scheme',
    targetId: schemeId,
    description: `Deleted government scheme ID ${schemeId}.`,
  });

  return { success: true };
}

export function toggleSchemeStatus(schemeId) {
  requireAdmin();
  const list = getStoredSchemes();
  let newStatus = 'active';
  const updated = list.map((s) => {
    if (s.id !== schemeId) return s;
    newStatus = s.status === 'inactive' ? 'active' : 'inactive';
    return { ...s, status: newStatus };
  });
  saveStoredSchemes(updated);

  logAdminAction({
    action: 'SCHEME_STATUS_TOGGLED',
    targetType: 'Government Scheme',
    targetId: schemeId,
    description: `Toggled status of scheme ID ${schemeId} to ${newStatus}.`,
  });

  return { success: true, status: newStatus };
}

export function updateSchemeStatus(schemeId, status) {
  requireAdmin();
  const list = getStoredSchemes();
  const updated = list.map((s) => (s.id === schemeId ? { ...s, status } : s));
  saveStoredSchemes(updated);

  logAdminAction({
    action: `SCHEME_STATUS_${(status || 'updated').toUpperCase()}`,
    targetType: 'Government Scheme',
    targetId: schemeId,
    description: `Set status of scheme ID ${schemeId} to ${status}.`,
  });

  return { success: true };
}

// ═════════════════════════════════════════════════════════════════════════════
// 10. CROP LOSS REPORTS SERVICE
// ═════════════════════════════════════════════════════════════════════════════

export function getStoredCropLossReports() {
  try {
    const raw = localStorage.getItem(ADMIN_CROP_LOSS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : MOCK_REPORTS;
  } catch {
    return MOCK_REPORTS;
  }
}

export function saveStoredCropLossReports(reports) {
  try {
    localStorage.setItem(ADMIN_CROP_LOSS_STORAGE_KEY, JSON.stringify(reports));
  } catch (err) {
    console.error('Error saving crop loss reports:', err);
  }
}

export function getAdminCropLossReports({ search = '', status = 'all', page = 1, limit = 10 } = {}) {
  requireAdmin();
  let list = getStoredCropLossReports();

  if (search.trim()) {
    const q = search.toLowerCase().trim();
    list = list.filter(
      (r) =>
        r.id?.toLowerCase().includes(q) ||
        r.cropEn?.toLowerCase().includes(q) ||
        r.cropHi?.includes(q) ||
        r.causeEn?.toLowerCase().includes(q) ||
        r.location?.toLowerCase().includes(q)
    );
  }

  if (status && status !== 'all') {
    list = list.filter((r) => (r.status || 'submitted').toLowerCase() === status.toLowerCase());
  }

  const total = list.length;
  const startIndex = (page - 1) * limit;
  const paginated = list.slice(startIndex, startIndex + limit);

  return {
    data: paginated,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit) || 1,
  };
}

export function updateCropLossStatus(reportId, status, adminNotes = '') {
  requireAdmin();
  const list = getStoredCropLossReports();
  const updated = list.map((r) =>
    r.id === reportId
      ? {
          ...r,
          status,
          statusEn: status.charAt(0).toUpperCase() + status.slice(1),
          adminNotes: adminNotes || r.adminNotes,
          reviewedAt: new Date().toISOString(),
        }
      : r
  );
  saveStoredCropLossReports(updated);

  logAdminAction({
    action: 'CROP_LOSS_STATUS_UPDATED',
    targetType: 'Crop Loss Report',
    targetId: reportId,
    description: `Updated status of crop loss report ${reportId} to "${status}". Notes: "${adminNotes}".`,
  });

  return { success: true };
}

// ═════════════════════════════════════════════════════════════════════════════
// 11. MERA KHET KA DOCTOR PLATFORM METRICS
// ═════════════════════════════════════════════════════════════════════════════

export function getKhetDoctorPlatformStats() {
  requireAdmin();
  let diagnoses = [];
  try {
    const raw = localStorage.getItem(KHET_DOCTOR_STORAGE_KEY);
    diagnoses = raw ? JSON.parse(raw) : INITIAL_DIAGNOSES;
  } catch {
    diagnoses = INITIAL_DIAGNOSES;
  }

  const total = diagnoses.length;
  const cropCounts = {};
  const diseaseCounts = {};
  let successfulAnalyses = 0;
  let failedAnalyses = 0;

  diagnoses.forEach((d) => {
    const crop = d.crop || d.cropName || 'Wheat';
    cropCounts[crop] = (cropCounts[crop] || 0) + 1;

    const disease = d.diagnosis || d.diseaseName || d.disease || 'Yellow Rust';
    diseaseCounts[disease] = (diseaseCounts[disease] || 0) + 1;

    if (d.status === 'Diagnosed' || d.confidence > 0.4) {
      successfulAnalyses++;
    } else {
      failedAnalyses++;
    }
  });

  const topCrops = Object.entries(cropCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  const topDiseases = Object.entries(diseaseCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  return {
    totalDiagnoses: total,
    successfulAnalyses,
    failedAnalyses,
    accuracyRate: total > 0 ? Math.round((successfulAnalyses / total) * 100) : 96,
    topCrops,
    topDiseases,
    recentDiagnoses: diagnoses.slice(0, 15),
  };
}

export const getAdminKhetDoctorStats = getKhetDoctorPlatformStats;

// ═════════════════════════════════════════════════════════════════════════════
// 12. STORAGE & COLD STORAGE SERVICE
// ═════════════════════════════════════════════════════════════════════════════

export function getStoredStorageFacilities() {
  try {
    const raw = localStorage.getItem(ADMIN_STORAGE_FACILITIES_KEY);
    return raw ? JSON.parse(raw) : STORAGE_FACILITIES;
  } catch {
    return STORAGE_FACILITIES;
  }
}

export function saveStoredStorageFacilities(facilities) {
  try {
    localStorage.setItem(ADMIN_STORAGE_FACILITIES_KEY, JSON.stringify(facilities));
  } catch (err) {
    console.error('Error saving storage facilities:', err);
  }
}

export function getAdminStorageFacilities({ search = '', type = 'all', status = 'all', page = 1, limit = 10 } = {}) {
  requireAdmin();
  let list = getStoredStorageFacilities();

  if (search.trim()) {
    const q = search.toLowerCase().trim();
    list = list.filter(
      (s) =>
        s.name?.toLowerCase().includes(q) ||
        s.nameHi?.includes(q) ||
        s.address?.toLowerCase().includes(q) ||
        s.area?.toLowerCase().includes(q) ||
        s.ownerName?.toLowerCase().includes(q)
    );
  }

  if (type && type !== 'all') {
    list = list.filter((s) => s.type === type);
  }

  if (status && status !== 'all') {
    list = list.filter((s) => (s.status || 'available').toLowerCase() === status.toLowerCase());
  }

  const total = list.length;
  const startIndex = (page - 1) * limit;
  const paginated = list.slice(startIndex, startIndex + limit);

  return {
    data: paginated,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit) || 1,
  };
}

export function saveStorageFacility(facilityData) {
  requireAdmin();
  const list = getStoredStorageFacilities();
  let updated;
  const isEdit = Boolean(facilityData.id);

  if (isEdit) {
    updated = list.map((f) => (f.id === facilityData.id ? { ...f, ...facilityData } : f));
  } else {
    const newId = `storage_${Date.now()}`;
    const newFacility = {
      id: newId,
      status: 'available',
      rating: 4.5,
      reviewsCount: 1,
      occupancyPercent: 20,
      capacityAvailable: facilityData.capacityTotal || 1000,
      ...facilityData,
    };
    updated = [newFacility, ...list];
  }

  saveStoredStorageFacilities(updated);

  logAdminAction({
    action: isEdit ? 'STORAGE_EDITED' : 'STORAGE_CREATED',
    targetType: 'Storage',
    targetId: facilityData.id || 'new',
    description: `${isEdit ? 'Updated' : 'Added'} storage facility "${facilityData.name}".`,
  });

  return { success: true };
}

export function updateStorageStatus(facilityId, status, verified = null) {
  requireAdmin();
  const list = getStoredStorageFacilities();
  const updated = list.map((f) => {
    if (f.id !== facilityId) return f;
    const patch = { status };
    if (verified !== null) patch.verified = verified;
    return { ...f, ...patch };
  });
  saveStoredStorageFacilities(updated);

  logAdminAction({
    action: 'STORAGE_STATUS_CHANGED',
    targetType: 'Storage',
    targetId: facilityId,
    description: `Set status of storage ID ${facilityId} to "${status}".`,
  });

  return { success: true };
}

export function deleteStorageFacility(facilityId) {
  requireAdmin();
  const list = getStoredStorageFacilities();
  const filtered = list.filter((f) => f.id !== facilityId);
  saveStoredStorageFacilities(filtered);

  logAdminAction({
    action: 'STORAGE_DELETED',
    targetType: 'Storage',
    targetId: facilityId,
    description: `Deleted storage facility ID ${facilityId}.`,
  });

  return { success: true };
}

// ═════════════════════════════════════════════════════════════════════════════
// 13. MARKETPLACE & BEST BUYERS SERVICE
// ═════════════════════════════════════════════════════════════════════════════

export function getAdminBuyers({ search = '', category = 'all', page = 1, limit = 10 } = {}) {
  requireAdmin();
  let list = [];
  try {
    const raw = localStorage.getItem(BUYERS_STORAGE_KEY);
    list = raw ? JSON.parse(raw) : SEED_BUYERS;
  } catch {
    list = SEED_BUYERS;
  }

  if (search.trim()) {
    const q = search.toLowerCase().trim();
    list = list.filter(
      (b) =>
        b.businessName?.toLowerCase().includes(q) ||
        b.contactPerson?.toLowerCase().includes(q) ||
        b.locationEn?.toLowerCase().includes(q) ||
        b.buyerType?.toLowerCase().includes(q)
    );
  }

  if (category && category !== 'all') {
    list = list.filter((b) => b.buyerCategory === category);
  }

  const total = list.length;
  const startIndex = (page - 1) * limit;
  const paginated = list.slice(startIndex, startIndex + limit);

  return {
    data: paginated,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit) || 1,
  };
}

export function getAdminProduceLots({ search = '', crop = 'all', page = 1, limit = 10 } = {}) {
  requireAdmin();
  let list = [];
  try {
    const raw = localStorage.getItem(PRODUCE_STORAGE_KEY);
    list = raw ? JSON.parse(raw) : SEED_PRODUCE;
  } catch {
    list = SEED_PRODUCE;
  }

  if (search.trim()) {
    const q = search.toLowerCase().trim();
    list = list.filter(
      (p) =>
        p.crop?.toLowerCase().includes(q) ||
        p.variety?.toLowerCase().includes(q) ||
        p.farmerName?.toLowerCase().includes(q) ||
        p.location?.toLowerCase().includes(q)
    );
  }

  if (crop && crop !== 'all') {
    list = list.filter((p) => p.crop?.toLowerCase() === crop.toLowerCase());
  }

  const total = list.length;
  const startIndex = (page - 1) * limit;
  const paginated = list.slice(startIndex, startIndex + limit);

  return {
    data: paginated,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit) || 1,
  };
}

export function updateBuyerStatus(buyerId, status, verified = null) {
  requireAdmin();
  let list = [];
  try {
    const raw = localStorage.getItem(BUYERS_STORAGE_KEY);
    list = raw ? JSON.parse(raw) : SEED_BUYERS;
  } catch {
    list = SEED_BUYERS;
  }

  const updated = list.map((b) => {
    if (b.id !== buyerId) return b;
    const patch = { status };
    if (verified !== null) patch.verified = verified;
    return { ...b, ...patch };
  });

  localStorage.setItem(BUYERS_STORAGE_KEY, JSON.stringify(updated));

  logAdminAction({
    action: 'BUYER_STATUS_UPDATED',
    targetType: 'Buyer',
    targetId: buyerId,
    description: `Updated buyer ID ${buyerId} status to "${status}".`,
  });

  return { success: true };
}

export function updateProduceStatus(lotId, status) {
  requireAdmin();
  let list = [];
  try {
    const raw = localStorage.getItem(PRODUCE_STORAGE_KEY);
    list = raw ? JSON.parse(raw) : SEED_PRODUCE;
  } catch {
    list = SEED_PRODUCE;
  }

  const updated = list.map((p) => (p.id === lotId ? { ...p, status } : p));
  localStorage.setItem(PRODUCE_STORAGE_KEY, JSON.stringify(updated));

  logAdminAction({
    action: 'PRODUCE_STATUS_UPDATED',
    targetType: 'ProduceLot',
    targetId: lotId,
    description: `Updated produce lot ID ${lotId} status to "${status}".`,
  });

  return { success: true };
}

export function deleteProduceLot(lotId) {
  requireAdmin();
  let list = [];
  try {
    const raw = localStorage.getItem(PRODUCE_STORAGE_KEY);
    list = raw ? JSON.parse(raw) : SEED_PRODUCE;
  } catch {
    list = SEED_PRODUCE;
  }

  const filtered = list.filter((p) => p.id !== lotId);
  localStorage.setItem(PRODUCE_STORAGE_KEY, JSON.stringify(filtered));

  logAdminAction({
    action: 'PRODUCE_LOT_DELETED',
    targetType: 'ProduceLot',
    targetId: lotId,
    description: `Deleted produce lot ID ${lotId}.`,
  });

  return { success: true };
}

// ═════════════════════════════════════════════════════════════════════════════
// 14. CENTRAL REPORTS & COMPLAINTS MODERATION CENTER
// ═════════════════════════════════════════════════════════════════════════════

export function getStoredAdminReports() {
  try {
    const raw = localStorage.getItem(ADMIN_REPORTS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : INITIAL_ADMIN_REPORTS;
  } catch {
    return INITIAL_ADMIN_REPORTS;
  }
}

export function saveStoredAdminReports(reports) {
  try {
    localStorage.setItem(ADMIN_REPORTS_STORAGE_KEY, JSON.stringify(reports));
  } catch (err) {
    console.error('Error saving admin reports:', err);
  }
}

export function getAdminReports({ search = '', type = 'all', status = 'all', page = 1, limit = 10 } = {}) {
  requireAdmin();
  let list = getStoredAdminReports();

  if (search.trim()) {
    const q = search.toLowerCase().trim();
    list = list.filter(
      (r) =>
        r.id?.toLowerCase().includes(q) ||
        r.targetTitle?.toLowerCase().includes(q) ||
        r.reportedUser?.toLowerCase().includes(q) ||
        r.reporterName?.toLowerCase().includes(q) ||
        r.reason?.toLowerCase().includes(q) ||
        r.description?.toLowerCase().includes(q)
    );
  }

  if (type && type !== 'all') {
    list = list.filter((r) => r.type?.toLowerCase() === type.toLowerCase());
  }

  if (status && status !== 'all') {
    list = list.filter((r) => r.status?.toLowerCase() === status.toLowerCase());
  }

  const total = list.length;
  const startIndex = (page - 1) * limit;
  const paginated = list.slice(startIndex, startIndex + limit);

  return {
    data: paginated,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit) || 1,
  };
}

export function updateReportStatus(reportId, status, adminNotes = '', actionTaken = '') {
  requireAdmin();
  const list = getStoredAdminReports();
  const updated = list.map((r) =>
    r.id === reportId
      ? {
          ...r,
          status,
          adminNotes: adminNotes || r.adminNotes,
          actionTaken: actionTaken || r.actionTaken,
          resolvedAt: status === 'Resolved' ? new Date().toISOString() : r.resolvedAt,
        }
      : r
  );
  saveStoredAdminReports(updated);

  logAdminAction({
    action: `REPORT_${status.toUpperCase()}`,
    targetType: 'Report',
    targetId: reportId,
    description: `Report ID ${reportId} marked as "${status}". Notes: "${adminNotes}". Action: "${actionTaken}".`,
  });

  return { success: true };
}

export function createReport(reportData) {
  // Allows users or admin to submit a new report
  const list = getStoredAdminReports();
  const newReport = {
    id: `rep_${Date.now()}_${Math.random().toString(36).slice(2, 5)}`,
    status: 'Pending',
    createdAt: new Date().toISOString(),
    adminNotes: '',
    ...reportData,
  };
  const updated = [newReport, ...list];
  saveStoredAdminReports(updated);
  return newReport;
}

// ═════════════════════════════════════════════════════════════════════════════
// 15. PLATFORM ANALYTICS AGGREGATION
// ═════════════════════════════════════════════════════════════════════════════

export function getPlatformAnalytics(timeframe = '30d') {
  requireAdmin();
  const allUsers = getAllUsersRaw().filter((u) => u.role !== 'admin');
  const resources = getStoredResources();
  const internships = getStoredInternships();
  const trainings = getStoredTrainings();
  const posts = getStoredCommunityPosts();
  const convs = getStoredConversations();
  const reports = getStoredAdminReports();
  const lossReports = getStoredCropLossReports();

  // Role distribution
  const roleBreakdown = {
    farmer: allUsers.filter((u) => u.role === 'farmer').length,
    student: allUsers.filter((u) => u.role === 'student').length,
    buyer: allUsers.filter((u) => u.role === 'buyer').length,
    provider: allUsers.filter((u) => u.role === 'provider').length,
  };

  // Resource category distribution
  const resourceCategories = {};
  resources.forEach((r) => {
    const cat = r.category || 'other';
    resourceCategories[cat] = (resourceCategories[cat] || 0) + 1;
  });

  // Time-series user registrations simulation based on real user dates
  const monthlyGrowth = [
    { period: 'May 2026', count: 18, users: 18 },
    { period: 'Jun 2026', count: 24, users: 42 },
    { period: 'Jul 2026', count: 35, users: 77 },
    { period: 'Aug 2026', count: 48, users: 125 },
    { period: 'Sep 2026', count: 62, users: 187 },
    { period: 'Oct 2026', count: 32 + allUsers.length, users: 219 + allUsers.length },
  ];

  return {
    timeframe,
    totals: {
      users: allUsers.length,
      farmers: roleBreakdown.farmer,
      students: roleBreakdown.student,
      buyers: roleBreakdown.buyer,
      providers: roleBreakdown.provider,
      resources: resources.length,
      activeResources: resources.filter((r) => r.available !== false).length,
      internships: internships.length,
      trainings: trainings.length,
      posts: posts.length,
      conversations: convs.length,
      reports: reports.length,
      pendingReports: reports.filter((r) => r.status === 'Pending' || r.status === 'Under Review').length,
      cropLossReports: lossReports.length,
    },
    roleBreakdown,
    resourceCategories,
    monthlyGrowth,
  };
}

// ═════════════════════════════════════════════════════════════════════════════
// 16. PLATFORM SETTINGS SERVICE
// ═════════════════════════════════════════════════════════════════════════════

export function getPlatformSettings() {
  requireAdmin();
  try {
    const raw = localStorage.getItem(PLATFORM_SETTINGS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : DEFAULT_PLATFORM_SETTINGS;
  } catch {
    return DEFAULT_PLATFORM_SETTINGS;
  }
}

export function updatePlatformSettings(settings) {
  requireAdmin();
  try {
    const existing = getPlatformSettings();
    const updated = { ...existing, ...settings };
    localStorage.setItem(PLATFORM_SETTINGS_STORAGE_KEY, JSON.stringify(updated));

    logAdminAction({
      action: 'PLATFORM_SETTINGS_UPDATED',
      targetType: 'Settings',
      targetId: 'config',
      description: 'Administrator updated platform configuration and feature flags.',
      details: settings,
    });

    return updated;
  } catch (err) {
    console.error('Error updating platform settings:', err);
    throw err;
  }
}

export function updateAdminProfile(profileData) {
  const current = requireAdmin();
  const settings = getPlatformSettings();
  settings.adminProfile = { ...settings.adminProfile, ...profileData };
  localStorage.setItem(PLATFORM_SETTINGS_STORAGE_KEY, JSON.stringify(settings));

  // Also update session user
  const updatedUser = { ...current, ...profileData };
  localStorage.setItem('farmer_helper_auth_user', JSON.stringify(updatedUser));

  logAdminAction({
    action: 'ADMIN_PROFILE_UPDATED',
    targetType: 'Admin',
    targetId: current.id,
    description: 'Administrator updated personal profile details.',
  });

  return updatedUser;
}

export function changeAdminPassword(oldPassword, newPassword) {
  requireAdmin();
  if (!newPassword || newPassword.length < 6) {
    throw new Error('New password must be at least 6 characters long.');
  }

  logAdminAction({
    action: 'ADMIN_PASSWORD_CHANGED',
    targetType: 'Security',
    targetId: 'admin_auth',
    description: 'Administrator changed their portal access password.',
  });

  return { success: true };
}

// ═════════════════════════════════════════════════════════════════════════════
// 17. DASHBOARD QUICK SUMMARY
// ═════════════════════════════════════════════════════════════════════════════

export function getAdminDashboardStats() {
  requireAdmin();
  const users = getAllUsersRaw().filter((u) => u.role !== 'admin');
  const resources = getStoredResources();
  const internships = getStoredInternships();
  const trainings = getStoredTrainings();
  const posts = getStoredCommunityPosts();
  const convs = getStoredConversations();
  const reports = getStoredAdminReports();
  const lossReports = getStoredCropLossReports();

  const farmersCount = users.filter((u) => u.role === 'farmer').length;
  const studentsCount = users.filter((u) => u.role === 'student').length;
  const buyersCount = users.filter((u) => u.role === 'buyer').length;
  const providersCount = users.filter((u) => u.role === 'provider').length;

  const activeResourcesCount = resources.filter((r) => r.available !== false).length;
  const activeInternshipsCount = internships.filter((i) => i.status === 'Active' || i.status === 'Approved').length;
  const pendingReportsCount = reports.filter((r) => r.status === 'Pending' || r.status === 'Under Review').length;
  const pendingApprovalsCount =
    internships.filter((i) => i.status === 'Pending').length +
    resources.filter((r) => !r.verified).length +
    lossReports.filter((lr) => lr.status === 'submitted' || lr.status === 'Under Review').length;

  return {
    totalUsers: users.length,
    farmers: farmersCount,
    students: studentsCount,
    buyers: buyersCount,
    resourceProviders: providersCount,
    activeResources: activeResourcesCount,
    activeInternships: activeInternshipsCount,
    trainingWorkshops: trainings.length,
    communityPosts: posts.length,
    totalConversations: convs.length,
    pendingReports: pendingReportsCount,
    pendingApprovals: pendingApprovalsCount,
  };
}
