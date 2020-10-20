import React, { useMemo, useState } from 'react'
import { Color, Container, Icon, Layout, Text } from '@wings-software/uikit'
import type { IconProps } from '@wings-software/uikit/dist/icons/Icon'
import moment from 'moment'
import { ITooltipProps, PopoverInteractionKind, Position, Tooltip } from '@blueprintjs/core'
import cx from 'classnames'
import TimelineView from 'modules/common/components/TimelineView/TimelineView'
import i18n from './ServiceActivityTimeline.i18n'
import css from './ServiceActivityTimeline.module.scss'

interface ServiceActivityTimelineProps {
  startTime: number
  endTime: number
}

interface TimelineViewLabelProps {
  labelName: string
  iconProps: IconProps
}

interface TimelineEventProps {
  event: TimelineBucket
  onAggregateEventClick?: (startTime: number, endTime: number) => void
}

interface TimelineEventTooltipProps {
  eventNames: string[]
  totalEvents: number
  eventStartTime: number
  eventEndTime: number
  children: JSX.Element | JSX.Element[]
}

type TimelineBucket = {
  startTime: number
  endTime: number
  events: typeof MockData
  eventNames: string[]
  isHomogenousBucket: boolean
  totalSuccessfulEvents: number
}

const MockData = [
  {
    eventType: 'infraChange',
    occurenceTime: Math.round((new Date().getTime() - 1000 * 60 * 60 * 24) / (1000 * 60 * 5)) * 1000 * 60 * 5,
    eventName: 'DB Deletion',
    verificationResult: 'PASSED'
  },
  {
    eventType: 'infraChange',
    occurenceTime: Math.round((new Date().getTime() - 1000 * 60 * 60 * 24 + 31000) / (1000 * 60 * 5)) * 1000 * 60 * 5,
    eventName: 'DB Deletion',
    verificationResult: 'PASSED'
  },
  {
    eventType: 'infraChange',
    occurenceTime: Math.round((new Date().getTime() - 1000 * 60 * 60 * 24) / (1000 * 60 * 5)) * 1000 * 60 * 5,
    eventName: 'DB Deletion',
    verificationResult: 'PASSED'
  },
  {
    eventType: 'infraChange',
    occurenceTime:
      Math.round((new Date().getTime() - 1000 * 60 * 60 * 12 - 12 * 60 * 60) / (1000 * 60 * 5)) * 1000 * 60 * 5,
    eventName: 'DB Deletion',
    verificationResult: 'PASSED'
  },
  {
    eventType: 'infraChange',
    occurenceTime:
      Math.round((new Date().getTime() - 1000 * 60 * 60 * 12 - 11 * 60 * 60) / (1000 * 60 * 5)) * 1000 * 60 * 5,
    eventName: 'DB Deletion',
    verificationResult: 'PASSED'
  },
  {
    eventType: 'infraChange',
    occurenceTime: Math.round((new Date().getTime() - 1000 * 60 * 60 * 3) / (1000 * 60 * 5)) * 1000 * 60 * 5,
    eventName: 'DB Change',
    verificationResult: 'FAILED'
  },
  {
    eventType: 'infraChange',
    occurenceTime: Math.round((new Date().getTime() - 1000 * 60 * 60 * 3) / (1000 * 60 * 5)) * 1000 * 60 * 5,
    eventName: 'DB Change',
    verificationResult: 'PASSED'
  },
  {
    eventType: 'infraChange',
    occurenceTime: Math.round((new Date().getTime() - 1000 * 60 * 60 * 3) / (1000 * 60 * 5)) * 1000 * 60 * 5,
    eventName: 'DB Change',
    verificationResult: 'PASSED'
  },
  {
    eventType: 'infraChange',
    occurenceTime:
      Math.round((new Date().getTime() - 1000 * 60 * 60 * 3 + 1000 * 60 * 15) / (1000 * 60 * 5)) * 1000 * 60 * 5,
    eventName: 'DB Change',
    verificationResult: 'PASSED'
  },
  {
    eventType: 'infraChange',
    occurenceTime:
      Math.round((new Date().getTime() - 1000 * 60 * 60 * 3 + 1000 * 60 * 15) / (1000 * 60 * 5)) * 1000 * 60 * 5,
    eventName: 'KubeChange Change',
    verificationResult: 'PASSED'
  },
  {
    eventType: 'infraChange',
    occurenceTime:
      Math.round((new Date().getTime() - 1000 * 60 * 60 * 3 + 1000 * 60 * 15 + 12000) / (1000 * 60 * 5)) *
      1000 *
      60 *
      5,
    eventName: 'KubeChange Change',
    verificationResult: 'PASSED'
  },
  {
    eventType: 'infraChange',
    occurenceTime:
      Math.round((new Date().getTime() - 1000 * 60 * 60 * 1.75 - 15 * 60 * 1000) / (1000 * 60 * 5)) * 1000 * 60 * 5,
    eventName: 'DB Change',
    verificationResult: 'FAILED'
  },
  {
    eventType: 'infraChange',
    occurenceTime:
      Math.round((new Date().getTime() - 1000 * 60 * 60 * 1.75 - 12 * 60 * 1000) / (1000 * 60 * 5)) * 1000 * 60 * 5,
    eventName: 'DB Change',
    verificationResult: 'FAILED'
  },
  {
    eventType: 'infraChange',
    occurenceTime: Math.round((new Date().getTime() - 1000 * 60 * 60 * 1.75) / (1000 * 60 * 5)) * 1000 * 60 * 5,
    eventName: 'DB Change',
    verificationResult: 'FAILED'
  },
  {
    eventType: 'infraChange',
    occurenceTime: Math.round((new Date().getTime() - 1000 * 60 * 60 * 1) / (1000 * 60 * 5)) * 1000 * 60 * 5,
    eventName: 'DB Change',
    verificationResult: 'PASSED'
  },
  {
    eventType: 'infraChange',
    occurenceTime: Math.round((new Date().getTime() - 1000 * 60 * 15) / (1000 * 60 * 5)) * 1000 * 60 * 5,
    eventName: 'DB Deletion',
    verificationResult: 'PASSED'
  },
  {
    eventType: 'infraChange',
    occurenceTime: Math.round(new Date().getTime() / (1000 * 60 * 5)) * 1000 * 60 * 5,
    eventName: 'DB Deletion',
    verificationResult: 'PASSED'
  }
]

