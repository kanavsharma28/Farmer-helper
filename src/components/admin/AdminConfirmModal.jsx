import React from 'react';

export default function AdminConfirmModal({
  isOpen,
  title = 'Confirm Action',
  message = 'Are you sure you want to perform this action?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDestructive = false,
  onConfirm,
  onCancel,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-surface-container-lowest rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-outline-variant/40 space-y-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
              isDestructive
                ? 'bg-error/10 text-error border border-error/20'
                : 'bg-primary/10 text-primary border border-primary/20'
            }`}
          >
            <span className="material-symbols-outlined text-2xl">
              {isDestructive ? 'warning' : 'help_outline'}
            </span>
          </div>
          <div>
            <h3 className="font-display font-bold text-base sm:text-lg text-on-surface">{title}</h3>
            {isDestructive && (
              <p className="text-xs text-error font-medium">This action cannot be undone.</p>
            )}
          </div>
        </div>

        <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">{message}</p>

        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-outline-variant/20">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-on-surface bg-white border border-outline-variant/50 hover:bg-surface-container transition-colors cursor-pointer shadow-2xs"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-xs transition-all cursor-pointer ${
              isDestructive
                ? 'bg-error hover:bg-error/90 active:scale-95'
                : 'bg-primary hover:bg-primary-container active:scale-95'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
