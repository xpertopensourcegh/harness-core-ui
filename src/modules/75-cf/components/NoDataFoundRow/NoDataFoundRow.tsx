import React from 'react'
import { Text, Color } from '@wings-software/uicore'
import { ItemContainer, ItemContainerProps } from '../ItemContainer/ItemContainer'

export const NoDataFoundRow: React.FC<ItemContainerProps & { message: string }> = ({ message, ...props }) => (
  <ItemContainer {...props}>
    <Text background={Color.WHITE} padding="xsmall" style={{ textAlign: 'center' }} color={Color.GREY_400}>
      {message}
    </Text>
  </ItemContainer>
)
