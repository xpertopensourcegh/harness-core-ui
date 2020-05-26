import React from 'react'
import { Text, Layout, Link } from '@wings-software/uikit'
import { linkTo } from 'framework'
import { routeProject, routeOrg } from '../routes'

export const MenuDeployments: React.FC = () => {
  console.log('Menu for Deployments NavEntry')

  return (
    <Layout.Vertical>
      <Text>Manage Projects</Text>
      <span></span>
      <Link href={linkTo(routeProject)}>Projects</Link>
      <Link href={linkTo(routeOrg)}>Org</Link>
    </Layout.Vertical>
  )
}
