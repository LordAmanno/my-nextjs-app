"use client";

import { useState } from "react";
import { siteConfig } from "@/config/site-config";

export default function Menu() {
  const { menu } = siteConfig;
  const [activeCategory, setActiveCategory] = useState(menu.categories[0].id);

  const activeCategoryData = menu.categories.find(cat => cat.id === activeCategory);

  return (
    <section id="menu" className="py-20 bg-gradient-to-b from-amber-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="text-amber-600 font-semibold text-sm uppercase tracking-wider">
            {menu.subtitle}
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mt-2 mb-4">
            {menu.title}
          </h2>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {menu.categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-6 py-3 rounded-full font-semibold transition-all ${
                activeCategory === category.id
                  ? 'bg-amber-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-amber-100'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Category Description */}
        {activeCategoryData && (
          <div className="text-center mb-12">
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {activeCategoryData.description}
            </p>
          </div>
        )}

        {/* Menu Items Grid */}
        {activeCategoryData && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activeCategoryData.items.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                {/* Item Image */}
                <div 
                  className="h-48 relative"
                  style={{
                    backgroundImage: `url('${item.image}')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  {/* Fallback gradient */}
                  <div className="w-full h-full bg-gradient-to-br from-amber-300 to-amber-500 flex items-center justify-center">
                    <span className="text-6xl">☕</span>
                  </div>
                  
                  {/* Popular Badge */}
                  {item.popular && (
                    <div className="absolute top-4 right-4 bg-amber-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Popular
                    </div>
                  )}
                </div>

                {/* Item Details */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-gray-900">
                      {item.name}
                    </h3>
                    <span className="text-xl font-bold text-amber-600">
                      {item.price}
                    </span>
                  </div>
                  <p className="text-gray-600">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

