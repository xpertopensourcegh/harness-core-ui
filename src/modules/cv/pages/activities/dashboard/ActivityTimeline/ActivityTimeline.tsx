import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Container } from '@wings-software/uikit'
import { isNumber } from 'lodash-es'
import { ActivityTrack, ActivityTrackProps } from './ActivityTrack/ActivityTrack'
import { Activity, computePositionOnTimeline, computeTimelineHeight } from './ActivityTrack/ActivityTrackUtils'
import ActivityTimelineIntervalMarker from './ActivityTimelineIntervalMarker/ActivityTimelineIntervalMarker'
import { SelectedActivitySummaryCard } from './SelectedActivitySummaryCard/SelectedActivitySummaryCard'
import { LineFromSelectedActivityCard } from './LineFromSelectedActivityCard/LineFromSelectedActivityCard'
import css from './ActivityTimeline.module.scss'

export interface ActivityTimelineViewProps {
  activityTracks: ActivityTrackProps[]
  timelineStartTime: number
  timelineEndTime: number
  onLoadMore: (startTime: number) => void
  renderSummaryCardContent: (selectedActivity: Activity) => JSX.Element
}

type ScrollThresholdInfo = {
  scrollTopHeight: number
  nextPageStartTime: number
}

function determineLoadMoreThreshold(
  activityTracks: ActivityTrackProps[],
  timelineStartTime: number,
  timelineEndTime: number
): ScrollThresholdInfo {
  let [minStartTime, maxStartTime] = [Infinity, 0]
  for (const activityTrack of activityTracks) {
    const { activities = [] } = activityTrack || {}
    if (isNumber(activities[0]?.startTime) && activities[0].startTime < minStartTime) {
      minStartTime = activities[0].startTime
    }
    if (
      isNumber(activities[activities.length - 1]?.startTime) &&
      activities[activities.length - 1].startTime > maxStartTime
    ) {
      maxStartTime = activities[activities.length - 1].startTime
    }
  }

  const thresholdTimestamp = Math.floor((maxStartTime - timelineStartTime) * 0.6) + timelineStartTime
  const { timelineHeight, totalTimeDifference } = computeTimelineHeight(timelineStartTime, timelineEndTime)
  return {
    scrollTopHeight: computePositionOnTimeline(
      timelineStartTime,
      thresholdTimestamp,
      totalTimeDifference,
      timelineHeight
    ),
    nextPageStartTime: maxStartTime
  }
}

export function ActivityTimeline(props: ActivityTimelineViewProps): JSX.Element {
  const { activityTracks, timelineStartTime, timelineEndTime, renderSummaryCardContent, onLoadMore } = props
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null)
  const [activitySummaryCardRef, setActivitySummaryCardRef] = useState<HTMLDivElement | null>(null)
  const [nextScrollTopThreshold, setNextScrollTopThreshold] = useState<ScrollThresholdInfo>(
    determineLoadMoreThreshold(activityTracks, timelineStartTime, timelineEndTime)
  )

  const containerRef = useRef<HTMLDivElement>(null)
  const onScrollCallback = useCallback(
    e => {
      if (
        e.target?.scrollTop > nextScrollTopThreshold.scrollTopHeight &&
        nextScrollTopThreshold.nextPageStartTime > timelineEndTime
      ) {
        onLoadMore(nextScrollTopThreshold.nextPageStartTime)
      }
    },
    [nextScrollTopThreshold, timelineStartTime, timelineEndTime]
  )

  useEffect(() => {
    setNextScrollTopThreshold(determineLoadMoreThreshold(activityTracks, timelineStartTime, timelineEndTime))
  }, [activityTracks, timelineStartTime, timelineEndTime])

  useLayoutEffect(() => {
    const pageBodyElement = document.querySelector('[class*="PageBody-module_pageBody"]')
    pageBodyElement?.addEventListener('scroll', onScrollCallback)
    return () => pageBodyElement?.removeEventListener('scroll', onScrollCallback)
  }, [onScrollCallback])

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
    </>
  )
}
