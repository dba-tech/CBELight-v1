import { render, screen, fireEvent } from '@testing-library/react'
import Layout from '../components/Layout'
import { MemoryRouter } from 'react-router-dom'

test('Layout shows account initial and logout clears storage', () => {
  localStorage.setItem('user', JSON.stringify({ firstName: 'Charlie' }))
  localStorage.setItem('token', 'tok')

  render(
    <MemoryRouter>
      <Layout>
        <div>child</div>
      </Layout>
    </MemoryRouter>
  )

  // account initial button should be visible
  const initialBtn = screen.getByRole('button')
  expect(initialBtn).toHaveTextContent('C')

  // open menu then click logout
  fireEvent.click(initialBtn)
  const logoutBtn = screen.getByText(/logout/i)
  fireEvent.click(logoutBtn)

  expect(localStorage.getItem('user')).toBeNull()
  expect(localStorage.getItem('token')).toBeNull()
})
