import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Card, Color, Layout, Text, Icon, Container } from '@wings-software/uikit'
import type { IconProps } from '@wings-software/uikit/dist/icons/Icon'
import { Overlay } from '@blueprintjs/core'
import cx from 'classnames'
import { Activity, ActivityBucket, ACTIVITY_CARD_HEIGHT, placeActivitiesOnTrack } from './ActivityTrackUtils'
import css from './ActivityTrack.module.scss'

export interface ActivityTrackProps {
  trackName: string
  trackIcon: IconProps
  cardContent: (activity: Activity) => JSX.Element
  onActivityClick: (activity: Activity | null) => void
  activities: Activity[]
  startTime: number
  endTime: number
}

interface ActivityCardProps {
  cardContent: ActivityTrackProps['cardContent']
  activityBucket: ActivityBucket
  onActivityClick: ActivityTrackProps['onActivityClick']
  selectedActivityId?: string
}

const TRACK_WIDTH = 140
const ACTIVITY_SELECTION_EVENT = 'SelectActivityCardEvent'

function ActivityCard(props: ActivityCardProps): JSX.Element {
  const { cardContent, activityBucket, onActivityClick, selectedActivityId } = props
  const [isExpandedView, setExpandView] = useState(false)
  const { activities } = activityBucket
  const activitiesToRender = isExpandedView ? activities : [activities[0]]
  const toggleExpandCallback = (expandView: boolean) => () => {
    setExpandView(expandView)
    if (!expandView && selectedActivityId && selectedActivityId !== activityBucket?.activities?.[0].uuid) {
      onActivityClick(null)
    }
  }

  return (
    <div className={cx(isExpandedView ? css.expandedActivityCard : undefined)}>
      <Overlay
        isOpen={isExpandedView}
        className={css.overlayOnExpand}
        lazy={true}
        canEscapeKeyClose={true}
        canOutsideClickClose={true}
        onClose={toggleExpandCallback(false)}
      >
        <Container />
      </Overlay>
      {activitiesToRender.map((activity, index) => (
        <div key={activity.uuid}>
          <Card
            interactive={true}
            elevation={1}
            className={cx(css.activityCardContent, selectedActivityId === activity.uuid ? css.selectedCard : undefined)}
            style={{ height: ACTIVITY_CARD_HEIGHT }}
            onClick={() => {
              if (selectedActivityId !== activity.uuid) {
                onActivityClick({ ...activity, offset: index * ACTIVITY_CARD_HEIGHT })
              }
            }}
          >
            {cardContent?.(activity)}
          </Card>
        </div>
      ))}
      {activities.length > 1 && (
        <Text
          background={Color.BLUE_600}
          color={Color.WHITE}
          font={{ size: 'xsmall' }}
          className={css.stackedCardCount}
          onClick={toggleExpandCallback(!isExpandedView)}
        >
          {isExpandedView ? 'Collapse' : `+ ${activities.length}`}
        </Text>
      )}
    </div>
  )
}

function ActivityCardWrapper(props: ActivityCardProps): JSX.Element {
  const { cardContent, activityBucket, onActivityClick } = props
  const [isVisible, setVisible] = useState(false)
  const [selectedActivityId, setSelected] = useState<string | undefined>()
  const cardRef = useRef<HTMLDivElement>(null)
  const eventEmitHandler = useCallback(
    event => {
      if (!event?.detail?.isOwnBucket) setSelected(undefined)
      document.removeEventListener(ACTIVITY_SELECTION_EVENT, eventEmitHandler, false)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedActivityId]
  )

  useEffect(() => {
    if (selectedActivityId) document.addEventListener(ACTIVITY_SELECTION_EVENT, eventEmitHandler, false)
    return () => {
      if (selectedActivityId) document.removeEventListener(ACTIVITY_SELECTION_EVENT, eventEmitHandler, false)
    }
  }, [eventEmitHandler, selectedActivityId])

  useEffect(() => {
    const pageBodyElement = document.querySelector('[class*="PageBody-module_pageBody"]')
    if (!cardRef || !cardRef?.current || !pageBodyElement) return
    const cardRefElement = cardRef.current
    const intersectionObserver = new IntersectionObserver(arr => setVisible(arr[0].isIntersecting), {
      rootMargin: `200px 0px 200px 0px`,
      root: pageBodyElement,
      threshold: 0.5
    })
    intersectionObserver.observe(cardRefElement)
    return () => {
      intersectionObserver.unobserve(cardRefElement)
      intersectionObserver.disconnect()
    }
  }, [cardRef])

  return (
    <div ref={cardRef} className={css.activityCard} style={{ height: ACTIVITY_CARD_HEIGHT, top: activityBucket.top }}>
      {isVisible ? (
        <ActivityCard
          key={`${activityBucket.startTime}-${activityBucket.endTime}-${activityBucket.top}`}
          activityBucket={activityBucket}
          cardContent={cardContent}
          selectedActivityId={selectedActivityId}
          onActivityClick={selectedActivity => {
            document.dispatchEvent(
              new CustomEvent(ACTIVITY_SELECTION_EVENT, {
                bubbles: true,
                detail: selectedActivityId ? { isOwnBucket: true } : undefined
              })
            )
            setSelected(selectedActivity?.uuid)
            onActivityClick(selectedActivity ? { ...selectedActivity, ref: cardRef?.current || undefined } : null)
          }}
        />
      ) : null}
    </div>
  )
}

export function ActivityTrack(props: ActivityTrackProps): JSX.Element {
  const { trackIcon: iconProps, trackName, activities, cardContent, startTime, endTime, onActivityClick } = props
  const activityBuckets = useMemo(() => placeActivitiesOnTrack(startTime, endTime, activities), [
    startTime,
    endTime,
    activities
  ])

  return (
    <Container
      style={{
        height: activityBuckets[activityBuckets.length - 1].top + ACTIVITY_CARD_HEIGHT * 2,
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
      {activityBuckets.map((intervalBucket, index) => (
        <ActivityCardWrapper
          key={index}
          activityBucket={intervalBucket}
          cardContent={cardContent}
          onActivityClick={onActivityClick}
        />
      ))}
    </Container>
  )
}
