import { IPopoverProps, PopoverInteractionKind } from '@blueprintjs/core'
import { Text, Popover, Icon, Container } from '@wings-software/uicore'
import type { IconProps } from '@wings-software/uicore/dist/icons/Icon'
import React from 'react'
import { useStrings } from 'framework/strings'
import css from './DescriptionPopover.module.scss'

interface DescriptionPopoverProps {
  text: string
  className?: string
  popoverProps?: IPopoverProps
  iconProps?: Omit<IconProps, 'name'>
  target?: React.ReactElement
}

const DescriptionPopover: React.FC<DescriptionPopoverProps> = props => {
  const { text, popoverProps, iconProps, target } = props

  const { getString } = useStrings()
  return (
    <Popover interactionKind={PopoverInteractionKind.HOVER} {...popoverProps}>
      {target || <Icon name="description" {...iconProps} size={iconProps?.size || 18} />}
      <Container padding="medium">
        <Text font={{ size: 'normal', weight: 'bold' }}>{getString('description')}</Text>
        <Container className={css.descriptionPopover}>{text}</Container>
      </Container>
    </Popover>
  )
}

export default DescriptionPopover
