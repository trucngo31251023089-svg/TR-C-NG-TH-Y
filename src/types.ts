export type ScreenId = 
  | 'home' 
  | 'design-studio' 
  | 'webar-scanner' 
  | 'collaborative-portal' 
  | 'cloud-sync-remote'
  | 'admin-and-print' 
  | 'checkout';

export interface CalendarMonth {
  monthNumber: number;
  title: string;
  theme: string;
  image: string;
  arAccuracy: number;
  arVideoTitle: string;
  arVideoDuration: string;
  audioActive: boolean;
  letterAuthor?: string;
  letterSnippet?: string;
  quote?: string;
  filterStyle?: 'none' | 'sepia' | 'noir' | 'sunset' | 'botanical';
  customUploaded?: boolean;
}

export interface DesignTemplate {
  id: string;
  name: string;
  tagline: string;
  category: 'family' | 'romance' | 'minimal' | 'botanical' | 'executive' | 'cyber';
  coverImage: string;
  woodBase: 'walnut' | 'oak' | 'ebony';
  layoutStyle: 'museum-border' | 'minimal-fullbleed' | 'polar-split' | 'gallery-square';
  colorFilter: 'none' | 'sepia' | 'noir' | 'sunset' | 'botanical';
  fontFamily: 'serif' | 'sans' | 'mono';
  description: string;
  idealFor: string;
  accentColor: string;
  previewTags: string[];
  monthsData: Partial<CalendarMonth>[];
}

export interface OrderTicket {
  id: string;
  customerName: string;
  membershipLevel: string;
  editionName: string;
  woodBase: string;
  finishDetail: string;
  dimensions: string;
  paperStock: string;
  bleed: string;
  coating: string;
  cmykDeltaE: string;
  price: number;
  timestamp: string;
  status: string;
}

export interface MemoryPost {
  id: string;
  author: string;
  role: string;
  month: number;
  monthTitle: string;
  avatar: string;
  quote: string;
  mediaType: 'audio' | 'video' | 'text';
  mediaMeta: string;
  timestamp: string;
  e2eeVerified: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar: string;
  membershipLevel: string;
  tierColor?: string;
  joinedDate: string;
  ordersCount: number;
  vaultKeyVerified: boolean;
}
