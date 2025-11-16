import { Link, useNavigate } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'

function Navbar({ onLogout }) {
  const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || 'null') : null
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav className="bg-cbelight-primary text-white p-4 shadow-md">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            aria-label="menu"
            onClick={() => setMobileOpen(v => !v)}
            className="sm:hidden inline-flex items-center justify-center w-9 h-9 rounded-md bg-white text-cbelight-primary font-semibold shadow-sm hover:scale-105 transition-transform"
          >
            ☰
          </button>
          <Link to="/" className="font-extrabold text-xl tracking-wide">Home</Link>
        </div>

        <div className="hidden sm:flex items-center gap-6">
          <Link to="/register" className="hover:underline">Register</Link>
          <Link to="/dashboard" className="hover:underline">Dashboard</Link>
        </div>

        <div>
          {user ? (
            <div className="relative">
              <div className="flex items-center gap-3">
                <UserMenu user={user} onLogout={onLogout} />
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/signup" className="hover:underline">Signup</Link>
              <Link to="/login" className="hover:underline">Login</Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="sm:hidden mt-2 px-4 pb-4">
          <div className="bg-white text-cbelight-primary rounded-md shadow-sm overflow-hidden">
            <Link to="/register" className="block px-4 py-3 border-b">Register</Link>
            <Link to="/dashboard" className="block px-4 py-3 border-b">Dashboard</Link>
            <Link to="/signup" className="block px-4 py-3 border-b">Signup</Link>
            <Link to="/login" className="block px-4 py-3">Login</Link>
          </div>
        </div>
      )}
    </nav>
  )
}

function MobileMenuButton() {
  // simple placeholder for visual mobile affordance (no drawer implemented here)
  return (
    <button aria-label="menu" className="sm:hidden inline-flex items-center justify-center w-9 h-9 rounded-md bg-white text-cbelight-primary font-semibold shadow-sm hover:scale-105 transition-transform">
      ☰
    </button>
  )
}

function Sidebar() {
  return (
    <aside className="hidden md:block md:w-56 p-4 border-r border-gray-100">
      <ul className="space-y-3">
        <li>
          <a
            href="https://mwanza.cbe.ac.tz/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-cbelight-primary font-medium"
          >
            CBE Mwanza Campus 2025/2026
          </a>
        </li>
      </ul>
    </aside>
  );
}

function Footer() {
  return (
    <footer className="p-4 border-t border-gray-100 text-left text-sm mt-6 text-gray-600">
      © College of Business Education - <span className="font-semibold text-cbelight-primary">"Business Intelligence for Business Success"</span>
    </footer>
  )
}

function UserMenu({ user, onLogout }) {
  const [open, setOpen] = useState(false)
  const ref = useRef()
  const navigate = useNavigate()

  useEffect(() => {
    function onDocClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('click', onDocClick)
    return () => document.removeEventListener('click', onDocClick)
  }, [])

  function goToAccount() {
    setOpen(false)
    navigate('/account')
  }

  const initial = user?.firstName?.[0]?.toUpperCase() || 'U'

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(v => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="w-9 h-9 rounded-full bg-white text-cbelight-primary font-semibold flex items-center justify-center shadow-sm hover:scale-105 transition-transform"
        title="Account"
      >
        {initial}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-44 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-20">
          <button onClick={goToAccount} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50">Account settings</button>
          <div className="border-t" />
          <button onClick={onLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50">Logout</button>
        </div>
      )}
    </div>
  )
}

export default function Layout({ children }) {
  const navigate = useNavigate()
  function onLogout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar onLogout={onLogout} />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6">{children}</main>
      </div>
      <Footer />
    </div>
  )
}
