import React from 'react'
import { render, waitFor } from '@testing-library/react'
import { TimelineRow } from '../TimelineRow'
import type { TimelineRowProps } from '../TimelineRow.types'

const series: TimelineRowProps['timelineSeries'] = [
  {
    type: 'scatter',
    data: [
      { x: 1628750040001, y: 0 },
      { x: 1628750940001, y: 0 },
      { x: 1628751840001, y: 0 },
      { x: 1628752740001, y: 0 },
      { x: 1628753640001, y: 0 },
      { x: 1628754540001, y: 0 },
      { x: 1628755440001, y: 0 },
      { x: 1628756340001, y: 0 },
      { x: 1628757240001, y: 0 },
      { x: 1628758140001, y: 0 },
      { x: 1628759040001, y: 0 }
    ]
  }
]

describe('Unit tests for TimelineRow', () => {
  test('Ensure timeline component renders correctly', async () => {
    const { container, getByText } = render(<TimelineRow labelName="label1" labelWidth={200} timelineSeries={series} />)
    await waitFor(() => expect(getByText('label1')).not.toBeNull())
    expect(container.querySelectorAll('[class*="highcharts-point"]').length).toBe(series[0].data!.length)
  })
})
