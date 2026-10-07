import React from 'react';

const ROLES = [
  {
    id: 'farmer',
    emoji: '🌾',
    icon: 'agriculture',
    titleEn: 'Farmer',
    titleHi: 'किसान',
    descEn: 'Manage your farm and discover agricultural services.',
    descHi: 'खेत प्रबंधन करें और कृषि सेवाएं खोजें।',
  },
  {
    id: 'student',
    emoji: '🎓',
    icon: 'school',
    titleEn: 'Student',
    titleHi: 'छात्र',
    descEn: 'Find agriculture internships and farm training.',
    descHi: 'इंटर्नशिप और खेती प्रशिक्षण पाएं।',
  },
  {
    id: 'buyer',
    emoji: '🛒',
    icon: 'storefront',
    titleEn: 'Buyer',
    titleHi: 'खरीदार',
    descEn: 'Find farmers and source agricultural products.',
    descHi: 'किसानों से सीधे उत्पाद खरीदें।',
  },
  {
    id: 'provider',
    emoji: '🚜',
    icon: 'handshake',
    titleEn: 'Resource Provider',
    titleHi: 'संसाधन प्रदाता',
    descEn: 'List tractors, labour, machines and other resources.',
    descHi: 'ट्रैक्टर, मशीन व मजदूर किराए पर दें।',
  },
];

/**
 * RoleSelector — pure state component.
 * CRITICAL FIX: No useNavigate, no route changes.
 * Clicking a role ONLY calls onSelectRole(id).
 */
export default function RoleSelector({ selectedRole, onSelectRole, lang = 'en' }) {
  const isEn = lang === 'en';

  return (
    <div className="space-y-3 mb-2">
      <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
        {isEn ? 'Choose Your Role' : 'अपना रोल चुनें'}
      </label>

      <div className="grid grid-cols-2 gap-3">
        {ROLES.map((role) => {
          const isSelected = selectedRole === role.id;

          return (
            <button
              key={role.id}
              type="button"
              onClick={() => onSelectRole(role.id)}
              aria-pressed={isSelected}
              className={`
                p-3.5 rounded-2xl border-2 text-left transition-all duration-200 cursor-pointer select-none
                flex flex-col gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50
                ${isSelected
                  ? 'border-primary bg-primary/5 shadow-sm'
                  : 'border-outline-variant/60 bg-surface-container-lowest hover:border-primary/40 hover:bg-surface-container-low'
                }
              `}
            >
              {/* Top row: icon + check */}
              <div className="flex items-center justify-between">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                  isSelected ? 'bg-primary/10 text-primary' : 'bg-surface-container text-on-surface-variant'
                }`}>
                  <span
                    className="material-symbols-outlined text-xl"
                    style={{ fontVariationSettings: isSelected ? "'FILL' 1" : "'FILL' 0" }}
                  >
                    {role.icon}
                  </span>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                  isSelected ? 'border-primary bg-primary' : 'border-outline-variant/70'
                }`}>
                  {isSelected && (
                    <svg viewBox="0 0 10 8" className="w-3 h-3 fill-white">
                      <path d="M1 4l2.5 2.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                    </svg>
                  )}
                </div>
              </div>

              {/* Text */}
              <div>
                <p className={`font-semibold text-sm leading-tight ${isSelected ? 'text-primary' : 'text-on-surface'}`}>
                  {role.emoji} {isEn ? role.titleEn : role.titleHi}
                </p>
                <p className="text-[11px] text-on-surface-variant leading-snug mt-0.5 line-clamp-2">
                  {isEn ? role.descEn : role.descHi}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
