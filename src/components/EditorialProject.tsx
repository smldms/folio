import React from 'react';
import { Link } from 'react-router-dom';
import { Project } from '../types/project';
import InteractiveArtwork, { safeExternalUrl } from './InteractiveArtwork';
import WordPressContent from './WordPressContent';
import '../styles/artwork-project.css';

export default function EditorialProject({ project }: { project: Project }) {
  const art = project.artworkPresentation || {};
  const infos = project.infosProjet || {
    platform: '', annee: '', technologies: [], lienProjet: '', autrelien: '', couleurPrincipale: ''
  };
  const artworkUrl = safeExternalUrl(art.artworkUrl);
  const interactive = Boolean(art.displayMode === 'interactive' && artworkUrl);
  const platform = safeExternalUrl(art.platformUrl) || safeExternalUrl(infos.lienProjet);
  const additionalLink = safeExternalUrl(infos.autrelien);
  const categories = project.categoriesProjet?.nodes || [];
  const technologies = Array.isArray(infos.technologies)
    ? infos.technologies
    : infos.technologies
      ? String(infos.technologies).split(',').map(item => item.trim()).filter(Boolean)
      : [];
  const ratios: Record<string, string> = { landscape: '16 / 10', square: '1', portrait: '4 / 5' };
  const coverStyle = {
    '--art-desktop': ratios[art.desktopRatio || ''] || '16 / 10',
    '--art-mobile': ratios[art.mobileRatio || ''] || '1'
  } as React.CSSProperties;
  const context = art.network || categories.map(category => category.name).join(' · ') || 'Selected work';
  const medium = technologies.join(', ') || (interactive ? 'Interactive / generative art' : undefined);

  return <article className={`artwork-project ${interactive ? 'is-interactive' : 'is-editorial'}`}>
    <div className="artwork-sitebar"><Link to="/">SMLDMS</Link><Link to="/projects">Works</Link></div>
    <div className="artwork-top"><Link to="/projects">← Selected works</Link><span>{context}</span></div>
    <header className="artwork-title"><h1>{project.title}</h1>{art.introduction && <p>{art.introduction}</p>}</header>
    {interactive && artworkUrl ? (
      <InteractiveArtwork key={project.slug} title={project.title} url={artworkUrl} desktopRatio={art.desktopRatio} mobileRatio={art.mobileRatio} />
    ) : project.featuredImage?.node?.sourceUrl ? (
      <section className="artwork-player artwork-cover" aria-label={`${project.title} lead image`}>
        <div className="artwork-stage" style={coverStyle}>
          <img src={project.featuredImage.node.sourceUrl} alt={project.featuredImage.node.altText || project.title} />
        </div>
        <div className="artwork-controls"><span>SMLDMS / {project.title}</span><span>Editorial project</span></div>
      </section>
    ) : null}
    <section className="artwork-story"><div className="artwork-copy"><span className="artwork-label">About the work</span>
      <WordPressContent content={project.content || ''} />
    </div><dl>
      <div><dt>Artist</dt><dd>SMLDMS</dd></div>
      {infos?.annee && <div><dt>Year</dt><dd>{infos.annee}</dd></div>}
      {categories.length > 0 && <div><dt>Field</dt><dd>{categories.map(category => category.name).join(', ')}</dd></div>}
      {medium && <div><dt>Medium</dt><dd>{medium}</dd></div>}
      {art.network && <div><dt>Network</dt><dd>{art.network}</dd></div>}
      {platform && <div><dt>Platform</dt><dd><a href={platform} target="_blank" rel="noopener noreferrer">{art.platformLabel || infos.platform || 'View project'} ↗</a></dd></div>}
    </dl></section>
    {art.artworkId && <details className="artwork-details"><summary>Artwork details</summary><p>Inscription / token reference</p><code>{art.artworkId}</code></details>}
    <div className="artwork-bottom"><Link to="/projects">← Back to selected works</Link><div>{additionalLink && <a href={additionalLink} target="_blank" rel="noopener noreferrer">Additional link ↗</a>}{platform && <a href={platform} target="_blank" rel="noopener noreferrer">{interactive ? 'Explore the edition' : 'View project'} ↗</a>}</div></div>
  </article>;
}
