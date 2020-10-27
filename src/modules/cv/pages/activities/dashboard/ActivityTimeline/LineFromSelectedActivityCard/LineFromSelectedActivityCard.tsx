import React from 'react'
import { isNumber } from 'lodash-es'
import type { Activity } from '../ActivityTrack/ActivityTrackUtils'
import css from './LineFromSelectedActivityCard.module.scss'

export interface LineFromSelectedActivityCardProps {
  selectedActivity?: Activity | null
  selectedActivitySummaryCardRef: HTMLDivElement | null
  timelineContainerRef: HTMLDivElement | null
}

export function LineFromSelectedActivityCard(props: LineFromSelectedActivityCardProps): JSX.Element | null {
  const { selectedActivity, selectedActivitySummaryCardRef, timelineContainerRef } = props
  const summaryCardPosition = selectedActivitySummaryCardRef?.getBoundingClientRect().left
  if (!selectedActivity || !selectedActivity.ref || !timelineContainerRef || !isNumber(summaryCardPosition)) return null
  const { ref: activityCardRef, offset = 0 } = selectedActivity
  const {
    right: activityCardRefRight = 0,
    top: activityCardRefTop = 0,
    height: activityCardRefHeight
  } = activityCardRef.getBoundingClientRect()
  const { left: timelineContainerRefLeft, top: timelineContainerRefTop } = timelineContainerRef.getBoundingClientRect()
  const [x1, y1] = [
    activityCardRefRight - timelineContainerRefLeft,
    activityCardRefTop - timelineContainerRefTop + activityCardRefHeight * 0.25 + offset
  ]
  const x2 = summaryCardPosition - timelineContainerRefLeft
  return (
    <svg width="100%" height="10px" style={{ position: 'absolute', top: y1, zIndex: 2 }} className={css.main}>
      <line x1={x1} x2={x2} stroke="var(--blue-600)" strokeWidth="5" className={css.line} />
      <line x1={x1} x2={x2} stroke="var(--white)" strokeWidth="5" className={css.dashedLine} />
    </svg>
  )
}
