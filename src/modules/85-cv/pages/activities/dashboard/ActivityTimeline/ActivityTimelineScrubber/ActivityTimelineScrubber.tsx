import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Container } from '@wings-software/uikit'
import cx from 'classnames'
import Draggable from 'react-draggable'
import { getColorStyle } from '@common/components/HeatMap/ColorUtils'
import { positionScrubberPoints } from './ActivityTimelineScrubberUtils'
import type { Activity } from '../ActivityTrack/ActivityTrackUtils'
import css from './ActivityTimelineScrubber.module.scss'

export interface ActivityTimelineScrubberProps {
  timelineStartTime: number
  timelineEndTime: number
  scrubberData: Activity[][]
  scrubberLaneRef?: (ref: HTMLDivElement) => void
  scrubberRef?: (ref: React.Component) => void
  onScrubberPositionChange?: (updatedPosition: { x: number; y: number }) => void
}

interface ScrubberProps {
  laneHeight: number
  scrubberRef?: (ref: React.Component) => void
  onScrubberPositionChange?: (updatedPosition: { x: number; y: number }) => void
}

const TOP_OFFSET = 30

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
  const { timelineStartTime, scrubberData, scrubberLaneRef, onScrubberPositionChange, scrubberRef } = props
  const [laneHeight, setlaneHeight] = useState<number | undefined>()
  const laneRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const pageHeader = document.querySelector('[class*="PageHeader"]')
    let contentHeight = window.innerHeight
    if (pageHeader) {
      contentHeight -= pageHeader.getBoundingClientRect().height
    }
    setlaneHeight(contentHeight)
  }, [])

  useEffect(() => {
    if (laneRef?.current && scrubberLaneRef) {
      scrubberLaneRef(laneRef.current)
    }
  }, [laneRef, scrubberLaneRef])

  const plottedActivities = useMemo(() => {
    if (!laneHeight || !scrubberData || !scrubberData.length) return []

    let dataSetEndTime = Infinity
    for (const laneData of scrubberData) {
      if (laneData[laneData.length - 1].startTime < dataSetEndTime) {
        dataSetEndTime = laneData[laneData.length - 1].startTime
      }
    }

    return scrubberData.map((scrubberLaneData, index) => {
      const positionedLaneActivites = positionScrubberPoints(
        timelineStartTime,
        dataSetEndTime,
        scrubberLaneData,
        laneHeight - TOP_OFFSET,
        5
      )
      return (
        <Container key={index} className={css.scrubberLane} height={laneHeight - TOP_OFFSET}>
          {positionedLaneActivites.map(activity => (
            <Container
              height={4}
              width={4}
              key={activity.positionTop}
              className={cx(css.activity, getColorStyle(activity.overallRiskScore, 0, 100))}
              style={{ position: 'absolute', top: activity.positionTop }}
            />
          ))}
        </Container>
      )
    })
  }, [scrubberData, laneHeight, timelineStartTime])

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
