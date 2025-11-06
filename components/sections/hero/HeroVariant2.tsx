'use client';

interface HeroVariant2Props {
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

export default function HeroVariant2({ content, styles }: HeroVariant2Props) {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center pt-20"
      style={{
        background: `linear-gradient(135deg, ${styles.backgroundColor} 0%, ${styles.accentColor}20 100%)`,
        color: styles.textColor
      }}
    >
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <div
            className="inline-block px-4 py-2 rounded-full text-sm font-semibold mb-6"
            style={{ backgroundColor: `${styles.accentColor}20`, color: styles.accentColor }}
          >
            {content.subtitle}
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            {content.title}
          </h1>

          <p className="text-lg md:text-xl mb-8 opacity-80">
            {content.description}
          </p>

          <div className="flex flex-wrap gap-4">
            {content.ctaButton && (
              <a
                href={content.ctaButton.link}
                className="px-8 py-4 rounded-lg text-lg font-semibold transition-all hover:shadow-2xl hover:-translate-y-1"
                style={{ backgroundColor: styles.accentColor, color: '#ffffff' }}
              >
                {content.ctaButton.text}
              </a>
            )}
            {content.secondaryButton && (
              <a
                href={content.secondaryButton.link}
                className="px-8 py-4 rounded-lg text-lg font-semibold transition-all hover:-translate-y-1"
                style={{ backgroundColor: `${styles.textColor}10`, color: styles.textColor }}
              >
                {content.secondaryButton.text}
              </a>
            )}
          </div>
        </div>

        <div className="relative h-96 md:h-[500px]">
          <div
            className="absolute inset-0 rounded-3xl transform rotate-6 opacity-20"
            style={{ backgroundColor: styles.accentColor }}
          />
          <div
            className="absolute inset-0 rounded-3xl flex items-center justify-center text-6xl"
            style={{ backgroundColor: `${styles.accentColor}30` }}
          >
            ☕
          </div>
        </div>
      </div>
    </section>
  );
}

