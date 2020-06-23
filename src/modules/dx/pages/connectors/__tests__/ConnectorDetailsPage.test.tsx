import React from 'react'
import { render } from '@testing-library/react'
import ConnectorDetailsPage from '../ConnectorDetailsPage'

describe('ConnectorDetailsPage Snapshot', () => {
  //TODO unskip this test when MonacoEditor is successfully mocked in Jest
  /* eslint-disable jest/no-disabled-tests */
  test.skip('should render ConnectorDetailsPage', () => {
    const { container } = render(<ConnectorDetailsPage />)
    expect(container).toMatchSnapshot()
  })
})
