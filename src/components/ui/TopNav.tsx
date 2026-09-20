'use client';

import { useSolarStore } from '@/store/useSolarStore';
import { NavTab, QualityPreset } from '@/types/solar';
import { PLANETS_DATA, SUN_DATA } from '@/data/planets';
import { spaceAudio } from '@/utils/audio';
import { Search, Volume2, VolumeX, Maximize2, Sliders } from 'lucide-react';

export function TopNav() {
  const activeTab = useSolarStore((s) => s.activeTab);
  const setActiveTab = useSolarStore((s) => s.setActiveTab);
  const setSearchOpen = useSolarStore((s) => s.setSearchOpen);
  const isAudioMuted = useSolarStore((s) => s.isAudioMuted);
  const toggleAudio = useSolarStore((s) => s.toggleAudio);
  const qualityPreset = useSolarStore((s) => s.qualityPreset);
  const setQualityPreset = useSolarStore((s) => s.setQualityPreset);
  const selectBody = useSolarStore((s) => s.selectBody);
  const selectedBodyId = useSolarStore((s) => s.selectedBodyId);
  const isImmersiveMode = useSolarStore((s) => s.isImmersiveMode);

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

  return (
    <div className="fixed top-0 left-0 right-0 z-40 p-3 md:p-4 flex flex-col items-center pointer-events-none select-none">
      <header className="w-full flex items-center justify-between">
        {/* Brand Logo */}
        <div
          onClick={() => {
            selectBody(null);
            setActiveTab('solar_system');
            spaceAudio.playClickSound();
          }}
          className="pointer-events-auto flex items-center space-x-2.5 px-3.5 py-2 rounded-xl bg-slate-950/80 border border-slate-800/80 backdrop-blur-md cursor-pointer hover:border-cyan-500/50 transition-all shadow-lg"
        >
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
          <span className="font-mono text-sm font-bold tracking-wider text-white">
            COSMOS <span className="text-cyan-400 font-extrabold">3D</span>
          </span>
        </div>

        {/* Center Nav Links - Desktop */}
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
        <div className="pointer-events-auto flex items-center space-x-2">
          {/* Search button */}
          <button
            onClick={() => {
              setSearchOpen(true);
              spaceAudio.playClickSound();
            }}
            className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 backdrop-blur-md text-slate-300 hover:text-white hover:border-cyan-500/50 transition-all cursor-pointer"
            title="Search solar system (Cmd+K / Ctrl+K)"
          >
            <Search className="w-4 h-4" />
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
            className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 backdrop-blur-md text-slate-300 hover:text-white hover:border-cyan-500/50 transition-all cursor-pointer hidden sm:flex"
            title="Toggle Fullscreen"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Mobile Top Navigation Bar */}
      <nav className="pointer-events-auto flex md:hidden items-center space-x-1 mt-2.5 p-1 rounded-xl bg-slate-950/80 border border-slate-800/80 backdrop-blur-md overflow-x-auto max-w-full scrollbar-none">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setActiveTab(item.id);
              if (item.id === 'solar_system') selectBody(null);
              spaceAudio.playClickSound();
            }}
            className={`px-2.5 py-1 rounded-lg font-mono text-[11px] whitespace-nowrap cursor-pointer ${
              activeTab === item.id
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/50 font-semibold'
                : 'text-slate-400'
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {/* Planet Quick Bar when 'Planets' or 'Explore' tab is active */}
      {(activeTab === 'planets' || activeTab === 'explore') && (
        <div className="pointer-events-auto mt-3 flex items-center space-x-1.5 p-1.5 rounded-2xl bg-slate-950/85 border border-slate-800 backdrop-blur-md overflow-x-auto max-w-full scrollbar-thin shadow-2xl">
          {allBodies.map((body) => {
            const isSelected = selectedBodyId === body.id;
            return (
              <button
                key={body.id}
                onClick={() => {
                  selectBody(body.id);
                  spaceAudio.playSelectSound();
                }}
                className={`px-3 py-1 rounded-xl font-mono text-xs whitespace-nowrap cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-cyan-950 border border-cyan-400 text-cyan-200 font-bold shadow-md shadow-cyan-500/20'
                    : 'bg-slate-900/60 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
                }`}
              >
                {body.name}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
