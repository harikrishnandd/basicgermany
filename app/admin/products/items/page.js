'use client';

import { useState, useEffect } from 'react';
import { isAuthenticated, authenticate, logout } from '../../../../lib/auth';
import AdminSidebar from '../../../../components/AdminSidebar';
import { PageHeader, EmptyState } from '../../../../components/admin/AdminComponents';
import '../../../admin.css';

export default function ItemsManagementPage() {
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
        activePage="items"
        onLogout={handleLogout}
      />
      <main className="main-content">
        <div className="admin-page">
          <PageHeader
            title="Product Items Management"
            subtitle="Manage individual product items"
          />

          <EmptyState
            icon="inventory_2"
            title="Coming Soon"
            description="Product items management will be available in a future update. For now, you can manage carousel banners from the Banner section."
          />
        </div>
      </main>
    </div>
  );
}
