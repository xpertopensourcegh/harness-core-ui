import React from 'react'
import { Layout, Container } from '@wings-software/uikit'
import { NavLink, useParams } from 'react-router-dom'
import { Page } from 'modules/common/exports'
import {
  routeGitSyncRepos,
  routeGitSyncActivities,
  routeGitSyncEntities,
  routeGitSyncErrors,
  routeOrgGitSyncRepos,
  routeOrgGitSyncActivities,
  routeOrgGitSyncEntities,
  routeOrgGitSyncErrors
} from '../../../common/routes'
import i18n from './GitSyncPage.i18n'
import css from './GitSyncPage.module.scss'

const GitSyncPage: React.FC = ({ children }) => {
  const { orgIdentifier } = useParams()
  return (
    <>
      <Page.Header
        title={i18n.title}
        toolbar={
          <Container>
            <Layout.Horizontal spacing="medium">
              <NavLink
                className={css.tags}
                activeClassName={css.activeTag}
                to={orgIdentifier ? routeOrgGitSyncRepos.url({ orgIdentifier }) : routeGitSyncRepos.url()}
              >
                {i18n.repos}
              </NavLink>

              <NavLink
                className={css.tags}
                activeClassName={css.activeTag}
                to={orgIdentifier ? routeOrgGitSyncActivities.url({ orgIdentifier }) : routeGitSyncActivities.url()}
              >
                {i18n.activities}
              </NavLink>

              <NavLink
                className={css.tags}
                activeClassName={css.activeTag}
                to={orgIdentifier ? routeOrgGitSyncEntities.url({ orgIdentifier }) : routeGitSyncEntities.url()}
              >
                {i18n.entities}
              </NavLink>

              <NavLink
                className={css.tags}
                activeClassName={css.activeTag}
                to={orgIdentifier ? routeOrgGitSyncErrors.url({ orgIdentifier }) : routeGitSyncErrors.url()}
              >
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
