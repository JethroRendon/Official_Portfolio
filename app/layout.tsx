import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
 title: 'Jethro A. Rendon | AI, Web & Mobile Developer',
 description: 'Jethro A. Rendon — Computer Science student majoring in Artificial Intelligence at WVSU, web and mobile developer, and SK Chairman of Barangay Poblacion.',
 metadataBase: new URL('https://janay-developer-workspace.vivaciousdeer3.chatgpt.site'),
 openGraph: { title: 'Jethro A. Rendon — Developer Workspace', description: 'AI, web and mobile development, and youth leadership.', type: 'website' },
 icons: { icon: '/favicon.svg' },
};
export default function RootLayout({ children }: { children: React.ReactNode }) { return <html lang="en"><body>{children}</body></html>; }
