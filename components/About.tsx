"use client";

import { siteConfig } from "@/config/site-config";

export default function About() {
  const { about } = siteConfig;

  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="order-2 lg:order-1">
            <div 
              className="rounded-2xl overflow-hidden shadow-2xl h-96 lg:h-[500px]"
              style={{
                backgroundImage: `url('${about.image}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              {/* Fallback gradient */}
              <div className="w-full h-full bg-gradient-to-br from-amber-200 to-amber-400 flex items-center justify-center">
                <span className="text-8xl">☕</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="order-1 lg:order-2">
            <div className="mb-4">
              <span className="text-amber-600 font-semibold text-sm uppercase tracking-wider">
                {about.subtitle}
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              {about.title}
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              {about.description}
            </p>

            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {about.features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center text-2xl">
                      {feature.icon}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

