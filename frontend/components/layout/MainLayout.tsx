'use client';

import React, { ReactNode } from 'react';
import Link from 'next/link';
import ThemeToggle from '@/components/ui/ThemeToggle';

const Logo = () => (
  <Link 
    href="/" 
    aria-label="NetāNomics Home"
    className="group inline-block"
  >
    <div className="flex items-center gap-3 transition-all duration-300 group-hover:scale-105">
      {/* Icon/Symbol */}
      <div className="relative">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 dark:from-blue-500 dark:to-blue-700 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
          <svg 
            className="w-6 h-6 text-white" 
            fill="currentColor" 
            viewBox="0 0 24 24"
          >
            <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/>
            <path d="M10.5 17l-3.5-3.5 1.41-1.41L10.5 14.18l5.09-5.09L17 10.5l-6.5 6.5z" fill="white" opacity="0.9"/>
          </svg>
        </div>
        {/* Subtle glow effect */}
        <div className="absolute inset-0 bg-blue-500/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
      </div>
      
      {/* Text Logo */}
      <div className="flex flex-col">
        <h1 className="text-2xl lg:text-3xl font-black tracking-tight text-gray-900 dark:text-white leading-none">
          Netā<span className="text-blue-600 dark:text-blue-400">Nomics</span>
        </h1>
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider uppercase opacity-75 group-hover:opacity-100 transition-opacity hidden sm:block">
          Transparency Portal
        </p>
      </div>
    </div>
  </Link>
);

const NavItem = ({ href, children }: { href: string; children: ReactNode }) => (
  <Link
    href={href}
    className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium text-sm transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
  >
    {children}
  </Link>
);

const MainLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            
            <div className="flex-shrink-0">
              <Logo />
            </div>
            
            <div className="flex items-center gap-4">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex-1">
        {children}
      </main>
      
      <footer className="mt-auto bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            <div className="md:col-span-2">
              <div className="mb-4">
                <Logo />
              </div>
              <p className="text-gray-600 dark:text-gray-400 max-w-md leading-relaxed">
                Promoting transparency and accountability in government spending through 
                accessible data visualization and citizen empowerment tools.
              </p>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center md:text-left">
                © 2024 NetāNomics. Built for transparency and accountability.
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center md:text-right">
                Data sourced from official government portals and RTI responses.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;