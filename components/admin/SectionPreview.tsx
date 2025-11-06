'use client';

import { useEffect, useRef } from 'react';

interface SectionPreviewProps {
  sections: Record<string, any>;
}

export default function SectionPreview({ sections }: SectionPreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        { type: 'UPDATE_SECTIONS', sections },
        '*'
      );
    }
  }, [sections]);

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sticky top-24">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Live Preview</h3>
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-amber-600 hover:text-amber-700 font-medium"
        >
          Open Full Site →
        </a>
      </div>

      <div className="border-2 border-gray-200 rounded-lg overflow-hidden bg-gray-50">
        <iframe
          ref={iframeRef}
          src="/preview"
          className="w-full h-[600px] border-0"
          title="Website Preview"
        />
      </div>

      <div className="mt-4 flex items-center justify-center text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span>Live Preview Active</span>
        </div>
      </div>
    </div>
  );
}

