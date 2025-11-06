'use client';

import { useEffect, useState } from 'react';
import { siteConfig } from '@/config/site-config';

interface ModernLayoutProps {
  previewContent?: any;
}

export default function ModernLayout({ previewContent }: ModernLayoutProps = {}) {
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
    <div className="font-sans">
      {/* Side navigation - fixed left */}
      <aside className="hidden lg:block fixed left-0 top-0 h-screen w-20 bg-gray-900 z-50">
        <div className="flex flex-col items-center py-8 space-y-8">
          <div className="text-3xl">☕</div>
          <nav className="flex flex-col space-y-6 items-center">
            <a href="#hero" className="text-white hover:text-amber-400 text-xs rotate-90 whitespace-nowrap">Home</a>
            <a href="#about" className="text-white hover:text-amber-400 text-xs rotate-90 whitespace-nowrap">About</a>
            <a href="#menu" className="text-white hover:text-amber-400 text-xs rotate-90 whitespace-nowrap">Menu</a>
            <a href="#gallery" className="text-white hover:text-amber-400 text-xs rotate-90 whitespace-nowrap">Gallery</a>
            <a href="#contact" className="text-white hover:text-amber-400 text-xs rotate-90 whitespace-nowrap">Contact</a>
          </nav>
        </div>
      </aside>

      {/* Main content with left margin */}
      <div className="lg:ml-20">
        {/* Minimal top header */}
        <header className="fixed top-0 right-0 left-0 lg:left-20 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <div className="text-2xl font-bold">Aroma</div>
            <button className="px-6 py-2 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors">
              Order Now
            </button>
          </div>
        </header>

        {/* Hero - Full viewport */}
        <section id="hero" className="relative h-screen flex items-center justify-center">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url('${hero.backgroundImage}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="absolute inset-0 bg-black/40"></div>
          </div>
          <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white">
            <h1 className="text-7xl font-black mb-6">{hero.title}</h1>
            <p className="text-2xl mb-4">{hero.subtitle}</p>
            <p className="text-lg mb-12">{hero.description}</p>
            <a href={hero.ctaButton.link} className="inline-block px-10 py-4 bg-white text-gray-900 font-bold rounded-full hover:scale-105 transition-transform">
              {hero.ctaButton.text}
            </a>
          </div>
        </section>

        {/* Two-column About + Menu */}
        <div className="grid lg:grid-cols-2">
          {/* About Section */}
          <section id="about" className="bg-amber-50 p-12 lg:p-20 flex items-center">
            <div>
              <h2 className="text-5xl font-bold text-gray-900 mb-6">{about.title}</h2>
              <p className="text-xl text-amber-600 mb-6">{about.subtitle}</p>
              <p className="text-gray-700 text-lg leading-relaxed">{about.description}</p>
            </div>
          </section>

          {/* Menu Section */}
          <section id="menu" className="bg-white p-12 lg:p-20">
            <h2 className="text-4xl font-bold text-gray-900 mb-8">Menu Highlights</h2>
            <div className="space-y-6">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="w-20 h-20 bg-gradient-to-br from-amber-300 to-amber-500 rounded-lg flex-shrink-0"></div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold">Coffee Item {item}</h3>
                    <p className="text-gray-600">Premium blend</p>
                  </div>
                  <p className="text-2xl font-bold text-amber-600">$4.99</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Gallery - Masonry style */}
        <section id="gallery" className="bg-gray-900 py-20">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-4xl font-bold text-white text-center mb-12">Gallery</h2>
            <div className="columns-2 md:columns-3 lg:columns-4 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
                <div
                  key={item}
                  className="mb-4 break-inside-avoid bg-gradient-to-br from-amber-400 to-orange-600 rounded-lg"
                  style={{ height: `${200 + (item % 3) * 100}px` }}
                ></div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials - Card style */}
        <section id="testimonials" className="bg-gray-50 py-20">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">Customer Reviews</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div key={item} className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full mr-3"></div>
                    <div>
                      <p className="font-bold">Customer {item}</p>
                      <div className="text-amber-500">★★★★★</div>
                    </div>
                  </div>
                  <p className="text-gray-700">"Exceptional coffee and service!"</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact - Dark theme */}
        <section id="contact" className="bg-gray-900 text-white py-20">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h2 className="text-5xl font-bold mb-8">{contact.title}</h2>
                <div className="space-y-6">
                  <div>
                    <p className="text-amber-400 font-bold mb-2">Phone</p>
                    <p className="text-xl">{contact.phone}</p>
                  </div>
                  <div>
                    <p className="text-amber-400 font-bold mb-2">Email</p>
                    <p className="text-xl">{contact.email}</p>
                  </div>
                  <div>
                    <p className="text-amber-400 font-bold mb-2">Address</p>
                    <p className="text-xl">{typeof contact.address === 'string' ? contact.address : `${contact.address.street}, ${contact.address.city}, ${contact.address.state} ${contact.address.zip}`}</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-800 p-8 rounded-2xl">
                <h3 className="text-2xl font-bold mb-6">Send us a message</h3>
                <form className="space-y-4">
                  <input type="text" placeholder="Name" className="w-full px-4 py-3 bg-gray-700 rounded-lg text-white" />
                  <input type="email" placeholder="Email" className="w-full px-4 py-3 bg-gray-700 rounded-lg text-white" />
                  <textarea placeholder="Message" rows={4} className="w-full px-4 py-3 bg-gray-700 rounded-lg text-white"></textarea>
                  <button className="w-full px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg transition-colors">
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

