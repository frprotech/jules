'use client';

import { useEffect } from 'react';
import { useSolarStore } from '@/store/useSolarStore';
import { spaceAudio } from '@/utils/audio';

export function ShortcutHandler() {
  const setSearchOpen = useSolarStore((s) => s.setSearchOpen);
  const isSearchOpen = useSolarStore((s) => s.isSearchOpen);
  const selectBody = useSolarStore((s) => s.selectBody);
  const togglePlay = useSolarStore((s) => s.togglePlay);
  const setActiveTab = useSolarStore((s) => s.setActiveTab);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle search with Cmd+K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(!isSearchOpen);
        spaceAudio.playClickSound();
        return;
      }

      // Handle Escape key
      if (e.key === 'Escape') {
        if (isSearchOpen) {
          setSearchOpen(false);
        } else {
          selectBody(null);
          setActiveTab('solar_system');
        }
        spaceAudio.playClickSound();
        return;
      }

      // Toggle Play/Pause with Space bar when not inside an input
      if (e.code === 'Space' && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault();
        togglePlay();
        spaceAudio.playClickSound();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setSearchOpen, selectBody, togglePlay, setActiveTab]);

  return null;
}
