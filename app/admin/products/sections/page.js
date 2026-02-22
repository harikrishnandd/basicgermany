'use client';

import { useState, useEffect } from 'react';
import { 
  getAllProductSections, 
  createProductSection, 
  updateSectionMetadata,
  deleteProductSection,
  addProductItem,
  removeProductItem
} from '@/lib/services/productsService';

export default function ProductSectionsAdmin() {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSection, setSelectedSection] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showItemModal, setShowItemModal] = useState(false);
  const [showMetadataModal, setShowMetadataModal] = useState(false);

  // Form states
  const [newSection, setNewSection] = useState({
    id: '',
    name: '',
    description: '',
    icon: 'inventory_2',
    sidebar: true,
    priority: 99
  });

  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    logo: '',
    link: '',
    price: 0,
    free: true,
    currency: 'euro_symbol'
  });

  const [metadata, setMetadata] = useState({
    name: '',
    description: '',
    icon: '',
    sidebar: true,
    priority: 99
  });

  useEffect(() => {
    loadSections();
  }, []);

  const loadSections = async () => {
    setLoading(true);
    const data = await getAllProductSections();
    setSections(data);
    setLoading(false);
  };

  const handleCreateSection = async (e) => {
    e.preventDefault();
    const success = await createProductSection(newSection.id, {
      name: newSection.name,
      description: newSection.description,
      icon: newSection.icon,
      sidebar: newSection.sidebar,
      priority: newSection.priority
    });

    if (success) {
      alert('Section created successfully!');
      setShowCreateModal(false);
      setNewSection({ id: '', name: '', description: '', icon: 'inventory_2', sidebar: true, priority: 99 });
      loadSections();
    } else {
      alert('Failed to create section');
    }
  };

  const handleUpdateMetadata = async (e) => {
    e.preventDefault();
    if (!selectedSection) return;

    const success = await updateSectionMetadata(selectedSection.id, metadata);
    
    if (success) {
      alert('Metadata updated successfully!');
      setShowMetadataModal(false);
      loadSections();
    } else {
      alert('Failed to update metadata');
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!selectedSection) return;

    const success = await addProductItem(selectedSection.id, newItem);
    
    if (success) {
      alert('Item added successfully!');
      setShowItemModal(false);
      setNewItem({
        name: '',
        description: '',
        logo: '',
        link: '',
        price: 0,
        free: true,
        currency: 'euro_symbol'
      });
      loadSections();
    } else {
      alert('Failed to add item');
    }
  };

  const handleDeleteSection = async (sectionId) => {
    if (!confirm('Are you sure you want to delete this section? This cannot be undone.')) {
      return;
    }

    const success = await deleteProductSection(sectionId);
    
    if (success) {
      alert('Section deleted successfully!');
      loadSections();
    } else {
      alert('Failed to delete section');
    }
  };

  const handleDeleteItem = async (sectionId, item) => {
    if (!confirm('Are you sure you want to delete this item?')) {
      return;
    }

    const success = await removeProductItem(sectionId, item);
    
    if (success) {
      alert('Item deleted successfully!');
      loadSections();
    } else {
      alert('Failed to delete item');
    }
  };

  const openMetadataModal = (section) => {
    setSelectedSection(section);
    setMetadata({
      name: section.name,
      description: section.description,
      icon: section.icon,
      sidebar: section.sidebar,
      priority: section.priority
    });
    setShowMetadataModal(true);
  };

  const openItemModal = (section) => {
    setSelectedSection(section);
    setShowItemModal(true);
  };

  if (loading) {
    return (
      <div style={{ padding: '48px', textAlign: 'center' }}>
        <p>Loading sections...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold' }}>Product Sections Manager</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          style={{
            padding: '12px 24px',
            background: '#007AFF',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '600'
          }}
        >
          + Create New Section
        </button>
      </div>

      {/* Sections List */}
      <div style={{ display: 'grid', gap: '24px' }}>
        {sections.map((section) => (
          <div
            key={section.id}
            style={{
              border: '1px solid #e0e0e0',
              borderRadius: '12px',
              padding: '24px',
              background: 'white'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '32px', color: '#007AFF' }}>
                  {section.icon}
                </span>
                <div>
                  <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '4px' }}>
                    {section.name}
                    {section.sidebar && (
                      <span style={{ 
                        marginLeft: '12px', 
                        fontSize: '12px', 
                        background: '#34C759', 
                        color: 'white', 
                        padding: '4px 8px', 
                        borderRadius: '4px' 
                      }}>
                        In Sidebar
                      </span>
                    )}
                  </h2>
                  <p style={{ color: '#666', fontSize: '14px' }}>{section.description}</p>
                  <p style={{ color: '#999', fontSize: '12px', marginTop: '4px' }}>ID: {section.id} • Priority: {section.priority}</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => openMetadataModal(section)}
                  style={{
                    padding: '8px 16px',
                    background: '#007AFF',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Edit Metadata
                </button>
                <button
                  onClick={() => openItemModal(section)}
                  style={{
                    padding: '8px 16px',
                    background: '#34C759',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  + Add Item
                </button>
                <button
                  onClick={() => handleDeleteSection(section.id)}
                  style={{
                    padding: '8px 16px',
                    background: '#FF3B30',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Delete Section
                </button>
              </div>
            </div>

            {/* Items List */}
            <div style={{ marginTop: '16px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
                Items ({section.items?.length || 0})
              </h3>
              {section.items && section.items.length > 0 ? (
                <div style={{ display: 'grid', gap: '8px' }}>
                  {section.items.map((item, index) => (
                    <div
                      key={index}
                      style={{
                        padding: '12px',
                        background: '#f5f5f5',
                        borderRadius: '8px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: '600', marginBottom: '4px' }}>{item.name}</div>
                        <div style={{ fontSize: '14px', color: '#666' }}>{item.description}</div>
                        <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
                          {item.free ? (
                            <span style={{ color: '#34C759', fontWeight: '600' }}>Free</span>
                          ) : (
                            <span>Price: {item.currency} {item.price}</span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteItem(section.id, item)}
                        style={{
                          padding: '6px 12px',
                          background: '#FF3B30',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: '#999', fontSize: '14px' }}>No items yet</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Create Section Modal */}
      {showCreateModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '32px',
            maxWidth: '500px',
            width: '90%'
          }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px' }}>Create New Section</h2>
            <form onSubmit={handleCreateSection}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Section ID *</label>
                <input
                  type="text"
                  value={newSection.id}
                  onChange={(e) => setNewSection({ ...newSection, id: e.target.value })}
                  required
                  placeholder="e.g., templates"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '16px'
                  }}
                />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Name *</label>
                <input
                  type="text"
                  value={newSection.name}
                  onChange={(e) => setNewSection({ ...newSection, name: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '16px'
                  }}
                />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Description</label>
                <textarea
                  value={newSection.description}
                  onChange={(e) => setNewSection({ ...newSection, description: e.target.value })}
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '16px'
                  }}
                />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Icon (Material Symbol)</label>
                <input
                  type="text"
                  value={newSection.icon}
                  onChange={(e) => setNewSection({ ...newSection, icon: e.target.value })}
                  placeholder="e.g., inventory_2"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '16px'
                  }}
                />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={newSection.sidebar}
                    onChange={(e) => setNewSection({ ...newSection, sidebar: e.target.checked })}
                    style={{ width: '20px', height: '20px' }}
                  />
                  <span style={{ fontWeight: '600' }}>Show in Sidebar</span>
                </label>
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Priority</label>
                <input
                  type="number"
                  value={newSection.priority}
                  onChange={(e) => setNewSection({ ...newSection, priority: parseInt(e.target.value) || 99 })}
                  min="0"
                  max="99"
                  placeholder="0 = highest priority, 99 = lowest"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '16px'
                  }}
                />
                <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                  Lower numbers appear first (0 = highest priority, 99 = lowest)
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  style={{
                    padding: '12px 24px',
                    background: '#f0f0f0',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '16px'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '12px 24px',
                    background: '#007AFF',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: '600'
                  }}
                >
                  Create Section
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Metadata Modal */}
      {showMetadataModal && selectedSection && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '32px',
            maxWidth: '500px',
            width: '90%'
          }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px' }}>Edit Metadata: {selectedSection.name}</h2>
            <form onSubmit={handleUpdateMetadata}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Name *</label>
                <input
                  type="text"
                  value={metadata.name}
                  onChange={(e) => setMetadata({ ...metadata, name: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '16px'
                  }}
                />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Description</label>
                <textarea
                  value={metadata.description}
                  onChange={(e) => setMetadata({ ...metadata, description: e.target.value })}
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '16px'
                  }}
                />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Icon (Material Symbol)</label>
                <input
                  type="text"
                  value={metadata.icon}
                  onChange={(e) => setMetadata({ ...metadata, icon: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '16px'
                  }}
                />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={metadata.sidebar}
                    onChange={(e) => setMetadata({ ...metadata, sidebar: e.target.checked })}
                    style={{ width: '20px', height: '20px' }}
                  />
                  <span style={{ fontWeight: '600' }}>Show in Sidebar</span>
                </label>
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Priority</label>
                <input
                  type="number"
                  value={metadata.priority}
                  onChange={(e) => setMetadata({ ...metadata, priority: parseInt(e.target.value) || 99 })}
                  min="0"
                  max="99"
                  placeholder="0 = highest priority, 99 = lowest"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '16px'
                  }}
                />
                <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                  Lower numbers appear first (0 = highest priority, 99 = lowest)
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setShowMetadataModal(false)}
                  style={{
                    padding: '12px 24px',
                    background: '#f0f0f0',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '16px'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '12px 24px',
                    background: '#007AFF',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: '600'
                  }}
                >
                  Update Metadata
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Item Modal */}
      {showItemModal && selectedSection && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          overflowY: 'auto',
          padding: '20px'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '32px',
            maxWidth: '500px',
            width: '90%',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px' }}>Add Item to: {selectedSection.name}</h2>
            <form onSubmit={handleAddItem}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Name *</label>
                <input
                  type="text"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '16px'
                  }}
                />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Description *</label>
                <textarea
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  required
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '16px'
                  }}
                />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Logo (Material Icon or URL) *</label>
                <input
                  type="text"
                  value={newItem.logo}
                  onChange={(e) => setNewItem({ ...newItem, logo: e.target.value })}
                  required
                  placeholder="e.g., flight_takeoff or https://..."
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '16px'
                  }}
                />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Link *</label>
                <input
                  type="url"
                  value={newItem.link}
                  onChange={(e) => setNewItem({ ...newItem, link: e.target.value })}
                  required
                  placeholder="https://..."
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '16px'
                  }}
                />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={newItem.free}
                    onChange={(e) => setNewItem({ ...newItem, free: e.target.checked })}
                    style={{ width: '20px', height: '20px' }}
                  />
                  <span style={{ fontWeight: '600' }}>Free Item</span>
                </label>
              </div>
              {!newItem.free && (
                <>
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Currency Icon</label>
                    <input
                      type="text"
                      value={newItem.currency}
                      onChange={(e) => setNewItem({ ...newItem, currency: e.target.value })}
                      placeholder="e.g., euro_symbol"
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #e0e0e0',
                        borderRadius: '8px',
                        fontSize: '16px'
                      }}
                    />
                  </div>
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Price</label>
                    <input
                      type="number"
                      value={newItem.price}
                      onChange={(e) => setNewItem({ ...newItem, price: parseFloat(e.target.value) })}
                      min="0"
                      step="0.01"
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #e0e0e0',
                        borderRadius: '8px',
                        fontSize: '16px'
                      }}
                    />
                  </div>
                </>
              )}
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
                <button
                  type="button"
                  onClick={() => setShowItemModal(false)}
                  style={{
                    padding: '12px 24px',
                    background: '#f0f0f0',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '16px'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '12px 24px',
                    background: '#34C759',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: '600'
                  }}
                >
                  Add Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
