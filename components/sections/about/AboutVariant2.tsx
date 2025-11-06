'use client';

interface AboutVariant2Props {
  content: {
    title: string;
    subtitle?: string;
    description: string;
    features: Array<{ icon: string; title: string; description: string }>;
  };
  styles: {
    backgroundColor: string;
    textColor: string;
    accentColor: string;
  };
}

export default function AboutVariant2({ content, styles }: AboutVariant2Props) {
  return (
    <section
      id="about"
      className="py-24"
      style={{ backgroundColor: styles.backgroundColor, color: styles.textColor }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center mb-16">
          <div>
            <div
              className="w-full h-96 rounded-3xl flex items-center justify-center text-9xl"
              style={{ backgroundColor: `${styles.accentColor}20` }}
            >
              ☕
            </div>
          </div>

          <div>
            {content.subtitle && (
              <p className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: styles.accentColor }}>
                {content.subtitle}
              </p>
            )}
            <h2 className="text-5xl md:text-6xl font-bold mb-6" style={{ color: styles.textColor }}>
              {content.title}
            </h2>
            <p className="text-lg md:text-xl opacity-80 leading-relaxed">
              {content.description}
            </p>
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {content.features.map((feature, index) => (
            <div 
              key={index}
              className="relative p-8 overflow-hidden group"
            >
              <div 
                className="absolute inset-0 transition-transform group-hover:scale-110"
                style={{ backgroundColor: `${styles.accentColor}05` }}
              />
              <div className="relative">
                <div className="text-6xl mb-4" style={{ color: styles.accentColor }}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2" style={{ color: styles.textColor }}>
                  {feature.title}
                </h3>
                <p className="opacity-70 text-sm">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

