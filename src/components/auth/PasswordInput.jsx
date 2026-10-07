import React, { useState } from 'react';

export default function PasswordInput({ id, label, value, onChange, placeholder, error, forgotPasswordText, onForgotPassword, required = false }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <label className="block font-label-md text-label-md text-on-surface font-medium" htmlFor={id}>
          {label}
        </label>
        <button
          type="button"
          onClick={onForgotPassword}
          className="font-label-md text-label-md text-secondary hover:text-primary transition-colors text-xs font-semibold"
        >
          {forgotPasswordText}
        </button>
      </div>

      <div className="relative">
        <input
          id={id}
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`w-full h-14 px-4 pr-12 bg-surface-container-lowest border ${
            error ? 'border-error focus:border-error focus:ring-error' : 'border-[#E0E0D1] focus:border-primary focus:ring-primary'
          } rounded-[16px] text-on-surface font-body-md focus:outline-none focus:ring-1 transition-colors`}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-0 px-4 flex items-center text-on-surface-variant hover:text-on-surface transition-colors"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          <span className="material-symbols-outlined text-xl">
            {showPassword ? 'visibility' : 'visibility_off'}
          </span>
        </button>
      </div>
      {error && <p className="text-xs text-error mt-1.5 font-medium">{error}</p>}
    </div>
  );
}
