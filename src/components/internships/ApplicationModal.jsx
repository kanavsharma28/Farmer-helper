import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function ApplicationModal({
  internship,
  isOpen,
  onClose,
  onSubmitSuccess
}) {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    fullName: user?.name || 'Aman Verma',
    email: user?.email || 'aman.verma@agriuni.ac.in',
    mobile: user?.phone || '9812345678',
    college: user?.details?.college || 'GB Pant University of Agriculture',
    course: user?.details?.course || 'B.Sc. (Hons) Agriculture',
    yearOfStudy: user?.details?.yearOfStudy || '3rd Year',
    location: user?.location || 'Meerut, Uttar Pradesh',
    skills: 'Crop Planning, Drip Irrigation, Soil Testing, Farm Record Keeping',
    experience: 'Completed 6-week farm training. Familiar with polyhouse drip setups.',
    coverLetter: 'I am highly passionate about modern sustainable farming and want to contribute coursework to real field operations.'
  });

  const [resumeFile, setResumeFile] = useState({
    name: 'Aman_Verma_Agri_Resume.pdf',
    size: '245 KB'
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Hook rules: all hooks above conditional return
  if (!isOpen || !internship) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setResumeFile({
        name: file.name,
        size: `${Math.round(file.size / 1024)} KB`
      });
      if (errors.resume) {
        setErrors((prev) => ({ ...prev, resume: undefined }));
      }
    }
  };

  const handleRemoveFile = () => {
    setResumeFile(null);
  };

  const validate = () => {
    const errs = {};
    if (!formData.fullName.trim()) errs.fullName = 'Full Name is required';
    if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) {
      errs.email = 'Enter a valid email address';
    }
    const cleanMobile = formData.mobile.replace(/\D/g, '');
    if (!cleanMobile || cleanMobile.length < 10) {
      errs.mobile = 'Enter a valid 10-digit mobile number';
    }
    if (!formData.college.trim()) errs.college = 'College/University name is required';
    if (!formData.course.trim()) errs.course = 'Degree/Course is required';
    if (!formData.yearOfStudy) errs.yearOfStudy = 'Please select your year of study';
    if (!formData.location.trim()) errs.location = 'Current location is required';
    if (!resumeFile) errs.resume = 'Please upload your resume (PDF or DOCX)';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    // Simulate realistic API request delay
    setTimeout(() => {
      const applicationPayload = {
        id: `FH-AGRI-${Date.now().toString().slice(-4)}`,
        internshipId: internship.id,
        internshipTitle: internship.title,
        organization: internship.farmName || internship.organization,
        farmName: internship.farmName || internship.organization,
        ownerId: internship.ownerId || 'user_farmer_01',
        ownerName: internship.ownerName || 'Rajesh Kumar',
        studentId: user?.id || 'user_student_01',
        studentName: formData.fullName,
        studentEmail: formData.email,
        studentMobile: formData.mobile,
        applicantName: formData.fullName,
        applicantEmail: formData.email,
        applicantMobile: formData.mobile,
        location: formData.location || internship.location,
        college: formData.college,
        course: formData.course,
        yearOfStudy: formData.yearOfStudy,
        skills: formData.skills,
        experience: formData.experience,
        coverLetter: formData.coverLetter,
        resumeName: resumeFile ? resumeFile.name : 'Resume.pdf',
        stipendDisplay: internship.stipendDisplay,
        appliedDate: new Date().toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        }),
        status: 'Submitted',
        nextStep: 'Under review by host farmer. Review expected soon.',
      };

      setIsSubmitting(false);
      onSubmitSuccess(applicationPayload);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-surface-container-lowest rounded-3xl shadow-2xl border border-outline-variant/40 overflow-hidden flex flex-col max-h-[92vh] z-10 animate-fadeIn">
        
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-surface-container-low border-b border-outline-variant/30 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary block">
              Farmer Helper — Internship Application
            </span>
            <h2 className="font-headline-md text-lg sm:text-xl font-bold text-on-surface truncate mt-0.5">
              Apply for {internship.title}
            </h2>
            <p className="font-caption text-xs text-on-surface-variant truncate">
              {internship.organization} • {internship.location}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-outline hover:text-on-surface transition-colors shrink-0"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} noValidate className="overflow-y-auto flex-1 p-5 sm:p-7 space-y-5 text-sm">
          
          {/* Instructions note */}
          <div className="p-3.5 rounded-xl bg-secondary-container/20 border border-secondary/30 flex items-start gap-2.5">
            <span className="material-symbols-outlined text-secondary text-xl shrink-0 mt-0.5">
              info
            </span>
            <div className="text-xs text-on-surface leading-relaxed">
              <strong>Student Profile Linked:</strong> Your academic details are pre-filled from your registered student profile. You can modify them before final submission.
            </div>
          </div>

          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="font-label-md text-xs font-bold uppercase tracking-wider text-primary border-b border-outline-variant/30 pb-1">
              1. Candidate Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div>
                <label className="block font-label-md text-xs font-semibold text-on-surface mb-1">
                  Full Name <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="e.g. Aman Verma"
                  className={`w-full px-3.5 py-2.5 rounded-xl border font-body-md text-sm bg-surface-container-low text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                    errors.fullName ? 'border-error ring-1 ring-error/30' : 'border-outline-variant/50'
                  }`}
                />
                {errors.fullName && <p className="text-xs text-error mt-1">{errors.fullName}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block font-label-md text-xs font-semibold text-on-surface mb-1">
                  Email Address <span className="text-error">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@college.edu"
                  className={`w-full px-3.5 py-2.5 rounded-xl border font-body-md text-sm bg-surface-container-low text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                    errors.email ? 'border-error ring-1 ring-error/30' : 'border-outline-variant/50'
                  }`}
                />
                {errors.email && <p className="text-xs text-error mt-1">{errors.email}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Mobile Number */}
              <div>
                <label className="block font-label-md text-xs font-semibold text-on-surface mb-1">
                  Mobile Number <span className="text-error">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-outline">
                    +91
                  </span>
                  <input
                    type="tel"
                    name="mobile"
                    maxLength={10}
                    value={formData.mobile}
                    onChange={handleChange}
                    placeholder="9876543210"
                    className={`w-full pl-12 pr-3.5 py-2.5 rounded-xl border font-body-md text-sm bg-surface-container-low text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                      errors.mobile ? 'border-error ring-1 ring-error/30' : 'border-outline-variant/50'
                    }`}
                  />
                </div>
                {errors.mobile && <p className="text-xs text-error mt-1">{errors.mobile}</p>}
              </div>

              {/* Current Location */}
              <div>
                <label className="block font-label-md text-xs font-semibold text-on-surface mb-1">
                  Current City / State <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Meerut, UP"
                  className={`w-full px-3.5 py-2.5 rounded-xl border font-body-md text-sm bg-surface-container-low text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                    errors.location ? 'border-error ring-1 ring-error/30' : 'border-outline-variant/50'
                  }`}
                />
                {errors.location && <p className="text-xs text-error mt-1">{errors.location}</p>}
              </div>
            </div>
          </div>

          {/* Academic Background */}
          <div className="space-y-4 pt-2">
            <h3 className="font-label-md text-xs font-bold uppercase tracking-wider text-primary border-b border-outline-variant/30 pb-1">
              2. Academic Background
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* College */}
              <div>
                <label className="block font-label-md text-xs font-semibold text-on-surface mb-1">
                  College / University <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  name="college"
                  value={formData.college}
                  onChange={handleChange}
                  placeholder="University Name"
                  className={`w-full px-3.5 py-2.5 rounded-xl border font-body-md text-sm bg-surface-container-low text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                    errors.college ? 'border-error ring-1 ring-error/30' : 'border-outline-variant/50'
                  }`}
                />
                {errors.college && <p className="text-xs text-error mt-1">{errors.college}</p>}
              </div>

              {/* Course */}
              <div>
                <label className="block font-label-md text-xs font-semibold text-on-surface mb-1">
                  Degree / Course <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                  placeholder="e.g. B.Sc Agriculture"
                  className={`w-full px-3.5 py-2.5 rounded-xl border font-body-md text-sm bg-surface-container-low text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                    errors.course ? 'border-error ring-1 ring-error/30' : 'border-outline-variant/50'
                  }`}
                />
                {errors.course && <p className="text-xs text-error mt-1">{errors.course}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Year of Study */}
              <div>
                <label className="block font-label-md text-xs font-semibold text-on-surface mb-1">
                  Year of Study <span className="text-error">*</span>
                </label>
                <select
                  name="yearOfStudy"
                  value={formData.yearOfStudy}
                  onChange={handleChange}
                  className={`w-full px-3.5 py-2.5 rounded-xl border font-body-md text-sm bg-surface-container-low text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer ${
                    errors.yearOfStudy ? 'border-error ring-1 ring-error/30' : 'border-outline-variant/50'
                  }`}
                >
                  <option value="">Select Year</option>
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year / Final Year">4th Year / Final Year</option>
                  <option value="Post-Graduate / Masters">Post-Graduate / Masters</option>
                  <option value="Recent Graduate">Recent Graduate (Alumni)</option>
                </select>
                {errors.yearOfStudy && <p className="text-xs text-error mt-1">{errors.yearOfStudy}</p>}
              </div>

              {/* Skills */}
              <div>
                <label className="block font-label-md text-xs font-semibold text-on-surface mb-1">
                  Key Skills &amp; Interests
                </label>
                <input
                  type="text"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  placeholder="e.g. Organic Farming, Soil Testing"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant/50 font-body-md text-sm bg-surface-container-low text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
          </div>

          {/* Practical Experience & Statement */}
          <div className="space-y-4 pt-2">
            <h3 className="font-label-md text-xs font-bold uppercase tracking-wider text-primary border-b border-outline-variant/30 pb-1">
              3. Experience &amp; Statement
            </h3>

            <div>
              <label className="block font-label-md text-xs font-semibold text-on-surface mb-1">
                Prior Farm / Lab / Project Experience (Optional)
              </label>
              <textarea
                name="experience"
                rows={2}
                value={formData.experience}
                onChange={handleChange}
                placeholder="Briefly describe any farm visits, RAWE modules, or agricultural projects..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant/50 font-body-md text-sm bg-surface-container-low text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label className="block font-label-md text-xs font-semibold text-on-surface mb-1">
                Statement of Purpose / Cover Note
              </label>
              <textarea
                name="coverLetter"
                rows={3}
                value={formData.coverLetter}
                onChange={handleChange}
                placeholder="Why are you interested in this specific opportunity? What do you hope to learn?"
                className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant/50 font-body-md text-sm bg-surface-container-low text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          {/* Resume Upload Simulator */}
          <div className="space-y-2 pt-2">
            <h3 className="font-label-md text-xs font-bold uppercase tracking-wider text-primary border-b border-outline-variant/30 pb-1">
              4. Resume / CV <span className="text-error">*</span>
            </h3>

            {resumeFile ? (
              <div className="p-3.5 rounded-2xl bg-surface-container-low border border-primary/30 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-2xl">description</span>
                  </div>
                  <div>
                    <p className="font-semibold text-xs sm:text-sm text-on-surface truncate">{resumeFile.name}</p>
                    <p className="font-caption text-xs text-outline">{resumeFile.size} • Ready to submit</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="p-1.5 rounded-lg text-error hover:bg-error/10 transition-colors"
                  title="Remove file"
                >
                  <span className="material-symbols-outlined text-xl">delete</span>
                </button>
              </div>
            ) : (
              <label className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center gap-2 text-center cursor-pointer transition-colors ${
                errors.resume ? 'border-error bg-error/5' : 'border-outline-variant/60 hover:border-primary bg-surface-container-low/50 hover:bg-surface-container-low'
              }`}>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <span className="material-symbols-outlined text-3xl text-primary">upload_file</span>
                <p className="font-semibold text-xs sm:text-sm text-on-surface">Click to upload or drag resume</p>
                <p className="font-caption text-xs text-outline">Supported formats: PDF, DOC, DOCX (Max 5MB)</p>
              </label>
            )}
            {errors.resume && <p className="text-xs text-error mt-1">{errors.resume}</p>}
          </div>

          {/* Modal Footer Controls */}
          <div className="pt-4 border-t border-outline-variant/30 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-surface-container text-on-surface font-label-md text-sm font-medium hover:bg-surface-container-high transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-7 py-2.5 rounded-xl bg-primary text-on-primary font-label-md text-sm font-semibold hover:bg-primary-container transition-all shadow-sm active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <span>Submit Application</span>
                  <span className="material-symbols-outlined text-lg">check</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
