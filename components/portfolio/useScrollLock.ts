'use client';

import { useEffect } from 'react';

// Menus and dialogs can overlap briefly while React changes sections.
const locks = new Set<symbol>();
let previousBody = '', previousRoot = '';

export default function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const token = Symbol('scroll-lock');
    if (!locks.size) {
      previousBody = document.body.style.overflow;
      previousRoot = document.documentElement.style.overflow;
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    }
    locks.add(token);
    return () => {
      locks.delete(token);
      if (!locks.size) {
        document.body.style.overflow = previousBody;
        document.documentElement.style.overflow = previousRoot;
      }
    };
  }, [active]);
}
