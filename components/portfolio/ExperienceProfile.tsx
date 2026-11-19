'use client';
import { useEffect, useRef } from 'react';
import { CalendarDays } from 'lucide-react';
import { experiences } from './data';
import styles from './ExperienceProfile.module.css';

const cardCopy: Record<string, { role: string; intro: string; detail: string }> = {
 student: { role: 'Computer Science · Artificial Intelligence', intro: 'Building a foundation in Computer Science and Artificial Intelligence at West Visayas State University.', detail: 'Learning through web, mobile, and AI projects, grounded in algorithms, databases, software engineering, and machine learning.' },
 'sk-chairperson': { role: 'SK Chairperson · Barangay Poblacion', intro: 'Leading youth programs and community engagement in Poblacion, Anini-y, Antique.', detail: 'Coordinating responsibilities, project schedules, sports activities, and community events with barangay officials, youth organizations, and local stakeholders.' },
 internship: { role: 'Aspiring developer', intro: 'Seeking an opportunity to learn, contribute, and grow through real software projects.', detail: 'Interested in web and mobile development and AI-powered applications. Bringing curiosity, responsibility, teamwork, and a willingness to learn through feedback.' },
};
export function timelineProgress(anchor: number, start: number, end: number) {
 return end <= start ? 0 : Math.max(0, Math.min(1, (anchor - start) / (end - start)));
}
export default function ExperienceProfile({ selectedId }: { selectedId: string }) {
 const entries = useRef<Record<string, HTMLElement | null>>({});
 const timeline = useRef<HTMLDivElement>(null);
 const rail = useRef<HTMLSpanElement>(null);
 const activeIndex = experiences.findIndex(entry => entry.id === selectedId);
 useEffect(() => {
  if (activeIndex <= 0) return;
  const frame = requestAnimationFrame(() => entries.current[selectedId]?.scrollIntoView({ block: 'start', behavior: 'instant' }));
  return () => cancelAnimationFrame(frame);
 }, [selectedId, activeIndex]);
 useEffect(() => {
  const root = timeline.current;
  const track = rail.current;
  if (!root || !track) return;
  let frame = 0;
  let disposed = false;
  const update = () => {
   frame = 0;
   const bounds = root.getBoundingClientRect();
   const nodes = Array.from(root.querySelectorAll<HTMLElement>('[data-timeline-node]'));
   const centers = nodes.map(node => { const box = node.getBoundingClientRect(); return box.top + box.height / 2 - bounds.top; });
   if (centers.length < 2) return;
   const start = centers[0], end = centers[centers.length - 1];
   const anchor = window.innerHeight * 0.62 - bounds.top;
   const progress = timelineProgress(anchor, start, end);
   track.style.top = `${start}px`;
   track.style.height = `${end - start}px`;
   track.style.setProperty('--timeline-progress', String(progress));
   nodes.forEach((node, index) => { node.parentElement!.dataset.reached = String(anchor >= centers[index]); });
  };
  const schedule = () => { if (!disposed && !frame) frame = requestAnimationFrame(update); };
  const observer = new ResizeObserver(schedule);
  observer.observe(root);
  Object.values(entries.current).forEach(entry => { if (entry) observer.observe(entry); });
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  void document.fonts.ready.then(schedule);
  schedule();
  return () => { disposed = true; cancelAnimationFrame(frame); observer.disconnect(); window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule); };
 }, []);
 return <section className={styles.experience} aria-labelledby="experience-title">
  <header className={styles.heading}><h1 id="experience-title">Learning. Leading.<br/><span>What’s next.</span></h1><p>From the classroom to the community.<br/>And the next opportunity to build.</p></header>
  <div className={styles.timeline} ref={timeline}><span className={styles.rail} ref={rail} aria-hidden="true"><span className={styles.fill}/></span><ol className={styles.stepList}>
   {experiences.map(entry => {
    const copy = cardCopy[entry.id];
    const selected = entry.id === selectedId;
    return <li className={`${styles.step} ${styles[entry.id === 'student' ? 'student' : entry.id === 'sk-chairperson' ? 'leader' : 'next']}`} key={entry.id}>
     <span className={styles.node} data-timeline-node aria-hidden="true"><span/></span>
     <article id={`chapter-${entry.id}`} ref={el => { entries.current[entry.id] = el; }} className={`${styles.card} ${selected ? styles.active : ''}`} aria-labelledby={`title-${entry.id}`}>
      <div className={styles.cardMain}>
       <header className={styles.cardHeading}><h2 id={`title-${entry.id}`}>{entry.name}</h2><h3>{copy.role}</h3></header>
       <div className={styles.date}><CalendarDays size={15} aria-hidden="true"/><span>{entry.date}</span></div>
       <p className={styles.description}>{copy.intro}</p>
       <p className={styles.detail}>{copy.detail}</p>
       <div className={styles.tags}>{entry.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
      </div>
     </article>
    </li>;
   })}
  </ol></div>
  <p className={styles.endnote}><span aria-hidden="true"/>The next chapter is still being written.</p>
 </section>;
}
