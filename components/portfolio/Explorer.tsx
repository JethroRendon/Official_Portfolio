'use client';
import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { ChevronDown, ChevronRight, File, Folder, Atom, Braces, Diamond, Menu, Search, X } from 'lucide-react';
import { projects, experiences } from './data';
import styles from './Explorer.module.css';
import ThemeToggle from './ThemeToggle';

export type View = 'home' | 'about' | 'skills' | 'community' | 'contact' | 'projects' | `project/${string}` | `experience/${string}`;
export function resolveView(value: string): View {
 if (projects.some(project => value === `project/${project.id}`)) return 'projects';
 if (['home','about','skills','community','contact','projects'].includes(value) || experiences.some(entry => value === `experience/${entry.id}`)) return value as View;
 return 'home';
}
export const fileName = (view: View) => view === 'home' ? 'home.jsx' : view === 'about' ? 'about.md' : view === 'skills' ? 'toolkit.jsx' : view === 'community' ? 'sidequest.md' : view === 'contact' ? 'contact.json' : view === 'projects' ? 'gallery.tsx' : view.startsWith('project/') ? projects.find(x => x.id === view.split('/')[1])?.file || 'projects' : experiences.find(x=>x.id===view.split('/')[1])?.file || 'experience.ts';
const cx = (...classes: (string | false | undefined)[]) => classes.filter(Boolean).map(name => styles[name as string]).join(' ');

