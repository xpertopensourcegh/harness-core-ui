import { Container } from '@wings-software/uikit'
import React from 'react'
import css from './PageBody.module.scss'
import cx from 'classnames'

export interface PageBodyProps {
  /** Make children center aligned horizontally and vertically */
  center?: boolean
}

/**
 * PageBody implements page body container with some decorations like background image,
 * center alignments, etc...
 */
export const PageBody: React.FC<PageBodyProps> = ({ children, center }) => {
  return (
    <Container className={cx(css.pageBody, center && css.center)} padding="large">
      {children}
    </Container>
  )
}
