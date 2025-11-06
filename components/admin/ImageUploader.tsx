'use client';

import { useState, useRef } from 'react';

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  description?: string;
}

export default function ImageUploader({ value, onChange, label, description }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [galleryImages, setGalleryImages] = useState<any[]>([]);
  const [loadingGallery, setLoadingGallery] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileUpload(file: File) {
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        onChange(data.url);
      } else {
        alert(data.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image');
    } finally {
      setUploading(false);
    }
  }

  function handleDrag(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  }

  function handleFileInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  }

  async function loadGallery() {
    setLoadingGallery(true);
    try {
      const response = await fetch('/api/upload');
      const data = await response.json();
      setGalleryImages(data.files || []);
    } catch (error) {
      console.error('Error loading gallery:', error);
    } finally {
      setLoadingGallery(false);
    }
  }

  function openGallery() {
    setShowGallery(true);
    loadGallery();
  }

  return (
    <div style={{ marginBottom: '20px' }}>
      {label && (
        <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#1a1a1a' }}>
          {label}
        </label>
      )}
      {description && (
        <p style={{ fontSize: '12px', color: '#666', marginBottom: '10px', marginTop: '-4px' }}>
          {description}
        </p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          style={{
            border: dragActive ? '3px dashed #1a1a1a' : '2px dashed #ccc',
            borderRadius: '8px',
            padding: '30px',
            textAlign: 'center',
            cursor: uploading ? 'not-allowed' : 'pointer',
            backgroundColor: dragActive ? '#f0f0f0' : '#fafafa',
            transition: 'all 0.2s ease',
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInputChange}
            style={{ display: 'none' }}
            disabled={uploading}
          />
          {uploading ? (
            <div style={{ color: '#666', fontSize: '14px' }}>Uploading...</div>
          ) : (
            <>
              <div style={{ fontSize: '40px', marginBottom: '10px' }}>📤</div>
              <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '5px', color: '#333' }}>
                Click to upload or drag and drop
              </div>
              <div style={{ fontSize: '12px', color: '#999' }}>
                PNG, JPG, GIF, WebP, SVG up to 10MB
              </div>
            </>
          )}
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={openGallery}
            type="button"
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#e8e8e8';
              e.currentTarget.style.borderColor = '#999';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#f0f0f0';
              e.currentTarget.style.borderColor = '#ccc';
            }}
            style={{
              flex: 1,
              padding: '10px',
              backgroundColor: '#f0f0f0',
              border: '2px solid #ccc',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              color: '#666',
              transition: 'all 0.2s ease',
            }}
          >
            Choose from Gallery
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '12px', color: '#999' }}>or enter URL:</span>
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder="/uploads/image.jpg"
            style={{
              flex: 1,
              padding: '8px 12px',
              border: '1px solid #e0e0e0',
              borderRadius: '6px',
              fontSize: '13px',
            }}
          />
        </div>

        {value && (
          <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '6px' }}>
            <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>Preview:</div>
            <img
              src={value}
              alt="Preview"
              style={{
                maxWidth: '100%',
                maxHeight: '200px',
                borderRadius: '6px',
                border: '1px solid #e0e0e0',
              }}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}
      </div>

      {showGallery && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
          }}
          onClick={() => setShowGallery(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              padding: '30px',
              maxWidth: '800px',
              width: '90%',
              maxHeight: '80vh',
              overflowY: 'auto',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>Image Gallery</h3>
              <button
                onClick={() => setShowGallery(false)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f0f0f0';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  padding: '5px 10px',
                  borderRadius: '6px',
                  transition: 'all 0.2s ease',
                }}
              >
                ✕
              </button>
            </div>

            {loadingGallery ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>Loading...</div>
            ) : galleryImages.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                No images uploaded yet. Upload your first image above!
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '15px' }}>
                {galleryImages.map((image) => (
                  <div
                    key={image.name}
                    onClick={() => {
                      onChange(image.url);
                      setShowGallery(false);
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.05)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.1)';
                    }}
                    style={{
                      cursor: 'pointer',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      border: value === image.url ? '3px solid #1a1a1a' : '1px solid #e0e0e0',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    <img
                      src={image.url}
                      alt={image.name}
                      style={{
                        width: '100%',
                        height: '150px',
                        objectFit: 'cover',
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

