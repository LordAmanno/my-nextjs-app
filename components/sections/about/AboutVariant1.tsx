'use client';

interface AboutVariant1Props {
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

export default function AboutVariant1({ content, styles }: AboutVariant1Props) {
  return (
    <section
      id="about"
      className="py-24"
      style={{ backgroundColor: styles.backgroundColor, color: styles.textColor }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          {content.subtitle && (
            <p className="text-lg font-semibold mb-4 opacity-70" style={{ color: styles.accentColor }}>
              {content.subtitle}
            </p>
          )}
          <h2 className="text-5xl md:text-6xl font-bold mb-6" style={{ color: styles.textColor }}>
            {content.title}
          </h2>
          <p className="text-lg md:text-xl max-w-3xl mx-auto opacity-80">
            {content.description}
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {content.features.map((feature, index) => (
            <div 
              key={index}
              className="p-8 rounded-2xl transition-all hover:scale-105 hover:shadow-2xl"
              style={{ backgroundColor: `${styles.accentColor}10` }}
            >
              <div 
                className="text-5xl mb-4 w-16 h-16 flex items-center justify-center rounded-full"
                style={{ backgroundColor: styles.accentColor, color: '#ffffff' }}
              >
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold mb-3" style={{ color: styles.textColor }}>
                {feature.title}
              </h3>
              <p className="opacity-80">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

