import React, { useState } from 'react'
import { Color, Container, Layout, Text } from '@wings-software/uicore'
import moment from 'moment'
import { getMonthIncrements } from '../ActivityTimelineScrubber/ActivityTimelineScrubberUtils'
import css from './ActivityTimelineMonthSelector.module.scss'

export interface ActivityTimelineMonthSelector {
  timelineStartTime: number
  timelineEndTime: number
  onChangeMonth?: (monthStartTime: number, monthEndTime: number) => void
}

function generateNewStartAndEndTimes(month: number): [number, number] {
  const currMonthMoment = moment(month)
  const updatedStartTime = currMonthMoment.startOf('month').valueOf()
  const updatedEndTime = currMonthMoment.endOf('month').valueOf()
  return [updatedStartTime, updatedEndTime]
}

export function ActivityTimelineMonthSelector(props: ActivityTimelineMonthSelector): JSX.Element {
  const { timelineStartTime, timelineEndTime, onChangeMonth } = props
  const months = getMonthIncrements(timelineStartTime, timelineEndTime)
  const [currMonth, setCurrentMonth] = useState<number>(months[0])

  return (
    <Layout.Vertical width={55} className={css.main}>
      {months.map(month => (
        <Container
          key={month}
          height={30}
          className={css.intervalContent}
          onClick={() => {
            setCurrentMonth(month)
            const [updatedStartTime, updatedEndTime] = generateNewStartAndEndTimes(month)
            onChangeMonth?.(updatedEndTime, updatedStartTime)
          }}
        >
          <Text className={css.monthLabel} font={{ size: 'small' }} color={Color.BLACK}>
            {moment(month).format('MMM')}
          </Text>
          <Container background={month === currMonth ? Color.BLUE_600 : Color.GREY_200} width={5} />
        </Container>
      ))}
    </Layout.Vertical>
  )
}