const BucketIntervals = {
  5: 30000,
  15: 60000,
  30: 60000 * 5,
  45: 60000 * 2.5,
  240: 60000 * 15,
  [12 * 60]: 60000 * 45,
  [24 * 60]: 60000 * 80,
  [168 * 60]: 60000 * 60 * 12
}

const TimelineBucketWidth = {
  0.5: 45,
  1: 45,
  2.5: 45,
  5: 45,
  15: 55,
  45: 45,
  80: 45,
  [60 * 12]: 60
}

function initializeTimeline(dataArr: typeof MockData, startTime: number, endTime: number): TimelineBucket[] {
  const timelineIntervalBuckets = new Map<number, TimelineBucket>()
  const timeRangeInMinutes = moment(endTime).diff(moment(startTime), 'minutes') || 240
  for (
    let minuteInterval = startTime;
    minuteInterval < endTime;
    minuteInterval += BucketIntervals[timeRangeInMinutes]
  ) {
    timelineIntervalBuckets.set(minuteInterval, {
      eventNames: [],
      events: [],
      startTime: minuteInterval,
      endTime: minuteInterval + BucketIntervals[timeRangeInMinutes],
      isHomogenousBucket: true,
      totalSuccessfulEvents: 0
    })
  }

  // assign events to buckets, buckets have a specific start and endtime
  for (const event of dataArr) {
    let timelineBucket = undefined

    // for events that have an invalid timestamp for the given time range
    if (event.occurenceTime > endTime || event.occurenceTime < startTime) {
      continue
    }

    // find the bucket the event belongs to
    for (const bucket of timelineIntervalBuckets.values()) {
      if (bucket.endTime >= event.occurenceTime && bucket.startTime <= event.occurenceTime) {
        timelineBucket = bucket
        break
      }
    }

    if (!timelineBucket) continue
    timelineBucket.events.push(event)
    if (!timelineBucket.eventNames.find(e => e === event.eventName)) {
      timelineBucket.eventNames.push(event.eventName)
    }

    timelineBucket.totalSuccessfulEvents += event.verificationResult === 'PASSED' ? 1 : 0
  }

  return Array.from(timelineIntervalBuckets.values())
}

function TimelineViewLabel({ labelName, iconProps }: TimelineViewLabelProps): JSX.Element {
  return (
    <Container className={css.timelineViewLabel} width={185} padding="medium" background={Color.GREY_200}>
      <Icon {...iconProps} />
      <Text color={Color.BLACK} font={{ size: 'small' }}>
        {labelName}
      </Text>
    </Container>
  )
}

function TimelineEventTooltip(props: TimelineEventTooltipProps): JSX.Element {
  const { eventStartTime, eventEndTime, totalEvents, eventNames, children } = props
  const tooltipHeaderString =
    totalEvents === 1
      ? moment(eventStartTime).format('MMM D, h:mm a')
      : `${moment(eventStartTime).format('MMM D, h:mm a')} - ${moment(eventEndTime).format('MMM D, h:mm a')}`

  let tooltipContainerWidth = 16
  if (totalEvents === 2) {
    tooltipContainerWidth = 20
  } else if (totalEvents === 3) {
    tooltipContainerWidth = 24
  }

  const tooltipProps: ITooltipProps = {
    lazy: true,
    position: Position.TOP,
    interactionKind: PopoverInteractionKind.HOVER,
    content: (
      <Container>
        <Text font={{ size: 'small' }}>{tooltipHeaderString}</Text>
        {eventNames.map((name, index) => (
          <Text key={`${name}-${index}`} font={{ size: 'small' }}>
            {name}
          </Text>
        ))}
      </Container>
    )
  }

  return (
    <Tooltip {...tooltipProps}>
      <Container height={16} width={tooltipContainerWidth}>
        {children}
      </Container>
    </Tooltip>
  )
}

