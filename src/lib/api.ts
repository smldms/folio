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
    const data = await request(endpoint, query);
    return data.projets.nodes;
  } catch (error) {
    console.error('Error fetching projects from GraphQL API', error);
    throw new Error('Failed to fetch projects from GraphQL API');
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
    const data = await request(endpoint, query, { slug });
    return data.projet;
  } catch (error) {
    console.error('Error fetching project by slug from GraphQL API', error);
    throw new Error('Failed to fetch project by slug from GraphQL API');
  }
};