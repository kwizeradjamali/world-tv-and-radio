
export interface RadioStation {
  changeuuid: string;
  stationuuid: string;
  name: string;
  url: string;
  url_resolved: string;
  homepage: string;
  favicon: string;
  tags: string;
  country: string;
  countrycode: string;
  iso_3166_1?: string;
  state: string;
  language: string;
  votes: number;
  lastchangetime: string;
  codec: string;
  bitrate: number;
  hls: number;
  lastcheckok: number;
  clickcount: number;
}

const API_BASE = 'https://de1.api.radio-browser.info/json';

export const radioService = {
  getStationsByCountryCode: async (countryCode: string): Promise<RadioStation[]> => {
    try {
      // Filter by lastcheckok=1 to ensure streams are recently verified working
      const response = await fetch(`${API_BASE}/stations/bycountrycodeexact/${countryCode}?limit=50&order=clickcount&reverse=true&lastcheckok=1`);
      if (!response.ok) throw new Error('Failed to fetch stations');
      return await response.json();
    } catch (error) {
      console.error('Radio API Error:', error);
      return [];
    }
  },

  searchStations: async (query: string): Promise<RadioStation[]> => {
    try {
      const response = await fetch(`${API_BASE}/stations/byname/${encodeURIComponent(query)}?limit=30`);
      if (!response.ok) throw new Error('Search failed');
      return await response.json();
    } catch (error) {
      console.error('Radio Search Error:', error);
      return [];
    }
  }
};
