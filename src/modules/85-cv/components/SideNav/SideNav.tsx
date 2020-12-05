import React from 'react'
import { useParams, useHistory, useRouteMatch } from 'react-router-dom'
import { Layout } from '@wings-software/uikit'
import { compile } from 'path-to-regexp'

import routes from '@common/RouteDefinitions'
import { ProjectSelector } from '@common/navigation/ProjectSelector/ProjectSelector'
import type { AccountPathProps, ProjectPathProps } from '@common/interfaces/RouteInterfaces'
import { SidebarLink } from '@common/navigation/SideNav/SideNav'
import { AdminSelector, AdminSelectorLink } from '@common/navigation/AdminSelector/AdminSelector'
import { useStrings } from 'framework/exports'

export default function CISideNav(): React.ReactElement {
  const { accountId, projectIdentifier, orgIdentifier } = useParams<AccountPathProps & Partial<ProjectPathProps>>()
  const routeMatch = useRouteMatch()
  const { getString } = useStrings()
  const history = useHistory()

  return (
    <Layout.Vertical spacing="small">
      <SidebarLink label="Dashboard" to={routes.toCVHome({ accountId })} />
      <ProjectSelector
        onSelect={data => {
          if (projectIdentifier) {
            // changing project
            history.push(compile(routeMatch.path)({ ...routeMatch.params, projectIdentifier: data.identifier }))
          } else {
            history.push(
              routes.toCVMainDashBoardPage({
                projectIdentifier: data.identifier,
                orgIdentifier: data.orgIdentifier,
                accountId
              })
            )
          }
        }}
      />
      {projectIdentifier && orgIdentifier ? (
        <React.Fragment>
          <SidebarLink
            label="Overview"
            to={routes.toCVMainDashBoardPage({ accountId, projectIdentifier, orgIdentifier })}
          />
          <SidebarLink
            label="Data Sources"
            to={routes.toCVDataSources({ accountId, projectIdentifier, orgIdentifier })}
          />
          <SidebarLink label="Activities" to={routes.toCVActivities({ accountId, projectIdentifier, orgIdentifier })} />
          <SidebarLink label="Services" to={routes.toCVServices({ accountId, projectIdentifier, orgIdentifier })} />
          <SidebarLink
            label="Metric Packs"
            to={routes.toCVMetricPackConfigureThresholdPage({ accountId, projectIdentifier, orgIdentifier })}
          />
          <AdminSelector path={routes.toCVAdmin({ accountId })}>
            <AdminSelectorLink
              label="Setup"
              iconName="resources-icon"
              to={routes.toCVAdminSetup({
                projectIdentifier,
                orgIdentifier,
                accountId
              })}
            />
            <AdminSelectorLink
              label="Notifications"
              iconName="main-notifications"
              to={routes.toCVAdminNotifications({
                projectIdentifier,
                orgIdentifier,
                accountId
              })}
            />
            <AdminSelectorLink
              label={getString('adminSideNavLinks.resources')}
              iconName="main-scope"
              to={routes.toCVAdminResources({
                projectIdentifier,
                orgIdentifier,
                accountId
              })}
            />
            <AdminSelectorLink label={getString('adminSideNavLinks.templateLibrary')} iconName="grid" to="" disabled />
            <AdminSelectorLink label={getString('adminSideNavLinks.gitSync')} iconName="git-repo" to="" disabled />
            <AdminSelectorLink label={getString('adminSideNavLinks.governance')} iconName="shield" to="" disabled />
            <AdminSelectorLink label={getString('adminSideNavLinks.accessControl')} iconName="user" to="" disabled />
            <AdminSelectorLink
              label={getString('adminSideNavLinks.generalSettings')}
              iconName="settings"
              to=""
              disabled
            />
            <AdminSelectorLink
              label={getString('cv.navLinks.adminSideNavLinks.setup')}
              iconName="square"
              to={routes.toCVAdminSetup({ projectIdentifier, orgIdentifier, accountId })}
            />
            <AdminSelectorLink
              label={getString('cv.navLinks.adminSideNavLinks.activitySources')}
              iconName="square"
              to={routes.toCVAdminActivitySources({ projectIdentifier, orgIdentifier, accountId })}
            />
          </AdminSelector>
        </React.Fragment>
      ) : null}
    </Layout.Vertical>
  )
}
