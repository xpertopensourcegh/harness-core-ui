import React, { useRef, useState } from 'react'
import { Container } from '@wings-software/uikit'
import { ActivityTrack, ActivityTrackProps } from './ActivityTrack/ActivityTrack'
import type { Activity } from './ActivityTrack/ActivityTrackUtils'
import ActivityTimelineIntervalMarker from './ActivityTimelineIntervalMarker/ActivityTimelineIntervalMarker'
import SelectedActivitySummaryCard from './SelectedActivitySummaryCard/SelectedActivitySummaryCard'
import LineFromSelectedActivityCard from './LineFromSelectedActivityCard/LineFromSelectedActivityCard'
import css from './ActivityTimeline.module.scss'

interface ActivityTimelineViewProps {
  activityTracks: ActivityTrackProps[]
  startTime: number
  endTime: number
  onLoadMore: (startTime: number, endTime: number) => any[]
  renderSummaryCardContent: (selectedActivity: Activity) => JSX.Element
}

export function ActivityTimeline(props: ActivityTimelineViewProps): JSX.Element {
  const { activityTracks, startTime, endTime } = props
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null)
  const [activitySummaryCardRef, setActivitySummaryCardRef] = useState<HTMLDivElement | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <>
      <LineFromSelectedActivityCard
        key={selectedActivity?.uuid}
        selectedActivity={selectedActivity}
        timelineContainerRef={containerRef?.current}
        selectedActivitySummaryCardRef={activitySummaryCardRef}
      />
      <div className={css.main} ref={containerRef}>
        <Container className={css.activityTracks}>
          {activityTracks.map(activityTrackProps => (
            <ActivityTrack
              {...activityTrackProps}
              key={activityTrackProps.trackName}
              onActivityClick={activity => setSelectedActivity(activity)}
            />
          ))}
        </Container>
        <Container className={css.dayMarkersAndSummaryCard}>
          <ActivityTimelineIntervalMarker startTime={startTime} endTime={endTime} />
          {selectedActivity ? (
            <SelectedActivitySummaryCard
              selectedActivity={selectedActivity}
              activityTimelineContainerRef={containerRef?.current}
              setCardRef={setActivitySummaryCardRef}
            />
          ) : null}
        </Container>
      </div>
    </>
  )
}
