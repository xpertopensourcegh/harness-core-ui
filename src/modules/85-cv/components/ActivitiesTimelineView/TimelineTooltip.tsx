import React from 'react'
import moment from 'moment'
import { Container, Text } from '@wings-software/uikit'
import { PopoverInteractionKind, Position, Tooltip } from '@blueprintjs/core'
import type { EventData } from './ActivitiesTimelineView'

export default function TimelineTooltip({ items, children }: { items: Array<EventData>; children: JSX.Element }) {
  let dateLabel = moment(items[0].startTime).format('MMM D, h:mm:ss a')
  if (items.length > 1) {
    dateLabel = `${dateLabel} - ${moment(items[items.length - 1].startTime).format('MMM D, h:mm:ss a')}`
  }
  return (
    <Tooltip
      lazy={true}
      position={Position.TOP}
      interactionKind={PopoverInteractionKind.HOVER}
      content={
        <Container>
          <Text font={{ size: 'small' }}>{dateLabel}</Text>
          {items.map((item, i) => (
            <Text font={{ size: 'xsmall' }} key={i}>
              {`${item.name} - status: ${item.verificationResult}`}
            </Text>
          ))}
        </Container>
      }
    >
      {children}
    </Tooltip>
  )
}
