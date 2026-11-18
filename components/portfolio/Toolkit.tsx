'use client';
import { useState, type CSSProperties } from 'react';
import { Braces, Coffee, Globe2, Pause, Play, Sparkles, Code2, Layers, Cpu, GitBranch, Terminal } from 'lucide-react';
import { skillGroups } from './data';
import styles from './Toolkit.module.css';

type Tool = { name: string; icon?: string; color: string; kind?: 'coffee' | 'api' | 'ai' | 'code' };
const rows: Tool[][] = [
 [
  { name: 'Python', icon: 'python', color: '#3776ab' },
  { name: 'TypeScript', icon: 'typescript', color: '#3178c6' },
  { name: 'JavaScript', icon: 'javascript', color: '#a58a00' },
  { name: 'HTML', icon: 'html5', color: '#e34f26' },
  { name: 'CSS', icon: 'css', color: '#663399' },
  { name: 'Java', kind: 'coffee', color: '#b65a2d' },
  { name: 'C++', icon: 'cplusplus', color: '#00599c' },
  { name: 'Dart', icon: 'dart', color: '#0175c2' },
  { name: 'React', icon: 'react', color: '#087e9b' },
  { name: 'Next.js', icon: 'nextdotjs', color: '#22262b' },
 ],
 [
  { name: 'Vite', icon: 'vite', color: '#7963cf' },
  { name: 'Tailwind CSS', icon: 'tailwindcss', color: '#0891b2' },
  { name: 'Flutter', icon: 'flutter', color: '#0289c0' },
  { name: 'Firebase', icon: 'firebase', color: '#e46a12' },
  { name: 'Firestore', icon: 'firebase', color: '#d59b13' },
  { name: 'Convex', kind: 'code', color: '#d54b45' },
  { name: 'Flask', icon: 'flask', color: '#252b30' },
  { name: 'Socket.IO', icon: 'socketdotio', color: '#252b30' },
  { name: 'REST APIs', kind: 'api', color: '#3f7c6a' },
 ],
 [
  { name: 'Google Colab', icon: 'googlecolab', color: '#d48b06' },
  { name: 'OpenAI API', kind: 'ai', color: '#34826c' },
  { name: 'Gemini API', icon: 'googlegemini', color: '#547ddd' },
  { name: 'OpenRouter', icon: 'openrouter', color: '#6a68b4' },
  { name: 'Vercel AI SDK', icon: 'vercel', color: '#252b30' },
  { name: 'Codex', kind: 'code', color: '#363e39' },
  { name: 'Git', icon: 'git', color: '#f05032' },
  { name: 'GitHub', icon: 'github', color: '#252b30' },
 ],
];

const categories = [
 { file: 'languages.ts', variable: 'languages', icon: Code2 },
 { file: 'application.tsx', variable: 'development', icon: Layers },
 { file: 'intelligence.py', variable: 'intelligence', icon: Cpu },
 { file: 'workflow.config', variable: 'practices', icon: GitBranch },
];
const skillCount = skillGroups.reduce((total, group) => total + group.items.length, 0);

function ToolTile({ tool }: { tool: Tool }) {
 const Icon = tool.kind === 'coffee' ? Coffee : tool.kind === 'api' ? Globe2 : tool.kind === 'code' ? Braces : Sparkles;
 return <div className={styles.tile} style={{ '--tool-color': tool.color } as CSSProperties}>
  <div className={styles.iconCard}><div className={styles.iconInset}>
   {tool.icon ? <svg viewBox="0 0 24 24" aria-hidden="true"><use href={`/toolkit-icons.svg#${tool.icon}`}/></svg> : <Icon aria-hidden="true" strokeWidth={1.7}/>}
  </div></div><span>{tool.name}</span>
 </div>;
}

export default function Toolkit() {
 const [paused, setPaused] = useState(false);
 return <section className={styles.toolkit} aria-labelledby="toolkit-title">
  <header className={styles.heading}><span className={styles.eyebrow}>TECHNICAL SKILLS</span><h1 id="toolkit-title">MY TOOLKIT</h1><p>The stack I reach for when bringing ideas to life.</p></header>
  <div className={styles.motionBar}><span>CODE · BUILD · EXPLORE</span><button aria-label={paused ? 'Play toolkit animation' : 'Pause toolkit animation'} aria-pressed={paused} onClick={() => setPaused(value => !value)}>{paused ? <Play size={12}/> : <Pause size={12}/>}<span>{paused ? 'Play' : 'Pause'}</span></button></div>
  <div className={`${styles.lanes} ${paused ? styles.paused : ''}`} aria-label="Tools and technologies">
   {rows.map((row, index) => <div className={`${styles.lane} ${index === 1 ? styles.reverse : ''}`} key={index}>
    <div className={styles.track} style={{ '--duration': `${48 + index * 7}s` } as CSSProperties}>
     <div className={styles.toolSet}>{row.map(tool => <ToolTile tool={tool} key={tool.name}/>)}</div>
     <div className={`${styles.toolSet} ${styles.duplicate}`} aria-hidden="true">{row.map(tool => <ToolTile tool={tool} key={tool.name}/>)}</div>
    </div>
   </div>)}
  </div>
  <div className={styles.details}>
   <div className={styles.detailHeading}><div><span className={styles.detailEyebrow}><Terminal size={14} aria-hidden="true"/> THE FULL STACK</span></div><span className={styles.stackCount}><i aria-hidden="true"/>{skillCount} skills<span>/</span>04 areas</span></div>
   <div className={styles.categories}>{skillGroups.map((group, index) => {
    const category = categories[index];
    const Icon = category.icon;
    return <section className={styles.category} key={group.name} aria-labelledby={`skill-category-${index}`}>
     <div className={styles.panelBar}><span><Icon size={13} aria-hidden="true"/>{category.file}</span><span className={styles.panelIndex}>0{index + 1}</span></div>
     <div className={styles.panelBody}><div className={styles.categoryHeading}><span className={styles.categoryIcon} aria-hidden="true"><Icon size={19} strokeWidth={1.5}/></span><div><h2 id={`skill-category-${index}`}>{group.name}</h2><p className={styles.comment}>// {group.comment}</p></div></div>
      <div className={styles.arrayLabel} aria-hidden="true"><span>const</span> {category.variable} = [</div>
      <div className={styles.tags}>{group.items.map(item => <span key={item}>{item}</span>)}</div><span className={styles.arrayEnd} aria-hidden="true">];</span>
     </div>
     <div className={styles.panelFooter}><span><i aria-hidden="true"/>résumé / {category.variable}</span><span>{String(group.items.length).padStart(2, '0')} entries</span></div>
    </section>;
   })}</div>
   <p className={styles.sourceNote}><span aria-hidden="true">↳</span> Dart and Flutter are included through my Groupify project experience.</p>
  </div>
 </section>;
}
