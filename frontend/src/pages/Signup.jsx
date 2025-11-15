import axios from '../api'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Signup() {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' })
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  async function submit(e) {
    e.preventDefault()
    try {
      const res = await axios.post('/api/auth/signup', form)
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      navigate('/register')
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed')
    }
  }

  return (
    <div className="max-w-md mx-auto card-surface p-6">
      <h2 className="text-xl font-semibold text-cbelight-primary mb-4">Signup</h2>
      <form onSubmit={submit} className="space-y-3">
        <input className="w-full border p-2" placeholder="First name" value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})} />
        <input className="w-full border p-2" placeholder="Last name" value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})} />
        <input className="w-full border p-2" placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
        <input className="w-full border p-2" placeholder="Password" type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
        <button type="submit" className="w-full bg-cbelight-primary text-white py-2 rounded transition hover:shadow-lg">Create account</button>
      </form>
      {error && <p className="text-red-600 mt-3">{error}</p>}
    </div>
  )
}
