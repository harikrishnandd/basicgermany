'use client';

import { useState, useEffect } from 'react';
import { isAuthenticated, authenticate, logout } from '../../../../lib/auth';
import AdminSidebar from '../../../../components/AdminSidebar';
import { PageHeader, EmptyState } from '../../../../components/admin/AdminComponents';
import { 
  getAllProductSections, 
  addProductItem, 
  removeProductItem,
  updateSectionMetadata 
} from '@/lib/services/productsService';
import '../../../styles/admin.css';

export default function ItemsManagementPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Data states
  const [sections, setSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [showItemModal, setShowItemModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Form states
  const [itemForm, setItemForm] = useState({
    name: '',
    description: '',
    logo: '',
    link: '',
    price: 0,
    free: true,
    currency: 'euro_symbol',
    targetSection: ''
  });

  useEffect(() => {
    setAuthenticated(isAuthenticated());
  }, []);

  useEffect(() => {
    if (authenticated) {
      loadSections();
    }
  }, [authenticated]);

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

  const loadSections = async () => {
    setLoading(true);
    try {
      const data = await getAllProductSections();
      setSections(data);
      if (data.length > 0 && !selectedSection) {
        setSelectedSection(data[0]);
      }
    } catch (error) {
      console.error('Error loading sections:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSectionChange = (sectionId) => {
    const section = sections.find(s => s.id === sectionId);
    setSelectedSection(section);
  };

  const resetItemForm = () => {
    setItemForm({
      name: '',
      description: '',
      logo: '',
      link: '',
      price: 0,
      free: true,
      currency: 'euro_symbol',
      targetSection: ''
    });
    setEditingItem(null);
  };

  const openItemModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setItemForm({
        name: item.name || '',
        description: item.description || '',
        logo: item.logo || '',
        link: item.link || '',
        price: item.price || 0,
        free: item.free !== false,
        currency: item.currency || 'euro_symbol',
        targetSection: selectedSection?.id || ''
      });
    } else {
      resetItemForm();
      // Set default target section to currently selected section
      setItemForm(prev => ({
        ...prev,
        targetSection: selectedSection?.id || ''
      }));
    }
    setShowItemModal(true);
  };

  const closeItemModal = () => {
    setShowItemModal(false);
    resetItemForm();
  };

  const handleItemSubmit = async (e) => {
    e.preventDefault();
    if (!itemForm.targetSection) return;

    const itemData = {
      name: itemForm.name,
      description: itemForm.description,
      logo: itemForm.logo,
      link: itemForm.link,
      ...(itemForm.free ? {} : { price: itemForm.price, currency: itemForm.currency }),
      free: itemForm.free
    };

    try {
      if (editingItem) {
        // Remove old item and add new one (edit)
        await removeProductItem(selectedSection.id, editingItem);
        await addProductItem(itemForm.targetSection, itemData);
        alert('Item updated successfully!');
      } else {
        // Add new item
        await addProductItem(itemForm.targetSection, itemData);
        alert('Item added successfully!');
      }

      closeItemModal();
      loadSections(); // Refresh data
      
      // If we added to a different section, switch to that section
      if (itemForm.targetSection !== selectedSection?.id) {
        const newSection = sections.find(s => s.id === itemForm.targetSection);
        if (newSection) {
          setSelectedSection(newSection);
        }
      }
    } catch (error) {
      console.error('Error saving item:', error);
      alert('Failed to save item');
    }
  };

  const handleDeleteItem = async (item) => {
    if (!selectedSection) return;
    
    if (confirm(`Are you sure you want to delete "${item.name}"?`)) {
      try {
        await removeProductItem(selectedSection.id, item);
        alert('Item deleted successfully!');
        loadSections();
      } catch (error) {
        console.error('Error deleting item:', error);
        alert('Failed to delete item');
      }
    }
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
            subtitle="Manage individual product items within sections"
            actions={
              selectedSection && (
                <button
                  onClick={() => openItemModal()}
                  style={{
                    padding: 'var(--space-12) var(--space-24)',
                    background: 'var(--keyColor)',
                    color: 'white',
                    border: 'none',
                    borderRadius: 'var(--radius-medium)',
                    fontSize: 'var(--fs-body)',
                    fontWeight: 'var(--fw-semibold)',
                    cursor: 'pointer',
                    transition: 'opacity var(--transition-fast)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-8)'
                  }}
                  onMouseOver={(e) => e.target.style.opacity = '0.8'}
                  onMouseOut={(e) => e.target.style.opacity = '1'}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                    add
                  </span>
                  Add Item
                </button>
              )
            }
          />

          {/* Section Selector */}
          <div style={{ marginBottom: 'var(--space-32)' }}>
            <label style={{
              display: 'block',
              fontSize: 'var(--fs-footnote)',
              fontWeight: 'var(--fw-medium)',
              color: 'var(--systemPrimary)',
              marginBottom: 'var(--space-8)'
            }}>
              Select Section
            </label>
            <select
              value={selectedSection?.id || ''}
              onChange={(e) => handleSectionChange(e.target.value)}
              style={{
                width: '100%',
                maxWidth: '300px',
                padding: 'var(--space-12) var(--space-16)',
                background: 'var(--systemSenary)',
                border: 'var(--keylineBorder)',
                borderRadius: 'var(--radius-medium)',
                fontSize: 'var(--fs-body)',
                color: 'var(--systemPrimary)',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              {sections.map((section) => (
                <option key={section.id} value={section.id}>
                  {section.name} ({section.items?.length || 0} items)
                </option>
              ))}
            </select>
          </div>

          {/* Items Table */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: 'var(--space-48)' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '48px', color: 'var(--systemTertiary)' }}>
                hourglass_empty
              </span>
              <p style={{ color: 'var(--systemSecondary)', marginTop: 'var(--space-16)' }}>
                Loading items...
              </p>
            </div>
          ) : !selectedSection ? (
            <EmptyState
              icon="inventory_2"
              title="No Section Selected"
              description="Please select a section to manage its items."
            />
          ) : selectedSection.items?.length === 0 ? (
            <EmptyState
              icon="inventory_2"
              title="No Items Found"
              description="This section doesn't have any items yet. Click 'Add Item' to create the first one."
              action={{
                label: 'Add Item',
                onClick: () => openItemModal()
              }}
            />
          ) : (
            <div style={{
              background: 'var(--cardBg)',
              borderRadius: 'var(--radius-large)',
              border: 'var(--keylineBorder)',
              overflow: 'hidden'
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ background: 'var(--systemSenary)' }}>
                  <tr>
                    <th style={{ 
                      padding: 'var(--space-16)', 
                      textAlign: 'left',
                      fontSize: 'var(--fs-footnote)',
                      fontWeight: 'var(--fw-semibold)',
                      color: 'var(--systemSecondary)',
                      borderBottom: 'var(--keylineBorder)'
                    }}>
                      Item
                    </th>
                    <th style={{ 
                      padding: 'var(--space-16)', 
                      textAlign: 'left',
                      fontSize: 'var(--fs-footnote)',
                      fontWeight: 'var(--fw-semibold)',
                      color: 'var(--systemSecondary)',
                      borderBottom: 'var(--keylineBorder)'
                    }}>
                      Description
                    </th>
                    <th style={{ 
                      padding: 'var(--space-16)', 
                      textAlign: 'left',
                      fontSize: 'var(--fs-footnote)',
                      fontWeight: 'var(--fw-semibold)',
                      color: 'var(--systemSecondary)',
                      borderBottom: 'var(--keylineBorder)'
                    }}>
                      Price
                    </th>
                    <th style={{ 
                      padding: 'var(--space-16)', 
                      textAlign: 'right',
                      fontSize: 'var(--fs-footnote)',
                      fontWeight: 'var(--fw-semibold)',
                      color: 'var(--systemSecondary)',
                      borderBottom: 'var(--keylineBorder)'
                    }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {selectedSection.items.map((item, index) => (
                    <tr key={index} style={{ borderBottom: 'var(--keylineBorder)' }}>
                      <td style={{ padding: 'var(--space-16)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-12)' }}>
                          {item.logo ? (
                            <img 
                              src={item.logo} 
                              alt={item.name}
                              style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: 'var(--radius-medium)',
                                objectFit: 'cover',
                                background: 'var(--systemSenary)'
                              }}
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          <div 
                            style={{
                              width: '40px',
                              height: '40px',
                              borderRadius: 'var(--radius-medium)',
                              background: 'var(--systemSenary)',
                              display: item.logo ? 'none' : 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'var(--systemTertiary)',
                              fontSize: '20px'
                            }}
                          >
                            <span className="material-symbols-outlined">
                              {item.free ? 'card_giftcard' : 'shopping_bag'}
                            </span>
                          </div>
                          <div>
                            <div style={{ 
                              fontSize: 'var(--fs-body)',
                              fontWeight: 'var(--fw-medium)',
                              color: 'var(--systemPrimary)',
                              marginBottom: 'var(--space-2)'
                            }}>
                              {item.name}
                            </div>
                            {item.link && (
                              <a 
                                href={item.link} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                style={{
                                  fontSize: 'var(--fs-footnote)',
                                  color: 'var(--keyColor)',
                                  textDecoration: 'none'
                                }}
                                onMouseOver={(e) => e.target.style.textDecoration = 'underline'}
                                onMouseOut={(e) => e.target.style.textDecoration = 'none'}
                              >
                                View Link
                              </a>
                            )}
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: 'var(--space-16)' }}>
                        <div style={{ 
                          fontSize: 'var(--fs-body)',
                          color: 'var(--systemSecondary)',
                          maxWidth: '300px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {item.description}
                        </div>
                      </td>
                      <td style={{ padding: 'var(--space-16)' }}>
                        {item.free ? (
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 'var(--space-4)',
                            padding: 'var(--space-4) var(--space-8)',
                            background: 'var(--systemGreen)',
                            color: 'white',
                            borderRadius: 'var(--radius-small)',
                            fontSize: 'var(--fs-footnote)',
                            fontWeight: 'var(--fw-medium)'
                          }}>
                            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
                              check_circle
                            </span>
                            Free
                          </span>
                        ) : (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                            <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'var(--systemSecondary)' }}>
                              {item.currency || 'euro_symbol'}
                            </span>
                            <span style={{ 
                              fontSize: 'var(--fs-body)',
                              fontWeight: 'var(--fw-medium)',
                              color: 'var(--systemPrimary)'
                            }}>
                              {item.price}
                            </span>
                          </div>
                        )}
                      </td>
                      <td style={{ padding: 'var(--space-16)' }}>
                        <div style={{ display: 'flex', gap: 'var(--space-8)', justifyContent: 'flex-end' }}>
                          <button
                            onClick={() => openItemModal(item)}
                            style={{
                              padding: 'var(--space-8) var(--space-12)',
                              background: 'var(--systemQuinary)',
                              border: 'none',
                              borderRadius: 'var(--radius-small)',
                              fontSize: 'var(--fs-footnote)',
                              color: 'var(--systemPrimary)',
                              cursor: 'pointer',
                              transition: 'background var(--transition-fast)',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 'var(--space-4)'
                            }}
                            onMouseOver={(e) => e.target.style.background = 'var(--systemQuaternary)'}
                            onMouseOut={(e) => e.target.style.background = 'var(--systemQuinary)'}
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                              edit
                            </span>
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item)}
                            style={{
                              padding: 'var(--space-8) var(--space-12)',
                              background: 'var(--systemRed)',
                              border: 'none',
                              borderRadius: 'var(--radius-small)',
                              fontSize: 'var(--fs-footnote)',
                              color: 'white',
                              cursor: 'pointer',
                              transition: 'opacity var(--transition-fast)',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 'var(--space-4)'
                            }}
                            onMouseOver={(e) => e.target.style.opacity = '0.8'}
                            onMouseOut={(e) => e.target.style.opacity = '1'}
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                              delete
                            </span>
                            Remove
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Item Modal */}
          {showItemModal && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000
            }}>
              <div style={{
                background: 'var(--cardBg)',
                borderRadius: 'var(--radius-large)',
                border: 'var(--keylineBorder)',
                width: '100%',
                maxWidth: '600px',
                maxHeight: '90vh',
                overflow: 'auto',
                margin: 'var(--space-24)'
              }}>
                <div style={{
                  padding: 'var(--space-24)',
                  borderBottom: 'var(--keylineBorder)'
                }}>
                  <h2 style={{
                    fontSize: 'var(--fs-title1)',
                    fontWeight: 'var(--fw-bold)',
                    color: 'var(--systemPrimary)',
                    margin: 0
                  }}>
                    {editingItem ? 'Edit Item' : 'Add New Item'}
                  </h2>
                  <p style={{
                    fontSize: 'var(--fs-body)',
                    color: 'var(--systemSecondary)',
                    margin: 'var(--space-8) 0 0 0'
                  }}>
                    {editingItem ? `Editing in ${selectedSection?.name} section` : 'Select target section below'}
                  </p>
                </div>

                <form onSubmit={handleItemSubmit} style={{ padding: 'var(--space-24)' }}>
                  {!editingItem && (
                    <div style={{ marginBottom: 'var(--space-20)' }}>
                      <label style={{
                        display: 'block',
                        fontSize: 'var(--fs-footnote)',
                        fontWeight: 'var(--fw-medium)',
                        color: 'var(--systemPrimary)',
                        marginBottom: 'var(--space-8)'
                      }}>
                        Target Section *
                      </label>
                      <select
                        value={itemForm.targetSection}
                        onChange={(e) => setItemForm({ ...itemForm, targetSection: e.target.value })}
                        required
                        style={{
                          width: '100%',
                          padding: 'var(--space-12) var(--space-16)',
                          background: 'var(--systemSenary)',
                          border: 'var(--keylineBorder)',
                          borderRadius: 'var(--radius-medium)',
                          fontSize: 'var(--fs-body)',
                          color: 'var(--systemPrimary)',
                          outline: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        <option value="">Select a section...</option>
                        {sections.map((section) => (
                          <option key={section.id} value={section.id}>
                            {section.name} ({section.items?.length || 0} items)
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div style={{ marginBottom: 'var(--space-20)' }}>
                    <label style={{
                      display: 'block',
                      fontSize: 'var(--fs-footnote)',
                      fontWeight: 'var(--fw-medium)',
                      color: 'var(--systemPrimary)',
                      marginBottom: 'var(--space-8)'
                    }}>
                      Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={itemForm.name}
                      onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
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
                      placeholder="Enter item name"
                    />
                  </div>

                  <div style={{ marginBottom: 'var(--space-20)' }}>
                    <label style={{
                      display: 'block',
                      fontSize: 'var(--fs-footnote)',
                      fontWeight: 'var(--fw-medium)',
                      color: 'var(--systemPrimary)',
                      marginBottom: 'var(--space-8)'
                    }}>
                      Description
                    </label>
                    <textarea
                      value={itemForm.description}
                      onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
                      style={{
                        width: '100%',
                        padding: 'var(--space-12) var(--space-16)',
                        background: 'var(--systemSenary)',
                        border: 'var(--keylineBorder)',
                        borderRadius: 'var(--radius-medium)',
                        fontSize: 'var(--fs-body)',
                        color: 'var(--systemPrimary)',
                        outline: 'none',
                        minHeight: '80px',
                        resize: 'vertical'
                      }}
                      placeholder="Enter item description"
                    />
                  </div>

                  <div style={{ marginBottom: 'var(--space-20)' }}>
                    <label style={{
                      display: 'block',
                      fontSize: 'var(--fs-footnote)',
                      fontWeight: 'var(--fw-medium)',
                      color: 'var(--systemPrimary)',
                      marginBottom: 'var(--space-8)'
                    }}>
                      Logo URL
                    </label>
                    <input
                      type="url"
                      value={itemForm.logo}
                      onChange={(e) => setItemForm({ ...itemForm, logo: e.target.value })}
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
                      placeholder="https://example.com/image.png"
                    />
                  </div>

                  <div style={{ marginBottom: 'var(--space-20)' }}>
                    <label style={{
                      display: 'block',
                      fontSize: 'var(--fs-footnote)',
                      fontWeight: 'var(--fw-medium)',
                      color: 'var(--systemPrimary)',
                      marginBottom: 'var(--space-8)'
                    }}>
                      Link URL
                    </label>
                    <input
                      type="url"
                      value={itemForm.link}
                      onChange={(e) => setItemForm({ ...itemForm, link: e.target.value })}
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
                      placeholder="https://example.com"
                    />
                  </div>

                  <div style={{ marginBottom: 'var(--space-20)' }}>
                    <label style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--space-8)',
                      fontSize: 'var(--fs-footnote)',
                      fontWeight: 'var(--fw-medium)',
                      color: 'var(--systemPrimary)',
                      marginBottom: 'var(--space-8)',
                      cursor: 'pointer'
                    }}>
                      <input
                        type="checkbox"
                        checked={itemForm.free}
                        onChange={(e) => setItemForm({ ...itemForm, free: e.target.checked })}
                        style={{
                          width: '16px',
                          height: '16px',
                          accentColor: 'var(--keyColor)'
                        }}
                      />
                      Free Item
                    </label>
                    <p style={{
                      fontSize: 'var(--fs-footnote)',
                      color: 'var(--systemSecondary)',
                      margin: 'var(--space-4) 0 0 0'
                    }}>
                      {itemForm.free ? 'This item is free to download' : 'This item has a price'}
                    </p>
                  </div>

                  {!itemForm.free && (
                    <>
                      <div style={{ marginBottom: 'var(--space-20)' }}>
                        <label style={{
                          display: 'block',
                          fontSize: 'var(--fs-footnote)',
                          fontWeight: 'var(--fw-medium)',
                          color: 'var(--systemPrimary)',
                          marginBottom: 'var(--space-8)'
                        }}>
                          Price
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={itemForm.price}
                          onChange={(e) => setItemForm({ ...itemForm, price: parseFloat(e.target.value) || 0 })}
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
                          placeholder="0.00"
                        />
                      </div>

                      <div style={{ marginBottom: 'var(--space-20)' }}>
                        <label style={{
                          display: 'block',
                          fontSize: 'var(--fs-footnote)',
                          fontWeight: 'var(--fw-medium)',
                          color: 'var(--systemPrimary)',
                          marginBottom: 'var(--space-8)'
                        }}>
                          Currency Icon
                        </label>
                        <select
                          value={itemForm.currency}
                          onChange={(e) => setItemForm({ ...itemForm, currency: e.target.value })}
                          style={{
                            width: '100%',
                            padding: 'var(--space-12) var(--space-16)',
                            background: 'var(--systemSenary)',
                            border: 'var(--keylineBorder)',
                            borderRadius: 'var(--radius-medium)',
                            fontSize: 'var(--fs-body)',
                            color: 'var(--systemPrimary)',
                            outline: 'none',
                            cursor: 'pointer'
                          }}
                        >
                          <option value="euro_symbol">€ Euro</option>
                          <option value="attach_money">$ Dollar</option>
                          <option value="currency_pound">£ Pound</option>
                          <option value="currency_yen">¥ Yen</option>
                          <option value="currency_rupee">₹ Rupee</option>
                        </select>
                      </div>
                    </>
                  )}

                  <div style={{ 
                    display: 'flex', 
                    gap: 'var(--space-12)', 
                    justifyContent: 'flex-end',
                    marginTop: 'var(--space-32)'
                  }}>
                    <button
                      type="button"
                      onClick={closeItemModal}
                      style={{
                        padding: 'var(--space-12) var(--space-24)',
                        background: 'var(--systemQuinary)',
                        border: 'none',
                        borderRadius: 'var(--radius-medium)',
                        fontSize: 'var(--fs-body)',
                        fontWeight: 'var(--fw-medium)',
                        color: 'var(--systemPrimary)',
                        cursor: 'pointer',
                        transition: 'background var(--transition-fast)'
                      }}
                      onMouseOver={(e) => e.target.style.background = 'var(--systemQuaternary)'}
                      onMouseOut={(e) => e.target.style.background = 'var(--systemQuinary)'}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      style={{
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
                      {editingItem ? 'Update Item' : 'Add Item'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
