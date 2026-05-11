import React, { useEffect, useRef, useState } from 'react';
import Globe, { GlobeMethods } from 'react-globe.gl';
import { useStore } from '../store/useStore';
import { INITIAL_COUNTRIES } from '../constants';
import { Country } from '../types';

export const MainGlobe: React.FC = () => {
  const globeRef = useRef<GlobeMethods>();
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const setSelectedCountry = useStore((state) => state.setSelectedCountry);
  const selectedCountry = useStore((state) => state.selectedCountry);
  const [hoveredCountry, setHoveredCountry] = useState<Country | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });
    
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (globeRef.current) {
      // Setup initial view
      globeRef.current.controls().autoRotate = true;
      globeRef.current.controls().autoRotateSpeed = 0.5;
      globeRef.current.pointOfView({ lat: 0, lng: 0, altitude: 2.5 });
    }
  }, []);

  const handlePointClick = (point: any) => {
    const country = point as Country;
    setSelectedCountry(country);
    if (globeRef.current) {
      globeRef.current.pointOfView({ 
        lat: country.lat, 
        lng: country.lng, 
        altitude: 1.5 
      }, 1000);
      globeRef.current.controls().autoRotate = false;
    }
  };

  return (
    <div ref={containerRef} className="w-full h-full relative cursor-grab active:cursor-grabbing">
      <Globe
        ref={globeRef}
        width={dimensions.width}
        height={dimensions.height}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        pointsData={INITIAL_COUNTRIES}
        pointLat="lat"
        pointLng="lng"
        pointColor={() => '#00f3ff'}
        pointAltitude={0.05}
        pointRadius={0.5}
        pointsMerge={true}
        onPointClick={handlePointClick}
        onPointHover={(point) => setHoveredCountry(point as Country | null)}
        pointLabel={(d: any) => `
          <div class="glass p-3 rounded-xl border border-neon-cyan/50 backdrop-blur-md">
            <span class="text-2xl">${d.flag}</span>
            <h3 class="text-white font-bold text-lg">${d.name}</h3>
            <p class="text-neon-cyan text-xs font-mono">STREAMS AVAILABLE</p>
          </div>
        `}
      />
      
      {selectedCountry && (
        <button 
          onClick={() => {
            setSelectedCountry(null);
            if (globeRef.current) {
              globeRef.current.controls().autoRotate = true;
            }
          }}
          className="absolute top-8 left-1/2 -translate-x-1/2 btn-neon bg-black/60 backdrop-blur-md z-50 flex items-center gap-2"
        >
          <span>Reset Globe</span>
        </button>
      )}
    </div>
  );
};
