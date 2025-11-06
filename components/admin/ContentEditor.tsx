'use client';

import { useState } from 'react';

interface ContentEditorProps {
  content: any;
  onContentChange: (path: string, value: any) => void;
}

export default function ContentEditor({ content, onContentChange }: ContentEditorProps) {
  const [activeSection, setActiveSection] = useState('hero');

  const sections = [
    { id: 'hero', name: 'Hero Section', icon: '🎯' },
    { id: 'about', name: 'About', icon: '📖' },
    { id: 'menu', name: 'Menu', icon: '☕' },
    { id: 'gallery', name: 'Gallery', icon: '🖼️' },
    { id: 'testimonials', name: 'Testimonials', icon: '💬' },
    { id: 'contact', name: 'Contact', icon: '📞' },
  ];

  const renderHeroEditor = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
        <input
          type="text"
          value={content.hero?.title || ''}
          onChange={(e) => onContentChange('hero.title', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
        <input
          type="text"
          value={content.hero?.subtitle || ''}
          onChange={(e) => onContentChange('hero.subtitle', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
        <textarea
          value={content.hero?.description || ''}
          onChange={(e) => onContentChange('hero.description', e.target.value)}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Background Image URL</label>
        <input
          type="text"
          value={content.hero?.backgroundImage || ''}
          onChange={(e) => onContentChange('hero.backgroundImage', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          placeholder="https://example.com/image.jpg"
        />
      </div>
    </div>
  );

  const renderAboutEditor = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
        <input
          type="text"
          value={content.about?.title || ''}
          onChange={(e) => onContentChange('about.title', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
        <input
          type="text"
          value={content.about?.subtitle || ''}
          onChange={(e) => onContentChange('about.subtitle', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
        <textarea
          value={content.about?.description || ''}
          onChange={(e) => onContentChange('about.description', e.target.value)}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
        />
      </div>
    </div>
  );

  const renderContactEditor = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
        <input
          type="text"
          value={content.contact?.phone || ''}
          onChange={(e) => onContentChange('contact.phone', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
        <input
          type="email"
          value={content.contact?.email || ''}
          onChange={(e) => onContentChange('contact.email', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
        <input
          type="text"
          value={content.contact?.address?.street || ''}
          onChange={(e) => onContentChange('contact.address.street', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
          <input
            type="text"
            value={content.contact?.address?.city || ''}
            onChange={(e) => onContentChange('contact.address.city', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
          <input
            type="text"
            value={content.contact?.address?.state || ''}
            onChange={(e) => onContentChange('contact.address.state', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );

  const renderSectionEditor = () => {
    switch (activeSection) {
      case 'hero':
        return renderHeroEditor();
      case 'about':
        return renderAboutEditor();
      case 'contact':
        return renderContactEditor();
      default:
        return (
          <div className="text-center py-12 text-gray-500">
            <p>Select a section to edit</p>
          </div>
        );
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Content</h3>
      
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
              activeSection === section.id
                ? 'bg-amber-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span className="mr-2">{section.icon}</span>
            {section.name}
          </button>
        ))}
      </div>

      <div className="max-h-96 overflow-y-auto">
        {renderSectionEditor()}
      </div>
    </div>
  );
}

