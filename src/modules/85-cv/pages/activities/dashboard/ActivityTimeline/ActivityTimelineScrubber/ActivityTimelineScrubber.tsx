import React, { useLayoutEffect, useMemo, useState } from 'react'
import { Color, Container, Layout, Text } from '@wings-software/uikit'
import cx from 'classnames'
import Draggable from 'react-draggable'
import { getColorStyle } from '@common/components/HeatMap/ColorUtils'
import { getMonthIncrements, positionScrubberPoints } from './ActivityTimelineScrubberUtils'
import type { Activity } from '../ActivityTrack/ActivityTrackUtils'
import css from './ActivityTimelineScrubber.module.scss'

export interface MonthIntervalMarkersProps {
  timelineStartTime: number
  timelineEndTime: number
}

export interface ActivityTimelineScrubberProps {
  timelineStartTime: number
  timelineEndTime: number
  scrubberData: Activity[][]
}

export interface ScrubberLaneProps {
  timelineStartTime: number
  timelineEndTime: number
  laneHeight?: number
  scrubberData: Activity[][]
}

interface ScrubberProps {
  laneHeight: number
}

const TOP_OFFSET = 30

export function MonthIntervalMarkers(props: MonthIntervalMarkersProps): JSX.Element {
  const { timelineStartTime, timelineEndTime } = props
  const months = getMonthIncrements(timelineStartTime, timelineEndTime)

  return (
    <Layout.Vertical width={55} className={css.monthIntervalMarker}>
      {months.map(month => (
        <Container key={month} height={30} className={css.intervalContent}>
          <Text className={css.monthLabel} font={{ size: 'small' }} color={Color.BLACK}>
            {month}
          </Text>
          <Container background={Color.GREY_200} width={5} />
        </Container>
      ))}
    </Layout.Vertical>
  )
}

export function ScrubberLane(props: ScrubberLaneProps): JSX.Element {
  const { timelineStartTime, scrubberData, laneHeight } = props
  const plottedActivities = useMemo(() => {
    if (!laneHeight || !scrubberData?.length) return []

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
    <Container width={80} className={css.scrubberLaneContainer}>
      <Scrubber laneHeight={laneHeight || 0} />
      {plottedActivities}
    </Container>
  )
}

function Scrubber(props: ScrubberProps): JSX.Element {
  const { laneHeight } = props
  return (
    <Draggable axis="y" bounds={{ top: 0, bottom: laneHeight - 60 }} defaultClassNameDragging={css.draggingScrubber}>
      <Container className={css.scrubber} />
    </Draggable>
  )
}

export function ActivityTimelineScrubber(props: ActivityTimelineScrubberProps): JSX.Element {
  const { timelineStartTime, timelineEndTime, scrubberData } = props
  const [viewportHeight, setViewportHeight] = useState<number | undefined>()

  useLayoutEffect(() => {
    const pageHeader = document.querySelector('[class*="PageHeader"]')
    let contentHeight = window.innerHeight
    if (pageHeader) {
      contentHeight -= pageHeader.getBoundingClientRect().height
    }
    setViewportHeight(contentHeight)
  }, [])

  return (
    <Container className={css.main} height={viewportHeight}>
      <MonthIntervalMarkers timelineStartTime={timelineStartTime} timelineEndTime={timelineEndTime} />
      <ScrubberLane
        timelineStartTime={timelineStartTime}
        timelineEndTime={timelineEndTime}
        laneHeight={viewportHeight}
        scrubberData={scrubberData}
      />
    </Container>
  )
}
