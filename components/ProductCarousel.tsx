'use client';

import { useState } from 'react';

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
      <div style={{ position: 'relative' }}>
        <div 
          className="hero-card"
          style={{ background: getGradient(currentCard.theme), position: 'relative' }}
        >

        <div className="hero-content">
          <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white/90 mb-2">
            {currentCard.category}
          </p>
          <h1 className="hero-title">{currentCard.title}</h1>
          <p className="hero-subtitle">{currentCard.subtitle}</p>
          <a
            href={currentCard.ctaLink}
            className="hero-cta-button"
            style={{ marginBottom: '48px' }}
          >
            {currentCard.ctaText}
          </a>
        </div>

          {/* Pagination Dots */}
          {cards.length > 1 && (
            <div className="carousel-dots">
              {cards.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  aria-label={`Go to slide ${index + 1}`}
                  className={`carousel-dot ${index === currentIndex ? 'active' : ''}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}