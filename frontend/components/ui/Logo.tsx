import Link from 'next/link';

const Logo = () => {
  return (
    <Link 
      href="/" 
      aria-label="Netā-Nomics Home"
      className="group inline-block"
    >
      <div className="flex items-center gap-3 transition-all duration-300 group-hover:scale-105">
        {/* Icon/Symbol */}
        <div className="relative">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 dark:from-blue-500 dark:to-blue-700 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
            <svg 
              className="w-7 h-7 text-white" 
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
          <h1 className="text-3xl lg:text-4xl font-black tracking-tight text-gray-900 dark:text-white leading-none">
            Netā<span className="text-blue-600 dark:text-blue-400">Nomics</span>
          </h1>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider uppercase mt-1 opacity-75 group-hover:opacity-100 transition-opacity">
            Transparency Portal
          </p>
        </div>
      </div>
    </Link>
  );
};

export default Logo;