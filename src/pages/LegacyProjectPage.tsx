import React from 'react';
import { Link } from 'react-router-dom';
import { Project } from '../types/project';
import WordPressContent from '../components/WordPressContent';
import { safeExternalUrl } from '../components/InteractiveArtwork';
import '../styles/artwork-project.css';

const LegacyProjectPage = ({ project }: { project: Project }) => {
  const infos = project.infosProjet || {};
  const technologies = Array.isArray(infos.technologies)
    ? infos.technologies
    : infos.technologies ? [infos.technologies] : [];
  const categories = project.categoriesProjet?.nodes || [];
  const projectUrl = safeExternalUrl(infos.lienProjet);
  const additionalUrl = safeExternalUrl(infos.autrelien);
  const categoryLabel = categories.map(category => category.name).join(' / ');
  const introduction = [categoryLabel, infos.annee].filter(Boolean).join(' · ');

  return (
    <article className="artwork-project legacy-artwork-project">
      <div className="artwork-sitebar">
        <Link to="/">SMLDMS</Link>
        <Link to="/projects">Works</Link>
      </div>

      <div className="artwork-top">
        <Link to="/projects">← Selected works</Link>
        <span>{categoryLabel || infos.platform || 'Selected project'}</span>
      </div>

      <header className="artwork-title">
        <h1>{project.title}</h1>
        {introduction && <p>{introduction}</p>}
      </header>

      {project.featuredImage?.node?.sourceUrl && (
        <figure className="legacy-artwork-cover">
          <img
            src={project.featuredImage.node.sourceUrl}
            alt={project.featuredImage.node.altText || project.title}
          />
        </figure>
      )}

      <section className="artwork-story">
        <div>
          <span className="artwork-label">About the work</span>
          <WordPressContent content={project.content || ''} />
        </div>
        <dl>
          <div><dt>Artist</dt><dd>SMLDMS</dd></div>
          {infos.annee && <div><dt>Year</dt><dd>{infos.annee}</dd></div>}
          {categoryLabel && <div><dt>Category</dt><dd>{categoryLabel}</dd></div>}
          {infos.platform && <div><dt>Platform</dt><dd>{infos.platform}</dd></div>}
          {technologies.length > 0 && (
            <div>
              <dt>Tools</dt>
              <dd>
                <ul className="legacy-technologies">
                  {technologies.map((technology, index) => <li key={`${technology}-${index}`}>{technology}</li>)}
                </ul>
              </dd>
            </div>
          )}
        </dl>
      </section>

      <div className="artwork-bottom">
        <Link to="/projects">← Back to selected works</Link>
        <div>
          {projectUrl && <a href={projectUrl} target="_blank" rel="noopener noreferrer">View project ↗</a>}
          {additionalUrl && <a href={additionalUrl} target="_blank" rel="noopener noreferrer">Additional link ↗</a>}
        </div>
      </div>
    </article>
  );
};

export default LegacyProjectPage;
