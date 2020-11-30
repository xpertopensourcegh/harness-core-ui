import React from 'react'
import { waitFor, render } from '@testing-library/react'
import CVGovernancePage from '../CVGovernancePage'

describe('Unit tests for CVGovernancePage', () => {
  test('Ensure page renders', async () => {
    const { container } = render(<CVGovernancePage />)
    await waitFor(() => expect(container.querySelector('[class*="pageBody"]')).not.toBeNull())
    expect(container).toMatchSnapshot()
  })
})
