import React from 'react';

export default function AdminTable({
  columns = [],
  data = [],
  keyField = 'id',
  isLoading = false,
  error = null,
  onRetry = null,
  emptyMessage = 'No records found.',
  searchQuery = '',
  onSearchChange = null,
  searchPlaceholder = 'Search records...',
  filterSlot = null,
  pagination = null, // { page, totalPages, total, limit, onPageChange }
  selectedIds = [],
  onSelectAll = null,
  onSelectItem = null,
  bulkActions = null, // [{ label, action, isDestructive }]
  onBulkAction = null,
}) {
  const allSelected = data.length > 0 && selectedIds.length === data.length;
  const someSelected = selectedIds.length > 0 && !allSelected;

  return (
    <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 shadow-xs overflow-hidden flex flex-col">
      {/* Search & Filter Bar */}
      {(onSearchChange || filterSlot || (bulkActions && selectedIds.length > 0)) && (
        <div className="p-4 sm:p-5 border-b border-outline-variant/20 flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-surface-container-low/40">
          <div className="flex flex-wrap items-center gap-3 flex-1">
            {onSearchChange && (
              <div className="relative min-w-[240px] max-w-md w-full">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-lg">
                  search
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="w-full pl-10 pr-4 py-2 bg-white rounded-full border border-outline-variant/60 text-xs sm:text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-2xs placeholder:text-on-surface-variant/60 font-body-md"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => onSearchChange('')}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface text-xs cursor-pointer"
                  >
                    ✕
                  </button>
                )}
              </div>
            )}

            {filterSlot}
          </div>

          {/* Bulk Action Controls */}
          {bulkActions && selectedIds.length > 0 && onBulkAction && (
            <div className="flex items-center gap-2 bg-primary/10 px-3 py-1.5 rounded-xl border border-primary/20 animate-fadeIn shrink-0">
              <span className="text-xs font-bold text-primary">
                {selectedIds.length} selected
              </span>
              <div className="flex items-center gap-1.5">
                {bulkActions.map((ba) => (
                  <button
                    key={ba.label}
                    type="button"
                    onClick={() => onBulkAction(ba.action, selectedIds)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer ${
                      ba.isDestructive
                        ? 'bg-error text-white hover:bg-error/90'
                        : 'bg-primary text-white hover:bg-primary-container'
                    }`}
                  >
                    {ba.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main Table Body */}
      <div className="overflow-x-auto min-h-[220px]">
        {isLoading ? (
          <div className="py-20 text-center space-y-3">
            <span className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin inline-block" />
            <p className="text-xs font-semibold text-on-surface-variant">Loading records...</p>
          </div>
        ) : error ? (
          <div className="py-20 text-center space-y-3 px-4">
            <span className="material-symbols-outlined text-4xl text-error block">
              error_outline
            </span>
            <p className="text-sm font-semibold text-on-surface">
              {error || 'Unable to load data. Please try again.'}
            </p>
            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl shadow-xs hover:bg-primary-container transition-colors cursor-pointer"
              >
                Retry
              </button>
            )}
          </div>
        ) : data.length === 0 ? (
          <div className="py-20 text-center space-y-2 px-4">
            <span className="material-symbols-outlined text-4xl text-outline/50 block">
              inventory_2
            </span>
            <p className="text-sm font-semibold text-on-surface">{emptyMessage}</p>
            {searchQuery && (
              <p className="text-xs text-on-surface-variant">
                Try clearing or modifying your search terms.
              </p>
            )}
          </div>
        ) : (
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="bg-surface-container-low/60 border-b border-outline-variant/30 text-on-surface-variant font-bold uppercase tracking-wider text-[11px]">
                {onSelectAll && (
                  <th className="p-3.5 sm:p-4 w-10 text-center">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      ref={(el) => {
                        if (el) el.indeterminate = someSelected;
                      }}
                      onChange={onSelectAll}
                      className="w-4 h-4 rounded text-primary focus:ring-primary cursor-pointer accent-primary"
                    />
                  </th>
                )}
                {columns.map((col, idx) => (
                  <th
                    key={col.key || idx}
                    className={`p-3.5 sm:p-4 font-bold whitespace-nowrap ${col.className || ''}`}
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/15">
              {data.map((item, rowIdx) => {
                const itemId = item[keyField] || rowIdx;
                const isSelected = selectedIds.includes(itemId);

                return (
                  <tr
                    key={itemId}
                    className={`hover:bg-surface-container-low/40 transition-colors text-on-surface ${
                      isSelected ? 'bg-primary/5' : ''
                    }`}
                  >
                    {onSelectItem && (
                      <td className="p-3.5 sm:p-4 w-10 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => onSelectItem(itemId)}
                          className="w-4 h-4 rounded text-primary focus:ring-primary cursor-pointer accent-primary"
                        />
                      </td>
                    )}
                    {columns.map((col, cIdx) => (
                      <td
                        key={col.key || cIdx}
                        className={`p-3.5 sm:p-4 align-middle ${col.className || ''}`}
                      >
                        {col.render ? col.render(item, rowIdx) : item[col.key] || '—'}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination Footer */}
      {pagination && pagination.totalPages > 1 && (
        <div className="p-4 border-t border-outline-variant/20 bg-surface-container-low/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-on-surface-variant">
          <div>
            Showing <span className="font-bold text-on-surface">{Math.min(data.length, pagination.limit)}</span> of{' '}
            <span className="font-bold text-on-surface">{pagination.total}</span> records
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={pagination.page <= 1}
              onClick={() => pagination.onPageChange(pagination.page - 1)}
              className="px-3 py-1.5 rounded-xl border border-outline-variant/50 bg-white text-on-surface font-semibold hover:bg-surface-container hover:text-primary disabled:opacity-40 transition-all shadow-2xs cursor-pointer flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[15px]">chevron_left</span>
              <span>Previous</span>
            </button>
            <span className="px-3 py-1 font-bold text-on-surface">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              type="button"
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => pagination.onPageChange(pagination.page + 1)}
              className="px-3 py-1.5 rounded-xl border border-outline-variant/50 bg-white text-on-surface font-semibold hover:bg-surface-container hover:text-primary disabled:opacity-40 transition-all shadow-2xs cursor-pointer flex items-center gap-1"
            >
              <span>Next</span>
              <span className="material-symbols-outlined text-[15px]">chevron_right</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
