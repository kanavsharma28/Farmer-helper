import React, { useState } from 'react';
import AuthNavbar from '../components/auth/AuthNavbar';
import VisualAnchor from '../components/auth/VisualAnchor';
import LoginForm from '../components/auth/LoginForm';

export default function LoginPage() {
  const [lang, setLang] = useState('en');

  return (
    <div className="bg-background font-body-md text-on-background min-h-screen w-screen overflow-x-hidden md:overflow-hidden flex flex-col selection:bg-primary-container selection:text-white">
      {/* Top App Bar Header */}
      <AuthNavbar lang={lang} setLang={setLang} />

      {/* Main Content Layout */}
      <main className="flex-1 flex flex-col md:flex-row mt-16 w-full h-[calc(100vh-4rem)]">
        {/* Left Side: Visual Anchor (Desktop Only) */}
        <VisualAnchor lang={lang} />

        {/* Right Side: Authentication Canvas */}
        <section className="w-full md:w-1/2 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-surface overflow-y-auto py-8 md:py-0">
          <LoginForm lang={lang} />
        </section>
      </main>
    </div>
  );
}
