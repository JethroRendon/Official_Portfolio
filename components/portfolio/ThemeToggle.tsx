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

  const label = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
  return <button className={styles.toggle} type="button" onClick={() => choose(theme === 'dark' ? 'light' : 'dark')} aria-label={label} title={label}><span key={theme} className={styles.icon} aria-hidden="true">{theme === 'dark' ? <Sun size={19}/> : <Moon size={19}/>}</span></button>;
}
