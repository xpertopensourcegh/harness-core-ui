import { Container, Layout } from '@wings-software/uikit'
import React from 'react'
import { Sidebar, isRouteActive } from 'framework/exports'
import {
  routeAdmin,
  routeOrganizations,
  routeOrgProjects,
  routeGovernance,
  routeResources,
  routeGitSync
} from '../routes'
import i18n from './MenuAccount.i18n'

export const MenuAccount: React.FC = () => {
  return (
    <Layout.Vertical spacing="medium">
      <Sidebar.Title upperText={i18n.account} lowerText={i18n.settings} />
      <Container style={{ marginTop: '25px' }}>
        <Layout.Vertical>
          <Sidebar.Link
            href={routeAdmin.url()}
            label={i18n.admin}
            icon="nav-account-admin"
            selected={isRouteActive(routeAdmin)}
          />
          <Sidebar.Link
            href={routeOrganizations.url()}
            label={i18n.organizations}
            icon="nav-organization-hover"
            selected={isRouteActive(routeOrganizations)}
          />
          <Layout.Vertical style={{ marginLeft: 'var(--spacing-xlarge)' }}>
            <Sidebar.Link
              href={routeOrgProjects.url({ orgId: 'TOBEDEFINED' })} // TODO: Fill in orgId
              label={i18n.projects}
              icon="nav-project"
              selected={isRouteActive(routeOrgProjects)}
            />
            <Sidebar.Link
              href={routeGovernance.url()}
              label={i18n.governance}
              icon="nav-governance"
              selected={isRouteActive(routeGovernance)}
            />
            <Sidebar.Link
              href={routeResources.url()}
              label={i18n.resources}
              icon="nav-resources"
              selected={isRouteActive(routeResources, false)}
            />
            <Sidebar.Link
              href={routeGitSync.url()}
              label={i18n.gitSync}
              icon="nav-git-sync"
              selected={isRouteActive(routeGitSync)}
            />
          </Layout.Vertical>
        </Layout.Vertical>
      </Container>
    </Layout.Vertical>
  )
}
