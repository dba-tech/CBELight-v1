import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from '../api'

export default function EditRegistrationGateway() {
  const [studentId, setStudentId] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  async function handleSearch(e) {
    e.preventDefault()
    if (!studentId.trim()) {
      setError('Please enter your Student ID')
      return
    }

    setLoading(true)
    setError('')

    try {
      // Get all registrations for current user
      const res = await axios.get('/api/registrations')
      const registrations = res.data || []

      // Find registration by student ID
      const found = registrations.find(reg => reg.studentId === studentId)

      if (!found) {
        setError(`No registration found with Student ID: ${studentId}`)
        setLoading(false)
        return
      }

      // Navigate to edit form with the registration ID
      navigate(`/register/${found._id}`)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to find registration')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="card-surface p-8 shadow-lg rounded-lg max-w-md w-full">
        <h2 className="text-3xl font-bold text-cbelight-primary mb-2">Edit Registration</h2>
        <p className="text-gray-600 text-sm mb-6">
          Enter your Student ID to locate and edit your registration record.
        </p>

        <form onSubmit={handleSearch} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Student ID
            </label>
            <input
              type="text"
              placeholder="e.g., S001, S123"
              value={studentId}
              onChange={e => setStudentId(e.target.value)}
              className="w-full border-2 border-gray-300 p-3 rounded focus:border-cbelight-primary focus:outline-none"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cbelight-primary text-white py-3 rounded font-medium transition hover:shadow-lg disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Find & Edit Registration'}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-600 text-center">
            💡 <strong>Tip:</strong> One account can have multiple registrations. Use your Student ID to access the correct record.
          </p>
        </div>
      </div>
    </div>
  )
}
