import React from 'react'
import { Layout, Container } from '@wings-software/uikit'
import { NavLink } from 'react-router-dom'
import { Page } from 'modules/common/exports'
import {
  routeGitSyncRepos,
  routeGitSyncActivities,
  routeGitSyncEntities,
  routeGitSyncErrors
} from '../../../common/routes'
import i18n from './GitSyncPage.i18n'
import css from './GitSyncPage.module.scss'

const GitSyncPage: React.FC = ({ children }) => {
  return (
    <>
      <Page.Header
        title={i18n.title}
        toolbar={
          <Container>
            <Layout.Horizontal spacing="medium">
              <NavLink className={css.tags} activeClassName={css.activeTag} to={routeGitSyncRepos.url()}>
                {i18n.repos}
              </NavLink>

              <NavLink className={css.tags} activeClassName={css.activeTag} to={routeGitSyncActivities.url()}>
                {i18n.activities}
              </NavLink>

              <NavLink className={css.tags} activeClassName={css.activeTag} to={routeGitSyncEntities.url()}>
                {i18n.entities}
              </NavLink>

              <NavLink className={css.tags} activeClassName={css.activeTag} to={routeGitSyncErrors.url()}>
                {i18n.errors}
              </NavLink>
            </Layout.Horizontal>
          </Container>
        }
      />
      <Page.Body>{children}</Page.Body>
    </>
  )
}

export default GitSyncPage
