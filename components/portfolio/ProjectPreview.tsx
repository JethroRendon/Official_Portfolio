'use client';
import { useState } from 'react';
import { ArrowRight, Code2 } from 'lucide-react';
import { projects } from './data';
const componentNotes: Record<string,string[]> = {
 'vec-pro': ['Community image reporting is one component of the surveillance platform.', 'MobileNetV3-Large is used for screening in the research platform.', 'YOLOv8s provides the detection component described in the thesis project.', 'The platform includes an LGU web dashboard for the Iloilo City context.', 'The research platform includes agent-based mosquito spread simulation.'],
 'strayspot': ['A centralized digital management system supports animal shelters.', 'The project supports rescue organizations in Iloilo City.', 'Pet discovery is one of the user-facing experiences supported by the system.', 'The system supports pet adoption; my contribution focused on frontend development.'],
 'synt-ask': ['The NLP final project is a real-time multiplayer game.', 'I developed the frontend using React and TypeScript.', 'The project uses DistilBERT-based semantic analysis.', 'Semantic analysis supports impostor detection in the multiplayer game.', 'I contributed to the project documentation alongside frontend development.'],
 'groupify': ['The application supports collaboration among students.', 'Task management is one of the application’s collaboration features.', 'Group communication is supported in the mobile application.', 'The application supports file sharing, using Flutter, Dart, and Firebase.'],
};
export default function ProjectPreview({ id, interactive = false }: { id: string; interactive?: boolean }) {
 const project=projects.find(p=>p.id===id) || projects[0];
 const [selected,setSelected]=useState(0);
 return <div className={`project-preview resume-preview ${interactive?'interactive':''}`} style={{'--project-color':project.color,'--project-color-light':project.lightColor} as React.CSSProperties} aria-label={`${project.name} project component overview`}>
  <div className="preview-window"><span/><span/><span/><small>{project.file} / project overview</small></div>
  <div className="resume-preview-body"><div className="resume-preview-title"><Code2 size={20}/><span>{project.category}</span></div><h3>{project.name}<span>_</span></h3><p className="resume-preview-role">{project.role}</p><div className="component-flow" role={interactive?'group':undefined} aria-label="Project components">{project.components.map((name,i)=><div key={name}>{interactive?<button className={selected===i?'active':''} onClick={()=>setSelected(i)} aria-pressed={selected===i}><small>0{i+1}</small>{name}</button>:<span><small>0{i+1}</small>{name}</span>}{i<project.components.length-1&&<ArrowRight size={13}/>}</div>)}</div>{interactive&&<p className="component-description" aria-live="polite"><span className="code-comment">// selected component</span><strong>{project.components[selected]}</strong><span>{componentNotes[project.id][selected]}</span></p>}<div className="preview-status"><i/> {interactive?'Interactive project outline':'Project components · based on résumé'}</div></div>
 </div>;
}
