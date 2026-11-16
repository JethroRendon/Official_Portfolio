'use client';
import { useRef, useState, type KeyboardEvent } from 'react';
import { ArrowDown, ArrowUpRight, Award, BookOpen, Braces, Check, ChevronDown, Code2, Copy, FileDown, GraduationCap, MapPin, Terminal, Users } from 'lucide-react';
import type { View } from './Explorer';
import { resumeUrl } from './data';
import styles from './AboutProfile.module.css';

const sections = [
 { id: 'overview', label: 'Overview', icon: Code2 },
 { id: 'education', label: 'Education', icon: GraduationCap },
 { id: 'leadership', label: 'Leadership', icon: Users },
] as const;
type Section = typeof sections[number]['id'];
const profileData: Record<Section, Record<string, string>> = {
 overview: { name: 'Jethro A. Rendon', based_in: 'Anini-y, Antique', focus: 'AI, web & mobile', university: 'WVSU — Main Campus', outside_code: 'Travel, freediving & hiking', style: 'Fashion & personal style', sports: 'Volleyball, basketball & jogging', approach: 'Build with intention' },
 education: { degree: 'BS Computer Science', major: 'Artificial Intelligence', university: 'WVSU — Main Campus', graduation: 'July 2027 (expected)', gwa: '1.26' },
 leadership: { role: 'SK Chairman', organization: 'Barangay Poblacion', location: 'Anini-y, Antique', since: 'October 2023', focus: 'Youth development' },
};
const coursework = [
 { name: 'Data Structures & Algorithms', note: 'The foundations for organizing data, approaching problems, and reasoning about efficient solutions.' },
 { name: 'Database Systems', note: 'How data is structured, connected, and managed to support useful applications.' },
 { name: 'Software Engineering', note: 'The process of taking an idea through planning, implementation, and testing.' },
 { name: 'Artificial Intelligence', note: 'The ideas behind intelligent systems and applications that respond to real problems.' },
 { name: 'Machine Learning', note: 'Learning patterns from data and evaluating how well a model performs.' },
 { name: 'Web Development', note: 'Building responsive interfaces and connecting them with application functionality.' },
];

const introduction = 'Hi, I’m Jethro A. Rendon, a Computer Science student at West Visayas State University, an aspiring developer, and a community leader. I enjoy turning ideas into useful applications and learning how technology can solve everyday problems. Serving as the SK Chairperson of Barangay Poblacion, Anini-y, Antique has taught me to listen, work with different people, and take responsibility for ideas beyond the planning stage.';


