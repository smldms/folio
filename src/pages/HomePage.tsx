import React from 'react';
import { useNavigate } from 'react-router-dom';
import GlitchTitle from '../components/GlitchTitle';
import GlitchText from '../components/GlitchText';
import '../styles/glitch.css';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div 
      className="relative z-10 min-h-screen flex flex-col items-center justify-center cursor-pointer vhs-effect overflow-hidden homepage"
      onClick={() => navigate('/projects')}
    >
      <div className="scanlines flex flex-col items-center space-y-4">
        <GlitchTitle />
        <div className="text-center space-y-3">
          <GlitchText 
            text="Digital Artist & Creator"
            className="text-white/80 text-lg md:text-xl font-syncopate"
            intensity="medium"
          />
          <GlitchText
            text="Specializing in generative art, experimental photography, and audiovisual performances."
            className="text-white/60 text-sm md:text-base max-w-xl font-space-grotesk leading-relaxed px-4"
            intensity="low"
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;