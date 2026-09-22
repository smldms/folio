export interface Project {
  artworkPresentation?: ArtworkPresentation | null;
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

export interface ArtworkPresentation {
  displayMode?: string | null;
  artworkUrl?: string | null;
  introduction?: string | null;
  desktopRatio?: string | null;
  mobileRatio?: string | null;
  network?: string | null;
  platformUrl?: string | null;
  platformLabel?: string | null;
  artworkId?: string | null;
}
