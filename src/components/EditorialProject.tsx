import React from 'react';
import { Link } from 'react-router-dom';
import { Project } from '../types/project';
import InteractiveArtwork, { safeExternalUrl } from './InteractiveArtwork';
import WordPressContent from './WordPressContent';
import '../styles/artwork-project.css';

export default function EditorialProject({ project }: { project: Project }) {
  const art = project.artworkPresentation!;
  const platform = safeExternalUrl(art.platformUrl);
  const infos = project.infosProjet;
  return <article className="artwork-project">
    <div className="artwork-sitebar"><Link to="/">SMLDMS</Link><Link to="/projects">Works</Link></div>
    <div className="artwork-top"><Link to="/projects">← Selected works</Link><span>{art.network || 'Interactive art'}</span></div>
    <header className="artwork-title"><h1>{project.title}</h1>{art.introduction && <p>{art.introduction}</p>}</header>
    <InteractiveArtwork key={project.slug} title={project.title} url={art.artworkUrl!} desktopRatio={art.desktopRatio} mobileRatio={art.mobileRatio} />
    <section className="artwork-story"><div><span className="artwork-label">About the work</span>
      <WordPressContent content={project.content || ''} />
    </div><dl>
      <div><dt>Artist</dt><dd>SMLDMS</dd></div>
      {infos?.annee && <div><dt>Year</dt><dd>{infos.annee}</dd></div>}
      <div><dt>Medium</dt><dd>Interactive / generative art</dd></div>
      {art.network && <div><dt>Network</dt><dd>{art.network}</dd></div>}
      {platform && <div><dt>Platform</dt><dd><a href={platform} target="_blank" rel="noopener noreferrer">{art.platformLabel || 'View edition'} ↗</a></dd></div>}
    </dl></section>
    {art.artworkId && <details className="artwork-details"><summary>Artwork details</summary><p>Inscription / token reference</p><code>{art.artworkId}</code></details>}
    <div className="artwork-bottom"><Link to="/projects">← Back to selected works</Link>{platform && <a href={platform} target="_blank" rel="noopener noreferrer">Explore the edition ↗</a>}</div>
  </article>;
}
