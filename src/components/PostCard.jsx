import { useState } from 'react';
import { TypeTag, CatTag, Button } from './UI';
import PostDetailModal from './PostDetailModal';
import styles from './PostCard.module.css';

export default function PostCard({ post, editable, onDelete, onComplete }) {
  const [showDetail, setShowDetail] = useState(false);

  return (
    <>
      <div className={styles.card} onClick={!editable ? () => setShowDetail(true) : undefined} style={!editable ? { cursor: 'pointer' } : {}}>
        <div className={styles.header}>
          <div className={styles.title}>{post.title}</div>
          <TypeTag type={post.type} />
        </div>
        <p className={styles.desc}>{post.desc}</p>
        <div className={styles.catRow}>
          <CatTag cat={post.cat} />
        </div>
        <div className={styles.footer}>
          <span>📍 {post.loc}</span>
          <span>👤 {post.user} · {post.date}</span>
        </div>
        {editable && (
          <div className={styles.actions}>
            <Button variant="danger" onClick={() => onDelete(post.id)}>Delete</Button>
            <Button variant="outline" style={{ fontSize: '12px', padding: '6px 14px' }} onClick={() => onComplete(post.id)}>
              Mark complete ✓
            </Button>
          </div>
        )}
      </div>

      {showDetail && (
        <PostDetailModal post={post} onClose={() => setShowDetail(false)} />
      )}
    </>
  );
}
