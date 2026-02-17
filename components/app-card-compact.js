'use client';

import { useState } from 'react';

export default function AppCardCompact({ app }) {
  const [imageError, setImageError] = useState(false);
  
  const handleClick = () => {
    if (app.url) {
      window.open(app.url, '_blank', 'noopener,noreferrer');
    }
  };

  // Use ONLY logo field from appsList data
  const iconSrc = imageError ? '/site-icon.png' : (app.logo || '/site-icon.png');

  return (
    <div onClick={handleClick} className="app-card-compact">
      {/* App Icon */}
      <div className="app-icon">
        <img 
          src={iconSrc} 
          alt={app.name} 
          width="72" 
          height="72"
          loading="lazy"
          onError={() => setImageError(true)}
        />
      </div>

      {/* App Info (Name + Category) */}
      <div className="app-info">
        <h3 className="app-name">{app.name}</h3>
        <p className="app-category">{app.category}</p>
      </div>

      {/* GET Button */}
      <button 
        onClick={(e) => { e.stopPropagation(); handleClick(); }}
        className="app-button"
      >
        GET
      </button>
    </div>
  );
}
