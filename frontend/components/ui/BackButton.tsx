'use client';

import { useRouter } from 'next/router';

const BackButton = () => {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="fixed bottom-8 right-8 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-accent text-white shadow-lg hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background dark:focus:ring-offset-dark-background transition-all duration-300 ease-in-out transform hover:scale-110 active:scale-95 animate-fade-in-up"
      aria-label="Go back to previous page"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-7 w-7"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M10 19l-7-7m0 0l7-7m-7 7h18"
        />
      </svg>
    </button>
  );
};

export default BackButton;