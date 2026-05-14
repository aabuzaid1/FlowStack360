'use client';

import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // Check initial theme
    const theme = localStorage.getItem('theme') || 'dark';
    setIsDark(theme === 'dark');
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="relative p-2.5 rounded-xl bg-gray-200 dark:bg-white/[0.05] border border-gray-300 dark:border-white/[0.05] text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-white hover:bg-gray-300 dark:hover:bg-white/[0.1] transition-all duration-300 shadow-inner group mx-4"
      aria-label="Toggle Theme"
    >
      <div className="relative w-5 h-5 overflow-hidden flex items-center justify-center">
        {/* Sun Icon */}
        <svg
          className={`absolute inset-0 w-full h-full transform transition-all duration-500 ${
            isDark ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-8 opacity-0 scale-50'
          }`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
        {/* Moon Icon */}
        <svg
          className={`absolute inset-0 w-full h-full transform transition-all duration-500 ${
            !isDark ? 'translate-y-0 opacity-100 scale-100' : '-translate-y-8 opacity-0 scale-50'
          }`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      </div>
    </button>
  );
}
