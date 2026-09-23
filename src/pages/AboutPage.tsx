import React, { useEffect, useState } from 'react';
import { getAboutPage } from '../lib/api';
import type { AboutContent } from '../types/project';
import '../styles/about.css';

const fallbackAbout: AboutContent = {
  title: 'About',
  content: `
    <p>I work across photography, code, sound, moving image and material experimentation.</p>
    <p>Rooted in underground electronic culture, my practice explores time, memory, repetition and the visible and invisible systems that shape perception—from photographic traces to generative and onchain artworks.</p>
    <p>My work moves between digital and physical forms, guided by randomness, loops and signal.</p>
    <p><a href="mailto:smldms.art@gmail.com">Contact ↗</a></p>
  `
};

const AboutPage = () => {
  const [page, setPage] = useState<AboutContent>(fallbackAbout);

  useEffect(() => {
    getAboutPage().then(remotePage => {
      if (remotePage?.content) setPage(remotePage);
    });
  }, []);

  const image = page.featuredImage?.node;

  return (
    <div className="about-page">
      <header className="about-hero">
        <p className="about-kicker">{page.title || 'About'} / SMLDMS</p>
        <h1>SMLDMS</h1>
        <p className="about-disciplines">Photography · Code · Sound · Matter</p>
      </header>

      <section className={`about-body ${image?.sourceUrl ? 'has-image' : ''}`}>
        {image?.sourceUrl && (
          <figure className="about-portrait">
            <img src={image.sourceUrl} alt={image.altText || 'SMLDMS'} />
          </figure>
        )}
        <div className="about-copy">
          <span className="about-index">01 / Practice</span>
          <div
            className="about-wordpress-content"
            dangerouslySetInnerHTML={{ __html: page.content || fallbackAbout.content || '' }}
          />
        </div>
      </section>

      <footer className="about-footer">
        <span>SMLDMS / France</span>
        <span>Selected practice / 2011—2026</span>
      </footer>
    </div>
  );
};

export default AboutPage;
