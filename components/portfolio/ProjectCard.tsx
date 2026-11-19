'use client';
import { ArrowUpRight, Globe } from 'lucide-react';
import TechnologyLogo from './TechnologyLogo';
import { projects } from './data';
import { projectMedia } from './projectMedia';
import ProjectPreview from './ProjectPreview';
import styles from './ProjectShowcase.module.css';
export function ProjectLink({ id }: { id: string }) {
 const media = projectMedia[id];
 const brand = media.kind === 'github' ? 'GitHub' : media.kind === 'figma' ? 'Figma' : null;
 return <a className={styles.visit} href={media.url} target="_blank" rel="noopener noreferrer">{brand ? <TechnologyLogo name={brand}/> : <Globe size={14} aria-hidden="true"/>}{media.label}<ArrowUpRight size={14} aria-hidden="true"/><span className={styles.srOnly}> (opens in a new tab)</span></a>;
}
export default function ProjectCard({ id, onPreview }: { id: string; onPreview: (trigger: HTMLButtonElement, index: number) => void }) {
 const project = projects.find(p => p.id === id)!;
 return <article className={styles.card} id={`project-card-${id}`} tabIndex={-1} aria-labelledby={`project-title-${id}`}>
  <ProjectPreview id={id} onExpand={onPreview}/>
  <div className={styles.body}>
   <h3 className={styles.projectName} id={`project-title-${id}`}>{project.name}</h3>
   <p className={styles.role}>{project.role}</p>
   <p className={styles.summary}>{projectMedia[id].summary}</p>
   <div className={styles.stack}><span className={styles.stackLabel}>TECH STACK</span><ul className={styles.tags} aria-label={`${project.name} tech stack`}>{project.techStack.map(technology => <li key={technology}><TechnologyLogo name={technology}/><span>{technology}</span></li>)}</ul></div>
  </div>
  <div className={styles.footer}><ProjectLink id={id}/></div>
 </article>;
}
