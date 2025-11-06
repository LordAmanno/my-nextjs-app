'use client';

interface ContactVariant2Props {
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

export default function ContactVariant2({ content, styles }: ContactVariant2Props) {
  return (
    <section 
      id="contact" 
      className="py-24"
      style={{ backgroundColor: styles.backgroundColor, color: styles.textColor }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16">
          <div>
            {content.title && (
              <h2 className="text-5xl md:text-6xl font-bold mb-8" style={{ color: styles.textColor }}>
                {content.title}
              </h2>
            )}

            <div className="space-y-6 mb-12">
              <div className="flex items-start gap-4">
                <div
                  className="text-2xl w-12 h-12 flex items-center justify-center rounded-lg flex-shrink-0"
                  style={{ backgroundColor: `${styles.accentColor}20`, color: styles.accentColor }}
                >
                  📞
                </div>
                <div>
                  <h3 className="font-bold mb-1" style={{ color: styles.textColor }}>Phone</h3>
                  <p className="opacity-80">{content.phone}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div
                  className="text-2xl w-12 h-12 flex items-center justify-center rounded-lg flex-shrink-0"
                  style={{ backgroundColor: `${styles.accentColor}20`, color: styles.accentColor }}
                >
                  ✉️
                </div>
                <div>
                  <h3 className="font-bold mb-1" style={{ color: styles.textColor }}>Email</h3>
                  <p className="opacity-80">{content.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div
                  className="text-2xl w-12 h-12 flex items-center justify-center rounded-lg flex-shrink-0"
                  style={{ backgroundColor: `${styles.accentColor}20`, color: styles.accentColor }}
                >
                  📍
                </div>
                <div>
                  <h3 className="font-bold mb-1" style={{ color: styles.textColor }}>Address</h3>
                  <p className="opacity-80">
                    {content.address.street}<br />
                    {content.address.city}, {content.address.state} {content.address.zip}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {content.hours && content.hours.length > 0 && (
            <div
              className="p-8 rounded-3xl"
              style={{ backgroundColor: `${styles.accentColor}10` }}
            >
              <h3 className="text-2xl font-bold mb-6" style={{ color: styles.textColor }}>
                Opening Hours
              </h3>
              <div className="space-y-4">
                {content.hours.map((hour, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center pb-4"
                    style={{ borderBottom: `1px solid ${styles.accentColor}20` }}
                  >
                    <span className="font-semibold text-lg">{hour.day}</span>
                    <span className="opacity-80">{hour.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

