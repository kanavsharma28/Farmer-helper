import React from 'react';

export default function MyApplicationsModal({
  isOpen,
  onClose,
  applications = [],
  onExploreMore,
  onOpenChat,
  lang = 'en'
}) {
  if (!isOpen) return null;
  const isEn = lang === 'en';

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Shortlisted':
      case 'Interview Scheduled':
        return 'bg-tertiary-fixed text-on-tertiary-fixed border-tertiary/40';
      case 'Selected':
        return 'bg-secondary-container text-on-secondary-container border-secondary/40';
      case 'Under Review':
        return 'bg-primary-container/20 text-primary border-primary/30';
      case 'Rejected':
        return 'bg-error-container text-on-error-container border-error/40';
      case 'Submitted':
      default:
        return 'bg-surface-container-high text-on-surface-variant border-outline-variant/50';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative w-full max-w-2xl bg-surface-container-lowest rounded-3xl shadow-2xl border border-outline-variant/40 overflow-hidden flex flex-col max-h-[88vh] z-10 animate-fadeIn">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-surface-container-low border-b border-outline-variant/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-container text-on-primary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-xl">folder_shared</span>
            </div>
            <div>
              <h2 className="font-headline-md text-lg sm:text-xl font-bold text-on-surface">
                My Applications (मेरे आवेदन)
              </h2>
              <p className="font-caption text-xs text-on-surface-variant">
                Track status of your submitted agriculture internship applications
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-outline hover:text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {applications.length === 0 ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center mx-auto text-outline">
                <span className="material-symbols-outlined text-3xl">inbox</span>
              </div>
              <div>
                <h3 className="font-bold text-base text-on-surface">No applications submitted yet</h3>
                <p className="font-caption text-xs text-on-surface-variant max-w-xs mx-auto mt-1">
                  You have not applied to any agricultural internships yet. Explore available opportunities and submit your first application.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onExploreMore) onExploreMore();
                }}
                className="px-6 py-2.5 rounded-xl bg-primary text-on-primary font-label-md text-xs sm:text-sm font-semibold hover:bg-primary-container transition-colors shadow-xs"
              >
                Browse Internships
              </button>
            </div>
          ) : (
            applications.map((app) => (
              <div
                key={app.id}
                className="p-4 sm:p-5 rounded-2xl bg-surface-container-low border border-outline-variant/30 space-y-3 hover:border-primary/40 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                        {app.id}
                      </span>
                      <span className="text-xs text-outline">• Applied on {app.appliedDate}</span>
                    </div>
                    <h4 className="font-bold text-sm sm:text-base text-on-surface mt-1">
                      {app.internshipTitle}
                    </h4>
                    <p className="font-caption text-xs font-semibold text-primary">
                      {app.organization} • {app.location}
                    </p>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border shrink-0 ${getStatusBadge(
                      app.status
                    )}`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                    {app.status}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/20 text-xs text-on-surface-variant flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 truncate">
                    <span className="material-symbols-outlined text-base text-primary shrink-0">info</span>
                    <span className="truncate">{app.nextStep || 'Application received and logged.'}</span>
                  </div>
                  <span className="text-xs font-medium text-outline shrink-0">
                    Resume: {app.resumeName || 'Attached'}
                  </span>
                </div>

                {/* Host Contact & In-App Chat Action */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-outline-variant/20 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="text-on-surface-variant font-medium">{isEn ? 'Host:' : 'प्रदाता:'}</span>
                    <span className="font-bold text-on-surface">{app.ownerName || 'Rajesh Kumar'}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${app.contactPhone || '9876543210'}`}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high border border-outline-variant/40 text-[11px] font-semibold text-on-surface hover:text-primary transition-colors"
                      title={isEn ? "Call Host" : "कॉल करें"}
                    >
                      <span className="material-symbols-outlined text-[13px] text-primary">call</span>
                      <span>+91 {app.contactPhone || '98765 43210'}</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenChat && onOpenChat({
                          id: app.internshipId,
                          title: app.internshipTitle,
                          ownerId: app.ownerId || 'user_farmer_01',
                          ownerName: app.ownerName || 'Rajesh Kumar',
                          farmName: app.farmName || app.organization,
                          contactPhone: app.contactPhone || '9876543210'
                        });
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-primary/40 bg-primary/10 hover:bg-primary/20 text-primary font-bold text-[11px] transition-colors cursor-pointer shadow-2xs"
                      title={isEn ? "Chat on Farmer Helper" : "चैट करें"}
                    >
                      <span className="material-symbols-outlined text-[13px]">chat</span>
                      <span>{isEn ? 'Chat' : 'चैट'}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 bg-surface-container-low border-t border-outline-variant/30 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-surface-container text-on-surface font-label-md text-sm font-medium hover:bg-surface-container-high transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
