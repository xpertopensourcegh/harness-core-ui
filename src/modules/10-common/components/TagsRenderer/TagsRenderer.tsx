import React from 'react'
import { Text, Layout, Tag } from '@wings-software/uicore'
import TagsPopover from '@common/components/TagsPopover/TagsPopover'

import type { tagsType } from '@common/utils/types'
import { useStrings } from 'framework/exports'
import css from './TagsRenderer.module.scss'

export interface ListTagsProps {
  tags: tagsType
  length?: number
  className?: string
}
const TagsRenderer: React.FC<ListTagsProps> = props => {
  const { tags, length = 4, className } = props
  const baseTags = Object.keys(tags).slice(0, length)
  const remainingTags = Object.keys(tags)
    .slice(length)
    .reduce((result: tagsType, key) => {
      result[key] = tags[key]
      return result
    }, {})
  const { getString } = useStrings()
  return (
    <>
      <Layout.Horizontal spacing="xsmall" className={className}>
        {baseTags.map(key => {
          const value = tags[key]
          return (
            <Tag className={css.tag} key={key}>
              {value ? `${key}:${value}` : key}
            </Tag>
          )
        })}
        {Object.keys(tags).length - length > 0 && (
          <TagsPopover
            tags={remainingTags}
            target={<Text>{getString('plus') + (Object.keys(tags).length - length)}</Text>}
          />
        )}
      </Layout.Horizontal>
    </>
  )
}

export default TagsRenderer
