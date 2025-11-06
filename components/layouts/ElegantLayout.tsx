'use client';

import { useEffect, useState } from 'react';
import { siteConfig } from '@/config/site-config';

interface ElegantLayoutProps {
  previewContent?: any;
}

export default function ElegantLayout({ previewContent }: ElegantLayoutProps = {}) {
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
    <div className="font-serif tracking-wide bg-white">
      {/* Elegant header with gold accents */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/90 to-black/70 backdrop-blur-sm text-white">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="text-3xl font-light tracking-widest">AROMA</div>
            <nav className="hidden md:flex space-x-10 text-sm uppercase tracking-widest">
              <a href="#hero" className="hover:text-amber-400 transition-colors">Home</a>
              <a href="#about" className="hover:text-amber-400 transition-colors">Our Story</a>
              <a href="#menu" className="hover:text-amber-400 transition-colors">Menu</a>
              <a href="#gallery" className="hover:text-amber-400 transition-colors">Gallery</a>
              <a href="#contact" className="hover:text-amber-400 transition-colors">Contact</a>
            </nav>
            <button className="px-8 py-3 border-2 border-amber-400 text-amber-400 hover:bg-amber-400 hover:text-black transition-all uppercase text-sm tracking-wider">
              Reserve
            </button>
          </div>
        </div>
      </header>

      {/* Hero with elegant overlay */}
      <section id="hero" className="relative h-screen flex items-center justify-center">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url('${hero.backgroundImage}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60"></div>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-8 text-center text-white">
          <div className="mb-8">
            <div className="h-px w-32 bg-amber-400 mx-auto mb-8"></div>
            <h1 className="text-6xl md:text-7xl font-light tracking-widest uppercase mb-6">{hero.title}</h1>
            <div className="h-px w-32 bg-amber-400 mx-auto mt-8"></div>
          </div>
          <p className="text-2xl font-light mb-6 tracking-wide">{hero.subtitle}</p>
          <p className="text-lg mb-12 max-w-2xl mx-auto leading-relaxed">{hero.description}</p>
          <a href={hero.ctaButton.link} className="inline-block px-12 py-4 border-2 border-amber-400 text-amber-400 hover:bg-amber-400 hover:text-black transition-all uppercase text-sm tracking-widest">
            {hero.ctaButton.text}
          </a>
        </div>
      </section>

      {/* About with elegant layout */}
      <section id="about" className="relative py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-white to-amber-50"></div>
        <div className="relative max-w-6xl mx-auto px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="aspect-square bg-gradient-to-br from-amber-300 to-amber-600 rounded-sm"></div>
            <div>
              <div className="h-px w-20 bg-amber-600 mb-6"></div>
              <h2 className="text-5xl font-light tracking-widest uppercase mb-6">{about.title}</h2>
              <p className="text-xl text-amber-600 mb-6 font-light italic">{about.subtitle}</p>
              <p className="text-gray-700 leading-relaxed text-lg">{about.description}</p>
              <div className="h-px w-20 bg-amber-600 mt-6"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Menu with elegant presentation */}
      <section id="menu" className="bg-white py-32">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-20">
            <div className="inline-block">
              <div className="h-px w-24 bg-amber-600 mb-6 mx-auto"></div>
              <h2 className="text-5xl font-light tracking-widest uppercase">Our Menu</h2>
              <div className="h-px w-24 bg-amber-600 mt-6 mx-auto"></div>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-12">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="border-b border-gray-200 pb-6">
                <div className="flex justify-between items-baseline mb-3">
                  <h3 className="text-2xl font-light tracking-wide">Coffee Item {item}</h3>
                  <span className="text-2xl text-amber-600 font-light">$4.99</span>
                </div>
                <p className="text-gray-600 italic">Exquisite blend with refined taste</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery with elegant frames */}
      <section id="gallery" className="bg-gray-900 text-white py-32">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-20">
            <div className="h-px w-24 bg-amber-400 mb-6 mx-auto"></div>
            <h2 className="text-5xl font-light tracking-widest uppercase">Gallery</h2>
            <div className="h-px w-24 bg-amber-400 mt-6 mx-auto"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <div key={item} className="aspect-square bg-gradient-to-br from-amber-600 to-orange-700 border-4 border-amber-400/20"></div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials with elegant quotes */}
      <section id="testimonials" className="bg-gradient-to-br from-amber-50 via-white to-amber-50 py-32">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-20">
            <div className="h-px w-24 bg-amber-600 mb-6 mx-auto"></div>
            <h2 className="text-5xl font-light tracking-widest uppercase">Testimonials</h2>
            <div className="h-px w-24 bg-amber-600 mt-6 mx-auto"></div>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            {[1, 2, 3].map((item) => (
              <div key={item} className="text-center">
                <div className="text-6xl text-amber-600 mb-4">"</div>
                <p className="text-xl text-gray-700 italic mb-6 leading-relaxed">
                  An extraordinary experience with impeccable attention to detail and exceptional quality.
                </p>
                <div className="h-px w-16 bg-amber-600 mx-auto mb-4"></div>
                <p className="uppercase tracking-widest text-sm text-gray-600">Customer {item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact with elegant footer */}
      <footer id="contact" className="bg-black text-white">
        <div className="max-w-6xl mx-auto px-8 py-32">
          <div className="text-center mb-16">
            <div className="h-px w-24 bg-amber-400 mb-6 mx-auto"></div>
            <h2 className="text-5xl font-light tracking-widest uppercase">{contact.title}</h2>
            <div className="h-px w-24 bg-amber-400 mt-6 mx-auto"></div>
          </div>
          <div className="grid md:grid-cols-3 gap-12 text-center">
            <div>
              <p className="text-amber-400 uppercase tracking-widest text-sm mb-4">Phone</p>
              <p className="text-xl font-light">{contact.phone}</p>
            </div>
            <div>
              <p className="text-amber-400 uppercase tracking-widest text-sm mb-4">Email</p>
              <p className="text-xl font-light">{contact.email}</p>
            </div>
            <div>
              <p className="text-amber-400 uppercase tracking-widest text-sm mb-4">Address</p>
              <p className="text-xl font-light">{typeof contact.address === 'string' ? contact.address : `${contact.address.street}, ${contact.address.city}, ${contact.address.state} ${contact.address.zip}`}</p>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 py-8">
          <div className="max-w-7xl mx-auto px-8 text-center text-sm text-gray-400 tracking-widest">
            <p>© 2024 AROMA COFFEE HOUSE. ALL RIGHTS RESERVED.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

