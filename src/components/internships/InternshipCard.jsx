import React from 'react';
import { useAuth } from '../../context/AuthContext';

export default function InternshipCard({
  internship,
  isSaved,
  onToggleSave,
  onViewDetails,
  onApply,
  onManageListing,
  onOpenChat
}) {
  const { user } = useAuth();
  const isFarmer = user?.role === 'farmer';
  const isOwner = isFarmer && (internship.ownerId === user?.id || internship.ownerId === 'user_farmer_01');
  const {
    title,
    organization,
    verified,
    location,
    stipendDisplay,
    stipendPerks,
    duration,
    startDate,
    workMode,
    deadlineDisplay,
    applicantsCount,
    skills,
    featured,
    icarCredit,
    icarNote,
    perks
  } = internship;

  const hasAccommodation = perks?.includes('Free Accommodation');

  return (
    <article className="p-5 sm:p-6 rounded-2xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-shadow border border-outline-variant/30 relative overflow-hidden flex flex-col justify-between space-y-5">
      
      {/* Top Section */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2 flex-1 min-w-0">
          
          {/* Badge Chips */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {featured && (
              <span className="px-2.5 py-0.5 rounded-md bg-tertiary-fixed text-on-tertiary-fixed font-label-md text-[11px] font-bold uppercase tracking-wider flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px]">local_fire_department</span>
                Featured
              </span>
            )}
            <span className="px-2.5 py-0.5 rounded-md bg-secondary-container text-on-secondary-container font-label-md text-xs font-semibold">
              Paid Stipend
            </span>
            {hasAccommodation && (
              <span className="px-2.5 py-0.5 rounded-md bg-surface-container-high text-on-surface-variant font-label-md text-xs font-medium">
                Accommodation Included
              </span>
            )}
            <span className="px-2.5 py-0.5 rounded-md bg-surface-container text-on-surface-variant font-label-md text-xs">
              {internship.domain}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-headline-md text-base sm:text-lg lg:text-xl font-bold text-on-surface leading-snug">
            {title}
          </h3>

          {/* Organization & Location Meta */}
          <div className="flex flex-wrap items-center gap-2 text-on-surface-variant font-label-md text-xs sm:text-sm">
            <span className="font-semibold text-primary">{organization}</span>
            {verified && (
              <span
                className="material-symbols-outlined text-primary text-[18px]"
                title="Verified Partner"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                verified
              </span>
            )}
            <span className="text-outline">•</span>
            <span className="flex items-center gap-1 text-on-surface-variant">
              <span className="material-symbols-outlined text-[16px] text-primary">location_on</span>
              {location}
            </span>
          </div>

        </div>

        {/* Favorite / Bookmark Button */}
        <button
          type="button"
          onClick={() => onToggleSave(internship.id)}
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors shrink-0 ${
            isSaved
              ? 'bg-error/10 text-error'
              : 'bg-surface-container-low hover:bg-surface-container-high text-outline hover:text-error'
          }`}
          title={isSaved ? 'Remove from saved' : 'Save opportunity'}
          aria-label="Save opportunity"
        >
          <span
            className="material-symbols-outlined text-[22px]"
            style={{ fontVariationSettings: isSaved ? "'FILL' 1" : "'FILL' 0" }}
          >
            favorite
          </span>
        </button>
      </div>

      {/* 4-Cell Details Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 p-3.5 sm:p-4 rounded-xl bg-surface-container-low border border-outline-variant/20">
        <div>
          <span className="font-caption text-xs text-outline block">Stipend &amp; Perks</span>
          <span className="font-label-md text-sm font-bold text-on-surface">{stipendDisplay}</span>
          <span className="font-caption text-xs text-secondary font-medium block truncate">
            {stipendPerks || 'Standard field support'}
          </span>
        </div>
        <div>
          <span className="font-caption text-xs text-outline block">Duration &amp; Starts</span>
          <span className="font-label-md text-sm font-bold text-on-surface">{duration}</span>
          <span className="font-caption text-xs text-on-surface-variant block truncate">
            Starts {startDate}
          </span>
        </div>
        <div>
          <span className="font-caption text-xs text-outline block">Work Setting</span>
          <span className="font-label-md text-sm font-bold text-on-surface truncate block">{workMode}</span>
          <span className="font-caption text-xs text-on-surface-variant block truncate">
            {internship.openings ? `${internship.openings} Openings` : 'Immediate joining'}
          </span>
        </div>
        <div>
          <span className="font-caption text-xs text-outline block">Deadline &amp; Status</span>
          <span className="font-label-md text-sm font-bold text-error block">{deadlineDisplay}</span>
          <span className="font-caption text-xs text-on-surface-variant block truncate">
            {applicantsCount} Applicants
          </span>
        </div>
      </div>

      {/* Skills Tags */}
      {skills && skills.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <span className="text-xs text-outline font-medium">Skills Learned:</span>
          {skills.map((skill) => (
            <span
              key={skill}
              className="px-2.5 py-1 rounded-md bg-surface-container text-on-surface font-caption text-xs"
            >
              {skill}
            </span>
          ))}
        </div>
      )}

      {/* Farmer / Provider Information & Direct In-App Chat */}
      <div className="p-3 sm:p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
            <span className="material-symbols-outlined text-base">person</span>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-xs sm:text-sm text-on-surface truncate">
                {internship.ownerName || 'Rajesh Kumar'}
              </span>
              <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded-md bg-secondary/15 text-primary shrink-0">
                Host Farmer
              </span>
            </div>
            <p className="text-[11px] text-on-surface-variant truncate">
              {internship.farmName || organization} • {location}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
          {/* Clickable Phone Number */}
          <a
            href={`tel:${internship.contactPhone || '9876543210'}`}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high border border-outline-variant/40 text-[11px] font-semibold text-on-surface hover:text-primary transition-colors"
            title={`Call ${internship.ownerName || 'Host'}`}
          >
            <span className="material-symbols-outlined text-[14px] text-primary">call</span>
            <span>+91 {internship.contactPhone || '98765 43210'}</span>
          </a>

          {/* In-app Chat Button */}
          <button
            type="button"
            onClick={() => onOpenChat && onOpenChat(internship)}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-primary/40 bg-primary/10 hover:bg-primary/20 text-primary font-bold text-[11px] transition-colors cursor-pointer shadow-2xs"
            title="Chat on Farmer Helper"
          >
            <span className="material-symbols-outlined text-[14px]">chat</span>
            <span>Chat</span>
          </button>
        </div>
      </div>

      {/* Footer & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-outline-variant/20">
        <div className="flex items-center gap-2 text-on-surface-variant font-caption text-xs">
          <span
            className="material-symbols-outlined text-secondary text-[18px] shrink-0"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            verified
          </span>
          <span className="truncate">
            {icarNote || (icarCredit ? 'Includes Certificate & ICAR Training Credit' : 'Certificate of Completion')}
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-2.5 justify-end">
          {isOwner ? (
            <>
              <button
                type="button"
                onClick={() => onViewDetails(internship)}
                className="px-3.5 sm:px-4 py-2 rounded-xl bg-surface-container-high text-on-surface font-label-md text-xs sm:text-sm font-semibold hover:bg-surface-container-highest transition-colors"
              >
                View
              </button>
              <button
                type="button"
                onClick={() => onManageListing ? onManageListing(internship) : onViewDetails(internship)}
                className="px-4 sm:px-5 py-2 rounded-xl bg-primary text-on-primary font-label-md text-xs sm:text-sm font-semibold hover:bg-primary-container transition-colors shadow-xs flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[17px]">groups</span>
                <span>Manage Applicants</span>
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => onToggleSave(internship.id)}
                className="px-3 sm:px-4 py-2 rounded-xl bg-surface-container text-on-surface font-label-md text-xs sm:text-sm font-medium hover:bg-surface-container-high transition-colors"
              >
                {isSaved ? 'Saved' : 'Save'}
              </button>
              <button
                type="button"
                onClick={() => onViewDetails(internship)}
                className="px-3.5 sm:px-4 py-2 rounded-xl bg-surface-container-high text-on-surface font-label-md text-xs sm:text-sm font-semibold hover:bg-surface-container-highest transition-colors"
              >
                View Details
              </button>
              {!isFarmer && (
                <>
                  <button
                    type="button"
                    onClick={() => onOpenChat && onOpenChat(internship)}
                    className="px-3 sm:px-3.5 py-2 rounded-xl border border-primary/30 bg-primary/5 hover:bg-primary/10 text-primary font-label-md text-xs sm:text-sm font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    title="Chat with farm host"
                  >
                    <span className="material-symbols-outlined text-[16px]">chat</span>
                    <span className="hidden sm:inline">Chat</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onApply(internship)}
                    className="px-4 sm:px-5 py-2 rounded-xl bg-primary text-on-primary font-label-md text-xs sm:text-sm font-semibold hover:bg-primary-container transition-colors shadow-xs cursor-pointer"
                  >
                    Apply Now
                  </button>
                </>
              )}
            </>
          )}
        </div>
      </div>

    </article>
  );
}
