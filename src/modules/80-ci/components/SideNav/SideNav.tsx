import React from 'react'
import { useParams, useHistory, useRouteMatch } from 'react-router-dom'
import { Layout } from '@wings-software/uicore'
import { compile } from 'path-to-regexp'

import routes from '@common/RouteDefinitions'
import { ProjectSelector } from '@common/navigation/ProjectSelector/ProjectSelector'
import type { ProjectPathProps } from '@common/interfaces/RouteInterfaces'
import { SidebarLink } from '@common/navigation/SideNav/SideNav'
import { AdminSelector, AdminSelectorLink } from '@common/navigation/AdminSelector/AdminSelector'
import { ModuleName } from 'framework/types/ModuleName'
import { useAppStore } from 'framework/exports'

export default function CDSideNav(): React.ReactElement {
  const params = useParams<ProjectPathProps>()
  const { accountId, projectIdentifier, orgIdentifier } = params
  const routeMatch = useRouteMatch()
  const history = useHistory()
  const module = 'ci'
  const { updateAppStore } = useAppStore()

  return (
    <Layout.Vertical spacing="small">
      <SidebarLink label="Dashboard" to={routes.toCIHome({ accountId })} />
      <ProjectSelector
        moduleFilter={ModuleName.CI}
        onSelect={data => {
          updateAppStore({ selectedProject: data })
          if (projectIdentifier) {
            // changing project
            history.push(
              compile(routeMatch.path)({
                ...routeMatch.params,
                projectIdentifier: data.identifier,
                orgIdentifier: data.orgIdentifier
              })
            )
          } else {
            history.push(
              routes.toCIProjectOverview({
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
          <SidebarLink label="Overview" to={routes.toCIProjectOverview(params)} />
          <SidebarLink label="Builds" to={routes.toDeployments({ ...params, module })} />
          <SidebarLink label="Pipelines" to={routes.toPipelines({ ...params, module })} />
          <AdminSelector path={routes.toCIAdmin(params)}>
            <AdminSelectorLink label="Resources" iconName="main-scope" to={routes.toCIAdminResources(params)} />
            {/* <AdminSelectorLink label="Template Library" iconName="grid" to="" disabled /> */}
            {/* <AdminSelectorLink label="Git Sync" iconName="git-repo" to="" disabled />
            <AdminSelectorLink label="Governance" iconName="shield" to="" disabled />
            <AdminSelectorLink label="Access Control" iconName="user" to="" disabled />
            <AdminSelectorLink label="General Settings" iconName="settings" to="" disabled /> */}
          </AdminSelector>
        </React.Fragment>
      ) : null}
    </Layout.Vertical>
  )
}
