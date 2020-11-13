import React from 'react'
import { render } from '@testing-library/react'
import ClusterChart, { mapRisk } from '../ClusterChart'

jest.mock('highcharts-react-official', () => () => <div />)

const mockData = [
  {
    label: 2,
    text: 'test',
    hostName: 'host1',
    risk: 0.5,
    x: 2,
    y: 3
  }
]

describe('ClusterChart', () => {
  test('matches snapshot', () => {
    const { container } = render(<ClusterChart data={mockData} />)
    expect(container).toMatchSnapshot()
  })

  test('mapRisk normalizes risk and returns correct color for low risk', () => {
    expect(mapRisk(1.2).marker?.lineColor).toEqual('var(--green-450)')
  })
})
