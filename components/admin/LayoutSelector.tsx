'use client';

interface LayoutOption {
  id: 'classic' | 'modern' | 'minimal' | 'elegant' | 'bold';
  name: string;
  description: string;
  preview: string;
}

const layouts: LayoutOption[] = [
  {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional coffee shop layout with warm colors and comfortable spacing',
    preview: '🏛️',
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Clean, contemporary design with bold typography and minimalist elements',
    preview: '🎨',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Simple and elegant with lots of white space and subtle accents',
    preview: '✨',
  },
  {
    id: 'elegant',
    name: 'Elegant',
    description: 'Sophisticated design with refined details and premium feel',
    preview: '👑',
  },
  {
    id: 'bold',
    name: 'Bold',
    description: 'Eye-catching design with vibrant colors and dynamic layouts',
    preview: '⚡',
  },
];

interface LayoutSelectorProps {
  selectedLayout: string;
  onLayoutChange: (layoutId: string) => void;
}

export default function LayoutSelector({ selectedLayout, onLayoutChange }: LayoutSelectorProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Choose Layout Template</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {layouts.map((layout) => (
          <button
            key={layout.id}
            onClick={() => onLayoutChange(layout.id)}
            className={`p-6 rounded-xl border-2 transition-all text-left ${
              selectedLayout === layout.id
                ? 'border-amber-600 bg-amber-50 shadow-lg'
                : 'border-gray-200 hover:border-amber-300 hover:shadow-md'
            }`}
          >
            <div className="text-4xl mb-3">{layout.preview}</div>
            <h4 className="font-bold text-gray-900 mb-2">{layout.name}</h4>
            <p className="text-sm text-gray-600">{layout.description}</p>
            {selectedLayout === layout.id && (
              <div className="mt-3 text-amber-600 font-semibold text-sm">✓ Active</div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

