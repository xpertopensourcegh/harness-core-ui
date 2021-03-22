import React from 'react'
import { Route, Redirect, useParams } from 'react-router-dom'

import { RouteWithLayout } from '@common/router'
import routes from '@common/RouteDefinitions'
import { accountPathProps, orgPathProps, withAccountId } from '@common/utils/routeUtils'

import AdminPage from '@common/pages/AccountSettings/AdminPage'
import GovernancePage from '@common/pages/governance/GovernancePage'
import AccountSettingsSideNav from '@common/navigation/AccountSettingsSideNav/AccountSettingsSideNav'
import UserProfile from '@common/navigation/UserProfile/UserProfile'
import type { SidebarContext } from './navigation/SidebarProvider'
import type { AccountPathProps } from './interfaces/RouteInterfaces'
import GenericErrorPage from './pages/GenericError/GenericErrorPage'
import UserProfilePage from './pages/UserProfile/UserProfilePage'
import UserPreferencesPage from './pages/UserPreferences/UserPreferences'

const RedirectToProjects = (): React.ReactElement => {
  const { accountId } = useParams<AccountPathProps>()
  return <Redirect to={routes.toProjects({ accountId })} />
}

const RedirectToResourcesHome = (): React.ReactElement => {
  const params = useParams<AccountPathProps>()
  return <Redirect to={routes.toResourcesConnectors(params)} />
}

const RedirectToUserHome = (): React.ReactElement => {
  const params = useParams<AccountPathProps>()
  return <Redirect to={routes.toUserProfile(params)} />
}

const AccountSettingsSideNavProps: SidebarContext = {
  navComponent: AccountSettingsSideNav,
  subtitle: 'ACCOUNT',
  title: 'Settings',
  icon: 'nav-settings'
}

const UserProfileSideNavProps: SidebarContext = {
  navComponent: UserProfile,
  icon: 'nav-settings'
}

const justAccountPath = withAccountId(() => '/')

export default (
  <>
    <Route exact path={justAccountPath({ ...accountPathProps })}>
      <RedirectToProjects />
    </Route>
    <Route exact path={routes.toResources({ ...accountPathProps })}>
      <RedirectToResourcesHome />
    </Route>
    <RouteWithLayout sidebarProps={AccountSettingsSideNavProps} path={routes.toAdmin({ ...accountPathProps })} exact>
      <AdminPage />
    </RouteWithLayout>
    <RouteWithLayout sidebarProps={UserProfileSideNavProps} path={routes.toUser({ ...accountPathProps })} exact>
      <RedirectToUserHome />
    </RouteWithLayout>
    <RouteWithLayout sidebarProps={UserProfileSideNavProps} path={routes.toUserProfile({ ...accountPathProps })} exact>
      <UserProfilePage />
    </RouteWithLayout>
    <RouteWithLayout
      sidebarProps={UserProfileSideNavProps}
      path={routes.toUserPreferences({ ...accountPathProps })}
      exact
    >
      <UserPreferencesPage />
    </RouteWithLayout>
    <RouteWithLayout
      sidebarProps={AccountSettingsSideNavProps}
      path={[
        routes.toGovernance({ ...accountPathProps }),
        routes.toOrgGovernance({ ...accountPathProps, ...orgPathProps })
      ]}
      exact
    >
      <GovernancePage />
    </RouteWithLayout>
    <Route path={routes.toGenericError({ ...accountPathProps })}>
      <GenericErrorPage />
    </Route>
  </>
)
