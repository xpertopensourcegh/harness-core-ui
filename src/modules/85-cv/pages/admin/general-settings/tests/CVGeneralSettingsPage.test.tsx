import React from 'react'
import { waitFor, render } from '@testing-library/react'
import CVGeneralSettingsPage from '../CVGeneralSettingsPage'

describe('Unit tests for CVGeneralSettingsPage', () => {
  test('Ensure page renders', async () => {
    const { container } = render(<CVGeneralSettingsPage />)
    await waitFor(() => expect(container.querySelector('[class*="pageBody"]')).not.toBeNull())
    expect(container).toMatchSnapshot()
  })
})
