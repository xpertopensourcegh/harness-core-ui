import React, { useState } from 'react'
import { Container, Text, Button } from '@wings-software/uikit'
import cx from 'classnames'
import TimelineView, { TimelineViewProps } from '@common/components/TimelineView/TimelineView'
import type { ActivityDashboardDTO } from 'services/cv'
import { PredefinedLabels } from './TimelineViewLabel'
import TimelineTooltip from './TimelineTooltip'
import ActivitiesTimelineHeader from './ActivitiesTimelineHeader'
import EventSvg from './EventSvg'
import styles from './ActivitiesTimelineView.module.scss'

export interface EventData {
  startTime: number
  name: string
  verificationResult: ActivityDashboardDTO['verificationStatus']
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
  className?: string
  timelineViewProps?: Omit<TimelineViewProps, 'startTime' | 'endTime' | 'renderItem' | 'rows'>
}

const MAX_STACKED_EVENTS = 3

function generateEventsToPlot(items: EventData[]): EventData[] {
  if (!items?.length) return []
  if (items.length <= MAX_STACKED_EVENTS) return items
  const failedEvents = []
  const passedEvents = []
  const inProgressEvents = []
  const percentages = [0, 33, 66, 100]
  let [failedItemsToRender, passedItemsToRender, inProgressItemsToRender] = [0, 0, 0]

  for (const item of items) {
    if (item.verificationResult === 'ERROR' || item.verificationResult === 'VERIFICATION_FAILED') {
      failedEvents.push(item)
    } else if (item.verificationResult === 'VERIFICATION_PASSED') {
      passedEvents.push(item)
    } else if (item.verificationResult === 'IN_PROGRESS' || item.verificationResult === 'NOT_STARTED') {
      inProgressEvents.push(item)
    }
  }

  for (let percentageIndex = 0; percentageIndex < percentages.length; percentageIndex++) {
    if (Math.floor(failedEvents.length / items.length) * 100 >= percentages[percentageIndex]) {
      failedItemsToRender = percentageIndex
    }
    if (Math.floor(inProgressEvents.length / items.length) * 100 >= percentages[percentageIndex]) {
      inProgressItemsToRender = percentageIndex
    }

    if (Math.floor(passedEvents.length / items.length) * 100 >= percentages[percentageIndex]) {
      passedItemsToRender = percentageIndex
    }
  }

  return [
    ...inProgressEvents.slice(0, inProgressItemsToRender),
    ...failedEvents.slice(0, failedItemsToRender),
    ...passedEvents.slice(0, passedItemsToRender)
  ]
}

export default function ActivitiesTimelineView({
  startTime,
  endTime,
  canSelect,
  deployments = [],
  configChanges = [],
  infrastructureChanges = [],
  otherChanges = [],
  timelineViewProps,
  className
}: ActivitiesTimelineViewProps) {
  const [selectedEvent, setSelectedEvent] = useState<EventData | undefined>()
  const [zoomRange, setZoomRange] = useState<{ startTime: number; endTime: number } | undefined>()

  const zoomIn = (items: Array<EventData>) => {
    let zoomStartTime = items[0].startTime
    let zoomEndTime = items[items.length - 1].startTime
    let diff = zoomEndTime - zoomStartTime
    if (diff === 0) {
      diff = 1000 * 60 * 5
    }
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
        <Text font={{ size: 'xsmall' }} lineClamp={1} width={50}>
          {item.name}
        </Text>
      </Container>
    )
  }
  const renderBatch = (items: Array<EventData>) => {
    const itemsToRender = generateEventsToPlot(items)
    return (
      <Container className={styles.eventBatch}>
        <TimelineTooltip items={items}>
          <Container onClick={() => zoomIn(items)} className={styles.itemsGroup}>
            {itemsToRender.map((item: EventData, index: number) =>
              index + 1 > MAX_STACKED_EVENTS ? null : (
                <EventSvg
                  key={index}
                  style={{
                    top: -index * 2,
                    left: index * 4,
                    zIndex: MAX_STACKED_EVENTS - index
                  }}
                  item={item}
                />
              )
            )}
          </Container>
        </TimelineTooltip>
        <Text font={{ size: 'xsmall' }} lineClamp={1} width={50}>{`${items.length} Events`}</Text>
      </Container>
    )
  }

  const selectedRange = zoomRange || { startTime, endTime }

  return (
    <Container className={cx(styles.main, className)}>
      {zoomRange && (
        <Button
          className={styles.resetZoomButton}
          iconProps={{ size: 12 }}
          rightIcon="main-zoom-out"
          minimal
          onClick={zoomOut}
        ></Button>
      )}
      {canSelect && <ActivitiesTimelineHeader selectedItem={selectedEvent} />}
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
        {...timelineViewProps}
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
        { startTime: 1602590400000, name: 'DB Integration 1001', verificationResult: 'VERIFICATION_PASSED' },
        { startTime: 1602590400000 + 30 * 60 * 1000, name: 'DB Deletion 2', verificationResult: 'VERIFICATION_PASSED' },
        {
          startTime: 1602590400000 + 120 * 60 * 1000,
          name: 'DB Deletion 3',
          verificationResult: 'VERIFICATION_FAILED'
        },
        {
          startTime: 1602590400000 + 140 * 60 * 1000,
          name: 'DB Deletion 4',
          verificationResult: 'VERIFICATION_PASSED'
        },
        { startTime: 1602590400000 + 170 * 60 * 1000, name: 'DB Deletion 5', verificationResult: 'VERIFICATION_FAILED' }
      ]}
    />
  )
}
