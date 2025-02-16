const DISCOGS_TOKEN = 'dSKqAOxHkRKYmipenjlGHNuIIWSPioYJzyzXMzcm';
const BASE_URL = 'https://api.discogs.com';

export interface Album {
  id: number;
  title: string;
  artist: string;
  year: number;
  coverImage?: string;
  genres?: string[];
  dateAdded: string;
}

export interface DiscogsRelease {
  id: number;
  title: string;
  artist: string;
  year: number;
  images?: Array<{
    uri: string;
    type: string;
  }>;
  genres?: string[];
  styles?: string[];
  tracklist?: Array<{
    position: string;
    title: string;
    duration: string;
  }>;
  notes?: string;
}

export interface SearchResult {
  id: number;
  title: string;
  year: string;
  country: string;
  format: string[];
  label: string[];
  thumb: string;
}

export async function searchRelease(query: string): Promise<DiscogsRelease[]> {
  const response = await fetch(
    `${BASE_URL}/database/search?q=${encodeURIComponent(query)}&type=release&token=${DISCOGS_TOKEN}`
  );
  const data = await response.json();
  return data.results;
}

export async function getReleaseDetails(id: number): Promise<DiscogsRelease> {
  const response = await fetch(
    `${BASE_URL}/releases/${id}`,
    {
      headers: {
        'Authorization': `Discogs token=${DISCOGS_TOKEN}`
      }
    }
  );
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error('Discogs API error:', {
      status: response.status,
      statusText: response.statusText,
      body: errorText
    });
    throw new Error(`Discogs API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  
  // Validate the response data
  if (!data || typeof data !== 'object') {
    console.error('Invalid response data:', data);
    throw new Error('Invalid response data received from Discogs');
  }

  // Log the full response for debugging
  console.log('Discogs release details:', JSON.stringify(data, null, 2));

  return data;
}

export async function searchSpecificRelease(
  artist: string,
  title: string
): Promise<SearchResult[]> {
  const response = await fetch(
    `${BASE_URL}/database/search?artist=${encodeURIComponent(artist)}&release_title=${encodeURIComponent(title)}&type=release&token=${DISCOGS_TOKEN}`,
    {
      headers: {
        'Authorization': `Discogs token=${DISCOGS_TOKEN}`
      }
    }
  );
  const data = await response.json();
  return data.results;
}

export async function searchByBarcode(barcode: string): Promise<SearchResult[]> {
  const response = await fetch(
    `${BASE_URL}/database/search?barcode=${encodeURIComponent(barcode)}&type=release&token=${DISCOGS_TOKEN}`,
    {
      headers: {
        'Authorization': `Discogs token=${DISCOGS_TOKEN}`
      }
    }
  );
  const data = await response.json();
  return data.results;
}

export function transformDiscogsRelease(release: DiscogsRelease): Album {
  return {
    id: release.id,
    title: release.title,
    artist: release.artist,
    year: typeof release.year === 'string' ? parseInt(release.year, 10) : release.year || 0,
    coverImage: release.images?.[0]?.uri,
    genres: release.genres,
    dateAdded: new Date().toISOString(),
  };
}
