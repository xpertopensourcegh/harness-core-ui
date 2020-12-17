import React from 'react'
import { NavLink, useParams } from 'react-router-dom'
import { Container, Layout } from '@wings-software/uikit'
import { Page } from '@common/exports'
import routes from '@common/RouteDefinitions'

import i18n from './ResourcesPage.i18n'
import css from './ResourcesPage.module.scss'

const ResourcesPage: React.FC = ({ children }) => {
  const { accountId, orgIdentifier } = useParams()
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
                    ? routes.toOrgResourcesConnectors({ accountId, orgIdentifier })
                    : routes.toResourcesConnectors({ accountId })
                }
              >
                {i18n.connectors}
              </NavLink>

              <NavLink
                className={css.tags}
                activeClassName={css.activeTag}
                to={
                  orgIdentifier
                    ? routes.toOrgResourcesSecretsListing({ accountId, orgIdentifier })
                    : routes.toResourcesSecretsListing({ accountId })
                }
              >
                {i18n.secrets}
              </NavLink>

              <NavLink
                className={css.tags}
                activeClassName={css.activeTag}
                to={
                  orgIdentifier
                    ? routes.toOrgResourcesDelegates({ accountId, orgIdentifier })
                    : routes.toResourcesDelegates({ accountId })
                }
              >
                {i18n.delegates}
              </NavLink>

              <NavLink className={css.tags} to="#TBD">
                {i18n.templates}
              </NavLink>

              <NavLink className={css.tags} to="#TBD">
                {i18n.fileStore}
              </NavLink>
            </Layout.Horizontal>
          </Container>
        }
      />
      <Page.Body>{children}</Page.Body>
    </>
  )
}

export default ResourcesPage
