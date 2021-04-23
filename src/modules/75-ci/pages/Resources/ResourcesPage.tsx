import React from 'react'
import { NavLink, useParams } from 'react-router-dom'
import { Container, Layout } from '@wings-software/uicore'
import { Page } from '@common/exports'
import routes from '@common/RouteDefinitions'
import type { ProjectPathProps } from '@common/interfaces/RouteInterfaces'
import { useStrings } from 'framework/strings'
import css from './ResourcesPage.module.scss'

const ResourcesPage: React.FC = ({ children }) => {
  const { accountId, projectIdentifier, orgIdentifier } = useParams<ProjectPathProps>()
  const { getString } = useStrings()
  return (
    <>
      <Page.Header
        title={getString('ci.titleResources')}
        toolbar={
          <Container>
            <Layout.Horizontal spacing="medium">
              <NavLink
                className={css.tags}
                activeClassName={css.activeTag}
                to={routes.toCIAdminResourcesConnectors({ accountId, orgIdentifier, projectIdentifier })}
              >
                {getString('ci.connectors')}
              </NavLink>

              <NavLink
                className={css.tags}
                activeClassName={css.activeTag}
                to={routes.toCIAdminResourcesSecretsListing({ accountId, orgIdentifier, projectIdentifier })}
              >
                {getString('ci.secrets')}
              </NavLink>

              <NavLink className={css.tags} to="#TBD">
                {getString('ci.delegates')}
              </NavLink>

              {/* TODO: ENABLE IT WHEN IMPLEMENTED */}
              {/* <NavLink className={css.tags} to="#TBD">
                {getString('ci.templates')}
              </NavLink>

              <NavLink className={css.tags} to="#TBD">
                {getString('ci.fileStore')}
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
