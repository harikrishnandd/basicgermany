'use client';

import { useState } from 'react';

export default function SocialShare({ title, url }) {
  const [copied, setCopied] = useState(false);
  
  const copyLink = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <div className="social-share">
      <button 
        onClick={copyLink}
        className="copy-link-pill"
        aria-label="Copy link"
      >
        <span className="material-symbols-outlined">
          {copied ? 'check' : 'link'}
        </span>
        <span>{copied ? 'Copied!' : 'Copy Link'}</span>
      </button>
    </div>
  );
}
