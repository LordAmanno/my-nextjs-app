'use client';

import { useEffect, useState } from 'react';
import { siteConfig } from '@/config/site-config';

interface BoldLayoutProps {
  previewContent?: any;
}

export default function BoldLayout({ previewContent }: BoldLayoutProps = {}) {
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
    <div className="font-black overflow-x-hidden">
      {/* Bold diagonal header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white shadow-2xl">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="text-4xl font-black transform -skew-x-12">AROMA</div>
            <nav className="hidden md:flex space-x-8 text-lg font-bold uppercase">
              <a href="#hero" className="hover:scale-110 transition-transform">Home</a>
              <a href="#about" className="hover:scale-110 transition-transform">About</a>
              <a href="#menu" className="hover:scale-110 transition-transform">Menu</a>
              <a href="#gallery" className="hover:scale-110 transition-transform">Gallery</a>
              <a href="#contact" className="hover:scale-110 transition-transform">Contact</a>
            </nav>
            <button className="px-8 py-3 bg-black text-white font-bold uppercase hover:scale-105 transition-transform shadow-lg">
              Order
            </button>
          </div>
        </div>
      </header>

      {/* Hero with bold colors */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center pt-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url('${hero.backgroundImage}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/50 via-orange-600/50 to-pink-600/50"></div>
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center text-white">
          <h1 className="text-7xl md:text-8xl font-black mb-8 transform -skew-x-6 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent drop-shadow-2xl">
            {hero.title}
          </h1>
          <p className="text-3xl font-bold mb-6 text-yellow-300">{hero.subtitle}</p>
          <p className="text-xl mb-12 font-semibold">{hero.description}</p>
          <a href={hero.ctaButton.link} className="inline-block px-12 py-5 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-black uppercase text-lg hover:scale-110 transition-transform shadow-2xl rounded-lg">
            {hero.ctaButton.text}
          </a>
        </div>
      </section>

      {/* Diagonal sections with bold colors */}
      <div className="relative">
        {/* About - diagonal yellow/orange */}
        <section id="about" className="relative bg-gradient-to-br from-yellow-400 to-orange-500 text-black py-32 transform -skew-y-3">
          <div className="transform skew-y-3 max-w-6xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-6xl font-black mb-6 transform -skew-x-6">{about.title}</h2>
                <p className="text-2xl font-bold mb-6">{about.subtitle}</p>
                <p className="text-lg font-semibold leading-relaxed">{about.description}</p>
              </div>
              <div className="aspect-square bg-gradient-to-br from-red-500 to-pink-600 transform rotate-6 shadow-2xl"></div>
            </div>
          </div>
        </section>

        {/* Menu - diagonal black */}
        <section id="menu" className="relative bg-black text-white py-32 transform skew-y-3">
          <div className="transform -skew-y-3 max-w-7xl mx-auto px-6">
            <h2 className="text-6xl font-black text-center mb-16 transform -skew-x-6 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              MENU
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div key={item} className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 transform hover:scale-105 transition-transform shadow-2xl border-4 border-orange-500">
                  <div className="h-40 bg-gradient-to-br from-yellow-400 to-red-500 mb-4 transform -rotate-3"></div>
                  <h3 className="text-2xl font-black mb-2 text-yellow-400">ITEM {item}</h3>
                  <p className="font-bold mb-4">Bold coffee flavor</p>
                  <p className="text-3xl font-black text-orange-500">$4.99</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Gallery - diagonal red/pink */}
        <section id="gallery" className="relative bg-gradient-to-br from-red-500 to-pink-500 py-32 transform -skew-y-3">
          <div className="transform skew-y-3 max-w-7xl mx-auto px-6">
            <h2 className="text-6xl font-black text-center mb-16 text-white transform -skew-x-6">GALLERY</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                <div
                  key={item}
                  className="aspect-square bg-gradient-to-br from-purple-600 to-blue-600 transform hover:rotate-6 transition-transform shadow-2xl border-4 border-white"
                ></div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials - diagonal blue/purple */}
        <section id="testimonials" className="relative bg-gradient-to-br from-blue-500 to-purple-600 text-white py-32 transform skew-y-3">
          <div className="transform -skew-y-3 max-w-6xl mx-auto px-6">
            <h2 className="text-6xl font-black text-center mb-16 transform -skew-x-6">REVIEWS</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3].map((item) => (
                <div key={item} className="bg-white/10 backdrop-blur-lg p-8 transform hover:scale-105 transition-transform border-4 border-yellow-400">
                  <div className="flex items-center mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mr-4"></div>
                    <div>
                      <p className="font-black text-xl">CUSTOMER {item}</p>
                      <p className="text-yellow-400 font-bold">★★★★★</p>
                    </div>
                  </div>
                  <p className="font-bold text-lg">"AMAZING BOLD EXPERIENCE!"</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact - diagonal dark */}
        <section id="contact" className="relative bg-gradient-to-br from-gray-900 to-black text-white py-32 transform -skew-y-3">
          <div className="transform skew-y-3 max-w-6xl mx-auto px-6 text-center">
            <h2 className="text-6xl font-black mb-12 transform -skew-x-6 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              {contact.title}
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-orange-500 to-red-500 p-8 transform hover:scale-105 transition-transform">
                <p className="text-2xl font-black mb-4">PHONE</p>
                <p className="text-xl font-bold">{contact.phone}</p>
              </div>
              <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-8 transform hover:scale-105 transition-transform text-black">
                <p className="text-2xl font-black mb-4">EMAIL</p>
                <p className="text-xl font-bold">{contact.email}</p>
              </div>
              <div className="bg-gradient-to-br from-red-500 to-pink-500 p-8 transform hover:scale-105 transition-transform">
                <p className="text-2xl font-black mb-4">ADDRESS</p>
                <p className="text-xl font-bold">{typeof contact.address === 'string' ? contact.address : `${contact.address.street}, ${contact.address.city}, ${contact.address.state} ${contact.address.zip}`}</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Bold footer bar */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center text-white">
          <p className="text-xl font-black uppercase tracking-widest">© 2024 AROMA - BOLD COFFEE EXPERIENCE</p>
        </div>
      </div>
    </div>
  );
}

