'use client';
import { useRef, useState, type KeyboardEvent } from 'react';
import { ArrowDown, ArrowRight, ArrowUpRight, Award, BookOpen, Braces, BrainCircuit, Check, ChevronDown, Code2, Compass, Copy, Database, FileText, GraduationCap, MapPin, Network, Terminal, Users } from 'lucide-react';
import type { View } from './Explorer';
import { resumeUrl } from './data';
import styles from './AboutProfile.module.css';

const sections = [
 { id: 'overview', label: 'Overview', icon: Code2, chapter: '01 / THE INTRODUCTION', title: 'An aspiring developer.', subtitle: 'A community leader.', context: 'A little context, in code.', action: 'Explore my toolkit', destination: 'skills' },
 { id: 'education', label: 'Education', icon: GraduationCap, chapter: '02 / ALWAYS LEARNING', title: 'Computer Science.', subtitle: 'An AI perspective.', context: 'The foundations I’m building on.', action: 'Explore my learning foundations', destination: null },
 { id: 'leadership', label: 'Leadership', icon: Users, chapter: '03 / LEADING WITH PURPOSE', title: 'Listen. Collaborate.', subtitle: 'Turn plans into action.', context: 'People at the center of the work.', action: 'Explore my leadership experience', destination: 'experience/sk-chairperson' },
] as const;
type Section = typeof sections[number]['id'];
const profileData: Record<Section, Record<string, string>> = {
 overview: { name: 'Jethro A. Rendon', role: 'Student & aspiring developer', focus: 'AI, web & mobile', university: 'WVSU — Main Campus', based_in: 'Anini-y, Antique', approach: 'Build with intention' },
 education: { degree: 'BS Computer Science', major: 'Artificial Intelligence', university: 'WVSU — Main Campus', graduation: 'July 2027 (expected)', gwa: '1.26' },
 leadership: { role: 'SK Chairman', organization: 'Barangay Poblacion', location: 'Anini-y, Antique', since: 'October 2023', focus: 'Youth development' },
};
const coursework = [
 { name: 'Data Structures & Algorithms', icon: Network, note: 'The foundations for organizing data, approaching problems, and reasoning about efficient solutions.' },
 { name: 'Database Systems', icon: Database, note: 'How data is structured, connected, and managed to support useful applications.' },
 { name: 'Software Engineering', icon: Code2, note: 'The process of taking an idea through planning, implementation, and testing.' },
 { name: 'Artificial Intelligence', icon: BrainCircuit, note: 'The ideas behind intelligent systems and applications that respond to real problems.' },
 { name: 'Machine Learning', icon: Network, note: 'Learning patterns from data and evaluating how well a model performs.' },
 { name: 'Web Development', icon: Code2, note: 'Building responsive interfaces and connecting them with application functionality.' },
];

