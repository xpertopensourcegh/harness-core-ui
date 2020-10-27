import React, { useState } from 'react'
import { Container, Text, Button } from '@wings-software/uikit'
import TimelineView from 'modules/common/components/TimelineView/TimelineView'
import { PredefinedLabels } from './TimelineViewLabel'
import TimelineTooltip from './TimelineTooltip'
import ActivitiesTimelineHeader from './ActivitiesTimelineHeader'
import EventSvg from './EventSvg'
import styles from './ActivitiesTimelineView.module.scss'

export interface EventData {
  startTime: number
  name: string
  verificationResult: 'PASSED' | 'FAILED'
  [x: string]: any
}

export interface ActivitiesTimelineViewProps {
  startTime: number
  endTime: number
  canSelect?: boolean
  deployments?: Array<EventData>
  configChanges?: Array<EventData>
  infrastructureChanges?: Array<EventData>
  otherChanges?: Array<EventData>
}

export default function ActivitiesTimelineView({
  startTime,
  endTime,
  canSelect,
  deployments = [],
  configChanges = [],
  infrastructureChanges = [],
  otherChanges = []
}: ActivitiesTimelineViewProps) {
  const [selectedEvent, setSelectedEvent] = useState<EventData | undefined>()
  const [zoomRange, setZoomRange] = useState<{ startTime: number; endTime: number } | undefined>()

  const zoomIn = (items: Array<EventData>) => {
    let zoomStartTime = items[0].startTime
    let zoomEndTime = items[items.length - 1].startTime
    const diff = zoomEndTime - zoomStartTime
    zoomStartTime = Math.max(zoomStartTime - Math.floor(diff / 2), startTime)
    zoomEndTime = Math.min(zoomEndTime + Math.floor(diff / 2), endTime)
    setZoomRange({
      startTime: zoomStartTime,
      endTime: zoomEndTime
    })
  }

  const zoomOut = () => setZoomRange(undefined)

  const renderItem = (item: EventData) => {
    return (
      <Container className={styles.eventItem}>
        <TimelineTooltip items={[item]}>
          <EventSvg selected={item === selectedEvent} item={item} onSelect={canSelect ? setSelectedEvent : undefined} />
        </TimelineTooltip>
        <Text font={{ size: 'xsmall' }} lineClamp={2} width={70}>
          {item.name}
        </Text>
      </Container>
    )
  }
  const renderBatch = (items: Array<EventData>) => {
    return (
      <Container className={styles.eventBatch}>
        <TimelineTooltip items={items}>
          <Container
            onClick={() => zoomIn(items)}
            className={styles.itemsGroup}
            style={{ marginBottom: (items.length - 1) * 3 }}
          >
            {items.map((item: EventData, index: number) => (
              <EventSvg
                key={index}
                style={{
                  top: index * 3,
                  left: -index * 3,
                  zIndex: index
                }}
                item={item}
              />
            ))}
          </Container>
        </TimelineTooltip>
        <Text font={{ size: 'xsmall' }} lineClamp={2} width={70}>{`${items.length} Events`}</Text>
      </Container>
    )
  }

  const selectedRange = zoomRange || { startTime, endTime }

  return (
    <Container className={styles.main}>
      {zoomRange && (
        <Button
          className={styles.resetZoomButton}
          iconProps={{ size: 12 }}
          rightIcon="main-zoom-out"
          minimal
          onClick={zoomOut}
        ></Button>
      )}
      <ActivitiesTimelineHeader selectedItem={selectedEvent} />
      <TimelineView
        {...selectedRange}
        labelsWidth={215}
        rows={[
          {
            name: PredefinedLabels.deployments,
            data: deployments
          },
          {
            name: PredefinedLabels.configChanges,
            data: configChanges
          },
          {
            name: PredefinedLabels.infrastructureChanges,
            data: infrastructureChanges
          },
          {
            name: PredefinedLabels.otherChanges,
            data: otherChanges
          }
        ]}
        renderItem={renderItem}
        minItemsDistance={70}
        renderBatch={renderBatch}
      />
    </Container>
  )
}

export function ActivitiesFlagBorder() {
  return <Container className="activities-timeline-flag-border" />
}

export function MockedActivitiesTimelineView() {
  const [startDate] = useState(1602590400000)
  const [endDate] = useState(1602590400000 + 4 * 60 * 60 * 1000)
  return (
    <ActivitiesTimelineView
      startTime={startDate}
      endTime={endDate}
      canSelect
      deployments={[
        { startTime: 1602590400000, name: 'DB Integration 1001', verificationResult: 'PASSED' },
        { startTime: 1602590400000 + 30 * 60 * 1000, name: 'DB Deletion 2', verificationResult: 'PASSED' },
        { startTime: 1602590400000 + 120 * 60 * 1000, name: 'DB Deletion 3', verificationResult: 'FAILED' },
        { startTime: 1602590400000 + 140 * 60 * 1000, name: 'DB Deletion 4', verificationResult: 'PASSED' },
        { startTime: 1602590400000 + 170 * 60 * 1000, name: 'DB Deletion 5', verificationResult: 'FAILED' }
      ]}
    />
  )
}
