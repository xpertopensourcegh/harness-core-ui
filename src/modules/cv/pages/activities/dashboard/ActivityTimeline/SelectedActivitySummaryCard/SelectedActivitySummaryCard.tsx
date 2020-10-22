import { Container } from '@wings-software/uikit'
import React, { useEffect, useRef } from 'react'
import type { Activity } from '../ActivityTrack/ActivityTrackUtils'
import css from './SelectedActivitySummaryCard.module.scss'

interface SelectedActivitySummaryCardProps {
  selectedActivity?: Activity
  setCardRef?: (el: HTMLDivElement | null) => void
  activityTimelineContainerRef: HTMLDivElement | null
}

export default function SelectedActivitySummaryCard(props: SelectedActivitySummaryCardProps): JSX.Element | null {
  const { selectedActivity, setCardRef, activityTimelineContainerRef } = props
  const containerRef = useRef<HTMLDivElement>(null)
  useEffect(() => setCardRef?.(containerRef?.current), [containerRef, setCardRef])
  if (!selectedActivity || !selectedActivity.ref || !activityTimelineContainerRef) return null
  const selectedCardTopPosition =
    selectedActivity.ref.getBoundingClientRect().top -
    activityTimelineContainerRef.getBoundingClientRect().top -
    20 +
    (selectedActivity.offset ?? 0)

  return (
    <Container className={css.main} style={{ top: selectedCardTopPosition }}>
      <Container width={50} />
      <div className={css.summaryCard} ref={containerRef} />
    </Container>
  )
}
