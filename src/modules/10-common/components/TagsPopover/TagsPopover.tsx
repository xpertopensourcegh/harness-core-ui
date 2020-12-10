import React from 'react'
import { Text, Popover, Layout, Icon, Container, Tag } from '@wings-software/uikit'
import { PopoverInteractionKind } from '@blueprintjs/core'

import type { tagsType } from '@common/utils/types'
import i18n from './TagsPopover.i18n'
import css from './TagsPopover.module.scss'

export interface ListTagsProps {
  tags: tagsType
  target?: React.ReactElement
}
const TagsPopover: React.FC<ListTagsProps> = props => {
  const { tags, target } = props
  return (
    <Popover interactionKind={PopoverInteractionKind.HOVER}>
      {target || (
        <Layout.Horizontal flex={{ align: 'center-center' }} spacing="xsmall">
          <Icon name="main-tags" size={15} />
          <Text>{tags.length}</Text>
        </Layout.Horizontal>
      )}
      <Container padding="small">
        <Text font={{ size: 'small', weight: 'bold' }}>{i18n.tags}</Text>
        <Container className={css.tagsPopover}>
          {Object.keys(tags).map(key => {
            const value = tags[key]
            return (
              <Tag className={css.tag} key={key}>
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
