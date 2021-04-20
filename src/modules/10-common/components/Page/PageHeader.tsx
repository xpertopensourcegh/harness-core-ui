import { Color, Heading, Layout } from '@wings-software/uicore'
import React from 'react'
import cx from 'classnames'
import css from './PageHeader.module.scss'

export interface PageHeaderProps {
  title: React.ReactNode
  toolbar?: React.ReactNode
  content?: React.ReactNode
  size?: 'standard' | 'medium' | 'large' | 'xlarge'
  className?: string
}

/**
 * PageHeader implements a consistent header for a page header in which title is rendered on
 *  the left and a toolbar is rendered on the right. It also has a consistent box-shadow styling.
 */
export const PageHeader: React.FC<PageHeaderProps> = ({ title, content, toolbar, size = 'standard', className }) => {
  return (
    <Layout.Horizontal
      flex
      className={cx(css.container, css[size], className)}
      padding={{ left: 'large', right: 'large' }}
    >
      {typeof title === 'string' ? (
        <Heading level={2} color={Color.GREY_800} font={{ weight: 'bold' }}>
          {title}
        </Heading>
      ) : (
        <>{title}</>
      )}
      {content}
      {toolbar}
    </Layout.Horizontal>
  )
}
