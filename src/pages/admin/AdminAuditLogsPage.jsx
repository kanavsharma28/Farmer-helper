import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminTable from '../../components/admin/AdminTable';
import { getAuditLogs } from '../../services/adminService';

export default function AdminAuditLogsPage() {
  const [lang, setLang] = useState('en');
  const [logs, setLogs] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(15);
  const [searchAdmin, setSearchAdmin] = useState('');
  const [selectedAction, setSelectedAction] = useState('all');
  const [selectedTarget, setSelectedTarget] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [inspectLog, setInspectLog] = useState(null);

  const loadLogs = useCallback(() => {
    setIsLoading(true);
    setError(null);
    try {
      const res = getAuditLogs({
        admin: searchAdmin,
        action: selectedAction,
        targetType: selectedTarget,
        dateFrom,
        dateTo,
        page,
        limit,
      });
      setLogs(res.data);
      setTotal(res.total);
      setTotalPages(res.totalPages);
    } catch (err) {
      console.error('Error fetching audit logs:', err);
      setError(err.message || 'Unable to load audit logs.');
    } finally {
      setIsLoading(false);
    }
  }, [searchAdmin, selectedAction, selectedTarget, dateFrom, dateTo, page, limit]);

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  const columns = [
    {
      header: 'Timestamp',
      key: 'timestamp',
      render: (l) => (
        <div className="text-xs">
          <span className="font-bold text-on-surface block">
            {new Date(l.timestamp).toLocaleDateString()}
          </span>
          <span className="text-[11px] text-on-surface-variant font-mono">
            {new Date(l.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>
        </div>
      ),
    },
    {
      header: 'Admin',
      key: 'admin',
      render: (l) => (
        <div className="text-xs">
          <span className="font-bold text-on-surface block">{l.adminName}</span>
          <span className="text-[11px] text-on-surface-variant font-mono">{l.adminId}</span>
        </div>
      ),
    },
    {
      header: 'Action',
      key: 'action',
      render: (l) => {
        const isDelete = l.action?.includes('DELETE') || l.action?.includes('REMOV');
        const isSuspended = l.action?.includes('SUSPEND');
        const isVerified = l.action?.includes('VERIF') || l.action?.includes('APPROV');

        return (
          <span
            className={`px-2.5 py-0.5 rounded-full text-xs font-semibold font-mono inline-block border ${
              isDelete
                ? 'bg-rose-50 text-rose-800 border-rose-200'
                : isSuspended
                ? 'bg-amber-50 text-amber-800 border-amber-200'
                : isVerified
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-surface-container-low text-on-surface-variant border-outline-variant/40'
            }`}
          >
            {l.action}
          </span>
        );
      },
    },
    {
      header: 'Target',
      key: 'target',
      render: (l) => (
        <div className="text-xs">
          <span className="font-semibold text-on-surface block">{l.targetType}</span>
          <span className="text-[11px] text-on-surface-variant font-mono truncate max-w-[120px] block">
            ID: {l.targetId}
          </span>
        </div>
      ),
    },
    {
      header: 'Description',
      key: 'description',
      render: (l) => (
        <p className="text-xs text-on-surface-variant max-w-[280px] truncate" title={l.description}>
          {l.description}
        </p>
      ),
    },
    {
      header: 'Client / Device',
      key: 'device',
      render: (l) => (
        <span className="text-[11px] text-on-surface-variant truncate max-w-[140px] block">
          {l.device || 'Web Session'}
        </span>
      ),
    },
    {
      header: 'Details',
      key: 'inspect',
      className: 'text-right',
      render: (l) => (
        <button
          type="button"
          onClick={() => setInspectLog(l)}
          className="p-1.5 rounded-xl text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-colors cursor-pointer"
          title="Inspect Record"
        >
          <span className="material-symbols-outlined text-[18px]">info</span>
        </button>
      ),
    },
  ];

  return (
    <AdminLayout
      title="System Audit Logs"
      subtitle="Immutable, strictly sequenced operational logs for administrative oversight and compliance."
      lang={lang}
      setLang={setLang}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-on-surface">Audit Trail ({total})</h2>
          <p className="text-xs text-on-surface-variant">Every sensitive admin action is logged here permanently and cannot be modified.</p>
        </div>
      </div>

      <AdminTable
        columns={columns}
        data={logs}
        keyField="id"
        isLoading={isLoading}
        error={error}
        onRetry={loadLogs}
        emptyMessage="No audit logs recorded matching search criteria."
        searchQuery={searchAdmin}
        onSearchChange={(q) => {
          setSearchAdmin(q);
          setPage(1);
        }}
        searchPlaceholder="Filter by admin name or ID..."
        filterSlot={
          <>
            <select
              value={selectedTarget}
              onChange={(e) => {
                setSelectedTarget(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 bg-surface-container-lowest rounded-xl border border-outline-variant/40 text-xs font-semibold text-on-surface focus:outline-none focus:border-primary"
            >
              <option value="all">All Targets</option>
              <option value="User">User</option>
              <option value="Resource">Resource</option>
              <option value="Internship">Internship</option>
              <option value="Training">Training</option>
              <option value="Community Post">Community</option>
              <option value="Message">Message</option>
              <option value="Government Scheme">Scheme</option>
              <option value="Report">Report</option>
              <option value="Settings">Settings</option>
            </select>

            <input
              type="date"
              value={dateFrom}
              onChange={(e) => {
                setDateFrom(e.target.value);
                setPage(1);
              }}
              className="px-3 py-1.5 bg-surface-container-lowest rounded-xl border border-outline-variant/40 text-xs font-semibold text-on-surface focus:outline-none focus:border-primary"
              title="From date"
            />
          </>
        }
        pagination={{
          page,
          totalPages,
          total,
          limit,
          onPageChange: (p) => setPage(p),
        }}
      />

      {/* Inspect Log Modal */}
      {inspectLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
          <div className="bg-surface-container-lowest rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-outline-variant/40 space-y-5 max-h-[85vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-outline-variant/30 pb-3">
              <div>
                <h3 className="font-bold text-lg text-on-surface">Audit Record Details</h3>
                <span className="font-mono text-xs text-on-surface-variant">ID: {inspectLog.id}</span>
              </div>
              <button
                type="button"
                onClick={() => setInspectLog(null)}
                className="w-8 h-8 rounded-full bg-surface-container-low hover:bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-surface-container-low/50 p-4 rounded-2xl border border-outline-variant/30">
                <div>
                  <span className="text-on-surface-variant block font-medium">Administrator</span>
                  <span className="font-bold text-on-surface">{inspectLog.adminName}</span>
                </div>
                <div>
                  <span className="text-on-surface-variant block font-medium">Action</span>
                  <span className="font-mono font-bold text-primary">{inspectLog.action}</span>
                </div>
                <div>
                  <span className="text-on-surface-variant block font-medium">Target Type</span>
                  <span className="font-semibold text-on-surface">{inspectLog.targetType}</span>
                </div>
                <div>
                  <span className="text-on-surface-variant block font-medium">Target ID</span>
                  <span className="font-mono text-on-surface">{inspectLog.targetId}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-on-surface-variant block font-medium">Timestamp</span>
                  <span className="font-semibold text-on-surface">{new Date(inspectLog.timestamp).toISOString()}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-on-surface-variant block font-medium">Client Device</span>
                  <span className="font-mono text-on-surface">{inspectLog.device}</span>
                </div>
              </div>

              <div className="p-4 bg-surface-container-low/50 rounded-2xl border border-outline-variant/30 space-y-1">
                <span className="text-on-surface-variant font-semibold block">Full Action Narrative</span>
                <p className="text-on-surface leading-relaxed">{inspectLog.description}</p>
              </div>

              {inspectLog.details && (
                <div className="p-3 bg-surface-container-low rounded-2xl border border-outline-variant/30 font-mono text-[11px] overflow-x-auto text-on-surface">
                  <pre>{JSON.stringify(inspectLog.details, null, 2)}</pre>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setInspectLog(null)}
                className="px-5 py-2.5 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary-container transition-colors shadow-xs cursor-pointer"
              >
                Close Record
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
