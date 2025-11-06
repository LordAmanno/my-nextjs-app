'use client';

interface ContactVariant3Props {
  content: {
    title?: string;
    phone: string;
    email: string;
    address: {
      street: string;
      city: string;
      state: string;
      zip: string;
      country: string;
    };
    hours?: Array<{ day: string; time: string }>;
  };
  styles: {
    backgroundColor: string;
    textColor: string;
    accentColor: string;
  };
}

export default function ContactVariant3({ content, styles }: ContactVariant3Props) {
  return (
    <section 
      id="contact" 
      className="py-24 relative"
      style={{ 
        background: `linear-gradient(to bottom, ${styles.backgroundColor} 0%, ${styles.accentColor}10 100%)`,
        color: styles.textColor 
      }}
    >
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <div
            className="inline-block w-16 h-1 mb-6"
            style={{ backgroundColor: styles.accentColor }}
          />
          {content.title && (
            <h2 className="text-6xl md:text-7xl font-black mb-4" style={{ color: styles.textColor }}>
              {content.title}
            </h2>
          )}
        </div>

        <div
          className="p-12 rounded-3xl shadow-2xl"
          style={{ backgroundColor: styles.backgroundColor }}
        >
          <div className={`grid ${content.hours && content.hours.length > 0 ? 'md:grid-cols-2' : 'md:grid-cols-1'} gap-12 mb-12`}>
            <div className="space-y-8">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">📞</span>
                  <h3 className="text-xl font-bold" style={{ color: styles.accentColor }}>
                    Phone
                  </h3>
                </div>
                <p className="text-2xl font-semibold">{content.phone}</p>
              </div>

              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">✉️</span>
                  <h3 className="text-xl font-bold" style={{ color: styles.accentColor }}>
                    Email
                  </h3>
                </div>
                <p className="text-2xl font-semibold">{content.email}</p>
              </div>

              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">📍</span>
                  <h3 className="text-xl font-bold" style={{ color: styles.accentColor }}>
                    Address
                  </h3>
                </div>
                <p className="text-lg">
                  {content.address.street}<br />
                  {content.address.city}, {content.address.state} {content.address.zip}
                </p>
              </div>
            </div>

            {content.hours && content.hours.length > 0 && (
              <div>
                <h3 className="text-2xl font-bold mb-6" style={{ color: styles.accentColor }}>
                  Opening Hours
                </h3>
                <div className="space-y-3">
                  {content.hours.map((hour, index) => (
                    <div
                      key={index}
                      className="flex justify-between p-4 rounded-lg transition-all hover:translate-x-2"
                      style={{ backgroundColor: `${styles.accentColor}10` }}
                    >
                      <span className="font-bold">{hour.day}</span>
                      <span className="opacity-80">{hour.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

