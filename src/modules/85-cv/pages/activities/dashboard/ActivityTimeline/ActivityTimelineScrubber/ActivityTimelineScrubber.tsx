import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Container } from '@wings-software/uicore'
import Draggable from 'react-draggable'
import { getScrubberLaneDataHeight, positionScrubberPoints } from './ActivityTimelineScrubberUtils'
import type { Activity } from '../ActivityTrack/ActivityTrackUtils'
import { activityStatusToColor } from '../../ActivityDashboardPageUtils'
import css from './ActivityTimelineScrubber.module.scss'

export interface ActivityTimelineScrubberProps {
  timelineStartTime: number
  timelineEndTime: number
  scrubberData: Activity[][]
  scrubberLaneRef?: (ref: HTMLDivElement) => void
  scrubberRef?: (ref: React.Component) => void
  timelineContainerRef: HTMLDivElement | null
  onScrubberPositionChange?: (updatedPosition: { x: number; y: number }) => void
}

interface ScrubberProps {
  laneHeight: number
  scrubberRef?: (ref: React.Component) => void
  onScrubberPositionChange?: (updatedPosition: { x: number; y: number }) => void
}

const TOP_OFFSET = 25

function Scrubber(props: ScrubberProps): JSX.Element {
  const { laneHeight, scrubberRef: scrubberRefFunc, onScrubberPositionChange } = props
  const scrubberRef = useRef(null)
  useEffect(() => {
    const nodeReference = scrubberRef?.current
    if (nodeReference) scrubberRefFunc?.(nodeReference)
  }, [scrubberRef, scrubberRefFunc])

  return (
    <Draggable
      axis="y"
      bounds={{ top: 0, bottom: laneHeight - 60 }}
      defaultClassNameDragging={css.draggingScrubber}
      ref={scrubberRef}
      onDrag={(e, data) => {
        e.stopPropagation()
        onScrubberPositionChange?.({ x: data.x, y: data.y })
      }}
    >
      <Container className={css.scrubber} />
    </Draggable>
  )
}

export function ActivityTimelineScrubber(props: ActivityTimelineScrubberProps): JSX.Element {
  const {
    timelineStartTime,
    timelineEndTime,
    scrubberData,
    scrubberLaneRef,
    onScrubberPositionChange,
    scrubberRef,
    timelineContainerRef
  } = props
  const [laneHeight, setlaneHeight] = useState<number | undefined>()
  const laneRef = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    setlaneHeight(timelineContainerRef?.getBoundingClientRect().height || 0)
  }, [timelineContainerRef?.getBoundingClientRect])

  useEffect(() => {
    if (laneRef?.current && scrubberLaneRef) {
      scrubberLaneRef(laneRef.current)
    }
  }, [laneRef, scrubberLaneRef])

  const plottedActivities = useMemo(() => {
    if (!laneHeight || !scrubberData || !scrubberData.length) return []

    return scrubberData.map((scrubberLaneData, index) => {
      const positionedLaneActivites = positionScrubberPoints(
        timelineStartTime,
        timelineEndTime,
        scrubberLaneData,
        getScrubberLaneDataHeight(timelineStartTime, timelineEndTime, laneHeight - TOP_OFFSET),
        5
      )
      return (
        <Container key={index} className={css.scrubberLane} height={laneHeight - TOP_OFFSET}>
          {positionedLaneActivites.map(activity => (
            <Container
              height={4}
              width={4}
              key={activity.positionTop}
              background={activityStatusToColor(activity.status)}
              className={css.activityDot}
              style={{ position: 'absolute', top: activity.positionTop }}
            />
          ))}
        </Container>
      )
    })
  }, [scrubberData, laneHeight, timelineStartTime, timelineEndTime])

  return (
    <div className={css.scrubberLaneContainer} ref={scrubberLaneRef} style={{ height: laneHeight }}>
      <Container className={css.laneContainer} onClick={e => onScrubberPositionChange?.({ x: 0, y: e.clientY - 100 })}>
        {plottedActivities}
      </Container>
      <Scrubber
        laneHeight={laneHeight || 0}
        onScrubberPositionChange={onScrubberPositionChange}
        scrubberRef={scrubberRef}
      />
    </div>
  )
}
