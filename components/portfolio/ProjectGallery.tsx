'use client';
import { ArrowUpRight } from 'lucide-react';
import { projects } from './data';
import ProjectCard from './ProjectCard';
import styles from './ProjectShowcase.module.css';

export default function ProjectGallery({ onPreview, heading = true }: { onPreview: (id: string, trigger: HTMLButtonElement, index: number) => void; heading?: boolean }) {
 return <section className={styles.galleryPage} aria-label="All projects">
  {heading && <header className={styles.galleryHeading}>
   <div className={styles.galleryEyebrow}><span>{String(projects.length).padStart(2, '0')} PROJECTS</span></div>
   <h1>Ideas, brought to life.</h1>
   <p>Explore every project. Browse the screenshots, visit the websites, or explore the source and designs.</p>
   <span className={styles.galleryHint}>SELECT A PREVIEW TO ENLARGE<ArrowUpRight size={13} aria-hidden="true"/></span>
  </header>}
  <div className={styles.grid}>{projects.map(project => <ProjectCard key={project.id} id={project.id} onPreview={(trigger, index) => onPreview(project.id, trigger, index)}/>)}</div>
 </section>;
}
