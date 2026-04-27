import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { TypeTag, CatTag, Button, Alert, FormGroup, Divider } from './UI'
import styles from './Modal.module.css'

export default function PostDetailModal({ post, onClose }) {
  const { user, reportPost, sendMessage } = useApp()
  const [showContact, setShowContact] = useState(false)
  const [msgBody, setMsgBody] = useState('')
  const [msgContact, setMsgContact] = useState('')
  const [alert, setAlert] = useState(null)
  const [reported, setReported] = useState(false)
  const [loading, setLoading] = useState(false)

  const isOwner = user && user.id === post.uid

  const handleSend = async () => {
    if (!msgBody.trim() || !msgContact.trim()) {
      setAlert({ type: 'error', message: 'Please fill in all fields.' })
      return
    }
    setLoading(true)
    try {
      await sendMessage(post.id, user?.email || 'Anonymous', msgContact, msgBody)
      setAlert({ type: 'success', message: 'Message sent! The poster will be in touch.' })
      setMsgBody('')
      setMsgContact('')
    } catch {
      setAlert({ type: 'error', message: 'Failed to send. Try again.' })
    } finally {
      setLoading(false)
    }
  }

  const handleReport = async () => {
    await reportPost(post.id)
    setReported(true)
  }

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={`${styles.modal} fade-in`}>
        <button className={styles.close} onClick={onClose}>✕</button>
        <div className={styles.tags}>
          <TypeTag type={post.type} />
          <CatTag cat={post.cat} />
        </div>
        <h2 className={styles.title}>{post.title}</h2>
        <p className={styles.desc}>{post.desc}</p>
        <div className={styles.meta}>📍 {post.loc}</div>
        <div className={styles.meta}>👤 Posted by {post.user} · {post.date}</div>
        <Divider />

        {isOwner ? (
          <p style={{ fontSize: '13px', color: 'var(--muted)' }}>This is your post.</p>
        ) : (
          <>
            {!showContact ? (
              <>
                <h3 className={styles.subhead}>Reach out</h3>
                <div className={styles.meta}>📧 {post.contact}</div>
                <Button variant="sage" onClick={() => setShowContact(true)}>Send a message</Button>
              </>
            ) : (
              <div className={styles.contactForm}>
                <h3 className={styles.subhead}>Message {post.user}</h3>
                <Alert type={alert?.type} message={alert?.message} />
                <FormGroup label="Your message">
                  <textarea value={msgBody} onChange={e => setMsgBody(e.target.value)} placeholder="Introduce yourself and explain how you can help..." />
                </FormGroup>
                <FormGroup label="Your contact info">
                  <input type="text" value={msgContact} onChange={e => setMsgContact(e.target.value)} placeholder="Email or phone number" />
                </FormGroup>
                <Button variant="primary" fullWidth onClick={handleSend}>
                  {loading ? 'Sending...' : 'Send Message'}
                </Button>
              </div>
            )}
            {!reported
              ? <button className={styles.reportBtn} onClick={handleReport}>⚑ Report this post</button>
              : <span className={styles.reported}>Reported — our team will review it.</span>
            }
          </>
        )}
      </div>
    </div>
  )
}
