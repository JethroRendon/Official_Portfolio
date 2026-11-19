'use client';
import { useRef, useState } from 'react';
import { ArrowRight, ArrowUpRight, Award, BookOpen, Check, ChevronDown, Code2, Compass, Copy, FileText, GraduationCap, MapPin, MessageCircle, Users, X } from 'lucide-react';
import type { View } from './Explorer';
import { resumeUrl } from './data';
import styles from './AboutProfile.module.css';

const profile = { name: 'Jethro A. Rendon', focus: 'AI, web & mobile', university: 'WVSU — Main Campus', approach: 'Build with intention' };
const cards = [
 { id: 'developer', number: '01', title: 'the developer', description: 'Turning ideas into useful web and mobile applications. Curious about AI, thoughtful interfaces, and everyday problems.', tags: ['AI','WEB & MOBILE','PROBLEM-SOLVING'] },
 { id: 'student', number: '02', title: 'the student', description: 'Studying Computer Science at West Visayas State University, with a focus on Artificial Intelligence. Always learning by building.', tags: ['COMPUTER SCIENCE','ARTIFICIAL INTELLIGENCE','WVSU'] },
 { id: 'leader', number: '03', title: 'the leader', description: 'Serving the youth of Barangay Poblacion. Listening, working with people, and taking ideas beyond the planning stage.', tags: ['COMMUNITY','COLLABORATION','YOUTH DEVELOPMENT'] },
] as const;
type Story = typeof cards[number]['id'];
const coursework = [
 { name: 'Data Structures & Algorithms', note: 'The foundations for organizing data, approaching problems, and reasoning about efficient solutions.' },
 { name: 'Database Systems', note: 'How data is structured, connected, and managed to support useful applications.' },
 { name: 'Software Engineering', note: 'The process of taking an idea through planning, implementation, and testing.' },
 { name: 'Artificial Intelligence', note: 'The ideas behind intelligent systems and applications that respond to real problems.' },
 { name: 'Machine Learning', note: 'Learning patterns from data and evaluating how well a model performs.' },
 { name: 'Web Development', note: 'Building responsive interfaces and connecting them with application functionality.' },
];

function CardSketch({ story }: { story: Story }) {
 return <svg viewBox="0 0 280 128" fill="none" aria-hidden="true">
  {story==='developer'?<><path d="m53 35-23 25 23 25m173-50 23 25-23 25M162 22l-36 77"/><path className={styles.fineLine} d="M82 43h27m-27 17h18m70 0h27m-27 17h17"/><text x="70" y="120">ideas → useful applications</text></>:story==='student'?<><path d="M13 84c47 7 74-18 67-46-5-24-34-21-34-1 0 45 81 43 79 6-1-29-38-32-41-8-4 39 89 39 84-2-3-25-39-28-42-5-4 38 111 45 119-17"/><path className={styles.fineLine} d="m19 77-7 7 9 8"/><text x="62" y="120">learn · build · repeat</text></>:<><circle cx="53" cy="43" r="15"/><circle cx="140" cy="32" r="18"/><circle cx="226" cy="43" r="15"/><path d="M25 90c0-32 56-32 56 0m25-7c0-38 68-38 68 0m24 7c0-32 56-32 56 0"/><path className={styles.fineLine} d="m85 40 30-4m50 0 36 5M81 95c40 18 78 18 118 0"/><text x="65" y="123">listen · collaborate · act</text></>}
 </svg>;
}

export default function AboutProfile({ navigate }: { navigate: (view: View) => void }) {
 const [selected, setSelected] = useState<Story|null>(null);
 const [copyState, setCopyState] = useState<'idle'|'copied'|'error'>('idle');
 const panel = useRef<HTMLElement>(null);
 const buttons = useRef<Record<Story,HTMLButtonElement|null>>({developer:null,student:null,leader:null});
 function openStory(story: Story) {
  setSelected(story); setCopyState('idle');
  requestAnimationFrame(()=>{panel.current?.focus({preventScroll:true});panel.current?.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});});
 }
 function closeStory() { const previous=selected;setSelected(null);if(previous)requestAnimationFrame(()=>{const card=buttons.current[previous];card?.focus({preventScroll:true});card?.scrollIntoView({behavior:'instant',block:'center',inline:'center'});}); }
 async function copyProfile() {
  try { await navigator.clipboard.writeText(JSON.stringify(profile,null,2));setCopyState('copied'); }
  catch { setCopyState('error'); }
 }
 return <div className={styles.about}>
  <div className={styles.topline}><a href={resumeUrl} target="_blank" rel="noreferrer">view résumé<ArrowUpRight size={14} aria-hidden="true"/><span className={styles.srOnly}> (opens in a new tab)</span></a></div>
