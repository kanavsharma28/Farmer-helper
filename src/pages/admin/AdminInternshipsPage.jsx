import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminTable from '../../components/admin/AdminTable';
import AdminConfirmModal from '../../components/admin/AdminConfirmModal';
import {
  getAdminInternships,
  updateInternshipStatus,
  deleteInternship,
  getInternshipApplicants,
} from '../../services/adminService';

export default function AdminInternshipsPage() {
  const [lang, setLang] = useState('en');
  const [internships, setInternships] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [applicantsModal, setApplicantsModal] = useState({ isOpen: false, internship: null, applicants: [] });
  const [inspectModal, setInspectModal] = useState(null);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null,
    isDestructive: false,
  });

  const loadInternships = useCallback(() => {
    setIsLoading(true);
    setError(null);
    try {
      const res = getAdminInternships({
        search: searchQuery,
        status: selectedStatus,
        page,
        limit,
      });
      setInternships(res.data);
      setTotal(res.total);
      setTotalPages(res.totalPages);
    } catch (err) {
      console.error('Error fetching internships:', err);
      setError(err.message || 'Unable to load internships.');
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, selectedStatus, page, limit]);

  useEffect(() => {
    loadInternships();
  }, [loadInternships]);

  const handleStatusChange = (internship, status) => {
    setConfirmModal({
      isOpen: true,
      title: `Update Internship Status`,
      message: `Set "${internship.title}" to status "${status}"?`,
      isDestructive: status === 'Rejected' || status === 'Suspended',
      onConfirm: () => {
        updateInternshipStatus(internship.id, status);
        setConfirmModal({ isOpen: false });
        loadInternships();
      },
    });
  };

  const handleDelete = (internship) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Internship Listing',
      message: `Are you sure you want to permanently delete "${internship.title}"? This action cannot be undone.`,
      isDestructive: true,
      onConfirm: () => {
        deleteInternship(internship.id);
        setConfirmModal({ isOpen: false });
        loadInternships();
      },
    });
  };

  const handleViewApplicants = (internship) => {
    const apps = getInternshipApplicants(internship.id);
    setApplicantsModal({ isOpen: true, internship, applicants: apps });
  };

  const statusPills = [
    { id: 'all', label: 'All Internships' },
    { id: 'Approved', label: 'Approved' },
    { id: 'Pending', label: 'Pending Review' },
    { id: 'Rejected', label: 'Rejected' },
  ];

  const columns = [
    {
      header: 'Internship Title',
      key: 'title',
      render: (i) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20">
            <span className="material-symbols-outlined text-lg">school</span>
          </div>
          <div className="min-w-0">
            <div className="font-bold text-on-surface truncate max-w-[220px]">{i.title}</div>
            <div className="text-[11px] text-on-surface-variant truncate">{i.organization || i.farmName}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'Host / Location',
      key: 'location',
      render: (i) => (
        <div className="text-xs">
          <span className="font-bold text-on-surface block">{i.farmerName || 'Agri Organization'}</span>
          <span className="text-[11px] text-on-surface-variant">{i.location}</span>
        </div>
      ),
    },
    {
      header: 'Stipend',
      key: 'stipend',
      render: (i) => (
        <span className="text-xs font-bold text-primary">{i.stipend || 'Unpaid / Certificate'}</span>
      ),
    },
    {
      header: 'Duration',
      key: 'duration',
      render: (i) => (
        <span className="text-xs text-on-surface-variant font-medium">{i.duration}</span>
      ),
    },
    {
      header: 'Applicants',
      key: 'applicants',
      render: (i) => (
        <button
          type="button"
          onClick={() => handleViewApplicants(i)}
          className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-surface-container hover:bg-surface-container-high text-primary flex items-center gap-1 transition-colors cursor-pointer border border-outline-variant/30"
        >
          <span className="material-symbols-outlined text-[15px]">group</span>
          <span>{i.applicantsCount || 0} Applied</span>
        </button>
      ),
    },
    {
      header: 'Status',
      key: 'status',
      render: (i) => {
        const statusColors = {
          Approved: 'bg-emerald-50 text-emerald-800 border-emerald-200/60',
          Active: 'bg-emerald-50 text-emerald-800 border-emerald-200/60',
          Pending: 'bg-amber-50 text-amber-800 border-amber-200/60',
          Rejected: 'bg-red-50 text-red-800 border-red-200/60',
          Suspended: 'bg-red-50 text-red-800 border-red-200/60',
        };
        return (
          <span
            className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
              statusColors[i.status] || 'bg-surface-container text-on-surface border-outline-variant/40'
            }`}
          >
            {i.status || 'Active'}
          </span>
        );
      },
    },
    {
      header: 'Actions',
      key: 'actions',
      className: 'text-right',
      render: (i) => (
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            onClick={() => setInspectModal(i)}
            className="p-1.5 rounded-lg text-primary hover:bg-surface-container transition-colors cursor-pointer"
            title="Inspect Details"
          >
            <span className="material-symbols-outlined text-[18px]">visibility</span>
          </button>
          {i.status !== 'Approved' && (
            <button
              type="button"
              onClick={() => handleStatusChange(i, 'Approved')}
              className="p-1.5 rounded-lg text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer"
              title="Approve Listing"
            >
              <span className="material-symbols-outlined text-[18px]">check_circle</span>
            </button>
          )}
          {i.status !== 'Rejected' && (
            <button
              type="button"
              onClick={() => handleStatusChange(i, 'Rejected')}
              className="p-1.5 rounded-lg text-amber-700 hover:bg-amber-50 transition-colors cursor-pointer"
              title="Reject Listing"
            >
              <span className="material-symbols-outlined text-[18px]">block</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => handleDelete(i)}
            className="p-1.5 rounded-lg text-error hover:bg-error/10 transition-colors cursor-pointer"
            title="Delete Listing"
          >
            <span className="material-symbols-outlined text-[18px]">delete</span>
          </button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout
      title="Internship Management"
      subtitle="Supervise and moderate agriculture apprenticeship listings and student applications."
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
        data={internships}
        keyField="id"
        isLoading={isLoading}
        error={error}
        onRetry={loadInternships}
        emptyMessage="No internship listings found."
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          setPage(1);
        }}
        searchPlaceholder="Search internships by title, farm, location, skill..."
        pagination={{
          page,
          totalPages,
          total,
          limit,
          onPageChange: (p) => setPage(p),
        }}
      />

      {/* ─── Modal 1: Inspect Internship Details ──────────────────────────────── */}
      {inspectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-surface-container-lowest rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-outline-variant/40 shadow-2xl p-6 sm:p-8 space-y-4">
            <div className="flex items-start justify-between border-b border-outline-variant/30 pb-3">
              <div>
                <h3 className="font-display font-bold text-base sm:text-lg text-on-surface">{inspectModal.title}</h3>
                <p className="text-xs text-on-surface-variant">{inspectModal.organization || inspectModal.farmName} · {inspectModal.location}</p>
              </div>
              <button
                type="button"
                onClick={() => setInspectModal(null)}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-surface-container-low rounded-2xl border border-outline-variant/30">
                <span className="text-on-surface-variant block mb-0.5">Duration</span>
                <span className="font-bold text-on-surface">{inspectModal.duration}</span>
              </div>
              <div className="p-3 bg-surface-container-low rounded-2xl border border-outline-variant/30">
                <span className="text-on-surface-variant block mb-0.5">Stipend</span>
                <span className="font-bold text-primary">{inspectModal.stipend || 'Unpaid'}</span>
              </div>
              <div className="p-3 bg-surface-container-low rounded-2xl border border-outline-variant/30">
                <span className="text-on-surface-variant block mb-0.5">Open Positions</span>
                <span className="font-bold text-on-surface">{inspectModal.positions || 2} Openings</span>
              </div>
              <div className="p-3 bg-surface-container-low rounded-2xl border border-outline-variant/30">
                <span className="text-on-surface-variant block mb-0.5">Application Deadline</span>
                <span className="font-bold text-on-surface">{inspectModal.deadline || 'Rolling'}</span>
              </div>
            </div>

            <div className="p-3.5 bg-surface-container-low rounded-2xl border border-outline-variant/30 space-y-1">
              <span className="text-xs font-bold text-on-surface block">Role Overview</span>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                {inspectModal.description || 'Hands-on agricultural internship program for students and apprentices.'}
              </p>
            </div>

            <div className="flex justify-end pt-2 border-t border-outline-variant/20">
              <button
                type="button"
                onClick={() => setInspectModal(null)}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold text-on-surface bg-white border border-outline-variant/50 hover:bg-surface-container transition-colors shadow-2xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Modal 2: Enrolled Applicants ─────────────────────────────────────── */}
      {applicantsModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-surface-container-lowest rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-outline-variant/40 shadow-2xl p-6 sm:p-8 space-y-4">
            <div className="flex items-start justify-between border-b border-outline-variant/30 pb-3">
              <div>
                <h3 className="font-display font-bold text-base sm:text-lg text-on-surface">Registered Student Applicants</h3>
                <p className="text-xs text-on-surface-variant">For {applicantsModal.internship?.title}</p>
              </div>
              <button
                type="button"
                onClick={() => setApplicantsModal({ isOpen: false, internship: null, applicants: [] })}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {applicantsModal.applicants.length === 0 ? (
                <p className="text-xs text-on-surface-variant text-center py-8">
                  No student applications submitted yet.
                </p>
              ) : (
                applicantsModal.applicants.map((a) => (
                  <div
                    key={a.id}
                    className="p-3 bg-surface-container-low rounded-2xl border border-outline-variant/30 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-on-surface">{a.studentName}</div>
                      <div className="text-[11px] text-on-surface-variant">{a.college} · GPA: {a.gpa || '3.8'}</div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200/60">
                      {a.status || 'Pending'}
                    </span>
                  </div>
                ))
              )}
            </div>

            <div className="flex justify-end pt-2 border-t border-outline-variant/20">
              <button
                type="button"
                onClick={() => setApplicantsModal({ isOpen: false, internship: null, applicants: [] })}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold text-on-surface bg-white border border-outline-variant/50 hover:bg-surface-container transition-colors shadow-2xs cursor-pointer"
              >
                Close
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
