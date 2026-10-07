import React, { useState, useEffect } from 'react';
import { COMMUNITY_CATEGORIES } from '../../data/communityData';

export default function EditPostModal({
  isOpen,
  onClose,
  post,
  onSave,
  lang = 'en',
}) {
  const isEn = lang === 'en';
  const [title, setTitle] = useState(post?.title || '');
  const [description, setDescription] = useState(post?.description || '');
  const [category, setCategory] = useState(post?.category || 'crops');
  const [location, setLocation] = useState(post?.location || '');
  const [imageUrl, setImageUrl] = useState(post?.image || '');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (post) {
      setTitle(post.title || '');
      setDescription(post.description || '');
      setCategory(post.category || 'crops');
      setLocation(post.location || '');
      setImageUrl(post.image || '');
      setErrors({});
    }
  }, [post]);

  if (!isOpen || !post) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!title.trim()) {
      newErrors.title = isEn ? 'Post title is required.' : 'शीर्षक आवश्यक है।';
    }
    if (!description.trim()) {
      newErrors.description = isEn ? 'Post description is required.' : 'विवरण आवश्यक है।';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave(post.id, {
      title,
      description,
      category,
      location,
      image: imageUrl.trim(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/30 shadow-2xl w-full max-w-xl my-8 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-outline-variant/30 flex items-center justify-between bg-surface-container-low/60">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-primary text-xl">edit</span>
            <h2 className="font-bold text-base text-on-surface">
              {isEn ? 'Edit Community Post' : 'पोस्ट संपादित करें'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-outline hover:text-on-surface"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-on-surface block">
              {isEn ? 'Category' : 'श्रेणी'}
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-surface-container-low border border-outline-variant/40 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {COMMUNITY_CATEGORIES.filter((c) => c.id !== 'all').map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.emoji} {isEn ? cat.labelEn : cat.labelHi}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-on-surface block">
              {isEn ? 'Post Title' : 'शीर्षक'}
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {errors.title && <p className="text-xs text-red-600">{errors.title}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-on-surface block">
              {isEn ? 'Description' : 'विवरण'}
            </label>
            <textarea
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
            ></textarea>
            {errors.description && <p className="text-xs text-red-600">{errors.description}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-on-surface block">
                {isEn ? 'Location' : 'स्थान'}
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/40 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-on-surface block">
                {isEn ? 'Image URL' : 'फोटो लिंक'}
              </label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/40 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-outline-variant/30">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-outline-variant/60 text-on-surface-variant font-semibold text-sm hover:bg-surface-container cursor-pointer"
            >
              {isEn ? 'Cancel' : 'रद्द करें'}
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-primary text-white font-semibold text-sm shadow-xs hover:bg-primary-container cursor-pointer"
            >
              {isEn ? 'Save Changes' : 'बदलाव सहेजें'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
