import styles from './UI.module.css';

export function Button({ children, variant = 'primary', onClick, type = 'button', fullWidth, style }) {
  return (
    <button
      type={type}
      className={`${styles.btn} ${styles[variant]} ${fullWidth ? styles.fullWidth : ''}`}
      onClick={onClick}
      style={style}
    >
      {children}
    </button>
  );
}

export function Alert({ type, message }) {
  if (!message) return null;
  return <div className={`${styles.alert} ${styles[`alert_${type}`]}`}>{message}</div>;
}

export function Tag({ children, variant }) {
  return <span className={`${styles.tag} ${styles[`tag_${variant}`]}`}>{children}</span>;
}

export function TypeTag({ type }) {
  return <Tag variant={type}>{type === 'request' ? 'Request' : 'Offer'}</Tag>;
}

export function CatTag({ cat }) {
  const key = cat.replace(/\s+/g, '_').toLowerCase();
  return <span className={`${styles.tag} ${styles[`cat_${key}`]}`}>{cat}</span>;
}

export function Label({ children }) {
  return <label className={styles.label}>{children}</label>;
}

export function FormGroup({ label, children }) {
  return (
    <div className={styles.formGroup}>
      {label && <Label>{label}</Label>}
      {children}
    </div>
  );
}

export function FormRow({ children }) {
  return <div className={styles.formRow}>{children}</div>;
}

export function Divider() {
  return <div className={styles.divider} />;
}

export function Card({ children, style, className }) {
  return <div className={`${styles.card} ${className || ''}`} style={style}>{children}</div>;
}

export function Tabs({ options, value, onChange }) {
  return (
    <div className={styles.tabs}>
      {options.map(o => (
        <button
          key={o.value}
          className={`${styles.tab} ${value === o.value ? styles.tabActive : ''}`}
          onClick={() => onChange(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function EmptyState({ icon, message, action }) {
  return (
    <div className={styles.emptyState}>
      <div className={styles.emptyIcon}>{icon}</div>
      <p>{message}</p>
      {action}
    </div>
  );
}

export function Avatar({ name, size = 'sm' }) {
  return (
    <div className={`${styles.avatar} ${styles[`avatar_${size}`]}`}>
      {name?.[0]?.toUpperCase()}
    </div>
  );
}
