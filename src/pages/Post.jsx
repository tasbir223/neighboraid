import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { Button, Alert, FormGroup, FormRow, Tabs, Card } from '../components/UI'
import styles from './Post.module.css'

const CATS = ['Tutoring', 'Food Donation', 'Moving Help', 'Errands', 'Other']

export default function Post() {
  const { addPost } = useApp()
  const navigate = useNavigate()
  const [type, setType] = useState('request')
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [cat, setCat] = useState('Tutoring')
  const [loc, setLoc] = useState('')
  const [contact, setContact] = useState('')
  const [alert, setAlert] = useState(null)
  const [loading, setLoading] = useState(false)

  const typeOptions = [
    { value: 'request', label: 'I need help' },
    { value: 'offer', label: 'I can help' },
  ]

  const handleSubmit = async () => {
    if (!title.trim() || !desc.trim() || !loc.trim() || !contact.trim()) {
      setAlert({ type: 'error', message: 'Please fill in all required fields.' })
      return
    }
    setLoading(true)
    try {
      await addPost({ type, title: title.trim(), desc: desc.trim(), cat, loc: loc.trim(), contact: contact.trim() })
      setAlert({ type: 'success', message: 'Your post is now live!' })
      setTimeout(() => navigate('/browse'), 1200)
    } catch (err) {
      setAlert({ type: 'error', message: err.message || 'Failed to post. Try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.center}>
        <h2 className={styles.title}>Post Something</h2>
        <p className={styles.sub}>Share a request for help or offer to help others</p>
        <Alert type={alert?.type} message={alert?.message} />
        <Card style={{ padding: '28px' }}>
          <FormGroup label="Post type">
            <Tabs options={typeOptions} value={type} onChange={setType} />
          </FormGroup>
          <FormGroup label="Title *">
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Brief description of your request or offer" />
          </FormGroup>
          <FormGroup label="Details *">
            <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="Give more context — timing, requirements, what to expect..." />
          </FormGroup>
          <FormRow>
            <FormGroup label="Category">
              <select value={cat} onChange={e => setCat(e.target.value)}>
                {CATS.map(c => <option key={c}>{c}</option>)}
              </select>
            </FormGroup>
            <FormGroup label="Location *">
              <input type="text" value={loc} onChange={e => setLoc(e.target.value)} placeholder="Neighborhood or borough" />
            </FormGroup>
          </FormRow>
          <FormGroup label="Contact info *">
            <input type="text" value={contact} onChange={e => setContact(e.target.value)} placeholder="Email or phone number" />
          </FormGroup>
          <Button variant="primary" fullWidth onClick={handleSubmit} style={{ padding: '14px', fontSize: '15px', borderRadius: '12px' }}>
            {loading ? 'Publishing...' : 'Publish Post'}
          </Button>
        </Card>
      </div>
    </div>
  )
}
