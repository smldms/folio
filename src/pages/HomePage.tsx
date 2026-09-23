import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { photographs as localPhotographs } from '../lib/photography';
import type { Photograph } from '../lib/photography';
import { getPhotographySelection } from '../lib/api';
import '../styles/portfolio-home.css';

const auraUrl = 'https://ordinals.com/content/f53814a702a6efc82508da13123ba88edaf176ddcf0a8bdec20964c1da083b39i0';

const HomePage = () => {
  const [openingPhotograph, setOpeningPhotograph] = useState<Photograph | undefined>(localPhotographs[0]);

  useEffect(() => {
    getPhotographySelection().then(selection => {
      if (selection === null) return;
      const first = selection[0];
      setOpeningPhotograph(first ? {
        id: first.id,
        src: first.sourceUrl,
        displaySrc: first.displayUrl || first.sourceUrl,
        filename: `wordpress-${first.id}`,
        alt: first.altText || first.title || 'SMLDMS photography selection',
        title: first.title || '',
        caption: first.caption || ''
      } : undefined);
    });
  }, []);

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
              Select an opening photograph in WordPress → Photography.
            </div>
          )}
        </Link>
        <div className="portfolio-caption">
          <span className="portfolio-number">01 / PHOTOGRAPHY</span>
          <h1 id="photography-heading">Photography</h1>
          <p>
            A tightly edited selection of photographs made between 2011 and 2026.
          </p>
          <Link className="portfolio-line-link" to="/photography">
            Explore the selection ↗
          </Link>
        </div>
      </section>

      <div className="portfolio-section-label portfolio-meta">Selected work</div>

      <section className="portfolio-aura-layout" aria-labelledby="aura-heading">
        <div className="portfolio-caption portfolio-aura-caption">
          <span className="portfolio-number">02 / RUNTIME ART</span>
          <h2 id="aura-heading">Aura</h2>
          <p>A generative artwork inscribed on Bitcoin.</p>
          <Link className="portfolio-line-link" to="/project/aura">
            Explore Aura ↗
          </Link>
        </div>

        <div>
          <div className="portfolio-aura-stage">
            <iframe
              src={auraUrl}
              title="Aura — interactive artwork by SMLDMS, inscribed on Bitcoin Ordinals"
              loading="lazy"
              sandbox="allow-scripts allow-same-origin"
              allow="autoplay; fullscreen"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="portfolio-aura-actions portfolio-meta">
            <span>SMLDMS / AURA</span>
            <a href={auraUrl} target="_blank" rel="noopener noreferrer">
              Open artwork ↗
            </a>
          </div>
        </div>

        <aside className="portfolio-related" aria-label="More selected work">
          <span className="portfolio-meta">Also explore</span>
          <Link to="/project/fees-territory">
            <h3>Fees Territory ↗</h3>
            <p>Generative art / Bitcoin</p>
          </Link>
          <Link to="/project/satoshi-kurinuki">
            <h3>Satoshi Kurinuki ↗</h3>
            <p>Ceramics / Ordinals</p>
          </Link>
          <Link to="/project/squares-on-squares">
            <h3>Squares on Squares ↗</h3>
            <p>Generative art</p>
          </Link>
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
