import React from 'react';
import { TRENDING_TOPICS, ACTIVE_COMMUNITY_MEMBERS } from '../../data/communityData';
import { ROLE_LABELS } from '../../data/navigationConfig';
import { Link } from 'react-router-dom';

export default function CommunityRightSidebar({
  onSelectTrendingTag,
  lang = 'en',
}) {
  const isEn = lang === 'en';

  return (
    <div className="space-y-6">
      {/* ── Trending Topics ── */}
      <div className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/30 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-on-surface">
          <span className="material-symbols-outlined text-primary text-xl">trending_up</span>
          <h3 className="font-bold text-sm uppercase tracking-wide">
            {isEn ? 'Trending Topics' : 'ट्रेंडिंग चर्चाएं'}
          </h3>
        </div>

        <div className="space-y-2.5">
          {TRENDING_TOPICS.map((topic) => (
            <button
              key={topic.tag}
              type="button"
              onClick={() => onSelectTrendingTag(topic.tag, topic.categoryId)}
              className="w-full flex items-center justify-between text-left group p-2 rounded-xl hover:bg-surface-container-low transition-colors cursor-pointer"
            >
              <div>
                <span className="block text-xs font-bold text-primary group-hover:text-primary-container transition-colors">
                  {topic.tag}
                </span>
                <span className="text-[11px] text-on-surface-variant">
                  {topic.count}
                </span>
              </div>
              <span className="material-symbols-outlined text-xs text-outline group-hover:translate-x-0.5 transition-transform">
                arrow_forward_ios
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Active Members ── */}
      <div className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/30 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-on-surface">
            <span className="material-symbols-outlined text-primary text-xl">person_check</span>
            <h3 className="font-bold text-sm uppercase tracking-wide">
              {isEn ? 'Active Members' : 'सक्रिय सदस्य'}
            </h3>
          </div>
        </div>

        <div className="space-y-3">
          {ACTIVE_COMMUNITY_MEMBERS.map((member) => {
            const roleConfig = ROLE_LABELS[member.role] || ROLE_LABELS.farmer;
            return (
              <div
                key={member.id}
                className="flex items-start justify-between gap-3 p-2 rounded-xl hover:bg-surface-container-low/60 transition-colors"
              >
                <div className="flex items-start gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0 border border-primary/20">
                    {member.initials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-on-surface truncate">
                      {member.name}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${roleConfig.badgeBg} ${roleConfig.badgeText}`}>
                        {member.badgeText}
                      </span>
                    </div>
                    <p className="text-[10px] text-on-surface-variant/80 truncate mt-0.5">
                      {member.contributions}
                    </p>
                  </div>
                </div>

                <Link
                  to="/chat"
                  className="w-7 h-7 rounded-lg bg-surface-container flex items-center justify-center text-outline hover:text-primary hover:bg-primary/10 transition-colors shrink-0"
                  title={isEn ? `Message ${member.name}` : `${member.name} को संदेश भेजें`}
                >
                  <span className="material-symbols-outlined text-sm">chat</span>
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Community Guidelines / AgriTech Card ── */}
      <div className="bg-gradient-to-br from-[#0d4a1b]/5 via-[#185e26]/5 to-[#2f8c3a]/5 rounded-2xl p-5 border border-primary/20 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-primary">
          <span className="material-symbols-outlined text-lg">verified_user</span>
          <h4 className="font-bold text-xs uppercase tracking-wider">
            {isEn ? 'Community Principles' : 'समुदाय नियम'}
          </h4>
        </div>
        <p className="text-xs text-on-surface-variant leading-relaxed">
          {isEn
            ? 'Farmer Helper connects farmers, students, buyers, and service providers. Always share verified agro-advisories, genuine market quotes, and respectful mutual guidance.'
            : 'किसान सहायक किसानों, छात्रों, खरीदारों और सेवा प्रदाताओं को जोड़ता है। प्रामाणिक सलाह, उचित भाव और परस्पर सम्मानजनक मार्गदर्शन साझा करें।'}
        </p>
      </div>
    </div>
  );
}
