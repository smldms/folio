import React, { useState } from 'react';

interface LiteYouTubeProps {
  videoId: string;
  title: string;
  featured?: boolean;
}

const LiteYouTube: React.FC<LiteYouTubeProps> = ({ videoId, title, featured = false }) => {
  const [playing, setPlaying] = useState(false);
  const [thumbnail, setThumbnail] = useState(`https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`);

  if (playing) {
    return (
      <iframe
        className="rewired-player"
        src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
      />
    );
  }

  return (
    <button
      type="button"
      className={`rewired-poster${featured ? ' rewired-poster-featured' : ''}`}
      onClick={() => setPlaying(true)}
      aria-label={`Play ${title}`}
    >
      <img
        src={thumbnail}
        alt=""
        loading={featured ? 'eager' : 'lazy'}
        onError={() => setThumbnail(`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`)}
      />
      <span className="rewired-play" aria-hidden="true">Play ↗</span>
    </button>
  );
};

export default LiteYouTube;

