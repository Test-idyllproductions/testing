import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSupabaseStore } from './supabase-store';

interface ThemeContextType {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  soundEnabled: boolean;
  toggleSound: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, updateUser } = useSupabaseStore();
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Load user preferences
  useEffect(() => {
    if (currentUser) {
      setTheme(currentUser.theme || 'dark');
      setSoundEnabled(currentUser.soundEnabled !== false);
    } else {
      // Load from localStorage for non-authenticated users
      const savedTheme = localStorage.getItem('idyll_theme') as 'dark' | 'light' || 'dark';
      const savedSound = localStorage.getItem('idyll_sound_enabled') !== 'false';
      setTheme(savedTheme);
      setSoundEnabled(savedSound);
    }
  }, [currentUser]);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.body.className = theme === 'light' ? 'light-theme' : 'dark-theme';
    
    // Update CSS custom properties for better theme support
    const root = document.documentElement;
    if (theme === 'light') {
      root.style.setProperty('--tw-bg-opacity', '1');
      root.style.setProperty('--tw-text-opacity', '1');
    } else {
      root.style.setProperty('--tw-bg-opacity', '1');
      root.style.setProperty('--tw-text-opacity', '1');
    }
  }, [theme]);

  const toggleTheme = async () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    
    if (currentUser) {
      await updateUser(currentUser.id, { theme: newTheme });
    } else {
      localStorage.setItem('idyll_theme', newTheme);
    }
  };

  const toggleSound = async () => {
    const newSoundEnabled = !soundEnabled;
    setSoundEnabled(newSoundEnabled);
    
    if (currentUser) {
      await updateUser(currentUser.id, { soundEnabled: newSoundEnabled });
    } else {
      localStorage.setItem('idyll_sound_enabled', newSoundEnabled.toString());
    }
  };

  return (
    <ThemeContext.Provider value={{
      theme,
      toggleTheme,
      soundEnabled,
      toggleSound
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};