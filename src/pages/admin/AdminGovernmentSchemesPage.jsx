import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminTable from '../../components/admin/AdminTable';
import AdminConfirmModal from '../../components/admin/AdminConfirmModal';
import {
  getAdminSchemes,
  saveScheme,
  deleteScheme,
  updateSchemeStatus,
} from '../../services/adminService';

export default function AdminGovernmentSchemesPage() {
  const [lang, setLang] = useState('en');
  const [schemes, setSchemes] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedState, setSelectedState] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editingScheme, setEditingScheme] = useState(null);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null,
    isDestructive: false,
  });

  const loadSchemes = useCallback(() => {
    setIsLoading(true);
    setError(null);
    try {
      const res = getAdminSchemes({
        search: searchQuery,
        category: selectedCategory,
        state: selectedState,
        page,
        limit,
      });
      setSchemes(res.data);
      setTotal(res.total);
      setTotalPages(res.totalPages);
    } catch (err) {
      console.error('Error fetching schemes:', err);
      setError(err.message || 'Unable to load government schemes.');
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, selectedCategory, selectedState, page, limit]);

  useEffect(() => {
    loadSchemes();
  }, [loadSchemes]);

  const handleCreateNew = () => {
    setEditingScheme({
      id: '',
      name: '',
      category: 'Financial',
      state: 'Central',
      benefits: 'Financial assistance and support subsidy.',
      eligibility: 'All verified agricultural farmers.',
      officialUrl: 'https://pmkisan.gov.in',
      status: 'active',
    });
  };

  const handleSaveScheme = (e) => {
    e.preventDefault();
    try {
      saveScheme(editingScheme);
      setEditingScheme(null);
      loadSchemes();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleStatusToggle = (s) => {
    const nextStatus = s.status === 'inactive' ? 'active' : 'inactive';
    setConfirmModal({
      isOpen: true,
      title: `${nextStatus === 'active' ? 'Activate' : 'Deactivate'} Scheme`,
      message: `Set status of "${s.name}" to ${nextStatus}?`,
      isDestructive: nextStatus === 'inactive',
      onConfirm: () => {
        updateSchemeStatus(s.id, nextStatus);
        setConfirmModal({ isOpen: false });
        loadSchemes();
      },
    });
  };

  const handleDelete = (s) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Government Scheme',
      message: `Permanently delete scheme "${s.name}"? This action cannot be undone.`,
      isDestructive: true,
      onConfirm: () => {
        deleteScheme(s.id);
        setConfirmModal({ isOpen: false });
        loadSchemes();
      },
    });
  };

  const categoryPills = [
    { id: 'all', label: 'All Categories' },
    { id: 'Financial', label: 'Financial' },
    { id: 'Insurance', label: 'Insurance' },
    { id: 'Equipment', label: 'Equipment Subsidy' },
    { id: 'Solar & Irrigation', label: 'Solar & Irrigation' },
  ];

  const columns = [
    {
      header: 'Scheme Name',
      key: 'name',
      render: (s) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20">
            <span className="material-symbols-outlined text-lg">gavel</span>
          </div>
          <div className="min-w-0">
            <div className="font-bold text-on-surface truncate max-w-[240px]">{s.name}</div>
            <div className="text-[11px] text-on-surface-variant truncate">{s.category} · {s.state || 'All India'}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'Category',
      key: 'category',
      render: (s) => (
        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-surface-container text-on-surface">
          {s.category}
        </span>
      ),
    },
    {
      header: 'Applicable Region',
      key: 'state',
      render: (s) => (
        <span className="text-xs text-on-surface-variant font-medium">{s.state || 'National / Central'}</span>
      ),
    },
    {
      header: 'Official Portal',
      key: 'url',
      render: (s) => (
        <a
          href={s.officialUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 max-w-[170px] truncate"
        >
          <span className="truncate">{s.officialUrl}</span>
          <span className="material-symbols-outlined text-xs shrink-0">open_in_new</span>
        </a>
      ),
    },
    {
      header: 'Status',
      key: 'status',
      render: (s) => (
        <span
          className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
            s.status !== 'inactive'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200/60'
              : 'bg-surface-container text-on-surface border-outline-variant/40'
          }`}
        >
          {s.status === 'inactive' ? 'Inactive' : 'Active'}
        </span>
      ),
    },
    {
      header: 'Actions',
      key: 'actions',
      className: 'text-right',
      render: (s) => (
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            onClick={() => setEditingScheme({ ...s })}
            className="p-1.5 rounded-lg text-primary hover:bg-surface-container transition-colors cursor-pointer"
            title="Edit Scheme"
          >
            <span className="material-symbols-outlined text-[18px]">edit</span>
          </button>
          <button
            type="button"
            onClick={() => handleStatusToggle(s)}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              s.status === 'inactive' ? 'text-emerald-700 hover:bg-emerald-50' : 'text-amber-700 hover:bg-amber-50'
            }`}
            title={s.status === 'inactive' ? 'Activate Scheme' : 'Deactivate Scheme'}
          >
            <span className="material-symbols-outlined text-[18px]">
              {s.status === 'inactive' ? 'check_circle' : 'block'}
            </span>
          </button>
          <button
            type="button"
            onClick={() => handleDelete(s)}
            className="p-1.5 rounded-lg text-error hover:bg-error/10 transition-colors cursor-pointer"
            title="Delete Scheme"
          >
            <span className="material-symbols-outlined text-[18px]">delete</span>
          </button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout
      title="Government Schemes Management"
      subtitle="Verify, add, and publish official central & state agriculture welfare schemes."
      lang={lang}
      setLang={setLang}
    >
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface-container-lowest p-3.5 sm:p-4 rounded-2xl border border-outline-variant/40 shadow-xs">
        <div>
          <h2 className="text-sm sm:text-base font-bold text-on-surface">Published Government Schemes ({total})</h2>
          <p className="text-xs text-on-surface-variant">Central & State portal direct integrations with domain verification</p>
        </div>

        <button
          type="button"
          onClick={handleCreateNew}
          className="px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold shadow-xs hover:bg-primary-container transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
        >
          <span className="material-symbols-outlined text-base">add</span>
          <span>+ Add Scheme</span>
        </button>
      </div>

      {/* Filter Pills */}
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
      </div>

      {/* Main Table */}
      <AdminTable
        columns={columns}
        data={schemes}
        keyField="id"
        isLoading={isLoading}
        error={error}
        onRetry={loadSchemes}
        emptyMessage="No government schemes found."
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          setPage(1);
        }}
        searchPlaceholder="Search schemes by name, benefits, state..."
        pagination={{
          page,
          totalPages,
          total,
          limit,
          onPageChange: (p) => setPage(p),
        }}
      />

      {/* ─── Modal: Add / Edit Scheme ─────────────────────────────────────────── */}
      {editingScheme && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <form
            onSubmit={handleSaveScheme}
            className="bg-surface-container-lowest rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-outline-variant/40 space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-outline-variant/30 pb-3">
              <h3 className="font-display font-bold text-base sm:text-lg text-on-surface">
                {editingScheme.id ? 'Edit Scheme' : 'Add Government Scheme'}
              </h3>
              <button
                type="button"
                onClick={() => setEditingScheme(null)}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-on-surface-variant font-medium mb-1">Scheme Name</label>
                <input
                  type="text"
                  value={editingScheme.name || ''}
                  onChange={(e) => setEditingScheme({ ...editingScheme, name: e.target.value })}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-outline-variant/60 focus:outline-none focus:border-primary text-on-surface"
                  placeholder="e.g. PM-Kisan Samman Nidhi Yojana"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-on-surface-variant font-medium mb-1">Category</label>
                  <select
                    value={editingScheme.category || 'Financial'}
                    onChange={(e) => setEditingScheme({ ...editingScheme, category: e.target.value })}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-outline-variant/60 focus:outline-none focus:border-primary text-on-surface"
                  >
                    <option value="Financial">Financial Support</option>
                    <option value="Insurance">Crop Insurance</option>
                    <option value="Equipment">Equipment Subsidy</option>
                    <option value="Solar & Irrigation">Solar & Irrigation</option>
                    <option value="Organic Farming">Organic Farming</option>
                  </select>
                </div>
                <div>
                  <label className="block text-on-surface-variant font-medium mb-1">State / Scope</label>
                  <input
                    type="text"
                    value={editingScheme.state || 'Central'}
                    onChange={(e) => setEditingScheme({ ...editingScheme, state: e.target.value })}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-outline-variant/60 focus:outline-none focus:border-primary text-on-surface"
                  />
                </div>
              </div>

              <div>
                <label className="block text-on-surface-variant font-medium mb-1">
                  Official Portal URL (Must be a valid .gov.in domain)
                </label>
                <input
                  type="url"
                  value={editingScheme.officialUrl || ''}
                  onChange={(e) => setEditingScheme({ ...editingScheme, officialUrl: e.target.value })}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-outline-variant/60 focus:outline-none focus:border-primary text-on-surface font-mono"
                  placeholder="https://pmkisan.gov.in"
                  required
                />
              </div>

              <div>
                <label className="block text-on-surface-variant font-medium mb-1">Benefits</label>
                <textarea
                  rows={2}
                  value={editingScheme.benefits || ''}
                  onChange={(e) => setEditingScheme({ ...editingScheme, benefits: e.target.value })}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-outline-variant/60 focus:outline-none focus:border-primary text-on-surface"
                />
              </div>

              <div>
                <label className="block text-on-surface-variant font-medium mb-1">Eligibility Criteria</label>
                <textarea
                  rows={2}
                  value={editingScheme.eligibility || ''}
                  onChange={(e) => setEditingScheme({ ...editingScheme, eligibility: e.target.value })}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-outline-variant/60 focus:outline-none focus:border-primary text-on-surface"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-outline-variant/20">
              <button
                type="button"
                onClick={() => setEditingScheme(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-on-surface bg-white border border-outline-variant/50 hover:bg-surface-container transition-colors shadow-2xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-primary hover:bg-primary-container shadow-xs transition-colors cursor-pointer"
              >
                Save Scheme
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
