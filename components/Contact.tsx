"use client";

import { siteConfig } from "@/config/site-config";

export default function Contact() {
  const { contact, hours, socialMedia, businessName, tagline } = siteConfig;

  const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;

  return (
    <section id="contact" className="py-20 bg-gradient-to-b from-amber-50 to-amber-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="text-amber-600 font-semibold text-sm uppercase tracking-wider">
            Get In Touch
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mt-2 mb-4">
            Visit Us Today
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Contact Information */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Contact Info</h3>
            
            <div className="space-y-4">
              {/* Phone */}
              <div className="flex items-start">
                <div className="flex-shrink-0 w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Phone</p>
                  <a href={`tel:${contact.phone}`} className="text-gray-900 font-semibold hover:text-amber-600">
                    {contact.phone}
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start">
                <div className="flex-shrink-0 w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Email</p>
                  <a href={`mailto:${contact.email}`} className="text-gray-900 font-semibold hover:text-amber-600">
                    {contact.email}
                  </a>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start">
                <div className="flex-shrink-0 w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Address</p>
                  <p className="text-gray-900 font-semibold">
                    {contact.address.street}<br />
                    {contact.address.city}, {contact.address.state} {contact.address.zip}<br />
                    {contact.address.country}
                  </p>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="mt-8">
              <p className="text-sm text-gray-600 mb-4">Follow Us</p>
              <div className="flex space-x-4">
                {socialMedia.facebook && (
                  <a href={socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center hover:bg-amber-200 transition-colors">
                    <span className="text-amber-600 font-bold">f</span>
                  </a>
                )}
                {socialMedia.instagram && (
                  <a href={socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center hover:bg-amber-200 transition-colors">
                    <span className="text-amber-600 font-bold">📷</span>
                  </a>
                )}
                {socialMedia.twitter && (
                  <a href={socialMedia.twitter} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center hover:bg-amber-200 transition-colors">
                    <span className="text-amber-600 font-bold">𝕏</span>
                  </a>
                )}
                {socialMedia.tiktok && (
                  <a href={socialMedia.tiktok} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center hover:bg-amber-200 transition-colors">
                    <span className="text-amber-600 font-bold">♪</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Business Hours */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Business Hours</h3>
            <div className="space-y-3">
              {daysOfWeek.map((day) => {
                const dayData = hours[day];
                return (
                  <div key={day} className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="font-semibold text-gray-900 capitalize">
                      {day}
                    </span>
                    <span className="text-gray-600">
                      {dayData.closed ? 'Closed' : `${dayData.open} - ${dayData.close}`}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Map Placeholder */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Location</h3>
            <div className="w-full h-64 bg-gradient-to-br from-amber-200 to-amber-400 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <svg className="w-16 h-16 text-amber-700 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p className="text-amber-900 font-semibold">Map Placeholder</p>
                <p className="text-sm text-amber-800 mt-1">Google Maps integration</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-amber-900 text-white py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Brand */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-3xl">☕</span>
                <span className="text-2xl font-bold">{businessName}</span>
              </div>
              <p className="text-amber-100">
                {tagline}
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#hero" className="text-amber-100 hover:text-white transition-colors">Home</a></li>
                <li><a href="#about" className="text-amber-100 hover:text-white transition-colors">About</a></li>
                <li><a href="#menu" className="text-amber-100 hover:text-white transition-colors">Menu</a></li>
                <li><a href="#gallery" className="text-amber-100 hover:text-white transition-colors">Gallery</a></li>
                <li><a href="#contact" className="text-amber-100 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>

            {/* Newsletter Placeholder */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Stay Updated</h4>
              <p className="text-amber-100 mb-4">Subscribe to our newsletter for special offers</p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-4 py-2 rounded-l-lg text-gray-900 focus:outline-none"
                />
                <button className="bg-amber-600 hover:bg-amber-700 px-6 py-2 rounded-r-lg font-semibold transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-amber-800 pt-8 text-center text-amber-100">
            <p>&copy; {new Date().getFullYear()} {businessName}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </section>
  );
}

