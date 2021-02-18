import React from 'react'
import { useParams, useHistory, useRouteMatch } from 'react-router-dom'
import { Layout } from '@wings-software/uicore'
import { compile } from 'path-to-regexp'

import routes from '@common/RouteDefinitions'
import { ProjectSelector } from '@common/navigation/ProjectSelector/ProjectSelector'
import type { PipelinePathProps } from '@common/interfaces/RouteInterfaces'
import { SidebarLink } from '@common/navigation/SideNav/SideNav'
import { AdminSelector, AdminSelectorLink } from '@common/navigation/AdminSelector/AdminSelector'
import { ModuleName } from 'framework/types/ModuleName'
import { useAppStore } from 'framework/exports'

export default function CFSideNav(): React.ReactElement {
  const params = useParams<PipelinePathProps>()
  const { accountId, projectIdentifier, orgIdentifier, pipelineIdentifier } = params
  const routeMatch = useRouteMatch()
  const history = useHistory()
  const { updateAppStore } = useAppStore()
  return (
    <Layout.Vertical spacing="small">
      {/* <SidebarLink label="Dashboard" to={routes.toCFHome({ accountId })} /> */}
      <ProjectSelector
        moduleFilter={ModuleName.CF}
        onSelect={data => {
          updateAppStore({ selectedProject: data })
          // if a user is on a pipeline related page, redirect them to project dashboard
          if (projectIdentifier && !pipelineIdentifier) {
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
              routes.toCFFeatureFlags({
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
          {/* <SidebarLink label="Overview" to={routes.toCFProjectOverview(params)} /> */}
          <SidebarLink label="Feature Flags" to={routes.toCFFeatureFlags(params)} />
          <SidebarLink label="Targets" to={routes.toCFTargets(params)} />
          <SidebarLink label="Environments" to={routes.toCFEnvironments(params)} />
          <AdminSelector path={routes.toCFAdmin(params)}>
            <AdminSelectorLink label="Resources" iconName="main-scope" to={routes.toCFAdminResources(params)} />
            {/* <AdminSelectorLink label="Template Library" iconName="grid" to="" disabled />
            <AdminSelectorLink label="Git Sync" iconName="git-repo" to="" disabled />
            <AdminSelectorLink label="Governance" iconName="shield" to="" disabled />
            <AdminSelectorLink label="Access Control" iconName="user" to="" disabled />
            <AdminSelectorLink label="General Settings" iconName="settings" to="" disabled /> */}
          </AdminSelector>
        </React.Fragment>
      ) : null}
    </Layout.Vertical>
  )
}
