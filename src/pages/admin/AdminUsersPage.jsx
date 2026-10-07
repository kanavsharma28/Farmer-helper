import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminTable from '../../components/admin/AdminTable';
import AdminConfirmModal from '../../components/admin/AdminConfirmModal';
import {
  getAdminUsers,
  getUserDetails,
  updateUser,
  setUserStatus,
  deleteUser,
  resetUserPassword,
  bulkUpdateUsers,
} from '../../services/adminService';

export default function AdminUsersPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const roleFromUrl = searchParams.get('role') || 'all';

  const [lang, setLang] = useState('en');
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState(roleFromUrl);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Selection & Bulk
  const [selectedIds, setSelectedIds] = useState([]);

  // Modals state
  const [profileUser, setProfileUser] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [resetPasswordResult, setResetPasswordResult] = useState(null);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null,
    isDestructive: false,
  });

  // Sync role with URL ?role=
  useEffect(() => {
    const r = searchParams.get('role') || 'all';
    setSelectedRole(r);
    setPage(1);
  }, [searchParams]);

  const loadUsers = useCallback(() => {
    setIsLoading(true);
    setError(null);
    try {
      const res = getAdminUsers({
        search: searchQuery,
        role: selectedRole,
        status: selectedStatus,
        page,
        limit,
      });
      setUsers(res.data);
      setTotal(res.total);
      setTotalPages(res.totalPages);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err.message || 'Unable to load user accounts.');
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, selectedRole, selectedStatus, page, limit]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // Bulk actions
  const handleSelectAll = () => {
    if (selectedIds.length === users.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(users.map((u) => u.id));
    }
  };

  const handleSelectItem = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleBulkAction = (action, ids) => {
    setConfirmModal({
      isOpen: true,
      title: `Bulk ${action.toUpperCase()} Users`,
      message: `Are you sure you want to ${action} ${ids.length} selected users?`,
      isDestructive: action === 'delete' || action === 'suspend',
      onConfirm: () => {
        bulkUpdateUsers(ids, action);
        setSelectedIds([]);
        setConfirmModal({ isOpen: false });
        loadUsers();
      },
    });
  };

  // Single user actions
  const handleViewProfile = (user) => {
    try {
      const full = getUserDetails(user.id);
      setProfileUser(full);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleStatusToggle = (user) => {
    const nextStatus = user.status === 'suspended' ? 'active' : 'suspended';
    setConfirmModal({
      isOpen: true,
      title: `${nextStatus === 'suspended' ? 'Suspend' : 'Activate'} User`,
      message: `Are you sure you want to set user ${user.name} to ${nextStatus}?`,
      isDestructive: nextStatus === 'suspended',
      onConfirm: () => {
        setUserStatus(user.id, nextStatus);
        setConfirmModal({ isOpen: false });
        loadUsers();
      },
    });
  };

  const handleDeleteUser = (user) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete User Account',
      message: `Are you sure you want to permanently delete ${user.name} (${user.email || user.phone})? This action cannot be undone.`,
      isDestructive: true,
      onConfirm: () => {
        deleteUser(user.id);
        setConfirmModal({ isOpen: false });
        loadUsers();
      },
    });
  };

  const handleResetPassword = (user) => {
    setConfirmModal({
      isOpen: true,
      title: 'Reset Password',
      message: `Generate a secure temporary password for ${user.name}? The current password will remain securely hashed and cannot be viewed.`,
      isDestructive: false,
      onConfirm: () => {
        const res = resetUserPassword(user.id);
        setConfirmModal({ isOpen: false });
        setResetPasswordResult({ user, ...res });
      },
    });
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    try {
      updateUser(editingUser.id, editingUser);
      setEditingUser(null);
      loadUsers();
    } catch (err) {
      alert(err.message);
    }
  };

  const rolePills = [
    { id: 'all', label: 'All Roles' },
    { id: 'farmer', label: 'Farmers' },
    { id: 'student', label: 'Students' },
    { id: 'buyer', label: 'Buyers' },
    { id: 'provider', label: 'Resource Providers' },
  ];

  const columns = [
    {
      header: 'User',
      key: 'name',
      render: (u) => (
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0 border border-primary/20">
            {u.initials || u.name?.slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0">
            <div className="font-bold text-on-surface truncate">{u.name}</div>
            <div className="text-[11px] text-on-surface-variant font-mono truncate">{u.id}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'Role',
      key: 'role',
      render: (u) => {
        const roleBadges = {
          farmer: 'bg-emerald-50 text-emerald-800 border-emerald-200/60',
          student: 'bg-blue-50 text-blue-800 border-blue-200/60',
          buyer: 'bg-amber-50 text-amber-800 border-amber-200/60',
          provider: 'bg-teal-50 text-teal-800 border-teal-200/60',
        };
        return (
          <span
            className={`px-2.5 py-0.5 rounded-full text-xs font-bold border capitalize ${
              roleBadges[u.role] || 'bg-surface-container text-on-surface border-outline-variant/40'
            }`}
          >
            {u.roleLabelEn || u.role}
          </span>
        );
      },
    },
    {
      header: 'Mobile',
      key: 'phone',
      render: (u) => (
        <span className="text-xs text-on-surface font-medium">{u.phone || '—'}</span>
      ),
    },
    {
      header: 'Email',
      key: 'email',
      render: (u) => (
        <span className="text-xs text-on-surface-variant truncate max-w-[170px] block">{u.email || '—'}</span>
      ),
    },
    {
      header: 'Location',
      key: 'location',
      render: (u) => (
        <span className="text-xs text-on-surface-variant truncate max-w-[140px] block">{u.location || '—'}</span>
      ),
    },
    {
      header: 'Status',
      key: 'status',
      render: (u) => (
        <span
          className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
            u.status === 'suspended'
              ? 'bg-red-50 text-red-800 border-red-200/60'
              : 'bg-emerald-50 text-emerald-800 border-emerald-200/60'
          }`}
        >
          {u.status === 'suspended' ? 'Suspended' : 'Active'}
        </span>
      ),
    },
    {
      header: 'Joined Date',
      key: 'joinedDate',
      render: (u) => (
        <span className="text-xs text-on-surface-variant font-mono">
          {u.joinedDate ? new Date(u.joinedDate).toLocaleDateString() : '—'}
        </span>
      ),
    },
    {
      header: 'Actions',
      key: 'actions',
      className: 'text-right',
      render: (u) => (
        <div className="flex items-center justify-end gap-1">
          {/* View Profile */}
          <button
            type="button"
            onClick={() => handleViewProfile(u)}
            className="p-1.5 rounded-lg text-primary hover:bg-surface-container transition-colors cursor-pointer"
            title="View User Details"
          >
            <span className="material-symbols-outlined text-[18px]">visibility</span>
          </button>

          {/* Edit */}
          <button
            type="button"
            onClick={() => setEditingUser(u)}
            className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors cursor-pointer"
            title="Edit User"
          >
            <span className="material-symbols-outlined text-[18px]">edit</span>
          </button>

          {/* Suspend / Activate */}
          <button
            type="button"
            onClick={() => handleStatusToggle(u)}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              u.status === 'suspended'
                ? 'text-emerald-700 hover:bg-emerald-50'
                : 'text-amber-700 hover:bg-amber-50'
            }`}
            title={u.status === 'suspended' ? 'Activate User' : 'Suspend User'}
          >
            <span className="material-symbols-outlined text-[18px]">
              {u.status === 'suspended' ? 'check_circle' : 'block'}
            </span>
          </button>

          {/* Reset Password */}
          <button
            type="button"
            onClick={() => handleResetPassword(u)}
            className="p-1.5 rounded-lg text-primary hover:bg-surface-container transition-colors cursor-pointer"
            title="Generate Temporary Reset Password"
          >
            <span className="material-symbols-outlined text-[18px]">lock_reset</span>
          </button>

          {/* Delete */}
          <button
            type="button"
            onClick={() => handleDeleteUser(u)}
            className="p-1.5 rounded-lg text-error hover:bg-error/10 transition-colors cursor-pointer"
            title="Delete User"
          >
            <span className="material-symbols-outlined text-[18px]">delete</span>
          </button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout
      title="User Management"
      subtitle="Manage, inspect, and moderate all Farmer Helper user accounts."
      lang={lang}
      setLang={setLang}
    >
      {/* Role Filters Bar matching Farmer Helper pill style */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface-container-lowest p-3.5 sm:p-4 rounded-2xl border border-outline-variant/40 shadow-xs">
        <div className="flex flex-wrap items-center gap-2">
          {rolePills.map((pill) => (
            <button
              key={pill.id}
              type="button"
              onClick={() => {
                setSelectedRole(pill.id);
                setSearchParams(pill.id === 'all' ? {} : { role: pill.id });
                setPage(1);
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                selectedRole === pill.id
                  ? 'bg-primary text-white shadow-xs'
                  : 'bg-white border border-outline-variant/50 text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setPage(1);
            }}
            className="px-3 py-1.5 bg-white border border-outline-variant/50 rounded-xl text-xs font-semibold text-on-surface focus:outline-none focus:border-primary shadow-2xs cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Main Users Table */}
      <AdminTable
        columns={columns}
        data={users}
        keyField="id"
        isLoading={isLoading}
        error={error}
        onRetry={loadUsers}
        emptyMessage="No users found matching current filters."
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          setPage(1);
        }}
        searchPlaceholder="Search users by name, email, phone, location..."
        selectedIds={selectedIds}
        onSelectAll={handleSelectAll}
        onSelectItem={handleSelectItem}
        bulkActions={[
          { label: 'Activate', action: 'activate' },
          { label: 'Suspend', action: 'suspend', isDestructive: true },
          { label: 'Delete', action: 'delete', isDestructive: true },
        ]}
        onBulkAction={handleBulkAction}
        pagination={{
          page,
          totalPages,
          total,
          limit,
          onPageChange: (p) => setPage(p),
        }}
      />

      {/* ─── Modal 1: User Profile Details (matching FarmDetailsModal) ────────── */}
      {profileUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-surface-container-lowest rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto border border-outline-variant/40 shadow-2xl p-6 sm:p-8 space-y-5">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-outline-variant/30 pb-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary font-bold text-base flex items-center justify-center shrink-0 border border-primary/20">
                  {profileUser.initials || profileUser.name?.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-on-surface flex items-center gap-2">
                    {profileUser.name}
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold border capitalize ${
                        profileUser.status === 'suspended'
                          ? 'bg-red-50 text-red-800 border-red-200/60'
                          : 'bg-emerald-50 text-emerald-800 border-emerald-200/60'
                      }`}
                    >
                      {profileUser.status || 'Active'}
                    </span>
                  </h3>
                  <p className="text-xs text-on-surface-variant font-mono">
                    ID: {profileUser.id} · Role: <span className="capitalize font-bold text-primary">{profileUser.role}</span>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setProfileUser(null)}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            {/* Basic Info Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-surface-container-low rounded-2xl border border-outline-variant/30">
                <span className="text-on-surface-variant block mb-0.5 font-medium">Mobile Phone</span>
                <span className="font-bold text-on-surface">{profileUser.phone || '—'}</span>
              </div>
              <div className="p-3 bg-surface-container-low rounded-2xl border border-outline-variant/30">
                <span className="text-on-surface-variant block mb-0.5 font-medium">Email Address</span>
                <span className="font-bold text-on-surface truncate block">{profileUser.email || '—'}</span>
              </div>
              <div className="p-3 bg-surface-container-low rounded-2xl border border-outline-variant/30">
                <span className="text-on-surface-variant block mb-0.5 font-medium">Location</span>
                <span className="font-bold text-on-surface">{profileUser.location || '—'}</span>
              </div>
              <div className="p-3 bg-surface-container-low rounded-2xl border border-outline-variant/30">
                <span className="text-on-surface-variant block mb-0.5 font-medium">Joined Date</span>
                <span className="font-bold text-on-surface">
                  {profileUser.joinedDate ? new Date(profileUser.joinedDate).toLocaleDateString() : '—'}
                </span>
              </div>
            </div>

            {/* Role-Specific Information Card */}
            {profileUser.roleData && (
              <div className="p-4 bg-surface-container-low/70 rounded-2xl border border-outline-variant/30 space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-primary flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm">badge</span>
                  Role-Specific Activity & Profile
                </h4>

                {profileUser.role === 'farmer' && profileUser.roleData.farmer && (
                  <div className="grid grid-cols-2 gap-2.5 text-xs">
                    <div>
                      <span className="text-on-surface-variant block">Primary Land:</span>
                      <span className="font-semibold text-on-surface">{profileUser.roleData.farmer.farmDetails?.landSize || '5 Acres'}</span>
                    </div>
                    <div>
                      <span className="text-on-surface-variant block">Primary Crop:</span>
                      <span className="font-semibold text-on-surface">{profileUser.roleData.farmer.farmDetails?.primaryCrop || 'Wheat'}</span>
                    </div>
                    <div>
                      <span className="text-on-surface-variant block">Shared Machinery:</span>
                      <span className="font-semibold text-on-surface">{profileUser.roleData.farmer.resourcesCount} resources</span>
                    </div>
                    <div>
                      <span className="text-on-surface-variant block">Internships Posted:</span>
                      <span className="font-semibold text-on-surface">{profileUser.roleData.farmer.internshipsPostedCount} listings</span>
                    </div>
                  </div>
                )}

                {profileUser.role === 'student' && profileUser.roleData.student && (
                  <div className="grid grid-cols-2 gap-2.5 text-xs">
                    <div>
                      <span className="text-on-surface-variant block">College:</span>
                      <span className="font-semibold text-on-surface">{profileUser.roleData.student.college}</span>
                    </div>
                    <div>
                      <span className="text-on-surface-variant block">Course & Year:</span>
                      <span className="font-semibold text-on-surface">{profileUser.roleData.student.course} ({profileUser.roleData.student.year})</span>
                    </div>
                    <div>
                      <span className="text-on-surface-variant block">Internship Applications:</span>
                      <span className="font-semibold text-on-surface">{profileUser.roleData.student.applicationsCount}</span>
                    </div>
                    <div>
                      <span className="text-on-surface-variant block">Workshops Enrolled:</span>
                      <span className="font-semibold text-on-surface">{profileUser.roleData.student.trainingRegistrationsCount}</span>
                    </div>
                  </div>
                )}

                {profileUser.role === 'buyer' && profileUser.roleData.buyer && (
                  <div className="grid grid-cols-2 gap-2.5 text-xs">
                    <div>
                      <span className="text-on-surface-variant block">Business:</span>
                      <span className="font-semibold text-on-surface">{profileUser.roleData.buyer.businessName}</span>
                    </div>
                    <div>
                      <span className="text-on-surface-variant block">GSTIN:</span>
                      <span className="font-semibold text-on-surface font-mono">{profileUser.roleData.buyer.gstNumber}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-on-surface-variant block">Crops Purchased:</span>
                      <span className="font-semibold text-on-surface">{profileUser.roleData.buyer.cropsPurchased?.join(', ')}</span>
                    </div>
                  </div>
                )}

                {profileUser.role === 'provider' && profileUser.roleData.provider && (
                  <div className="grid grid-cols-2 gap-2.5 text-xs">
                    <div>
                      <span className="text-on-surface-variant block">Machinery Inventory:</span>
                      <span className="font-semibold text-on-surface">{profileUser.roleData.provider.equipmentCount} units</span>
                    </div>
                    <div>
                      <span className="text-on-surface-variant block">Availability:</span>
                      <span className="font-semibold text-on-surface">{profileUser.roleData.provider.availability}</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-outline-variant/20">
              <button
                type="button"
                onClick={() => handleResetPassword(profileUser)}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-primary bg-primary/10 hover:bg-primary/20 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">lock_reset</span>
                <span>Reset User Password</span>
              </button>
              <button
                type="button"
                onClick={() => setProfileUser(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-on-surface bg-white border border-outline-variant/60 hover:bg-surface-container transition-colors cursor-pointer shadow-2xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Modal 2: Edit User ─────────────────────────────────────────────────── */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <form
            onSubmit={handleSaveEdit}
            className="bg-surface-container-lowest rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-outline-variant/40 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-outline-variant/30 pb-3">
              <h3 className="font-display font-bold text-base sm:text-lg text-on-surface">Edit User Profile</h3>
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-on-surface-variant font-medium mb-1">Full Name</label>
                <input
                  type="text"
                  value={editingUser.name || ''}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-outline-variant/60 focus:outline-none focus:border-primary text-on-surface"
                  required
                />
              </div>

              <div>
                <label className="block text-on-surface-variant font-medium mb-1">Mobile Phone</label>
                <input
                  type="text"
                  value={editingUser.phone || ''}
                  onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-outline-variant/60 focus:outline-none focus:border-primary text-on-surface"
                />
              </div>

              <div>
                <label className="block text-on-surface-variant font-medium mb-1">Email Address</label>
                <input
                  type="email"
                  value={editingUser.email || ''}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-outline-variant/60 focus:outline-none focus:border-primary text-on-surface"
                />
              </div>

              <div>
                <label className="block text-on-surface-variant font-medium mb-1">Location</label>
                <input
                  type="text"
                  value={editingUser.location || ''}
                  onChange={(e) => setEditingUser({ ...editingUser, location: e.target.value })}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-outline-variant/60 focus:outline-none focus:border-primary text-on-surface"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-outline-variant/20">
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-on-surface bg-white border border-outline-variant/50 hover:bg-surface-container transition-colors shadow-2xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-primary hover:bg-primary-container shadow-xs transition-colors cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ─── Modal 3: Secure Password Reset Notification ─────────────────────── */}
      {resetPasswordResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-surface-container-lowest rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-outline-variant/40 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-2xl">check_circle</span>
              </div>
              <div>
                <h3 className="font-display font-bold text-base sm:text-lg text-on-surface">Temporary Password Generated</h3>
                <p className="text-xs text-on-surface-variant">
                  For {resetPasswordResult.user.name} ({resetPasswordResult.user.email || resetPasswordResult.user.phone})
                </p>
              </div>
            </div>

            <div className="p-4 bg-surface-container-low rounded-2xl border border-outline-variant/30 space-y-2">
              <p className="text-xs text-on-surface-variant font-medium">Temporary Reset Password (Single-use):</p>
              <div className="flex items-center justify-between bg-white px-3.5 py-2.5 rounded-xl border border-outline-variant/60">
                <span className="font-mono font-bold text-sm text-primary tracking-wider">
                  {resetPasswordResult.tempPassword}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard?.writeText(resetPasswordResult.tempPassword);
                    alert('Copied temporary password to clipboard!');
                  }}
                  className="text-xs font-bold text-primary hover:underline"
                >
                  Copy
                </button>
              </div>
              <p className="text-[11px] text-on-surface-variant">
                Valid for 24 hours. The user will be required to create a new password upon first login. Current database hash was never revealed.
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setResetPasswordResult(null)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-primary hover:bg-primary-container shadow-xs transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <AdminConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        isDestructive={confirmModal.isDestructive}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal({ isOpen: false })}
      />
    </AdminLayout>
  );
}
