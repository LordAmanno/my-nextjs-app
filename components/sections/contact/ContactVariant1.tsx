'use client';

interface ContactVariant1Props {
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

export default function ContactVariant1({ content, styles }: ContactVariant1Props) {
  return (
    <section 
      id="contact" 
      className="py-24"
      style={{ backgroundColor: styles.backgroundColor, color: styles.textColor }}
    >
      <div className="max-w-7xl mx-auto px-6">
        {content.title && (
          <h2 className="text-5xl md:text-6xl font-bold text-center mb-16" style={{ color: styles.textColor }}>
            {content.title}
          </h2>
        )}

        <div className="grid md:grid-cols-3 gap-8">
          <div
            className="p-8 rounded-2xl text-center transition-all hover:scale-105"
            style={{ backgroundColor: `${styles.accentColor}10` }}
          >
            <div
              className="text-4xl mb-4 w-16 h-16 flex items-center justify-center rounded-full mx-auto"
              style={{ backgroundColor: styles.accentColor, color: '#ffffff' }}
            >
              📞
            </div>
            <h3 className="text-xl font-bold mb-2" style={{ color: styles.textColor }}>Phone</h3>
            <p className="opacity-80">{content.phone}</p>
          </div>

          <div
            className="p-8 rounded-2xl text-center transition-all hover:scale-105"
            style={{ backgroundColor: `${styles.accentColor}10` }}
          >
            <div
              className="text-4xl mb-4 w-16 h-16 flex items-center justify-center rounded-full mx-auto"
              style={{ backgroundColor: styles.accentColor, color: '#ffffff' }}
            >
              ✉️
            </div>
            <h3 className="text-xl font-bold mb-2" style={{ color: styles.textColor }}>Email</h3>
            <p className="opacity-80">{content.email}</p>
          </div>

          <div
            className="p-8 rounded-2xl text-center transition-all hover:scale-105"
            style={{ backgroundColor: `${styles.accentColor}10` }}
          >
            <div
              className="text-4xl mb-4 w-16 h-16 flex items-center justify-center rounded-full mx-auto"
              style={{ backgroundColor: styles.accentColor, color: '#ffffff' }}
            >
              📍
            </div>
            <h3 className="text-xl font-bold mb-2" style={{ color: styles.textColor }}>Address</h3>
            <p className="opacity-80">
              {content.address.street}<br />
              {content.address.city}, {content.address.state} {content.address.zip}
            </p>
          </div>
        </div>

        {content.hours && content.hours.length > 0 && (
          <div className="mt-12 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-6 text-center" style={{ color: styles.textColor }}>
              Opening Hours
            </h3>
            <div className="space-y-3">
              {content.hours.map((hour, index) => (
                <div
                  key={index}
                  className="flex justify-between p-4 rounded-lg"
                  style={{ backgroundColor: `${styles.accentColor}05` }}
                >
                  <span className="font-semibold">{hour.day}</span>
                  <span className="opacity-80">{hour.time}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

