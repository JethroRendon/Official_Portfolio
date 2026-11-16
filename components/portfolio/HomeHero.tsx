'use client';

import { ArrowDown, ArrowUpRight, MousePointer2 } from 'lucide-react';
import styles from './HomeHero.module.css';

type HomeHeroProps = { onContact: () => void };

export default function HomeHero({ onContact }: HomeHeroProps) {
  return <section className={styles.hero} aria-label="Introduction">
    <div className={styles.composition}>
      <div className={styles.hello}>
        <span>Hello, I’m Jethro<span className={styles.helloDot}>.</span></span>
      </div>
      <div className={styles.headline}>
        <h1 aria-label="AI student, web and mobile developer">
          <span className={`${styles.row} ${styles.first}`}><span className={`${styles.purple} ${styles.aiWord}`}>AI STUDENT<span className={`${styles.cursor} ${styles.aiCursor}`} aria-hidden="true"><MousePointer2 size={21} fill="currentColor"/><span>AI</span></span></span></span>
          <span className={`${styles.row} ${styles.yellow}`}>WEB &amp; MOBILE</span>
          <span className={`${styles.row} ${styles.third}`}><span className={styles.developer}>DEVELOPER<span className={`${styles.cursor} ${styles.buildCursor}`} aria-hidden="true"><MousePointer2 size={21} fill="currentColor"/><span>Build</span></span></span><button onClick={onContact} className={styles.connect}><i/>Let’s connect<ArrowUpRight size={13}/></button></span>
        </h1>
        <p className={styles.purpose}>// Code with purpose. Build with intention.</p>
      </div>
      <p className={styles.description}>Building web &amp; mobile experiences through<br className={styles.desktopBreak}/><span className={styles.purple}> thoughtful code</span>, <span className={styles.yellow}>useful AI</span>, and <span className={styles.green}>community impact</span>.</p>
      <span className={styles.education}>BS COMPUTER SCIENCE · ARTIFICIAL INTELLIGENCE · WVSU</span>
    </div>
    <button className={styles.explore} onClick={() => document.getElementById('selected-work')?.scrollIntoView({ behavior: 'smooth' })}>SELECTED WORK <ArrowDown size={15}/></button>
  </section>;
}
