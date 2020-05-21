import { Container, Text } from '@wings-software/uikit'
import React from 'react'
import css from './DefaultLayout.module.scss'
import { Nav } from '../../nav/Nav'

export const DefaultLayout: React.FC = ({ children }) => {
  const loading = true
  const PageSpinner: React.FC = () => <Text>Loading...</Text>

  return (
    <Container className={css.main}>
      <Container className={css.nav}>
        <Nav />
      </Container>
      <Container className={css.content}>
        {loading && <PageSpinner />}
        {children}
      </Container>
    </Container>
  )
}
