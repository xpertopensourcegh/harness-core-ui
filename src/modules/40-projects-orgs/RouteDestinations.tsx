import React from 'react'
import { Route } from 'react-router-dom'

import { RouteWithLayout } from '@common/router'
import routes from '@common/RouteDefinitions'
import { accountPathProps, orgPathProps, projectPathProps } from '@common/utils/routeUtils'
import { MinimalLayout } from '@common/layouts'

import ProjectsPage from '@projects-orgs/pages/projects/ProjectsPage'
import GetStartedProject from '@projects-orgs/pages/projects/views/GetStartedProject/GetStartedProject'

import ProjectDetails from '@projects-orgs/pages/projects/views/ProjectDetails/ProjectDetails'
import OrganizationsPage from '@projects-orgs/pages/organizations/OrganizationsPage'
import OrganizationDetailsPage from '@projects-orgs/pages/organizations/OrganizationDetails/OrganizationDetailsPage'
import SidebarProvider from '@common/navigation/SidebarProvider'
import AccountSettingsSideNav from '@common/navigation/AccountSettingsSideNav/AccountSettingsSideNav'

export default (
  <SidebarProvider navComponent={AccountSettingsSideNav} subtitle="ACCOUNT" title="Settings">
    <Route path="/">
      <RouteWithLayout layout={MinimalLayout} path={routes.toProjects({ ...accountPathProps })} exact>
        <ProjectsPage />
      </RouteWithLayout>
      <RouteWithLayout layout={MinimalLayout} path={routes.toProjectsGetStarted({ ...accountPathProps })} exact>
        <GetStartedProject />
      </RouteWithLayout>
      <RouteWithLayout
        layout={MinimalLayout}
        path={routes.toProjectDetails({ ...accountPathProps, ...projectPathProps })}
        exact
      >
        <ProjectDetails />
      </RouteWithLayout>
      <RouteWithLayout path={routes.toOrganizations({ ...accountPathProps })} exact>
        <OrganizationsPage />
      </RouteWithLayout>
      <RouteWithLayout path={routes.toOrganizationDetails({ ...accountPathProps, ...orgPathProps })} exact>
        <OrganizationDetailsPage />
      </RouteWithLayout>
    </Route>
  </SidebarProvider>
)
