'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './CursorDog.module.css';

type Phase = 'idle' | 'sleeping' | 'resting' | 'carrying' | 'fetching' | 'eating' | 'happy';
type Point = { x: number; y: number };
const PET_PAUSE_MS = 25_000;
const AFTER_MEAL_REST_MS = 10_000;
const HAPPY_MS = 3_000;

function PixelBone() {
  return <svg viewBox="0 0 30 16" width="30" height="16" aria-hidden="true" shapeRendering="crispEdges"><path d="M2 2H7V4H23V2H28V6H26V10H28V14H23V12H7V14H2V10H4V6H2Z" fill="#e8dfc1" stroke="#766f5c" strokeWidth="2"/><path d="M8 6H22V8H8Z" fill="#fff7df"/></svg>;
}
function PixelDog({ sleeping, hasBone }: { sleeping: boolean; hasBone: boolean }) {
  return <svg viewBox="0 0 50 42" width="42" height="35" aria-hidden="true" shapeRendering="crispEdges">
    <ellipse cx="25" cy="40" rx="23" ry="2" fill="#000" opacity=".18"/>
    <g className={styles.tail}><path d="M12 27H7V21H4V12H9V17H12V21H16V27Z" fill="#bd873d"/><path d="M4 9H10V15H4Z" fill="#e6d7ad"/></g>
    <g className={styles.backLeg}><path d="M12 29H19V39H11V36H12Z" fill="#a36c2d"/></g>
    <g className={styles.frontLeg}><path d="M30 28H37V39H30Z" fill="#a36c2d"/></g>
    <path className={styles.body} d="M11 20H32V23H37V33H33V35H13V32H10V24H11Z" fill="#bb8136"/>
    <path d="M14 22H28V25H14Z" fill="#ca9446"/>
    <g className={styles.backLeg}><path d="M11 30H17V37H19V40H10V37H11Z" fill="#c58f43"/><path d="M10 37H19V40H10Z" fill="#dfc995"/></g>
    <g className={styles.frontLeg}><path d="M29 30H35V37H37V40H28V37H29Z" fill="#c58f43"/><path d="M28 37H37V40H28Z" fill="#dfc995"/></g>
    <g className={styles.head}>
      <path d="M25 8H42V11H45V26H42V29H27V26H23V12H25Z" fill="#c38c3e"/>
      <path d="M24 10H29V14H27V25H22V21H21V14H24Z" fill="#97602b"/>
      <path d="M41 10H46V14H48V23H45V26H41Z" fill="#97602b"/>
      <path d="M28 9H40V12H28Z" fill="#d09c4a"/>
      {sleeping ? <path d="M29 18H33V20H29ZM37 18H41V20H37Z" fill="#30281f"/> : <><path d="M30 16H33V20H30ZM38 16H41V20H38Z" fill="#2c2822"/><path d="M30 16H31V17H30ZM38 16H39V17H38Z" fill="#fff3d0"/></>}
      <path d="M31 22H40V29H30V25H31Z" fill="#ead8af"/>
      <path d="M33 22H38V25H33Z" fill="#32291f"/><path d="M35 25H37V27H35Z" fill="#57422b"/>
      {!sleeping && <path d="M35 28H38V30H35Z" fill="#c58c87"/>}
      {hasBone && <g className={styles.mouthBone} transform="translate(24 25) scale(.8)"><path d="M0 0H4V2H17V0H21V4H19V7H21V11H17V9H4V11H0V7H2V4H0Z" fill="#eee3c4" stroke="#756b51" strokeWidth="1.5"/></g>}
    </g>
  </svg>;
}

