import { Container } from '@wings-software/uikit'
import React from 'react'
import { Nav } from '../../nav/Nav'
import css from './DefaultLayout.module.scss'
import cx from 'classnames'

const Layout: React.FC<{ withoutMenu?: boolean }> = ({ children, withoutMenu = false } = {}) => {
  return (
    <Container className={cx(css.main, withoutMenu && css.withoutMenu)}>
      <Container className={css.nav}>
        <Nav withoutMenu={withoutMenu} />
      </Container>
      <Container className={css.content}>{children}</Container>
    </Container>
  )
}

export const DefaultLayout: React.FC = ({ children }) => <Layout>{children}</Layout>

export const NoMenuLayout: React.FC = ({ children }) => <Layout withoutMenu>{children}</Layout>
