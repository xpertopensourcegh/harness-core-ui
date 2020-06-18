import React from 'react'
import { render } from '@testing-library/react'
import ManifestSelection from '../ManifestSelection'

describe('ManifestSelection Snapshot', () => {
  test('should render ManifestSelection component', () => {
    const { container } = render(<ManifestSelection />)
    expect(container).toMatchSnapshot()
  })
})
