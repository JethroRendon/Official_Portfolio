'use client';

import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from 'react';
import { Heart } from 'lucide-react';
import styles from './SidequestSnapshots.module.css';

// Captions come directly from the original uploaded filenames, without extensions.
const photos = [
 { file: 'TRAVELLING.jfif', image: 'travelling', alt: 'Jethro travelling and exploring an ornate building', position: '50% 50%' },
 { file: 'BEACH.jfif', image: 'beach', alt: 'Jethro sitting on a beach swing beside the sea', position: '50% 50%' },
 { file: 'FREE DIVING.jfif', image: 'free-diving', alt: 'Freediving above a sea turtle and coral reef', position: '50% 42%' },
 { file: 'HIKING.jfif', image: 'hiking', alt: 'Jethro hiking on a misty mountain trail', position: '50% 50%' },
 { file: 'CHASING WATERFALL.jfif', image: 'chasing-waterfall', alt: 'Jethro standing beside a cascading waterfall', position: '50% 50%' },
 { file: 'SUNSET.jfif', image: 'sunset', alt: 'Jethro enjoying a sunset over the hills', position: '50% 50%' },
 { file: 'FASHION.jfif', image: 'fashion', alt: 'Jethro wearing an outfit in a warmly lit interior', position: '50% 50%' },
 { file: 'VOLLEYBALL.jfif', image: 'volleyball', alt: 'Jethro jumping to hit a volleyball at the net', position: '50% 50%' },
 { file: 'BASKETBALL.jpg', image: 'basketball', alt: 'Jethro taking a jump shot on a basketball court', position: '50% 50%' },
 { file: 'RUNNING.jfif', image: 'running', alt: 'Jethro at a running event', position: '50% 50%' },
 { file: 'SK DUTIES.jfif', image: 'sk-duties', alt: 'Jethro speaking at a community event as an SK official', position: '53% 50%' },
];
const tilts = [-3, 2, -2, 3, -3, 2, -2, 3, -2, 2, -2];
const caption = (file: string) => file.replace(/\.[^.]+$/, '');
const wrap = (value: number, width: number) => width ? ((value % width) + width) % width : 0;
type Burst = { id: number; photo: number };

