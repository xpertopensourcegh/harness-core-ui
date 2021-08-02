import React from 'react'
import { Text, Popover, Container, TextProps, Layout, Color } from '@wings-software/uicore'
import { Classes, IPopoverProps, PopoverInteractionKind, Position } from '@blueprintjs/core'

import ReactTimeago from 'react-timeago'

export interface TimeAgoPopoverProps extends TextProps, React.ComponentProps<typeof ReactTimeago> {
  className?: string
  time: number
  popoverProps?: IPopoverProps
}
const TimeAgoPopover: React.FC<TimeAgoPopoverProps> = props => {
  const { time, popoverProps, iconProps, className, ...textProps } = props
  return (
    <Popover
      interactionKind={PopoverInteractionKind.HOVER}
      position={Position.TOP}
      className={Classes.DARK}
      {...popoverProps}
    >
      <Text inline {...textProps}>
        <ReactTimeago date={time} live />
      </Text>
      <Container padding="medium">
        <Layout.Horizontal flex={{ justifyContent: 'flex-start' }} spacing={'small'}>
          <Text font={{ size: 'xsmall', weight: 'semi-bold' }} color={Color.GREY_200}>
            DATE
          </Text>
          <Text font={{ size: 'small', weight: 'bold' }} color={Color.WHITE}>
            {new Date(time).toLocaleDateString()}
          </Text>
        </Layout.Horizontal>
        <Layout.Horizontal margin={{ top: 'small' }} flex={{ justifyContent: 'flex-start' }} spacing={'small'}>
          <Text font={{ size: 'xsmall', weight: 'semi-bold' }} color={Color.GREY_200}>
            TIME
          </Text>
          <Text font={{ size: 'small', weight: 'bold' }} color={Color.WHITE}>
            {new Date(time).toLocaleTimeString()}
          </Text>
        </Layout.Horizontal>
      </Container>
    </Popover>
  )
}

export default TimeAgoPopover
