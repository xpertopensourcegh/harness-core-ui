import React, { useEffect, useState, useRef } from 'react'
import { Container, Text } from '@wings-software/uikit'
import type { EventData } from './ActivitiesTimelineView'
import styles from './ActivitiesTimelineView.module.scss'

export interface ActivitiesTimelineHeaderProps {
  selectedItem?: EventData
}

export default function ActivitiesTimelineHeader({ selectedItem }: ActivitiesTimelineHeaderProps) {
  const { barRef, positionData } = usePositionData(selectedItem)

  return (
    <Container className={styles.timelineHeader}>
      <Container className={styles.headerSideContent}>
        <Text font={{ weight: 'bold' }}>Activity Timeline</Text>
      </Container>
      <div ref={barRef} className={styles.headerBar}>
        <Container
          style={
            (selectedItem && {
              flexBasis: positionData?.dx,
              flexGrow: 0,
              backgroundColor: 'var(--grey-300)'
            }) ||
            {}
          }
          className={styles.headerPrimaryMsg}
        >
          {positionData?.dx && selectedItem?.headerLabels?.primary}
        </Container>
        <Container
          style={
            (selectedItem && {
              flex: 1
            }) ||
            {}
          }
          className={styles.headerSecondaryMsg}
        >
          {selectedItem && <Container style={{ height: positionData?.height }} className={styles.verticalLine} />}
        </Container>
      </div>
    </Container>
  )
}

function usePositionData(selectedItem?: EventData) {
  const barRef = useRef<HTMLDivElement>(null)
  const [positionData, setPositionData] = useState<any>()

  const recalculatePositionData = () => {
    if (selectedItem) {
      const br = barRef.current?.getBoundingClientRect()
      const targetElement = document.querySelector('.timeline-flag-target')
      const borderElement = document.querySelector('.activities-timeline-flag-border')
      if (targetElement && borderElement) {
        const targetRect = targetElement.getBoundingClientRect()
        const borderRect = borderElement.getBoundingClientRect()
        setPositionData({
          dx: targetRect.x + targetRect.width / 2 - br!.x,
          height: borderRect.y - br!.y
        })
      } else {
        setPositionData(undefined)
      }
    } else if (positionData) {
      setPositionData(undefined)
    }
  }

  useEffect(() => {
    recalculatePositionData()
    if (selectedItem) {
      window.addEventListener('resize', recalculatePositionData)
      const interval = setInterval(recalculatePositionData, 300)
      return () => {
        window.removeEventListener('resize', recalculatePositionData)
        clearInterval(interval)
      }
    }
  }, [selectedItem])

  return { barRef, positionData }
}
