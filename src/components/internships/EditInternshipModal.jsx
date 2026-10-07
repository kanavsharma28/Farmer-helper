import React, { useState, useEffect } from 'react';
import { FARMER_INTERNSHIP_CATEGORIES } from '../../data/internshipsData';

export default function EditInternshipModal({
  isOpen,
  internship,
  onClose,
  onUpdateSuccess,
  lang = 'en'
}) {
  const isEn = lang === 'en';

  const [form, setForm] = useState({
    title: '',
    category: '',
    shortDescription: '',
    farmName: '',
    location: '',
    duration: '',
    stipend: 0,
    positions: 2,
    deadline: '',
    status: 'Active',
    accommodation: true,
    food: true,
    certificate: true,
  });

  useEffect(() => {
    if (internship) {
      setForm({
        title: internship.title || '',
        category: internship.category || internship.domain || FARMER_INTERNSHIP_CATEGORIES[0].id,
        shortDescription: internship.orgDescription || '',
        farmName: internship.farmName || internship.organization || '',
        location: internship.location || '',
        duration: internship.duration || '2 Months',
        stipend: internship.stipend || 0,
        positions: internship.openings || 2,
        deadline: internship.deadline || '',
        status: internship.status || 'Active',
        accommodation: internship.perks?.includes('Free Accommodation') || false,
        food: internship.perks?.includes('Food Provided') || true,
        certificate: internship.perks?.includes('Certificate on Completion') || true,
      });
    }
  }, [internship]);

  if (!isOpen || !internship) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updated = {
      ...internship,
      title: form.title,
      category: form.category,
      domain: form.category,
      orgDescription: form.shortDescription,
      farmName: form.farmName,
      organization: form.farmName,
      location: form.location,
      duration: form.duration,
      stipend: parseInt(form.stipend) || 0,
      stipendDisplay: form.stipend > 0 ? `₹${form.stipend.toLocaleString()} / Mo` : 'Certificate & Perks',
      openings: parseInt(form.positions) || 2,
      deadline: form.deadline,
      status: form.status,
      perks: [
        form.accommodation ? 'Free Accommodation' : null,
        form.food ? 'Food Provided' : null,
        form.certificate ? 'Certificate on Completion' : null,
      ].filter(Boolean),
    };

    onUpdateSuccess(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-surface-container-lowest rounded-3xl shadow-2xl border border-outline-variant/40 overflow-hidden flex flex-col max-h-[90vh] z-10 animate-fadeIn">
        <div className="p-5 sm:p-6 bg-surface-container-low border-b border-outline-variant/30 flex items-center justify-between">
          <h2 className="text-lg font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">edit</span>
            <span>{isEn ? 'Edit Farm Internship' : 'इंटर्नशिप संपादित करें'}</span>
          </h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant">
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 overflow-y-auto text-xs sm:text-sm">
          <div>
            <label className="block font-semibold text-on-surface mb-1">{isEn ? 'Title' : 'शीर्षक'}</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-xl border border-outline-variant/60 bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-on-surface mb-1">{isEn ? 'Category' : 'श्रेणी'}</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl border border-outline-variant/60 bg-surface"
              >
                {FARMER_INTERNSHIP_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.labelEn}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-on-surface mb-1">{isEn ? 'Status' : 'स्थिति'}</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl border border-outline-variant/60 bg-surface font-semibold"
              >
                <option value="Active">Active (सक्रिय)</option>
                <option value="Closed">Closed (बंद)</option>
                <option value="Draft">Draft (ड्राफ्ट)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-on-surface mb-1">{isEn ? 'Stipend (₹/mo)' : 'स्टाइपेंड'}</label>
              <input
                type="number"
                name="stipend"
                value={form.stipend}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl border border-outline-variant/60 bg-surface"
              />
            </div>

            <div>
              <label className="block font-semibold text-on-surface mb-1">{isEn ? 'Positions' : 'पद'}</label>
              <input
                type="number"
                name="positions"
                min="1"
                value={form.positions}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl border border-outline-variant/60 bg-surface"
              />
            </div>

            <div>
              <label className="block font-semibold text-on-surface mb-1">{isEn ? 'Deadline' : 'अंतिम तिथि'}</label>
              <input
                type="date"
                name="deadline"
                value={form.deadline}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl border border-outline-variant/60 bg-surface"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-on-surface mb-1">{isEn ? 'Description' : 'विवरण'}</label>
            <textarea
              name="shortDescription"
              value={form.shortDescription}
              onChange={handleChange}
              rows={3}
              className="w-full p-3 rounded-xl border border-outline-variant/60 bg-surface"
            />
          </div>

          <div className="pt-3 border-t border-outline-variant/30 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-outline-variant/60 text-xs font-semibold"
            >
              {isEn ? 'Cancel' : 'रद्द करें'}
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-container"
            >
              {isEn ? 'Save Changes' : 'बदलाव सहेजें'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
