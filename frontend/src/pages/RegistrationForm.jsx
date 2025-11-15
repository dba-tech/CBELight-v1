import axios from '../api'
import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'

function getAuthHeader() {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export default function RegistrationForm() {
  const { id } = useParams()
  const [form, setForm] = useState({ studentId: '', firstName: '', lastName: '', email: '', phone: '', program: 'Business Intelligence with Technology', department: '' })
  const [message, setMessage] = useState(null)
  const [errors, setErrors] = useState({})
  const navigate = useNavigate()

  useEffect(() => {
    if (!id) return
    let cancelled = false
    async function load() {
      try {
        const res = await axios.get(`/api/registrations/${id}`)
        if (cancelled) return
        setForm({
          studentId: res.data.studentId || '',
          firstName: res.data.firstName || '',
          lastName: res.data.lastName || '',
          email: res.data.email || '',
          phone: res.data.phone || '',
          program: res.data.program || 'Business Intelligence with Technology',
          department: res.data.department || ''
        })
      } catch (err) {
        setMessage(err.response?.data?.message || 'Failed to load registration')
      }
    }
    load()
    return () => { cancelled = true }
  }, [id])

  function validate() {
    const e = {}
    if (!form.firstName) e.firstName = 'First name is required'
    if (!form.lastName) e.lastName = 'Last name is required'
    if (!form.email) e.email = 'Email is required'
    return e
  }

  async function submit(e) {
    e.preventDefault()
    const eobj = validate()
    setErrors(eobj)
    if (Object.keys(eobj).length) return
    try {
      if (id) {
        await axios.put(`/api/registrations/${id}`, form)
        setMessage('Registration updated')
        navigate('/dashboard')
      } else {
        await axios.post('/api/registrations', form)
        setMessage('Registration submitted')
        navigate('/dashboard')
      }
    } catch (err) {
      setMessage(err.response?.data?.message || 'Submission failed')
    }
  }

  return (
    <div className="max-w-xl mx-auto">
      <div className="card-surface p-6 shadow-md transition-transform hover:-translate-y-1">
        <h2 className="text-2xl mb-2 text-cbelight-primary">Digital Registration</h2>
        <p className="text-sm text-gray-600 mb-4">Open your new chapter as a member, <span className="font-medium">CBELight Program 2025/2026</span>.</p>
        <form onSubmit={submit} className="space-y-3">
          <input className="w-full border p-2" placeholder="Student ID" value={form.studentId} onChange={e => setForm({...form, studentId: e.target.value})} />
          <div>
            <input className="w-full border p-2 mb-1" placeholder="First name" value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})} />
            {errors.firstName && <div className="text-red-600 text-sm">{errors.firstName}</div>}
          </div>
          <div>
            <input className="w-full border p-2 mb-1" placeholder="Last name" value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})} />
            {errors.lastName && <div className="text-red-600 text-sm">{errors.lastName}</div>}
          </div>
          <div>
            <input className="w-full border p-2 mb-1" placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
            {errors.email && <div className="text-red-600 text-sm">{errors.email}</div>}
          </div>
          <input className="w-full border p-2" placeholder="Phone" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
          <div>
            <label className="block text-sm text-gray-700 mb-1">Department</label>
            <select className="w-full border p-2" value={form.department} onChange={e => setForm({...form, department: e.target.value})}>
              <option value="">Select department</option>
              <option value="Accountancy">Accountancy</option>
              <option value="ICT & Mathematics">ICT & Mathematics</option>
              <option value="Business Administration">Business Administration</option>
              <option value="Procurement & Logistic">Procurement & Logistic</option>
              <option value="Marketing">Marketing</option>
            </select>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <button type="submit" className="bg-cbelight-primary text-white px-4 py-2 rounded transition hover:shadow-lg">{id ? 'Save changes' : 'Submit registration'}</button>
              <button type="button" className="text-sm text-cbelight-primary border border-cbelight-primary px-3 py-1 rounded" onClick={() => { setForm({ studentId: '', firstName: '', lastName: '', email: '', phone: '', program: 'Business Intelligence with Technology', department: '' }); setMessage(null); setErrors({}) }}>Reset</button>
            </div>
            {!id && (
              <Link to="/edit-registration" className="text-sm text-cbelight-primary hover:underline">
                Already registered? Edit registration →
              </Link>
            )}
          </div>
        </form>
        {message && <p className="mt-3 text-green-700">{message}</p>}
      </div>
    </div>
  )
}

