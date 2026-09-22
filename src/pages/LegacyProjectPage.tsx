import React from 'react';
import { Project } from '../types/project';
import WordPressContent from '../components/WordPressContent';

const LegacyProjectPage = ({ project }: { project: Project }) => {
  const infos = project.infosProjet || {};
  const technologies = Array.isArray(infos.technologies) ? infos.technologies : infos.technologies ? [infos.technologies] : [];
  const categories = project.categoriesProjet?.nodes || [];

  return (
    <div className="relative z-10">
      {/* Hero Banner */}
      <div className="relative w-full h-[70vh] overflow-hidden">
        {project.featuredImage?.node?.sourceUrl && (
          <>
            <div className="absolute inset-0">
              <img
                src={project.featuredImage.node.sourceUrl}
                alt={project.featuredImage.node.altText || project.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="container mx-auto px-4">
                <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 font-syncopate text-center">
                  {project.title}
                </h1>
                <div className="flex flex-wrap items-center justify-center gap-4 text-white/70 font-space-grotesk">
                  {infos.platform && <span>{infos.platform}</span>}
                  {infos.annee && <span>{infos.annee}</span>}
                  {categories.length > 0 && (
                    <span>{categories.map((cat) => cat.name).join(', ')}</span>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <div className="space-y-12">
            {/* Project Description and Gallery */}
            <WordPressContent content={project.content} />

            {/* Technologies */}
            {technologies.length > 0 && (
              <div className="pt-8 border-t border-white/10">
                <h3 className="text-xl font-bold text-white mb-3 font-syncopate">Technologies</h3>
                <div className="flex flex-wrap gap-2">
                  {technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-white/10 text-white/70 rounded font-space-grotesk"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Links */}
            <div className="flex flex-wrap gap-4 pt-8 border-t border-white/10">
              {infos.lienProjet && (
                <a
                  href={infos.lienProjet}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-white/10 text-white hover:bg-white/20 transition-colors rounded font-space-grotesk"
                >
                  View Project
                </a>
              )}
              {infos.autrelien && (
                <a
                  href={infos.autrelien}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-white/10 text-white hover:bg-white/20 transition-colors rounded font-space-grotesk"
                >
                  Additional Link
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegacyProjectPage;
