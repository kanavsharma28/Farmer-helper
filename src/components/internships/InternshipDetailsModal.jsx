import React from 'react';

export default function InternshipDetailsModal({
  internship,
  isOpen,
  onClose,
  isSaved,
  onToggleSave,
  onApply,
  onOpenChat,
  lang = 'en'
}) {
  if (!isOpen || !internship) return null;
  const isEn = lang === 'en';

  const {
    title,
    organization,
    orgDescription,
    verified,
    location,
    domain,
    type,
    workMode,
    duration,
    stipendDisplay,
    stipendPerks,
    startDate,
    deadlineDisplay,
    openings,
    applicantsCount,
    skills,
    perks,
    responsibilities,
    requirements,
    benefits,
    icarNote
  } = internship;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-3xl bg-surface-container-lowest rounded-3xl shadow-2xl border border-outline-variant/40 overflow-hidden flex flex-col max-h-[90vh] z-10 animate-fadeIn">
        
        {/* Modal Header */}
        <div className="p-6 sm:p-8 bg-surface-container-low border-b border-outline-variant/30 flex items-start justify-between gap-4">
          <div className="space-y-2.5 flex-1 min-w-0">
            
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-secondary-container text-on-secondary-container font-label-md text-xs font-semibold">
                {type}
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-surface-container-highest text-on-surface-variant font-label-md text-xs">
                {domain}
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-surface-container-highest text-on-surface-variant font-label-md text-xs">
                {workMode}
              </span>
            </div>

            <h2 className="font-headline-lg text-xl sm:text-2xl font-bold text-on-surface leading-snug">
              {title}
            </h2>

            <div className="flex flex-wrap items-center gap-2 text-on-surface-variant font-label-md text-sm">
              <span className="font-semibold text-primary text-base">{organization}</span>
              {verified && (
                <span
                  className="material-symbols-outlined text-primary text-[20px]"
                  title="Verified Partner"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  verified
                </span>
              )}
              <span className="text-outline">•</span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px] text-primary">location_on</span>
                {location}
              </span>
            </div>

          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-outline hover:text-on-surface transition-colors shrink-0"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Modal Body - Scrollable Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 text-sm sm:text-base">
          
          {/* Key Facts Metric Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30">
            <div>
              <span className="font-caption text-xs text-outline block">Stipend</span>
              <span className="font-label-md text-sm sm:text-base font-bold text-primary">{stipendDisplay}</span>
              <span className="font-caption text-xs text-secondary block">{stipendPerks}</span>
            </div>
            <div>
              <span className="font-caption text-xs text-outline block">Duration</span>
              <span className="font-label-md text-sm sm:text-base font-bold text-on-surface">{duration}</span>
              <span className="font-caption text-xs text-on-surface-variant block">Starts {startDate}</span>
            </div>
            <div>
              <span className="font-caption text-xs text-outline block">Setting &amp; Openings</span>
              <span className="font-label-md text-sm sm:text-base font-bold text-on-surface">{workMode}</span>
              <span className="font-caption text-xs text-on-surface-variant block">{openings} Openings</span>
            </div>
            <div>
              <span className="font-caption text-xs text-outline block">Application Deadline</span>
              <span className="font-label-md text-sm sm:text-base font-bold text-error">{deadlineDisplay}</span>
              <span className="font-caption text-xs text-on-surface-variant block">{applicantsCount} Applicants</span>
            </div>
          </div>

          {/* Farmer / Farm Provider Information & Direct In-App Chat */}
          <div className="p-4 sm:p-5 rounded-2xl bg-surface-container border border-primary/25 space-y-3.5 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                  <span className="material-symbols-outlined text-2xl">agriculture</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-primary uppercase tracking-wider">
                      {isEn ? 'Internship Host / Provider' : 'खेत प्रदाता एवं मार्गदर्शक'}
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-700"></span>
                    <span className="text-[11px] font-bold text-emerald-800">
                      {isEn ? 'Verified Farmer' : 'सत्यापित किसान'}
                    </span>
                  </div>
                  <h4 className="font-bold text-base text-on-surface leading-tight">
                    {internship.ownerName || 'Rajesh Kumar'}
                  </h4>
                  <p className="text-xs text-on-surface-variant">
                    {internship.farmName || organization} • {location}
                  </p>
                </div>
              </div>

              {/* Direct Communication Buttons */}
              <div className="flex items-center gap-2 self-start sm:self-center">
                <a
                  href={`tel:${internship.contactPhone || '9876543210'}`}
                  className="px-3.5 py-2 rounded-xl bg-surface-container-high hover:bg-surface-container-highest border border-outline-variant/40 text-xs font-semibold text-on-surface flex items-center gap-1.5 transition-colors shadow-2xs"
                  title={isEn ? `Call ${internship.ownerName || 'Host'}` : 'कॉल करें'}
                >
                  <span className="material-symbols-outlined text-[17px] text-primary">call</span>
                  <span>+91 {internship.contactPhone || '98765 43210'}</span>
                </a>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenChat && onOpenChat(internship);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                  title={isEn ? 'Chat directly on Farmer Helper' : 'Farmer Helper पर चैट करें'}
                >
                  <span className="material-symbols-outlined text-[17px]">chat</span>
                  <span>{isEn ? 'Chat on Farmer Helper' : 'चैट करें'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* About the Organization */}
          {orgDescription && (
            <div className="space-y-2">
              <h3 className="font-headline-md text-base sm:text-lg font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">corporate_fare</span>
                About {organization}
              </h3>
              <p className="text-on-surface-variant leading-relaxed text-xs sm:text-sm">
                {orgDescription}
              </p>
            </div>
          )}

          {/* Key Responsibilities */}
          {responsibilities && responsibilities.length > 0 && (
            <div className="space-y-2.5">
              <h3 className="font-headline-md text-base sm:text-lg font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">assignment</span>
                Key Responsibilities (प्रमुख जिम्मेदारियां)
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-on-surface-variant">
                {responsibilities.map((resp, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-primary text-base shrink-0 mt-0.5">
                      check_circle
                    </span>
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Candidate Requirements & Eligibility */}
          {requirements && requirements.length > 0 && (
            <div className="space-y-2.5">
              <h3 className="font-headline-md text-base sm:text-lg font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">school</span>
                Eligibility &amp; Requirements (पात्रता)
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-on-surface-variant">
                {requirements.map((req, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-secondary text-base shrink-0 mt-0.5">
                      arrow_right_alt
                    </span>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Skills Learned */}
          {skills && skills.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-headline-md text-base sm:text-lg font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">psychology</span>
                Skills &amp; Competencies Acquired
              </h3>
              <div className="flex flex-wrap gap-2 pt-1">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 rounded-xl bg-surface-container text-on-surface font-label-md text-xs font-medium border border-outline-variant/30"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Benefits & Perks */}
          {((benefits && benefits.length > 0) || (perks && perks.length > 0)) && (
            <div className="space-y-2.5">
              <h3 className="font-headline-md text-base sm:text-lg font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-xl">card_giftcard</span>
                Benefits &amp; Support (सुविधाएं)
              </h3>
              {perks && perks.length > 0 && (
                <div className="flex flex-wrap gap-2 pb-1">
                  {perks.map((p) => (
                    <span key={p} className="px-2.5 py-1 rounded-lg bg-secondary-container/40 text-on-secondary-container text-xs font-semibold">
                      ✓ {p}
                    </span>
                  ))}
                </div>
              )}
              {benefits && benefits.length > 0 && (
                <ul className="space-y-2 text-xs sm:text-sm text-on-surface-variant">
                  {benefits.map((ben, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="material-symbols-outlined text-secondary text-base shrink-0 mt-0.5">
                        verified
                      </span>
                      <span>{ben}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* ICAR / Training Credit Note */}
          <div className="p-4 rounded-2xl bg-secondary-container/20 border border-secondary/30 flex items-center gap-3">
            <span
              className="material-symbols-outlined text-secondary text-2xl shrink-0"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              verified
            </span>
            <div className="text-xs sm:text-sm text-on-surface">
              <p className="font-semibold text-primary">Certified Learning Experience</p>
              <p className="text-on-surface-variant">{icarNote || 'Includes formal completion certificate recognized across agricultural institutions.'}</p>
            </div>
          </div>

        </div>

        {/* Modal Sticky Footer */}
        <div className="p-4 sm:p-6 bg-surface-container-low border-t border-outline-variant/30 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => onToggleSave(internship.id)}
            className={`inline-flex items-center gap-2 px-4 sm:px-5 py-3 rounded-xl font-label-md text-sm font-semibold transition-colors border ${
              isSaved
                ? 'bg-error/10 text-error border-error/30'
                : 'bg-surface-container text-on-surface border-outline-variant/30 hover:bg-surface-container-high'
            }`}
          >
            <span
              className="material-symbols-outlined text-lg"
              style={{ fontVariationSettings: isSaved ? "'FILL' 1" : "'FILL' 0" }}
            >
              favorite
            </span>
            <span>{isSaved ? 'Saved Opportunity' : 'Save Opportunity'}</span>
          </button>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-3 sm:px-4 py-3 rounded-xl bg-surface-container text-on-surface font-label-md text-sm font-medium hover:bg-surface-container-high transition-colors"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenChat && onOpenChat(internship);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-3 rounded-xl border border-primary/40 bg-primary/10 hover:bg-primary/20 text-primary font-label-md text-sm font-bold transition-colors cursor-pointer"
              title={isEn ? 'Open direct chat with farm host' : 'फार्म प्रदाता से चैट करें'}
            >
              <span className="material-symbols-outlined text-lg">chat</span>
              <span>{isEn ? 'Chat' : 'चैट'}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onApply(internship);
              }}
              className="inline-flex items-center gap-2 px-5 sm:px-7 py-3 rounded-xl bg-primary text-on-primary font-label-md text-sm font-semibold hover:bg-primary-container transition-colors shadow-md active:scale-95"
            >
              <span>Apply Now</span>
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
