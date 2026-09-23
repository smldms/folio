import React, { useEffect, useState } from 'react';
import { photographs as localPhotographs } from '../lib/photography';
import type { Photograph } from '../lib/photography';
import { getPhotographySelection } from '../lib/api';
import '../styles/portfolio-home.css';

const PhotographyPage = () => {
  const [photographs, setPhotographs] = useState<Photograph[]>(localPhotographs);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const activePhotograph = activeIndex === null ? null : photographs[activeIndex];

  const closeViewer = () => setActiveIndex(null);
  const showPrevious = () => setActiveIndex(index => index === null ? null : Math.max(0, index - 1));
  const showNext = () => setActiveIndex(index => index === null ? null : Math.min(photographs.length - 1, index + 1));

  useEffect(() => {
    getPhotographySelection().then(selection => {
      if (selection === null) return;
      setPhotographs(selection.map((photograph, index) => ({
        id: photograph.id,
        src: photograph.sourceUrl,
        displaySrc: photograph.displayUrl || photograph.sourceUrl,
        filename: `wordpress-${photograph.id}-${index}`,
        alt: photograph.altText || photograph.title || `Photograph ${index + 1}`,
        title: photograph.title || '',
        caption: photograph.caption || ''
      })));
      setActiveIndex(null);
    });
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (activeIndex === null) return;
      if (event.key === 'Escape') closeViewer();
      if (event.key === 'ArrowLeft') showPrevious();
      if (event.key === 'ArrowRight') showNext();
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = activeIndex === null ? '' : 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [activeIndex]);

  return (
    <div className="photography-page">
      <header className="photography-heading">
        <div>
          <span className="portfolio-number">PHOTOGRAPHY / 2011—2026</span>
          <h1>Selected<br />Photographs</h1>
        </div>
        <p className="photography-heading-copy">
          A tightly edited selection of photographs<br />made between 2011 and 2026.
        </p>
      </header>

      {photographs.length > 0 ? (
        <div className="photography-grid">
          {photographs.map((photograph, index) => (
            <button key={photograph.filename} type="button" onClick={() => setActiveIndex(index)}>
              <img loading="lazy" src={photograph.displaySrc} alt={photograph.alt} />
              <span className="photography-card-meta">
                <span>{String(index + 1).padStart(2, '0')} / {String(photographs.length).padStart(2, '0')}</span>
                {photograph.title && <strong>{photograph.title}</strong>}
              </span>
            </button>
          ))}
        </div>
      ) : (
        <div className="photography-empty">
          No photographs are currently selected.
        </div>
      )}

      {activePhotograph && activeIndex !== null && (
        <div className="photography-viewer" role="dialog" aria-modal="true" aria-label="Photograph viewer">
          <div className="photography-viewer-top">
            <span className="portfolio-meta">SMLDMS / Photography</span>
            <button type="button" onClick={closeViewer}>Close ✕</button>
          </div>
          <img src={activePhotograph.src} alt={activePhotograph.alt} />
          <div className="photography-viewer-controls">
            <button type="button" onClick={showPrevious} disabled={activeIndex === 0} aria-label="Previous photograph">←</button>
            <span className="photography-viewer-caption">
              <span className="portfolio-meta">
                {String(activeIndex + 1).padStart(2, '0')} / {String(photographs.length).padStart(2, '0')}
              </span>
              {activePhotograph.title && <strong>{activePhotograph.title}</strong>}
              {activePhotograph.caption && <small>{activePhotograph.caption}</small>}
            </span>
            <button type="button" onClick={showNext} disabled={activeIndex === photographs.length - 1} aria-label="Next photograph">→</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotographyPage;
