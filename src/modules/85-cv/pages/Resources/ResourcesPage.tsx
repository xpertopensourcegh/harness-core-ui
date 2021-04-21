import React from 'react'
import { NavLink, useParams } from 'react-router-dom'
import { Container, Layout } from '@wings-software/uicore'
import { Page } from '@common/exports'
import routes from '@common/RouteDefinitions'
import { useStrings } from 'framework/strings'
import type { ProjectPathProps } from '@common/interfaces/RouteInterfaces'
import css from './ResourcesPage.module.scss'

const ResourcesPage: React.FC = ({ children }) => {
  const { accountId, projectIdentifier, orgIdentifier } = useParams<ProjectPathProps>()
  const { getString } = useStrings()
  return (
    <>
      <Page.Header
        title={getString('resourcePage.title')}
        toolbar={
          <Container>
            <Layout.Horizontal spacing="medium">
              <NavLink
                className={css.tags}
                activeClassName={css.activeTag}
                to={routes.toCVAdminResourcesConnectors({ accountId, orgIdentifier, projectIdentifier })}
              >
                {getString('resourcePage.connectors')}
              </NavLink>

              <NavLink
                className={css.tags}
                activeClassName={css.activeTag}
                to={routes.toCVAdminResourcesSecretsListing({ accountId, orgIdentifier, projectIdentifier })}
              >
                {getString('resourcePage.secrets')}
              </NavLink>

              <NavLink className={css.tags} to="#TBD">
                {getString('resourcePage.delegates')}
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
