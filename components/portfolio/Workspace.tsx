'use client';
import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, Code2, Search, X } from 'lucide-react';
import Explorer, { fileName, resolveView, type View } from './Explorer';
import { projects, experiences } from './data';
import AboutProfile from './AboutProfile';
import ExperienceProfile from './ExperienceProfile';
import SidequestSnapshots from './SidequestSnapshots';
import Toolkit from './Toolkit';
import Contact from './Contact';
import ProjectPreview from './ProjectPreview';
import ProjectGallery from './ProjectGallery';
import showcaseStyles from './ProjectShowcase.module.css';
import HomeHero from './HomeHero';
import PortfolioFooter from './PortfolioFooter';
import useScrollLock from './useScrollLock';
const validViews = ['home','about','skills','community','contact','projects',...projects.map(p=>`project/${p.id}`),...experiences.map(x=>`experience/${x.id}`)];
const readHash = () => { try { return decodeURIComponent(window.location.hash.slice(1)); } catch { return 'home'; } };
const readView = (): View => resolveView(readHash());
export default function Workspace() {
 const [view,setView] = useState<View>('home'), [command,setCommand] = useState(false), [search,setSearch] = useState(''), [demo,setDemo] = useState<string|null>(null);
 const [demoSlide,setDemoSlide] = useState(0);
 const main = useRef<HTMLElement>(null); const searchRef = useRef<HTMLInputElement>(null); const triggerRef = useRef<HTMLElement|null>(null); const dialogRef = useRef<HTMLDivElement>(null);
 function closeOverlay() {
  setCommand(false); setDemo(null);
  requestAnimationFrame(()=>{const previous=triggerRef.current;const menu=document.querySelector<HTMLButtonElement>('button[aria-label="Open portfolio menu"]');if(previous?.getClientRects().length&&!previous.closest('[inert]'))previous.focus({preventScroll:true});else if(menu?.getClientRects().length)menu.focus({preventScroll:true});else main.current?.focus({preventScroll:true});});
 }
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
  const handler=()=>{setView(readView());setDemo(null);const target=readHash();if(target.startsWith('project/'))requestAnimationFrame(()=>focusProject(target.split('/')[1]));};
  handler();window.addEventListener('popstate',handler);window.addEventListener('hashchange',handler);
  return ()=>{window.removeEventListener('popstate',handler);window.removeEventListener('hashchange',handler);};
 },[]);
 useEffect(()=>{function key(e: KeyboardEvent){if((e.metaKey||e.ctrlKey)&&e.key==='k'){e.preventDefault();triggerRef.current=document.activeElement as HTMLElement;setCommand(s=>!s);setSearch('');}if(e.key==='Escape'){closeOverlay();}}window.addEventListener('keydown',key);return()=>window.removeEventListener('keydown',key);},[]);
 useEffect(()=>{window.dispatchEvent(new Event('portfolio:pagechange'));},[view]);
 useEffect(()=>{if(!command)return;const frame=requestAnimationFrame(()=>searchRef.current?.focus());return()=>cancelAnimationFrame(frame);},[command]);
 useScrollLock(command || Boolean(demo));
 useEffect(()=>{if(demo)dialogRef.current?.focus();if(!command&&!demo)return;const content=main.current;const wasInert=content?.inert??false;if(content)content.inert=true;return()=>{if(content)content.inert=wasInert;};},[command,demo]);
 function trap(e: React.KeyboardEvent<HTMLElement>) {if(e.key!=='Tab')return;const el=e.currentTarget;const items=Array.from(el.querySelectorAll<HTMLElement>('button:not(:disabled),a[href],input,textarea,[tabindex="0"]'));const first=items[0],last=items.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus();}}
 const selectedExperience=experiences.find(x=>view===`experience/${x.id}`);
 const title=view==='about'?'A little about me.':view==='skills'?'The tools behind the ideas.':view==='community'?'Beyond the code.':view==='contact'?'Let’s build something.':selectedExperience?.name||'';
 return <div className="workspace"><a className="skip-link" href="#main-content" onClick={e=>{e.preventDefault();main.current?.focus();main.current?.scrollIntoView();}}>Skip to content</a><Explorer view={view} navigate={navigate} onSearch={()=>{triggerRef.current=document.activeElement as HTMLElement;setCommand(true);setSearch('');}}/><main id="main-content" ref={main} tabIndex={-1} className="main-content">
 {view==='home'?<><HomeHero navigate={navigate}/><section className="home-work content-width" id="introduction"><div className="section-divider" id="selected-work"><span>SELECTED WORK</span><button className={showcaseStyles.browseAll} onClick={()=>navigate('projects')}>View all projects<ArrowUpRight size={13} aria-hidden="true"/></button></div><ProjectGallery heading={false} onPreview={(id,trigger,index)=>{triggerRef.current=trigger;setDemoSlide(index);setDemo(id);}}/><PortfolioFooter navigate={navigate}/></section></>:
 <div className="editor-page" key={view}><div className="editor-bar"><span><Code2 size={15}/>{view.startsWith('project/')?'projects / ':view.startsWith('experience/')?'experience / ':''}{fileName(view)}</span><button className="icon-button" onClick={()=>navigate('home')} aria-label="Close file and return home"><X size={15}/></button></div><article className="content-width page-content"><button className="back-link" onClick={()=>navigate('home')}><ArrowLeft size={14}/> Back to workspace</button>{view!=='skills'&&view!=='about'&&view!=='contact'&&view!=='community'&&view!=='projects'&&!selectedExperience&&<header className="page-heading"><h1>{title}</h1><span className="heading-rule"/></header>}
 {view==='about'&&<AboutProfile navigate={navigate}/>}
 {view==='skills'&&<Toolkit/>}
 {view==='projects'&&<ProjectGallery onPreview={(id,trigger,index)=>{triggerRef.current=trigger;setDemoSlide(index);setDemo(id);}}/>}
 {selectedExperience&&<ExperienceProfile selectedId={selectedExperience.id}/>}
 {view==='community'&&<SidequestSnapshots/>}
 {view==='contact'&&<Contact/>}
 {view!=='community'&&<PortfolioFooter navigate={navigate} compact/>}</article></div>}
 </main>
 {command&&<div className="modal-shade" onClick={closeOverlay}><div className="command-dialog" role="dialog" aria-modal="true" aria-label="Go to file" onKeyDown={trap} onClick={e=>e.stopPropagation()}><div className="command-search"><Search size={18}/><input ref={searchRef} placeholder="Go to file…" value={search} autoComplete="off" enterKeyHint="go" onKeyDown={e=>{if(e.key==='Enter'){const match=validViews.find(v=>fileName(v as View).toLowerCase().includes(search.toLowerCase()));if(match){e.preventDefault();navigate(match as View);}}}} onChange={e=>setSearch(e.target.value)}/><button className="icon-button" aria-label="Close search" onClick={closeOverlay}><X size={16}/></button></div><div className="command-results">{validViews.filter(v=>fileName(v as View).toLowerCase().includes(search.toLowerCase())).map(v=><button key={v} onClick={()=>navigate(v as View)}><Code2 size={16}/>{fileName(v as View)}<span>{v.split('/')[0]}</span><ArrowRight size={14}/></button>)}{!validViews.some(v=>fileName(v as View).toLowerCase().includes(search.toLowerCase()))&&<p className="muted">No matching files.</p>}</div><p className="command-foot">Select a file to open <span>esc to close</span></p></div></div>}
 {demo&&<div className="modal-shade" onClick={closeOverlay}><div className="demo-dialog" role="dialog" aria-modal="true" aria-label={`${projects.find(p=>p.id===demo)?.name} screenshot gallery`} tabIndex={-1} ref={dialogRef} onKeyDown={trap} onClick={e=>e.stopPropagation()}><div className="demo-dialog-header"><span><span className="online-dot"/> Project screenshots</span><button className="icon-button" aria-label="Close demo" onClick={closeOverlay}><X size={20}/></button></div><ProjectPreview key={demo} id={demo} initialIndex={demoSlide} interactive/><p className="demo-hint">Use the arrows, dots, or swipe to browse. Press Escape to close. Groupify images show the mobile prototype from the project document.</p></div></div>}
 </div>;
}
