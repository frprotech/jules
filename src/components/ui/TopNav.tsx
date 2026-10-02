'use client';

import { useEffect, useState } from 'react';
import { useSolarStore } from '@/store/useSolarStore';
import { NavTab, QualityPreset } from '@/types/solar';
import { spaceAudio } from '@/utils/audio';
import { Search, Volume2, VolumeX, Maximize2, Sliders, Menu, X } from 'lucide-react';

export function TopNav() {
  const activeTab = useSolarStore((s) => s.activeTab);
  const setActiveTab = useSolarStore((s) => s.setActiveTab);
  const isSearchOpen = useSolarStore((s) => s.isSearchOpen);
  const setSearchOpen = useSolarStore((s) => s.setSearchOpen);
  const isAudioMuted = useSolarStore((s) => s.isAudioMuted);
  const toggleAudio = useSolarStore((s) => s.toggleAudio);
  const qualityPreset = useSolarStore((s) => s.qualityPreset);
  const setQualityPreset = useSolarStore((s) => s.setQualityPreset);
  const selectBody = useSolarStore((s) => s.selectBody);
  const isImmersiveMode = useSolarStore((s) => s.isImmersiveMode);
  const togglePlay = useSolarStore((s) => s.togglePlay);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if typing in an input
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') {
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(!isSearchOpen);
        spaceAudio.playClickSound();
      } else if (e.key === ' ') {
        e.preventDefault();
        togglePlay();
        spaceAudio.playClickSound();
      } else if (e.key.toLowerCase() === 'r') {
        e.preventDefault();
        selectBody(null);
        spaceAudio.playClickSound();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        if (isSearchOpen) {
          setSearchOpen(false);
        } else {
          selectBody(null);
        }
        spaceAudio.playClickSound();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setSearchOpen, togglePlay, selectBody]);

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
    <header className="fixed top-0 left-0 right-0 z-40 p-3 sm:p-4 flex items-center justify-between pointer-events-none select-none">
      {/* Brand Logo */}
      <div
        onClick={() => {
          selectBody(null);
          setActiveTab('solar_system');
          spaceAudio.playClickSound();
        }}
        className="pointer-events-auto flex items-center space-x-2.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-slate-950/80 border border-slate-800/80 backdrop-blur-md cursor-pointer hover:border-cyan-500/50 transition-all shadow-lg"
      >
        <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
        <span className="font-mono text-xs sm:text-sm font-bold tracking-wider text-white">
          COSMOS <span className="text-cyan-400 font-extrabold">3D</span>
        </span>
      </div>

      {/* Desktop Nav Links */}
      <nav className="pointer-events-auto hidden md:flex items-center space-x-1 p-1.5 rounded-2xl bg-slate-950/80 border border-slate-800/80 backdrop-blur-md shadow-lg">
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
      <div className="pointer-events-auto flex items-center space-x-1.5 sm:space-x-2">
        {/* Search button */}
        <button
          onClick={() => {
            setSearchOpen(true);
            spaceAudio.playClickSound();
          }}
          className="p-2 sm:p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 backdrop-blur-md text-slate-300 hover:text-white hover:border-cyan-500/50 transition-all cursor-pointer flex items-center space-x-1"
          title="Search solar system (Cmd+K)"
        >
          <Search className="w-4 h-4" />
          <span className="hidden lg:inline text-[10px] font-mono text-slate-400 border border-slate-700/60 rounded px-1">
            ⌘K
          </span>
        </button>

        {/* Quality Preset Selector */}
        <div className="relative group">
          <button className="p-2 sm:p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 backdrop-blur-md text-slate-300 hover:text-white hover:border-cyan-500/50 transition-all cursor-pointer flex items-center space-x-1">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <span className="font-mono text-[10px] uppercase font-bold text-cyan-300 hidden sm:inline">
              {qualityPreset}
            </span>
          </button>
          <div className="absolute right-0 top-full mt-2 hidden group-hover:flex flex-col p-1.5 rounded-xl bg-slate-950/95 border border-slate-800 backdrop-blur-md shadow-2xl space-y-1 z-50">
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
          className="p-2 sm:p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 backdrop-blur-md text-slate-300 hover:text-white hover:border-cyan-500/50 transition-all cursor-pointer"
          title={isAudioMuted ? 'Unmute Audio' : 'Mute Audio'}
        >
          {isAudioMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-cyan-400 animate-pulse" />}
        </button>

        {/* Fullscreen Button */}
        <button
          onClick={toggleFullscreen}
          className="hidden sm:flex p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 backdrop-blur-md text-slate-300 hover:text-white hover:border-cyan-500/50 transition-all cursor-pointer"
          title="Toggle Fullscreen"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-300 hover:text-white"
        >
          {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="pointer-events-auto fixed top-16 right-3 z-50 w-56 p-3 rounded-2xl bg-slate-950/95 border border-slate-800 backdrop-blur-xl shadow-2xl flex flex-col space-y-1 md:hidden">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                if (item.id === 'solar_system') selectBody(null);
                setMobileMenuOpen(false);
                spaceAudio.playClickSound();
              }}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl font-mono text-xs tracking-wider transition-all ${
                activeTab === item.id
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/50 font-bold'
                  : 'text-slate-300 hover:bg-white/5'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
