import React, { useEffect, useMemo, useState } from 'react';
import LiteYouTube from '../components/LiteYouTube';
import { getRewiredEpisodes } from '../lib/api';
import type { RewiredEpisode } from '../types/project';
import '../styles/rewired-archive.css';

interface DisplayEpisode {
  number: string;
  title: string;
  videoId: string;
  youtubeUrl: string;
  source: string;
  description: string;
  archiveUrl?: string;
  rightsStatus?: string;
  pinMain?: boolean;
}

const fallbackEpisodes: DisplayEpisode[] = [
  {
    number: '004',
    title: 'Bride of Frankenstein',
    videoId: 'An3sNuwIGQY',
    youtubeUrl: 'https://www.youtube.com/watch?v=An3sNuwIGQY',
    source: 'Bride of Frankenstein · 1935',
    description: 'Gothic cinema rewired through raw, industrial and hypnotic techno.'
  },
  {
    number: '003',
    title: 'Astro Monster',
    videoId: 'dhAItyasXuU',
    youtubeUrl: 'https://www.youtube.com/watch?v=dhAItyasXuU',
    source: 'Invasion of Astro-Monster · 1965',
    description: 'Planet X, alien signals and giant monsters fractured into rhythm.'
  },
  {
    number: '002',
    title: 'Scanner Protocol',
    videoId: 'YQ8e4CvKaZ4',
    youtubeUrl: 'https://www.youtube.com/watch?v=YQ8e4CvKaZ4',
    source: 'Scanners · 1981',
    description: 'A 130 BPM signal system between industrial techno and cold wave.'
  },
  {
    number: '001',
    title: 'Forgotten Women',
    videoId: 'uF_A_sUup7E',
    youtubeUrl: 'https://www.youtube.com/watch?v=uF_A_sUup7E',
    source: 'Science-fiction archive · 1968',
    description: 'A forgotten B-movie deconstructed through hypnotic dark techno.'
  }
];

const process = [
  {
    number: '01',
    title: 'Source',
    text: 'Films are sourced through online archival collections, primarily Archive.org, and selected as raw visual material. Scenes, gestures, faces and transitions become a vocabulary.'
  },
  {
    number: '02',
    title: 'Mix',
    text: 'The DJ set is constructed and recorded in Traktor. Its energy, breaks and repetitions define the new timeline.'
  },
  {
    number: '03',
    title: 'Rewire',
    text: 'In After Effects, cuts, loops, time remapping, displacement and signal disruptions reconstruct the film around the mix.'
  },
  {
    number: '04',
    title: 'Output',
    text: 'Image and sound become one continuous audiovisual piece. The archive no longer illustrates the music: it performs with it.'
  }
];

const getYouTubeId = (url?: string | null) => {
  if (!url) return '';
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes('youtu.be')) return parsed.pathname.split('/').filter(Boolean)[0] || '';
    if (parsed.pathname.startsWith('/shorts/')) return parsed.pathname.split('/')[2] || '';
    if (parsed.pathname.startsWith('/embed/')) return parsed.pathname.split('/')[2] || '';
    return parsed.searchParams.get('v') || '';
  } catch {
    return '';
  }
};

const mapEpisode = (episode: RewiredEpisode): DisplayEpisode | null => {
  const details = episode.rewiredDetails;
  const youtubeUrl = details?.youtubeUrl || '';
  const videoId = getYouTubeId(youtubeUrl);
  if (!videoId) return null;
  const source = [details?.sourceFilm, details?.sourceYear].filter(Boolean).join(' · ');
  return {
    number: details?.episodeNumber || '—',
    title: episode.title,
    videoId,
    youtubeUrl,
    source: source || 'Archive source',
    description: details?.shortDescription || '',
    archiveUrl: details?.archiveUrl || undefined,
    rightsStatus: details?.rightsStatus || undefined,
    pinMain: Boolean(details?.pinMain)
  };
};

const rightsLabels: Record<string, string> = {
  'public-domain': 'Public domain',
  'creative-commons': 'Creative Commons',
  permission: 'Used with permission'
};

