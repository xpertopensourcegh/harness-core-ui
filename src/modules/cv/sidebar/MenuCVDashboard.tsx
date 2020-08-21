import { Container, Layout } from '@wings-software/uikit'
import React from 'react'
import { Sidebar, isRouteActive, routeParams } from 'framework/exports'
import { routeCVDashboard, routeCVDataSources, routeCVActivities, routeCVActivityDetails } from '../routes'
import i18n from './MenuCVDashboard.i18n'

export const MenuCVDashboard: React.FC = () => {
  const {
    params: { projectIdentifier: routeProjectId, orgId: routeOrgId }
  } = routeParams()
  const projectId: string = (routeProjectId as string) || ''
  const orgId: string = (routeOrgId as string) || ''
  return (
    <Layout.Vertical spacing="medium">
      <Sidebar.Title upperText={i18n.continuous} lowerText={i18n.verification} />
      <Container style={{ marginTop: '25px' }}>
        <Layout.Vertical>
          <Sidebar.Link
            href={routeCVDashboard.url()}
            label={i18n.home}
            icon="main-flag"
            selected={isRouteActive(routeCVDashboard)}
          />
          {projectId && orgId && (
            <Sidebar.Link
              href={routeCVDataSources.url({ projectIdentifier: projectId, orgId })}
              label={i18n.datasource}
              icon="main-help"
              selected={isRouteActive(routeCVDataSources)}
            />
          )}
          <Sidebar.Link
            href={routeCVActivities.url()}
            label={i18n.activites}
            icon="main-depricate"
            selected={isRouteActive(routeCVActivities) || isRouteActive(routeCVActivityDetails)}
          />
        </Layout.Vertical>
      </Container>
    </Layout.Vertical>
  )
}
