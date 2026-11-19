'use client';

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';
import styles from './WelcomeScreen.module.css';

const greetings = [
  { word: 'Hello', language: 'ENGLISH', lang: 'en' },
  { word: 'Hola', language: 'ESPAÑOL', lang: 'es' },
  { word: 'Bonjour', language: 'FRANÇAIS', lang: 'fr' },
  { word: 'Hallo', language: 'DEUTSCH', lang: 'de' },
  { word: 'Ciao', language: 'ITALIANO', lang: 'it' },
  { word: '你好', language: '中文', lang: 'zh' },
  { word: 'こんにちは', language: '日本語', lang: 'ja' },
  { word: '안녕하세요', language: '한국어', lang: 'ko' },
  { word: 'Kumusta', language: 'FILIPINO', lang: 'fil' },
];
const storageKey = 'jethro-welcome-seen-v3';

type WelcomeScreenProps = { children: ReactNode; autoEnterAfterMs?: number | null; rememberVisit?: boolean };

export default function WelcomeScreen({ children, autoEnterAfterMs = 1800, rememberVisit = true }: WelcomeScreenProps) {
  const [phase, setPhase] = useState<'welcome' | 'leaving' | 'done'>('welcome');
  const [greeting, setGreeting] = useState(0);
  const enterButton = useRef<HTMLButtonElement>(null);
  const dialog = useRef<HTMLDivElement>(null);
  const shown = useRef(false);
  const enter = useCallback(() => setPhase(current => current === 'welcome' ? 'leaving' : current), []);

  useEffect(() => {
    if (phase !== 'welcome') return;
    let seen = false;
    try { seen = rememberVisit && sessionStorage.getItem(storageKey) === 'true'; } catch { /* Storage is optional. */ }
    if (seen || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setPhase('done');
      return;
    }
    shown.current = true;
    dialog.current?.focus({ preventScroll: true });
    const stepMs = autoEnterAfterMs === null ? 450 : Math.max(100, (autoEnterAfterMs - 200) / (greetings.length - 1));
    const greetingTimers = greetings.slice(1).map((_, index) =>
      window.setTimeout(() => setGreeting(index + 1), (index + 1) * stepMs)
    );
    const enterTimer = autoEnterAfterMs === null ? undefined : window.setTimeout(enter, autoEnterAfterMs);
    return () => {
      greetingTimers.forEach(window.clearTimeout);
      if (enterTimer !== undefined) window.clearTimeout(enterTimer);
    };
  }, [autoEnterAfterMs, enter, rememberVisit, phase]);

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
    try { if (rememberVisit) sessionStorage.setItem(storageKey, 'true'); } catch { /* Still enter without storage. */ }
    const timer = window.setTimeout(() => setPhase('done'), 180);
    return () => window.clearTimeout(timer);
  }, [phase, rememberVisit]);

  const active = phase !== 'done';
  return <>
    <div data-portfolio-ready={phase === 'done' ? 'true' : 'false'} inert={active || undefined} aria-hidden={active || undefined}>{children}</div>
    {active && <div
      ref={dialog} tabIndex={-1}
      className={`${styles.screen} ${phase === 'leaving' ? styles.leaving : ''}`}
      role="dialog" aria-modal="true" aria-labelledby="welcome-title"
      onKeyDown={event => {
        if (event.key === 'Escape' || (event.key === 'Enter' && event.target === event.currentTarget)) enter();
        if (event.key === 'Tab') { event.preventDefault(); enterButton.current?.focus(); }
      }}
    >
      <div className={styles.identity} aria-hidden="true"><span>JETHRO RENDON</span><small>DEVELOPER PORTFOLIO</small></div>
      <div className={styles.center}>
        <h1 id="welcome-title" className={styles.srOnly}>Welcome to Jethro Rendon's portfolio</h1>
        <div className={styles.greetingBlock} key={greeting} aria-hidden="true">
          <div className={styles.greeting} lang={greetings[greeting].lang} dir="auto">{greetings[greeting].word}</div>
          <span className={styles.language}>{greetings[greeting].language}</span>
        </div>
        <div className={styles.steps} aria-hidden="true">{greetings.map((item,index)=><span key={item.language} data-current={index === greeting || undefined} data-past={index < greeting || undefined}/>)}</div>
      </div>
      <div className={styles.bottom}>
        <span className={styles.signature} aria-hidden="true">AI <i/> WEB <i/> MOBILE</span>
        <button ref={enterButton} onClick={enter} className={styles.enter} disabled={phase === 'leaving'}>
          Enter portfolio <ArrowRight size={13} strokeWidth={1.5} aria-hidden="true"/>
        </button>
      </div>
    </div>}
  </>;
}
