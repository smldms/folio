import React, { useState, useEffect, useCallback } from 'react';

const GlitchTitle = () => {
  const [glitchState, setGlitchState] = useState({
    offset: { x: 0, y: 0 },
    isGlitching: false,
    chromaOffset: 0,
    textDistortion: 0,
    opacity: 1,
  });

  const triggerGlitch = useCallback(() => {
    if (Math.random() < 0.3) {
      setGlitchState(prev => ({
        ...prev,
        isGlitching: true,
        offset: {
          x: (Math.random() - 0.5) * 10,
          y: (Math.random() - 0.5) * 6
        },
        chromaOffset: Math.random() * 4,
        textDistortion: Math.random(),
        opacity: 0.9 + Math.random() * 0.1
      }));

      setTimeout(() => {
        setGlitchState(prev => ({
          ...prev,
          isGlitching: false,
          offset: { x: 0, y: 0 },
          chromaOffset: 0,
          textDistortion: 0,
          opacity: 1
        }));
      }, Math.random() * 150 + 50);
    }
  }, []);

  useEffect(() => {
    const intervalId = setInterval(triggerGlitch, 100);
    return () => clearInterval(intervalId);
  }, [triggerGlitch]);

  const { offset, isGlitching, chromaOffset, textDistortion, opacity } = glitchState;

  const getTextShadow = () => {
    if (!isGlitching) return 'none';
    return `
      ${chromaOffset * -1}px 0 2px rgba(255,0,0,0.75),
      ${chromaOffset}px 0 2px rgba(0,255,255,0.75)
    `;
  };

  const baseStyles = {
    fontFamily: 'Syncopate, sans-serif',
    fontSize: 'clamp(2rem, 6vw, 4rem)', // Reduced from clamp(3rem, 8vw, 6rem)
    letterSpacing: isGlitching ? `${textDistortion * 4}px` : '0',
    filter: isGlitching ? 'blur(0.5px)' : 'none',
    transition: 'all 0.05s linear',
    opacity,
    textShadow: getTextShadow(),
    transform: `translate(${offset.x}px, ${offset.y}px)`,
    width: 'fit-content',
    fontWeight: 700,
  };

  return (
    <div className="relative flex items-center justify-center overflow-hidden">
      <div 
        className="relative text-white font-bold tracking-wider uppercase"
        style={baseStyles}
      >
        SMLDMS
      </div>
      {isGlitching && (
        <>
          <div
            className="absolute text-white font-bold tracking-wider uppercase mix-blend-screen"
            style={{
              ...baseStyles,
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: `translate(-50%, -50%) translate(${offset.x + 2}px, ${offset.y - 1}px)`,
              color: 'rgba(255,0,0,0.5)',
              clipPath: `polygon(${Math.random() * 100}% 0, 100% 0, 100% 100%, 0 100%)`
            }}
          >
            SMLDMS
          </div>
          <div
            className="absolute text-white font-bold tracking-wider uppercase mix-blend-screen"
            style={{
              ...baseStyles,
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: `translate(-50%, -50%) translate(${offset.x - 2}px, ${offset.y + 1}px)`,
              color: 'rgba(0,255,255,0.5)',
              clipPath: `polygon(0 ${Math.random() * 100}%, 100% 0, 100% 100%, 0 100%)`
            }}
          >
            SMLDMS
          </div>
        </>
      )}
    </div>
  );
};

export default GlitchTitle;