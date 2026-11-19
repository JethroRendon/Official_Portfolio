import styles from './ProjectShowcase.module.css';

const symbols: Record<string, { id: string; color?: string }> = {
 'Next.js': { id: 'nextdotjs' },
 'React Native': { id: 'react', color: '#61dafb' },
 React: { id: 'react', color: '#61dafb' },
 TypeScript: { id: 'typescript', color: '#3178c6' },
 JavaScript: { id: 'javascript', color: '#f7df1e' },
 CSS: { id: 'css', color: '#663399' },
 'Socket.IO': { id: 'socketdotio' },
 Flutter: { id: 'flutter', color: '#02569b' },
 Dart: { id: 'dart', color: '#0175c2' },
 GitHub: { id: 'github' },
 HTML: { id: 'html5', color: '#e34f26' },
 'C++': { id: 'cplusplus', color: '#00599c' },
 Vite: { id: 'vite', color: '#646cff' },
 'Tailwind CSS': { id: 'tailwindcss', color: '#06b6d4' },
 Flask: { id: 'flask' },
 'Google Colab': { id: 'googlecolab', color: '#f9ab00' },
 'Gemini API': { id: 'googlegemini', color: '#4285f4' },
 OpenRouter: { id: 'openrouter' },
 'OpenRouter models': { id: 'openrouter' },
 'Vercel AI SDK': { id: 'vercel' },
 Git: { id: 'git', color: '#f05032' },
 'Git / GitHub': { id: 'github' },
};
const assets: Record<string, string> = {
 Expo: 'expo.svg', Convex: 'convex.svg', Figma: 'figma.svg',
 'Three.js': 'threejs.png', Python: 'python.svg', Firebase: 'firebase.png',
 Java: 'java.png', Firestore: 'firestore.svg', 'OpenAI API': 'openai.svg', Codex: 'codex.png',
};

export default function TechnologyLogo({ name, className = '', tone = 'theme' }: { name: string; className?: string; tone?: 'theme' | 'dark' }) {
 const asset = assets[name];
 const symbol = symbols[name];
 if (!asset && !symbol) return null;
 return <span className={`${styles.technologyLogo} ${name === 'Expo' ? styles.logoPlate : ''} ${className}`} aria-hidden="true">
  {asset ? <img className={name === 'Figma' ? styles.paddedBrandLogo : undefined} src={`/brand-logos/${asset}`} alt="" width={20} height={20} decoding="async"/> : <svg viewBox="0 0 24 24" width={19} height={19} fill="currentColor" style={{ color: symbol.color || (tone === 'dark' ? '#202124' : 'var(--text)') }}><use href={`/toolkit-icons.svg#${symbol.id}`}/></svg>}
 </span>;
}
