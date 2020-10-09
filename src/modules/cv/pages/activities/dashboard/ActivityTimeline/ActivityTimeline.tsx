import React from 'react'
import { Container } from '@wings-software/uikit'
import { ActivityTrack, ActivityTrackProps } from './ActivityTrack/ActivityTrack'
import css from './ActivityTimeline.module.scss'

interface ActivityTimelineViewProps {
  activityTracks: ActivityTrackProps[]
  startTime: number
  endTime: number
  onLoadMore: (startTime: number, endTime: number) => any[]
}

export function ActivityTimeline(props: ActivityTimelineViewProps): JSX.Element {
  const { activityTracks } = props
  return (
    <Container className={css.main}>
      <Container className={css.activityTracks}>
        {activityTracks.map(activityTrackProps => (
          <ActivityTrack {...activityTrackProps} key={activityTrackProps.trackName} />
        ))}
      </Container>
    </Container>
  )
}
