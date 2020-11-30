import React from 'react'
import { waitFor, render } from '@testing-library/react'
import CVResourcesPage from '../CVResourcesPage'

describe('Unit tests for CVResourcesPage', () => {
  test('Ensure page renders', async () => {
    const { container } = render(<CVResourcesPage />)
    await waitFor(() => expect(container.querySelector('[class*="pageBody"]')).not.toBeNull())
    expect(container).toMatchSnapshot()
  })
})
