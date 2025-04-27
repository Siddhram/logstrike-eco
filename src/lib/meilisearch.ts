import { instantMeiliSearch } from '@meilisearch/instant-meilisearch';

// Define the MeiliSearch host and API key
const MEILISEARCH_HOST = 'https://ms-dee76a5e346f-22280.sgp.meilisearch.io'
const MEILISEARCH_SEARCH_KEY = 'd378a3197171c336dd3d1e88aad1f2308b8a8d29c69d55b568b4a0a40a2a4fa4'

// Create and export the search client
export const searchClient = instantMeiliSearch(
  MEILISEARCH_HOST,
  MEILISEARCH_SEARCH_KEY,
  {
    primaryKey: 'id',
  }
).searchClient; // Make sure to access the searchClient property