export default function AboutProfile({ navigate }: { navigate: (view: View) => void }) {
 const [selected, setSelected] = useState<Section>('overview');
 const [copyState, setCopyState] = useState<'idle' | 'copied' | 'error'>('idle');
 const tabs = useRef<(HTMLButtonElement | null)[]>([]);
 const learning = useRef<HTMLDivElement>(null);
 const copyAttempt = useRef(0);
 const active = sections.find(section => section.id === selected)!;
 function select(id: Section) { copyAttempt.current += 1; setSelected(id); setCopyState('idle'); }
 function tabKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
  let next = index;
  if (event.key === 'ArrowRight') next = (index + 1) % sections.length;
  else if (event.key === 'ArrowLeft') next = (index - 1 + sections.length) % sections.length;
  else if (event.key === 'Home') next = 0;
  else if (event.key === 'End') next = sections.length - 1;
  else return;
  event.preventDefault(); select(sections[next].id); tabs.current[next]?.focus();
 }
 async function copyProfile() {
  const attempt = ++copyAttempt.current;
  try { await navigator.clipboard.writeText(JSON.stringify(profileData[selected], null, 2)); if (attempt === copyAttempt.current) setCopyState('copied'); }
  catch { if (attempt === copyAttempt.current) setCopyState('error'); }
 }
 function exploreLearning() { learning.current?.focus({ preventScroll: true }); learning.current?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' }); }
 const entries = Object.entries(profileData[selected]);
 return <div className={styles.about}>
  <header className={styles.heading}>
   <span className={styles.eyebrow}>// THE PERSON BEHIND THE CODE</span>
   <h1>A little about me<span>.</span></h1>
   <p>Curious about technology. <span>Grounded in community.</span></p>
   <div className={styles.identity}><span><Code2 size={13} aria-hidden="true"/>Aspiring developer</span><span><GraduationCap size={14} aria-hidden="true"/>Computer Science · WVSU</span></div>
  </header>

  <section className={styles.profile} aria-label="Explore my profile">
   <div className={styles.profileBar}><span><BookOpen size={14} aria-hidden="true"/>readme.md</span><span className={styles.profileHint}><i aria-hidden="true"/>A WORK IN PROGRESS, ALWAYS</span></div>
   <div className={styles.tabs} role="tablist" aria-label="About Jethro">{sections.map((section, index) => { const Icon = section.icon; return <button key={section.id} ref={el => { tabs.current[index] = el; }} id={`about-tab-${section.id}`} role="tab" type="button" aria-selected={selected === section.id} aria-controls={`about-panel-${section.id}`} tabIndex={selected === section.id ? 0 : -1} onKeyDown={event => tabKey(event, index)} onClick={() => select(section.id)}><Icon size={15} aria-hidden="true"/>{section.label}<span className={styles.tabNumber}>0{index+1}</span></button>; })}</div>
   <div className={styles.profileGrid}>
    <div className={styles.story}>
     {sections.map(section => <div key={section.id} role="tabpanel" id={`about-panel-${section.id}`} aria-labelledby={`about-tab-${section.id}`} hidden={selected !== section.id} tabIndex={0} className={styles.tabPanel}>
      <span className={styles.chapter}>{section.chapter}</span>
      <h2>{section.title}<br/><span>{section.subtitle}</span></h2>
      {section.id === 'overview' && <><p>Hi, I’m <strong>Jethro A. Rendon</strong>, a Computer Science student at West Visayas State University, an aspiring developer, and a community leader. I enjoy turning ideas into useful applications and learning how technology can solve everyday problems.</p><p>Serving as the SK Chairperson of Barangay Poblacion, Anini-y, Antique has taught me to listen, work with different people, and take responsibility for ideas beyond the planning stage.</p><span className={styles.location}><MapPin size={13} aria-hidden="true"/>Poblacion, Anini-y, Antique</span></>}
      {section.id === 'education' && <><p>I’m pursuing a <strong>B.S. in Computer Science, major in Artificial Intelligence</strong>, at West Visayas State University – Main Campus in Iloilo City. My expected graduation is July 2027, with a current GWA of 1.26.</p><p>My undergraduate thesis, VEC-PRO, combines a multi-stage deep learning pipeline with agent-based spatiotemporal mosquito spread forecasting.</p><span className={styles.location}><GraduationCap size={14} aria-hidden="true"/>WVSU · Iloilo City, Philippines</span></>}
      {section.id === 'leadership' && <><p>Since October 2023, I have served as <strong>Sangguniang Kabataan Chairman</strong> of Barangay Poblacion, Anini-y, Antique, leading youth development programs, community events, sports activities, and youth engagement initiatives.</p><p>I coordinate responsibilities and schedules, and work with barangay officials, youth organizations, and community stakeholders to support youth participation.</p><span className={styles.location}><Users size={14} aria-hidden="true"/>Barangay Poblacion · October 2023–present</span></>}
      <button className={styles.textAction} onClick={() => section.destination ? navigate(section.destination) : exploreLearning()}>{section.action}{section.id === 'education' ? <ArrowDown size={15} aria-hidden="true"/> : <ArrowUpRight size={15} aria-hidden="true"/>}</button>
     </div>)}
    </div>
    <aside className={styles.codeCard} aria-label="Profile JSON">
     <div className={styles.codeBar}><span><Braces size={14} aria-hidden="true"/>profile.json</span><button type="button" aria-label="Copy profile JSON" onClick={copyProfile} title="Copy profile JSON">{copyState === 'copied' ? <Check size={14} aria-hidden="true"/> : <Copy size={14} aria-hidden="true"/>}</button></div>
     <div className={styles.codeBody}><p className={styles.codeComment}>// {selected === 'overview' ? 'a quick introduction' : selected === 'education' ? 'learning.config' : 'community.config'}</p><div className={styles.codeLine}><span aria-hidden="true">1</span><code>{'{'}</code></div>{entries.map(([key, value], index) => <div className={styles.codeLine} key={key}><span aria-hidden="true">{index + 2}</span><code className={styles.indent}><span className={styles.jsonKey}>"{key}"</span>: <span className={styles.jsonString}>"{value}"</span>{index < entries.length - 1 ? ',' : ''}</code></div>)}<div className={styles.codeLine}><span aria-hidden="true">{entries.length + 2}</span><code>{'}'}</code></div></div>
     <div className={styles.codeFooter}><span><i aria-hidden="true"/>{selected}.profile</span><span>JSON · UTF-8</span></div>
     <p className={styles.copyStatus} role="status" aria-live="polite">{copyState === 'copied' ? 'Profile JSON copied.' : copyState === 'error' ? 'Copy is unavailable. You can select the JSON text instead.' : active.context}</p>
    </aside>
   </div>
   <div className={styles.profileFooter}><span><Terminal size={13} aria-hidden="true"/>Code with purpose. Build with intention.</span><a href={resumeUrl} target="_blank" rel="noreferrer"><FileText size={14} aria-hidden="true"/>Preview résumé<ArrowUpRight size={13} aria-hidden="true"/><span className={styles.srOnly}> (opens in a new tab)</span></a></div>
  </section>

  <div className={styles.learning} ref={learning} tabIndex={-1} aria-label="Learning foundations">
   <div className={styles.sectionHeading}><div><span>// BUILT ON THE BASICS</span><h2>Always a student.</h2></div><p>The foundations behind the things I build.</p></div>
   <div className={styles.learningGrid}>
    <section className={styles.notes} aria-labelledby="about-coursework"><div className={styles.notesHeading}><span className={styles.headingIcon}><BookOpen size={17} aria-hidden="true"/></span><div><span>LEARNING.LOG</span><h3 id="about-coursework">Coursework</h3></div><span className={styles.count}>06</span></div><p className={styles.sectionHint}>Choose a subject to take a closer look.</p>{coursework.map((course, index) => {const Icon=course.icon;return <details className={styles.note} key={course.name} name="about-coursework"><summary><span className={styles.noteIndex}>0{index + 1}</span><Icon size={15} aria-hidden="true"/><span>{course.name}</span><ChevronDown size={14} aria-hidden="true"/></summary><p>{course.note}</p></details>;})}</section>
    <div className={styles.credentials}>
     <section className={styles.notes} aria-labelledby="about-credentials"><div className={styles.notesHeading}><span className={`${styles.headingIcon} ${styles.goldIcon}`}><Award size={17} aria-hidden="true"/></span><div><span>VERIFIED LEARNING</span><h3 id="about-credentials">Credentials</h3></div><span className={styles.count}>02</span></div><p className={styles.sectionHint}>Cisco Networking Academy · September 2024</p>{['Using Computer and Mobile Devices', 'Introduction to IoT'].map(name => <details className={styles.note} key={name} name="about-credentials"><summary><Award size={15} className={styles.certificateIcon} aria-hidden="true"/><span>{name}</span><ChevronDown size={14} aria-hidden="true"/></summary><p>Completed September 2024.<br/>Issued by Cisco Networking Academy.</p></details>)}</section>
     <section className={styles.research} aria-labelledby="about-research"><div className={styles.researchTop}><span className={styles.chapter}>// THEORY → PRACTICE</span><BrainCircuit size={25} aria-hidden="true"/></div><h3 id="about-research">VEC-PRO<span>_</span></h3><p>Multi-Staged Deep Learning Pipeline with Agent-Based Spatiotemporal Mosquito Spread Forecasting</p><span className={styles.researchRole}><i aria-hidden="true"/>Undergraduate thesis · Research team member</span><button className={styles.textAction} onClick={() => navigate('project/vec-pro')}>Explore the project <ArrowUpRight size={15} aria-hidden="true"/></button></section>
    </div>
   </div>
  </div>
  <button className={styles.sidequest} onClick={() => navigate('community')}><span className={styles.sidequestIcon}><Compass size={21} aria-hidden="true"/></span><span><small>// THERE’S MORE TO THE STORY</small><strong>Outside the editor.</strong><span>Meet the person beyond the projects in sidequest.md</span></span><ArrowRight size={19} aria-hidden="true"/></button>
 </div>;
}
