import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminTable from '../../components/admin/AdminTable';
import AdminConfirmModal from '../../components/admin/AdminConfirmModal';
import {
  getAdminReports,
  updateReportStatus,
} from '../../services/adminService';

export default function AdminReportsPage() {
  const [lang, setLang] = useState('en');
  const [reports, setReports] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [inspectReport, setInspectReport] = useState(null);
  const [resolveModal, setResolveModal] = useState({ isOpen: false, report: null, status: 'Resolved', note: '' });
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
      const res = getAdminReports({
        search: searchQuery,
        type: selectedType,
        status: selectedStatus,
        page,
        limit,
      });
      setReports(res.data);
      setTotal(res.total);
      setTotalPages(res.totalPages);
    } catch (err) {
      console.error('Error fetching reports:', err);
      setError(err.message || 'Unable to load platform grievances.');
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, selectedType, selectedStatus, page, limit]);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  const handleOpenResolve = (report) => {
    setResolveModal({
      isOpen: true,
      report,
      status: report.status === 'Pending' ? 'Resolved' : report.status,
      note: '',
    });
  };

  const handleSaveResolution = (e) => {
    e.preventDefault();
    if (!resolveModal.report) return;

    try {
      updateReportStatus(resolveModal.report.id, resolveModal.status, resolveModal.note);
      setResolveModal({ isOpen: false, report: null, status: 'Resolved', note: '' });
      loadReports();
    } catch (err) {
      alert(err.message);
    }
  };

  const statusPills = [
    { id: 'all', label: 'All Reports' },
    { id: 'Pending', label: 'Pending' },
    { id: 'Under Review', label: 'Under Review' },
    { id: 'Resolved', label: 'Resolved' },
    { id: 'Rejected', label: 'Dismissed' },
  ];

  const columns = [
    {
      header: 'Reported Subject',
      key: 'title',
      render: (r) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20">
            <span className="material-symbols-outlined text-lg">flag</span>
          </div>
          <div className="min-w-0">
            <div className="font-bold text-on-surface truncate max-w-[200px]">{r.targetTitle || r.reason}</div>
            <div className="text-[11px] text-on-surface-variant font-mono truncate">{r.id} · {r.reportType}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'Reported Party',
      key: 'reportedUser',
      render: (r) => (
        <span className="text-xs font-bold text-on-surface block">
          {r.reportedUserName || 'Platform Entity'}
        </span>
      ),
    },
    {
      header: 'Complainant',
      key: 'reporter',
      render: (r) => (
        <div className="text-xs">
          <span className="font-bold text-on-surface block">{r.reporterName}</span>
          <span className="text-[11px] text-on-surface-variant capitalize">{r.reporterRole || 'Farmer'}</span>
        </div>
      ),
    },
    {
      header: 'Reason',
      key: 'reason',
      render: (r) => (
        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-surface-container text-on-surface">
          {r.reason}
        </span>
      ),
    },
    {
      header: 'Filing Date',
      key: 'date',
      render: (r) => (
        <span className="text-xs text-on-surface-variant font-mono">
          {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : 'Recent'}
        </span>
      ),
    },
    {
      header: 'Status',
      key: 'status',
      render: (r) => {
        const statusColors = {
          Pending: 'bg-amber-50 text-amber-800 border-amber-200/60',
          'Under Review': 'bg-blue-50 text-blue-800 border-blue-200/60',
          Resolved: 'bg-emerald-50 text-emerald-800 border-emerald-200/60',
          Rejected: 'bg-surface-container text-on-surface border-outline-variant/40',
        };
        return (
          <span
            className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
              statusColors[r.status] || 'bg-surface-container text-on-surface border-outline-variant/40'
            }`}
          >
            {r.status || 'Pending'}
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
            title="Inspect Dossier"
          >
            <span className="material-symbols-outlined text-[18px]">visibility</span>
          </button>
          <button
            type="button"
            onClick={() => handleOpenResolve(r)}
            className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors cursor-pointer"
            title="Resolve or Dismiss Report"
          >
            <span className="material-symbols-outlined text-[18px]">gavel</span>
          </button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout
      title="Reports & Complaints Center"
      subtitle="Central moderation hub for grievances across Users, Resources, Internships, Messages & Community."
      lang={lang}
      setLang={setLang}
    >
      {/* Filter Pills */}
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
        emptyMessage="No grievance reports found."
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          setPage(1);
        }}
        searchPlaceholder="Search reports by reason, user, keyword..."
        pagination={{
          page,
          totalPages,
          total,
          limit,
          onPageChange: (p) => setPage(p),
        }}
      />

      {/* ─── Modal 1: Inspect Grievance ───────────────────────────────────────── */}
      {inspectReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-surface-container-lowest rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-outline-variant/40 shadow-2xl p-6 sm:p-8 space-y-4">
            <div className="flex items-start justify-between border-b border-outline-variant/30 pb-3">
              <div>
                <h3 className="font-display font-bold text-base sm:text-lg text-on-surface">Grievance Investigation Dossier</h3>
                <p className="text-xs text-on-surface-variant font-mono">Report ID: {inspectReport.id}</p>
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
                <span className="text-on-surface-variant block mb-0.5">Target Entity</span>
                <span className="font-bold text-on-surface">{inspectReport.targetTitle || 'Item'}</span>
              </div>
              <div className="p-3 bg-surface-container-low rounded-2xl border border-outline-variant/30">
                <span className="text-on-surface-variant block mb-0.5">Reported Party</span>
                <span className="font-bold text-on-surface">{inspectReport.reportedUserName || '—'}</span>
              </div>
              <div className="p-3 bg-surface-container-low rounded-2xl border border-outline-variant/30">
                <span className="text-on-surface-variant block mb-0.5">Complainant</span>
                <span className="font-bold text-on-surface">{inspectReport.reporterName} ({inspectReport.reporterRole})</span>
              </div>
              <div className="p-3 bg-surface-container-low rounded-2xl border border-outline-variant/30">
                <span className="text-on-surface-variant block mb-0.5">Violation Category</span>
                <span className="font-bold text-primary">{inspectReport.reason}</span>
              </div>
            </div>

            <div className="p-3.5 bg-surface-container-low rounded-2xl border border-outline-variant/30 space-y-1">
              <span className="text-xs font-bold text-on-surface block">Complainant Statement</span>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                {inspectReport.description || 'Complainant reported non-compliance with Farmer Helper community guidelines.'}
              </p>
            </div>

            {inspectReport.adminNotes && inspectReport.adminNotes.length > 0 && (
              <div className="p-3.5 bg-surface-container-low rounded-2xl border border-outline-variant/30 space-y-1">
                <span className="text-xs font-bold text-primary block">Investigation Notes</span>
                {inspectReport.adminNotes.map((note, idx) => (
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

      {/* ─── Modal 2: Resolve / Adjudicate Report ─────────────────────────────── */}
      {resolveModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <form
            onSubmit={handleSaveResolution}
            className="bg-surface-container-lowest rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-outline-variant/40 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-outline-variant/30 pb-3">
              <h3 className="font-display font-bold text-base sm:text-lg text-on-surface">Moderate Grievance</h3>
              <button
                type="button"
                onClick={() => setResolveModal({ isOpen: false, report: null, status: 'Resolved', note: '' })}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-on-surface-variant font-medium mb-1">Resolution Verdict</label>
                <select
                  value={resolveModal.status}
                  onChange={(e) => setResolveModal({ ...resolveModal, status: e.target.value })}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-outline-variant/60 focus:outline-none focus:border-primary text-on-surface"
                >
                  <option value="Resolved">Resolved (Sanctions Applied / Corrected)</option>
                  <option value="Under Review">Under Review (Escalated to Field Agent)</option>
                  <option value="Rejected">Rejected (Insubstantiated Claim)</option>
                </select>
              </div>

              <div>
                <label className="block text-on-surface-variant font-medium mb-1">Administrative Note / Rationale</label>
                <textarea
                  rows={3}
                  value={resolveModal.note}
                  onChange={(e) => setResolveModal({ ...resolveModal, note: e.target.value })}
                  placeholder="Record justification, action taken, or warning issued..."
                  className="w-full p-2.5 bg-white rounded-xl border border-outline-variant/60 text-xs text-on-surface focus:outline-none focus:border-primary"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-outline-variant/20">
              <button
                type="button"
                onClick={() => setResolveModal({ isOpen: false, report: null, status: 'Resolved', note: '' })}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-on-surface bg-white border border-outline-variant/50 hover:bg-surface-container transition-colors shadow-2xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-primary hover:bg-primary-container shadow-xs transition-colors cursor-pointer"
              >
                Apply Resolution
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
