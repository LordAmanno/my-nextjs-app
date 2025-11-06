import React from 'react';

interface VideoBlockProps {
  content: {
    videoUrl: string;
    videoType: 'youtube' | 'vimeo' | 'direct';
    title?: string;
    description?: string;
    autoplay?: boolean;
    muted?: boolean;
    controls?: boolean;
    loop?: boolean;
    poster?: string;
  };
  styles: {
    backgroundColor?: string;
    padding?: string;
    textAlign?: 'left' | 'center' | 'right';
    titleColor?: string;
    titleSize?: string;
    descriptionColor?: string;
    descriptionSize?: string;
    videoWidth?: string;
    videoHeight?: string;
    borderRadius?: string;
    boxShadow?: string;
    aspectRatio?: '16:9' | '4:3' | '1:1' | 'custom';
  };
}

export default function VideoBlock({ content, styles }: VideoBlockProps) {
  const defaultStyles = {
    backgroundColor: styles.backgroundColor || '#ffffff',
    padding: styles.padding || '60px 20px',
    textAlign: styles.textAlign || 'center',
    titleColor: styles.titleColor || '#1a1a1a',
    titleSize: styles.titleSize || '32px',
    descriptionColor: styles.descriptionColor || '#666666',
    descriptionSize: styles.descriptionSize || '16px',
    videoWidth: styles.videoWidth || '100%',
    videoHeight: styles.videoHeight || 'auto',
    borderRadius: styles.borderRadius || '12px',
    boxShadow: styles.boxShadow || '0 8px 32px rgba(0,0,0,0.1)',
    aspectRatio: styles.aspectRatio || '16:9',
  };

  // Extract video ID from URL
  const getVideoId = (url: string, type: 'youtube' | 'vimeo') => {
    if (type === 'youtube') {
      const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
      return match ? match[1] : null;
    } else if (type === 'vimeo') {
      const match = url.match(/vimeo\.com\/(\d+)/);
      return match ? match[1] : null;
    }
    return null;
  };

  // Generate embed URL
  const getEmbedUrl = () => {
    if (!content.videoUrl) return '';

    if (content.videoType === 'youtube') {
      const videoId = getVideoId(content.videoUrl, 'youtube');
      if (!videoId) return '';
      
      const params = new URLSearchParams();
      if (content.autoplay) params.append('autoplay', '1');
      if (content.muted) params.append('mute', '1');
      if (!content.controls) params.append('controls', '0');
      if (content.loop) params.append('loop', '1');
      
      return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
    } else if (content.videoType === 'vimeo') {
      const videoId = getVideoId(content.videoUrl, 'vimeo');
      if (!videoId) return '';
      
      const params = new URLSearchParams();
      if (content.autoplay) params.append('autoplay', '1');
      if (content.muted) params.append('muted', '1');
      if (content.loop) params.append('loop', '1');
      
      return `https://player.vimeo.com/video/${videoId}?${params.toString()}`;
    } else if (content.videoType === 'direct') {
      return content.videoUrl;
    }
    
    return '';
  };

  // Calculate aspect ratio
  const getAspectRatioStyle = () => {
    const ratios = {
      '16:9': '56.25%', // 9/16 * 100
      '4:3': '75%',     // 3/4 * 100
      '1:1': '100%',    // 1/1 * 100
      'custom': 'auto'
    };
    
    if (defaultStyles.aspectRatio === 'custom') {
      return {
        height: defaultStyles.videoHeight,
      };
    }
    
    return {
      paddingBottom: ratios[defaultStyles.aspectRatio],
      height: 0,
    };
  };

  const embedUrl = getEmbedUrl();

  return (
    <div
      style={{
        backgroundColor: defaultStyles.backgroundColor,
        padding: defaultStyles.padding,
        textAlign: defaultStyles.textAlign as any,
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
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
              marginBottom: '40px',
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

        {/* Video Container */}
        <div
          style={{
            maxWidth: defaultStyles.videoWidth,
            margin: '0 auto',
            position: 'relative',
            borderRadius: defaultStyles.borderRadius,
            overflow: 'hidden',
            boxShadow: defaultStyles.boxShadow,
            ...getAspectRatioStyle(),
          }}
        >
          {content.videoType === 'direct' ? (
            <video
              src={embedUrl}
              controls={content.controls !== false}
              autoPlay={content.autoplay}
              muted={content.muted}
              loop={content.loop}
              poster={content.poster}
              style={{
                position: defaultStyles.aspectRatio === 'custom' ? 'static' : 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: defaultStyles.aspectRatio === 'custom' ? 'auto' : '100%',
                objectFit: 'cover',
              }}
            />
          ) : embedUrl && embedUrl.trim() !== '' ? (
            <iframe
              src={embedUrl}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{
                position: defaultStyles.aspectRatio === 'custom' ? 'static' : 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: defaultStyles.aspectRatio === 'custom' ? defaultStyles.videoHeight : '100%',
              }}
            />
          ) : (
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: '#f5f5f5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#666',
                fontSize: '16px',
              }}
            >
              No video URL provided
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
