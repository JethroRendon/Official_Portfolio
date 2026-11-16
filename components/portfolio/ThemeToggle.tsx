'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import styles from './ThemeToggle.module.css';

type Theme = 'dark' | 'light';
const storageKey = 'jethro-portfolio-theme';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('dark');
  useEffect(() => {
    setTheme(document.documentElement.dataset.theme === 'light' ? 'light' : 'dark');
  }, []);

  function choose(next: Theme) {
    document.documentElement.dataset.theme = next;
    setTheme(next);
    try { localStorage.setItem(storageKey, next); } catch { /* Theme still works when storage is unavailable. */ }
  }

  return <div className={styles.group} role="group" aria-label="Color theme">
    <button type="button" onClick={() => choose('light')} aria-label="Use light mode" aria-pressed={theme === 'light'} title="Light mode"><Sun size={16}/></button>
    <button type="button" onClick={() => choose('dark')} aria-label="Use dark mode" aria-pressed={theme === 'dark'} title="Dark mode"><Moon size={16}/></button>
  </div>;
}
