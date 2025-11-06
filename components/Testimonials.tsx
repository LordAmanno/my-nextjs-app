"use client";

import { siteConfig } from "@/config/site-config";

export default function Testimonials() {
  const { testimonials } = siteConfig;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span key={index} className={index < rating ? "text-amber-500" : "text-gray-300"}>
        ★
      </span>
    ));
  };

  return (
    <section id="testimonials" className="py-20 bg-gradient-to-b from-white to-amber-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="text-amber-600 font-semibold text-sm uppercase tracking-wider">
            {testimonials.subtitle}
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mt-2 mb-4">
            {testimonials.title}
          </h2>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.reviews.map((review, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow"
            >
              {/* Rating */}
              <div className="flex mb-4 text-2xl">
                {renderStars(review.rating)}
              </div>

              {/* Review Text */}
              <p className="text-gray-700 mb-6 italic leading-relaxed">
                "{review.text}"
              </p>

              {/* Reviewer Info */}
              <div className="flex items-center">
                <div 
                  className="w-12 h-12 rounded-full mr-4"
                  style={{
                    backgroundImage: `url('${review.image}')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  {/* Fallback avatar */}
                  <div className="w-full h-full bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-white font-bold">
                    {review.name.charAt(0)}
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    {review.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    {review.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

