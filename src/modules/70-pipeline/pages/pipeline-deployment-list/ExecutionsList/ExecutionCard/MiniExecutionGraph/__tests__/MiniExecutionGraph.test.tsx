import React from 'react'
import { render } from '@testing-library/react'

import MiniExecutionGraph from '../MiniExecutionGraph'

import pipeline from './pipeline.json'

describe('<MiniExecutionGraph /> tests', () => {
  test('snapshot test', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { container } = render(<MiniExecutionGraph pipelineExecution={pipeline as any} />)

    expect(container).toMatchSnapshot()
  })
})
