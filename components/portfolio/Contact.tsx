'use client';
import { useState, type CSSProperties, type ReactNode } from 'react';
import { ArrowUpRight, Check, ChevronDown, FileText, LoaderCircle, Mail, MapPin, Phone, Send } from 'lucide-react';
import { resumeUrl } from './data';
import styles from './Contact.module.css';

const channels = [
 { id: 'github', label: 'GitHub', href: 'https://github.com/JethroRendon', color: '#a499e6', top: '#9684dc', left: '#6755a8', right: '#7966bf', external: true },
 { id: 'linkedin', label: 'LinkedIn', href: 'https://linkedin.com/in/jethro-rendon/', color: '#48bded', top: '#4ac8ff', left: '#168fca', right: '#29a9e6', external: true },
 { id: 'resume', label: 'Résumé', href: resumeUrl, color: '#8cc5a7', top: '#9cd6b3', left: '#4b8e6f', right: '#6aac88', external: true },
 { id: 'email', label: 'Email', href: 'mailto:jethro.rendon@wvsu.edu.ph', color: '#d3adbb', top: '#c5a3c5', left: '#886f94', right: '#a087ab', external: false },
];

function Cube({ children }: { children: ReactNode }) {
 return <svg className={styles.cube} width="120" height="112" viewBox="0 0 120 112" aria-hidden="true">
  <ellipse className={styles.shadow} cx="60" cy="101" rx="34" ry="6"/>
  <path className={styles.leftFace} d="M11 35 60 63V95L11 67Z"/>
  <path className={styles.rightFace} d="m60 63 49-28v32L60 95Z"/>
  <path className={styles.topFace} d="M60 8 109 35 60 63 11 35Z"/>
  <path className={styles.outline} d="M60 18 92 36 60 54 28 36Z"/>
  <g className={styles.cubeIcon} transform="matrix(.86 .5 -.86 .5 60 23)">{children}</g>
 </svg>;
}

export default function Contact() {
 const [state, setState] = useState<'idle'|'sending'|'success'|'error'>('idle');
 const [error, setError] = useState('');
 async function submit(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault();
  const form = event.currentTarget;
  const data = Object.fromEntries(new FormData(form).entries());
  setState('sending'); setError('');
  try {
   const response = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
   const result = await response.json() as { error?: string };
   if (!response.ok) throw new Error(result.error || 'Unable to save your message. Please try again.');
   setState('success'); form.reset();
  } catch (err) { setState('error'); setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.'); }
 }
 return <div className={styles.contact}>
  <header className={styles.heading}><h1>WHAT’S NEXT?</h1><p>Building intelligent software, web experiences, and mobile applications.</p></header>
  <nav className={styles.channels} aria-label="Connect with Jethro">{channels.map(channel => <a key={channel.id} href={channel.href} className={styles.channel} target={channel.external ? '_blank' : undefined} rel={channel.external ? 'noreferrer' : undefined} aria-label={channel.id === 'resume' ? 'Preview Jethro’s résumé (opens in a new tab)' : channel.id === 'email' ? 'Email Jethro' : `Open Jethro’s ${channel.label} profile (opens in a new tab)`} style={{ '--channel-color': channel.color, '--active-top': channel.top, '--active-left': channel.left, '--active-right': channel.right } as CSSProperties}>
   <Cube>{channel.id === 'github' ? <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><use href="/toolkit-icons.svg#github"/></svg> : channel.id === 'linkedin' ? <text x="12" y="19" textAnchor="middle" fontFamily="Arial,sans-serif" fontWeight="700" fontSize="22" fill="currentColor">in</text> : channel.id === 'resume' ? <FileText size={24} strokeWidth={2}/> : <Mail size={24} strokeWidth={2}/>}</Cube>
   <span>{channel.label}<ArrowUpRight size={10} aria-hidden="true"/></span>
  </a>)}</nav>
  <div className={styles.codeCard} aria-label="Jethro’s developer profile"><pre><code><span className={styles.keyword}>const</span> <span className={styles.variable}>jethro</span> = {'{'}{'\n'}  building: <span className={styles.string}>"Useful web & mobile apps"</span>,{'\n'}  exploring: [<span className={styles.string}>"AI Integration"</span>, <span className={styles.string}>"Full-Stack Development"</span>, <span className={styles.string}>"Intelligent Systems"</span>],{'\n'}  status: <span className={styles.string}>"Let’s build something"</span>{'\n'}{'}'};</code></pre></div>
  <details className={styles.composer}>
   <summary><Send size={13} aria-hidden="true"/><span>Compose a message</span><ChevronDown size={13} aria-hidden="true"/></summary>
   <form className={styles.form} onSubmit={submit} aria-label="Send Jethro a message">
    <div className={styles.formBar}><span>{'{}'}</span> message.json <i aria-hidden="true"/></div>
    <div className={styles.formBody}><p className={styles.comment}>Good software starts with a conversation.</p><p className={styles.bracket}>{'{'}</p>
     {([['name','Your name'],['email','you@example.com'],['subject','Let’s build something']] as const).map(([name, placeholder]) => <label className={styles.field} key={name}><span>"{name}":</span><input name={name} type={name === 'email' ? 'email' : 'text'} placeholder={placeholder} required maxLength={name === 'subject' ? 160 : 120} autoComplete={name === 'name' ? 'name' : name === 'email' ? 'email' : 'off'}/><span className={styles.comma} aria-hidden="true">,</span></label>)}
     <label className={`${styles.field} ${styles.messageField}`}><span>"message":</span><textarea name="message" placeholder="Tell me about your idea…" required minLength={10} maxLength={5000} rows={5}/></label>
     <label className={styles.honeypot} aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off"/></label><p className={styles.bracket}>{'}'}</p>
     <button type="submit" className={styles.sendButton} disabled={state === 'sending'}>{state === 'sending' ? <LoaderCircle size={15} className={styles.spin}/> : state === 'success' ? <Check size={15}/> : <Send size={15}/>}<span>{state === 'sending' ? 'Saving message…' : state === 'success' ? 'Send another message' : 'Send message'}</span><span aria-hidden="true">↵</span></button>
     <div role="status" aria-live="polite">{state === 'success' && <p className={styles.success}>Message saved to the portfolio inbox. Thanks for reaching out!</p>}{state === 'error' && <p className={styles.error}>{error}</p>}</div>
     <p className={styles.footnote}>Your message is stored privately in this portfolio’s inbox.</p>
    </div>
   </form>
  </details>
  <div className={styles.contactMeta}><span><MapPin size={12} aria-hidden="true"/>Poblacion, Anini-y, Antique</span><a href="tel:+639104333189"><Phone size={12} aria-hidden="true"/>0910 433 3189</a></div>
 </div>;
}
