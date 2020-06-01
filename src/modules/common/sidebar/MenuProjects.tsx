import { Container, Layout } from '@wings-software/uikit'
import { linkTo, Sidebar, isRouteActive } from 'framework/exports'
import React from 'react'
import { routeProject } from '../routes'
import i18n from './MenuProjects.i18n'

export const MenuProjects: React.FC = () => {
  return (
    <Layout.Vertical spacing="medium">
      <Sidebar.Title upperText={i18n.manage} lowerText={i18n.projects} />
      <Container style={{ marginTop: '25px' }}>
        <Layout.Vertical>
          <Sidebar.Link
            href={linkTo(routeProject)}
            label={i18n.projectsMenu}
            icon="main-flag"
            selected={isRouteActive(routeProject)}
          />
        </Layout.Vertical>
      </Container>
    </Layout.Vertical>
  )
}
