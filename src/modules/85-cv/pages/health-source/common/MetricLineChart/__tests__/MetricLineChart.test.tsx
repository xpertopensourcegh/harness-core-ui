import React from 'react'
import { render } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'

import MetricLineChart from '../MetricLineChart'

const timeLineData = [
  [1638843480000000, 144],
  [1638843540000000, 144],
  [1638843600000000, 144],
  [1638843660000000, 144],
  [1638843720000000, 144],
  [1638843780000000, 144],
  [1638843840000000, 144],
  [1638843900000000, 144],
  [1638843960000000, 144],
  [1638844020000000, 144]
]

jest.mock('highcharts-react-official', () => () => <></>)
describe('Validate MetricLineChart', () => {
  test('should render with Data', () => {
    const { container } = render(
      <TestWrapper>
        <MetricLineChart options={timeLineData} loading={false} error={null} />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })

  test('should render with loading state', () => {
    const { container } = render(
      <TestWrapper>
        <MetricLineChart options={[]} loading={true} error={null} />
      </TestWrapper>
    )
    expect(container.querySelector('span[data-icon="spinner"]')).toBeTruthy()
    expect(container).toMatchSnapshot()
  })

  test('should render with error state', () => {
    const { container, getByText } = render(
      <TestWrapper>
        <MetricLineChart options={[]} loading={false} error={{ data: { message: 'mockError' } } as any} />
      </TestWrapper>
    )
    expect(getByText('mockError')).toBeTruthy()
    expect(container).toMatchSnapshot()
  })
})
