export type ConditionRating = 'M' | 'NM' | 'VG+' | 'VG' | 'G+' | 'G' | 'F' | 'P';

export interface PurchaseInfo {
  price: number;
  date: string;
  seller: string;
  marketValue?: number;
  lastUpdated?: string;
}

export interface Condition {
  vinyl: ConditionRating;
  sleeve: ConditionRating;
  notes?: string;
  defectPhotos?: string[];
  lastCleaned?: string;
  cleaningNotes?: string;
}

export interface Track {
  position: string;
  title: string;
  duration: string;
}

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
  condition?: Condition;
  purchaseInfo?: PurchaseInfo;
}

export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

export interface SearchResult {
  id: number;
  title: string;
  artist: string;
  year?: number;
  coverImage?: string;
}
