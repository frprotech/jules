'use client';

import { useEffect } from 'react';
import { useSolarStore } from '@/store/useSolarStore';
import { NavTab, QualityPreset } from '@/types/solar';
import { PLANETS_DATA, SUN_DATA } from '@/data/planets';
import { spaceAudio } from '@/utils/audio';
import { Search, Volume2, VolumeX, Maximize2, Sliders, Compass } from 'lucide-react';

export function TopNav() {
  const activeTab = useSolarStore((s) => s.activeTab);
  const setActiveTab = useSolarStore((s) => s.setActiveTab);
  const setSearchOpen = useSolarStore((s) => s.setSearchOpen);
  const isSearchOpen = useSolarStore((s) => s.isSearchOpen);
  const isAudioMuted = useSolarStore((s) => s.isAudioMuted);
  const toggleAudio = useSolarStore((s) => s.toggleAudio);
  const qualityPreset = useSolarStore((s) => s.qualityPreset);
  const setQualityPreset = useSolarStore((s) => s.setQualityPreset);
  const selectBody = useSolarStore((s) => s.selectBody);
  const selectedBodyId = useSolarStore((s) => s.selectedBodyId);
  const isImmersiveMode = useSolarStore((s) => s.isImmersiveMode);

  // Global Keyboard Shortcuts (Cmd+K / Ctrl+K and Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(!isSearchOpen);
        spaceAudio.playClickSound();
      } else if (e.key === 'Escape') {
        if (isSearchOpen) {
          setSearchOpen(false);
        } else if (selectedBodyId) {
          selectBody(null);
          spaceAudio.playClickSound();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, selectedBodyId, setSearchOpen, selectBody]);

  if (isImmersiveMode) return null;

  const navItems: { id: NavTab; label: string }[] = [
    { id: 'explore', label: 'Explore' },
    { id: 'solar_system', label: 'Solar System' },
    { id: 'planets', label: 'Planets' },
    { id: 'missions', label: 'Missions' },
    { id: 'timeline', label: 'Timeline' }
  ];

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <>
    <header className="fixed top-0 left-0 right-0 z-40 p-4 flex items-center justify-between pointer-events-none select-none">
      {/* Brand Logo */}
      <div
        onClick={() => {
          selectBody(null);
          setActiveTab('solar_system');
          spaceAudio.playClickSound();
        }}
        className="pointer-events-auto flex items-center space-x-2.5 px-3.5 py-2 rounded-xl bg-slate-950/70 border border-slate-800/80 backdrop-blur-md cursor-pointer hover:border-cyan-500/50 transition-all shadow-lg"
      >
        <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
        <span className="font-mono text-sm font-bold tracking-wider text-white">
          COSMOS <span className="text-cyan-400 font-extrabold">3D</span>
        </span>
      </div>

      {/* Center Nav Links */}
      <nav className="pointer-events-auto hidden md:flex items-center space-x-1 p-1.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 backdrop-blur-md shadow-lg">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setActiveTab(item.id);
              if (item.id === 'solar_system') selectBody(null);
              spaceAudio.playClickSound();
            }}
            className={`px-3.5 py-1.5 rounded-xl font-mono text-xs tracking-wider transition-all cursor-pointer ${
              activeTab === item.id
                ? 'bg-cyan-950/90 text-cyan-300 border border-cyan-500/50 shadow-md font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {/* Right Controls */}
      <div className="pointer-events-auto flex items-center space-x-2">
        {/* Search button */}
        <button
          onClick={() => {
            setSearchOpen(true);
            spaceAudio.playClickSound();
          }}
          className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 backdrop-blur-md text-slate-300 hover:text-white hover:border-cyan-500/50 transition-all cursor-pointer"
          title="Search solar system (Cmd+K)"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Quality Preset Selector */}
        <div className="relative group">
          <button className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 backdrop-blur-md text-slate-300 hover:text-white hover:border-cyan-500/50 transition-all cursor-pointer flex items-center space-x-1">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <span className="font-mono text-[10px] uppercase font-bold text-cyan-300 hidden sm:inline">
              {qualityPreset}
            </span>
          </button>
          <div className="absolute right-0 top-full mt-2 hidden group-hover:flex flex-col p-1.5 rounded-xl bg-slate-950/95 border border-slate-800 backdrop-blur-md shadow-2xl space-y-1">
            {(['ultra', 'high', 'medium', 'low'] as QualityPreset[]).map((preset) => (
              <button
                key={preset}
                onClick={() => {
                  setQualityPreset(preset);
                  spaceAudio.playClickSound();
                }}
                className={`px-3 py-1 rounded-lg text-left font-mono text-xs uppercase cursor-pointer ${
                  qualityPreset === preset ? 'bg-cyan-950 text-cyan-300 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        {/* Audio Mute Toggle */}
        <button
          onClick={() => {
            toggleAudio();
            spaceAudio.setMuted(!isAudioMuted);
          }}
          className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 backdrop-blur-md text-slate-300 hover:text-white hover:border-cyan-500/50 transition-all cursor-pointer"
          title={isAudioMuted ? 'Unmute Audio' : 'Mute Audio'}
        >
          {isAudioMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-cyan-400 animate-pulse" />}
        </button>

        {/* Fullscreen Button */}
        <button
          onClick={toggleFullscreen}
          className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 backdrop-blur-md text-slate-300 hover:text-white hover:border-cyan-500/50 transition-all cursor-pointer"
          title="Toggle Fullscreen"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>
    </header>

    {/* Quick Planet Selector Sub-bar when 'Planets' tab is active */}
    {activeTab === 'planets' && (
      <div className="fixed top-20 left-1/2 -translate-x-1/2 z-40 pointer-events-auto flex items-center space-x-1.5 p-2 rounded-2xl bg-slate-950/85 border border-slate-800/80 backdrop-blur-md shadow-2xl overflow-x-auto max-w-[90vw] scrollbar-none select-none">
        <button
          onClick={() => {
            selectBody('sun');
            spaceAudio.playSelectSound();
          }}
          className={`px-3 py-1.5 rounded-xl font-mono text-xs uppercase cursor-pointer whitespace-nowrap transition-all ${
            selectedBodyId === 'sun'
              ? 'bg-amber-950/90 text-amber-300 border border-amber-500/50 font-bold'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          {SUN_DATA.name}
        </button>
        <div className="w-px h-4 bg-slate-800 my-auto" />
        {PLANETS_DATA.map((p) => (
          <button
            key={p.id}
            onClick={() => {
              selectBody(p.id);
              spaceAudio.playSelectSound();
            }}
            className={`px-3 py-1.5 rounded-xl font-mono text-xs uppercase cursor-pointer whitespace-nowrap transition-all ${
              selectedBodyId === p.id
                ? 'bg-cyan-950/90 text-cyan-300 border border-cyan-500/50 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {p.name}
          </button>
        ))}
      </div>
    )}

    {/* Explore Mode Banner */}
    {activeTab === 'explore' && !selectedBodyId && (
      <div className="fixed top-20 left-1/2 -translate-x-1/2 z-40 pointer-events-auto px-5 py-2.5 rounded-2xl bg-cyan-950/80 border border-cyan-500/40 backdrop-blur-md text-cyan-300 font-mono text-xs shadow-xl flex items-center space-x-2.5 animate-pulse">
        <Compass className="w-4 h-4 text-cyan-400" />
        <span>Select or double-click any celestial body to initiate spatial fly-through.</span>
      </div>
    )}
    </>
  );
}
