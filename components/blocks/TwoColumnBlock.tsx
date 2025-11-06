'use client';

interface TwoColumnBlockProps {
  content: {
    leftColumn: {
      type: 'text' | 'image';
      content: string;
      heading?: string;
    };
    rightColumn: {
      type: 'text' | 'image';
      content: string;
      heading?: string;
    };
    imagePosition?: 'left' | 'right';
    buttons?: Array<{
      text: string;
      link: string;
      style: 'primary' | 'secondary' | 'outline';
      column: 'left' | 'right';
    }>;
  };
  styles: {
    backgroundColor?: string;
    textColor?: string;
    headingColor?: string;
    padding?: string;
    gap?: string;
    columnRatio?: string;
    verticalAlign?: 'top' | 'center' | 'bottom';
    imageBorderRadius?: string;
    imageObjectFit?: 'cover' | 'contain' | 'fill';
    fontSize?: string;
    fontFamily?: string;
  };
}

export default function TwoColumnBlock({ content, styles }: TwoColumnBlockProps) {
  const defaultStyles = {
    backgroundColor: styles.backgroundColor || '#ffffff',
    textColor: styles.textColor || '#333333',
    headingColor: styles.headingColor || '#1a1a1a',
    padding: styles.padding || '60px 20px',
    gap: styles.gap || '40px',
    columnRatio: styles.columnRatio || '1fr 1fr',
    verticalAlign: styles.verticalAlign || 'center',
    imageBorderRadius: styles.imageBorderRadius || '8px',
    imageObjectFit: styles.imageObjectFit || 'cover',
    fontSize: styles.fontSize || '16px',
    fontFamily: styles.fontFamily || 'inherit',
  };

  const alignItems = {
    top: 'flex-start',
    center: 'center',
    bottom: 'flex-end',
  };

  const renderColumn = (column: any, side: 'left' | 'right') => {
    if (column.type === 'image') {
      return (
        <div style={{ width: '100%', height: '100%' }}>
          <img
            src={column.content}
            alt={column.heading || 'Column image'}
            style={{
              width: '100%',
              height: '100%',
              minHeight: '400px',
              objectFit: defaultStyles.imageObjectFit as any,
              borderRadius: defaultStyles.imageBorderRadius,
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            }}
          />
        </div>
      );
    }

    const columnButtons = content.buttons?.filter(btn => btn.column === side) || [];

    return (
      <div style={{
        width: '100%',
        minWidth: 0, // Allow flex items to shrink below their content size
        overflow: 'hidden' // Prevent content from overflowing the container
      }}>
        {column.heading && (
          <h2
            style={{
              color: defaultStyles.headingColor,
              fontSize: `calc(${defaultStyles.fontSize} * 2)`,
              marginBottom: '20px',
              fontWeight: 'bold',
              wordWrap: 'break-word',
              overflowWrap: 'break-word',
              hyphens: 'auto',
              maxWidth: '100%',
            }}
          >
            {column.heading}
          </h2>
        )}
        
        <div
          style={{
            color: defaultStyles.textColor,
            fontSize: defaultStyles.fontSize,
            lineHeight: '1.8',
            marginBottom: columnButtons.length > 0 ? '30px' : '0',
            wordWrap: 'break-word',
            overflowWrap: 'break-word',
            hyphens: 'auto',
            maxWidth: '100%',
            overflow: 'hidden',
          }}
          dangerouslySetInnerHTML={{ __html: column.content }}
        />

        {columnButtons.length > 0 && (
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
            {columnButtons.map((button, index) => {
              // Check if button has custom colors
              const customStyle = button.backgroundColor || button.textColor || button.borderColor ? {
                backgroundColor: button.backgroundColor || '#1a1a1a',
                color: button.textColor || '#ffffff',
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
    );
  };

  return (
    <>
      <style jsx>{`
        @media (max-width: 768px) {
          .two-column-responsive {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
      <section
        style={{
          backgroundColor: defaultStyles.backgroundColor,
          padding: defaultStyles.padding,
          fontFamily: defaultStyles.fontFamily,
        }}
      >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: defaultStyles.columnRatio,
          gap: defaultStyles.gap,
          alignItems: alignItems[defaultStyles.verticalAlign],
          minWidth: 0, // Allow grid items to shrink
          overflow: 'hidden', // Prevent horizontal overflow
        }}
        className="two-column-responsive"
      >
        {renderColumn(content.leftColumn, 'left')}
        {renderColumn(content.rightColumn, 'right')}
      </div>
    </section>
    </>
  );
}

