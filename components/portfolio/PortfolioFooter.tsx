import { MessageCircle } from 'lucide-react';
import type { View } from './Explorer';
import styles from './PortfolioFooter.module.css';

export default function PortfolioFooter({ navigate, compact = false }: { navigate: (view: View) => void; compact?: boolean }) {
 function toTop() { window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' }); }
 return <footer className={`${styles.footer} ${compact ? styles.compact : ''}`}>
  {!compact && <div className={styles.contactPanel}><div><p>Have something in mind?</p><button className={styles.contactButton} type="button" onClick={() => navigate('contact')}><span>Let’s talk.</span><span className={styles.contactIcon}><MessageCircle size={24} strokeWidth={1.5} aria-hidden="true"/></span></button></div><div className={styles.signatureArt} aria-hidden="true"><span/><span/><img src="/jethro-profile.webp" alt="" width={74} height={74}/></div></div>}
  <div className={styles.bottom}><div className={styles.signature}><img src="/jethro-profile.webp" alt="" width={34} height={34}/><div><strong>Jethro A. Rendon</strong><span>Built with care. Always a work in progress.</span></div></div><button className={styles.toTop} type="button" onClick={toTop}>Back to top</button></div>
 </footer>;
}
