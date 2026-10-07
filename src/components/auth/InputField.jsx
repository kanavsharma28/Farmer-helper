import React from 'react';

export default function InputField({ id, label, type = 'text', value, onChange, placeholder, error, required = false }) {
  return (
    <div>
      <label className="block font-label-md text-label-md text-on-surface mb-2 font-medium" htmlFor={id}>
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`w-full h-14 px-4 bg-surface-container-lowest border ${
            error ? 'border-error focus:border-error focus:ring-error' : 'border-[#E0E0D1] focus:border-primary focus:ring-primary'
          } rounded-[16px] text-on-surface font-body-md focus:outline-none focus:ring-1 transition-colors`}
        />
      </div>
      {error && <p className="text-xs text-error mt-1.5 font-medium">{error}</p>}
    </div>
  );
}
