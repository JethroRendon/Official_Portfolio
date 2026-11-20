'use client';
import { useRef, useState, type PointerEvent } from 'react';
import { ArrowLeft, ArrowRight, Maximize2 } from 'lucide-react';
import { projects } from './data';
import { projectMedia } from './projectMedia';
import styles from './ProjectShowcase.module.css';

export default function ProjectPreview({ id, interactive = false, initialIndex = 0, onExpand }: { id: string; interactive?: boolean; initialIndex?: number; onExpand?: (trigger: HTMLButtonElement, index: number) => void }) {
 const slides = projectMedia[id].slides;
 const [selected, setSelected] = useState(Math.max(0, Math.min(initialIndex, slides.length - 1)));
 const start = useRef<{ id: number; x: number; y: number; horizontal: boolean } | null>(null);
 const swiped = useRef(false);
 const project = projects.find(p => p.id === id)!;
 const slide = slides[selected];
 function move(offset: number) { setSelected(index => (index + offset + slides.length) % slides.length); }
 function begin(event: PointerEvent<HTMLDivElement>) {
  if (!event.isPrimary || event.button !== 0) return;
  swiped.current = false;
  start.current = { id: event.pointerId, x: event.clientX, y: event.clientY, horizontal: false };
 }
 function drag(event: PointerEvent<HTMLDivElement>) {
  const gesture = start.current;
  if (!gesture || gesture.id !== event.pointerId) return;
  const dx = event.clientX - gesture.x, dy = event.clientY - gesture.y;
  if (!gesture.horizontal && Math.abs(dy) > 10 && Math.abs(dy) > Math.abs(dx)) { start.current = null; return; }
  if (Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy)) {
   gesture.horizontal = true;
   swiped.current = true;
   event.currentTarget.setPointerCapture(event.pointerId);
  }
 }
 function finish(event: PointerEvent<HTMLDivElement>, cancelled = false) {
  const gesture = start.current;
  start.current = null;
  if (!gesture || gesture.id !== event.pointerId) return;
  if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  const dx = event.clientX - gesture.x, dy = event.clientY - gesture.y;
  if (!cancelled && Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) { swiped.current = true; move(dx < 0 ? 1 : -1); }
 }
 const pictures = <>{slide.images.map((src, index) => <img key={src} src={src} alt={`${project.name}: ${slide.title}${slide.images.length > 1 ? `, screen ${index + 1}` : ''}`} loading={interactive ? 'eager' : 'lazy'} decoding="async" draggable={false}/>)}</>;
 return <section className={`${styles.gallery} ${interactive ? styles.expanded : ''}`} aria-label={`${project.name} screenshots`} onKeyDown={event => { if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); move(event.key === 'ArrowRight' ? 1 : -1); } }}>
  <div className={`${styles.frame} ${slide.presentation ? styles[slide.presentation] : ''}`} onPointerDown={begin} onPointerMove={drag} onPointerUp={event => finish(event)} onPointerCancel={event => finish(event, true)} onLostPointerCapture={() => { start.current = null; }}>
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
