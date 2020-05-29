import { Color, Container, Layout, Text } from '@wings-software/uikit'
import React from 'react'

interface SidebarTitleProps {
  upperText: string
  lowerText: string
}

/*
 * Lots of aspects in NextGen Design are subjected to change (i.e color, font-size).
 * As they are not compatible with UIKit, it's better to leave the styles (font-size
 * 9px, color grey-425, etc...) inline in the components and move to UIKit later.
 */
export const SidebarTitle: React.FC<SidebarTitleProps> = ({ upperText, lowerText }) => {
  return (
    <Layout.Vertical spacing="medium">
      <Container style={{ padding: 'var(--spacing-medium) var(--spacing-xxlarge)' }}>
        <Text font={{ weight: 'semi-bold' }} style={{ fontSize: '9px', color: 'var(--grey-425)' }}>
          {upperText}
        </Text>
        <Text font={{ weight: 'bold' }} color={Color.WHITE} style={{ fontSize: '16px' }}>
          {lowerText}
        </Text>
      </Container>
    </Layout.Vertical>
  )
}
