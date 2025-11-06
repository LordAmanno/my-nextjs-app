'use client';

import { useState } from 'react';

interface SectionBuilderProps {
  sections: Record<string, any>;
  onSectionChange: (sectionName: string, field: string, value: any) => void;
}

export default function SectionBuilder({ sections, onSectionChange }: SectionBuilderProps) {
  const [activeSection, setActiveSection] = useState('hero');
  const [activeTab, setActiveTab] = useState<'design' | 'content' | 'style'>('design');

  const sectionNames = ['hero', 'about', 'contact'];
  
  const designVariants = {
    hero: [
      { id: 'variant1', name: 'Centered Classic', description: 'Full-screen centered hero with gradient background' },
      { id: 'variant2', name: 'Split Layout', description: 'Two-column layout with image placeholder' },
      { id: 'variant3', name: 'Bold Minimal', description: 'Bottom-aligned with dot pattern background' },
    ],
    about: [
      { id: 'variant1', name: 'Card Grid', description: 'Feature cards in a grid layout' },
      { id: 'variant2', name: 'Image + Text', description: 'Side-by-side image and content' },
      { id: 'variant3', name: 'List Style', description: 'Vertical list with accent border' },
    ],
    contact: [
      { id: 'variant1', name: 'Card Grid', description: 'Contact info in card grid' },
      { id: 'variant2', name: 'Two Column', description: 'Info on left, hours on right' },
      { id: 'variant3', name: 'Centered Card', description: 'All info in centered card' },
    ],
  };

  const currentSection = sections[activeSection] || {
    design_variant: 'variant1',
    content: {},
    styles: { backgroundColor: '#ffffff', textColor: '#000000', accentColor: '#d4a574' },
  };

  const renderDesignSelector = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Design</h3>
      <div className="grid gap-4">
        {designVariants[activeSection as keyof typeof designVariants]?.map((variant) => (
          <button
            key={variant.id}
            onClick={() => onSectionChange(activeSection, 'design_variant', variant.id)}
            className={`p-6 rounded-xl text-left transition-all border-2 ${
              currentSection.design_variant === variant.id
                ? 'border-amber-600 bg-amber-50'
                : 'border-gray-200 hover:border-amber-300 bg-white'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-bold text-lg mb-1">{variant.name}</h4>
                <p className="text-sm text-gray-600">{variant.description}</p>
              </div>
              {currentSection.design_variant === variant.id && (
                <div className="text-amber-600 text-2xl">✓</div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const renderContentEditor = () => {
    if (activeSection === 'hero') {
      return (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Content</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <input
              type="text"
              value={currentSection.content.title || ''}
              onChange={(e) => onSectionChange(activeSection, 'content.title', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
            <input
              type="text"
              value={currentSection.content.subtitle || ''}
              onChange={(e) => onSectionChange(activeSection, 'content.subtitle', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={currentSection.content.description || ''}
              onChange={(e) => onSectionChange(activeSection, 'content.description', e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Primary Button</label>
            <input
              type="text"
              value={currentSection.content.primaryButton || ''}
              onChange={(e) => onSectionChange(activeSection, 'content.primaryButton', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Button</label>
            <input
              type="text"
              value={currentSection.content.secondaryButton || ''}
              onChange={(e) => onSectionChange(activeSection, 'content.secondaryButton', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>
        </div>
      );
    }

    if (activeSection === 'about') {
      return (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Content</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <input
              type="text"
              value={currentSection.content.title || ''}
              onChange={(e) => onSectionChange(activeSection, 'content.title', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Story</label>
            <textarea
              value={currentSection.content.story || ''}
              onChange={(e) => onSectionChange(activeSection, 'content.story', e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>

          <div className="text-sm text-gray-600 p-4 bg-gray-50 rounded-lg">
            Features editing coming soon. Currently using default features from config.
          </div>
        </div>
      );
    }

    if (activeSection === 'contact') {
      return (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Content</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <input
              type="text"
              value={currentSection.content.title || ''}
              onChange={(e) => onSectionChange(activeSection, 'content.title', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
            <input
              type="text"
              value={currentSection.content.phone || ''}
              onChange={(e) => onSectionChange(activeSection, 'content.phone', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={currentSection.content.email || ''}
              onChange={(e) => onSectionChange(activeSection, 'content.email', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>

          <div className="text-sm text-gray-600 p-4 bg-gray-50 rounded-lg">
            Address and hours editing coming soon. Currently using default values from config.
          </div>
        </div>
      );
    }

    return null;
  };

  const renderStyleEditor = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Customize Colors</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Background Color</label>
        <div className="flex gap-3">
          <input
            type="color"
            value={currentSection.styles.backgroundColor}
            onChange={(e) => onSectionChange(activeSection, 'styles.backgroundColor', e.target.value)}
            className="h-12 w-20 rounded-lg border border-gray-300 cursor-pointer"
          />
          <input
            type="text"
            value={currentSection.styles.backgroundColor}
            onChange={(e) => onSectionChange(activeSection, 'styles.backgroundColor', e.target.value)}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent font-mono"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Text Color</label>
        <div className="flex gap-3">
          <input
            type="color"
            value={currentSection.styles.textColor}
            onChange={(e) => onSectionChange(activeSection, 'styles.textColor', e.target.value)}
            className="h-12 w-20 rounded-lg border border-gray-300 cursor-pointer"
          />
          <input
            type="text"
            value={currentSection.styles.textColor}
            onChange={(e) => onSectionChange(activeSection, 'styles.textColor', e.target.value)}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent font-mono"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Accent Color</label>
        <div className="flex gap-3">
          <input
            type="color"
            value={currentSection.styles.accentColor}
            onChange={(e) => onSectionChange(activeSection, 'styles.accentColor', e.target.value)}
            className="h-12 w-20 rounded-lg border border-gray-300 cursor-pointer"
          />
          <input
            type="text"
            value={currentSection.styles.accentColor}
            onChange={(e) => onSectionChange(activeSection, 'styles.accentColor', e.target.value)}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent font-mono"
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-lg">
      <div className="border-b border-gray-200">
        <div className="flex overflow-x-auto">
          {sectionNames.map((section) => (
            <button
              key={section}
              onClick={() => setActiveSection(section)}
              className={`px-6 py-4 font-semibold capitalize whitespace-nowrap transition-colors ${
                activeSection === section
                  ? 'text-amber-600 border-b-2 border-amber-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {section}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('design')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'design'
                ? 'bg-amber-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            🎨 Design
          </button>
          <button
            onClick={() => setActiveTab('content')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'content'
                ? 'bg-amber-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            ✏️ Content
          </button>
          <button
            onClick={() => setActiveTab('style')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'style'
                ? 'bg-amber-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            🎨 Colors
          </button>
        </div>

        <div className="max-h-[600px] overflow-y-auto pr-2">
          {activeTab === 'design' && renderDesignSelector()}
          {activeTab === 'content' && renderContentEditor()}
          {activeTab === 'style' && renderStyleEditor()}
        </div>
      </div>
    </div>
  );
}

