import React from 'react';

export default function ApplicationSuccessModal({
  isOpen,
  application,
  onClose,
  onViewMyApplications,
  onOpenChat
}) {
  if (!isOpen || !application) return null;

  const {
    id,
    internshipTitle,
    organization,
    appliedDate,
    status
  } = application;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative w-full max-w-lg bg-surface-container-lowest rounded-3xl shadow-2xl border border-outline-variant/40 p-6 sm:p-8 z-10 text-center space-y-6 animate-fadeIn">
        
        {/* Animated Success Badge */}
        <div className="w-20 h-20 rounded-full bg-secondary-container/40 text-on-secondary-container flex items-center justify-center mx-auto ring-8 ring-secondary-container/20">
          <span
            className="material-symbols-outlined text-4xl text-primary"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            check_circle
          </span>
        </div>

        {/* Heading */}
        <div className="space-y-1">
          <h2 className="font-headline-lg text-2xl font-bold text-on-surface">
            Application Submitted!
          </h2>
          <p className="font-caption text-sm text-secondary font-medium">
            आवेदन सफलतापूर्वक जमा किया गया
          </p>
        </div>

        {/* Application Summary Card */}
        <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30 text-left space-y-3">
          <div className="flex items-center justify-between border-b border-outline-variant/20 pb-2">
            <span className="font-caption text-xs text-outline">Application ID</span>
            <span className="font-mono text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
              {id}
            </span>
          </div>

          <div>
            <span className="font-caption text-xs text-outline block">Opportunity</span>
            <p className="font-semibold text-sm text-on-surface line-clamp-1">{internshipTitle}</p>
            <p className="font-caption text-xs text-primary">{organization}</p>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-outline-variant/20">
            <div>
              <span className="font-caption text-xs text-outline block">Applied Date</span>
              <span className="font-label-md text-xs font-medium text-on-surface">{appliedDate}</span>
            </div>
            <div>
              <span className="font-caption text-xs text-outline block">Current Status</span>
              <span className="inline-flex items-center gap-1 font-label-md text-xs font-bold text-on-secondary-container bg-secondary-container px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                {status || 'Submitted'}
              </span>
            </div>
          </div>
        </div>

        {/* Next Steps Guidance */}
        <div className="p-3.5 rounded-xl bg-surface-container text-left text-xs space-y-1.5 text-on-surface-variant">
          <p className="font-bold text-on-surface flex items-center gap-1.5">
            <span className="material-symbols-outlined text-base text-primary">schedule</span>
            Next Steps (आगे क्या होगा?)
          </p>
          <ul className="space-y-1 pl-5 list-disc">
            <li>The hiring coordinator at {organization} will review your resume within 3–5 business days.</li>
            <li>You can also directly message the farm host to inquire about joining dates or field schedules.</li>
            <li>You can track the live status anytime in your <strong>"My Applications"</strong> dashboard.</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2">
          <button
            type="button"
            onClick={() => {
              onClose();
              if (onOpenChat) onOpenChat(application);
            }}
            className="w-full sm:flex-1 py-3 px-3 rounded-xl bg-primary text-on-primary font-label-md text-xs sm:text-sm font-semibold hover:bg-primary-container transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
            title="Chat with Farmer / Host"
          >
            <span className="material-symbols-outlined text-[18px]">chat</span>
            <span>Chat with Farmer</span>
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              if (onViewMyApplications) onViewMyApplications();
            }}
            className="w-full sm:flex-1 py-3 px-3 rounded-xl border border-primary/40 bg-primary/10 hover:bg-primary/20 text-primary font-label-md text-xs sm:text-sm font-semibold transition-all shadow-2xs flex items-center justify-center gap-1 cursor-pointer"
          >
            <span>My Applications</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto py-3 px-4 rounded-xl bg-surface-container text-on-surface font-label-md text-xs sm:text-sm font-medium hover:bg-surface-container-high transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}
