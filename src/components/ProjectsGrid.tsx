import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Masonry from 'react-masonry-css';
import { getAllProjects } from '../lib/api';
import type { Project } from '../types/project';

interface ProjectsGridProps {
  categorySlug?: string;
}

const PROJECTS_PER_PAGE = 10;

const ProjectsGrid: React.FC<ProjectsGridProps> = ({ categorySlug }) => {
  const [projects, setProjects] = React.useState<Project[]>([]);
  const [displayedProjects, setDisplayedProjects] = React.useState<Project[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [page, setPage] = React.useState(1);
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projectsData = await getAllProjects();
        
        // Filter projects if a category is selected
        let filteredProjects = categorySlug
          ? projectsData.filter(project => 
              project.categoriesProjet.nodes.some(cat => cat.slug === categorySlug)
            )
          : projectsData;

        // Sort projects by year in descending order
        filteredProjects = filteredProjects.sort((a, b) => {
          const yearA = parseInt(a.infosProjet?.annee || '0', 10);
          const yearB = parseInt(b.infosProjet?.annee || '0', 10);
          return yearB - yearA;
        });
        
        setProjects(filteredProjects);
        setDisplayedProjects(filteredProjects.slice(0, PROJECTS_PER_PAGE));
        setLoading(false);
      } catch (err) {
        setError('Failed to load projects');
        setLoading(false);
        console.error('Error fetching projects:', err);
      }
    };

    fetchProjects();
    setPage(1); // Reset page when category changes
  }, [categorySlug]);

  const loadMore = () => {
    const nextPage = page + 1;
    const start = 0;
    const end = nextPage * PROJECTS_PER_PAGE;
    setDisplayedProjects(projects.slice(start, end));
    setPage(nextPage);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white text-xl animate-pulse font-space-grotesk">Loading projects...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500 text-xl font-space-grotesk">{error}</div>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-white text-xl font-space-grotesk text-center">
          No projects found {categorySlug ? 'in this category' : ''}.
        </div>
      </div>
    );
  }

  const breakpointColumns = {
    default: 3,
    1100: 2,
    700: 1
  };

  const hasMoreProjects = displayedProjects.length < projects.length;

  return (
    <div className="container mx-auto px-4 py-16">
      <Masonry
        breakpointCols={breakpointColumns}
        className="flex -ml-4 w-auto"
        columnClassName="pl-4 bg-clip-padding"
      >
        {displayedProjects.map((project) => (
          <div
            key={project.slug}
            className="mb-4 group relative overflow-hidden bg-black border border-white/10 hover:border-white/30 transition-all duration-300 cursor-pointer"
            onClick={() => navigate(`/project/${project.slug}`)}
          >
            <div className="relative overflow-hidden">
              {project.featuredImage?.node?.sourceUrl ? (
                <img
                  src={project.featuredImage.node.sourceUrl}
                  alt={project.featuredImage.node.altText || project.title}
                  className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-64 bg-gray-800 flex items-center justify-center">
                  <span className="text-white/50 font-space-grotesk">No image available</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="mb-2">
                    <span className="inline-block px-3 py-1 text-sm border border-white/30 text-white/70 font-space-grotesk">
                      {project.categoriesProjet?.nodes?.[0]?.name || 'Non catégorisé'}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 font-syncopate">{project.title}</h3>
                  <div className="flex items-center gap-4 text-white/70 font-space-grotesk">
                    {project.infosProjet?.platform && <span>{project.infosProjet.platform}</span>}
                    {project.infosProjet?.annee && <span>{project.infosProjet.annee}</span>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Masonry>
      
      {hasMoreProjects && (
        <div className="flex justify-center mt-12">
          <button
            onClick={loadMore}
            className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-space-grotesk rounded-lg transition-colors duration-300 flex items-center space-x-2"
          >
            <span>Load More Projects</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ProjectsGrid;