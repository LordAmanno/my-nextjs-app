'use client';

interface HeroBlockProps {
  content: {
    title?: string;
    subtitle?: string;
    description?: string;
    backgroundImage?: string;
    textBoxes?: Array<{
      id: string;
      type: 'input' | 'textarea';
      text: string;
      fontSize?: string;
      fontWeight?: string;
      color?: string;
      textAlign?: 'left' | 'center' | 'right';
      marginBottom?: string;
      opacity?: string;
      lineHeight?: string;
      maxWidth?: string;
    }>;
    buttons?: Array<{
      text: string;
      link: string;
      style?: 'primary' | 'secondary' | 'outline';
      backgroundColor?: string;
      textColor?: string;
      borderColor?: string;
    }>;
  };
  styles: {
    backgroundColor?: string;
    textColor?: string;
    overlayColor?: string;
    overlayOpacity?: string;
    minHeight?: string;
    titleSize?: string;
    subtitleSize?: string;
    fontFamily?: string;
    textAlign?: 'left' | 'center' | 'right';
    padding?: string;
  };
}

export default function HeroBlock({ content, styles }: HeroBlockProps) {
  const defaultStyles = {
    backgroundColor: styles.backgroundColor || '#1a1a1a',
    textColor: styles.textColor || '#ffffff',
    overlayColor: styles.overlayColor || '#000000',
    overlayOpacity: styles.overlayOpacity || '0.5',
    minHeight: styles.minHeight || '600px',
    titleSize: styles.titleSize || '56px',
    subtitleSize: styles.subtitleSize || '24px',
    fontFamily: styles.fontFamily || 'inherit',
    textAlign: styles.textAlign || 'center',
    padding: styles.padding || '80px 20px',
  };

  return (
    <section
      style={{
        position: 'relative',
        minHeight: defaultStyles.minHeight,
        backgroundColor: defaultStyles.backgroundColor,
        backgroundImage: content.backgroundImage ? `url(${content.backgroundImage})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: defaultStyles.padding,
        fontFamily: defaultStyles.fontFamily,
      }}
    >
      {content.backgroundImage && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: defaultStyles.overlayColor,
            opacity: defaultStyles.overlayOpacity,
          }}
        />
      )}

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: '1200px',
          width: '100%',
          textAlign: defaultStyles.textAlign,
          color: defaultStyles.textColor,
        }}
      >
        {/* Dynamic Text Boxes */}
        {content.textBoxes && content.textBoxes.length > 0 ? (
          content.textBoxes.map((textBox, index) => {
            const TextComponent = textBox.type === 'textarea' ? 'p' : 'h1';

            return (
              <TextComponent
                key={index}
                style={{
                  fontSize: textBox.fontSize || '18px',
                  fontWeight: textBox.fontWeight || 'normal',
                  color: textBox.color || defaultStyles.textColor,
                  textAlign: textBox.textAlign || 'center',
                  marginBottom: textBox.marginBottom || '20px',
                  opacity: textBox.opacity || '1',
                  lineHeight: textBox.lineHeight || 'normal',
                  maxWidth: textBox.maxWidth || 'none',
                  margin: textBox.textAlign === 'center' && textBox.maxWidth ?
                    `0 auto ${textBox.marginBottom || '20px'}` :
                    `0 0 ${textBox.marginBottom || '20px'}`,
                  whiteSpace: 'pre-wrap', // Preserve line breaks and wrap text
                  wordWrap: 'break-word',
                  overflowWrap: 'break-word',
                  hyphens: 'auto',
                }}
              >
                {textBox.text}
              </TextComponent>
            );
          })
        ) : (
          // Fallback to old system for backward compatibility
          <>
            {content.subtitle && (
              <p
                style={{
                  fontSize: defaultStyles.subtitleSize,
                  marginBottom: '15px',
                  opacity: 0.9,
                  fontWeight: '500',
                  whiteSpace: 'pre-wrap',
                  wordWrap: 'break-word',
                  overflowWrap: 'break-word',
                  hyphens: 'auto',
                }}
              >
                {content.subtitle}
              </p>
            )}

            {content.title && (
              <h1
                style={{
                  fontSize: defaultStyles.titleSize,
                  fontWeight: 'bold',
                  marginBottom: '20px',
                  lineHeight: '1.2',
                  whiteSpace: 'pre-wrap',
                  wordWrap: 'break-word',
                  overflowWrap: 'break-word',
                  hyphens: 'auto',
                }}
              >
                {content.title}
              </h1>
            )}

            {content.description && (
              <p
                style={{
                  fontSize: '18px',
                  marginBottom: '40px',
                  opacity: 0.9,
                  maxWidth: '800px',
                  margin: defaultStyles.textAlign === 'center' ? '0 auto 40px' : '0 0 40px',
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
          </>
        )}

        {content.buttons && content.buttons.length > 0 && (
          <div
            style={{
              display: 'flex',
              gap: '15px',
              justifyContent: defaultStyles.textAlign === 'center' ? 'center' : defaultStyles.textAlign === 'right' ? 'flex-end' : 'flex-start',
              flexWrap: 'wrap',
            }}
          >
            {content.buttons.map((button, index) => {
              // Use custom colors if available, otherwise fall back to predefined styles
              const customStyle = button.backgroundColor || button.textColor || button.borderColor ? {
                backgroundColor: button.backgroundColor || '#ffffff',
                color: button.textColor || '#1a1a1a',
                border: button.borderColor ? `2px solid ${button.borderColor}` : 'none',
              } : null;

              const predefinedStyles = {
                primary: {
                  backgroundColor: '#ffffff',
                  color: defaultStyles.backgroundColor,
                  border: 'none',
                },
                secondary: {
                  backgroundColor: defaultStyles.textColor,
                  color: defaultStyles.backgroundColor,
                  border: 'none',
                },
                outline: {
                  backgroundColor: 'transparent',
                  color: defaultStyles.textColor,
                  border: `2px solid ${defaultStyles.textColor}`,
                },
              };

              const currentStyle = customStyle || predefinedStyles[button.style as keyof typeof predefinedStyles] || predefinedStyles.primary;

              return (
                <a
                  key={index}
                  href={button.link}
                  style={{
                    ...currentStyle,
                    padding: '15px 40px',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontSize: '18px',
                    fontWeight: '600',
                    display: 'inline-block',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = '0.8';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = '1';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  {button.text}
                </a>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

