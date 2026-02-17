'use client';

import { useState, useCallback } from 'react';

export default function FileUploadZone({ onUpload, multiple = false }) {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);

  const validateFile = (file) => {
    // Max size: 10MB
    if (file.size > 10 * 1024 * 1024) {
      return 'File too large. Maximum size is 10MB.';
    }

    // Valid extensions
    const validExtensions = ['.md', '.markdown'];
    const fileName = file.name.toLowerCase();
    const isValid = validExtensions.some(ext => fileName.endsWith(ext));
    
    if (!isValid) {
      return 'Invalid file type. Only .md and .markdown files are supported.';
    }

    return null;
  };

  const handleFiles = useCallback(async (files) => {
    if (!files || files.length === 0) return;
    
    setError(null);
    
    const fileArray = Array.from(files);
    
    // Validate all files first
    for (const file of fileArray) {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }
    }

    setUploading(true);

    try {
      await onUpload(fileArray);
    } catch (err) {
      setError(err.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  }, [onUpload]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleChange = useCallback((e) => {
    e.preventDefault();
    handleFiles(e.target.files);
  }, [handleFiles]);

  return (
    <div
      className={`upload-zone ${dragActive ? 'drag-active' : ''} ${uploading ? 'uploading' : ''} ${error ? 'error' : ''}`}
      onDrop={handleDrop}
      onDragOver={handleDrag}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
    >
      {uploading ? (
        <div className="upload-state">
          <div className="spinner"></div>
          <p>Uploading...</p>
        </div>
      ) : error ? (
        <div className="upload-state error-state">
          <span className="material-symbols-outlined">error</span>
          <p className="error-message">{error}</p>
          <button onClick={() => setError(null)} className="retry-button">
            Try Again
          </button>
        </div>
      ) : (
        <label className="upload-label">
          <input
            type="file"
            accept=".md,.markdown"
            multiple={multiple}
            onChange={handleChange}
            className="upload-input"
          />
          <span className="material-symbols-outlined upload-icon">upload_file</span>
          <p className="upload-text">
            Drop markdown files here or click to browse
          </p>
          <p className="upload-hint">
            Supports: .md, .markdown · Max size: 10MB per file
          </p>
        </label>
      )}
    </div>
  );
}
