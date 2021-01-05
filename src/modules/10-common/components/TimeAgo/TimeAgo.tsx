import React from 'react'
import ReactTimeago from 'react-timeago'
import { Text, TextProps } from '@wings-software/uicore'

export interface TimeAgoProps extends TextProps, React.ComponentProps<typeof ReactTimeago> {
  time: number
}

export const TimeAgo: React.FC<TimeAgoProps> = ({ time, ...textProps }) => {
  return (
    <Text inline icon="time" {...textProps}>
      <ReactTimeago date={time} live />
    </Text>
  )
}
