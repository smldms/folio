export interface Project {
  title: string;
  slug: string;
  content: string;
  featuredImage: {
    node: {
      sourceUrl: string;
      altText: string;
    };
  };
  infosProjet: {
    platform: string;
    annee: string;
    technologies: string[];
    lienProjet: string;
    autrelien: string;
    couleurPrincipale: string;
  };
  categoriesProjet: {
    nodes: Array<{
      name: string;
      slug: string;
    }>;
  };
}