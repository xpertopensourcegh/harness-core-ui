import { Color, Heading, Layout } from '@wings-software/uikit'
import React from 'react'
import css from './PageHeader.module.scss'

export interface PageHeaderProps {
  title: React.ReactNode
  toolbar?: React.ReactNode
}

/**
 * PageHeader implements a consistent header for a page header in which title is rendered on
 *  the left and a toolbar is rendered on the right. It also has a consistent box-shadow styling.
 */
export const PageHeader: React.FC<PageHeaderProps> = ({ title, toolbar }) => {
  return (
    <Layout.Horizontal flex height={64} className={css.container} padding={{ left: 'large', right: 'large' }}>
      {typeof title === 'string' ? (
        <Heading level={2} color={Color.GREY_800}>
          {title}
        </Heading>
      ) : (
        title
      )}
      {toolbar}
    </Layout.Horizontal>
  )
}
