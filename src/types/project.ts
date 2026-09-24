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

export interface RewiredEpisodeDetails {
  episodeNumber?: string | null;
  youtubeUrl?: string | null;
  shortDescription?: string | null;
  sourceFilm?: string | null;
  sourceYear?: string | null;
  archiveUrl?: string | null;
  rightsStatus?: string | null;
  pinMain?: boolean | null;
}

export interface RewiredEpisode {
  title: string;
  date?: string | null;
  rewiredDetails?: RewiredEpisodeDetails | null;
}

export interface AboutContent {
  title: string;
  content?: string | null;
  featuredImage?: {
    node?: {
      sourceUrl?: string | null;
      altText?: string | null;
    } | null;
  } | null;
}

export interface PhotographySelectionItem {
  id: string;
  title?: string | null;
  caption?: string | null;
  sourceUrl: string;
  displayUrl?: string | null;
  altText?: string | null;
  width?: number | null;
  height?: number | null;
}

export interface HomepageProject {
  title: string;
  slug: string;
  description?: string | null;
  artworkUrl?: string | null;
  network?: string | null;
}

export interface HomepageSettings {
  photograph?: PhotographySelectionItem | null;
  runtimeProject?: HomepageProject | null;
  exploreProjects?: HomepageProject[] | null;
}

export type PhotographyBlockLayout = 'solo' | 'diptych' | 'triptych' | 'quadriptych';
export type PhotographyBlockSize = 'full' | 'large' | 'medium' | 'small';
export type PhotographyBlockAlign = 'left' | 'center' | 'right';

export interface PhotographyBlock {
  id: string;
  layout: PhotographyBlockLayout;
  size?: PhotographyBlockSize | null;
  align?: PhotographyBlockAlign | null;
  caption?: string | null;
  images: PhotographySelectionItem[];
}

export interface PhotographySeries {
  id: string;
  title?: string | null;
  introduction?: string | null;
  period?: string | null;
  blocks: PhotographyBlock[];
}
