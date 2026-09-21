'use client';

import { useEffect } from 'react';
import { useSolarStore } from '@/store/useSolarStore';
import { spaceAudio } from '@/utils/audio';

export function KeyboardShortcuts() {
  const isSearchOpen = useSolarStore((s) => s.isSearchOpen);
  const setSearchOpen = useSolarStore((s) => s.setSearchOpen);
  const selectBody = useSolarStore((s) => s.selectBody);
  const togglePlay = useSolarStore((s) => s.togglePlay);
  const setActiveTab = useSolarStore((s) => s.setActiveTab);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K or '/' for search
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(!isSearchOpen);
        spaceAudio.playClickSound();
        return;
      }

      if (e.key === '/' && !isSearchOpen && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault();
        setSearchOpen(true);
        spaceAudio.playClickSound();
        return;
      }

      // Escape key to reset/close
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

      // Spacebar to play/pause when not typing in search
      if (e.code === 'Space' && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault();
        togglePlay();
        spaceAudio.playClickSound();
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setSearchOpen, selectBody, togglePlay, setActiveTab]);

  return null;
}
