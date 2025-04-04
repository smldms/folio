import React, { useEffect, useRef } from 'react';
import p5 from 'p5';
import { useLocation } from 'react-router-dom';

interface GlitchBackgroundProps {
  className?: string;
}

const GlitchBackground: React.FC<GlitchBackgroundProps> = ({ className }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const p5Instance = useRef<p5 | null>(null);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    if (!p5Instance.current && containerRef.current) {
      const sketch = (p: p5) => {
        let phase = 0;
        let glitchIntensity = 1.0;
        const MAX_GLITCH = 3.0;
        const GLITCH_DECAY = 0.995;
        let scanlineY = 0;
        let verticalBands: { x: number; width: number; life: number; opacity: number }[] = [];

        p.setup = () => {
          const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
          canvas.parent(containerRef.current!);
          p.pixelDensity(1);
          p.colorMode(p.RGB, 255);
          p.noStroke();
          p.frameRate(60);
        };

        p.draw = () => {
          p.clear();
          p.background(0, 0, 0, 35);
          
          phase += (p.deltaTime / 1000) * 2;
          glitchIntensity = Math.max(0.2, glitchIntensity * GLITCH_DECAY);

          if (p.random() < 0.05) {
            glitchIntensity = p.random(1, MAX_GLITCH);
          }

          updateVerticalBands();
          drawVerticalBands();
          drawExtraVerticalBands();
          drawScanlines();
          drawSimulatedNoise();
          drawHorizontalGlitch();
          drawBlockDisplacement();

          if (p.random() < 0.1) {
            if (p.random() < 0.5) {
              addVerticalBand();
            }
          }
        };

        const addVerticalBand = () => {
          verticalBands.push({
            x: p.random(p.width),
            width: p.random(20, 200),
            life: p.random(30, 60),
            opacity: p.random(30, 100)
          });
        };

        const updateVerticalBands = () => {
          verticalBands = verticalBands.filter(band => {
            band.life--;
            return band.life > 0;
          });
        };

        const drawVerticalBands = () => {
          p.push();
          p.blendMode(p.ADD);
          verticalBands.forEach(band => {
            const alpha = (band.life / 60) * band.opacity;
            
            p.fill(255, 0, 0, alpha);
            p.rect(band.x - 2, 0, band.width, p.height);
            
            p.fill(0, 255, 0, alpha);
            p.rect(band.x, 0, band.width, p.height);
            
            p.fill(0, 0, 255, alpha);
            p.rect(band.x + 2, 0, band.width, p.height);
          });
          p.blendMode(p.BLEND);
          p.pop();
        };

        const drawExtraVerticalBands = () => {
          if (p.random() < 0.1) {
            const x = p.random(p.width);
            const width = p.random(50, 300);
            const alpha = p.random(20, 40);
            
            p.push();
            p.blendMode(p.SCREEN);
            p.fill(255, alpha);
            p.rect(x, 0, width, p.height);
            p.pop();
          }
        };

        const drawScanlines = () => {
          p.push();
          p.strokeWeight(1);
          scanlineY = (scanlineY + 1.5) % p.height;
          p.stroke(255, 255, 255, 20 + 10 * glitchIntensity);
          p.line(0, scanlineY, p.width, scanlineY);
          
          for (let y = 0; y < p.height; y += 4) {
            p.stroke(0, 0, 0, 100 + 40 * glitchIntensity);
            p.line(0, y, p.width, y);
          }
          p.pop();
        };

        const drawSimulatedNoise = () => {
          p.push();
          p.strokeWeight(1);
          let noisePoints = Math.floor((p.width * p.height * 0.00015) * (1 + glitchIntensity * 1.5));
          noisePoints = Math.min(noisePoints, 4000);
          
          for (let i = 0; i < noisePoints; i++) {
            const x = p.random(p.width);
            const y = p.random(p.height);
            const brightness = p.random(0, 100);
            const alpha = p.random(0, 120) * (1 + glitchIntensity * 0.8);
            
            p.stroke(brightness, Math.min(alpha, 180));
            p.point(x, y);
            
            if (p.random() < 0.03 * glitchIntensity) {
              p.noStroke();
              p.fill(p.random(50, 180), 60);
              p.rect(x, y, p.random(1, 5), p.random(1, 25));
            }
          }
          p.pop();
        };

        const drawHorizontalGlitch = () => {
          if (p.random() < (0.08 + glitchIntensity * 0.2)) {
            const y = p.random(p.height);
            const h = p.random(2, 20) * (1 + glitchIntensity * 0.5);
            const offset = p.random(-p.width * 0.5, p.width * 0.5) * glitchIntensity;
            
            let sourceX = 0;
            let destX = offset;
            let copyWidth = p.width;
            
            if (destX < 0) {
              sourceX = -destX;
              copyWidth = p.width + destX;
              destX = 0;
            } else if (destX + p.width > p.width) {
              copyWidth = p.width - destX;
            }
            
            if (copyWidth > 0 && h > 0) {
              p.copy(
                Math.floor(sourceX), Math.floor(y),
                Math.floor(copyWidth), Math.floor(h),
                Math.floor(destX), Math.floor(y),
                Math.floor(copyWidth), Math.floor(h)
              );
            }
          }
        };

        const drawBlockDisplacement = () => {
          const numBlocks = Math.floor(p.random(glitchIntensity * 2));
          const maxBlocks = Math.min(numBlocks, 5);
          
          for (let i = 0; i < maxBlocks; i++) {
            if (p.random() < (0.05 * glitchIntensity)) {
              const sourceX = p.random(p.width * 0.9);
              const sourceY = p.random(p.height * 0.9);
              const blockWidth = p.random(30, 150);
              const blockHeight = p.random(30, 150);
              
              const finalWidth = Math.min(blockWidth, p.width - sourceX);
              const finalHeight = Math.min(blockHeight, p.height - sourceY);
              
              let destX = sourceX + p.random(-100, 100) * glitchIntensity * 0.5;
              let destY = sourceY + p.random(-100, 100) * glitchIntensity * 0.5;
              
              destX = p.constrain(destX, -finalWidth / 2, p.width - finalWidth / 2);
              destY = p.constrain(destY, -finalHeight / 2, p.height - finalHeight / 2);
              
              if (finalWidth > 1 && finalHeight > 1) {
                p.copy(
                  Math.floor(sourceX), Math.floor(sourceY),
                  Math.floor(finalWidth), Math.floor(finalHeight),
                  Math.floor(destX), Math.floor(destY),
                  Math.floor(finalWidth), Math.floor(finalHeight)
                );
              }
            }
          }
        };

        p.windowResized = () => {
          p.resizeCanvas(p.windowWidth, p.windowHeight);
        };
      };

      p5Instance.current = new p5(sketch);
    }

    return () => {
      if (p5Instance.current) {
        p5Instance.current.remove();
        p5Instance.current = null;
      }
    };
  }, [location.pathname, isHomePage]);

  return <div ref={containerRef} className={className} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />;
};

export default GlitchBackground;