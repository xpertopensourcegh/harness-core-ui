import React, { useMemo, useState } from 'react'
import { Container, Text } from '@wings-software/uikit'
import { ActivityTrack, ActivityTrackProps } from './ActivityTrack/ActivityTrack'
import type { Activity } from './ActivityTrack/ActivityTrackUtils'
import ActivityTimelineIntervalMarker from './ActivityTimelineIntervalMarker/ActivityTimelineIntervalMarker'
import css from './ActivityTimeline.module.scss'

interface ActivityTimelineViewProps {
  activityTracks: ActivityTrackProps[]
  startTime: number
  endTime: number
  onLoadMore: (startTime: number, endTime: number) => any[]
}

export function ActivityTimeline(props: ActivityTimelineViewProps): JSX.Element {
  const { activityTracks, startTime, endTime } = props
  const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>()
  const activityTrackComponents = useMemo(
    () =>
      activityTracks.map(activityTrackProps => (
        <ActivityTrack
          {...activityTrackProps}
          key={activityTrackProps.trackName}
          onActivityClick={activity => setSelectedActivity(activity)}
        />
      )),
    [activityTracks]
  )
  return (
    <Container className={css.main}>
      <Container className={css.activityTracks}>{activityTrackComponents}</Container>
      <Container>
        <ActivityTimelineIntervalMarker startTime={startTime} endTime={endTime} />
      </Container>
      <Text>{selectedActivity?.uuid}</Text>
    </Container>
  )
}
