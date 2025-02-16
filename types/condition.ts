export type ConditionRating = 'M' | 'NM' | 'VG+' | 'VG' | 'G+' | 'G' | 'F' | 'P';

export interface Condition {
  vinyl: ConditionRating;
  sleeve: ConditionRating;
  notes?: string;
  defectPhotos?: string[]; // URLs to photos
  lastCleaned?: string; // ISO date string
  cleaningNotes?: string;
}

// Update Album interface
export interface Album {
  // ...existing properties...
  condition?: Condition;
  purchaseInfo?: {
    price: number;
    date: string;
    seller: string;
    marketValue?: number;
  };
}
