import { Container, Layout } from '@wings-software/uikit'
import { linkTo, Sidebar, isRouteActive } from 'framework/exports'
import React from 'react'
import { routeCVDashboard, routeCVDataSources, routeCVServices } from '../routes'
import i18n from './MenuCVDashboard.i18n'

export const MenuCVDashboard: React.FC = () => {
  return (
    <Layout.Vertical spacing="medium">
      <Sidebar.Title upperText={i18n.continuous} lowerText={i18n.verification} />
      <Container style={{ marginTop: '25px' }}>
        <Layout.Vertical>
          <Sidebar.Link
            href={linkTo(routeCVDashboard)}
            label={i18n.home}
            icon="main-flag"
            selected={isRouteActive(routeCVDashboard)}
          />
          <Sidebar.Link
            href={linkTo(routeCVServices)}
            label={i18n.service}
            icon="main-depricate"
            selected={isRouteActive(routeCVServices)}
          />
          <Sidebar.Link
            href={linkTo(routeCVDataSources)}
            label={i18n.datasource}
            icon="main-help"
            selected={isRouteActive(routeCVDataSources)}
          />
        </Layout.Vertical>
      </Container>
    </Layout.Vertical>
  )
}
