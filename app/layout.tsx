import type { Metadata, Viewport } from 'next';
import './globals.css';
import './theme.css';
export const viewport: Viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover', interactiveWidget: 'resizes-content' };
export const metadata: Metadata = {
 title: 'Jethro A. Rendon | AI, Web & Mobile Developer',
 description: 'Jethro A. Rendon — Computer Science student majoring in Artificial Intelligence at WVSU, web and mobile developer, and SK Chairman of Barangay Poblacion.',
 metadataBase: new URL('https://supremo-rnj.vivaciousdeer3.chatgpt.site'),
 openGraph: { title: 'Jethro A. Rendon — Developer Workspace', description: 'AI, web and mobile development, and youth leadership.', type: 'website' },
 icons: { icon: [{ url: '/favicon.ico?v=lego-20261120', sizes: 'any' }, { url: '/profile-icon.png?v=lego-20261120', type: 'image/png', sizes: '64x64' }], shortcut: '/favicon.ico?v=lego-20261120', apple: '/apple-touch-icon.png?v=lego-20261120' },
};
export default function RootLayout({ children }: { children: React.ReactNode }) { return <html lang="en" data-theme="dark" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{__html:'try{var t=localStorage.getItem("jethro-portfolio-theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t;}catch{}'}}/></head><body>{children}</body></html>; }
