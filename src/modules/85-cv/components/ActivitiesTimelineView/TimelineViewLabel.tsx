import { Container, Icon, Text, Color } from '@wings-software/uikit'
import React from 'react'
import type { IconProps } from '@wings-software/uikit/dist/icons/Icon'
import css from './ActivitiesTimelineView.module.scss'

export interface TimelineViewLabelProps {
  labelName: string
  iconProps: IconProps
}

export default function TimelineViewLabel({ labelName, iconProps }: TimelineViewLabelProps): JSX.Element {
  return (
    <Container className={css.timelineViewLabel} width={185} padding="medium" background={Color.GREY_200}>
      <Icon {...iconProps} />
      <Text color={Color.BLACK} font={{ size: 'small' }}>
        {labelName}
      </Text>
    </Container>
  )
}

export const PredefinedLabels = {
  deployments: (
    <TimelineViewLabel
      labelName="Deployments"
      iconProps={{
        name: 'cd-main',
        size: 20
      }}
    />
  ),
  configChanges: (
    <TimelineViewLabel
      labelName="Config Changes"
      iconProps={{
        name: 'wrench',
        size: 13,
        intent: 'success'
      }}
    />
  ),
  infrastructureChanges: (
    <TimelineViewLabel
      labelName="Infrastructure Changes"
      iconProps={{
        name: 'service-kubernetes',
        size: 17
      }}
    />
  ),
  otherChanges: (
    <TimelineViewLabel
      labelName="Other Changes"
      iconProps={{
        name: 'wrench',
        size: 13,
        intent: 'success'
      }}
    />
  )
}
