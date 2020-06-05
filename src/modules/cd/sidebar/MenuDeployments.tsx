import { Container, Layout } from '@wings-software/uikit'
import { linkTo, Sidebar, isRouteActive } from 'framework/exports'
import React from 'react'
import i18n from './MenuDeployments.i18n'
import { routeResources } from '../routes'

export const MenuDeployments: React.FC = () => {
  return (
    <Layout.Vertical spacing="medium">
      <Sidebar.Title upperText={i18n.deployments} lowerText={i18n.deployments} />
      <Container style={{ marginTop: '25px' }}>
        <Layout.Vertical>
          <Sidebar.Link
            href={linkTo(routeResources)}
            label={i18n.resources}
            icon="shield"
            selected={isRouteActive(routeResources)}
          />
        </Layout.Vertical>
      </Container>
    </Layout.Vertical>
  )
}
