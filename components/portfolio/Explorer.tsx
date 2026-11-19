'use client';
import { useState } from 'react';
import { ChevronDown, ChevronRight, File, Folder, Atom, Braces, Diamond, Search } from 'lucide-react';
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
 function item(label: string, target: View, type: string, nested = false) {
  const selected = view === target;
  return <button key={target} className={cx('file', nested && 'nested', selected && 'selected', selected && view === 'home' && 'home')} onClick={() => navigate(target)} aria-current={selected ? 'page' : undefined} title={`Open ${label}`}>
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
 return <aside className={styles.sidebar} aria-label="Portfolio file explorer">
  <div className={styles.identityRow}><a href="#home" onClick={e => { e.preventDefault(); navigate('home'); }} className={styles.identity}>
   <img className={styles.avatar} src="/jethro-night-avatar.jpg" alt="Pixel-art profile of Jethro A. Rendon" width={55} height={55}/>
   <span><strong>Jethro Rendon</strong><small>PORTFOLIO</small></span>
  </a><ThemeToggle/></div>
  <div className={styles.explorer}>
   <div className={styles.header}><span className={styles.lights} aria-hidden="true"><i/><i/><i/></span><span>explorer</span><button className={styles.search} onClick={onSearch} aria-label="Search portfolio files"><Search size={15}/></button></div>
   <nav className={styles.navigation} aria-label="Portfolio sections"><div className={styles.tree}>
    {item('home.jsx', 'home', 'react')}{item('about.md', 'about', 'markdown')}
    {folder('skills', item('toolkit.jsx', 'skills', 'react', true))}
    {folder('projects', <>{item('gallery.tsx', 'projects', 'react', true)}{projects.map(p => item(p.file, `project/${p.id}`, p.file.endsWith('.tsx') ? 'react' : p.file.endsWith('.dart') ? 'typescript' : 'python', true))}</>)}
    {folder('experience', experiences.map(x => item(x.file, `experience/${x.id}`, 'typescript', true)))}
    {folder('behind-the-code', item('sidequest.md', 'community', 'markdown', true))}
    {item('contact.json', 'contact', 'json')}
   </div></nav>
  </div>
 </aside>;
}
