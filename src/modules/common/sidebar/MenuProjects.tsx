import { Container, Layout } from '@wings-software/uikit'
import React from 'react'
import { linkTo, Sidebar, isRouteActive } from 'framework/exports'
import { routeProjects } from '../routes'
import i18n from './MenuProjects.i18n'

export const MenuProjects: React.FC = () => {
  return (
    <Layout.Vertical spacing="medium">
      <Sidebar.Title upperText={i18n.manage} lowerText={i18n.projects} />
      <Container style={{ marginTop: '25px' }}>
        <Layout.Vertical>
          <Sidebar.Link
            href={linkTo(routeProjects)}
            label={i18n.projectsMenu}
            icon="nav-project"
            selected={isRouteActive(routeProjects)}
          />
        </Layout.Vertical>
      </Container>
    </Layout.Vertical>
  )
}
