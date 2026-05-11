import { Station } from '../types';

export const tvService = {
  getChannelsByCountryCode: async (countryCode: string): Promise<Station[]> => {
    try {
      const response = await fetch(`/api/tv/${countryCode.toLowerCase()}`);
      if (!response.ok) throw new Error('Backend failed to fetch TV data');
      return await response.json();
    } catch (error) {
      console.error('TV API Proxy Error:', error);
      return [];
    }
  }
};
