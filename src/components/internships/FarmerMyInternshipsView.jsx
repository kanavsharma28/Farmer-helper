import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function FarmerMyInternshipsView({
  internships = [],
  applications = [],
  onOpenPostModal,
  onOpenEditModal,
  onOpenManageApplications,
  onToggleStatus,
  onDeleteListing,
  onViewDetails,
  lang = 'en'
}) {
  const isEn = lang === 'en';
  const { user } = useAuth();
  const [filterStatus, setFilterStatus] = useState('all');

  // Filter listings strictly owned by current authenticated farmer
  const farmerListings = internships.filter(
    (item) => item.ownerId === user?.id || item.ownerId === 'user_farmer_01'
  );

  const filteredListings = farmerListings.filter((item) => {
    if (filterStatus === 'all') return true;
    return (item.status || 'Active').toLowerCase() === filterStatus.toLowerCase();
  });

  return (
    <div className="space-y-6">
      {/* Top Controls Bar */}
      <div className="bg-surface-container-lowest p-5 rounded-3xl border border-outline-variant/30 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-on-surface flex items-center gap-2">
            <span>{isEn ? 'My Farm Internship Listings' : 'मेरी खेत इंटर्नशिप सूचियां'}</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-bold">
              {farmerListings.length} {isEn ? 'Listings' : 'सूचियां'}
            </span>
          </h2>
          <p className="text-xs text-on-surface-variant mt-0.5">
            {isEn
              ? 'Manage practical training positions on your farm and review student applications.'
              : 'अपने खेत पर व्यावहारिक प्रशिक्षण पदों का प्रबंधन करें और छात्रों के आवेदन देखें।'}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Status filter buttons */}
          <div className="flex items-center bg-surface-container-low p-1 rounded-xl text-xs font-semibold">
            {['all', 'active', 'closed'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1.5 rounded-lg capitalize transition-all ${
                  filterStatus === st
                    ? 'bg-surface-container-lowest text-primary shadow-xs font-bold'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Post New Internship Button */}
          <button
            onClick={onOpenPostModal}
            className="px-4 py-2 rounded-xl bg-primary text-white font-bold text-xs hover:bg-primary-container active:scale-95 transition-all shadow-sm flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <span className="material-symbols-outlined text-base">add_circle</span>
            <span>{isEn ? 'Post Internship' : 'नया पद जोड़ें'}</span>
          </button>
        </div>
      </div>

      {/* Listings Grid / Table */}
      {filteredListings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredListings.map((item) => {
            const itemApplications = applications.filter((app) => app.internshipId === item.id);
            const isClosed = item.status === 'Closed';

            return (
              <div
                key={item.id}
                className="bg-surface-container-lowest rounded-3xl border border-outline-variant/30 shadow-2xs p-5 flex flex-col justify-between space-y-4 hover:border-primary/40 transition-all"
              >
                {/* Top Info */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-primary/10 text-primary truncate max-w-[200px]">
                      {item.domain || item.category || 'Farm Training'}
                    </span>

                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                        isClosed
                          ? 'bg-error/10 text-error'
                          : 'bg-emerald-500/10 text-emerald-800'
                      }`}
                    >
                      {item.status || 'Active'}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-on-surface leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs text-on-surface-variant flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">pin_drop</span>
                    <span>{item.location || item.state}</span>
                    <span>•</span>
                    <span className="font-semibold text-primary">{item.duration}</span>
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-xs pt-1">
                    <span className="font-bold text-on-surface text-sm">
                      {item.stipendDisplay || `₹${item.stipend || 0}/Mo`}
                    </span>
                    <span className="text-on-surface-variant">•</span>
                    <span className="text-on-surface-variant">{item.openings || 2} Openings</span>
                    <span className="text-on-surface-variant">•</span>
                    <span className="text-amber-800 font-semibold">{item.deadlineDisplay || `Deadline: ${item.deadline}`}</span>
                  </div>
                </div>

                {/* Applicants Counter Badge */}
                <div className="p-3 bg-surface-container-low rounded-2xl flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-xl">school</span>
                    <span className="font-bold text-on-surface">
                      {itemApplications.length} {isEn ? 'Student Applicants' : 'छात्र आवेदन'}
                    </span>
                  </div>

                  <button
                    onClick={() => onOpenManageApplications(item)}
                    className="font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>{isEn ? 'Review Applicants' : 'आवेदन देखें'}</span>
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>
                </div>

                {/* Action Buttons Row */}
                <div className="pt-2 border-t border-outline-variant/20 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    {/* View Details */}
                    <button
                      onClick={() => onViewDetails && onViewDetails(item)}
                      className="px-3 py-1.5 rounded-xl border border-outline-variant/50 text-xs font-semibold text-on-surface hover:bg-surface-container transition-colors"
                      title={isEn ? 'View Public Listing' : 'सार्वजनिक सूची देखें'}
                    >
                      {isEn ? 'View' : 'देखें'}
                    </button>

                    {/* Edit */}
                    <button
                      onClick={() => onOpenEditModal && onOpenEditModal(item)}
                      className="px-3 py-1.5 rounded-xl border border-outline-variant/50 text-xs font-semibold text-primary hover:bg-primary/5 transition-colors"
                    >
                      {isEn ? 'Edit' : 'संपादित करें'}
                    </button>

                    {/* Toggle Status (Close / Reopen) */}
                    <button
                      onClick={() => onToggleStatus && onToggleStatus(item.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                        isClosed
                          ? 'bg-emerald-600/10 text-emerald-800 hover:bg-emerald-600/20'
                          : 'bg-error/10 text-error hover:bg-error/20'
                      }`}
                    >
                      {isClosed ? (isEn ? 'Reopen' : 'पुनः खोलें') : (isEn ? 'Close' : 'बंद करें')}
                    </button>
                  </div>

                  {/* Delete */}
                  <button
                    onClick={() => {
                      if (window.confirm(isEn ? 'Delete this internship listing?' : 'क्या आप यह इंटर्नशिप हटाना चाहते हैं?')) {
                        onDeleteListing && onDeleteListing(item.id);
                      }
                    }}
                    className="text-error hover:bg-error/10 p-1.5 rounded-lg transition-colors"
                    title={isEn ? 'Delete Listing' : 'हटाएं'}
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-surface-container-lowest p-12 rounded-3xl border border-outline-variant/30 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto text-3xl font-bold">
            🌱
          </div>
          <h3 className="font-bold text-lg text-on-surface">
            {isEn ? 'No Internships Found in this Status' : 'इस स्थिति में कोई इंटर्नशिप नहीं मिली'}
          </h3>
          <p className="text-xs text-on-surface-variant max-w-md mx-auto">
            {isEn
              ? 'Post an internship on your farm to invite agricultural students for practical field learning.'
              : 'कृषि छात्रों को व्यावहारिक अनुभव देने के लिए अपने खेत पर इंटर्नशिप पोस्ट करें।'}
          </p>
          <button
            onClick={onOpenPostModal}
            className="px-5 py-2.5 rounded-xl bg-primary text-white font-bold text-xs hover:bg-primary-container transition-all"
          >
            {isEn ? 'Post Your First Farm Internship' : 'अपनी पहली फार्म इंटर्नशिप पोस्ट करें'}
          </button>
        </div>
      )}
    </div>
  );
}
