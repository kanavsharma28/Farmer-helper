import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminTable from '../../components/admin/AdminTable';
import AdminConfirmModal from '../../components/admin/AdminConfirmModal';
import {
  getAdminStorageFacilities,
  saveStorageFacility,
  updateStorageStatus,
  deleteStorageFacility,
} from '../../services/adminService';

export default function AdminStoragePage() {
  const [lang, setLang] = useState('en');
  const [facilities, setFacilities] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [inspectFacility, setInspectFacility] = useState(null);
  const [editingFacility, setEditingFacility] = useState(null);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null,
    isDestructive: false,
  });

  const loadFacilities = useCallback(() => {
    setIsLoading(true);
    setError(null);
    try {
      const res = getAdminStorageFacilities({
        search: searchQuery,
        type: selectedType,
        status: selectedStatus,
        page,
        limit,
      });
      setFacilities(res.data);
      setTotal(res.total);
      setTotalPages(res.totalPages);
    } catch (err) {
      console.error('Error fetching storage facilities:', err);
      setError(err.message || 'Unable to load storage facilities.');
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, selectedType, selectedStatus, page, limit]);

  useEffect(() => {
    loadFacilities();
  }, [loadFacilities]);

  const handleCreateNew = () => {
    setEditingFacility({
      id: '',
      name: '',
      type: 'Cold Storage',
      capacityTotal: 2500,
      area: 'Meerut Mandi Bypass',
      address: 'Near NH-58, Meerut, UP',
      pricePerBag: '₹45 / bag / month',
      ownerName: 'Kisan Warehouse Corporation',
      phone: '9876543210',
      status: 'available',
      verified: true,
    });
  };

  const handleSaveFacility = (e) => {
    e.preventDefault();
    try {
      saveStorageFacility(editingFacility);
      setEditingFacility(null);
      loadFacilities();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleVerifyToggle = (f) => {
    const nextV = !f.verified;
    updateStorageStatus(f.id, f.status, nextV);
    loadFacilities();
  };

  const handleStatusToggle = (f) => {
    const nextS = f.status === 'hidden' ? 'available' : 'hidden';
    setConfirmModal({
      isOpen: true,
      title: `${nextS === 'hidden' ? 'Hide' : 'Activate'} Facility`,
      message: `Set "${f.name}" to ${nextS}?`,
      isDestructive: nextS === 'hidden',
      onConfirm: () => {
        updateStorageStatus(f.id, nextS);
        setConfirmModal({ isOpen: false });
        loadFacilities();
      },
    });
  };

  const handleDelete = (f) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Storage Facility',
      message: `Are you sure you want to permanently delete "${f.name}"? This action cannot be undone.`,
      isDestructive: true,
      onConfirm: () => {
        deleteStorageFacility(f.id);
        setConfirmModal({ isOpen: false });
        loadFacilities();
      },
    });
  };

  const typePills = [
    { id: 'all', label: 'All Storages' },
    { id: 'Cold Storage', label: 'Cold Storages' },
    { id: 'Warehouse', label: 'Grain Warehouses' },
    { id: 'Silo', label: 'Silos' },
  ];

  const columns = [
    {
      header: 'Facility Name',
      key: 'name',
      render: (f) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20">
            <span className="material-symbols-outlined text-lg">warehouse</span>
          </div>
          <div className="min-w-0">
            <div className="font-bold text-on-surface truncate max-w-[200px]">{f.name}</div>
            <div className="text-[11px] text-on-surface-variant truncate">{f.area || f.address}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'Type',
      key: 'type',
      render: (f) => (
        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-surface-container text-on-surface">
          {f.type}
        </span>
      ),
    },
    {
      header: 'Capacity & Occupancy',
      key: 'capacity',
      render: (f) => (
        <div className="text-xs">
          <span className="font-bold text-on-surface block">{f.capacityTotal || 1000} MT</span>
          <span className="text-[11px] text-on-surface-variant font-medium">
            {f.occupancyPercent || 40}% Occupied
          </span>
        </div>
      ),
    },
    {
      header: 'Rental Rate',
      key: 'rate',
      render: (f) => (
        <span className="text-xs font-bold text-primary">{f.pricePerBag || '₹40/bag/mo'}</span>
      ),
    },
    {
      header: 'Verified',
      key: 'verified',
      render: (f) => (
        <button
          type="button"
          onClick={() => handleVerifyToggle(f)}
          className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer border ${
            f.verified
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200/60 hover:bg-emerald-100'
              : 'bg-surface-container text-on-surface-variant border-outline-variant/40 hover:bg-surface-container-high'
          }`}
        >
          <span className="material-symbols-outlined text-[13px]">
            {f.verified ? 'verified' : 'radio_button_unchecked'}
          </span>
          {f.verified ? 'Verified' : 'Unverified'}
        </button>
      ),
    },
    {
      header: 'Actions',
      key: 'actions',
      className: 'text-right',
      render: (f) => (
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            onClick={() => setInspectFacility(f)}
            className="p-1.5 rounded-lg text-primary hover:bg-surface-container transition-colors cursor-pointer"
            title="Inspect Details"
          >
            <span className="material-symbols-outlined text-[18px]">visibility</span>
          </button>
          <button
            type="button"
            onClick={() => setEditingFacility({ ...f })}
            className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors cursor-pointer"
            title="Edit Facility"
          >
            <span className="material-symbols-outlined text-[18px]">edit</span>
          </button>
          <button
            type="button"
            onClick={() => handleStatusToggle(f)}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              f.status === 'hidden' ? 'text-primary hover:bg-surface-container' : 'text-amber-700 hover:bg-amber-50'
            }`}
            title={f.status === 'hidden' ? 'Unhide' : 'Hide Facility'}
          >
            <span className="material-symbols-outlined text-[18px]">
              {f.status === 'hidden' ? 'visibility' : 'visibility_off'}
            </span>
          </button>
          <button
            type="button"
            onClick={() => handleDelete(f)}
            className="p-1.5 rounded-lg text-error hover:bg-error/10 transition-colors cursor-pointer"
            title="Delete Facility"
          >
            <span className="material-symbols-outlined text-[18px]">delete</span>
          </button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout
      title="Storage & Cold Storage"
      subtitle="Supervise agricultural warehouses, cold storage facilities, capacity slots, and verification."
      lang={lang}
      setLang={setLang}
    >
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface-container-lowest p-3.5 sm:p-4 rounded-2xl border border-outline-variant/40 shadow-xs">
        <div>
          <h2 className="text-sm sm:text-base font-bold text-on-surface">Registered Storage Units ({total})</h2>
          <p className="text-xs text-on-surface-variant">Cold storages and rural grain warehouses for produce preservation</p>
        </div>

        <button
          type="button"
          onClick={handleCreateNew}
          className="px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold shadow-xs hover:bg-primary-container transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
        >
          <span className="material-symbols-outlined text-base">add</span>
          <span>+ Add Storage Facility</span>
        </button>
      </div>

      {/* Filter Pills */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface-container-lowest p-3.5 sm:p-4 rounded-2xl border border-outline-variant/40 shadow-xs">
        <div className="flex flex-wrap items-center gap-2">
          {typePills.map((pill) => (
            <button
              key={pill.id}
              type="button"
              onClick={() => {
                setSelectedType(pill.id);
                setPage(1);
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                selectedType === pill.id
                  ? 'bg-primary text-white shadow-xs'
                  : 'bg-white border border-outline-variant/50 text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Table */}
      <AdminTable
        columns={columns}
        data={facilities}
        keyField="id"
        isLoading={isLoading}
        error={error}
        onRetry={loadFacilities}
        emptyMessage="No storage facilities found."
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          setPage(1);
        }}
        searchPlaceholder="Search storages by name, location, owner..."
        pagination={{
          page,
          totalPages,
          total,
          limit,
          onPageChange: (p) => setPage(p),
        }}
      />

      {/* ─── Modal 1: Inspect Storage Facility ─────────────────────────────────── */}
      {inspectFacility && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-surface-container-lowest rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-outline-variant/40 shadow-2xl p-6 sm:p-8 space-y-4">
            <div className="flex items-start justify-between border-b border-outline-variant/30 pb-3">
              <div>
                <h3 className="font-display font-bold text-base sm:text-lg text-on-surface">{inspectFacility.name}</h3>
                <p className="text-xs text-on-surface-variant font-mono">ID: {inspectFacility.id}</p>
              </div>
              <button
                type="button"
                onClick={() => setInspectFacility(null)}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-surface-container-low rounded-2xl border border-outline-variant/30">
                <span className="text-on-surface-variant block mb-0.5">Facility Type</span>
                <span className="font-bold text-on-surface">{inspectFacility.type}</span>
              </div>
              <div className="p-3 bg-surface-container-low rounded-2xl border border-outline-variant/30">
                <span className="text-on-surface-variant block mb-0.5">Total Capacity</span>
                <span className="font-bold text-primary">{inspectFacility.capacityTotal || 2000} MT</span>
              </div>
              <div className="p-3 bg-surface-container-low rounded-2xl border border-outline-variant/30">
                <span className="text-on-surface-variant block mb-0.5">Location & Area</span>
                <span className="font-bold text-on-surface">{inspectFacility.area || inspectFacility.address}</span>
              </div>
              <div className="p-3 bg-surface-container-low rounded-2xl border border-outline-variant/30">
                <span className="text-on-surface-variant block mb-0.5">Contact Phone</span>
                <span className="font-bold text-on-surface">{inspectFacility.phone || '9876543210'}</span>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-outline-variant/20">
              <button
                type="button"
                onClick={() => setInspectFacility(null)}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold text-on-surface bg-white border border-outline-variant/50 hover:bg-surface-container transition-colors shadow-2xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Modal 2: Add / Edit Storage Facility ──────────────────────────────── */}
      {editingFacility && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <form
            onSubmit={handleSaveFacility}
            className="bg-surface-container-lowest rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-outline-variant/40 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-outline-variant/30 pb-3">
              <h3 className="font-display font-bold text-base sm:text-lg text-on-surface">
                {editingFacility.id ? 'Edit Storage Facility' : 'Register Storage Facility'}
              </h3>
              <button
                type="button"
                onClick={() => setEditingFacility(null)}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-on-surface-variant font-medium mb-1">Facility Name</label>
                <input
                  type="text"
                  value={editingFacility.name || ''}
                  onChange={(e) => setEditingFacility({ ...editingFacility, name: e.target.value })}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-outline-variant/60 focus:outline-none focus:border-primary text-on-surface"
                  placeholder="e.g. Kisan Kisan Cold Storage Unit"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-on-surface-variant font-medium mb-1">Type</label>
                  <select
                    value={editingFacility.type || 'Cold Storage'}
                    onChange={(e) => setEditingFacility({ ...editingFacility, type: e.target.value })}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-outline-variant/60 focus:outline-none focus:border-primary text-on-surface"
                  >
                    <option value="Cold Storage">Cold Storage</option>
                    <option value="Warehouse">Warehouse</option>
                    <option value="Silo">Grain Silo</option>
                  </select>
                </div>
                <div>
                  <label className="block text-on-surface-variant font-medium mb-1">Capacity (MT)</label>
                  <input
                    type="number"
                    value={editingFacility.capacityTotal || ''}
                    onChange={(e) => setEditingFacility({ ...editingFacility, capacityTotal: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-outline-variant/60 focus:outline-none focus:border-primary text-on-surface"
                  />
                </div>
              </div>

              <div>
                <label className="block text-on-surface-variant font-medium mb-1">Address / Area</label>
                <input
                  type="text"
                  value={editingFacility.address || editingFacility.area || ''}
                  onChange={(e) => setEditingFacility({ ...editingFacility, address: e.target.value, area: e.target.value })}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-outline-variant/60 focus:outline-none focus:border-primary text-on-surface"
                  placeholder="e.g. Near Khanna Mandi Bypass, Punjab"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-outline-variant/20">
              <button
                type="button"
                onClick={() => setEditingFacility(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-on-surface bg-white border border-outline-variant/50 hover:bg-surface-container transition-colors shadow-2xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-primary hover:bg-primary-container shadow-xs transition-colors cursor-pointer"
              >
                Save Facility
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
