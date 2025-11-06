'use client';

import { useEffect, useRef, useState } from 'react';

interface LivePreviewProps {
  content: any;
  layoutType: string;
}

export default function LivePreview({ content, layoutType }: LivePreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    // Update iframe content when content changes
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        { type: 'UPDATE_CONTENT', content, layoutType },
        '*'
      );
    }
  }, [content, layoutType]);

  const handleZoomChange = (newScale: number) => {
    setScale(newScale);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Live Preview</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Zoom:</span>
          <button
            onClick={() => handleZoomChange(0.5)}
            className={`px-3 py-1 rounded ${scale === 0.5 ? 'bg-amber-600 text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            50%
          </button>
          <button
            onClick={() => handleZoomChange(0.75)}
            className={`px-3 py-1 rounded ${scale === 0.75 ? 'bg-amber-600 text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            75%
          </button>
          <button
            onClick={() => handleZoomChange(1)}
            className={`px-3 py-1 rounded ${scale === 1 ? 'bg-amber-600 text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            100%
          </button>
        </div>
      </div>

      <div className="border-2 border-gray-200 rounded-lg overflow-hidden bg-gray-50">
        <div
          className="origin-top-left"
          style={{
            transform: `scale(${scale})`,
            width: `${100 / scale}%`,
            height: `${600 / scale}px`,
          }}
        >
          <iframe
            ref={iframeRef}
            src="/preview"
            className="w-full h-full border-0"
            title="Website Preview"
          />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span>Live Preview Active</span>
        </div>
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-amber-600 hover:text-amber-700 font-medium"
        >
          Open in New Tab →
        </a>
      </div>
    </div>
  );
}

