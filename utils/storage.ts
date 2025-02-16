import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Album {
  id: number;
  title: string;
  artist: string;
  year: number;
  coverImage?: string;
  genres?: string[];
  dateAdded: string;
  label?: string;
  spotifyUrl?: string;
  releaseDate?: string;
}

const ALBUMS_KEY = 'albums';

// Add new method to get a single album by ID
export async function getAlbumById(id: number): Promise<Album | null> {
  const albums = await getAlbums();
  return albums.find(album => album.id === id) || null;
}

// Replace existing saveAlbum with one that handles updates
export async function saveAlbum(album: Album): Promise<void> {
  const existingData = await AsyncStorage.getItem(ALBUMS_KEY);
  const albums = existingData ? JSON.parse(existingData) : [];
  
  const existingIndex = albums.findIndex((a: Album) => a.id === album.id);
  if (existingIndex >= 0) {
    albums[existingIndex] = album;
  } else {
    albums.push(album);
  }
  
  await AsyncStorage.setItem(ALBUMS_KEY, JSON.stringify(albums));
}

export async function getAlbums(): Promise<Album[]> {
  const data = await AsyncStorage.getItem(ALBUMS_KEY);
  return data ? JSON.parse(data) : [];
}
