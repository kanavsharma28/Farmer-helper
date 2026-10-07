import React, { useState } from 'react';

const STATUS_OPTIONS = [
  { id: 'Submitted', labelEn: 'Submitted', labelHi: 'जमा किया', color: 'bg-blue-500/10 text-blue-700' },
  { id: 'Under Review', labelEn: 'Under Review', labelHi: 'समीक्षाधीन', color: 'bg-amber-500/10 text-amber-800' },
  { id: 'Shortlisted', labelEn: 'Shortlisted', labelHi: 'शॉर्टलिस्टेड', color: 'bg-purple-500/10 text-purple-700' },
  { id: 'Interview', labelEn: 'Interview', labelHi: 'साक्षात्कार', color: 'bg-indigo-500/10 text-indigo-700' },
  { id: 'Selected', labelEn: 'Selected', labelHi: 'चयनित', color: 'bg-emerald-500/10 text-emerald-800' },
  { id: 'Rejected', labelEn: 'Rejected', labelHi: 'अस्वीकृत', color: 'bg-error/10 text-error' },
];

export default function FarmerManageApplicationsModal({
  isOpen,
  onClose,
  internship,
  applications = [],
  onUpdateStatus,
  onUpdateApplicationStatus,
  onOpenChat,
  lang = 'en'
}) {
  const isEn = lang === 'en';
  const handleStatusChange = onUpdateStatus || onUpdateApplicationStatus || (() => {});
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('all');
  const [selectedApplicant, setSelectedApplicant] = useState(null);

  if (!isOpen) return null;

  // Filter applications for this specific internship if passed, or all farmer applications
  const filteredApps = applications.filter((app) => {
    const matchesInternship = internship ? app.internshipId === internship.id : true;
    const matchesStatus = selectedStatusFilter === 'all' || app.status === selectedStatusFilter;
    return matchesInternship && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const opt = STATUS_OPTIONS.find((s) => s.id === status) || STATUS_OPTIONS[0];
    return (
      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${opt.color}`}>
        {isEn ? opt.labelEn : opt.labelHi}
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-4xl bg-surface-container-lowest rounded-3xl shadow-2xl border border-outline-variant/40 overflow-hidden flex flex-col max-h-[92vh] z-10 animate-fadeIn">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-surface-container-low border-b border-outline-variant/30 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary block">
              {isEn ? 'Farmer Control Center — Applications' : 'किसान नियंत्रण केंद्र — आवेदन'}
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-on-surface truncate">
              {internship
                ? `${internship.title}`
                : (isEn ? 'All Student Applications' : 'सभी छात्र आवेदन')}
            </h2>
            <p className="text-xs text-on-surface-variant mt-0.5">
              {filteredApps.length} {isEn ? 'Applications Submitted' : 'आवेदन प्राप्त हुए'}
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Filter bar */}
        <div className="p-4 border-b border-outline-variant/20 bg-surface-container-lowest flex items-center justify-between gap-3 overflow-x-auto">
          <div className="flex items-center gap-1.5 text-xs font-semibold">
            <button
              onClick={() => setSelectedStatusFilter('all')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                selectedStatusFilter === 'all'
                  ? 'bg-primary text-white font-bold'
                  : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {isEn ? 'All' : 'सभी'} ({applications.length})
            </button>
            {STATUS_OPTIONS.map((st) => (
              <button
                key={st.id}
                onClick={() => setSelectedStatusFilter(st.id)}
                className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                  selectedStatusFilter === st.id
                    ? 'bg-primary text-white font-bold'
                    : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {isEn ? st.labelEn : st.labelHi}
              </button>
            ))}
          </div>
        </div>

        {/* Applications List */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-4 flex-1">
          {filteredApps.length > 0 ? (
            filteredApps.map((app) => (
              <div
                key={app.id}
                className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/30 hover:border-primary/40 transition-all space-y-3 shadow-2xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                      {app.studentName ? app.studentName.slice(0, 2).toUpperCase() : 'ST'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-on-surface">{app.studentName}</h4>
                        {getStatusBadge(app.status)}
                      </div>
                      <p className="text-xs text-on-surface-variant">
                        {app.course} • {app.yearOfStudy}
                      </p>
                      <p className="text-[11px] text-on-surface-variant">
                        {app.college}
                      </p>
                    </div>
                  </div>

                  {/* Status Dropdown */}
                  <div className="flex items-center gap-2 self-start sm:self-center">
                    <span className="text-xs font-semibold text-on-surface-variant">
                      {isEn ? 'Update Status:' : 'स्थिति बदलें:'}
                    </span>
                    <select
                      value={app.status}
                      onChange={(e) => handleStatusChange(app.id, e.target.value)}
                      className="px-3 py-1.5 rounded-xl border border-outline-variant/60 bg-surface text-xs font-bold text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                    >
                      {STATUS_OPTIONS.map((st) => (
                        <option key={st.id} value={st.id}>
                          {isEn ? st.labelEn : st.labelHi}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Additional Details Accordion / Preview */}
                <div className="p-3.5 bg-surface-container-low/70 rounded-xl space-y-2 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div>
                      <span className="text-on-surface-variant font-medium block">
                        {isEn ? 'Mobile / WhatsApp' : 'मोबाइल'}
                      </span>
                      <div className="flex items-center gap-2 pt-0.5">
                        <a href={`tel:${app.studentMobile || '9812345678'}`} className="font-semibold text-primary hover:underline flex items-center gap-1">
                          <span className="material-symbols-outlined text-xs">call</span>
                          <span>+91 {app.studentMobile || '98123 45678'}</span>
                        </a>
                        <button
                          type="button"
                          onClick={() => onOpenChat && onOpenChat(app)}
                          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary font-bold text-[11px] border border-primary/25 transition-colors cursor-pointer shadow-2xs"
                          title={isEn ? `Chat with ${app.studentName}` : 'छात्र से चैट करें'}
                        >
                          <span className="material-symbols-outlined text-[13px]">chat</span>
                          <span>{isEn ? 'Chat' : 'चैट'}</span>
                        </button>
                      </div>
                    </div>
                    <div>
                      <span className="text-on-surface-variant font-medium block">
                        {isEn ? 'Email' : 'ईमेल'}
                      </span>
                      <span className="font-semibold text-on-surface truncate block">
                        {app.studentEmail || 'student@agri.edu'}
                      </span>
                    </div>
                    <div>
                      <span className="text-on-surface-variant font-medium block">
                        {isEn ? 'Applied On' : 'आवेदन तिथि'}
                      </span>
                      <span className="font-semibold text-on-surface">{app.appliedDate}</span>
                    </div>
                  </div>

                  {app.skills && (
                    <div className="pt-1">
                      <span className="text-on-surface-variant font-medium block mb-1">
                        {isEn ? 'Skills' : 'कौशल'}:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {app.skills.split(',').map((sk, i) => (
                          <span key={i} className="px-2 py-0.5 rounded-lg bg-surface border border-outline-variant/40 text-[10px] font-semibold text-on-surface">
                            {sk.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {app.coverLetter && (
                    <div className="pt-1">
                      <span className="text-on-surface-variant font-medium block">
                        {isEn ? 'Applicant Statement' : 'छात्र का वक्तव्य'}:
                      </span>
                      <p className="text-on-surface text-xs leading-relaxed italic bg-surface p-2.5 rounded-lg mt-0.5 border border-outline-variant/30">
                        "{app.coverLetter}"
                      </p>
                    </div>
                  )}

                  {/* Resume preview pill and Chat with Student action */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-outline-variant/20">
                    <div className="flex items-center gap-1.5 text-xs text-primary font-semibold">
                      <span className="material-symbols-outlined text-[17px]">description</span>
                      <span>{app.resumeName || 'Student_Resume.pdf'}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => alert(isEn ? `Viewing ${app.resumeName || 'Resume'}` : `बायोडाटा खोला जा रहा है`)}
                        className="text-xs font-bold text-primary hover:underline px-2.5 py-1 rounded-lg hover:bg-surface-container"
                      >
                        {isEn ? 'View Resume' : 'बायोडाटा देखें'}
                      </button>

                      <button
                        type="button"
                        onClick={() => onOpenChat && onOpenChat(app)}
                        className="px-3 py-1.5 rounded-xl bg-primary text-white text-xs font-bold flex items-center gap-1.5 hover:bg-primary-container transition-colors shadow-2xs cursor-pointer"
                        title={isEn ? `Open direct chat with ${app.studentName}` : 'छात्र से इन-ऐप चैट करें'}
                      >
                        <span className="material-symbols-outlined text-[15px]">chat</span>
                        <span>{isEn ? 'Chat with Student' : 'छात्र से चैट करें'}</span>
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            ))
          ) : (
            <div className="py-12 text-center space-y-3">
              <span className="material-symbols-outlined text-4xl text-on-surface-variant">inbox</span>
              <p className="text-sm font-semibold text-on-surface">
                {isEn ? 'No applications match this filter.' : 'इस फ़िल्टर में कोई आवेदन नहीं मिला।'}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-surface-container-low border-t border-outline-variant/30 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-container transition-colors"
          >
            {isEn ? 'Close' : 'बंद करें'}
          </button>
        </div>

      </div>
    </div>
  );
}
