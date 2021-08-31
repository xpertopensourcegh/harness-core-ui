import React from 'react'
import { Container, Text } from '@wings-software/uicore'
import { useStrings } from 'framework/strings'
import type { TimelineProps } from './Timeline.types'
import { TimelineRow } from '../TimelineRow/TimelineRow'
import { TimestampChart } from '../TimestampChart/TimestampChart'
import TimelineSlider from '../TimelineSlider/TimelineSlider'
import { calculateStartAndEndTimes } from './Timeline.utils'
import css from './Timeline.module.scss'

export function Timeline(props: TimelineProps): JSX.Element {
  const { timelineRows, timestamps, labelWidth, timeFormat, onFocusTimeRange } = props
  const { getString } = useStrings()
  return (
    <Container className={css.main}>
      {timelineRows?.map((timelineProps, index) => (
        <TimelineRow labelWidth={labelWidth} {...timelineProps} key={`${timelineProps.labelName}-${index}`} />
      ))}
      <Container className={css.timelineChartContainer}>
        <Text className={css.timelineLabel} width={labelWidth}>
          {getString('cv.timeline').toUpperCase()}
        </Text>
        <TimestampChart timestamps={timestamps} timeFormat={timeFormat} />
      </Container>
      {timestamps?.length && (
        <TimelineSlider
          initialSliderWidth={100}
          className={css.slider}
          minSliderWidth={50}
          leftContainerOffset={100}
          onSliderDragEnd={({ startXPercentage, endXPercentage }) => {
            const startAndEndtime = calculateStartAndEndTimes(startXPercentage, endXPercentage, timestamps)
            if (startAndEndtime) onFocusTimeRange?.(startAndEndtime[0], startAndEndtime[1])
          }}
        />
      )}
    </Container>
  )
}
