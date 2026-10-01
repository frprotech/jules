'use client';

import { useState, useEffect } from 'react';
import { useSolarStore } from '@/store/useSolarStore';
import { NavTab, QualityPreset } from '@/types/solar';
import { PLANETS_DATA, SUN_DATA } from '@/data/planets';
import { spaceAudio } from '@/utils/audio';
import { Search, Volume2, VolumeX, Maximize2, Sliders, ChevronDown, Compass } from 'lucide-react';

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
  const triggerCameraFocus = useSolarStore((s) => s.triggerCameraFocus);
  const isImmersiveMode = useSolarStore((s) => s.isImmersiveMode);

  const [isPlanetsDropdownOpen, setIsPlanetsDropdownOpen] = useState(false);

  // Global Keyboard Shortcuts (Cmd+K / Ctrl+K and Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(!isSearchOpen);
        spaceAudio.playClickSound();
      }
      if (e.key === 'Escape') {
        if (isSearchOpen) {
          setSearchOpen(false);
        } else {
          selectBody(null);
          setActiveTab('solar_system');
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setSearchOpen, selectBody, setActiveTab]);

  if (isImmersiveMode) return null;

  const navItems: { id: NavTab; label: string }[] = [
    { id: 'explore', label: 'Explore' },
    { id: 'solar_system', label: 'Solar System' },
    { id: 'planets', label: 'Planets' },
    { id: 'missions', label: 'Missions' },
    { id: 'timeline', label: 'Timeline' }
  ];

  const allBodies = [SUN_DATA, ...PLANETS_DATA];

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const handleTabClick = (tabId: NavTab) => {
    setActiveTab(tabId);
    spaceAudio.playClickSound();

    if (tabId === 'solar_system') {
      selectBody(null);
      setIsPlanetsDropdownOpen(false);
    } else if (tabId === 'explore') {
      selectBody('earth');
      triggerCameraFocus('earth');
      setIsPlanetsDropdownOpen(false);
    } else if (tabId === 'planets') {
      setIsPlanetsDropdownOpen(!isPlanetsDropdownOpen);
    } else {
      setIsPlanetsDropdownOpen(false);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 p-4 flex items-center justify-between pointer-events-none select-none">
      {/* Brand Logo */}
      <div
        onClick={() => {
          selectBody(null);
          setActiveTab('solar_system');
          setIsPlanetsDropdownOpen(false);
          spaceAudio.playClickSound();
        }}
        className="pointer-events-auto flex items-center space-x-2.5 px-3.5 py-2 rounded-xl bg-slate-950/80 border border-slate-800/80 backdrop-blur-md cursor-pointer hover:border-cyan-500/50 transition-all shadow-lg"
      >
        <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
        <span className="font-mono text-sm font-bold tracking-wider text-white flex items-center gap-1.5">
          METAVERSE <span className="text-cyan-400 font-extrabold">SOLAR OS</span>
        </span>
      </div>

      {/* Center Nav Links */}
      <nav className="pointer-events-auto relative hidden md:flex items-center space-x-1 p-1.5 rounded-2xl bg-slate-950/80 border border-slate-800/80 backdrop-blur-md shadow-lg">
        {navItems.map((item) => (
          <div key={item.id} className="relative">
            <button
              onClick={() => handleTabClick(item.id)}
              className={`px-3.5 py-1.5 rounded-xl font-mono text-xs tracking-wider transition-all cursor-pointer flex items-center space-x-1 ${
                activeTab === item.id
                  ? 'bg-cyan-950/90 text-cyan-300 border border-cyan-500/50 shadow-md font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>{item.label}</span>
              {item.id === 'planets' && <ChevronDown className="w-3 h-3 text-cyan-400" />}
              {item.id === 'explore' && <Compass className="w-3 h-3 text-amber-400" />}
            </button>

            {/* Quick Planets Dropdown */}
            {item.id === 'planets' && isPlanetsDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-48 p-1.5 rounded-2xl bg-slate-950/95 border border-slate-800 backdrop-blur-2xl shadow-2xl space-y-1 z-50">
                {allBodies.map((body) => (
                  <button
                    key={body.id}
                    onClick={() => {
                      selectBody(body.id);
                      triggerCameraFocus(body.id);
                      setActiveTab('solar_system');
                      setIsPlanetsDropdownOpen(false);
                      spaceAudio.playSelectSound();
                    }}
                    className="w-full px-3 py-1.5 rounded-xl text-left font-mono text-xs flex items-center justify-between text-slate-300 hover:text-white hover:bg-cyan-950/80 transition-all cursor-pointer"
                  >
                    <span>{body.name}</span>
                    <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-slate-900 text-slate-500">
                      {body.id === 'sun' ? 'Star' : 'Planet'}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
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
          className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 backdrop-blur-md text-slate-300 hover:text-white hover:border-cyan-500/50 transition-all cursor-pointer flex items-center space-x-1.5"
          title="Search solar system (Cmd+K)"
        >
          <Search className="w-4 h-4 text-cyan-400" />
          <span className="hidden lg:inline font-mono text-[10px] text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
            ⌘K
          </span>
        </button>

        {/* Quality Preset Selector */}
        <div className="relative group">
          <button className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 backdrop-blur-md text-slate-300 hover:text-white hover:border-cyan-500/50 transition-all cursor-pointer flex items-center space-x-1">
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
          className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 backdrop-blur-md text-slate-300 hover:text-white hover:border-cyan-500/50 transition-all cursor-pointer"
          title={isAudioMuted ? 'Unmute Audio' : 'Mute Audio'}
        >
          {isAudioMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-cyan-400 animate-pulse" />}
        </button>

        {/* Fullscreen Button */}
        <button
          onClick={toggleFullscreen}
          className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 backdrop-blur-md text-slate-300 hover:text-white hover:border-cyan-500/50 transition-all cursor-pointer"
          title="Toggle Fullscreen"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
