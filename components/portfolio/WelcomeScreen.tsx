'use client';

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';
import styles from './WelcomeScreen.module.css';

const greetings = [
  { word: 'Hello', language: 'ENGLISH' },
  { word: 'Hola', language: 'ESPAÑOL' },
  { word: 'Bonjour', language: 'FRANÇAIS' },
  { word: 'Hallo', language: 'DEUTSCH' },
  { word: 'Kumusta', language: 'FILIPINO' },
];
const storageKey = 'jethro-welcome-seen-v2';

export default function WelcomeScreen({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<'welcome' | 'leaving' | 'done'>('welcome');
  const [greeting, setGreeting] = useState(0);
  const enterButton = useRef<HTMLButtonElement>(null);
  const shown = useRef(false);
  const enter = useCallback(() => setPhase(current => current === 'welcome' ? 'leaving' : current), []);

  useEffect(() => {
    let seen = false;
    try { seen = sessionStorage.getItem(storageKey) === 'true'; } catch { /* Storage is optional. */ }
    if (seen || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setPhase('done');
      return;
    }
    shown.current = true;
    enterButton.current?.focus({ preventScroll: true });
    const greetingTimers = greetings.slice(1).map((_, index) =>
      window.setTimeout(() => setGreeting(index + 1), (index + 1) * 850)
    );
    const enterTimer = window.setTimeout(enter, 4400);
    return () => {
      greetingTimers.forEach(window.clearTimeout);
      window.clearTimeout(enterTimer);
    };
  }, [enter]);

  useEffect(() => {
    if (phase === 'done') {
      if (shown.current) document.getElementById('main-content')?.focus({ preventScroll: true });
      return;
    }
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, [phase]);

  useEffect(() => {
    if (phase !== 'leaving') return;
    try { sessionStorage.setItem(storageKey, 'true'); } catch { /* Still enter without storage. */ }
    const timer = window.setTimeout(() => setPhase('done'), 650);
    return () => window.clearTimeout(timer);
  }, [phase]);

  const active = phase !== 'done';
  return <>
    <div inert={active || undefined} aria-hidden={active || undefined}>{children}</div>
    {active && <div
      className={`${styles.screen} ${phase === 'leaving' ? styles.leaving : ''}`}
      role="dialog" aria-modal="true" aria-labelledby="welcome-title"
      onKeyDown={event => {
        if (event.key === 'Escape') enter();
        if (event.key === 'Tab') { event.preventDefault(); enterButton.current?.focus(); }
      }}
    >
      <div className={styles.center}>
        <h1 id="welcome-title" className={styles.srOnly}>Welcome to Jethro Rendon's portfolio</h1>
        <div className={styles.greeting} key={greeting} aria-hidden="true"><span className={styles.bullet}/>{greetings[greeting].word}</div>
      </div>
      <div className={styles.bottom}>
        <button ref={enterButton} onClick={enter} className={styles.enter} disabled={phase === 'leaving'}>
          Enter portfolio <ArrowRight size={16} strokeWidth={1.5}/>
        </button>
      </div>
    </div>}
  </>;
}
