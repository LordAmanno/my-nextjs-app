"use client";

import { siteConfig } from "@/config/site-config";
import Header from "./Header";

export default function Hero() {
  const { hero } = siteConfig;

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center">
      <Header />
      
      {/* Background Image Placeholder */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('${hero.backgroundImage}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Fallback gradient if image doesn't load */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900 via-amber-800 to-amber-950 opacity-90"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            {hero.title}
          </h1>
          <p className="text-2xl sm:text-3xl text-amber-100 mb-4 font-light">
            {hero.subtitle}
          </p>
          <p className="text-lg sm:text-xl text-white/90 mb-12 max-w-2xl mx-auto">
            {hero.description}
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href={hero.ctaButton.link}
              className="px-8 py-4 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-full transition-all transform hover:scale-105 shadow-lg w-full sm:w-auto"
            >
              {hero.ctaButton.text}
            </a>
            <a
              href={hero.secondaryButton.link}
              className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-full transition-all backdrop-blur-sm border-2 border-white/30 w-full sm:w-auto"
            >
              {hero.secondaryButton.text}
            </a>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <a href="#about" className="flex flex-col items-center text-white/80 hover:text-white transition-colors">
          <span className="text-sm mb-2">Scroll Down</span>
          <svg className="w-6 h-6 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </a>
      </div>
    </section>
  );
}

