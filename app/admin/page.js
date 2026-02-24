'use client';

import { useState, useEffect } from 'react';
import { isAuthenticated, authenticate, logout } from '../../lib/auth';
import AdminSidebar from '../../components/AdminSidebar';
import { PageHeader } from '../../components/admin/AdminComponents';
import '../styles/admin.css';

export default function AdminDashboard() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setAuthenticated(isAuthenticated());
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (authenticate(password)) {
      setAuthenticated(true);
      setError('');
    } else {
      setError('Incorrect password');
    }
  };

  const handleLogout = () => {
    logout();
    setAuthenticated(false);
    setPassword('');
  };

  if (!authenticated) {
    return (
      <div className="admin-page" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{
          maxWidth: '400px',
          width: '100%',
          padding: 'var(--space-32)',
          background: 'var(--cardBg)',
          borderRadius: 'var(--radius-large)',
          border: 'var(--keylineBorder)'
        }}>
          <h1 style={{
            fontSize: 'var(--fs-largeTitle)',
            fontWeight: 'var(--fw-bold)',
            marginBottom: 'var(--space-8)',
            textAlign: 'center',
            color: 'var(--systemPrimary)'
          }}>
            Admin Login
          </h1>
          <p style={{
            fontSize: 'var(--fs-body)',
            color: 'var(--systemSecondary)',
            textAlign: 'center',
            marginBottom: 'var(--space-24)'
          }}>
            Enter your password to access the admin panel
          </p>
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: 'var(--space-16)' }}>
              <label style={{
                display: 'block',
                fontSize: 'var(--fs-footnote)',
                fontWeight: 'var(--fw-medium)',
                color: 'var(--systemPrimary)',
                marginBottom: 'var(--space-8)'
              }}>
                Password
              </label>
              <input
                type="password"
                style={{
                  width: '100%',
                  padding: 'var(--space-12) var(--space-16)',
                  background: 'var(--systemSenary)',
                  border: 'var(--keylineBorder)',
                  borderRadius: 'var(--radius-medium)',
                  fontSize: 'var(--fs-body)',
                  color: 'var(--systemPrimary)',
                  outline: 'none'
                }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                autoFocus
              />
              {error && (
                <p style={{
                  color: 'var(--systemRed)',
                  fontSize: 'var(--fs-footnote)',
                  marginTop: 'var(--space-8)'
                }}>
                  {error}
                </p>
              )}
            </div>
            <button
              type="submit"
              style={{
                width: '100%',
                padding: 'var(--space-12) var(--space-24)',
                background: 'var(--keyColor)',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--radius-medium)',
                fontSize: 'var(--fs-body)',
                fontWeight: 'var(--fw-semibold)',
                cursor: 'pointer',
                transition: 'opacity var(--transition-fast)'
              }}
              onMouseOver={(e) => e.target.style.opacity = '0.8'}
              onMouseOut={(e) => e.target.style.opacity = '1'}
            >
              Log In
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <AdminSidebar
        onSearch={() => {}}
        activePage=""
        onLogout={handleLogout}
      />
      <main className="main-content">
        <div className="admin-page">
          <PageHeader
            title="Admin Dashboard"
            subtitle="Welcome to the Basic Germany admin panel"
          />

          <div style={{ marginTop: 'var(--space-32)' }}>
            <div style={{
              display: 'grid',
              gap: 'var(--space-16)',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))'
            }}>
              {/* Knowledge Hub Card */}
              <a
                href="/admin/knowledge"
                style={{
                  display: 'block',
                  background: 'var(--cardBg)',
                  border: 'var(--keylineBorder)',
                  borderRadius: 'var(--radius-large)',
                  padding: 'var(--space-24)',
                  textDecoration: 'none',
                  transition: 'transform var(--transition-fast), box-shadow var(--transition-fast)'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.1)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <span className="material-symbols-outlined" style={{
                  fontSize: '48px',
                  color: 'var(--keyColor)',
                  marginBottom: 'var(--space-16)',
                  display: 'block'
                }}>
                  book_5
                </span>
                <h3 style={{
                  fontSize: 'var(--fs-title3)',
                  fontWeight: 'var(--fw-bold)',
                  color: 'var(--systemPrimary)',
                  marginBottom: 'var(--space-8)'
                }}>
                  Knowledge Hub
                </h3>
                <p style={{
                  fontSize: 'var(--fs-footnote)',
                  color: 'var(--systemSecondary)',
                  lineHeight: '1.5'
                }}>
                  Manage articles, upload content, and review submissions
                </p>
              </a>

              {/* Global Banner Management */}
              <a
                href="/admin/banners"
                style={{
                  display: 'block',
                  background: 'var(--cardBg)',
                  border: 'var(--keylineBorder)',
                  borderRadius: 'var(--radius-large)',
                  padding: 'var(--space-24)',
                  textDecoration: 'none',
                  transition: 'transform var(--transition-fast), box-shadow var(--transition-fast)'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.1)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <span className="material-symbols-outlined" style={{
                  fontSize: '48px',
                  color: 'var(--keyColor)',
                  marginBottom: 'var(--space-16)',
                  display: 'block'
                }}>
                  view_carousel
                </span>
                <h3 style={{
                  fontSize: 'var(--fs-title3)',
                  fontWeight: 'var(--fw-bold)',
                  color: 'var(--systemPrimary)',
                  marginBottom: 'var(--space-8)'
                }}>
                  Global Banners
                </h3>
                <p style={{
                  fontSize: 'var(--fs-footnote)',
                  color: 'var(--systemSecondary)',
                  lineHeight: '1.5'
                }}>
                  Manage carousel banners across all pages (Apps, Knowledge, Products)
                </p>
              </a>

              {/* Products - Items Card */}
              <a
                href="/admin/products/items"
                style={{
                  display: 'block',
                  background: 'var(--cardBg)',
                  border: 'var(--keylineBorder)',
                  borderRadius: 'var(--radius-large)',
                  padding: 'var(--space-24)',
                  textDecoration: 'none',
                  transition: 'transform var(--transition-fast), box-shadow var(--transition-fast)'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.1)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <span className="material-symbols-outlined" style={{
                  fontSize: '48px',
                  color: 'var(--systemTertiary)',
                  marginBottom: 'var(--space-16)',
                  display: 'block'
                }}>
                  inventory_2
                </span>
                <h3 style={{
                  fontSize: 'var(--fs-title3)',
                  fontWeight: 'var(--fw-bold)',
                  color: 'var(--systemPrimary)',
                  marginBottom: 'var(--space-8)'
                }}>
                  Product Items
                </h3>
                <p style={{
                  fontSize: 'var(--fs-footnote)',
                  color: 'var(--systemSecondary)',
                  lineHeight: '1.5'
                }}>
                  Coming soon - Manage individual product items
                </p>
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
