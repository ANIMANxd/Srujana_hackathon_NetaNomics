'use client';

import React from 'react';
import { useTheme } from '@/context/ThemeContext'; // Assuming you have useTheme for color

export const PageSpinner: React.FC = () => {
  const { theme } = useTheme();
  const spinnerColor = theme === 'dark' ? '#3b82f6' : '#2563eb'; // Tailwind blue-500 or blue-600

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background/70 dark:bg-dark-background/70 backdrop-blur-sm z-[9999]">
      <div
        className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4"
        style={{ borderColor: spinnerColor, borderTopColor: 'transparent' }}
      ></div>
    </div>
  );
};