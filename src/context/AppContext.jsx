import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { supabase } from '../supabase'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchProfile = useCallback(async (userId) => {
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).single()
    if (data) setProfile(data)
  }, [])

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) { setUser(session.user); fetchProfile(session.user.id) }
      setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) { setUser(session.user); fetchProfile(session.user.id) }
      else { setUser(null); setProfile(null) }
    })
    return () => subscription.unsubscribe()
  }, [fetchProfile])

  useEffect(() => { fetchPosts() }, [])

  const fetchPosts = async () => {
    const { data, error } = await supabase.from('posts').select('*').eq('completed', false).order('created_at', { ascending: false })
    if (!error && data) setPosts(data.map(formatPost))
  }

  const formatPost = (p) => ({
    id: p.id, type: p.type, title: p.title, desc: p.description,
    cat: p.category, loc: p.location, contact: p.contact,
    user: p.user_name, uid: p.user_id, completed: p.completed,
    date: new Date(p.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  })

  const signup = async (firstName, lastName, email, password) => {
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) throw error
    const name = `${firstName} ${lastName}`
    await supabase.from('profiles').insert({ id: data.user.id, name, email })
    setProfile({ id: data.user.id, name, email })
    return data
  }

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null); setProfile(null)
  }

  const addPost = async (postData) => {
    const userName = profile?.name || user?.email?.split('@')[0] || 'Anonymous'
    const { data, error } = await supabase.from('posts').insert({
      user_id: user.id, user_name: userName,
      type: postData.type, title: postData.title,
      description: postData.desc, category: postData.cat,
      location: postData.loc, contact: postData.contact, completed: false,
    }).select().single()
    if (error) throw error
    setPosts(prev => [formatPost(data), ...prev])
  }

  const deletePost = async (id) => {
    await supabase.from('posts').delete().eq('id', id)
    setPosts(prev => prev.filter(p => p.id !== id))
  }

  const markComplete = async (id) => {
    await supabase.from('posts').update({ completed: true }).eq('id', id)
    setPosts(prev => prev.filter(p => p.id !== id))
  }

  const reportPost = async (id) => { await supabase.from('reports').insert({ post_id: id }) }

  const sendMessage = async (postId, senderName, senderContact, body) => {
    const { error } = await supabase.from('messages').insert({ post_id: postId, sender_name: senderName, sender_contact: senderContact, body })
    if (error) throw error
  }

  return (
    <AppContext.Provider value={{ user, profile, posts, loading, signup, login, logout, addPost, deletePost, markComplete, reportPost, sendMessage, fetchProfile, fetchPosts }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
