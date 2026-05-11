export interface Country {
  name: string;
  isoCode: string;
  flag: string;
  lat: number;
  lng: number;
}

export interface Station {
  id: string;
  name: string;
  type: 'radio' | 'tv';
  streamUrl: string;
  logo: string;
  genre: string;
  countryId: string;
  active: boolean;
  bitrate?: string;
  quality?: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  favorites: string[];
}
