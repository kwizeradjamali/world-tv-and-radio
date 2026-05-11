import React from 'react';
import { MainGlobe } from './components/MainGlobe';
import { Sidebar } from './components/Sidebar';
import { Player } from './components/Player';
import { useStore } from './store/useStore';
import { AnimatePresence, motion } from 'motion/react';
import { Tv, Radio, X, Search, Star } from 'lucide-react';
import { Station } from './types';

export default function App() {
  const { selectedCountry, setSelectedCountry, setActiveStation, searchQuery, setSearchQuery, stations, isLoading, streamType } = useStore();

  const filteredStations = stations.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.genre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen overflow-hidden bg-black selection:bg-neon-cyan/30">
      <Sidebar />
      
      <main className="flex-1 relative flex flex-col">
        {/* Top Header */}
        <header className="absolute top-0 left-0 right-0 p-4 md:p-8 flex justify-between items-start z-30 pointer-events-none">
          <div className="pointer-events-auto pl-10 md:pl-0">
            <p className="text-neon-cyan font-mono text-[8px] md:text-[10px] tracking-[0.3em] uppercase">Status: Online</p>
            <h2 className="text-xl md:text-3xl font-display font-bold mt-1 text-white truncate max-w-[150px] md:max-w-none">
              {selectedCountry ? selectedCountry.name.toUpperCase() : 'DISCOVER THE WORLD'}
            </h2>
          </div>
          
          <div className="flex gap-2 md:gap-4 pointer-events-auto">
            <button className="hidden sm:block btn-neon bg-black/40 backdrop-blur-md text-xs">Connect Wallet</button>
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden border border-white/20 glass">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" className="w-full h-full" />
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="flex-1 relative">
          <MainGlobe />
          
          <AnimatePresence mode="wait">
            {!selectedCountry ? (
              <motion.div 
                key="hero"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
              >
                <div className="text-center max-w-2xl px-8 pointer-events-auto">
                    <motion.div 
                      animate={{ scale: [1, 1.05, 1], rotate: [0, 1, 0, -1, 0] }}
                      transition={{ duration: 10, repeat: Infinity }}
                      className="w-32 h-32 mx-auto mb-8 rounded-full border-2 border-neon-cyan/30 flex items-center justify-center relative bg-black/40 backdrop-blur-md"
                    >
                      <Radio size={56} className="text-neon-cyan" />
                      <div className="absolute inset-0 bg-neon-cyan/20 blur-2xl rounded-full scale-150 animate-pulse" />
                    </motion.div>
                    <h1 className="text-3xl md:text-7xl font-display font-bold tracking-tighter mb-4 text-white drop-shadow-[0_0_30px_rgba(0,243,255,0.3)]">
                      THE WORLD <br /> <span className="text-neon-cyan">IN SURROUND</span>
                    </h1>
                    <p className="text-white/60 text-sm md:text-xl font-light mb-8 max-w-lg mx-auto">
                      Explore live radio and TV streams from every corner of the planet.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                      <button className="w-full sm:w-auto px-8 py-4 bg-white text-black rounded-full font-bold hover:bg-neon-cyan transition-all transform active:scale-95 shadow-xl">
                        START EXPLORING
                      </button>
                      <button className="w-full sm:w-auto px-8 py-4 glass rounded-full font-bold hover:bg-white/10 transition-all transform active:scale-95 text-white">
                        LEARN MORE
                      </button>
                    </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="country-panel"
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="absolute top-0 right-0 bottom-0 w-full sm:max-w-sm glass border-l border-white/10 z-40 flex flex-col"
              >
                <div className="p-6 md:p-8 pb-4">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl md:text-4xl">{selectedCountry.flag}</span>
                      <div>
                        <h3 className="text-xl md:text-2xl font-bold">{selectedCountry.name}</h3>
                        <p className="text-xs text-neon-cyan font-mono">{selectedCountry.isoCode}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setSelectedCountry(null)}
                      className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                      <X size={24} />
                    </button>
                  </div>

                  <div className="flex gap-2 mb-8">
                    <button 
                      onClick={() => useStore.getState().setStreamType('radio')}
                      className={`flex-1 py-3 glass rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${useStore.getState().streamType === 'radio' ? 'border-neon-cyan/50 text-neon-cyan bg-neon-cyan/5' : 'hover:border-white/20'}`}
                    >
                      <Radio size={14} /> RADIO
                    </button>
                    <button 
                      onClick={() => useStore.getState().setStreamType('tv')}
                      className={`flex-1 py-3 glass rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${useStore.getState().streamType === 'tv' ? 'border-neon-cyan/50 text-neon-cyan bg-neon-cyan/5' : 'hover:border-white/20'}`}
                    >
                      <Tv size={14} /> TV
                    </button>
                  </div>

                  <div className="relative mb-6">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={16} />
                    <input 
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={`Search ${selectedCountry.name} ${streamType}s...`}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-xs focus:outline-none focus:border-neon-cyan/50 transition-colors"
                    />
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-8 pt-0 custom-scrollbar">
                  <p className="text-[10px] font-mono text-white/40 mb-4 tracking-[0.2em] uppercase">Available Streams</p>
                  <div className="space-y-4">
                    {isLoading ? (
                      [1, 2, 3, 4].map(i => (
                        <div key={i} className="w-full h-20 glass rounded-2xl animate-pulse" />
                      ))
                    ) : filteredStations.length > 0 ? (
                      filteredStations.map((station) => (
                        <motion.button 
                          key={station.id}
                          whileHover={{ x: 4 }}
                          onClick={() => setActiveStation(station)}
                          className="w-full flex items-center gap-4 p-4 glass rounded-2xl hover:bg-white/10 group transition-all"
                        >
                          <img 
                            src={station.logo} 
                            alt={station.name} 
                            className="w-12 h-12 rounded-xl object-cover bg-white/5" 
                            onError={(e) => (e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(station.name)}&background=random`)}
                          />
                          <div className="flex-1 text-left">
                            <h4 className="font-bold text-sm tracking-tight truncate max-w-[180px]">{station.name}</h4>
                            <p className="text-[10px] text-white/40 truncate">{station.genre} • {station.bitrate || '128kbps'}</p>
                          </div>
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <Star size={16} className="text-neon-cyan" />
                          </div>
                        </motion.button>
                      ))
                    ) : (
                      <div className="p-8 text-center glass rounded-2xl">
                        <p className="text-sm text-white/40">No stations found for this region yet.</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <Player />
    </div>
  );
}
