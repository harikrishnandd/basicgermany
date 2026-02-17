'use client';

import { useState } from 'react';

export default function AppCard({ app }) {
  const [imageError, setImageError] = useState(false);
  
  const handleClick = () => {
    if (app.url) {
      window.open(app.url, '_blank', 'noopener,noreferrer');
    }
  };

  // Use ONLY logo field from appsList data
  const iconSrc = imageError ? '/site-icon.png' : (app.logo || '/site-icon.png');

  return (
    <div onClick={handleClick} className="app-card">
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

      {/* App Info */}
      <div className="app-info">
        <div className="app-header-row">
          <h3 className="app-name">{app.name}</h3>
          {/* Platform Icons */}
          <div className="platform-icons">
            {app.ios && (
              <img src="/assets/ios.png" alt="iOS" className="platform-icon" loading="lazy" />
            )}
            {app.android && (
              <img src="/assets/android.png" alt="Android" className="platform-icon" loading="lazy" />
            )}
            {app.web && (
              <img src="/assets/web.png" alt="Web" className="platform-icon" loading="lazy" />
            )}
          </div>
        </div>
        <p className="app-subtitle">{app.category}</p>
        <p className="app-description">{app.tagline || app.description}</p>
        <button 
          onClick={(e) => { e.stopPropagation(); handleClick(); }}
          className="app-button"
        >
          GET
        </button>
      </div>
    </div>
  );
}