g  <div className={styles.deck} role="group" aria-label="Three sides of Jethro. Select a card to read more.">
   {cards.map(card=><button key={card.id} ref={el=>{buttons.current[card.id]=el;}} className={`${styles.card} ${styles[card.id]}`} onClick={()=>openStory(card.id)} aria-expanded={selected===card.id} aria-controls="about-story" aria-label={`Read about Jethro as ${card.id==='student'?'a student':card.id==='leader'?'a community leader':'a developer'}`}>
    <span className={styles.cardTop}><span>{card.number} / ABOUT</span><ArrowUpRight size={19} strokeWidth={1.5} aria-hidden="true"/></span>
    <span className={styles.sketch}><CardSketch story={card.id}/></span>
    <span className={styles.cardTitle}>{card.title}<sup>{card.number}</sup></span>
    <span className={styles.description}>{card.description}</span>
    <span className={styles.tags}>{card.tags.map(tag=><span key={tag}>{tag}</span>)}</span>
   </button>)}
  </div>
  <header className={styles.heading}><p className={styles.instruction}><span className={styles.desktopHint}>HOVER TO EXPLORE</span><span className={styles.mobileHint}>SWIPE TO EXPLORE</span><span aria-hidden="true">·</span>SELECT A CARD TO READ</p><h1>the person behind the code.</h1><p>Student, aspiring developer, and community leader.<br/>Three parts of the same story.</p></header>

  <section className={styles.detail} id="about-story" ref={panel} tabIndex={-1} hidden={!selected} aria-label={selected?`About Jethro: ${selected}`:'About details'}>
   {selected&&<><div className={styles.detailBar}><span><BookOpen size={14} aria-hidden="true"/>readme / {selected}</span><button onClick={closeStory} aria-label="Close story"><X size={17} aria-hidden="true"/></button></div><div className={styles.detailBody}>
    {selected==='developer'&&<><div className={styles.storyGrid}><div><span className={styles.chapter}>01 / HELLO, WORLD</span><h2>Hi, I’m Jethro.</h2><p>Hi, I’m Jethro A. Rendon, a Computer Science student at West Visayas State University, an aspiring developer, and a community leader. I enjoy turning ideas into useful applications and learning how technology can solve everyday problems.</p><p>Serving as the SK Chairperson of Barangay Poblacion, Anini-y, Antique has taught me to listen, work with different people, and take responsibility for ideas beyond the planning stage.</p><span className={styles.location}><MapPin size={13} aria-hidden="true"/>Poblacion, Anini-y, Antique</span></div><aside className={styles.codeCard} aria-label="Profile JSON"><div className={styles.codeBar}><span><Code2 size={13} aria-hidden="true"/>profile.json</span><button onClick={copyProfile} aria-label="Copy profile JSON">{copyState==='copied'?<Check size={14}/>:<Copy size={14}/>}</button></div><pre><code>{JSON.stringify(profile,null,2)}</code></pre><p className={styles.copyStatus} role="status" aria-live="polite">{copyState==='copied'?'Profile JSON copied.':copyState==='error'?'Copy is unavailable. You can select the text instead.':'Code with purpose. Build with intention.'}</p></aside></div><div className={styles.actions}><button onClick={()=>navigate('skills')}><Code2 size={14} aria-hidden="true"/>Explore toolkit<ArrowUpRight size={13} aria-hidden="true"/></button><button onClick={()=>navigate('contact')}><MessageCircle size={14} aria-hidden="true"/>Let’s talk</button></div></>}
    {selected==='student'&&<><span className={styles.chapter}>02 / ALWAYS LEARNING</span><h2>Computer Science.<br/><span>An AI perspective.</span></h2><p>I’m pursuing a B.S. in Computer Science, major in Artificial Intelligence, at West Visayas State University – Main Campus in Iloilo City. My expected graduation is July 2027, with a current GWA of 1.26.</p><div className={styles.learningGrid}><div><h3><GraduationCap size={17} aria-hidden="true"/>Coursework</h3><p className={styles.hint}>Open a subject to explore the foundation behind it.</p>{coursework.map(course=><details className={styles.note} key={course.name} name="about-coursework"><summary>{course.name}<ChevronDown size={13} aria-hidden="true"/></summary><p>{course.note}</p></details>)}</div><div><h3><Award size={17} aria-hidden="true"/>Credentials</h3><p className={styles.hint}>Cisco Networking Academy · September 2024</p>{['Using Computer and Mobile Devices','Introduction to IoT'].map(name=><details className={styles.note} key={name} name="about-credentials"><summary>{name}<ChevronDown size={13} aria-hidden="true"/></summary><p>Completed September 2024.<br/>Issued by Cisco Networking Academy.</p></details>)}</div></div><div className={styles.actions}><a href={resumeUrl} target="_blank" rel="noreferrer"><FileText size={14} aria-hidden="true"/>Preview résumé<ArrowUpRight size={13} aria-hidden="true"/><span className={styles.srOnly}> (opens in a new tab)</span></a></div></>}
    {selected==='leader'&&<><span className={styles.chapter}>03 / LEADERSHIP THROUGH SERVICE</span><h2>Listen. Collaborate.<br/><span>Turn plans into action.</span></h2><p>Since October 2023, I have served as Sangguniang Kabataan Chairman of Barangay Poblacion, Anini-y, Antique, leading youth development programs, community events, sports activities, and youth engagement initiatives.</p><p>I coordinate responsibilities and schedules, and work with barangay officials, youth organizations, and community stakeholders to support youth participation.</p><span className={styles.location}><Users size={14} aria-hidden="true"/>Barangay Poblacion · October 2023–present</span><div className={styles.actions}><button onClick={()=>navigate('experience/sk-chairperson')}><Users size={14} aria-hidden="true"/>View experience<ArrowUpRight size={13} aria-hidden="true"/></button></div></>}
   </div></>}
  </section>
  <div className={styles.sidequest}><span><Compass size={17} aria-hidden="true"/>There’s more outside the editor.</span><button onClick={()=>navigate('community')}>open sidequest.md<ArrowRight size={17} aria-hidden="true"/></button></div>
 </div>;
}
