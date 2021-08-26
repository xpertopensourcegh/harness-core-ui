import React from 'react'
import type { ChangeTimelineProps } from './ChangeTimeline.types'
import { Timeline } from './components/Timeline/Timeline'

export default function ChangeTimeline(props: ChangeTimelineProps): JSX.Element {
  const { timestamps, timeFormat } = props
  return (
    <Timeline
      timelineRows={[
        {
          labelName: 'Deployments',
          timelineSeries: [
            {
              type: 'scatter',
              marker: {
                fillColor: 'var(--primary-4)',
                symbol: 'diamond'
              },
              data: []
            }
          ]
        },
        {
          labelName: 'Infrastructure',
          timelineSeries: [
            {
              type: 'scatter',
              marker: {
                fillColor: 'var(--purple-400)',
                symbol: 'diamond'
              },
              data: []
            }
          ]
        },
        {
          labelName: 'Incidents',
          timelineSeries: [
            {
              type: 'scatter',
              marker: {
                fillColor: 'var(--orange-500)',
                symbol: 'diamond'
              },
              data: []
            }
          ]
        }
      ]}
      timestamps={timestamps}
      timeFormat={timeFormat}
      labelWidth={90}
    />
  )
}
