import React, { useEffect, useState } from 'react';
import { photographs as localPhotographs } from '../lib/photography';
import type { Photograph } from '../lib/photography';
import { getPhotographySelection } from '../lib/api';
import '../styles/portfolio-home.css';

type SequenceSection = {
  type: 'opening' | 'diptych' | 'wide' | 'triptych' | 'isolated' | 'asymmetric';
  photographs: Array<{ photograph: Photograph; index: number }>;
  variation?: 'left' | 'right';
};

const sectionPattern: Array<{ type: SequenceSection['type']; size: number }> = [
  { type: 'diptych', size: 2 },
  { type: 'wide', size: 1 },
  { type: 'triptych', size: 3 },
  { type: 'isolated', size: 1 },
  { type: 'asymmetric', size: 2 },
  { type: 'wide', size: 1 },
  { type: 'diptych', size: 2 },
  { type: 'isolated', size: 1 }
];

const buildSequence = (photographs: Photograph[]): SequenceSection[] => {
  if (photographs.length === 0) return [];

  const sections: SequenceSection[] = [{
    type: 'opening',
    photographs: [{ photograph: photographs[0], index: 0 }]
  }];
  let cursor = 1;
  let patternIndex = 0;
  let isolatedIndex = 0;
  let asymmetricIndex = 0;

  while (cursor < photographs.length) {
    const pattern = sectionPattern[patternIndex % sectionPattern.length];
    const items = photographs
      .slice(cursor, cursor + pattern.size)
      .map((photograph, offset) => ({ photograph, index: cursor + offset }));
    const variation = pattern.type === 'isolated'
      ? (isolatedIndex++ % 2 === 0 ? 'left' : 'right')
      : pattern.type === 'asymmetric'
        ? (asymmetricIndex++ % 2 === 0 ? 'left' : 'right')
        : undefined;

    sections.push({ type: pattern.type, photographs: items, variation });
    cursor += items.length;
    patternIndex += 1;
  }

  return sections;
};

const PhotographyPage = () => {
  const [photographs, setPhotographs] = useState<Photograph[]>(localPhotographs);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const activePhotograph = activeIndex === null ? null : photographs[activeIndex];
  const sequence = buildSequence(photographs);

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
        <div className="photography-sequence">
          {sequence.map((section, sectionIndex) => (
            <div
              className={`photography-sequence-section photography-sequence-section--${section.type}${section.variation ? ` photography-sequence-section--${section.variation}` : ''}`}
              key={`${section.type}-${sectionIndex}`}
            >
              {section.photographs.map(({ photograph, index }) => (
                <button
                  className="photography-card"
                  key={photograph.filename}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  aria-label={`Open photograph ${index + 1}${photograph.title ? `: ${photograph.title}` : ''}`}
                >
                  <span className="photography-card-image">
                    <img
                      loading={index === 0 ? 'eager' : 'lazy'}
                      src={section.type === 'opening' || section.type === 'wide' ? photograph.src : photograph.displaySrc}
                      alt={photograph.alt}
                    />
                    <span className="photography-card-index" aria-hidden="true">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </span>
                </button>
              ))}
            </div>
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
