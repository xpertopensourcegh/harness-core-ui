import React from 'react'
import { render } from '@testing-library/react'

import { TestWrapper } from '@common/utils/testUtils'
import ExecutionStepInputOutputTab from '../ExecutionStepInputOutputTab'
import data from './io-1.json'
describe('<ExecutionStepInputOutputTab /> tests', () => {
  test('snapshot test', () => {
    const { container } = render(
      <TestWrapper>
        <ExecutionStepInputOutputTab data={data.outcomes} mode="output" />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })
})
