import axios from 'axios'

const base = import.meta.env.VITE_API_URL || 'http://localhost:5000'
const instance = axios.create({
	baseURL: base,
	headers: { 'Content-Type': 'application/json' }
})

// Attach Authorization header from localStorage for each request
instance.interceptors.request.use((config) => {
	try {
		const token = localStorage.getItem('token')
		if (token) config.headers.Authorization = `Bearer ${token}`
	} catch (err) {}
	return config
})

export default instance
