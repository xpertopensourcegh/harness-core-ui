import React from 'react'
import cx from 'classnames'
import { Text, Popover, Layout, Icon, Container, Tag } from '@wings-software/uicore'
import { IPopoverProps, PopoverInteractionKind } from '@blueprintjs/core'
import type { IconProps } from '@wings-software/uicore/dist/icons/Icon'

import type { tagsType } from '@common/utils/types'
import { useStrings } from 'framework/strings'
import css from './TagsPopover.module.scss'

export interface ListTagsProps {
  className?: string
  tags: tagsType
  tagClassName?: string
  target?: React.ReactElement
  popoverProps?: IPopoverProps
  iconProps?: Omit<IconProps, 'name'>
}
const TagsPopover: React.FC<ListTagsProps> = props => {
  const { tags, target, tagClassName, popoverProps, iconProps, className } = props
  const { getString } = useStrings()
  return (
    <Popover interactionKind={PopoverInteractionKind.HOVER} {...popoverProps}>
      {target || (
        <Layout.Horizontal className={className} flex={{ align: 'center-center' }} spacing="xsmall">
          <Icon name="main-tags" {...iconProps} size={iconProps?.size || 15} />
          <Text>{Object.keys(tags).length}</Text>
        </Layout.Horizontal>
      )}
      <Container padding="small">
        <Text font={{ size: 'small', weight: 'bold' }}>{getString('tagsLabel')}</Text>
        <Container className={css.tagsPopover}>
          {Object.keys(tags).map(key => {
            const value = tags[key]
            return (
              <Tag className={cx(css.tag, tagClassName)} key={key}>
                {value ? `${key}:${value}` : key}
              </Tag>
            )
          })}
        </Container>
      </Container>
    </Popover>
  )
}

export default TagsPopover