export default function CursorDog() {
  const [phase, setPhase] = useState<Phase>('idle');
  const pet = useRef<HTMLButtonElement>(null), sprite = useRef<HTMLSpanElement>(null), bone = useRef<HTMLDivElement>(null);
  const controls = useRef({ pick: (_point: Point) => {}, cancel: () => {}, keyboardFeed: () => {}, pet: () => {} });

  useEffect(() => {
    const dog = pet.current, art = sprite.current, food = bone.current;
    if (!dog || !art || !food) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    let current = { x: window.innerWidth - 145, y: window.innerHeight - 20 }, target = { ...current }, lastPointer = { ...current };
    let state: Phase = 'idle', frame = 0, previousTime = 0, idleTimer = 0, armedAt = 0;
    let treat: Point = { ...current }, pickup: Point | null = null, movedBone = false, suppressClickUntil = 0;
    const timers: number[] = [];
    const clamp = (point: Point): Point => ({ x: Math.min(Math.max(point.x, 33), window.innerWidth - 33), y: Math.min(Math.max(point.y, 56), window.innerHeight - 10) });
    const update = (next: Phase) => {
      state = next; setPhase(next);
      document.body.classList.toggle(styles.carryingCursor, next === 'carrying');
    };
    function render() { dog!.style.transform = `translate3d(${current.x - 21}px,${current.y - 35}px,0)`; }
    function renderBone() { food!.style.transform = `translate3d(${treat.x - 15}px,${treat.y - 8}px,0)`; }
    function queue() { if (!frame) frame = requestAnimationFrame(tick); }
    function stopMoving() {
      cancelAnimationFrame(frame); frame = 0; previousTime = 0;
      target = { ...current }; art!.classList.remove(styles.walking);
    }
    function pause(duration: number) {
      clearTimeout(idleTimer); stopMoving(); update('resting');
      timers.push(window.setTimeout(() => {
        if (state !== 'resting') return;
        update('idle'); target = clamp(lastPointer); queue(); rest();
      }, duration));
    }
    function petDog() {
      if (state !== 'idle' && state !== 'sleeping' && state !== 'resting') return;
      timers.forEach(clearTimeout); timers.length = 0;
      if (state === 'resting') { update('idle'); target = clamp(lastPointer); queue(); rest(); return; }
      pause(PET_PAUSE_MS);
    }
    function rest() {
      clearTimeout(idleTimer);
      idleTimer = window.setTimeout(() => { if (state === 'idle') update('sleeping'); }, 3800);
    }
    function cancel() {
      if (state !== 'carrying') return;
      pickup = null; update('idle'); target = clamp(lastPointer); queue(); rest();
    }
    function chew() {
      stopMoving(); update('eating'); clearTimeout(idleTimer);
      timers.push(window.setTimeout(() => {
        update('happy');
        timers.push(window.setTimeout(() => pause(AFTER_MEAL_REST_MS), HAPPY_MS));
      }, 1000));
    }
    function tick(time: number) {
      frame = 0;
      if (state === 'resting' || state === 'eating' || state === 'happy') { previousTime = 0; art!.classList.remove(styles.walking); return; }
      const elapsed = previousTime ? Math.min(time - previousTime, 32) : 16;
      previousTime = time;
      const dx = target.x - current.x, dy = target.y - current.y, distance = Math.hypot(dx, dy);
      art!.classList.toggle(styles.walking, distance > 3 && !reduce.matches);
      if (Math.abs(dx) > 2) art!.style.transform = `scaleX(${dx > 0 ? 1 : -1})`;
      if (distance > 3) {
        const step = reduce.matches ? distance : Math.min(distance, elapsed * .34);
        current = { x: current.x + dx / distance * step, y: current.y + dy / distance * step };
        render(); queue();
      } else {
        previousTime = 0;
        if (state === 'fetching' || (state === 'carrying' && movedBone && Date.now() >= armedAt)) chew();
        else if (state === 'carrying' && movedBone) queue();
      }
    }
    function place(point: Point) {
      treat = clamp(point); renderBone(); pickup = null; update('fetching'); target = clamp({ x: treat.x - 11, y: treat.y + 20 }); queue();
    }
    function pick(point: Point) {
      if (state === 'eating' || state === 'fetching' || state === 'happy') return;
      if (state === 'carrying') { cancel(); return; }
      timers.forEach(clearTimeout); timers.length = 0; clearTimeout(idleTimer);
      treat = clamp(point); pickup = { ...point }; movedBone = false; armedAt = Date.now() + 650;
      update('carrying'); renderBone(); target = clamp({ x: treat.x - 11, y: treat.y + 20 }); queue();
    }
    controls.current = {
      pick, cancel, pet: petDog,
      keyboardFeed: () => {
        if (state === 'carrying') { cancel(); return; }
        if (state === 'eating' || state === 'fetching' || state === 'happy') return;
        clearTimeout(idleTimer); timers.forEach(clearTimeout); timers.length = 0;
        place({ x: current.x + 28, y: current.y - 18 });
      },
    };
    function follow(event: PointerEvent) {
      lastPointer = clamp({ x: event.clientX - 26, y: event.clientY + 46 });
      if (state === 'carrying') {
        if (pickup && Math.hypot(event.clientX - pickup.x, event.clientY - pickup.y) > 12) movedBone = true;
        treat = clamp({ x: event.clientX, y: event.clientY }); renderBone();
        target = clamp({ x: treat.x - 11, y: treat.y + 20 }); queue(); return;
      }
      if (event.pointerType === 'touch' || (state !== 'idle' && state !== 'sleeping')) return;
      if (state === 'sleeping') update('idle');
      const bounds = dog!.getBoundingClientRect();
      const nearDog = event.clientX >= bounds.left - 12 && event.clientX <= bounds.right + 12 && event.clientY >= bounds.top - 12 && event.clientY <= bounds.bottom + 12;
      rest();
      if (nearDog) { stopMoving(); return; }
      if (!reduce.matches) { target = lastPointer; queue(); }
    }
    function down(event: PointerEvent) {
      if (state !== 'carrying' || (event.target as Element).closest('[data-bone-button]')) return;
      event.preventDefault(); event.stopPropagation(); suppressClickUntil = Date.now() + 400;
      place({ x: event.clientX, y: event.clientY });
    }
    function up(event: PointerEvent) {
      if (state === 'carrying' && pickup && (event.pointerType === 'touch' || Math.hypot(event.clientX - pickup.x, event.clientY - pickup.y) > 12)) { suppressClickUntil = Date.now() + 400; place({ x: event.clientX, y: event.clientY }); }
    }
    function click(event: MouseEvent) { const shouldSuppress = event.detail > 0 && Date.now() < suppressClickUntil; suppressClickUntil = 0; if (shouldSuppress) { event.preventDefault(); event.stopPropagation(); } }
    function key(event: KeyboardEvent) { if (event.key === 'Escape' && state === 'carrying') { event.preventDefault(); cancel(); } }
    function resetForPage() {
      timers.forEach(clearTimeout); timers.length = 0; clearTimeout(idleTimer);
      stopMoving(); pickup = null; movedBone = false; suppressClickUntil = 0;
      current = clamp(current); target = { ...current }; render(); update('idle'); rest();
    }
    function resize() { current = clamp(current); target = clamp(target); treat = clamp(treat); render(); renderBone(); }
    render(); dog.style.opacity = '1'; rest();
    window.addEventListener('pointermove', follow, { passive: true });
    window.addEventListener('pointerdown', down, true); window.addEventListener('pointerup', up); window.addEventListener('pointercancel', cancel); window.addEventListener('blur', cancel); window.addEventListener('portfolio:pagechange', resetForPage);
    window.addEventListener('click', click, true); window.addEventListener('keydown', key); window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(frame); clearTimeout(idleTimer); timers.forEach(clearTimeout);
      document.body.classList.remove(styles.carryingCursor);
      window.removeEventListener('pointermove', follow); window.removeEventListener('pointerdown', down, true);
      window.removeEventListener('pointerup', up); window.removeEventListener('pointercancel', cancel); window.removeEventListener('blur', cancel); window.removeEventListener('portfolio:pagechange', resetForPage); window.removeEventListener('click', click, true); window.removeEventListener('keydown', key); window.removeEventListener('resize', resize);
      controls.current = { pick: () => {}, cancel: () => {}, keyboardFeed: () => {}, pet: () => {} };
    };
  }, []);

  const busy = phase === 'fetching' || phase === 'eating' || phase === 'happy';
  const asleep = phase === 'sleeping' || phase === 'resting';
  const hint = phase === 'carrying' ? 'Move the bone · click to drop · Esc to cancel' : phase === 'fetching' ? 'Here I come…' : phase === 'eating' ? 'Nom nom…' : phase === 'happy' ? 'One happy pup' : phase === 'resting' ? 'Taking a break · tap to wake' : 'Pick up a bone';
  return <>
    <div className={styles.scene}>
      <div ref={bone} className={styles.food} aria-hidden="true" hidden={phase !== 'carrying' && phase !== 'fetching'}><PixelBone/></div>
      <button type="button" ref={pet} className={`${styles.pet} ${asleep ? styles.sleeping : ''} ${phase === 'happy' ? styles.happy : ''} ${phase === 'eating' ? styles.eating : ''}`} data-dog-state={phase} aria-label={phase === 'resting' ? 'Wake the dog' : 'Pet the dog and pause it for 25 seconds'} title={phase === 'resting' ? 'Tap to wake me' : 'Pet me for a little break'} aria-disabled={phase !== 'idle' && phase !== 'sleeping' && phase !== 'resting'}
        onPointerDown={event => { if (event.button === 0) controls.current.pet(); }} onClick={event => { if (event.detail === 0) controls.current.pet(); }}>
        {phase === 'happy' && <span className={styles.hearts} aria-hidden="true"><span className={styles.heart} data-dog-heart>♥</span><span className={styles.heart} data-dog-heart>♥</span><span className={styles.heart} data-dog-heart>♥</span></span>}
        {asleep && <span className={styles.sleep} aria-hidden="true">z<span>z</span></span>}
        <span ref={sprite} className={styles.sprite}><PixelDog sleeping={asleep} hasBone={phase === 'eating' || phase === 'happy'}/></span>
      </button>
    </div>
    <div className={styles.feeder}>
      <span className={styles.hint}>{hint}</span>
      <button data-bone-button className={`${styles.boneButton} ${phase === 'carrying' ? styles.selected : ''}`} disabled={busy} aria-label={phase === 'carrying' ? 'Cancel feeding' : busy ? 'Dog is enjoying its treat' : 'Pick up a bone to feed the dog'} aria-pressed={phase === 'carrying'}
        onPointerDown={event => { if (event.button !== 0) return; event.currentTarget.setPointerCapture(event.pointerId); controls.current.pick({ x: event.clientX, y: event.clientY }); }}
        onClick={event => { if (event.detail === 0) controls.current.keyboardFeed(); }}><PixelBone/></button>
    </div>
    <span className={styles.srOnly} role="status">{phase === 'happy' ? 'The dog loved its bone! Three hearts for you.' : phase === 'resting' ? 'The dog is resting. Tap it or pick up a bone to wake it, or wait for its break to finish.' : phase === 'carrying' ? 'Bone picked up. Move your pointer to lead the dog, then click to drop the bone. Press Escape to cancel.' : phase === 'eating' ? 'The dog is chewing its bone.' : ''}</span>
  </>;
}
