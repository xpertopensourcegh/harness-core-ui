import React from 'react'
import { render, waitFor } from '@testing-library/react'
import { TimestampChart } from '../TimestampChart'
import { getTimeFormat } from '../TimestampChart.utils'
import { daysTimeFormat, hoursTimeFormat } from '../TimestampChart.constants'

describe('Unit tests for TimestampChart', () => {
  let mockDate: any
  beforeAll(() => {
    mockDate = jest.spyOn(Date.prototype, 'toLocaleTimeString').mockReturnValue('8-12-2021')
  })

  afterAll(() => {
    mockDate.mockRestore()
  })
  test('Ensure timestamps generated are within range of given data set', async () => {
    const { container } = render(
      <TimestampChart
        timestamps={[
          1628750040001, 1628750940001, 1628751840001, 1628752740001, 1628753640001, 1628754540001, 1628755440001
        ]}
      />
    )

    await waitFor(() => expect(container.querySelector('[class*="highcharts"]')).not.toBeNull())
    expect(container.querySelector('[class*="highcharts-xaxis-labels"]')).not.toBeNull()
  })

  test('Verify if correct timeformat is returned from getTimeFormat method', async () => {
    expect(getTimeFormat('hours')).toEqual(hoursTimeFormat)
    expect(getTimeFormat('days')).toEqual(daysTimeFormat)
    expect(getTimeFormat('default')).toEqual(hoursTimeFormat)
  })
})