export default function Explorer({ view, navigate, onSearch }: { view: View; navigate: (v: View) => void; onSearch: () => void }) {
 const [folders, setFolders] = useState<Record<string, boolean>>({ skills: true, projects: true, experience: true, 'behind-the-code': true });
 const [mobileOpen, setMobileOpen] = useState(false);
 const [isMobile, setIsMobile] = useState(false);
 const menuButton = useRef<HTMLButtonElement>(null);
 const closeButton = useRef<HTMLButtonElement>(null);
 const sidebar = useRef<HTMLElement>(null);

 useEffect(() => {
  const query = window.matchMedia('(max-width: 760px)');
  const update = () => { setIsMobile(query.matches); if (!query.matches) setMobileOpen(false); };
  update();
  query.addEventListener('change', update);
  return () => query.removeEventListener('change', update);
 }, []);

 useEffect(() => {
  if (!mobileOpen || !isMobile) return;
  const main = document.getElementById('main-content');
  const previousInert = main?.inert || false;
  const previousOverflow = document.body.style.overflow;
  document.body.style.overflow = 'hidden';
  if (main) main.inert = true;
  const frame = requestAnimationFrame(() => closeButton.current?.focus());
  return () => {
   cancelAnimationFrame(frame);
   document.body.style.overflow = previousOverflow;
   if (main) main.inert = previousInert;
  };
 }, [mobileOpen, isMobile]);

 function closeMenu(restoreFocus = true) {
  setMobileOpen(false);
  if (restoreFocus) requestAnimationFrame(() => menuButton.current?.focus());
 }
 function openFile(target: View) { closeMenu(false); navigate(target); }
 function searchFiles() { closeMenu(); onSearch(); }
 function trapMenu(event: KeyboardEvent<HTMLElement>) {
  if (!isMobile || !mobileOpen) return;
  if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); closeMenu(); return; }
  if (event.key !== 'Tab') return;
  const elements = Array.from(sidebar.current?.querySelectorAll<HTMLElement>('button,a[href]') || []).filter(element => !element.closest('[inert]') && element.getClientRects().length > 0);
  const first = elements[0], last = elements.at(-1);
  if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
  else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
 }
 function item(label: string, target: View, type: string, nested = false) {
  const selected = view === target;
  return <button key={target} className={cx('file', nested && 'nested', selected && 'selected', selected && view === 'home' && 'home')} onClick={() => openFile(target)} aria-current={selected ? 'page' : undefined} title={`Open ${label}`}>
   <span className={cx('typeIcon', type)} aria-hidden="true">{type === 'react' ? <Atom/> : type === 'json' ? <Braces/> : <Diamond/>}</span>
   <File className={cx('fileIcon', type)} fill="currentColor" strokeWidth={1} aria-hidden="true"/>
   <span>{label}</span><span className={styles.dot} aria-hidden="true"/>
  </button>;
 }
 function folder(name: string, content: React.ReactNode) {
  return <div key={name}>
   <button className={styles.folder} aria-expanded={folders[name]} aria-controls={`folder-${name}`} onClick={() => setFolders(s => ({ ...s, [name]: !s[name] }))}>
    {folders[name] ? <ChevronDown className={styles.chevron} aria-hidden="true"/> : <ChevronRight className={styles.chevron} aria-hidden="true"/>}
    <Folder className={styles.folderIcon} fill="currentColor" strokeWidth={1} aria-hidden="true"/><span>{name}</span>
   </button>
   <div id={`folder-${name}`} inert={!folders[name]} aria-hidden={!folders[name]} className={cx('groupContent', folders[name] && 'expanded')}><div className={styles.groupInner}>{content}</div></div>
  </div>;
 }
 return <><header className={styles.mobileBar} aria-label="Mobile navigation" inert={isMobile && mobileOpen}><button ref={menuButton} className={styles.menuButton} type="button" aria-label="Open portfolio menu" aria-expanded={mobileOpen} aria-controls="portfolio-explorer" onClick={() => setMobileOpen(true)}><Menu size={21}/></button><a href="#home" className={styles.mobileIdentity} onClick={event => { event.preventDefault(); openFile('home'); }}>Jethro Rendon</a><span className={styles.mobileFile}>{fileName(view)}</span></header><div className={styles.mobileSpacer} aria-hidden="true"/>
  {mobileOpen && isMobile && <button type="button" className={styles.backdrop} aria-label="Close portfolio menu" tabIndex={-1} onClick={() => closeMenu()}/>}
  <aside ref={sidebar} id="portfolio-explorer" className={styles.sidebar} data-open={mobileOpen} role={isMobile ? 'dialog' : undefined} aria-modal={isMobile && mobileOpen ? true : undefined} aria-hidden={isMobile && !mobileOpen ? true : undefined} inert={isMobile && !mobileOpen} aria-label="Portfolio file explorer" onKeyDown={trapMenu}>
  <button ref={closeButton} type="button" className={styles.closeMenu} aria-label="Close portfolio menu" onClick={() => closeMenu()}><X size={20}/></button>
  <div className={styles.identityRow}><a href="#home" onClick={e => { e.preventDefault(); openFile('home'); }} className={styles.identity}>
   <img className={styles.avatar} src="/jethro-profile.webp" alt="LEGO-style portrait of Jethro A. Rendon" width={55} height={55}/>
   <span><strong>Jethro Rendon</strong><small>PORTFOLIO</small></span>
  </a><ThemeToggle/></div>
  <div className={styles.explorer}>
   <div className={styles.header}><span className={styles.lights} aria-hidden="true"><i/><i/><i/></span><span>explorer</span><button className={styles.search} onClick={searchFiles} aria-label="Search portfolio files"><Search size={15}/></button></div>
   <nav className={styles.navigation} aria-label="Portfolio sections"><div className={styles.tree}>
    {item('home.jsx', 'home', 'react')}{item('about.md', 'about', 'markdown')}
    {folder('skills', item('toolkit.jsx', 'skills', 'react', true))}
    {folder('projects', <>{item('gallery.tsx', 'projects', 'react', true)}{projects.map(p => item(p.file, `project/${p.id}`, p.file.endsWith('.tsx') ? 'react' : p.file.endsWith('.dart') ? 'typescript' : 'python', true))}</>)}
    {folder('experience', experiences.map(x => item(x.file, `experience/${x.id}`, 'typescript', true)))}
    {folder('behind-the-code', item('sidequest.md', 'community', 'markdown', true))}
    {item('contact.json', 'contact', 'json')}
   </div></nav>
  </div>
 </aside></>;
}
