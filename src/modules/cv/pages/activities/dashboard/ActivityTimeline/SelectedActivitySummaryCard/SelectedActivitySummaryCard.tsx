import React, { useEffect, useRef } from 'react'
import { Color, Container, Text } from '@wings-software/uikit'
import moment from 'moment'
import type { Activity } from '../ActivityTrack/ActivityTrackUtils'
import css from './SelectedActivitySummaryCard.module.scss'

export interface SelectedActivitySummaryCardProps {
  selectedActivity?: Activity
  setCardRef?: (el: HTMLDivElement | null) => void
  activityTimelineContainerRef: HTMLDivElement | null
  renderSummaryCardContent: (data: Activity) => JSX.Element
}

const TIMESTAMP_FORMAT = 'MMMM D, YYYY h:mm a'

export function SelectedActivitySummaryCard(props: SelectedActivitySummaryCardProps): JSX.Element | null {
  const { selectedActivity, setCardRef, activityTimelineContainerRef, renderSummaryCardContent } = props
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
      <div className={css.summaryCard} ref={containerRef}>
        <Text className={css.timeLabel} color={Color.WHITE} font={{ size: 'small' }} background={Color.BLUE_500}>
          {moment(selectedActivity.startTime).format(TIMESTAMP_FORMAT)}
        </Text>
        <Container>{renderSummaryCardContent(selectedActivity)}</Container>
      </div>
    </Container>
  )
}
