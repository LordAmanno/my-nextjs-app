'use client';

interface AboutVariant3Props {
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

export default function AboutVariant3({ content, styles }: AboutVariant3Props) {
  return (
    <section
      id="about"
      className="py-24 relative overflow-hidden"
      style={{ backgroundColor: styles.backgroundColor, color: styles.textColor }}
    >
      <div
        className="absolute top-0 right-0 w-1/3 h-full opacity-5"
        style={{ backgroundColor: styles.accentColor }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="max-w-3xl mb-20">
          <div
            className="w-20 h-2 mb-8"
            style={{ backgroundColor: styles.accentColor }}
          />
          {content.subtitle && (
            <p className="text-lg font-semibold mb-4 opacity-70" style={{ color: styles.accentColor }}>
              {content.subtitle}
            </p>
          )}
          <h2 className="text-6xl md:text-7xl font-black mb-8" style={{ color: styles.textColor }}>
            {content.title}
          </h2>
          <p className="text-xl md:text-2xl opacity-80 leading-relaxed">
            {content.description}
          </p>
        </div>
        
        <div className="space-y-6">
          {content.features.map((feature, index) => (
            <div 
              key={index}
              className="flex items-start gap-6 p-6 rounded-xl transition-all hover:translate-x-4"
              style={{ borderLeft: `4px solid ${styles.accentColor}` }}
            >
              <div 
                className="text-4xl w-16 h-16 flex items-center justify-center rounded-lg flex-shrink-0"
                style={{ backgroundColor: `${styles.accentColor}20`, color: styles.accentColor }}
              >
                {feature.icon}
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2" style={{ color: styles.textColor }}>
                  {feature.title}
                </h3>
                <p className="opacity-70">
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