export default function SidequestSnapshots() {
 const viewport = useRef<HTMLDivElement>(null);
 const track = useRef<HTMLDivElement>(null);
 const firstSet = useRef<HTMLDivElement>(null);
 const offset = useRef(0);
 const width = useRef(0);
 const hover = useRef(false);
 const focused = useRef(false);
 const stopped = useRef(false);
 const reducedMotion = useRef(false);
 const travel = useRef<number | null>(null);
 const momentum = useRef(0);
 const autoSpeed = useRef(0);
 const restUntil = useRef(0);
 const activeIndex = useRef(0);
 const dragging = useRef<{ id: number; startX: number; startY: number; startOffset: number; moved: boolean; photo: number | null; lastX: number; lastTime: number; velocity: number } | null>(null);
 const timers = useRef(new Set<ReturnType<typeof setTimeout>>());
 const nextBurst = useRef(0);
 const [isDragging, setIsDragging] = useState(false);
 const [bursts, setBursts] = useState<Burst[]>([]);
 const [announcement, setAnnouncement] = useState('');
 const [active, setActive] = useState(0);

 function paint(value: number) {
  offset.current = wrap(value, width.current);
  if (track.current) track.current.style.transform = `translate3d(${-offset.current}px,0,0)`;
  const stride = width.current / photos.length;
  const cardWidth = firstSet.current?.firstElementChild?.clientWidth || 216;
  const center = (viewport.current?.clientWidth || cardWidth) / 2 - cardWidth / 2;
  const index = stride ? Math.round(wrap(offset.current + center, width.current) / stride) % photos.length : 0;
  if (index !== activeIndex.current) { activeIndex.current = index; setActive(index); }
 }

 function showPhoto(index: number) {
  const next = (index + photos.length) % photos.length;
  const stride = width.current / photos.length;
  const cardWidth = firstSet.current?.firstElementChild?.clientWidth || 216;
  const center = ((viewport.current?.clientWidth || cardWidth) - cardWidth) / 2;
  const target = wrap(next * stride - center, width.current);
  momentum.current = 0;
  restUntil.current = performance.now() + 1800;
  if (reducedMotion.current) paint(target);
  else travel.current = target;
 }

 useEffect(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  stopped.current = reduced.matches;
  reducedMotion.current = reduced.matches;
  const motionChange = () => { reducedMotion.current = reduced.matches; stopped.current = reduced.matches; momentum.current = 0; travel.current = null; };
  reduced.addEventListener('change', motionChange);
  const measure = () => {
   width.current = firstSet.current?.getBoundingClientRect().width || 0;
   paint(offset.current);
  };
  measure();
  const resize = new ResizeObserver(measure);
  if (firstSet.current) resize.observe(firstSet.current);
  let frame = 0, previous = 0;
  const tick = (now: number) => {
   const delta = previous ? Math.min(now - previous, 50) : 0;
   previous = now;
   if (!document.hidden && !dragging.current) {
    if (travel.current !== null && width.current) {
     const distance = wrap(travel.current - offset.current + width.current / 2, width.current) - width.current / 2;
     if (Math.abs(distance) < .3) { paint(travel.current); travel.current = null; }
     else paint(offset.current + distance * (1 - Math.exp(-delta / 105)));
    } else if (!stopped.current && !hover.current && !focused.current && now > restUntil.current) {
     autoSpeed.current += (.045 - autoSpeed.current) * (1 - Math.exp(-delta / 190));
     momentum.current *= Math.exp(-delta / 200);
     paint(offset.current + delta * (autoSpeed.current + momentum.current));
    } else { autoSpeed.current = 0; momentum.current = 0; }
   }
   frame = requestAnimationFrame(tick);
  };
  frame = requestAnimationFrame(tick);
  return () => {
   cancelAnimationFrame(frame);
   resize.disconnect();
   reduced.removeEventListener('change', motionChange);
   timers.current.forEach(clearTimeout);
   timers.current.clear();
  };
 }, []);

 function sendHeart(photo: number) {
  const id = ++nextBurst.current;
  setBursts(current => [...current.slice(-5), { id, photo }]);
  setAnnouncement(`Sent a heart to ${caption(photos[photo].file).toLowerCase()}.`);
  const timer = setTimeout(() => {
   setBursts(current => current.filter(burst => burst.id !== id));
   timers.current.delete(timer);
  }, 1050);
  timers.current.add(timer);
 }

 function pointerDown(event: PointerEvent<HTMLDivElement>) {
  if (!event.isPrimary || event.button !== 0) return;
  focused.current = false;
  travel.current = null;
  momentum.current = 0;
  restUntil.current = 0;
  const card = (event.target as HTMLElement).closest<HTMLButtonElement>('[data-photo]');
  dragging.current = { id: event.pointerId, startX: event.clientX, startY: event.clientY, startOffset: offset.current, moved: false, photo: card ? Number(card.dataset.photo) : null, lastX: event.clientX, lastTime: event.timeStamp, velocity: 0 };
  event.currentTarget.setPointerCapture(event.pointerId);
 }

 function pointerMove(event: PointerEvent<HTMLDivElement>) {
  const drag = dragging.current;
  if (!drag || drag.id !== event.pointerId) return;
  const dx = event.clientX - drag.startX, dy = event.clientY - drag.startY;
  if (!drag.moved && Math.hypot(dx, dy) > 7) {
   drag.moved = true;
   setIsDragging(true);
  }
  if (drag.moved) {
   const elapsed = event.timeStamp - drag.lastTime;
   if (elapsed > 0) drag.velocity = Math.max(-1.4, Math.min(1.4, -(event.clientX - drag.lastX) / elapsed));
   drag.lastX = event.clientX;
   drag.lastTime = event.timeStamp;
   paint(drag.startOffset - dx);
  }
 }

 function finishPointer(event: PointerEvent<HTMLDivElement>, cancelled = false) {
  const drag = dragging.current;
  if (!drag || drag.id !== event.pointerId) return;
  dragging.current = null;
  setIsDragging(false);
  if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  if (!cancelled && !drag.moved && drag.photo !== null) sendHeart(drag.photo);
  if (!cancelled && drag.moved && event.pointerType === 'touch' && !reducedMotion.current && event.timeStamp - drag.lastTime < 100) momentum.current = drag.velocity;
 }


 return <section className={styles.snapshots} aria-labelledby="snapshots-title">
  <header className={styles.heading}><h1 id="snapshots-title">Sidequests</h1></header>
  <div className={styles.board}>
   <div ref={viewport} className={`${styles.viewport} ${isDragging ? styles.dragging : ''}`} tabIndex={0} role="group" aria-label="Photo gallery. Drag horizontally or use left and right arrow keys. Select a photo to send a heart."
    onPointerEnter={event => { if (event.pointerType !== 'touch') hover.current = true; }}
    onPointerLeave={() => { hover.current = false; }}
    onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={event => finishPointer(event)} onPointerCancel={event => finishPointer(event, true)}
    onLostPointerCapture={() => { dragging.current = null; setIsDragging(false); }}
    onFocusCapture={event => { focused.current = (event.target as HTMLElement).matches(':focus-visible'); }}
    onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget as Node)) focused.current = false; }}
    onKeyDown={event => {
     if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); showPhoto(activeIndex.current + (event.key === 'ArrowRight' ? 1 : -1)); }
    }}>
    <div className={styles.track} ref={track}>
     {[0, 1, 2].map(copy => <div className={styles.photoSet} key={copy} ref={copy === 0 ? firstSet : undefined} aria-hidden={copy > 0 ? true : undefined}>
      {photos.map((photo, index) => <button key={photo.file} type="button" className={styles.polaroid} data-photo={index} tabIndex={copy === 0 ? 0 : -1} aria-label={`Send a heart to ${caption(photo.file).toLowerCase()}`} style={{ '--tilt': `${tilts[index]}deg` } as CSSProperties}
       onFocus={event => { if (event.currentTarget.matches(':focus-visible') && firstSet.current) paint(Math.max(0, index * firstSet.current.getBoundingClientRect().width / photos.length - 30)); }}
       onClick={event => { if (event.detail === 0) sendHeart(index); }}>
       <span className={styles.photo}><img src={`/sidequest/${photo.image}.webp`} alt={copy === 0 ? photo.alt : ''} width={600} height={800} loading="eager" decoding="async" draggable={false} style={{ objectPosition: photo.position }}/>
        {bursts.filter(burst => burst.photo === index).map(burst => <span key={burst.id} className={styles.heartBurst} aria-hidden="true"><Heart fill="currentColor" strokeWidth={1.4}/><i>♥</i><i>♥</i><i>♥</i></span>)}
       </span><span className={`${styles.caption} ${caption(photo.file).length > 14 ? styles.longCaption : ''}`}>{caption(photo.file)}<Heart className={styles.likeHint} size={12} aria-hidden="true"/></span>
      </button>)}
     </div>)}
    </div>
   </div>
  </div>
  <div className={styles.pagination} role="group" aria-label="Choose a photo">{photos.map((photo, index) => <button key={photo.file} className={`${styles.dot} ${active === index ? styles.activeDot : ''}`} type="button" aria-label={`Show ${caption(photo.file).toLowerCase()} photo`} aria-current={active === index ? 'true' : undefined} title={caption(photo.file)} onClick={() => showPhoto(index)}/>)}</div>
  <span className={styles.srOnly} aria-live="polite" aria-atomic="true">{announcement}</span>
 </section>;
}
