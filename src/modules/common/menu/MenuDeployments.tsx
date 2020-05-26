import React from 'react'
import { Text, Layout, Link } from '@wings-software/uikit'
import { linkTo, isRouteActive } from 'framework'
import { routeProject, routeOrg } from '../routes'

export const MenuDeployments: React.FC = () => {
  return (
    <Layout.Vertical spacing="medium">
      <Text>Manage Projects</Text>
      <Link href={linkTo(routeProject)} disabled={isRouteActive(routeProject)}>
        Projects
      </Link>
      <Link href={linkTo(routeOrg)} disabled={isRouteActive(routeOrg)}>
        Org
      </Link>
    </Layout.Vertical>
  )
}
