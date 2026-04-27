import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import PostCard from '../components/PostCard';
import styles from './Landing.module.css';

const features = [
  { icon: '📚', title: 'Tutoring', desc: 'Academic help for all ages and subjects' },
  { icon: '🥕', title: 'Food Sharing', desc: 'Share produce, meals, and groceries' },
  { icon: '📦', title: 'Moving Help', desc: 'Extra hands when moving day arrives' },
  { icon: '🛒', title: 'Errands', desc: 'Help neighbors with everyday tasks' },
];

export default function Landing() {
  const { posts, user } = useApp();
  const recent = [...posts].reverse().slice(0, 3);
  const reqCount = posts.filter(p => p.type === 'request').length;
  const offCount = posts.filter(p => p.type === 'offer').length;
  const memCount = [...new Set(posts.map(p => p.uid))].length + 1;

  return (
    <div className={styles.page}>
      <section className={`${styles.hero} fade-up`}>
        <h1>Your neighbors<br />are <em>here to help</em></h1>
        <p>Connect with people in your community who need help or who are ready to give it. Tutoring, food, moving, errands and more.</p>
        <div className={styles.heroBtns}>
          <Link to="/browse" className={styles.btnPrimary}>Browse Posts</Link>
          <Link to={user ? '/post' : '/signup'} className={styles.btnOutline}>
            {user ? 'Post Help' : 'Join Community'}
          </Link>
        </div>
        <div className={styles.stats}>
          <div className={styles.stat}><div className={styles.statNum}>{reqCount}</div><div className={styles.statLabel}>Help Requests</div></div>
          <div className={styles.stat}><div className={styles.statNum}>{offCount}</div><div className={styles.statLabel}>Offers of Help</div></div>
          <div className={styles.stat}><div className={styles.statNum}>{memCount}</div><div className={styles.statLabel}>Members</div></div>
        </div>
      </section>

      <div className={styles.wide}>
        <div className={styles.featureGrid}>
          {features.map(f => (
            <div key={f.title} className={styles.featureCard}>
              <div className={styles.featureIcon}>{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>

        <h2 className={styles.sectionTitle}>Recent Posts</h2>
        <p className={styles.sectionSub}>What your community needs — and what they're offering</p>
        <div className={styles.grid}>
          {recent.map(p => <PostCard key={p.id} post={p} />)}
        </div>
        <div className={styles.seeAll}>
          <Link to="/browse" className={styles.btnOutline}>See all posts →</Link>
        </div>
      </div>
    </div>
  );
}
