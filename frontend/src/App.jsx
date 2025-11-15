import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Signup from './pages/Signup'
import Login from './pages/Login'
import RegistrationForm from './pages/RegistrationForm'
import EditRegistrationGateway from './pages/EditRegistrationGateway'
import Dashboard from './pages/Dashboard'
import Layout from './components/Layout'
import RequireAuth from './components/RequireAuth'
import Account from './pages/Account'

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RequireAuth><RegistrationForm /></RequireAuth>} />
          <Route path="/register/:id" element={<RequireAuth><RegistrationForm /></RequireAuth>} />
          <Route path="/edit-registration" element={<RequireAuth><EditRegistrationGateway /></RequireAuth>} />
          <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
          <Route path="/account" element={<RequireAuth><Account /></RequireAuth>} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App
