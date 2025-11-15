import { useState, useEffect } from 'react'
import api from '../api'

export default function Account() {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user')) || null
    } catch { return null }
  })
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '' })
  const [message, setMessage] = useState(null)

  useEffect(() => {
    // fetch latest profile from backend when component mounts
    async function fetchProfile() {
      try {
        const res = await api.get('/api/users/me')
        setUser(res.data)
        setForm({ firstName: res.data.firstName || '', lastName: res.data.lastName || '', email: res.data.email || '' })
      } catch (err) {
        // fallback to stored user
        if (user) setForm({ firstName: user.firstName || '', lastName: user.lastName || '', email: user.email || '' })
      }
    }

    fetchProfile()
  }, [user])

  async function save(e) {
    e.preventDefault()
    setMessage(null)
    try {
      // call backend to update profile
      const res = await api.put('/api/users/me', form)
      const updated = res.data
      localStorage.setItem('user', JSON.stringify(updated))
      setUser(updated)
      setEditing(false)
      setMessage('Profile updated')
    } catch (err) {
      setMessage('Failed to update profile')
    }
  }

  if (!user) return <div className="max-w-md mx-auto card-surface p-6">No account found. Please login.</div>

  return (
    <div className="max-w-md mx-auto card-surface p-6 shadow-md transition-transform duration-200 hover:shadow-lg">
      <h2 className="text-xl font-semibold text-cbelight-primary mb-4">Account settings</h2>

      {!editing ? (
        <div className="space-y-3">
          <div><strong>First name:</strong> {user.firstName}</div>
          <div><strong>Last name:</strong> {user.lastName}</div>
          <div><strong>Email:</strong> {user.email}</div>
          <div className="flex gap-2 mt-4">
            <button onClick={() => setEditing(true)} className="px-3 py-1 bg-cbelight-primary text-white rounded">Edit</button>
          </div>
        </div>
      ) : (
        <form onSubmit={save} className="space-y-3">
          <input className="w-full border p-2" placeholder="First name" value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})} />
          <input className="w-full border p-2" placeholder="Last name" value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})} />
          <input className="w-full border p-2" placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
          <div className="flex gap-2">
            <button type="submit" className="px-3 py-1 bg-cbelight-primary text-white rounded">Save</button>
            <button type="button" onClick={() => setEditing(false)} className="px-3 py-1 border rounded">Cancel</button>
          </div>
        </form>
      )}

      {message && <div className="mt-3 text-sm text-green-700">{message}</div>}
    </div>
  )
}
