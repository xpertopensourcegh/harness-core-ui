import React, { useMemo } from 'react'
import { Container, Text } from '@wings-software/uicore'
import HighchartsReact from 'highcharts-react-official'
import Highcharts from 'highcharts'
import type { TimelineRowProps } from './TimelineRow.types'
import { getEventTimelineConfig } from './TimelineRow.utils'
import TimelineRowLoading from './components/TimelineRowLoading'
import TimelineRowNoData from './components/TimelineRowNoData'
import css from './TimelineRow.module.scss'

export function TimelineRow(props: TimelineRowProps): JSX.Element {
  const { labelName, labelWidth, timelineSeries, min, max, isLoading, noDataMessage } = props
  const options = useMemo(() => getEventTimelineConfig(timelineSeries || [], { min, max }), [timelineSeries])

  const renderTimelineRow = useMemo(
    () => () => {
      if (isLoading) {
        return <TimelineRowLoading />
      } else if (noDataMessage) {
        return <TimelineRowNoData noDataMessage={noDataMessage} />
      } else {
        return <HighchartsReact highcharts={Highcharts} options={options} />
      }
    },

    [isLoading, noDataMessage, options]
  )

  return (
    <Container className={css.main}>
      <Container key={labelName} className={css.timelineRow}>
        <Text lineClamp={1} width={labelWidth} className={css.rowLabel}>
          {labelName}
        </Text>
        {renderTimelineRow()}
      </Container>
    </Container>
  )
}
