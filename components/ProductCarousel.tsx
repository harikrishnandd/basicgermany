'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

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
  const [direction, setDirection] = useState(0);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => {
      if (newDirection === 1) {
        return prevIndex === cards.length - 1 ? 0 : prevIndex + 1;
      } else {
        return prevIndex === 0 ? cards.length - 1 : prevIndex - 1;
      }
    });
  };

  const currentCard = cards[currentIndex];

  if (!currentCard) {
    return null;
  }

  return (
    <div className="relative w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Navigation Buttons */}
      <button
        onClick={() => paginate(-1)}
        aria-label="Previous slide"
        className="absolute left-2 sm:left-4 top-[calc(50%-24px)] sm:top-[calc(50%-20px)] -translate-y-1/2 z-20 
                   w-10 h-10 sm:w-12 sm:h-12 
                   bg-white/95 hover:bg-white 
                   rounded-full shadow-lg hover:shadow-xl 
                   flex items-center justify-center 
                   transition-all duration-200 
                   hover:scale-110 active:scale-95
                   backdrop-blur-sm"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-800" strokeWidth={2.5} />
      </button>

      <button
        onClick={() => paginate(1)}
        aria-label="Next slide"
        className="absolute right-2 sm:right-4 top-[calc(50%-24px)] sm:top-[calc(50%-20px)] -translate-y-1/2 z-20 
                   w-10 h-10 sm:w-12 sm:h-12 
                   bg-white/95 hover:bg-white 
                   rounded-full shadow-lg hover:shadow-xl 
                   flex items-center justify-center 
                   transition-all duration-200 
                   hover:scale-110 active:scale-95
                   backdrop-blur-sm"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-gray-800" strokeWidth={2.5} />
      </button>

      {/* Carousel Container - EXPLICIT HEIGHT CONTROL */}
      <div 
        className="relative w-full overflow-hidden rounded-2xl sm:rounded-3xl shadow-2xl bg-gray-900"
        style={{
          height: '350px',
          maxHeight: '350px',
        }}
      >
        <style jsx>{`
          @media (min-width: 640px) {
            .carousel-container {
              height: 400px !important;
              max-height: 400px !important;
            }
          }
          @media (min-width: 1024px) {
            .carousel-container {
              height: 450px !important;
              max-height: 450px !important;
            }
          }
        `}</style>
        
        <div className="carousel-container relative w-full h-full">
          <AnimatePresence initial={false} custom={direction}>
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
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={1}
              onDragEnd={(e, { offset, velocity }) => {
                const swipe = swipePower(offset.x, velocity.x);

                if (swipe < -swipeConfidenceThreshold) {
                  paginate(1);
                } else if (swipe > swipeConfidenceThreshold) {
                  paginate(-1);
                }
              }}
              className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
            >
              {/* Background Image - CONSTRAINED */}
              <div className="absolute inset-0 w-full h-full overflow-hidden">
                <Image
                  src={currentCard.imageUrl}
                  alt={currentCard.title}
                  fill
                  priority={currentIndex === 0}
                  sizes="(max-width: 640px) 100vw, 1200px"
                  quality={85}
                  style={{
                    objectFit: 'cover',
                    objectPosition: 'center',
                  }}
                />
              </div>

              {/* Gradient Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-transparent pointer-events-none" />

              {/* Content Container */}
              <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8 lg:p-10 pointer-events-none">
                <div className="max-w-2xl pointer-events-auto">
                  {/* Category Label */}
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-[10px] sm:text-xs font-bold tracking-widest uppercase mb-1.5 sm:mb-2
                             text-white/90"
                  >
                    {currentCard.category}
                  </motion.p>

                  {/* Title */}
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-2xl sm:text-3xl lg:text-4xl 
                             font-bold leading-tight mb-2 sm:mb-3
                             text-white drop-shadow-lg"
                  >
                    {currentCard.title}
                  </motion.h2>

                  {/* Subtitle */}
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-sm sm:text-base lg:text-lg 
                             leading-relaxed mb-4 sm:mb-5
                             text-white/90 max-w-xl line-clamp-2"
                  >
                    {currentCard.subtitle}
                  </motion.p>

                  {/* CTA Button */}
                  <motion.a
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    href={currentCard.ctaLink}
                    className="inline-flex items-center justify-center
                             px-5 sm:px-7 py-2 sm:py-2.5
                             bg-white/20 hover:bg-white/30
                             backdrop-blur-md
                             border border-white/30 hover:border-white/50
                             rounded-full
                             text-white font-semibold
                             text-sm sm:text-base
                             transition-all duration-200
                             hover:-translate-y-0.5 hover:shadow-xl
                             active:scale-95"
                  >
                    {currentCard.ctaText}
                  </motion.a>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Pagination Dots */}
      <div className="flex justify-center items-center gap-2 mt-6">
        {cards.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1);
              setCurrentIndex(index);
            }}
            aria-label={`Go to slide ${index + 1}`}
            className={`transition-all duration-300 rounded-full
                       ${
                         index === currentIndex
                           ? 'w-8 h-2 bg-gray-800'
                           : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
                       }`}
          />
        ))}
      </div>
    </div>
  );
}