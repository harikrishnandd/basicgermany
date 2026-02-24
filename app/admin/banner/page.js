'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function BannerRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect from /admin/banner to /admin/banners
    router.replace('/admin/banners');
  }, [router]);

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh',
      flexDirection: 'column',
      gap: '20px'
    }}>
      <div className="spinner" />
      <p style={{ color: '#666' }}>Redirecting to Banner Management...</p>
    </div>
  );
}
