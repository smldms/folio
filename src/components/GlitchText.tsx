import React, { useState, useEffect, useCallback } from 'react';

interface GlitchTextProps {
  text: string;
  className?: string;
  intensity?: 'low' | 'medium' | 'high';
}

const GlitchText: React.FC<GlitchTextProps> = ({ 
  text, 
  className = '', 
  intensity = 'low' 
}) => {
  const [glitchState, setGlitchState] = useState({
    offset: { x: 0, y: 0 },
    isGlitching: false,
    chromaOffset: 0,
    textDistortion: 0,
    opacity: 1,
  });

  const getGlitchProbability = () => {
    switch (intensity) {
      case 'high': return 0.3;
      case 'medium': return 0.2;
      case 'low': return 0.1;
      default: return 0.1;
    }
  };

  const triggerGlitch = useCallback(() => {
    if (Math.random() < getGlitchProbability()) {
      setGlitchState(prev => ({
        ...prev,
        isGlitching: true,
        offset: {
          x: (Math.random() - 0.5) * 3,
          y: (Math.random() - 0.5) * 2
        },
        chromaOffset: Math.random() * 2,
        textDistortion: Math.random() * 0.5,
        opacity: 0.95 + Math.random() * 0.05
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
      }, Math.random() * 100 + 50);
    }
  }, [intensity]);

  useEffect(() => {
    const intervalId = setInterval(triggerGlitch, 150);
    return () => clearInterval(intervalId);
  }, [triggerGlitch]);

  const { offset, isGlitching, chromaOffset, textDistortion, opacity } = glitchState;

  const getTextShadow = () => {
    if (!isGlitching) return 'none';
    return `
      ${chromaOffset * -1}px 0 1px rgba(255,0,0,0.5),
      ${chromaOffset}px 0 1px rgba(0,255,255,0.5)
    `;
  };

  const baseStyles = {
    letterSpacing: isGlitching ? `${textDistortion}px` : '0',
    filter: isGlitching ? 'blur(0.2px)' : 'none',
    transition: 'all 0.05s linear',
    opacity,
    textShadow: getTextShadow(),
    transform: `translate(${offset.x}px, ${offset.y}px)`,
    display: 'inline-block',
  };

  const getRandomClipPath = () => {
    const side = Math.random() < 0.5 ? 'left' : 'right';
    const startY = Math.random() * 100;
    const endY = Math.random() * 100;
    
    if (side === 'left') {
      return `polygon(0 ${startY}%, 50% ${endY}%, 50% 100%, 0 100%)`;
    } else {
      return `polygon(50% ${startY}%, 100% ${endY}%, 100% 100%, 50% 100%)`;
    }
  };

  return (
    <div className="relative">
      <div 
        className={className}
        style={baseStyles}
      >
        {text}
      </div>
      {isGlitching && (
        <>
          {/* Left side glitch */}
          <div
            className={`absolute top-0 left-0 ${className} mix-blend-screen`}
            style={{
              ...baseStyles,
              color: 'rgba(255,0,0,0.5)',
              transform: `translate(${offset.x - 1}px, ${offset.y}px)`,
              clipPath: `polygon(0 0, 50% 0, 50% 100%, 0 100%)`
            }}
          >
            {text}
          </div>
          {/* Right side glitch */}
          <div
            className={`absolute top-0 left-0 ${className} mix-blend-screen`}
            style={{
              ...baseStyles,
              color: 'rgba(0,255,255,0.5)',
              transform: `translate(${offset.x + 1}px, ${offset.y}px)`,
              clipPath: `polygon(50% 0, 100% 0, 100% 100%, 50% 100%)`
            }}
          >
            {text}
          </div>
          {/* Random additional glitch fragments */}
          <div
            className={`absolute top-0 left-0 ${className} mix-blend-screen`}
            style={{
              ...baseStyles,
              color: 'rgba(255,0,0,0.3)',
              clipPath: getRandomClipPath()
            }}
          >
            {text}
          </div>
          <div
            className={`absolute top-0 left-0 ${className} mix-blend-screen`}
            style={{
              ...baseStyles,
              color: 'rgba(0,255,255,0.3)',
              clipPath: getRandomClipPath()
            }}
          >
            {text}
          </div>
        </>
      )}
    </div>
  );
};

export default GlitchText;