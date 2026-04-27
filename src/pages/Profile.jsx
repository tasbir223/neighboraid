import { useState, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { supabase } from '../supabase'
import PostCard from '../components/PostCard'
import { Button, Alert, Tabs, FormGroup, FormRow, Card, Divider, EmptyState } from '../components/UI'
import styles from './Profile.module.css'

const COLORS = ['#2D1F0E','#6B8F71','#8B5E3C','#1A567A','#7A1A4A','#4A2E8A','#7A4F00','#C0392B']

export default function Profile() {
  const { user, profile, logout, posts, deletePost, markComplete, fetchProfile } = useApp()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [tab, setTab] = useState(searchParams.get('tab') || 'posts')
  const [alert, setAlert] = useState(null)
  const [saving, setSaving] = useState(false)
  const [name, setName] = useState(profile?.name || '')
  const [bio, setBio] = useState(profile?.bio || '')
  const [location, setLocation] = useState(profile?.location || '')
  const [avatarColor, setAvatarColor] = useState(profile?.avatar_color || '#2D1F0E')
  const [avatarPreview, setAvatarPreview] = useState(profile?.avatar_url || null)
  const fileRef = useRef()

  if (!user) { navigate('/login'); return null }

  const myPosts = posts.filter(p => p.uid === user.id)

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    const preview = URL.createObjectURL(file)
    setAvatarPreview(preview)

    const ext = file.name.split('.').pop()
    const path = `${user.id}/avatar.${ext}`
    const { error } = await supabase.storage.from('avatars').upload(path, file, { upsert: true })
    if (!error) {
      const { data } = supabase.storage.from('avatars').getPublicUrl(path)
      await supabase.from('profiles').update({ avatar_url: data.publicUrl }).eq('id', user.id)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const { error } = await supabase.from('profiles').update({
        name: name.trim(),
        bio: bio.trim(),
        location: location.trim(),
        avatar_color: avatarColor,
      }).eq('id', user.id)

      if (error) throw error
      setAlert({ type: 'success', message: 'Profile updated successfully!' })
      setTimeout(() => setAlert(null), 3000)
    } catch (err) {
      setAlert({ type: 'error', message: err.message || 'Failed to save. Try again.' })
    } finally {
      setSaving(false)
    }
  }

  const tabOptions = [
    { value: 'posts', label: 'My Posts' },
    { value: 'settings', label: 'Edit Profile' },
    { value: 'account', label: 'Account' },
  ]

  const initials = (profile?.name || user.email)?.[0]?.toUpperCase()

  return (
    <div className={styles.page}>
      <div className={styles.wide}>
        {alert && <Alert type={alert.type} message={alert.message} />}

        {/* Profile Header */}
        <div className={styles.profileHeader}>
          <div className={styles.avatarWrap}>
            <div
              className={styles.avatarLg}
              style={{ background: avatarColor }}
              onClick={() => tab === 'settings' && fileRef.current?.click()}
            >
              {avatarPreview
                ? <img src={avatarPreview} alt="avatar" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                : initials
              }
            </div>
            {tab === 'settings' && (
              <button className={styles.avatarEdit} onClick={() => fileRef.current?.click()}>✏️</button>
            )}
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarChange} />
          </div>

          <div className={styles.profileInfo}>
            <h2>{profile?.name || 'User'}</h2>
            {profile?.bio && <p className={styles.bio}>{profile.bio}</p>}
            {profile?.location && <p className={styles.locationText}>📍 {profile.location}</p>}
            <p className={styles.meta}>{myPosts.length} post{myPosts.length !== 1 ? 's' : ''} · Joined {new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
          </div>

          <Button variant="outline" onClick={handleLogout}>Log out</Button>
        </div>

        <Tabs options={tabOptions} value={tab} onChange={setTab} />

        {/* My Posts Tab */}
        {tab === 'posts' && (
          myPosts.length === 0 ? (
            <EmptyState
              icon="📋"
              message="You haven't posted anything yet."
              action={<Button variant="primary" onClick={() => navigate('/post')}>Create a post</Button>}
            />
          ) : (
            <div className={styles.grid}>
              {myPosts.map(p => (
                <PostCard key={p.id} post={p} editable onDelete={deletePost} onComplete={markComplete} />
              ))}
            </div>
          )
        )}

        {/* Edit Profile Tab */}
        {tab === 'settings' && (
          <Card style={{ maxWidth: '520px', padding: '28px' }}>
            <h3 className={styles.sectionTitle}>Edit Profile</h3>

            <div className={styles.colorPicker}>
              <label className={styles.colorLabel}>Avatar color</label>
              <div className={styles.colors}>
                {COLORS.map(c => (
                  <div
                    key={c}
                    className={`${styles.colorSwatch} ${avatarColor === c ? styles.colorActive : ''}`}
                    style={{ background: c }}
                    onClick={() => setAvatarColor(c)}
                  />
                ))}
              </div>
            </div>

            <FormGroup label="Full name">
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Your full name" />
            </FormGroup>

            <FormGroup label="Bio">
              <textarea value={bio} onChange={e => setBio(e.target.value)} placeholder="Tell your community a bit about yourself..." style={{ minHeight: '80px' }} />
            </FormGroup>

            <FormGroup label="Location">
              <input type="text" value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. Brooklyn, NY" />
            </FormGroup>

            <Divider />

            <Button variant="primary" fullWidth onClick={handleSave} style={{ padding: '13px', borderRadius: '12px' }}>
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </Card>
        )}

        {/* Account Tab */}
        {tab === 'account' && (
          <Card style={{ maxWidth: '480px', padding: '28px' }}>
            <h3 className={styles.sectionTitle}>Account</h3>

            <FormGroup label="Email">
              <input type="email" value={user.email} readOnly style={{ background: '#f9f9f9', cursor: 'not-allowed' }} />
            </FormGroup>

            <div className={styles.infoNote}>
              To change your email or password, please contact support or use the forgot password option on the login page.
            </div>

            <Divider />

            <div className={styles.dangerZone}>
              <h4>Danger zone</h4>
              <p>Logging out will end your session on this device.</p>
              <Button variant="danger" onClick={handleLogout}>Log out of account</Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
