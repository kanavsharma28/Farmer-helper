import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FARMER_INTERNSHIP_CATEGORIES } from '../../data/internshipsData';

export default function PostInternshipModal({
  isOpen,
  onClose,
  onSubmitSuccess,
  lang = 'en'
}) {
  const isEn = lang === 'en';
  const { user } = useAuth();

  const [form, setForm] = useState({
    title: '',
    category: FARMER_INTERNSHIP_CATEGORIES[0].id,
    shortDescription: '',
    detailedDescription: '',
    farmName: user?.details?.farmName || `${user?.name || 'Farmer'}'s Model Farm`,
    farmerName: user?.name || 'Rajesh Kumar',
    location: user?.location || 'Meerut, Uttar Pradesh',
    state: user?.details?.state || 'Uttar Pradesh',
    district: user?.details?.district || 'Meerut',
    village: user?.details?.village || 'Khanna Village',
    duration: '2 Months',
    startDate: '2026-10-15',
    endDate: '2026-12-15',
    workMode: 'On-farm / Field',
    positions: 3,
    stipend: 8000,
    accommodation: true,
    food: true,
    certificate: true,
    eligibility: 'Pursuing or graduated in B.Sc Agriculture, Horticulture, or allied disciplines.',
    skills: 'Crop Management, Drip Irrigation, Farm Record Keeping',
    preferredCourse: 'B.Sc Agriculture / Horticulture / Agri Engineering',
    ageLimit: '18-28 Years',
    responsibilities: 'Daily morning farm inspections, automated fertigation support, soil moisture testing, crop pest scouting, harvesting and grading.',
    contactPhone: user?.phone || '9876543210',
    contactEmail: user?.email || 'farmer@farmerhelper.in',
    deadline: '2026-10-05',
    farmImageUrl: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = isEn ? 'Internship title is required' : 'शीर्षक आवश्यक है';
    if (!form.shortDescription.trim()) errs.shortDescription = isEn ? 'Short description is required' : 'संक्षिप्त विवरण आवश्यक है';
    if (!form.farmName.trim()) errs.farmName = isEn ? 'Farm name is required' : 'खेत का नाम आवश्यक है';
    if (!form.location.trim()) errs.location = isEn ? 'Location is required' : 'स्थान आवश्यक है';
    if (!form.deadline) errs.deadline = isEn ? 'Application deadline is required' : 'अंतिम तिथि आवश्यक है';
    if (!form.positions || parseInt(form.positions) <= 0) errs.positions = isEn ? 'Positions must be at least 1' : 'कम से कम 1 पद आवश्यक है';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const valErrors = validate();
    if (Object.keys(valErrors).length > 0) {
      setErrors(valErrors);
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const skillsArray = form.skills.split(',').map((s) => s.trim()).filter(Boolean);
      const respArray = form.responsibilities.split(',').map((r) => r.trim()).filter(Boolean);

      const newInternship = {
        id: `farm-intern-${Date.now().toString().slice(-4)}`,
        ownerId: user?.id || 'user_farmer_01',
        ownerName: form.farmerName,
        ownerRole: 'farmer',
        farmName: form.farmName,
        organization: form.farmName,
        orgDescription: form.detailedDescription || form.shortDescription,
        status: 'Active',
        verified: true,
        title: form.title,
        domain: form.category,
        category: form.category,
        location: form.location,
        state: form.state,
        district: form.district,
        village: form.village,
        type: 'Farm Internship',
        workMode: form.workMode,
        duration: form.duration,
        durationCategory: form.duration.includes('1') ? '1-4 Wks' : form.duration.includes('3') ? '1-3 Mos' : '3-6 Mos',
        stipend: parseInt(form.stipend) || 0,
        stipendDisplay: form.stipend > 0 ? `₹${form.stipend.toLocaleString()} / Mo` : 'Certificate & Perks',
        stipendPerks: `${form.accommodation ? '+ Free Stay ' : ''}${form.food ? '+ Meals' : ''}`,
        stipendType: form.stipend > 0 ? 'paid' : 'free',
        startDate: form.startDate,
        deadline: form.deadline,
        deadlineDisplay: `Apply by ${new Date(form.deadline).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}`,
        applicantsCount: 0,
        openings: parseInt(form.positions) || 2,
        skills: skillsArray.length > 0 ? skillsArray : ['Field Work', 'Crop Management'],
        perks: [
          form.accommodation ? 'Free Accommodation' : null,
          form.food ? 'Food Provided' : null,
          form.certificate ? 'Certificate on Completion' : null,
        ].filter(Boolean),
        responsibilities: respArray.length > 0 ? respArray : [form.responsibilities],
        requirements: [form.eligibility, `Preferred: ${form.preferredCourse}`],
        benefits: [
          form.stipend > 0 ? `Monthly stipend of ₹${form.stipend}` : 'Practical Field Experience',
          'Free stay and wholesome farm meals',
          'Certificate of completion from host farmer'
        ],
        contactPhone: form.contactPhone,
        contactEmail: form.contactEmail,
        farmImageUrl: form.farmImageUrl,
        createdAt: new Date().toISOString(),
      };

      setIsSubmitting(false);
      onSubmitSuccess(newInternship);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-3xl bg-surface-container-lowest rounded-3xl shadow-2xl border border-outline-variant/40 overflow-hidden flex flex-col max-h-[92vh] z-10 animate-fadeIn">
        
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-surface-container-low border-b border-outline-variant/30 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary-container text-white flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-2xl">post_add</span>
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-primary block">
                {isEn ? 'Farmer Opportunity Portal' : 'किसान अवसर पोर्टल'}
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-on-surface">
                {isEn ? 'Post Farm Internship / Training 🌱' : 'खेत इंटर्नशिप / प्रशिक्षण पोस्ट करें 🌱'}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-5 sm:p-7 space-y-6 flex-1 text-xs sm:text-sm">
          
          {/* ── Section 1: Basic Information ── */}
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-primary flex items-center gap-2 border-b border-outline-variant/30 pb-2">
              <span className="material-symbols-outlined text-lg">info</span>
              <span>{isEn ? '1. Basic Information' : '1. बुनियादी जानकारी'}</span>
            </h3>

            <div>
              <label className="block font-semibold text-on-surface mb-1">
                {isEn ? 'Internship Title *' : 'इंटर्नशिप शीर्षक *'}
              </label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder={isEn ? "e.g., Organic Wheat Farming & Drip Irrigation Intern" : "उदा., जैविक गेहूं खेती एवं ड्रिप सिंचाई इंटर्न"}
                className={`w-full px-4 py-2.5 rounded-xl border ${errors.title ? 'border-error' : 'border-outline-variant/60'} bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20`}
              />
              {errors.title && <p className="text-xs text-error mt-1">{errors.title}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-on-surface mb-1">
                  {isEn ? 'Category *' : 'श्रेणी *'}
                </label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-outline-variant/60 bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  {FARMER_INTERNSHIP_CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {isEn ? cat.labelEn : cat.labelHi}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-on-surface mb-1">
                  {isEn ? 'Work Mode' : 'कार्य का प्रकार'}
                </label>
                <select
                  name="workMode"
                  value={form.workMode}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-outline-variant/60 bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="On-farm / Field">On-farm / Field (खेत पर व्यावहारिक)</option>
                  <option value="Polyhouse / Greenhouse">Polyhouse / Greenhouse (पॉलीहाउस)</option>
                  <option value="Dairy & Farm Unit">Dairy & Farm Unit (डेयरी एवं फार्म)</option>
                  <option value="Hybrid AgTech">Hybrid AgTech (हाइब्रिड एग्रीटेक)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-on-surface mb-1">
                {isEn ? 'Short Summary *' : 'संक्षिप्त विवरण *'}
              </label>
              <textarea
                name="shortDescription"
                value={form.shortDescription}
                onChange={handleChange}
                rows={2}
                placeholder={isEn ? "Brief 1-2 sentence summary of what the student will learn on your farm..." : "छात्र आपके खेत पर क्या सीखेंगे, इसका 1-2 वाक्यों में सारांश..."}
                className={`w-full p-3 rounded-xl border ${errors.shortDescription ? 'border-error' : 'border-outline-variant/60'} bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20`}
              />
              {errors.shortDescription && <p className="text-xs text-error mt-1">{errors.shortDescription}</p>}
            </div>
          </div>

          {/* ── Section 2: Farm & Location Details ── */}
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-primary flex items-center gap-2 border-b border-outline-variant/30 pb-2">
              <span className="material-symbols-outlined text-lg">nature</span>
              <span>{isEn ? '2. Farm & Location Details' : '2. खेत व स्थान की जानकारी'}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-on-surface mb-1">
                  {isEn ? 'Farm / Enterprise Name *' : 'खेत / उपक्रम का नाम *'}
                </label>
                <input
                  type="text"
                  name="farmName"
                  value={form.farmName}
                  onChange={handleChange}
                  placeholder="e.g., Rajesh Model Organic Farm"
                  className={`w-full px-4 py-2.5 rounded-xl border ${errors.farmName ? 'border-error' : 'border-outline-variant/60'} bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20`}
                />
                {errors.farmName && <p className="text-xs text-error mt-1">{errors.farmName}</p>}
              </div>

              <div>
                <label className="block font-semibold text-on-surface mb-1">
                  {isEn ? 'Farmer / Host Name' : 'किसान / प्रदाता का नाम'}
                </label>
                <input
                  type="text"
                  name="farmerName"
                  value={form.farmerName}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-outline-variant/60 bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-on-surface mb-1">
                  {isEn ? 'Location / Mandi Area *' : 'स्थान / क्षेत्र *'}
                </label>
                <input
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="Meerut, Uttar Pradesh"
                  className="w-full px-4 py-2.5 rounded-xl border border-outline-variant/60 bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="block font-semibold text-on-surface mb-1">
                  {isEn ? 'District' : 'जिला'}
                </label>
                <input
                  type="text"
                  name="district"
                  value={form.district}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-outline-variant/60 bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="block font-semibold text-on-surface mb-1">
                  {isEn ? 'Village / Tehsil' : 'गांव / तहसील'}
                </label>
                <input
                  type="text"
                  name="village"
                  value={form.village}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-outline-variant/60 bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
          </div>

          {/* ── Section 3: Internship Specs & Stipend ── */}
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-primary flex items-center gap-2 border-b border-outline-variant/30 pb-2">
              <span className="material-symbols-outlined text-lg">payments</span>
              <span>{isEn ? '3. Duration, Positions & Benefits' : '3. अवधि, पद व सुविधाएं'}</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block font-semibold text-on-surface mb-1">
                  {isEn ? 'Duration' : 'अवधि'}
                </label>
                <select
                  name="duration"
                  value={form.duration}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 rounded-xl border border-outline-variant/60 bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="1 Month">1 Month (1 माह)</option>
                  <option value="2 Months">2 Months (2 माह)</option>
                  <option value="3 Months">3 Months (3 माह)</option>
                  <option value="6 Months">6 Months (6 माह)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-on-surface mb-1">
                  {isEn ? 'Positions *' : 'पदों की संख्या *'}
                </label>
                <input
                  type="number"
                  name="positions"
                  min="1"
                  max="20"
                  value={form.positions}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 rounded-xl border border-outline-variant/60 bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="block font-semibold text-on-surface mb-1">
                  {isEn ? 'Monthly Stipend (₹)' : 'मासिक स्टाइपेंड (₹)'}
                </label>
                <input
                  type="number"
                  name="stipend"
                  step="500"
                  value={form.stipend}
                  onChange={handleChange}
                  placeholder="e.g. 8000"
                  className="w-full px-3 py-2.5 rounded-xl border border-outline-variant/60 bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="block font-semibold text-on-surface mb-1">
                  {isEn ? 'Apply Deadline *' : 'अंतिम तिथि *'}
                </label>
                <input
                  type="date"
                  name="deadline"
                  value={form.deadline}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 rounded-xl border border-outline-variant/60 bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            {/* Perks Toggles */}
            <div className="bg-surface-container-low p-4 rounded-2xl flex flex-wrap items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer font-semibold text-on-surface">
                <input
                  type="checkbox"
                  name="accommodation"
                  checked={form.accommodation}
                  onChange={handleChange}
                  className="w-4 h-4 rounded text-primary focus:ring-primary"
                />
                <span>🏠 {isEn ? 'Free Accommodation' : 'रहने की सुविधा'}</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer font-semibold text-on-surface">
                <input
                  type="checkbox"
                  name="food"
                  checked={form.food}
                  onChange={handleChange}
                  className="w-4 h-4 rounded text-primary focus:ring-primary"
                />
                <span>🍲 {isEn ? 'Meals / Food Provided' : 'भोजन व्यवस्था'}</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer font-semibold text-on-surface">
                <input
                  type="checkbox"
                  name="certificate"
                  checked={form.certificate}
                  onChange={handleChange}
                  className="w-4 h-4 rounded text-primary focus:ring-primary"
                />
                <span>📜 {isEn ? 'Certificate on Completion' : 'प्रमाणपत्र प्रदान'}</span>
              </label>
            </div>
          </div>

          {/* ── Section 4: Eligibility & Responsibilities ── */}
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-primary flex items-center gap-2 border-b border-outline-variant/30 pb-2">
              <span className="material-symbols-outlined text-lg">task</span>
              <span>{isEn ? '4. Eligibility & Responsibilities' : '4. पात्रता व जिम्मेदारियां'}</span>
            </h3>

            <div>
              <label className="block font-semibold text-on-surface mb-1">
                {isEn ? 'Required Skills (comma separated)' : 'आवश्यक कौशल (अल्पविराम से अलग करें)'}
              </label>
              <input
                type="text"
                name="skills"
                value={form.skills}
                onChange={handleChange}
                placeholder="Crop Planning, Drip Irrigation, Soil Testing, Farm Record Keeping"
                className="w-full px-4 py-2.5 rounded-xl border border-outline-variant/60 bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label className="block font-semibold text-on-surface mb-1">
                {isEn ? 'Daily Farm Activities & Responsibilities' : 'दैनिक खेत कार्य व जिम्मेदारियां'}
              </label>
              <textarea
                name="responsibilities"
                value={form.responsibilities}
                onChange={handleChange}
                rows={2}
                placeholder="Field inspection, drip irrigation operation, soil testing, harvesting supervision..."
                className="w-full p-3 rounded-xl border border-outline-variant/60 bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          {/* ── Section 5: Contact & Farmer Profile ── */}
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-primary flex items-center gap-2 border-b border-outline-variant/30 pb-2">
              <span className="material-symbols-outlined text-lg">call</span>
              <span>{isEn ? '5. Contact Information' : '5. संपर्क विवरण'}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-on-surface mb-1">
                  {isEn ? 'Contact Mobile' : 'संपर्क मोबाइल'}
                </label>
                <input
                  type="text"
                  name="contactPhone"
                  value={form.contactPhone}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-outline-variant/60 bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="block font-semibold text-on-surface mb-1">
                  {isEn ? 'Contact Email' : 'संपर्क ईमेल'}
                </label>
                <input
                  type="email"
                  name="contactEmail"
                  value={form.contactEmail}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-outline-variant/60 bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-outline-variant/30 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-outline-variant/60 text-on-surface font-semibold hover:bg-surface-container transition-colors"
            >
              {isEn ? 'Cancel' : 'रद्द करें'}
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-primary text-white font-bold hover:bg-primary-container active:scale-95 transition-all shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-75"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>{isEn ? 'Publishing...' : 'प्रकाशित हो रहा है...'}</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-lg">check_circle</span>
                  <span>{isEn ? 'Publish Internship' : 'इंटर्नशिप प्रकाशित करें'}</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
