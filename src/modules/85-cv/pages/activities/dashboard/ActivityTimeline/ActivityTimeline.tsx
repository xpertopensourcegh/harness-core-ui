import React, { useMemo, useRef, useState } from 'react'
import { Container } from '@wings-software/uicore'
import moment from 'moment'
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
  onLoadMore: (startTime: number, endTime: number) => void
  renderSummaryCardContent: (selectedActivity: Activity) => JSX.Element
}

export function ActivityTimeline(props: ActivityTimelineViewProps): JSX.Element {
  const { activityTracks, timelineStartTime, timelineEndTime, renderSummaryCardContent, onLoadMore } = props
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null)
  const [activitySummaryCardRef, setActivitySummaryCardRef] = useState<HTMLDivElement | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [scrubberLaneRef, setScrubberLaneRef] = useState<HTMLDivElement | null>(null)
  const [scrubberRef, setScrubberRef] = useState<React.Component | null>(null)
  const [{ currentMonthStartTime, currentMonthEndTime }, setCurrMonth] = useState({
    currentMonthStartTime: timelineStartTime,
    currentMonthEndTime: moment(timelineStartTime).startOf('month').valueOf()
  })
  const scrubberData = useMemo(() => activityTracks?.map(track => track.activities), [activityTracks])
  const { onScrubberPositionChange } = useActivityTimelineScrollHook({
    timelineStartTime: currentMonthStartTime,
    timelineEndTime: currentMonthEndTime,
    timelineContainerRef: containerRef?.current,
    timelineScrubberLaneRef: scrubberLaneRef,
    scrubberRef
  })

  return (
    <Container className={css.main}>
      <Container className={css.scrubberAndMonthSelector}>
        <ActivityTimelineMonthSelector
          timelineEndTime={timelineEndTime}
          timelineStartTime={timelineStartTime}
          onChangeMonth={(monthStartTime, monthEndTime) => {
            setCurrMonth({ currentMonthEndTime: monthEndTime, currentMonthStartTime: monthStartTime })
            onLoadMore(monthStartTime, monthEndTime)
          }}
        />
        <ActivityTimelineScrubber
          timelineStartTime={currentMonthStartTime}
          timelineEndTime={currentMonthEndTime}
          scrubberData={scrubberData}
          scrubberLaneRef={setScrubberLaneRef}
          scrubberRef={setScrubberRef}
          timelineContainerRef={containerRef?.current}
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
              timelineContainerRef={containerRef?.current}
              key={activityTrackProps.trackName}
              onActivityClick={activity => setSelectedActivity(activity)}
            />
          ))}
        </Container>
        <Container className={css.dayMarkersAndSummaryCard}>
          <ActivityTimelineIntervalMarker startTime={currentMonthStartTime} endTime={currentMonthEndTime} />
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
