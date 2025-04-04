import React from 'react';
import { Instagram, Twitter, Github, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative z-10 bg-black/40 backdrop-blur-sm border-t border-white/10 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center space-y-6">
          <div className="text-white font-syncopate font-bold text-xl">
            SMLDMS
          </div>
          <div className="flex items-center space-x-6">
            <a
              href="https://www.instagram.com/smldms_nft/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/70 hover:text-white transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="w-6 h-6" />
            </a>
            <a
              href="https://twitter.com/smldms_nft"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/70 hover:text-white transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="w-6 h-6" />
            </a>
            <a
              href="https://github.com/smldms"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/70 hover:text-white transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-6 h-6" />
            </a>
            <a
              href="mailto:smldms.art@gmail.com"
              className="text-white/70 hover:text-white transition-colors"
              aria-label="Email"
            >
              <Mail className="w-6 h-6" />
            </a>
          </div>
          <div className="text-white/50 font-space-grotesk text-sm">
            © 2025 SMLDMS. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;