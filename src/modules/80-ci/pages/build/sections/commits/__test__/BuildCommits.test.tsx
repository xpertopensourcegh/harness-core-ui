import React from 'react'
import { render } from '@testing-library/react'
import BuildCommits from '../BuildCommits'
import BuildMock from './mock/build.json'

jest.mock('@ci/services/CIUtils', () => ({
  getTimeAgo: () => '1 day ago',
  getShortCommitId: () => 'abc'
}))

jest.mock('@pipeline/pages/execution/ExecutionContext/ExecutionContext', () => ({
  useExecutionContext: () => ({
    pipelineExecutionDetail: {
      pipelineExecutionSummary: BuildMock
    }
  })
}))

describe('BuildCommits snapshot test', () => {
  // eslint-disable-next-line jest/no-disabled-tests
  test('should render properly', async () => {
    const { container } = render(<BuildCommits />)
    expect(container).toMatchSnapshot()
  })
})
