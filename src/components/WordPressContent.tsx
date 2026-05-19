import React from 'react';
import MasonryGallery from './MasonryGallery';

interface WordPressContentProps {
  content: string;
}

interface GalleryImage {
  url: string;
  alt?: string;
  width?: number;
  height?: number;
}

const WordPressContent: React.FC<WordPressContentProps> = ({ content }) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(content, 'text/html');

  const blocks = Array.from(doc.body.children).map((element, index) => {

    // ===== GALERIES =====
    if (element.classList.contains('wp-block-gallery')) {
      const figures = element.querySelectorAll('figure');

      const images: GalleryImage[] = Array.from(figures)
        .map((figure) => {
          const img = figure.querySelector('img');
          const caption = figure.querySelector('figcaption');

          if (!img?.src) return null;

          return {
            url: img.src,
            alt: img.alt || caption?.textContent || '',
            width: img.getAttribute('width')
              ? parseInt(img.getAttribute('width')!, 10)
              : undefined,
            height: img.getAttribute('height')
              ? parseInt(img.getAttribute('height')!, 10)
              : undefined,
          };
        })
        .filter(Boolean) as GalleryImage[];

      return (
        <div key={index} className="my-12">
          <MasonryGallery images={images} className="gallery-masonry" />
        </div>
      );
    }

// ===== PULLQUOTES GUTENBERG =====
if (element.classList.contains('wp-block-pullquote')) {
  const textHtml = element.querySelector('p')?.innerHTML || '';
  const cite = element.querySelector('cite')?.textContent || '';

  return (
    <section
      key={index}
      className="relative my-24 px-6 md:px-12 py-16 md:py-24 overflow-hidden border-y border-white/10 bg-black/40"
    >
      {/* scanlines */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.08]">
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(255,255,255,0.12)_51%)] bg-[length:100%_4px]" />
      </div>

      {/* RGB bars */}
      <div className="absolute left-0 top-0 h-full w-[2px] bg-cyan-400/70" />
      <div className="absolute left-[4px] top-0 h-full w-[2px] bg-fuchsia-500/50" />
      <div className="absolute right-0 top-0 h-full w-[2px] bg-white/20" />

      {/* ghost text */}
      <div className="absolute -top-8 left-4 text-[8rem] md:text-[14rem] font-syncopate font-bold text-white/[0.025] leading-none pointer-events-none select-none">
        SMLDMS
      </div>

      <div className="relative z-10 max-w-5xl mx-auto text-center">

        <p
          className="font-syncopate uppercase text-2xl md:text-4xl lg:text-5xl leading-tight tracking-wider text-white"
          dangerouslySetInnerHTML={{ __html: textHtml }}
        />

        {cite && (
          <cite className="block mt-8 font-space-grotesk not-italic text-sm md:text-base tracking-[0.35em] uppercase text-white/45">
            {cite}
          </cite>
        )}

      </div>
    </section>
  );
}

    // ===== CITATIONS GUTENBERG =====
    if (element.classList.contains('wp-block-quote')) {
      const text = element.querySelector('p')?.innerHTML || '';
      const cite = element.querySelector('cite')?.textContent || '';

      return (
        <blockquote
          key={index}
          className="relative my-24 px-8 py-16 border border-white/10 bg-white/[0.03] overflow-hidden"
        >
          {/* scanlines */}
          <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
            <div className="w-full h-full bg-[linear-gradient(to_bottom,transparent_50%,rgba(255,255,255,0.08)_51%)] bg-[length:100%_4px]" />
          </div>

          {/* glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-transparent to-fuchsia-500/5 pointer-events-none" />

          <p className="relative z-10 text-3xl md:text-5xl leading-tight font-syncopate uppercase text-white tracking-wider">
            “{text}”
          </p>

          {cite && (
            <cite className="relative z-10 block mt-6 text-sm tracking-[0.3em] uppercase text-white/40 not-italic font-space-grotesk">
              {cite}
            </cite>
          )}
        </blockquote>
      );
    }

    // ===== BLOCS NORMAUX =====
    return (
      <div
        key={index}
        className="wp-content-block"
        dangerouslySetInnerHTML={{ __html: element.outerHTML }}
      />
    );
  });

  return (
    <div className="prose prose-invert max-w-none wp-content space-y-8">
      {blocks}
    </div>
  );
};

export default WordPressContent;