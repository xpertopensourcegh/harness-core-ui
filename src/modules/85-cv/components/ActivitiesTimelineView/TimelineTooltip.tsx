import React from 'react'
import moment from 'moment'
import { IconName, Layout, Popover, Text } from '@wings-software/uicore'
import { PopoverInteractionKind, Position } from '@blueprintjs/core'
import type { EventData } from './ActivitiesTimelineView'
import css from './TimelineTooltip.module.scss'

export interface TimelineTooltipProps {
  items: EventData[]
  children?: JSX.Element
}

export function verificationResultToIcon(verificationResult: EventData['verificationResult']): IconName | undefined {
  switch (verificationResult) {
    case 'VERIFICATION_PASSED':
      return 'deployment-success-legacy'
    case 'VERIFICATION_FAILED':
    case 'ERROR':
      return 'deployment-failed-legacy'
    case 'IN_PROGRESS':
    case 'NOT_STARTED':
      return 'deployment-inprogress-legacy'
    default:
      return undefined
  }
}

export function TimelineTooltip({ items, children }: TimelineTooltipProps): JSX.Element {
  let dateLabel = moment(items[0].startTime).format('MMM D, h:mm a')
  if (items.length > 1) {
    dateLabel = `${dateLabel} - ${moment(items[items.length - 1].startTime).format('MMM D, h:mm a')}`
  }
  return (
    <Popover
      lazy={true}
      position={Position.TOP}
      interactionKind={PopoverInteractionKind.HOVER}
      content={
        <Layout.Vertical className={css.main}>
          <Text className={css.timestamp}>{dateLabel}</Text>
          {items.map((item, i) => {
            const { verificationResult, name } = item || {}
            return name && verificationResult ? (
              <Text
                className={css.activityName}
                key={i}
                rightIcon={verificationResultToIcon(verificationResult)}
                rightIconProps={{ size: 10 }}
              >
                {`${name} - status:`}
              </Text>
            ) : null
          })}
        </Layout.Vertical>
      }
    >
      {children}
    </Popover>
  )
}
