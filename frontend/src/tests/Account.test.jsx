import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Account from '../pages/Account'
import api from '../api'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'

vi.mock('../api')

test('loads profile and saves changes', async () => {
  const user = { firstName: 'Ada', lastName: 'Lovelace', email: 'ada@example.com' }
  api.get.mockResolvedValueOnce({ data: user })
  api.put.mockResolvedValueOnce({ data: { ...user, firstName: 'Adaline' } })

  render(<MemoryRouter><Account /></MemoryRouter>)

  await waitFor(() => expect(screen.getByText(/Account settings/i)).toBeInTheDocument())
  expect(screen.getByText(/Ada/)).toBeInTheDocument()

  fireEvent.click(screen.getByText(/Edit/i))
  fireEvent.change(screen.getByPlaceholderText(/First name/i), { target: { value: 'Adaline' } })
  fireEvent.click(screen.getByText(/Save/i))

  await waitFor(() => expect(api.put).toHaveBeenCalled())
  expect(screen.getByText(/Profile updated/i)).toBeInTheDocument()
})
