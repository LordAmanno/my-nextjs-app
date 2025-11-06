'use client';

interface HeroVariant1Props {
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

export default function HeroVariant1({ content, styles }: HeroVariant1Props) {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center pt-20"
      style={{ backgroundColor: styles.backgroundColor, color: styles.textColor }}
    >
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        <h1 className="text-6xl md:text-8xl font-bold mb-6 animate-fade-in">
          {content.title}
        </h1>

        <p className="text-2xl md:text-3xl mb-4 opacity-90">
          {content.subtitle}
        </p>

        <p className="text-lg md:text-xl mb-12 max-w-3xl mx-auto opacity-80">
          {content.description}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {content.ctaButton && (
            <a
              href={content.ctaButton.link}
              className="px-8 py-4 rounded-full text-lg font-semibold transition-all hover:scale-105 hover:shadow-xl"
              style={{ backgroundColor: styles.accentColor, color: '#ffffff' }}
            >
              {content.ctaButton.text}
            </a>
          )}
          {content.secondaryButton && (
            <a
              href={content.secondaryButton.link}
              className="px-8 py-4 rounded-full text-lg font-semibold border-2 transition-all hover:scale-105"
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

