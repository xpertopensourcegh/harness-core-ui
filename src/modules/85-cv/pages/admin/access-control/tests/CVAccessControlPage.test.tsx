import React from 'react'
import { render, waitFor } from '@testing-library/react'
import CVAccessControlPage from '../CVAccessControlPage'

describe('Unit tests for CVAccessControlPage', () => {
  test('Ensure page renders', async () => {
    const { container } = render(<CVAccessControlPage />)
    await waitFor(() => expect(container.querySelector('[class*="pageBody"]')).not.toBeNull())
    expect(container).toMatchSnapshot()
  })
})