function TimelineEvent(props: TimelineEventProps): JSX.Element | null {
  const { event, onAggregateEventClick } = props
  const { eventNames, events, startTime, endTime } = event
  const eventTimeRange = Math.round(moment.duration(moment(endTime).diff(startTime)).asMinutes())

  if (!events?.length) return null
  const isSingleEvent = events.length === 1
  const totalPolygons = events.length > 3 ? 3 : events.length

  return (
    <Layout.Vertical
      width={TimelineBucketWidth[eventTimeRange]}
      height={31}
      className={css.timelineEvent}
      onClick={() => onAggregateEventClick?.(startTime, endTime)}
    >
      <TimelineEventTooltip
        eventStartTime={event.startTime}
        eventEndTime={event.endTime}
        totalEvents={totalPolygons}
        eventNames={eventNames}
      >
        {Array.from(Array(totalPolygons).keys()).map(val => (
          <Container
            key={val}
            height={16}
            width={16}
            className={cx(
              css.polygon,
              events[val].verificationResult === 'PASSED' ? css.successPolygon : css.errorPolygon
            )}
            data-name={val.toString()}
          />
        ))}
      </TimelineEventTooltip>
      <Text
        lineClamp={1}
        width={TimelineBucketWidth[eventTimeRange]}
        font={{ size: 'xsmall' }}
        style={{ marginLeft: isSingleEvent ? -18 : -10 }}
        color={Color.GREY_300}
      >
        {isSingleEvent ? eventNames[0] : `${events.length} Events`}
      </Text>
    </Layout.Vertical>
  )
}

export default function ServiceActivityTimeline(props: ServiceActivityTimelineProps): JSX.Element | null {
  const { endTime, startTime } = props
  const [zoomTimeRange, setZoomTimeRange] = useState<{ zoomStartTime: number; zoomEndTime: number } | undefined>()
  const timelineEvents = useMemo(
    () =>
      initializeTimeline(
        [
          ...MockData,
          { ...MockData[0], occurenceTime: startTime },
          { ...MockData[0], occurenceTime: startTime + 60000 * 15 },
          { ...MockData[0], occurenceTime: endTime }
        ],
        zoomTimeRange?.zoomStartTime || startTime,
        zoomTimeRange?.zoomEndTime || endTime
      ),
    [startTime, endTime, zoomTimeRange?.zoomStartTime, zoomTimeRange?.zoomEndTime]
  )

  if (!startTime || !endTime) return null
  return (
    <Container className={css.main}>
      {zoomTimeRange ? (
        <Text onClick={() => setZoomTimeRange(undefined)} className={css.zoomOutButton}>
          {i18n.resetZoomButtonText}
        </Text>
      ) : null}
      <TimelineView
        startTime={zoomTimeRange?.zoomStartTime || startTime}
        endTime={zoomTimeRange?.zoomEndTime || endTime}
        className={css.activityView}
        labelsWidth={185}
        timelineBarProps={{
          columnWidth: 65,
          className: css.serviceTimelineBar
        }}
        rows={[
          {
            name: (
              <TimelineViewLabel
                labelName="Deployments"
                iconProps={{
                  name: 'nav-cd',
                  size: 20
                }}
              />
            ),
            data: []
          },
          {
            name: (
              <TimelineViewLabel
                labelName="Config Changes"
                iconProps={{
                  name: 'wrench',
                  size: 13,
                  intent: 'success'
                }}
              />
            ),
            data: []
          },
          {
            name: (
              <TimelineViewLabel
                labelName="Infrastructure Changes"
                iconProps={{
                  name: 'service-kubernetes',
                  size: 17
                }}
              />
            ),
            data: timelineEvents
          },
          {
            name: (
              <TimelineViewLabel
                labelName="Other Changes"
                iconProps={{
                  name: 'wrench',
                  size: 13,
                  intent: 'success'
                }}
              />
            ),
            data: []
          }
        ]}
        renderItem={item => (
          <TimelineEvent
            event={item as TimelineBucket}
            onAggregateEventClick={
              zoomTimeRange || item?.events?.length <= 1
                ? undefined
                : (eventStartTime, eventEndTime) => {
                    setZoomTimeRange({ zoomEndTime: eventEndTime, zoomStartTime: eventStartTime })
                  }
            }
          />
        )}
      />
    </Container>
  )
}
