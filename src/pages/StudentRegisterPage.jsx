import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/* ─── Student data shape (ready for MERN backend) ─── */
const EMPTY_STUDENT = {
  fullName: '',
  college: '',
  course: '',
  yearOfStudy: '',
  location: '',
  areaOfInterest: '',
};

export default function StudentRegisterPage() {
  const navigate = useNavigate();

  const [studentData, setStudentData] = useState(EMPTY_STUDENT);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  /* ─── Handlers ─── */
  const handleChange = (field, value) => {
    setStudentData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
  };

  const validate = () => {
    const e = {};
    if (!studentData.fullName.trim())       e.fullName       = 'Please enter your full name.';
    if (!studentData.college.trim())        e.college        = 'Please enter your college or university.';
    if (!studentData.course.trim())         e.course         = 'Please enter your course.';
    if (!studentData.yearOfStudy)           e.yearOfStudy    = 'Please select your year of study.';
    if (!studentData.areaOfInterest)        e.areaOfInterest = 'Please select your area of interest.';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      setTimeout(() => navigate('/dashboard'), 1500);
    }, 1000);
  };

  /* ─── Field component ─── */
  const Field = ({ id, label, icon, error, children }) => (
    <div>
      <label
        htmlFor={id}
        className="block font-label-md text-label-md text-on-surface"
        style={{ marginBottom: '8px' }}
      >
        {label}
      </label>
      <div className="relative rounded-md shadow-sm">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <span className="material-symbols-outlined text-outline">{icon}</span>
        </div>
        {children}
      </div>
      {error && <p className="text-xs text-error mt-1">{error}</p>}
    </div>
  );

  const inputCls = (errKey) =>
    `block w-full pl-10 sm:text-sm rounded-lg focus:ring-primary focus:border-primary h-[56px] bg-transparent text-on-surface focus:outline-none border ${
      errors[errKey] ? 'border-error' : 'border-outline/30'
    }`;

  /* ─── Render ─── */
  return (
    <div
      className="bg-background text-on-background min-h-screen flex flex-col font-body-md antialiased"
    >
      {/* ── Stitch: nav suppressed for linear/transactional intent ── */}
      <main className="flex-grow flex items-center justify-center p-[1rem] md:p-[2.5rem]">
        <div className="w-full max-w-2xl">

          {/* ── Header Section ── */}
          <div className="text-center mb-[2rem]">
            <span
              className="material-symbols-outlined text-primary text-6xl mb-4 inline-block"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              school
            </span>
            <h1 className="font-headline-lg text-headline-lg text-primary">
              Create Student Profile
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant mt-[0.5rem]">
              Join Farmer Helper and connect with the agricultural community.
            </p>
          </div>

          {/* ── Card Container ── */}
          <div
            className="bg-surface-container-lowest rounded-[24px] border border-outline-variant/30 p-[1rem] md:p-[2.5rem]"
            style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}
          >
            {isSuccess ? (
              /* ── Success State ── */
              <div className="py-10 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <span
                    className="material-symbols-outlined text-primary text-4xl"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    check_circle
                  </span>
                </div>
                <h3 className="font-headline-md text-headline-md text-primary">
                  Student Profile Created!
                </h3>
                <p className="text-sm text-on-surface-variant">
                  Redirecting to your dashboard…
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-[1rem]">

                {/* Full Name */}
                <Field id="fullName" label="Full Name" icon="person" error={errors.fullName}>
                  <input
                    id="fullName"
                    type="text"
                    value={studentData.fullName}
                    onChange={(e) => handleChange('fullName', e.target.value)}
                    placeholder="John Doe"
                    className={inputCls('fullName')}
                  />
                </Field>

                {/* College / University */}
                <Field id="university" label="College / University" icon="account_balance" error={errors.college}>
                  <input
                    id="university"
                    type="text"
                    value={studentData.college}
                    onChange={(e) => handleChange('college', e.target.value)}
                    placeholder="Agricultural State University"
                    className={inputCls('college')}
                  />
                </Field>

                {/* Course & Year of Study — 2-col grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-[1rem]">

                  {/* Course */}
                  <Field id="course" label="Course" icon="book" error={errors.course}>
                    <input
                      id="course"
                      type="text"
                      value={studentData.course}
                      onChange={(e) => handleChange('course', e.target.value)}
                      placeholder="BSc Agriculture"
                      className={inputCls('course')}
                    />
                  </Field>

                  {/* Year of Study */}
                  <Field id="year" label="Year of Study" icon="calendar_month" error={errors.yearOfStudy}>
                    <select
                      id="year"
                      value={studentData.yearOfStudy}
                      onChange={(e) => handleChange('yearOfStudy', e.target.value)}
                      className={inputCls('yearOfStudy') + ' appearance-none'}
                    >
                      <option value="" disabled>Select Year</option>
                      <option value="1">1st Year</option>
                      <option value="2">2nd Year</option>
                      <option value="3">3rd Year</option>
                      <option value="4">4th Year</option>
                      <option value="postgrad">Postgraduate</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-outline">
                      <span className="material-symbols-outlined text-xl">expand_more</span>
                    </div>
                  </Field>

                </div>

                {/* Location */}
                <Field id="location" label="Location" icon="location_on" error={errors.location}>
                  <input
                    id="location"
                    type="text"
                    value={studentData.location}
                    onChange={(e) => handleChange('location', e.target.value)}
                    placeholder="City, State"
                    className={inputCls('location')}
                  />
                </Field>

                {/* Area of Interest */}
                <Field id="interest" label="Area of Interest" icon="eco" error={errors.areaOfInterest}>
                  <select
                    id="interest"
                    value={studentData.areaOfInterest}
                    onChange={(e) => handleChange('areaOfInterest', e.target.value)}
                    className={inputCls('areaOfInterest') + ' appearance-none'}
                  >
                    <option value="" disabled>Select Primary Interest</option>
                    <option value="crop">Crop Science</option>
                    <option value="soil">Soil Management</option>
                    <option value="tech">AgriTech &amp; Data</option>
                    <option value="livestock">Livestock Management</option>
                    <option value="business">Agribusiness</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-outline">
                    <span className="material-symbols-outlined text-xl">expand_more</span>
                  </div>
                </Field>

                {/* Submit */}
                <div
                  className="border-t border-outline-variant/30"
                  style={{ paddingTop: '1rem', marginTop: '1rem' }}
                >
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center items-center h-[56px] px-4 border border-transparent rounded-[16px] shadow-sm font-label-md text-label-md font-medium text-on-primary bg-primary hover:bg-primary-container focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200 disabled:opacity-70 cursor-pointer active:scale-95"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Creating Profile…</span>
                      </div>
                    ) : (
                      <>
                        <span>Create Student Profile</span>
                        <span className="material-symbols-outlined ml-2">arrow_forward</span>
                      </>
                    )}
                  </button>
                </div>

              </form>
            )}
          </div>
          {/* end card */}

        </div>
      </main>
    </div>
  );
}
