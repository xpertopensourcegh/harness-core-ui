import React from 'react'
import { noop } from 'lodash-es'
import { render } from '@testing-library/react'
import LogViewContainer from '../LogViewContainer'
import type { LogViewContainerProps } from '../LogViewContainer'

const getProps = (): LogViewContainerProps => ({
  logsViewerSections: {
    logs: [
      {
        logLine: 'log...'
      }
    ]
  },
  downloadLogs: noop
})

describe('LogViewContainer snapshot test', () => {
  test('should render properly', async () => {
    const { container } = render(<LogViewContainer {...getProps()} />)
    expect(container).toMatchSnapshot()
  })
})
