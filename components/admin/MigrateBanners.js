'use client';

import { useState } from 'react';
import { addBanner } from '../../lib/services/bannerService';

/**
 * One-time migration utility to upload hardcoded banners to Firestore
 * This component should be removed after successful migration
 */
export default function MigrateBanners({ onComplete }) {
  const [migrating, setMigrating] = useState(false);
  const [status, setStatus] = useState('');
  const [results, setResults] = useState([]);

  const hardcodedBanners = [
    {
      category: 'ESSENTIAL TOOLS',
      title: 'Apps for Living in Germany',
      subtitle: 'Navigate your new life with confidence. Discover curated tools for banking, transportation, healthcare, and daily living.',
      ctaText: 'Explore Apps',
      ctaLink: '/knowledge/',
      imageUrl: 'https://images.pexels.com/photos/1200450/pexels-photo-1200450.jpeg?auto=compress&cs=tinysrgb&w=1600',
      theme: 'green',
      position: 1
    },
    {
      category: 'FEATURED GUIDE',
      title: 'Banking & Finance',
      subtitle: 'Everything you need to know about opening a German bank account, managing finances, and understanding the tax system.',
      ctaText: 'Learn More',
      ctaLink: '/knowledge/',
      imageUrl: 'https://images.pexels.com/photos/5504137/pexels-photo-5504137.jpeg?auto=compress&cs=tinysrgb&w=1600',
      theme: 'dark',
      position: 2
    },
    {
      category: 'COMPLETE GUIDE',
      title: 'Visa & Bureaucracy',
      subtitle: 'Step-by-step guidance for residence permits, Anmeldung, and navigating German bureaucracy with confidence.',
      ctaText: 'Get Started',
      ctaLink: '/knowledge/',
      imageUrl: 'https://images.pexels.com/photos/1117132/pexels-photo-1117132.jpeg?auto=compress&cs=tinysrgb&w=1600',
      theme: 'purple',
      position: 3
    }
  ];

  const handleMigrate = async () => {
    setMigrating(true);
    setStatus('Starting migration...');
    setResults([]);

    const migrationResults = [];

    for (const banner of hardcodedBanners) {
      setStatus(`Migrating: ${banner.title}...`);
      
      try {
        const result = await addBanner(banner);
        
        if (result.success) {
          migrationResults.push({
            title: banner.title,
            status: 'success',
            id: result.id
          });
        } else {
          migrationResults.push({
            title: banner.title,
            status: 'error',
            error: result.error
          });
        }
      } catch (error) {
        migrationResults.push({
          title: banner.title,
          status: 'error',
          error: error.message
        });
      }
    }

    setResults(migrationResults);
    setStatus('Migration complete!');
    setMigrating(false);

    // Trigger revalidation
    try {
      await fetch('/api/revalidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: '/products' })
      });
    } catch (err) {
      console.error('Revalidation error:', err);
    }

    if (onComplete) {
      onComplete(migrationResults);
    }
  };

  return (
    <div style={{
      background: 'var(--cardBg)',
      border: 'var(--keylineBorder)',
      borderRadius: 'var(--radius-large)',
      padding: 'var(--space-24)',
      marginTop: 'var(--space-24)'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-12)',
        marginBottom: 'var(--space-16)'
      }}>
        <span className="material-symbols-outlined" style={{ fontSize: '32px', color: 'var(--systemOrange)' }}>
          warning
        </span>
        <div>
          <h3 style={{
            fontSize: 'var(--fs-title3)',
            fontWeight: 'var(--fw-bold)',
            color: 'var(--systemPrimary)',
            marginBottom: 'var(--space-4)'
          }}>
            One-Time Data Migration
          </h3>
          <p style={{
            fontSize: 'var(--fs-footnote)',
            color: 'var(--systemSecondary)'
          }}>
            This will migrate {hardcodedBanners.length} hardcoded banners to Firestore
          </p>
        </div>
      </div>

      {status && (
        <div style={{
          padding: 'var(--space-12)',
          background: 'var(--systemQuinary)',
          borderRadius: 'var(--radius-medium)',
          marginBottom: 'var(--space-16)',
          fontSize: 'var(--fs-footnote)',
          color: 'var(--systemPrimary)'
        }}>
          {status}
        </div>
      )}

      {results.length > 0 && (
        <div style={{ marginBottom: 'var(--space-16)' }}>
          {results.map((result, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-8)',
                padding: 'var(--space-8)',
                marginBottom: 'var(--space-4)',
                background: result.status === 'success' ? 'rgba(52, 199, 89, 0.1)' : 'rgba(255, 59, 48, 0.1)',
                borderRadius: 'var(--radius-small)'
              }}
            >
              <span className="material-symbols-outlined" style={{
                fontSize: '20px',
                color: result.status === 'success' ? 'var(--systemGreen)' : 'var(--systemRed)'
              }}>
                {result.status === 'success' ? 'check_circle' : 'error'}
              </span>
              <span style={{
                fontSize: 'var(--fs-footnote)',
                color: 'var(--systemPrimary)',
                flex: 1
              }}>
                {result.title}
              </span>
              {result.status === 'success' && result.id && (
                <span style={{
                  fontSize: 'var(--fs-caption)',
                  color: 'var(--systemTertiary)',
                  fontFamily: 'monospace'
                }}>
                  ID: {result.id}
                </span>
              )}
              {result.error && (
                <span style={{
                  fontSize: 'var(--fs-caption)',
                  color: 'var(--systemRed)'
                }}>
                  {result.error}
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      <button
        onClick={handleMigrate}
        disabled={migrating || results.length > 0}
        style={{
          width: '100%',
          padding: 'var(--space-12) var(--space-24)',
          background: migrating || results.length > 0 ? 'var(--systemQuaternary)' : 'var(--systemOrange)',
          color: migrating || results.length > 0 ? 'var(--systemTertiary)' : 'white',
          border: 'none',
          borderRadius: 'var(--radius-medium)',
          fontSize: 'var(--fs-body)',
          fontWeight: 'var(--fw-semibold)',
          cursor: migrating || results.length > 0 ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 'var(--space-8)',
          transition: 'opacity var(--transition-fast)'
        }}
      >
        {migrating ? (
          <>
            <div className="spinner" style={{ width: '16px', height: '16px' }} />
            Migrating...
          </>
        ) : results.length > 0 ? (
          <>
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>check</span>
            Migration Complete
          </>
        ) : (
          <>
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>upload</span>
            Start Migration
          </>
        )}
      </button>

      {results.length > 0 && (
        <p style={{
          marginTop: 'var(--space-12)',
          fontSize: 'var(--fs-caption)',
          color: 'var(--systemTertiary)',
          textAlign: 'center'
        }}>
          ✓ Migration successful. You can now remove this component from the admin page.
        </p>
      )}
    </div>
  );
}
