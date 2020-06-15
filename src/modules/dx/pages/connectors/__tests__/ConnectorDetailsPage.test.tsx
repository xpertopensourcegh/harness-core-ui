import React from 'react'
import { render } from '@testing-library/react'
import ConnectorDetailsPage from '../ConnectorDetailsPage'

describe('ConnectorDetailsPage Snapshot', () => {
  test('should render ConnectorDetailsPage', () => {
    const { container } = render(<ConnectorDetailsPage />)
    expect(container).toMatchSnapshot()
  })
})
