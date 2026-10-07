import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminTable from '../../components/admin/AdminTable';
import AdminConfirmModal from '../../components/admin/AdminConfirmModal';
import {
  getAdminCropLossReports,
  updateCropLossStatus,
} from '../../services/adminService';

export default function AdminCropLossReportsPage() {
  const [lang, setLang] = useState('en');
  const [reports, setReports] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [inspectReport, setInspectReport] = useState(null);
  const [updateModal, setUpdateModal] = useState({ isOpen: false, report: null, status: 'Under Review', note: '' });
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null,
    isDestructive: false,
  });

  const loadReports = useCallback(() => {
    setIsLoading(true);
    setError(null);
    try {
      const res = getAdminCropLossReports({
        search: searchQuery,
        status: selectedStatus,
        page,
        limit,
      });
      setReports(res.data);
      setTotal(res.total);
      setTotalPages(res.totalPages);
    } catch (err) {
      console.error('Error fetching crop loss claims:', err);
      setError(err.message || 'Unable to load crop loss reports.');
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, selectedStatus, page, limit]);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  const handleOpenUpdate = (report) => {
    setUpdateModal({
      isOpen: true,
      report,
      status: report.status || 'Under Review',
      note: '',
    });
  };

  const handleSaveStatus = (e) => {
    e.preventDefault();
    if (!updateModal.report) return;

    try {
      updateCropLossStatus(updateModal.report.id, updateModal.status, updateModal.note);
      setUpdateModal({ isOpen: false, report: null, status: 'Under Review', note: '' });
      loadReports();
    } catch (err) {
      alert(err.message);
    }
  };

  const statusPills = [
    { id: 'all', label: 'All Claims' },
    { id: 'submitted', label: 'Submitted' },
    { id: 'Under Review', label: 'Under Review' },
    { id: 'Verified', label: 'Verified' },
    { id: 'Rejected', label: 'Rejected' },
  ];

  const columns = [
    {
      header: 'Farmer Claimant',
      key: 'farmer',
      render: (r) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20">
            <span className="material-symbols-outlined text-lg">report_problem</span>
          </div>
          <div className="min-w-0">
            <div className="font-bold text-on-surface truncate max-w-[200px]">{r.farmerName || 'Kisan Claimant'}</div>
            <div className="text-[11px] text-on-surface-variant font-mono truncate">{r.id}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'Damaged Crop',
      key: 'crop',
      render: (r) => (
        <div className="text-xs">
          <span className="font-bold text-on-surface block">{r.crop || 'Wheat'}</span>
          <span className="text-[11px] text-on-surface-variant">{r.areaDamaged || '2.5 Acres'}</span>
        </div>
      ),
    },
    {
      header: 'Cause of Loss',
      key: 'cause',
      render: (r) => (
        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-surface-container text-on-surface">
          {r.cause || 'Hailstorm / Heavy Rain'}
        </span>
      ),
    },
    {
      header: 'Location',
      key: 'location',
      render: (r) => (
        <span className="text-xs text-on-surface-variant truncate max-w-[130px] block">
          {r.location || r.district || 'Meerut, UP'}
        </span>
      ),
    },
    {
      header: 'Date Submitted',
      key: 'date',
      render: (r) => (
        <span className="text-xs text-on-surface-variant font-mono">
          {r.submissionDate || r.createdAt ? new Date(r.submissionDate || r.createdAt).toLocaleDateString() : 'Recent'}
        </span>
      ),
    },
    {
      header: 'Status',
      key: 'status',
      render: (r) => {
        const statusColors = {
          submitted: 'bg-blue-50 text-blue-800 border-blue-200/60',
          'Under Review': 'bg-amber-50 text-amber-800 border-amber-200/60',
          Verified: 'bg-emerald-50 text-emerald-800 border-emerald-200/60',
          Resolved: 'bg-emerald-50 text-emerald-800 border-emerald-200/60',
          Rejected: 'bg-red-50 text-red-800 border-red-200/60',
        };
        return (
          <span
            className={`px-2.5 py-0.5 rounded-full text-xs font-bold border capitalize ${
              statusColors[r.status] || 'bg-surface-container text-on-surface border-outline-variant/40'
            }`}
          >
            {r.status || 'Submitted'}
          </span>
        );
      },
    },
    {
      header: 'Actions',
      key: 'actions',
      className: 'text-right',
      render: (r) => (
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            onClick={() => setInspectReport(r)}
            className="p-1.5 rounded-lg text-primary hover:bg-surface-container transition-colors cursor-pointer"
            title="Inspect Claim Evidence"
          >
            <span className="material-symbols-outlined text-[18px]">visibility</span>
          </button>
          <button
            type="button"
            onClick={() => handleOpenUpdate(r)}
            className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors cursor-pointer"
            title="Review & Update Status"
          >
            <span className="material-symbols-outlined text-[18px]">rule</span>
          </button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout
      title="Crop Loss Reports"
      subtitle="Audit farmer damage claims, geo-tagged survey photos, and insurance relief requests."
      lang={lang}
      setLang={setLang}
    >
      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface-container-lowest p-3.5 sm:p-4 rounded-2xl border border-outline-variant/40 shadow-xs">
        <div className="flex flex-wrap items-center gap-2">
          {statusPills.map((pill) => (
            <button
              key={pill.id}
              type="button"
              onClick={() => {
                setSelectedStatus(pill.id);
                setPage(1);
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                selectedStatus === pill.id
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
        data={reports}
        keyField="id"
        isLoading={isLoading}
        error={error}
        onRetry={loadReports}
        emptyMessage="No crop loss reports found."
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          setPage(1);
        }}
        searchPlaceholder="Search claims by farmer, crop, cause, location..."
        pagination={{
          page,
          totalPages,
          total,
          limit,
          onPageChange: (p) => setPage(p),
        }}
      />

      {/* ─── Modal 1: Inspect Crop Loss Claim ─────────────────────────────────── */}
      {inspectReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-surface-container-lowest rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-outline-variant/40 shadow-2xl p-6 sm:p-8 space-y-4">
            <div className="flex items-start justify-between border-b border-outline-variant/30 pb-3">
              <div>
                <h3 className="font-display font-bold text-base sm:text-lg text-on-surface">Crop Loss Claim Dossier</h3>
                <p className="text-xs text-on-surface-variant font-mono">Claim ID: {inspectReport.id}</p>
              </div>
              <button
                type="button"
                onClick={() => setInspectReport(null)}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-surface-container-low rounded-2xl border border-outline-variant/30">
                <span className="text-on-surface-variant block mb-0.5">Claimant Farmer</span>
                <span className="font-bold text-on-surface">{inspectReport.farmerName || 'Farmer'}</span>
              </div>
              <div className="p-3 bg-surface-container-low rounded-2xl border border-outline-variant/30">
                <span className="text-on-surface-variant block mb-0.5">Affected Crop</span>
                <span className="font-bold text-on-surface">{inspectReport.crop} ({inspectReport.areaDamaged})</span>
              </div>
              <div className="p-3 bg-surface-container-low rounded-2xl border border-outline-variant/30">
                <span className="text-on-surface-variant block mb-0.5">Cause of Damage</span>
                <span className="font-bold text-primary">{inspectReport.cause}</span>
              </div>
              <div className="p-3 bg-surface-container-low rounded-2xl border border-outline-variant/30">
                <span className="text-on-surface-variant block mb-0.5">Report Status</span>
                <span className="font-bold capitalize text-on-surface">{inspectReport.status || 'Submitted'}</span>
              </div>
            </div>

            <div className="p-3.5 bg-surface-container-low rounded-2xl border border-outline-variant/30 space-y-1">
              <span className="text-xs font-bold text-on-surface block">Farmer Declaration & Loss Summary</span>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                {inspectReport.description || 'Farmer reported severe harvest damage due to extreme local weather conditions.'}
              </p>
            </div>

            {inspectReport.internalNotes && inspectReport.internalNotes.length > 0 && (
              <div className="p-3.5 bg-surface-container-low rounded-2xl border border-outline-variant/30 space-y-1">
                <span className="text-xs font-bold text-primary block">Internal Verification Notes</span>
                {inspectReport.internalNotes.map((note, idx) => (
                  <p key={idx} className="text-xs text-on-surface-variant italic">
                    • {note}
                  </p>
                ))}
              </div>
            )}

            <div className="flex justify-end pt-2 border-t border-outline-variant/20">
              <button
                type="button"
                onClick={() => setInspectReport(null)}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold text-on-surface bg-white border border-outline-variant/50 hover:bg-surface-container transition-colors shadow-2xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Modal 2: Update Claim Status & Notes ─────────────────────────────── */}
      {updateModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <form
            onSubmit={handleSaveStatus}
            className="bg-surface-container-lowest rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-outline-variant/40 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-outline-variant/30 pb-3">
              <h3 className="font-display font-bold text-base sm:text-lg text-on-surface">Update Claim Status</h3>
              <button
                type="button"
                onClick={() => setUpdateModal({ isOpen: false, report: null, status: 'Under Review', note: '' })}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-on-surface-variant font-medium mb-1">New Review Status</label>
                <select
                  value={updateModal.status}
                  onChange={(e) => setUpdateModal({ ...updateModal, status: e.target.value })}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-outline-variant/60 focus:outline-none focus:border-primary text-on-surface"
                >
                  <option value="Under Review">Under Review</option>
                  <option value="Verified">Verified & Approved</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Resolved">Resolved / Compensation Dispatched</option>
                </select>
              </div>

              <div>
                <label className="block text-on-surface-variant font-medium mb-1">Internal Administrative Note</label>
                <textarea
                  rows={3}
                  value={updateModal.note}
                  onChange={(e) => setUpdateModal({ ...updateModal, note: e.target.value })}
                  placeholder="Record surveyor comments, insurance claim reference, or justification..."
                  className="w-full p-2.5 bg-white rounded-xl border border-outline-variant/60 text-xs text-on-surface focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-outline-variant/20">
              <button
                type="button"
                onClick={() => setUpdateModal({ isOpen: false, report: null, status: 'Under Review', note: '' })}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-on-surface bg-white border border-outline-variant/50 hover:bg-surface-container transition-colors shadow-2xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-primary hover:bg-primary-container shadow-xs transition-colors cursor-pointer"
              >
                Update Dossier
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
