const SPOTIFY_CLIENT_ID = '6ab6df6a38084790b1cba8cf472b981b';
const SPOTIFY_CLIENT_SECRET = '41625d4951ce4dbe8588556e4a50af3c';

type SpotifyToken = {
  access_token: string;
  expires_in: number;
  token_type: string;
};

export type SpotifyAlbum = {
  id: string;
  name: string;
  artists: { name: string }[];
  release_date: string;
  images: { url: string }[];
  genres: string[];
  label: string;
  external_urls: { spotify: string };
};

export class SpotifyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SpotifyError';
  }
}

export async function getSpotifyToken(): Promise<string> {
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64')}`,
    },
    body: 'grant_type=client_credentials',
  });

  const data: SpotifyToken = await response.json();
  return data.access_token;
}

export async function searchAlbum(query: string): Promise<SpotifyAlbum[]> {
  if (!query.trim()) {
    throw new SpotifyError('Search query cannot be empty');
  }

  try {
    const token = await getSpotifyToken();
    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=album`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new SpotifyError(`Spotify API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.albums?.items || [];
  } catch (error) {
    if (error instanceof SpotifyError) throw error;
    throw new SpotifyError('Failed to search albums');
  }
}

export async function getAlbumDetails(albumId: string): Promise<SpotifyAlbum> {
  const token = await getSpotifyToken();
  const response = await fetch(`https://api.spotify.com/v1/albums/${albumId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.json();
}
