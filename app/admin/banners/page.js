'use client';

import { useState, useEffect } from 'react';
import { isAuthenticated, authenticate, logout } from '../../../lib/auth';
import AdminSidebar from '../../../components/AdminSidebar';
import { PageHeader, TabNavigation, EmptyState } from '../../../components/admin/AdminComponents';
import BannerList from '../../../components/admin/BannerList';
import BannerForm from '../../../components/admin/BannerForm';
import { getBanners, deleteBanner } from '../../../lib/services/bannerService';
import '../../styles/admin.css';

export default function BannerManagementPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('list');
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingBanner, setEditingBanner] = useState(null);

  useEffect(() => {
    setAuthenticated(isAuthenticated());
  }, []);

  useEffect(() => {
    if (authenticated) {
      loadBanners();
    }
  }, [authenticated]);

  const loadBanners = async () => {
    setLoading(true);
    const fetchedBanners = await getBanners();
    setBanners(fetchedBanners);
    setLoading(false);
  };

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

  const handleAddNew = () => {
    setEditingBanner(null);
    setActiveTab('form');
  };

  const handleEdit = (banner) => {
    setEditingBanner(banner);
    setActiveTab('form');
  };

  const handleDelete = async (bannerId) => {
    if (!confirm('Are you sure you want to delete this banner?')) {
      return;
    }

    const result = await deleteBanner(bannerId);
    if (result.success) {
      await loadBanners();
      
      // Trigger revalidation of all pages that might use banners
      try {
        await fetch('/api/revalidate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ path: '/' })
        });
      } catch (err) {
        console.error('Revalidation error:', err);
      }
    } else {
      alert('Error deleting banner: ' + result.error);
    }
  };

  const handleFormSuccess = async () => {
    await loadBanners();
    setActiveTab('list');
    setEditingBanner(null);
    
    // Trigger revalidation of all pages that might use banners
    try {
      await fetch('/api/revalidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: '/' })
      });
    } catch (err) {
      console.error('Revalidation error:', err);
    }
  };

  const handleFormCancel = () => {
    setActiveTab('list');
    setEditingBanner(null);
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

  const tabs = [
    { id: 'list', label: 'All Banners', badge: banners.length },
    { id: 'form', label: editingBanner ? 'Edit Banner' : 'Add New Banner' }
  ];

  return (
    <div className="app-container">
      <AdminSidebar
        onSearch={() => {}}
        activePage="banners"
        onLogout={handleLogout}
      />
      <main className="main-content">
        <div className="admin-page">
          <PageHeader
            title="Global Banner Management"
            subtitle="Manage carousel banners across all pages"
            actions={
              activeTab === 'list' && (
                <button
                  onClick={handleAddNew}
                  style={{
                    padding: 'var(--space-12) var(--space-24)',
                    background: 'var(--keyColor)',
                    color: 'white',
                    border: 'none',
                    borderRadius: 'var(--radius-medium)',
                    fontSize: 'var(--fs-body)',
                    fontWeight: 'var(--fw-semibold)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-8)'
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>add</span>
                  Add New Banner
                </button>
              )
            }
          />

          <TabNavigation
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          <div
            role="tabpanel"
            id={`${activeTab}-panel`}
            aria-labelledby={`${activeTab}-tab`}
          >
            {activeTab === 'list' && (
              loading ? (
                <div style={{ textAlign: 'center', padding: 'var(--space-40)' }}>
                  <div className="spinner" />
                </div>
              ) : banners.length === 0 ? (
                <EmptyState
                  icon="view_carousel"
                  title="No banners yet"
                  description="Create your first banner to display on any page"
                  action={{
                    label: 'Add New Banner',
                    onClick: handleAddNew
                  }}
                />
              ) : (
                <BannerList
                  banners={banners}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              )
            )}

            {activeTab === 'form' && (
              <BannerForm
                banner={editingBanner}
                onSuccess={handleFormSuccess}
                onCancel={handleFormCancel}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
