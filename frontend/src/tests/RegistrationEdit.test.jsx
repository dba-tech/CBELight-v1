import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import RegistrationForm from '../pages/RegistrationForm'
import api from '../api'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { vi } from 'vitest'

vi.mock('../api')
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  }
})

test('loads existing registration for edit', async () => {
  const existingReg = { 
    _id: 'reg123', 
    firstName: 'John', 
    lastName: 'Doe', 
    email: 'john@example.com', 
    phone: '555-1234',
    studentId: 'S001',
    department: 'Accountancy',
    program: 'Business Intelligence with Technology'
  }

  api.get.mockResolvedValueOnce({ data: existingReg })
  api.put.mockResolvedValueOnce({ data: { ...existingReg, firstName: 'Jane' } })

  render(
    <MemoryRouter initialEntries={['/register/reg123']}>
      <Routes>
        <Route path="/register/:id" element={<RegistrationForm />} />
        <Route path="/dashboard" element={<div>Dashboard</div>} />
      </Routes>
    </MemoryRouter>
  )

  // Wait for form to load with existing data
  await waitFor(() => {
    expect(screen.getByDisplayValue('John')).toBeInTheDocument()
  })

  // Verify data is loaded
  expect(screen.getByDisplayValue('Doe')).toBeInTheDocument()
  expect(screen.getByDisplayValue('john@example.com')).toBeInTheDocument()
  expect(screen.getByDisplayValue('555-1234')).toBeInTheDocument()

  // Button should say "Save changes" in edit mode
  expect(screen.getByRole('button', { name: /Save changes/i })).toBeInTheDocument()
})

test('updates registration on form submit', async () => {
  const existingReg = { 
    _id: 'reg123', 
    firstName: 'John', 
    lastName: 'Doe', 
    email: 'john@example.com', 
    phone: '555-1234',
    studentId: 'S001',
    department: 'ICT & Mathematics'
  }

  api.get.mockResolvedValueOnce({ data: existingReg })
  api.put.mockResolvedValueOnce({ data: { ...existingReg, firstName: 'Jane' } })

  render(
    <MemoryRouter initialEntries={['/register/reg123']}>
      <Routes>
        <Route path="/register/:id" element={<RegistrationForm />} />
        <Route path="/dashboard" element={<div>Dashboard</div>} />
      </Routes>
    </MemoryRouter>
  )

  await waitFor(() => {
    expect(screen.getByDisplayValue('John')).toBeInTheDocument()
  })

  // Change first name
  fireEvent.change(screen.getByPlaceholderText(/First name/i), { target: { value: 'Jane' } })

  // Submit
  fireEvent.click(screen.getByRole('button', { name: /Save changes/i }))

  // Verify PUT was called with correct data
  await waitFor(() => {
    expect(api.put).toHaveBeenCalledWith(
      '/api/registrations/reg123',
      expect.objectContaining({ firstName: 'Jane' })
    )
  })
})
