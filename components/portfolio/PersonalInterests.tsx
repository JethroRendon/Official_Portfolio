import { Activity, Compass, Shirt } from 'lucide-react';
import styles from './PersonalInterests.module.css';

const personalInterests = [
 { title: 'Outdoors & underwater', file: 'adventures.md', icon: Compass, tags: ['Travel', 'Beaches', 'Freediving', 'Hiking'], description: 'Outside of coding and community work, I love travelling and spending time outdoors. The beach is one of my favorite places, whether I’m enjoying the view or exploring underwater through freediving. I also love hiking, discovering new places, and enjoying the journey along the way.' },
 { title: 'Style & self-expression', file: 'style.css', icon: Shirt, tags: ['Outfits', 'Personal style'], description: 'Fashion is another way I express myself. I enjoy putting outfits together, exploring different styles, and wearing clothes that reflect my personality, whether for an ordinary day, a special occasion, or my next trip.' },
 { title: 'Always in motion', file: 'playbook.md', icon: Activity, tags: ['Volleyball', 'Basketball', 'Jogging'], description: 'Staying active is a big part of my life. I especially enjoy volleyball and basketball, but I’m always up for trying other sports. I also enjoy jogging. Staying active and spending time outdoors make me feel alive. Whether I’m building a project, helping organize a community event, or heading out on an adventure, I value opportunities to learn, connect with people, and try something new.' },
];

export default function PersonalInterests() {
 return (
  <section className={styles.personal} aria-labelledby="sidequest-personal-heading">
   <div className={styles.sectionHeading}><h2 id="sidequest-personal-heading">Outside the editor</h2><p>Travel, personal style, and staying active.</p></div>
   <div className={styles.personalGrid}>{personalInterests.map((interest, index) => { const Icon = interest.icon; return <article className={styles.personalCard} key={interest.file}>
    <div className={styles.personalBar}><span><Icon size={13} aria-hidden="true"/>{interest.file}</span><span>0{index + 1}</span></div>
    <div className={styles.personalBody}><span className={styles.personalIcon} aria-hidden="true"><Icon size={20} strokeWidth={1.5}/></span><h3>{interest.title}</h3><p>{interest.description}</p></div>
    <div className={styles.personalTags}>{interest.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
   </article>; })}</div>
  </section>
 );
}
