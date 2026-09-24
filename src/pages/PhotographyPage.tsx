import React, { useEffect, useState } from 'react';
import { photographs as localPhotographs } from '../lib/photography';
import type { Photograph } from '../lib/photography';
import { getPhotographySelection, getPhotographySeries } from '../lib/api';
import type {
  PhotographyBlockAlign,
  PhotographyBlockLayout,
  PhotographyBlockSize,
  PhotographySelectionItem,
  PhotographySeries
} from '../types/project';
import '../styles/portfolio-home.css';

type DisplayPhotograph = Photograph & { globalIndex: number };

type DisplayBlock = {
  id: string;
  layout: PhotographyBlockLayout;
  size: PhotographyBlockSize;
  align: PhotographyBlockAlign;
  caption: string;
  photographs: DisplayPhotograph[];
};

type DisplaySeries = {
  id: string;
  title: string;
  introduction: string;
  period: string;
  blocks: DisplayBlock[];
};

const layoutCapacity: Record<PhotographyBlockLayout, number> = {
  solo: 1,
  diptych: 2,
  triptych: 3,
  quadriptych: 4
};

const normaliseLayout = (layout?: string | null): PhotographyBlockLayout => (
  layout === 'diptych' || layout === 'triptych' || layout === 'quadriptych' ? layout : 'solo'
);

const normaliseSize = (size?: string | null): PhotographyBlockSize => (
  size === 'full' || size === 'medium' || size === 'small' ? size : 'large'
);

const normaliseAlign = (align?: string | null): PhotographyBlockAlign => (
  align === 'left' || align === 'right' ? align : 'center'
);

const selectionItemToPhotograph = (
  photograph: PhotographySelectionItem,
  key: string,
  globalIndex: number
): DisplayPhotograph => ({
  id: photograph.id,
  src: photograph.sourceUrl,
  displaySrc: photograph.displayUrl || photograph.sourceUrl,
  filename: `wordpress-${photograph.id}-${key}`,
  alt: photograph.altText || photograph.title || `Photograph ${globalIndex + 1}`,
  title: photograph.title || '',
  caption: photograph.caption || '',
  globalIndex
});

const hydrateSeries = (series: PhotographySeries[]): DisplaySeries[] => {
  let globalIndex = 0;

  return series.map((chapter, seriesIndex) => ({
    id: chapter.id || `series-${seriesIndex}`,
    title: chapter.title || '',
    introduction: chapter.introduction || '',
    period: chapter.period || '',
    blocks: (chapter.blocks || []).map((block, blockIndex) => {
      const layout = normaliseLayout(block.layout);
      const photographs = (block.images || [])
        .slice(0, layoutCapacity[layout])
        .map((photograph, imageIndex) => selectionItemToPhotograph(
          photograph,
          `${seriesIndex}-${blockIndex}-${imageIndex}`,
          globalIndex++
        ));

      return {
        id: block.id || `block-${seriesIndex}-${blockIndex}`,
        layout,
        size: normaliseSize(block.size),
        align: normaliseAlign(block.align),
        caption: block.caption || '',
        photographs
      };
    }).filter(block => block.photographs.length > 0)
  })).filter(chapter => chapter.blocks.length > 0);
};

const buildAutomaticSeries = (photographs: Photograph[]): DisplaySeries[] => {
  const pattern: PhotographyBlockLayout[] = ['diptych', 'solo', 'triptych', 'solo', 'quadriptych'];
  const blocks: DisplayBlock[] = [];
  let cursor = 0;
  let patternIndex = 0;

  while (cursor < photographs.length) {
    const layout = cursor === 0 ? 'solo' : pattern[patternIndex++ % pattern.length];
    const capacity = layoutCapacity[layout];
    const size: PhotographyBlockSize = cursor === 0 ? 'full' : layout === 'solo' ? 'medium' : 'large';
    const align: PhotographyBlockAlign = layout === 'solo' && blocks.length % 2 === 0 ? 'right' : 'left';
    const items = photographs.slice(cursor, cursor + capacity).map((photograph, offset) => ({
      ...photograph,
      globalIndex: cursor + offset
    }));

    blocks.push({
      id: `automatic-${blocks.length}`,
      layout: items.length === 1 ? 'solo' : layout,
      size,
      align,
      caption: '',
      photographs: items
    });
    cursor += items.length;
  }

  return [{ id: 'automatic-series', title: '', introduction: '', period: '', blocks }];
};

const PhotographyPage = () => {
  const [series, setSeries] = useState<DisplaySeries[]>(buildAutomaticSeries(localPhotographs));
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const photographs = series.flatMap(chapter => chapter.blocks.flatMap(block => block.photographs));
  const activePhotograph = activeIndex === null ? null : photographs[activeIndex];

  const closeViewer = () => setActiveIndex(null);
  const showPrevious = () => setActiveIndex(index => index === null ? null : Math.max(0, index - 1));
  const showNext = () => setActiveIndex(index => index === null ? null : Math.min(photographs.length - 1, index + 1));

  useEffect(() => {
    const loadPhotography = async () => {
      const managedSeries = await getPhotographySeries();
      if (managedSeries && managedSeries.length > 0) {
        setSeries(hydrateSeries(managedSeries));
        setActiveIndex(null);
        return;
      }

      const selection = await getPhotographySelection();
      if (selection === null) return;
      const fallback = selection.map((photograph, index) => selectionItemToPhotograph(photograph, String(index), index));
      setSeries(buildAutomaticSeries(fallback));
      setActiveIndex(null);
    };

    loadPhotography();
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
          {series.map((chapter, seriesIndex) => (
            <section className="photography-series" key={chapter.id}>
              {(chapter.title || chapter.introduction || chapter.period) && (
                <header className="photography-series-heading">
                  <div>
                    <span className="portfolio-number">SERIES {String(seriesIndex + 1).padStart(2, '0')}</span>
                    {chapter.title && <h2>{chapter.title}</h2>}
                  </div>
                  <div className="photography-series-copy">
                    {chapter.period && <span className="portfolio-meta">{chapter.period}</span>}
                    {chapter.introduction && <p>{chapter.introduction}</p>}
                  </div>
                </header>
              )}

              <div className="photography-series-blocks">
                {chapter.blocks.map(block => (
                  <figure
                    className={`photography-block photography-block--${block.layout} photography-block--${block.size} photography-block--${block.align}`}
                    key={block.id}
                  >
                    <div className="photography-block-images">
                      {block.photographs.map(photograph => (
                        <button
                          className="photography-card"
                          key={photograph.filename}
                          type="button"
                          onClick={() => setActiveIndex(photograph.globalIndex)}
                          aria-label={`Open photograph ${photograph.globalIndex + 1}${photograph.title ? `: ${photograph.title}` : ''}`}
                        >
                          <span className="photography-card-image">
                            <img
                              loading={photograph.globalIndex === 0 ? 'eager' : 'lazy'}
                              src={block.size === 'full' || block.size === 'large' ? photograph.src : photograph.displaySrc}
                              alt={photograph.alt}
                            />
                            <span className="photography-card-index" aria-hidden="true">
                              {String(photograph.globalIndex + 1).padStart(2, '0')}
                            </span>
                          </span>
                        </button>
                      ))}
                    </div>
                    {block.caption && <figcaption>{block.caption}</figcaption>}
                  </figure>
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="photography-empty">No photographs are currently selected.</div>
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
