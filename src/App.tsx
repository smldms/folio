import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectPage from './pages/ProjectPage';
import CategoryPage from './pages/CategoryPage';
import PhotographyPage from './pages/PhotographyPage';
import RewiredArchivePage from './pages/RewiredArchivePage';
import AboutPage from './pages/AboutPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-black relative flex flex-col">
        <Navigation />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/photography" element={<PhotographyPage />} />
            <Route path="/rewired-archive" element={<RewiredArchivePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/project/:slug" element={<ProjectPage />} />
            <Route path="/category/:slug" element={<CategoryPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
