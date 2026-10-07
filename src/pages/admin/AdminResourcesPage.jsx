import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminTable from '../../components/admin/AdminTable';
import AdminConfirmModal from '../../components/admin/AdminConfirmModal';
import {
  getAdminResources,
  verifyResource,
  updateResourceStatus,
  deleteResource,
  updateResource,
} from '../../services/adminService';

export default function AdminResourcesPage() {
  const [lang, setLang] = useState('en');
  const [resources, setResources] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedVerified, setSelectedVerified] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [inspectResource, setInspectResource] = useState(null);
  const [editingResource, setEditingResource] = useState(null);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null,
    isDestructive: false,
  });

  const loadResources = useCallback(() => {
    setIsLoading(true);
    setError(null);
    try {
      const res = getAdminResources({
        search: searchQuery,
        category: selectedCategory,
        status: selectedStatus,
        verified: selectedVerified,
        page,
        limit,
      });
      setResources(res.data);
      setTotal(res.total);
      setTotalPages(res.totalPages);
    } catch (err) {
      console.error('Error fetching resources:', err);
      setError(err.message || 'Unable to load resources.');
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, selectedCategory, selectedStatus, selectedVerified, page, limit]);

  useEffect(() => {
    loadResources();
  }, [loadResources]);

  const handleVerifyToggle = (res) => {
    const nextVerified = !res.verified;
    verifyResource(res.id, nextVerified);
    loadResources();
  };

  const handleStatusToggle = (res) => {
    const nextStatus = res.status === 'hidden' ? 'active' : 'hidden';
    setConfirmModal({
      isOpen: true,
      title: `${nextStatus === 'hidden' ? 'Hide' : 'Show'} Resource`,
      message: `Are you sure you want to mark "${res.titleEn}" as ${nextStatus}?`,
      isDestructive: nextStatus === 'hidden',
      onConfirm: () => {
        updateResourceStatus(res.id, nextStatus);
        setConfirmModal({ isOpen: false });
        loadResources();
      },
    });
  };

  const handleDeleteResource = (res) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Resource Listing',
      message: `Are you sure you want to permanently delete "${res.titleEn}"? This action cannot be undone.`,
      isDestructive: true,
      onConfirm: () => {
        deleteResource(res.id);
        setConfirmModal({ isOpen: false });
        loadResources();
      },
    });
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    try {
      updateResource(editingResource.id, editingResource);
      setEditingResource(null);
      loadResources();
    } catch (err) {
      alert(err.message);
    }
  };

  const categoryPills = [
    { id: 'all', label: 'All Resources' },
    { id: 'tractor', label: 'Tractors' },
    { id: 'spray', label: 'Spray Machines' },
    { id: 'labour', label: 'Labour' },
    { id: 'seeds', label: 'Seeds' },
    { id: 'fertilizer', label: 'Fertilizers' },
  ];

  const columns = [
    {
      header: 'Resource',
      key: 'title',
      render: (r) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center shrink-0 border border-outline-variant/30 text-xl">
            {r.imageEmoji || '🚜'}
          </div>
          <div className="min-w-0">
            <div className="font-bold text-on-surface truncate max-w-[200px]">{r.titleEn}</div>
            <div className="text-[11px] text-on-surface-variant font-mono truncate">{r.id}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'Owner',
      key: 'owner',
      render: (r) => (
        <div className="text-xs">
          <span className="font-bold text-on-surface block">{r.ownerName || 'Provider'}</span>
          <span className="text-on-surface-variant text-[11px] block">{r.ownerRole || 'Provider'}</span>
        </div>
      ),
    },
    {
      header: 'Type',
      key: 'type',
      render: (r) => (
        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-surface-container text-on-surface capitalize">
          {r.category || r.type}
        </span>
      ),
    },
    {
      header: 'Location',
      key: 'location',
      render: (r) => (
        <span className="text-xs text-on-surface-variant truncate max-w-[130px] block">
          {r.locationEn || r.location || '—'}
        </span>
      ),
    },
    {
      header: 'Price / Rate',
      key: 'price',
      render: (r) => (
        <span className="text-xs font-bold text-primary">
          ₹{r.price} {r.priceUnitEn || '/day'}
        </span>
      ),
    },
    {
      header: 'Verified',
      key: 'verified',
      render: (r) => (
        <button
          type="button"
          onClick={() => handleVerifyToggle(r)}
          className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer border ${
            r.verified
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200/60 hover:bg-emerald-100'
              : 'bg-surface-container text-on-surface-variant border-outline-variant/40 hover:bg-surface-container-high'
          }`}
          title={r.verified ? 'Click to unverify' : 'Click to verify'}
        >
          <span className="material-symbols-outlined text-[13px]">
            {r.verified ? 'verified' : 'radio_button_unchecked'}
          </span>
          {r.verified ? 'Verified' : 'Unverified'}
        </button>
      ),
    },
    {
      header: 'Availability',
      key: 'available',
      render: (r) => (
        <span
          className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
            r.available !== false && r.status !== 'hidden'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200/60'
              : 'bg-amber-50 text-amber-800 border-amber-200/60'
          }`}
        >
          {r.status === 'hidden' ? 'Hidden' : r.available !== false ? 'Available' : 'Booked'}
        </span>
      ),
    },
    {
      header: 'Actions',
      key: 'actions',
      className: 'text-right',
      render: (r) => (
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            onClick={() => setInspectResource(r)}
            className="p-1.5 rounded-lg text-primary hover:bg-surface-container transition-colors cursor-pointer"
            title="Inspect Details"
          >
            <span className="material-symbols-outlined text-[18px]">visibility</span>
          </button>
          <button
            type="button"
            onClick={() => setEditingResource({ ...r })}
            className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors cursor-pointer"
            title="Edit Resource"
          >
            <span className="material-symbols-outlined text-[18px]">edit</span>
          </button>
          <button
            type="button"
            onClick={() => handleStatusToggle(r)}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              r.status === 'hidden' ? 'text-primary hover:bg-surface-container' : 'text-amber-700 hover:bg-amber-50'
            }`}
            title={r.status === 'hidden' ? 'Unhide' : 'Hide from Public'}
          >
            <span className="material-symbols-outlined text-[18px]">
              {r.status === 'hidden' ? 'visibility' : 'visibility_off'}
            </span>
          </button>
          <button
            type="button"
            onClick={() => handleDeleteResource(r)}
            className="p-1.5 rounded-lg text-error hover:bg-error/10 transition-colors cursor-pointer"
            title="Delete Resource"
          >
            <span className="material-symbols-outlined text-[18px]">delete</span>
          </button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout
      title="Resource Management"
      subtitle="Monitor, verify, and moderate shared agricultural machinery, labour & equipment."
      lang={lang}
      setLang={setLang}
    >
      {/* Category Pills Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface-container-lowest p-3.5 sm:p-4 rounded-2xl border border-outline-variant/40 shadow-xs">
        <div className="flex flex-wrap items-center gap-2">
          {categoryPills.map((pill) => (
            <button
              key={pill.id}
              type="button"
              onClick={() => {
                setSelectedCategory(pill.id);
                setPage(1);
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === pill.id
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
            value={selectedVerified}
            onChange={(e) => {
              setSelectedVerified(e.target.value);
              setPage(1);
            }}
            className="px-3 py-1.5 bg-white border border-outline-variant/50 rounded-xl text-xs font-semibold text-on-surface focus:outline-none focus:border-primary shadow-2xs cursor-pointer"
          >
            <option value="all">All Verification</option>
            <option value="verified">Verified Only</option>
            <option value="unverified">Unverified Only</option>
          </select>

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
            <option value="hidden">Hidden</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      <AdminTable
        columns={columns}
        data={resources}
        keyField="id"
        isLoading={isLoading}
        error={error}
        onRetry={loadResources}
        emptyMessage="No resources found matching current criteria."
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          setPage(1);
        }}
        searchPlaceholder="Search resources by title, owner, location..."
        pagination={{
          page,
          totalPages,
          total,
          limit,
          onPageChange: (p) => setPage(p),
        }}
      />

      {/* ─── Modal 1: Inspect Resource ────────────────────────────────────────── */}
      {inspectResource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-surface-container-lowest rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-outline-variant/40 shadow-2xl p-6 sm:p-8 space-y-4">
            <div className="flex items-start justify-between border-b border-outline-variant/30 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-surface-container flex items-center justify-center text-2xl border border-outline-variant/30">
                  {inspectResource.imageEmoji || '🚜'}
                </div>
                <div>
                  <h3 className="font-display font-bold text-base sm:text-lg text-on-surface">
                    {inspectResource.titleEn}
                  </h3>
                  <p className="text-xs text-on-surface-variant font-mono">ID: {inspectResource.id}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setInspectResource(null)}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-surface-container-low rounded-2xl border border-outline-variant/30">
                <span className="text-on-surface-variant block mb-0.5">Owner</span>
                <span className="font-bold text-on-surface">{inspectResource.ownerName || 'Verified Provider'}</span>
              </div>
              <div className="p-3 bg-surface-container-low rounded-2xl border border-outline-variant/30">
                <span className="text-on-surface-variant block mb-0.5">Rate / Cost</span>
                <span className="font-bold text-primary">₹{inspectResource.price} {inspectResource.priceUnitEn || '/day'}</span>
              </div>
              <div className="p-3 bg-surface-container-low rounded-2xl border border-outline-variant/30">
                <span className="text-on-surface-variant block mb-0.5">Location</span>
                <span className="font-bold text-on-surface">{inspectResource.locationEn}</span>
              </div>
              <div className="p-3 bg-surface-container-low rounded-2xl border border-outline-variant/30">
                <span className="text-on-surface-variant block mb-0.5">Rating</span>
                <span className="font-bold text-on-surface">⭐ {inspectResource.rating || '4.8'}</span>
              </div>
            </div>

            <div className="p-3.5 bg-surface-container-low rounded-2xl border border-outline-variant/30 space-y-1">
              <span className="text-xs font-bold text-on-surface block">Description</span>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                {inspectResource.descEn || 'High-performance agricultural machinery inspected for farm operations.'}
              </p>
            </div>

            <div className="flex justify-end pt-2 border-t border-outline-variant/20">
              <button
                type="button"
                onClick={() => setInspectResource(null)}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold text-on-surface bg-white border border-outline-variant/50 hover:bg-surface-container transition-colors shadow-2xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Modal 2: Edit Resource ───────────────────────────────────────────── */}
      {editingResource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <form
            onSubmit={handleSaveEdit}
            className="bg-surface-container-lowest rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-outline-variant/40 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-outline-variant/30 pb-3">
              <h3 className="font-display font-bold text-base sm:text-lg text-on-surface">Edit Resource Listing</h3>
              <button
                type="button"
                onClick={() => setEditingResource(null)}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-on-surface-variant font-medium mb-1">Title</label>
                <input
                  type="text"
                  value={editingResource.titleEn || ''}
                  onChange={(e) => setEditingResource({ ...editingResource, titleEn: e.target.value })}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-outline-variant/60 focus:outline-none focus:border-primary text-on-surface"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-on-surface-variant font-medium mb-1">Price (₹)</label>
                  <input
                    type="number"
                    value={editingResource.price || ''}
                    onChange={(e) => setEditingResource({ ...editingResource, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-outline-variant/60 focus:outline-none focus:border-primary text-on-surface"
                    required
                  />
                </div>
                <div>
                  <label className="block text-on-surface-variant font-medium mb-1">Location</label>
                  <input
                    type="text"
                    value={editingResource.locationEn || ''}
                    onChange={(e) => setEditingResource({ ...editingResource, locationEn: e.target.value })}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-outline-variant/60 focus:outline-none focus:border-primary text-on-surface"
                  />
                </div>
              </div>

              <div>
                <label className="block text-on-surface-variant font-medium mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingResource.descEn || ''}
                  onChange={(e) => setEditingResource({ ...editingResource, descEn: e.target.value })}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-outline-variant/60 focus:outline-none focus:border-primary text-on-surface"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-outline-variant/20">
              <button
                type="button"
                onClick={() => setEditingResource(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-on-surface bg-white border border-outline-variant/50 hover:bg-surface-container transition-colors shadow-2xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-primary hover:bg-primary-container shadow-xs transition-colors cursor-pointer"
              >
                Save Resource
              </button>
            </div>
          </form>
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
