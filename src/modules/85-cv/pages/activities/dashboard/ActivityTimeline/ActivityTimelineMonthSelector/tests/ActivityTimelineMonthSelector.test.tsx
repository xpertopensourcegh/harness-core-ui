import React from 'react'
import { fireEvent, render, waitFor } from '@testing-library/react'
import moment from 'moment'
import { ActivityTimelineMonthSelector } from '../ActivityTimelineMonthSelector'

describe('Unit tests for Activity timeline month selector', () => {
  test('Ensure all passed in months are rendered, and selected month is passed onClick', async () => {
    const onMonthChange = jest.fn()
    const { container, getByText } = render(
      <ActivityTimelineMonthSelector
        timelineStartTime={1609728600000}
        timelineEndTime={1593586800000}
        onChangeMonth={onMonthChange}
      />
    )

    await waitFor(() => expect(container.querySelector('[class*="main"]')).not.toBeNull())
    expect(getByText('Jan')).not.toBeNull()
    expect(getByText('Dec')).not.toBeNull()
    expect(getByText('Nov')).not.toBeNull()
    expect(getByText('Oct')).not.toBeNull()
    expect(getByText('Sep')).not.toBeNull()
    const augustSelector = getByText('Aug')
    expect(augustSelector).not.toBeNull()

    fireEvent.click(augustSelector)
    await waitFor(() => expect(onMonthChange).toHaveBeenCalledTimes(1))
    expect(onMonthChange).toHaveBeenLastCalledWith(
      moment(1598918399999).endOf('month').valueOf(),
      moment(1598918399999).startOf('month').valueOf()
    )
  })
})
