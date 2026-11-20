'use client';

import { useEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from 'react';
import { ArrowDown, ArrowUpRight, Palette, Type, MoveHorizontal, Scan, Droplet, RotateCcw, FileText } from 'lucide-react';
import type { View } from './Explorer';
import { resumeUrl } from './data';
import styles from './HomeHero.module.css';

const tools = [
  { id: 'color', label: 'Color', icon: Palette, accent: '#8bb8ef' },
  { id: 'type', label: 'Type', icon: Type, accent: '#bca5ed' },
  { id: 'spacing', label: 'Spacing', icon: MoveHorizontal, accent: '#ec927d' },
  { id: 'radius', label: 'Radius', icon: Scan, accent: '#e6b26a' },
  { id: 'opacity', label: 'Opacity', icon: Droplet, accent: '#8dc5a2' },
] as const;
type Tool = typeof tools[number]['id'];
const palettes = [
  ['#a29ae4', '#d4c272', '#e3e5cd'],
  ['#98bddd', '#8bc5b0', '#d2dfc4'],
  ['#c5a6ef', '#ec9caa', '#eab979'],
];

export default function HomeHero({ navigate }: { navigate: (target: View) => void }) {
  const [tool, setTool] = useState<Tool | null>(null);
  const [palette, setPalette] = useState(0);
  const [size, setSize] = useState(100);
  const [spacing, setSpacing] = useState(-5);
  const [radius, setRadius] = useState(18);
  const [opacity, setOpacity] = useState(100);
  const [mixing, setMixing] = useState(false);
  const colorTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [paint, setPaint] = useState<Record<string, string>>({});
  const [inkOpacity, setInkOpacity] = useState<Record<string, number>>({});
  const [swipes, setSwipes] = useState<Record<string, { x: number; y: number; angle: number; scale: number }>>({});
  const lastSwipe = useRef<{ x: number; y: number } | null>(null);
  const settleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [sample, setSample] = useState<string | null>(null);
  const [brush, setBrush] = useState<{ x: number; y: number } | null>(null);
  const drag = useRef<{ tool: Tool; x: number; value: number; direction: number } | null>(null);
  useEffect(() => () => { if (settleTimer.current) clearTimeout(settleTimer.current); if (colorTimer.current) clearTimeout(colorTimer.current); }, []);
  const accent = tools.find(item => item.id === tool)?.accent ?? '#bca5ed';
  const work = () => document.getElementById('selected-work')?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  function cancelColorReturn() { if (colorTimer.current) clearTimeout(colorTimer.current); colorTimer.current = null; }
  function returnColorsAfterSwipe() {
    cancelColorReturn();
    setMixing(true);
    colorTimer.current = setTimeout(() => {
      setMixing(false); setPaint({}); setSample(null); lastSwipe.current = null; colorTimer.current = null;
    }, 700);
  }
  function reset() { cancelColorReturn(); setMixing(false); setTool(null); setPalette(0); setSize(100); setSpacing(-5); setRadius(18); setOpacity(100); setPaint({}); setInkOpacity({}); setBrush(null); setSwipes({}); lastSwipe.current = null; }
  const value = tool === 'type' ? size : tool === 'spacing' ? spacing : tool === 'radius' ? radius : opacity;
  const labels = { type: 'Headline size', spacing: 'Letter spacing', radius: 'Corner radius', opacity: 'Headline opacity' };
  const code = sample && (tool === 'color' || tool === 'opacity') ? sample : tool === 'color' ? `color: ${palettes[palette][0]};` : tool === 'type' ? `font-size: ${size}%;` : tool === 'spacing' ? `letter-spacing: ${(spacing / 100).toFixed(2)}em;` : tool === 'radius' ? `border-radius: ${radius}px;` : `opacity: ${(opacity / 100).toFixed(2)};`;

  function beginDrag(event: ReactPointerEvent<HTMLElement>, kind: Tool, direction = 1) {
    if (!event.isPrimary || event.button !== 0) return;
    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { tool: kind, x: event.clientX, value: kind === 'type' ? size : kind === 'spacing' ? spacing : radius, direction };
  }
  function moveDrag(event: ReactPointerEvent<HTMLElement>) {
    const current = drag.current;
    if (!current) return;
    const delta = (event.clientX - current.x) * current.direction;
    if (current.tool === 'type') setSize(Math.round(Math.max(70, Math.min(104, current.value + delta / 4))));
    if (current.tool === 'spacing') setSpacing(Math.round(Math.max(-8, Math.min(-3, current.value + delta / 25))));
    if (current.tool === 'radius') setRadius(Math.round(Math.max(0, Math.min(40, current.value + delta / 3))));
  }
  function settleLetters() {
    if (settleTimer.current) clearTimeout(settleTimer.current);
    settleTimer.current = setTimeout(() => setSwipes({}), 130);
  }
  function swipeLetters(event: ReactPointerEvent<HTMLDivElement>) {
    if (tool && tool !== 'color') return;
    const previous = lastSwipe.current;
    lastSwipe.current = { x: event.clientX, y: event.clientY };
    if (!previous) return;
    const dx = Math.max(-30, Math.min(30, event.clientX - previous.x));
    const dy = Math.max(-20, Math.min(20, event.clientY - previous.y));
    if (Math.abs(dx) + Math.abs(dy) < 1) return;
    const colors: Record<string, string> = {};
    const motion: typeof swipes = {};
    for (const glyph of event.currentTarget.querySelectorAll<HTMLElement>('[data-glyph]')) {
      if (!glyph.textContent?.trim()) continue;
      const rect = glyph.getBoundingClientRect();
      const distance = Math.hypot(event.clientX - (rect.left + rect.width / 2), event.clientY - (rect.top + rect.height / 2));
      const influence = Math.max(0, 1 - distance / 85);
      if (!influence) continue;
      const key = glyph.dataset.glyph!;
      const row = Number(key.split('-')[0]);
      const ink = palettes[palette][(row + (dx >= 0 ? 1 : 2)) % 3];
      const destination = ink.match(/[a-f\d]{2}/gi)!.map(value => parseInt(value, 16));
      const source = getComputedStyle(glyph).color.match(/[\d.]+/g)?.slice(0, 3).map(Number) ?? destination;
      const amount = influence * .7;
      colors[key] = `rgb(${source.map((value, index) => Math.round(value * (1 - amount) + destination[index] * amount)).join(', ')})`;
      motion[key] = { x: dx * influence * .45, y: dy * influence * .35, angle: dx * influence * .18, scale: 1 + influence * .055 };
    }
    if (Object.keys(colors).length) {
      setPaint(current => ({ ...current, ...colors }));
      setSwipes(motion);
      returnColorsAfterSwipe();
      if (tool === 'color') setSample(`color: ${Object.values(colors)[0]};`);
      settleLetters();
    }
  }
  function paintGlyph(event: ReactPointerEvent<HTMLDivElement>) {
    if (tool !== 'color' && tool !== 'opacity') return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - bounds.left, y = event.clientY - bounds.top;
    setBrush({ x, y });
    // Hit-test the actual letter bounds so overlays cannot intercept the brush.
    const glyphs = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('[data-glyph]')).filter(glyph => {
      const rect = glyph.getBoundingClientRect();
      return event.clientX >= rect.left - 12 && event.clientX <= rect.right + 12 && event.clientY >= rect.top && event.clientY <= rect.bottom;
    });
    if (!glyphs.length) return;
    if (tool === 'color') {
      const color = `hsl(${Math.round(x / bounds.width * 300)}, 65%, 72%)`;
      setPaint(current => ({ ...current, ...Object.fromEntries(glyphs.map(glyph => [glyph.dataset.glyph!, color])) }));
      setSample(`color: ${color};`);
      returnColorsAfterSwipe();
    } else {
      const level = Math.max(.25, Math.min(1, x / bounds.width));
      setInkOpacity(current => ({ ...current, ...Object.fromEntries(glyphs.map(glyph => [glyph.dataset.glyph!, level])) }));
      setSample(`opacity: ${level.toFixed(2)};`);
    }
  }
  const text = (value: string, row: number) => value.split('').map((letter, index) => {
    const key = `${row}-${index}`;
    return <span key={key} data-glyph={key} className={styles.glyph} style={{ '--glyph-delay': `${row * 110 + index * 18}ms`, '--swipe-x': `${swipes[key]?.x ?? 0}px`, '--swipe-y': `${swipes[key]?.y ?? 0}px`, '--swipe-angle': `${swipes[key]?.angle ?? 0}deg`, '--swipe-scale': swipes[key]?.scale ?? 1, color: paint[key], opacity: inkOpacity[key] ?? opacity / 100 } as CSSProperties}>{letter}</span>;
  });
  const endDrag = () => { drag.current = null; lastSwipe.current = null; setBrush(null); settleLetters(); };
  const help = tool === 'color' ? 'Swipe across the letters to blend their colors.' : tool === 'type' ? 'Drag a corner handle to resize the headline.' : tool === 'spacing' ? 'Drag the headline left or right to adjust tracking.' : tool === 'radius' ? 'Drag a gold handle to round the shapes.' : 'Move the lens across letters to change opacity.';

  return <section className={styles.hero} aria-label="Introduction" style={{ '--play-accent': accent } as CSSProperties}>
    <div className={styles.composition}>
      <div className={styles.hello}><span style={{ borderRadius: `${radius + 12}px` }}>Hello, I’m Jethro.</span></div>
      <div className={styles.nameStage}>
        <div data-mixing={mixing || undefined} data-tool={tool ?? undefined} onPointerDown={event => { if (!event.isPrimary || event.button !== 0 || (event.target as HTMLElement).closest('button')) return; lastSwipe.current = { x: event.clientX, y: event.clientY }; if (event.pointerType === 'touch' && (tool === null || tool === 'color')) event.currentTarget.setPointerCapture(event.pointerId); if (tool === 'spacing') beginDrag(event, 'spacing'); else paintGlyph(event); }} onPointerMove={event => { moveDrag(event); if (tool === null || tool === 'color') swipeLetters(event); if (tool === 'opacity') paintGlyph(event); if (tool === 'color') { const bounds = event.currentTarget.getBoundingClientRect(); setBrush({ x: event.clientX - bounds.left, y: event.clientY - bounds.top }); } }} onPointerUp={endDrag} onPointerCancel={endDrag} onLostPointerCapture={endDrag} onPointerLeave={() => { setBrush(null); lastSwipe.current = null; settleLetters(); }} className={`${styles.wordFrame} ${tool === 'type' || tool === 'spacing' ? styles.measured : ''} ${tool === 'radius' ? styles.roundedFrame : ''}`} style={{ borderRadius: `${radius}px` }}>
          <h1 className={styles.word} aria-label="AI student, web and mobile developer" style={{ '--name-scale': size / 100, '--name-spacing': `${spacing / 100}em` } as CSSProperties}>
            <span className={styles.row} style={{ color: palettes[palette][0] }}><span className={styles.aiWord}>{text('AI STUDENT', 0)}{!tool && <span className={`${styles.cursor} ${styles.aiCursor}`} aria-hidden="true"><svg viewBox="0 0 20 20"><path d="M2 18 7 2 10 9 18 12Z" fill="currentColor"/></svg><span>AI</span></span>}</span></span>
            <span className={styles.row} style={{ color: palettes[palette][1] }}><span>{text('WEB & MOBILE', 1)}</span></span>
            <span className={`${styles.row} ${styles.third}`}><span className={styles.developer} style={{ color: palettes[palette][2] }}>{text('DEVELOPER', 2)}{!tool && <span className={`${styles.cursor} ${styles.buildCursor}`} aria-hidden="true"><svg viewBox="0 0 20 20"><path d="M2 2 18 8 10 11 7 18Z" fill="currentColor"/></svg><span>Build</span></span>}</span><button className={styles.connect} onClick={() => navigate('contact')}><i/>Let’s connect<ArrowUpRight size={12}/></button></span>
          </h1>
          {(tool === 'type' || tool === 'spacing') && <>{[0,1,2,3].map(index => <button key={index} className={styles.handle} aria-label={`Drag headline resize handle ${index + 1}`} onPointerDown={event => beginDrag(event, tool, index % 2 === 0 ? -1 : 1)} onKeyDown={event => { if (event.key === 'ArrowRight') { if (tool === 'type') setSize(current => Math.min(104, current + 1)); else setSpacing(current => Math.min(-3, current + 1)); } if (event.key === 'ArrowLeft') { if (tool === 'type') setSize(current => Math.max(70, current - 1)); else setSpacing(current => Math.max(-8, current - 1)); } }}/>)}<span className={styles.measureLabel}>{tool === 'type' ? `${size}%` : `${(spacing / 100).toFixed(2)}em`}</span></>}
          {brush && (tool === 'color' || tool === 'opacity') && <span className={styles.brush} aria-hidden="true" style={{ left: brush.x, top: brush.y }}>+</span>}
        </div>
        {tool === 'radius' && <div className={styles.radiusDemo} aria-label="Corner radius playground">{[1,2,3,4,5,6].map(count => <div key={count} className={styles.die} style={{ borderRadius: `${radius}px` }}>{Array.from({ length: count }, (_, pip) => <i key={pip}/>)}<button className={styles.radiusHandle} aria-label={`Round shape ${count}`} onPointerDown={event => beginDrag(event, 'radius')} onPointerMove={moveDrag} onPointerUp={endDrag} onPointerCancel={endDrag} onKeyDown={event => { if (event.key === 'ArrowRight') setRadius(current => Math.min(40, current + 1)); if (event.key === 'ArrowLeft') setRadius(current => Math.max(0, current - 1)); }}/></div>)}</div>}
      </div>
      <p className={styles.purpose}>Code with purpose. Build with intention.</p>
      <p className={styles.description}>Building web &amp; mobile experiences through{' '}<br/><span style={{ color: palettes[palette][0] }}>thoughtful code</span>, <span style={{ color: palettes[palette][1] }}>useful AI</span>, and <span className={styles.green}>community impact</span>.</p>
      <span className={styles.education}>BS COMPUTER SCIENCE · ARTIFICIAL INTELLIGENCE · WVSU</span>
      <div className={styles.playground}>
        <div className={styles.dock} role="group" aria-label="Interactive headline design tools">
          {tool && <button className={styles.reset} onClick={reset} aria-label="Reset headline design"><RotateCcw size={13}/></button>}
          {tools.map(item => <button key={item.id} aria-label={`Adjust ${item.label.toLowerCase()}`} aria-pressed={tool === item.id} onClick={() => { setTool(current => current === item.id ? null : item.id); setBrush(null); setSample(null); }} style={{ '--tool-accent': item.accent } as CSSProperties} className={tool === item.id ? styles.activeTool : ''} title={item.label}><item.icon size={14}/>{tool === item.id && <span>{item.label}</span>}</button>)}
        </div>
        {tool && <span className={styles.dragHint}>{help}</span>}
        {!tool && <span className={styles.hint}>swipe to mix. the original colors return.</span>}
        {tool && <div className={styles.controls}>
          <div className={styles.codeWindow}><div><i/><i/><i/><span>style.css</span></div><code>{code}</code></div>
          {tool === 'color' ? <div className={styles.swatches} role="group" aria-label="Headline color palettes">{palettes.map((colors, index) => <button key={index} aria-label={['Original multicolor palette','Ocean palette','Warm palette'][index]} aria-pressed={palette === index} onClick={() => { cancelColorReturn(); setMixing(false); setPalette(index); setPaint({}); setSample(`color: ${colors[0]};`); }}>{colors.slice(0, 3).map(color => <i key={color} style={{ background: color }}/>)}</button>)}</div> : <label className={styles.slider}><span>{labels[tool]}<output>{value}{tool === 'type' || tool === 'opacity' ? '%' : tool === 'radius' ? 'px' : ''}</output></span><input aria-label={labels[tool]} type="range" min={tool === 'type' ? 70 : tool === 'spacing' ? -8 : tool === 'opacity' ? 25 : 0} max={tool === 'type' ? 104 : tool === 'spacing' ? -3 : tool === 'radius' ? 40 : 100} value={value} onChange={event => {const next = Number(event.target.value); if (tool === 'type') setSize(next); else if (tool === 'spacing') setSpacing(next); else if (tool === 'radius') setRadius(next); else { setOpacity(next); setInkOpacity({}); setSample(null); }}}/></label>}
        </div>}
      </div>
    </div>
    <a className={styles.resumeTab} href={resumeUrl} target="_blank" rel="noreferrer" aria-label="Preview résumé in a new tab"><FileText size={16} aria-hidden="true"/><span>Résumé</span><ArrowUpRight size={10} aria-hidden="true"/></a>
    <footer className={styles.bottom}><button onClick={work} className={styles.explore}>SELECTED WORK<ArrowDown size={14}/></button></footer>
  </section>;
}
