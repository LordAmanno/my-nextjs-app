'use client';

import { useState, useEffect } from 'react';

interface GalleryImage {
  url: string;
  alt?: string;
  size?: 'small' | 'medium' | 'large' | 'landscape' | 'portrait';
  position?: string;
}

interface GalleryBlockProps {
  content: {
    images: GalleryImage[];
    title?: string;
    imagesPerRow?: number;
    expandable?: boolean;
    initialVisibleCount?: number;
  };
  styles: {
    backgroundColor?: string;
    padding?: string;
    gap?: string;
    borderRadius?: string;
    imageBorderRadius?: string;
    imageBorderWidth?: string;
    imageBorderColor?: string;
    imageBoxShadow?: string;
    titleColor?: string;
    titleSize?: string;
    hoverEffect?: 'zoom' | 'lift' | 'none';
  };
}

export default function GalleryBlock({ content, styles }: GalleryBlockProps) {
  const [expanded, setExpanded] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const defaultStyles = {
    backgroundColor: styles.backgroundColor || '#f9f9f9',
    padding: styles.padding || '60px 20px',
    gap: styles.gap || '15px',
    borderRadius: styles.borderRadius || '0px',
    imageBorderRadius: styles.imageBorderRadius || '8px',
    imageBorderWidth: styles.imageBorderWidth || '0px',
    imageBorderColor: styles.imageBorderColor || '#cccccc',
    imageBoxShadow: styles.imageBoxShadow || '0 4px 6px rgba(0,0,0,0.1)',
    titleColor: styles.titleColor || '#1a1a1a',
    titleSize: styles.titleSize || '36px',
    hoverEffect: styles.hoverEffect || 'zoom',
  };

  const initialCount = content.initialVisibleCount || 6;
  // Filter out images with empty URLs to prevent console errors
  const validImages = content.images.filter(image => image.url && image.url.trim() !== '');
  const visibleImages = content.expandable && !expanded
    ? validImages.slice(0, initialCount)
    : validImages;

  // Lightbox functions
  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = 'unset'; // Restore scrolling
  };

  const goToNext = () => {
    setCurrentImageIndex((prev) => (prev + 1) % validImages.length);
  };

  const goToPrevious = () => {
    setCurrentImageIndex((prev) => (prev - 1 + validImages.length) % validImages.length);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;

      switch (e.key) {
        case 'Escape':
          closeLightbox();
          break;
        case 'ArrowRight':
          goToNext();
          break;
        case 'ArrowLeft':
          goToPrevious();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen]);

  const getImageStyles = (image: GalleryImage) => {
    const sizeMap = {
      small: {
        width: '200px',
        height: '200px',
        aspectRatio: '1/1',
        flex: '0 0 auto'
      },
      medium: {
        width: '300px',
        height: '300px',
        aspectRatio: '1/1',
        flex: '0 0 auto'
      },
      large: {
        width: '400px',
        height: '400px',
        aspectRatio: '1/1',
        flex: '0 0 auto'
      },
      landscape: {
        width: '350px',
        height: '200px',
        aspectRatio: '16/9',
        flex: '0 0 auto'
      },
      portrait: {
        width: '200px',
        height: '300px',
        aspectRatio: '3/4',
        flex: '0 0 auto'
      },
    };

    return sizeMap[image.size || 'small'];
  };

  const getHoverStyles = () => {
    switch (defaultStyles.hoverEffect) {
      case 'zoom':
        return { transform: 'scale(1.05)' };
      case 'lift':
        return { transform: 'translateY(-8px)', boxShadow: '0 12px 24px rgba(0,0,0,0.2)' };
      default:
        return {};
    }
  };

  return (
    <section
      style={{
        backgroundColor: defaultStyles.backgroundColor,
        padding: defaultStyles.padding,
        borderRadius: defaultStyles.borderRadius,
      }}
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {content.title && (
          <h2
            style={{
              color: defaultStyles.titleColor,
              fontSize: defaultStyles.titleSize,
              marginBottom: '40px',
              textAlign: 'center',
              fontWeight: 'bold',
              whiteSpace: 'pre-wrap',
              wordWrap: 'break-word',
              overflowWrap: 'break-word',
              hyphens: 'auto',
            }}
          >
            {content.title}
          </h2>
        )}

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: defaultStyles.gap,
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
          }}
        >
          {visibleImages.map((image, index) => {
            const imageStyles = getImageStyles(image);
            
            return (
              <div
                key={index}
                style={{
                  ...imageStyles,
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: defaultStyles.imageBorderRadius,
                  border: `${defaultStyles.imageBorderWidth} solid ${defaultStyles.imageBorderColor}`,
                  boxShadow: defaultStyles.imageBoxShadow,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onClick={() => openLightbox(index)}
                onMouseEnter={(e) => {
                  const hoverStyles = getHoverStyles();
                  Object.assign(e.currentTarget.style, hoverStyles);
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1) translateY(0)';
                  e.currentTarget.style.boxShadow = defaultStyles.imageBoxShadow;
                }}
              >
                <img
                  src={image.url}
                  alt={image.alt || `Gallery image ${index + 1}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
              </div>
            );
          })}
        </div>

        {content.expandable && content.images.length > initialCount && (
          <div style={{ textAlign: 'center', marginTop: '30px' }}>
            <button
              onClick={() => setExpanded(!expanded)}
              style={{
                backgroundColor: 'transparent',
                border: `2px solid ${defaultStyles.titleColor}`,
                color: defaultStyles.titleColor,
                padding: '12px 30px',
                borderRadius: '6px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = defaultStyles.titleColor;
                e.currentTarget.style.color = '#ffffff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = defaultStyles.titleColor;
              }}
            >
              {expanded ? 'Show Less' : `Show More (${content.images.length - initialCount} more)`}
              <span style={{ fontSize: '12px' }}>
                {expanded ? '▲' : '▼'}
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px',
          }}
          onClick={closeLightbox}
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              color: 'white',
              fontSize: '24px',
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 0.3s ease',
              zIndex: 10001,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
            }}
          >
            ✕
          </button>

          {/* Previous Arrow */}
          {validImages.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToPrevious();
              }}
              style={{
                position: 'absolute',
                left: '20px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                color: 'white',
                fontSize: '24px',
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background-color 0.3s ease',
                zIndex: 10001,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
              }}
            >
              ‹
            </button>
          )}

          {/* Next Arrow */}
          {validImages.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              style={{
                position: 'absolute',
                right: '20px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                color: 'white',
                fontSize: '24px',
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background-color 0.3s ease',
                zIndex: 10001,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
              }}
            >
              ›
            </button>
          )}

          {/* Main Image */}
          <div
            style={{
              maxWidth: '90%',
              maxHeight: '90%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={validImages[currentImageIndex]?.url}
              alt={validImages[currentImageIndex]?.alt || `Gallery image ${currentImageIndex + 1}`}
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
                borderRadius: '8px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
              }}
            />
          </div>

          {/* Image Counter */}
          {validImages.length > 1 && (
            <div
              style={{
                position: 'absolute',
                bottom: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                color: 'white',
                fontSize: '16px',
                background: 'rgba(0, 0, 0, 0.5)',
                padding: '8px 16px',
                borderRadius: '20px',
                zIndex: 10001,
              }}
            >
              {currentImageIndex + 1} / {validImages.length}
            </div>
          )}
        </div>
      )}
    </section>
  );
}

