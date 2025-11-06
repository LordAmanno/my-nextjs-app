import React from 'react';

interface SpacerBlockProps {
  content: {
    height?: string;
    showDivider?: boolean;
    dividerType?: 'line' | 'dots' | 'wave' | 'zigzag';
    dividerWidth?: string;
    dividerThickness?: string;
  };
  styles: {
    backgroundColor?: string;
    dividerColor?: string;
    dividerOpacity?: number;
    mobileHeight?: string;
    tabletHeight?: string;
  };
}

export default function SpacerBlock({ content, styles }: SpacerBlockProps) {
  const defaultStyles = {
    backgroundColor: styles.backgroundColor || 'transparent',
    dividerColor: styles.dividerColor || '#e0e0e0',
    dividerOpacity: styles.dividerOpacity || 1,
    mobileHeight: styles.mobileHeight || '30px',
    tabletHeight: styles.tabletHeight || '50px',
  };

  // Ensure height has units
  const rawHeight = content.height || '80px';
  const height = rawHeight.includes('px') || rawHeight.includes('rem') || rawHeight.includes('vh')
    ? rawHeight
    : `${rawHeight}px`;

  const showDivider = content.showDivider || false;
  const dividerType = content.dividerType || 'line';
  const dividerWidth = content.dividerWidth || '100px';
  const dividerThickness = content.dividerThickness || '2px';

  const renderDivider = () => {
    const dividerStyle = {
      color: defaultStyles.dividerColor,
      opacity: defaultStyles.dividerOpacity,
    };

    switch (dividerType) {
      case 'line':
        return (
          <div
            style={{
              width: dividerWidth,
              height: dividerThickness,
              backgroundColor: defaultStyles.dividerColor,
              opacity: defaultStyles.dividerOpacity,
              margin: '0 auto',
            }}
          />
        );

      case 'dots':
        return (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            {[1, 2, 3, 4, 5].map((dot) => (
              <div
                key={dot}
                style={{
                  width: dividerThickness === '1px' ? '4px' : dividerThickness === '2px' ? '6px' : '8px',
                  height: dividerThickness === '1px' ? '4px' : dividerThickness === '2px' ? '6px' : '8px',
                  borderRadius: '50%',
                  backgroundColor: defaultStyles.dividerColor,
                  opacity: defaultStyles.dividerOpacity,
                }}
              />
            ))}
          </div>
        );

      case 'wave':
        return (
          <svg
            width={dividerWidth}
            height="20"
            viewBox="0 0 100 20"
            style={{ margin: '0 auto', display: 'block' }}
          >
            <path
              d="M0,10 Q25,0 50,10 T100,10"
              stroke={defaultStyles.dividerColor}
              strokeWidth={dividerThickness}
              fill="none"
              opacity={defaultStyles.dividerOpacity}
            />
          </svg>
        );

      case 'zigzag':
        return (
          <svg
            width={dividerWidth}
            height="20"
            viewBox="0 0 100 20"
            style={{ margin: '0 auto', display: 'block' }}
          >
            <path
              d="M0,15 L20,5 L40,15 L60,5 L80,15 L100,5"
              stroke={defaultStyles.dividerColor}
              strokeWidth={dividerThickness}
              fill="none"
              opacity={defaultStyles.dividerOpacity}
            />
          </svg>
        );

      default:
        return null;
    }
  };

  // Get responsive height based on screen size
  const getResponsiveHeight = () => {
    if (typeof window !== 'undefined') {
      const width = window.innerWidth;
      if (width <= 768) {
        return defaultStyles.mobileHeight;
      } else if (width <= 1024) {
        return defaultStyles.tabletHeight;
      }
    }
    return height;
  };

  const finalHeight = getResponsiveHeight();

  return (
    <div
      style={{
        backgroundColor: defaultStyles.backgroundColor,
        height: finalHeight,
        minHeight: '20px', // Ensure minimum visibility
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        width: '100%',
        // Add a subtle border for debugging visibility
        border: defaultStyles.backgroundColor === 'transparent' ? '1px dashed rgba(0,0,0,0.1)' : 'none',
      }}
    >
      {/* Divider */}
      {showDivider && renderDivider()}

      {/* Debug info - remove in production */}
      {!showDivider && defaultStyles.backgroundColor === 'transparent' && (
        <div style={{
          fontSize: '12px',
          color: '#ccc',
          textAlign: 'center',
          userSelect: 'none',
          pointerEvents: 'none',
        }}>
          Spacer ({finalHeight})
        </div>
      )}
    </div>
  );
}
