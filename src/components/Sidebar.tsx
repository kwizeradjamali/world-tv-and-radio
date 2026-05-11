import React, { useEffect } from 'react';
import { Search, Radio, Tv, Heart, History, Globe as GlobeIcon, Menu, X } from 'lucide-react';
import { useStore } from '../store/useStore';
import { motion, AnimatePresence } from 'motion/react';

import { INITIAL_COUNTRIES } from '../constants';

export const Sidebar: React.FC = () => {
  const { searchQuery, setSearchQuery, selectedCountry, setSelectedCountry } = useStore();
  const [isOpen, setIsOpen] = React.useState(window.innerWidth > 1024);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1024) setIsOpen(false);
      else setIsOpen(true);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const filteredCountries = INITIAL_COUNTRIES.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 glass rounded-lg"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <motion.aside 
        initial={false}
        animate={{ 
          x: isOpen ? 0 : -320,
          opacity: isOpen ? 1 : 0 
        }}
        transition={{ type: 'spring', damping: 20, stiffness: 150 }}
        className="fixed lg:relative h-screen glass border-r border-white/10 flex flex-col overflow-hidden z-40 w-80"
      >
        <div className="p-6 flex flex-col h-full min-w-[320px]">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center">
              <GlobeIcon className="text-white" size={24} />
            </div>
            <h1 className="font-display font-bold text-xl tracking-tight">GLOBAL HUB</h1>
          </div>

          <div className="relative mb-8">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search country or station..."
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-neon-cyan/50 transition-colors"
            />
          </div>

          <nav className="flex-1 space-y-6">
            <div>
              <p className="text-[10px] font-mono text-white/40 mb-4 tracking-[0.2em] uppercase">Navigation</p>
              <div className="space-y-1">
                <NavItem icon={<GlobeIcon size={18} />} label="Explore Globe" active={!selectedCountry} onClick={() => setSelectedCountry(null)} />
                <NavItem icon={<Heart size={18} />} label="My Favorites" />
                <NavItem icon={<History size={18} />} label="Recent" />
              </div>
            </div>

            <div>
              <p className="text-[10px] font-mono text-white/40 mb-4 tracking-[0.2em] uppercase">Featured Countries</p>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {filteredCountries.map((country) => (
                   <button 
                    key={country.isoCode}
                    onClick={() => setSelectedCountry(country)}
                    className="w-full text-left p-2 rounded-lg hover:bg-white/5 text-sm text-white/70 hover:text-white transition-colors flex items-center justify-between group"
                   >
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-neon-cyan/30 group-hover:bg-neon-cyan transition-colors" />
                      {country.name}
                    </div>
                    <span>{country.flag}</span>
                   </button>
                ))}
              </div>
            </div>
          </nav>

          <div className="mt-auto pt-6 border-t border-white/10">
            <div className="glass p-4 rounded-2xl bg-gradient-to-br from-neon-blue/20 to-transparent">
              <p className="text-xs font-medium mb-1">PRO FEATURES</p>
              <p className="text-[10px] text-white/50 mb-3">Unlock high-quality streams and ad-free experience.</p>
              <button className="w-full py-2 bg-white text-black rounded-lg text-xs font-bold hover:bg-neon-cyan transition-colors">
                UPGRADE NOW
              </button>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

const NavItem = ({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick?: () => void }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${active ? 'bg-white/10 text-white shadow-[0_0_15px_rgba(255,255,255,0.1)]' : 'text-white/50 hover:text-white hover:bg-white/5'}`}
  >
    {icon}
    <span className="text-sm font-medium">{label}</span>
  </button>
);
