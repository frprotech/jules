'use client';

import { useEffect } from 'react';
import { SceneCanvas } from '@/components/3d/SceneCanvas';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { TopNav } from '@/components/ui/TopNav';
import { ControlBar } from '@/components/ui/ControlBar';
import { PlanetPanel } from '@/components/ui/PlanetPanel';
import { SearchModal } from '@/components/ui/SearchModal';
import { TimelineView } from '@/components/ui/TimelineView';
import { MissionPanel } from '@/components/ui/MissionPanel';
import { useSolarStore } from '@/store/useSolarStore';

export default function Home() {
  const setSearchOpen = useSolarStore((s) => s.setSearchOpen);
  const isSearchOpen = useSolarStore((s) => s.isSearchOpen);
  const togglePlay = useSolarStore((s) => s.togglePlay);
  const toggleOrbits = useSolarStore((s) => s.toggleOrbits);
  const toggleLabels = useSolarStore((s) => s.toggleLabels);
  const selectBody = useSolarStore((s) => s.selectBody);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore keybindings if user is typing in input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(!isSearchOpen);
      } else if (e.key === '/') {
        e.preventDefault();
        setSearchOpen(true);
      } else if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.code === 'KeyO') {
        toggleOrbits();
      } else if (e.code === 'KeyL') {
        toggleLabels();
      } else if (e.key === 'Escape') {
        selectBody(null);
        setSearchOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setSearchOpen, togglePlay, toggleOrbits, toggleLabels, selectBody]);

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
