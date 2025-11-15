import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import RegistrationForm from '../pages/RegistrationForm'
import { MemoryRouter } from 'react-router-dom'
import api from '../api'
import { vi } from 'vitest'

vi.mock('../api')

test('shows validation errors and submits when valid', async () => {
  // simulate logged in user
  localStorage.setItem('token', 'tok')
  api.post.mockResolvedValueOnce({ data: { _id: 'reg1' } })

  render(
    <MemoryRouter>
      <RegistrationForm />
    </MemoryRouter>
  )

  // Submit empty form -> errors
  fireEvent.click(screen.getByRole('button', { name: /submit registration/i }))
  expect(await screen.findByText(/First name is required/)).toBeTruthy()

  // Fill required fields
  fireEvent.change(screen.getByPlaceholderText(/First name/i), { target: { value: 'A' } })
  fireEvent.change(screen.getByPlaceholderText(/Last name/i), { target: { value: 'B' } })
  fireEvent.change(screen.getByPlaceholderText(/Email/i), { target: { value: 'a@b.com' } })

  fireEvent.click(screen.getByRole('button', { name: /submit registration/i }))

  await waitFor(() => expect(api.post).toHaveBeenCalledWith('/api/registrations', expect.any(Object)))
})
