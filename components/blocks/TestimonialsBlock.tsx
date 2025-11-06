import React, { useState, useEffect } from 'react';

interface TestimonialsBlockProps {
  content: {
    title?: string;
    description?: string;
    testimonials: Array<{
      id: string;
      name: string;
      role?: string;
      company?: string;
      testimonial: string;
      rating?: number;
      avatar?: string;
    }>;
    autoplay?: boolean;
    autoplaySpeed?: number;
    showRatings?: boolean;
    showAvatars?: boolean;
  };
  styles: {
    backgroundColor?: string;
    padding?: string;
    textAlign?: 'left' | 'center' | 'right';
    titleColor?: string;
    titleSize?: string;
    descriptionColor?: string;
    descriptionSize?: string;
    testimonialBackgroundColor?: string;
    testimonialTextColor?: string;
    testimonialBorderRadius?: string;
    testimonialShadow?: string;
    nameColor?: string;
    nameSize?: string;
    roleColor?: string;
    roleSize?: string;
    ratingColor?: string;
    maxWidth?: string;
    carouselDots?: boolean;
    carouselArrows?: boolean;
  };
}

export default function TestimonialsBlock({ content, styles }: TestimonialsBlockProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(content.autoplay || false);

  const defaultStyles = {
    backgroundColor: styles.backgroundColor || '#f8f9fa',
    padding: styles.padding || '80px 20px',
    textAlign: styles.textAlign || 'center',
    titleColor: styles.titleColor || '#1a1a1a',
    titleSize: styles.titleSize || '36px',
    descriptionColor: styles.descriptionColor || '#666666',
    descriptionSize: styles.descriptionSize || '18px',
    testimonialBackgroundColor: styles.testimonialBackgroundColor || '#ffffff',
    testimonialTextColor: styles.testimonialTextColor || '#333333',
    testimonialBorderRadius: styles.testimonialBorderRadius || '12px',
    testimonialShadow: styles.testimonialShadow || '0 8px 32px rgba(0,0,0,0.1)',
    nameColor: styles.nameColor || '#1a1a1a',
    nameSize: styles.nameSize || '18px',
    roleColor: styles.roleColor || '#666666',
    roleSize: styles.roleSize || '14px',
    ratingColor: styles.ratingColor || '#ffc107',
    maxWidth: styles.maxWidth || '800px',
    carouselDots: styles.carouselDots !== false,
    carouselArrows: styles.carouselArrows !== false,
  };

  const testimonials = content.testimonials || [];

  // Autoplay functionality
  useEffect(() => {
    if (isAutoPlaying && testimonials.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
      }, content.autoplaySpeed || 5000);

      return () => clearInterval(interval);
    }
  }, [isAutoPlaying, testimonials.length, content.autoplaySpeed]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false); // Stop autoplay when user manually navigates
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          style={{
            color: i <= rating ? defaultStyles.ratingColor : '#e0e0e0',
            fontSize: '20px',
            marginRight: '2px',
          }}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  if (testimonials.length === 0) {
    return (
      <div
        style={{
          backgroundColor: defaultStyles.backgroundColor,
          padding: defaultStyles.padding,
          textAlign: defaultStyles.textAlign as any,
        }}
      >
        <div style={{ maxWidth: defaultStyles.maxWidth, margin: '0 auto' }}>
          <p style={{ color: '#999', fontSize: '16px' }}>
            No testimonials available. Add some testimonials to display them here.
          </p>
        </div>
      </div>
    );
  }

  const currentTestimonial = testimonials[currentIndex];

  return (
    <div
      style={{
        backgroundColor: defaultStyles.backgroundColor,
        padding: defaultStyles.padding,
        textAlign: defaultStyles.textAlign as any,
      }}
    >
      <div style={{ maxWidth: defaultStyles.maxWidth, margin: '0 auto' }}>
        {/* Title */}
        {content.title && (
          <h2
            style={{
              fontSize: defaultStyles.titleSize,
              color: defaultStyles.titleColor,
              marginBottom: '20px',
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

        {/* Description */}
        {content.description && (
          <p
            style={{
              fontSize: defaultStyles.descriptionSize,
              color: defaultStyles.descriptionColor,
              marginBottom: '50px',
              lineHeight: '1.6',
              whiteSpace: 'pre-wrap',
              wordWrap: 'break-word',
              overflowWrap: 'break-word',
              hyphens: 'auto',
            }}
          >
            {content.description}
          </p>
        )}

        {/* Testimonial Card */}
        <div
          style={{
            backgroundColor: defaultStyles.testimonialBackgroundColor,
            padding: '40px',
            borderRadius: defaultStyles.testimonialBorderRadius,
            boxShadow: defaultStyles.testimonialShadow,
            position: 'relative',
            marginBottom: '30px',
          }}
        >
          {/* Quote Icon */}
          <div
            style={{
              fontSize: '48px',
              color: '#e0e0e0',
              textAlign: 'center',
              marginBottom: '20px',
              lineHeight: '1',
            }}
          >
            "
          </div>

          {/* Testimonial Text */}
          <p
            style={{
              fontSize: '20px',
              color: defaultStyles.testimonialTextColor,
              lineHeight: '1.6',
              marginBottom: '30px',
              fontStyle: 'italic',
              textAlign: 'center',
              whiteSpace: 'pre-wrap',
              wordWrap: 'break-word',
              overflowWrap: 'break-word',
              hyphens: 'auto',
            }}
          >
            {currentTestimonial.testimonial}
          </p>

          {/* Rating */}
          {content.showRatings && currentTestimonial.rating && (
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              {renderStars(currentTestimonial.rating)}
            </div>
          )}

          {/* Author Info */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '15px',
            }}
          >
            {/* Avatar */}
            {content.showAvatars && currentTestimonial.avatar && (
              <img
                src={currentTestimonial.avatar}
                alt={currentTestimonial.name}
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '3px solid #e0e0e0',
                }}
              />
            )}

            {/* Name and Role */}
            <div style={{ textAlign: 'left' }}>
              <h4
                style={{
                  fontSize: defaultStyles.nameSize,
                  color: defaultStyles.nameColor,
                  margin: '0 0 5px 0',
                  fontWeight: 'bold',
                  whiteSpace: 'pre-wrap',
                  wordWrap: 'break-word',
                  overflowWrap: 'break-word',
                  hyphens: 'auto',
                }}
              >
                {currentTestimonial.name}
              </h4>
              {(currentTestimonial.role || currentTestimonial.company) && (
                <p
                  style={{
                    fontSize: defaultStyles.roleSize,
                    color: defaultStyles.roleColor,
                    margin: 0,
                    whiteSpace: 'pre-wrap',
                    wordWrap: 'break-word',
                    overflowWrap: 'break-word',
                    hyphens: 'auto',
                  }}
                >
                  {currentTestimonial.role}
                  {currentTestimonial.role && currentTestimonial.company && ' at '}
                  {currentTestimonial.company}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Navigation */}
        {testimonials.length > 1 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
            {/* Previous Arrow */}
            {defaultStyles.carouselArrows && (
              <button
                onClick={goToPrevious}
                style={{
                  backgroundColor: '#ffffff',
                  border: '2px solid #e0e0e0',
                  borderRadius: '50%',
                  width: '50px',
                  height: '50px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontSize: '20px',
                  color: '#666666',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f8f9fa';
                  e.currentTarget.style.borderColor = '#1a1a1a';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#ffffff';
                  e.currentTarget.style.borderColor = '#e0e0e0';
                }}
              >
                ←
              </button>
            )}

            {/* Dots */}
            {defaultStyles.carouselDots && (
              <div style={{ display: 'flex', gap: '10px' }}>
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      border: 'none',
                      backgroundColor: index === currentIndex ? '#1a1a1a' : '#e0e0e0',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                    }}
                  />
                ))}
              </div>
            )}

            {/* Next Arrow */}
            {defaultStyles.carouselArrows && (
              <button
                onClick={goToNext}
                style={{
                  backgroundColor: '#ffffff',
                  border: '2px solid #e0e0e0',
                  borderRadius: '50%',
                  width: '50px',
                  height: '50px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontSize: '20px',
                  color: '#666666',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f8f9fa';
                  e.currentTarget.style.borderColor = '#1a1a1a';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#ffffff';
                  e.currentTarget.style.borderColor = '#e0e0e0';
                }}
              >
                →
              </button>
            )}
          </div>
        )}

        {/* Autoplay Control */}
        {testimonials.length > 1 && (
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              style={{
                backgroundColor: 'transparent',
                border: '1px solid #e0e0e0',
                borderRadius: '20px',
                padding: '8px 16px',
                cursor: 'pointer',
                fontSize: '14px',
                color: '#666666',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f8f9fa';
                e.currentTarget.style.borderColor = '#1a1a1a';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.borderColor = '#e0e0e0';
              }}
            >
              {isAutoPlaying ? '⏸️ Pause' : '▶️ Auto Play'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
