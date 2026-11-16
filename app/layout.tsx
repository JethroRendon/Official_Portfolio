import type { Metadata } from 'next';
import './globals.css';
import './theme.css';
export const metadata: Metadata = {
 title: 'Jethro A. Rendon | AI, Web & Mobile Developer',
 description: 'Jethro A. Rendon — Computer Science student majoring in Artificial Intelligence at WVSU, web and mobile developer, and SK Chairman of Barangay Poblacion.',
 metadataBase: new URL('https://janay-developer-workspace.vivaciousdeer3.chatgpt.site'),
 openGraph: { title: 'Jethro A. Rendon — Developer Workspace', description: 'AI, web and mobile development, and youth leadership.', type: 'website' },
 icons: { icon: '/favicon.svg' },
};
export default function RootLayout({ children }: { children: React.ReactNode }) { return <html lang="en" data-theme="dark" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{__html:'try{var t=localStorage.getItem("jethro-portfolio-theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t;}catch{}'}}/></head><body>{children}</body></html>; }
