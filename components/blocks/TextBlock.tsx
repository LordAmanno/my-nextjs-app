'use client';

interface TextBlockProps {
  content: {
    text?: string;
    heading?: string;
    alignment?: 'left' | 'center' | 'right';
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
      backgroundColor?: string;
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
    headingColor?: string;
    fontSize?: string;
    fontFamily?: string;
    padding?: string;
    maxWidth?: string;
    borderRadius?: string;
    boxShadow?: string;
  };
}

export default function TextBlock({ content, styles }: TextBlockProps) {
  const defaultStyles = {
    backgroundColor: styles.backgroundColor || '#f5f5f5',
    textColor: styles.textColor || '#333333',
    headingColor: styles.headingColor || '#1a1a1a',
    fontSize: styles.fontSize || '16px',
    fontFamily: styles.fontFamily || 'inherit',
    padding: styles.padding || '60px 20px',
    maxWidth: styles.maxWidth || '1200px',
    borderRadius: styles.borderRadius || '0px',
    boxShadow: styles.boxShadow || 'none',
  };

  const alignment = content.alignment || 'left';

  return (
    <section
      style={{
        backgroundColor: defaultStyles.backgroundColor,
        padding: defaultStyles.padding,
        borderRadius: defaultStyles.borderRadius,
        boxShadow: defaultStyles.boxShadow,
      }}
    >
      <div
        style={{
          maxWidth: defaultStyles.maxWidth,
          margin: '0 auto',
          textAlign: alignment,
          fontFamily: defaultStyles.fontFamily,
        }}
      >
        {/* Dynamic Text Boxes */}
        {content.textBoxes && content.textBoxes.length > 0 ? (
          content.textBoxes.map((textBox, index) => {
            const TextComponent = textBox.type === 'textarea' ? 'p' : 'h2';

            return (
              <TextComponent
                key={index}
                style={{
                  fontSize: textBox.fontSize || defaultStyles.fontSize,
                  fontWeight: textBox.fontWeight || 'normal',
                  color: textBox.color || defaultStyles.textColor,
                  backgroundColor: textBox.backgroundColor || 'transparent',
                  textAlign: textBox.textAlign || alignment,
                  marginBottom: textBox.marginBottom || '20px',
                  opacity: textBox.opacity || '1',
                  lineHeight: textBox.lineHeight || '1.8',
                  maxWidth: textBox.maxWidth || 'none',
                  margin: textBox.textAlign === 'center' && textBox.maxWidth ?
                    `0 auto ${textBox.marginBottom || '20px'}` :
                    `0 0 ${textBox.marginBottom || '20px'}`,
                  padding: textBox.backgroundColor !== 'transparent' && textBox.backgroundColor ? '10px' : '0',
                  borderRadius: textBox.backgroundColor !== 'transparent' && textBox.backgroundColor ? '6px' : '0',
                  whiteSpace: 'pre-wrap',
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
            {content.heading && (
              <h2
                style={{
                  color: defaultStyles.headingColor,
                  fontSize: `calc(${defaultStyles.fontSize} * 2)`,
                  marginBottom: '20px',
                  fontWeight: 'bold',
                  whiteSpace: 'pre-wrap',
                  wordWrap: 'break-word',
                  overflowWrap: 'break-word',
                  hyphens: 'auto',
                }}
              >
                {content.heading}
              </h2>
            )}

            {content.text && (
              <div
                style={{
                  color: defaultStyles.textColor,
                  fontSize: defaultStyles.fontSize,
                  lineHeight: '1.8',
                  marginBottom: content.buttons && content.buttons.length > 0 ? '30px' : '0',
                  wordWrap: 'break-word',
                  overflowWrap: 'break-word',
                  hyphens: 'auto',
                  maxWidth: '100%',
                }}
                dangerouslySetInnerHTML={{ __html: content.text }}
              />
            )}
          </>
        )}

        {content.buttons && content.buttons.length > 0 && (
          <div
            style={{
              display: 'flex',
              gap: '15px',
              justifyContent: alignment === 'center' ? 'center' : alignment === 'right' ? 'flex-end' : 'flex-start',
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
                  backgroundColor: defaultStyles.headingColor,
                  color: '#ffffff',
                  border: 'none',
                },
                secondary: {
                  backgroundColor: defaultStyles.textColor,
                  color: '#ffffff',
                  border: 'none',
                },
                outline: {
                  backgroundColor: 'transparent',
                  color: defaultStyles.headingColor,
                  border: `2px solid ${defaultStyles.headingColor}`,
                },
              };

              const currentStyle = customStyle || predefinedStyles[button.style as keyof typeof predefinedStyles] || predefinedStyles.primary;

              return (
                <a
                  key={index}
                  href={button.link}
                  style={{
                    ...currentStyle,
                    padding: '12px 30px',
                    borderRadius: '6px',
                    textDecoration: 'none',
                    fontSize: defaultStyles.fontSize,
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

