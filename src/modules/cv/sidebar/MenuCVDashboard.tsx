import { Container, Layout } from '@wings-software/uikit'
import React from 'react'
import { Sidebar, isRouteActive } from 'framework/exports'
import {
  routeCVDashboard,
  routeCVDataSources,
  routeCVServices,
  routeCVActivities,
  routeCVActivityDetails
} from '../routes'
import i18n from './MenuCVDashboard.i18n'

export const MenuCVDashboard: React.FC = () => {
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
          <Sidebar.Link
            href={routeCVServices.url()}
            label={i18n.service}
            icon="main-depricate"
            selected={isRouteActive(routeCVServices)}
          />
          <Sidebar.Link
            href={routeCVDataSources.url()}
            label={i18n.datasource}
            icon="main-help"
            selected={isRouteActive(routeCVDataSources)}
          />
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
