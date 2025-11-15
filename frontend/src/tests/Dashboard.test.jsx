import { render, screen, waitFor } from '@testing-library/react'
import Dashboard from '../pages/Dashboard'
import api from '../api'
import { vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'

vi.mock('../api')

// Mock Recharts components to avoid DOM/canvas complexities in tests
vi.mock('recharts', () => ({
  PieChart: ({ children }) => <div data-testid="piechart">{children}</div>,
  ResponsiveContainer: ({ children }) => <div>{children}</div>,
  Pie: ({ children }) => <div>{children}</div>,
  Cell: () => null,
  Tooltip: () => null,
  Legend: () => null
}))

test('dashboard shows total registrations and renders pie chart placeholder', async () => {
  api.get.mockResolvedValueOnce({ data: { total: 2, byDepartment: [{ _id: 'Accounting', count: 1 }, { _id: 'Marketing', count: 1 }] } })
  api.get.mockResolvedValueOnce({ data: [{ _id: 'reg1', studentId: 'S001', firstName: 'John', lastName: 'Doe', email: 'john@example.com', department: 'Accounting', status: 'pending' }] })

  render(
    <MemoryRouter>
      <Dashboard />
    </MemoryRouter>
  )

  await waitFor(() => expect(screen.getByText(/Total Registrations:/i)).toBeInTheDocument())
  expect(screen.getByText('2')).toBeInTheDocument()
  expect(screen.getByTestId('piechart')).toBeTruthy()
})
