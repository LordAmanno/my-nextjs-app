'use client';

import { useEffect, useState } from 'react';
import { siteConfig } from '@/config/site-config';

interface MinimalLayoutProps {
  previewContent?: any;
}

export default function MinimalLayout({ previewContent }: MinimalLayoutProps = {}) {
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
    <div className="font-light bg-white">
      {/* Centered minimal navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <nav className="flex justify-center items-center space-x-12 text-sm uppercase tracking-widest">
            <a href="#hero" className="hover:text-amber-600 transition-colors">Home</a>
            <a href="#about" className="hover:text-amber-600 transition-colors">Story</a>
            <div className="text-2xl font-normal">☕</div>
            <a href="#menu" className="hover:text-amber-600 transition-colors">Menu</a>
            <a href="#contact" className="hover:text-amber-600 transition-colors">Visit</a>
          </nav>
        </div>
      </header>

      {/* Minimal hero - lots of whitespace */}
      <section id="hero" className="min-h-screen flex items-center justify-center pt-24 px-6">
        <div className="max-w-2xl text-center">
          <h1 className="text-6xl md:text-7xl font-thin mb-8 tracking-tight">{hero.title}</h1>
          <p className="text-2xl text-gray-600 mb-6 font-light">{hero.subtitle}</p>
          <p className="text-lg text-gray-500 mb-12 leading-relaxed">{hero.description}</p>
          <a href={hero.ctaButton.link} className="inline-block px-12 py-4 border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition-all uppercase text-sm tracking-widest">
            {hero.ctaButton.text}
          </a>
        </div>
      </section>

      {/* Narrow content column with lots of spacing */}
      <div className="max-w-2xl mx-auto px-6 space-y-40 py-32">
        {/* About - centered */}
        <section id="about" className="text-center space-y-8">
          <h2 className="text-4xl font-thin tracking-tight">{about.title}</h2>
          <p className="text-xl text-amber-600 font-light">{about.subtitle}</p>
          <p className="text-gray-600 leading-relaxed text-lg">{about.description}</p>
        </section>

        {/* Menu - simple list */}
        <section id="menu" className="space-y-12">
          <h2 className="text-4xl font-thin text-center tracking-tight">Menu</h2>
          <div className="space-y-8">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="border-b border-gray-200 pb-6">
                <div className="flex justify-between items-baseline mb-2">
                  <h3 className="text-2xl font-light">Coffee Item {item}</h3>
                  <span className="text-xl text-gray-600">$4.99</span>
                </div>
                <p className="text-gray-500">Premium coffee blend with rich flavor</p>
              </div>
            ))}
          </div>
        </section>

        {/* Gallery - simple grid */}
        <section id="gallery" className="space-y-12">
          <h2 className="text-4xl font-thin text-center tracking-tight">Gallery</h2>
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="aspect-square bg-gray-100"></div>
            ))}
          </div>
        </section>

        {/* Testimonials - minimal quotes */}
        <section id="testimonials" className="space-y-16">
          <h2 className="text-4xl font-thin text-center tracking-tight">Testimonials</h2>
          {[1, 2, 3].map((item) => (
            <div key={item} className="text-center space-y-4">
              <p className="text-xl text-gray-600 italic leading-relaxed">
                "Exceptional coffee experience with attention to every detail."
              </p>
              <p className="text-sm uppercase tracking-widest text-gray-400">— Customer {item}</p>
            </div>
          ))}
        </section>
      </div>

      {/* Contact - minimal footer */}
      <footer id="contact" className="border-t border-gray-200 mt-40 py-20">
        <div className="max-w-2xl mx-auto px-6 text-center space-y-12">
          <h2 className="text-4xl font-thin tracking-tight">{contact.title}</h2>
          <div className="space-y-6 text-gray-600">
            <p className="text-lg">{contact.phone}</p>
            <p className="text-lg">{contact.email}</p>
            <p className="text-lg">{typeof contact.address === 'string' ? contact.address : `${contact.address.street}, ${contact.address.city}, ${contact.address.state} ${contact.address.zip}`}</p>
          </div>
          <div className="pt-12 text-sm text-gray-400 uppercase tracking-widest">
            © 2024 Aroma Coffee
          </div>
        </div>
      </footer>
    </div>
  );
}

