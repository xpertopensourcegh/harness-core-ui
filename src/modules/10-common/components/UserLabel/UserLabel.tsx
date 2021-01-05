import React from 'react'
import { Text, TextProps } from '@wings-software/uicore'

export interface UserLabelProps {
  name: string
  profilePictureUrl?: string // for future use
  textProps?: TextProps // optional props to pass to the underlying Text component
}

export const UserLabel: React.FC<UserLabelProps> = ({ name, textProps }) => {
  return (
    <Text inline icon="user" {...textProps}>
      {name}
    </Text>
  )
}
