'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * CarouselCard Interface
 */
export interface CarouselCard {
  id: string;
  category: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  imageUrl: string;
  theme: 'green' | 'dark' | 'purple';
}

interface ProductCarouselProps {
  cards: CarouselCard[];
}

/**
 * ProductCarousel Component
 * Apple App Store-style carousel with CONTROLLED HEIGHT
 */
export default function ProductCarousel({ cards }: ProductCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % cards.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  const getGradient = (theme: CarouselCard['theme']) => {
    switch (theme) {
      case 'green':
        return 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
      case 'purple':
        return 'linear-gradient(135deg, #a855f7 0%, #9333ea 100%)';
      case 'dark':
      default:
        return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    }
  };

  const currentCard = cards[currentIndex];

  if (!currentCard) {
    return null;
  }

  return (
    <section className="hero-section">
      <div className="scroll-nav-container">
        {/* Navigation Arrows - Outside Banner */}
        {cards.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="scroll-nav-arrow scroll-nav-arrow--left visible"
              aria-label="Previous"
              type="button"
            >
              <svg viewBox="0 0 9 31" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.275 29.46a1.61 1.61 0 0 0 1.456 1.077c1.018 0 1.772-.737 1.772-1.737 0-.526-.277-1.186-.449-1.62l-4.68-11.912L8.05 3.363c.172-.442.45-1.116.45-1.625A1.702 1.702 0 0 0 6.728.002a1.603 1.603 0 0 0-1.456 1.09L.675 12.774c-.301.775-.677 1.744-.677 2.495 0 .754.376 1.705.677 2.498L5.272 29.46Z" />
              </svg>
            </button>
            <button
              onClick={handleNext}
              className="scroll-nav-arrow scroll-nav-arrow--right visible"
              aria-label="Next"
              type="button"
            >
              <svg viewBox="0 0 9 31" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.275 29.46a1.61 1.61 0 0 0 1.456 1.077c1.018 0 1.772-.737 1.772-1.737 0-.526-.277-1.186-.449-1.62l-4.68-11.912L8.05 3.363c.172-.442.45-1.116.45-1.625A1.702 1.702 0 0 0 6.728.002a1.603 1.603 0 0 0-1.456 1.09L.675 12.774c-.301.775-.677 1.744-.677 2.495 0 .754.376 1.705.677 2.498L5.272 29.46Z" />
              </svg>
            </button>
          </>
        )}

        <div 
          className="hero-card"
          style={{ background: getGradient(currentCard.theme) }}
        >

        <div className="hero-content">
          <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white/90 mb-2">
            {currentCard.category}
          </p>
          <h1 className="hero-title">{currentCard.title}</h1>
          <p className="hero-subtitle">{currentCard.subtitle}</p>
          {/* No CTA button in hero banner - keeping it simple like client-home.js */}
        </div>

          {/* Pagination Dots */}
          {cards.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {cards.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  aria-label={`Go to slide ${index + 1}`}
                  className={`transition-all rounded-full ${
                    index === currentIndex
                      ? 'w-8 h-2 bg-white'
                      : 'w-2 h-2 bg-white/50 hover:bg-white/70'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}