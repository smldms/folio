import React from 'react';
import { useParams } from 'react-router-dom';
import ProjectsGrid from '../components/ProjectsGrid';

const CategoryPage = () => {
  const { slug } = useParams<{ slug: string }>();

  return (
    <div className="relative z-10 min-h-screen pt-16">
      <ProjectsGrid categorySlug={slug} />
    </div>
  );
};

export default CategoryPage;