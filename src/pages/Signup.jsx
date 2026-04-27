import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { Button, Alert, FormGroup, FormRow } from '../components/UI'
import styles from './Auth.module.css'

export default function Signup() {
  const { signup } = useApp()
  const navigate = useNavigate()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [alert, setAlert] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSignup = async () => {
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !password.trim()) {
      setAlert({ type: 'error', message: 'Please fill in all fields.' })
      return
    }
    if (password.length < 6) {
      setAlert({ type: 'error', message: 'Password must be at least 6 characters.' })
      return
    }
    setLoading(true)
    try {
      await signup(firstName.trim(), lastName.trim(), email.trim(), password)
      setAlert({ type: 'success', message: 'Account created! Check your email to confirm, then log in.' })
      setTimeout(() => navigate('/login'), 2000)
    } catch (err) {
      setAlert({ type: 'error', message: err.message || 'Signup failed. Try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h2 className={styles.heading}>Join the community</h2>
        <p className={styles.sub}>Create your free NeighborAid account</p>
        <Alert type={alert?.type} message={alert?.message} />
        <FormRow>
          <FormGroup label="First name">
            <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Jane" />
          </FormGroup>
          <FormGroup label="Last name">
            <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Smith" />
          </FormGroup>
        </FormRow>
        <FormGroup label="Email">
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
        </FormGroup>
        <FormGroup label="Password">
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Choose a password (min. 6 characters)" />
        </FormGroup>
        <Button variant="primary" fullWidth onClick={handleSignup} style={{ padding: '13px', fontSize: '15px', borderRadius: '12px', marginTop: '4px' }}>
          {loading ? 'Creating account...' : 'Create account'}
        </Button>
        <div className={styles.switch}>
          Already have an account? <Link to="/login">Log in</Link>
        </div>
      </div>
    </div>
  )
}
