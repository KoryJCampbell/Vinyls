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
  notes?: string;
  tracklist?: Track[];
}

export interface Track {
  position: string;
  title: string;
  duration: string;
}

export interface SearchResult {
  id: number;
  title: string;
  artist: string;
  year?: number;
  coverImage?: string;
}
