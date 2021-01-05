import React from 'react'
import { Layout, Container } from '@wings-software/uicore'
import { NavLink, useParams } from 'react-router-dom'
import { Page } from '@common/exports'
import routes from '@common/RouteDefinitions'
import i18n from './GitSyncPage.i18n'
import css from './GitSyncPage.module.scss'

const GitSyncPage: React.FC = ({ children }) => {
  const { orgIdentifier, accountId } = useParams()
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
                to={
                  orgIdentifier
                    ? routes.toOrgGitSyncRepos({ orgIdentifier, accountId })
                    : routes.toGitSyncRepos({ accountId })
                }
              >
                {i18n.repos}
              </NavLink>

              <NavLink
                className={css.tags}
                activeClassName={css.activeTag}
                to={
                  orgIdentifier
                    ? routes.toOrgGitSyncActivities({ orgIdentifier, accountId })
                    : routes.toGitSyncActivities({ accountId })
                }
              >
                {i18n.activities}
              </NavLink>

              <NavLink
                className={css.tags}
                activeClassName={css.activeTag}
                to={
                  orgIdentifier
                    ? routes.toOrgGitSyncEntities({ orgIdentifier, accountId })
                    : routes.toGitSyncEntities({ accountId })
                }
              >
                {i18n.entities}
              </NavLink>

              <NavLink
                className={css.tags}
                activeClassName={css.activeTag}
                to={
                  orgIdentifier
                    ? routes.toOrgGitSyncErrors({ orgIdentifier, accountId })
                    : routes.toGitSyncErrors({ accountId })
                }
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
