import { Container } from '@wings-software/uikit'
import React from 'react'
import { SidebarMounter } from '../../sidebar/Sidebar'
import css from './DefaultLayout.module.scss'
import cx from 'classnames'

const Layout: React.FC<{ withoutMenu?: boolean }> = ({ children, withoutMenu = false } = {}) => {
  return (
    <Container className={cx(css.layout, withoutMenu && css.withoutMenu)}>
      <Container className={css.sidebarContainer}>
        <SidebarMounter withoutMenu={withoutMenu} />
      </Container>
      <Container className={css.pageContainer}>{children}</Container>
    </Container>
  )
}

export const DefaultLayout: React.FC = ({ children }) => <Layout>{children}</Layout>

export const NoMenuLayout: React.FC = ({ children }) => <Layout withoutMenu>{children}</Layout>
