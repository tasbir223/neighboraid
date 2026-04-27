import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import styles from './Navbar.module.css'

export default function Navbar() {
  const { user, profile, logout } = useApp()
  const location = useLocation()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const isActive = (path) => location.pathname === path

  const handleLogout = async () => {
    setMenuOpen(false)
    await logout()
    navigate('/')
  }

  return (
    <nav className={styles.nav}>
      <Link to="/" className={styles.logo}>
        <div className={styles.logoIcon}>🤝</div>
        NeighborAid
      </Link>

      <div className={styles.links}>
        <Link to="/browse" className={`${styles.link} ${isActive('/browse') ? styles.active : ''}`}>Browse</Link>
        {user && <Link to="/post" className={`${styles.link} ${isActive('/post') ? styles.active : ''}`}>Post Help</Link>}
        <Link to="/contact" className={`${styles.link} ${isActive('/contact') ? styles.active : ''}`}>Contact</Link>

        {user ? (
          <div className={styles.userMenu}>
            <div
              className={styles.avatar}
              onClick={() => setMenuOpen(o => !o)}
              style={{ background: profile?.avatar_color || 'var(--brown)' }}
            >
              {profile?.avatar_url
                ? <img src={profile.avatar_url} alt="avatar" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                : (profile?.name || user.email)?.[0]?.toUpperCase()
              }
            </div>
            {menuOpen && (
              <div className={styles.dropdown}>
                <div className={styles.dropdownHeader}>
                  <div className={styles.dropdownName}>{profile?.name || 'User'}</div>
                  <div className={styles.dropdownEmail}>{user.email}</div>
                </div>
                <div className={styles.dropdownDivider} />
                <button className={styles.dropdownItem} onClick={() => { setMenuOpen(false); navigate('/profile') }}>👤 My Profile</button>
                <button className={styles.dropdownItem} onClick={() => { setMenuOpen(false); navigate('/profile?tab=posts') }}>📋 My Posts</button>
                <button className={styles.dropdownItem} onClick={() => { setMenuOpen(false); navigate('/profile?tab=settings') }}>⚙️ Settings</button>
                <div className={styles.dropdownDivider} />
                <button className={`${styles.dropdownItem} ${styles.dropdownLogout}`} onClick={handleLogout}>🚪 Log out</button>
              </div>
            )}
          </div>
        ) : (
          <div className={styles.authBtns}>
            <Link to="/login" className={styles.btnOutline}>Log in</Link>
            <Link to="/signup" className={styles.btnPrimary}>Sign up</Link>
          </div>
        )}
      </div>
    </nav>
  )
}
