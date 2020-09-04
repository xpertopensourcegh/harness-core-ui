import React from 'react'
import { Container, Icon, Text, Color } from '@wings-software/uikit'
import type { FontProps } from '@wings-software/uikit/dist/styled-props/font/FontProps'
import type { IconProps } from '@wings-software/uikit/dist/icons/Icon'

const MAIN_CONTAINER_STYLE: React.CSSProperties = {
  display: 'flex',
  width: '200px'
}

const BUILD_CONTENT_TEXT_STYLES: React.CSSProperties = {
  alignSelf: 'center'
}

const SMALL_FONT_SIZE: FontProps = {
  size: 'small'
}

interface ActivityChangesProps {
  serviceName: string
  buildName: string
  iconProps: IconProps
}

export default function ActivityType(props: ActivityChangesProps): JSX.Element {
  const { buildName, serviceName, iconProps } = props
  return (
    <Container style={MAIN_CONTAINER_STYLE}>
      <Icon size={30} style={{ ...BUILD_CONTENT_TEXT_STYLES, marginRight: 'var(--spacing-small)' }} {...iconProps} />
      <Container style={BUILD_CONTENT_TEXT_STYLES}>
        <Text font={SMALL_FONT_SIZE} width={120} lineClamp={1}>
          {buildName}
        </Text>
        <Text font={SMALL_FONT_SIZE} width={120} lineClamp={1} color={Color.GREY_350}>
          {serviceName}
        </Text>
      </Container>
    </Container>
  )
}
