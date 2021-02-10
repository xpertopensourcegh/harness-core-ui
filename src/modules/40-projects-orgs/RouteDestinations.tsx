import React from 'react'

import { RouteWithLayout } from '@common/router'
import routes from '@common/RouteDefinitions'
import { accountPathProps, orgPathProps, projectPathProps } from '@common/utils/routeUtils'
import { MinimalLayout } from '@common/layouts'

import ProjectsPage from '@projects-orgs/pages/projects/ProjectsPage'
import GetStartedProject from '@projects-orgs/pages/projects/views/GetStartedProject/GetStartedProject'

import ProjectDetails from '@projects-orgs/pages/projects/views/ProjectDetails/ProjectDetails'
import OrganizationsPage from '@projects-orgs/pages/organizations/OrganizationsPage'
import OrganizationDetailsPage from '@projects-orgs/pages/organizations/OrganizationDetails/OrganizationDetailsPage'
import type { SidebarContext } from '@common/navigation/SidebarProvider'
import AccountSettingsSideNav from '@common/navigation/AccountSettingsSideNav/AccountSettingsSideNav'
import RbacFactory, { ResourceType } from '@rbac/factories/RbacFactory'
import AddProjectResourceModalBody from '@projects-orgs/components/AddProjectResourceModalBody/AddProjectResourceModalBody'

const AccountSettingsSideNavProps: SidebarContext = {
  navComponent: AccountSettingsSideNav,
  subtitle: 'ACCOUNT',
  title: 'Settings'
}

RbacFactory.registerResourceTypeHandler(ResourceType.Project, {
  icon: 'nav-project',
  label: 'Projects',
  addResourceModalBody: <AddProjectResourceModalBody />
})

export default (
  <>
    <RouteWithLayout
      sidebarProps={AccountSettingsSideNavProps}
      layout={MinimalLayout}
      path={routes.toProjects({ ...accountPathProps })}
      exact
    >
      <ProjectsPage />
    </RouteWithLayout>
    <RouteWithLayout
      sidebarProps={AccountSettingsSideNavProps}
      layout={MinimalLayout}
      path={routes.toProjectsGetStarted({ ...accountPathProps })}
      exact
    >
      <GetStartedProject />
    </RouteWithLayout>
    <RouteWithLayout
      sidebarProps={AccountSettingsSideNavProps}
      layout={MinimalLayout}
      path={routes.toProjectDetails({ ...accountPathProps, ...projectPathProps })}
      exact
    >
      <ProjectDetails />
    </RouteWithLayout>
    <RouteWithLayout
      sidebarProps={AccountSettingsSideNavProps}
      path={routes.toOrganizations({ ...accountPathProps })}
      exact
    >
      <OrganizationsPage />
    </RouteWithLayout>
    <RouteWithLayout
      sidebarProps={AccountSettingsSideNavProps}
      path={routes.toOrganizationDetails({ ...accountPathProps, ...orgPathProps })}
      exact
    >
      <OrganizationDetailsPage />
    </RouteWithLayout>
  </>
)
