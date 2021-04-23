import { Container, Layout } from '@wings-software/uicore'
import React from 'react'
import { NavLink, useParams } from 'react-router-dom'
import routes from '@common/RouteDefinitions'
import { Page } from '@common/exports'
import type { ProjectPathProps } from '@common/interfaces/RouteInterfaces'
import { useStrings } from 'framework/strings'
import css from './CIResourcesPage.module.scss'

const CIResourcesPage: React.FC = ({ children }) => {
  const { orgIdentifier, projectIdentifier, accountId } = useParams<ProjectPathProps>()
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
                to={routes.toCIAdminResourcesConnectors({ orgIdentifier, projectIdentifier, accountId })}
              >
                {getString('ci.connectors')}
              </NavLink>

              <NavLink
                className={css.tags}
                activeClassName={css.activeTag}
                to={routes.toCIAdminResourcesSecretsListing({ orgIdentifier, projectIdentifier, accountId })}
              >
                {getString('ci.secrets')}
              </NavLink>

              <NavLink className={css.tags} to="#TBD">
                {getString('ci.delegates')}
              </NavLink>

              <NavLink className={css.tags} to="#TBD">
                {getString('ci.templates')}
              </NavLink>

              <NavLink className={css.tags} to="#TBD">
                {getString('ci.fileStore')}
              </NavLink>
            </Layout.Horizontal>
          </Container>
        }
      />
      <Page.Body>{children}</Page.Body>
    </>
  )
}

export default CIResourcesPage
