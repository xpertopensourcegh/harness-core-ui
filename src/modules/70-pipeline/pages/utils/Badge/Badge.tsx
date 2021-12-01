import React from 'react'
import { Classes, PopoverInteractionKind, Position } from '@blueprintjs/core'
import { Color, Container, Icon, Text, IconName, Popover, Layout } from '@wings-software/uicore'
import { useStrings } from 'framework/strings'
import type { StringsMap } from 'stringTypes'

import css from './Badge.module.scss'

export interface BadgeProps {
  text: keyof StringsMap
  iconName: IconName
  showTooltip?: boolean
  entityName?: string
}

interface BadgeTooltipContentInterface {
  iconName: IconName
  entityName?: string
}

const TooltipContent: React.FC<BadgeTooltipContentInterface> = (props: BadgeTooltipContentInterface): JSX.Element => {
  const { iconName, entityName = '' } = props
  const { getString } = useStrings()

  return (
    <Container width={292} padding="medium">
      <Layout.Horizontal>
        <div className={css.tooltipIcon}>
          <Icon name={iconName} size={14} color={Color.RED_600} />
        </div>
        <Layout.Vertical padding={{ left: 'small' }}>
          <Text width={244} color={Color.GREY_0} margin={{ bottom: 'small' }} className={css.tooltipContentText}>
            {getString('common.gitSync.outOfSync', { entityType: 'Pipeline', name: entityName })}
          </Text>
          <Text width={244} color={Color.GREY_0} className={css.tooltipContentText}>
            {getString('common.gitSync.fixAllErrors')}
          </Text>
        </Layout.Vertical>
      </Layout.Horizontal>
    </Container>
  )
}

export const Badge: React.FC<BadgeProps> = (props: BadgeProps): JSX.Element => {
  const { text, iconName, showTooltip, entityName = '' } = props
  const { getString } = useStrings()

  const badgeUI = (
    <Container className={css.badge}>
      <Icon name={iconName} size={10} color={Color.RED_600} className={css.badgeIcon} />
      <Text color={Color.RED_900} font={{ weight: 'bold' }} className={css.badgeText}>
        {getString(text)}
      </Text>
    </Container>
  )
  return showTooltip ? (
    <Popover interactionKind={PopoverInteractionKind.HOVER} position={Position.BOTTOM} className={Classes.DARK}>
      {badgeUI}
      <TooltipContent iconName={iconName} entityName={entityName} />
    </Popover>
  ) : (
    badgeUI
  )
}
