import React, { useState } from 'react';
import {
  COMMUNITY_CATEGORIES,
  ROLE_CATEGORY_SUGGESTIONS,
} from '../../data/communityData';
import { ROLE_LABELS } from '../../data/navigationConfig';

export default function CreatePostModal({
  isOpen,
  onClose,
  onSubmit,
  currentUser,
  lang = 'en',
}) {
  const isEn = lang === 'en';
  const role = currentUser?.role || 'farmer';
  const roleLabel = ROLE_LABELS[role] || ROLE_LABELS.farmer;
  const suggestions = ROLE_CATEGORY_SUGGESTIONS[role] || ROLE_CATEGORY_SUGGESTIONS.farmer;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(suggestions[0]?.id || 'crops');
  const [location, setLocation] = useState(currentUser?.location || '');
  const [imageUrl, setImageUrl] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!title.trim()) {
      newErrors.title = isEn ? 'Post title is required.' : 'पोस्ट शीर्षक आवश्यक है।';
    } else if (title.trim().length < 5) {
      newErrors.title = isEn ? 'Title should be at least 5 characters.' : 'शीर्षक कम से कम 5 अक्षरों का होना चाहिए।';
    }

    if (!description.trim()) {
      newErrors.description = isEn ? 'Post description is required.' : 'विवरण आवश्यक है।';
    } else if (description.trim().length < 10) {
      newErrors.description = isEn ? 'Description should be at least 10 characters.' : 'विवरण कम से कम 10 अक्षरों का होना चाहिए।';
    }

    if (!category) {
      newErrors.category = isEn ? 'Please select a category.' : 'कृपया एक श्रेणी चुनें।';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setIsSubmitting(true);
      onSubmit({
        title,
        description,
        category,
        location,
        image: imageUrl.trim(),
      });
      onClose();
    } catch (err) {
      setErrors({ form: err.message || 'Error publishing post' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/30 shadow-2xl w-full max-w-2xl my-8 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-outline-variant/30 flex items-center justify-between bg-surface-container-low/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">edit_square</span>
            </div>
            <div>
              <h2 className="font-bold text-lg text-on-surface">
                {isEn ? 'Create Community Post' : 'नई पोस्ट लिखें'}
              </h2>
              <p className="text-xs text-on-surface-variant flex items-center gap-1.5 mt-0.5">
                <span>{isEn ? 'Posting as:' : 'प्रकाशक:'}</span>
                <span className="font-bold text-on-surface">{currentUser?.name}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${roleLabel.badgeBg} ${roleLabel.badgeText}`}>
                  {isEn ? roleLabel.en : roleLabel.hi}
                </span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-outline hover:text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {errors.form && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
              {errors.form}
            </div>
          )}

          {/* ── Role-Aware Category Suggestions ── */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant block">
              {isEn ? 'Recommended Topics for Your Role:' : 'आपके रोल अनुसार अनुशंसित श्रेणियां:'}
            </label>
            <div className="flex items-center gap-2 flex-wrap">
              {suggestions.map((sug) => (
                <button
                  key={sug.id}
                  type="button"
                  onClick={() => setCategory(sug.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all border cursor-pointer ${
                    category === sug.id
                      ? 'bg-primary text-white border-primary shadow-xs font-bold'
                      : 'bg-surface-container-low border-outline-variant/40 text-on-surface hover:bg-surface-container'
                  }`}
                >
                  <span>{sug.emoji}</span>
                  <span>{sug.labelEn}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Category Dropdown */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-on-surface block">
              {isEn ? 'Post Category *' : 'श्रेणी चुनें *'}
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {COMMUNITY_CATEGORIES.filter((c) => c.id !== 'all').map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.emoji} {isEn ? cat.labelEn : cat.labelHi}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-xs text-red-600">{errors.category}</p>
            )}
          </div>

          {/* Title Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-on-surface block">
              {isEn ? 'Post Title *' : 'पोस्ट शीर्षक *'}
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={
                role === 'farmer'
                  ? (isEn ? 'e.g., How to protect mustard from white rust in cold fog?' : 'उदा. सरसों को सफेद रतुआ से कैसे बचाएं?')
                  : role === 'student'
                  ? (isEn ? 'e.g., Comparative analysis of bio-fertilizers in Wheat' : 'उदा. गेहूं में जैव-उर्वरकों का तुलनात्मक अध्ययन')
                  : role === 'buyer'
                  ? (isEn ? 'e.g., Buying Requirement: 1,000 Quintals Maize in Meerut Mandi' : 'उदा. खरीद मांग: मेरठ मंडी में 1,000 क्विंटल मक्का')
                  : (isEn ? 'e.g., Laser land levelers available for early rabi booking' : 'उदा. रबी जुताई हेतु लेजर लैंड लेवलर उपलब्ध')
              }
              className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {errors.title && (
              <p className="text-xs text-red-600">{errors.title}</p>
            )}
          </div>

          {/* Description Textarea */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-on-surface block">
              {isEn ? 'Post Description *' : 'विस्तार से बताएं *'}
            </label>
            <textarea
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={
                isEn
                  ? 'Describe your question, research note, equipment availability, or purchase demand in detail...'
                  : 'अपने प्रश्न, अनुभव, मांग अथवा कृषि साधन का पूरा विवरण लिखें...'
              }
              className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant/40 text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-2 focus:ring-primary"
            ></textarea>
            {errors.description && (
              <p className="text-xs text-red-600">{errors.description}</p>
            )}
          </div>

          {/* Location & Image URL in 2 cols */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-on-surface block">
                {isEn ? 'Location (Optional)' : 'स्थान (वैकल्पिक)'}
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg">
                  location_on
                </span>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder={isEn ? 'e.g. Meerut, UP' : 'उदा. मेरठ, यूपी'}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/40 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-on-surface block">
                {isEn ? 'Image URL (Optional)' : 'फोटो लिंक (वैकल्पिक)'}
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg">
                  image
                </span>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/crop.jpg"
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/40 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-outline-variant/30">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-outline-variant/60 text-on-surface-variant font-semibold text-sm hover:bg-surface-container transition-all cursor-pointer"
            >
              {isEn ? 'Cancel' : 'रद्द करें'}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#115322] via-[#1a6e2e] to-[#2d8c39] text-white font-semibold text-sm shadow-[0_4px_14px_rgba(18,83,33,0.28)] hover:shadow-[0_6px_20px_rgba(18,83,33,0.38)] hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 cursor-pointer flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-base">send</span>
              <span>{isEn ? 'Publish Post' : 'पोस्ट प्रकाशित करें'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