const RewiredArchivePage = () => {
  const [remoteEpisodes, setRemoteEpisodes] = useState<RewiredEpisode[]>([]);

  useEffect(() => {
    getRewiredEpisodes().then(setRemoteEpisodes);
  }, []);

  const episodes = useMemo(() => {
    const mapped = remoteEpisodes.map(mapEpisode).filter((episode): episode is DisplayEpisode => Boolean(episode));
    if (!mapped.length) return fallbackEpisodes;
    return [...mapped].sort((a, b) => Number(Boolean(b.pinMain)) - Number(Boolean(a.pinMain)));
  }, [remoteEpisodes]);

  const featuredEpisode = episodes[0];
  const archiveEpisodes = episodes.slice(1);
  const highestEpisode = episodes.reduce((highest, episode) => {
    const value = Number.parseInt(episode.number, 10);
    return Number.isNaN(value) ? highest : Math.max(highest, value);
  }, episodes.length);

  return (
    <div className="rewired-page">
      <header className="rewired-hero">
        <p className="rewired-kicker">Audiovisual series / 2025—ongoing</p>
        <h1>Rewired<br />Archive</h1>
        <div className="rewired-intro">
          <p>Old cinema reconstructed through techno, rhythm and signal.</p>
          <span>Mixed in Traktor // Built in After Effects</span>
        </div>
      </header>

      <section className="rewired-feature" aria-labelledby="featured-episode">
        <LiteYouTube
          videoId={featuredEpisode.videoId}
          title={`Rewired Archive #${featuredEpisode.number} — ${featuredEpisode.title}`}
          featured
        />
        <div className="rewired-feature-caption">
          <div>
            <span className="rewired-number">#{featuredEpisode.number} / LATEST TRANSMISSION</span>
            <h2 id="featured-episode">{featuredEpisode.title}</h2>
          </div>
          <div>
            <p>{featuredEpisode.description}</p>
            <span className="rewired-meta">{featuredEpisode.source}</span>
            {featuredEpisode.rightsStatus && (
              <span className="rewired-rights">{rightsLabels[featuredEpisode.rightsStatus]}</span>
            )}
            <a href={featuredEpisode.youtubeUrl} target="_blank" rel="noopener noreferrer">
              Open on YouTube ↗
            </a>
          </div>
        </div>
      </section>

      <section className="rewired-statement" aria-label="Rewired Archive statement">
        <span className="rewired-meta">Method / Intention</span>
        <p>Archive as signal.<br />Cinema as texture.</p>
      </section>

      <section className="rewired-process" aria-labelledby="process-title">
        <div className="rewired-section-heading">
          <span className="rewired-number">PROCESS</span>
          <h2 id="process-title">The film becomes<br />another instrument.</h2>
        </div>
        <div className="rewired-process-grid">
          {process.map(step => (
            <article key={step.number}>
              <span className="rewired-number">{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rewired-archive" aria-labelledby="archive-title">
        <div className="rewired-section-heading rewired-archive-heading">
          <span className="rewired-number">ARCHIVE / 001—{String(highestEpisode).padStart(3, '0')}</span>
          <h2 id="archive-title">Previous transmissions</h2>
        </div>
        <div className="rewired-episode-grid">
          {archiveEpisodes.map(episode => (
            <article key={`${episode.number}-${episode.videoId}`} className="rewired-episode">
              <LiteYouTube
                videoId={episode.videoId}
                title={`Rewired Archive #${episode.number} — ${episode.title}`}
              />
              <span className="rewired-number">#{episode.number}</span>
              <h3>{episode.title}</h3>
              <p>{episode.description}</p>
              <div className="rewired-episode-footer">
                <span className="rewired-meta">{episode.source}</span>
                <div className="rewired-episode-links">
                  {episode.archiveUrl && (
                    <a href={episode.archiveUrl} target="_blank" rel="noopener noreferrer">Source ↗</a>
                  )}
                  <a href={episode.youtubeUrl} target="_blank" rel="noopener noreferrer">YouTube ↗</a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <footer className="rewired-end">
        <span className="rewired-meta">SMLDMS / Rewired Archive</span>
        <a href="https://youtube.com/@smldms" target="_blank" rel="noopener noreferrer">
          Follow the series on YouTube ↗
        </a>
      </footer>
    </div>
  );
};

export default RewiredArchivePage;
