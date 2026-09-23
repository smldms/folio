import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const navigation = [
  { path: '/projects', label: 'Selected Works' },
  { path: '/photography', label: 'Photography' },
  { path: '/rewired-archive', label: 'Rewired Archive' },
  { path: '/about', label: 'About' }
];

const Navigation = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const isActive = (path: string) => {
    if (path === '/projects') {
      return location.pathname === '/projects' || location.pathname.startsWith('/project/');
    }
    return location.pathname === path;
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
            {navigation.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`transition-colors font-space-grotesk ${
                  isActive(item.path)
                    ? 'text-white'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`lg:hidden fixed inset-x-0 top-16 bg-black/95 backdrop-blur-md transition-all duration-300 ease-in-out ${
            isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
          }`}
        >
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            {navigation.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`transition-colors font-space-grotesk py-2 ${
                  isActive(item.path)
                    ? 'text-white'
                    : 'text-white/70 hover:text-white'
                }`}
                onClick={closeMenu}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
