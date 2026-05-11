import { create } from 'zustand';
import { Country, Station } from '../types';

interface AppState {
  selectedCountry: Country | null;
  activeStation: Station | null;
  isPlaying: boolean;
  stations: Station[];
  isLoading: boolean;
  searchQuery: string;
  streamType: 'radio' | 'tv';
  
  setSelectedCountry: (country: Country | null) => void;
  setActiveStation: (station: Station | null) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setStations: (stations: Station[]) => void;
  setIsLoading: (isLoading: boolean) => void;
  setSearchQuery: (query: string) => void;
  setStreamType: (type: 'radio' | 'tv') => void;
  fetchStationsByCountry: (countryCode: string, type?: 'radio' | 'tv') => Promise<void>;
}

export const useStore = create<AppState>((set, get) => ({
  selectedCountry: null,
  activeStation: null,
  isPlaying: false,
  stations: [],
  isLoading: false,
  searchQuery: '',
  streamType: 'radio',
  
  setSelectedCountry: (country) => {
    set({ selectedCountry: country, searchQuery: '' });
    if (country) {
      get().fetchStationsByCountry(country.isoCode, get().streamType);
    } else {
      set({ stations: [] });
    }
  },
  setActiveStation: (station) => set({ activeStation: station, isPlaying: !!station }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setStations: (stations) => set({ stations }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setStreamType: (type) => {
    set({ streamType: type });
    const country = get().selectedCountry;
    if (country) {
      get().fetchStationsByCountry(country.isoCode, type);
    }
  },

  fetchStationsByCountry: async (countryCode: string, type: 'radio' | 'tv' = 'radio') => {
    set({ isLoading: true, stations: [] });
    try {
      if (type === 'radio') {
        const { radioService } = await import('../services/radioService');
        const apiStations = await radioService.getStationsByCountryCode(countryCode);
        
        const mappedStations = apiStations.map(s => ({
          id: s.stationuuid,
          name: s.name,
          type: 'radio' as const,
          streamUrl: s.url_resolved,
          logo: s.favicon || `https://ui-avatars.com/api/?name=${encodeURIComponent(s.name)}&background=0D8ABC&color=fff`,
          genre: s.tags.split(',')[0] || 'General',
          countryId: s.countrycode,
          active: true,
          bitrate: `${s.bitrate}kbps`
        }));
        set({ stations: mappedStations });
      } else {
        const { tvService } = await import('../services/tvService');
        const channels = await tvService.getChannelsByCountryCode(countryCode);
        set({ stations: channels });
      }
    } catch (error) {
      console.error('Failed to fetch stations:', error);
    } finally {
      set({ isLoading: false });
    }
  }
}));
