import React from 'react'
import TagsRenderer, { ListTagsProps } from '@common/components/TagsRenderer/TagsRenderer'
import css from './TemplateTags.module.scss'

export const TemplateTags: React.FC<ListTagsProps> = (props): JSX.Element => {
  return <TagsRenderer className={css.tagsContainer} tagClassName={css.tag} targetClassName={css.count} {...props} />
}
