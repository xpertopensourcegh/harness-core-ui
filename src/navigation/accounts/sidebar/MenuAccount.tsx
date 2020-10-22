import { Container, Layout } from '@wings-software/uikit'
import React, { useState } from 'react'
import { Sidebar, isRouteActive } from 'framework/exports'
import OrgSelector from 'modules/common/components/OrgSelector/OrgSelector'
import { routeGitSync, routeGovernance, routeOrganizations, routeResources } from '../routes'
import i18n from './MenuAccount.i18n'

export const MenuAccount: React.FC = () => {
  const [displayAdmin, setDisplayAdmin] = useState<boolean>(
    isRouteActive(routeResources, false) || isRouteActive(routeGovernance) || isRouteActive(routeGitSync)
  )
  return (
    <Layout.Vertical spacing="medium">
      <Sidebar.Title upperText={i18n.account} lowerText={i18n.settings} />
      <Container style={{ marginTop: '25px' }}>
        <Layout.Vertical>
          <Sidebar.Button
            label={i18n.admin}
            icon="nav-settings"
            selected={isRouteActive(routeResources) || isRouteActive(routeGovernance) || isRouteActive(routeGitSync)}
            onClick={() => {
              setDisplayAdmin(!displayAdmin)
            }}
          />
          {displayAdmin ? (
            <Layout.Vertical style={{ marginLeft: 'var(--spacing-xlarge)' }}>
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
                selected={isRouteActive(routeResources)}
              />
              <Sidebar.Link
                href={routeGitSync.url()}
                label={i18n.gitSync}
                icon="nav-git-sync"
                selected={isRouteActive(routeGitSync)}
              />
            </Layout.Vertical>
          ) : null}
          <Sidebar.Link
            href={routeOrganizations.url()}
            label={i18n.organizations}
            icon="nav-organization-hover"
            selected={isRouteActive(routeOrganizations)}
          />
          <OrgSelector />
        </Layout.Vertical>
      </Container>
    </Layout.Vertical>
  )
}
