import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminTable from '../../components/admin/AdminTable';
import AdminConfirmModal from '../../components/admin/AdminConfirmModal';
import {
  getAdminTrainings,
  saveTraining,
  deleteTraining,
  updateTrainingStatus,
  getTrainingRegistrations,
} from '../../services/adminService';

export default function AdminTrainingPage() {
  const [lang, setLang] = useState('en');
  const [trainings, setTrainings] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editingTraining, setEditingTraining] = useState(null);
  const [studentsModal, setStudentsModal] = useState({ isOpen: false, training: null, students: [] });
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null,
    isDestructive: false,
  });

  const loadTrainings = useCallback(() => {
    setIsLoading(true);
    setError(null);
    try {
      const res = getAdminTrainings({
        search: searchQuery,
        status: selectedStatus,
        page,
        limit,
      });
      setTrainings(res.data);
      setTotal(res.total);
      setTotalPages(res.totalPages);
    } catch (err) {
      console.error('Error fetching trainings:', err);
      setError(err.message || 'Unable to load training programs.');
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, selectedStatus, page, limit]);

  useEffect(() => {
    loadTrainings();
  }, [loadTrainings]);

  const handleCreateNew = () => {
    setEditingTraining({
      id: '',
      titleEn: '',
      organizerEn: 'Krishi Vigyan Kendra (KVK)',
      modeEn: 'Hybrid',
      dateEn: 'Upcoming Batch',
      locationEn: 'Meerut / Online',
      registeredCount: 0,
      status: 'Active',
      descEn: '',
    });
  };

  const handleSaveTraining = (e) => {
    e.preventDefault();
    try {
      saveTraining(editingTraining);
      setEditingTraining(null);
      loadTrainings();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = (training) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Training Program',
      message: `Delete workshop "${training.titleEn}"? This action cannot be undone.`,
      isDestructive: true,
      onConfirm: () => {
        deleteTraining(training.id);
        setConfirmModal({ isOpen: false });
        loadTrainings();
      },
    });
  };

  const handleViewStudents = (training) => {
    const regs = getTrainingRegistrations(training.id);
    setStudentsModal({ isOpen: true, training, students: regs });
  };

  const columns = [
    {
      header: 'Program / Workshop',
      key: 'title',
      render: (t) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20 text-xl">
            {t.imageEmoji || '🌱'}
          </div>
          <div className="min-w-0">
            <div className="font-bold text-on-surface truncate max-w-[220px]">{t.titleEn}</div>
            <div className="text-[11px] text-on-surface-variant truncate">{t.organizerEn}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'Mode',
      key: 'mode',
      render: (t) => (
        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-surface-container text-on-surface">
          {t.modeEn || 'Online'}
        </span>
      ),
    },
    {
      header: 'Date & Schedule',
      key: 'date',
      render: (t) => (
        <span className="text-xs text-on-surface font-medium">{t.dateEn}</span>
      ),
    },
    {
      header: 'Location',
      key: 'location',
      render: (t) => (
        <span className="text-xs text-on-surface-variant truncate max-w-[130px] block">{t.locationEn}</span>
      ),
    },
    {
      header: 'Registrations',
      key: 'students',
      render: (t) => (
        <button
          type="button"
          onClick={() => handleViewStudents(t)}
          className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-surface-container hover:bg-surface-container-high text-primary flex items-center gap-1 transition-colors cursor-pointer border border-outline-variant/30"
        >
          <span className="material-symbols-outlined text-[15px]">school</span>
          <span>{t.registeredCount || 0} Enrolled</span>
        </button>
      ),
    },
    {
      header: 'Status',
      key: 'status',
      render: (t) => (
        <span
          className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
            t.status === 'Active'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200/60'
              : 'bg-surface-container text-on-surface border-outline-variant/40'
          }`}
        >
          {t.status || 'Active'}
        </span>
      ),
    },
    {
      header: 'Actions',
      key: 'actions',
      className: 'text-right',
      render: (t) => (
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            onClick={() => setEditingTraining({ ...t })}
            className="p-1.5 rounded-lg text-primary hover:bg-surface-container transition-colors cursor-pointer"
            title="Edit Program"
          >
            <span className="material-symbols-outlined text-[18px]">edit</span>
          </button>
          <button
            type="button"
            onClick={() => handleDelete(t)}
            className="p-1.5 rounded-lg text-error hover:bg-error/10 transition-colors cursor-pointer"
            title="Delete Program"
          >
            <span className="material-symbols-outlined text-[18px]">delete</span>
          </button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout
      title="Training & Workshops"
      subtitle="Manage agritech webinars, field workshops, drone spraying trainings, and student certifications."
      lang={lang}
      setLang={setLang}
    >
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface-container-lowest p-3.5 sm:p-4 rounded-2xl border border-outline-variant/40 shadow-xs">
        <div>
          <h2 className="text-sm sm:text-base font-bold text-on-surface">Platform Training Catalog ({total})</h2>
          <p className="text-xs text-on-surface-variant">Live skill development sessions across universities & KVKs</p>
        </div>

        <button
          type="button"
          onClick={handleCreateNew}
          className="px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold shadow-xs hover:bg-primary-container transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
        >
          <span className="material-symbols-outlined text-base">add</span>
          <span>+ Add New Training</span>
        </button>
      </div>

      {/* Main Table */}
      <AdminTable
        columns={columns}
        data={trainings}
        keyField="id"
        isLoading={isLoading}
        error={error}
        onRetry={loadTrainings}
        emptyMessage="No training programs found."
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          setPage(1);
        }}
        searchPlaceholder="Search training by title, organizer, location..."
        pagination={{
          page,
          totalPages,
          total,
          limit,
          onPageChange: (p) => setPage(p),
        }}
      />

      {/* ─── Modal 1: Add / Edit Training ─────────────────────────────────────── */}
      {editingTraining && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <form
            onSubmit={handleSaveTraining}
            className="bg-surface-container-lowest rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-outline-variant/40 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-outline-variant/30 pb-3">
              <h3 className="font-display font-bold text-base sm:text-lg text-on-surface">
                {editingTraining.id ? 'Edit Training Program' : 'Create New Training'}
              </h3>
              <button
                type="button"
                onClick={() => setEditingTraining(null)}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-on-surface-variant font-medium mb-1">Training Title</label>
                <input
                  type="text"
                  value={editingTraining.titleEn || ''}
                  onChange={(e) => setEditingTraining({ ...editingTraining, titleEn: e.target.value })}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-outline-variant/60 focus:outline-none focus:border-primary text-on-surface"
                  placeholder="e.g. Agri-Drone Pilot & Spraying Course"
                  required
                />
              </div>

              <div>
                <label className="block text-on-surface-variant font-medium mb-1">Organizer</label>
                <input
                  type="text"
                  value={editingTraining.organizerEn || ''}
                  onChange={(e) => setEditingTraining({ ...editingTraining, organizerEn: e.target.value })}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-outline-variant/60 focus:outline-none focus:border-primary text-on-surface"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-on-surface-variant font-medium mb-1">Mode</label>
                  <select
                    value={editingTraining.modeEn || 'Online'}
                    onChange={(e) => setEditingTraining({ ...editingTraining, modeEn: e.target.value })}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-outline-variant/60 focus:outline-none focus:border-primary text-on-surface"
                  >
                    <option value="Online">Online Webinar</option>
                    <option value="In-Person">In-Person Field</option>
                    <option value="Hybrid">Hybrid Hands-on</option>
                  </select>
                </div>
                <div>
                  <label className="block text-on-surface-variant font-medium mb-1">Date</label>
                  <input
                    type="text"
                    value={editingTraining.dateEn || ''}
                    onChange={(e) => setEditingTraining({ ...editingTraining, dateEn: e.target.value })}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-outline-variant/60 focus:outline-none focus:border-primary text-on-surface"
                  />
                </div>
              </div>

              <div>
                <label className="block text-on-surface-variant font-medium mb-1">Location</label>
                <input
                  type="text"
                  value={editingTraining.locationEn || ''}
                  onChange={(e) => setEditingTraining({ ...editingTraining, locationEn: e.target.value })}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-outline-variant/60 focus:outline-none focus:border-primary text-on-surface"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-outline-variant/20">
              <button
                type="button"
                onClick={() => setEditingTraining(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-on-surface bg-white border border-outline-variant/50 hover:bg-surface-container transition-colors shadow-2xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-primary hover:bg-primary-container shadow-xs transition-colors cursor-pointer"
              >
                Save Program
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ─── Modal 2: Enrolled Students ───────────────────────────────────────── */}
      {studentsModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-surface-container-lowest rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-outline-variant/40 shadow-2xl p-6 sm:p-8 space-y-4">
            <div className="flex items-start justify-between border-b border-outline-variant/30 pb-3">
              <div>
                <h3 className="font-display font-bold text-base sm:text-lg text-on-surface">Registered Students</h3>
                <p className="text-xs text-on-surface-variant">{studentsModal.training?.titleEn}</p>
              </div>
              <button
                type="button"
                onClick={() => setStudentsModal({ isOpen: false, training: null, students: [] })}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {studentsModal.students.length === 0 ? (
                <p className="text-xs text-on-surface-variant text-center py-8">
                  No students currently registered for this session.
                </p>
              ) : (
                studentsModal.students.map((s, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-surface-container-low rounded-2xl border border-outline-variant/30 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-on-surface">{s.studentName || s.name || 'Enrolled Scholar'}</div>
                      <div className="text-[11px] text-on-surface-variant">Registered: {s.date || 'Recent'}</div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200/60">
                      Confirmed
                    </span>
                  </div>
                ))
              )}
            </div>

            <div className="flex justify-end pt-2 border-t border-outline-variant/20">
              <button
                type="button"
                onClick={() => setStudentsModal({ isOpen: false, training: null, students: [] })}
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
