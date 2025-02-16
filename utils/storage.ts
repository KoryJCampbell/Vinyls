import AsyncStorage from '@react-native-async-storage/async-storage';
import { Album } from '../types';

const ALBUMS_KEY = 'albums';

export async function getAlbums(): Promise<Album[]> {
  try {
    const data = await AsyncStorage.getItem(ALBUMS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to get albums:', error);
    return [];
  }
}

export async function getAlbumById(id: number): Promise<Album | null> {
  try {
    const albums = await getAlbums();
    return albums.find(album => album.id === id) || null;
  } catch (error) {
    console.error('Failed to get album by id:', error);
    return null;
  }
}

export async function saveAlbum(album: Album): Promise<boolean> {
  try {
    const albums = await getAlbums();
    const existingIndex = albums.findIndex(a => a.id === album.id);
    
    if (existingIndex >= 0) {
      albums[existingIndex] = album;
    } else {
      albums.push(album);
    }
    
    await AsyncStorage.setItem(ALBUMS_KEY, JSON.stringify(albums));
    return true;
  } catch (error) {
    console.error('Failed to save album:', error);
    return false;
  }
}
