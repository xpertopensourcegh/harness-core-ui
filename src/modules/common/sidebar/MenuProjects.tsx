import { Layout, Link } from '@wings-software/uikit'
import { isRouteActive, linkTo, Sidebar } from 'framework/exports'
import React from 'react'
import { routeOrg, routeProject } from '../routes'
import i18n from './MenuProjects.i18n'

export const MenuProjects: React.FC = () => {
  return (
    <Layout.Vertical spacing="medium">
      <Sidebar.Title upperText={i18n.manage} lowerText={i18n.projects} />

      <Link href={linkTo(routeProject)} disabled={isRouteActive(routeProject)}>
        Projects
      </Link>
      <Link href={linkTo(routeOrg)} disabled={isRouteActive(routeOrg)}>
        Org
      </Link>
    </Layout.Vertical>
  )
}
