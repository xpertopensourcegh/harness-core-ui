import React, { useMemo, useRef, useState } from 'react'
import { Container } from '@wings-software/uikit'
import { ActivityTrack, ActivityTrackProps } from './ActivityTrack/ActivityTrack'
import ActivityTimelineIntervalMarker from './ActivityTimelineIntervalMarker/ActivityTimelineIntervalMarker'
import { SelectedActivitySummaryCard } from './SelectedActivitySummaryCard/SelectedActivitySummaryCard'
import type { Activity } from './ActivityTrack/ActivityTrackUtils'
import { LineFromSelectedActivityCard } from './LineFromSelectedActivityCard/LineFromSelectedActivityCard'
import { ActivityTimelineScrubber } from './ActivityTimelineScrubber/ActivityTimelineScrubber'
import useActivityTimelineScrollHook from './ActivityTimelineScrollHook/ActivityTimelineScrollHook'
import { ActivityTimelineMonthSelector } from './ActivityTimelineMonthSelector/ActivityTimelineMonthSelector'
import css from './ActivityTimeline.module.scss'

export interface ActivityTimelineViewProps {
  activityTracks: ActivityTrackProps[]
  timelineStartTime: number
  timelineEndTime: number
  onLoadMore: (startTime: number) => void
  renderSummaryCardContent: (selectedActivity: Activity) => JSX.Element
}

export function ActivityTimeline(props: ActivityTimelineViewProps): JSX.Element {
  const { activityTracks, timelineStartTime, timelineEndTime, renderSummaryCardContent } = props
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null)
  const [activitySummaryCardRef, setActivitySummaryCardRef] = useState<HTMLDivElement | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [scrubberLaneRef, setScrubberLaneRef] = useState<HTMLDivElement | null>(null)
  const [scrubberRef, setScrubberRef] = useState<React.Component | null>(null)
  const scrubberData = useMemo(() => activityTracks?.map(track => track.activities), [activityTracks])
  const { onScrubberPositionChange } = useActivityTimelineScrollHook({
    timelineStartTime,
    timelineEndTime,
    timelineContainerRef: containerRef?.current,
    timelineScrubberLaneRef: scrubberLaneRef,
    scrubberRef
  })

  return (
    <Container className={css.main}>
      <Container className={css.scrubberAndMonthSelector}>
        <ActivityTimelineMonthSelector timelineEndTime={timelineEndTime} timelineStartTime={timelineStartTime} />
        <ActivityTimelineScrubber
          timelineStartTime={timelineStartTime}
          timelineEndTime={timelineEndTime}
          scrubberData={scrubberData}
          scrubberLaneRef={setScrubberLaneRef}
          scrubberRef={setScrubberRef}
          onScrubberPositionChange={onScrubberPositionChange}
        />
      </Container>
      <div className={css.tracksAndIntervalMarkers} ref={containerRef}>
        <LineFromSelectedActivityCard
          key={selectedActivity?.uuid}
          selectedActivity={selectedActivity}
          timelineContainerRef={containerRef?.current}
          selectedActivitySummaryCardRef={activitySummaryCardRef}
        />
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
          <ActivityTimelineIntervalMarker startTime={timelineStartTime} endTime={timelineEndTime} />
          {selectedActivity ? (
            <SelectedActivitySummaryCard
              selectedActivity={selectedActivity}
              renderSummaryCardContent={renderSummaryCardContent}
              activityTimelineContainerRef={containerRef?.current}
              setCardRef={setActivitySummaryCardRef}
            />
          ) : null}
        </Container>
      </div>
    </Container>
  )
}