export default function AboutProfile({ navigate }: { navigate: (view: View) => void }) {
 const [selected, setSelected] = useState<Section>('overview');
 const [copyState, setCopyState] = useState<'idle' | 'copied' | 'error'>('idle');
 const tabs = useRef<(HTMLButtonElement | null)[]>([]);
 const learning = useRef<HTMLDivElement>(null);
 const copyAttempt = useRef(0);
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
  <header className={styles.heading}><span className={styles.eyebrow}>// THE PERSON BEHIND THE CODE</span><h1>A little about me<span>.</span></h1><p>Curious about technology. Grounded in community.</p></header>
  <section className={styles.profile} aria-label="Explore my profile">
   <div className={styles.profileBar}><span><BookOpen size={14} aria-hidden="true"/>readme / jethro</span><span className={styles.profileHint}>A FEW SIDES OF ME</span></div>
   <div className={styles.tabs} role="tablist" aria-label="About Jethro">{sections.map((section, index) => { const Icon = section.icon; return <button key={section.id} ref={el => { tabs.current[index] = el; }} id={`about-tab-${section.id}`} role="tab" type="button" aria-selected={selected === section.id} aria-controls={`about-panel-${section.id}`} tabIndex={selected === section.id ? 0 : -1} onKeyDown={event => tabKey(event, index)} onClick={() => select(section.id)}><Icon size={14} aria-hidden="true"/>{section.label}</button>; })}</div>
   <div className={styles.profileGrid}>
    <div className={styles.story}>
     {sections.map(section => <div key={section.id} role="tabpanel" id={`about-panel-${section.id}`} aria-labelledby={`about-tab-${section.id}`} hidden={selected !== section.id} tabIndex={0} className={styles.tabPanel}>
      {section.id === 'overview' && <><span className={styles.chapter}>01 / HELLO, WORLD</span><h2>Technology with purpose.<br/><span>People at the center.</span></h2><p>{introduction}</p><span className={styles.location}><MapPin size={12} aria-hidden="true"/>Poblacion, Anini-y, Antique</span><button className={styles.textAction} onClick={() => navigate('skills')}>Explore my toolkit <ArrowUpRight size={15}/></button></>}
      {section.id === 'education' && <><span className={styles.chapter}>02 / ALWAYS LEARNING</span><h2>Computer Science.<br/><span>An AI perspective.</span></h2><p>I’m pursuing a B.S. in Computer Science, major in Artificial Intelligence, at West Visayas State University – Main Campus in Iloilo City. My expected graduation is July 2027, with a current GWA of 1.26.</p><p>My undergraduate thesis, VEC-PRO, combines a multi-stage deep learning pipeline with agent-based spatiotemporal mosquito spread forecasting.</p><span className={styles.location}><GraduationCap size={13} aria-hidden="true"/>WVSU · Iloilo City, Philippines</span><button className={styles.textAction} onClick={exploreLearning}>Explore my learning foundations <ArrowDown size={15}/></button></>}
      {section.id === 'leadership' && <><span className={styles.chapter}>03 / BEYOND THE EDITOR</span><h2>Leadership through service.<br/><span>Community comes first.</span></h2><p>Since October 2023, I have served as Sangguniang Kabataan Chairman of Barangay Poblacion, Anini-y, Antique, leading youth development programs, community events, sports activities, and youth engagement initiatives.</p><p>I coordinate responsibilities and schedules, and work with barangay officials, youth organizations, and community stakeholders to support youth participation.</p><span className={styles.location}><Users size={13} aria-hidden="true"/>Barangay Poblacion · October 2023–present</span><button className={styles.textAction} onClick={() => navigate('experience/sk-chairperson')}>Explore my leadership experience <ArrowUpRight size={15}/></button></>}
     </div>)}
    </div>
    <aside className={styles.codeCard} aria-label="Profile JSON"><div className={styles.codeBar}><span><Braces size={13} aria-hidden="true"/>profile.json</span><button type="button" aria-label="Copy profile JSON" onClick={copyProfile} title="Copy profile JSON">{copyState === 'copied' ? <Check size={14}/> : <Copy size={14}/>}</button></div><div className={styles.codeBody}><p className={styles.codeComment}>// {selected === 'overview' ? 'a quick introduction' : selected === 'education' ? 'learning.config' : 'community.config'}</p><div className={styles.codeLine}><span aria-hidden="true">1</span><code>{'{'}</code></div>{entries.map(([key, value], index) => <div className={styles.codeLine} key={key}><span aria-hidden="true">{index + 2}</span><code className={styles.indent}><span className={styles.jsonKey}>"{key}"</span>: <span className={styles.jsonString}>"{value}"</span>{index < entries.length - 1 ? ',' : ''}</code></div>)}<div className={styles.codeLine}><span aria-hidden="true">{entries.length + 2}</span><code>{'}'}</code></div></div><div className={styles.codeFooter}><span><i aria-hidden="true"/>{selected}.profile</span><span>JSON · UTF-8</span></div><p className={styles.copyStatus} role="status" aria-live="polite">{copyState === 'copied' ? 'Profile JSON copied.' : copyState === 'error' ? 'Copy is unavailable. You can select the JSON text instead.' : 'Select a tab to explore another side.'}</p></aside>
   </div>
   <div className={styles.profileFooter}><span><Terminal size={13} aria-hidden="true"/>Code with purpose. Build with intention.</span><a href={resumeUrl} download><FileDown size={14}/>Download résumé<ArrowUpRight size={13}/></a></div>
  </section>

  <div className={styles.learning} ref={learning} tabIndex={-1} aria-label="Learning foundations">
   <div className={styles.sectionHeading}><span>// FOUNDATIONS & CREDENTIALS</span><p>A closer look at what I’m learning.</p></div>
   <div className={styles.learningGrid}>
    <section className={styles.notes} aria-labelledby="about-coursework"><div className={styles.notesHeading}><BookOpen size={16} aria-hidden="true"/><h2 id="about-coursework">Coursework</h2><span>06</span></div><p className={styles.sectionHint}>Open a subject to read the foundation behind it.</p>{coursework.map((course, index) => <details className={styles.note} key={course.name}><summary><span className={styles.noteIndex}>0{index + 1}</span><span>{course.name}</span><ChevronDown size={13} aria-hidden="true"/></summary><p>{course.note}</p></details>)}</section>
    <div className={styles.credentials}>
     <section className={styles.notes} aria-labelledby="about-credentials"><div className={styles.notesHeading}><Award size={16} aria-hidden="true"/><h2 id="about-credentials">Credentials</h2><span>02</span></div><p className={styles.sectionHint}>Cisco Networking Academy · September 2024</p>{['Using Computer and Mobile Devices', 'Introduction to IoT'].map(name => <details className={styles.note} key={name}><summary><Award size={14} className={styles.certificateIcon} aria-hidden="true"/><span>{name}</span><ChevronDown size={13} aria-hidden="true"/></summary><p>Completed September 2024.<br/>Issued by Cisco Networking Academy.</p></details>)}</section>
     <section className={styles.research} aria-labelledby="about-research"><span className={styles.chapter}>// RESEARCH IN PRACTICE</span><h2 id="about-research">VEC-PRO<ArrowUpRight size={20} aria-hidden="true"/></h2><p>Multi-Staged Deep Learning Pipeline with Agent-Based Spatiotemporal Mosquito Spread Forecasting</p><span className={styles.researchRole}>Undergraduate thesis · Research team member</span><button className={styles.textAction} onClick={() => navigate('project/vec-pro')}>Explore the project <ArrowUpRight size={15}/></button></section>
    </div>
   </div>
  </div>
 </div>;
}
