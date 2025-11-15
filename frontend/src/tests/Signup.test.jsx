import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Signup from '../pages/Signup'
import { MemoryRouter } from 'react-router-dom'
import api from '../api'
import { vi } from 'vitest'

vi.mock('../api')

test('signup stores token and user', async () => {
  api.post.mockResolvedValueOnce({ data: { token: 'tok123', user: { firstName: 'Test', email: 't@e.com' } } })

  render(
    <MemoryRouter>
      <Signup />
    </MemoryRouter>
  )

  fireEvent.change(screen.getByPlaceholderText(/First name/i), { target: { value: 'Test' } })
  fireEvent.change(screen.getByPlaceholderText(/Last name/i), { target: { value: 'User' } })
  fireEvent.change(screen.getByPlaceholderText(/Email/i), { target: { value: 't@e.com' } })
  fireEvent.change(screen.getByPlaceholderText(/Password/i), { target: { value: 'pw' } })

  fireEvent.click(screen.getByRole('button', { name: /create account/i }))

  await waitFor(() => expect(localStorage.getItem('token')).toBe('tok123'))
  const user = JSON.parse(localStorage.getItem('user'))
  expect(user.email).toBe('t@e.com')
})
