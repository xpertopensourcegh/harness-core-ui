import React from 'react'
import { NavLink, useParams } from 'react-router-dom'
import { Container, Layout } from '@wings-software/uicore'
import { useFeatureFlags } from '@common/hooks/useFeatureFlag'
import { Page } from '@common/exports'
import routes from '@common/RouteDefinitions'

import i18n from './ResourcesPage.i18n'
import css from './ResourcesPage.module.scss'

const ResourcesPage: React.FC = ({ children }) => {
  const { accountId, orgIdentifier } = useParams()
  const { CDNG_ENABLED } = useFeatureFlags()
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

              {CDNG_ENABLED && (
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
              )}
              {/* TODO: ENABLE IT WHEN IMPLEMENTED */}
              {/* <NavLink className={css.tags} to="#TBD">
                {i18n.templates}
              </NavLink>

              <NavLink className={css.tags} to="#TBD">
                {i18n.fileStore}
              </NavLink> */}
            </Layout.Horizontal>
          </Container>
        }
      />
      <Page.Body>{children}</Page.Body>
    </>
  )
}

export default ResourcesPage
