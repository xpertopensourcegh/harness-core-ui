import { Container } from '@wings-software/uikit'
import React from 'react'
import css from './EmptyLayout.module.scss'

export const BlankLayout: React.FC = ({ children } = {}) => {
  return <Container className={css.layout}>{children}</Container>
}
