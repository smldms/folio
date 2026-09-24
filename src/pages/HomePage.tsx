import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { photographs as localPhotographs } from '../lib/photography';
import type { Photograph } from '../lib/photography';
import { getHomepageSettings, getPhotographySelection } from '../lib/api';
import type { HomepageProject, HomepageSettings, PhotographySelectionItem } from '../types/project';
import '../styles/portfolio-home.css';

const auraUrl = 'https://ordinals.com/content/f53814a702a6efc82508da13123ba88edaf176ddcf0a8bdec20964c1da083b39i0';

const defaultRuntime: HomepageProject = {
  title: 'Aura',
  slug: 'aura',
  description: 'A generative artwork inscribed on Bitcoin.',
  artworkUrl: auraUrl,
  network: 'Runtime art'
};

const defaultExplore: HomepageProject[] = [
  { title: 'Fees Territory', slug: 'fees-territory', description: 'Generative art / Bitcoin' },
  { title: 'Satoshi Kurinuki', slug: 'satoshi-kurinuki', description: 'Ceramics / Ordinals' },
  { title: 'Squares on Squares', slug: 'squares-on-squares', description: 'Generative art' }
];

const toPhotograph = (item?: PhotographySelectionItem | null): Photograph | undefined => item ? {
  id: item.id,
  src: item.sourceUrl,
  displaySrc: item.displayUrl || item.sourceUrl,
  filename: `wordpress-${item.id}`,
  alt: item.altText || item.title || 'SMLDMS photography selection',
  title: item.title || '',
  caption: ''
} : undefined;

const HomePage = () => {
  const [settings, setSettings] = useState<HomepageSettings | null>(null);
  const [galleryFallback, setGalleryFallback] = useState<Photograph | undefined>(localPhotographs[0]);

  useEffect(() => {
    getHomepageSettings().then(setSettings);
    getPhotographySelection().then(selection => {
      if (selection === null) return;
      setGalleryFallback(toPhotograph(selection[0]));
    });
  }, []);

  const openingPhotograph = toPhotograph(settings?.photograph) || galleryFallback;
  const runtimeProject = settings?.runtimeProject || defaultRuntime;
  const runtimeUrl = runtimeProject.artworkUrl || defaultRuntime.artworkUrl || auraUrl;
  const exploreProjects = [...(settings?.exploreProjects || []), ...defaultExplore]
    .filter((project, index, projects) => (
      project.slug !== runtimeProject.slug
      && projects.findIndex(candidate => candidate.slug === project.slug) === index
    ))
    .slice(0, 3);

  return (
    <div className="portfolio-home">
      <header className="portfolio-masthead">
        <div className="portfolio-brand">SMLDMS</div>
        <p>
          Photography<br />
          Generative art<br />
          Moving image &amp; sound
        </p>
      </header>

      <div className="portfolio-rule portfolio-meta">
        <span>Photography · Code · Sound</span>
        <span>2011—2026</span>
      </div>

      <section className="portfolio-photo-hero" aria-labelledby="photography-heading">
        <Link to="/photography" className="portfolio-opening-photo">
          {openingPhotograph ? (
            <img src={openingPhotograph.displaySrc} alt={openingPhotograph.alt} />
          ) : (
            <div className="portfolio-photo-placeholder">
              Select an opening photograph in WordPress → Homepage.
            </div>
          )}
        </Link>
        <div className="portfolio-caption">
          <span className="portfolio-number">01 / PHOTOGRAPHY</span>
          <h1 id="photography-heading">Photography</h1>
          <p>A tightly edited selection of photographs made between 2011 and 2026.</p>
          <Link className="portfolio-line-link" to="/photography">
            Explore the selection ↗
          </Link>
        </div>
      </section>

      <div className="portfolio-section-label portfolio-meta">Selected work</div>

      <section className="portfolio-aura-layout" aria-labelledby="runtime-heading">
        <div className="portfolio-caption portfolio-aura-caption">
          <span className="portfolio-number">02 / {(runtimeProject.network || 'Runtime art').toUpperCase()}</span>
          <h2 id="runtime-heading">{runtimeProject.title}</h2>
          <p>{runtimeProject.description || 'Interactive generative artwork.'}</p>
          <Link className="portfolio-line-link" to={`/project/${runtimeProject.slug}`}>
            Explore {runtimeProject.title} ↗
          </Link>
        </div>

        <div>
          <div className="portfolio-aura-stage">
            <iframe
              src={runtimeUrl}
              title={`${runtimeProject.title} — interactive artwork by SMLDMS`}
              loading="lazy"
              sandbox="allow-scripts allow-same-origin"
              allow="autoplay; fullscreen"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="portfolio-aura-actions portfolio-meta">
            <span>SMLDMS / {runtimeProject.title}</span>
            <a href={runtimeUrl} target="_blank" rel="noopener noreferrer">
              Open artwork ↗
            </a>
          </div>
        </div>

        <aside className="portfolio-related" aria-label="More selected work">
          <span className="portfolio-meta">Also explore</span>
          {exploreProjects.map(project => (
            <Link to={`/project/${project.slug}`} key={project.slug}>
              <h3>{project.title} ↗</h3>
              <p>{project.description || 'Selected work'}</p>
            </Link>
          ))}
        </aside>
      </section>

      <section className="portfolio-about-strip">
        <span className="portfolio-meta">About / SMLDMS</span>
        <p>
          Photography, code and sound.<br />
          I explore the structures of the world and those we can invent.
        </p>
      </section>
    </div>
  );
};

export default HomePage;
