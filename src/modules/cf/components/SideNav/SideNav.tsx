import React from 'react'
import { useParams, useHistory, useRouteMatch } from 'react-router-dom'
import { Layout } from '@wings-software/uikit'
import { compile } from 'path-to-regexp'

import routes from '@common/RouteDefinitions'
import { ProjectSelector } from '@common/navigation/ProjectSelector/ProjectSelector'
import type { AccountPathProps, ProjectPathProps } from '@common/interfaces/RouteInterfaces'
import { SidebarLink } from '@common/navigation/SideNav/SideNav'
import { AdminSelector, AdminSelectorLink } from '@common/navigation/AdminSelector/AdminSelector'
import { ModuleName } from 'framework/types/ModuleName'

export default function CDSideNav(): React.ReactElement {
  const { accountId, projectIdentifier, orgIdentifier } = useParams<AccountPathProps & Partial<ProjectPathProps>>()
  const routeMatch = useRouteMatch()
  const history = useHistory()

  return (
    <Layout.Vertical spacing="small">
      <SidebarLink label="Dashboard" to={routes.toCFHome({ accountId })} />
      <ProjectSelector
        moduleFilter={ModuleName.CF}
        onSelect={data => {
          if (projectIdentifier) {
            // changing project
            history.push(compile(routeMatch.path)({ ...routeMatch.params, projectIdentifier: data.identifier }))
          } else {
            history.push(
              routes.toCFDashboard({
                projectIdentifier: data.identifier,
                orgIdentifier: data.orgIdentifier || '',
                accountId
              })
            )
          }
        }}
      />
      {projectIdentifier && orgIdentifier ? (
        <React.Fragment>
          <SidebarLink label="Overview" to={routes.toCFDashboard({ accountId, projectIdentifier, orgIdentifier })} />
          <SidebarLink
            label="Feature Flags"
            to={routes.toCFFeatureFlags({ accountId, projectIdentifier, orgIdentifier })}
          />
          <SidebarLink label="Targets" to={routes.toCFTargets({ accountId, projectIdentifier, orgIdentifier })} />
          <AdminSelector path={routes.toCFAdmin({ accountId })}>
            <AdminSelectorLink
              label="Resources"
              iconName="main-scope"
              to={routes.toCFAdminResources({
                projectIdentifier,
                orgIdentifier,
                accountId
              })}
            />
            <AdminSelectorLink label="Template Library" iconName="grid" to="" disabled />
            <AdminSelectorLink label="Git Sync" iconName="git-repo" to="" disabled />
            <AdminSelectorLink label="Governance" iconName="shield" to="" disabled />
            <AdminSelectorLink label="Access Control" iconName="user" to="" disabled />
            <AdminSelectorLink label="General Settings" iconName="settings" to="" disabled />
          </AdminSelector>
        </React.Fragment>
      ) : null}
    </Layout.Vertical>
  )
}
