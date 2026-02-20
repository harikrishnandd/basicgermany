'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

/**
 * CarouselCard Interface
 * Defines the structure for each card in the carousel
 */
export interface CarouselCard {
  id: string;
  category: string;        // e.g., "WHAT TO WATCH"
  title: string;           // Main heading
  subtitle: string;        // Description
  ctaText: string;         // Button text
  ctaLink: string;         // Button URL
  imageUrl: string;        // Background image
  theme: 'green' | 'dark' | 'purple'; // Color theme
}

interface ProductCarouselProps {
  cards: CarouselCard[];
}

/**
 * ProductCarousel Component
 * 
 * Apple App Store-style carousel with:
 * - Infinite loop navigation
 * - Smooth Framer Motion animations
 * - Responsive design
 * - Glassmorphism effects
 * - Keyboard and screen reader accessible
 */
export default function ProductCarousel({ cards }: ProductCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right

  /**
   * Navigate to the next card
   * Implements infinite loop: last card → first card
   */
  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % cards.length);
  };

  /**
   * Navigate to the previous card
   * Implements infinite loop: first card → last card
   */
  const handlePrevious = () => {
    setDirection(-1);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + cards.length) % cards.length);
  };

  /**
   * Handle CTA button click
   */
  const handleCTAClick = (link: string) => {
    window.location.href = link;
  };

  /**
   * Get theme-specific gradient colors
   */
  const getThemeGradient = (theme: CarouselCard['theme']) => {
    switch (theme) {
      case 'green':
        return 'from-green-900/80 via-green-800/60 to-transparent';
      case 'purple':
        return 'from-purple-900/80 via-purple-800/60 to-transparent';
      case 'dark':
      default:
        return 'from-black/80 via-black/60 to-transparent';
    }
  };

  /**
   * Framer Motion variants for slide animations
   */
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  const currentCard = cards[currentIndex];

  return (
    <div className="relative w-full py-10 md:py-16 px-4 md:px-8 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-[1400px] mx-auto">
        {/* Carousel Container */}
        <div className="relative h-[350px] md:h-[400px] overflow-hidden">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentCard.id}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: 'spring', stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
              className="absolute inset-0"
            >
              {/* Card */}
              <motion.div
                className="relative w-full max-w-[800px] h-full mx-auto rounded-2xl overflow-hidden shadow-2xl cursor-pointer"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                {/* Background Image */}
                <div className="absolute inset-0">
                  <Image
                    src={currentCard.imageUrl}
                    alt={currentCard.title}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 768px) 90vw, 800px"
                  />
                  {/* Gradient Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-t ${getThemeGradient(currentCard.theme)}`} />
                </div>

                {/* Content Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                  <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                    {/* Text Content */}
                    <div className="flex-1 space-y-2">
                      {/* Category Label */}
                      <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xs md:text-sm font-bold uppercase tracking-wider text-white/90"
                      >
                        {currentCard.category}
                      </motion.p>

                      {/* Title */}
                      <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-2xl md:text-4xl font-bold text-white leading-tight"
                      >
                        {currentCard.title}
                      </motion.h2>

                      {/* Subtitle */}
                      <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-sm md:text-base text-white/80 line-clamp-2"
                      >
                        {currentCard.subtitle}
                      </motion.p>
                    </div>

                    {/* CTA Button */}
                    <motion.button
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 }}
                      onClick={() => handleCTAClick(currentCard.ctaLink)}
                      className="px-6 py-3 bg-white/90 backdrop-blur-md hover:bg-white text-gray-900 font-semibold rounded-full shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-105 whitespace-nowrap"
                      aria-label={`${currentCard.ctaText} - ${currentCard.title}`}
                    >
                      {currentCard.ctaText}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows */}
          {/* Previous Arrow */}
          <button
            onClick={handlePrevious}
            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label="Previous card"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-gray-900" />
          </button>

          {/* Next Arrow */}
          <button
            onClick={handleNext}
            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label="Next card"
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-gray-900" />
          </button>
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center gap-2 mt-6">
          {cards.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > currentIndex ? 1 : -1);
                setCurrentIndex(index);
              }}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-gray-900 dark:bg-white w-8'
                  : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
              }`}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === currentIndex ? 'true' : 'false'}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
