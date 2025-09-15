import '@/styles/globals.css'; 
import type { AppProps } from 'next/app';
import { ThemeProvider } from '@/context/ThemeContext';
import MainLayout from '@/components/layout/MainLayout';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { PageSpinner } from '@/components/ui/PageSpinner';
import BackButton from '@/components/ui/BackButton';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const showBackButton = router.pathname.startsWith('/dashboard/') || router.pathname.startsWith('/action/');

  useEffect(() => {
    const handleStart = (url: string) => url !== router.asPath && setLoading(true);
    const handleComplete = () => setLoading(false);

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router]);

  return (
    <ThemeProvider>
      {loading && <PageSpinner />}
      <MainLayout>
        <Component {...pageProps} />
      </MainLayout>
      {showBackButton && <BackButton />}
    </ThemeProvider>
  );
}