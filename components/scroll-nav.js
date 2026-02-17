'use client';

import { useEffect, useRef, useState } from 'react';

export default function ScrollNav({ children, className = '' }) {
  const scrollRef = useRef(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setShowLeft(scrollLeft > 0);
    setShowRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (!scrollElement) return;

    checkScroll();
    scrollElement.addEventListener('scroll', checkScroll);
    window.addEventListener('resize', checkScroll);

    return () => {
      scrollElement.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, []);

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    
    const scrollAmount = scrollRef.current.clientWidth * 0.8;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  return (
    <div className="scroll-nav-container">
      {showLeft && (
        <button
          onClick={() => scroll('left')}
          className="scroll-nav-arrow scroll-nav-arrow--left visible"
          aria-label="Previous Page"
          type="button"
        >
          <svg viewBox="0 0 9 31" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.275 29.46a1.61 1.61 0 0 0 1.456 1.077c1.018 0 1.772-.737 1.772-1.737 0-.526-.277-1.186-.449-1.62l-4.68-11.912L8.05 3.363c.172-.442.45-1.116.45-1.625A1.702 1.702 0 0 0 6.728.002a1.603 1.603 0 0 0-1.456 1.09L.675 12.774c-.301.775-.677 1.744-.677 2.495 0 .754.376 1.705.677 2.498L5.272 29.46Z" />
          </svg>
        </button>
      )}
      
      <div ref={scrollRef} className={className}>
        {children}
      </div>
      
      {showRight && (
        <button
          onClick={() => scroll('right')}
          className="scroll-nav-arrow scroll-nav-arrow--right visible"
          aria-label="Next Page"
          type="button"
        >
          <svg viewBox="0 0 9 31" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.275 29.46a1.61 1.61 0 0 0 1.456 1.077c1.018 0 1.772-.737 1.772-1.737 0-.526-.277-1.186-.449-1.62l-4.68-11.912L8.05 3.363c.172-.442.45-1.116.45-1.625A1.702 1.702 0 0 0 6.728.002a1.603 1.603 0 0 0-1.456 1.09L.675 12.774c-.301.775-.677 1.744-.677 2.495 0 .754.376 1.705.677 2.498L5.272 29.46Z" />
          </svg>
        </button>
      )}
    </div>
  );
}
