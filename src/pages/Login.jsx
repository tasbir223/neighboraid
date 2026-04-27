import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { supabase } from '../supabase'
import { Button, Alert, FormGroup } from '../components/UI'
import styles from './Auth.module.css'

export default function Login() {
  const { login } = useApp()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [alert, setAlert] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showReset, setShowReset] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const [resetLoading, setResetLoading] = useState(false)

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setAlert({ type: 'error', message: 'Please fill in all fields.' })
      return
    }
    setLoading(true)
    try {
      await login(email.trim(), password)
      navigate('/')
    } catch (err) {
      setAlert({ type: 'error', message: err.message || 'Login failed. Check your email and password.' })
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordReset = async () => {
    if (!resetEmail.trim()) {
      setAlert({ type: 'error', message: 'Please enter your email address.' })
      return
    }
    setResetLoading(true)
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail.trim(), {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      if (error) throw error
      setAlert({ type: 'success', message: 'Password reset email sent! Check your inbox.' })
      setShowReset(false)
    } catch (err) {
      setAlert({ type: 'error', message: err.message || 'Failed to send reset email. Try again.' })
    } finally {
      setResetLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        {!showReset ? (
          <>
            <h2 className={styles.heading}>Welcome back</h2>
            <p className={styles.sub}>Sign in to your NeighborAid account</p>
            <Alert type={alert?.type} message={alert?.message} />
            <FormGroup label="Email">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
              />
            </FormGroup>
            <FormGroup label="Password">
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Your password"
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
              />
            </FormGroup>
            <Button variant="primary" fullWidth onClick={handleLogin} style={{ padding: '13px', fontSize: '15px', borderRadius: '12px', marginTop: '4px' }}>
              {loading ? 'Logging in...' : 'Log in'}
            </Button>
            <div className={styles.forgot} onClick={() => { setShowReset(true); setAlert(null) }}>
              Forgot password?
            </div>
            <div className={styles.switch}>
              Don't have an account? <Link to="/signup">Sign up</Link>
            </div>
          </>
        ) : (
          <>
            <button className={styles.backBtn} onClick={() => { setShowReset(false); setAlert(null) }}>
              ← Back to login
            </button>
            <h2 className={styles.heading}>Reset password</h2>
            <p className={styles.sub}>Enter your email and we'll send you a reset link.</p>
            <Alert type={alert?.type} message={alert?.message} />
            <FormGroup label="Email">
              <input
                type="email"
                value={resetEmail}
                onChange={e => setResetEmail(e.target.value)}
                placeholder="you@example.com"
                onKeyDown={e => e.key === 'Enter' && handlePasswordReset()}
              />
            </FormGroup>
            <Button variant="primary" fullWidth onClick={handlePasswordReset} style={{ padding: '13px', fontSize: '15px', borderRadius: '12px' }}>
              {resetLoading ? 'Sending...' : 'Send Reset Link'}
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
