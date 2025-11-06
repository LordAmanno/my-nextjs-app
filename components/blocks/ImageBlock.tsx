'use client';

interface ImageBlockProps {
  content: {
    imageUrl: string;
    alt?: string;
    text?: string;
    link?: string;
    textPosition?: 'left' | 'right';
  };
  styles: {
    backgroundColor?: string;
    padding?: string;
    maxWidth?: string;
    imageWidth?: string;
    imageHeight?: string;
    objectFit?: 'cover' | 'contain' | 'fill' | 'none';
    borderRadius?: string;
    borderWidth?: string;
    borderColor?: string;
    borderStyle?: 'solid' | 'dashed' | 'dotted' | 'double';
    boxShadow?: string;
    textColor?: string;
    textSize?: string;
    textAlign?: 'left' | 'center' | 'right';
    gap?: string;
  };
}

export default function ImageBlock({ content, styles }: ImageBlockProps) {
  const defaultStyles = {
    backgroundColor: styles.backgroundColor || '#ffffff',
    padding: styles.padding || '60px 20px',
    maxWidth: styles.maxWidth || '1200px',
    imageWidth: styles.imageWidth || '50%',
    imageHeight: styles.imageHeight || 'auto',
    objectFit: styles.objectFit || 'cover',
    borderRadius: styles.borderRadius || '8px',
    borderWidth: styles.borderWidth || '0px',
    borderColor: styles.borderColor || '#cccccc',
    borderStyle: styles.borderStyle || 'solid',
    boxShadow: styles.boxShadow || '0 4px 6px rgba(0,0,0,0.1)',
    textColor: styles.textColor || '#333333',
    textSize: styles.textSize || '16px',
    textAlign: styles.textAlign || 'left',
    gap: styles.gap || '40px',
  };

  const imageElement = (
    <div style={{
      flex: '0 0 auto',
      maxWidth: defaultStyles.imageWidth,
      minWidth: 0, // Allow shrinking if needed
      width: defaultStyles.imageWidth, // Explicit width
    }}>
      <img
        src={content.imageUrl}
        alt={content.alt || 'Image'}
        style={{
          width: '100%',
          height: defaultStyles.imageHeight,
          objectFit: defaultStyles.objectFit as any,
          borderRadius: defaultStyles.borderRadius,
          border: `${defaultStyles.borderWidth} ${defaultStyles.borderStyle} ${defaultStyles.borderColor}`,
          boxShadow: defaultStyles.boxShadow,
          display: 'block',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.02)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
        }}
      />
    </div>
  );

  const textElement = content.text && (
    <div
      style={{
        flex: '1 1 0', // Allow shrinking to 0 base size
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        minWidth: 0, // Critical: allows flex item to shrink below content size
        overflow: 'hidden', // Prevent overflow
      }}
    >
      <div
        style={{
          color: defaultStyles.textColor,
          fontSize: defaultStyles.textSize,
          lineHeight: '1.6',
          textAlign: defaultStyles.textAlign,
          wordWrap: 'break-word',
          overflowWrap: 'break-word',
          hyphens: 'auto',
          maxWidth: '100%',
          minWidth: 0, // Allow text to shrink
          whiteSpace: 'pre-wrap', // Preserve line breaks
        }}
        dangerouslySetInnerHTML={{ __html: content.text }}
      />
    </div>
  );

  const isImageLeft = content.textPosition !== 'right';

  return (
    <>
      <style jsx>{`
        @media (max-width: 768px) {
          .image-block-responsive {
            flex-direction: column !important;
          }
        }
      `}</style>
      <section
        style={{
          backgroundColor: defaultStyles.backgroundColor,
          padding: defaultStyles.padding,
        }}
      >
      <div
        style={{
          maxWidth: defaultStyles.maxWidth,
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          gap: defaultStyles.gap,
          flexDirection: 'row',
          minWidth: 0, // Allow container to shrink
          width: '100%', // Take full available width
        }}
        className="image-block-responsive"
      >
        {content.link ? (
          <>
            {isImageLeft && (
              <a
                href={content.link}
                style={{
                  display: 'block',
                  textDecoration: 'none',
                  flex: '0 0 auto',
                  maxWidth: defaultStyles.imageWidth,
                  minWidth: 0,
                  width: defaultStyles.imageWidth,
                }}
              >
                {imageElement}
              </a>
            )}
            {textElement}
            {!isImageLeft && (
              <a
                href={content.link}
                style={{
                  display: 'block',
                  textDecoration: 'none',
                  flex: '0 0 auto',
                  maxWidth: defaultStyles.imageWidth,
                  minWidth: 0,
                  width: defaultStyles.imageWidth,
                }}
              >
                {imageElement}
              </a>
            )}
          </>
        ) : (
          <>
            {isImageLeft && imageElement}
            {textElement}
            {!isImageLeft && imageElement}
          </>
        )}
      </div>
    </section>
    </>
  );
}

