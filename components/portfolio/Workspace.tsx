'use client';
import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, Code2, Search, X } from 'lucide-react';
import Explorer, { fileName, resolveView, type View } from './Explorer';
import { projects, experiences } from './data';
import AboutProfile from './AboutProfile';
import ExperienceProfile from './ExperienceProfile';
import PersonalInterests from './PersonalInterests';
import Toolkit from './Toolkit';
import Contact from './Contact';
import ProjectPreview from './ProjectPreview';
import ProjectGallery from './ProjectGallery';
import showcaseStyles from './ProjectShowcase.module.css';
import HomeHero from './HomeHero';
const validViews = ['home','about','skills','community','contact','projects',...projects.map(p=>`project/${p.id}`),...experiences.map(x=>`experience/${x.id}`)];
const readView = (): View => resolveView(decodeURIComponent(window.location.hash.slice(1)));
export default function Workspace() {
 const [view,setView] = useState<View>('home'), [command,setCommand] = useState(false), [search,setSearch] = useState(''), [demo,setDemo] = useState<string|null>(null);
 const [demoSlide,setDemoSlide] = useState(0);
 const main = useRef<HTMLElement>(null); const searchRef = useRef<HTMLInputElement>(null); const triggerRef = useRef<HTMLElement|null>(null); const dialogRef = useRef<HTMLDivElement>(null);
 function focusProject(id: string) {
  const card = document.getElementById(`project-card-${id}`);
  card?.focus({preventScroll:true});
  card?.scrollIntoView({block:'center',behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
 }
 function navigate(target: View) {
  const next = resolveView(target);
  setView(next);setCommand(false);setDemo(null);
  if(window.location.hash !== `#${next}`) window.history.pushState({},'',`#${next}`);
  window.scrollTo({top:0,behavior:'instant'});
  requestAnimationFrame(()=>{main.current?.focus({preventScroll:true});if(target.startsWith('project/'))focusProject(target.split('/')[1]);});
 }
 useEffect(()=> {
  const handler=()=>{setView(readView());setDemo(null);const target=decodeURIComponent(window.location.hash.slice(1));if(target.startsWith('project/'))requestAnimationFrame(()=>focusProject(target.split('/')[1]));};
  handler();window.addEventListener('popstate',handler);window.addEventListener('hashchange',handler);
  return ()=>{window.removeEventListener('popstate',handler);window.removeEventListener('hashchange',handler);};
 },[]);
 useEffect(()=>{function key(e: KeyboardEvent){if((e.metaKey||e.ctrlKey)&&e.key==='k'){e.preventDefault();triggerRef.current=document.activeElement as HTMLElement;setCommand(s=>!s);setSearch('');}if(e.key==='Escape'){setCommand(false);setDemo(null);triggerRef.current?.focus();}}window.addEventListener('keydown',key);return()=>window.removeEventListener('keydown',key);},[]);
 useEffect(()=>{if(command) setTimeout(()=>searchRef.current?.focus(),30);},[command]);
 useEffect(()=>{if(demo) dialogRef.current?.focus(); if(command||demo){const old=document.body.style.overflow;document.body.style.overflow='hidden';return()=>{document.body.style.overflow=old;};}},[command,demo]);
 function trap(e: React.KeyboardEvent<HTMLElement>) {if(e.key!=='Tab')return;const el=e.currentTarget;const items=Array.from(el.querySelectorAll<HTMLElement>('button:not(:disabled),a[href],input,textarea,[tabindex="0"]'));const first=items[0],last=items.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus();}}
 const selectedExperience=experiences.find(x=>view===`experience/${x.id}`);
 const title=view==='about'?'A little about me.':view==='skills'?'The tools behind the ideas.':view==='community'?'Beyond the code.':view==='contact'?'Let’s build something.':selectedExperience?.name||'';
 return <div className="workspace"><a className="skip-link" href="#main-content" onClick={e=>{e.preventDefault();main.current?.focus();main.current?.scrollIntoView();}}>Skip to content</a><Explorer view={view} navigate={navigate} onSearch={()=>{triggerRef.current=document.activeElement as HTMLElement;setCommand(true);setSearch('');}}/><main id="main-content" ref={main} tabIndex={-1} className="main-content">
 {view==='home'?<><HomeHero navigate={navigate}/><section className="home-introduction content-width" id="introduction"><div className="intro-grid"><h2>Thoughtful code.<br/><span className="muted">Meaningful experiences.</span></h2><div><p>I’m Jethro A. Rendon, a Computer Science student majoring in Artificial Intelligence at West Visayas State University. I build web and mobile applications and serve as SK Chairman of Barangay Poblacion, Anini-y, Antique.</p><button className="text-link" onClick={()=>navigate('about')}>Read the story <ArrowUpRight size={17}/></button></div></div><div className="section-divider" id="selected-work"><span>SELECTED WORK</span><button className={showcaseStyles.browseAll} onClick={()=>navigate('projects')}>View all projects<ArrowUpRight size={13} aria-hidden="true"/></button></div><ProjectGallery heading={false} onPreview={(id,trigger,index)=>{triggerRef.current=trigger;setDemoSlide(index);setDemo(id);}}/><div className="home-contact"><p>Have something in mind?</p><button onClick={()=>navigate('contact')}>Let’s talk.<ArrowUpRight/></button></div><footer><span>Built with care. Always a work in progress.</span><button onClick={()=>window.scrollTo({top:0,behavior:'smooth'})}>Back to top ↑</button></footer></section></>:
 <div className="editor-page" key={view}><div className="editor-bar"><span><Code2 size={15}/>{view.startsWith('project/')?'projects / ':view.startsWith('experience/')?'experience / ':''}{fileName(view)}</span><button className="icon-button" onClick={()=>navigate('home')} aria-label="Close file and return home"><X size={15}/></button></div><article className="content-width page-content"><button className="back-link" onClick={()=>navigate('home')}><ArrowLeft size={14}/> Back to workspace</button>{view!=='skills'&&view!=='about'&&view!=='contact'&&view!=='projects'&&!selectedExperience&&<header className="page-heading"><h1>{title}</h1><span className="heading-rule"/></header>}
 {view==='about'&&<AboutProfile navigate={navigate}/>}
 {view==='skills'&&<Toolkit/>}
 {view==='projects'&&<ProjectGallery onPreview={(id,trigger,index)=>{triggerRef.current=trigger;setDemoSlide(index);setDemo(id);}}/>}
 {selectedExperience&&<ExperienceProfile selectedId={selectedExperience.id}/>}
 {view==='community'&&<><PersonalInterests/><div className="section-divider"><span>COMMUNITY & SERVICE</span></div><p className="lead">Working with people.<br/><span className="muted">Building for communities.</span></p><div className="behind-grid"><div><span className="eyebrow">BARANGAY POBLACION · ANINI-Y, ANTIQUE</span><h2>Youth leadership in practice.</h2><p className="muted">Since October 2023, I have served as Sangguniang Kabataan Chairman, leading youth development programs, community events, sports activities, and youth engagement initiatives.</p><button className="text-link" onClick={()=>navigate('experience/sk-chairperson')}>View leadership experience <ArrowUpRight size={16}/></button></div><div className="code-note"><code><span className="purple">const</span> strengths = [<br/>　<span className="green">"leadership"</span>,<br/>　<span className="green">"team management"</span>,<br/>　<span className="green">"communication"</span>,<br/>　<span className="green">"collaboration"</span>,<br/>　<span className="green">"problem-solving"</span><br/>];</code></div></div><div className="section-divider"><span>HOW I CONTRIBUTE</span></div><div className="philosophy"><span>01</span><div><h2>Coordinate and collaborate.</h2><p>I coordinate responsibilities and project schedules, working with barangay officials, youth organizations, and community stakeholders.</p></div><span>02</span><div><h2>Support youth participation.</h2><p>I help plan and implement programs that encourage young people to take part in community activities.</p></div><span>03</span><div><h2>Bring skills across disciplines.</h2><p>My work brings together software development, AI integration, research, and community leadership. I coordinate responsibilities and collaborate with others to turn plans into useful outcomes.</p></div></div></>}
 {view==='contact'&&<Contact/>}
 <footer className="page-footer"><span>jethro / {fileName(view)}</span><span className="green">UTF-8 <span className="muted">·</span> built with care</span></footer></article></div>}
 </main>
 {command&&<div className="modal-shade" onClick={()=>{setCommand(false);triggerRef.current?.focus();}}><div className="command-dialog" role="dialog" aria-modal="true" aria-label="Go to file" onKeyDown={trap} onClick={e=>e.stopPropagation()}><div className="command-search"><Search size={18}/><input ref={searchRef} placeholder="Go to file…" value={search} onChange={e=>setSearch(e.target.value)}/><button className="icon-button" aria-label="Close search" onClick={()=>{setCommand(false);triggerRef.current?.focus();}}><X size={16}/></button></div><div className="command-results">{validViews.filter(v=>fileName(v as View).toLowerCase().includes(search.toLowerCase())).map(v=><button key={v} onClick={()=>navigate(v as View)}><Code2 size={16}/>{fileName(v as View)}<span>{v.split('/')[0]}</span><ArrowRight size={14}/></button>)}{!validViews.some(v=>fileName(v as View).toLowerCase().includes(search.toLowerCase()))&&<p className="muted">No matching files.</p>}</div><p className="command-foot">Select a file to open <span>esc to close</span></p></div></div>}
 {demo&&<div className="modal-shade" onClick={()=>{setDemo(null);triggerRef.current?.focus();}}><div className="demo-dialog" role="dialog" aria-modal="true" aria-label={`${projects.find(p=>p.id===demo)?.name} screenshot gallery`} tabIndex={-1} ref={dialogRef} onKeyDown={trap} onClick={e=>e.stopPropagation()}><div className="demo-dialog-header"><span><span className="online-dot"/> Project screenshots</span><button className="icon-button" aria-label="Close demo" onClick={()=>{setDemo(null);triggerRef.current?.focus();}}><X size={20}/></button></div><ProjectPreview key={demo} id={demo} initialIndex={demoSlide} interactive/><p className="demo-hint">Use the arrows, dots, or swipe to browse. Press Escape to close. Groupify images show the mobile prototype from the project document.</p></div></div>}
 </div>;
}
