import { useState } from 'react'
import emailjs from '@emailjs/browser'
import { supabase } from '../supabase'
import { Button, Alert, FormGroup, Card } from '../components/UI'
import styles from './Contact.module.css'

const SERVICE_ID = 'service_tfzy0s1'
const TEMPLATE_ID = 'template_llajx9n'
const PUBLIC_KEY = 'Lqs9jcJ-fhHtt3-F_'

export default function Contact() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [alert, setAlert] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!name.trim() || !email.trim() || !message.trim()) {
      setAlert({ type: 'error', message: 'Please fill in all fields.' })
      return
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setAlert({ type: 'error', message: 'Please enter a valid email address.' })
      return
    }

    setLoading(true)
    try {
      // 1. Send email via EmailJS
      await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        {
          from_name: name.trim(),
          from_email: email.trim(),
          email: email.trim(),
          name: name.trim(),
          message: message.trim(),
          reply_to: email.trim(),
          to_name: 'NeighborAid',
        },
        PUBLIC_KEY
      )

      // 2. Save to Supabase as backup
      await supabase.from('contact_messages').insert({
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
      })

      setAlert({ type: 'success', message: "Message sent! We'll get back to you within 24 hours." })
      setName('')
      setEmail('')
      setMessage('')
    } catch (err) {
      console.error(err)
      setAlert({ type: 'error', message: 'Failed to send message. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.center}>
        <h2 className={styles.title}>Contact Us</h2>
        <p className={styles.sub}>Questions, feedback, or need platform support?</p>

        <Alert type={alert?.type} message={alert?.message} />

        <Card style={{ marginBottom: '16px' }}>
          <FormGroup label="Your name">
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Jane Smith"
            />
          </FormGroup>
          <FormGroup label="Email">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </FormGroup>
          <FormGroup label="Message">
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="How can we help?"
            />
          </FormGroup>
          <Button
            variant="primary"
            fullWidth
            onClick={handleSubmit}
            style={{ padding: '13px', borderRadius: '12px' }}
          >
            {loading ? 'Sending...' : 'Send Message'}
          </Button>
        </Card>

        <Card style={{ background: 'var(--sage-light)' }}>
          <h3 className={styles.aboutTitle}>About NeighborAid</h3>
          <p className={styles.aboutText}>
            NeighborAid connects people who need help with those willing to give it.
            Our goal is to strengthen local bonds through everyday acts of community
            kindness — from tutoring and food sharing to moving help and errands.
          </p>
          <div className={styles.contactInfo}>
            <div className={styles.contactItem}>📧 neighboraid.app@gmail.com</div>
            <div className={styles.contactItem}>📍 Serving communities everywhere</div>
          </div>
        </Card>
      </div>
    </div>
  )
}
