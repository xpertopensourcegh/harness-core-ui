import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Card, Color, Container, Layout, Text, Icon } from '@wings-software/uikit'
import type { IconProps } from '@wings-software/uikit/dist/icons/Icon'
import cx from 'classnames'
import { Activity, ActivityBucket, ACTIVITY_CARD_HEIGHT, placeActivitiesOnTrack } from './ActivityTrackUtils'
import css from './ActivityTrack.module.scss'

export interface ActivityTrackProps {
  trackName: string
  trackIcon: IconProps
  cardContent: (activity: Activity) => JSX.Element
  onActivityClick: (activity: Activity) => void
  activities: Activity[]
  startTime: number
  endTime: number
}

interface ActivityCardProps {
  cardContent: ActivityTrackProps['cardContent']
  activityBucket: ActivityBucket
}

const TRACK_WIDTH = 140

function ActivityCard(props: ActivityCardProps): JSX.Element {
  const { cardContent, activityBucket } = props
  const [isVisible, setVisible] = useState(false)
  const [isExpandedView, setExpandView] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const { activities, top } = activityBucket
  const activitiesToRender = isExpandedView ? activities : [activities[0]]

  useEffect(() => {
    if (!cardRef || !cardRef?.current) return
    const cardRefElement = cardRef.current
    const intersectionObserver = new IntersectionObserver(
      arr => {
        setVisible(arr[0].isIntersecting)
      },
      {
        threshold: 0.25
      }
    )
    intersectionObserver.observe(cardRefElement)
    return () => {
      intersectionObserver.unobserve(cardRefElement)
      intersectionObserver.disconnect()
    }
  }, [cardRef])

  if (!isVisible) {
    return <div ref={cardRef} style={{ top }} className={css.activityCard} />
  }

  return (
    <div
      ref={cardRef}
      style={{ top }}
      className={cx(css.activityCard, isExpandedView ? css.expandedActivityCard : undefined)}
    >
      {activitiesToRender.map((activity, index) => (
        <Card
          interactive={true}
          elevation={2}
          key={index}
          className={css.activityCardContent}
          style={{ height: ACTIVITY_CARD_HEIGHT }}
        >
          {cardContent?.(activity)}
        </Card>
      ))}
      {activities.length > 1 && (
        <Text
          background={Color.BLUE_500}
          color={Color.WHITE}
          font={{ size: 'xsmall' }}
          className={css.stackedCardCount}
          onClick={() => setExpandView(isExpanded => !isExpanded)}
        >
          {isExpandedView ? 'Collapse' : `+ ${activities.length}`}
        </Text>
      )}
    </div>
  )
}

export function ActivityTrack(props: ActivityTrackProps): JSX.Element {
  const { trackIcon: iconProps, trackName, activities, cardContent, startTime, endTime } = props
  const buckets = useMemo(() => placeActivitiesOnTrack(startTime, endTime, activities), [
    startTime,
    endTime,
    activities
  ])

  return (
    <Container
      style={{
        height: buckets[buckets.length - 1].top + ACTIVITY_CARD_HEIGHT * 2,
        width: TRACK_WIDTH,
        padding: 'var(--spacing-xsmall)'
      }}
      id={trackName}
      className={css.main}
    >
      <Layout.Vertical
        background={Color.GREY_100}
        className={css.trackTitle}
        style={{ alignItems: 'center' }}
        padding="small"
      >
        <Icon {...iconProps} />
        <Text>{trackName}</Text>
      </Layout.Vertical>
      {buckets.map(bucket =>
        bucket?.activities?.length > 0 ? (
          <ActivityCard
            key={`${bucket.startTime}-${bucket.endTime}-${trackName}`}
            activityBucket={bucket}
            cardContent={cardContent}
          />
        ) : null
      )}
    </Container>
  )
}
