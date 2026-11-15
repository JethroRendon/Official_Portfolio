import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
 title: 'Jethro A. Rendon | AI, Web & Mobile Developer',
 description: 'Jethro A. Rendon — Computer Science student majoring in Artificial Intelligence at WVSU, web and mobile developer, and SK Chairman of Barangay Poblacion.',
 metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'http://localhost:3000')),
 openGraph: { title: 'Jethro A. Rendon — Developer Workspace', description: 'AI, web and mobile development, and youth leadership.', type: 'website' },
 icons: { icon: '/favicon.svg' },
};
export default function RootLayout({ children }: { children: React.ReactNode }) { return <html lang="en"><body>{children}</body></html>; }
