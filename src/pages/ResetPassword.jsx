import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'
import { Button, Alert, FormGroup } from '../components/UI'
import styles from './Auth.module.css'

export default function ResetPassword() {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [alert, setAlert] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleReset = async () => {
    if (!password.trim() || !confirm.trim()) {
      setAlert({ type: 'error', message: 'Please fill in all fields.' })
      return
    }
    if (password.length < 6) {
      setAlert({ type: 'error', message: 'Password must be at least 6 characters.' })
      return
    }
    if (password !== confirm) {
      setAlert({ type: 'error', message: 'Passwords do not match.' })
      return
    }
    setLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({ password })
      if (error) throw error
      setAlert({ type: 'success', message: 'Password updated! Redirecting to login...' })
      setTimeout(() => navigate('/login'), 2000)
    } catch (err) {
      setAlert({ type: 'error', message: err.message || 'Failed to reset password. Try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h2 className={styles.heading}>Set new password</h2>
        <p className={styles.sub}>Choose a strong new password for your account.</p>
        <Alert type={alert?.type} message={alert?.message} />
        <FormGroup label="New password">
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="At least 6 characters"
          />
        </FormGroup>
        <FormGroup label="Confirm new password">
          <input
            type="password"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            placeholder="Repeat your new password"
            onKeyDown={e => e.key === 'Enter' && handleReset()}
          />
        </FormGroup>
        <Button variant="primary" fullWidth onClick={handleReset} style={{ padding: '13px', fontSize: '15px', borderRadius: '12px' }}>
          {loading ? 'Updating...' : 'Update Password'}
        </Button>
      </div>
    </div>
  )
}
