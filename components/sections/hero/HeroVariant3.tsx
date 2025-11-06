'use client';

interface HeroVariant3Props {
  content: {
    title: string;
    subtitle: string;
    description: string;
    ctaButton?: { text: string; link: string };
    secondaryButton?: { text: string; link: string };
  };
  styles: {
    backgroundColor: string;
    textColor: string;
    accentColor: string;
  };
}

export default function HeroVariant3({ content, styles }: HeroVariant3Props) {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-end pb-20 pt-32"
      style={{ backgroundColor: styles.backgroundColor }}
    >
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, ${styles.accentColor} 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-6">
        <p
          className="text-sm uppercase tracking-widest mb-4 font-bold"
          style={{ color: styles.accentColor }}
        >
          {content.subtitle}
        </p>

        <h1
          className="text-7xl md:text-9xl font-black mb-8 leading-none"
          style={{ color: styles.textColor }}
        >
          {content.title}
        </h1>

        <p
          className="text-xl md:text-2xl mb-12 max-w-2xl"
          style={{ color: `${styles.textColor}cc` }}
        >
          {content.description}
        </p>

        <div className="flex flex-wrap gap-6">
          {content.ctaButton && (
            <a
              href={content.ctaButton.link}
              className="group relative px-10 py-5 text-xl font-bold overflow-hidden"
              style={{ color: styles.textColor }}
            >
              <span
                className="absolute inset-0 transition-transform group-hover:scale-110"
                style={{ backgroundColor: styles.accentColor }}
              />
              <span className="relative" style={{ color: '#ffffff' }}>
                {content.ctaButton.text}
              </span>
            </a>
          )}

          {content.secondaryButton && (
            <a
              href={content.secondaryButton.link}
              className="px-10 py-5 text-xl font-bold border-4 transition-all hover:scale-105"
              style={{ borderColor: styles.accentColor, color: styles.accentColor }}
            >
              {content.secondaryButton.text}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}

