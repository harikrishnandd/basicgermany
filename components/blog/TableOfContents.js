'use client';

import { useState, useEffect } from 'react';

export default function TableOfContents({ items }) {
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      // Find which section is currently in view
      const headings = items.map(item => document.getElementById(item.id)).filter(Boolean);
      
      for (let i = headings.length - 1; i >= 0; i--) {
        const heading = headings[i];
        const rect = heading.getBoundingClientRect();
        
        if (rect.top <= 100) {
          setActiveId(items[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial position
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [items]);

  const scrollToHeading = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const top = element.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  if (items.length === 0) return null;

  return (
    <div className="toc-wrapper">
      <nav className="toc">
        <h3 className="toc-title">Table of Contents</h3>
        <ul className="toc-list">
          {items.map((item) => (
            <li key={item.id} style={{ paddingLeft: item.level === 3 ? 'var(--space-16)' : 0 }}>
              <a
                href={`#${item.id}`}
                className={activeId === item.id ? 'active' : ''}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToHeading(item.id);
                }}
              >
                {item.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
