import { Container } from '@wings-software/uikit'
import React from 'react'
import { Nav } from '../../nav/Nav'
import css from './DefaultLayout.module.scss'

export const DefaultLayout: React.FC = ({ children } = {}) => {
  return (
    <Container className={css.main}>
      <Container className={css.nav}>
        <Nav />
      </Container>
      <Container className={css.content}>{children}</Container>
    </Container>
  )
}
