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
      <div 
        className="hero-card"
        style={{ background: getGradient(currentCard.theme) }}
      >
        {/* Navigation Arrows */}
        {cards.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              aria-label="Previous"
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center transition-all"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            <button
              onClick={handleNext}
              aria-label="Next"
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center transition-all"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>
          </>
        )}

        <div className="hero-content">
          <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white/90 mb-2">
            {currentCard.category}
          </p>
          <h1 className="hero-title">{currentCard.title}</h1>
          <p className="hero-subtitle">{currentCard.subtitle}</p>
          <a
            href={currentCard.ctaLink}
            className="inline-block mt-4 px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 rounded-full text-white font-semibold transition-all"
          >
            {currentCard.ctaText}
          </a>
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
    </section>
  );
}