import type { Project, ArtworkPresentation, RewiredEpisode, AboutContent, PhotographySelectionItem, PhotographySeries, HomepageSettings } from '../types/project';
import { request, gql } from 'graphql-request';

const endpoint = 'https://smldms.xyz/graphql';

export const getAllCategories = async () => {
  const query = gql`
    query GetAllCategories {
      categoriesProjet {
        nodes {
          name
          slug
        }
      }
    }
  `;

  try {
    const data = await request(endpoint, query);
    return data.categoriesProjet.nodes;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

export const getProjectsByCategory = async (slug: string) => {
  const query = gql`
    query GetProjectsByCategory($slug: [String]!) {
      projets(
        where: {
          taxQuery: {
            taxArray: [
              {
                taxonomy: CATEGORIEPROJET
                field: SLUG
                terms: $slug
              }
            ]
          }
        }
        first: 100
      ) {
        nodes {
          title
          slug
          content
          featuredImage {
            node {
              sourceUrl
              altText
            }
          }
          infosProjet {
            platform
            annee
            technologies
            lienProjet
            autrelien
            couleurPrincipale
          }
          categoriesProjet {
            nodes {
              name
              slug
            }
          }
        }
      }
    }
  `;

  try {
    const data = await request(endpoint, query, { slug: [slug] });
    return data.projets.nodes;
  } catch (error) {
    console.error('Error fetching projects by category:', error);
    throw error;
  }
};

export const getAllProjects = async () => {
  const query = gql`
    query GetAllProjects {
      projets(first: 100) {
        nodes {
          title
          slug
          content
          featuredImage {
            node {
              sourceUrl
              altText
            }
          }
          infosProjet {
            platform
            annee
            technologies
            lienProjet
            autrelien
            couleurPrincipale
          }
          categoriesProjet {
            nodes {
              name
              slug
            }
          }
        }
      }
    }
  `;

  try {
    const data = await request<{ projets: { nodes: Project[] } }>(endpoint, query);
    try {
      const presentations = await request<{
        projets: { nodes: Array<{ slug: string; smldmsPresentation: ArtworkPresentation | null }> };
      }>(endpoint, gql`
        query GetArtworkPresentations {
          projets(first: 100) {
            nodes {
              slug
              smldmsPresentation { displayMode artworkUrl desktopRatio mobileRatio }
            }
          }
        }
      `);
      const bySlug = new Map(
        presentations.projets.nodes.map(project => [project.slug, project.smldmsPresentation])
      );
      return data.projets.nodes.map(project => ({
        ...project,
        artworkPresentation: bySlug.get(project.slug) || null
      }));
    } catch (error) {
      console.warn('Interactive previews unavailable; using project covers.', error);
      return data.projets.nodes;
    }
  } catch (error) {
    console.error('Error fetching projects from GraphQL API', error);
    throw new Error('Failed to fetch projects from GraphQL API');
  }
};

export const getRewiredEpisodes = async (): Promise<RewiredEpisode[]> => {
  const query = gql`
    query GetRewiredEpisodes {
      rewiredEpisodes(first: 50, where: { orderby: { field: DATE, order: DESC } }) {
        nodes {
          title
          date
          rewiredDetails {
            episodeNumber
            youtubeUrl
            shortDescription
            sourceFilm
            sourceYear
            archiveUrl
            rightsStatus
            pinMain
          }
        }
      }
    }
  `;

  try {
    const data = await request<{ rewiredEpisodes: { nodes: RewiredEpisode[] } }>(endpoint, query);
    return data.rewiredEpisodes.nodes;
  } catch (error) {
    console.warn('Rewired Archive API unavailable; using the local archive.', error);
    return [];
  }
};

export const getAboutPage = async (): Promise<AboutContent | null> => {
  const query = gql`
    query GetAboutPage($uri: ID!) {
      page(id: $uri, idType: URI) {
        title
        content
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
      }
    }
  `;

  try {
    const data = await request<{ page: AboutContent | null }>(endpoint, query, { uri: '/about/' });
    return data.page;
  } catch (error) {
    console.warn('About page unavailable; using the local introduction.', error);
    return null;
  }
};

export const getPhotographySelection = async (): Promise<PhotographySelectionItem[] | null> => {
  const query = gql`
    query GetPhotographySelection {
      smldmsPhotographySelection {
        id
        title
        caption
        sourceUrl
        displayUrl
        altText
        width
        height
      }
    }
  `;

  try {
    const data = await request<{ smldmsPhotographySelection: PhotographySelectionItem[] | null }>(endpoint, query);
    return Array.isArray(data.smldmsPhotographySelection) ? data.smldmsPhotographySelection : null;
  } catch (error) {
    console.warn('Managed photography selection unavailable; using local photographs.', error);
    return null;
  }
};

export const getPhotographySeries = async (): Promise<PhotographySeries[] | null> => {
  const query = gql`
    query GetPhotographySeries {
      smldmsPhotographySeries {
        id
        title
        introduction
        period
        blocks {
          id
          layout
          size
          align
          caption
          images {
            id
            title
            caption
            sourceUrl
            displayUrl
            altText
            width
            height
          }
        }
      }
    }
  `;

  try {
    const data = await request<{ smldmsPhotographySeries: PhotographySeries[] | null }>(endpoint, query);
    return Array.isArray(data.smldmsPhotographySeries) ? data.smldmsPhotographySeries : null;
  } catch (error) {
    console.info('Photography story builder is not available yet; using the ordered selection.', error);
    return null;
  }
};

export const getHomepageSettings = async (): Promise<HomepageSettings | null> => {
  const query = gql`
    query GetHomepageSettings {
      smldmsHomepageSettings {
        photograph {
          id
          title
          sourceUrl
          displayUrl
          altText
          width
          height
        }
        runtimeProject {
          title
          slug
          description
          artworkUrl
          network
        }
        exploreProjects {
          title
          slug
          description
        }
      }
    }
  `;

  try {
    const data = await request<{ smldmsHomepageSettings: HomepageSettings | null }>(endpoint, query);
    return data.smldmsHomepageSettings || null;
  } catch (error) {
    console.info('Homepage manager unavailable; keeping the current homepage defaults.', error);
    return null;
  }
};

export const getProjectBySlug = async (slug: string) => {
  const query = gql`
    query GetProjectBySlug($slug: ID!) {
      projet(id: $slug, idType: SLUG) {
        title
        slug
        content
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        infosProjet {
          platform
          annee
          technologies
          lienProjet
          autrelien
          couleurPrincipale
        }
        categoriesProjet {
          nodes {
            name
            slug
          }
        }
      }
    }
  `;

  try {
    const data = await request<{ projet: Project | null }>(endpoint, query, { slug });
    if (!data.projet) return data.projet;
    // Separate optional query: older WordPress schemas keep serving existing projects.
    try {
      const extra = await request<{ projet: { smldmsPresentation: ArtworkPresentation | null } | null }>(endpoint, gql`
        query ArtworkPresentation($slug: ID!) {
          projet(id: $slug, idType: SLUG) {
            smldmsPresentation { displayMode artworkUrl introduction desktopRatio mobileRatio network platformUrl platformLabel artworkId }
          }
        }
      `, { slug });
      return { ...data.projet, artworkPresentation: extra.projet?.smldmsPresentation || null };
    } catch (error) {
      console.warn('Artwork presentation unavailable; retaining the existing project layout.', error);
      return data.projet;
    }
  } catch (error) {
    console.error('Error fetching project by slug from GraphQL API', error);
    throw new Error('Failed to fetch project by slug from GraphQL API');
  }
};
