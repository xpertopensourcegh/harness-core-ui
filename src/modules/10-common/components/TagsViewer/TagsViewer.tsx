import React from 'react'
import { Container, Text } from '@wings-software/uicore'

interface TagViewerProps {
  style?: React.CSSProperties
  tag: string
}

const TagViewer: React.FC<TagViewerProps> = ({ tag, style }) => (
  <Text
    style={{
      padding: '3px var(--spacing-small)',
      display: 'inline-block',
      color: 'var(--black)',
      background: 'rgba(147, 210, 249, 0.43)',
      borderRadius: '4px',
      fontSize: '10px',
      ...style
    }}
  >
    {tag}
  </Text>
)

export interface TagsViewerProps {
  tags: string[] | null | undefined
  style?: React.CSSProperties
}

export const TagsViewer: React.FC<TagsViewerProps> = ({ tags, style }) => (
  <Container
    style={{
      display: 'inline-flex',
      flexWrap: 'wrap' /*, gap: 'var(--spacing-xsmall)' -> Safari does not support it yet (Feb 2021) :( */,
      margin: 'calc(-1 * var(--spacing-xsmall)) 0 0 calc(-1 * var(--spacing-xsmall))',
      width: 'calc(100% + var(--spacing-xsmall))'
    }}
  >
    {tags?.map(tag => (
      <TagViewer key={tag} tag={tag} style={{ margin: 'var(--spacing-xsmall) 0 0 var(--spacing-xsmall)', ...style }} />
    ))}
  </Container>
)
