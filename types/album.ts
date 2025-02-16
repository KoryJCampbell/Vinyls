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

export interface Album {
  // ...existing properties...
  condition?: Condition;
  purchaseInfo?: PurchaseInfo;
}
