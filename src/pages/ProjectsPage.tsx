import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllProjects } from '../lib/api';
import type { Project } from '../types/project';
import LiveArtworkCard from '../components/LiveArtworkCard';
import '../styles/selected-works.css';

const normalizeTitle = (title: string) => title
  .toLowerCase()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/[’']/g, '')
  .replace(/[^a-z0-9]+/g, ' ')
  .trim();

const curatedTitles = [
  'Aura',
  'Fees Territory',
  'Timelocked Structures',
  'Acid Bitcoin',
  "Satoshi's Clock",
  'New Punks On The Block',
  'Satoshi Kurinuki',
  'Space Blocks',
  'Harmonic Chaos',
  'Full Moon Night',
  'Squares on Squares',
  'In A Loop',
  'Voyage en Orient 2.0'
].map(normalizeTitle);

const editorialLabels: Record<string, string> = {
  [normalizeTitle('Aura')]: 'Runtime art / Bitcoin',
  [normalizeTitle('Fees Territory')]: 'Generative art / Bitcoin',
  [normalizeTitle('Timelocked Structures')]: 'Runtime art / Bitcoin',
  [normalizeTitle('Acid Bitcoin')]: 'Generative art / Bitcoin',
  [normalizeTitle("Satoshi's Clock")]: 'Runtime art / Bitcoin',
  [normalizeTitle('New Punks On The Block')]: 'Generative collection / Bitcoin',
  [normalizeTitle('Satoshi Kurinuki')]: 'Ceramics / Ordinals',
  [normalizeTitle('Space Blocks')]: 'Early Ordinals / p5.js',
  [normalizeTitle('Harmonic Chaos')]: 'Generative art',
  [normalizeTitle('Full Moon Night')]: 'Generative art',
  [normalizeTitle('Squares on Squares')]: 'Generative art',
  [normalizeTitle('In A Loop')]: 'Cinemagraphs / Moving image',
  [normalizeTitle('Voyage en Orient 2.0')]: 'Moving image / Photography'
};

const ProjectsPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    getAllProjects()
      .then(data => setProjects(data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const selectedProjects = useMemo(() => {
    return [...projects].sort((projectA, projectB) => {
      const indexA = curatedTitles.indexOf(normalizeTitle(projectA.title));
      const indexB = curatedTitles.indexOf(normalizeTitle(projectB.title));
      const orderA = indexA === -1 ? curatedTitles.length : indexA;
      const orderB = indexB === -1 ? curatedTitles.length : indexB;
      return orderA - orderB;
    });
  }, [projects]);

  if (loading) {
    return <div className="selected-works-status">Loading selected works…</div>;
  }

  if (error) {
    return <div className="selected-works-status">Selected works are temporarily unavailable.</div>;
  }

  return (
    <div className="selected-works-page">
      <header className="selected-works-header">
        <p className="selected-works-kicker">SMLDMS / 2015—2026</p>
        <h1>Selected<br />Works</h1>
        <p className="selected-works-intro">
          A curated selection across runtime art, generative systems, moving image and material experiments.
        </p>
      </header>

      <div className="selected-works-rule">
        <span>Projects / {String(selectedProjects.length).padStart(2, '0')}</span>
        <span>Photography · Code · Sound · Matter</span>
      </div>

      <section className="selected-works-grid" aria-label="Selected projects">
        {selectedProjects.map((project, index) => {
          const normalizedTitle = normalizeTitle(project.title);
          const label = editorialLabels[normalizedTitle]
            || project.categoriesProjet?.nodes?.[0]?.name
            || 'Artwork';
          const image = project.featuredImage?.node;
          const presentation = project.artworkPresentation;
          const hasLiveArtwork = presentation?.displayMode === 'interactive'
            && Boolean(presentation.artworkUrl);

          return (
            <article className="selected-work-card" key={project.slug}>
              {hasLiveArtwork ? (
                <LiveArtworkCard
                  artworkUrl={presentation?.artworkUrl || ''}
                  title={project.title}
                  coverUrl={image?.sourceUrl}
                  coverAlt={image?.altText}
                  ratio={presentation?.desktopRatio}
                />
              ) : (
                <Link to={`/project/${project.slug}`} className="selected-work-image">
                  {image?.sourceUrl ? (
                    <img
                      src={image.sourceUrl}
                      alt={image.altText || project.title}
                      loading={index < 2 ? 'eager' : 'lazy'}
                    />
                  ) : (
                    <span className="selected-work-placeholder">SMLDMS</span>
                  )}
                  <span className="selected-work-open">View project ↗</span>
                </Link>
              )}
              <div className="selected-work-info">
                <span className="selected-work-number">{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <h2><Link to={`/project/${project.slug}`}>{project.title}</Link></h2>
                  <p>{label}</p>
                </div>
                <span className="selected-work-year">{project.infosProjet?.annee || '—'}</span>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
};

export default ProjectsPage;
