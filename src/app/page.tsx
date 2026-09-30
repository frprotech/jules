'use client';

import { useEffect } from 'react';
import { SceneCanvas } from '@/components/3d/SceneCanvas';
import { useSolarStore } from '@/store/useSolarStore';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { TopNav } from '@/components/ui/TopNav';
import { ControlBar } from '@/components/ui/ControlBar';
import { PlanetPanel } from '@/components/ui/PlanetPanel';
import { SearchModal } from '@/components/ui/SearchModal';
import { TimelineView } from '@/components/ui/TimelineView';
import { MissionPanel } from '@/components/ui/MissionPanel';

export default function Home() {
  const isSearchOpen = useSolarStore((s) => s.isSearchOpen);
  const setSearchOpen = useSolarStore((s) => s.setSearchOpen);
  const togglePlay = useSolarStore((s) => s.togglePlay);
  const selectBody = useSolarStore((s) => s.selectBody);
  const setActiveTab = useSolarStore((s) => s.setActiveTab);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle search on Cmd/Ctrl + K
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(!isSearchOpen);
      }
      // Toggle simulation on Spacebar when input is not focused
      if (e.code === 'Space' && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault();
        togglePlay();
      }
      // Reset view / close search on Escape
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
  }, [isSearchOpen, setSearchOpen, togglePlay, selectBody, setActiveTab]);

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-black select-none">
      {/* 3D WebGL Metaverse Canvas Engine */}
      <SceneCanvas />

      {/* Futuristic HUD UI Overlays */}
      <TopNav />
      <ControlBar />
      <PlanetPanel />
      <SearchModal />
      <TimelineView />
      <MissionPanel />

      {/* Metaverse Entry & Preloader */}
      <LoadingScreen />
    </main>
  );
}
