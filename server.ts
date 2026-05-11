import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Simple in-memory cache for TV data
  let tvCache: { streams: any[], channels: any[], lastFetched: number } | null = null;
  const CACHE_TTL = 1000 * 60 * 60; // 1 hour

  app.get('/api/tv/:countryCode', async (req, res) => {
    try {
      const { countryCode } = req.params;
      
      if (!tvCache || Date.now() - tvCache.lastFetched > CACHE_TTL) {
        console.log('Fetching fresh TV data from iptv-org...');
        const [streamsRes, channelsRes] = await Promise.all([
          fetch('https://iptv-org.github.io/api/streams.json'),
          fetch('https://iptv-org.github.io/api/channels.json')
        ]);
        
        tvCache = {
          streams: await streamsRes.json(),
          channels: await channelsRes.json(),
          lastFetched: Date.now()
        };
      }

      const isUK = countryCode.toLowerCase() === 'gb' || countryCode.toLowerCase() === 'uk';
      const countryChannels = tvCache.channels.filter((c: any) => {
        const cCode = c.country?.toLowerCase();
        if (!cCode) return false;
        if (isUK) return cCode === 'gb' || cCode === 'uk' || cCode === 'united kingdom';
        return cCode === countryCode.toLowerCase();
      });
      const channelIds = new Set(countryChannels.map((c: any) => c.id));
      
      const results = tvCache.streams
        .filter((s: any) => channelIds.has(s.channel))
        .map((s: any) => {
          const channel = countryChannels.find((c: any) => c.id === s.channel);
          return {
            id: s.url,
            name: channel?.name || 'Unknown TV',
            type: 'tv',
            streamUrl: s.url,
            logo: channel?.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(channel?.name || 'TV')}&background=purple&color=fff`,
            genre: channel?.categories?.[0] || 'General',
            countryId: countryCode,
            active: true,
            quality: s.height ? `${s.height}p` : 'HD'
          };
        });

      // Special handling for UK/England to ensure reliable results
      if (isUK && results.length < 5) {
        const fallbackUK = [
          {
            id: 'gb-bbc-one',
            name: 'BBC News (UK)',
            type: 'tv',
            streamUrl: 'https://vs-hls-push-uk-live.akamaized.net/x=4/i=urn:bbc:pips:service:bbc_news_channel_hd/t=3840/v=pv14/b=5070016/main.m3u8',
            logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/BBC_Logo_2021.svg/1200px-BBC_Logo_2021.svg.png',
            genre: 'News',
            countryId: 'GB',
            active: true,
            quality: 'HD'
          },
          {
            id: 'gb-sky-news',
            name: 'Sky News (UK)',
            type: 'tv',
            streamUrl: 'https://skynews-skynewsmain-ssai-ue.global.sky.com/001/master.m3u8',
            logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Sky_News_logo_2017.svg/1200px-Sky_News_logo_2017.svg.png',
            genre: 'News',
            countryId: 'GB',
            active: true,
            quality: 'HD'
          }
        ];
        results.push(...fallbackUK);
      }

      res.json(results);
    } catch (err) {
      console.error('Proxy TV error:', err);
      res.status(500).json({ error: 'Failed to fetch TV data' });
    }
  });
  
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
