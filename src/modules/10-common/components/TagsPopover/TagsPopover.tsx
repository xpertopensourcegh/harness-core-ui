import React from 'react'
import { Text, Popover, Layout, Icon, Container, Tag } from '@wings-software/uikit'
import { PopoverInteractionKind } from '@blueprintjs/core'

import i18n from './TagsPopover.i18n'
import css from './TagsPopover.module.scss'

interface ListTagsProps {
  tags: string[]
}
const TagsPopover: React.FC<ListTagsProps> = props => {
  const { tags } = props
  return (
    <Popover interactionKind={PopoverInteractionKind.HOVER}>
      <Layout.Horizontal flex={{ align: 'center-center' }} spacing="xsmall">
        <Icon name="main-tags" size={15} />
        <Text>{tags.length}</Text>
      </Layout.Horizontal>
      <Container padding="small">
        <Text font={{ size: 'small', weight: 'bold' }}>{i18n.tags}</Text>
        <Container className={css.tagsPopover}>
          {tags?.map(tag => (
            <Tag key={tag} className={css.tag}>
              {tag}
            </Tag>
          ))}
        </Container>
      </Container>
    </Popover>
  )
}

export default TagsPopover
