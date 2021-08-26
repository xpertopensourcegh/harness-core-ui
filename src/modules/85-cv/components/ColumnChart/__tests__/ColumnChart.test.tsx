import React from 'react'
import { render, waitFor } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'
import ColumnChart from '../ColumnChart'
import type { ColumnChartProps } from '../ColumnChart.types'
import { mockSeriesData } from './ColumnChart.mock'

const WrapperComponent = (props: ColumnChartProps): JSX.Element => {
  return (
    <TestWrapper>
      <ColumnChart {...props} />
    </TestWrapper>
  )
}

jest.mock('highcharts-react-official', () => () => <div className="highcharts"></div>)

describe('Unit tests for ColumnChart', () => {
  test('Verify if all the fields are rendered correctly inside ColumnChart', async () => {
    const props = { data: mockSeriesData }
    const { container } = render(<WrapperComponent {...props} />)
    expect(container).toMatchSnapshot()

    await waitFor(() => expect(container.querySelector('[class*="highcharts"]')).not.toBeNull())
  })
})
