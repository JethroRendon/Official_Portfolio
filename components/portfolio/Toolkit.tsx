'use client';
import { useState, type CSSProperties } from 'react';
import { Globe2, Pause, Play, Code2, Layers, Cpu, GitBranch, Terminal } from 'lucide-react';
import TechnologyLogo from './TechnologyLogo';
import { skillGroups } from './data';
import styles from './Toolkit.module.css';

type Tool = { name: string; color: string };
const rows: Tool[][] = [
 [
  { name: 'Python', color: '#3776ab' },
  { name: 'TypeScript', color: '#3178c6' },
  { name: 'JavaScript', color: '#a58a00' },
  { name: 'HTML', color: '#e34f26' },
  { name: 'CSS', color: '#663399' },
  { name: 'Java', color: '#b65a2d' },
  { name: 'C++', color: '#00599c' },
  { name: 'Dart', color: '#0175c2' },
  { name: 'React', color: '#087e9b' },
  { name: 'Next.js', color: '#22262b' },
 ],
 [
  { name: 'Vite', color: '#7963cf' },
  { name: 'Tailwind CSS', color: '#0891b2' },
  { name: 'Flutter', color: '#0289c0' },
  { name: 'Firebase', color: '#e46a12' },
  { name: 'Firestore', color: '#d59b13' },
  { name: 'Convex', color: '#d54b45' },
  { name: 'Flask', color: '#252b30' },
  { name: 'Socket.IO', color: '#252b30' },
  { name: 'REST APIs', color: '#3f7c6a' },
 ],
 [
  { name: 'Google Colab', color: '#d48b06' },
  { name: 'OpenAI API', color: '#34826c' },
  { name: 'Gemini API', color: '#547ddd' },
  { name: 'OpenRouter', color: '#6a68b4' },
  { name: 'Vercel AI SDK', color: '#252b30' },
  { name: 'Codex', color: '#363e39' },
  { name: 'Git', color: '#f05032' },
  { name: 'GitHub', color: '#252b30' },
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
 return <div className={styles.tile} style={{ '--tool-color': tool.color } as CSSProperties}>
  <div className={styles.iconCard}><div className={`${styles.iconInset} ${tool.name === 'Java' ? styles.javaInset : ''}`}>
   {tool.name === 'REST APIs' ? <Globe2 aria-hidden="true" strokeWidth={1.7}/> : <TechnologyLogo name={tool.name} className={styles.toolLogo} tone="dark"/>}
  </div></div><span>{tool.name}</span>
 </div>;
}

export default function Toolkit() {
 const [paused, setPaused] = useState(false);
 return <section className={styles.toolkit} aria-labelledby="toolkit-title">
  <header className={styles.heading}><h1 id="toolkit-title">MY TOOLKIT</h1><p>The stack I reach for when bringing ideas to life.</p></header>
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
     <div className={styles.panelBody}><div className={styles.categoryHeading}><span className={styles.categoryIcon} aria-hidden="true"><Icon size={19} strokeWidth={1.5}/></span><div><h2 id={`skill-category-${index}`}>{group.name}</h2><p className={styles.comment}>{group.comment}</p></div></div>
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
