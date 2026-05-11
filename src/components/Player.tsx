import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Maximize2, Tv, Radio as RadioIcon, X } from 'lucide-react';
import { useStore } from '../store/useStore';
import Hls from 'hls.js';
import { motion, AnimatePresence } from 'motion/react';

export const Player: React.FC = () => {
  const { activeStation, setActiveStation, isPlaying, setIsPlaying } = useStore();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    if (activeStation && videoRef.current) {
      if (Hls.isSupported() && activeStation.streamUrl.includes('.m3u8')) {
        const hls = new Hls();
        hls.loadSource(activeStation.streamUrl);
        hls.attachMedia(videoRef.current);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          if (isPlaying) videoRef.current?.play();
        });
        return () => hls.destroy();
      } else {
        videoRef.current.src = activeStation.streamUrl;
      }
    }
  }, [activeStation]);

  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.play().catch(() => setIsPlaying(false));
      else videoRef.current.pause();
    }
  }, [isPlaying]);

  if (!activeStation) return null;

  return (
    <motion.div 
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      exit={{ y: 100 }}
      className="fixed bottom-0 left-0 right-0 z-50 p-4"
    >
      <AnimatePresence>
        {activeStation.type === 'tv' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[-1] flex items-center justify-center bg-black/90 backdrop-blur-md pointer-events-none p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="pointer-events-auto relative shadow-[0_0_100px_rgba(157,0,255,0.2)] w-full max-w-[755px]"
            >
              <div 
                className="bg-black border border-white/20 rounded-2xl md:rounded-3xl overflow-hidden relative aspect-video"
              >
                <video 
                  ref={videoRef} 
                  className="w-full h-full object-contain"
                  autoPlay
                  playsInline
                />
                
                {/* Overlay Controls */}
                <div className="absolute top-4 right-4 flex gap-2 z-20">
                   <button 
                    onClick={() => setActiveStation(null)}
                    className="p-3 bg-black/60 hover:bg-red-500/80 rounded-full transition-colors"
                   >
                    <X size={24} />
                   </button>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-black to-transparent">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-[10px] md:text-xs font-mono tracking-widest text-red-500 uppercase">Live Broadcast</span>
                  </div>
                  <h2 className="text-lg md:text-2xl font-bold mt-1 text-white truncate">{activeStation.name}</h2>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto glass rounded-2xl md:rounded-3xl p-3 md:p-4 flex flex-col md:flex-row items-center gap-4 md:gap-6 shadow-[0_-20px_50px_rgba(0,102,255,0.2)] border-t border-neon-blue/20">
        
        {/* Profile/Info */}
        <div className="flex items-center gap-3 md:gap-4 w-full md:w-1/3">
          <div className="relative group shrink-0">
            <div className="absolute inset-0 bg-neon-cyan/20 blur-xl rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity" />
            <img 
              src={activeStation.logo || 'https://via.placeholder.com/60'} 
              alt={activeStation.name} 
              className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl object-cover ring-2 ring-white/10 group-hover:ring-neon-cyan/50 transition-all relative z-10"
              onError={(e) => (e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(activeStation.name)}&background=random`)}
            />
            <div className="absolute -top-1 -right-1 w-5 h-5 md:w-6 md:h-6 rounded-full bg-neon-cyan flex items-center justify-center z-20 shadow-lg">
              {activeStation.type === 'tv' ? <Tv size={10} className="text-black" /> : <RadioIcon size={10} className="text-black" />}
            </div>
          </div>
          <div className="overflow-hidden flex-1">
            <h3 className="font-bold text-white leading-tight truncate text-sm md:text-base">{activeStation.name}</h3>
            <p className="text-[10px] md:text-xs text-white/50 truncate">{activeStation.genre} • {activeStation.type.toUpperCase()}</p>
          </div>
          <div className="md:hidden flex items-center gap-2">
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center shadow-lg"
            >
              {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-0.5" />}
            </button>
            <button 
              onClick={() => setActiveStation(null)}
              className="p-2 text-white/40"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Controls - Desktop Only or centered mobile? Let's hide full controls on very small screens or make them compact */}
        <div className="hidden md:flex flex-col items-center gap-3 flex-1 w-full">
          <div className="flex items-center gap-6">
            <button className="text-white/40 hover:text-white transition-colors transition-transform active:scale-90"><SkipBack size={20} /></button>
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center hover:bg-neon-cyan transition-all transform active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_25px_rgba(0,243,255,0.5)]"
            >
              {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
            </button>
            <button className="text-white/40 hover:text-white transition-colors transition-transform active:scale-90"><SkipForward size={20} /></button>
          </div>
          
          <div className="w-full max-w-sm h-1 bg-white/10 rounded-full relative overflow-hidden">
            {isPlaying && (
              <motion.div 
                 initial={{ x: '-100%' }}
                 animate={{ x: '100%' }}
                 transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                 className="absolute inset-0 bg-gradient-to-r from-transparent via-neon-cyan to-transparent opacity-50"
              />
            )}
            <div className="absolute inset-0 bg-neon-cyan/20" />
          </div>
        </div>

        {/* Volume / Extra */}
        <div className="hidden md:flex items-center justify-end gap-6 w-1/3">
          <div className="flex items-center gap-2">
            <button onClick={() => setIsMuted(!isMuted)} className="text-white/60 hover:text-white">
              {isMuted ? <X size={18} /> : <Volume2 size={18} />}
            </button>
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.1" 
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-24 h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-neon-cyan"
            />
          </div>
          <button className="text-white/60 hover:text-white"><Maximize2 size={18} /></button>
          <button 
            onClick={() => setActiveStation(null)}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-red-500/20 text-white/40 hover:text-red-500 flex items-center justify-center transition-all"
          >
            <X size={16} />
          </button>
        </div>

        {/* Mobile Video element (hidden, just for audio if radio) */}
        {activeStation.type === 'radio' && <video ref={videoRef} className="hidden" />}
        {/* For mobile TV, we show video on a separate modal or just the player? 
            Let's keep it in player for now */}
      </div>
    </motion.div>
  );
};
