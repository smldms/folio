import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Menu, X, ChevronDown, Youtube } from 'lucide-react';

interface Category {
  name: string;
  slug: string;
}

interface NavigationProps {
  categories: Category[];
}

const platforms = [
  { name: 'Gamma.io', url: 'https://gamma.io/smldms' },
  { name: 'FxHash', url: 'https://www.fxhash.xyz/u/smldms' },
  { name: 'Generative.xyz', url: 'https://generative.xyz/profile/smldms' },
  { name: 'Neftyblocks', url: 'https://neftyblocks.com/collection/powerfulcard' },
  { name: 'Rarible', url: 'https://rarible.com/smldms' }
];

const Navigation: React.FC<NavigationProps> = ({ categories }) => {
  // Ton ordre préféré ici
const customCategoryOrder = [
  'runtime-art',
  'generative-art',
  'degen-art',
  'post-photography',
  // Si une nouvelle catégorie arrive mais ne figure pas ici,
  // elle ira à la fin
];

// Trie des catégories selon l’ordre défini
const sortedCategories = categories.slice().sort((a, b) => {
  const indexA = customCategoryOrder.indexOf(a.slug);
  const indexB = customCategoryOrder.indexOf(b.slug);
  if (indexA === -1) return 1; // a n'est pas dans la liste → à la fin
  if (indexB === -1) return -1; // b n'est pas dans la liste → à la fin
  return indexA - indexB;
});
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPlatformsOpen, setIsPlatformsOpen] = useState(false);
  
  if (location.pathname === '/') {
    return null;
  }

  const currentCategory = location.pathname.startsWith('/category/') 
    ? location.pathname.split('/category/')[1]
    : null;

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setIsPlatformsOpen(false);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    setIsPlatformsOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-sm border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link 
            to="/" 
            className="text-white font-syncopate font-bold text-xl hover:text-white/70 transition-colors"
            onClick={closeMenu}
          >
            SMLDMS
          </Link>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-white/70 hover:text-white transition-colors"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link 
              to="/projects" 
              className={`transition-colors font-space-grotesk ${
                location.pathname === '/projects' 
                  ? 'text-white' 
                  : 'text-white/70 hover:text-white'
              }`}
            >
              Latest Projects
            </Link>
            {sortedCategories.map((category) => (
              <Link
                key={category.slug}
                to={`/category/${category.slug}`}
                className={`transition-colors font-space-grotesk ${
                  currentCategory === category.slug
                    ? 'text-white'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                {category.name}
              </Link>
            ))}
            <div className="relative group">
              <button
                className="flex items-center space-x-1 text-white/70 hover:text-white transition-colors font-space-grotesk"
                onMouseEnter={() => setIsPlatformsOpen(true)}
              >
                <span>Platforms</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              <div
                className={`absolute top-full right-0 mt-2 w-48 bg-black/90 backdrop-blur-sm border border-white/10 rounded-lg shadow-xl py-2 transition-all duration-200 ${
                  isPlatformsOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                }`}
                onMouseLeave={() => setIsPlatformsOpen(false)}
              >
                {platforms.map((platform) => (
                  <a
                    key={platform.name}
                    href={platform.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-4 py-2 text-white/70 hover:text-white hover:bg-white/10 transition-colors font-space-grotesk"
                  >
                    {platform.name}
                  </a>
                ))}
              </div>
            </div>
            <a
              href="https://youtube.com/@smldms"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-white/70 hover:text-white transition-colors font-space-grotesk"
            >
              <Youtube className="w-5 h-5" />
              <span>Sound</span>
            </a>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`lg:hidden fixed inset-x-0 top-16 bg-black/95 backdrop-blur-md transition-all duration-300 ease-in-out ${
            isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
          }`}
        >
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <Link 
              to="/projects" 
              className={`transition-colors font-space-grotesk py-2 ${
                location.pathname === '/projects' 
                  ? 'text-white' 
                  : 'text-white/70 hover:text-white'
              }`}
              onClick={closeMenu}
            >
              Latest Projects
            </Link>
            {categories.map((category) => (
              <Link
                key={category.slug}
                to={`/category/${category.slug}`}
                className={`transition-colors font-space-grotesk py-2 ${
                  currentCategory === category.slug
                    ? 'text-white'
                    : 'text-white/70 hover:text-white'
                }`}
                onClick={closeMenu}
              >
                {category.name}
              </Link>
            ))}
            <div className="border-t border-white/10 pt-4">
              <div className="text-white/70 font-space-grotesk mb-2">Platforms</div>
              <div className="flex flex-col space-y-2">
                {platforms.map((platform) => (
                  <a
                    key={platform.name}
                    href={platform.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/70 hover:text-white transition-colors font-space-grotesk py-1"
                    onClick={closeMenu}
                  >
                    {platform.name}
                  </a>
                ))}
              </div>
            </div>
            <a
              href="https://youtube.com/@smldms"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-white/70 hover:text-white transition-colors font-space-grotesk py-2"
              onClick={closeMenu}
            >
              <Youtube className="w-5 h-5" />
              <span>Sound</span>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;