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
  if (
    !selectedActivity ||
    !isNumber(selectedActivity.top) ||
    !selectedActivity.ref ||
    !timelineContainerRef ||
    !isNumber(summaryCardPosition)
  )
    return null

  // draw line starting from selectedActivity card to begining of summary card
  const { ref: activityCardRef, offset = 0, top: selectedActivityTop } = selectedActivity
  const { right: activityCardRefRight = 0, height: activityCardRefHeight } = activityCardRef.getBoundingClientRect()
  const { left: timelineContainerRefLeft } = timelineContainerRef.getBoundingClientRect()
  const [x1, y1] = [
    activityCardRefRight - timelineContainerRefLeft, // x position of the line from the left side of container
    selectedActivityTop + activityCardRefHeight * 0.25 + offset // y position of the line from top of container
  ]
  const x2 = summaryCardPosition - timelineContainerRefLeft // x endpoint of the line from the left of the container
  return (
    <svg width="100%" height="10px" style={{ position: 'absolute', top: y1, zIndex: 2 }} className={css.main}>
      <line x1={x1} x2={x2} stroke="var(--blue-600)" strokeWidth="5" className={css.line} />
      <line x1={x1} x2={x2} stroke="var(--white)" strokeWidth="5" className={css.dashedLine} />
    </svg>
  )
}
