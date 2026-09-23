import React, { useEffect, useRef, useState } from 'react';

interface LiveArtworkCardProps {
  artworkUrl: string;
  title: string;
  coverUrl?: string;
  coverAlt?: string;
  ratio?: string | null;
}

const LiveArtworkCard = ({ artworkUrl, title, coverUrl, coverAlt, ratio }: LiveArtworkCardProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [autoActive, setAutoActive] = useState(false);
  const [manualActive, setManualActive] = useState(false);
  const [frameLoaded, setFrameLoaded] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 650px)');
    const updateMode = () => setIsMobile(media.matches);
    updateMode();
    media.addEventListener?.('change', updateMode);
    return () => media.removeEventListener?.('change', updateMode);
  }, []);

  useEffect(() => {
    if (isMobile || !containerRef.current) {
      setAutoActive(false);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => setAutoActive(entry.isIntersecting),
      { threshold: 0.2, rootMargin: '80px 0px' }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [isMobile]);

  const active = isMobile ? manualActive : autoActive;
  const ratioClass = ['square', 'portrait', 'landscape'].includes(ratio || '')
    ? `selected-work-ratio-${ratio}`
    : '';

  return (
    <div ref={containerRef} className={`selected-work-image selected-work-live ${ratioClass}`}>
      {coverUrl ? (
        <img src={coverUrl} alt={coverAlt || title} loading="lazy" />
      ) : (
        <span className="selected-work-placeholder">SMLDMS</span>
      )}
      {active && (
        <iframe
          className={frameLoaded ? 'is-loaded' : ''}
          src={artworkUrl}
          title={`${title} — live artwork`}
          loading="lazy"
          sandbox="allow-scripts allow-same-origin allow-pointer-lock"
          allow="autoplay; fullscreen"
          referrerPolicy="no-referrer"
          onLoad={() => setFrameLoaded(true)}
        />
      )}
      <span className="selected-work-live-badge">Live artwork</span>
      {isMobile && !manualActive && (
        <button type="button" className="selected-work-live-launch" onClick={() => setManualActive(true)}>
          Launch live preview ↗
        </button>
      )}
    </div>
  );
};

export default LiveArtworkCard;
