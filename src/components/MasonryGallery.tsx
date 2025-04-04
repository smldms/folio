import React, { useState, useEffect } from 'react';
import Masonry from 'react-masonry-css';
import { motion, AnimatePresence } from 'framer-motion';

interface Image {
  url: string;
  alt?: string;
  width?: number;
  height?: number;
}

interface MasonryGalleryProps {
  images: Image[];
  className?: string;
}

const MasonryGallery: React.FC<MasonryGalleryProps> = ({ images, className = '' }) => {
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const [columnCount, setColumnCount] = useState(3);
  const [imageAspectRatios, setImageAspectRatios] = useState<number[]>([]);

  useEffect(() => {
    const loadImages = async () => {
      const ratios = await Promise.all(
        images.map(
          (image) =>
            new Promise<number>((resolve) => {
              if (image.width && image.height) {
                resolve(image.width / image.height);
              } else {
                const img = new Image();
                img.onload = () => resolve(img.width / img.height);
                img.src = image.url;
              }
            })
        )
      );
      setImageAspectRatios(ratios);
    };

    loadImages();
  }, [images]);

  useEffect(() => {
    const determineOptimalColumns = () => {
      if (imageAspectRatios.length === 0) return;

      // Check if all aspect ratios are similar (within 10% of each other)
      const avgRatio = imageAspectRatios.reduce((a, b) => a + b, 0) / imageAspectRatios.length;
      const similarAspectRatios = imageAspectRatios.every(
        ratio => Math.abs(ratio - avgRatio) / avgRatio < 0.1
      );

      if (similarAspectRatios) {
        // For similar aspect ratios, use a number of columns that minimizes orphaned images
        const imageCount = images.length;
        const possibleColumns = [2, 3, 4];
        const optimalColumns = possibleColumns.reduce((best, cols) => {
          const lastRowItems = imageCount % cols;
          const score = lastRowItems === 0 ? 0 : cols - lastRowItems;
          return score < best.score ? { cols, score } : best;
        }, { cols: 3, score: Infinity });

        setColumnCount(optimalColumns.cols);
      } else {
        // For mixed aspect ratios, use responsive breakpoints
        const width = window.innerWidth;
        if (width < 640) setColumnCount(1);
        else if (width < 1024) setColumnCount(2);
        else setColumnCount(3);
      }
    };

    determineOptimalColumns();
    window.addEventListener('resize', determineOptimalColumns);
    return () => window.removeEventListener('resize', determineOptimalColumns);
  }, [imageAspectRatios, images.length]);

  const breakpointColumns = {
    default: columnCount,
    1280: columnCount,
    1024: Math.min(columnCount, 2),
    640: 1
  };

  return (
    <>
      <Masonry
        breakpointCols={breakpointColumns}
        className={`flex -ml-4 w-auto ${className}`}
        columnClassName="pl-4 bg-clip-padding"
      >
        {images.map((image, index) => (
          <div
            key={index}
            className="mb-4 relative overflow-hidden bg-black/10 rounded-lg cursor-zoom-in"
            onClick={() => setSelectedImage(image)}
          >
            <div className="relative group">
              <img
                src={image.url}
                alt={image.alt || ''}
                width={image.width}
                height={image.height}
                className="w-full h-auto object-contain transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              {image.alt && (
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0">
                  <p className="text-white/90 text-sm font-medium">{image.alt}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </Masonry>

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 cursor-zoom-out"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative max-w-[90vw] max-h-[90vh]"
              onClick={e => e.stopPropagation()}
            >
              <img
                src={selectedImage.url}
                alt={selectedImage.alt || ''}
                width={selectedImage.width}
                height={selectedImage.height}
                className="max-w-full max-h-[90vh] object-contain rounded-lg"
              />
              {selectedImage.alt && (
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent">
                  <p className="text-white/90 text-center font-medium">{selectedImage.alt}</p>
                </div>
              )}
              <button
                className="absolute -top-2 -right-2 w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white/90 hover:text-white transition-all duration-300 backdrop-blur-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImage(null);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MasonryGallery;