'use client';
import { useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Maximize2 } from 'lucide-react';
import { projects } from './data';
import { projectMedia } from './projectMedia';
import styles from './ProjectShowcase.module.css';
export default function ProjectPreview({ id, interactive = false, initialIndex = 0, onExpand }: { id: string; interactive?: boolean; initialIndex?: number; onExpand?: (trigger: HTMLButtonElement, index: number) => void }) {
 const [selected, setSelected] = useState(initialIndex);
 const start = useRef<{ x: number; y: number } | null>(null);
 const swiped = useRef(false);
 const project = projects.find(p => p.id === id)!;
 const slides = projectMedia[id].slides;
 const slide = slides[selected];
 function move(offset: number) { setSelected(index => (index + offset + slides.length) % slides.length); }
 const pictures = <>{slide.images.map((src, index) => <img key={src} src={src} alt={`${project.name}: ${slide.title}${slide.images.length > 1 ? `, screen ${index + 1}` : ''}`} loading="lazy" decoding="async" draggable={false}/>)}</>;
 return <section className={`${styles.gallery} ${interactive ? styles.expanded : ''}`} aria-label={`${project.name} screenshots`} onKeyDown={event => { if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); move(event.key === 'ArrowRight' ? 1 : -1); } }}>
  <div className={`${styles.frame} ${slide.presentation ? styles[slide.presentation] : ''}`} onTouchStart={event => { swiped.current = false; start.current = { x: event.touches[0].clientX, y: event.touches[0].clientY }; }} onTouchEnd={event => { if (!start.current) return; const dx = event.changedTouches[0].clientX - start.current.x, dy = event.changedTouches[0].clientY - start.current.y; if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) { swiped.current = true; move(dx < 0 ? 1 : -1); } start.current = null; }}>
   {onExpand ? <button className={styles.openImage} onClick={event => { if (!swiped.current) onExpand(event.currentTarget, selected); swiped.current = false; }} aria-label={`Enlarge ${project.name} screenshots`}>{pictures}<span className={styles.zoom}><Maximize2 size={15} aria-hidden="true"/></span></button> : <div className={styles.openImage}>{pictures}</div>}
   <span className={styles.badge}>{id === 'groupify' ? 'Document prototype' : id === 'strayspot' ? 'UI design' : 'Project screenshot'}</span>
  </div>
  <div className={styles.galleryControls}>
   <div className={styles.dots} role="group" aria-label="Choose screenshot">{slides.map((item, index) => <button key={item.title} aria-label={`Show screenshot ${index + 1}: ${item.title}`} aria-pressed={selected === index} onClick={() => setSelected(index)}><span/></button>)}</div>
   <div className={styles.arrows}><button onClick={() => move(-1)} aria-label={`Previous ${project.name} screenshot`}><ArrowLeft size={17} aria-hidden="true"/></button><span aria-live="polite" aria-atomic="true">{selected + 1}/{slides.length}</span><button onClick={() => move(1)} aria-label={`Next ${project.name} screenshot`}><ArrowRight size={17} aria-hidden="true"/></button></div>
  </div>
  {interactive && <p className={styles.caption}>{slide.title}</p>}
 </section>;
}
