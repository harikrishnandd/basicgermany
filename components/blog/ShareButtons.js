'use client';

export default function ShareButtons({ url, title }) {
  const shareOnTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, '_blank', 'width=550,height=420');
  };

  const shareOnFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(facebookUrl, '_blank', 'width=550,height=420');
  };

  const shareOnLinkedIn = () => {
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    window.open(linkedInUrl, '_blank', 'width=550,height=420');
  };

  const copyLink = () => {
    navigator.clipboard.writeText(url).then(() => {
      alert('Link copied to clipboard!');
    });
  };

  return (
    <div className="share-section">
      <span className="share-label">Share this article:</span>
      <div className="share-buttons">
        <button
          className="share-button"
          onClick={shareOnTwitter}
          title="Share on Twitter"
          aria-label="Share on Twitter"
        >
          🐦
        </button>
        <button
          className="share-button"
          onClick={shareOnFacebook}
          title="Share on Facebook"
          aria-label="Share on Facebook"
        >
          📘
        </button>
        <button
          className="share-button"
          onClick={shareOnLinkedIn}
          title="Share on LinkedIn"
          aria-label="Share on LinkedIn"
        >
          💼
        </button>
        <button
          className="share-button"
          onClick={copyLink}
          title="Copy link"
          aria-label="Copy link"
        >
          🔗
        </button>
      </div>
    </div>
  );
}
