import React, { useState } from 'react'
import { Color, Container, Layout, Text } from '@wings-software/uikit'
import moment from 'moment'
import { getMonthIncrements } from '../ActivityTimelineScrubber/ActivityTimelineScrubberUtils'
import css from './ActivityTimelineMonthSelector.module.scss'

export interface ActivityTimelineMonthSelector {
  timelineStartTime: number
  timelineEndTime: number
  onChangeMonth?: (monthStartTime: number, monthEndTime: number) => void
}

function generateNewStartAndEndTimes(month: number, timelineEndTime: number): [number, number] {
  const currMonthMoment = moment(month)
  let updatedStartTime = currMonthMoment.endOf('month').valueOf()
  const updatedEndTime = currMonthMoment.startOf('month').valueOf()
  if (updatedStartTime > timelineEndTime) updatedStartTime = timelineEndTime
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
            const [updatdEndTime, updatedStartTime] = generateNewStartAndEndTimes(month, timelineEndTime)
            onChangeMonth?.(updatdEndTime, updatedStartTime)
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
