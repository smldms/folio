import React from 'react';
import MasonryGallery from './MasonryGallery';

interface WordPressContentProps {
  content: string;
}

const WordPressContent: React.FC<WordPressContentProps> = ({ content }) => {
  const parseGalleryImages = (htmlContent: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    const galleryFigures = doc.querySelectorAll('.wp-block-gallery figure');
    
    const images = Array.from(galleryFigures).map(figure => {
      const img = figure.querySelector('img');
      const caption = figure.querySelector('figcaption');
      return {
        url: img?.src || '',
        alt: img?.alt || caption?.textContent || '',
        width: img?.getAttribute('width') ? parseInt(img.getAttribute('width')!) : undefined,
        height: img?.getAttribute('height') ? parseInt(img.getAttribute('height')!) : undefined,
      };
    });

    // Remove the original gallery from content
    const galleryElements = doc.querySelectorAll('.wp-block-gallery');
    galleryElements.forEach(el => el.remove());

    // Process WordPress columns
    const columns = doc.querySelectorAll('.wp-block-columns');
    columns.forEach(column => {
      const columnCount = column.querySelectorAll(':scope > .wp-block-column').length;
      
      column.classList.add('wp-block-columns', 'is-layout-flex');
      if (columnCount === 3) {
        column.classList.add('has-3-columns');
      } else if (columnCount === 4) {
        column.classList.add('has-4-columns');
      }

      const innerColumns = column.querySelectorAll('.wp-block-column');
      innerColumns.forEach(innerColumn => {
        const style = innerColumn.getAttribute('style') || '';
        innerColumn.classList.add('wp-block-column');
        
        if (style.includes('flex-basis')) {
          innerColumn.setAttribute('style', style);
        }
      });
    });

    return {
      images,
      cleanContent: doc.body.innerHTML
    };
  };

  const { images, cleanContent } = parseGalleryImages(content);

  return (
    <div className="space-y-8">
      <div 
        className="prose prose-invert max-w-none wp-content"
        dangerouslySetInnerHTML={{ __html: cleanContent }}
      />
      {images.length > 0 && (
        <div className="mt-8">
          <MasonryGallery 
            images={images}
            className="gallery-masonry"
          />
        </div>
      )}
    </div>
  );
};

export default WordPressContent;