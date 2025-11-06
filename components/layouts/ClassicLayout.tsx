'use client';

import { useEffect, useState } from 'react';
import { siteConfig } from '@/config/site-config';

interface ClassicLayoutProps {
  previewContent?: any;
}

export default function ClassicLayout({ previewContent }: ClassicLayoutProps = {}) {
  const [content, setContent] = useState(siteConfig);

  useEffect(() => {
    // If previewContent is provided (from admin preview), use it
    if (previewContent) {
      setContent({ ...siteConfig, ...previewContent });
      return;
    }

    // Otherwise fetch from API (for main website)
    async function fetchContent() {
      try {
        const response = await fetch('/api/content');
        if (response.ok) {
          const data = await response.json();
          setContent({ ...siteConfig, ...data });
        }
      } catch (error) {
        console.error('Error fetching content:', error);
      }
    }
    fetchContent();
  }, [previewContent]);

  const { hero, about, contact } = content;

  return (
    <div className="font-serif">
      {/* Traditional Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold text-amber-800">☕ Aroma Coffee</div>
            <nav className="hidden md:flex space-x-8">
              <a href="#hero" className="text-gray-700 hover:text-amber-600 transition-colors">Home</a>
              <a href="#about" className="text-gray-700 hover:text-amber-600 transition-colors">About</a>
              <a href="#menu" className="text-gray-700 hover:text-amber-600 transition-colors">Menu</a>
              <a href="#gallery" className="text-gray-700 hover:text-amber-600 transition-colors">Gallery</a>
              <a href="#contact" className="text-gray-700 hover:text-amber-600 transition-colors">Contact</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center pt-20">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('${hero.backgroundImage}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-amber-900 via-amber-800 to-amber-950 opacity-90"></div>
        </div>
        <div className="relative z-10 container mx-auto px-6 text-center">
          <h1 className="text-6xl lg:text-7xl font-bold text-white mb-6">{hero.title}</h1>
          <p className="text-3xl text-amber-100 mb-4">{hero.subtitle}</p>
          <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto">{hero.description}</p>
          <div className="flex gap-4 justify-center">
            <a href={hero.ctaButton.link} className="px-8 py-4 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-full transition-all">
              {hero.ctaButton.text}
            </a>
            <a href={hero.secondaryButton.link} className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-full border-2 border-white/30">
              {hero.secondaryButton.text}
            </a>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{about.title}</h2>
            <p className="text-xl text-amber-600">{about.subtitle}</p>
          </div>
          <div className="prose prose-lg max-w-3xl mx-auto text-center">
            <p className="text-gray-700">{about.description}</p>
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section id="menu" className="py-20 bg-amber-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">Our Menu</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
                <div className="h-48 bg-gradient-to-br from-amber-200 to-amber-400 rounded-lg mb-4"></div>
                <h3 className="text-xl font-bold mb-2">Coffee Item {item}</h3>
                <p className="text-gray-600 mb-4">Delicious coffee description</p>
                <p className="text-2xl font-bold text-amber-600">$4.99</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">Gallery</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <div key={item} className="aspect-square bg-gradient-to-br from-amber-300 to-amber-600 rounded-lg hover:scale-105 transition-transform"></div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">What Our Customers Say</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-white p-8 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-amber-400 rounded-full mr-4"></div>
                  <div>
                    <p className="font-bold">Customer {item}</p>
                    <p className="text-sm text-gray-600">Coffee Lover</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">"Amazing coffee and great atmosphere!"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-amber-900 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-8">{contact.title}</h2>
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div>
              <p className="text-xl font-bold mb-2">Phone</p>
              <p>{contact.phone}</p>
            </div>
            <div>
              <p className="text-xl font-bold mb-2">Email</p>
              <p>{contact.email}</p>
            </div>
            <div>
              <p className="text-xl font-bold mb-2">Address</p>
              <p>{typeof contact.address === 'string' ? contact.address : `${contact.address.street}, ${contact.address.city}, ${contact.address.state} ${contact.address.zip}`}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

